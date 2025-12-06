"""
Book Service - Beheer van boeken en hun status
"""
import logging
import hashlib
import secrets
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session

from backend.models.database import (
    Book, BookStatus, User, Illustration, IllustrationStatus
)

logger = logging.getLogger(__name__)


def hash_password(password: str) -> str:
    """Hash een wachtwoord met salt voor opslag"""
    salt = secrets.token_hex(16)
    hash_obj = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return f"{salt}${hash_obj.hex()}"


def verify_password(password: str, password_hash: str) -> bool:
    """Verifieer een wachtwoord tegen de opgeslagen hash"""
    try:
        salt, stored_hash = password_hash.split('$')
        hash_obj = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return hash_obj.hex() == stored_hash
    except (ValueError, AttributeError):
        return False


class BookService:
    """Service voor het beheren van boeken"""

    def __init__(self, db: Session):
        self.db = db

    # === User Management ===

    def get_or_create_user(self, email: str, name: Optional[str] = None, password: Optional[str] = None) -> User:
        """Haal gebruiker op of maak nieuwe aan"""
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email, name=name)
            if password:
                user.password_hash = hash_password(password)
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            logger.info(f"Created new user: {email}")
        else:
            user.last_login = datetime.utcnow()
            self.db.commit()
        return user

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Haal gebruiker op via email"""
        return self.db.query(User).filter(User.email == email).first()

    def register_user(self, email: str, password: str, name: Optional[str] = None) -> Tuple[Optional[User], str]:
        """
        Registreer een nieuwe gebruiker met wachtwoord.

        Returns:
            (User, message) - User object bij succes, None bij fout met foutmelding
        """
        existing = self.get_user_by_email(email)
        if existing:
            if existing.password_hash:
                return None, "Er bestaat al een account met dit email adres"
            # User exists without password - set password now
            existing.password_hash = hash_password(password)
            if name:
                existing.name = name
            existing.last_login = datetime.utcnow()
            self.db.commit()
            self.db.refresh(existing)
            logger.info(f"Added password to existing user: {email}")
            return existing, "Wachtwoord ingesteld voor bestaand account"

        # Create new user with password
        user = User(
            email=email,
            password_hash=hash_password(password),
            name=name
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        logger.info(f"Registered new user: {email}")
        return user, "Account aangemaakt"

    def login_user(self, email: str, password: str) -> Tuple[Optional[User], str]:
        """
        Log een gebruiker in met email en wachtwoord.

        Returns:
            (User, message) - User object bij succes, None bij fout met foutmelding
        """
        user = self.get_user_by_email(email)
        if not user:
            return None, "Geen account gevonden met dit email adres"

        if not user.password_hash:
            # User exists but has no password - allow login and prompt to set password
            user.last_login = datetime.utcnow()
            self.db.commit()
            return user, "Ingelogd - stel een wachtwoord in voor extra beveiliging"

        if not verify_password(password, user.password_hash):
            return None, "Onjuist wachtwoord"

        user.last_login = datetime.utcnow()
        self.db.commit()
        return user, "Ingelogd"

    def user_has_password(self, email: str) -> bool:
        """Check of een gebruiker een wachtwoord heeft ingesteld"""
        user = self.get_user_by_email(email)
        return user is not None and user.password_hash is not None

    def set_user_password(self, email: str, password: str) -> bool:
        """Stel een wachtwoord in voor een gebruiker"""
        user = self.get_user_by_email(email)
        if not user:
            return False
        user.password_hash = hash_password(password)
        self.db.commit()
        return True

    # === Book Management ===

    def create_book(
        self,
        user_id: str,
        child_name: str,
        toy_name: str,
        toy_image_base64: Optional[str] = None,
        **kwargs
    ) -> Book:
        """Maak een nieuw boek aan"""
        book = Book(
            user_id=user_id,
            child_name=child_name,
            toy_name=toy_name,
            toy_image_base64=toy_image_base64,
            status=BookStatus.DRAFT,
            **kwargs
        )
        self.db.add(book)
        self.db.commit()
        self.db.refresh(book)
        logger.info(f"Created book {book.id} for user {user_id}")
        return book

    def get_book(self, book_id: str) -> Optional[Book]:
        """Haal een boek op via ID"""
        return self.db.query(Book).filter(Book.id == book_id).first()

    def get_user_books(self, user_id: str, limit: int = 50) -> List[Book]:
        """Haal alle boeken van een gebruiker op"""
        return (
            self.db.query(Book)
            .filter(Book.user_id == user_id)
            .order_by(Book.created_at.desc())
            .limit(limit)
            .all()
        )

    def update_book(self, book_id: str, **kwargs) -> Optional[Book]:
        """Update boek eigenschappen"""
        book = self.get_book(book_id)
        if not book:
            return None

        for key, value in kwargs.items():
            if hasattr(book, key):
                setattr(book, key, value)

        book.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(book)
        return book

    def update_book_status(
        self,
        book_id: str,
        status: BookStatus,
        message: Optional[str] = None,
        progress: Optional[int] = None
    ) -> Optional[Book]:
        """Update de status van een boek"""
        book = self.get_book(book_id)
        if not book:
            return None

        book.status = status
        if message:
            book.status_message = message
        if progress is not None:
            book.progress = progress
        if status == BookStatus.COMPLETED:
            book.completed_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(book)
        logger.info(f"Book {book_id} status updated to {status.value}")
        return book

    def delete_book(self, book_id: str) -> bool:
        """Verwijder een boek"""
        book = self.get_book(book_id)
        if not book:
            return False

        self.db.delete(book)
        self.db.commit()
        logger.info(f"Deleted book {book_id}")
        return True

    # === Illustration Management ===

    def create_illustration(
        self,
        book_id: str,
        page_number: int,
        scene_description: Optional[str] = None
    ) -> Illustration:
        """Maak een nieuwe illustratie aan"""
        illustration = Illustration(
            book_id=book_id,
            page_number=page_number,
            scene_description=scene_description,
            status=IllustrationStatus.PENDING
        )
        self.db.add(illustration)
        self.db.commit()
        self.db.refresh(illustration)
        return illustration

    def get_book_illustrations(self, book_id: str) -> List[Illustration]:
        """Haal alle illustraties van een boek op"""
        return (
            self.db.query(Illustration)
            .filter(Illustration.book_id == book_id)
            .order_by(Illustration.page_number)
            .all()
        )

    def update_illustration(
        self,
        illustration_id: str,
        status: IllustrationStatus,
        image_base64: Optional[str] = None,
        model_used: Optional[str] = None,
        error_message: Optional[str] = None
    ) -> Optional[Illustration]:
        """Update een illustratie"""
        illustration = self.db.query(Illustration).filter(
            Illustration.id == illustration_id
        ).first()

        if not illustration:
            return None

        illustration.status = status
        if image_base64:
            illustration.image_base64 = image_base64
        if model_used:
            illustration.model_used = model_used
        if error_message:
            illustration.error_message = error_message
        if status == IllustrationStatus.COMPLETED:
            illustration.completed_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(illustration)
        return illustration

    def get_pending_illustrations(self, book_id: str) -> List[Illustration]:
        """Haal alle nog te genereren illustraties op"""
        return (
            self.db.query(Illustration)
            .filter(
                Illustration.book_id == book_id,
                Illustration.status == IllustrationStatus.PENDING
            )
            .order_by(Illustration.page_number)
            .all()
        )

    def calculate_book_progress(self, book_id: str) -> int:
        """Bereken de voortgang van een boek (0-100)"""
        illustrations = self.get_book_illustrations(book_id)
        if not illustrations:
            return 0

        completed = sum(
            1 for i in illustrations
            if i.status == IllustrationStatus.COMPLETED
        )
        return int((completed / len(illustrations)) * 100)
