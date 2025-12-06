"""
Book Structure Service - Genereer niet-verhaalpagina's voor Knuffelboek

Genereert:
- Cover (voor- en achterkant)
- Title page
- Eigendomspagina
- Colofon / laatste pagina

Alle output is in het Nederlands en volgt de Knuffelboek brand guide.
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import random


@dataclass
class StoryInfo:
    """Informatie over een verhaal voor de boekstructuur"""
    title: str
    page_count: int
    content_summary: str = ""
    theme: str = ""


@dataclass
class BookInput:
    """Input voor het genereren van de boekstructuur"""
    child_name: str
    child_age: int
    toy_name: str
    toy_description: str = ""
    theme: str = ""
    stories: List[StoryInfo] = None
    logo_url: str = "/logo.png"

    def __post_init__(self):
        if self.stories is None:
            self.stories = []


class BookStructureService:
    """
    Service voor het genereren van alle niet-verhaalpagina's van een Knuffelboek.

    Respecteert:
    - 10mm veilige marges (Peecho)
    - Nederlandse taal
    - Warme, vriendelijke tone-of-voice
    - Leeftijdsgeschikte tekst
    """

    # Leeftijdsspecifieke taalstijl
    AGE_STYLE = {
        2: {"complexity": "zeer eenvoudig", "words": "simpele woordjes"},
        3: {"complexity": "zeer eenvoudig", "words": "simpele woordjes"},
        4: {"complexity": "eenvoudig", "words": "korte zinnen"},
        5: {"complexity": "eenvoudig", "words": "korte zinnen"},
        6: {"complexity": "gemiddeld", "words": "langere zinnen"},
        7: {"complexity": "gevorderd", "words": "rijkere taal"},
        8: {"complexity": "gevorderd", "words": "rijkere taal"},
    }

    def __init__(self):
        self.copyright_year = "2025"
        self.website_url = "www.knuffelboek.nl"
        self.brand_name = "Knuffelboek"

    def generate_book_structure(self, book_input: BookInput) -> Dict[str, Any]:
        """
        Genereer de complete boekstructuur (exclusief verhaalinhoud).

        Args:
            book_input: BookInput object met alle benodigde gegevens

        Returns:
            Complete boekstructuur als dictionary
        """
        # Bepaal de hoofdtitel (van eerste verhaal of gegenereerd)
        main_title = self._get_main_title(book_input)

        return {
            "cover": self._generate_cover(book_input, main_title),
            "inside_front_cover": self._generate_inside_front_cover(),
            "title_page": self._generate_title_page(book_input, main_title),
            "ownership_page": self._generate_ownership_page(book_input),
            "stories_structure": self._generate_stories_structure(book_input),
            "back_cover": self._generate_back_cover(book_input),
            "final_page": self._generate_final_page(book_input),
            "metadata": {
                "child_name": book_input.child_name,
                "child_age": book_input.child_age,
                "toy_name": book_input.toy_name,
                "story_count": len(book_input.stories),
                "main_title": main_title
            }
        }

    def _get_main_title(self, book_input: BookInput) -> str:
        """Bepaal de hoofdtitel van het boek."""
        if book_input.stories and book_input.stories[0].title:
            return book_input.stories[0].title

        # Genereer een titel als er geen verhalen zijn
        title_templates = [
            f"De Avonturen van {book_input.toy_name}",
            f"{book_input.toy_name} en {book_input.child_name}",
            f"Het Grote Avontuur van {book_input.toy_name}",
            f"{book_input.toy_name}'s Magische Reis",
        ]
        return random.choice(title_templates)

    def _generate_cover(self, book_input: BookInput, main_title: str) -> Dict[str, Any]:
        """Genereer cover informatie."""
        # Subtitel op basis van leeftijd
        if book_input.child_age <= 3:
            subtitle = f"Een verhaal voor {book_input.child_name}"
        elif book_input.child_age <= 5:
            subtitle = f"Speciaal voor {book_input.child_name}"
        else:
            subtitle = f"Een avontuur met {book_input.child_name}"

        return {
            "title": main_title,
            "subtitle": subtitle,
            "illustration_prompt": self._generate_cover_illustration_prompt(book_input),
            "layout_notes": (
                "Titel gecentreerd, binnen 10mm marges. "
                "Knuffel centraal in beeld, geen achtergrond. "
                "Witruimte rondom de illustratie. "
                "Subtitel kleiner onder de titel."
            ),
            "logo_instructions": (
                "Logo linksboven of onderaan gecentreerd, subtiel. "
                "Niet groter dan 25mm breed. "
                "Binnen veilige marges (10mm van randen)."
            ),
            "title_font": "Nunito Bold",
            "title_size": "large",
            "safe_margins_mm": 10
        }

    def _generate_cover_illustration_prompt(self, book_input: BookInput) -> str:
        """Genereer illustratie prompt voor de cover."""
        base_prompt = f"""
Cover illustratie voor kinderboek:

HOOFDPERSONAGE:
{book_input.toy_description if book_input.toy_description else f"Een lieve knuffel genaamd {book_input.toy_name}"}

STIJL:
- Warme, zachte kleuren
- Kinderboekstijl, vriendelijk en uitnodigend
- Centrale compositie met veel witruimte
- GEEN achtergrond, alleen de knuffel
- Print-ready kwaliteit

COMPOSITIE:
- De knuffel staat of zit centraal
- Vriendelijke, uitnodigende pose
- Oogcontact met de kijker
- Ruimte boven en onder voor titel en subtitel

BELANGRIJK:
- Dit is NIET een kopie van de geüploade foto
- De knuffel moet in verhaalstijl worden getekend
- Consistente stijl met de binnenpagina's
"""
        return base_prompt.strip()

    def _generate_inside_front_cover(self) -> Dict[str, Any]:
        """Genereer binnenkaft links (meestal leeg of subtiel)."""
        return {
            "type": "blank_or_subtle",
            "content": None,
            "design_notes": (
                "Leeg of met subtiel patroon. "
                "Geen tekst. "
                "Zachte achtergrondkleur (wolwit #FFF9F1) toegestaan."
            )
        }

    def _generate_title_page(self, book_input: BookInput, main_title: str) -> Dict[str, Any]:
        """Genereer de title page."""
        subtitle = f"Gemaakt voor {book_input.child_name}, {book_input.child_age} jaar"

        return {
            "title": main_title,
            "subtitle": subtitle,
            "illustration_prompt": f"""
Kleine illustratie voor title page:

PERSONAGE:
{book_input.toy_description if book_input.toy_description else f"De knuffel {book_input.toy_name}"}

STIJL:
- Kleinere versie van de cover illustratie
- Zelfde stijl als cover
- Gecentreerd onder de titel
- Maximaal 1/3 van de pagina

SFEER:
- Vrolijk, uitnodigend
- Klaar voor avontuur
""",
            "logo_instructions": (
                "Knuffelboek logo onderaan de pagina, gecentreerd. "
                "Klein formaat (max 20mm breed). "
                "Binnen veilige marges."
            ),
            "layout": {
                "title_position": "top_third",
                "subtitle_position": "below_title",
                "illustration_position": "center",
                "logo_position": "bottom_center"
            },
            "fonts": {
                "title": "Nunito Bold",
                "subtitle": "Inter Regular"
            }
        }

    def _generate_ownership_page(self, book_input: BookInput) -> Dict[str, Any]:
        """Genereer de eigendomspagina ('Dit boek hoort toe aan...')."""
        text = f"""Dit boek hoort toe aan:
{book_input.child_name}

Met hun knuffel:
{book_input.toy_name}

Gemaakt via Knuffelboek
{self.website_url}"""

        return {
            "text": text,
            "illustration_prompt": f"""
Subtiele decoratieve illustratie voor eigendomspagina:

ELEMENTEN:
- Kleine versie van {book_input.toy_name}
- Decoratieve rand of frame (optioneel)
- Sterretjes of hartjes als accenten

STIJL:
- Licht en subtiel
- Niet afleidend van de tekst
- Zachte kleuren
- Ondersteunend, niet dominant

POSITIE:
- Kleine illustratie in hoek of onder de tekst
""",
            "layout": {
                "text_alignment": "center",
                "vertical_position": "center",
                "decorative_elements": True
            },
            "fonts": {
                "heading": "Nunito Bold",
                "names": "Nunito SemiBold",
                "footer": "Inter Regular"
            }
        }

    def _generate_stories_structure(self, book_input: BookInput) -> List[Dict[str, Any]]:
        """Genereer structuur voor elk verhaal (metadata, geen inhoud)."""
        stories_structure = []

        for i, story in enumerate(book_input.stories):
            story_structure = {
                "story_number": i + 1,
                "story_title": story.title,
                "page_count": story.page_count,
                "summary": story.content_summary,
                "theme": story.theme,
                "illustration_notes": self._generate_illustration_notes(book_input, story),
                "page_range": {
                    "start": self._calculate_page_start(i, book_input.stories),
                    "end": self._calculate_page_start(i, book_input.stories) + story.page_count - 1
                }
            }
            stories_structure.append(story_structure)

        return stories_structure

    def _calculate_page_start(self, story_index: int, stories: List[StoryInfo]) -> int:
        """Bereken de startpagina van een verhaal."""
        # Voorpagina's: cover(1) + inside front(1) + title(1) + ownership(1) = 4
        start_page = 5
        for i in range(story_index):
            start_page += stories[i].page_count
        return start_page

    def _generate_illustration_notes(self, book_input: BookInput, story: StoryInfo) -> List[str]:
        """Genereer illustratie-aanwijzingen per verhaal."""
        notes = [
            f"Hoofdpersonage: {book_input.toy_name} - consistent met cover en eerdere pagina's",
            f"Kind: {book_input.child_name} (indien in verhaal)",
            "Stijl: warm, zacht, kinderboek-achtig",
            "Kleuren: pasteltinten, niet te fel",
            f"Thema: {story.theme}" if story.theme else "Thema: algemeen avontuur",
        ]

        # Leeftijdsspecifieke aanwijzingen
        if book_input.child_age <= 3:
            notes.append("Illustraties: groot en duidelijk, weinig detail")
        elif book_input.child_age <= 5:
            notes.append("Illustraties: helder en kleurrijk, matige details")
        else:
            notes.append("Illustraties: rijker aan detail, meer achtergrond")

        return notes

    def _generate_back_cover(self, book_input: BookInput) -> Dict[str, Any]:
        """Genereer de achterkant van het boek."""
        # Persoonlijke tekst op basis van aantal verhalen
        if len(book_input.stories) == 1:
            story_text = "dit verhaal"
        elif len(book_input.stories) == 2:
            story_text = "deze twee verhalen"
        else:
            story_text = f"deze {len(book_input.stories)} verhalen"

        text = f"""Dit boekje is speciaal gemaakt voor {book_input.child_name} en hun knuffel {book_input.toy_name}.

In Knuffelboek komen de fantasie en liefde van kinderen voor hun knuffel tot leven. Elke pagina is uniek — net als hun avonturen samen.

Wil je een nieuw verhaal maken of extra boekjes bestellen?
Ga naar {self.website_url}"""

        return {
            "text": text,
            "silhouette_illustration_prompt": f"""
Subtiele silhouet-illustratie voor achterkant:

PERSONAGE:
- Silhouet of lichte schets van {book_input.toy_name}
- Zeer subtiel, niet dominant
- In hoek of onderaan

STIJL:
- Silhouet of lijn-art
- Zachte kleur (pastelblauw of saliegroen)
- Decoratief, niet afleidend

POSITIE:
- Onderaan rechts of links
- Klein formaat
- Buiten de tekstzone
""",
            "logo_instructions": (
                "Knuffelboek logo onderaan gecentreerd. "
                "Tekst 'gemaakt met Knuffelboek' eronder. "
                "Binnen veilige marges (10mm)."
            ),
            "cta_url": self.website_url,
            "qr_label": "Scan de QR-code om nieuwe avonturen te maken",
            "layout": {
                "text_alignment": "center",
                "text_position": "upper_half",
                "logo_position": "bottom_center",
                "qr_position": "bottom_right",
                "silhouette_position": "bottom_left"
            },
            "safe_margins_mm": 10
        }

    def _generate_final_page(self, book_input: BookInput) -> Dict[str, Any]:
        """Genereer de laatste pagina (colofon + CTA)."""
        cta_text = f"""Dankjewel dat je dit Knuffelboek hebt gelezen!

Maak nieuwe verhalen, ontdek nieuwe thema's of bestel extra boekjes op:
{self.website_url}

Gemaakt door Knuffelboek met behulp van liefde, creativiteit en AI."""

        return {
            "copyright": f"{self.brand_name} © {self.copyright_year}",
            "cta_text": cta_text,
            "qr_label": "Scan voor nieuwe avonturen",
            "logo_instructions": (
                "Knuffelboek logo bovenaan of centraal. "
                "Groter dan op andere pagina's (max 40mm). "
                "Prominente maar stijlvolle plaatsing."
            ),
            "url": self.website_url,
            "layout": {
                "logo_position": "top_center",
                "copyright_position": "bottom_center",
                "cta_position": "center",
                "qr_position": "below_cta"
            },
            "fonts": {
                "cta": "Inter Regular",
                "copyright": "Inter Light",
                "url": "Inter Medium"
            },
            "safe_margins_mm": 10
        }

    def generate_from_story_data(
        self,
        child_name: str,
        child_age: int,
        toy_name: str,
        toy_description: str = "",
        story_data: Dict[str, Any] = None,
        theme: str = ""
    ) -> Dict[str, Any]:
        """
        Convenience method om boekstructuur te genereren vanuit story_data.

        Args:
            child_name: Naam van het kind
            child_age: Leeftijd van het kind
            toy_name: Naam van de knuffel
            toy_description: Beschrijving van de knuffel
            story_data: Story data van StoryService
            theme: Thema van het verhaal

        Returns:
            Complete boekstructuur
        """
        stories = []

        if story_data:
            # Single story
            if "pages" in story_data:
                stories.append(StoryInfo(
                    title=story_data.get("title", f"Het Avontuur van {toy_name}"),
                    page_count=len(story_data.get("pages", [])),
                    content_summary=story_data.get("summary", ""),
                    theme=theme
                ))
            # Multiple stories (bundle)
            elif "stories" in story_data:
                for s in story_data["stories"]:
                    stories.append(StoryInfo(
                        title=s.get("title", ""),
                        page_count=len(s.get("pages", [])),
                        content_summary=s.get("summary", ""),
                        theme=s.get("theme", "")
                    ))

        book_input = BookInput(
            child_name=child_name,
            child_age=child_age,
            toy_name=toy_name,
            toy_description=toy_description,
            theme=theme,
            stories=stories
        )

        return self.generate_book_structure(book_input)


# Singleton instance
book_structure_service = BookStructureService()


# === Test ===
if __name__ == "__main__":
    # Test de service
    test_input = BookInput(
        child_name="Emma",
        child_age=4,
        toy_name="Knuffelbeer Bruno",
        toy_description="Een bruine teddybeer met een rode strik",
        theme="vriendschap",
        stories=[
            StoryInfo(
                title="Bruno's Grote Avontuur",
                page_count=12,
                content_summary="Bruno gaat op avontuur in het bos en maakt nieuwe vrienden.",
                theme="vriendschap"
            )
        ]
    )

    service = BookStructureService()
    structure = service.generate_book_structure(test_input)

    import json
    print(json.dumps(structure, indent=2, ensure_ascii=False))
