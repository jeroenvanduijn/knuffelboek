'use client';

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

interface FlipBookSectionProps {
  pdfUrl: string;
  title?: string;
  subtitle?: string;
}

export default function FlipBookSection({
  pdfUrl,
  title = "Blader door een echt boek",
  subtitle = "Bekijk een compleet voorbeeldboek"
}: FlipBookSectionProps) {
  return (
    <section className="section bg-zand">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionTitle subtitle={subtitle}>
          {title}
        </SectionTitle>
        <div className="max-w-4xl mx-auto">
          <div className="bg-wolwit rounded-3xl shadow-xl p-6 lg:p-10">
            <FlipBook pdfUrl={pdfUrl} width={400} height={560} />
          </div>
        </div>
      </div>
    </section>
  );
}
