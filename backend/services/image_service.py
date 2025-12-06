"""
Image Service - Beeldverwerking voor knuffelfoto's
"""

import httpx
import base64
from io import BytesIO
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()


class ImageService:
    """Service voor beeldverwerking van knuffelfoto's"""
    
    def __init__(self):
        self.removebg_api_key = os.getenv("REMOVEBG_API_KEY")
        self.removebg_url = "https://api.remove.bg/v1.0/removebg"
    
    async def remove_background(self, image_bytes: bytes) -> bytes:
        """
        Verwijder de achtergrond van een knuffelfoto.
        
        Gebruikt remove.bg API voor nauwkeurige achtergrondverwijdering.
        Retourneert een PNG met transparante achtergrond.
        
        Args:
            image_bytes: De originele afbeelding als bytes
            
        Returns:
            PNG bytes met transparante achtergrond
        """
        if not self.removebg_api_key:
            raise ValueError("REMOVEBG_API_KEY niet geconfigureerd in .env")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.removebg_url,
                files={"image_file": ("knuffel.jpg", image_bytes, "image/jpeg")},
                data={"size": "regular", "format": "png"},
                headers={"X-Api-Key": self.removebg_api_key},
                timeout=30.0
            )
            
            if response.status_code == 200:
                return response.content
            else:
                error_detail = response.json().get("errors", [{}])[0].get("title", "Unknown error")
                raise Exception(f"Remove.bg API error: {error_detail}")
    
    def resize_for_print(self, image_bytes: bytes, dpi: int = 300, max_width_inch: float = 8.0) -> bytes:
        """
        Resize afbeelding voor print kwaliteit.
        
        Args:
            image_bytes: De afbeelding als bytes
            dpi: Dots per inch voor print (standaard 300)
            max_width_inch: Maximale breedte in inches
            
        Returns:
            Geresizede afbeelding als bytes
        """
        img = Image.open(BytesIO(image_bytes))
        
        # Bereken target pixels
        max_width_px = int(max_width_inch * dpi)
        
        # Resize met behoud van aspect ratio
        if img.width > max_width_px:
            ratio = max_width_px / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width_px, new_height), Image.Resampling.LANCZOS)
        
        # Converteer naar bytes
        output = BytesIO()
        img.save(output, format="PNG", dpi=(dpi, dpi))
        return output.getvalue()
    
    def to_base64(self, image_bytes: bytes) -> str:
        """Converteer afbeelding naar base64 string"""
        return base64.b64encode(image_bytes).decode("utf-8")
    
    def from_base64(self, base64_string: str) -> bytes:
        """Converteer base64 string naar afbeelding bytes"""
        return base64.b64decode(base64_string)
    
    def validate_image(self, image_bytes: bytes) -> dict:
        """
        Valideer een afbeelding voor verwerking.
        
        Returns:
            Dict met validatie resultaten (is_valid, width, height, format, issues)
        """
        try:
            img = Image.open(BytesIO(image_bytes))
            
            issues = []
            
            # Check minimum resolutie
            if img.width < 500 or img.height < 500:
                issues.append("Afbeelding heeft te lage resolutie (minimaal 500x500)")
            
            # Check maximum bestandsgrootte (10MB)
            if len(image_bytes) > 10 * 1024 * 1024:
                issues.append("Bestand is te groot (maximaal 10MB)")
            
            # Check formaat
            if img.format not in ["JPEG", "PNG", "WEBP"]:
                issues.append(f"Onondersteund formaat: {img.format}")
            
            return {
                "is_valid": len(issues) == 0,
                "width": img.width,
                "height": img.height,
                "format": img.format,
                "issues": issues
            }
            
        except Exception as e:
            return {
                "is_valid": False,
                "width": 0,
                "height": 0,
                "format": None,
                "issues": [f"Kon afbeelding niet lezen: {str(e)}"]
            }
