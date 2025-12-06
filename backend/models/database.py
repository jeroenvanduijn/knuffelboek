"""
Database models voor Knuffelboek - gebruikers en boeken opslag
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import create_engine, Column, String, DateTime, Text, Integer, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import enum
import uuid
import os

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./knuffelboek.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class BookStatus(str, enum.Enum):
    """Status van een boek in het systeem"""
    DRAFT = "draft"                    # Nog niet gestart met genereren
    GENERATING_STORY = "generating_story"  # Verhaal wordt gegenereerd
    GENERATING_IMAGES = "generating_images"  # Illustraties worden gegenereerd
    PROCESSING = "processing"          # PDF wordt gemaakt
    COMPLETED = "completed"            # Klaar om te bekijken/downloaden
    FAILED = "failed"                  # Er is iets misgegaan


class IllustrationStatus(str, enum.Enum):
    """Status van een individuele illustratie"""
    PENDING = "pending"
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    """Gebruiker met email en wachtwoord authenticatie"""
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)  # Nullable for existing users without password
    name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)

    # Email notification preferences
    notify_on_completion = Column(String, default="true")  # "true"/"false"

    # Relationships
    books = relationship("Book", back_populates="user", cascade="all, delete-orphan")


class Book(Base):
    """Een gepersonaliseerd kinderboek"""
    __tablename__ = "books"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    # Status tracking
    status = Column(SQLEnum(BookStatus), default=BookStatus.DRAFT)
    status_message = Column(String, nullable=True)  # Human-readable status
    progress = Column(Integer, default=0)  # 0-100 percentage

    # Kind info
    child_name = Column(String, nullable=False)
    child_nickname = Column(String, nullable=True)
    age_category = Column(String, default="4-5")
    age = Column(Integer, nullable=True)  # Exacte leeftijd (2-8)

    # Knuffel info
    toy_name = Column(String, nullable=False)
    toy_description = Column(Text, nullable=True)
    toy_image_base64 = Column(Text, nullable=True)  # Original uploaded image
    toy_analysis = Column(JSON, nullable=True)  # AI analysis result

    # Story settings
    theme = Column(String, default="bedtijd_avontuur")
    theme_context = Column(String, nullable=True)
    toy_personality = Column(String, nullable=True)
    location_type = Column(String, nullable=True)
    location_name = Column(String, nullable=True)
    book_length = Column(String, default="normaal")
    dedication_text = Column(Text, nullable=True)
    family_members = Column(JSON, nullable=True)

    # Visual style
    realism_level = Column(String, default="semi_real")
    illustration_style = Column(String, default="watercolor")

    # Child appearance (for illustrations)
    child_description = Column(Text, nullable=True)

    # Generated content
    story_data = Column(JSON, nullable=True)  # Full story with pages
    pdf_path = Column(String, nullable=True)  # Path to generated PDF

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Order/Payment info
    stripe_session_id = Column(String, nullable=True)
    stripe_payment_status = Column(String, nullable=True)  # paid, unpaid, etc.
    lulu_job_id = Column(String, nullable=True)
    lulu_order_status = Column(String, nullable=True)  # CREATED, IN_PRODUCTION, SHIPPED, etc.
    order_date = Column(DateTime, nullable=True)
    expected_delivery_date = Column(DateTime, nullable=True)
    tracking_url = Column(String, nullable=True)

    # Relationships
    user = relationship("User", back_populates="books")
    illustrations = relationship("Illustration", back_populates="book", cascade="all, delete-orphan")


class Illustration(Base):
    """Een individuele illustratie binnen een boek"""
    __tablename__ = "illustrations"

    id = Column(String, primary_key=True, default=generate_uuid)
    book_id = Column(String, ForeignKey("books.id"), nullable=False)

    page_number = Column(Integer, nullable=False)
    scene_description = Column(Text, nullable=True)

    # Generation status
    status = Column(SQLEnum(IllustrationStatus), default=IllustrationStatus.PENDING)
    error_message = Column(String, nullable=True)

    # Result
    image_base64 = Column(Text, nullable=True)  # Generated image
    model_used = Column(String, nullable=True)  # Which AI model was used

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    book = relationship("Book", back_populates="illustrations")


# Database initialization
def init_db():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency for FastAPI to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
