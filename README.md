# Knuffelboek - Gepersonaliseerde Kinderboeken App

Een app waarmee ouders een foto van de knuffel van hun kind kunnen maken en een volledig gepersonaliseerd prentenboek kunnen bestellen.

## Live Demo

**Publieke URL (via ngrok):** Start de app en ngrok om een publieke URL te krijgen.

## Features

- 📸 **Knuffelfoto uploaden** - Maak een foto van de knuffel
- 🤖 **AI Knuffelherkenning** - Automatische analyse van de knuffel (type, kleur, kenmerken)
- 📖 **Verhaal generatie** - Gepersonaliseerd verhaal met AI (Google Gemini)
- 🎨 **Illustraties** - AI-gegenereerde illustraties in verschillende stijlen (Google Imagen)
- 📄 **PDF Export** - Download het boek als hoge kwaliteit PDF (300 DPI)
- 🖨️ **Print-on-Demand** - Bestel een fysiek hardcover/softcover boek via Lulu
- 💳 **Stripe Checkout** - Veilig betalen via Stripe
- 👤 **Mijn Boeken** - Bekijk en beheer je gemaakte boeken
- 👨‍💼 **Admin Dashboard** - Beheer gebruikers en bestellingen

## Boek Layout

De nieuwe boek layout (tekst links, illustratie rechts):

```
Pagina-structuur:
1. Voorkaft
2. Binnenkant voorkaft (blank)
3. Boek titelpagina
4. Opdracht (optioneel)
5. Verhaal titelpagina
6-X. Per tekstblok: Tekst (links) + Illustratie (rechts, paginavullend)
X+1. Colofon/Einde
X+2. Binnenkant achterkaft (blank)
X+3. Achterkaft
```

**Pagina berekening per leeftijd:**
| Leeftijd | Layout       | Tekstblokken | Pag/blok | Totaal pagina's |
|----------|--------------|--------------|----------|-----------------|
| 2-3 jaar | toddler      | 9 blokken    | 2        | 26 pagina's     |
| 4 jaar   | preschool    | 17 blokken   | 1        | 24 pagina's     |
| 5 jaar   | preschool    | 18 blokken   | 1        | 26 pagina's     |
| 6 jaar   | early_reader | 19 blokken   | 1        | 26 pagina's     |
| 7 jaar   | early_reader | 20 blokken   | 1        | 28 pagina's     |
| 8 jaar   | early_reader | 21 blokken   | 1        | 28 pagina's     |

*Formule: 7 vaste pagina's + (tekstblokken × pages_per_block)*

**Layout types:**
- **toddler (2-3 jaar)**: 2-page spread - illustratie links, tekst rechts (groot font)
- **preschool (4-5 jaar)**: 1 pagina - illustratie bovenaan, tekst in apart blok eronder
- **early_reader (6-8 jaar)**: 1 pagina - paginavullende illustratie met tekst overlay

## Prijzen (incl. verzending)

| Cover Type | Vanaf prijs |
|------------|-------------|
| Hardcover  | €40,35      |
| Softcover  | €30,85      |

*Prijs varieert op basis van aantal pagina's (leeftijd)*

## Project Structuur

```
knuffelboek/
├── backend/
│   ├── app.py                    # FastAPI applicatie
│   ├── config/
│   │   └── peecho_formats.py     # Pagina berekeningen en formaten
│   ├── services/
│   │   ├── ai_service.py         # Google Vertex AI (Gemini + Imagen)
│   │   ├── book_service.py       # Boek CRUD operaties
│   │   ├── job_queue.py          # Async job queue voor generatie
│   │   ├── pdf_service.py        # PDF generatie met WeasyPrint (300 DPI)
│   │   ├── lulu_service.py       # Lulu print-on-demand integratie
│   │   └── story_service.py      # Verhaal generatie
│   ├── models/
│   │   └── database.py           # SQLAlchemy models (SQLite)
│   └── requirements.txt
├── frontend/
│   └── index.html                # Single-page app (HTML/CSS/JS)
├── logo.png                      # Knuffelboek logo
├── .env                          # Environment variables
└── README.md
```

## Snelstart

### 1. Vereisten

- Python 3.11+
- Google Cloud account met Vertex AI enabled
- Lulu account (voor print-on-demand)
- Stripe account (voor betalingen)
- ngrok (voor publieke URL tijdens development)

### 2. Installatie

```bash
cd knuffelboek
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
```

### 3. Environment Variables

Maak een `.env` bestand in de root:

```bash
# Google Cloud
GOOGLE_CLOUD_PROJECT=jouw-project-id

# Lulu Print-on-Demand
LULU_API_KEY=<api key uit Lulu dashboard>
LULU_API_SECRET=<secret key>
LULU_SANDBOX=true  # false voor productie

# Stripe Betalingen
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optioneel: Remove.bg voor achtergrond verwijdering
REMOVEBG_API_KEY=<api key>
```

### 4. Google Cloud Setup

```bash
gcloud auth application-default login
gcloud services enable aiplatform.googleapis.com
```

### 5. Server starten

```bash
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000
```

De app draait nu op `http://localhost:8000`

### 6. Publieke URL (voor Lulu/Stripe webhooks)

```bash
ngrok http 8000
```

## API Endpoints

### Boek Generatie
| Endpoint | Methode | Beschrijving |
|----------|---------|--------------|
| `/health` | GET | Health check |
| `/analyze-toy` | POST | Analyseer knuffelfoto |
| `/create-book` | POST | Start boek generatie (async) |
| `/api/books/{id}` | GET | Boek details ophalen |
| `/api/books/{id}/pdf` | GET | Download preview PDF |
| `/api/stories-required/{age}` | GET | Bereken tekstblokken/pagina's voor leeftijd |

### PDF Generatie
| Endpoint | Methode | Beschrijving |
|----------|---------|--------------|
| `/api/books/{id}/pdf` | GET | Download preview PDF (300 DPI) |
| `/api/books/{id}/lulu-interior.pdf` | GET | Lulu interior PDF |
| `/api/books/{id}/lulu-cover.pdf` | GET | Lulu cover PDF |
| `/api/books/{id}/lulu-pdfs` | GET | Beide Lulu PDFs |

### Betalingen (Stripe)
| Endpoint | Methode | Beschrijving |
|----------|---------|--------------|
| `/api/books/{id}/stripe-checkout` | POST | Start Stripe checkout sessie |
| `/api/stripe/webhook` | POST | Stripe webhook handler |

### Print-on-Demand (Lulu)
| Endpoint | Methode | Beschrijving |
|----------|---------|--------------|
| `/api/books/{id}/lulu-order` | POST | Maak Lulu order aan |

### Gebruikers & Admin
| Endpoint | Methode | Beschrijving |
|----------|---------|--------------|
| `/api/users/{email}/books` | GET | Alle boeken van gebruiker |
| `/api/admin/stats` | GET | Admin statistieken |
| `/api/admin/users` | GET | Alle gebruikers (admin) |
| `/api/admin/orders` | GET | Alle orders (admin) |

## Technische Details

### PDF Generatie
- **WeasyPrint** voor HTML naar PDF conversie
- **300 DPI** resolutie voor print kwaliteit
- **Lulu formaat**: 8.5x8.5 inch (215.9mm vierkant)
- **Bleed**: 3.2mm aan alle zijden
- **Minimum pagina's**: 24 (Lulu hardcover vereiste)

### AI Services
- **Google Gemini**: Knuffel analyse en verhaal generatie
- **Google Imagen**: Illustratie generatie
- **Illustratie stijlen**: Aquarel, Cartoon, Potlood, Digitaal, Collage

### Database
- **SQLite** met SQLAlchemy ORM
- **Models**: Book, Illustration, User (email-based)

## Ontwikkel Roadmap

### Fase 1: Proof of Concept ✅
- [x] Project structuur
- [x] Knuffelfoto analyse via Gemini
- [x] Verhaal generatie met AI
- [x] Illustratie generatie via Imagen

### Fase 2: Backend API ✅
- [x] Alle endpoints gebouwd
- [x] SQLite database met SQLAlchemy
- [x] Async job queue voor generatie
- [x] PDF generatie met WeasyPrint (300 DPI)
- [x] Error handling en logging

### Fase 3: Frontend ✅
- [x] Single-page app (HTML/CSS/JS)
- [x] Camera/upload functionaliteit
- [x] Boek preview met bladerfunctie
- [x] Visuele stijl selectie
- [x] "Mijn Boeken" pagina
- [x] Admin Dashboard

### Fase 4: Integraties ✅
- [x] Lulu Print API integratie
- [x] Stripe betalingen
- [x] Eigen checkout flow
- [x] User accounts (email-based)
- [x] Dynamische prijsberekening

### Fase 5: Verbeteringen 🔄
- [x] Nieuwe boek layout (tekst links, illustratie rechts)
- [x] Hoge kwaliteit PDF (300 DPI)
- [x] Dynamische "vanaf" prijzen
- [ ] Order tracking emails
- [ ] Meerdere talen ondersteuning

## Lulu Integratie

### Boek Specificaties
- **Formaat**: 8.5" x 8.5" (Square)
- **Cover**: Hardcover of Softcover
- **Papier**: Premium
- **Afwerking**: Glans
- **Minimum pagina's**: 24

### API Flow
1. Gebruiker klikt "Bestellen als boek"
2. Stripe checkout sessie wordt aangemaakt
3. Na succesvolle betaling:
   - Interior PDF wordt gegenereerd
   - Cover PDF wordt gegenereerd
   - Lulu order wordt aangemaakt
4. Lulu print en verzend het boek

## Testen

```bash
# Test de health check
curl http://localhost:8000/health

# Test knuffelanalyse
curl -X POST "http://localhost:8000/analyze-toy" \
  -F "file=@test_knuffel.jpg"

# Test pagina berekening
curl "http://localhost:8000/api/stories-required/4?cover_type=hardcover"

# Test admin stats (met admin email)
curl "http://localhost:8000/api/admin/stats"
```

## Licentie

Privé project - Alle rechten voorbehouden
