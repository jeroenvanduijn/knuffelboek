import { Metadata } from 'next';
import { Button, SectionTitle } from '@/components';

export const metadata: Metadata = {
  title: 'Prijzen - Knuffelboek',
  description: 'Transparante prijzen voor je gepersonaliseerde kinderboek. Vanaf €29,95 inclusief verzending.',
};

export default function PrijzenPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-cream via-cream/50 to-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-text mb-6">
            Prijzen
          </h1>
          <p className="text-xl text-text-light max-w-2xl mx-auto">
            Transparante prijzen, geen verrassingen. Je weet precies wat je betaalt.
          </p>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Main Product */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 lg:p-12 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">Meest gekozen</span>
                  <h2 className="text-3xl font-bold text-text mt-2">Standaard Knuffelboek</h2>
                  <p className="text-text-light mt-2">Een compleet gepersonaliseerd boek met de knuffel van je kind in de hoofdrol.</p>
                </div>
                <div className="text-center lg:text-right">
                  <span className="text-5xl lg:text-6xl font-bold text-primary">€29,95</span>
                  <p className="text-text-light text-sm mt-1">incl. verzending NL/BE</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-text mb-3">Dit krijg je:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-text-light">
                      <span className="text-primary">✓</span>
                      Softcover boek van hoge kwaliteit
                    </li>
                    <li className="flex items-center gap-3 text-text-light">
                      <span className="text-primary">✓</span>
                      16-24 pagina&apos;s (afhankelijk van leeftijd)
                    </li>
                    <li className="flex items-center gap-3 text-text-light">
                      <span className="text-primary">✓</span>
                      Uniek verhaal op maat
                    </li>
                    <li className="flex items-center gap-3 text-text-light">
                      <span className="text-primary">✓</span>
                      Jouw knuffel in elke illustratie
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-text mb-3">Specificaties:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-text-light">
                      <span className="text-primary">✓</span>
                      Formaat: 21 x 21 cm (vierkant)
                    </li>
                    <li className="flex items-center gap-3 text-text-light">
                      <span className="text-primary">✓</span>
                      Papier: 170 gsm mat gecoat
                    </li>
                    <li className="flex items-center gap-3 text-text-light">
                      <span className="text-primary">✓</span>
                      Full-color print
                    </li>
                    <li className="flex items-center gap-3 text-text-light">
                      <span className="text-primary">✓</span>
                      Levertijd: 5-7 werkdagen
                    </li>
                  </ul>
                </div>
              </div>

              <Button href="/maak-je-boek" size="lg" className="w-full sm:w-auto">
                Maak je boek
              </Button>
            </div>

            {/* Options Table */}
            <div className="bg-white rounded-2xl border border-sky-dark/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sky">
                    <tr>
                      <th className="text-left p-4 font-semibold text-text">Product</th>
                      <th className="text-left p-4 font-semibold text-text">Prijs</th>
                      <th className="text-left p-4 font-semibold text-text">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky">
                    <tr>
                      <td className="p-4 text-text">Standaard boek (softcover)</td>
                      <td className="p-4 text-text font-semibold">€29,95</td>
                      <td className="p-4 text-text-light">16-24 pagina&apos;s, incl. verzending</td>
                    </tr>
                    <tr className="bg-sky/20">
                      <td className="p-4 text-text">Hardcover upgrade</td>
                      <td className="p-4 text-text font-semibold">+€5,00</td>
                      <td className="p-4 text-text-light">Extra stevig, perfect als cadeau</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-text">Extra exemplaar (zelfde boek)</td>
                      <td className="p-4 text-text font-semibold">€19,95</td>
                      <td className="p-4 text-text-light">Ideaal voor opa/oma of als backup</td>
                    </tr>
                    <tr className="bg-sky/20">
                      <td className="p-4 text-text">Verzending buiten NL/BE</td>
                      <td className="p-4 text-text font-semibold">+€4,95</td>
                      <td className="p-4 text-text-light">EU-landen, 7-10 werkdagen</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Price */}
      <section className="section bg-sky/30">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionTitle subtitle="Wat maakt een Knuffelboek bijzonder?">
            Waarom deze prijs?
          </SectionTitle>
          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="font-bold text-text mb-2">Unieke illustraties</h3>
                <p className="text-text-light text-sm">
                  Elke pagina wordt speciaal voor jouw boek gegenereerd met jouw knuffel in de scene.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <div className="text-3xl mb-4">📝</div>
                <h3 className="font-bold text-text mb-2">Verhaal op maat</h3>
                <p className="text-text-light text-sm">
                  Het verhaal bevat de naam van je kind, de knuffel, en past bij de gekozen leeftijd.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="font-bold text-text mb-2">Kwaliteitsdruk</h3>
                <p className="text-text-light text-sm">
                  Gedrukt op stevig, duurzaam papier met levendige kleuren die lang mooi blijven.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <div className="text-3xl mb-4">📦</div>
                <h3 className="font-bold text-text mb-2">Verzending inbegrepen</h3>
                <p className="text-text-light text-sm">
                  Geen verborgen kosten. De prijs is inclusief verzending naar NL en BE.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-text mb-6">Betaalmethodes</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 bg-sky px-4 py-2 rounded-lg">
                <span className="font-semibold text-text">iDEAL</span>
              </div>
              <div className="flex items-center gap-2 bg-sky px-4 py-2 rounded-lg">
                <span className="font-semibold text-text">Bancontact</span>
              </div>
              <div className="flex items-center gap-2 bg-sky px-4 py-2 rounded-lg">
                <span className="font-semibold text-text">Creditcard</span>
              </div>
              <div className="flex items-center gap-2 bg-sky px-4 py-2 rounded-lg">
                <span className="font-semibold text-text">Apple Pay</span>
              </div>
            </div>
            <p className="text-text-light mt-6 text-sm">
              Alle betalingen worden veilig verwerkt via Mollie. Je gegevens zijn altijd beschermd.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Een uniek cadeau voor maar €29,95
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
            Maak een blijvende herinnering die je kind keer op keer kan lezen.
          </p>
          <Button href="/maak-je-boek" variant="secondary" size="lg">
            Start nu
          </Button>
        </div>
      </section>
    </>
  );
}
