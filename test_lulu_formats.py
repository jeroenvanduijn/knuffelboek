#!/usr/bin/env python3
"""
Test script om alle PDF formaat combinaties te valideren bij Lulu.

Test alle 4 combinaties:
1. Square (21x21cm) + Hardcover
2. Square (21x21cm) + Softcover
3. A4 Landscape + Hardcover
4. A4 Landscape + Softcover
"""
import os
import sys
import asyncio
import requests
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
load_dotenv()

from backend.services.lulu_service import lulu_service
from backend.services.pdf_service import PDFService

# Test configurations
TEST_FORMATS = [
    {"format": "square", "cover_type": "hardcover", "name": "Square 21x21cm Hardcover"},
    {"format": "square", "cover_type": "softcover", "name": "Square 21x21cm Softcover"},
    {"format": "a4_landscape", "cover_type": "hardcover", "name": "A4 Landscape Hardcover"},
    {"format": "a4_landscape", "cover_type": "softcover", "name": "A4 Landscape Softcover"},
]

# Minimal test pages (20 story pages + 4 for title/dedication/etc = 24 total)
TEST_PAGES = [
    {"text": f"Dit is testpagina {i+1}. Het verhaal gaat verder met een mooie illustratie.", "illustration_base64": None}
    for i in range(20)
]
TEST_TITLE = "Het Grote Test Avontuur"

def get_lulu_token():
    """Get Lulu API access token"""
    response = requests.post(
        lulu_service.auth_url,
        data={
            "grant_type": "client_credentials"
        },
        auth=(lulu_service.api_key, lulu_service.api_secret)
    )
    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        print(f"❌ Failed to get Lulu token: {response.status_code}")
        print(response.text)
        return None

def validate_pdf_with_lulu(pdf_bytes: bytes, token: str, pdf_type: str, sku: str) -> dict:
    """
    Upload and validate a PDF with Lulu's normalization API.

    Returns validation result with any errors/warnings.
    """
    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Step 1: Create a file upload
    files = {
        "file": (f"test_{pdf_type}.pdf", pdf_bytes, "application/pdf")
    }

    # Upload to Lulu's file endpoint
    upload_url = f"{lulu_service.base_url}/files/"
    response = requests.post(upload_url, headers=headers, files=files)

    if response.status_code not in [200, 201]:
        return {
            "success": False,
            "error": f"Upload failed: {response.status_code}",
            "details": response.text
        }

    file_data = response.json()
    file_id = file_data.get("id")

    # Step 2: Request normalization/validation
    normalize_url = f"{lulu_service.base_url}/files/{file_id}/normalize/"

    # Specify the pod_package_id and file type for validation
    normalize_data = {
        "pod_package_id": sku,
        "file_type": pdf_type.upper()  # "COVER" or "INTERIOR"
    }

    response = requests.post(normalize_url, headers=headers, json=normalize_data)

    if response.status_code not in [200, 201, 202]:
        return {
            "success": False,
            "error": f"Normalization request failed: {response.status_code}",
            "details": response.text
        }

    normalize_result = response.json()

    return {
        "success": True,
        "file_id": file_id,
        "normalize_result": normalize_result,
        "warnings": normalize_result.get("warnings", []),
        "errors": normalize_result.get("errors", [])
    }

def get_ngrok_url():
    """Get the current ngrok public URL"""
    try:
        response = requests.get("http://localhost:4040/api/tunnels")
        if response.status_code == 200:
            tunnels = response.json().get("tunnels", [])
            if tunnels:
                return tunnels[0].get("public_url")
    except:
        pass
    return None

def check_print_job_cost(token: str, sku: str, interior_url: str, cover_url: str, page_count: int = 24) -> dict:
    """
    Calculate print cost to validate PDFs with Lulu API.
    Uses source_url like the actual order flow.
    """
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Use print-job-cost-calculations with source URLs
    calc_url = f"{lulu_service.base_url}/print-job-cost-calculations/"
    calc_data = {
        "line_items": [{
            "pod_package_id": sku,
            "page_count": page_count,
            "quantity": 1,
            "interior": {"source_url": interior_url},
            "cover": {"source_url": cover_url}
        }],
        "shipping_address": {
            "name": "Test User",
            "street1": "Teststraat 1",
            "city": "Amsterdam",
            "country_code": "NL",
            "postcode": "1234AB",
            "phone_number": "0612345678"
        },
        "shipping_level": "MAIL"
    }

    print(f"      Interior URL: {interior_url}")
    print(f"      Cover URL: {cover_url}")
    print(f"      Requesting cost calculation...")

    response = requests.post(calc_url, headers=headers, json=calc_data)
    print(f"      Cost calc status: {response.status_code}")

    try:
        response_data = response.json()
    except:
        response_data = response.text

    if response.status_code != 200:
        print(f"      Response: {response_data}")

    return {
        "success": response.status_code in [200, 201],
        "status_code": response.status_code,
        "response": response_data
    }

async def run_tests():
    print("=" * 60)
    print("LULU PDF FORMAT VALIDATION TEST")
    print("=" * 60)
    print()

    # Check ngrok is running
    ngrok_url = get_ngrok_url()
    if not ngrok_url:
        print("❌ ngrok is niet actief!")
        print("   Start ngrok met: ngrok http 8000")
        return 1
    print(f"🌐 ngrok URL: {ngrok_url}")
    print()

    # Check Lulu configuration
    if not lulu_service.is_configured:
        print("❌ Lulu API is niet geconfigureerd!")
        print("   Zorg dat LULU_API_KEY en LULU_API_SECRET zijn ingesteld.")
        return 1

    print(f"🔧 Lulu mode: {'SANDBOX' if lulu_service.test_mode else 'PRODUCTION'}")
    print(f"🔧 API URL: {lulu_service.base_url}")
    print()

    # Get token
    print("🔑 Getting Lulu API token...")
    token = get_lulu_token()
    if not token:
        return 1
    print("✅ Token obtained")
    print()

    # Use a known completed book ID from the database
    # (We query the DB directly since there's no public /api/books endpoint)
    book_id = "318422ff-ac63-42e5-831c-71f20b6cce34"  # Zoe's book
    print(f"📚 Using test book: {book_id}")

    # Verify the book exists via API
    try:
        response = requests.get(
            f"{ngrok_url}/api/books/{book_id}",
            headers={"ngrok-skip-browser-warning": "true"}
        )
        if response.status_code != 200:
            print(f"❌ Could not fetch book: {response.status_code}")
            return 1
        book_data = response.json()
        print(f"✅ Found book: {book_data.get('story_title', 'Unknown')}")
    except Exception as e:
        print(f"❌ Error finding book: {e}")
        return 1
    print()

    # Get page count from book
    try:
        story_response = requests.get(
            f"{ngrok_url}/api/books/{book_id}/story",
            headers={"ngrok-skip-browser-warning": "true"}
        )
        if story_response.status_code == 200:
            story = story_response.json()
            page_count = len(story.get("pages", [])) + 4  # +4 for title, dedication, etc.
            page_count = max(24, page_count)  # Minimum 24 pages
        else:
            page_count = 24
    except:
        page_count = 24
    print(f"📄 Page count: {page_count}")
    print()

    results = []

    for config in TEST_FORMATS:
        format_type = config["format"]
        cover_type = config["cover_type"]
        name = config["name"]

        print("-" * 60)
        print(f"📖 Testing: {name}")
        print("-" * 60)

        # Get SKU
        sku = lulu_service.get_sku_for_format(format_type, cover_type)
        print(f"   SKU: {sku}")

        # Build PDF URLs using ngrok
        interior_url = f"{ngrok_url}/api/books/{book_id}/lulu-interior.pdf?format={format_type}"
        cover_url = f"{ngrok_url}/api/books/{book_id}/lulu-cover.pdf?cover_type={cover_type}&format={format_type}"

        # Validate with Lulu cost calculation (validates without ordering)
        print("   🔍 Validating with Lulu API...")
        try:
            validation = check_print_job_cost(token, sku, interior_url, cover_url, page_count)

            if validation["success"]:
                print(f"   ✅ PASSED - Lulu accepts this format!")
                cost_info = validation.get("response", {})
                if isinstance(cost_info, dict):
                    total = cost_info.get("total_cost_incl_tax")
                    currency = cost_info.get("currency", "EUR")
                    if total:
                        print(f"   💰 Estimated cost: {currency} {total}")
                results.append({"name": name, "success": True, "sku": sku, "cost": total})
            else:
                print(f"   ❌ FAILED - Lulu rejected this format")
                print(f"   Status: {validation.get('status_code')}")
                error_detail = validation.get("response", "Unknown error")
                results.append({
                    "name": name,
                    "success": False,
                    "sku": sku,
                    "error": str(error_detail)[:500]
                })
        except Exception as e:
            print(f"   ❌ Validation error: {e}")
            import traceback
            traceback.print_exc()
            results.append({"name": name, "success": False, "error": str(e)})

        print()

    # Summary
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)

    passed = sum(1 for r in results if r.get("success"))
    failed = len(results) - passed

    for r in results:
        status = "✅" if r.get("success") else "❌"
        print(f"{status} {r['name']}")
        if not r.get("success") and r.get("error"):
            error_str = str(r['error'])
            print(f"   Error: {error_str[:200]}...")

    print()
    print(f"Results: {passed} passed, {failed} failed out of {len(TEST_FORMATS)} formats")

    return 0 if failed == 0 else 1

def main():
    return asyncio.run(run_tests())

if __name__ == "__main__":
    sys.exit(main())
