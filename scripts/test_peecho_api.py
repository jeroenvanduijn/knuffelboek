#!/usr/bin/env python3
"""
Test script voor Peecho API integratie.

Voert basis tests uit op de test omgeving.
"""

import asyncio
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from backend.services.peecho_service import (
    peecho_service,
    BookSpecs,
    ShippingAddress
)


async def test_configuration():
    """Test basis configuratie"""
    print("=" * 60)
    print("PEECHO API TEST")
    print("=" * 60)
    print()

    print("[1] Configuratie Check")
    print("-" * 40)
    print(f"   Test Mode: {peecho_service.test_mode}")
    print(f"   Base URL: {peecho_service.base_url}")
    print(f"   API Key configuriert: {'Ja' if peecho_service.api_key else 'Nee'}")
    print(f"   API Secret configuriert: {'Ja' if peecho_service.api_secret else 'Nee'}")
    print(f"   Offering ID: {peecho_service.offering_id}")
    print(f"   Is Configured: {peecho_service.is_configured}")
    print()

    return peecho_service.is_configured


async def test_create_order():
    """Test order aanmaken (gebruikt test PDF)"""
    print("[2] Test Order Aanmaken")
    print("-" * 40)

    # Gebruik een publieke test PDF
    # Dit is een standaard test PDF die publiek toegankelijk is
    test_pdf_url = "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf"

    book_specs = BookSpecs(
        content_url=test_pdf_url,
        content_width=210,  # A4 width
        content_height=297,  # A4 height
        number_of_pages=24,  # Minimum voor hardcover
        spine_text_center="Knuffelboek Test"
    )

    shipping_address = ShippingAddress(
        first_name="Test",
        last_name="Gebruiker",
        address_line_1="Teststraat 123",
        city="Amsterdam",
        postal_code="1234AB",
        country_code="NL"
    )

    print(f"   PDF URL: {test_pdf_url}")
    print(f"   Format: {book_specs.content_width}x{book_specs.content_height}mm")
    print(f"   Pages: {book_specs.number_of_pages}")
    print(f"   Shipping to: {shipping_address.city}, {shipping_address.country_code}")
    print()

    print("   Aanmaken order...")
    result = await peecho_service.create_order(
        book_specs=book_specs,
        email="test@knuffelboek.nl",
        shipping_address=shipping_address,
        reference_id="test_order_001"
    )

    if result.get("success"):
        print(f"   SUCCESS!")
        print(f"   Order ID: {result.get('order_id')}")
        print(f"   Status: {result.get('status')}")
        print(f"   Prijs: {result.get('price')} {result.get('currency', 'EUR')}")
        return result.get("order_id")
    else:
        print(f"   FAILED: {result.get('error')}")
        if result.get("details"):
            print(f"   Details: {result.get('details')}")
        return None


async def test_order_status(order_id: str):
    """Test order status ophalen"""
    print()
    print("[3] Order Status Ophalen")
    print("-" * 40)
    print(f"   Order ID: {order_id}")

    result = await peecho_service.get_order_status(order_id)

    if result.get("success"):
        print(f"   Status: {result.get('status')}")
        print(f"   Can Cancel: {result.get('can_cancel')}")
        if result.get("tracking_url"):
            print(f"   Tracking: {result.get('tracking_url')}")
    else:
        print(f"   FAILED: {result.get('error')}")


async def test_book_formats():
    """Test boekformaten ophalen"""
    print()
    print("[4] Beschikbare Boekformaten")
    print("-" * 40)

    formats = peecho_service.get_book_formats()
    print(f"   {len(formats)} formaten beschikbaar:")
    for fmt in formats:
        print(f"   - {fmt['name']} ({fmt['width_mm']}x{fmt['height_mm']}mm, {fmt['cover_type']})")


async def test_print_requirements():
    """Test print requirements berekening"""
    print()
    print("[5] Print Requirements voor Leeftijden")
    print("-" * 40)

    for age in [2, 4, 7]:
        reqs = peecho_service.calculate_print_requirements(age, "hardcover")
        if reqs.get("format"):
            print(f"   Leeftijd {age}: {reqs['stories_required']} verhaal(en), {reqs['final_page_count']} pagina's, {reqs['format_name']}")


async def main():
    """Run alle tests"""
    is_configured = await test_configuration()

    if not is_configured:
        print("GESTOPT: Peecho is niet volledig geconfigureerd.")
        print("Controleer PEECHO_API_KEY, PEECHO_API_SECRET en PEECHO_PRODUCT_ID in .env")
        return

    await test_book_formats()
    await test_print_requirements()

    # Order test (alleen in test mode)
    if peecho_service.test_mode:
        print()
        print("=" * 60)
        print("ORDER TEST (Test Omgeving)")
        print("=" * 60)
        print()

        order_id = await test_create_order()

        if order_id:
            await test_order_status(order_id)

            print()
            print("[6] Volgende Stappen")
            print("-" * 40)
            print(f"   1. Order ID: {order_id}")
            print("   2. Om te betalen/produceren, roep aan:")
            print(f"      await peecho_service.confirm_payment('{order_id}')")
            print("   3. Om te annuleren:")
            print(f"      await peecho_service.cancel_order('{order_id}')")
    else:
        print()
        print("WAARSCHUWING: PEECHO_TEST_MODE=false")
        print("Order tests worden overgeslagen om echte kosten te voorkomen.")

    print()
    print("=" * 60)
    print("TEST VOLTOOID")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
