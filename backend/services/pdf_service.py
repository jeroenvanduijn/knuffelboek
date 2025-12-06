"""
PDF Service - Genereer drukklare kinderboek PDF's
"""

import os
import base64
from io import BytesIO
from pathlib import Path
from typing import Optional
from jinja2 import Template

# Import layout configuration
try:
    from backend.config.peecho_formats import (
        get_layout_group,
        get_layout_config,
        LAYOUT_CONFIG
    )
    LAYOUT_AVAILABLE = True
except ImportError:
    LAYOUT_AVAILABLE = False
    LAYOUT_CONFIG = {
        "toddler": {"font_size": "22pt", "max_sentences": 2},
        "preschool": {"font_size": "18pt", "max_sentences": 4},
        "early_reader": {"font_size": "14pt", "max_sentences": 6}
    }

    def get_layout_group(age: int) -> str:
        if age <= 3:
            return "toddler"
        elif age <= 5:
            return "preschool"
        else:
            return "early_reader"

    def get_layout_config(age: int) -> dict:
        layout_group = get_layout_group(age)
        return {"layout_group": layout_group, **LAYOUT_CONFIG[layout_group]}

# Lazy import van WeasyPrint (vereist system libraries)
HTML = None
CSS = None
FontConfiguration = None

# Cache for logo base64
_logo_base64_cache = None


def _get_logo_base64() -> str:
    """Load and cache the Knuffelboek logo as base64"""
    global _logo_base64_cache
    if _logo_base64_cache is None:
        # Find logo.png relative to this file
        service_dir = Path(__file__).parent
        logo_paths = [
            service_dir.parent.parent / "logo.png",  # knuffelboek/logo.png
            service_dir.parent.parent / "frontend" / "logo.png",  # knuffelboek/frontend/logo.png
        ]
        for logo_path in logo_paths:
            if logo_path.exists():
                with open(logo_path, "rb") as f:
                    _logo_base64_cache = base64.b64encode(f.read()).decode()
                break
        if _logo_base64_cache is None:
            _logo_base64_cache = ""  # No logo found
    return _logo_base64_cache


def _load_weasyprint():
    """Lazy load WeasyPrint modules"""
    global HTML, CSS, FontConfiguration
    if HTML is None:
        from weasyprint import HTML as WP_HTML, CSS as WP_CSS
        from weasyprint.text.fonts import FontConfiguration as WP_FontConfig
        HTML = WP_HTML
        CSS = WP_CSS
        FontConfiguration = WP_FontConfig


class PDFService:
    """Service voor het genereren van drukklare PDF kinderboeken"""

    # Bleed in mm (Lulu requires 0.125 inch = 3.175mm, we use 3.2mm)
    BLEED_MM = 3.2

    # Hardcover cover dimensions for Lulu 8.5x8.5 inch:
    # Required: 18.938"-19.062" x 10.188"-10.312"
    # This includes casewrap (0.75") + bleed (0.125") + safety margin
    # Width needs ~24mm margin to hit ~19" width
    # Height needs ~22mm margin to hit ~10.25" height (within 10.188"-10.312")
    HARDCOVER_WRAP_HORIZONTAL_MM = 24.0
    HARDCOVER_WRAP_VERTICAL_MM = 22.0

    def __init__(self):
        self.font_config = None

        # Standaard boekformaten (in mm) - trim size (zonder bleed)
        self.FORMATS = {
            "square_small": {"width": 200, "height": 200},   # 20x20cm
            "square_large": {"width": 250, "height": 250},   # 25x25cm
            "portrait": {"width": 200, "height": 250},       # 20x25cm
            "landscape": {"width": 250, "height": 200},      # 25x20cm
        }

        # Lulu specifieke formaten (trim size in mm)
        self.LULU_FORMATS = {
            "square": {"width": 215.9, "height": 215.9},     # 8.5x8.5 inch
            "a4_landscape": {"width": 297, "height": 210},   # A4 landscape
        }

        # Spine width per page count (in mm, approximate for 60# paper)
        # Based on Lulu's formula: ~0.0025" per page
        self.SPINE_WIDTH_PER_PAGE_MM = 0.0635  # 0.0025 inch in mm
    
    async def create_book_pdf(
        self,
        title: str,
        pages: list[dict],
        child_name: str,
        format: str = "square_small",
        dedication: Optional[str] = None
    ) -> bytes:
        """
        Creëer een complete boek-PDF.
        
        Args:
            title: Titel van het boek
            pages: Lijst van pagina's met {text, illustration_base64}
            child_name: Naam van het kind (voor de titelpagina)
            format: Boekformaat (square_small, square_large, portrait, landscape)
            dedication: Optionele opdracht/dedicatie
            
        Returns:
            PDF als bytes
        """
        book_format = self.FORMATS.get(format, self.FORMATS["square_small"])

        # Lazy load WeasyPrint
        _load_weasyprint()
        if self.font_config is None:
            self.font_config = FontConfiguration()

        # Bouw de HTML
        html_content = self._build_book_html(
            title=title,
            pages=pages,
            child_name=child_name,
            book_format=book_format,
            dedication=dedication
        )

        # CSS voor print
        css = self._get_print_css(book_format)

        # Genereer PDF met hoge resolutie voor print kwaliteit
        html = HTML(string=html_content)
        pdf_bytes = html.write_pdf(
            stylesheets=[CSS(string=css)],
            font_config=self.font_config,
            image_resolution=300,  # 300 DPI for print quality
            optimize_images=False  # Don't compress images
        )

        return pdf_bytes

    def _build_book_html(
        self,
        title: str,
        pages: list[dict],
        child_name: str,
        book_format: dict,
        dedication: Optional[str]
    ) -> str:
        """Bouw de HTML structuur voor het boek"""
        
        template = Template("""
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>{{ title }}</title>
</head>
<body>
    <!-- Titelpagina -->
    <div class="page title-page">
        <div class="title-content">
            <h1>{{ title }}</h1>
            <p class="subtitle">Een verhaal voor {{ child_name }}</p>
        </div>
    </div>
    
    {% if dedication %}
    <!-- Opdracht pagina -->
    <div class="page dedication-page">
        <div class="dedication">
            <p>{{ dedication }}</p>
        </div>
    </div>
    {% endif %}
    
    <!-- Verhaalpagina's -->
    {% for page in pages %}
    <div class="page story-page">
        {% if page.illustration_base64 %}
        <div class="illustration">
            <img src="data:image/png;base64,{{ page.illustration_base64 }}" alt="Illustratie pagina {{ loop.index }}">
        </div>
        {% endif %}
        <div class="text">
            <p>{{ page.text }}</p>
        </div>
    </div>
    {% endfor %}
    
    <!-- Laatste pagina -->
    <div class="page end-page">
        <div class="end-content">
            <p class="the-end">Einde</p>
            <p class="made-with">Gemaakt met ❤️ door Knuffelboek</p>
        </div>
    </div>
</body>
</html>
        """)
        
        return template.render(
            title=title,
            child_name=child_name,
            dedication=dedication,
            pages=pages
        )
    
    def _get_print_css(self, book_format: dict) -> str:
        """Genereer CSS voor print-ready PDF"""
        
        width_mm = book_format["width"]
        height_mm = book_format["height"]
        
        return f"""
@page {{
    size: {width_mm}mm {height_mm}mm;
    margin: 10mm;
    bleed: 3mm;
}}

* {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}}

body {{
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 16pt;
    line-height: 1.6;
    color: #333;
}}

.page {{
    width: {width_mm - 20}mm;
    height: {height_mm - 20}mm;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10mm;
}}

/* Titelpagina */
.title-page {{
    background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%);
    text-align: center;
}}

.title-content h1 {{
    font-size: 28pt;
    color: #8B4513;
    margin-bottom: 20mm;
    font-weight: bold;
}}

.title-content .subtitle {{
    font-size: 16pt;
    color: #A0522D;
    font-style: italic;
}}

/* Opdracht pagina */
.dedication-page {{
    background: #fffef5;
}}

.dedication {{
    font-style: italic;
    font-size: 14pt;
    color: #666;
    text-align: center;
    max-width: 80%;
}}

/* Verhaalpagina's */
.story-page {{
    background: #fffef5;
}}

.illustration {{
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 60%;
    margin-bottom: 5mm;
}}

.illustration img {{
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 3mm;
}}

.text {{
    flex: 0 0 auto;
    text-align: center;
    max-width: 90%;
}}

.text p {{
    font-size: 14pt;
    line-height: 1.8;
}}

/* Eindpagina */
.end-page {{
    background: linear-gradient(135deg, #ffe6cc 0%, #fff5e6 100%);
    text-align: center;
}}

.the-end {{
    font-size: 24pt;
    color: #8B4513;
    margin-bottom: 10mm;
}}

.made-with {{
    font-size: 10pt;
    color: #A0522D;
}}

/* Print optimalisaties */
@media print {{
    .page {{
        page-break-inside: avoid;
    }}
}}
        """
    
    async def create_preview_images(
        self,
        title: str,
        pages: list[dict],
        child_name: str
    ) -> list[str]:
        """
        Creëer preview afbeeldingen van de boekpagina's.

        Returns:
            Lijst van base64 encoded PNG's
        """
        # Voor de preview gebruiken we een simpelere aanpak
        # In productie zou je de PDF renderen naar images

        # Placeholder: return de illustraties direct
        previews = []
        for page in pages:
            if page.get("illustration_base64"):
                previews.append(page["illustration_base64"])

        return previews

    # =========================================================================
    # LULU-SPECIFIC PDF GENERATION
    # =========================================================================

    def calculate_spine_width(self, page_count: int) -> float:
        """Bereken rugdikte in mm op basis van pagina-aantal"""
        return page_count * self.SPINE_WIDTH_PER_PAGE_MM

    async def create_lulu_interior_pdf(
        self,
        title: str,
        stories: list[dict],
        child_name: str,
        illustrations: dict,
        lulu_format: str = "square",
        dedication: Optional[str] = None,
        age: int = 5
    ) -> bytes:
        """
        Creëer een Lulu-compatible interieur PDF met leeftijdsgebaseerde layout.

        Layout groups:
        - toddler (2-3 jaar): Illustratie links (paginavullend), tekst rechts (groot font)
        - preschool (4-5 jaar): Tekst links, illustratie rechts (paginavullend)
        - early_reader (6-8 jaar): Tekst links, illustratie rechts (paginavullend, kleiner font)

        - Elke pagina is enkelzijdig (geen spreads)
        - Inclusief bleed (3.2mm aan alle zijden)
        - Trim size: 8.5x8.5" voor square, A4 landscape voor a4

        Args:
            title: Titel van het boek
            stories: Lijst van verhalen met {title, pages: [{page_number, text, layout_group}]}
            child_name: Naam van het kind
            illustrations: Dict van page_number -> base64 image
            lulu_format: "square" of "a4_landscape"
            dedication: Optionele opdracht
            age: Leeftijd van het kind (bepaalt layout)

        Returns:
            PDF als bytes
        """
        book_format = self.LULU_FORMATS.get(lulu_format, self.LULU_FORMATS["square"])
        layout_group = get_layout_group(age)
        layout_config = get_layout_config(age)

        # Add bleed to dimensions
        width_with_bleed = book_format["width"] + (2 * self.BLEED_MM)
        height_with_bleed = book_format["height"] + (2 * self.BLEED_MM)

        # Lazy load WeasyPrint
        _load_weasyprint()
        if self.font_config is None:
            self.font_config = FontConfiguration()

        # Build HTML with layout-specific rendering
        html_content = self._build_lulu_interior_html(
            title=title,
            stories=stories,
            child_name=child_name,
            illustrations=illustrations,
            trim_width=book_format["width"],
            trim_height=book_format["height"],
            dedication=dedication,
            layout_group=layout_group,
            layout_config=layout_config
        )

        # CSS for Lulu print requirements with layout-specific styling
        css = self._get_lulu_interior_css(
            trim_width=book_format["width"],
            trim_height=book_format["height"],
            bleed=self.BLEED_MM,
            layout_group=layout_group,
            layout_config=layout_config
        )

        # Generate PDF with high resolution for print quality
        html = HTML(string=html_content)
        pdf_bytes = html.write_pdf(
            stylesheets=[CSS(string=css)],
            font_config=self.font_config,
            image_resolution=300,  # 300 DPI for print quality
            optimize_images=False  # Don't compress images
        )

        return pdf_bytes

    async def create_lulu_cover_pdf(
        self,
        title: str,
        child_name: str,
        page_count: int,
        cover_illustration_base64: Optional[str] = None,
        back_text: Optional[str] = None,
        lulu_format: str = "square",
        cover_type: str = "hardcover"
    ) -> bytes:
        """
        Creëer een Lulu-compatible cover PDF (spread: back + spine + front).

        Args:
            title: Titel van het boek
            child_name: Naam van het kind
            page_count: Aantal pagina's (voor rugdikte berekening)
            cover_illustration_base64: Cover afbeelding
            back_text: Tekst voor achterkant
            lulu_format: "square" of "a4_landscape"
            cover_type: "hardcover" of "softcover"

        Returns:
            PDF als bytes
        """
        book_format = self.LULU_FORMATS.get(lulu_format, self.LULU_FORMATS["square"])
        spine_width = self.calculate_spine_width(page_count)

        # For hardcover, add casewrap margin on all edges
        # For softcover, just use bleed
        if cover_type == "hardcover":
            horizontal_margin = self.HARDCOVER_WRAP_HORIZONTAL_MM
            vertical_margin = self.HARDCOVER_WRAP_VERTICAL_MM
        else:
            horizontal_margin = self.BLEED_MM
            vertical_margin = self.BLEED_MM

        # Total cover width = back + spine + front + margin on outside edges
        # Total height = height + margin top and bottom
        cover_width = (2 * book_format["width"]) + spine_width + (2 * horizontal_margin)
        cover_height = book_format["height"] + (2 * vertical_margin)

        # Lazy load WeasyPrint
        _load_weasyprint()
        if self.font_config is None:
            self.font_config = FontConfiguration()

        # Build cover HTML
        html_content = self._build_lulu_cover_html(
            title=title,
            child_name=child_name,
            page_width=book_format["width"],
            page_height=book_format["height"],
            spine_width=spine_width,
            bleed_horizontal=horizontal_margin,
            bleed_vertical=vertical_margin,
            cover_illustration_base64=cover_illustration_base64,
            back_text=back_text
        )

        # CSS for cover
        css = self._get_lulu_cover_css(
            cover_width=cover_width,
            cover_height=cover_height,
            page_width=book_format["width"],
            spine_width=spine_width,
            bleed_horizontal=horizontal_margin,
            bleed_vertical=vertical_margin
        )

        # Generate PDF with high resolution for print quality
        html = HTML(string=html_content)
        pdf_bytes = html.write_pdf(
            stylesheets=[CSS(string=css)],
            font_config=self.font_config,
            image_resolution=300,  # 300 DPI for print quality
            optimize_images=False  # Don't compress images
        )

        return pdf_bytes

    def _build_lulu_interior_html(
        self,
        title: str,
        stories: list[dict],
        child_name: str,
        illustrations: dict,
        trim_width: float,
        trim_height: float,
        dedication: Optional[str],
        layout_group: str = "preschool",
        layout_config: dict = None
    ) -> str:
        """
        Build HTML for Lulu interior PDF with layout-specific rendering.

        Layout groups:
        - toddler (2-3 jaar): Illustratie links (paginavullend), tekst rechts (groot font)
        - preschool (4-5 jaar): Tekst links, illustratie rechts (paginavullend)
        - early_reader (6-8 jaar): Tekst links, illustratie rechts (paginavullend, kleiner font)

        - Titelpagina
        - Opdracht (optioneel) of blank
        - Per verhaal:
          - Verhaal titelpagina
          - Per tekstblok: layout-specific spread
        - Colofon/Einde pagina
        - Padding indien nodig voor Lulu minimum
        """

        if layout_config is None:
            layout_config = {"font_size": "18pt", "max_sentences": 4}

        template = Template("""
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>{{ title }}</title>
</head>
<body class="layout-{{ layout_group }}">
    <!-- Page 1: Title page -->
    <div class="page title-page">
        <div class="safe-area">
            <div class="title-content">
                {% if logo_base64 %}
                <img class="title-logo" src="data:image/png;base64,{{ logo_base64 }}" alt="Knuffelboek">
                {% endif %}
                <h1>{{ title }}</h1>
                <p class="subtitle">Speciaal voor {{ child_name }}</p>
            </div>
        </div>
    </div>

    {% if dedication %}
    <!-- Page 2: Dedication -->
    <div class="page dedication-page">
        <div class="safe-area">
            <div class="dedication">
                <p>{{ dedication }}</p>
            </div>
        </div>
    </div>
    {% else %}
    <!-- Page 2: Blank page -->
    <div class="page blank-page">
        <div class="safe-area"></div>
    </div>
    {% endif %}

    <!-- Verhalen -->
    {% for story in stories %}

    <!-- Verhaal pagina's -->
    {% for page in story.pages %}

    {% if layout_group == "toddler" %}
    {# TODDLER (2-3): 2-page spread - Illustratie links (paginavullend), tekst rechts (groot font) #}
    <!-- Illustratie pagina (links, paginavullend) -->
    <div class="page illustration-page toddler-illustration">
        {% if illustrations.get(page.page_number) %}
        <img class="full-illustration" src="data:image/png;base64,{{ illustrations.get(page.page_number) }}" alt="Illustratie">
        {% else %}
        <div class="illustration-placeholder">
            <p>Illustratie {{ page.page_number }}</p>
        </div>
        {% endif %}
    </div>

    <!-- Tekst pagina (rechts, groot font) -->
    <div class="page text-page toddler-text">
        <div class="safe-area text-safe-area">
            <div class="text-content">
                <p class="story-text">{{ page.text }}</p>
            </div>
            <div class="page-number">{{ loop.index }}</div>
        </div>
    </div>

    {% elif layout_group == "early_reader" %}
    {# EARLY READER (6-8): 1 pagina - Paginavullende illustratie met tekst overlay in wit/transparant blok #}
    <div class="page combined-page early-reader-page">
        {% if illustrations.get(page.page_number) %}
        <img class="full-illustration" src="data:image/png;base64,{{ illustrations.get(page.page_number) }}" alt="Illustratie">
        {% else %}
        <div class="illustration-placeholder">
            <p>Illustratie {{ page.page_number }}</p>
        </div>
        {% endif %}
        <div class="text-overlay">
            <p class="story-text">{{ page.text }}</p>
        </div>
        <div class="page-number overlay-page-number">{{ loop.index }}</div>
    </div>

    {% else %}
    {# PRESCHOOL (4-5): 1 pagina - Illustratie bovenaan, tekst in apart blok eronder #}
    <div class="page combined-page preschool-page">
        <div class="preschool-illustration-container">
            {% if illustrations.get(page.page_number) %}
            <img class="preschool-illustration" src="data:image/png;base64,{{ illustrations.get(page.page_number) }}" alt="Illustratie">
            {% else %}
            <div class="illustration-placeholder">
                <p>Illustratie {{ page.page_number }}</p>
            </div>
            {% endif %}
        </div>
        <div class="preschool-text-container">
            <p class="story-text">{{ page.text }}</p>
        </div>
        <div class="page-number">{{ loop.index }}</div>
    </div>
    {% endif %}

    {% endfor %}
    {% endfor %}

    <!-- Colofon/Einde pagina -->
    <div class="page colophon-page">
        <div class="safe-area">
            <div class="colophon-content">
                <p class="the-end">~ Einde ~</p>
                {% if logo_base64 %}
                <img class="colophon-logo" src="data:image/png;base64,{{ logo_base64 }}" alt="Knuffelboek">
                {% endif %}
                <p class="made-with">Gemaakt met Knuffelboek</p>
                <p class="made-for">Speciaal voor {{ child_name }}</p>
            </div>
        </div>
    </div>

    <!-- Padding to reach minimum page count if needed -->
    {% for i in range(padding_pages) %}
    <div class="page blank-page">
        <div class="safe-area"></div>
    </div>
    {% endfor %}
</body>
</html>
        """)

        # Calculate pages needed based on layout
        # Title + dedication/blank = 2
        # Per story: pages_per_block * text_blocks (geen story title page meer)
        # Colophon = 1
        # pages_per_block: toddler=2 (spread), preschool=1, early_reader=1
        pages_per_block = 2 if layout_group == "toddler" else 1

        content_pages = 2 + 1  # title + dedication + colophon
        for story in stories:
            # Geen story title page meer - direct naar verhaal pagina's
            content_pages += len(story.get('pages', [])) * pages_per_block

        min_pages = 24  # Lulu minimum for hardcover
        padding_pages = max(0, min_pages - content_pages)

        return template.render(
            title=title,
            child_name=child_name,
            stories=stories,
            illustrations=illustrations,
            dedication=dedication,
            padding_pages=padding_pages,
            logo_base64=_get_logo_base64(),
            layout_group=layout_group,
            layout_config=layout_config
        )

    def _get_lulu_interior_css(
        self,
        trim_width: float,
        trim_height: float,
        bleed: float,
        layout_group: str = "preschool",
        layout_config: dict = None
    ) -> str:
        """Generate CSS for Lulu interior PDF with layout-specific styling"""

        if layout_config is None:
            layout_config = {"font_size": "18pt", "max_sentences": 4}

        # Total page size including bleed
        page_width = trim_width + (2 * bleed)
        page_height = trim_height + (2 * bleed)

        # Safe area margin (keep text/important content inside)
        safe_margin = 12  # mm from trim edge

        # Font sizes per layout group
        font_sizes = {
            "toddler": "22pt",
            "preschool": "18pt",
            "early_reader": "14pt"
        }
        font_size = font_sizes.get(layout_group, "18pt")

        return f"""
@page {{
    size: {page_width}mm {page_height}mm;
    margin: 0;
}}

* {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}}

body {{
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 14pt;
    line-height: 1.6;
    color: #333;
}}

.page {{
    width: {page_width}mm;
    height: {page_height}mm;
    page-break-after: always;
    position: relative;
    background: #fffef5;
    overflow: hidden;
}}

.page:last-child {{
    page-break-after: auto;
}}

.safe-area {{
    position: absolute;
    top: {bleed + safe_margin}mm;
    left: {bleed + safe_margin}mm;
    right: {bleed + safe_margin}mm;
    bottom: {bleed + safe_margin}mm;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}}

/* ===== TITLE PAGE ===== */
.title-page {{
    background: #fffef5;
}}

.title-content {{
    text-align: center;
}}

.title-logo {{
    max-width: 50mm;
    max-height: 25mm;
    margin-bottom: 10mm;
}}

.title-content h1 {{
    font-size: 32pt;
    color: #8B4513;
    margin-bottom: 8mm;
    font-weight: bold;
    line-height: 1.2;
}}

.title-content .subtitle {{
    font-size: 16pt;
    color: #A0522D;
    font-style: italic;
}}

/* ===== DEDICATION PAGE ===== */
.dedication-page {{
    background: #fffef5;
}}

.dedication {{
    font-style: italic;
    font-size: 14pt;
    color: #666;
    text-align: center;
    max-width: 80%;
    line-height: 1.6;
}}

/* ===== STORY TITLE PAGE ===== */
.story-title-page {{
    background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%);
}}

.story-title-bg {{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.3;
}}

.story-title-content {{
    text-align: center;
    position: relative;
    z-index: 1;
}}

.story-title {{
    font-size: 26pt;
    color: #8B4513;
    margin-bottom: 5mm;
    text-shadow: 2px 2px 4px rgba(255,255,255,0.9);
    line-height: 1.2;
}}

.story-number {{
    font-size: 12pt;
    color: #A0522D;
    font-style: italic;
}}

/* ===== TEXT PAGE (Links) ===== */
.text-page {{
    background: #fffef5;
}}

.text-safe-area {{
    justify-content: center;
    padding: 15mm;
}}

.text-content {{
    width: 100%;
}}

.story-text {{
    font-size: {font_size};
    color: #333;
    line-height: 1.8;
    text-align: left;
}}

/* Layout-specific text styling */
.toddler-text .story-text {{
    font-size: 22pt;
    line-height: 2.0;
}}

.preschool-text .story-text {{
    font-size: 18pt;
    line-height: 1.8;
}}

.early-reader-text .story-text {{
    font-size: 14pt;
    line-height: 1.6;
}}

.page-number {{
    position: absolute;
    bottom: {bleed + 8}mm;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10pt;
    color: #999;
}}

/* ===== ILLUSTRATION PAGE (Rechts, paginavullend) ===== */
.illustration-page {{
    background: #fffef5;
    padding: 0;
}}

.full-illustration {{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}}

.illustration-placeholder {{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
    display: flex;
    justify-content: center;
    align-items: center;
}}

.illustration-placeholder p {{
    font-size: 14pt;
    color: #999;
    font-style: italic;
}}

/* ===== COLOPHON PAGE ===== */
.colophon-page {{
    background: #fffef5;
}}

.colophon-content {{
    text-align: center;
}}

.the-end {{
    font-size: 20pt;
    color: #8B4513;
    font-style: italic;
    margin-bottom: 10mm;
}}

.colophon-logo {{
    max-width: 50mm;
    max-height: 25mm;
    margin-bottom: 8mm;
}}

.made-with {{
    font-size: 12pt;
    color: #A0522D;
    margin-bottom: 3mm;
}}

.made-for {{
    font-size: 14pt;
    color: #666;
    font-style: italic;
}}

/* ===== BLANK PAGES ===== */
.blank-page {{
    background: #fffef5;
}}

/* ===== PRESCHOOL COMBINED PAGE (4-5 jaar) ===== */
/* Illustratie bovenaan (~65% van pagina), tekst eronder in apart blok */
.preschool-page {{
    background: #fffef5;
    display: flex;
    flex-direction: column;
    padding: 0;
    height: {page_height}mm;
}}

.preschool-illustration-container {{
    height: 65%;
    width: 100%;
    overflow: hidden;
    position: relative;
}}

.preschool-illustration {{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}}

.preschool-text-container {{
    height: 35%;
    background: #fffef5;
    padding: {bleed + 8}mm {bleed + 12}mm;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}}

.preschool-text-container .story-text {{
    font-size: 18pt;
    line-height: 1.6;
    color: #333;
    text-align: center;
}}

/* ===== EARLY READER COMBINED PAGE (6-8 jaar) ===== */
/* Paginavullende illustratie met tekst overlay in semi-transparant blok */
.early-reader-page {{
    background: #fffef5;
    position: relative;
    padding: 0;
}}

.early-reader-page .full-illustration {{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}}

.text-overlay {{
    position: absolute;
    bottom: {bleed + 15}mm;
    left: {bleed + 10}mm;
    right: {bleed + 10}mm;
    background: rgba(255, 255, 255, 0.92);
    padding: 12mm 15mm;
    border-radius: 4mm;
    box-shadow: 0 2mm 8mm rgba(0,0,0,0.15);
}}

.text-overlay .story-text {{
    font-size: 14pt;
    line-height: 1.5;
    color: #333;
    text-align: left;
}}

.overlay-page-number {{
    position: absolute;
    bottom: {bleed + 6}mm;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10pt;
    color: rgba(255,255,255,0.8);
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}}
        """

    def _build_lulu_cover_html(
        self,
        title: str,
        child_name: str,
        page_width: float,
        page_height: float,
        spine_width: float,
        bleed_horizontal: float,
        bleed_vertical: float,
        cover_illustration_base64: Optional[str],
        back_text: Optional[str]
    ) -> str:
        """Build HTML for Lulu cover PDF (single spread: back + spine + front)"""

        template = Template("""
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Cover - {{ title }}</title>
</head>
<body>
    <div class="cover-spread">
        <!-- Back cover (left) -->
        <div class="back-cover">
            <div class="safe-area">
                {% if back_text %}
                <p class="back-text">{{ back_text }}</p>
                {% endif %}
                <p class="barcode-area">ISBN/Barcode area</p>
            </div>
        </div>

        <!-- Spine (center) -->
        <div class="spine">
            <p class="spine-title">{{ title }}</p>
        </div>

        <!-- Front cover (right) -->
        <div class="front-cover">
            {% if cover_illustration_base64 %}
            <img class="cover-image" src="data:image/png;base64,{{ cover_illustration_base64 }}" alt="Cover">
            {% endif %}
            <div class="safe-area">
                <h1 class="cover-title">{{ title }}</h1>
                <p class="cover-subtitle">Een verhaal voor {{ child_name }}</p>
            </div>
        </div>
    </div>
</body>
</html>
        """)

        return template.render(
            title=title,
            child_name=child_name,
            cover_illustration_base64=cover_illustration_base64,
            back_text=back_text or "Een magisch gepersonaliseerd kinderboek gemaakt met Knuffelboek."
        )

    def _get_lulu_cover_css(
        self,
        cover_width: float,
        cover_height: float,
        page_width: float,
        spine_width: float,
        bleed_horizontal: float,
        bleed_vertical: float
    ) -> str:
        """Generate CSS for Lulu cover PDF"""

        # Safe margin from trim edge
        safe_margin = 6  # mm - Lulu recommends 0.25" (6.35mm)

        return f"""
@page {{
    size: {cover_width}mm {cover_height}mm;
    margin: 0;
}}

* {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}}

body {{
    font-family: 'Georgia', 'Times New Roman', serif;
}}

.cover-spread {{
    width: {cover_width}mm;
    height: {cover_height}mm;
    display: flex;
    position: relative;
    background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%);
}}

/* Back cover */
.back-cover {{
    width: {page_width + bleed_horizontal}mm;
    height: {cover_height}mm;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}}

.back-cover .safe-area {{
    position: absolute;
    top: {bleed_vertical + safe_margin}mm;
    left: {bleed_horizontal + safe_margin}mm;
    right: {safe_margin}mm;
    bottom: {bleed_vertical + safe_margin}mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
}}

.back-text {{
    font-size: 12pt;
    color: #666;
    font-style: italic;
    max-width: 80%;
}}

.barcode-area {{
    font-size: 8pt;
    color: #999;
    padding: 5mm;
    border: 1px dashed #ccc;
}}

/* Spine */
.spine {{
    width: {spine_width}mm;
    height: {cover_height}mm;
    background: #8B4513;
    display: flex;
    justify-content: center;
    align-items: center;
}}

.spine-title {{
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    font-size: 10pt;
    color: white;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    max-height: {cover_height - 20}mm;
}}

/* Front cover */
.front-cover {{
    width: {page_width + bleed_horizontal}mm;
    height: {cover_height}mm;
    position: relative;
    overflow: hidden;
}}

.cover-image {{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.3;
}}

.front-cover .safe-area {{
    position: absolute;
    top: {bleed_vertical + safe_margin}mm;
    left: {safe_margin}mm;
    right: {bleed_horizontal + safe_margin}mm;
    bottom: {bleed_vertical + safe_margin}mm;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    z-index: 1;
}}

.cover-title {{
    font-size: 32pt;
    color: #8B4513;
    margin-bottom: 10mm;
    text-shadow: 2px 2px 4px rgba(255,255,255,0.8);
}}

.cover-subtitle {{
    font-size: 16pt;
    color: #A0522D;
    font-style: italic;
    text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
}}
        """

    async def create_preview_pdf(
        self,
        title: str,
        stories: list[dict],
        child_name: str,
        illustrations: dict,
        cover_illustration_base64: Optional[str] = None,
        dedication: Optional[str] = None,
        format: str = "square",
        age: int = 5
    ) -> bytes:
        """
        Creëer een realistische preview PDF die laat zien hoe het boek eruitziet.

        Layout-specific rendering:
        - toddler (2-3): Illustratie links, tekst rechts (groot font)
        - preschool (4-5): Tekst links, illustratie rechts
        - early_reader (6-8): Tekst links, illustratie rechts (kleiner font)

        Args:
            title: Boek titel
            stories: Lijst van verhalen met {title, pages: [{page_number, text}]}
            child_name: Naam van het kind
            illustrations: Dict van page_number -> base64 image
            cover_illustration_base64: Cover afbeelding
            dedication: Optionele opdracht
            format: "square" of "a4_landscape"
            age: Leeftijd van het kind (bepaalt layout)
        """
        # Use Lulu format for realistic dimensions
        book_format = self.LULU_FORMATS.get(format, self.LULU_FORMATS["square"])
        page_width = book_format["width"]
        page_height = book_format["height"]
        layout_group = get_layout_group(age)
        layout_config = get_layout_config(age)

        # Lazy load WeasyPrint
        _load_weasyprint()
        if self.font_config is None:
            self.font_config = FontConfiguration()

        # Build HTML with layout-specific rendering
        html_content = self._build_preview_html(
            title=title,
            stories=stories,
            child_name=child_name,
            illustrations=illustrations,
            cover_illustration_base64=cover_illustration_base64,
            dedication=dedication,
            page_width=page_width,
            page_height=page_height,
            layout_group=layout_group,
            layout_config=layout_config
        )

        # CSS for preview with layout-specific styling
        css = self._get_preview_css(page_width, page_height, layout_group)

        # Generate PDF with high resolution for print quality
        html = HTML(string=html_content)
        pdf_bytes = html.write_pdf(
            stylesheets=[CSS(string=css)],
            font_config=self.font_config,
            image_resolution=300,  # 300 DPI for print quality
            optimize_images=False  # Don't compress images
        )

        return pdf_bytes

    def calculate_preview_page_count(self, stories: list[dict], has_dedication: bool = False, age: int = 5) -> int:
        """
        Bereken het totale aantal pagina's voor de preview PDF.

        Layout-afhankelijk:
        - toddler (2-3): 2 pagina's per tekstblok (spread)
        - preschool (4-5): 1 pagina per tekstblok
        - early_reader (6-8): 1 pagina per tekstblok

        Vaste pagina's:
        - 1: Voorkaft
        - 2: Binnenkant voorkaft (blank)
        - 3: Boek titelpagina
        - 4: Opdracht (optioneel)
        - Per verhaal:
          - pages_per_block * aantal_tekstblokken
        - 1: Colofon
        - 1: Binnenkant achterkaft (blank)
        - 1: Achterkaft
        """
        layout_group = get_layout_group(age)
        pages_per_block = 2 if layout_group == "toddler" else 1

        # Fixed pages
        page_count = 3  # voorkaft, binnenkant, boek titel
        if has_dedication:
            page_count += 1

        # Per story
        for story in stories:
            num_text_blocks = len(story.get('pages', []))
            page_count += num_text_blocks * pages_per_block

        # End pages
        page_count += 3  # colofon, binnenkant achterkaft, achterkaft

        return page_count

    def _build_preview_html(
        self,
        title: str,
        stories: list[dict],
        child_name: str,
        illustrations: dict,
        cover_illustration_base64: Optional[str],
        dedication: Optional[str],
        page_width: float,
        page_height: float,
        layout_group: str = "preschool",
        layout_config: dict = None
    ) -> str:
        """Build HTML for preview PDF with layout-specific rendering"""

        if layout_config is None:
            layout_config = {"font_size": "18pt", "max_sentences": 4}

        template = Template("""
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>{{ title }} - Preview</title>
</head>
<body>
    <!-- VOORKANT (Front Cover) -->
    <div class="page front-cover">
        {% if cover_illustration_base64 %}
        <img class="cover-bg" src="data:image/png;base64,{{ cover_illustration_base64 }}" alt="Cover">
        {% endif %}
        <div class="cover-content">
            {% if logo_base64 %}
            <img class="cover-logo" src="data:image/png;base64,{{ logo_base64 }}" alt="Knuffelboek">
            {% endif %}
            <h1 class="cover-title">{{ title }}</h1>
            <p class="cover-subtitle">Speciaal voor {{ child_name }}</p>
        </div>
    </div>

    <!-- Binnenkant voorkant (blank) -->
    <div class="page blank-page inside-front"></div>

    <!-- Boek Titelpagina -->
    <div class="page title-page">
        <div class="title-content">
            {% if logo_base64 %}
            <img class="title-logo" src="data:image/png;base64,{{ logo_base64 }}" alt="Knuffelboek">
            {% endif %}
            <h1>{{ title }}</h1>
            <p class="subtitle">Speciaal voor {{ child_name }}</p>
        </div>
    </div>

    {% if dedication %}
    <!-- Opdracht pagina -->
    <div class="page dedication-page">
        <div class="dedication">
            <p>{{ dedication }}</p>
        </div>
    </div>
    {% endif %}

    <!-- Verhalen -->
    {% for story in stories %}

    <!-- Verhaal pagina's met layout-specifieke rendering -->
    {% for page in story.pages %}

    {% if layout_group == "toddler" %}
    {# TODDLER (2-3): 2-page spread - Illustratie links, tekst rechts (groot font) #}
    <!-- Illustratie pagina (links) -->
    <div class="page illustration-page left-page toddler-illustration">
        {% if illustrations.get(page.page_number) %}
        <img class="full-illustration" src="data:image/png;base64,{{ illustrations.get(page.page_number) }}" alt="Illustratie">
        {% else %}
        <div class="illustration-placeholder">
            <p>Illustratie {{ page.page_number }}</p>
        </div>
        {% endif %}
    </div>

    <!-- Tekst pagina (rechts, groot font) -->
    <div class="page text-page right-page toddler-text">
        <div class="text-content">
            <p class="story-text">{{ page.text }}</p>
        </div>
        <div class="page-number">{{ loop.index }}</div>
    </div>

    {% elif layout_group == "early_reader" %}
    {# EARLY READER (6-8): 1 pagina - Paginavullende illustratie met tekst overlay #}
    <div class="page combined-page early-reader-page">
        {% if illustrations.get(page.page_number) %}
        <img class="full-illustration" src="data:image/png;base64,{{ illustrations.get(page.page_number) }}" alt="Illustratie">
        {% else %}
        <div class="illustration-placeholder">
            <p>Illustratie {{ page.page_number }}</p>
        </div>
        {% endif %}
        <div class="text-overlay">
            <p class="story-text">{{ page.text }}</p>
        </div>
        <div class="page-number overlay-page-number">{{ loop.index }}</div>
    </div>

    {% else %}
    {# PRESCHOOL (4-5): 1 pagina - Illustratie bovenaan, tekst eronder #}
    <div class="page combined-page preschool-page">
        <div class="preschool-illustration-container">
            {% if illustrations.get(page.page_number) %}
            <img class="preschool-illustration" src="data:image/png;base64,{{ illustrations.get(page.page_number) }}" alt="Illustratie">
            {% else %}
            <div class="illustration-placeholder">
                <p>Illustratie {{ page.page_number }}</p>
            </div>
            {% endif %}
        </div>
        <div class="preschool-text-container">
            <p class="story-text">{{ page.text }}</p>
        </div>
        <div class="page-number">{{ loop.index }}</div>
    </div>
    {% endif %}

    {% endfor %}
    {% endfor %}

    <!-- Colofon/Einde pagina -->
    <div class="page colophon-page">
        <div class="colophon-content">
            <p class="the-end">~ Einde ~</p>
            {% if logo_base64 %}
            <img class="colophon-logo" src="data:image/png;base64,{{ logo_base64 }}" alt="Knuffelboek">
            {% endif %}
            <p class="made-with">Gemaakt met Knuffelboek</p>
            <p class="made-for">Speciaal voor {{ child_name }}</p>
        </div>
    </div>

    <!-- Binnenkant achterkant (blank) -->
    <div class="page blank-page inside-back"></div>

    <!-- ACHTERKANT (Back Cover) -->
    <div class="page back-cover">
        <div class="back-content">
            <p class="back-text">Een magisch gepersonaliseerd kinderboek<br>gemaakt met veel liefde.</p>
            {% if logo_base64 %}
            <img class="back-logo" src="data:image/png;base64,{{ logo_base64 }}" alt="Knuffelboek">
            {% else %}
            <p class="back-brand">Knuffelboek</p>
            {% endif %}
        </div>
    </div>
</body>
</html>
        """)

        return template.render(
            title=title,
            child_name=child_name,
            stories=stories,
            illustrations=illustrations,
            cover_illustration_base64=cover_illustration_base64,
            dedication=dedication,
            logo_base64=_get_logo_base64(),
            layout_group=layout_group,
            layout_config=layout_config
        )

    def _get_preview_css(self, page_width: float, page_height: float, layout_group: str = "preschool") -> str:
        """Generate CSS for preview PDF with layout-specific styling"""

        # Font sizes per layout group
        font_sizes = {
            "toddler": "22pt",
            "preschool": "18pt",
            "early_reader": "14pt"
        }
        font_size = font_sizes.get(layout_group, "18pt")

        return f"""
@page {{
    size: {page_width}mm {page_height}mm;
    margin: 0;
}}

* {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}}

body {{
    font-family: 'Georgia', 'Times New Roman', serif;
}}

.page {{
    width: {page_width}mm;
    height: {page_height}mm;
    page-break-after: always;
    position: relative;
    overflow: hidden;
}}

.page:last-child {{
    page-break-after: auto;
}}

/* ===== FRONT COVER ===== */
.front-cover {{
    background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}}

.front-cover .cover-bg {{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.25;
}}

.front-cover .cover-content {{
    position: relative;
    z-index: 1;
    padding: 20mm;
}}

.cover-title {{
    font-size: 28pt;
    color: #8B4513;
    margin-bottom: 8mm;
    text-shadow: 2px 2px 4px rgba(255,255,255,0.9);
    line-height: 1.2;
}}

.cover-subtitle {{
    font-size: 14pt;
    color: #A0522D;
    font-style: italic;
    text-shadow: 1px 1px 2px rgba(255,255,255,0.9);
}}

.cover-logo {{
    max-width: 60mm;
    max-height: 30mm;
    margin-bottom: 10mm;
}}

/* ===== BLANK PAGES ===== */
.blank-page {{
    background: #fffef8;
    display: flex;
    justify-content: center;
    align-items: center;
}}

.blank-page .watermark {{
    font-size: 10pt;
    color: #ddd;
    font-style: italic;
}}

/* ===== TITLE PAGE ===== */
.title-page {{
    background: #fffef5;
    display: flex;
    justify-content: center;
    align-items: center;
}}

.title-content {{
    text-align: center;
    padding: 20mm;
}}

.title-content h1 {{
    font-size: 32pt;
    color: #8B4513;
    margin-bottom: 8mm;
    line-height: 1.2;
}}

.title-content .subtitle {{
    font-size: 16pt;
    color: #A0522D;
    font-style: italic;
    margin-bottom: 15mm;
}}

.title-decoration {{
    font-size: 24pt;
}}

/* ===== DEDICATION PAGE ===== */
.dedication-page {{
    background: #fffef5;
    display: flex;
    justify-content: center;
    align-items: center;
}}

.dedication {{
    text-align: center;
    padding: 30mm;
    max-width: 80%;
}}

.dedication p {{
    font-size: 14pt;
    color: #666;
    font-style: italic;
    line-height: 1.6;
}}

/* ===== TITLE LOGO ===== */
.title-logo {{
    max-width: 50mm;
    max-height: 25mm;
    margin-bottom: 10mm;
}}

/* ===== STORY TITLE PAGE ===== */
.story-title-page {{
    background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
}}

.story-title-bg {{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.3;
}}

.story-title-content {{
    position: relative;
    z-index: 1;
    padding: 20mm;
}}

.story-title {{
    font-size: 26pt;
    color: #8B4513;
    margin-bottom: 5mm;
    text-shadow: 2px 2px 4px rgba(255,255,255,0.9);
    line-height: 1.2;
}}

.story-number {{
    font-size: 12pt;
    color: #A0522D;
    font-style: italic;
}}

/* ===== TEXT PAGE (Links) ===== */
.text-page {{
    background: #fffef5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 15mm 20mm;
}}

.text-content {{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}}

.story-text {{
    font-size: {font_size};
    color: #333;
    line-height: 1.8;
    text-align: left;
}}

/* Layout-specific text styling for preview */
.toddler-text .story-text {{
    font-size: 22pt;
    line-height: 2.0;
}}

.preschool-text .story-text {{
    font-size: 18pt;
    line-height: 1.8;
}}

.early-reader-text .story-text {{
    font-size: 14pt;
    line-height: 1.6;
}}

.page-number {{
    position: absolute;
    bottom: 10mm;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10pt;
    color: #999;
}}

/* ===== ILLUSTRATION PAGE (Rechts, paginavullend) ===== */
.illustration-page {{
    background: #fffef5;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
}}

.full-illustration {{
    width: 100%;
    height: 100%;
    object-fit: cover;
}}

.illustration-placeholder {{
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
    display: flex;
    justify-content: center;
    align-items: center;
}}

.illustration-placeholder p {{
    font-size: 14pt;
    color: #999;
    font-style: italic;
}}

/* ===== COLOPHON PAGE ===== */
.colophon-page {{
    background: #fffef5;
    display: flex;
    justify-content: center;
    align-items: center;
}}

.colophon-content {{
    text-align: center;
}}

.the-end {{
    font-size: 20pt;
    color: #8B4513;
    font-style: italic;
    margin-bottom: 10mm;
}}

.colophon-logo {{
    max-width: 50mm;
    max-height: 25mm;
    margin-bottom: 8mm;
}}

.made-with {{
    font-size: 12pt;
    color: #A0522D;
    margin-bottom: 3mm;
}}

.made-for {{
    font-size: 14pt;
    color: #666;
    font-style: italic;
}}

/* ===== BACK COVER ===== */
.back-cover {{
    background: linear-gradient(135deg, #ffe6cc 0%, #fff5e6 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}}

.back-content {{
    padding: 20mm;
}}

.back-text {{
    font-size: 12pt;
    color: #666;
    font-style: italic;
    line-height: 1.6;
    margin-bottom: 10mm;
}}

.back-logo {{
    max-width: 60mm;
    max-height: 30mm;
    margin-top: 10mm;
}}

.back-brand {{
    font-size: 16pt;
    color: #8B4513;
    font-weight: bold;
}}

/* ===== PRESCHOOL COMBINED PAGE (4-5 jaar) ===== */
/* Illustratie bovenaan (~65% van pagina), tekst eronder in apart blok */
.preschool-page {{
    background: #fffef5;
    display: flex;
    flex-direction: column;
    padding: 0;
    height: {page_height}mm;
}}

.preschool-illustration-container {{
    height: 65%;
    width: 100%;
    overflow: hidden;
    position: relative;
}}

.preschool-illustration {{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}}

.preschool-text-container {{
    height: 35%;
    background: #fffef5;
    padding: 8mm 12mm;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}}

.preschool-text-container .story-text {{
    font-size: 18pt;
    line-height: 1.6;
    color: #333;
    text-align: center;
}}

/* ===== EARLY READER COMBINED PAGE (6-8 jaar) ===== */
/* Paginavullende illustratie met tekst overlay in semi-transparant blok */
.early-reader-page {{
    background: #fffef5;
    position: relative;
    padding: 0;
}}

.early-reader-page .full-illustration {{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}}

.text-overlay {{
    position: absolute;
    bottom: 15mm;
    left: 10mm;
    right: 10mm;
    background: rgba(255, 255, 255, 0.92);
    padding: 10mm 12mm;
    border-radius: 3mm;
    box-shadow: 0 2mm 6mm rgba(0,0,0,0.15);
}}

.text-overlay .story-text {{
    font-size: 14pt;
    line-height: 1.5;
    color: #333;
    text-align: left;
}}

.overlay-page-number {{
    position: absolute;
    bottom: 6mm;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10pt;
    color: rgba(255,255,255,0.8);
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}}
        """


# === Standalone test ===
if __name__ == "__main__":
    import asyncio
    
    async def test():
        service = PDFService()
        
        # Test data
        test_pages = [
            {
                "text": "Beer Bruno keek uit het raam. De maan scheen helder.",
                "illustration_base64": None  # Zou een echte base64 image zijn
            },
            {
                "text": "Hij gaapte groot. Het was tijd om te gaan slapen.",
                "illustration_base64": None
            }
        ]
        
        pdf_bytes = await service.create_book_pdf(
            title="Beer Bruno gaat slapen",
            pages=test_pages,
            child_name="Emma",
            dedication="Voor Emma, de liefste dromer"
        )
        
        # Schrijf naar bestand voor test
        with open("test_book.pdf", "wb") as f:
            f.write(pdf_bytes)
        
        print(f"PDF gegenereerd: {len(pdf_bytes)} bytes")
    
    asyncio.run(test())
