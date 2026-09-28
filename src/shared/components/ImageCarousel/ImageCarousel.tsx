import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useImageZoom } from "@/shared/hooks/useImageZoom";
import "./ImageCarousel.css";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  discountPercentage?: number;
}

export function ImageCarousel({
  images,
  alt,
  discountPercentage,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset active index during render when images array content changes
  const imagesJoin = images.join(",");
  const [prevImagesJoin, setPrevImagesJoin] = useState(imagesJoin);
  if (imagesJoin !== prevImagesJoin) {
    setPrevImagesJoin(imagesJoin);
    setActiveIndex(0);
  }

  const {
    containerRef,
    transformStyle,
    isZoomed,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  } = useImageZoom({ scale: 2.5 });

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext]);

  const activeImage = images[activeIndex] ?? "";
  const showNav = images.length > 1;

  return (
    <div className="carousel-root">
      {/* ── Main viewport ── */}
      <div className="carousel-viewport" aria-label="Product image viewer">
        {/* Image wrapper — zoom is scoped to this element only */}
        <div
          className={`carousel-img-wrapper ${isZoomed ? "is-zoomed" : ""}`}
          ref={containerRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
        >
          <img
            src={activeImage}
            alt={`${alt} – image ${activeIndex + 1}`}
            className="carousel-main-img"
            style={transformStyle}
            draggable={false}
          />
        </div>

        {/* Discount badge — outside wrapper, unaffected by zoom */}
        {discountPercentage && discountPercentage > 10 && (
          <span className="carousel-discount-tag">
            Save {Math.round(discountPercentage)}%
          </span>
        )}

        {/* Zoom hint — shows when NOT hovering the image */}
        <div className={`carousel-zoom-hint ${isZoomed ? "hidden" : ""}`}>
          <ZoomIn size={14} />
          <span>Hover image to zoom</span>
        </div>

        {/* Prev / Next arrows — outside wrapper, always clickable */}
        {showNav && (
          <>
            <button
              className="carousel-arrow carousel-arrow--prev"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="carousel-arrow carousel-arrow--next"
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Counter badge top-right */}
        {showNav && (
          <span className="carousel-counter">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* ── Dot indicators ── */}
      {showNav && (
        <div className="carousel-dots" role="tablist" aria-label="Image slides">
          {images.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to image ${i + 1}`}
              className={`carousel-dot ${i === activeIndex ? "active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}

      {/* ── Thumbnail strip ── */}
      {showNav && (
        <div className="carousel-thumbnails">
          {images.map((imgUrl, i) => (
            <button
              key={i}
              className={`carousel-thumb-btn ${i === activeIndex ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === activeIndex}
            >
              <img
                src={imgUrl}
                alt={`${alt} thumbnail ${i + 1}`}
                className="carousel-thumb-img"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
