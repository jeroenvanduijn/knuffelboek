import { Metadata } from 'next';
import Image from 'next/image';
import { Button, SectionTitle } from '@/components';
import { WEBAPP_URL } from '@/lib/constants';

// Logo URL
const LOGO_URL = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures/logo/Ontwerp%20zonder%20titel%20%2850%29.png';

export const metadata: Metadata = {
  title: 'Over Knuffelboek - Ons verhaal',
  description: 'Leer meer over Knuffelboek en onze missie om magische herinneringen te creëren voor kinderen en hun knuffels.',
};

export default function OverOnsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-abrikoos/40 via-abrikoos/20 to-wolwit py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-nachtblauw mb-6">
            Over Knuffelboek
          </h1>
          <p className="text-xl text-nachtblauw/70 max-w-2xl mx-auto">
            Het verhaal achter de magische boeken.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section bg-wolwit">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg">
              <h2 className="text-3xl font-bold text-nachtblauw mb-6">Ons verhaal</h2>
              <div className="space-y-6 text-nachtblauw/70">
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
      <section className="section bg-zand">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionTitle subtitle="Waar we voor staan">
            Onze missie
          </SectionTitle>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-wolwit rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-nachtblauw mb-3">Herinneringen vastleggen</h3>
              <p className="text-nachtblauw/70">
                We geloven dat de kleine momenten het belangrijkst zijn. Een Knuffelboek legt die magische kindertijd voor altijd vast.
              </p>
            </div>
            <div className="bg-wolwit rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-nachtblauw mb-3">Lezen stimuleren</h3>
              <p className="text-nachtblauw/70">
                Kinderen lezen graag als het verhaal over hen gaat. Een gepersonaliseerd boek maakt voorlezen nog leuker.
              </p>
            </div>
            <div className="bg-wolwit rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-nachtblauw mb-3">Magie toegankelijk</h3>
              <p className="text-nachtblauw/70">
                Wat vroeger alleen voor de rijken was – een boek op maat – is nu voor iedereen beschikbaar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-wolwit">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionTitle subtitle="Hoe we werken">
            Onze waarden
          </SectionTitle>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-pastelblauw/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <h3 className="font-bold text-nachtblauw mb-2">Privacy voorop</h3>
                <p className="text-nachtblauw/70">
                  We verzamelen alleen wat nodig is. Geen gezichtsherkenning, geen tracking, geen verkoop van gegevens. Foto&apos;s worden na verwerking verwijderd.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-saliegroen/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🌱</span>
              </div>
              <div>
                <h3 className="font-bold text-nachtblauw mb-2">Duurzaam waar mogelijk</h3>
                <p className="text-nachtblauw/70">
                  We printen on-demand (geen verspilling) en werken met drukkerijen die duurzaam papier en inkt gebruiken.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-abrikoos/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">👶</span>
              </div>
              <div>
                <h3 className="font-bold text-nachtblauw mb-2">Kindvriendelijk altijd</h3>
                <p className="text-nachtblauw/70">
                  Alle verhalen en illustraties worden gecontroleerd op geschiktheid. Alleen warme, veilige content voor je kleintje.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-pastelblauw/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💯</span>
              </div>
              <div>
                <h3 className="font-bold text-nachtblauw mb-2">Kwaliteit boven kwantiteit</h3>
                <p className="text-nachtblauw/70">
                  We gebruiken premium materialen en nemen de tijd om elk boek goed te maken. Liever één perfect boek dan tien matige.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section bg-zand">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl font-bold text-nachtblauw mb-8">Onze partners</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            <div className="text-nachtblauw/70 font-medium">Google Cloud</div>
            <div className="text-nachtblauw/70 font-medium">Stripe</div>
            <div className="text-nachtblauw/70 font-medium">Gelato</div>
          </div>
          <p className="text-nachtblauw/70 text-sm mt-6 max-w-xl mx-auto">
            We werken samen met betrouwbare partners voor hosting, betalingen en drukwerk.
          </p>
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
              className="mx-auto h-24 w-auto "
            />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Maak deel uit van ons verhaal
          </h2>
          <p className="text-xl text-wolwit/80 mb-8 max-w-xl mx-auto">
            Creëer je eigen Knuffelboek en schrijf een nieuw hoofdstuk.
          </p>
          <Button href={WEBAPP_URL} size="lg">
            Start met jouw knuffel
          </Button>
        </div>
      </section>
    </>
  );
}
