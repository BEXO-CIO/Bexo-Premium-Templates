import { useLayoutEffect, useRef } from "react";

/**
 * Scales a single line of type down until it fits its parent width.
 * Used for names and long project titles across any letter count.
 */
export default function FitText({
  as: Tag = "h1",
  text = "",
  className = "",
  minPx = 16,
  maxPx,
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;

      el.style.fontSize = "";
      if (maxPx) el.style.fontSize = `${maxPx}px`;

      const available = parent.clientWidth;
      const width = el.scrollWidth;
      if (width > available && width > 0) {
        const base = parseFloat(window.getComputedStyle(el).fontSize);
        const next = Math.max(base * (available / width) * 0.96, minPx);
        el.style.fontSize = `${next}px`;
      }
    };

    fit();
    document.fonts?.ready?.then(fit).catch(() => undefined);

    const observer = new ResizeObserver(fit);
    if (el.parentElement) observer.observe(el.parentElement);
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [text, minPx, maxPx]);

  return (
    <Tag ref={ref} className={`fit-text ${className}`.trim()}>
      {text}
    </Tag>
  );
}

/**
 * Ideal starting size from letter count — cinematic sticky needs big type.
 */
export function idealSizeFromLetters(letterCount, { short = 64, mid = 48, long = 38, xl = 30 } = {}) {
  if (letterCount <= 40) return short;
  if (letterCount <= 70) return mid;
  if (letterCount <= 110) return long;
  return xl;
}

/**
 * Gradually reduce font-size until the element fits inside its box.
 * Works for wrapping multi-line copy (sticky titles, project titles).
 */
export function fitBlockToBox(
  el,
  {
    minPx = 14,
    maxPx,
    step = 0.75,
    lineHeight = 1.12,
    letterSpacing,
    box,
    maxWidthPx,
    fill = false,
  } = {},
) {
  if (!el) return;

  const container = box || el.parentElement;
  if (!container) return;

  const availableW = container.clientWidth;
  const availableH = container.clientHeight;
  if (availableW < 40 || availableH < 40) return;

  const letters = (el.textContent || "").replace(/\s+/g, "").length;
  const start =
    maxPx ||
    (fill
      ? idealSizeFromLetters(letters, { short: 72, mid: 56, long: 44, xl: 34 })
      : idealSizeFromLetters(letters));

  // Page-filling sticky copy uses nearly full stage width (like the original).
  const measure = fill
    ? Math.min(availableW * 0.94, maxWidthPx || availableW * 0.94)
    : maxWidthPx ||
      Math.min(
        availableW * 0.92,
        letters <= 48 ? availableW * 0.7 : letters <= 90 ? availableW * 0.62 : availableW * 0.55,
        letters <= 48 ? 720 : letters <= 90 ? 640 : 560,
      );

  el.style.whiteSpace = "normal";
  el.style.overflowWrap = "break-word";
  el.style.width = `${Math.floor(measure)}px`;
  el.style.maxWidth = "100%";
  el.style.lineHeight = String(lineHeight);
  if (letterSpacing != null) el.style.letterSpacing = letterSpacing;
  el.style.fontSize = `${start}px`;

  let size = start;

  // Page-fill mode: grow until the block occupies most of the stage,
  // then ease back only as far as needed to avoid overflow.
  if (fill) {
    const targetH = availableH * 0.82;
    const ceiling = Math.min(maxPx || 140, availableH * 0.28);
    while (size < ceiling && el.scrollHeight < targetH && el.scrollWidth <= availableW + 1) {
      size += step;
      el.style.fontSize = `${size}px`;
    }
  }

  // Slow step-down so long copy settles into the largest readable size that fits.
  let guard = 0;
  while (guard < 120) {
    const overflows =
      el.scrollHeight > availableH + 1 || el.scrollWidth > availableW + 1;
    if (!overflows) break;
    size = Math.max(minPx, size - step);
    el.style.fontSize = `${size}px`;
    if (size <= minPx) break;
    guard += 1;
  }
}

/**
 * React helper: keep a multi-line block fitted to its parent on resize / text change.
 */
export function useFitBlock(text, options = {}) {
  const ref = useRef(null);
  const { minPx = 14, maxPx, step = 0.75, lineHeight = 1.35, letterSpacing } = options;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const run = () =>
      fitBlockToBox(el, { minPx, maxPx, step, lineHeight, letterSpacing });
    run();
    document.fonts?.ready?.then(run).catch(() => undefined);

    const observer = new ResizeObserver(run);
    if (el.parentElement) observer.observe(el.parentElement);
    window.addEventListener("resize", run);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", run);
    };
  }, [text, minPx, maxPx, step, lineHeight, letterSpacing]);

  return ref;
}

/** Pick a sticky-copy size tier from character count (CSS fallback before JS fit). */
export function stickyCopyTier(text = "") {
  const len = String(text).trim().length;
  if (len <= 60) return "sticky-copy--short";
  if (len <= 120) return "sticky-copy--mid";
  if (len <= 180) return "sticky-copy--long";
  return "sticky-copy--xl";
}

/** Truncate for a viewport band without mid-word cuts. */
export function fitSummary(text = "", max = 160) {
  const value = String(text || "").trim();
  if (!value || value.length <= max) return value;
  const budget = Math.max(24, max - 1);
  let cut = value.slice(0, budget);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > Math.floor(budget * 0.5)) cut = cut.slice(0, lastSpace);
  return `${cut.replace(/[.,;:\-–—\s]+$/u, "")}…`;
}

/**
 * Split a profile bio into 3 scroll-story beats.
 * Prefers real sentences/clauses from the user — never generic film filler.
 */
export function splitStoryBeats({ summary = "", headline = "", careerGoal = "", name = "" } = {}) {
  const clean = (value) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^[.,;:\-–—\s]+|[.,;:\-–—\s]+$/gu, "");

  const primary = clean(summary) || clean(careerGoal) || clean(headline);
  const extras = [clean(careerGoal), clean(headline)].filter(
    (piece) => piece && piece.toLowerCase() !== primary.toLowerCase(),
  );

  const sentences = (primary || "")
    .split(/(?<=[.!?])\s+/)
    .map(clean)
    .filter(Boolean);

  let beats = [];

  if (sentences.length >= 3) {
    beats = sentences.slice(0, 3);
  } else if (sentences.length === 2) {
    const [first, second] = sentences;
    const secondParts = splitIntoClauses(second, 2);
    if (secondParts.length >= 2) {
      beats = [first, secondParts[0], secondParts[1]];
    } else {
      const firstParts = splitIntoClauses(first, 2);
      if (firstParts.length >= 2) {
        beats = [firstParts[0], firstParts[1], second];
      } else {
        beats = [first, second, extras[0] || deriveClosingBeat(name, headline)];
      }
    }
  } else if (sentences.length === 1) {
    beats = splitIntoClauses(sentences[0], 3);
    while (beats.length < 3) {
      beats.push(extras.shift() || deriveClosingBeat(name, headline));
    }
    beats = beats.slice(0, 3);
  } else {
    beats = [
      extras[0] || deriveOpeningBeat(name, headline),
      extras[1] || deriveMiddleBeat(headline),
      deriveClosingBeat(name, headline),
    ];
  }

  // Soft length cap per beat so cinematic type can stay huge.
  return beats.map((beat) => fitSummary(clean(beat), 140)).filter(Boolean).slice(0, 3);
}

function splitIntoClauses(text, parts = 3) {
  const value = String(text || "").trim();
  if (!value) return [];

  const byPunct = value
    .split(/(?<=[,;:–—])\s+|\s+[–—]\s+/)
    .map((part) => part.replace(/^[,;:–—\s]+|[,;:–—\s]+$/gu, "").trim())
    .filter(Boolean);

  if (byPunct.length >= parts) {
    return mergeToParts(byPunct, parts);
  }

  return splitByWords(value, parts);
}

function mergeToParts(chunks, parts) {
  if (chunks.length <= parts) return chunks.slice(0, parts);
  const out = chunks.slice(0, parts - 1);
  out.push(chunks.slice(parts - 1).join(" "));
  return out;
}

function splitByWords(text, parts) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  if (words.length <= parts) return words;
  const size = Math.ceil(words.length / parts);
  const out = [];
  for (let i = 0; i < parts; i += 1) {
    const slice = words.slice(i * size, (i + 1) * size).join(" ");
    if (slice) out.push(slice);
  }
  return out;
}

function deriveOpeningBeat(name, headline) {
  if (headline) return `${headline}.`;
  if (name) return `${name} builds work with clarity and craft.`;
  return "A practice grounded in clarity, craft, and impact.";
}

function deriveMiddleBeat(headline) {
  if (headline) return `Focused on ${headline.replace(/\.$/, "").toLowerCase()}.`;
  return "Every project is shaped by insight and intent.";
}

function deriveClosingBeat(name, headline) {
  if (name && headline) return `This portfolio is a look at how ${name.split(" ")[0]} delivers on that.`;
  if (name) return `This portfolio is a focused look at ${name.split(" ")[0]}'s work.`;
  return "This portfolio is a focused look at the work that defines the practice.";
}
