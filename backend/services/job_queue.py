"""
Job Queue - Achtergrond verwerking van boeken en illustraties
"""
import asyncio
import logging
import os
from datetime import datetime
from typing import Optional, Dict, Any, List
from collections import deque

from backend.models.database import (
    BookStatus, IllustrationStatus, SessionLocal
)
from backend.services.book_service import BookService
from backend.services.ai_service import AIService
from backend.services.story_service import StoryService
from backend.services.email_service import email_service
from backend.config.peecho_formats import (
    calculate_stories_required,
    EXTRA_BOOK_PAGES
)

logger = logging.getLogger(__name__)


class JobQueue:
    """
    Simpele in-memory job queue voor het verwerken van boeken.

    Jobs worden achtergrond verwerkt zodat de gebruiker niet hoeft te wachten.
    """

    def __init__(self):
        self.queue: deque = deque()
        self.processing: Dict[str, Any] = {}  # book_id -> job info
        self.ai_service = AIService(use_vertex=True)
        self.story_service = StoryService()
        self._worker_task: Optional[asyncio.Task] = None
        self._running = False

    def start(self):
        """Start de background worker"""
        if not self._running:
            self._running = True
            self._worker_task = asyncio.create_task(self._worker_loop())
            logger.info("Job queue worker started")

    def stop(self):
        """Stop de background worker"""
        self._running = False
        if self._worker_task:
            self._worker_task.cancel()
            logger.info("Job queue worker stopped")

    async def add_book_job(self, book_id: str):
        """Voeg een boek toe aan de wachtrij voor verwerking"""
        job = {
            "book_id": book_id,
            "created_at": datetime.utcnow(),
            "type": "generate_book"
        }
        self.queue.append(job)
        logger.info(f"Added book {book_id} to queue. Queue size: {len(self.queue)}")

        # Send queued notification email
        await self._send_queued_email(book_id)

    def get_queue_position(self, book_id: str) -> int:
        """Geeft de positie in de wachtrij (0 = wordt verwerkt, -1 = niet in queue)"""
        if book_id in self.processing:
            return 0

        for i, job in enumerate(self.queue):
            if job["book_id"] == book_id:
                return i + 1

        return -1

    def get_queue_status(self) -> dict:
        """Geeft overzicht van de queue status"""
        return {
            "queue_length": len(self.queue),
            "processing": list(self.processing.keys()),
            "jobs_in_queue": [j["book_id"] for j in self.queue]
        }

    def is_busy(self) -> bool:
        """Check of er een boek wordt verwerkt of in de queue staat"""
        return bool(self.processing) or bool(self.queue)

    def can_accept_new_book(self) -> tuple[bool, str]:
        """
        Check of een nieuw boek kan worden geaccepteerd.

        Returns:
            (can_accept, message) - True als het kan, anders False met uitleg
        """
        if self.processing:
            book_id = list(self.processing.keys())[0]
            return False, f"Er wordt momenteel een boek gegenereerd. Wacht tot dit klaar is voordat je een nieuw boek maakt."

        if self.queue:
            return False, f"Er staan nog {len(self.queue)} boek(en) in de wachtrij. Wacht tot deze klaar zijn."

        return True, "Klaar om een nieuw boek te maken"

    def get_estimated_wait_time(self) -> int:
        """
        Schat de wachttijd in minuten.

        Gemiddeld ~9 illustraties per boek, ~1 minuut per illustratie.
        """
        books_ahead = len(self.processing) + len(self.queue)
        # ~9 illustraties per boek (toddler), ~1 min per illustratie + 1 min voor verhaal
        minutes_per_book = 10
        return books_ahead * minutes_per_book

    async def _worker_loop(self):
        """Main worker loop die jobs verwerkt"""
        while self._running:
            try:
                if self.queue:
                    job = self.queue.popleft()
                    book_id = job["book_id"]
                    self.processing[book_id] = job

                    try:
                        await self._process_book(book_id)
                    except Exception as e:
                        logger.error(f"Error processing book {book_id}: {e}")
                        await self._mark_book_failed(book_id, str(e))
                    finally:
                        del self.processing[book_id]
                else:
                    # Wacht even als er geen jobs zijn
                    await asyncio.sleep(1)

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Worker loop error: {e}")
                await asyncio.sleep(5)

    async def _process_book(self, book_id: str):
        """Verwerk een compleet boek"""
        db = SessionLocal()
        try:
            book_service = BookService(db)
            book = book_service.get_book(book_id)

            if not book:
                logger.error(f"Book {book_id} not found")
                return

            logger.info(f"Processing book {book_id}: {book.child_name}'s book")

            # Stap 1: Genereer verhaal als dat nog niet is gebeurd
            if not book.story_data:
                await self._generate_story(book_id, book_service, book)

            # Refresh book data
            book = book_service.get_book(book_id)

            # Stap 2: Genereer illustraties
            await self._generate_illustrations(book_id, book_service, book)

            # Stap 3: Markeer als compleet
            book_service.update_book_status(
                book_id,
                BookStatus.COMPLETED,
                message="Boek is klaar!",
                progress=100
            )
            logger.info(f"Book {book_id} completed successfully")

            # Stap 4: Stuur email notificatie
            await self._send_completion_email(book_id, book_service, book)

        finally:
            db.close()

    async def _generate_story(self, book_id: str, book_service: BookService, book):
        """Genereer het verhaal voor een boek (of meerdere verhalen indien nodig)"""
        book_service.update_book_status(
            book_id,
            BookStatus.GENERATING_STORY,
            message="Verhaal wordt geschreven...",
            progress=10
        )

        # Bepaal exacte leeftijd (fallback naar midden van categorie)
        exact_age = book.age
        if exact_age is None:
            # Parse age_category like "2-3" -> 3, "4-5" -> 5, "6-8" -> 7
            if book.age_category == "2-3":
                exact_age = 3
            elif book.age_category == "4-5":
                exact_age = 5
            else:
                exact_age = 7

        # Bepaal hoeveel verhalen nodig zijn om Peecho minimum te halen
        min_pages = 24  # hardcover minimum
        calc = calculate_stories_required(exact_age, min_pages)
        stories_required = calc["stories_required"]

        logger.info(f"Book {book_id}: age={exact_age}, stories_required={stories_required}")

        # Haal thema's op (kunnen meerdere zijn als frontend ze heeft ingesteld)
        themes = None
        if book.family_members and isinstance(book.family_members, dict):
            themes = book.family_members.get("themes")

        if stories_required > 1:
            # Genereer meerdere verhalen
            book_service.update_book_status(
                book_id,
                BookStatus.GENERATING_STORY,
                message=f"Verhalen worden geschreven ({stories_required} verhalen)...",
                progress=10
            )

            story_data = await self.story_service.generate_multiple_stories(
                count=stories_required,
                child_name=book.child_name,
                toy_name=book.toy_name,
                age=exact_age,
                toy_description=book.toy_description or "",
                themes=themes,
                child_nickname=book.child_nickname,
                toy_personality=book.toy_personality,
                family_members=book.family_members.get("members") if isinstance(book.family_members, dict) else book.family_members,
                location_type=book.location_type,
                theme_context=book.theme_context,
                book_length=book.book_length
            )

            # Bundel verhalen: alle pagina's samenvoegen
            all_pages = []
            page_num = 1
            for story in story_data.get("stories", []):
                for page in story.get("pages", []):
                    page["page_number"] = page_num
                    page["story_number"] = story.get("story_number", 1)
                    all_pages.append(page)
                    page_num += 1

            # Gebruik bundel titel, maar sla eerste verhaal titel ook op voor cover
            story = {
                "title": story_data.get("bundle_title", story_data["stories"][0]["title"]),
                "pages": all_pages,
                "stories": story_data.get("stories", []),
                "story_count": stories_required,
                "themes_used": story_data.get("themes_used", [])
            }
        else:
            # Genereer enkel verhaal met exacte leeftijd
            story = await self.story_service.generate_story(
                child_name=book.child_name,
                toy_name=book.toy_name,
                age_category=book.age_category,
                theme=book.theme,
                toy_description=book.toy_description or "",
                child_nickname=book.child_nickname,
                toy_personality=book.toy_personality,
                family_members=book.family_members.get("members") if isinstance(book.family_members, dict) else book.family_members,
                location_type=book.location_type,
                theme_context=book.theme_context,
                book_length=book.book_length,
                exact_age=exact_age
            )
            story["story_count"] = 1

        # Sla verhaal op
        book_service.update_book(book_id, story_data=story)

        # Maak illustratie records aan voor elke pagina
        pages = story.get("pages", [])
        for i, page in enumerate(pages):
            book_service.create_illustration(
                book_id=book_id,
                page_number=i + 1,
                scene_description=page.get("scene", page.get("text", ""))
            )

        logger.info(f"Story generated for book {book_id} with {len(pages)} pages, {story.get('story_count', 1)} stories")

    async def _generate_illustrations(self, book_id: str, book_service: BookService, book):
        """Genereer alle illustraties voor een boek"""
        book_service.update_book_status(
            book_id,
            BookStatus.GENERATING_IMAGES,
            message="Illustraties worden gemaakt...",
            progress=20
        )

        illustrations = book_service.get_book_illustrations(book_id)
        total = len(illustrations)

        # Decode reference image if available
        import base64
        reference_bytes = None
        if book.toy_image_base64:
            try:
                if book.toy_image_base64.startswith('data:'):
                    base64_data = book.toy_image_base64.split(',', 1)[1]
                else:
                    base64_data = book.toy_image_base64
                reference_bytes = base64.b64decode(base64_data)
            except Exception as e:
                logger.warning(f"Could not decode reference image: {e}")

        # Build style prompt
        from backend.models import get_style_prompt, RealismLevel, IllustrationStyle
        try:
            realism = RealismLevel(book.realism_level)
            style = IllustrationStyle(book.illustration_style)
            style_prompt = get_style_prompt(realism, style)
        except ValueError:
            style_prompt = "warm watercolor, children's book illustration"

        for i, illustration in enumerate(illustrations):
            if illustration.status == IllustrationStatus.COMPLETED:
                continue

            try:
                # Update status
                book_service.update_illustration(
                    illustration.id,
                    IllustrationStatus.GENERATING
                )

                # Calculate progress (20% story + 80% illustrations)
                progress = 20 + int((i / total) * 80)
                book_service.update_book_status(
                    book_id,
                    BookStatus.GENERATING_IMAGES,
                    message=f"Illustratie {i + 1} van {total}...",
                    progress=progress
                )

                # Generate the illustration
                result = await self.ai_service.generate_illustration(
                    toy_description=book.toy_description or book.toy_name,
                    scene=illustration.scene_description,
                    style=style_prompt,
                    reference_image=reference_bytes,
                    child_description=book.child_description
                )

                # Save result
                book_service.update_illustration(
                    illustration.id,
                    IllustrationStatus.COMPLETED,
                    image_base64=result["image_url"],
                    model_used=result["model_used"]
                )

                logger.info(f"Generated illustration {i + 1}/{total} for book {book_id}")

                # Small delay to avoid rate limiting
                await asyncio.sleep(1)

            except Exception as e:
                logger.error(f"Failed to generate illustration {i + 1}: {e}")
                book_service.update_illustration(
                    illustration.id,
                    IllustrationStatus.FAILED,
                    error_message=str(e)
                )

    async def _mark_book_failed(self, book_id: str, error: str):
        """Markeer een boek als mislukt"""
        db = SessionLocal()
        try:
            book_service = BookService(db)
            book_service.update_book_status(
                book_id,
                BookStatus.FAILED,
                message=f"Er is iets misgegaan: {error}",
                progress=0
            )
        finally:
            db.close()

    async def _send_completion_email(self, book_id: str, book_service: BookService, book):
        """Stuur email notificatie wanneer boek klaar is"""
        try:
            # Get user email
            user = book_service.get_user_by_email(book.user.email) if book.user else None
            if not user:
                logger.warning(f"No user found for book {book_id}, skipping email")
                return

            # Check if user wants notifications
            if hasattr(user, 'notify_on_completion') and user.notify_on_completion == "false":
                logger.info(f"User {user.email} has disabled notifications, skipping email")
                return

            # Get base URL from environment or use default
            base_url = os.getenv("BASE_URL", "http://localhost:8000")

            # Get book title
            book_title = "Onbekende titel"
            if book.story_data:
                book_title = book.story_data.get("title", f"Het avontuur van {book.toy_name}")

            # Send email
            success = email_service.send_book_completed_notification(
                to_email=user.email,
                child_name=book.child_name,
                book_title=book_title,
                book_id=book_id,
                base_url=base_url
            )

            if success:
                logger.info(f"Completion email sent to {user.email} for book {book_id}")
            else:
                logger.warning(f"Failed to send completion email for book {book_id}")

        except Exception as e:
            # Don't fail the whole process if email fails
            logger.error(f"Error sending completion email for book {book_id}: {e}")

    async def _send_queued_email(self, book_id: str):
        """Stuur email notificatie wanneer boek in de wachtrij komt"""
        db = SessionLocal()
        try:
            book_service = BookService(db)
            book = book_service.get_book(book_id)

            if not book:
                logger.warning(f"Book {book_id} not found, skipping queued email")
                return

            # Get user
            user = book.user
            if not user:
                logger.warning(f"No user found for book {book_id}, skipping queued email")
                return

            # Get queue position and estimated time
            queue_position = self.get_queue_position(book_id)
            estimated_minutes = self.get_estimated_wait_time()

            # Get base URL from environment
            base_url = os.getenv("BASE_URL", "http://localhost:8000")

            # Send email
            success = email_service.send_book_queued_notification(
                to_email=user.email,
                child_name=book.child_name,
                toy_name=book.toy_name,
                queue_position=queue_position,
                estimated_minutes=estimated_minutes,
                base_url=base_url
            )

            if success:
                logger.info(f"Queued email sent to {user.email} for book {book_id}")
            else:
                logger.warning(f"Failed to send queued email for book {book_id}")

        except Exception as e:
            logger.error(f"Error sending queued email for book {book_id}: {e}")
        finally:
            db.close()


# Singleton instance
job_queue = JobQueue()
