"""
Story Templates - Verhaalstructuren en leeftijdsrichtlijnen voor kinderboeken

Gebaseerd op onderzoek naar kinderboeken voor leeftijden 2-8.
"""

# === LEEFTIJDSRICHTLIJNEN ===
# Bepaalt lengte, complexiteit en stijl per leeftijd

AGE_GUIDELINES = {
    2: {
        "pages": 10,
        "words_per_page": "5-15",
        "total_words": "50-100",
        "sentence_complexity": "Zeer kort. Eén simpele zin per pagina. Gebruik herhaling.",
        "vocabulary": "Alleen bekende woorden: mama, papa, slapen, eten, knuffel, blij, lief",
        "storyline": "Geen echt plot nodig. Focus op herkenbare momenten: opstaan, spelen, slapen.",
        "illustration_style": "Grote, heldere vormen. Weinig details. Felle kleuren."
    },
    3: {
        "pages": 12,
        "words_per_page": "10-20",
        "total_words": "100-200",
        "sentence_complexity": "Korte zinnen. Maximaal 6-8 woorden. Rijm en herhaling werken goed.",
        "vocabulary": "Eenvoudige woorden. Introduceer 2-3 nieuwe woorden in context.",
        "storyline": "Simpele structuur: knuffel doet iets, er gebeurt iets, einde goed.",
        "illustration_style": "Duidelijke illustraties. Herkenbare objecten. Vrolijke kleuren."
    },
    4: {
        "pages": 16,
        "words_per_page": "15-25",
        "total_words": "200-400",
        "sentence_complexity": "Korte zinnen met soms een bijzin. Variatie in zinslengte.",
        "vocabulary": "Alledaagse woorden. Mag wat nieuwe woorden bevatten die uit context te begrijpen zijn.",
        "storyline": "Duidelijk begin-midden-eind. Klein probleem dat opgelost wordt.",
        "illustration_style": "Gedetailleerdere illustraties. Achtergronden met elementen om te ontdekken."
    },
    5: {
        "pages": 20,
        "words_per_page": "20-35",
        "total_words": "400-600",
        "sentence_complexity": "Mix van korte en medium zinnen. Dialoog is welkom.",
        "vocabulary": "Uitgebreider vocabulaire. Emotiewoorden: trots, zenuwachtig, verrast.",
        "storyline": "Verhaal met een les of boodschap. Hoofdpersoon overwint een uitdaging.",
        "illustration_style": "Expressieve illustraties die emoties tonen. Meer sfeer en detail."
    },
    6: {
        "pages": 24,
        "words_per_page": "30-45",
        "total_words": "600-900",
        "sentence_complexity": "Gevarieerde zinnen. Kan bijzinnen en samengestelde zinnen bevatten.",
        "vocabulary": "Rijker vocabulaire. Beschrijvende woorden. Synoniemen gebruiken.",
        "storyline": "Sterker plot met duidelijk conflict en oplossing. Mag meerdere scènes hebben.",
        "illustration_style": "Meer tekstbalans. Illustraties ondersteunen maar domineren niet."
    },
    7: {
        "pages": 28,
        "words_per_page": "40-55",
        "total_words": "900-1200",
        "sentence_complexity": "Complexere zinnen. Dialoog met meerdere sprekers. Beschrijvende passages.",
        "vocabulary": "Uitdagend maar toegankelijk. Nieuwe woorden worden in context uitgelegd.",
        "storyline": "Meerdere verhaallijnen mogelijk. Karakterontwikkeling. Spanning en opluchting.",
        "illustration_style": "Illustraties op strategische momenten. Tekst draagt het verhaal."
    },
    8: {
        "pages": 32,
        "words_per_page": "50-70",
        "total_words": "1200-1800",
        "sentence_complexity": "Volwassen zinsstructuur, aangepast voor kinderen. Literaire technieken.",
        "vocabulary": "Rijk en gevarieerd. Uitdagende woorden met context. Figuurlijk taalgebruik.",
        "storyline": "Complex plot met subplot. Karaktergroei. Thematische diepgang.",
        "illustration_style": "Minder illustraties, meer impact. Sfeerbepalend."
    }
}


# === THEMA TEMPLATES ===
# Verhaalstructuren per thema

STORY_TEMPLATES = {
    "bedtijd": {
        "name": "Bedtijd Avontuur",
        "description": "Een rustig, geruststellend verhaal voor het slapengaan",
        "structure": """
STRUCTUUR:
1. Opening: De knuffel merkt dat het bedtijd wordt
2. Verzet/Avontuur: De knuffel wil nog niet slapen en bedenkt iets
3. Ontdekking: De knuffel ontdekt waarom slapen fijn is (dromen, uitrusten)
4. Afsluiting: De knuffel gaat tevreden slapen, klaar voor morgen

SFEER: Warm, veilig, slaperig. Maan en sterren. Zachte kleuren.
EMOTIE: Geborgenheid, rust, tevredenheid
EINDIGT MET: De knuffel die vredig slaapt of droomt
""",
        "suitable_ages": [2, 3, 4, 5]
    },
    
    "avontuur": {
        "name": "Groot Avontuur",
        "description": "De knuffel beleeft een spannend avontuur",
        "structure": """
STRUCTUUR:
1. Opening: De knuffel in zijn normale omgeving, iets bijzonders gebeurt
2. Roep tot avontuur: De knuffel besluit op pad te gaan
3. Uitdagingen: 2-3 obstakels of ontmoetingen onderweg
4. Climax: De grootste uitdaging wordt overwonnen
5. Terugkeer: De knuffel keert terug, wijzer en blij

SFEER: Spannend maar veilig. Nieuwe plekken ontdekken.
EMOTIE: Nieuwsgierigheid, moed, trots
EINDIGT MET: Thuiskomst en waardering voor thuis
""",
        "suitable_ages": [4, 5, 6, 7, 8]
    },
    
    "vriendschap": {
        "name": "Een Nieuwe Vriend",
        "description": "De knuffel maakt een nieuwe vriend",
        "structure": """
STRUCTUUR:
1. Opening: De knuffel is alleen of verveelt zich
2. Ontmoeting: De knuffel ontmoet iemand anders
3. Uitdaging: Ze moeten samenwerken of een misverstand oplossen
4. Verbinding: Ze ontdekken wat ze gemeen hebben
5. Afsluiting: Ze zijn nu vrienden en doen iets leuks samen

SFEER: Warm, sociaal. Speelse interacties.
EMOTIE: Eenzaamheid → verbinding → vreugde
EINDIGT MET: Samen spelen of een belofte om elkaar weer te zien
""",
        "suitable_ages": [3, 4, 5, 6]
    },
    
    "moed": {
        "name": "Dapper Zijn",
        "description": "De knuffel overwint een angst",
        "structure": """
STRUCTUUR:
1. Opening: De knuffel is ergens bang voor (donker, onweer, nieuwe plek)
2. Confrontatie: De knuffel moet de angst onder ogen zien
3. Hulp: Iemand helpt of de knuffel vindt innerlijke kracht
4. Overwinning: De angst blijkt mee te vallen
5. Trots: De knuffel is trots op zichzelf

SFEER: Eerst spannend, dan geruststellend. Contrast licht/donker.
EMOTIE: Angst → moed → opluchting → trots
EINDIGT MET: De knuffel die niet meer bang is, of weet hoe om te gaan met angst
""",
        "suitable_ages": [4, 5, 6, 7]
    },
    
    "fantasie": {
        "name": "Magische Wereld",
        "description": "De knuffel reist naar een fantasiewereld",
        "structure": """
STRUCTUUR:
1. Opening: De knuffel ontdekt een magische doorgang
2. Nieuwe wereld: Beschrijving van de wonderlijke plek
3. Avontuur: De knuffel ontmoet magische wezens of lost een probleem op
4. Les: De knuffel leert iets belangrijks
5. Terugkeer: Terug naar huis met een herinnering of cadeau

SFEER: Wonderlijk, kleurrijk, magisch. Alles is mogelijk.
EMOTIE: Verwondering, opwinding, voldoening
EINDIGT MET: Terug thuis, met iets speciaals (of de vraag: was het echt?)
""",
        "suitable_ages": [5, 6, 7, 8]
    },
    
    "seizoenen": {
        "name": "Seizoensavontuur",
        "description": "De knuffel beleeft een seizoen (lente, zomer, herfst, winter)",
        "structure": """
STRUCTUUR:
1. Opening: Het seizoen begint, de knuffel merkt de veranderingen
2. Ontdekking: De knuffel verkent wat dit seizoen bijzonder maakt
3. Activiteit: De knuffel doet iets typisch voor het seizoen
4. Hoogtepunt: Een speciaal moment (eerste sneeuw, bloemen plukken, etc.)
5. Afsluiting: Waardering voor het seizoen, vooruitblik naar het volgende

SFEER: Past bij het seizoen. Natuurlijke kleuren en elementen.
EMOTIE: Verwondering over de natuur, vreugde
EINDIGT MET: Tevredenheid en anticipatie
""",
        "suitable_ages": [3, 4, 5, 6]
    },
    
    "verjaardag": {
        "name": "Verjaardagsfeest",
        "description": "De knuffel viert een verjaardag",
        "structure": """
STRUCTUUR:
1. Opening: Het is bijna de verjaardag van [kind] of de knuffel
2. Voorbereiding: De knuffel helpt met voorbereidingen of plant een verrassing
3. Complicatie: Iets gaat bijna mis (taart valt, cadeautje kwijt)
4. Oplossing: Met creativiteit wordt het opgelost
5. Feest: De verjaardag is een succes, iedereen is blij

SFEER: Feestelijk, kleurrijk, vrolijk. Ballonnen en taart.
EMOTIE: Opwinding, spanning, vreugde, liefde
EINDIGT MET: Een wens doen of dankbaarheid uitspreken
""",
        "suitable_ages": [3, 4, 5, 6, 7]
    },
    
    "ziek_zijn": {
        "name": "Beter Worden",
        "description": "De knuffel helpt als iemand ziek is",
        "structure": """
STRUCTUUR:
1. Opening: Iemand (het kind of een vriend) voelt zich niet lekker
2. Zorg: De knuffel wil helpen en bedenkt manieren
3. Troost: De knuffel biedt gezelschap en troost
4. Verbetering: Het begint beter te gaan
5. Herstel: Iedereen is weer blij en gezond

SFEER: Warm, zorgzaam. Binnen, gezellig.
EMOTIE: Bezorgdheid → zorgzaamheid → opluchting
EINDIGT MET: Samen iets leuks doen nu iedereen beter is
""",
        "suitable_ages": [3, 4, 5]
    }
}


# === HELPER FUNCTIES ===

def get_themes_for_age(age: int) -> list[str]:
    """Geef lijst van geschikte thema's voor een leeftijd"""
    suitable_themes = []
    for theme_key, theme_data in STORY_TEMPLATES.items():
        if age in theme_data["suitable_ages"]:
            suitable_themes.append({
                "key": theme_key,
                "name": theme_data["name"],
                "description": theme_data["description"]
            })
    return suitable_themes


def get_template(theme: str) -> dict:
    """Haal template op voor een thema"""
    return STORY_TEMPLATES.get(theme, STORY_TEMPLATES["avontuur"])


def get_guidelines(age: int) -> dict:
    """Haal richtlijnen op voor een leeftijd"""
    # Clamp age tussen 2 en 8
    age = max(2, min(8, age))
    return AGE_GUIDELINES[age]
