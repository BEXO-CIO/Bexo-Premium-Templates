import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import "./Lightbox.css";

const Lightbox = ({ images = [], startIndex = 0, title = "", onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);
  const touchStartX = useRef(null);
  const count = images.length;

  const goTo = useCallback(
    (next) => {
      if (!count) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goTo(index + 1);
      if (event.key === "ArrowLeft") goTo(index - 1);
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [index, goTo, onClose]);

  if (!count) return null;

  return createPortal(
    <div
      className="np-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} gallery` : "Image gallery"}
      ref={overlayRef}
      onClick={(event) => {
        if (event.target === overlayRef.current) onClose();
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) < 48) return;
        goTo(delta < 0 ? index + 1 : index - 1);
      }}
    >
      <div className="np-lightbox-top">
        <p className="np-lightbox-caption">
          {title && <span className="np-lightbox-title">{title}</span>}
          <span className="np-lightbox-count">
            {index + 1} / {count}
          </span>
        </p>
        <button
          type="button"
          className="np-lightbox-close"
          onClick={onClose}
          ref={closeButtonRef}
          aria-label="Close gallery"
        >
          Close
        </button>
      </div>

      <div className="np-lightbox-stage">
        {count > 1 && (
          <button
            type="button"
            className="np-lightbox-nav np-lightbox-nav--prev"
            onClick={() => goTo(index - 1)}
            aria-label="Previous image"
          >
            ←
          </button>
        )}
        <img
          key={images[index]}
          className="np-lightbox-image"
          src={images[index]}
          alt={title ? `${title} — image ${index + 1}` : `Image ${index + 1}`}
        />
        {count > 1 && (
          <button
            type="button"
            className="np-lightbox-nav np-lightbox-nav--next"
            onClick={() => goTo(index + 1)}
            aria-label="Next image"
          >
            →
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="np-lightbox-thumbs" role="tablist" aria-label="Gallery thumbnails">
          {images.map((src, thumbIndex) => (
            <button
              key={`${src}-${thumbIndex}`}
              type="button"
              role="tab"
              aria-selected={thumbIndex === index}
              className={`np-lightbox-thumb${thumbIndex === index ? " is-active" : ""}`}
              onClick={() => goTo(thumbIndex)}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
};

export default Lightbox;
