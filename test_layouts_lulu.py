"""
Test script om PDF layouts te genereren voor alle leeftijden en te valideren bij Lulu.
"""
import asyncio
import os
import sys
import base64
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from backend.services.pdf_service import PDFService
from backend.config.peecho_formats import (
    get_pages_per_story,
    get_layout_group,
    get_layout_config,
    PAGES_PER_STORY_BY_AGE
)

# Create a simple placeholder image (1x1 pixel gray PNG)
PLACEHOLDER_IMAGE = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

# Create a more realistic placeholder (100x100 gray with border)
def create_placeholder_image():
    """Create a simple placeholder image as base64"""
    # Use a pre-generated 200x200 gray placeholder
    # This is a simple gray square PNG
    return PLACEHOLDER_IMAGE


async def generate_test_pdf_for_age(age: int, output_dir: Path) -> str:
    """Generate a test PDF for a specific age"""

    pdf_service = PDFService()

    # Get layout info
    layout_group = get_layout_group(age)
    layout_config = get_layout_config(age)
    num_text_blocks = get_pages_per_story(age)
    pages_per_block = layout_config.get("pages_per_block", 2)

    print(f"\n{'='*60}")
    print(f"Leeftijd {age} jaar - Layout: {layout_group}")
    print(f"Tekstblokken: {num_text_blocks}, Pages per block: {pages_per_block}")
    print(f"{'='*60}")

    # Create test story with correct number of pages
    story_pages = []
    for i in range(1, num_text_blocks + 1):
        story_pages.append({
            "page_number": i,
            "text": f"Dit is testtekst voor pagina {i}. Dit is een voorbeeldverhaal voor een kind van {age} jaar. De tekst is aangepast aan de leeftijd met de juiste lengte en complexiteit.",
            "scene": f"Scène {i}: Een vrolijke illustratie",
            "layout_group": layout_group
        })

    stories = [{
        "title": f"Testverhaal voor {age} jaar",
        "pages": story_pages
    }]

    # Create placeholder illustrations
    illustrations = {}
    placeholder = create_placeholder_image()
    for i in range(1, num_text_blocks + 1):
        illustrations[i] = placeholder

    # Generate interior PDF
    interior_pdf = await pdf_service.create_lulu_interior_pdf(
        title=f"Testverhaal voor {age} jaar",
        stories=stories,
        child_name="Test Kind",
        illustrations=illustrations,
        lulu_format="square",
        dedication="Dit is een testboek voor PDF validatie.",
        age=age
    )

    # Save interior PDF
    interior_path = output_dir / f"test_interior_age_{age}_{layout_group}.pdf"
    with open(interior_path, "wb") as f:
        f.write(interior_pdf)
    print(f"✓ Interior PDF opgeslagen: {interior_path}")
    print(f"  Grootte: {len(interior_pdf) / 1024:.1f} KB")

    # Generate cover PDF
    cover_pdf = await pdf_service.create_lulu_cover_pdf(
        title=f"Testverhaal voor {age} jaar",
        child_name="Test Kind",
        page_count=len(story_pages) * pages_per_block + 7,  # Story pages + fixed pages
        cover_illustration_base64=placeholder,
        back_text="Dit is een testboek gemaakt met Knuffelboek.",
        lulu_format="square",
        cover_type="hardcover"
    )

    # Save cover PDF
    cover_path = output_dir / f"test_cover_age_{age}_{layout_group}.pdf"
    with open(cover_path, "wb") as f:
        f.write(cover_pdf)
    print(f"✓ Cover PDF opgeslagen: {cover_path}")
    print(f"  Grootte: {len(cover_pdf) / 1024:.1f} KB")

    return str(interior_path)


async def validate_with_lulu(pdf_path: str) -> dict:
    """Validate PDF with Lulu API (if available)"""
    # Check if we have Lulu credentials
    from dotenv import load_dotenv
    load_dotenv()

    lulu_key = os.getenv("LULU_API_KEY")
    lulu_secret = os.getenv("LULU_API_SECRET")

    if not lulu_key or not lulu_secret:
        print("⚠ Lulu API credentials niet gevonden - validatie overgeslagen")
        return {"status": "skipped", "reason": "No Lulu credentials"}

    # Import Lulu service
    try:
        from backend.services.lulu_service import LuluService
        lulu = LuluService()

        # Upload and validate
        print(f"📤 Uploaden naar Lulu voor validatie...")
        # Note: Lulu validation would need actual implementation
        # For now, we just check if the service is available

        return {"status": "available", "message": "Lulu service beschikbaar"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


async def main():
    """Generate test PDFs for all ages"""

    # Create output directory
    output_dir = Path(__file__).parent / "test_pdfs"
    output_dir.mkdir(exist_ok=True)

    print("\n" + "="*70)
    print("KNUFFELBOEK PDF LAYOUT TEST")
    print("Genereren van test-PDFs voor alle leeftijden")
    print("="*70)

    # Test ages
    ages = [2, 3, 4, 5, 6, 7, 8]

    results = {}
    for age in ages:
        try:
            pdf_path = await generate_test_pdf_for_age(age, output_dir)
            results[age] = {"status": "success", "path": pdf_path}
        except Exception as e:
            print(f"✗ Fout bij leeftijd {age}: {e}")
            results[age] = {"status": "error", "error": str(e)}

    # Summary
    print("\n" + "="*70)
    print("SAMENVATTING")
    print("="*70)

    print("\n| Leeftijd | Layout       | Blokken | Pag/blok | Status |")
    print("|----------|--------------|---------|----------|--------|")

    for age in ages:
        layout = get_layout_group(age)
        blocks = get_pages_per_story(age)
        config = get_layout_config(age)
        ppb = config.get("pages_per_block", 2)
        status = "✓" if results[age]["status"] == "success" else "✗"
        print(f"| {age} jaar   | {layout:12} | {blocks:7} | {ppb:8} | {status}      |")

    print(f"\nPDFs opgeslagen in: {output_dir}")
    print("\nJe kunt deze PDFs nu handmatig uploaden naar Lulu om te valideren:")
    print("https://developers.lulu.com/")

    return results


if __name__ == "__main__":
    asyncio.run(main())
