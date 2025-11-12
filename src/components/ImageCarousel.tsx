import { useState, useEffect, useCallback } from 'react';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

const ImageCarousel = ({ images, alt = 'Project screenshot' }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const minSwipeDistance = 50;

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, [images.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  useEffect(() => {
    if (!showModal) return;
    const handleModalKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleModalKeydown);
    return () => window.removeEventListener('keydown', handleModalKeydown);
  }, [showModal]);

  if (images.length === 0) return null;

  const handleOpenModal = () => {
    if (images.length === 0) return;
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpenModal();
    }
  };

  const renderDots = (isModal: boolean) => (
    <div
      className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 ${
        isModal ? 'pointer-events-auto' : ''
      }`}
    >
      {images.map((_, index) => (
        <button
          key={index}
          onClick={(event) => {
            event.stopPropagation();
            setCurrentIndex(index);
          }}
          className={`h-2 rounded-full transition-all ${
            index === currentIndex
              ? 'w-8 bg-[color:var(--link)]'
              : 'w-2 bg-[color:var(--muted-foreground)]/50 hover:bg-[color:var(--muted-foreground)]/75'
          }`}
          aria-label={`Go to image ${index + 1}`}
        />
      ))}
    </div>
  );

  const renderNavigationButtons = (isModal: boolean) => (
    <>
      <button
        onClick={(event) => {
          event.stopPropagation();
          goToPrevious();
        }}
        className={`absolute ${isModal ? 'left-4' : 'left-2'} top-1/2 -translate-y-1/2 bg-[color:var(--glass-bg)]/85 backdrop-blur-sm text-[color:var(--link)] p-2 rounded-full hover:bg-[color:var(--glass-bg)] focus:outline-none focus:ring-2 focus:ring-[color:var(--link)] transition-colors`}
        aria-label="Previous image"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={(event) => {
          event.stopPropagation();
          goToNext();
        }}
        className={`absolute ${isModal ? 'right-4' : 'right-2'} top-1/2 -translate-y-1/2 bg-[color:var(--glass-bg)]/85 backdrop-blur-sm text-[color:var(--link)] p-2 rounded-full hover:bg-[color:var(--glass-bg)] focus:outline-none focus:ring-2 focus:ring-[color:var(--link)] transition-colors`}
        aria-label="Next image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );

  const renderSlides = (isModal: boolean) => (
    <div className="overflow-hidden h-full">
      <div
        className="flex transition-transform duration-300 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full flex-shrink-0 flex items-center justify-center h-full"
          >
            <img
              src={image}
              alt={`${alt} ${index + 1}`}
              className={`${
                isModal ? 'max-h-[80vh]' : 'max-h-full'
              } w-full h-auto object-contain`}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderCarousel = (variant: 'card' | 'modal') => {
    const isModal = variant === 'modal';
    const containerClasses = isModal
      ? 'relative w-full rounded-lg overflow-hidden bg-[color:var(--glass-bg)]/40'
      : 'relative w-full rounded-lg overflow-hidden bg-[color:var(--muted)]/20 aspect-[4/3] max-h-[260px] cursor-zoom-in';

    return (
      <div
        className={containerClasses}
        onClick={!isModal ? handleOpenModal : undefined}
        role={!isModal ? 'button' : undefined}
        tabIndex={!isModal ? 0 : undefined}
        onKeyDown={!isModal ? handleCardKeyDown : undefined}
      >
        <div className="relative w-full h-full">
          {renderSlides(isModal)}
          {images.length > 1 && renderNavigationButtons(isModal)}
          {images.length > 1 && renderDots(isModal)}
        </div>
        {!isModal && (
          <div className="absolute inset-0 pointer-events-none bg-transparent" aria-hidden="true" />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="mb-4">{renderCarousel('card')}</div>
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={handleCloseModal}
          role="dialog"
          aria-label="Project images"
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute -top-10 right-0 md:-top-12 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded-full"
              aria-label="Close image viewer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {renderCarousel('modal')}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;


