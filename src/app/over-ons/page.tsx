import { Metadata } from 'next';
import { Button, SectionTitle } from '@/components';

export const metadata: Metadata = {
  title: 'Over Knuffelboek - Ons verhaal',
  description: 'Leer meer over Knuffelboek en onze missie om magische herinneringen te creëren voor kinderen en hun knuffels.',
};

export default function OverOnsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-peach via-peach/50 to-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-text mb-6">
            Over Knuffelboek
          </h1>
          <p className="text-xl text-text-light max-w-2xl mx-auto">
            Het verhaal achter de magische boeken.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg">
              <h2 className="text-3xl font-bold text-text mb-6">Ons verhaal</h2>
              <div className="space-y-6 text-text-light">
                <p>
                  Het begon allemaal met een simpele vraag: &quot;Waarom kan de knuffel van mijn kind niet de held zijn in een echt boek?&quot;
                </p>
                <p>
                  Als ouders weten we hoe bijzonder de band is tussen een kind en zijn of haar lievelingsknuffel. Die knuffel is er altijd: bij het slapen, op avontuur in de tuin, en als troost na een val. Die knuffel verdient het om de hoofdrol te spelen.
                </p>
                <p>
                  Met Knuffelboek hebben we die droom werkelijkheid gemaakt. Door slimme technologie te combineren met creativiteit, kunnen we nu een uniek, gepersonaliseerd kinderboek maken met de eigen knuffel van je kind in elke illustratie.
                </p>
                <p>
                  Elk boek is anders. Elk verhaal is speciaal. En elke knuffel wordt de held die hij of zij verdient te zijn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section bg-sky/30">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionTitle subtitle="Waar we voor staan">
            Onze missie
          </SectionTitle>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-text mb-3">Herinneringen vastleggen</h3>
              <p className="text-text-light">
                We geloven dat de kleine momenten het belangrijkst zijn. Een Knuffelboek legt die magische kindertijd voor altijd vast.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-text mb-3">Lezen stimuleren</h3>
              <p className="text-text-light">
                Kinderen lezen graag als het verhaal over hen gaat. Een gepersonaliseerd boek maakt voorlezen nog leuker.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-text mb-3">Magie toegankelijk</h3>
              <p className="text-text-light">
                Wat vroeger alleen voor de rijken was – een boek op maat – is nu voor iedereen beschikbaar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionTitle subtitle="Hoe we werken">
            Onze waarden
          </SectionTitle>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-lavender rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <h3 className="font-bold text-text mb-2">Privacy voorop</h3>
                <p className="text-text-light">
                  We verzamelen alleen wat nodig is. Geen gezichtsherkenning, geen tracking, geen verkoop van gegevens. Foto&apos;s worden na verwerking verwijderd.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-mint rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🌱</span>
              </div>
              <div>
                <h3 className="font-bold text-text mb-2">Duurzaam waar mogelijk</h3>
                <p className="text-text-light">
                  We printen on-demand (geen verspilling) en werken met drukkerijen die duurzaam papier en inkt gebruiken.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-peach rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">👶</span>
              </div>
              <div>
                <h3 className="font-bold text-text mb-2">Kindvriendelijk altijd</h3>
                <p className="text-text-light">
                  Alle verhalen en illustraties worden gecontroleerd op geschiktheid. Alleen warme, veilige content voor je kleintje.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-sky rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💯</span>
              </div>
              <div>
                <h3 className="font-bold text-text mb-2">Kwaliteit boven kwantiteit</h3>
                <p className="text-text-light">
                  We gebruiken premium materialen en nemen de tijd om elk boek goed te maken. Liever één perfect boek dan tien matige.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section bg-sky/30">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl font-bold text-text mb-8">Onze partners</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            <div className="text-text-light font-medium">Google Cloud</div>
            <div className="text-text-light font-medium">Mollie</div>
            <div className="text-text-light font-medium">Gelato</div>
          </div>
          <p className="text-text-light text-sm mt-6 max-w-xl mx-auto">
            We werken samen met betrouwbare partners voor hosting, betalingen en drukwerk.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-secondary to-secondary-dark text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Maak deel uit van ons verhaal
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
            Creëer je eigen Knuffelboek en schrijf een nieuw hoofdstuk.
          </p>
          <Button href="/maak-je-boek" variant="primary" size="lg" className="!bg-white !text-secondary hover:!bg-white/90">
            Start met jouw knuffel
          </Button>
        </div>
      </section>
    </>
  );
}
