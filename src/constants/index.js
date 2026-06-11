import * as assets from "../assets";

export const navLinks = [
  { id: "about", title: "about" },
  { id: "work", title: "work" },
  { id: "stack", title: "stack" },
  { id: "contact", title: "contact" },
];

export const heroChips = [
  "typescript",
  "java · spring boot",
  "angular",
  "next.js",
  "docker",
  "ci/cd",
];

export const about =
  "Application Developer EFZ in training at Adibilis GmbH, with several years of prior freelance web & mobile work. Fullstack focus, clean code, and a real appetite for DevOps – CI/CD, Docker and everything that keeps deployments boring.";

export const experiences = [
  {
    role: "Software Engineer",
    qualifier: "(Internship)",
    org: "Adibilis GmbH",
    from: "2024",
    to: "now",
    current: true,
    points: [
      "Feature dev for client & internal projects in a Scrum team (Java / Spring Boot, Angular, Next.js)",
      "DevOps infrastructure on Docker Swarm; built & maintain GitLab CI/CD pipelines",
      "IPA: independent real-time dashboard for Docker Swarm (target/actual state of all environments)",
      "Code reviews, coding standards, automated tests (Unit, E2E, Integration)",
    ],
  },
  {
    role: "Fullstack Web & Mobile Developer",
    org: "Freelance · Remote",
    from: "2018",
    to: "2023",
    points: [
      "Built responsive web applications for friends & clients",
      "Built mobile applications",
    ],
  },
  {
    role: "Informatiker EFZ – Applikationsentwicklung",
    org: "ipso Bildung GmbH",
    from: "2022",
    to: "2026",
    points: ["Vocational education & training, software engineering"],
  },
];

export const stack = [
  {
    group: "frontend",
    items: ["TypeScript", "JavaScript", "React", "Next.js", "Angular", "Tailwind"],
  },
  {
    group: "backend",
    items: ["Java · Spring Boot", "Node.js", "C#", "REST"],
  },
  {
    group: "data",
    items: ["PostgreSQL", "MySQL", "SQL / NoSQL"],
  },
  {
    group: "devops",
    items: ["Git", "GitLab CI/CD", "Docker · Swarm", "Maven"],
  },
];

export const projects = [
  {
    name: "Uber Clone",
    repo: "uber_clone",
    description:
      "Uber's minimalistic mobile app rebuilt with React Native – maps, routing and ride selection included.",
    tags: ["react native", "expo", "redux"],
    image: assets.uber_clone,
    source: "https://github.com/TheRaigeki/uber_clone",
  },
  {
    name: "Wyrm",
    repo: "thunderdragon",
    description:
      "Dragonhunter's mail client – connect your account and trade the boring inbox UI for an adventure.",
    tags: ["next.js", "saas", "email"],
    image: assets.wyrm,
    live: "https://wyrm.email",
  },
  {
    name: "wrktree",
    repo: "wrktree",
    description:
      "A link in bio that shows your work, not just your links – live project cards with GitHub on autopilot.",
    tags: ["next.js", "saas", "link in bio"],
    image: assets.wrktree,
    live: "https://wrktr.ee",
  },
  {
    name: "Dotfiles",
    repo: "dotfiles",
    description:
      "My Neovim, tmux & zsh setup – stow-managed and shared between macOS and Arch. The repo I touch most.",
    tags: ["neovim", "tmux", "stow"],
    image: assets.dotfiles,
    source: "https://github.com/TheRaigeki/dotfiles",
  },
  {
    name: "Netflix Clone",
    repo: "netflix-clone",
    description:
      "Loved the UI, wanted to get comfortable with Redux. A classic for a reason.",
    tags: ["react", "redux", "css"],
    image: assets.netflix,
    source: "https://github.com/TheRaigeki/netflix",
  },
  {
    name: "Minecraft Web",
    repo: "minecraft-web",
    description:
      "Can it run in the browser? Yes. An early, demanding experiment with 3D objects on the web.",
    tags: ["react", "three.js", "css"],
    image: assets.minecraft,
    live: "https://minecraft-five-psi.vercel.app",
  },
];

export const contactInfo = [
  { k: "email", v: "info@raigeki.dev" },
  { k: "location", v: "Switzerland" },
  { k: "github", v: "github.com/TheRaigeki" },
  { k: "langs", v: "DE (native) · EN (fluent)" },
];

export const githubUrl = "https://github.com/TheRaigeki";
