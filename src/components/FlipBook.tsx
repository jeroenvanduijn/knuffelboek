'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FlipBookProps {
  pdfUrl: string;
  /** Voorkeursbreedte van één pagina in px */
  width?: number;
}

interface PageFlipApi {
  pageFlip(): { flipPrev(): void; flipNext(): void };
}

const PageContent = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  function PageContent({ children }, ref) {
    return (
      <div ref={ref} className="flex items-center justify-center bg-white" data-density="soft">
        {children}
      </div>
    );
  }
);

function Laden() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-koraal border-t-transparent" />
        <p className="font-bold text-inkt">Boek wordt geladen...</p>
      </div>
    </div>
  );
}

export default function FlipBook({ pdfUrl, width = 450 }: FlipBookProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(width);
  const bookRef = useRef<PageFlipApi | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Vierkante pagina's, meeschalend met de container
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const containerW = containerRef.current.offsetWidth;
      if (window.innerWidth < 768) {
        setPageSize(Math.max(240, Math.min(containerW - 16, 340)));
      } else {
        setPageSize(Math.min(containerW / 2 - 24, 500));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const onFlip = (e: { data: number }) => {
    setCurrentPage(e.data);
  };

  return (
    <div ref={containerRef} className="w-full">
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages: n }) => setNumPages(n)}
        loading={<Laden />}
        error={
          <div className="flex items-center justify-center py-20">
            <p className="font-bold text-koraal-donker">Kon het boek niet laden. Probeer het later opnieuw.</p>
          </div>
        }
      >
        {numPages > 0 && (
          <div className="flex flex-col items-center">
            <div className="overflow-hidden rounded-lg shadow-2xl">
              <HTMLFlipBook
                ref={bookRef}
                width={pageSize}
                height={pageSize}
                size="fixed"
                minWidth={240}
                maxWidth={550}
                minHeight={240}
                maxHeight={550}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={onFlip}
                className="book-shadow"
                style={{}}
                startPage={0}
                drawShadow={true}
                flippingTime={600}
                usePortrait={true}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={0.5}
                showPageCorners={true}
                disableFlipByClick={false}
                swipeDistance={30}
                clickEventForward={true}
                useMouseEvents={true}
              >
                {Array.from({ length: numPages }, (_, index) => (
                  <PageContent key={index}>
                    <Page
                      pageNumber={index + 1}
                      height={pageSize}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="pdf-page"
                    />
                  </PageContent>
                ))}
              </HTMLFlipBook>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => bookRef.current?.pageFlip().flipPrev()}
                disabled={currentPage === 0}
                className="rounded-[14px] border-[3px] border-inkt bg-creme px-4 py-2 font-extrabold text-inkt disabled:cursor-not-allowed disabled:opacity-40"
              >
                Vorige
              </button>
              <span className="text-sm font-bold text-inkt">
                {currentPage + 1} van {numPages}
              </span>
              <button
                type="button"
                onClick={() => bookRef.current?.pageFlip().flipNext()}
                disabled={currentPage >= numPages - 1}
                className="rounded-[14px] border-[3px] border-inkt bg-creme px-4 py-2 font-extrabold text-inkt disabled:cursor-not-allowed disabled:opacity-40"
              >
                Volgende
              </button>
            </div>
            <p className="mt-2 text-xs font-bold text-inkt/70">Tik op een hoek of veeg om te bladeren</p>
          </div>
        )}
      </Document>
    </div>
  );
}
