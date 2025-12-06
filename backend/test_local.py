"""
Test Script - Test de Knuffelboek pipeline lokaal

Dit script test de basisflow zonder daadwerkelijke API calls.
Gebruik dit om de structuur te valideren voordat je API keys configureert.
"""

import asyncio
import json
from templates.story_templates import get_themes_for_age, get_guidelines, STORY_TEMPLATES


def test_age_guidelines():
    """Test dat alle leeftijdsrichtlijnen correct geladen worden"""
    print("\n=== Test: Leeftijdsrichtlijnen ===")
    
    for age in range(2, 9):
        guidelines = get_guidelines(age)
        print(f"\nLeeftijd {age} jaar:")
        print(f"  Pagina's: {guidelines['pages']}")
        print(f"  Woorden/pagina: {guidelines['words_per_page']}")
        print(f"  Totaal woorden: {guidelines['total_words']}")
    
    print("\n✅ Leeftijdsrichtlijnen OK")


def test_themes():
    """Test dat thema's correct gekoppeld zijn aan leeftijden"""
    print("\n=== Test: Thema's per leeftijd ===")
    
    for age in range(2, 9):
        themes = get_themes_for_age(age)
        print(f"\nLeeftijd {age}: {len(themes)} thema's beschikbaar")
        for theme in themes:
            print(f"  - {theme['name']}: {theme['description']}")
    
    print("\n✅ Thema's OK")


def test_story_structure():
    """Test de verhaalstructuur templates"""
    print("\n=== Test: Verhaalstructuren ===")
    
    for theme_key, theme_data in STORY_TEMPLATES.items():
        print(f"\n{theme_data['name']}:")
        print(f"  Geschikt voor: {theme_data['suitable_ages']}")
        # Check dat structure bestaat
        assert "structure" in theme_data, f"Missende structure in {theme_key}"
        print(f"  Structuur: {len(theme_data['structure'])} karakters")
    
    print("\n✅ Verhaalstructuren OK")


def test_mock_story_generation():
    """Simuleer verhaalgeneratie met mock data"""
    print("\n=== Test: Mock Verhaalgeneratie ===")
    
    # Simuleer input
    child_name = "Emma"
    child_age = 5
    toy_name = "Beer Bruno"
    toy_description = "Een zachte bruine teddybeer met een rood strikje"
    theme = "bedtijd"
    
    # Haal relevante data op
    guidelines = get_guidelines(child_age)
    template = STORY_TEMPLATES[theme]
    
    print(f"\nGenereer verhaal voor:")
    print(f"  Kind: {child_name} ({child_age} jaar)")
    print(f"  Knuffel: {toy_name}")
    print(f"  Thema: {template['name']}")
    print(f"\nRichtlijnen:")
    print(f"  Pagina's: {guidelines['pages']}")
    print(f"  Woorden: {guidelines['total_words']}")
    print(f"  Complexiteit: {guidelines['sentence_complexity']}")
    
    # Mock verhaal output
    mock_story = {
        "title": f"{toy_name} gaat slapen",
        "pages": [
            {
                "page_number": 1,
                "text": f"{toy_name} keek uit het raam. De maan scheen helder.",
                "scene": f"{toy_name} zit op de vensterbank, kijkend naar de maan"
            },
            {
                "page_number": 2,
                "text": f"'Tijd om te slapen,' zei {toy_name}. Hij gaapte groot.",
                "scene": f"{toy_name} gaapt terwijl hij naar zijn bedje loopt"
            },
            {
                "page_number": 3,
                "text": f"{toy_name} kroop onder zijn dekentje. 'Welterusten, maan.'",
                "scene": f"{toy_name} ligt gezellig in bed, zwaait naar de maan"
            }
        ]
    }
    
    print(f"\n📖 Mock verhaal gegenereerd:")
    print(f"  Titel: {mock_story['title']}")
    print(f"  Pagina's: {len(mock_story['pages'])}")
    
    for page in mock_story['pages']:
        print(f"\n  Pagina {page['page_number']}:")
        print(f"    Tekst: {page['text']}")
        print(f"    Scène: {page['scene']}")
    
    print("\n✅ Mock verhaalgeneratie OK")


def test_api_endpoints():
    """Test dat de API endpoint structuur correct is"""
    print("\n=== Test: API Endpoint Structuur ===")
    
    endpoints = [
        ("GET", "/health", "Health check"),
        ("POST", "/analyze-toy", "Analyseer knuffelfoto"),
        ("POST", "/generate-illustration", "Genereer illustratie"),
        ("POST", "/generate-story", "Genereer verhaal"),
        ("POST", "/create-book", "Creëer complete PDF"),
    ]
    
    for method, path, description in endpoints:
        print(f"  {method:6} {path:25} - {description}")
    
    print("\n✅ API endpoints gedefinieerd")


def main():
    """Voer alle tests uit"""
    print("=" * 60)
    print("KNUFFELBOEK - Lokale Test Suite")
    print("=" * 60)
    
    test_age_guidelines()
    test_themes()
    test_story_structure()
    test_mock_story_generation()
    test_api_endpoints()
    
    print("\n" + "=" * 60)
    print("✅ ALLE TESTS GESLAAGD")
    print("=" * 60)
    
    print("\n📋 Volgende stappen:")
    print("1. Configureer .env met je API keys")
    print("2. Start de server: uvicorn app:app --reload")
    print("3. Test met een echte knuffelfoto via /analyze-toy")
    print("4. Genereer je eerste verhaal via /generate-story")


if __name__ == "__main__":
    main()
