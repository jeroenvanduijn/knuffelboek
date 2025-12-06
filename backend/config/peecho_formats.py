"""
Peecho Book Formats Configuration

Dit bestand bevat alle configuratie voor Peecho boekformaten,
aanleverspecificaties, validatie en selectie-algoritme.

Gegenereerd op basis van Peecho specificaties voor kinderboeken.
"""

from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from enum import Enum
import math


# =============================================================================
# SECTION 1 — BOOK_FORMATS_JSON
# =============================================================================

BOOK_FORMATS = [
    # Square Small - Hardcover
    {
        "id": "square_small_hardcover",
        "name": "Square Small Hardcover",
        "orientation": "square",
        "width_mm": 210,
        "height_mm": 210,
        "cover_type": "hardcover",
        "min_pages": 24,
        "max_pages": 504,
        "notes": "Ideaal voor peuters en kleuters (2-4 jaar). Stevige hardcover, vierkant formaat past goed bij grote illustraties."
    },
    # Square Small - Softcover
    {
        "id": "square_small_softcover",
        "name": "Square Small Softcover",
        "orientation": "square",
        "width_mm": 210,
        "height_mm": 210,
        "cover_type": "softcover",
        "min_pages": 20,
        "max_pages": 300,
        "notes": "Lichtere versie van Square Small. Geschikt voor budget-optie of proefdrukken."
    },
    # A5 Portrait - Hardcover
    {
        "id": "a5_portrait_hardcover",
        "name": "A5 Portrait Hardcover",
        "orientation": "portrait",
        "width_mm": 148,
        "height_mm": 210,
        "cover_type": "hardcover",
        "min_pages": 24,
        "max_pages": 504,
        "notes": "Compact formaat, goed voor kinderen 5-6 jaar. Past in kinderhanden."
    },
    # A5 Portrait - Softcover
    {
        "id": "a5_portrait_softcover",
        "name": "A5 Portrait Softcover",
        "orientation": "portrait",
        "width_mm": 148,
        "height_mm": 210,
        "cover_type": "softcover",
        "min_pages": 20,
        "max_pages": 300,
        "notes": "Lichtgewicht A5 optie voor oudere kinderen."
    },
    # A4 Portrait - Hardcover
    {
        "id": "a4_portrait_hardcover",
        "name": "A4 Portrait Hardcover",
        "orientation": "portrait",
        "width_mm": 210,
        "height_mm": 297,
        "cover_type": "hardcover",
        "min_pages": 24,
        "max_pages": 504,
        "notes": "Premium groot formaat. Ideaal voor kinderen 7-8 jaar met langere verhalen."
    },
    # A4 Portrait - Softcover
    {
        "id": "a4_portrait_softcover",
        "name": "A4 Portrait Softcover",
        "orientation": "portrait",
        "width_mm": 210,
        "height_mm": 297,
        "cover_type": "softcover",
        "min_pages": 20,
        "max_pages": 300,
        "notes": "Groot formaat softcover, geschikt voor schoolprojecten of budget A4 boeken."
    }
]


# =============================================================================
# SECTION 2 — DELIVERY_REQUIREMENTS_JSON
# =============================================================================

DELIVERY_REQUIREMENTS = {
    "pdf_format": {
        "standard": "PDF/X-4",
        "color_profile_recommended": "Coated FOGRA39",
        "color_mode": "RGB recommended, CMYK allowed",
        "notes": "Peecho converteert automatisch naar drukformaat"
    },
    "bleed_and_trim": {
        "include_bleed": False,
        "include_trim_marks": False,
        "notes": "Peecho genereert zelf bleed. Lever aan zonder bleed/trim marks."
    },
    "resolution": {
        "minimum_dpi": 300,
        "recommended_dpi": 300,
        "notes": "Alle afbeeldingen moeten minimaal 300 dpi zijn voor scherpe print."
    },
    "margins": {
        "safe_margin_mm": 10,
        "notes": "Houd 10mm veilige marge aan alle zijden voor belangrijke content."
    },
    "fonts": {
        "embedded": True,
        "notes": "Alle lettertypes moeten volledig embedded zijn in de PDF."
    },
    "transparency": {
        "flattened": True,
        "notes": "Transparantie moet worden geflattened voor correcte weergave."
    },
    "page_count": {
        "must_be_even": True,
        "odd_page_handling": "Peecho voegt automatisch blanco pagina toe bij oneven aantal.",
        "notes": "Lever altijd een even aantal pagina's aan."
    },
    "cover_handling": {
        "hardcover": {
            "includes_endpapers": True,
            "endpaper_color": "white",
            "notes": "Hardcover bevat witte schutbladen aan voor- en achterzijde."
        },
        "softcover": {
            "includes_endpapers": False,
            "notes": "Softcover heeft geen schutbladen."
        }
    },
    "file_structure": {
        "order": [
            "front_cover",
            "inside_pages",
            "back_cover"
        ],
        "single_pdf": True,
        "notes": "Lever alles aan in één PDF in de juiste volgorde."
    }
}


# =============================================================================
# SECTION 3 — VALIDATION_LOGIC
# =============================================================================

VALIDATION_STEPS = """
VALIDATIE STAPPEN VOOR PEECHO PDF AANLEVERING:

1. PAGINA TELLING VALIDATIE
   - Tel totaal aantal pagina's in PDF
   - Controleer: pagina_count >= format.min_pages
   - Controleer: pagina_count <= format.max_pages
   - Controleer: pagina_count % 2 == 0 (even aantal)
   - Bij oneven: waarschuw gebruiker dat Peecho blanco pagina toevoegt

2. PDF STRUCTUUR VALIDATIE
   - Controleer: PDF versie is compatibel (1.4+)
   - Controleer: PDF is niet encrypted/beveiligd
   - Controleer: PDF opent zonder errors
   - Controleer: Alle pagina's zijn leesbaar

3. RESOLUTIE VALIDATIE
   - Extract alle embedded afbeeldingen uit PDF
   - Voor elke afbeelding:
     - Bereken effectieve DPI = (pixels / inches_in_print)
     - Controleer: DPI >= 300
   - Genereer waarschuwing voor afbeeldingen < 300 DPI

4. MARGES VALIDATIE
   - Voor elke pagina:
     - Analyseer content bounds
     - Controleer: geen essentiële content binnen 10mm van rand
   - Genereer waarschuwing als content te dicht bij rand staat

5. KLEURPROFIEL VALIDATIE
   - Extract kleurprofiel uit PDF
   - Accepteer: RGB, sRGB, Adobe RGB
   - Accepteer: CMYK, Coated FOGRA39
   - Waarschuw bij: geen profiel / onbekend profiel

6. LETTERTYPE VALIDATIE
   - Extract alle fonts uit PDF
   - Controleer: elke font is "embedded" of "subset embedded"
   - Fout bij: niet-embedded fonts

7. TRANSPARANTIE VALIDATIE
   - Scan PDF voor transparantie objecten
   - Indien transparantie aanwezig:
     - Controleer of PDF/X-4 compatible
     - Of waarschuw dat flattening nodig is

8. COVER VOLGORDE VALIDATIE
   - Pagina 1 = front cover
   - Pagina 2 t/m (n-1) = binnenwerk
   - Pagina n = back cover
   - Controleer dat covers volledige afloop hebben tot rand

VALIDATIE OUTPUT:
{
    "valid": true/false,
    "errors": [...],      // Blokkerende fouten
    "warnings": [...],    // Niet-blokkerende waarschuwingen
    "page_count": n,
    "resolution_ok": true/false,
    "fonts_embedded": true/false,
    "color_profile": "..."
}
"""


# =============================================================================
# SECTION 4 — SELECTION_ALGORITHM
# =============================================================================

# Verwacht aantal tekstblokken (scènes) per verhaal per leeftijd
# Layout-afhankelijke pagina berekening:
# - toddler (2-3): pages_per_block = 2 (spread) → 6 + (blokken × 2) >= 24 → min 9 blokken
# - preschool (4-5): pages_per_block = 1 → 6 + (blokken × 1) >= 24 → min 18 blokken
# - early_reader (6-8): pages_per_block = 1 → 6 + (blokken × 1) >= 24 → min 18 blokken
PAGES_PER_STORY_BY_AGE = {
    2: 9,   # Toddler: 9 blokken × 2 = 18 + 6 = 24 pagina's → minimum
    3: 9,   # Toddler: 9 blokken × 2 = 18 + 6 = 24 pagina's → minimum
    4: 18,  # Preschool: 18 blokken × 1 = 18 + 6 = 24 pagina's → minimum
    5: 18,  # Preschool: 18 blokken × 1 = 18 + 6 = 24 pagina's → minimum
    6: 20,  # Early reader: 20 blokken × 1 = 20 + 6 = 26 pagina's
    7: 20,  # Early reader: 20 blokken × 1 = 20 + 6 = 26 pagina's
    8: 22,  # Early reader: 22 blokken × 1 = 22 + 6 = 28 pagina's
}

# Aanbevolen formaat per leeftijd
RECOMMENDED_FORMAT_BY_AGE = {
    2: "square",    # Vierkant, groot, makkelijk vast te houden
    3: "square",    # Vierkant blijft ideaal
    4: "square",    # Nog steeds vierkant
    5: "portrait",  # A5 Portrait - past in handen
    6: "portrait",  # A5 Portrait
    7: "portrait",  # A4 Portrait voor langere verhalen
    8: "portrait",  # A4 Portrait premium
}


def get_pages_per_story(age: int) -> int:
    """Bepaal verwacht aantal pagina's per verhaal voor leeftijd."""
    if age < 2:
        age = 2
    if age > 8:
        age = 8
    return PAGES_PER_STORY_BY_AGE.get(age, 12)


# =============================================================================
# LAYOUT GROUPS - Leeftijdsgebaseerde layout logica
# =============================================================================

def get_layout_group(age: int) -> str:
    """
    Bepaal de layout groep op basis van exacte leeftijd.

    Layout groepen:
    - toddler (2-3 jaar): Spread met illustratie links, tekst rechts
    - preschool (4-5 jaar): Tekst en afbeelding op dezelfde pagina
    - early_reader (6-8 jaar): Tekst overlay op illustratie

    Args:
        age: Exacte leeftijd (2-8)

    Returns:
        Layout groep string: "toddler", "preschool", of "early_reader"
    """
    if age <= 3:
        return "toddler"
    elif age <= 5:
        return "preschool"
    else:
        return "early_reader"


# Layout configuratie per groep
LAYOUT_CONFIG = {
    "toddler": {
        "description": "2-page spread: illustratie links (paginavullend), tekst rechts (groot font)",
        "text_position": "separate_page",
        "font_size": "22pt",
        "max_sentences": 2,
        "text_on_illustration": False,
        "pages_per_block": 2,  # 1 illustratie + 1 tekst = 2 pagina's
    },
    "preschool": {
        "description": "1 pagina: illustratie met tekst in apart blok eronder/ernaast",
        "text_position": "below_image",
        "font_size": "18pt",
        "max_sentences": 4,
        "text_on_illustration": False,
        "pages_per_block": 1,  # Afbeelding + tekst op dezelfde pagina
    },
    "early_reader": {
        "description": "1 pagina: paginavullende illustratie met tekst overlay in wit/transparant blok",
        "text_position": "overlay",
        "font_size": "14pt",
        "max_sentences": 6,
        "text_on_illustration": True,
        "pages_per_block": 1,  # Afbeelding met tekst overlay = 1 pagina
    }
}


def get_layout_config(age: int) -> dict:
    """Haal layout configuratie op voor een leeftijd."""
    layout_group = get_layout_group(age)
    return {
        "layout_group": layout_group,
        **LAYOUT_CONFIG[layout_group]
    }


# Lulu minimum pagina's per cover type
LULU_MIN_PAGES = {
    "hardcover": 24,
    "softcover": 20,
}


def get_min_pages_for_cover_type(cover_type: str) -> int:
    """Haal minimum pagina's op voor cover type."""
    return LULU_MIN_PAGES.get(cover_type, 24)


# Extra pagina's naast verhaal-spreads:
# - Voorkaft (1)
# - Binnenkant voorkaft (1)
# - Boek titelpagina (1)
# - Colofon (1)
# - Binnenkant achterkaft (1)
# - Achterkaft (1)
# = 6 vaste pagina's per boek
# Formule totaal: 6 + (tekstblokken × pages_per_block)
# - toddler: pages_per_block = 2 (spread)
# - preschool: pages_per_block = 1 (tekst + afbeelding op 1 pagina)
# - early_reader: pages_per_block = 1 (tekst overlay op afbeelding)
EXTRA_BOOK_PAGES = 6


def get_pages_per_block(age: int) -> int:
    """Haal het aantal pagina's per tekstblok op voor een leeftijd."""
    layout_group = get_layout_group(age)
    return LAYOUT_CONFIG[layout_group]["pages_per_block"]


def calculate_stories_required(
    age: int,
    min_pages_required: int,
    text_blocks_per_story: Optional[int] = None,
    include_extra_pages: bool = True
) -> Dict[str, int]:
    """
    Bereken hoeveel verhalen nodig zijn om minimum pagina's te halen.

    Layout-afhankelijke pagina berekening:
    - toddler (2-3): pages_per_block = 2 (illustratie + tekst spread)
    - preschool (4-5): pages_per_block = 1 (tekst + illustratie op 1 pagina)
    - early_reader (6-8): pages_per_block = 1 (tekst overlay op illustratie)

    Formule: extra_pages + (tekstblokken × pages_per_block)

    Args:
        age: Leeftijd kind (2-8)
        min_pages_required: Minimum pagina's vereist door Lulu (24 voor hardcover)
        text_blocks_per_story: Optioneel override voor tekstblokken per verhaal
        include_extra_pages: Tel extra boekpagina's mee (cover, title, etc.)

    Returns:
        {
            "text_blocks_per_story": int,
            "stories_required": int,
            "total_text_blocks": int,
            "extra_pages": int,
            "pages_per_block": int,
            "layout_group": str,
            "final_page_count": int
        }
    """
    if text_blocks_per_story is None:
        text_blocks_per_story = get_pages_per_story(age)

    extra_pages = EXTRA_BOOK_PAGES if include_extra_pages else 0

    # Haal pages_per_block op basis van leeftijd/layout
    pages_per_block = get_pages_per_block(age)
    layout_group = get_layout_group(age)

    # Pagina's per verhaal = tekstblokken × pages_per_block
    story_pages = text_blocks_per_story * pages_per_block

    # Check of 1 verhaal + extra pagina's genoeg is
    total_with_one_story = story_pages + extra_pages
    if total_with_one_story >= min_pages_required:
        final_count = total_with_one_story
        # Zorg dat het even is
        if final_count % 2 != 0:
            final_count += 1
        return {
            "text_blocks_per_story": text_blocks_per_story,
            "stories_required": 1,
            "total_text_blocks": text_blocks_per_story,
            "extra_pages": extra_pages,
            "pages_per_block": pages_per_block,
            "layout_group": layout_group,
            "final_page_count": final_count
        }

    # Bereken hoeveel verhalen nodig zijn
    # min_pages_required = extra_pages + (stories * text_blocks_per_story * pages_per_block)
    pages_needed_for_stories = min_pages_required - extra_pages
    # Elke story heeft: (tekstblokken × pages_per_block)
    pages_per_story = text_blocks_per_story * pages_per_block
    stories_required = math.ceil(pages_needed_for_stories / pages_per_story)

    total_text_blocks = stories_required * text_blocks_per_story
    final_page_count = extra_pages + (total_text_blocks * pages_per_block)

    # Zorg dat final_page_count even is
    if final_page_count % 2 != 0:
        final_page_count += 1

    return {
        "text_blocks_per_story": text_blocks_per_story,
        "stories_required": stories_required,
        "total_text_blocks": total_text_blocks,
        "extra_pages": extra_pages,
        "pages_per_block": pages_per_block,
        "layout_group": layout_group,
        "final_page_count": final_page_count
    }


def select_optimal_book_format(
    age: int,
    target_page_count: Optional[int] = None,
    cover_type: str = "hardcover",
    preferred_shape: Optional[str] = None,
    formats: Optional[List[Dict]] = None
) -> Dict[str, Any]:
    """
    Selecteer het optimale boekformaat op basis van input.

    Args:
        age: Leeftijd kind (2-8)
        target_page_count: Gewenst aantal pagina's per verhaal (optioneel)
        cover_type: "hardcover" of "softcover"
        preferred_shape: "square", "portrait", of None
        formats: Lijst formaten (default: BOOK_FORMATS)

    Returns:
        {
            "chosen_format": {...},
            "reason": str,
            "stories_required": int,
            "final_page_count": int,
            "warnings": []
        }
    """
    if formats is None:
        formats = BOOK_FORMATS

    warnings = []

    # Stap 1: Bepaal pages per story
    if target_page_count is None:
        target_page_count = get_pages_per_story(age)

    # Stap 2: Filter op cover type
    filtered = [f for f in formats if f["cover_type"] == cover_type]

    if not filtered:
        return {
            "chosen_format": None,
            "reason": f"Geen formaten gevonden voor cover_type={cover_type}",
            "stories_required": 0,
            "final_page_count": 0,
            "warnings": ["Ongeldig cover type"]
        }

    # Stap 3: Bepaal minimum pagina's en bereken stories
    min_pages = min(f["min_pages"] for f in filtered)
    story_calc = calculate_stories_required(age, min_pages, target_page_count)

    if story_calc["stories_required"] > 1:
        warnings.append(
            f"Meerdere verhalen nodig: {story_calc['stories_required']} verhalen "
            f"van {story_calc['pages_per_story']} pagina's om minimum van {min_pages} te halen."
        )

    final_page_count = story_calc["final_page_count"]

    # Stap 4: Filter op min/max pagina's
    valid_formats = [
        f for f in filtered
        if f["min_pages"] <= final_page_count <= f["max_pages"]
    ]

    if not valid_formats:
        return {
            "chosen_format": None,
            "reason": f"Geen formaten beschikbaar voor {final_page_count} pagina's",
            "stories_required": story_calc["stories_required"],
            "final_page_count": final_page_count,
            "warnings": warnings + ["Pagina telling valt buiten alle formaten"]
        }

    # Stap 5: Filter op preferred shape
    if preferred_shape:
        shape_filtered = [f for f in valid_formats if f["orientation"] == preferred_shape]
        if shape_filtered:
            valid_formats = shape_filtered
        else:
            warnings.append(f"Voorkeur '{preferred_shape}' niet beschikbaar, alternatief gekozen.")

    # Stap 6: Selecteer beste formaat
    chosen = None
    reason = ""

    # Prioriteit op basis van leeftijd
    if age <= 4:
        # Voorkeur voor Square Small
        square_formats = [f for f in valid_formats if f["orientation"] == "square"]
        if square_formats:
            chosen = square_formats[0]
            reason = f"Square Small gekozen: ideaal voor kinderen van {age} jaar (groot, vierkant formaat)"

    if not chosen and 5 <= age <= 6:
        # Voorkeur voor A5 Portrait
        a5_formats = [f for f in valid_formats if "a5" in f["id"].lower()]
        if a5_formats:
            chosen = a5_formats[0]
            reason = f"A5 Portrait gekozen: compact formaat perfect voor {age} jaar"

    if not chosen and age >= 7:
        # Voorkeur voor A4 Portrait
        a4_formats = [f for f in valid_formats if "a4" in f["id"].lower()]
        if a4_formats:
            chosen = a4_formats[0]
            reason = f"A4 Portrait gekozen: premium groot formaat voor {age} jaar met langer verhaal"

    if not chosen:
        # Fallback: kleinste formaat dat voldoet
        valid_formats.sort(key=lambda f: f["width_mm"] * f["height_mm"])
        chosen = valid_formats[0]
        reason = f"Kleinste geschikte formaat gekozen: {chosen['name']}"

    return {
        "chosen_format": chosen,
        "reason": reason,
        "stories_required": story_calc["stories_required"],
        "final_page_count": final_page_count,
        "warnings": warnings
    }


# =============================================================================
# SECTION 5 — DEVELOPER GUIDE
# =============================================================================

DEVELOPER_GUIDE = """
================================================================================
DEVELOPER GUIDE: PEECHO INTEGRATIE VOOR KINDERBOEKEN
================================================================================

1. LEEFTIJD → VERHAALLENGTE MAPPING
-----------------------------------

De app genereert verhalen op basis van exacte leeftijd (2-8 jaar).
Elke leeftijd heeft een verwacht aantal pagina's:

    age | pages | kenmerken
    ----|-------|------------------------------------------
     2  |   8   | Heel kort, grote plaatjes, herhaling
     3  |  10   | Kort, eenvoudige zinnen, herhaling
     4  |  12   | Simpele plot, begin-midden-eind
     5  |  14   | Duidelijke verhaallijn
     6  |  16   | Meer detail, karakterontwikkeling
     7  |  18   | Complex verhaal mogelijk
     8  |  20   | Volledige verhaallijn, meerdere scènes

Gebruik get_pages_per_story(age) om het aantal pagina's op te halen.


2. MEERDERE VERHALEN GENEREREN
------------------------------

PROBLEEM: Peecho minimum is 20-24 pagina's, maar jonge kinderen krijgen
kortere verhalen.

OPLOSSING: Genereer meerdere verhalen tot het minimum wordt gehaald.

    from peecho_formats import calculate_stories_required

    # Voorbeeld voor 2-jarige (8 pagina's per verhaal)
    result = calculate_stories_required(age=2, min_pages_required=24)
    # Returns:
    # {
    #     "pages_per_story": 8,
    #     "stories_required": 3,
    #     "final_page_count": 24
    # }

De StoryService moet dan 3 verhalen genereren in plaats van 1.
Elk verhaal kan een ander avontuur zijn met dezelfde knuffel.


3. PDF VOLGORDE OPBOUWEN
------------------------

De PDF moet in deze volgorde worden opgebouwd:

    pagina 1        → Front Cover (volledige afloop)
    pagina 2        → Titelpagina
    pagina 3-4      → Verhaal 1, pagina 1-2
    ...
    pagina n-1      → Laatste verhaalpagina
    pagina n        → Back Cover (volledige afloop)

Bij meerdere verhalen:

    pagina 1        → Front Cover
    pagina 2        → Titelpagina "Drie Avonturen van [Knuffel]"
    pagina 3        → Verhaal 1 titel
    pagina 4-11     → Verhaal 1 (8 pagina's)
    pagina 12       → Verhaal 2 titel
    pagina 13-20    → Verhaal 2 (8 pagina's)
    pagina 21       → Verhaal 3 titel
    pagina 22-29    → Verhaal 3 (8 pagina's)
    pagina 30       → Back Cover

Zorg dat totaal EVEN is (Peecho voegt anders blanco toe).


4. BACKEND INTEGRATIE (FastAPI)
-------------------------------

    from backend.config.peecho_formats import (
        select_optimal_book_format,
        calculate_stories_required,
        BOOK_FORMATS,
        DELIVERY_REQUIREMENTS
    )

    @app.post("/api/books/{book_id}/prepare-for-print")
    async def prepare_for_print(book_id: str, age: int, cover_type: str = "hardcover"):
        # Selecteer formaat
        selection = select_optimal_book_format(
            age=age,
            cover_type=cover_type
        )

        if not selection["chosen_format"]:
            raise HTTPException(400, selection["reason"])

        # Als meerdere verhalen nodig zijn
        if selection["stories_required"] > 1:
            # Genereer extra verhalen
            for i in range(selection["stories_required"] - 1):
                await generate_additional_story(book_id)

        # Genereer PDF met juiste specs
        format_spec = selection["chosen_format"]
        pdf = await generate_print_pdf(
            book_id=book_id,
            width_mm=format_spec["width_mm"],
            height_mm=format_spec["height_mm"],
            total_pages=selection["final_page_count"]
        )

        return {
            "format": format_spec["name"],
            "pages": selection["final_page_count"],
            "stories": selection["stories_required"],
            "warnings": selection["warnings"]
        }


5. AANBEVOLEN DEFAULTS
----------------------

    Leeftijd | Formaat            | Cover
    ---------|--------------------|---------
     2-4     | Square Small       | Hardcover
     5-6     | A5 Portrait        | Hardcover
     7-8     | A4 Portrait        | Hardcover

Softcover alleen aanbieden als budget-optie of voor proefdrukken.


6. VALIDATIE VOOR UPLOAD
------------------------

Voordat je naar Peecho uploadt, valideer:

    def validate_for_peecho(pdf_path: str, format_spec: dict) -> dict:
        errors = []
        warnings = []

        # Check page count
        page_count = get_pdf_page_count(pdf_path)
        if page_count < format_spec["min_pages"]:
            errors.append(f"Te weinig pagina's: {page_count} < {format_spec['min_pages']}")
        if page_count % 2 != 0:
            warnings.append("Oneven aantal pagina's - Peecho voegt blanco toe")

        # Check resolution
        low_res_images = check_image_resolution(pdf_path, min_dpi=300)
        if low_res_images:
            warnings.append(f"{len(low_res_images)} afbeeldingen onder 300 DPI")

        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings
        }


7. PEECHO API FLOW
------------------

    1. Frontend: Gebruiker kiest "Bestel als boek"
    2. Backend: select_optimal_book_format(age, cover_type)
    3. Backend: Genereer extra verhalen indien nodig
    4. Backend: Genereer print-ready PDF
    5. Backend: Valideer PDF
    6. Backend: Create Peecho order via API
    7. Frontend: Toon checkout met adresformulier
    8. Backend: Na betaling → confirm_payment()
    9. Peecho: Print en verzend boek
    10. Webhook: Update order status


================================================================================
"""


# Export voor gebruik in andere modules
__all__ = [
    "BOOK_FORMATS",
    "DELIVERY_REQUIREMENTS",
    "VALIDATION_STEPS",
    "PAGES_PER_STORY_BY_AGE",
    "RECOMMENDED_FORMAT_BY_AGE",
    "EXTRA_BOOK_PAGES",
    "LULU_MIN_PAGES",
    "LAYOUT_CONFIG",
    "get_pages_per_story",
    "get_pages_per_block",
    "get_layout_group",
    "get_layout_config",
    "get_min_pages_for_cover_type",
    "calculate_stories_required",
    "select_optimal_book_format",
    "DEVELOPER_GUIDE"
]
