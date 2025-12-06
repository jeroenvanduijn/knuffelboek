"""
Peecho Print Service - Volledige API v3 integratie voor print-on-demand kinderboeken

Peecho is een Nederlandse print-on-demand service die:
- De bestelling afhandelt
- Het boek drukt en verstuurt
- Wereldwijd kan leveren via lokale printpartners

API Documentatie: https://www.peecho.com/print-api-documentation
API Reference: https://jsapi.apiary.io/apis/peechoapiv3/

Integratie Flow (Volledige API):
1. Gebruiker kiest product en vult adres in (eigen checkout)
2. Backend maakt order aan via Peecho API (status: open)
3. Gebruiker betaalt via eigen betaalprovider (Stripe/Mollie)
4. Backend bevestigt betaling via Peecho Payment API
5. Peecho drukt en verstuurt het boek
6. Status updates via webhooks of polling
"""

import os
import logging
import hashlib
import httpx
from pathlib import Path
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from enum import Enum
from dotenv import load_dotenv

# Load environment variables
PROJECT_ROOT = Path(__file__).parent.parent.parent
env_path = PROJECT_ROOT / ".env"
load_dotenv(dotenv_path=env_path, override=True)

logger = logging.getLogger(__name__)

# Import book format configuration
try:
    from backend.config.peecho_formats import (
        BOOK_FORMATS,
        DELIVERY_REQUIREMENTS,
        select_optimal_book_format,
        calculate_stories_required,
        get_pages_per_story,
    )
    FORMATS_AVAILABLE = True
except ImportError:
    FORMATS_AVAILABLE = False
    BOOK_FORMATS = []
    DELIVERY_REQUIREMENTS = {}


class OrderStatus(str, Enum):
    """Peecho order statuses"""
    OPEN = "open"                    # Order created, not yet paid
    PAID = "paid"                    # Payment confirmed
    QUEUED = "queued"                # Queued for processing
    PROCESSED = "processed"          # File processed, ready for print
    IN_PRINT_QUEUE = "in_print_queue"  # Sent to printer
    IN_PRODUCTION = "in_production"  # Being printed
    SHIPPED = "shipped"              # Shipped to customer
    DELIVERED = "delivered"          # Delivered (if tracking available)
    CANCELLED = "cancelled"          # Order cancelled
    PAYMENT_ERROR = "payment_error"  # Payment failed
    PRODUCTION_ERROR = "production_error"  # Print production failed
    HOLD = "hold"                    # On hold (needs review)


@dataclass
class ShippingAddress:
    """Shipping address for Peecho orders"""
    first_name: str
    last_name: str
    address_line_1: str
    city: str
    postal_code: str
    country_code: str  # ISO 3166-1 alpha-2 (e.g., "NL", "BE", "DE")
    address_line_2: Optional[str] = None
    state: Optional[str] = None

    def to_dict(self) -> Dict[str, str]:
        result = {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "address_line_1": self.address_line_1,
            "city": self.city,
            "zip_code": self.postal_code,
            "country_code": self.country_code,
        }
        if self.address_line_2:
            result["address_line_2"] = self.address_line_2
        if self.state:
            result["state"] = self.state
        return result


@dataclass
class BookSpecs:
    """Book specifications for Peecho orders"""
    content_url: str           # Public URL to PDF
    content_width: float       # Width in mm (e.g., 210 for A4)
    content_height: float      # Height in mm (e.g., 297 for A4)
    number_of_pages: int       # Total pages including cover

    # Optional spine details
    spine_text_top: Optional[str] = None
    spine_text_center: Optional[str] = None
    spine_text_bottom: Optional[str] = None
    custom_spine_url: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        result = {
            "content_url": self.content_url,
            "content_width": self.content_width,
            "content_height": self.content_height,
            "number_of_pages": self.number_of_pages,
        }

        # Add spine details if any text is provided
        if self.spine_text_top or self.spine_text_center or self.spine_text_bottom:
            result["spine_details"] = {
                "dynamic_spine_details": {
                    "text_font": "Arial",
                    "text_size": 10,
                    "text_colour": "#333333",
                }
            }
            if self.spine_text_top:
                result["spine_details"]["dynamic_spine_details"]["text_top"] = self.spine_text_top
            if self.spine_text_center:
                result["spine_details"]["dynamic_spine_details"]["text_center"] = self.spine_text_center
            if self.spine_text_bottom:
                result["spine_details"]["dynamic_spine_details"]["text_bottom"] = self.spine_text_bottom
        elif self.custom_spine_url:
            result["spine_details"] = {
                "custom_spine_url": self.custom_spine_url
            }

        return result


class PeechoService:
    """
    Volledige Peecho API v3 integratie.

    Ondersteunt:
    - Order aanmaken met eigen checkout
    - Betaling bevestigen (na eigen payment processing)
    - Order status opvragen
    - Webhooks voor status updates
    - Print Button als fallback
    """

    # API Base URLs
    TEST_BASE_URL = "https://test.www.peecho.com/rest/v3"
    PROD_BASE_URL = "https://www.peecho.com/rest/v3"

    # Print Button URLs (fallback)
    TEST_BUTTON_URL = "https://test.www.peecho.com/print/button"
    PROD_BUTTON_URL = "https://www.peecho.com/print/button"

    def __init__(self, test_mode: bool = True):
        """
        Initialize Peecho service.

        Args:
            test_mode: Use test environment (default True for development)
        """
        self.test_mode = test_mode
        self.base_url = self.TEST_BASE_URL if test_mode else self.PROD_BASE_URL
        self.button_url = self.TEST_BUTTON_URL if test_mode else self.PROD_BUTTON_URL

        logger.info(f"PeechoService initialized - test_mode={test_mode}, base_url={self.base_url}")

    @property
    def api_key(self) -> str:
        """Merchant API key (from Peecho Dashboard > Settings > API)"""
        return os.getenv("PEECHO_API_KEY", "")

    @property
    def api_secret(self) -> str:
        """Merchant secret key (for payment confirmation)"""
        return os.getenv("PEECHO_API_SECRET", "")

    @property
    def offering_id(self) -> str:
        """Product offering ID (from Peecho Dashboard > Settings > Products)"""
        return os.getenv("PEECHO_OFFERING_ID", os.getenv("PEECHO_PRODUCT_ID", ""))

    @property
    def is_configured(self) -> bool:
        """Check if Peecho API is properly configured"""
        configured = bool(self.api_key and self.offering_id)
        if not configured:
            logger.warning(f"Peecho not fully configured - api_key={bool(self.api_key)}, offering_id={bool(self.offering_id)}")
        return configured

    def _generate_payment_secret(self, order_id: str) -> str:
        """
        Generate the secret hash for payment confirmation.

        According to Peecho docs: secret = SHA256(merchant_secret_key + order_id)

        Args:
            order_id: The Peecho order ID

        Returns:
            Hex-encoded SHA-256 hash
        """
        combined = f"{self.api_secret}{order_id}"
        return hashlib.sha256(combined.encode()).hexdigest()

    async def create_order(
        self,
        book_specs: BookSpecs,
        email: str,
        shipping_address: ShippingAddress,
        reference_id: str,
        quantity: int = 1,
        currency: str = "EUR",
        item_reference: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Create a new print order in Peecho.

        The order will be created in 'open' status. After the customer pays
        through your own payment system, call confirm_payment() to start production.

        Args:
            book_specs: Book file specifications
            email: Customer email for shipping notifications
            shipping_address: Delivery address
            reference_id: Your internal reference (e.g., book_id)
            quantity: Number of copies (default 1)
            currency: Currency code (EUR, USD, etc.)
            item_reference: Optional item label

        Returns:
            Dict with order_id, status, and pricing info
        """
        if not self.is_configured:
            return {"error": "Peecho API niet geconfigureerd", "configured": False}

        order_data = {
            "merchant_api_key": self.api_key,
            "currency": currency,
            "purchase_order": reference_id,
            "item_details": [
                {
                    "item_reference": item_reference or f"knuffelboek_{reference_id}",
                    "offering_id": self.offering_id,
                    "quantity": quantity,
                    "file_details": book_specs.to_dict()
                }
            ],
            "address_details": {
                "email_address": email,
                "shipping_address": shipping_address.to_dict()
            }
        }

        logger.info(f"Creating Peecho order - reference={reference_id}, offering={self.offering_id}")
        logger.debug(f"Order data: {order_data}")

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/orders/",
                    json=order_data,
                    timeout=60.0
                )

                logger.info(f"Peecho create order response: {response.status_code}")

                if response.status_code in [200, 201]:
                    result = response.json()
                    logger.info(f"Order created successfully: {result.get('order_id', 'unknown')}")
                    return {
                        "success": True,
                        "order_id": result.get("order_id"),
                        "status": OrderStatus.OPEN.value,
                        "price": result.get("price"),
                        "currency": currency,
                        "raw_response": result
                    }
                else:
                    error_text = response.text
                    logger.error(f"Peecho order creation failed: {response.status_code} - {error_text}")
                    return {
                        "success": False,
                        "error": f"Order aanmaken mislukt: {response.status_code}",
                        "details": error_text,
                        "status_code": response.status_code
                    }

        except httpx.TimeoutException:
            logger.error("Peecho order creation timed out")
            return {"success": False, "error": "Verbinding met Peecho timeout"}
        except Exception as e:
            logger.error(f"Peecho order creation exception: {e}")
            return {"success": False, "error": str(e)}

    async def confirm_payment(self, order_id: str) -> Dict[str, Any]:
        """
        Confirm payment for an order and start production.

        Call this AFTER successfully charging the customer through your own
        payment system (Stripe/Mollie). This will:
        1. Deduct credits from your Peecho account
        2. Move the order to 'paid' status
        3. Start the print production process

        Args:
            order_id: The Peecho order ID from create_order()

        Returns:
            Dict with success status and order info
        """
        if not self.is_configured:
            return {"error": "Peecho API niet geconfigureerd", "configured": False}

        if not self.api_secret:
            return {"error": "Peecho API secret niet geconfigureerd"}

        # Generate the payment secret
        secret = self._generate_payment_secret(order_id)

        payment_data = {
            "order_id": order_id,
            "merchant_api_key": self.api_key,
            "secret": secret
        }

        logger.info(f"Confirming payment for order {order_id}")

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/orders/{order_id}/payment/",
                    json=payment_data,
                    timeout=60.0
                )

                logger.info(f"Peecho payment confirmation response: {response.status_code}")

                if response.status_code in [200, 201]:
                    result = response.json()
                    logger.info(f"Payment confirmed for order {order_id}")
                    return {
                        "success": True,
                        "order_id": order_id,
                        "status": OrderStatus.PAID.value,
                        "raw_response": result
                    }
                else:
                    error_text = response.text
                    logger.error(f"Peecho payment confirmation failed: {response.status_code} - {error_text}")

                    # Check for specific error codes
                    error_info = {"success": False, "error": f"Betaling bevestigen mislukt: {response.status_code}"}

                    if "MERCH_INSUFFICIENT_BALANCE" in error_text:
                        error_info["error"] = "Onvoldoende Peecho tegoed. Koop eerst credits in het Peecho dashboard."
                        error_info["error_code"] = "INSUFFICIENT_BALANCE"
                    elif "ORD_SECRET" in error_text:
                        error_info["error"] = "Ongeldige beveiligingssleutel. Controleer de API secret."
                        error_info["error_code"] = "INVALID_SECRET"

                    error_info["details"] = error_text
                    return error_info

        except Exception as e:
            logger.error(f"Peecho payment confirmation exception: {e}")
            return {"success": False, "error": str(e)}

    async def get_order_status(self, order_id: str) -> Dict[str, Any]:
        """
        Get the current status of an order.

        Args:
            order_id: Peecho order ID

        Returns:
            Dict with order status and details
        """
        if not self.is_configured:
            return {"error": "Peecho API niet geconfigureerd"}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/orders/{order_id}/",
                    params={"merchant_api_key": self.api_key},
                    timeout=30.0
                )

                if response.status_code == 200:
                    result = response.json()
                    return {
                        "success": True,
                        "order_id": order_id,
                        "status": result.get("state", "unknown"),
                        "tracking_code": result.get("tracking_code"),
                        "tracking_url": result.get("tracking_url"),
                        "raw_response": result
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Status ophalen mislukt: {response.status_code}"
                    }

        except Exception as e:
            logger.error(f"Peecho status check exception: {e}")
            return {"success": False, "error": str(e)}

    async def cancel_order(self, order_id: str) -> Dict[str, Any]:
        """
        Cancel an order (only possible if not yet in production).

        Args:
            order_id: Peecho order ID

        Returns:
            Dict with success status
        """
        if not self.is_configured:
            return {"error": "Peecho API niet geconfigureerd"}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.delete(
                    f"{self.base_url}/orders/{order_id}/",
                    params={"merchant_api_key": self.api_key},
                    timeout=30.0
                )

                if response.status_code in [200, 204]:
                    logger.info(f"Order {order_id} cancelled")
                    return {"success": True, "order_id": order_id, "status": "cancelled"}
                else:
                    return {
                        "success": False,
                        "error": f"Annuleren mislukt: {response.status_code}",
                        "details": response.text
                    }

        except Exception as e:
            logger.error(f"Peecho cancel order exception: {e}")
            return {"success": False, "error": str(e)}

    async def get_quote(
        self,
        page_count: int,
        country_code: str = "NL",
        currency: str = "EUR"
    ) -> Dict[str, Any]:
        """
        Get a price quote for a book.

        Args:
            page_count: Number of pages
            country_code: Shipping destination (ISO 3166-1 alpha-2)
            currency: Currency for pricing

        Returns:
            Quote with product price, shipping price, and total
        """
        if not self.is_configured:
            return {"error": "Peecho API niet geconfigureerd", "configured": False}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/offerings/{self.offering_id}/quote/",
                    params={
                        "merchant_api_key": self.api_key,
                        "page_count": page_count,
                        "country": country_code,
                        "currency": currency
                    },
                    timeout=30.0
                )

                if response.status_code == 200:
                    result = response.json()
                    return {
                        "success": True,
                        "configured": True,
                        "product_price": result.get("product_price"),
                        "shipping_price": result.get("shipping_price"),
                        "total_price": result.get("total_price"),
                        "currency": currency,
                        "page_count": page_count,
                        "raw_response": result
                    }
                else:
                    logger.error(f"Peecho quote failed: {response.status_code} - {response.text}")
                    return {
                        "success": False,
                        "error": f"Prijsopgave mislukt: {response.status_code}"
                    }

        except Exception as e:
            logger.error(f"Peecho quote exception: {e}")
            return {"success": False, "error": str(e)}

    def verify_webhook(self, payload: str, signature: str) -> bool:
        """
        Verify webhook signature from Peecho.

        Args:
            payload: Raw webhook payload
            signature: Signature from X-Peecho-Signature header

        Returns:
            True if signature is valid
        """
        if not self.api_secret:
            logger.warning("Cannot verify webhook - no API secret configured")
            return False

        expected = hashlib.sha256(f"{self.api_secret}{payload}".encode()).hexdigest()
        return expected == signature

    def parse_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse a webhook payload from Peecho.

        Args:
            payload: Webhook JSON payload

        Returns:
            Parsed webhook data with order_id, status, etc.
        """
        return {
            "order_id": payload.get("order_id"),
            "status": payload.get("state"),
            "tracking_code": payload.get("tracking_code"),
            "tracking_url": payload.get("tracking_url"),
            "timestamp": payload.get("timestamp"),
            "raw": payload
        }

    # === Book Format Selection ===

    def get_book_formats(self) -> List[Dict[str, Any]]:
        """
        Haal alle beschikbare boekformaten op.

        Returns:
            Lijst met alle boekformaten
        """
        if FORMATS_AVAILABLE:
            return BOOK_FORMATS
        return []

    def get_delivery_requirements(self) -> Dict[str, Any]:
        """
        Haal PDF aanleverspecificaties op.

        Returns:
            Dictionary met alle aanlevereisen
        """
        if FORMATS_AVAILABLE:
            return DELIVERY_REQUIREMENTS
        return {}

    def select_format_for_age(
        self,
        age: int,
        cover_type: str = "hardcover",
        preferred_shape: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Selecteer het optimale boekformaat voor een leeftijd.

        Args:
            age: Exacte leeftijd kind (2-8)
            cover_type: "hardcover" of "softcover"
            preferred_shape: "square" of "portrait" (optioneel)

        Returns:
            {
                "format": {...},
                "stories_required": int,
                "final_page_count": int,
                "reason": str,
                "warnings": []
            }
        """
        if not FORMATS_AVAILABLE:
            return {
                "error": "Boekformaten niet beschikbaar",
                "format": None
            }

        result = select_optimal_book_format(
            age=age,
            cover_type=cover_type,
            preferred_shape=preferred_shape
        )

        return {
            "format": result["chosen_format"],
            "stories_required": result["stories_required"],
            "final_page_count": result["final_page_count"],
            "reason": result["reason"],
            "warnings": result["warnings"]
        }

    def calculate_print_requirements(self, age: int, cover_type: str = "hardcover") -> Dict[str, Any]:
        """
        Bereken alle vereisten voor een printklaar boek.

        Args:
            age: Exacte leeftijd kind
            cover_type: "hardcover" of "softcover"

        Returns:
            {
                "format": {...},
                "pages_per_story": int,
                "stories_required": int,
                "final_page_count": int,
                "width_mm": int,
                "height_mm": int,
                "min_pages": int,
                "max_pages": int
            }
        """
        format_result = self.select_format_for_age(age, cover_type)

        if "error" in format_result or not format_result.get("format"):
            return format_result

        chosen_format = format_result["format"]

        return {
            "format": chosen_format,
            "format_id": chosen_format["id"],
            "format_name": chosen_format["name"],
            "pages_per_story": get_pages_per_story(age) if FORMATS_AVAILABLE else 12,
            "stories_required": format_result["stories_required"],
            "final_page_count": format_result["final_page_count"],
            "width_mm": chosen_format["width_mm"],
            "height_mm": chosen_format["height_mm"],
            "min_pages": chosen_format["min_pages"],
            "max_pages": chosen_format["max_pages"],
            "cover_type": chosen_format["cover_type"],
            "orientation": chosen_format["orientation"],
            "reason": format_result["reason"],
            "warnings": format_result["warnings"]
        }

    # === Print Button Methods (Fallback) ===

    def get_print_button_url(self, pdf_url: str, title: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate a Print Button checkout URL (fallback method).

        Use this if you want Peecho to handle the entire checkout.
        The customer will be redirected to Peecho's checkout page.

        Args:
            pdf_url: Public URL to the PDF file
            title: Optional title shown in checkout

        Returns:
            Dict with checkout_url
        """
        # Use offering_id or fall back to product_id for backwards compatibility
        button_id = self.offering_id

        if not button_id:
            return {"error": "Peecho product ID niet geconfigureerd", "configured": False}

        from urllib.parse import urlencode

        params = {"file_url": pdf_url}
        if title:
            params["title"] = title

        checkout_url = f"{self.button_url}/{button_id}?{urlencode(params)}"

        return {
            "checkout_url": checkout_url,
            "product_id": button_id,
            "test_mode": self.test_mode,
            "configured": True
        }


# Singleton instance
test_mode = os.getenv("PEECHO_TEST_MODE", "true").lower() == "true"
peecho_service = PeechoService(test_mode=test_mode)
