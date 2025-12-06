import Link from 'next/link';
import Image from 'next/image';
import { Button, SectionTitle, SheepMascot } from '@/components';
import { WEBAPP_URL } from '@/components/Header';

// Image base URL
const IMAGE_BASE = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures';

// Hero Section
function HeroSection() {
  return (
    <section className="relative bg-wolwit py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-block bg-pastelblauw/30 text-nachtblauw px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              Van knuffel naar echt kinderboek
            </span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-nachtblauw leading-tight mb-6">
              Van knuffel naar <span className="text-abrikoos">écht kinderboek</span>
            </h1>
            <p className="text-lg lg:text-xl text-nachtblauw/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Upload een foto van de lievelingsknuffel en wij maken automatisch een uniek verhaal met prachtige illustraties. Bestel als gedrukt boek of download de PDF.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={WEBAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Start met jouw knuffel
              </a>
              <Button href="/hoe-het-werkt" variant="outline" size="lg">
                Zo werkt het
              </Button>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-nachtblauw/60">
              <span className="flex items-center gap-2">
                <span className="text-saliegroen">✓</span>
                Geen kindergezichten opgeslagen
              </span>
              <span className="flex items-center gap-2">
                <span className="text-saliegroen">✓</span>
                100% privacy-vriendelijk
              </span>
            </div>
          </div>
          <div className="relative">
            {/* Hero afbeelding */}
            <div className="aspect-square max-w-lg mx-auto rounded-3xl shadow-xl overflow-hidden">
              <Image
                src={`${IMAGE_BASE}/hero-background-82.jpg`}
                alt="Knuffelboek voorbeeld"
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-pastelblauw/40 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-saliegroen/40 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section - technisch proces
function AIFeaturesSection() {
  const features = [
    {
      image: `${IMAGE_BASE}/hero-background-83.jpg`,
      title: 'Knuffelfoto uploaden',
      description: 'Maak een foto met je smartphone. De achtergrond wordt automatisch verwijderd.',
      tech: 'Achtergrond-verwijdering',
    },
    {
      image: `${IMAGE_BASE}/hero-background-84.jpg`,
      title: 'Slimme knuffelanalyse',
      description: 'Onze slimme technologie herkent het type knuffel, de kleuren en de kleine details automatisch.',
      tech: 'Slimme beeldherkenning',
    },
    {
      image: `${IMAGE_BASE}/hero-background-85.jpg`,
      title: 'Verhaal genereren',
      description: 'Op basis van leeftijd en thema maken wij een uniek, kindvriendelijk verhaal.',
      tech: 'Verhalen op maat',
    },
    {
      image: `${IMAGE_BASE}/hero-background-86.jpg`,
      title: 'Illustraties maken',
      description: 'Prachtige illustraties worden gegenereerd met jouw knuffel in de hoofdrol.',
      tech: 'Illustraties met jouw knuffel in de hoofdrol',
    },
    {
      image: `${IMAGE_BASE}/hero-background-87.jpg`,
      title: 'PDF downloaden',
      description: 'Bekijk direct de preview en download je boek als PDF.',
      tech: 'Direct beschikbaar',
    },
    {
      image: `${IMAGE_BASE}/hero-background-88.jpg`,
      title: 'Bestellen als echt boek',
      description: 'Bestel het als gedrukt boek en ontvang het thuis binnen 5-7 werkdagen.',
      tech: 'Print-on-demand',
    },
  ];

  return (
    <section className="section bg-gradient-to-b from-wolwit to-zand/30">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionTitle subtitle="Van foto tot boek – volledig automatisch">
          Hoe de magie werkt
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-wolwit rounded-2xl overflow-hidden border border-nachtblauw/5 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 w-8 h-8 bg-abrikoos text-nachtblauw rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  {index + 1}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-nachtblauw mb-2">{feature.title}</h3>
                <p className="text-nachtblauw/70 text-sm mb-3">{feature.description}</p>
                <span className="inline-block bg-pastelblauw/20 text-nachtblauw/60 px-2 py-0.5 rounded text-xs">
                  {feature.tech}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button href="/hoe-het-werkt" variant="outline">
            Meer over het proces
          </Button>
        </div>
      </div>
    </section>
  );
}

// Simple How it Works Section
function HowItWorksSection() {
  const steps = [
    {
      image: `${IMAGE_BASE}/hero-background-89.jpg`,
      title: 'Knuffel fotograferen',
      description: 'Maak een foto van de lievelingsknuffel van je kind met je telefoon.',
    },
    {
      image: `${IMAGE_BASE}/hero-background-90.jpg`,
      title: 'Wij maken het boek',
      description: 'Wij maken automatisch een uniek verhaal en prachtige illustraties.',
    },
    {
      image: `${IMAGE_BASE}/hero-background-91.jpg`,
      title: 'Boek bezorgd',
      description: 'Binnen 5-7 dagen ligt het gedrukte boek op de deurmat.',
    },
  ];

  return (
    <section className="section bg-zand">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionTitle subtitle="In drie simpele stappen naar een uniek kinderboek">
          Zo makkelijk is het
        </SectionTitle>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg relative">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-8 h-8 mx-auto mb-4 bg-abrikoos text-nachtblauw rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-nachtblauw mb-3">{step.title}</h3>
              <p className="text-nachtblauw/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Mijn Boeken Teaser Section
function MijnBoekenSection() {
  return (
    <section className="section bg-wolwit">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-pastelblauw/20 to-saliegroen/20 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block bg-wolwit px-3 py-1 rounded-full text-sm font-medium text-nachtblauw mb-4">
                  Nieuw
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-nachtblauw mb-4">
                  Mijn Boeken – al je creaties op één plek
                </h2>
                <p className="text-nachtblauw/70 mb-6">
                  Maak een account aan en vind al je gemaakte boeken terug in &quot;Mijn Boeken&quot;.
                  Download PDF&apos;s, bekijk de status van je bestellingen, of bestel extra exemplaren.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-nachtblauw/70">
                    <span className="text-saliegroen">✓</span>
                    Al je boeken bewaard in de cloud
                  </li>
                  <li className="flex items-center gap-2 text-nachtblauw/70">
                    <span className="text-saliegroen">✓</span>
                    Download PDF&apos;s wanneer je wilt
                  </li>
                  <li className="flex items-center gap-2 text-nachtblauw/70">
                    <span className="text-saliegroen">✓</span>
                    Volg je bestellingen realtime
                  </li>
                </ul>
                <a
                  href={WEBAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Maak je eerste boek
                </a>
              </div>
              <div className="relative">
                <div className="bg-wolwit rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-nachtblauw">Mijn Boeken</h3>
                    <span className="text-xs bg-pastelblauw/30 px-2 py-1 rounded-full text-nachtblauw/70">3 boeken</span>
                  </div>
                  <div className="space-y-3">
                    {['Emma en Beer', 'Tim zijn Avontuur', 'Sophie Droomt'].map((title, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-zand/50 rounded-lg">
                        <div className="w-10 h-12 bg-abrikoos/30 rounded flex items-center justify-center text-lg">📖</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-nachtblauw">{title}</p>
                          <p className="text-xs text-nachtblauw/50">{i === 0 ? 'Klaar' : i === 1 ? 'Verzonden' : 'In productie'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Example Books Section
function ExampleBooksSection() {
  const examples = [
    { name: 'Lotte', title: 'Lotte en de Dappere Draakbeer', age: '5 jaar', theme: 'Dapper zijn', color: 'bg-abrikoos/30' },
    { name: 'Tim', title: 'Tim en het Slaapavontuur', age: '3 jaar', theme: 'Bedtijd', color: 'bg-pastelblauw/30' },
    { name: 'Emma', title: "Emma's Verjaardagsfeest", age: '4 jaar', theme: 'Verjaardag', color: 'bg-saliegroen/30' },
    { name: 'Lucas', title: 'Lucas en de Vriendschap', age: '6 jaar', theme: 'Vriendschap', color: 'bg-zand' },
  ];

  return (
    <section className="section bg-zand">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionTitle subtitle="Bekijk wat andere ouders hebben gemaakt">
          Voorbeeldboeken
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {examples.map((book, index) => (
            <div key={index} className="card group cursor-pointer">
              <div className={`aspect-[3/4] ${book.color} rounded-lg mb-4 flex items-center justify-center`}>
                <div className="text-center p-4">
                  <span className="text-5xl block mb-2">📖</span>
                  <p className="text-sm font-medium text-nachtblauw">{book.title}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-nachtblauw">{book.name}, {book.age}</p>
                <p className="text-sm text-nachtblauw/70">Thema: {book.theme}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button href="/voorbeelden">
            Bekijk meer voorbeelden
          </Button>
        </div>
      </div>
    </section>
  );
}

// Themes Section
function ThemesSection() {
  const themes = [
    { name: 'Bedtijd Avontuur', ages: '2-5 jaar', image: `${IMAGE_BASE}/hero-background-92.jpg` },
    { name: 'Dapper Zijn', ages: '3-6 jaar', image: `${IMAGE_BASE}/hero-background-97.jpg` },
    { name: 'Verjaardag', ages: '2-8 jaar', image: `${IMAGE_BASE}/hero-background-93.jpg` },
    { name: 'Vriendschap', ages: '4-7 jaar', image: `${IMAGE_BASE}/hero-background-94.jpg` },
    { name: 'Natuur Ontdekken', ages: '3-6 jaar', image: `${IMAGE_BASE}/hero-background-95.jpg` },
    { name: 'Fantasie Wereld', ages: '5-8 jaar', image: `${IMAGE_BASE}/hero-background-96.jpg` },
  ];

  return (
    <section className="section bg-wolwit">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionTitle subtitle="Kies het perfecte avontuur voor jouw kind">
          Thema&apos;s &amp; leeftijden
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <Link
              key={index}
              href={`/themas#${theme.name.toLowerCase().replace(/\s/g, '-')}`}
              className="group rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 border border-nachtblauw/5"
            >
              <div className="aspect-[16/10] relative">
                <Image
                  src={theme.image}
                  alt={theme.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nachtblauw/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-wolwit">
                  <h3 className="font-bold text-lg">{theme.name}</h3>
                  <span className="text-sm text-wolwit/80">{theme.ages}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button href="/themas" variant="outline">
            Alle thema&apos;s bekijken
          </Button>
        </div>
      </div>
    </section>
  );
}

// USPs Section
function USPsSection() {
  const usps = [
    {
      icon: '✨',
      title: 'Uniek voor jouw kind',
      description: 'Verhaal en illustraties worden speciaal voor jouw kind gemaakt.',
    },
    {
      icon: '👶',
      title: 'Leeftijd op maat',
      description: 'Verhaallengte en taalgebruik aangepast aan de leeftijd.',
    },
    {
      icon: '📚',
      title: 'Premium kwaliteit',
      description: 'Gedrukt op stevig papier met levendige kleuren.',
    },
    {
      icon: '🔒',
      title: 'Privacyvriendelijk',
      description: 'Geen kindergezichten – alleen knuffels worden geanalyseerd.',
    },
  ];

  return (
    <section className="section bg-zand">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionTitle subtitle="Dit maakt Knuffelboek zo bijzonder">
          Waarom ouders Knuffelboek kiezen
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {usps.map((usp, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-wolwit rounded-2xl shadow-sm flex items-center justify-center">
                <span className="text-3xl">{usp.icon}</span>
              </div>
              <h3 className="font-bold text-nachtblauw mb-2">{usp.title}</h3>
              <p className="text-sm text-nachtblauw/70">{usp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Reviews Section
function ReviewsSection() {
  const reviews = [
    {
      quote: "Mijn dochter wilde het boek elke avond voorlezen. Ze vindt het geweldig dat haar knuffelbeer nu beroemd is!",
      author: 'Marieke, moeder van Sophie (4)',
      stars: 5,
    },
    {
      quote: "Super makkelijk te maken en de kwaliteit van het boek is echt top. Een perfect cadeau!",
      author: 'Peter, vader van Luuk (3)',
      stars: 5,
    },
    {
      quote: "Het verhaal paste precies bij de leeftijd van mijn zoon. Hij was zo trots op 'zijn' boek.",
      author: 'Linda, moeder van Max (5)',
      stars: 5,
    },
  ];

  return (
    <section className="section bg-wolwit">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionTitle subtitle="Lees wat andere ouders zeggen">
          Blije kinderen, blije ouders
        </SectionTitle>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-zand rounded-2xl p-6 shadow-sm">
              <div className="flex mb-4">
                {[...Array(review.stars)].map((_, i) => (
                  <span key={i} className="text-abrikoos text-xl">★</span>
                ))}
              </div>
              <p className="text-nachtblauw/70 mb-4 italic">&quot;{review.quote}&quot;</p>
              <p className="text-sm font-semibold text-nachtblauw">{review.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  return (
    <section className="section bg-zand">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTitle subtitle="Transparante prijzen, geen verrassingen">
            Simpele prijzen
          </SectionTitle>
          <div className="bg-wolwit rounded-3xl shadow-lg p-8 lg:p-12">
            <div className="mb-8">
              <span className="text-5xl lg:text-6xl font-bold text-abrikoos">€29,95</span>
              <p className="text-nachtblauw/70 mt-2">Inclusief verzending binnen Nederland & België</p>
            </div>
            <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-saliegroen text-xl">✓</span>
                <span className="text-nachtblauw">Gepersonaliseerd softcover boek</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-saliegroen text-xl">✓</span>
                <span className="text-nachtblauw">16-24 pagina&apos;s met unieke illustraties</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-saliegroen text-xl">✓</span>
                <span className="text-nachtblauw">Verhaal gegenereerd op maat van jouw kind</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-saliegroen text-xl">✓</span>
                <span className="text-nachtblauw">PDF download inbegrepen</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-saliegroen text-xl">✓</span>
                <span className="text-nachtblauw">Bezorging binnen 5-7 werkdagen</span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={WEBAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Maak je boek
              </a>
              <Link href="/prijzen" className="text-abrikoos hover:underline font-medium">
                Bekijk alle opties →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-nachtblauw text-wolwit">
      <div className="container mx-auto px-4 lg:px-6 text-center">
        <SheepMascot variant="happy" size="lg" className="mx-auto mb-6" />
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Klaar om een magisch moment te creëren?
        </h2>
        <p className="text-xl text-wolwit/80 mb-8 max-w-2xl mx-auto">
          Van de lievelingsknuffel van je kind, naar een echt verhaaltje voor het slapengaan – in een paar minuten geregeld.
        </p>
        <a
          href={WEBAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-abrikoos text-nachtblauw font-semibold px-8 py-4 rounded-xl hover:bg-abrikoos-dark transition-colors"
        >
          Start met jouw knuffel
        </a>
      </div>
    </section>
  );
}

// Main Home Page
export default function Home() {
  return (
    <>
      <HeroSection />
      <AIFeaturesSection />
      <HowItWorksSection />
      <MijnBoekenSection />
      <ExampleBooksSection />
      <ThemesSection />
      <USPsSection />
      <ReviewsSection />
      <PricingSection />
      <CTASection />
    </>
  );
}
