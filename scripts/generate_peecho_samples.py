#!/usr/bin/env python3
"""
Generate sample PDFs for Peecho product setup.

This script creates placeholder PDFs for each Peecho book format
with the correct dimensions and minimum page counts.

These PDFs can be uploaded to Peecho to configure your products.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from reportlab.lib.pagesizes import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Import book formats
from backend.config.peecho_formats import (
    BOOK_FORMATS,
    PAGES_PER_STORY_BY_AGE,
    EXTRA_BOOK_PAGES,
    calculate_stories_required
)

# Knuffelboek brand colors
COLORS = {
    'wolwit': HexColor('#FFF9F1'),
    'zand': HexColor('#F2E4CF'),
    'nachtblauw': HexColor('#1F2A44'),
    'pastelblauw': HexColor('#A7C7E7'),
    'saliegroen': HexColor('#A8C4A2'),
    'abrikoos': HexColor('#FFB786'),
}

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / "peecho_samples"


def mm_to_points(millimeters):
    """Convert millimeters to points (1mm = 2.834645669 points)"""
    return millimeters * mm


def create_sample_pdf(format_spec: dict, output_path: Path):
    """
    Create a sample PDF for a specific Peecho format.

    Args:
        format_spec: Format specification from BOOK_FORMATS
        output_path: Where to save the PDF
    """
    width_pt = mm_to_points(format_spec['width_mm'])
    height_pt = mm_to_points(format_spec['height_mm'])
    page_count = format_spec['min_pages']

    c = canvas.Canvas(str(output_path), pagesize=(width_pt, height_pt))

    for page_num in range(1, page_count + 1):
        draw_page(c, format_spec, page_num, page_count, width_pt, height_pt)
        c.showPage()

    c.save()
    print(f"Created: {output_path.name} ({format_spec['width_mm']}x{format_spec['height_mm']}mm, {page_count} pages)")


def draw_page(c, format_spec, page_num, total_pages, width_pt, height_pt):
    """Draw a single page with proper content."""

    # Page type determination
    if page_num == 1:
        page_type = "FRONT COVER"
        bg_color = COLORS['pastelblauw']
    elif page_num == total_pages:
        page_type = "BACK COVER"
        bg_color = COLORS['saliegroen']
    elif page_num == 2:
        page_type = "TITLE PAGE"
        bg_color = COLORS['wolwit']
    elif page_num == 3:
        page_type = "OWNERSHIP PAGE"
        bg_color = COLORS['wolwit']
    elif page_num == total_pages - 1:
        page_type = "COLOPHON"
        bg_color = COLORS['wolwit']
    else:
        page_type = f"STORY PAGE {page_num - 3}"
        bg_color = COLORS['wolwit']

    # Draw background
    c.setFillColor(bg_color)
    c.rect(0, 0, width_pt, height_pt, fill=True, stroke=False)

    # Draw safe margin indicator (10mm)
    margin_pt = mm_to_points(10)
    c.setStrokeColor(HexColor('#CCCCCC'))
    c.setLineWidth(0.5)
    c.setDash([3, 3])
    c.rect(margin_pt, margin_pt, width_pt - 2*margin_pt, height_pt - 2*margin_pt, fill=False, stroke=True)
    c.setDash([])

    # Draw content
    c.setFillColor(COLORS['nachtblauw'])

    # Format name at top
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width_pt / 2, height_pt - margin_pt - 20, format_spec['name'])

    # Page type
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width_pt / 2, height_pt / 2 + 40, page_type)

    # Page number
    c.setFont("Helvetica", 18)
    c.drawCentredString(width_pt / 2, height_pt / 2, f"Page {page_num} of {total_pages}")

    # Dimensions
    c.setFont("Helvetica", 12)
    c.drawCentredString(width_pt / 2, height_pt / 2 - 30,
                        f"{format_spec['width_mm']} x {format_spec['height_mm']} mm")

    # Cover type
    c.drawCentredString(width_pt / 2, height_pt / 2 - 50,
                        f"Cover: {format_spec['cover_type'].upper()}")

    # Safe margin note
    c.setFont("Helvetica-Oblique", 10)
    c.setFillColor(HexColor('#888888'))
    c.drawCentredString(width_pt / 2, margin_pt + 30,
                        "Dashed line = 10mm safe margin")

    # Knuffelboek branding
    c.setFillColor(COLORS['nachtblauw'])
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width_pt / 2, margin_pt + 60, "Knuffelboek")

    # Special content for specific pages
    if page_num == 1:  # Front cover
        c.setFont("Helvetica-Bold", 20)
        c.drawCentredString(width_pt / 2, height_pt / 2 - 100,
                            "[Book Title Here]")
        c.setFont("Helvetica", 14)
        c.drawCentredString(width_pt / 2, height_pt / 2 - 130,
                            "[Illustration of toy character]")

    elif page_num == 2:  # Title page
        c.setFont("Helvetica-Bold", 18)
        c.drawCentredString(width_pt / 2, height_pt / 2 - 80,
                            "Gemaakt voor [Kind], [X] jaar")
        c.setFont("Helvetica", 12)
        c.drawCentredString(width_pt / 2, height_pt / 2 - 110,
                            "[Small illustration]")

    elif page_num == 3:  # Ownership page
        c.setFont("Helvetica", 14)
        lines = [
            "Dit boek hoort toe aan:",
            "[Kind's naam]",
            "",
            "Met hun knuffel:",
            "[Knuffel's naam]",
            "",
            "www.knuffelboek.nl"
        ]
        y = height_pt / 2 - 60
        for line in lines:
            c.drawCentredString(width_pt / 2, y, line)
            y -= 25

    elif page_num == total_pages:  # Back cover
        c.setFont("Helvetica", 12)
        lines = [
            "Dit boekje is speciaal gemaakt",
            "voor [Kind] en hun knuffel [Knuffel].",
            "",
            "Gemaakt met Knuffelboek",
            "www.knuffelboek.nl"
        ]
        y = height_pt / 2 - 80
        for line in lines:
            c.drawCentredString(width_pt / 2, y, line)
            y -= 20


def create_all_samples():
    """Create sample PDFs for all Peecho formats."""

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)

    print("=" * 60)
    print("GENERATING PEECHO SAMPLE PDFs")
    print("=" * 60)
    print(f"Output directory: {OUTPUT_DIR}")
    print()

    for format_spec in BOOK_FORMATS:
        filename = f"knuffelboek_sample_{format_spec['id']}.pdf"
        output_path = OUTPUT_DIR / filename
        create_sample_pdf(format_spec, output_path)

    print()
    print("=" * 60)
    print("DONE! Upload these PDFs to Peecho dashboard:")
    print("https://www.peecho.com/dashboard/settings/products")
    print("=" * 60)

    # Print summary table
    print()
    print("FORMAT SUMMARY:")
    print("-" * 80)
    print(f"{'Format':<30} {'Size (mm)':<15} {'Cover':<12} {'Min Pages':<10}")
    print("-" * 80)

    for f in BOOK_FORMATS:
        size = f"{f['width_mm']}x{f['height_mm']}"
        print(f"{f['name']:<30} {size:<15} {f['cover_type']:<12} {f['min_pages']:<10}")

    print("-" * 80)


def create_age_specific_samples():
    """Create samples showing age-specific page counts."""

    age_dir = OUTPUT_DIR / "by_age"
    age_dir.mkdir(exist_ok=True)

    print()
    print("=" * 60)
    print("GENERATING AGE-SPECIFIC SAMPLES")
    print("=" * 60)

    for age, pages_per_story in PAGES_PER_STORY_BY_AGE.items():
        # Determine recommended format for this age
        if age <= 4:
            format_id = "square_small_hardcover"
        elif age <= 6:
            format_id = "a5_portrait_hardcover"
        else:
            format_id = "a4_portrait_hardcover"

        format_spec = next(f for f in BOOK_FORMATS if f['id'] == format_id)

        # Use the new calculation that includes extra pages
        calc = calculate_stories_required(age, format_spec['min_pages'])
        stories_needed = calc['stories_required']
        story_pages = calc['story_pages_total']
        extra_pages = calc['extra_pages']
        total_pages = calc['final_page_count']

        # Create sample with this configuration
        filename = f"knuffelboek_age{age}_{total_pages}pages.pdf"
        output_path = age_dir / filename

        # Temporarily modify format spec
        modified_spec = format_spec.copy()
        modified_spec['min_pages'] = total_pages
        modified_spec['name'] = f"{format_spec['name']} (Age {age})"

        create_sample_pdf(modified_spec, output_path)

        print(f"  Age {age}: {pages_per_story} pag/verhaal x {stories_needed} verhalen = {story_pages} + {extra_pages} extra = {total_pages} totaal")

    print()
    print(f"Age-specific samples saved to: {age_dir}")


def create_complete_product_samples():
    """
    Create complete set of PDFs for Peecho product setup.

    Generates PDFs for each age (2-8) x cover type (hardcover/softcover).
    This gives you all the PDFs needed to set up products in Peecho.
    """

    products_dir = OUTPUT_DIR / "products"
    products_dir.mkdir(exist_ok=True)

    print()
    print("=" * 70)
    print("GENERATING COMPLETE PRODUCT SAMPLES (Per Age + Cover Type)")
    print("=" * 70)
    print()

    # Summary table header
    print(f"{'Age':<5} {'Cover':<12} {'Format':<25} {'Stories':<8} {'Pages':<8} {'Filename':<40}")
    print("-" * 100)

    products = []

    for age in range(2, 9):  # Ages 2-8
        for cover_type in ['hardcover', 'softcover']:
            # Determine format based on age and cover type
            if age <= 4:
                base_format = "square_small"
            elif age <= 6:
                base_format = "a5_portrait"
            else:
                base_format = "a4_portrait"

            format_id = f"{base_format}_{cover_type}"
            format_spec = next((f for f in BOOK_FORMATS if f['id'] == format_id), None)

            if not format_spec:
                print(f"  Warning: Format {format_id} not found, skipping")
                continue

            # Calculate stories and pages needed
            min_pages = format_spec['min_pages']  # 24 for hardcover, 20 for softcover
            calc = calculate_stories_required(age, min_pages)
            stories_needed = calc['stories_required']
            total_pages = calc['final_page_count']

            # Create filename
            filename = f"knuffelboek_age{age}_{cover_type}_{total_pages}pages.pdf"
            output_path = products_dir / filename

            # Create modified spec with correct page count
            modified_spec = format_spec.copy()
            modified_spec['min_pages'] = total_pages
            modified_spec['name'] = f"Knuffelboek Age {age} ({cover_type.title()})"

            create_sample_pdf(modified_spec, output_path)

            # Print row
            print(f"{age:<5} {cover_type:<12} {base_format:<25} {stories_needed:<8} {total_pages:<8} {filename:<40}")

            # Store product info
            products.append({
                'age': age,
                'cover_type': cover_type,
                'format': base_format,
                'stories': stories_needed,
                'pages': total_pages,
                'filename': filename,
                'width_mm': format_spec['width_mm'],
                'height_mm': format_spec['height_mm']
            })

    print("-" * 100)
    print()
    print(f"Total: {len(products)} PDFs generated in: {products_dir}")
    print()

    # Print Peecho setup instructions
    print("=" * 70)
    print("PEECHO PRODUCT SETUP INSTRUCTIONS")
    print("=" * 70)
    print()
    print("1. Go to https://test.www.peecho.com (for test) or")
    print("   https://www.peecho.com (for production)")
    print()
    print("2. Navigate to Settings > Products")
    print()
    print("3. For each PDF, create a new product with:")
    print("   - Upload the PDF")
    print("   - Set the correct dimensions (width x height)")
    print("   - Set minimum/maximum pages")
    print("   - Note down the Product ID")
    print()
    print("4. Update your .env with the Product IDs")
    print()

    # Print product summary for easy reference
    print("PRODUCT SUMMARY:")
    print("-" * 70)
    for p in products:
        print(f"Age {p['age']} {p['cover_type']:10} : {p['width_mm']}x{p['height_mm']}mm, {p['pages']} pages")
    print("-" * 70)

    return products


if __name__ == "__main__":
    # Check for reportlab
    try:
        import reportlab
    except ImportError:
        print("ERROR: reportlab is required. Install with:")
        print("  pip install reportlab")
        sys.exit(1)

    create_all_samples()
    create_age_specific_samples()
    create_complete_product_samples()
