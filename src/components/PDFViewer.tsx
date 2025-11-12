import { useState, useRef, useEffect } from 'react';

interface PDFViewerProps {
  pdfs: { url: string; label: string }[];
  alt?: string;
}

const PDFViewer = ({ pdfs, alt = 'PDF document' }: PDFViewerProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (pdfs.length === 0) return null;

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  useEffect(() => {
    if (expandedIndex !== null && containerRefs.current[expandedIndex]) {
      containerRefs.current[expandedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [expandedIndex]);

  return (
    <div className="mb-4 space-y-2">
      {pdfs.map((pdf, index) => (
        <div key={index} ref={(el) => (containerRefs.current[index] = el)}>
          <button
            className="w-full rounded-lg bg-[color:var(--muted)]/20 hover:bg-[color:var(--muted)]/30 transition-colors p-3 flex items-center gap-3 text-left"
            onClick={() => handleToggle(index)}
            aria-label={`${expandedIndex === index ? 'Collapse' : 'Expand'} ${alt}: ${pdf.label}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[color:var(--link)] flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[color:var(--link)] font-medium flex-1">{pdf.label}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-[color:var(--muted-foreground)] transition-transform ${
                expandedIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="sr-only">{alt}</span>
          </button>

          {expandedIndex === index && (
            <div className="mt-2 rounded-lg overflow-hidden bg-[color:var(--glass-bg)] border border-[color:var(--glass-border)] shadow-lg">
              <div className="p-4 bg-[color:var(--glass-bg)]/80 backdrop-blur-sm flex items-center justify-between border-b border-[color:var(--glass-border)]">
                <h4 className="text-[color:var(--link)] font-medium">{pdf.label}</h4>
                <button
                  onClick={() => setExpandedIndex(null)}
                  className="text-[color:var(--muted-foreground)] hover:text-[color:var(--link)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--link)] rounded p-1"
                  aria-label="Close PDF viewer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="w-full h-[600px] overflow-auto bg-[color:var(--muted)]/10">
                <iframe
                  src={pdf.url}
                  className="w-full h-full border-0"
                  title={`${alt}: ${pdf.label}`}
                  aria-label={`${alt}: ${pdf.label}`}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PDFViewer;

