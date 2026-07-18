import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import "./lightbox.css";

const Lightbox = ({ images = [], startIndex = 0, title = "", onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);

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

  // Touch swipe support for mobile
  const touchStartX = useRef(null);
  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };
  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 48) return;
    goTo(delta < 0 ? index + 1 : index - 1);
  };

  if (!count) return null;

  return ReactDOM.createPortal(
    <div
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} gallery` : "Image gallery"}
      ref={overlayRef}
      onClick={(event) => {
        if (event.target === overlayRef.current) onClose();
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="lightbox-topbar">
        <p className="lightbox-caption">
          {title && <span className="lightbox-title">{title}</span>}
          <span className="lightbox-counter">
            {index + 1} / {count}
          </span>
        </p>
        <button
          type="button"
          className="lightbox-close"
          onClick={onClose}
          ref={closeButtonRef}
          aria-label="Close gallery"
        >
          Close
        </button>
      </div>

      <div className="lightbox-stage">
        {count > 1 && (
          <button
            type="button"
            className="lightbox-nav lightbox-nav--prev"
            onClick={() => goTo(index - 1)}
            aria-label="Previous image"
          >
            &#8592;
          </button>
        )}
        <img
          key={images[index]}
          className="lightbox-image"
          src={images[index]}
          alt={title ? `${title} — image ${index + 1}` : `Image ${index + 1}`}
        />
        {count > 1 && (
          <button
            type="button"
            className="lightbox-nav lightbox-nav--next"
            onClick={() => goTo(index + 1)}
            aria-label="Next image"
          >
            &#8594;
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="lightbox-thumbs" role="tablist" aria-label="Gallery thumbnails">
          {images.map((src, thumbIndex) => (
            <button
              key={`${src}-${thumbIndex}`}
              type="button"
              role="tab"
              aria-selected={thumbIndex === index}
              className={`lightbox-thumb${thumbIndex === index ? " is-active" : ""}`}
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
