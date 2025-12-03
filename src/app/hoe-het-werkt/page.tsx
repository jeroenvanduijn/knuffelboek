import { Metadata } from 'next';
import { Button, SectionTitle, SheepMascot } from '@/components';

export const metadata: Metadata = {
  title: 'Hoe het werkt - Knuffelboek',
  description: 'Ontdek hoe je in een paar minuten een gepersonaliseerd kinderboek maakt met de knuffel van je kind.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: 'Foto van de knuffel',
      description: 'Maak een duidelijke foto van de lievelingsknuffel van je kind met je smartphone.',
      tips: [
        'Kies een neutrale, lichte achtergrond',
        'Zorg voor goede belichting (daglicht werkt het beste)',
        'Fotografeer de knuffel van voren, zodat het gezicht goed zichtbaar is',
        'De achtergrond wordt automatisch verwijderd',
      ],
      icon: '📸',
      color: 'bg-pastelblauw/30',
    },
    {
      number: 2,
      title: 'Personaliseren',
      description: 'Vul de gegevens in zodat het verhaal helemaal op maat wordt gemaakt.',
      tips: [
        'Naam van je kind',
        'Leeftijd (bepaalt de verhaallengte en taalgebruik)',
        'Naam van de knuffel',
        'Optioneel: broertjes/zusjes, huisdieren, ouders',
      ],
      icon: '✏️',
      color: 'bg-abrikoos/30',
    },
    {
      number: 3,
      title: 'Kies thema & leeftijd',
      description: 'Selecteer een avontuur dat past bij jouw kind en de situatie.',
      tips: [
        'Elk thema heeft een uniek verhaallijn',
        'De leeftijd bepaalt de complexiteit van de zinnen',
        '2-3 jaar: korte zinnen, veel herhaling',
        '4-5 jaar: langere zinnen, meer avontuur',
        '6-8 jaar: complexere verhalen',
      ],
      icon: '🎨',
      color: 'bg-pastelblauw/20',
    },
    {
      number: 4,
      title: 'Preview je boek',
      description: 'Blader door het gegenereerde boek en controleer of alles klopt.',
      tips: [
        'Bekijk elke pagina in de browser',
        'Controleer namen en illustraties',
        'Niet tevreden? Kies een ander thema',
        'De knuffel verschijnt in elke illustratie',
      ],
      icon: '👀',
      color: 'bg-saliegroen/30',
    },
    {
      number: 5,
      title: 'Bestellen & betalen',
      description: 'Rond je bestelling af en wacht op je unieke kinderboek.',
      tips: [
        'Kies softcover of hardcover',
        'Bestel extra exemplaren met korting',
        'Betaal veilig via iDEAL, Bancontact of creditcard',
        'Levertijd: 5-7 werkdagen binnen NL/BE',
      ],
      icon: '📦',
      color: 'bg-zand',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-pastelblauw/40 via-pastelblauw/20 to-wolwit py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-nachtblauw mb-6">
            Hoe het werkt
          </h1>
          <p className="text-xl text-nachtblauw/70 max-w-2xl mx-auto">
            In een paar minuten geregeld – wij doen de rest. Van foto tot gedrukt boek op de deurmat.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="section bg-wolwit">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}
              >
                <div className={`w-full lg:w-1/2 ${step.color} rounded-3xl p-8 lg:p-12`}>
                  <div className="text-center">
                    <span className="text-6xl lg:text-8xl">{step.icon}</span>
                  </div>
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-abrikoos text-nachtblauw rounded-full flex items-center justify-center text-xl font-bold">
                      {step.number}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-nachtblauw">
                      {step.title}
                    </h2>
                  </div>
                  <p className="text-nachtblauw/70 text-lg mb-6">{step.description}</p>
                  <ul className="space-y-2">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-abrikoos mt-1">•</span>
                        <span className="text-nachtblauw/70">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech/Trust Section */}
      <section className="section bg-zand">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <SectionTitle subtitle="Hoe we jouw boek maken">
              Techniek met een menselijke touch
            </SectionTitle>
            <div className="bg-wolwit rounded-2xl p-8 lg:p-10 text-left space-y-6">
              <div className="flex gap-4">
                <span className="text-3xl">🤖</span>
                <div>
                  <h3 className="font-bold text-nachtblauw mb-2">AI helpt met het verhaal</h3>
                  <p className="text-nachtblauw/70">
                    Onze slimme technologie genereert een uniek verhaal en illustraties op basis van jouw input. Maar jij houdt altijd de controle – kies het thema, bekijk de preview, en bestel alleen als je tevreden bent.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl">🔒</span>
                <div>
                  <h3 className="font-bold text-nachtblauw mb-2">Privacy staat voorop</h3>
                  <p className="text-nachtblauw/70">
                    We gebruiken geen gezichtsherkenning. Foto&apos;s van knuffels worden veilig verwerkt en na het maken van je boek verwijderd. Jouw gegevens blijven van jou.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl">👶</span>
                <div>
                  <h3 className="font-bold text-nachtblauw mb-2">Kindvriendelijk gegarandeerd</h3>
                  <p className="text-nachtblauw/70">
                    Alle verhalen worden gecontroleerd op geschiktheid voor kinderen. Geen enge elementen, alleen warme, vrolijke avonturen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-nachtblauw text-wolwit">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <SheepMascot variant="happy" size="lg" className="mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Klaar om te beginnen?
          </h2>
          <p className="text-xl text-wolwit/80 mb-8 max-w-xl mx-auto">
            Het duurt maar een paar minuten om een magisch cadeau te maken.
          </p>
          <Button href="/maak-je-boek" size="lg">
            Maak je eerste boek
          </Button>
        </div>
      </section>
    </>
  );
}
