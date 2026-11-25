export type WebProject = {
  slug: string;
  title: string;
  tag: string;
  subtitle: string;
  url: string;
};

export const webProjects: WebProject[] = [
  {
    slug: "soloist",
    title: "Soloist",
    tag: "Web App · Front-end",
    subtitle:
      "CRM e calculadora de precificação inteligente para criativos, com combos drag & drop e Kanban integrado.",
    url: "https://soloist-doyb.vercel.app/",
  },
  {
    slug: "sonavox",
    title: "SonaVox",
    tag: "E-commerce · Front-end",
    subtitle:
      "Interface de e-commerce para instrumentos musicais e equipamentos de áudio, com catálogo, busca e carrinho.",
    url: "https://sonavox-front-end.vercel.app/",
  },
  {
    slug: "portfolio-design-gab",
    title: "Portfólio — Gabriel Gurgel",
    tag: "Site Interativo",
    subtitle:
      "Este portfólio: desenvolvido com React, TypeScript, TanStack Start, Tailwind CSS, GSAP e Three.js.",
    url: "https://portfolio-design-gab.vercel.app/",
  },
];
