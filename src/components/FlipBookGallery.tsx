'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SectionTitle from './SectionTitle';

// Dynamic import to avoid SSR issues with PDF.js
const FlipBook = dynamic(() => import('./FlipBook'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-abrikoos border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-nachtblauw/70">Boek wordt geladen...</p>
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

const sampleBooks: SampleBook[] = [
  {
    id: 'zoe',
    name: 'Zoe',
    age: '6 jaar',
    title: 'Het avontuur van Zoe en haar knuffel',
    pdfUrl: 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/voorbeeld%20boeken/knuffelboek-zoe%CC%88.pdf',
  },
  {
    id: 'tom',
    name: 'Tom',
    age: '2 jaar',
    title: 'Het avontuur van Tom en zijn knuffel',
    pdfUrl: 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/voorbeeld%20boeken/knuffelboek-tom%20%285%29.pdf',
  },
];

export default function FlipBookGallery() {
  const [selectedBook, setSelectedBook] = useState<SampleBook>(sampleBooks[0]);

  return (
    <section className="section bg-zand">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionTitle subtitle="Bekijk complete voorbeeldboeken">
          Blader door een echt boek
        </SectionTitle>

        {/* Book selector */}
        <div className="flex justify-center gap-3 mb-8">
          {sampleBooks.map((book) => (
            <button
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedBook.id === book.id
                  ? 'bg-abrikoos text-nachtblauw shadow-lg'
                  : 'bg-wolwit text-nachtblauw/70 hover:bg-wolwit/80'
              }`}
            >
              {book.name} ({book.age})
            </button>
          ))}
        </div>

        {/* Book title */}
        <p className="text-center text-nachtblauw/70 mb-6">
          {selectedBook.title}
        </p>

        {/* FlipBook */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-wolwit rounded-3xl shadow-xl p-6 lg:p-10">
            <FlipBook
              key={selectedBook.id}
              pdfUrl={selectedBook.pdfUrl}
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
