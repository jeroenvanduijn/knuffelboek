import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden - Knuffelboek',
  description: 'Lees de algemene voorwaarden van Knuffelboek.',
};

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold text-text mb-8">Algemene Voorwaarden</h1>

          <div className="prose prose-lg max-w-none text-text-light space-y-6">
            <p className="text-text font-medium">
              Laatst bijgewerkt: december 2024
            </p>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">1. Definities</h2>
              <p>
                In deze algemene voorwaarden wordt verstaan onder:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Knuffelboek:</strong> de aanbieder van gepersonaliseerde kinderboeken</li>
                <li><strong>Klant:</strong> de natuurlijke persoon die een bestelling plaatst</li>
                <li><strong>Product:</strong> het gepersonaliseerde kinderboek</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">2. Toepassing</h2>
              <p>
                Deze voorwaarden zijn van toepassing op alle bestellingen geplaatst via knuffelboek.nl.
                Door een bestelling te plaatsen, ga je akkoord met deze voorwaarden.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">3. Bestelling en betaling</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Een bestelling is definitief na ontvangst van betaling</li>
                <li>Prijzen zijn inclusief BTW en verzendkosten (NL/BE)</li>
                <li>Betaling geschiedt via iDEAL, Bancontact of creditcard</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">4. Levering</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Levertijd: 5-7 werkdagen binnen Nederland en België</li>
                <li>Levertijd buiten NL/BE: 7-10 werkdagen</li>
                <li>Je ontvangt een track &amp; trace code per e-mail</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">5. Herroepingsrecht</h2>
              <p>
                Omdat elk product speciaal voor jou wordt gemaakt (gepersonaliseerd product), geldt
                het wettelijke herroepingsrecht van 14 dagen niet. Je kunt je bestelling niet annuleren
                of retourneren, tenzij er sprake is van een productiefout.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">6. Klachten</h2>
              <p>
                Bij beschadiging tijdens transport of productiefouten neem je binnen 7 dagen contact
                op via <a href="mailto:hallo@knuffelboek.nl" className="text-primary hover:underline">hallo@knuffelboek.nl</a>.
                Voeg foto&apos;s van de schade toe. We sturen dan kosteloos een nieuw exemplaar.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">7. Intellectueel eigendom</h2>
              <p>
                De gegenereerde verhalen en illustraties blijven eigendom van Knuffelboek. Je krijgt
                het recht om het boek te gebruiken voor persoonlijke doeleinden. Commercieel gebruik
                is niet toegestaan.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">8. Aansprakelijkheid</h2>
              <p>
                Knuffelboek is niet aansprakelijk voor indirecte schade. Onze aansprakelijkheid is
                beperkt tot het bedrag van je bestelling.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">9. Toepasselijk recht</h2>
              <p>
                Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd
                aan de bevoegde rechter in Nederland.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">10. Contact</h2>
              <p>
                Voor vragen over deze voorwaarden kun je contact opnemen via{' '}
                <a href="mailto:hallo@knuffelboek.nl" className="text-primary hover:underline">hallo@knuffelboek.nl</a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-sky-dark/30">
            <Link href="/" className="text-primary hover:underline">
              ← Terug naar home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
