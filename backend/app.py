"""
Knuffelboek API - Gepersonaliseerde kinderboeken met AI
"""

# Load environment variables from .env file
import os
from pathlib import Path
from dotenv import load_dotenv

# Get the project root directory (parent of backend)
PROJECT_ROOT = Path(__file__).parent.parent
env_path = PROJECT_ROOT / ".env"
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
import logging

from backend.services.image_service import ImageService
from PIL import Image, ImageDraw, ImageFont
import io
import base64
from backend.services.ai_service import AIService
from backend.services.story_service import StoryService
from backend.services.pdf_service import PDFService
from backend.services.book_service import BookService
from backend.services.job_queue import job_queue
from backend.services.stripe_service import stripe_service
from backend.models.database import (
    init_db, get_db, BookStatus, IllustrationStatus, SessionLocal, Book
)
from backend.models import (
    RealismLevel,
    IllustrationStyle,
    STYLE_OPTIONS_BY_REALISM,
    REALISM_LABELS,
    STYLE_LABELS,
    get_style_prompt,
    validate_style_for_realism,
    get_default_style,
)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# =============================================================================
# IMAGE PREVIEW HELPERS - Watermark and low-res for previews
# =============================================================================

def create_preview_image(image_base64: str, max_size: int = 400) -> str:
    """
    Create a low-resolution preview with watermark overlay.

    Args:
        image_base64: Original image as base64 string
        max_size: Maximum width/height in pixels

    Returns:
        Base64 encoded preview image with watermark
    """
    try:
        # Decode base64 to image
        image_data = base64.b64decode(image_base64)
        img = Image.open(io.BytesIO(image_data))

        # Convert to RGB if necessary (for JPEG output)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')

        # Resize to low resolution
        ratio = min(max_size / img.width, max_size / img.height)
        new_size = (int(img.width * ratio), int(img.height * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)

        # Add watermark overlay
        draw = ImageDraw.Draw(img)

        # Create diagonal watermark text
        watermark_text = "LAGE RESOLUTIE VOORBEELD"

        # Try to use a font, fallback to default
        try:
            font_size = max(20, new_size[0] // 10)
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            font = ImageFont.load_default()
            font_size = 20

        # Get text bounding box
        bbox = draw.textbbox((0, 0), watermark_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        # Draw multiple watermarks diagonally across the image
        for y in range(-text_height, new_size[1] + text_height, text_height * 3):
            for x in range(-text_width, new_size[0] + text_width, text_width + 50):
                # Semi-transparent white text with shadow
                draw.text((x + 2, y + 2), watermark_text, font=font, fill=(0, 0, 0, 40))
                draw.text((x, y), watermark_text, font=font, fill=(255, 255, 255, 80))

        # Save to buffer with reduced quality
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=60)
        buffer.seek(0)

        return base64.b64encode(buffer.read()).decode('utf-8')

    except Exception as e:
        logger.error(f"Error creating preview image: {e}")
        # Return original if processing fails
        return image_base64


# =============================================================================
# AUTHORIZATION HELPERS - Check if user can access full-res content
# =============================================================================

# Admin email that has full access
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "jeroen@crossfitleiden.com")


def is_authorized_for_full_content(book: Book, user_email: Optional[str] = None) -> bool:
    """
    Check if access to full-resolution content is authorized.

    Full access is granted if:
    1. User email is admin email, OR
    2. Book has been paid for (stripe_payment_status == 'paid')

    Args:
        book: The Book object
        user_email: Optional email of the requesting user

    Returns:
        True if full content access is authorized
    """
    # Admin always has access
    if user_email and user_email.lower() == ADMIN_EMAIL.lower():
        return True

    # Paid books have full access
    if book.stripe_payment_status == "paid":
        return True

    return False


# FastAPI app
app = FastAPI(
    title="Knuffelboek API",
    description="Genereer gepersonaliseerde kinderboeken met de knuffel van je kind",
    version="0.1.0"
)

# CORS voor frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Services initialiseren
image_service = ImageService()
# Use Vertex AI Imagen 3 (best quality), falls back to Gemini if quota exceeded
ai_service = AIService(use_vertex=True)
story_service = StoryService()
pdf_service = PDFService()


# === Pydantic Models ===

class ToyAnalysisResponse(BaseModel):
    description: str
    colors: list[str]
    type: str  # "beer", "konijn", "hond", etc.
    unique_features: list[str]


class IllustrationRequest(BaseModel):
    toy_description: str
    scene: str
    style: str = "warm watercolor, children's book illustration"  # Legacy field, kept for backwards compat
    preferred_model: Optional[str] = None  # "vertex" or "gemini" to force specific model
    reference_image: Optional[str] = None  # base64 encoded reference image of the toy
    child_description: Optional[str] = None  # description of the child's appearance for consistency
    # New visual style options
    realism_level: Optional[RealismLevel] = None  # defaults to semi_real if not provided
    illustration_style: Optional[IllustrationStyle] = None  # defaults based on realism_level


class StoryRequest(BaseModel):
    child_name: str
    toy_name: str
    age_category: str = "4-5"  # "2-3", "4-5", "6-8"
    theme: str = "bedtijd_avontuur"
    language: str = "nl"
    toy_description: str = ""
    # Optional fields
    child_pronoun: Optional[str] = None  # "hij", "zij", "hen"
    toy_pronoun: Optional[str] = None  # "hij", "zij", "hen", "het"
    child_nickname: Optional[str] = None
    toy_personality: Optional[str] = None  # "grappig", "dapper", "rustig", etc.
    family_members: Optional[list] = None  # list of {role, name}
    favorites: Optional[list[str]] = None  # max 3 items
    location_type: Optional[str] = None  # "stad", "dorp", "boerderij", "aan_zee"
    location_name: Optional[str] = None
    book_length: Optional[str] = None  # "kort", "normaal", "lang"
    dedication_text: Optional[str] = None
    theme_context: Optional[str] = None  # extra context like "bang in het donker"
    # Legacy support
    child_age: Optional[int] = None


class BookRequest(BaseModel):
    child_name: str
    child_age: int
    toy_name: str
    toy_image_base64: str
    theme: str
    family_members: Optional[list[str]] = None


class CreateBookRequest(BaseModel):
    """Request voor het aanmaken van een nieuw boek met account"""
    email: str
    child_name: str
    toy_name: str
    toy_image_base64: Optional[str] = None
    toy_description: Optional[str] = None
    toy_analysis: Optional[dict] = None
    age_category: str = "4-5"
    age: Optional[int] = None  # Exacte leeftijd (2-8) voor nauwkeurige pagina telling
    theme: str = "bedtijd_avontuur"
    themes: Optional[List[str]] = None  # Thema's per verhaal (als meerdere verhalen nodig zijn)
    theme_context: Optional[str] = None
    child_nickname: Optional[str] = None
    toy_personality: Optional[str] = None
    location_type: Optional[str] = None
    location_name: Optional[str] = None
    book_length: Optional[str] = "normaal"
    dedication_text: Optional[str] = None
    family_members: Optional[list] = None
    realism_level: str = "semi_real"
    illustration_style: str = "watercolor"
    child_description: Optional[str] = None


class BookResponse(BaseModel):
    """Response met boek informatie"""
    id: str
    status: str
    status_message: Optional[str]
    progress: int
    child_name: str
    toy_name: str
    theme: str
    created_at: str
    completed_at: Optional[str]
    # Preview data
    story_title: Optional[str] = None
    page_count: Optional[int] = None
    illustrations_completed: int = 0
    illustrations_total: int = 0
    # Queue info
    queue_position: Optional[int] = None  # 0 = wordt verwerkt, 1+ = wacht in queue, None = niet in queue
    estimated_wait_minutes: Optional[int] = None
    # Order/Payment info
    is_paid: bool = False
    stripe_payment_status: Optional[str] = None
    is_ordered: bool = False
    order_date: Optional[str] = None
    lulu_order_status: Optional[str] = None
    expected_delivery_date: Optional[str] = None
    tracking_url: Optional[str] = None


class UserBooksResponse(BaseModel):
    """Response met alle boeken van een gebruiker"""
    email: str
    books: List[BookResponse]


# === Endpoints ===

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "0.1.0"}


# === Auth Endpoints ===

class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


class AuthResponse(BaseModel):
    success: bool
    message: str
    email: Optional[str] = None
    has_password: bool = False
    needs_password: bool = False


@app.post("/api/auth/check-email")
async def check_email(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Check of een email al bestaat en of er een wachtwoord is ingesteld.
    Gebruik dit om te bepalen of login of register getoond moet worden.
    """
    book_service = BookService(db)
    user = book_service.get_user_by_email(request.email)

    if not user:
        return {
            "exists": False,
            "has_password": False,
            "message": "Nieuw account - registreer met een wachtwoord"
        }

    has_password = user.password_hash is not None
    return {
        "exists": True,
        "has_password": has_password,
        "message": "Log in met je wachtwoord" if has_password else "Account bestaat - stel een wachtwoord in"
    }


@app.post("/api/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Log in met email en wachtwoord.
    """
    book_service = BookService(db)

    # Check if user exists
    user = book_service.get_user_by_email(request.email)
    if not user:
        return AuthResponse(
            success=False,
            message="Geen account gevonden. Maak eerst een account aan.",
            has_password=False
        )

    # Check if user has a password
    if not user.password_hash:
        # Allow login but prompt to set password
        return AuthResponse(
            success=True,
            email=user.email,
            message="Ingelogd. Stel een wachtwoord in voor extra beveiliging.",
            has_password=False,
            needs_password=True
        )

    # Verify password
    user, message = book_service.login_user(request.email, request.password)
    if not user:
        return AuthResponse(
            success=False,
            message=message,
            has_password=True
        )

    return AuthResponse(
        success=True,
        email=user.email,
        message="Succesvol ingelogd!",
        has_password=True
    )


@app.post("/api/auth/register", response_model=AuthResponse)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Registreer een nieuw account of stel wachtwoord in voor bestaand account.
    """
    book_service = BookService(db)

    if len(request.password) < 6:
        return AuthResponse(
            success=False,
            message="Wachtwoord moet minimaal 6 tekens zijn"
        )

    user, message = book_service.register_user(
        email=request.email,
        password=request.password,
        name=request.name
    )

    if not user:
        return AuthResponse(
            success=False,
            message=message
        )

    return AuthResponse(
        success=True,
        email=user.email,
        message=message,
        has_password=True
    )


@app.post("/api/auth/set-password", response_model=AuthResponse)
async def set_password(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Stel een wachtwoord in voor een bestaand account zonder wachtwoord.
    """
    book_service = BookService(db)

    if len(request.password) < 6:
        return AuthResponse(
            success=False,
            message="Wachtwoord moet minimaal 6 tekens zijn"
        )

    success = book_service.set_user_password(request.email, request.password)
    if not success:
        return AuthResponse(
            success=False,
            message="Account niet gevonden"
        )

    return AuthResponse(
        success=True,
        email=request.email,
        message="Wachtwoord ingesteld!",
        has_password=True
    )


@app.get("/api/queue-status")
async def get_queue_status():
    """
    Check de status van de job queue.

    Gebruik dit endpoint om te checken of het systeem klaar is
    om een nieuw boek te accepteren voordat je /api/books aanroept.
    """
    can_accept, message = job_queue.can_accept_new_book()
    return {
        "can_accept_new_book": can_accept,
        "message": message,
        "estimated_wait_minutes": job_queue.get_estimated_wait_time() if not can_accept else 0,
        "queue_status": job_queue.get_queue_status()
    }


@app.get("/style-options")
async def get_style_options():
    """
    Return available visual style options for the frontend.

    Returns:
        - realism_levels: list of {value, label}
        - styles_by_realism: dict mapping realism level to list of {value, label}
        - defaults: {realism_level, style_by_realism}
    """
    return {
        "realism_levels": [
            {"value": level.value, "label": REALISM_LABELS[level]}
            for level in RealismLevel
        ],
        "styles_by_realism": {
            level.value: [
                {"value": style.value, "label": STYLE_LABELS[style]}
                for style in STYLE_OPTIONS_BY_REALISM[level]
            ]
            for level in RealismLevel
        },
        "defaults": {
            "realism_level": RealismLevel.SEMI_REAL.value,
            "style_by_realism": {
                level.value: get_default_style(level).value
                for level in RealismLevel
            }
        }
    }


@app.get("/api/stories-required/{age}")
async def get_stories_required(age: int, cover_type: str = "hardcover"):
    """
    Bereken hoeveel verhalen nodig zijn voor een gegeven leeftijd.

    Args:
        age: Exacte leeftijd (2-8)
        cover_type: "hardcover" (min 24 pag) of "softcover" (min 20 pag)

    Returns:
        {
            "age": int,
            "pages_per_story": int,
            "stories_required": int,
            "story_pages_total": int,
            "extra_pages": int (6 = cover, title, ownership, colophon, back, inside),
            "final_page_count": int
        }
    """
    from backend.config.peecho_formats import calculate_stories_required

    min_pages = 24 if cover_type == "hardcover" else 20

    result = calculate_stories_required(age, min_pages)
    result["age"] = age

    return result


@app.post("/analyze-toy", response_model=ToyAnalysisResponse)
async def analyze_toy(file: UploadFile = File(...)):
    """
    Analyseer een foto van een knuffel.

    1. Verwijdert de achtergrond (optioneel, als Remove.bg geconfigureerd is)
    2. Genereert een gedetailleerde beschrijving via Gemini

    Returns: Beschrijving, kleuren, type en unieke kenmerken
    """
    logger.info(f"Analyzing toy image: {file.filename}")

    # Valideer bestandstype
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Bestand moet een afbeelding zijn")

    # Lees de afbeelding
    image_bytes = await file.read()

    # Stap 1: Achtergrond verwijderen (indien geconfigureerd)
    if image_service.removebg_api_key:
        logger.info("Removing background with Remove.bg...")
        clean_image = await image_service.remove_background(image_bytes)
    else:
        logger.info("Remove.bg niet geconfigureerd, originele afbeelding gebruiken")
        clean_image = image_bytes

    # Stap 2: Analyseer met Gemini
    analysis = await ai_service.analyze_toy(clean_image)

    # Build full description with colors and unique features for consistent illustrations
    full_desc = analysis.get("description", "")
    if analysis.get("colors"):
        full_desc += f" Kleuren: {', '.join(analysis['colors'])}."
    if analysis.get("unique_features"):
        full_desc += f" Unieke kenmerken: {', '.join(analysis['unique_features'])}."
    if analysis.get("type"):
        full_desc += f" Type: {analysis['type']}."
    analysis["full_description"] = full_desc

    return analysis


@app.post("/generate-illustration")
async def generate_illustration(request: IllustrationRequest):
    """
    Genereer een illustratie van de knuffel in een scène.

    Gebruikt de referentie-afbeelding (indien aanwezig) om de knuffel
    consistent te houden terwijl deze in een nieuwe setting wordt geplaatst.

    Returns: {"image_url": str, "model_used": str}
    """
    logger.info(f"Generating illustration - Scene: {request.scene}")
    logger.info(f"Toy description received: {request.toy_description[:150]}..." if len(request.toy_description) > 150 else f"Toy description received: {request.toy_description}")
    if request.preferred_model:
        logger.info(f"Preferred model: {request.preferred_model}")
    if request.reference_image:
        logger.info("Reference image included in request")
    if request.child_description:
        logger.info(f"Child description: {request.child_description}")

    # Decode reference image if provided
    import base64
    reference_bytes = None
    if request.reference_image:
        try:
            # Handle data URL format (data:image/jpeg;base64,...)
            if request.reference_image.startswith('data:'):
                # Extract base64 part after the comma
                base64_data = request.reference_image.split(',', 1)[1]
            else:
                base64_data = request.reference_image
            reference_bytes = base64.b64decode(base64_data)
            logger.info(f"Decoded reference image: {len(reference_bytes)} bytes")
        except Exception as e:
            logger.warning(f"Failed to decode reference image: {e}")

    # Process visual style options with defaults and validation
    realism_level = request.realism_level or RealismLevel.SEMI_REAL
    illustration_style = request.illustration_style

    # If no illustration_style provided, use default for this realism level
    if illustration_style is None:
        illustration_style = get_default_style(realism_level)
    else:
        # Validate that the style is valid for the chosen realism level
        if not validate_style_for_realism(realism_level, illustration_style):
            logger.warning(f"Invalid style {illustration_style} for realism {realism_level}, using default")
            illustration_style = get_default_style(realism_level)

    # Build the style prompt from the visual options
    style_prompt = get_style_prompt(realism_level, illustration_style)
    logger.info(f"Visual style: realism={realism_level.value}, style={illustration_style.value}")
    logger.info(f"Style prompt: {style_prompt}")

    result = await ai_service.generate_illustration(
        toy_description=request.toy_description,
        scene=request.scene,
        style=style_prompt,
        reference_image=reference_bytes,
        preferred_model=request.preferred_model,
        child_description=request.child_description
    )

    logger.info(f"Generated with model: {result['model_used']}")
    return result


@app.post("/generate-story")
async def generate_story(request: StoryRequest):
    """
    Genereer een volledig verhaal voor het kinderboek.

    Het verhaal wordt aangepast aan:
    - Leeftijd van het kind (woordenschat, lengte, complexiteit)
    - Gekozen thema
    - Namen van kind, knuffel en eventuele familieleden
    - Optionele extra velden (persoonlijkheid, locatie, context, etc.)
    """
    logger.info(f"Generating story for {request.child_name}, age_category {request.age_category}")

    story = await story_service.generate_story(
        child_name=request.child_name,
        toy_name=request.toy_name,
        age_category=request.age_category,
        theme=request.theme,
        toy_description=request.toy_description,
        child_nickname=request.child_nickname,
        toy_personality=request.toy_personality,
        family_members=request.family_members,
        location_type=request.location_type,
        theme_context=request.theme_context,
        book_length=request.book_length
    )

    return story


@app.post("/create-book")
async def create_book(request: BookRequest):
    """
    Creëer een compleet boek als PDF.
    
    Dit is de hoofdflow die alles combineert:
    1. Genereer het verhaal
    2. Genereer illustraties voor elke pagina
    3. Combineer in een drukklare PDF
    """
    logger.info(f"Creating complete book for {request.child_name}")
    
    # Dit endpoint orchestreert de volledige flow
    # Implementatie volgt in latere fase
    
    return {
        "status": "processing",
        "message": "Boek wordt gegenereerd. Dit kan enkele minuten duren.",
        "estimated_time_seconds": 120
    }


# === Startup Events ===

@app.on_event("startup")
async def startup_event():
    """Initialiseer services bij opstarten"""
    logger.info("Starting Knuffelboek API...")
    # Initialize database
    init_db()
    logger.info("Database initialized")
    # Start job queue worker
    job_queue.start()
    logger.info("Job queue started")

    # Resume incomplete books
    db = SessionLocal()
    try:
        incomplete_statuses = [
            BookStatus.DRAFT,
            BookStatus.GENERATING_STORY,
            BookStatus.GENERATING_IMAGES,
            BookStatus.PROCESSING
        ]
        incomplete_books = db.query(Book).filter(Book.status.in_(incomplete_statuses)).all()
        for book in incomplete_books:
            logger.info(f"Resuming incomplete book: {book.id} (status: {book.status.value})")
            await job_queue.add_book_job(book.id)
        if incomplete_books:
            logger.info(f"Added {len(incomplete_books)} incomplete books to queue")
    finally:
        db.close()


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup bij afsluiten"""
    job_queue.stop()
    logger.info("Job queue stopped")


# === Book Management Endpoints ===

def _book_to_response(book, book_service: BookService) -> BookResponse:
    """Convert a Book model to BookResponse"""
    illustrations = book_service.get_book_illustrations(book.id)
    completed = sum(1 for i in illustrations if i.status == IllustrationStatus.COMPLETED)

    story_title = None
    page_count = None
    if book.story_data:
        story_title = book.story_data.get("title")
        page_count = len(book.story_data.get("pages", []))

    # Get queue position if book is still processing
    queue_position = None
    estimated_wait = None
    if book.status in [BookStatus.DRAFT, BookStatus.GENERATING_STORY, BookStatus.GENERATING_IMAGES]:
        queue_position = job_queue.get_queue_position(book.id)
        if queue_position > 0:
            # ~10 minuten per boek in de queue
            estimated_wait = queue_position * 10

    return BookResponse(
        id=book.id,
        status=book.status.value,
        status_message=book.status_message,
        progress=book.progress,
        child_name=book.child_name,
        toy_name=book.toy_name,
        theme=book.theme,
        created_at=book.created_at.isoformat(),
        completed_at=book.completed_at.isoformat() if book.completed_at else None,
        story_title=story_title,
        page_count=page_count,
        illustrations_completed=completed,
        illustrations_total=len(illustrations),
        # Queue info
        queue_position=queue_position,
        estimated_wait_minutes=estimated_wait,
        # Payment/Order info
        is_paid=book.stripe_payment_status == "paid",
        stripe_payment_status=book.stripe_payment_status,
        is_ordered=book.lulu_job_id is not None,
        order_date=book.order_date.isoformat() if book.order_date else None,
        lulu_order_status=book.lulu_order_status,
        expected_delivery_date=book.expected_delivery_date.isoformat() if book.expected_delivery_date else None,
        tracking_url=book.tracking_url
    )


@app.post("/api/books", response_model=BookResponse)
async def create_new_book(
    request: CreateBookRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Maak een nieuw boek aan en start de generatie in de achtergrond.

    Het boek wordt opgeslagen onder het opgegeven email adres.
    De gebruiker kan later terugkomen om de status te bekijken.
    Boeken worden in een wachtrij geplaatst en één voor één verwerkt.
    """
    logger.info(f"Creating new book for {request.email}: {request.child_name}'s book")

    book_service = BookService(db)

    # Get or create user
    user = book_service.get_or_create_user(request.email)

    # Create the book - store themes for multiple stories if provided
    book_themes = request.themes if request.themes else [request.theme]

    book = book_service.create_book(
        user_id=user.id,
        child_name=request.child_name,
        toy_name=request.toy_name,
        toy_image_base64=request.toy_image_base64,
        toy_description=request.toy_description,
        toy_analysis=request.toy_analysis,
        age_category=request.age_category,
        age=request.age,  # Exacte leeftijd voor nauwkeurige pagina telling
        theme=request.theme,  # Eerste/hoofd thema
        theme_context=request.theme_context,
        child_nickname=request.child_nickname,
        toy_personality=request.toy_personality,
        location_type=request.location_type,
        location_name=request.location_name,
        book_length=request.book_length,
        dedication_text=request.dedication_text,
        family_members=request.family_members if not request.themes else {"themes": book_themes, "members": request.family_members},
        realism_level=request.realism_level,
        illustration_style=request.illustration_style,
        child_description=request.child_description
    )

    # Add to job queue for background processing
    background_tasks.add_task(job_queue.add_book_job, book.id)

    return _book_to_response(book, book_service)


@app.get("/api/books/{book_id}", response_model=BookResponse)
async def get_book_status(book_id: str, db: Session = Depends(get_db)):
    """
    Haal de status van een specifiek boek op.

    Gebruik dit endpoint om te pollen voor updates tijdens het genereren.
    """
    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    return _book_to_response(book, book_service)


@app.get("/api/books/{book_id}/illustrations")
async def get_book_illustrations(
    book_id: str,
    preview: bool = True,
    email: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Haal alle illustraties van een boek op.

    Args:
        preview: If True (default), return low-res watermarked versions.
                 If False, return full resolution (requires authorization).
        email: Optional email for authorization check (admin or book owner).

    Returns een lijst met illustraties inclusief hun status en (indien beschikbaar) de afbeelding.
    """
    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    illustrations = book_service.get_book_illustrations(book_id)

    # Check authorization for full-res content
    authorized = is_authorized_for_full_content(book, email)

    # Force preview mode if not authorized and user requested full-res
    use_preview = preview or not authorized

    result_illustrations = []
    for i in illustrations:
        # Process image based on preview mode
        image_data = i.image_base64
        if use_preview and image_data:
            # Create low-res watermarked preview
            image_data = create_preview_image(image_data)

        result_illustrations.append({
            "id": i.id,
            "page_number": i.page_number,
            "status": i.status.value,
            "scene_description": i.scene_description,
            "image_base64": image_data,
            "model_used": i.model_used,
            "error_message": i.error_message,
            "is_preview": use_preview
        })

    return {
        "book_id": book_id,
        "preview_mode": use_preview,
        "authorized": authorized,
        "illustrations": result_illustrations
    }


@app.get("/api/books/{book_id}/story")
async def get_book_story(book_id: str, db: Session = Depends(get_db)):
    """
    Haal het verhaal van een boek op.
    """
    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if not book.story_data:
        raise HTTPException(status_code=404, detail="Verhaal nog niet gegenereerd")

    return book.story_data


@app.get("/api/books/{book_id}/structure")
async def get_book_structure(book_id: str, db: Session = Depends(get_db)):
    """
    Genereer de complete boekstructuur (niet-verhaalpagina's).

    Dit omvat:
    - Cover (voor- en achterkant)
    - Title page
    - Eigendomspagina
    - Stories metadata
    - Colofon / laatste pagina

    Alle output is in het Nederlands en volgt de Knuffelboek brand guide.
    """
    from backend.services.book_structure_service import book_structure_service

    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    # Parse age from age_category (e.g., "4-5" -> 4)
    child_age = 4  # default
    if book.age_category:
        try:
            # Take the first number from the age range
            child_age = int(book.age_category.split("-")[0])
        except (ValueError, IndexError):
            child_age = 4

    # Genereer boekstructuur
    structure = book_structure_service.generate_from_story_data(
        child_name=book.child_name,
        child_age=child_age,
        toy_name=book.toy_name,
        toy_description=book.toy_description or "",
        story_data=book.story_data,
        theme=book.theme or ""
    )

    return structure


@app.get("/api/users/{email}/books", response_model=UserBooksResponse)
async def get_user_books(email: str, db: Session = Depends(get_db)):
    """
    Haal alle boeken van een gebruiker op.

    Dit is het "Mijn Boeken" overzicht.
    """
    book_service = BookService(db)
    user = book_service.get_user_by_email(email)

    if not user:
        # Return empty list for new users
        return UserBooksResponse(email=email, books=[])

    books = book_service.get_user_books(user.id)

    return UserBooksResponse(
        email=email,
        books=[_book_to_response(b, book_service) for b in books]
    )


@app.delete("/api/books/{book_id}")
async def delete_book(book_id: str, db: Session = Depends(get_db)):
    """
    Verwijder een boek.
    """
    book_service = BookService(db)
    success = book_service.delete_book(book_id)

    if not success:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    return {"status": "deleted", "book_id": book_id}


@app.get("/api/queue/status")
async def get_queue_status():
    """
    Haal de huidige status van de job queue op.

    Handig voor debugging en monitoring.
    """
    return job_queue.get_queue_status()


@app.get("/api/books/{book_id}/pdf")
async def download_book_pdf(
    book_id: str,
    email: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Download het boek als drukklare PDF.

    Het boek moet status 'completed' hebben en de gebruiker moet geautoriseerd zijn.
    Autorisatie: betaald boek of admin email.
    """
    from fastapi.responses import Response

    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if book.status != BookStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Boek is nog niet klaar")

    # Check authorization for PDF download
    if not is_authorized_for_full_content(book, email):
        raise HTTPException(
            status_code=403,
            detail="PDF download is alleen beschikbaar na betaling. Bestel je boek om de volledige PDF te ontvangen."
        )

    if not book.story_data:
        raise HTTPException(status_code=400, detail="Geen verhaal beschikbaar")

    # Get illustrations as dict (page_number -> base64)
    illustrations_list = book_service.get_book_illustrations(book_id)
    illustrations = {i.page_number: i.image_base64 for i in illustrations_list if i.image_base64}

    # Get stories from story_data (supports multiple stories)
    stories = book.story_data.get("stories", [])

    # Fallback: als er geen 'stories' key is, maak één verhaal van 'pages'
    if not stories and book.story_data.get("pages"):
        stories = [{
            "title": book.story_data.get("title", f"Het avontuur van {book.toy_name}"),
            "pages": book.story_data.get("pages", [])
        }]

    # Use first illustration as cover image (if available)
    cover_illustration = illustrations.get(1)

    # Get age for layout-specific rendering
    age = book.age if book.age else 5  # Default to 5 if no age specified

    # Generate preview PDF with layout-specific rendering based on age
    pdf_bytes = await pdf_service.create_preview_pdf(
        title=book.story_data.get("title", f"Het avontuur van {book.toy_name}"),
        stories=stories,
        child_name=book.child_name,
        illustrations=illustrations,
        cover_illustration_base64=cover_illustration,
        dedication=book.dedication_text,
        format="square",
        age=age
    )

    # Return as downloadable file
    filename = f"knuffelboek-{book.child_name.lower().replace(' ', '-')}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


# === Print Order Endpoints ===

class OrderRequest(BaseModel):
    """Request voor het plaatsen van een printbestelling"""
    book_id: str
    customer_name: str
    customer_email: str
    street: str
    city: str
    postal_code: str
    country: str = "NL"


class QuoteResponse(BaseModel):
    """Response met prijsinformatie"""
    configured: bool
    price: Optional[float] = None
    currency: str = "EUR"
    shipping_price: Optional[float] = None
    total_price: Optional[float] = None
    page_count: Optional[int] = None
    error: Optional[str] = None


@app.get("/api/books/{book_id}/quote", response_model=QuoteResponse)
async def get_print_quote(
    book_id: str,
    country: str = "NL",
    db: Session = Depends(get_db)
):
    """
    Haal een prijsopgave op voor het drukken van een boek.
    """
    from backend.services.peecho_service import peecho_service

    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if book.status != BookStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Boek is nog niet klaar")

    if not book.story_data:
        raise HTTPException(status_code=400, detail="Geen verhaal beschikbaar")

    # Calculate page count (story pages + title + end page)
    page_count = len(book.story_data.get("pages", [])) + 2

    if not peecho_service.is_configured:
        # Return mock pricing when Peecho not configured
        return QuoteResponse(
            configured=False,
            price=24.95,
            currency="EUR",
            shipping_price=4.95,
            total_price=29.90,
            page_count=page_count,
            error="Print service nog niet geconfigureerd"
        )

    # Get real quote from Peecho
    quote = await peecho_service.get_quote(
        page_count=page_count,
        country_code=country
    )

    if "error" in quote:
        return QuoteResponse(
            configured=True,
            error=quote["error"],
            page_count=page_count
        )

    return QuoteResponse(
        configured=True,
        price=quote.get("product_price"),
        currency=quote.get("currency", "EUR"),
        shipping_price=quote.get("shipping_price"),
        total_price=quote.get("total_price"),
        page_count=page_count
    )


@app.get("/api/books/{book_id}/pdf-public")
async def get_public_pdf_url(
    book_id: str,
    request_obj: Request,
    db: Session = Depends(get_db)
):
    """
    Genereer een publieke URL voor de PDF van het boek.

    Deze URL kan worden gebruikt door Peecho om het boek te downloaden.
    """
    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if book.status != BookStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Boek is nog niet klaar")

    # Build the public PDF URL
    # Uses the /api/books/{book_id}/pdf endpoint which serves the PDF
    base_url = str(request_obj.base_url).rstrip('/')
    pdf_url = f"{base_url}/api/books/{book_id}/pdf"

    return {"pdf_url": pdf_url}


@app.get("/api/books/{book_id}/toy-image")
async def get_toy_image(book_id: str, db: Session = Depends(get_db)):
    """
    Serve de knuffelfoto als afbeelding.

    Dit endpoint wordt gebruikt om de originele knuffelfoto publiek
    beschikbaar te maken voor Peecho proof/quality control.
    """
    from fastapi.responses import Response
    import base64

    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if not book.toy_image_base64:
        raise HTTPException(status_code=404, detail="Geen knuffelfoto beschikbaar")

    # Decode base64 image
    try:
        # Handle data URL format (data:image/jpeg;base64,...)
        image_data = book.toy_image_base64
        if image_data.startswith('data:'):
            # Extract mime type and base64 data
            header, base64_data = image_data.split(',', 1)
            # Extract mime type from header (e.g., "data:image/jpeg;base64")
            mime_type = header.split(':')[1].split(';')[0]
        else:
            base64_data = image_data
            mime_type = "image/jpeg"  # Default to JPEG

        image_bytes = base64.b64decode(base64_data)

        return Response(
            content=image_bytes,
            media_type=mime_type,
            headers={
                "Cache-Control": "public, max-age=86400"  # Cache for 24 hours
            }
        )
    except Exception as e:
        logger.error(f"Error serving toy image: {e}")
        raise HTTPException(status_code=500, detail="Fout bij laden knuffelfoto")


@app.get("/api/books/{book_id}/checkout-url")
async def get_peecho_checkout_url(
    book_id: str,
    request_obj: Request,
    db: Session = Depends(get_db)
):
    """
    Genereer een Peecho Print Button checkout URL.

    De gebruiker wordt doorgestuurd naar Peecho waar ze het boek kunnen:
    - Bekijken en aanpassen
    - Betalen
    - Laten drukken en verzenden

    Peecho regelt alles na de redirect.
    """
    from backend.services.peecho_service import peecho_service

    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if book.status != BookStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Boek is nog niet klaar")

    if not peecho_service.product_id:
        raise HTTPException(
            status_code=503,
            detail="Print service is nog niet geconfigureerd."
        )

    # Build the public PDF URL
    base_url = str(request_obj.base_url).rstrip('/')
    pdf_url = f"{base_url}/api/books/{book_id}/pdf"

    # Get book title for Peecho
    title = None
    if book.story_data:
        title = book.story_data.get("title", f"Het avontuur van {book.toy_name}")

    # Generate Print Button URL
    result = peecho_service.get_print_button_url(pdf_url=pdf_url, title=title)

    if "error" in result:
        raise HTTPException(status_code=503, detail=result["error"])

    return result


@app.post("/api/books/{book_id}/order")
async def create_print_order(
    book_id: str,
    request: OrderRequest,
    db: Session = Depends(get_db)
):
    """
    [DEPRECATED] Gebruik /api/books/{book_id}/checkout-url in plaats hiervan.

    De Print Button flow is simpeler: redirect de gebruiker naar Peecho
    en zij regelen de rest (betaling, drukken, verzending).
    """
    from backend.services.peecho_service import peecho_service

    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if book.status != BookStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Boek is nog niet klaar")

    if not peecho_service.is_configured:
        raise HTTPException(
            status_code=503,
            detail="Print service is nog niet geconfigureerd. Neem contact op met support."
        )

    # Redirect to new checkout-url endpoint
    raise HTTPException(
        status_code=410,
        detail="Dit endpoint is vervangen door GET /api/books/{book_id}/checkout-url. "
               "Gebruik de Print Button flow in plaats van direct orders plaatsen."
    )


@app.get("/api/print/status")
async def get_print_service_status():
    """
    Check of de print service is geconfigureerd.
    """
    from backend.services.peecho_service import peecho_service

    return {
        "configured": peecho_service.is_configured,
        "test_mode": peecho_service.test_mode,
        "provider": "Peecho" if peecho_service.is_configured else None
    }


@app.get("/api/print/products")
async def get_print_products():
    """
    Haal beschikbare Peecho producten op.
    """
    from backend.services.peecho_service import peecho_service

    # This endpoint requires full API access, not just Print Button
    return {
        "message": "Gebruik het Peecho dashboard om producten te bekijken",
        "dashboard_url": "https://www.peecho.com/dashboard/settings/products"
    }


@app.get("/api/print/formats")
async def get_book_formats():
    """
    Haal alle beschikbare boekformaten op.

    Returns:
        Lijst met alle boekformaten inclusief specificaties
    """
    from backend.services.peecho_service import peecho_service

    formats = peecho_service.get_book_formats()
    requirements = peecho_service.get_delivery_requirements()

    return {
        "formats": formats,
        "delivery_requirements": requirements
    }


# ============================================================================
# STRIPE PAYMENT ENDPOINTS
# ============================================================================

@app.post("/api/books/{book_id}/stripe-checkout")
async def create_stripe_checkout(
    book_id: str,
    request_obj: Request,
    cover_type: str = "hardcover",
    db: Session = Depends(get_db)
):
    """
    Maak een Stripe Checkout Session voor het bestellen van een boek.

    Args:
        cover_type: "hardcover" (€39.95) of "softcover" (€29.95) - inclusief verzending

    Returns:
        checkout_url: URL om gebruiker naar Stripe checkout te redirecten
        session_id: Stripe session ID voor tracking
    """
    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if book.status != BookStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Boek is nog niet klaar")

    if not stripe_service.is_configured():
        raise HTTPException(
            status_code=503,
            detail="Betaalservice is nog niet geconfigureerd"
        )

    # Validate cover type
    if cover_type not in ["hardcover", "softcover"]:
        cover_type = "hardcover"

    # Get book title
    title = "Knuffelboek"
    if book.story_data:
        title = book.story_data.get("title", f"Het avontuur van {book.toy_name}")

    # Build success/cancel URLs
    base_url = str(request_obj.base_url).rstrip('/')
    success_url = f"{base_url}/?payment=success&book_id={book_id}&session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{base_url}/?payment=cancelled&book_id={book_id}"

    try:
        result = stripe_service.create_checkout_session(
            book_id=book_id,
            book_title=title,
            child_name=book.child_name,
            success_url=success_url,
            cancel_url=cancel_url,
            cover_type=cover_type
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stripe/session/{session_id}")
async def get_stripe_session(session_id: str):
    """
    Haal details van een Stripe checkout session op.

    Gebruik dit om te controleren of een betaling succesvol was.
    """
    if not stripe_service.is_configured():
        raise HTTPException(
            status_code=503,
            detail="Betaalservice is nog niet geconfigureerd"
        )

    try:
        return stripe_service.get_session(session_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/stripe/config")
async def get_stripe_config():
    """
    Haal Stripe configuratie op voor de frontend.

    Returns publishable key (veilig om te delen met frontend).
    """
    return {
        "publishable_key": stripe_service.get_publishable_key(),
        "configured": stripe_service.is_configured()
    }


# ============================================================================
# LULU PRINT-ON-DEMAND ENDPOINTS
# ============================================================================

@app.get("/api/lulu/status")
async def get_lulu_status():
    """Check of Lulu API is geconfigureerd"""
    from backend.services.lulu_service import lulu_service

    return {
        "configured": lulu_service.is_configured,
        "test_mode": lulu_service.test_mode,
        "provider": "Lulu" if lulu_service.is_configured else None
    }


@app.get("/api/books/{book_id}/lulu-quote")
async def get_lulu_quote(
    book_id: str,
    country_code: str = "NL",
    cover_type: str = "hardcover",
    lulu_format: str = "square",
    db: Session = Depends(get_db)
):
    """
    Krijg een prijsofferte van Lulu voor een boek.

    Args:
        book_id: ID van het boek
        country_code: ISO landcode voor verzending (NL, BE, DE, etc.)
        cover_type: "hardcover" of "softcover"
        lulu_format: "square" (21x21cm) of "a4_landscape"
    """
    from backend.services.lulu_service import lulu_service, LuluShippingAddress

    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if not lulu_service.is_configured:
        raise HTTPException(status_code=503, detail="Lulu is niet geconfigureerd")

    # Get page count from story
    page_count = 24  # Default minimum
    if book.story_data and book.story_data.get("pages"):
        content_pages = len(book.story_data["pages"]) + 4  # +4 for title, dedication, end, etc.
        page_count = max(24, content_pages)  # Minimum 24 for hardcover

    # Get the right SKU
    sku = lulu_service.get_sku_for_format(lulu_format, cover_type)

    # Country-specific dummy postcodes for quotes
    dummy_postcodes = {
        "NL": "1000AA",
        "BE": "1000",
        "DE": "10115",
        "FR": "75001",
        "GB": "SW1A 1AA",
        "AT": "1010",
        "CH": "8001",
        "LU": "1111",
        "US": "10001",
    }
    postcode = dummy_postcodes.get(country_code, "1000")

    # Calculate costs
    result = lulu_service.calculate_print_cost(
        pod_package_id=sku,
        page_count=page_count,
        quantity=1,
        shipping_address=LuluShippingAddress(
            name="Quote",
            street1="Quote Address",
            city="Quote City",
            country_code=country_code,
            postcode=postcode,
            phone_number="0000000000"
        )
    )

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return {
        "book_id": book_id,
        "page_count": page_count,
        "format": lulu_format,
        "cover_type": cover_type,
        "sku": sku,
        "print_cost": result.get("print_cost"),
        "shipping_cost": result.get("shipping_cost"),
        "total_cost": result.get("total_cost"),
        "currency": result.get("currency", "EUR")
    }


@app.get("/api/books/{book_id}/lulu-pdfs")
async def generate_lulu_pdfs(
    book_id: str,
    lulu_format: str = "square",
    db: Session = Depends(get_db)
):
    """
    Genereer Lulu-compatible PDFs (interior + cover) voor een boek.

    Returns URLs waar de PDFs te downloaden zijn.
    """
    from backend.services.pdf_service import PDFService

    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if book.status != BookStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Boek is nog niet klaar")

    # Get story and illustrations
    story = book.story_data
    if not story:
        raise HTTPException(status_code=400, detail="Geen verhaal gevonden")

    # Build stories list in new format
    story_pages = []
    for i, page in enumerate(story.get("pages", [])):
        story_pages.append({
            "page_number": i + 1,
            "text": page.get("text", "")
        })

    stories = [{
        "title": story.get("title", f"Het avontuur van {book.toy_name}"),
        "pages": story_pages
    }]

    # Build illustrations dict (page_number -> base64)
    illustrations = {}
    if book.illustrations:
        for ill in book.illustrations:
            if ill.image_base64:
                illustrations[ill.page_number] = ill.image_base64

    pdf_service = PDFService()

    # Get age for layout-specific rendering
    age = book.age if book.age else 5

    # Generate interior PDF with layout-specific rendering based on age
    interior_pdf = await pdf_service.create_lulu_interior_pdf(
        title=story.get("title", f"Het avontuur van {book.toy_name}"),
        stories=stories,
        child_name=book.child_name,
        illustrations=illustrations,
        lulu_format=lulu_format,
        dedication=book.dedication_text,
        age=age
    )

    # Get cover illustration (first page illustration or first available)
    cover_illustration = illustrations.get(1) if illustrations else None

    # Calculate page count for spine using new layout
    # 2 (title + dedication) + per story: 1 (title) + 2*pages + 1 (colophon)
    text_blocks = len(story_pages)
    content_pages = 2 + 1 + (text_blocks * 2) + 1  # title + ded + story_title + (text+ill) + colophon
    page_count = max(24, content_pages)

    # Generate cover PDF
    cover_pdf = await pdf_service.create_lulu_cover_pdf(
        title=story.get("title", f"Het avontuur van {book.toy_name}"),
        child_name=book.child_name,
        page_count=page_count,
        cover_illustration_base64=cover_illustration,
        lulu_format=lulu_format
    )

    # For now, return base64 encoded PDFs
    # In production, upload to cloud storage and return URLs
    import base64
    return {
        "book_id": book_id,
        "format": lulu_format,
        "page_count": page_count,
        "interior_pdf_base64": base64.b64encode(interior_pdf).decode(),
        "cover_pdf_base64": base64.b64encode(cover_pdf).decode(),
        "interior_size_bytes": len(interior_pdf),
        "cover_size_bytes": len(cover_pdf)
    }


class LuluOrderRequest(BaseModel):
    """Request voor Lulu order"""
    name: str
    street1: str
    city: str
    country_code: str
    postcode: str
    phone_number: str
    street2: Optional[str] = None
    email: Optional[str] = None
    cover_type: str = "hardcover"
    lulu_format: str = "square"
    shipping_level: str = "MAIL"


@app.post("/api/books/{book_id}/lulu-order")
async def create_lulu_order(
    book_id: str,
    order: LuluOrderRequest,
    request_obj: Request,
    db: Session = Depends(get_db)
):
    """
    Maak een print order aan bij Lulu.

    IMPORTANT: De PDFs moeten publiek toegankelijk zijn via URLs.
    In productie moeten we eerst de PDFs uploaden naar cloud storage.
    """
    from backend.services.lulu_service import lulu_service, LuluBookSpec, LuluShippingAddress

    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if book.status != BookStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Boek is nog niet klaar")

    if not lulu_service.is_configured:
        raise HTTPException(status_code=503, detail="Lulu is niet geconfigureerd")

    # Get book title
    title = "Knuffelboek"
    if book.story_data:
        title = book.story_data.get("title", f"Het avontuur van {book.toy_name}")

    # Calculate page count
    page_count = 24
    if book.story_data and book.story_data.get("pages"):
        page_count = max(24, len(book.story_data["pages"]) + 4)

    # Build PDF URLs - these need to be publicly accessible
    base_url = str(request_obj.base_url).rstrip('/')

    # NOTE: In production, we need to upload PDFs to cloud storage first
    # For now, we'll use the API endpoints as URLs (requires public access)
    interior_url = f"{base_url}/api/books/{book_id}/lulu-interior.pdf"
    cover_url = f"{base_url}/api/books/{book_id}/lulu-cover.pdf"

    # Get SKU
    sku = lulu_service.get_sku_for_format(order.lulu_format, order.cover_type)

    # Create book spec
    book_spec = LuluBookSpec(
        pod_package_id=sku,
        title=title,
        interior_url=interior_url,
        cover_url=cover_url,
        quantity=1
    )

    # Create shipping address
    shipping = LuluShippingAddress(
        name=order.name,
        street1=order.street1,
        street2=order.street2,
        city=order.city,
        country_code=order.country_code,
        postcode=order.postcode,
        phone_number=order.phone_number,
        email=order.email
    )

    # Create print job
    result = lulu_service.create_print_job(
        book=book_spec,
        shipping_address=shipping,
        shipping_level=order.shipping_level,
        external_id=book_id,
        contact_email=order.email or "noreply@knuffelboek.nl"
    )

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return {
        "success": True,
        "lulu_order_id": result.get("id"),
        "status": result.get("status"),
        "book_id": book_id
    }


@app.get("/api/lulu/order/{order_id}")
async def get_lulu_order_status(order_id: str):
    """Haal status van een Lulu order op"""
    from backend.services.lulu_service import lulu_service

    if not lulu_service.is_configured:
        raise HTTPException(status_code=503, detail="Lulu is niet geconfigureerd")

    result = lulu_service.get_print_job(order_id)

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return result


# =============================================================================
# LULU PDF SERVING ENDPOINTS (for Lulu to download the PDFs)
# =============================================================================

@app.get("/api/books/{book_id}/lulu-interior.pdf")
async def serve_lulu_interior_pdf(
    book_id: str,
    lulu_format: str = "square",
    db: Session = Depends(get_db)
):
    """
    Serve the interior PDF for Lulu to download.
    This endpoint must be publicly accessible for Lulu to fetch the PDF.
    """
    from fastapi.responses import Response
    from backend.services.pdf_service import PDFService

    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if book.status != BookStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Boek is nog niet klaar")

    story = book.story_data
    if not story:
        raise HTTPException(status_code=400, detail="Geen verhaal gevonden")

    # Build stories list in new format
    story_pages = []
    for i, page in enumerate(story.get("pages", [])):
        story_pages.append({
            "page_number": i + 1,
            "text": page.get("text", "")
        })

    stories = [{
        "title": story.get("title", f"Het avontuur van {book.toy_name}"),
        "pages": story_pages
    }]

    # Build illustrations dict (page_number -> base64)
    illustrations = {}
    if book.illustrations:
        for ill in book.illustrations:
            if ill.image_base64:
                illustrations[ill.page_number] = ill.image_base64

    # Get age for layout-specific rendering
    age = book.age if book.age else 5

    pdf_service = PDFService()
    interior_pdf = await pdf_service.create_lulu_interior_pdf(
        title=story.get("title", f"Het avontuur van {book.toy_name}"),
        stories=stories,
        child_name=book.child_name,
        illustrations=illustrations,
        lulu_format=lulu_format,
        dedication=book.dedication_text,
        age=age
    )

    return Response(
        content=interior_pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=interior_{book_id}.pdf"}
    )


@app.get("/api/books/{book_id}/lulu-cover.pdf")
async def serve_lulu_cover_pdf(
    book_id: str,
    lulu_format: str = "square",
    cover_type: str = "hardcover",
    db: Session = Depends(get_db)
):
    """
    Serve the cover PDF for Lulu to download.
    This endpoint must be publicly accessible for Lulu to fetch the PDF.

    Args:
        book_id: UUID of the book
        lulu_format: "square" or "a4_landscape"
        cover_type: "hardcover" (with casewrap) or "softcover"
    """
    from fastapi.responses import Response
    from backend.services.pdf_service import PDFService

    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if book.status != BookStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Boek is nog niet klaar")

    story = book.story_data
    if not story:
        raise HTTPException(status_code=400, detail="Geen verhaal gevonden")

    # Get cover illustration
    cover_illustration = None
    if book.illustrations:
        for ill in book.illustrations:
            if ill.image_base64:
                cover_illustration = ill.image_base64
                break

    # Calculate page count for spine using new layout
    # 2 (title + dedication) + per story: 1 (title) + 2*pages + 1 (colophon)
    page_count = 24
    if story.get("pages"):
        text_blocks = len(story["pages"])
        content_pages = 2 + 1 + (text_blocks * 2) + 1  # title + ded + story_title + (text+ill) + colophon
        page_count = max(24, content_pages)

    pdf_service = PDFService()
    cover_pdf = await pdf_service.create_lulu_cover_pdf(
        title=story.get("title", f"Het avontuur van {book.toy_name}"),
        child_name=book.child_name,
        page_count=page_count,
        cover_illustration_base64=cover_illustration,
        lulu_format=lulu_format,
        cover_type=cover_type
    )

    return Response(
        content=cover_pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=cover_{book_id}.pdf"}
    )


# =============================================================================
# STRIPE WEBHOOK - Handles payment completion and triggers Lulu order
# =============================================================================

@app.post("/api/webhooks/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Stripe webhook endpoint for handling checkout.session.completed events.

    After successful payment, this will:
    1. Get the shipping address from the Stripe session
    2. Create a Lulu print order for the book

    Configure this webhook in Stripe Dashboard:
    https://dashboard.stripe.com/webhooks
    Event: checkout.session.completed
    """
    import stripe
    import os

    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")  # Optional but recommended

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        if webhook_secret and sig_header:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        else:
            # Without webhook secret, just parse the JSON (less secure)
            import json
            event = json.loads(payload)
            logger.warning("Processing Stripe webhook without signature verification")
    except ValueError as e:
        logger.error(f"Invalid Stripe webhook payload: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid Stripe webhook signature: {e}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle checkout.session.completed event
    if event.get("type") == "checkout.session.completed":
        session = event["data"]["object"]

        book_id = session.get("metadata", {}).get("book_id")
        if not book_id:
            logger.warning("Stripe webhook: No book_id in session metadata")
            return {"received": True, "action": "skipped", "reason": "no_book_id"}

        # Get shipping details from Stripe
        # Try multiple locations where Stripe might put shipping data
        shipping = session.get("shipping_details") or session.get("shipping")

        # Also check collected_information (newer Stripe API format)
        if not shipping:
            collected_info = session.get("collected_information", {})
            if collected_info:
                shipping = collected_info.get("shipping_details")

        if not shipping:
            logger.warning(f"Stripe webhook: No shipping details for book {book_id}. Session keys: {list(session.keys())}")
            return {"received": True, "action": "skipped", "reason": "no_shipping"}

        address = shipping.get("address", {})

        logger.info(f"Stripe payment completed for book {book_id}, creating Lulu order...")

        # Import Lulu service
        from backend.services.lulu_service import lulu_service, LuluBookSpec, LuluShippingAddress

        if not lulu_service.is_configured:
            logger.error("Lulu not configured, cannot create print order")
            return {"received": True, "action": "failed", "reason": "lulu_not_configured"}

        # Get the book
        book_service = BookService(db)
        book = book_service.get_book(book_id)

        if not book:
            logger.error(f"Book {book_id} not found for Lulu order")
            return {"received": True, "action": "failed", "reason": "book_not_found"}

        # Get book title and page count
        title = "Knuffelboek"
        page_count = 24
        if book.story_data:
            title = book.story_data.get("title", f"Het avontuur van {book.toy_name}")
            if book.story_data.get("pages"):
                page_count = max(24, len(book.story_data["pages"]) + 4)

        # Build PDF URLs using the public URL (ngrok or production domain)
        # The base URL should be the publicly accessible URL
        base_url = str(request.base_url).rstrip('/')
        interior_url = f"{base_url}/api/books/{book_id}/lulu-interior.pdf"
        # Include cover_type=hardcover to get correct cover dimensions with casewrap
        cover_url = f"{base_url}/api/books/{book_id}/lulu-cover.pdf?cover_type=hardcover"

        # Get SKU (default to square hardcover)
        sku = lulu_service.get_sku_for_format("square", "hardcover")

        # Create book spec
        book_spec = LuluBookSpec(
            pod_package_id=sku,
            title=title,
            interior_url=interior_url,
            cover_url=cover_url,
            quantity=1
        )

        # Create shipping address from Stripe data
        shipping_address = LuluShippingAddress(
            name=shipping.get("name", ""),
            street1=address.get("line1", ""),
            street2=address.get("line2"),
            city=address.get("city", ""),
            country_code=address.get("country", "NL"),
            postcode=address.get("postal_code", ""),
            phone_number=session.get("customer_details", {}).get("phone", "0000000000") or "0000000000",
            email=session.get("customer_details", {}).get("email")
        )

        # Create print job at Lulu
        result = lulu_service.create_print_job(
            book=book_spec,
            shipping_address=shipping_address,
            shipping_level="MAIL",
            external_id=book_id,
            contact_email=shipping_address.email or "noreply@knuffelboek.nl"
        )

        if "error" in result:
            logger.error(f"Failed to create Lulu order: {result['error']}")
            return {"received": True, "action": "failed", "reason": result["error"]}

        logger.info(f"Lulu order created successfully: {result.get('id')} for book {book_id}")

        # Save order information to database
        from datetime import datetime as dt, timedelta
        book.stripe_session_id = session.get("id")
        book.stripe_payment_status = session.get("payment_status", "paid")
        book.lulu_job_id = str(result.get("id"))
        book.lulu_order_status = result.get("status", "CREATED")
        book.order_date = dt.utcnow()
        # Expected delivery: order date + 10-14 business days (use 14 for safe estimate)
        book.expected_delivery_date = dt.utcnow() + timedelta(days=14)
        db.commit()
        logger.info(f"Order info saved to database for book {book_id}")

        return {
            "received": True,
            "action": "lulu_order_created",
            "lulu_order_id": result.get("id"),
            "book_id": book_id
        }

    # Return success for other event types
    return {"received": True, "action": "ignored", "event_type": event.get("type")}


@app.get("/api/print/prepare/{age}")
async def prepare_for_print(
    age: int,
    cover_type: str = "hardcover"
):
    """
    Bereken print-vereisten voor een specifieke leeftijd.

    Args:
        age: Exacte leeftijd van het kind (2-8)
        cover_type: "hardcover" of "softcover"

    Returns:
        {
            "format": {...},
            "stories_required": int,
            "final_page_count": int,
            "pages_per_story": int,
            ...
        }
    """
    from backend.services.peecho_service import peecho_service

    if age < 2 or age > 8:
        raise HTTPException(
            status_code=400,
            detail="Leeftijd moet tussen 2 en 8 jaar zijn"
        )

    if cover_type not in ["hardcover", "softcover"]:
        raise HTTPException(
            status_code=400,
            detail="Cover type moet 'hardcover' of 'softcover' zijn"
        )

    result = peecho_service.calculate_print_requirements(age, cover_type)

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return result


# === Full Peecho API Integration ===

class CreateOrderRequest(BaseModel):
    """Request voor het aanmaken van een Peecho order"""
    first_name: str
    last_name: str
    email: str
    address_line_1: str
    address_line_2: Optional[str] = None
    city: str
    postal_code: str
    country_code: str = "NL"  # ISO 3166-1 alpha-2
    state: Optional[str] = None
    quantity: int = 1


class ConfirmPaymentRequest(BaseModel):
    """Request voor het bevestigen van betaling"""
    peecho_order_id: str


@app.post("/api/books/{book_id}/create-order")
async def create_peecho_order(
    book_id: str,
    order_request: CreateOrderRequest,
    request_obj: Request,
    db: Session = Depends(get_db)
):
    """
    Maak een nieuwe printorder aan in Peecho.

    Dit is stap 1 van de eigen checkout flow:
    1. Maak order aan (status: open)
    2. Laat klant betalen via Stripe/Mollie
    3. Bevestig betaling bij Peecho
    4. Peecho drukt en verstuurt

    Returns:
        order_id: Peecho order ID (bewaar dit!)
        status: "open"
        price: Peecho kosten (exclusief jouw marge)
    """
    from backend.services.peecho_service import peecho_service, BookSpecs, ShippingAddress

    book_service = BookService(db)
    book = book_service.get_book(book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Boek niet gevonden")

    if book.status != BookStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Boek is nog niet klaar")

    if not peecho_service.is_configured:
        raise HTTPException(
            status_code=503,
            detail="Print service is nog niet geconfigureerd."
        )

    # Build the public PDF URL
    base_url = str(request_obj.base_url).rstrip('/')
    pdf_url = f"{base_url}/api/books/{book_id}/pdf"

    # Calculate page count
    page_count = 8  # Default
    if book.story_data:
        page_count = len(book.story_data.get("pages", [])) + 2  # + title + end

    # Book specs (A4 portrait for Knuffelboek)
    book_specs = BookSpecs(
        content_url=pdf_url,
        content_width=210,   # A4 width in mm
        content_height=297,  # A4 height in mm
        number_of_pages=page_count,
        spine_text_center=book.story_data.get("title") if book.story_data else None
    )

    # Shipping address
    shipping_address = ShippingAddress(
        first_name=order_request.first_name,
        last_name=order_request.last_name,
        address_line_1=order_request.address_line_1,
        address_line_2=order_request.address_line_2,
        city=order_request.city,
        postal_code=order_request.postal_code,
        country_code=order_request.country_code,
        state=order_request.state
    )

    # Create order in Peecho
    result = await peecho_service.create_order(
        book_specs=book_specs,
        email=order_request.email,
        shipping_address=shipping_address,
        reference_id=book_id,
        quantity=order_request.quantity
    )

    if not result.get("success"):
        raise HTTPException(
            status_code=500,
            detail=result.get("error", "Order aanmaken mislukt")
        )

    # TODO: Store peecho_order_id in database for tracking
    # book.peecho_order_id = result["order_id"]
    # db.commit()

    return {
        "success": True,
        "peecho_order_id": result.get("order_id"),
        "status": result.get("status"),
        "price": result.get("price"),
        "message": "Order aangemaakt. Verwerk nu de betaling en bevestig daarna."
    }


@app.post("/api/orders/{peecho_order_id}/confirm-payment")
async def confirm_peecho_payment(
    peecho_order_id: str,
    db: Session = Depends(get_db)
):
    """
    Bevestig betaling bij Peecho en start productie.

    Roep dit aan NADAT de klant succesvol heeft betaald via Stripe/Mollie.
    Dit trekt credits af van je Peecho account en start het drukproces.

    BELANGRIJK: Zorg dat je voldoende Peecho credits hebt!
    """
    from backend.services.peecho_service import peecho_service

    if not peecho_service.is_configured:
        raise HTTPException(
            status_code=503,
            detail="Print service is nog niet geconfigureerd."
        )

    result = await peecho_service.confirm_payment(peecho_order_id)

    if not result.get("success"):
        error_code = result.get("error_code")
        if error_code == "INSUFFICIENT_BALANCE":
            raise HTTPException(
                status_code=402,  # Payment Required
                detail="Onvoldoende Peecho tegoed. Koop credits in het Peecho dashboard."
            )
        raise HTTPException(
            status_code=500,
            detail=result.get("error", "Betaling bevestigen mislukt")
        )

    return {
        "success": True,
        "peecho_order_id": peecho_order_id,
        "status": result.get("status"),
        "message": "Betaling bevestigd. Peecho gaat het boek drukken en verzenden."
    }


@app.get("/api/orders/{peecho_order_id}/status")
async def get_peecho_order_status(peecho_order_id: str):
    """
    Haal de status van een Peecho order op.

    Mogelijke statussen:
    - open: Aangemaakt, wacht op betaling
    - paid: Betaald, wacht op verwerking
    - queued: In wachtrij voor productie
    - in_production: Wordt gedrukt
    - shipped: Verzonden
    - delivered: Afgeleverd
    """
    from backend.services.peecho_service import peecho_service

    if not peecho_service.is_configured:
        raise HTTPException(
            status_code=503,
            detail="Print service is nog niet geconfigureerd."
        )

    result = await peecho_service.get_order_status(peecho_order_id)

    if not result.get("success"):
        raise HTTPException(
            status_code=500,
            detail=result.get("error", "Status ophalen mislukt")
        )

    return {
        "peecho_order_id": peecho_order_id,
        "status": result.get("status"),
        "tracking_code": result.get("tracking_code"),
        "tracking_url": result.get("tracking_url")
    }


@app.delete("/api/orders/{peecho_order_id}")
async def cancel_peecho_order(peecho_order_id: str):
    """
    Annuleer een Peecho order.

    Alleen mogelijk als de order nog niet in productie is.
    """
    from backend.services.peecho_service import peecho_service

    if not peecho_service.is_configured:
        raise HTTPException(
            status_code=503,
            detail="Print service is nog niet geconfigureerd."
        )

    result = await peecho_service.cancel_order(peecho_order_id)

    if not result.get("success"):
        raise HTTPException(
            status_code=500,
            detail=result.get("error", "Annuleren mislukt")
        )

    return {
        "success": True,
        "peecho_order_id": peecho_order_id,
        "status": "cancelled"
    }


@app.post("/api/webhooks/peecho")
async def peecho_webhook(
    request_obj: Request,
    db: Session = Depends(get_db)
):
    """
    Webhook endpoint voor Peecho status updates.

    Configureer deze URL in je Peecho dashboard:
    https://jouw-domein.com/api/webhooks/peecho
    """
    from backend.services.peecho_service import peecho_service

    # Get raw body for signature verification
    body = await request_obj.body()
    body_str = body.decode("utf-8")

    # Verify signature
    signature = request_obj.headers.get("X-Peecho-Signature", "")
    if signature and not peecho_service.verify_webhook(body_str, signature):
        logger.warning("Invalid Peecho webhook signature")
        raise HTTPException(status_code=401, detail="Invalid signature")

    # Parse payload
    try:
        import json
        payload = json.loads(body_str)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    webhook_data = peecho_service.parse_webhook(payload)

    logger.info(f"Peecho webhook received: order={webhook_data.get('order_id')}, status={webhook_data.get('status')}")

    # TODO: Update order status in database
    # TODO: Send email notification to customer if shipped

    return {"received": True, "order_id": webhook_data.get("order_id")}


# =============================================================================
# ADMIN ENDPOINTS - Protected by admin email
# =============================================================================

def require_admin(email: Optional[str]) -> bool:
    """Check if the provided email is the admin email"""
    if not email or email.lower() != ADMIN_EMAIL.lower():
        raise HTTPException(
            status_code=403,
            detail="Admin toegang vereist. Gebruik ?email=admin@email.com"
        )
    return True


@app.get("/api/admin/users")
async def get_all_users(
    email: str,
    db: Session = Depends(get_db)
):
    """
    Haal alle gebruikers op met hun boeken en bestellingen.
    Alleen toegankelijk voor admin.
    """
    require_admin(email)

    from backend.models.database import User

    users = db.query(User).order_by(User.created_at.desc()).all()

    result = []
    for user in users:
        books_data = []
        for book in user.books:
            books_data.append({
                "id": book.id,
                "child_name": book.child_name,
                "toy_name": book.toy_name,
                "status": book.status.value,
                "created_at": book.created_at.isoformat() if book.created_at else None,
                "completed_at": book.completed_at.isoformat() if book.completed_at else None,
                "stripe_payment_status": book.stripe_payment_status,
                "lulu_order_status": book.lulu_order_status,
                "order_date": book.order_date.isoformat() if book.order_date else None,
                "tracking_url": book.tracking_url
            })

        result.append({
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "last_login": user.last_login.isoformat() if user.last_login else None,
            "books_count": len(user.books),
            "books": books_data
        })

    return {
        "total_users": len(result),
        "users": result
    }


@app.get("/api/admin/orders")
async def get_all_orders(
    email: str,
    db: Session = Depends(get_db)
):
    """
    Haal alle bestellingen op (boeken met betaling of Lulu order).
    Alleen toegankelijk voor admin.
    """
    require_admin(email)

    from backend.models.database import User

    # Get all books with any order activity
    books = db.query(Book).filter(
        (Book.stripe_payment_status != None) |
        (Book.lulu_job_id != None)
    ).order_by(Book.order_date.desc().nullsfirst(), Book.created_at.desc()).all()

    orders = []
    for book in books:
        # Get user email
        user = db.query(User).filter(User.id == book.user_id).first()
        user_email = user.email if user else "Onbekend"

        orders.append({
            "book_id": book.id,
            "child_name": book.child_name,
            "toy_name": book.toy_name,
            "user_email": user_email,
            "book_status": book.status.value,
            "stripe_payment_status": book.stripe_payment_status,
            "stripe_session_id": book.stripe_session_id,
            "lulu_job_id": book.lulu_job_id,
            "lulu_order_status": book.lulu_order_status,
            "order_date": book.order_date.isoformat() if book.order_date else None,
            "expected_delivery_date": book.expected_delivery_date.isoformat() if book.expected_delivery_date else None,
            "tracking_url": book.tracking_url,
            "created_at": book.created_at.isoformat() if book.created_at else None
        })

    # Calculate stats
    total_orders = len(orders)
    paid_orders = sum(1 for o in orders if o["stripe_payment_status"] == "paid")
    shipped_orders = sum(1 for o in orders if o["lulu_order_status"] in ["SHIPPED", "DELIVERED"])

    return {
        "total_orders": total_orders,
        "paid_orders": paid_orders,
        "shipped_orders": shipped_orders,
        "orders": orders
    }


@app.get("/api/admin/stats")
async def get_admin_stats(
    email: str,
    db: Session = Depends(get_db)
):
    """
    Haal statistieken op voor het admin dashboard.
    Alleen toegankelijk voor admin.
    """
    require_admin(email)

    from backend.models.database import User

    # User stats
    total_users = db.query(User).count()

    # Book stats
    total_books = db.query(Book).count()
    completed_books = db.query(Book).filter(Book.status == BookStatus.COMPLETED).count()
    generating_books = db.query(Book).filter(
        Book.status.in_([BookStatus.GENERATING_STORY, BookStatus.GENERATING_IMAGES, BookStatus.PROCESSING])
    ).count()

    # Order stats
    paid_books = db.query(Book).filter(Book.stripe_payment_status == "paid").count()
    lulu_orders = db.query(Book).filter(Book.lulu_job_id != None).count()

    return {
        "users": {
            "total": total_users
        },
        "books": {
            "total": total_books,
            "completed": completed_books,
            "generating": generating_books
        },
        "orders": {
            "paid": paid_books,
            "lulu_orders": lulu_orders
        }
    }


# === Serve Frontend ===
# Get the project root directory
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")

# Serve static files (logo, etc.)
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/")
async def serve_frontend():
    """Serve the frontend HTML"""
    return FileResponse(
        os.path.join(FRONTEND_DIR, "index.html"),
        headers={"Cache-Control": "no-cache, no-store, must-revalidate"}
    )

@app.get("/logo.png")
async def serve_logo():
    """Serve the logo"""
    return FileResponse(os.path.join(FRONTEND_DIR, "logo.png"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
