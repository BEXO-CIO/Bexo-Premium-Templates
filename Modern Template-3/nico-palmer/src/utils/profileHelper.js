import { useState, useEffect, useMemo } from "react";

import { applyTheme, subscribeThemeLab } from "./theme";

const asArray = (value) => {
  if (Array.isArray(value)) return value.filter((item) => item && typeof item === "object");
  if (value && typeof value === "object") return [value];
  return [];
};

const asString = (value, fallback = "") => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
};

/** Soft character caps for public display — keeps hero/lead copy readable. */
export const TEXT_LIMITS = {
  headline: 120,
  summary: 240,
  about: 320,
};

/**
 * Truncate to maxLength without cutting mid-word when possible.
 * Appends an ellipsis when content was shortened.
 */
export function clampText(value, maxLength = TEXT_LIMITS.summary) {
  const text = asString(value);
  if (!text || text.length <= maxLength) return text;

  const budget = Math.max(16, maxLength - 1);
  let cut = text.slice(0, budget);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > Math.floor(budget * 0.55)) {
    cut = cut.slice(0, lastSpace);
  }
  return `${cut.replace(/[.,;:\-–—\s]+$/u, "")}…`;
}

const pick = (entry, keys, fallback = "") => {
  for (const key of keys) {
    const value = asString(entry?.[key]);
    if (value) return value;
  }
  return fallback;
};

const fileNameFromUrl = (url) => {
  try {
    const pathname = new URL(url, "https://placeholder.local").pathname;
    const base = decodeURIComponent(pathname.split("/").filter(Boolean).pop() || "");
    return base || "Document";
  } catch {
    return "Document";
  }
};

// Accepts arrays mixing plain URL strings and {url,name} objects.
const toUrlList = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? { url: item.trim(), name: "" } : item))
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      url: asString(item.url || item.href || item.link),
      name: pick(item, ["name", "label", "title"]),
    }))
    .filter((item) => item.url);
};

const normalizeAssets = (entry = {}) => {
  const assets = entry.assets && typeof entry.assets === "object" ? entry.assets : {};

  const images = [];
  for (const img of [...toUrlList(entry.images), ...toUrlList(assets.images)]) {
    if (!images.includes(img.url)) images.push(img.url);
  }

  const pdfs = [];
  for (const pdf of [...toUrlList(entry.pdfs), ...toUrlList(assets.pdfs)]) {
    if (pdfs.some((existing) => existing.url === pdf.url)) continue;
    pdfs.push({ url: pdf.url, name: pdf.name || fileNameFromUrl(pdf.url) });
  }

  return { images, pdfs };
};

const normalizeLinks = (contact = {}) => {
  const links = [];
  const push = (label, url) => {
    const cleanUrl = asString(url);
    const cleanLabel = asString(label);
    if (!cleanUrl || !cleanLabel) return;
    if (links.some((link) => link.url === cleanUrl)) return;
    links.push({ label: cleanLabel, url: cleanUrl });
  };

  push("LinkedIn", contact.linkedin);
  push("GitHub", contact.github);
  push("Portfolio", contact.portfolio);

  for (const social of asArray(contact.socials)) {
    push(pick(social, ["label", "name", "title"], "Link"), pick(social, ["url", "href", "link"]));
  }
  for (const link of asArray(contact.customLinks)) {
    push(pick(link, ["label", "name", "title"], "Link"), pick(link, ["url", "href", "link"]));
  }

  return links;
};

export function normalizeProfile(raw) {
  if (!raw || typeof raw !== "object") return null;

  const sections = raw.sections || {};
  const contactFromSections = asArray(sections.contact?.entries)[0] || {};
  const contactRaw = {
    ...(typeof raw.contactData === "object" ? raw.contactData : {}),
    ...contactFromSections,
  };

  const aboutEntries = asArray(
    raw.aboutEntries?.length ? raw.aboutEntries : sections.about?.entries,
  ).map((entry, index) => ({
    ...entry,
    id: asString(entry.id, String(index + 1)),
    bio: clampText(pick(entry, ["bio", "description"]), TEXT_LIMITS.about),
    description: clampText(pick(entry, ["description", "bio"]), TEXT_LIMITS.about),
    title: clampText(asString(entry.title), TEXT_LIMITS.headline),
  }));
  const educationEntries = asArray(
    raw.educationEntries?.length ? raw.educationEntries : sections.education?.entries,
  );
  const experienceEntries = asArray(
    raw.experienceEntries?.length ? raw.experienceEntries : sections.experience?.entries,
  );
  const projectEntries = asArray(
    raw.projectEntries?.length ? raw.projectEntries : sections.projects?.entries,
  ).map((entry, index) => ({
    ...entry,
    id: asString(entry.id, String(index + 1)),
    title: asString(entry.title),
    description: clampText(asString(entry.description), TEXT_LIMITS.about),
    techStack: pick(entry, ["techStack", "tech"]),
    link: pick(entry, ["link", "url", "href"]),
    ...normalizeAssets(entry),
  }));
  const certificateEntries = asArray(
    raw.certificateEntries?.length ? raw.certificateEntries : sections.certificates?.entries,
  ).map((entry) => ({
    ...entry,
    title: pick(entry, ["title", "name"]),
    name: pick(entry, ["name", "title"]),
    issuer: pick(entry, ["issuer", "organization"]),
    credentialLink: pick(entry, ["credentialLink", "link", "url"]),
    ...normalizeAssets(entry),
  }));
  const achievementEntries = asArray(
    raw.achievementEntries?.length ? raw.achievementEntries : sections.achievements?.entries,
  ).map((entry) => ({
    ...entry,
    awarder: pick(entry, ["awarder", "organization", "issuer"]),
    ...normalizeAssets(entry),
  }));
  const researchEntries = asArray(
    raw.researchEntries?.length ? raw.researchEntries : sections.research?.entries,
  ).map((entry) => ({
    ...entry,
    publication: pick(entry, ["publication", "journal", "organization"]),
    journal: pick(entry, ["journal", "publication", "organization"]),
    link: pick(entry, ["link", "url", "href"]),
    ...normalizeAssets(entry),
  }));

  const skillCategorySet = new Set(["technical", "tools", "soft", "languages"]);
  const skillEntries = asArray(
    raw.skillEntries?.length ? raw.skillEntries : sections.skills?.entries,
  )
    .map((entry, index) => {
      if (typeof entry === "string") {
        const name = entry.trim();
        return name ? { id: String(index + 1), name, category: "technical" } : null;
      }
      const name = asString(pick(entry, ["name", "title", "skill", "label"]));
      if (!name) return null;
      const categoryRaw = asString(entry.category, "technical").toLowerCase();
      return {
        id: asString(entry.id, String(index + 1)),
        name,
        category: skillCategorySet.has(categoryRaw) ? categoryRaw : "technical",
      };
    })
    .filter(Boolean);

  const socials = normalizeLinks(contactRaw);
  const email = asString(contactRaw.email) || asString(raw.user?.email);
  // Never expose phone on the public portfolio surface
  const contactData = {
    email,
    linkedin: asString(contactRaw.linkedin),
    github: asString(contactRaw.github),
    portfolio: asString(contactRaw.portfolio),
    socials,
    customLinks: socials,
  };

  return {
    profile: {
      handle: asString(raw.profile?.handle),
      headline: clampText(asString(raw.profile?.headline), TEXT_LIMITS.headline),
      careerGoal: clampText(asString(raw.profile?.careerGoal), TEXT_LIMITS.summary),
      bio: clampText(asString(raw.profile?.bio), TEXT_LIMITS.summary),
    },
    user: {
      id: raw.user?.id,
      name: asString(raw.user?.name),
      email,
      photoUrl: asString(raw.user?.photoUrl),
      resumeUrl: asString(raw.user?.resumeUrl),
      openToHire: !!raw.user?.openToHire,
      templateId: asString(raw.user?.templateId, "nico-palmer"),
      themeColor: asString(raw.user?.themeColor, "gold"),
      themeBg: asString(raw.user?.themeBg, "grid"),
    },
    isPremium: !!raw.isPremium,
    aboutEntries,
    educationEntries,
    experienceEntries,
    projectEntries,
    certificateEntries,
    achievementEntries,
    researchEntries,
    skillEntries,
    contactData,
    sections: {
      about: { reviewed: true, entries: aboutEntries },
      education: { reviewed: true, entries: educationEntries },
      experience: { reviewed: true, entries: experienceEntries },
      projects: { reviewed: true, entries: projectEntries },
      certificates: { reviewed: true, entries: certificateEntries },
      achievements: { reviewed: true, entries: achievementEntries },
      research: { reviewed: true, entries: researchEntries },
      skills: { reviewed: true, entries: skillEntries },
      contact: { reviewed: true, entries: [{ email, socials, address: asString(contactRaw.address) }] },
    },
  };
}

const defaultProfile = normalizeProfile({
  user: {
    name: "Nico Palmer",
    email: "hello@curafuturi.com",
    photoUrl: "/assets/images/home/portrait.jpg",
    resumeUrl: "",
    openToHire: true,
  },
  profile: {
    handle: "nicopalmer",
    headline: "Interaction & Motion Designer",
    careerGoal: "Crafting immersive digital experiences that tell human stories through design.",
    bio: "Nico Palmer is an innovative Interaction and Motion Designer based in Toronto.",
  },
  aboutEntries: [
    {
      bio: "Nico Palmer partners with clients in Tech, Education, Entertainment, and eCommerce.",
      estYear: "1997",
      email: "hello@curafuturi.com",
    },
  ],
  educationEntries: [
    {
      degree: "Bachelor of Design in Interaction Design",
      institution: "University of Toronto",
      startYear: "2015",
      endYear: "2019",
      grade: "3.8 CGPA",
    },
  ],
  projectEntries: [
    {
      id: "proj-1",
      title: "Fragments of Light",
      category: "Short Film",
      description: "A visual meditation on identity through minimalism, mood, and motion.",
      techStack: "GSAP, React, Framer Motion",
      link: "https://github.com/nicopalmer/fragments-of-light",
      images: [
        "/assets/images/projects/project-1.jpg",
        "/assets/images/projects/project-2.jpg",
        "/assets/images/projects/project-3.jpg",
        "/assets/images/projects/project-4.jpg",
        "/assets/images/projects/project-5.jpg",
      ],
      pdfs: [{ url: "/assets/docs/case-study.pdf", name: "Case Study PDF" }],
      role: "Director & Lead Animator",
      year: "2024",
    },
    {
      id: "proj-2",
      title: "Market Pulse",
      category: "Documentary",
      description: "Street life, raw and real. Digital transformation for a biotech firm.",
      techStack: "React, Lenis, WebGL",
      images: ["/assets/images/projects/project-2.jpg", "/assets/images/projects/project-4.jpg"],
      role: "Director & Editor",
      year: "2023",
    },
  ],
  experienceEntries: [
    {
      role: "Lead Interaction Designer",
      company: "Design Matters Studio",
      startDate: "2022-01",
      endDate: "Present",
      responsibilities: [
        "Lead animation architecture and interaction design for Fortune 500 campaigns.",
        "Collaborate with developers on GSAP timelines and responsive motion systems.",
      ],
    },
  ],
  certificateEntries: [
    {
      name: "Advanced Web Animation & Interaction",
      issuer: "Awwwards Academy",
      date: "2023-04-10",
      credentialLink: "https://awwwards.com",
      images: ["/assets/images/projects/project-3.jpg"],
      pdfs: [{ url: "/assets/docs/case-study.pdf", name: "Certificate PDF" }],
    },
  ],
  achievementEntries: [
    {
      title: "Best Interactive Design",
      awarder: "Webby Awards",
      year: "2024",
      project: "Fragments of Light",
      images: ["/assets/images/projects/project-5.jpg"],
    },
  ],
  researchEntries: [
    {
      title: "Exploring the Future of Web Animation and Performance",
      authors: "Nico Palmer",
      publication: "Smashing Magazine",
      year: "2023",
      link: "https://smashingmagazine.com",
    },
  ],
  skillEntries: [
    { name: "React", category: "technical" },
    { name: "GSAP", category: "technical" },
    { name: "Framer Motion", category: "tools" },
    { name: "WebGL", category: "technical" },
    { name: "Figma", category: "tools" },
  ],
  contactData: {
    email: "hello@curafuturi.com",
    linkedin: "https://linkedin.com/in/nicopalmer",
    github: "",
    portfolio: "",
    socials: [
      { label: "Instagram", url: "https://instagram.com/nicopalmer" },
      { label: "LinkedIn", url: "https://linkedin.com/in/nicopalmer" },
    ],
  },
});

export function splitDisplayName(fullName) {
  const cleaned = asString(fullName);
  if (!cleaned) return { firstName: "", lastName: "", isSingle: true, tokens: [] };
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  if (tokens.length === 1) {
    return { firstName: tokens[0], lastName: "", isSingle: true, tokens };
  }

  // Initials / short trailing tokens (e.g. "Kavinbalaji SK") look broken
  // as a giant second line — keep them with the primary name.
  const trailing = tokens.slice(1);
  const trailingIsInitials = trailing.every((t) => t.length <= 3);
  if (trailingIsInitials) {
    return {
      firstName: tokens.join(" "),
      lastName: "",
      isSingle: true,
      tokens,
    };
  }

  return {
    firstName: tokens[0],
    lastName: trailing.join(" "),
    isSingle: false,
    tokens,
  };
}

export function getNameFitClass(fullName) {
  const cleaned = asString(fullName);
  const len = cleaned.length;
  const { isSingle, tokens } = splitDisplayName(cleaned);
  if (isSingle || tokens.length <= 1) {
    if (len > 16) return "name-fit--solo-xl";
    if (len > 11) return "name-fit--solo-lg";
    return "name-fit--solo";
  }
  if (len > 28 || tokens.some((t) => t.length > 14)) return "name-fit--xl";
  if (len > 20 || tokens.some((t) => t.length > 10)) return "name-fit--lg";
  return "name-fit--md";
}

export function getProfile() {
  if (typeof window !== "undefined" && window.__BEXO_PROFILE__) {
    return normalizeProfile(window.__BEXO_PROFILE__) || defaultProfile;
  }
  return defaultProfile;
}

/** Handle used when previewing the template on localhost without platform injection. */
export const LOCAL_TEST_HANDLE = "kavin";

export function applyProfilePayload(raw) {
  const normalized = normalizeProfile(raw);
  if (!normalized) return null;
  if (typeof window !== "undefined") {
    window.__BEXO_PROFILE__ = raw;
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { type: "BEXO_PROFILE_UPDATE", profile: raw },
      }),
    );
  }
  return normalized;
}

/**
 * Fetch a live public profile for local Vite previews.
 * Skips when the platform already injected __BEXO_PROFILE__.
 */
export async function loadLocalTestProfile(handle = LOCAL_TEST_HANDLE) {
  if (typeof window === "undefined") return null;
  if (window.__BEXO_PROFILE__ && !window.__BEXO_LOCAL_TEST__) return normalizeProfile(window.__BEXO_PROFILE__);

  const isLocal =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!isLocal) return null;

  try {
    const res = await fetch(`/api/profile/public/${encodeURIComponent(handle)}`);
    if (!res.ok) throw new Error(`Profile fetch failed (${res.status})`);
    const raw = await res.json();
    window.__BEXO_LOCAL_TEST__ = true;
    return applyProfilePayload(raw);
  } catch (err) {
    console.warn(`[nico] Could not load local test profile "${handle}":`, err);
    return null;
  }
}

export function useProfile() {
  const [profile, setProfile] = useState(() => getProfile());

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "BEXO_PROFILE_UPDATE") {
        window.__BEXO_PROFILE__ = event.data.profile;
        setProfile(normalizeProfile(event.data.profile) || defaultProfile);
      }
    };

    window.addEventListener("message", handleMessage);

    // Local Vite preview: pull a real user profile (kavin) for review
    let cancelled = false;
    loadLocalTestProfile().then((loaded) => {
      if (!cancelled && loaded) setProfile(loaded);
    });

    return () => {
      cancelled = true;
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Keep the user's platform theme applied; lab overrides (local only) win.
  useEffect(() => {
    applyTheme(profile?.user);
    return subscribeThemeLab(() => applyTheme(profile?.user));
  }, [profile?.user?.themeColor, profile?.user?.themeBg, profile?.user]);

  return profile;
}

export function useDisplayProfile() {
  const profile = useProfile();
  return useMemo(() => {
    const nameParts = splitDisplayName(profile?.user?.name);
    const headline = clampText(
      asString(profile?.profile?.headline) || asString(profile?.profile?.careerGoal),
      TEXT_LIMITS.headline,
    );
    const summary = clampText(
      asString(profile?.profile?.bio) || asString(profile?.profile?.careerGoal) || headline,
      TEXT_LIMITS.summary,
    );
    return {
      ...profile,
      nameParts,
      nameFitClass: getNameFitClass(profile?.user?.name),
      handleLabel: asString(profile?.profile?.handle) || "portfolio",
      headline,
      summary,
      photoUrl: asString(profile?.user?.photoUrl),
      resumeUrl: asString(profile?.user?.resumeUrl),
      socials: profile?.contactData?.socials || [],
      ownerEmail: asString(profile?.contactData?.email) || asString(profile?.user?.email),
    };
  }, [profile]);
}

export { defaultProfile };
