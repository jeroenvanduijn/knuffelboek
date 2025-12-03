import Link from 'next/link';
import { Button, SectionTitle, SheepMascot } from '@/components';

// Hero Section
function HeroSection() {
  return (
    <section className="relative bg-wolwit py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-nachtblauw leading-tight mb-6">
              Maak een <span className="text-abrikoos">echt boek</span> met de knuffel van je kind in de hoofdrol
            </h1>
            <p className="text-lg lg:text-xl text-nachtblauw/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Upload een foto, kies een avontuur, en wij drukken een persoonlijk kinderboek dat thuis wordt bezorgd.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button href="/maak-je-boek" size="lg">
                Start met jouw knuffel
              </Button>
              <Button href="/hoe-het-werkt" variant="outline" size="lg">
                Zo werkt het
              </Button>
            </div>
          </div>
          <div className="relative">
            {/* Schaapje met boek */}
            <div className="aspect-square max-w-lg mx-auto bg-zand rounded-3xl shadow-xl p-8 flex items-center justify-center">
              <div className="text-center">
                <SheepMascot variant="book" size="xl" className="mx-auto mb-4" />
                <p className="text-nachtblauw/60 text-sm">Het schaapje leest voor...</p>
              </div>
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

// How it Works Section
function HowItWorksSection() {
  const steps = [
    {
      icon: '📸',
      title: 'Knuffel fotograferen',
      description: 'Maak een foto van de lievelingsknuffel van je kind met je telefoon.',
    },
    {
      icon: '✨',
      title: 'Verhaal genereren',
      description: 'Wij maken een uniek verhaal en illustraties op maat van jouw kind.',
    },
    {
      icon: '📦',
      title: 'Boek bezorgd',
      description: 'Binnen 5-7 dagen ligt het gedrukte boek op de deurmat.',
    },
  ];

  return (
    <section className="section bg-zand">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionTitle subtitle="In drie simpele stappen naar een uniek kinderboek">
          Hoe het werkt
        </SectionTitle>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-wolwit rounded-full flex items-center justify-center shadow-sm">
                <span className="text-4xl">{step.icon}</span>
              </div>
              <div className="w-8 h-8 mx-auto mb-4 bg-abrikoos text-nachtblauw rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-nachtblauw mb-3">{step.title}</h3>
              <p className="text-nachtblauw/70">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button href="/hoe-het-werkt" variant="outline">
            Meer over het proces
          </Button>
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
    <section className="section bg-wolwit">
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
    { name: 'Bedtijd Avontuur', ages: '2-5 jaar', icon: '🌙', color: 'bg-pastelblauw/30' },
    { name: 'Dapper Zijn', ages: '3-6 jaar', icon: '🦁', color: 'bg-abrikoos/30' },
    { name: 'Verjaardag', ages: '2-8 jaar', icon: '🎂', color: 'bg-abrikoos/20' },
    { name: 'Vriendschap', ages: '4-7 jaar', icon: '💕', color: 'bg-saliegroen/30' },
    { name: 'Natuur Ontdekken', ages: '3-6 jaar', icon: '🌿', color: 'bg-saliegroen/20' },
    { name: 'Fantasie Wereld', ages: '5-8 jaar', icon: '🏰', color: 'bg-pastelblauw/20' },
  ];

  return (
    <section className="section bg-zand">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionTitle subtitle="Kies het perfecte avontuur voor jouw kind">
          Thema&apos;s &amp; leeftijden
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <Link
              key={index}
              href={`/themas#${theme.name.toLowerCase().replace(/\s/g, '-')}`}
              className={`${theme.color} p-6 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1 border border-nachtblauw/5`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{theme.icon}</span>
                <div>
                  <h3 className="font-bold text-nachtblauw">{theme.name}</h3>
                  <span className="text-sm text-nachtblauw/70">{theme.ages}</span>
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
      icon: '🎯',
      title: '100% uniek boek',
      description: 'Eén knuffel in de hoofdrol, speciaal voor jouw kind.',
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
      description: 'Geen gezichtsherkenning, foto\'s worden veilig verwerkt.',
    },
  ];

  return (
    <section className="section bg-wolwit">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionTitle subtitle="Dit maakt Knuffelboek zo bijzonder">
          Waarom ouders Knuffelboek kiezen
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {usps.map((usp, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-zand rounded-2xl shadow-sm flex items-center justify-center">
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
    <section className="section bg-zand">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionTitle subtitle="Lees wat andere ouders zeggen">
          Blije kinderen, blije ouders
        </SectionTitle>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-wolwit rounded-2xl p-6 shadow-sm">
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
    <section className="section bg-wolwit">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTitle subtitle="Transparante prijzen, geen verrassingen">
            Simpele prijzen
          </SectionTitle>
          <div className="bg-zand rounded-3xl shadow-lg p-8 lg:p-12">
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
                <span className="text-nachtblauw">Verhaal op maat van jouw kind</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-saliegroen text-xl">✓</span>
                <span className="text-nachtblauw">Bezorging binnen 5-7 werkdagen</span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button href="/maak-je-boek" size="lg">
                Maak je boek
              </Button>
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
        <Button href="/maak-je-boek" size="lg">
          Start met jouw knuffel
        </Button>
      </div>
    </section>
  );
}

// Main Home Page
export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <ExampleBooksSection />
      <ThemesSection />
      <USPsSection />
      <ReviewsSection />
      <PricingSection />
      <CTASection />
    </>
  );
}
