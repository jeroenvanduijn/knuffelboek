"""
Lulu Print-on-Demand API Service voor Knuffelboek

Lulu API Documentation: https://api.lulu.com/docs/
"""
import os
import logging
import requests
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


@dataclass
class LuluBookSpec:
    """Specificaties voor een Lulu boek"""
    pod_package_id: str  # SKU code voor formaat/binding/papier
    title: str
    interior_url: str  # URL naar interieur PDF
    cover_url: str  # URL naar cover PDF
    quantity: int = 1


@dataclass
class LuluShippingAddress:
    """Verzendadres voor Lulu order"""
    name: str
    street1: str
    city: str
    country_code: str
    postcode: str
    phone_number: str
    street2: Optional[str] = None
    state_code: Optional[str] = None
    email: Optional[str] = None


class LuluService:
    """
    Service voor Lulu Print-on-Demand API integratie.

    Ondersteunt:
    - OAuth2 authenticatie
    - Print job aanmaken
    - Prijsberekening
    - Order status ophalen
    - Verzendopties
    """

    # API endpoints
    PRODUCTION_API = "https://api.lulu.com"
    SANDBOX_API = "https://api.sandbox.lulu.com"

    PRODUCTION_AUTH = "https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token"
    SANDBOX_AUTH = "https://api.sandbox.lulu.com/auth/realms/glasstree/protocol/openid-connect/token"

    # Shipping levels
    SHIPPING_MAIL = "MAIL"
    SHIPPING_PRIORITY = "PRIORITY_MAIL"
    SHIPPING_GROUND = "GROUND"
    SHIPPING_EXPEDITED = "EXPEDITED"
    SHIPPING_EXPRESS = "EXPRESS"

    def __init__(self):
        self.api_key = os.getenv("LULU_API_KEY")
        self.api_secret = os.getenv("LULU_API_SECRET")
        self.test_mode = os.getenv("LULU_TEST_MODE", "true").lower() == "true"

        # Token cache
        self._access_token: Optional[str] = None
        self._token_expires: Optional[datetime] = None

        # SKUs from environment
        self.sku_square_hardcover = os.getenv("LULU_SKU_SQUARE_HARDCOVER", "0850X0850FCPRECW060UW444MXX")
        self.sku_square_softcover = os.getenv("LULU_SKU_SQUARE_SOFTCOVER", "0850X0850FCPREPB060UW444MXX")
        self.sku_a4_landscape_hardcover = os.getenv("LULU_SKU_A4_LANDSCAPE_HARDCOVER", "1169X0827FCPRECW060UW444MXX")
        self.sku_a4_landscape_softcover = os.getenv("LULU_SKU_A4_LANDSCAPE_SOFTCOVER", "1169X0827FCPREPB060UW444MXX")

        if self.api_key and self.api_secret:
            logger.info(f"Lulu service initialized (test_mode={self.test_mode})")
        else:
            logger.warning("Lulu API credentials not configured")

    @property
    def base_url(self) -> str:
        """Return API base URL based on mode"""
        return self.SANDBOX_API if self.test_mode else self.PRODUCTION_API

    @property
    def auth_url(self) -> str:
        """Return auth URL based on mode"""
        return self.SANDBOX_AUTH if self.test_mode else self.PRODUCTION_AUTH

    @property
    def is_configured(self) -> bool:
        """Check of Lulu credentials zijn geconfigureerd"""
        return bool(self.api_key and self.api_secret)

    def _get_access_token(self) -> str:
        """
        Verkrijg OAuth2 access token via client credentials flow.
        Cached token tot expiratie.
        """
        # Check cache
        if self._access_token and self._token_expires:
            if datetime.now() < self._token_expires - timedelta(minutes=5):
                return self._access_token

        if not self.is_configured:
            raise ValueError("Lulu API credentials not configured")

        try:
            response = requests.post(
                self.auth_url,
                data={
                    "grant_type": "client_credentials"
                },
                auth=(self.api_key, self.api_secret),
                headers={
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                timeout=30
            )

            if response.status_code != 200:
                logger.error(f"Lulu auth failed: {response.status_code} - {response.text}")
                raise ValueError(f"Lulu authentication failed: {response.status_code}")

            data = response.json()
            self._access_token = data["access_token"]
            expires_in = data.get("expires_in", 3600)
            self._token_expires = datetime.now() + timedelta(seconds=expires_in)

            logger.info("Lulu access token obtained successfully")
            return self._access_token

        except requests.RequestException as e:
            logger.error(f"Lulu auth request failed: {e}")
            raise ValueError(f"Lulu authentication failed: {str(e)}")

    def _api_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Maak een authenticated API request naar Lulu.
        """
        token = self._get_access_token()
        url = f"{self.base_url}{endpoint}"

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        try:
            response = requests.request(
                method=method,
                url=url,
                json=data,
                params=params,
                headers=headers,
                timeout=60
            )

            if response.status_code >= 400:
                logger.error(f"Lulu API error: {response.status_code} - {response.text}")
                error_data = response.json() if response.text else {}
                raise ValueError(f"Lulu API error: {error_data.get('message', response.status_code)}")

            return response.json() if response.text else {}

        except requests.RequestException as e:
            logger.error(f"Lulu API request failed: {e}")
            raise ValueError(f"Lulu API request failed: {str(e)}")

    def get_sku_for_format(self, format_type: str = "square", cover_type: str = "hardcover") -> str:
        """
        Haal de juiste SKU op voor een boekformaat.

        Args:
            format_type: "square" (21x21cm) of "a4_landscape"
            cover_type: "hardcover" of "softcover"
        """
        if format_type == "square":
            return self.sku_square_hardcover if cover_type == "hardcover" else self.sku_square_softcover
        elif format_type == "a4_landscape":
            return self.sku_a4_landscape_hardcover if cover_type == "hardcover" else self.sku_a4_landscape_softcover
        else:
            # Default to square hardcover
            return self.sku_square_hardcover

    def calculate_print_cost(
        self,
        pod_package_id: str,
        page_count: int,
        quantity: int = 1,
        shipping_address: Optional[LuluShippingAddress] = None,
        shipping_level: str = "MAIL"
    ) -> Dict[str, Any]:
        """
        Bereken de printkosten voor een boek.

        Returns:
            Dict met print_cost, shipping_cost, total_cost en shipping_options
        """
        line_item = {
            "pod_package_id": pod_package_id,
            "page_count": page_count,
            "quantity": quantity
        }

        payload = {
            "line_items": [line_item],
            "shipping_level": shipping_level
        }

        if shipping_address:
            payload["shipping_address"] = {
                "name": shipping_address.name,
                "street1": shipping_address.street1,
                "city": shipping_address.city,
                "country_code": shipping_address.country_code,
                "postcode": shipping_address.postcode,
                "phone_number": shipping_address.phone_number
            }
            if shipping_address.street2:
                payload["shipping_address"]["street2"] = shipping_address.street2
            if shipping_address.state_code:
                payload["shipping_address"]["state_code"] = shipping_address.state_code

        try:
            result = self._api_request("POST", "/print-job-cost-calculations/", data=payload)
            return {
                "print_cost": result.get("total_cost_excl_tax", 0),
                "tax": result.get("total_tax", 0),
                "total_cost": result.get("total_cost_incl_tax", 0),
                "currency": result.get("currency", "EUR"),
                "shipping_cost": result.get("shipping_cost", 0),
                "line_items": result.get("line_item_costs", [])
            }
        except ValueError as e:
            logger.error(f"Cost calculation failed: {e}")
            return {"error": str(e)}

    def get_shipping_options(
        self,
        country_code: str,
        pod_package_id: str,
        page_count: int,
        quantity: int = 1,
        state_code: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Haal beschikbare verzendopties op voor een land.
        """
        params = {
            "country_code": country_code,
            "quantity": quantity,
            "pod_package_id": pod_package_id,
            "page_count": page_count
        }
        if state_code:
            params["state_code"] = state_code

        try:
            result = self._api_request("GET", "/shipping-options/", params=params)
            return result.get("shipping_options", [])
        except ValueError as e:
            logger.error(f"Shipping options failed: {e}")
            return []

    def validate_files(
        self,
        interior_url: str,
        cover_url: str,
        pod_package_id: str
    ) -> Dict[str, Any]:
        """
        Valideer PDF bestanden voordat je een order plaatst.
        """
        # Validate interior
        interior_result = self._api_request(
            "POST",
            "/print-job-files/validate/interior/",
            data={
                "source_url": interior_url,
                "pod_package_id": pod_package_id
            }
        )

        # Validate cover
        cover_result = self._api_request(
            "POST",
            "/print-job-files/validate/cover/",
            data={
                "source_url": cover_url,
                "pod_package_id": pod_package_id
            }
        )

        return {
            "interior_valid": interior_result.get("valid", False),
            "interior_errors": interior_result.get("errors", []),
            "cover_valid": cover_result.get("valid", False),
            "cover_errors": cover_result.get("errors", [])
        }

    def calculate_cover_dimensions(
        self,
        pod_package_id: str,
        page_count: int
    ) -> Dict[str, Any]:
        """
        Bereken de exacte cover afmetingen inclusief rug.

        Returns:
            Dict met width, height, spine_width (allemaal in inches)
        """
        try:
            result = self._api_request(
                "GET",
                f"/pod-packages/{pod_package_id}/cover-dimensions/",
                params={"page_count": page_count}
            )
            return {
                "width": result.get("width"),
                "height": result.get("height"),
                "spine_width": result.get("spine_width"),
                "bleed": 0.125  # Lulu standaard bleed in inches
            }
        except ValueError as e:
            logger.error(f"Cover dimensions failed: {e}")
            return {"error": str(e)}

    def create_print_job(
        self,
        book: LuluBookSpec,
        shipping_address: LuluShippingAddress,
        shipping_level: str = "MAIL",
        external_id: Optional[str] = None,
        contact_email: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Maak een print job (order) aan bij Lulu.

        Args:
            book: Boek specificaties
            shipping_address: Afleveradres
            shipping_level: Verzendmethode (MAIL, PRIORITY_MAIL, etc.)
            external_id: Optionele interne referentie
            contact_email: Email voor orderupdates

        Returns:
            Dict met order details inclusief id en status
        """
        payload = {
            "shipping_level": shipping_level,
            "shipping_address": {
                "name": shipping_address.name,
                "street1": shipping_address.street1,
                "city": shipping_address.city,
                "country_code": shipping_address.country_code,
                "postcode": shipping_address.postcode,
                "phone_number": shipping_address.phone_number
            },
            "line_items": [{
                "title": book.title,
                "cover": {"source_url": book.cover_url},
                "interior": {"source_url": book.interior_url},
                "pod_package_id": book.pod_package_id,
                "quantity": book.quantity
            }]
        }

        # Optional fields
        if shipping_address.street2:
            payload["shipping_address"]["street2"] = shipping_address.street2
        if shipping_address.state_code:
            payload["shipping_address"]["state_code"] = shipping_address.state_code
        if external_id:
            payload["external_id"] = external_id
        if contact_email:
            payload["contact_email"] = contact_email

        try:
            result = self._api_request("POST", "/print-jobs/", data=payload)
            logger.info(f"Lulu print job created: {result.get('id')}")
            return {
                "id": result.get("id"),
                "status": result.get("status", {}).get("name"),
                "created": result.get("date_created"),
                "line_items": result.get("line_items", []),
                "costs": result.get("costs", {})
            }
        except ValueError as e:
            logger.error(f"Print job creation failed: {e}")
            return {"error": str(e)}

    def get_print_job(self, job_id: str) -> Dict[str, Any]:
        """
        Haal status en details van een print job op.
        """
        try:
            result = self._api_request("GET", f"/print-jobs/{job_id}/")

            # Extract tracking info if shipped
            tracking = None
            if result.get("shipping_events"):
                shipped_event = next(
                    (e for e in result["shipping_events"] if e.get("type") == "SHIPPED"),
                    None
                )
                if shipped_event:
                    tracking = {
                        "carrier": shipped_event.get("carrier"),
                        "tracking_number": shipped_event.get("tracking_id"),
                        "tracking_url": shipped_event.get("tracking_url")
                    }

            return {
                "id": result.get("id"),
                "status": result.get("status", {}).get("name"),
                "status_message": result.get("status", {}).get("message"),
                "created": result.get("date_created"),
                "tracking": tracking,
                "costs": result.get("costs", {})
            }
        except ValueError as e:
            logger.error(f"Get print job failed: {e}")
            return {"error": str(e)}

    def list_print_jobs(
        self,
        page: int = 1,
        page_size: int = 10,
        status: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Lijst van print jobs ophalen.
        """
        params = {
            "page": page,
            "page_size": page_size
        }
        if status:
            params["status"] = status

        try:
            result = self._api_request("GET", "/print-jobs/", params=params)
            return {
                "count": result.get("count", 0),
                "jobs": result.get("results", [])
            }
        except ValueError as e:
            logger.error(f"List print jobs failed: {e}")
            return {"error": str(e), "jobs": []}

    def cancel_print_job(self, job_id: str) -> Dict[str, Any]:
        """
        Annuleer een print job (alleen mogelijk als nog niet in productie).
        """
        try:
            result = self._api_request("POST", f"/print-jobs/{job_id}/cancel/")
            return {"success": True, "status": result.get("status", {}).get("name")}
        except ValueError as e:
            logger.error(f"Cancel print job failed: {e}")
            return {"error": str(e), "success": False}


# Singleton instance
lulu_service = LuluService()
