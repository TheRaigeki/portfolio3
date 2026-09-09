import {
  dotfiles,
  minecraft,
  netflix,
  uber_clone,
  wrktree,
  wyrm,
} from "../assets";

export const CONTACT_EMAIL = "robin@raigeki.dev";
export const GITHUB_URL = "https://github.com/TheRaigeki";
export const LANG_KEY = "raigeki.lang";

/**
 * Storm intensity presets for the canvas thunderstorm.
 * `drops`/`speed`/`alpha` shape the rain, `glow`/`flash` the light,
 * `gapBase`/`gapRand` the milliseconds between two bolts.
 */
export const STORM_PRESETS = {
  subtil: { drops: 60, speed: 0.55, alpha: 0.6, glow: 0.12, flash: 0.45, gapBase: 9000, gapRand: 8000 },
  deutlich: { drops: 260, speed: 1, alpha: 1, glow: 0.22, flash: 0.8, gapBase: 3200, gapRand: 3500 },
  wucht: { drops: 700, speed: 1.6, alpha: 1.3, glow: 0.32, flash: 1.1, gapBase: 700, gapRand: 1200 },
};
export const DEFAULT_STORM = "deutlich";

export const I18N = {
  de: {
    navWork: 'Projekte', navAbout: 'Über mich', navContact: 'Kontakt', email: 'E-Mail', close: 'Schliessen',
    h1a: 'Software,', h1b: 'die einfach', h1c: 'läuft',
    lede: 'Fullstack-Anwendungen mit Spring Boot und Angular obendrauf, Docker Swarm und GitLab CI/CD darunter. Damit Deployments langweilig bleiben.',
    workIntro: 'Ein paar Dinge, die ich für mich und für Kunden gebaut habe. Mehr auf',
    aboutTitle: 'Software Engineer in Ausbildung, mit einigen Jahren Freelance-Arbeit im Rücken.',
    aboutP1: 'Fokus auf Fullstack, sauberen Code und ein echtes Faible für DevOps: CI/CD, Docker und alles, was Deployments unspektakulär macht.',
    aboutP2: 'Die beste Software ist die, über die niemand nachdenken muss.',
    stackGroups: ['Frontend', 'Backend', 'Daten', 'DevOps'],
    contactTitle: 'Ein Projekt oder eine Stelle im Kopf?', contactTeaser: 'Gute Arbeit beginnt mit einem klaren Gespräch.',
    getInTouch: 'Kontakt aufnehmen', hello: 'Hallo',
    contactIntro: 'Schön, dass du hier bist. Drei kurze Fragen, dann landet deine Nachricht bei mir.',
    contactIntro2: 'Ich melde mich innerhalb weniger Tage.',
    start: 'Start', pressEnter: 'Enter ↵ drücken', takes: 'Dauert etwa 1 Minute', back: 'Zurück', ok: 'OK', send: 'Senden',
    sent: 'Gesendet', thanks: 'Danke', reply: 'Ich melde mich in den nächsten Tagen bei', backHome: 'Zurück zur Seite',
    steps: [
      { q: 'Wie heisst du?', ph: 'Dein Name', hint: 'Enter ↵', err: 'Ohne Namen ist es zu unpersönlich.' },
      { q: n => `Hallo ${n}, wie erreiche ich dich?`, ph: 'name@beispiel.ch', hint: 'Enter ↵', err: 'Diese Adresse würde der Postbote nicht finden.' },
      { q: 'Worum geht es?', ph: 'Projekt, Stelle, Idee …', hint: 'Shift + Enter für Zeilenumbruch', err: 'Das war knapp. Ein paar Worte mehr?' },
    ],
    projects: [
      'Der Mail-Client des Drachenjägers: Account verbinden und die langweilige Inbox gegen ein Abenteuer tauschen.',
      'Ein Link-in-Bio, das deine Arbeit zeigt statt nur Links: Live-Projektkarten mit GitHub im Autopilot.',
      'Ubers minimalistische Mobile-App mit React Native nachgebaut, inklusive Karten, Routing und Fahrtauswahl.',
      'Mein Neovim-, tmux- und zsh-Setup, mit stow verwaltet und zwischen macOS und Arch geteilt. Das Repo, das ich am häufigsten anfasse.',
      'Läuft das im Browser? Ja. Ein frühes, forderndes Experiment mit 3D-Objekten im Web.',
      'Das UI gefiel mir, mit Redux wollte ich warm werden. Ein Klassiker aus gutem Grund.',
    ],
  },
  en: {
    navWork: 'Work', navAbout: 'About', navContact: 'Contact', email: 'Email', close: 'Close',
    h1a: 'Software', h1b: 'that just', h1c: 'works',
    lede: 'Fullstack applications with Spring Boot and Angular on top, Docker Swarm and GitLab CI/CD underneath. So deployments stay boring.',
    workIntro: 'A few things I built for myself and for clients. More on',
    aboutTitle: 'Software engineer in training, with several years of freelance work behind me.',
    aboutP1: 'Fullstack focus, clean code, and a real appetite for DevOps: CI/CD, Docker and everything that keeps deployments unspectacular.',
    aboutP2: 'The best software is the kind nobody has to think about.',
    stackGroups: ['Frontend', 'Backend', 'Data', 'DevOps'],
    contactTitle: 'A project or a role in mind?', contactTeaser: 'Good work begins with a clear conversation.',
    getInTouch: 'Get in touch', hello: 'Hello',
    contactIntro: 'Glad you are here. Three short questions and your message lands with me.',
    contactIntro2: 'I reply within a few days.',
    start: 'Start', pressEnter: 'press Enter ↵', takes: 'Takes about 1 minute', back: 'Back', ok: 'OK', send: 'Send',
    sent: 'Sent', thanks: 'Thanks', reply: 'I will get back to you in the next few days at', backHome: 'Back to the site',
    steps: [
      { q: "What's your name?", ph: 'Your name', hint: 'Enter ↵', err: 'Without a name this feels too impersonal.' },
      { q: n => `Hi ${n}, how do I reach you?`, ph: 'name@example.com', hint: 'Enter ↵', err: "The mail carrier wouldn't find that address." },
      { q: "What's it about?", ph: 'Project, role, idea …', hint: 'Shift + Enter for a new line', err: 'That was brief. A few more words?' },
    ],
    projects: [
      "Dragonhunter's mail client: connect your account and trade the boring inbox UI for an adventure.",
      'A link in bio that shows your work, not just your links: live project cards with GitHub on autopilot.',
      "Uber's minimalistic mobile app rebuilt with React Native, with maps, routing and ride selection.",
      'My Neovim, tmux and zsh setup, stow-managed and shared between macOS and Arch. The repo I touch most.',
      'Can it run in the browser? Yes. An early, demanding experiment with 3D objects on the web.',
      'Loved the UI, wanted to get comfortable with Redux. A classic for a reason.',
    ],
  },
};

// Stroke data: KanjiVG (Ulrich Apel), CC BY-SA 3.0 — https://kanjivg.tagaini.net
export const KANJI = [
  ['M29.11,14.81c2.68,0.37,5.31,0.57,8.04,0.3c8.47-0.86,23.33-2.52,34.23-3.32c2.32-0.17,4.67-0.4,6.98-0.01','M16.89,29.74c-0.23,5.73-2.27,12.08-3.78,17.87','M17.67,31.45C39.5,29,71.45,25.73,88.16,25.73c8.64,0,4.17,3.66-0.3,7.99','M53.24,16.31c0.91,0.91,1.14,1.94,1.14,3.43c0,0.46-0.01,17.39-0.01,27.02c0,2.89-0.01,5.61-0.01,5.99','M32.77,37.25c3.15,0.87,7.45,3.47,9.16,4.92','M31.21,47.39c3.14,0.87,7.98,4.05,9.69,5.5','M67.61,34.04c4.76,1.34,7.91,3.92,9.49,5.07','M66.81,44.94c3.59,1.04,8.49,4.18,10.45,5.93','M25.49,63.5c0.94,0.94,1.29,2.56,1.44,3.64c1.19,8.36,2.38,17.05,3.17,25.63c0.15,1.63,0.3,3.21,0.47,4.69','M27.64,65.49c14.21-1.4,37.48-3.49,50.66-3.69c4.54-0.07,4.84,1.53,4.32,5.46c-0.72,5.55-1.99,14.68-3.99,22.09c-0.45,1.68-0.94,3.27-1.47,4.72','M52.23,65.72c0.9,0.9,1.16,1.91,1.16,3.5c0,7.92,0.09,18.58,0.09,22.75','M29.79,79.07c11.96-1.07,40.83-3.2,51.11-3.27','M31.31,94.45c10.23-0.59,29.69-1.7,45.61-2.3'],
  ['M19.64,20.04c1.12,0.47,3.16,0.42,4.36,0.34c7.45-0.55,14.57-1.8,21.38-2.42c1.23-0.11,2.29-0.2,3.48,0.1','M19.32,28.26c0.77,0.77,1.2,2.31,1.35,3.13c0.47,2.6,1.36,6.61,1.88,10.82c0.16,1.27,0.32,2.51,0.49,3.63','M21.25,29.13c5.9-0.53,18.09-2.57,24-3.09c2.7-0.24,4.7,0.62,4.18,3.76c-0.46,2.81-1.61,6.42-2.63,10.14c-0.29,1.06-0.59,2.12-0.88,3.13','M22.82,36.53c6.68-0.91,17.18-2.41,24.45-2.81','M23.82,43.92c5.83-0.62,13.8-1.8,21.35-2.21','M14.33,52.53c1.5,0.89,4.3,0.6,5.93,0.42c7.64-0.82,20.35-2.5,27.24-3.33c1.45-0.17,3-0.49,4.42,0.02','M33.64,11.38c0.8,0.8,1.11,1.87,1.11,2.99c0,0.49,0.08,28.17,0.11,39.26c0.01,2.65,0.01,4.35,0.01,4.51','M60.62,14.06c0.47,0.47,0.77,1.37,0.72,1.99c-0.46,5.95-1.96,11.45-6.57,15.9','M62.08,15.5c3.79-0.5,8.17-1.25,11.46-1.68c1.82-0.24,2.66,1.07,2.48,2.18c-0.35,2.18-1.03,5.38-1.03,7.56c0,4.31,0.39,4.71,6.97,4.71c6.9,0,7.22-1.28,7.22-6.05','M58.92,35.44c1.02,0.19,1.15,0.47,3.2,0.19s12.65-1.82,14.06-2.08c2.32-0.42,3.41,1.36,2.17,2.83c-7.47,8.88-16.33,14.84-28.6,19.54','M56.17,41.11c4.5,0,15.63,8.27,26.25,12.95c2.29,1.01,4.65,1.99,7.08,2.61','M66.51,54.75c-0.01,1-0.89,1.73-2.17,2.25c-4.34,1.75-12.59,4.5-28.19,7.81','M29.52,71.97c2.5,0.83,5.58,0.31,8.11-0.07c10.12-1.52,19.25-2.52,33.74-4.17c3.24-0.37,6.89-0.47,10.31-0.15','M21.01,82.58c1.99,0.73,4.81,0.32,6.86,0.08c10.18-1.21,38.01-4.54,53.75-5.27c2.64-0.12,5.7-0.18,8.3,0.39','M53.46,62.81C60,68.75,60.5,84,57.53,94.42c-1.59,5.56-5.78,3.58-8.29,0.04'],
];

/** Vertical stack list next to the hero headline (not translated). */
export const HERO_STACK = [
  "typescript",
  "java · spring boot",
  "angular",
  "next.js",
  "docker",
  "ci/cd",
];

const LIVE = { kind: "● live", kindColor: "#c9bfff" };
const SOURCE = { kind: "↗ source", kindColor: "#7d7a94" };

/** Order matters: the descriptions come from `I18N[lang].projects` by index. */
export const PROJECTS = [
  { name: "Wyrm", tags: ["next.js", "saas", "email"], image: wyrm, href: "https://wyrm.email", ...LIVE },
  { name: "wrktree", tags: ["next.js", "saas", "link in bio"], image: wrktree, href: "https://wrktr.ee", ...LIVE },
  { name: "Uber Clone", tags: ["react native", "expo", "redux"], image: uber_clone, href: "https://github.com/TheRaigeki/uber_clone", ...SOURCE },
  { name: "Dotfiles", tags: ["neovim", "tmux", "stow"], image: dotfiles, href: "https://github.com/TheRaigeki/dotfiles", ...SOURCE },
  { name: "Minecraft Web", tags: ["react", "three.js", "css"], image: minecraft, href: "https://minecraft-five-psi.vercel.app", ...LIVE },
  { name: "Netflix Clone", tags: ["react", "redux", "css"], image: netflix, href: "https://github.com/TheRaigeki/netflix", ...SOURCE },
].map((p) => ({ ...p, tagline: p.tags.join("  ·  ") }));

/** Order matters: the group names come from `I18N[lang].stackGroups` by index. */
export const STACK_ITEMS = [
  ["TypeScript", "JavaScript", "React", "Next.js", "Angular", "Tailwind"],
  ["Java · Spring Boot", "Node.js", "C#", "REST"],
  ["PostgreSQL", "MySQL", "SQL / NoSQL"],
  ["Git", "GitLab CI/CD", "Docker · Swarm", "Maven"],
];

export const buildProjects = (t) =>
  PROJECTS.map((p, i) => ({ ...p, description: t.projects[i] }));

export const buildStack = (t) =>
  STACK_ITEMS.map((items, i) => ({ group: t.stackGroups[i], items }));

export const detectLang = () => {
  try {
    const s = localStorage.getItem(LANG_KEY);
    if (s === "de" || s === "en") return s;
  } catch (e) {}
  return (navigator.language || "").toLowerCase().startsWith("de") ? "de" : "en";
};
