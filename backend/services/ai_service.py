"""
AI Service - Google Generative AI integratie voor Gemini + Vertex AI
"""

import os
import re
import base64
import json
import time
import asyncio
import logging
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Lazy imports
genai = None
genai_client = None
genai_types = None
vertex_model = None

# Vertex AI config
VERTEX_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT", "knuffelboek-app")
VERTEX_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", os.getenv("VERTEX_LOCATION", "us-central1"))


def _load_genai():
    """Lazy load Google Generative AI module"""
    global genai
    if genai is None:
        import google.generativeai as gai
        genai = gai
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)


def _load_genai_client():
    """Lazy load new Google GenAI client for image generation"""
    global genai_client, genai_types
    if genai_client is None:
        from google import genai as new_genai
        from google.genai import types
        genai_client = new_genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
        genai_types = types


def _load_vertex_ai():
    """Lazy load Vertex AI for Imagen"""
    global vertex_model
    if vertex_model is None:
        import vertexai
        from vertexai.preview.vision_models import ImageGenerationModel
        vertexai.init(project=VERTEX_PROJECT, location=VERTEX_LOCATION)
        vertex_model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-002")
        logger.info(f"Vertex AI initialized with project={VERTEX_PROJECT}, location={VERTEX_LOCATION}")


class AIService:
    """Service voor AI-gegenereerde content via Google Generative AI + Vertex AI"""

    # Image generation models in order of preference (fallback from Vertex AI)
    IMAGE_MODELS = [
        'gemini-3-pro-image-preview',      # Nano Banana Pro - highest quality
        'nano-banana-pro-preview',          # Alias for Nano Banana Pro
        'gemini-2.5-flash-image',           # Nano Banana stable - good balance
        'gemini-2.5-flash-image-preview',   # Nano Banana preview
    ]

    def __init__(self, use_vertex: bool = True):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.use_vertex = use_vertex  # Prefer Vertex AI for image generation
        self._gemini_model = None
        self._initialized = False
        self._working_image_model = None  # Cache for working model

    def _ensure_initialized(self):
        """Lazy initialize Generative AI models"""
        if self._initialized:
            return
        if self.api_key:
            _load_genai()
            self._gemini_model = genai.GenerativeModel("gemini-2.0-flash")
            self._initialized = True

    @property
    def gemini_model(self):
        self._ensure_initialized()
        return self._gemini_model

    async def analyze_toy(self, image_bytes: bytes) -> dict:
        """
        Analyseer een knuffelfoto en genereer een gedetailleerde beschrijving.

        Gebruikt Gemini 1.5 Flash voor multimodale analyse.

        Args:
            image_bytes: Afbeelding van de knuffel als bytes

        Returns:
            Dict met description, colors, type, unique_features
        """
        if not self.gemini_model:
            raise ValueError("GOOGLE_API_KEY niet geconfigureerd in .env")

        # Detecteer het mime type
        mime_type = "image/jpeg"
        if image_bytes[:8] == b'\x89PNG\r\n\x1a\n':
            mime_type = "image/png"

        # Maak een image part voor Gemini
        image_part = {
            "mime_type": mime_type,
            "data": base64.b64encode(image_bytes).decode("utf-8")
        }

        prompt = """Analyseer deze knuffel/speelgoeddier en geef een gedetailleerde beschrijving.

Je antwoord MOET valide JSON zijn in exact dit formaat:
{
    "description": "Een uitgebreide beschrijving van de knuffel in 2-3 zinnen, geschikt voor gebruik in een image generation prompt. Beschrijf textuur, materiaal, houding en algemene uitstraling.",
    "colors": ["lijst", "van", "kleuren"],
    "type": "het type dier of karakter (bijv: teddybeer, konijn, eenhoorn, robot)",
    "unique_features": ["lijst van unieke kenmerken zoals: scheef oortje, hart op buik, versleten vachtje, etc."]
}

Focus op details die helpen om deze SPECIFIEKE knuffel te herkennen en na te maken in illustraties.
Wees zeer precies over kleuren, patronen en onderscheidende kenmerken.
"""

        response = self.gemini_model.generate_content([image_part, prompt])
        response_text = response.text

        # Parse JSON response
        try:
            # Verwijder eventuele markdown code blocks
            json_str = response_text.strip()
            if json_str.startswith("```"):
                json_str = json_str.split("```")[1]
                if json_str.startswith("json"):
                    json_str = json_str[4:]

            return json.loads(json_str)
        except json.JSONDecodeError:
            # Fallback als JSON parsing faalt
            return {
                "description": response_text,
                "colors": [],
                "type": "knuffel",
                "unique_features": []
            }

    async def _generate_with_vertex(self, prompt: str) -> Optional[str]:
        """Generate image using Vertex AI Imagen 3"""
        try:
            _load_vertex_ai()
            logger.info("Generating image with Vertex AI Imagen 3...")

            # Run in executor since Vertex AI SDK is synchronous
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: vertex_model.generate_images(
                    prompt=prompt,
                    number_of_images=1,
                    aspect_ratio="1:1",
                    safety_filter_level="block_some",
                    person_generation="allow_adult",
                )
            )

            if response.images:
                image_bytes = response.images[0]._image_bytes
                logger.info("Successfully generated image with Vertex AI")
                return base64.b64encode(image_bytes).decode('utf-8')

            logger.warning("Vertex AI returned no images")
            return None

        except Exception as e:
            logger.warning(f"Vertex AI failed: {e}")
            return None

    async def _generate_with_gemini(self, prompt: str, reference_image: Optional[bytes] = None) -> str:
        """Fallback to Gemini API for image generation"""
        _load_genai_client()

        max_retries = 5
        base_delay = 3.0

        # Determine which models to try
        if self._working_image_model:
            models_to_try = [self._working_image_model] + [m for m in self.IMAGE_MODELS if m != self._working_image_model]
        else:
            models_to_try = self.IMAGE_MODELS.copy()

        last_error = None

        # Build contents with optional reference image
        if reference_image:
            # Detect mime type
            mime_type = "image/jpeg"
            if reference_image[:8] == b'\x89PNG\r\n\x1a\n':
                mime_type = "image/png"

            contents = [
                genai_types.Part.from_bytes(data=reference_image, mime_type=mime_type),
                prompt
            ]
            logger.info("Including reference image in generation request")
        else:
            contents = prompt

        for model_name in models_to_try:
            for attempt in range(max_retries):
                try:
                    logger.info(f"Trying image generation with {model_name} (attempt {attempt + 1})")

                    response = genai_client.models.generate_content(
                        model=model_name,
                        contents=contents,
                        config=genai_types.GenerateContentConfig(
                            response_modalities=['IMAGE', 'TEXT']
                        )
                    )

                    # Extract image from response
                    for part in response.candidates[0].content.parts:
                        if part.inline_data:
                            self._working_image_model = model_name
                            logger.info(f"Successfully generated image with {model_name}")
                            return base64.b64encode(part.inline_data.data).decode('utf-8')

                    raise ValueError("Geen afbeelding gegenereerd door het model")

                except Exception as e:
                    error_msg = str(e)
                    last_error = e

                    if "503" in error_msg or "UNAVAILABLE" in error_msg or "overloaded" in error_msg.lower():
                        logger.warning(f"Model {model_name} unavailable, trying next model...")
                        break

                    if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                        wait_time = base_delay * (2 ** attempt)
                        match = re.search(r'retry in (\d+\.?\d*)s', error_msg)
                        if match:
                            wait_time = float(match.group(1)) + 0.5

                        if attempt < max_retries - 1:
                            logger.warning(f"Rate limited on {model_name} (attempt {attempt + 1}/{max_retries}). Waiting {wait_time:.1f}s...")
                            await asyncio.sleep(wait_time)
                            continue
                        else:
                            logger.warning(f"Max retries reached for {model_name}, trying next model...")
                            break

                    logger.error(f"Error with {model_name}: {error_msg}")
                    break

        raise last_error or ValueError("Alle image modellen zijn niet beschikbaar")

    async def generate_illustration(
        self,
        toy_description: str,
        scene: str,
        style: str = "warm watercolor style, children's book illustration, soft lighting",
        reference_image: Optional[bytes] = None,
        preferred_model: Optional[str] = None,
        child_description: Optional[str] = None
    ) -> dict:
        """
        Genereer een illustratie van de knuffel in een scène.

        Probeert eerst Vertex AI (Imagen 3), valt terug op Gemini API.

        Args:
            toy_description: Gedetailleerde beschrijving van de knuffel
            scene: Beschrijving van de scène
            style: Illustratiestijl
            reference_image: Optioneel: referentie-afbeelding
            preferred_model: Optioneel: forceer gebruik van specifiek model
            child_description: Optioneel: beschrijving van het kind voor consistentie

        Returns:
            Dict met image_url en model_used
        """
        # Build child character section if provided
        child_section = ""
        if child_description:
            child_section = f"""
CHILD CHARACTER (must appear consistently in all illustrations):
{child_description}
IMPORTANT: The child must look exactly the same in every illustration - same hair color, skin tone, and general appearance.
"""
            logger.info(f"Including child description in prompt: {child_description}")

        # Build prompt based on whether we have a reference image
        if reference_image:
            # When we have a reference image, the prompt focuses on using it
            prompt = f"""Look at this photo of a stuffed toy/plush. Create an image featuring this EXACT toy as the main character.

CRITICAL STYLE REQUIREMENT - THIS IS THE MOST IMPORTANT INSTRUCTION:
{style}

IMPORTANT: The toy in your image must look EXACTLY like the one in the photo - same colors, same features, same proportions. This is the reference for how the character should look.
{child_section}
SCENE TO ILLUSTRATE:
{scene}

ADDITIONAL REQUIREMENTS:
- Cozy and friendly atmosphere
- High quality, print-ready
- No text or words in the image
- The toy must be recognizable as the same character from the photo
"""
            logger.info("Using reference image for illustration generation")
        else:
            # Without reference image, rely on description
            prompt = f"""Create an image with the following requirements:

CRITICAL STYLE REQUIREMENT - THIS IS THE MOST IMPORTANT INSTRUCTION:
{style}

MAIN CHARACTER (must be prominent, recognizable, and EXACTLY match this description):
{toy_description}

CRITICAL: The main character's colors, features, and appearance must EXACTLY match the description above. Do not change or alter any colors or features. The character must look identical in every illustration.
{child_section}
SCENE:
{scene}

ADDITIONAL REQUIREMENTS:
- Cozy and friendly atmosphere
- High quality, print-ready
- No text or words in the image
- IMPORTANT: Keep the main character's appearance 100% consistent with the description
"""

        # When we have a reference image, prefer Gemini (supports image input)
        # Vertex AI Imagen doesn't support reference images as well
        if reference_image:
            if not self.api_key:
                raise ValueError("GOOGLE_API_KEY niet geconfigureerd in .env")
            result = await self._generate_with_gemini(prompt, reference_image)
            return {"image_url": result, "model_used": self._working_image_model or "Gemini"}

        # If preferred model is specified, try that first but allow fallback
        if preferred_model == "vertex":
            result = await self._generate_with_vertex(prompt)
            if result:
                return {"image_url": result, "model_used": "Vertex AI Imagen 3"}
            logger.warning("Preferred model Vertex AI failed, falling back to Gemini...")
        elif preferred_model == "gemini":
            try:
                result = await self._generate_with_gemini(prompt)
                return {"image_url": result, "model_used": self._working_image_model or "Gemini"}
            except Exception as e:
                logger.warning(f"Preferred model Gemini failed: {e}, trying Vertex AI...")
                if self.use_vertex:
                    result = await self._generate_with_vertex(prompt)
                    if result:
                        return {"image_url": result, "model_used": "Vertex AI Imagen 3"}
                raise

        # Try Vertex AI first if enabled
        if self.use_vertex:
            result = await self._generate_with_vertex(prompt)
            if result:
                return {"image_url": result, "model_used": "Vertex AI Imagen 3"}
            logger.info("Falling back to Gemini API...")

        # Fallback to Gemini API
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY niet geconfigureerd in .env")

        result = await self._generate_with_gemini(prompt)
        return {"image_url": result, "model_used": self._working_image_model or "Gemini"}

    async def generate_page_illustration(
        self,
        toy_description: str,
        page_text: str,
        page_number: int,
        total_pages: int,
        previous_scenes: list[str] = None
    ) -> str:
        """
        Genereer een illustratie voor een specifieke boekpagina.

        Args:
            toy_description: Beschrijving van de knuffel
            page_text: De tekst die op deze pagina staat
            page_number: Huidige paginanummer
            total_pages: Totaal aantal pagina's
            previous_scenes: Beschrijvingen van eerdere scènes voor consistentie

        Returns:
            Base64 encoded PNG
        """
        if not self.gemini_model:
            raise ValueError("GOOGLE_API_KEY niet geconfigureerd in .env")

        # Laat Gemini eerst een scène-beschrijving genereren
        scene_prompt = f"""Je bent een illustrator voor kinderboeken.

Gegeven deze tekst voor pagina {page_number} van {total_pages}:
"{page_text}"

En dit hoofdpersonage (een knuffel):
{toy_description}

Beschrijf in 1-2 zinnen welke scène geïllustreerd moet worden.
Focus op: setting, actie van de knuffel, sfeer/belichting, en eventuele bijfiguren.
Houd het kindvriendelijk en warm.
"""

        response = self.gemini_model.generate_content(scene_prompt)
        scene_description = response.text

        # Genereer de illustratie
        return await self.generate_illustration(
            toy_description=toy_description,
            scene=scene_description,
            style="warm watercolor, children's book illustration, soft colors, cozy atmosphere"
        )


# === Standalone test ===
if __name__ == "__main__":
    import asyncio

    async def test():
        service = AIService()

        # Test met een test afbeelding
        print("API key configured:", bool(service.api_key))

    asyncio.run(test())
