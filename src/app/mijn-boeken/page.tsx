'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, SectionTitle } from '@/components';
import { useBooks, useAuth } from '@/hooks/useBooks';
import * as api from '@/lib/api';
import type { Book } from '@/lib/api';

// Logo URL
const LOGO_URL = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures/logo/Ontwerp%20zonder%20titel%20%2847%29.png';

// Status badge component
function StatusBadge({ status }: { status: Book['status'] }) {
  const statusConfig = {
    generating: { label: 'Wordt gemaakt...', color: 'bg-pastelblauw/30 text-nachtblauw' },
    ready: { label: 'Klaar', color: 'bg-saliegroen/30 text-nachtblauw' },
    ordered: { label: 'Besteld', color: 'bg-abrikoos/30 text-nachtblauw' },
    shipped: { label: 'Verzonden', color: 'bg-pastelblauw text-nachtblauw' },
    delivered: { label: 'Bezorgd', color: 'bg-saliegroen text-wolwit' },
  };

  const config = statusConfig[status] || statusConfig.ready;

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

// Book card component
function BookCard({ book, onDownloadPdf }: { book: Book; onDownloadPdf: (bookId: string) => void }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownloadPdf(book.id);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-wolwit rounded-2xl border border-nachtblauw/10 overflow-hidden hover:shadow-lg transition-all">
      {/* Cover */}
      <div className="aspect-[3/4] bg-zand relative">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <span className="text-6xl mb-4">📖</span>
            <p className="text-center text-nachtblauw font-semibold text-lg">{book.title}</p>
          </div>
        )}
        {/* Status badge overlay */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={book.status} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-nachtblauw line-clamp-1">{book.title}</h3>
          <p className="text-sm text-nachtblauw/60">
            {book.childName}, {book.childAge} jaar • {book.theme}
          </p>
        </div>

        <p className="text-xs text-nachtblauw/50">
          Gemaakt op {new Date(book.createdAt).toLocaleDateString('nl-NL')}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href={`/mijn-boeken/${book.id}`}
            className="flex-1 text-center px-3 py-2 bg-zand text-nachtblauw rounded-lg text-sm font-medium hover:bg-zand/80 transition-colors"
          >
            Bekijk
          </Link>

          {book.status !== 'generating' && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 text-center px-3 py-2 bg-pastelblauw/30 text-nachtblauw rounded-lg text-sm font-medium hover:bg-pastelblauw/50 transition-colors disabled:opacity-50"
            >
              {isDownloading ? '...' : 'PDF'}
            </button>
          )}

          {book.status === 'ready' && (
            <Link
              href={`/mijn-boeken/${book.id}/bestellen`}
              className="flex-1 text-center px-3 py-2 bg-abrikoos text-nachtblauw rounded-lg text-sm font-medium hover:bg-abrikoos-dark transition-colors"
            >
              Bestellen
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <Image
          src={LOGO_URL}
          alt="Knuffelboek"
          width={200}
          height={60}
          className="mx-auto h-28 w-auto"
        />
      </div>
      <h2 className="text-2xl font-bold text-nachtblauw mb-3">
        Je hebt nog geen boeken
      </h2>
      <p className="text-nachtblauw/70 mb-8 max-w-md mx-auto">
        Maak je eerste gepersonaliseerde kinderboek met de lievelingsknuffel van je kind.
      </p>
      <Button href="/maak-je-boek" size="lg">
        Maak je eerste boek
      </Button>
    </div>
  );
}

// Loading state
function LoadingState() {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <Image
          src={LOGO_URL}
          alt="Knuffelboek"
          width={150}
          height={45}
          className="mx-auto h-24 w-auto animate-pulse"
        />
      </div>
      <p className="text-nachtblauw/70">Je boeken worden geladen...</p>
    </div>
  );
}

// Login prompt
function LoginPrompt() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zand/50 to-wolwit">
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <Image
              src={LOGO_URL}
              alt="Knuffelboek"
              width={200}
              height={60}
              className="mx-auto h-28 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-nachtblauw mb-4">
            Mijn Boeken
          </h1>
          <p className="text-nachtblauw/70 mb-8">
            Log in om je gemaakte boeken te bekijken, PDF&apos;s te downloaden en bestellingen te volgen.
          </p>
          <div className="space-y-4">
            <Button href="/inloggen" size="lg" className="w-full">
              Inloggen
            </Button>
            <p className="text-sm text-nachtblauw/60">
              Nog geen account?{' '}
              <Link href="/registreren" className="text-abrikoos hover:underline">
                Registreer gratis
              </Link>
            </p>
          </div>

          <div className="mt-12 p-6 bg-wolwit rounded-2xl border border-nachtblauw/10">
            <h3 className="font-semibold text-nachtblauw mb-3">Of maak direct een boek</h3>
            <p className="text-sm text-nachtblauw/60 mb-4">
              Je kunt ook zonder account een boek maken. Je ontvangt dan een link per e-mail.
            </p>
            <Button href="/maak-je-boek" variant="outline">
              Maak een boek
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component
export default function MijnBoekenPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { books, isLoading: booksLoading, error, refetch } = useBooks();
  const [filter, setFilter] = useState<'all' | 'ready' | 'ordered'>('all');

  // Download PDF handler
  const handleDownloadPdf = async (bookId: string) => {
    try {
      const blob = await api.downloadBookPdf(bookId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `knuffelboek-${bookId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Kon PDF niet downloaden. Probeer het later opnieuw.');
    }
  };

  // Filter books
  const filteredBooks = books.filter((book) => {
    if (filter === 'all') return true;
    if (filter === 'ready') return book.status === 'ready';
    if (filter === 'ordered') return ['ordered', 'shipped', 'delivered'].includes(book.status);
    return true;
  });

  // Auth loading
  if (authLoading) {
    return <LoadingState />;
  }

  // Not logged in
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zand/50 to-wolwit">
      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-nachtblauw">
              Mijn Boeken
            </h1>
            <p className="text-nachtblauw/70 mt-1">
              {books.length} {books.length === 1 ? 'boek' : 'boeken'} in je bibliotheek
            </p>
          </div>
          <Button href="/maak-je-boek">
            + Nieuw boek maken
          </Button>
        </div>

        {/* Filters */}
        {books.length > 0 && (
          <div className="flex gap-2 mb-8">
            {[
              { key: 'all', label: 'Alle' },
              { key: 'ready', label: 'Klaar' },
              { key: 'ordered', label: 'Besteld' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-abrikoos text-nachtblauw'
                    : 'bg-wolwit text-nachtblauw/70 hover:bg-zand'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={refetch}
              className="text-sm text-red-500 hover:underline mt-2"
            >
              Probeer opnieuw
            </button>
          </div>
        )}

        {/* Content */}
        {booksLoading ? (
          <LoadingState />
        ) : books.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onDownloadPdf={handleDownloadPdf}
              />
            ))}
          </div>
        )}

        {/* No results for filter */}
        {books.length > 0 && filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-nachtblauw/70">
              Geen boeken gevonden met deze filter.
            </p>
            <button
              onClick={() => setFilter('all')}
              className="text-abrikoos hover:underline mt-2"
            >
              Toon alle boeken
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
