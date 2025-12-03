import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacybeleid - Knuffelboek',
  description: 'Lees hoe Knuffelboek omgaat met je persoonlijke gegevens.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold text-text mb-8">Privacybeleid</h1>

          <div className="prose prose-lg max-w-none text-text-light space-y-6">
            <p className="text-text font-medium">
              Laatst bijgewerkt: december 2024
            </p>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">1. Inleiding</h2>
              <p>
                Bij Knuffelboek nemen we je privacy serieus. Dit privacybeleid legt uit welke gegevens
                we verzamelen, waarom we dat doen, en hoe we je gegevens beschermen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">2. Welke gegevens verzamelen we?</h2>
              <p>We verzamelen de volgende gegevens:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Naam en e-mailadres (voor bestellingen en communicatie)</li>
                <li>Verzendadres (voor bezorging)</li>
                <li>Betaalgegevens (verwerkt via Mollie, we slaan deze niet op)</li>
                <li>Foto&apos;s van knuffels (voor het maken van illustraties)</li>
                <li>Personalisatiegegevens (namen, leeftijden voor het verhaal)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">3. Hoe gebruiken we je gegevens?</h2>
              <p>Je gegevens worden uitsluitend gebruikt voor:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Het maken en leveren van je gepersonaliseerde boek</li>
                <li>Communicatie over je bestelling</li>
                <li>Verbetering van onze diensten</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">4. Foto&apos;s en privacy</h2>
              <p>
                We gebruiken geen gezichtsherkenning. Foto&apos;s van knuffels worden veilig verwerkt
                om illustraties te genereren. Na het aanmaken van je boek worden de originele foto&apos;s
                automatisch verwijderd.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">5. Gegevens delen</h2>
              <p>
                We delen je gegevens alleen met:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Onze drukpartner (voor het printen en verzenden van je boek)</li>
                <li>Mollie (voor betalingsverwerking)</li>
              </ul>
              <p>We verkopen nooit je gegevens aan derden.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">6. Je rechten</h2>
              <p>Je hebt het recht om:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Je gegevens in te zien</li>
                <li>Je gegevens te laten corrigeren of verwijderen</li>
                <li>Bezwaar te maken tegen verwerking</li>
              </ul>
              <p>Neem contact op via <a href="mailto:privacy@knuffelboek.nl" className="text-primary hover:underline">privacy@knuffelboek.nl</a></p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text mt-8 mb-4">7. Contact</h2>
              <p>
                Voor vragen over dit privacybeleid kun je contact opnemen via{' '}
                <a href="mailto:privacy@knuffelboek.nl" className="text-primary hover:underline">privacy@knuffelboek.nl</a>
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
