import { Metadata } from 'next';
import Image from 'next/image';
import { Button, SectionTitle, FlipBookGallery } from '@/components';
import { WEBAPP_URL } from '@/lib/constants';

// Logo URL
const LOGO_URL = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures/logo/Ontwerp%20zonder%20titel%20%2847%29.png';

// Image base URL
const IMAGE_BASE = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures';

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
    image: `${IMAGE_BASE}/voorbeeldboeken/hero-background-121.jpg`,
  },
  {
    title: 'Tim en het Slaapavontuur',
    childName: 'Tim',
    age: '3 jaar',
    theme: 'Bedtijd',
    toyName: 'Olifant',
    image: `${IMAGE_BASE}/voorbeeldboeken/hero-background-120.jpg`,
  },
  {
    title: "Emma's Magische Verjaardag",
    childName: 'Emma',
    age: '4 jaar',
    theme: 'Verjaardag',
    toyName: 'Konijn',
    image: `${IMAGE_BASE}/voorbeeldboeken/hero-background-119.jpg`,
  },
  {
    title: 'Lucas en de Vriendschap',
    childName: 'Lucas',
    age: '6 jaar',
    theme: 'Vriendschap',
    toyName: 'Nijlpaard',
    image: `${IMAGE_BASE}/voorbeeldboeken/hero-background-118.jpg`,
  },
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exampleBooks.map((book, index) => (
              <div key={index} className="card group">
                <div className="aspect-[3/4] rounded-xl mb-4 overflow-hidden relative">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-nachtblauw">{book.childName}, {book.age}</span>
                    <span className="text-xs bg-pastelblauw/30 px-2 py-1 rounded-full text-nachtblauw/70">{book.theme}</span>
                  </div>
                  <p className="text-sm text-nachtblauw/70">Knuffel: {book.toyName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FlipBook Viewer */}
      <FlipBookGallery />

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
          <h2 className="text-3xl lg:text-4xl font-bold text-wolwit mb-4">
            Klaar om jouw eigen boek te maken?
          </h2>
          <p className="text-xl text-wolwit/80 mb-8 max-w-xl mx-auto">
            In een paar minuten heb je een uniek, gepersonaliseerd boek.
          </p>
          <a
            href={WEBAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-abrikoos text-nachtblauw font-semibold px-8 py-4 rounded-xl hover:bg-abrikoos-dark transition-colors"
          >
            Start met jouw knuffel
          </a>
        </div>
      </section>
    </>
  );
}
