'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// PDF.js werkt alleen in de browser
const FlipBook = dynamic(() => import('./FlipBook'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-koraal border-t-transparent" />
        <p className="font-bold text-inkt">Boek wordt geladen...</p>
      </div>
    </div>
  ),
});

interface SampleBook {
  id: string;
  name: string;
  age: string;
  title: string;
  pdfUrl: string;
}

// Tom eerst: die PDF is kleiner (±6 MB) dan die van Zoe (±13 MB)
const sampleBooks: SampleBook[] = [
  {
    id: 'tom',
    name: 'Tom',
    age: '2 jaar',
    title: 'Het avontuur van Tom en zijn knuffel',
    pdfUrl: 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/voorbeeld%20boeken/knuffelboek-tom%20%285%29.pdf',
  },
  {
    id: 'zoe',
    name: 'Zoë',
    age: '6 jaar',
    title: 'Het avontuur van Zoë en haar knuffel',
    pdfUrl: 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/voorbeeld%20boeken/knuffelboek-zoe%CC%88.pdf',
  },
];

/**
 * Knop "Blader door alle voorbeelden". Het bladerboek (en de zware PDF) laadt pas na een klik,
 * zodat de pagina op de telefoon snel blijft.
 */
export default function FlipBookGallery() {
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<SampleBook>(sampleBooks[0]);

  if (!open) {
    return (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          className="rounded-[20px] bg-inkt px-[30px] py-4 text-lg font-extrabold text-creme transition-transform hover:-translate-y-0.5"
        >
          Blader door alle voorbeelden
        </button>
      </div>
    );
  }

  return (
    <div id="bladerboek" className="rounded-[28px] border-4 border-inkt bg-creme p-4 shadow-[0_18px_40px_rgba(31,42,68,0.2)] sm:p-8">
      <div className="mb-4 flex flex-wrap justify-center gap-3" role="group" aria-label="Kies een voorbeeldboek">
        {sampleBooks.map((book) => {
          const actief = selectedBook.id === book.id;
          return (
            <button
              key={book.id}
              type="button"
              onClick={() => setSelectedBook(book)}
              aria-pressed={actief}
              className={`rounded-[18px] border-[3px] border-inkt px-5 py-3 font-extrabold text-inkt transition-colors ${
                actief ? 'border-b-[5px] border-b-koraal-donker bg-koraal' : 'bg-white hover:bg-geel'
              }`}
            >
              {book.name} ({book.age})
            </button>
          );
        })}
      </div>
      <p className="mb-6 text-center font-bold text-grijs">{selectedBook.title}</p>
      <FlipBook key={selectedBook.id} pdfUrl={selectedBook.pdfUrl} width={500} />
    </div>
  );
}
