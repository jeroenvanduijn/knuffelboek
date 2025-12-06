import { Metadata } from 'next';
import Image from 'next/image';
import { Button, SectionTitle } from '@/components';

// Logo URL
const LOGO_URL = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures/logo/Ontwerp%20zonder%20titel%20%2847%29.png';

export const metadata: Metadata = {
  title: 'Prijzen - Knuffelboek',
  description: 'Transparante prijzen voor je gepersonaliseerde kinderboek. Vanaf €29,95 inclusief verzending.',
};

export default function PrijzenPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-zand via-zand/50 to-wolwit py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-nachtblauw mb-6">
            Prijzen
          </h1>
          <p className="text-xl text-nachtblauw/70 max-w-2xl mx-auto">
            Transparante prijzen, geen verrassingen. Je weet precies wat je betaalt.
          </p>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="section bg-wolwit">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Main Product */}
            <div className="bg-gradient-to-br from-abrikoos/10 to-pastelblauw/10 rounded-3xl p-8 lg:p-12 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                  <span className="text-sm font-semibold text-abrikoos uppercase tracking-wide">Meest gekozen</span>
                  <h2 className="text-3xl font-bold text-nachtblauw mt-2">Standaard Knuffelboek</h2>
                  <p className="text-nachtblauw/70 mt-2">Een compleet gepersonaliseerd boek met de knuffel van je kind in de hoofdrol.</p>
                </div>
                <div className="text-center lg:text-right">
                  <span className="text-5xl lg:text-6xl font-bold text-abrikoos">€29,95</span>
                  <p className="text-nachtblauw/70 text-sm mt-1">incl. verzending NL/BE</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-nachtblauw mb-3">Dit krijg je:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-nachtblauw/70">
                      <span className="text-saliegroen">✓</span>
                      Softcover boek van hoge kwaliteit
                    </li>
                    <li className="flex items-center gap-3 text-nachtblauw/70">
                      <span className="text-saliegroen">✓</span>
                      16-24 pagina&apos;s (afhankelijk van leeftijd)
                    </li>
                    <li className="flex items-center gap-3 text-nachtblauw/70">
                      <span className="text-saliegroen">✓</span>
                      Uniek verhaal op maat
                    </li>
                    <li className="flex items-center gap-3 text-nachtblauw/70">
                      <span className="text-saliegroen">✓</span>
                      Jouw knuffel in elke illustratie
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-nachtblauw mb-3">Specificaties:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-nachtblauw/70">
                      <span className="text-saliegroen">✓</span>
                      Formaat: 21 x 21 cm (vierkant)
                    </li>
                    <li className="flex items-center gap-3 text-nachtblauw/70">
                      <span className="text-saliegroen">✓</span>
                      Papier: 170 gsm mat gecoat
                    </li>
                    <li className="flex items-center gap-3 text-nachtblauw/70">
                      <span className="text-saliegroen">✓</span>
                      Full-color print
                    </li>
                    <li className="flex items-center gap-3 text-nachtblauw/70">
                      <span className="text-saliegroen">✓</span>
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
            <div className="bg-wolwit rounded-2xl border border-nachtblauw/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-pastelblauw/30">
                    <tr>
                      <th className="text-left p-4 font-semibold text-nachtblauw">Product</th>
                      <th className="text-left p-4 font-semibold text-nachtblauw">Prijs</th>
                      <th className="text-left p-4 font-semibold text-nachtblauw">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nachtblauw/10">
                    <tr>
                      <td className="p-4 text-nachtblauw">Softcover boek</td>
                      <td className="p-4 text-nachtblauw font-semibold">€29,95</td>
                      <td className="p-4 text-nachtblauw/70">16-24 pagina&apos;s, incl. verzending NL/BE</td>
                    </tr>
                    <tr className="bg-pastelblauw/10">
                      <td className="p-4 text-nachtblauw">Hardcover boek</td>
                      <td className="p-4 text-nachtblauw font-semibold">€39,95</td>
                      <td className="p-4 text-nachtblauw/70">Extra stevig, perfect als cadeau, incl. verzending</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-nachtblauw">PDF download</td>
                      <td className="p-4 text-nachtblauw font-semibold">€10,00</td>
                      <td className="p-4 text-nachtblauw/70">Direct downloaden, onbeperkt printen</td>
                    </tr>
                    <tr className="bg-pastelblauw/10">
                      <td className="p-4 text-nachtblauw">PDF na boekaankoop</td>
                      <td className="p-4 text-nachtblauw font-semibold">€5,00</td>
                      <td className="p-4 text-nachtblauw/70">Extra PDF bij je bestelling</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-nachtblauw">Extra exemplaar (zelfde boek)</td>
                      <td className="p-4 text-nachtblauw font-semibold">€19,95</td>
                      <td className="p-4 text-nachtblauw/70">Ideaal voor opa/oma of als backup</td>
                    </tr>
                    <tr className="bg-pastelblauw/10">
                      <td className="p-4 text-nachtblauw">Verzending buiten NL/BE</td>
                      <td className="p-4 text-nachtblauw font-semibold">+€4,95</td>
                      <td className="p-4 text-nachtblauw/70">EU-landen, 7-10 werkdagen</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Price */}
      <section className="section bg-zand">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionTitle subtitle="Wat maakt een Knuffelboek bijzonder?">
            Waarom deze prijs?
          </SectionTitle>
          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-wolwit rounded-xl p-6">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="font-bold text-nachtblauw mb-2">Unieke illustraties</h3>
                <p className="text-nachtblauw/70 text-sm">
                  Elke pagina wordt speciaal voor jouw boek gegenereerd met jouw knuffel in de scene.
                </p>
              </div>
              <div className="bg-wolwit rounded-xl p-6">
                <div className="text-3xl mb-4">📝</div>
                <h3 className="font-bold text-nachtblauw mb-2">Verhaal op maat</h3>
                <p className="text-nachtblauw/70 text-sm">
                  Het verhaal bevat de naam van je kind, de knuffel, en past bij de gekozen leeftijd.
                </p>
              </div>
              <div className="bg-wolwit rounded-xl p-6">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="font-bold text-nachtblauw mb-2">Kwaliteitsdruk</h3>
                <p className="text-nachtblauw/70 text-sm">
                  Gedrukt op stevig, duurzaam papier met levendige kleuren die lang mooi blijven.
                </p>
              </div>
              <div className="bg-wolwit rounded-xl p-6">
                <div className="text-3xl mb-4">📦</div>
                <h3 className="font-bold text-nachtblauw mb-2">Verzending inbegrepen</h3>
                <p className="text-nachtblauw/70 text-sm">
                  Geen verborgen kosten. De prijs is inclusief verzending naar NL en BE.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="section bg-wolwit">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-nachtblauw mb-6">Betaalmethodes</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 bg-pastelblauw/30 px-4 py-2 rounded-lg">
                <span className="font-semibold text-nachtblauw">iDEAL</span>
              </div>
              <div className="flex items-center gap-2 bg-pastelblauw/30 px-4 py-2 rounded-lg">
                <span className="font-semibold text-nachtblauw">Creditcard</span>
              </div>
            </div>
            <p className="text-nachtblauw/70 mt-6 text-sm">
              Alle betalingen worden veilig verwerkt via Stripe. Je gegevens zijn altijd beschermd.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-nachtblauw text-wolwit">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="mb-6">
            <Image
              src={LOGO_URL}
              alt="Knuffelboek"
              width={200}
              height={60}
              className="mx-auto h-24 w-auto brightness-0 invert"
            />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Een uniek cadeau voor maar €29,95
          </h2>
          <p className="text-xl text-wolwit/80 mb-8 max-w-xl mx-auto">
            Maak een blijvende herinnering die je kind keer op keer kan lezen.
          </p>
          <Button href="/maak-je-boek" size="lg">
            Start nu
          </Button>
        </div>
      </section>
    </>
  );
}
