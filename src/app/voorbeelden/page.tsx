import { Metadata } from 'next';
import Image from 'next/image';
import { Button, SectionTitle } from '@/components';
import { WEBAPP_URL } from '@/lib/constants';

// Logo URL
const LOGO_URL = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures/logo/Ontwerp%20zonder%20titel%20%2847%29.png';

export const metadata: Metadata = {
  title: 'Voorbeelden - Knuffelboek',
  description: 'Bekijk voorbeelden van gepersonaliseerde kinderboeken gemaakt met Knuffelboek.',
};

const exampleBooks = [
  {
    title: 'Lotte en de Dappere Draakbeer',
    childName: 'Lotte',
    age: '5 jaar',
    theme: 'Dapper Zijn',
    toyName: 'Draakbeer',
    color: 'bg-abrikoos/30',
    description: 'Een verhaal over kleine Lotte die samen met haar dappere Draakbeer leert dat moed niet betekent dat je nergens bang voor bent.',
  },
  {
    title: 'Tim en het Slaapavontuur',
    childName: 'Tim',
    age: '3 jaar',
    theme: 'Bedtijd',
    toyName: 'Olifant',
    color: 'bg-pastelblauw/30',
    description: 'Een dromerig avontuur door de wolken, perfect voor het slapengaan. Olifant en Tim vliegen naar de sterren.',
  },
  {
    title: "Emma's Magische Verjaardag",
    childName: 'Emma',
    age: '4 jaar',
    theme: 'Verjaardag',
    toyName: 'Konijn',
    color: 'bg-saliegroen/30',
    description: 'Konijn organiseert stiekem het mooiste verjaardagsfeest ooit voor Emma. Met ballonnen, taart en heel veel vrienden!',
  },
  {
    title: 'Lucas en de Vriendschap',
    childName: 'Lucas',
    age: '6 jaar',
    theme: 'Vriendschap',
    toyName: 'Nijlpaard',
    color: 'bg-zand',
    description: 'Lucas leert van Nijlpaard wat echte vriendschap betekent: er altijd voor elkaar zijn, ook als het even moeilijk is.',
  },
  {
    title: 'Sophie in Wonderland',
    childName: 'Sophie',
    age: '7 jaar',
    theme: 'Fantasie Wereld',
    toyName: 'Eenhoorn',
    color: 'bg-pastelblauw/20',
    description: 'Door een geheime deur belanden Sophie en Eenhoorn in een wereld vol magie. Samen ontdekken ze kastelen en maken nieuwe vrienden.',
  },
  {
    title: 'Max in het Bos',
    childName: 'Max',
    age: '4 jaar',
    theme: 'Natuur Ontdekken',
    toyName: 'Vos',
    color: 'bg-saliegroen/20',
    description: 'Vos neemt Max mee op een spannende tocht door het bos. Ze ontmoeten eekhoorns, kijken naar de sterren en leren over de natuur.',
  },
];

const demoPages = [
  { page: 1, text: 'Het was bijna bedtijd, maar Beer had nog zo veel zin in een avontuur.', bg: 'bg-pastelblauw/30' },
  { page: 2, text: '"Kom mee," fluisterde Beer. "Ik weet iets leuks!"', bg: 'bg-pastelblauw/20' },
  { page: 3, text: 'Samen vlogen ze op een wolk door de sterrenhemel.', bg: 'bg-abrikoos/30' },
  { page: 4, text: '"Kijk, een vallende ster!" riep Emma.', bg: 'bg-saliegroen/30' },
  { page: 5, text: 'Beer glimlachte. "Doe een wens..."', bg: 'bg-pastelblauw/30' },
  { page: 6, text: 'En zo vlogen ze terug naar huis, klaar om te dromen.', bg: 'bg-zand' },
];

export default function VoorbeeldenPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-saliegroen/40 via-saliegroen/20 to-wolwit py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-nachtblauw mb-6">
            Voorbeelden
          </h1>
          <p className="text-xl text-nachtblauw/70 max-w-2xl mx-auto">
            Bekijk wat andere ouders hebben gemaakt en laat je inspireren voor jouw eigen Knuffelboek.
          </p>
        </div>
      </section>

      {/* Example Books Grid */}
      <section className="section bg-wolwit">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionTitle subtitle="Elk boek is 100% uniek">
            Gemaakte boeken
          </SectionTitle>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exampleBooks.map((book, index) => (
              <div key={index} className="card">
                <div className={`aspect-[3/4] ${book.color} rounded-xl mb-6 flex items-center justify-center`}>
                  <div className="text-center p-6">
                    <span className="text-6xl block mb-4">📖</span>
                    <p className="font-bold text-nachtblauw text-lg">{book.title}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-nachtblauw">{book.childName}, {book.age}</span>
                    <span className="text-sm bg-pastelblauw/30 px-3 py-1 rounded-full text-nachtblauw/70">{book.theme}</span>
                  </div>
                  <p className="text-sm text-nachtblauw/70">Knuffel: {book.toyName}</p>
                  <p className="text-nachtblauw/70">{book.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Book Viewer */}
      <section className="section bg-zand">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionTitle subtitle="Blader door een voorbeeld">
            Hoe een boek eruitziet
          </SectionTitle>
          <div className="max-w-4xl mx-auto">
            <div className="bg-wolwit rounded-3xl shadow-xl p-6 lg:p-10">
              <div className="mb-6 text-center">
                <span className="text-sm text-nachtblauw/70">Demo boek: &quot;Emma en het Droomavontuur&quot;</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {demoPages.map((page) => (
                  <div
                    key={page.page}
                    className={`${page.bg} aspect-square rounded-xl p-6 flex flex-col justify-between`}
                  >
                    <span className="text-xs text-nachtblauw/70">Pagina {page.page}</span>
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-4xl">🧸</span>
                    </div>
                    <p className="text-sm text-nachtblauw text-center italic">{page.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-nachtblauw/70 mb-4">
                  Dit is slechts een kleine preview. Elk boek bevat 16-24 volledig geïllustreerde pagina&apos;s met jouw knuffel in elke scene.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video/Process */}
      <section className="section bg-wolwit">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionTitle subtitle="Van foto naar boek in minuten">
            Zie hoe het werkt
          </SectionTitle>
          <div className="max-w-3xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-abrikoos/10 to-pastelblauw/10 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl block mb-4">🎬</span>
                <p className="text-nachtblauw/70">Video demonstratie komt hier</p>
                <p className="text-sm text-nachtblauw/70 mt-2">(Upload je eigen video van het maakproces)</p>
              </div>
            </div>
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
            Klaar om jouw eigen boek te maken?
          </h2>
          <p className="text-xl text-wolwit/80 mb-8 max-w-xl mx-auto">
            In een paar minuten heb je een uniek, gepersonaliseerd boek.
          </p>
          <Button href={WEBAPP_URL} size="lg">
            Start met jouw knuffel
          </Button>
        </div>
      </section>
    </>
  );
}
