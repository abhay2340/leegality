import { useState, useRef, useCallback, type MouseEvent } from "react";

interface UseImageZoomOptions {
  /** Zoom multiplier. Default: 2.5 */
  scale?: number;
}

interface UseImageZoomReturn {
  isZoomed: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  transformStyle: React.CSSProperties;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
}

/**
 * `useImageZoom` — magnify an image following the cursor position.
 *
 * Attach `containerRef` to the wrapper div, spread the event handlers on the
 * same element, and apply `transformStyle` to the `<img>` element inside.
 *
 * @example
 * const { containerRef, transformStyle, isZoomed, ...handlers } = useImageZoom();
 * return (
 *   <div ref={containerRef} {...handlers} style={{ overflow: "hidden" }}>
 *     <img src={src} style={transformStyle} />
 *   </div>
 * );
 */
export function useImageZoom({
  scale = 2.5,
}: UseImageZoomOptions = {}): UseImageZoomReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({
    transform: "scale(1)",
    transformOrigin: "center center",
    transition: "transform 0.3s ease",
  });

  const onMouseEnter = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsZoomed(false);
    setTransformStyle({
      transform: "scale(1)",
      transformOrigin: "center center",
      transition: "transform 0.3s ease",
    });
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      // Cursor position as a fraction [0, 1] within the container
      const xPct = (e.clientX - rect.left) / rect.width;
      const yPct = (e.clientY - rect.top) / rect.height;

      // Transform origin follows the cursor so the zoom tracks mouse position
      setTransformStyle({
        transform: `scale(${scale})`,
        transformOrigin: `${xPct * 100}% ${yPct * 100}%`,
        transition: "transform-origin 0s, transform 0.1s ease",
      });
    },
    [scale],
  );

  return {
    isZoomed,
    containerRef,
    transformStyle,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  };
}
