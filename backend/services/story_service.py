"""
Story Service - Gepersonaliseerde verhaalgeneratie voor kinderboeken
Met verbeterde prompt op basis van de brand guide.

Ondersteunt:
- Leeftijdsgebaseerde verhaallengte (2-8 jaar)
- Meerdere verhalen genereren voor Peecho minimum pagina's
- Bundeling van verhalen voor print
"""

import os
import json
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

# Import Peecho format configuration
try:
    from backend.config.peecho_formats import (
        get_pages_per_story,
        calculate_stories_required,
        get_layout_group,
        get_layout_config,
        get_min_pages_for_cover_type,
        PAGES_PER_STORY_BY_AGE,
        EXTRA_BOOK_PAGES
    )
    PEECHO_FORMATS_AVAILABLE = True
except ImportError:
    PEECHO_FORMATS_AVAILABLE = False
    PAGES_PER_STORY_BY_AGE = {2: 8, 3: 10, 4: 12, 5: 14, 6: 16, 7: 18, 8: 20}
    EXTRA_BOOK_PAGES = 7

    def get_layout_group(age: int) -> str:
        if age <= 3:
            return "toddler"
        elif age <= 5:
            return "preschool"
        else:
            return "early_reader"

    def get_layout_config(age: int) -> dict:
        layout_group = get_layout_group(age)
        configs = {
            "toddler": {"layout_group": "toddler", "font_size": "22pt", "max_sentences": 2},
            "preschool": {"layout_group": "preschool", "font_size": "18pt", "max_sentences": 4},
            "early_reader": {"layout_group": "early_reader", "font_size": "14pt", "max_sentences": 6}
        }
        return configs.get(layout_group, configs["preschool"])

    def get_min_pages_for_cover_type(cover_type: str) -> int:
        return 24 if cover_type == "hardcover" else 20

# Lazy import van Google Generative AI
genai = None


def _load_genai():
    """Lazy load Google Generative AI module"""
    global genai
    if genai is None:
        import google.generativeai as gai
        genai = gai
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)


# Age category mapping (backwards compatible)
# Let op: 'pages' = aantal tekstblokken/scènes, niet PDF pagina's
# PDF pagina's = 7 + (tekstblokken × 2) met nieuwe layout
AGE_SETTINGS = {
    "2-3": {
        "name": "peuter",
        "pages": 9,  # 9 tekstblokken = 7 + 18 = 25 PDF pagina's (min 24 voor Lulu)
        "words_per_page": "30-50",
        "total_words": "50-200",
        "style": "Zeer korte zinnen (max 5-8 woorden). Veel herhaling en ritme. Eén eenvoudige verhaallijn, nauwelijks conflict."
    },
    "4-5": {
        "name": "kleuter",
        "pages": 10,  # 10 tekstblokken = 7 + 20 = 27 PDF pagina's
        "words_per_page": "40-80",
        "total_words": "200-600",
        "style": "Korte, eenvoudige maar gevarieerdere zinnen. Duidelijk begin – midden – eind. Klein probleem of misverstand, veilige oplossing."
    },
    "6-8": {
        "name": "kind",
        "pages": 12,  # 12 tekstblokken = 7 + 24 = 31 PDF pagina's
        "words_per_page": "80-150",
        "total_words": "600-1800",
        "style": "Langere zinnen en meer details. Helder conflict, ontwikkeling en oplossing. Meer gevoelens en gedachten van kind en knuffel."
    }
}

# Theme descriptions
THEME_DESCRIPTIONS = {
    "bedtijd_avontuur": "Rustig tempo, geen spanning aan het eind, eindigt altijd met veilig in bed gaan slapen.",
    "groot_avontuur": "Een reis of ontdekkingstocht; spannend maar nooit echt gevaarlijk of traumatisch.",
    "nieuwe_vriend": "Draait om kennismaken, misverstanden oplossen en samen iets leuks doen.",
    "dapper_zijn": "Kind of knuffel is ergens bang voor en overwint dat stap voor stap.",
    "magische_wereld": "Toegang tot een fantasiewereld; wonderlijk maar positief en veilig.",
    "seizoensavontuur": "Sfeer van lente/zomer/herfst/winter staat centraal.",
    "verjaardagsfeest": "Voorbereiding, spanning, verrassing, feestelijk einde.",
    "beter_worden": "Iemand voelt zich niet goed en wordt liefdevol verzorgd; troostend, geruststellend."
}


class StoryService:
    """Service voor het genereren van gepersonaliseerde kinderverhalen"""

    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self._model = None
        self._initialized = False

    def _ensure_initialized(self):
        """Lazy initialize Generative AI model"""
        if self._initialized:
            return
        if self.api_key:
            _load_genai()
            self._model = genai.GenerativeModel("gemini-2.0-flash")
            self._initialized = True

    @property
    def model(self):
        self._ensure_initialized()
        return self._model

    async def generate_story(
        self,
        child_name: str,
        toy_name: str,
        age_category: str = "4-5",
        theme: str = "bedtijd_avontuur",
        toy_description: str = "",
        child_nickname: Optional[str] = None,
        toy_personality: Optional[str] = None,
        family_members: Optional[list] = None,
        location_type: Optional[str] = None,
        theme_context: Optional[str] = None,
        book_length: Optional[str] = None,
        exact_age: Optional[int] = None
    ) -> dict:
        """
        Genereer een volledig gepersonaliseerd kinderverhaal.

        Args:
            exact_age: Exacte leeftijd (2-8) voor nauwkeurige pagina telling.
                       Als niet opgegeven, wordt afgeleid van age_category.
        """
        if not self.model:
            raise ValueError("GOOGLE_API_KEY niet geconfigureerd in .env")

        # Get age settings
        age_settings = AGE_SETTINGS.get(age_category, AGE_SETTINGS["4-5"])

        # Use exact age for page count if provided
        if exact_age is not None:
            pages = self.get_pages_for_exact_age(exact_age)
        else:
            # Fallback to age_settings pages
            pages = age_settings["pages"]

        # Adjust pages based on book_length
        if book_length == "kort":
            pages = max(4, pages - 2)
        elif book_length == "lang":
            pages = pages + 2

        # Build the prompt
        prompt = self._build_enhanced_prompt(
            child_name=child_name,
            toy_name=toy_name,
            toy_description=toy_description,
            age_category=age_category,
            age_settings=age_settings,
            theme=theme,
            pages=pages,
            child_nickname=child_nickname,
            toy_personality=toy_personality,
            family_members=family_members,
            location_type=location_type,
            theme_context=theme_context
        )

        # Generate the story
        response = self.model.generate_content(prompt)

        # Parse the response with layout_group based on age
        actual_age = exact_age if exact_age is not None else self._age_category_to_age(age_category)
        return self._parse_story_response(response.text, toy_description, actual_age)

    def _build_enhanced_prompt(
        self,
        child_name: str,
        toy_name: str,
        toy_description: str,
        age_category: str,
        age_settings: dict,
        theme: str,
        pages: int,
        child_nickname: Optional[str],
        toy_personality: Optional[str],
        family_members: Optional[list],
        location_type: Optional[str],
        theme_context: Optional[str]
    ) -> str:
        """Build the enhanced prompt based on the brand guide"""

        theme_desc = THEME_DESCRIPTIONS.get(theme, THEME_DESCRIPTIONS["bedtijd_avontuur"])

        # Build optional sections
        optional_sections = []

        if child_nickname:
            optional_sections.append(f"- Bijnaam kind: {child_nickname} (gebruik af en toe liefdevol in dialogen)")

        if toy_personality:
            optional_sections.append(f"- Persoonlijkheid knuffel: {toy_personality} (laat dit duidelijk terugkomen in gedrag)")
        else:
            optional_sections.append("- Persoonlijkheid knuffel: vriendelijk, behulpzaam en een beetje nieuwsgierig")

        if family_members and len(family_members) > 0:
            family_str = ", ".join([f"{m.get('name', '')} ({m.get('role', '')})" if isinstance(m, dict) else str(m) for m in family_members])
            optional_sections.append(f"- Familieleden: {family_str} (laat ze terugkomen als bijfiguren)")

        if location_type:
            location_map = {
                "stad": "in een gezellige stad",
                "dorp": "in een klein, knus dorp",
                "boerderij": "op een vriendelijke boerderij",
                "aan_zee": "in een kustplaatsje aan zee"
            }
            optional_sections.append(f"- Setting: {location_map.get(location_type, location_type)}")

        if theme_context:
            optional_sections.append(f"- Extra context/emotionele kern: {theme_context}")

        optional_text = "\n".join(optional_sections) if optional_sections else "Geen extra opties"

        return f"""Je bent een ervaren schrijver van kinderboeken voor kinderen van 2-8 jaar.
Je schrijft warme, veilige, duidelijke verhalen waarin de knuffel de hoofdrol speelt.

=== VERPLICHTE INVOER ===
- Kind: {child_name}
- Knuffel (HOOFDPERSOON): {toy_name}
- Beschrijving knuffel: {toy_description if toy_description else "een lieve, zachte knuffel"}
- Leeftijdscategorie: {age_category} jaar ({age_settings['name']})
- Thema: {theme}
- Taal: Nederlands

=== OPTIONELE INVOER ===
{optional_text}

=== STIJLRICHTLIJNEN VOOR {age_category} JAAR ===
{age_settings['style']}
- Aantal pagina's: {pages}
- Woorden per pagina: {age_settings['words_per_page']}

=== THEMA-INVULLING ===
{theme_desc}

=== ALGEMENE REGELS ===
1. De knuffel ({toy_name}) is ALTIJD het hoofdpersonage en de held van het verhaal
2. {child_name} is de eigenaar en mag voorkomen, maar is NIET de hoofdpersoon
3. Houd de toon altijd warm, veilig, positief en kindvriendelijk
4. Geen geweld, geen dood, geen enge of schokkende details
5. Sluit het verhaal af met een geruststellend, hoopvol gevoel
6. Elke pagina moet visueel te illustreren zijn
7. Gebruik veel zintuiglijke beschrijvingen (zacht, warm, knus, etc.)

=== OUTPUT FORMAAT (STRIKT VOLGEN) ===
Geef je antwoord in dit exacte formaat:

TITEL: [titel van het boek]

PAGINA 1:
TEKST: [tekst voor pagina 1]
SCÈNE: [beschrijving van wat geïllustreerd moet worden - beschrijf de knuffel, setting en actie]

PAGINA 2:
TEKST: [tekst voor pagina 2]
SCÈNE: [beschrijving van wat geïllustreerd moet worden]

[etc. voor alle {pages} pagina's]

Begin nu met schrijven:
"""

    def _age_category_to_age(self, age_category: str) -> int:
        """Convert age category string to representative age"""
        mapping = {
            "2-3": 3,
            "4-5": 5,
            "6-8": 7
        }
        return mapping.get(age_category, 5)

    def _parse_story_response(self, response: str, toy_description: str, age: int = 5) -> dict:
        """Parse de AI response naar een gestructureerd verhaal"""
        lines = response.strip().split("\n")

        # Get layout configuration for this age
        layout_config = get_layout_config(age)
        layout_group = layout_config["layout_group"]

        result = {
            "title": "",
            "pages": [],
            "layout_group": layout_group,
            "age": age
        }

        current_page = None
        current_section = None

        for line in lines:
            line = line.strip()

            if line.startswith("TITEL:"):
                result["title"] = line.replace("TITEL:", "").strip()

            elif line.startswith("PAGINA"):
                if current_page:
                    current_page["illustration_prompt"] = self._build_illustration_prompt(
                        current_page.get("scene", ""),
                        toy_description
                    )
                    result["pages"].append(current_page)

                try:
                    page_num = int(line.replace("PAGINA", "").replace(":", "").strip())
                except ValueError:
                    page_num = len(result["pages"]) + 1
                current_page = {
                    "page_number": page_num,
                    "text": "",
                    "scene": "",
                    "layout_group": layout_group  # Attach layout_group to each page
                }

            elif line.startswith("TEKST:"):
                current_section = "text"
                current_page["text"] = line.replace("TEKST:", "").strip()

            elif line.startswith("SCÈNE:") or line.startswith("SCENE:"):
                current_section = "scene"
                current_page["scene"] = line.replace("SCÈNE:", "").replace("SCENE:", "").strip()

            elif current_page and current_section and line:
                if current_section == "text":
                    current_page["text"] += " " + line
                elif current_section == "scene":
                    current_page["scene"] += " " + line

        # Add last page
        if current_page:
            current_page["illustration_prompt"] = self._build_illustration_prompt(
                current_page.get("scene", ""),
                toy_description
            )
            result["pages"].append(current_page)

        return result

    def _build_illustration_prompt(self, scene: str, toy_description: str) -> str:
        """Bouw een complete illustratie prompt"""
        return f"""Children's book illustration, warm watercolor style:

MAIN CHARACTER (EXACT appearance - do not change colors or features):
{toy_description if toy_description else "a cute, soft stuffed animal"}

CRITICAL: The main character must look EXACTLY as described above. Maintain precise colors, features, and appearance. The character must be identical in every illustration.

SCENE: {scene}

STYLE: Soft, warm colors. Cozy atmosphere. Child-friendly. Print quality.
Keep the main character's appearance 100% consistent with the description above.
"""

    def get_pages_for_exact_age(self, age: int) -> int:
        """
        Bepaal het aantal pagina's per verhaal voor een exacte leeftijd.

        Args:
            age: Exacte leeftijd (2-8)

        Returns:
            Aantal pagina's per verhaal
        """
        if PEECHO_FORMATS_AVAILABLE:
            return get_pages_per_story(age)

        # Fallback
        if age < 2:
            age = 2
        if age > 8:
            age = 8
        return PAGES_PER_STORY_BY_AGE.get(age, 12)

    def calculate_stories_for_print(
        self,
        age: int,
        min_pages: int = 24,
        cover_type: str = "hardcover"
    ) -> Dict[str, Any]:
        """
        Bereken hoeveel verhalen nodig zijn voor Peecho print.

        Args:
            age: Exacte leeftijd kind
            min_pages: Minimum pagina's vereist (default 24 voor hardcover)
            cover_type: "hardcover" (min 24) of "softcover" (min 20)

        Returns:
            {
                "pages_per_story": int,
                "stories_required": int,
                "final_page_count": int,
                "age": int
            }
        """
        if cover_type == "softcover":
            min_pages = max(min_pages, 20)
        else:
            min_pages = max(min_pages, 24)

        pages_per_story = self.get_pages_for_exact_age(age)

        if pages_per_story >= min_pages:
            return {
                "pages_per_story": pages_per_story,
                "stories_required": 1,
                "final_page_count": pages_per_story if pages_per_story % 2 == 0 else pages_per_story + 1,
                "age": age
            }

        import math
        stories_required = math.ceil(min_pages / pages_per_story)
        final_page_count = stories_required * pages_per_story

        # Zorg dat het even is
        if final_page_count % 2 != 0:
            final_page_count += 1

        return {
            "pages_per_story": pages_per_story,
            "stories_required": stories_required,
            "final_page_count": final_page_count,
            "age": age
        }

    async def generate_multiple_stories(
        self,
        count: int,
        child_name: str,
        toy_name: str,
        age: int,
        toy_description: str = "",
        themes: Optional[List[str]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Genereer meerdere verhalen voor één boek (voor jonge kinderen).

        Args:
            count: Aantal verhalen te genereren
            child_name: Naam van het kind
            toy_name: Naam van de knuffel
            age: Exacte leeftijd
            toy_description: Beschrijving knuffel
            themes: Optionele lijst met thema's (anders willekeurig)
            **kwargs: Extra parameters voor generate_story

        Returns:
            {
                "bundle_title": str,
                "stories": [story1, story2, ...],
                "total_pages": int,
                "age": int
            }
        """
        available_themes = list(THEME_DESCRIPTIONS.keys())

        # Selecteer thema's
        if themes:
            selected_themes = themes[:count]
            # Vul aan met willekeurige thema's indien nodig
            while len(selected_themes) < count:
                import random
                remaining = [t for t in available_themes if t not in selected_themes]
                if remaining:
                    selected_themes.append(random.choice(remaining))
                else:
                    selected_themes.append(random.choice(available_themes))
        else:
            import random
            selected_themes = random.sample(
                available_themes,
                min(count, len(available_themes))
            )
            while len(selected_themes) < count:
                selected_themes.append(random.choice(available_themes))

        # Converteer exacte leeftijd naar age_category
        if age <= 3:
            age_category = "2-3"
        elif age <= 5:
            age_category = "4-5"
        else:
            age_category = "6-8"

        stories = []
        for i, theme in enumerate(selected_themes):
            story = await self.generate_story(
                child_name=child_name,
                toy_name=toy_name,
                age_category=age_category,
                theme=theme,
                toy_description=toy_description,
                **kwargs
            )
            story["story_number"] = i + 1
            story["theme"] = theme
            stories.append(story)

        total_pages = sum(len(s["pages"]) for s in stories)

        # Genereer bundeltitel
        if count == 1:
            bundle_title = stories[0]["title"]
        elif count == 2:
            bundle_title = f"Twee Avonturen van {toy_name}"
        elif count == 3:
            bundle_title = f"Drie Avonturen van {toy_name}"
        else:
            bundle_title = f"De Avonturen van {toy_name}"

        return {
            "bundle_title": bundle_title,
            "stories": stories,
            "total_pages": total_pages,
            "story_count": count,
            "age": age,
            "themes_used": selected_themes
        }


# === Standalone test ===
if __name__ == "__main__":
    import asyncio

    async def test():
        service = StoryService()

        story = await service.generate_story(
            child_name="Emma",
            toy_name="Schaapje Suus",
            age_category="4-5",
            theme="bedtijd_avontuur",
            toy_description="Een wit, pluizig schaapje met roze oortjes",
            toy_personality="dromerig",
            theme_context="bang in het donker"
        )

        print(f"Titel: {story['title']}")
        print(f"Aantal pagina's: {len(story['pages'])}")
        for page in story['pages']:
            print(f"\n--- Pagina {page['page_number']} ---")
            print(f"Tekst: {page['text'][:100]}...")

    asyncio.run(test())
