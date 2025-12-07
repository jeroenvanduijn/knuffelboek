import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden - Knuffelboek',
  description: 'Lees de algemene voorwaarden van Knuffelboek.',
};

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen bg-wolwit">
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold text-nachtblauw mb-8">
            Algemene voorwaarden Knuffelboek
          </h1>

          <div className="prose prose-lg max-w-none text-nachtblauw/80 space-y-8">

            {/* 1. Wie zijn wij */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">1. Wie zijn wij</h2>
              <p>
                Knuffelboek is een product van Curly BV.
              </p>
              <ul className="list-none pl-0 space-y-1 mt-4">
                <li><strong>Handelsnaam:</strong> Knuffelboek</li>
                <li><strong>Vestigingsplaats:</strong> Katwijk aan Zee, Nederland</li>
                <li><strong>Adres:</strong> Nico Marie NM, 2225</li>
                <li><strong>KvK-nummer:</strong> 00000000</li>
                <li><strong>BTW-nummer:</strong> NL000000000B01</li>
                <li><strong>E-mail:</strong> <a href="mailto:info@knuffelboek.nl" className="text-abrikoos hover:underline">info@knuffelboek.nl</a></li>
              </ul>
              <p className="mt-4">
                In deze voorwaarden noemen wij Curly BV &quot;Knuffelboek&quot; en jou &quot;jij&quot; of &quot;de klant&quot;.
                Deze voorwaarden gelden voor alle bestellingen die je doet via onze website of app.
              </p>
            </section>

            {/* 2. Onze dienst in het kort */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">2. Onze dienst in het kort</h2>
              <p>Met Knuffelboek kun je:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Een foto uploaden van de knuffel van je kind</li>
                <li>Informatie invullen zoals naam, leeftijd, thema en familieleden</li>
                <li>Een persoonlijk kinderboek laten genereren met verhaal en illustraties</li>
                <li>Het boek laten drukken en bij je thuis laten bezorgen</li>
              </ul>
              <p className="mt-4">
                Elk boek wordt speciaal voor jou gemaakt. Er is geen standaardvoorraad.
                Druk en verzending worden verzorgd door onze printpartner (Lulu).
              </p>
            </section>

            {/* 3. Toepasselijkheid */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">3. Toepasselijkheid</h2>
              <p>
                Deze voorwaarden gelden voor alle aanbiedingen en overeenkomsten tussen jou en Knuffelboek.
                Door een bestelling te plaatsen ga je akkoord met deze Algemene voorwaarden.
              </p>
            </section>

            {/* 4. Bestellen en totstandkoming */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">4. Bestellen en totstandkoming</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Je stelt je boek samen via de site of app.</li>
                <li>Je ziet voor het afrekenen een duidelijk overzicht van de totaalprijs.</li>
                <li>De overeenkomst ontstaat zodra wij je bestelling per e-mail bevestigen.</li>
              </ul>
              <p className="mt-4">Knuffelboek kan een bestelling weigeren bij:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Onvolledige of mislukte betaling</li>
                <li>Ongepaste of onrechtmatige inhoud (foto of tekst)</li>
                <li>Misbruik of technische fout</li>
              </ul>
              <p className="mt-4">Bij weigering ontvang je je betaling terug.</p>
            </section>

            {/* 5. Prijzen en betaling */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">5. Prijzen en betaling</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Alle prijzen zijn inclusief btw.</li>
                <li>Verzendkosten worden vooraf duidelijk getoond.</li>
                <li>Betaling gebeurt via de betaalmethoden op de site.</li>
                <li>We starten pas met productie na volledige betaling.</li>
              </ul>
            </section>

            {/* 6. Levering */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">6. Levering</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Je boek wordt on demand gedrukt en verzonden naar Nederland of Belgie.</li>
                <li>Levertijden zijn een schatting en geen garantie.</li>
                <li>Meestal is het boek binnen 5 tot 10 werkdagen in huis.</li>
                <li>Als levering langer dan 30 dagen duurt mag je annuleren en krijg je je geld terug.</li>
              </ul>
              <p className="mt-4">
                Het risico van beschadiging of verlies gaat over op jou zodra het pakket is bezorgd.
              </p>
            </section>

            {/* 7. Geen herroepingsrecht (maatwerk) */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">7. Geen herroepingsrecht (maatwerk)</h2>
              <p>
                Gepersonaliseerde producten vallen volgens de wet buiten de 14 dagen bedenktijd.
              </p>
              <p className="mt-4 font-semibold">
                Je kunt jouw Knuffelboek dus niet zonder reden retourneren of ruilen.
              </p>
              <p className="mt-4">Wel kun je annuleren of restitutie krijgen als:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Wij niet binnen 30 dagen kunnen leveren</li>
                <li>Er sprake is van een duidelijke fout of misdruk</li>
                <li>Het product beschadigd is aangekomen</li>
              </ul>
              <p className="mt-4">
                Bij een gegronde klacht zorgen wij voor een nieuw exemplaar of andere passende oplossing.
              </p>
            </section>

            {/* 8. Kwaliteit en klachten */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">8. Kwaliteit en klachten</h2>
              <p>Houd rekening met:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Kleine kleurverschillen tussen scherm en druk</li>
                <li>Kleine afwijkingen in snijmarge of positie</li>
                <li>Dit zijn geen gebreken</li>
              </ul>
              <p className="mt-4">Meld binnen 14 dagen als:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Je boek beschadigd is geleverd</li>
                <li>Er iets duidelijk mis is met de personalisatie of druk</li>
              </ul>
              <p className="mt-4">
                Mail naar <a href="mailto:info@knuffelboek.nl" className="text-abrikoos hover:underline">info@knuffelboek.nl</a> met foto&apos;s van het probleem.
                Bij een terechte klacht lossen we het kosteloos op.
              </p>
            </section>

            {/* 9. Gebruik van uploads en AI */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">9. Gebruik van uploads en AI</h2>
              <p>
                Je uploadt zelf de foto van de knuffel en geeft gegevens door zoals naam en leeftijd.
              </p>
              <p className="mt-4">Je bevestigt dat:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Je de foto zelf hebt gemaakt of toestemming hebt</li>
                <li>De foto geen inbreuk maakt op auteursrechten of privacy van anderen</li>
                <li>De foto geen ongepaste inhoud bevat</li>
              </ul>
              <p className="mt-4">
                Je geeft Knuffelboek een beperkte licentie om jouw foto en gegevens te:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Gebruiken, analyseren en bewerken</li>
                <li>In te zetten voor AI-verhaal en illustraties</li>
                <li>Gebruiken voor druk en levering</li>
                <li>Tijdelijk op te slaan voor herdruk of klachtbehandeling</li>
              </ul>
              <p className="mt-4">
                Wij hergebruiken jouw knuffel, verhaal of foto niet voor andere klanten.
              </p>
              <h3 className="text-lg font-semibold text-nachtblauw mt-6 mb-2">AI</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verhaal en illustraties worden automatisch gegenereerd.</li>
                <li>Kleine fouten of afwijkingen zijn mogelijk.</li>
                <li>De inhoud wordt geleverd zoals die is.</li>
              </ul>
              <p className="mt-4">
                Onverwachte of ongepaste elementen? Neem direct contact op.
              </p>
            </section>

            {/* 10. Intellectueel eigendom */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">10. Intellectueel eigendom</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Jij blijft eigenaar van je geuploade foto&apos;s.</li>
                <li>Wij krijgen alleen de rechten die nodig zijn om jouw boek te maken.</li>
              </ul>
              <p className="mt-4">Knuffelboek blijft eigenaar van:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>De software, prompts, templates en opmaak</li>
                <li>De illustratiestijl</li>
                <li>De merknaam en het logo</li>
              </ul>
              <p className="mt-4">
                Je mag het boek gebruiken voor persoonlijk, niet-commercieel gebruik.
                Je mag het boek of de inhoud niet commercieel verspreiden of verkopen.
              </p>
            </section>

            {/* 11. Aansprakelijkheid */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">11. Aansprakelijkheid</h2>
              <p>Wij zijn niet aansprakelijk voor:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Kleine afwijkingen in druk of AI-interpretatie</li>
                <li>Schade door onjuiste input van de klant</li>
              </ul>
              <p className="mt-4">
                Onze totale aansprakelijkheid is beperkt tot het bedrag dat je voor het betreffende boek hebt betaald.
                Niets in deze voorwaarden beperkt jouw wettelijke consumentenrechten.
              </p>
            </section>

            {/* 12. Privacy */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">12. Privacy</h2>
              <p>
                Bij het maken van je boek verwerken wij persoonsgegevens.
                Je vindt alle details in onze{' '}
                <Link href="/privacy" className="text-abrikoos hover:underline">Privacyverklaring</Link>.
              </p>
            </section>

            {/* 13. Toepasselijk recht */}
            <section>
              <h2 className="text-xl font-bold text-nachtblauw mt-8 mb-4">13. Toepasselijk recht</h2>
              <p>
                Op deze overeenkomst is Nederlands recht van toepassing.
                Belgische klanten behouden hun dwingende consumentenrechten.
                Geschillen proberen we eerst samen op te lossen.
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
