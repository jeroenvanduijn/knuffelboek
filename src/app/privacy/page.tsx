import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacyverklaring - Knuffelboek',
  description: 'Lees hoe Knuffelboek omgaat met je persoonlijke gegevens.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-wolwit">
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold text-nachtblauw mb-8">
            Privacyverklaring Knuffelboek
          </h1>

          <div className="prose prose-lg max-w-none text-nachtblauw/80 space-y-8">

            {/* 1. Wie zijn wij */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">1. Wie zijn wij</h2>
              <p>
                Knuffelboek is een product van Curly BV
              </p>
              <ul className="list-none pl-0 space-y-1 mt-4">
                <li><strong>Vestigingsplaats:</strong> Katwijk aan Zee</li>
                <li><strong>Adres:</strong> Nico Marie NM, 2225</li>
                <li><strong>KvK-nummer:</strong> 00000000</li>
                <li><strong>BTW-nummer:</strong> NL000000000B01</li>
                <li><strong>E-mail:</strong> <a href="mailto:info@knuffelboek.nl" className="text-abrikoos hover:underline">info@knuffelboek.nl</a></li>
              </ul>
              <p className="mt-4">
                Curly BV is verantwoordelijk voor de verwerking van jouw persoonsgegevens.
              </p>
            </section>

            {/* 2. Welke gegevens verzamelen wij */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">2. Welke gegevens verzamelen wij</h2>
              <p>Wij verwerken:</p>
              <ol className="list-decimal pl-6 space-y-2 mt-2">
                <li>Contact- en accountgegevens</li>
                <li>Bestelgegevens</li>
                <li>
                  Gegevens voor het boek
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Naam kind</li>
                    <li>Naam knuffel</li>
                    <li>Leeftijd of thema</li>
                    <li>Geuploade foto(&apos;s)</li>
                  </ul>
                </li>
                <li>Technische gegevens (IP, apparaat, cookies)</li>
              </ol>
            </section>

            {/* 3. Waarom verwerken wij deze gegevens */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">3. Waarom verwerken wij deze gegevens</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Om je boek te maken, drukken en verzenden</li>
                <li>Om je bestelling te kunnen verwerken en informeren</li>
                <li>Voor klantenservice en klachten</li>
                <li>Om onze website en app te verbeteren</li>
                <li>Voor administratie en wettelijke verplichtingen</li>
                <li>Voor marketing alleen met jouw toestemming</li>
              </ul>
            </section>

            {/* 4. Rechtsgrond */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">4. Rechtsgrond</h2>
              <p>Wij verwerken gegevens op basis van:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Uitvoering van de overeenkomst</li>
                <li>Wettelijke verplichting</li>
                <li>Gerechtvaardigd belang</li>
                <li>Toestemming (bijvoorbeeld voor marketing)</li>
              </ul>
            </section>

            {/* 5. Bewaartermijnen */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">5. Bewaartermijnen</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Geuploade foto&apos;s en boekinhoud bewaren wij maximaal 6 maanden na levering</li>
                <li>Factuur- en administratiegegevens bewaren wij 7 jaar</li>
                <li>Accountgegevens bewaren wij zolang je account actief is</li>
                <li>Technische gegevens bewaren wij zo kort mogelijk, vaak anoniem</li>
              </ul>
              <p className="mt-4">
                Je mag altijd vragen om gegevens eerder te verwijderen.
              </p>
            </section>

            {/* 6. Delen met derden */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">6. Delen met derden</h2>
              <p>Wij delen jouw gegevens alleen met:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Onze drukpartner (bijv. Lulu)</li>
                <li>Betaaldienstverleners (zoals Stripe of Mollie)</li>
                <li>Hosting- en IT-partners</li>
                <li>Pakketdiensten</li>
              </ul>
              <p className="mt-4">
                Wij verkopen jouw gegevens niet.
                Buiten de EU nemen wij passende beveiligingsmaatregelen zoals SCC&apos;s.
              </p>
            </section>

            {/* 7. Beveiliging */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">7. Beveiliging</h2>
              <p>
                Wij nemen passende technische en organisatorische maatregelen om je gegevens te beschermen,
                zoals versleuteling en beperkte toegang.
              </p>
            </section>

            {/* 8. Jouw rechten */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">8. Jouw rechten</h2>
              <p>Je hebt recht op:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Inzage</li>
                <li>Correctie</li>
                <li>Verwijdering</li>
                <li>Beperking</li>
                <li>Overdraagbaarheid</li>
                <li>Bezwaar</li>
                <li>Intrekken van toestemming</li>
              </ul>
              <p className="mt-4">
                Mail naar <a href="mailto:info@knuffelboek.nl" className="text-abrikoos hover:underline">info@knuffelboek.nl</a> voor een verzoek.
              </p>
            </section>

            {/* 9. Klacht indienen */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">9. Klacht indienen</h2>
              <p>Niet tevreden? Je kunt een klacht indienen bij:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Autoriteit Persoonsgegevens (NL)</li>
                <li>Gegevensbeschermingsautoriteit (BE)</li>
              </ul>
            </section>

            {/* 10. Wijzigingen */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">10. Wijzigingen</h2>
              <p>
                Wij kunnen deze verklaring wijzigen.
                De meest recente versie staat altijd op onze website.
              </p>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-nachtblauw/10">
            <Link href="/" className="text-abrikoos hover:underline">
              ← Terug naar home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
