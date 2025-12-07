'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FlipBookProps {
  pdfUrl: string;
  width?: number;
  height?: number;
}

// Page component that forwards ref properly
const PageCover = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  function PageCover({ children }, ref) {
    return (
      <div ref={ref} className="bg-nachtblauw flex items-center justify-center">
        {children}
      </div>
    );
  }
);

const PageContent = forwardRef<HTMLDivElement, { children: React.ReactNode; pageNumber: number }>(
  function PageContent({ children, pageNumber }, ref) {
    return (
      <div ref={ref} className="bg-white flex items-center justify-center" data-density="soft">
        {children}
      </div>
    );
  }
);

export default function FlipBook({ pdfUrl, width = 400, height = 500 }: FlipBookProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(width);
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerW = containerRef.current.offsetWidth;
        // On mobile, use single page view with smaller width
        if (window.innerWidth < 768) {
          setContainerWidth(Math.min(containerW - 40, 350));
        } else {
          setContainerWidth(Math.min(containerW / 2 - 20, width));
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [width]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  const goToPrevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const goToNextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const pageHeight = containerWidth; // Square format (21x21 cm)

  return (
    <div ref={containerRef} className="w-full">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-abrikoos border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-nachtblauw/70">Boek wordt geladen...</p>
            </div>
          </div>
        }
        error={
          <div className="flex items-center justify-center py-20">
            <p className="text-red-500">Kon het boek niet laden. Probeer het later opnieuw.</p>
          </div>
        }
      >
        {!isLoading && numPages > 0 && (
          <div className="flex flex-col items-center">
            {/* Book */}
            <div className="shadow-2xl rounded-lg overflow-hidden">
              {/* @ts-ignore - HTMLFlipBook types are incomplete */}
              <HTMLFlipBook
                ref={bookRef}
                width={containerWidth}
                height={pageHeight}
                size="stretch"
                minWidth={280}
                maxWidth={600}
                minHeight={280}
                maxHeight={600}
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
                autoSize={true}
                maxShadowOpacity={0.5}
                showPageCorners={true}
                disableFlipByClick={false}
                swipeDistance={30}
                clickEventForward={true}
                useMouseEvents={true}
              >
                {Array.from({ length: numPages }, (_, index) => (
                  <PageContent key={index} pageNumber={index + 1}>
                    <Page
                      pageNumber={index + 1}
                      width={containerWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="pdf-page"
                    />
                  </PageContent>
                ))}
              </HTMLFlipBook>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-zand text-nachtblauw rounded-lg hover:bg-abrikoos disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Vorige
              </button>
              <span className="text-nachtblauw/70 text-sm">
                Pagina {currentPage + 1} van {numPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage >= numPages - 1}
                className="px-4 py-2 bg-zand text-nachtblauw rounded-lg hover:bg-abrikoos disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Volgende →
              </button>
            </div>
            <p className="text-nachtblauw/50 text-xs mt-2">
              Klik op de hoek of sleep om te bladeren
            </p>
          </div>
        )}
      </Document>
    </div>
  );
}
