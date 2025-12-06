'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, SectionTitle } from '@/components';
import { WEBAPP_URL } from '@/lib/constants';

const faqItems = [
  {
    category: 'Bestellen',
    questions: [
      {
        q: 'Hoe lang duurt het voordat het boek er is?',
        a: 'Na je bestelling duurt het 5-7 werkdagen voordat het boek bij je thuis wordt bezorgd. We sturen je een e-mail met track & trace zodra het boek onderweg is.',
      },
      {
        q: 'Naar welke landen leveren jullie?',
        a: 'We leveren standaard naar Nederland en België. Verzending naar andere EU-landen is ook mogelijk tegen een meerprijs van €4,95. Levertijd buiten NL/BE is 7-10 werkdagen.',
      },
      {
        q: 'Kan ik meerdere exemplaren bestellen?',
        a: 'Ja! Een extra exemplaar van hetzelfde boek kost €19,95. Ideaal als cadeau voor opa en oma of als backup. Je kunt dit toevoegen bij het afrekenen.',
      },
      {
        q: 'Welke betaalmethoden accepteren jullie?',
        a: 'We accepteren iDEAL en creditcard (Visa, Mastercard, American Express). Alle betalingen worden veilig verwerkt via Stripe.',
      },
    ],
  },
  {
    category: 'Het boek maken',
    questions: [
      {
        q: 'Hoe moet ik de knuffel fotograferen?',
        a: 'Maak een foto van de knuffel tegen een neutrale achtergrond (wit of licht) met goede belichting. Daglicht werkt het beste. Zorg dat de hele knuffel zichtbaar is, vooral het gezicht. De achtergrond wordt automatisch verwijderd.',
      },
      {
        q: 'Kan ik het verhaal zelf aanpassen?',
        a: 'Het verhaal wordt automatisch gegenereerd op basis van het thema, de leeftijd en de namen die je invoert. Je kunt een ander thema kiezen als het verhaal niet bevalt, maar de tekst zelf aanpassen is momenteel niet mogelijk.',
      },
      {
        q: 'Kan ik meerdere kinderen in één boek zetten?',
        a: 'Op dit moment kan het boek over één kind gaan, maar je kunt wel broertjes, zusjes of ouders toevoegen als bijpersonages in het verhaal.',
      },
      {
        q: 'Wat als ik niet tevreden ben met de preview?',
        a: 'Als je niet tevreden bent met de preview, kun je een ander thema kiezen of opnieuw beginnen. Je betaalt pas als je tevreden bent en de bestelling afrondt.',
      },
    ],
  },
  {
    category: 'Privacy & veiligheid',
    questions: [
      {
        q: 'Wat gebeurt er met de foto van mijn knuffel?',
        a: 'De foto wordt veilig verwerkt om de illustraties te maken. Na het aanmaken van je boek worden de originele foto\'s automatisch verwijderd. We gebruiken geen gezichtsherkenning en delen geen gegevens met derden.',
      },
      {
        q: 'Is de betaling veilig?',
        a: 'Ja, alle betalingen worden verwerkt via Mollie, een gecertificeerde betaalprovider. We slaan geen creditcardgegevens op.',
      },
      {
        q: 'Worden mijn gegevens gedeeld?',
        a: 'Nee. We delen je gegevens alleen met de drukkerij om je bestelling te kunnen leveren. Zie ons privacybeleid voor meer informatie.',
      },
    ],
  },
  {
    category: 'Kwaliteit & retour',
    questions: [
      {
        q: 'Hoe is de kwaliteit van het boek?',
        a: 'We gebruiken premium papier (170 gsm mat gecoat) en professionele full-color druktechnieken. Het boek heeft een formaat van 21x21 cm en is gemaakt om tegen een stootje te kunnen.',
      },
      {
        q: 'Wat als het boek beschadigd aankomt?',
        a: 'Neem contact met ons op via het contactformulier met foto\'s van de schade. We sturen dan kosteloos een nieuw exemplaar.',
      },
      {
        q: 'Kan ik het boek retourneren?',
        a: 'Omdat elk boek speciaal voor jou wordt gemaakt, kunnen we geen retourzendingen accepteren tenzij er sprake is van een productiefout of transportschade.',
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-nachtblauw/10 last:border-0">
      <button
        className="w-full py-5 flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-nachtblauw pr-4">{question}</span>
        <span className={`text-abrikoos transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="pb-5 pr-8">
          <p className="text-nachtblauw/70">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-pastelblauw/40 via-pastelblauw/20 to-wolwit py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-nachtblauw mb-6">
            Veelgestelde vragen
          </h1>
          <p className="text-xl text-nachtblauw/70 max-w-2xl mx-auto">
            Antwoorden op de meest gestelde vragen over Knuffelboek.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section bg-wolwit">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto space-y-12">
            {faqItems.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-bold text-nachtblauw mb-6">{category.category}</h2>
                <div className="bg-wolwit rounded-xl border border-nachtblauw/10">
                  {category.questions.map((item, index) => (
                    <FAQItem key={index} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="section bg-zand">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <SectionTitle subtitle="We helpen je graag verder">
            Staat je vraag er niet tussen?
          </SectionTitle>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact">
              Neem contact op
            </Button>
            <Button href={WEBAPP_URL} variant="outline">
              Start met je boek
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
