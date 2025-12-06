"""
Stripe Payment Service voor Knuffelboek
"""
import os
import logging
import stripe
from typing import Optional, List

logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Pricing in cents (inclusief verzending)
HARDCOVER_PRICE_CENTS = int(os.getenv("HARDCOVER_PRICE_CENTS", "3995"))  # €39.95
SOFTCOVER_PRICE_CENTS = int(os.getenv("SOFTCOVER_PRICE_CENTS", "2995"))  # €29.95

# Admin test pricing - for production testing
ADMIN_TEST_PRICE_CENTS = int(os.getenv("ADMIN_TEST_PRICE_CENTS", "50"))  # €0.50
ADMIN_TEST_EMAILS: List[str] = [
    email.strip().lower()
    for email in os.getenv("ADMIN_TEST_EMAILS", "jeroen@crossfitleiden.com").split(",")
    if email.strip()
]


class StripeService:
    """Service voor Stripe betalingen"""

    def __init__(self):
        self.api_key = os.getenv("STRIPE_SECRET_KEY")
        self.publishable_key = os.getenv("STRIPE_PUBLISHABLE_KEY")

        if not self.api_key:
            logger.warning("STRIPE_SECRET_KEY not configured")
        else:
            stripe.api_key = self.api_key
            logger.info("Stripe service initialized")

    def create_checkout_session(
        self,
        book_id: str,
        book_title: str,
        child_name: str,
        success_url: str,
        cancel_url: str,
        customer_email: Optional[str] = None,
        cover_type: str = "hardcover"
    ) -> dict:
        """
        Maak een Stripe Checkout Session voor het bestellen van een boek.

        Returns:
            dict met checkout_url en session_id
        """
        if not self.api_key:
            raise ValueError("Stripe is niet geconfigureerd")

        try:
            # Determine price based on cover type
            if cover_type == "softcover":
                price_cents = SOFTCOVER_PRICE_CENTS
                cover_label = "Softcover"
            else:
                price_cents = HARDCOVER_PRICE_CENTS
                cover_label = "Hardcover"

            # Check for admin test pricing
            is_admin_test = False
            if customer_email and customer_email.lower() in ADMIN_TEST_EMAILS:
                price_cents = ADMIN_TEST_PRICE_CENTS
                is_admin_test = True
                logger.info(f"Admin test pricing applied for {customer_email}: €{price_cents/100:.2f}")

            # Product description
            description = f"Gepersonaliseerd {cover_label.lower()} kinderboek voor {child_name} (incl. verzending)"
            if is_admin_test:
                description += " [ADMIN TEST]"

            # Create checkout session
            session = stripe.checkout.Session.create(
                payment_method_types=["card", "ideal"],  # Cards + iDEAL for NL
                mode="payment",
                success_url=success_url,
                cancel_url=cancel_url,
                customer_email=customer_email,
                metadata={
                    "book_id": book_id,
                    "child_name": child_name,
                    "cover_type": cover_type,
                    "admin_test": "true" if is_admin_test else "false"
                },
                line_items=[
                    {
                        "price_data": {
                            "currency": "eur",
                            "unit_amount": price_cents,
                            "product_data": {
                                "name": f"Knuffelboek: {book_title} ({cover_label})",
                                "description": description,
                            }
                        },
                        "quantity": 1
                    }
                ],
                shipping_address_collection={
                    "allowed_countries": ["NL", "BE", "DE", "FR", "GB", "AT", "CH", "LU"]
                },
                billing_address_collection="required",
                locale="nl"  # Dutch language
            )

            logger.info(f"Stripe checkout session created: {session.id} for book {book_id}")

            return {
                "checkout_url": session.url,
                "session_id": session.id
            }

        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {e}")
            raise ValueError(f"Betaling kon niet worden gestart: {str(e)}")

    def get_session(self, session_id: str) -> dict:
        """Haal checkout session details op"""
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            return {
                "id": session.id,
                "status": session.status,
                "payment_status": session.payment_status,
                "customer_email": session.customer_details.email if session.customer_details else None,
                "shipping": session.shipping_details if hasattr(session, 'shipping_details') else None,
                "metadata": session.metadata
            }
        except stripe.error.StripeError as e:
            logger.error(f"Error retrieving session: {e}")
            raise ValueError(f"Kon sessie niet ophalen: {str(e)}")

    def is_configured(self) -> bool:
        """Check of Stripe correct is geconfigureerd"""
        return bool(self.api_key and self.publishable_key)

    def get_publishable_key(self) -> str:
        """Return publishable key voor frontend"""
        return self.publishable_key or ""


# Singleton instance
stripe_service = StripeService()
