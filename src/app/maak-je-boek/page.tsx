import Link from 'next/link';
import Image from 'next/image';
import { Button, SectionTitle } from '@/components';
import { WEBAPP_URL } from '@/components/Header';

// Logo URL
const LOGO_URL = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures/logo/Ontwerp%20zonder%20titel%20%2847%29.png';

// Steps section
function StepsSection() {
  const steps = [
    {
      number: 1,
      icon: '📸',
      title: 'Upload een foto van de knuffel',
      description: 'Maak een duidelijke foto van de lievelingsknuffel van je kind. Onze AI verwijdert automatisch de achtergrond.',
    },
    {
      number: 2,
      icon: '✍️',
      title: 'Personaliseer het verhaal',
      description: 'Vul de naam en leeftijd van je kind in, geef de knuffel een naam en kies een thema voor het avontuur.',
    },
    {
      number: 3,
      icon: '🤖',
      title: 'AI genereert jouw boek',
      description: 'Onze AI schrijft een uniek verhaal en maakt prachtige illustraties met de knuffel in de hoofdrol.',
    },
    {
      number: 4,
      icon: '📖',
      title: 'Bekijk en bestel',
      description: 'Bekijk de preview, download de PDF of bestel een prachtig gedrukt boek dat binnen 5-7 dagen bezorgd wordt.',
    },
  ];

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-nachtblauw text-center mb-8">
        Zo werkt het in de webapp
      </h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-wolwit rounded-2xl p-6 border border-nachtblauw/5 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-zand rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">{step.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-abrikoos text-nachtblauw rounded-full flex items-center justify-center text-xs font-bold">
                    {step.number}
                  </span>
                  <h3 className="font-bold text-nachtblauw">{step.title}</h3>
                </div>
                <p className="text-nachtblauw/70 text-sm">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Features section
function FeaturesSection() {
  const features = [
    { icon: '🔒', text: 'Privacyvriendelijk – geen kindergezichten opgeslagen' },
    { icon: '🤖', text: 'Gemini AI herkent automatisch het type knuffel' },
    { icon: '🎨', text: 'Unieke illustraties gegenereerd door AI' },
    { icon: '📚', text: 'Premium printkwaliteit op stevig papier' },
    { icon: '🚚', text: 'Gratis verzending binnen NL & BE' },
    { icon: '📄', text: 'PDF direct beschikbaar om te downloaden' },
  ];

  return (
    <section className="py-8">
      <div className="bg-zand rounded-2xl p-6 lg:p-8">
        <h3 className="font-semibold text-nachtblauw mb-4 text-center">Wat je kunt verwachten</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-xl">{feature.icon}</span>
              <span className="text-sm text-nachtblauw/80">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main page component
export default function MaakJeBoekPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zand/50 to-wolwit">
      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-nachtblauw/60 hover:text-abrikoos transition-colors mb-4">
            <span>←</span>
            <span>Terug naar home</span>
          </Link>
        </div>

        {/* Hero section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="mb-6">
          <Image
            src={LOGO_URL}
            alt="Knuffelboek"
            width={200}
            height={60}
            className="mx-auto h-28 w-auto"
          />
        </div>

          <h1 className="text-3xl lg:text-5xl font-bold text-nachtblauw mb-4">
            Maak een <span className="text-abrikoos">gepersonaliseerd</span> kinderboek
          </h1>

          <p className="text-lg lg:text-xl text-nachtblauw/70 mb-8 max-w-2xl mx-auto">
            Upload een foto van de lievelingsknuffel van je kind en onze AI maakt automatisch een uniek verhaal met prachtige illustraties. Klaar in een paar minuten!
          </p>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href={WEBAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Start nu in de webapp →
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-nachtblauw/60">
            <span className="flex items-center gap-2">
              <span className="text-saliegroen">✓</span>
              Geen account nodig
            </span>
            <span className="flex items-center gap-2">
              <span className="text-saliegroen">✓</span>
              Klaar in 5 minuten
            </span>
            <span className="flex items-center gap-2">
              <span className="text-saliegroen">✓</span>
              Vanaf €29,95
            </span>
          </div>
        </div>

        {/* Content sections */}
        <div className="max-w-4xl mx-auto">
          <StepsSection />
          <FeaturesSection />

          {/* Bottom CTA */}
          <div className="text-center py-12">
            <div className="bg-nachtblauw rounded-3xl p-8 lg:p-12 text-wolwit">
              <div className="mb-4">
              <Image
                src={LOGO_URL}
                alt="Knuffelboek"
                width={150}
                height={45}
                className="mx-auto h-20 w-auto brightness-0 invert"
              />
            </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Klaar om te beginnen?
              </h2>
              <p className="text-wolwit/80 mb-6 max-w-lg mx-auto">
                In de webapp kun je direct aan de slag. Upload een foto, personaliseer het verhaal, en ontvang binnen een paar minuten je unieke knuffelboek.
              </p>
              <a
                href={WEBAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-abrikoos text-nachtblauw font-semibold px-8 py-4 rounded-xl hover:bg-abrikoos-dark transition-colors"
              >
                Open de webapp →
              </a>
            </div>
          </div>

          {/* FAQ teaser */}
          <div className="text-center py-8">
            <p className="text-nachtblauw/70 mb-4">
              Heb je vragen over het maken van een knuffelboek?
            </p>
            <Button href="/faq" variant="outline">
              Bekijk de FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
