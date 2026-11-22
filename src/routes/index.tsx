import { useId, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import profile from "@/assets/profile-cutout.png";
import { useHeroLiquify } from "@/hooks/use-hero-liquify";
import { usePortfolioStory } from "@/hooks/use-portfolio-story";
import { ProjectGallery } from "@/components/project-gallery";
import { PortfolioToolbox } from "@/components/portfolio-toolbox";
import { PortfolioHeader } from "@/components/portfolio-header";
import { projects } from "@/data/projects";
import { getProjectCover } from "@/data/project-images";
import { getVideoCover, videoProjects } from "@/data/videos";
import {
  ArrowUpRight,
  RotateCw,
  Palette,
  Camera,
  Clapperboard,
  Sparkles,
  Github,
  MessageCircle,
  Mail,
  Download,
  Play,
  Pause,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Gabriel Gurgel · Especialista em imagem",
      },
      {
        name: "description",
        content:
          "Portfólio de Gabriel (Gab), especialista em imagem formado em Publicidade e Propaganda. Design, fotografia, vídeo, motion, IA generativa e programação. Intenção em cada detalhe.",
      },
      { property: "og:title", content: "Gabriel · Especialista em imagem" },
      {
        property: "og:description",
        content:
          "Design, fotografia, vídeo, motion, IA generativa e programação — da ideia à tela, em qualquer formato.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Discipline = {
  color: string;
  title: string;
  desc: string;
  icon: typeof Palette;
  href: string;
  linkLabel: string;
};

const disciplines: Discipline[] = [
  {
    color: "var(--digital-violet)",
    title: "Design",
    desc: "Peças gráficas, social media e identidade visual, com direção de arte pensada pra cada contexto.",
    icon: Palette,
    href: "#design-grafico",
    linkLabel: "Ver projetos de design",
  },
  {
    color: "var(--signal-orange)",
    title: "Fotografia",
    desc: "Cobertura de eventos e produção still, com olhar de composição e narrativa.",
    icon: Camera,
    href: "#fotografia",
    linkLabel: "Ver projetos de fotografia",
  },
  {
    color: "var(--digital-blue)",
    title: "Vídeo & Motion",
    desc: "Roteiro, captação e edição — do conceito ao corte final, com motion quando a peça pede.",
    icon: Clapperboard,
    href: "#video-motion",
    linkLabel: "Ver vídeos e motion",
  },
  {
    color: "var(--neural-green)",
    title: "IA aplicada à imagem",
    desc: "Uso de ferramentas de IA generativa (imagem e vídeo) integradas ao processo criativo, acelerando produção sem perder direção de arte.",
    icon: Sparkles,
    href: "#contato",
    linkLabel: "Conversar sobre IA",
  },
];

function DisciplineCard({ discipline }: { discipline: Discipline }) {
  const { color, title, desc, href, linkLabel, icon: Icon } = discipline;
  const [flipped, setFlipped] = useState(false);
  const backId = useId();

  return (
    <div className="story-discipline-slot">
      <div className="story-discipline-card" data-flipped={flipped}>
        <button
          type="button"
          className="discipline-turn btn-icon-3d"
          aria-expanded={flipped}
          aria-controls={backId}
          aria-label={flipped ? `Voltar ao resumo de ${title}` : `Virar cartão de ${title}`}
          onClick={() => setFlipped(!flipped)}
        >
          <RotateCw size={17} aria-hidden="true" />
        </button>
        <div className="discipline-flip">
          <div className="discipline-face bg-surface ring-1 ring-black/5 rounded-2xl p-6 flex flex-col">
            <span className="button-orb size-10" style={{ backgroundColor: color }}>
              <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h3 className="font-display font-semibold text-ink text-xl mt-5">{title}</h3>
            <p className="font-body text-ink2 text-sm leading-relaxed mt-2">{desc}</p>
          </div>
          <div id={backId} className="discipline-face discipline-back">
            <a href={href} className="btn-3d" onClick={() => setFlipped(false)}>
              {linkLabel}
              <span className="button-orb">
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const featuredDesign = projects.find(({ slug }) => slug === "identidade-visual-chic-d-mais");
const featuredMotion = videoProjects.find(({ slug }) => slug === "arqcheck-sandy-gurgel");

function Index() {
  const { story, isAnimated, isPaused, toggleMarquee } = usePortfolioStory();
  useHeroLiquify(story);
  return (
    <div className="portfolio-home min-h-screen bg-surface text-ink font-body antialiased">
      <PortfolioHeader />

      <main ref={story} className="bg-surface">
        <div className="portfolio-story">
          <div id="sobre" className="story-about-anchor" aria-hidden="true" />
          <div className="portfolio-story-stage">
            <div className="hero-backdrop" aria-hidden="true" />
            <section className="portfolio-hero" aria-labelledby="hero-name">
              <div className="hero-panel portfolio-content">
                <h1 id="hero-name" className="hero-name">
                  Gabriel Gurgel
                </h1>
                <p className="hero-role">
                  // Designer
                  <br />
                  Dev front-end
                </p>
                <div className="hero-portrait-frame">
                  <img
                    src={profile}
                    alt="Retrato em preto e branco de Gabriel Gurgel"
                    width={1312}
                    height={1199}
                    fetchPriority="high"
                    className="hero-portrait"
                  />
                </div>
                <p className="sr-only">Intenção em cada detalhe</p>
                <div className="hero-marquee" aria-hidden="true">
                  <div className="hero-marquee-track">
                    <span>Intenção em cada detalhe</span>
                    <span>Intenção em cada detalhe</span>
                  </div>
                </div>
                {isAnimated && (
                  <button
                    type="button"
                    className="hero-marquee-toggle btn-icon-3d"
                    aria-label={
                      isPaused ? "Retomar animação do letreiro" : "Pausar animação do letreiro"
                    }
                    onClick={toggleMarquee}
                  >
                    {isPaused ? (
                      <Play size={16} aria-hidden="true" />
                    ) : (
                      <Pause size={16} aria-hidden="true" />
                    )}
                  </button>
                )}
                <ul className="hero-links" aria-label="Links de Gabriel">
                  <li>
                    <a href="https://github.com/gabrielgurgel7" className="btn-3d">
                      <Github size={15} aria-hidden="true" /> GitHub
                    </a>
                  </li>
                  <li>
                    <a href="https://wa.me/5585999022371" className="btn-3d">
                      <MessageCircle size={15} aria-hidden="true" /> WhatsApp
                    </a>
                  </li>
                  <li>
                    <a href="mailto:gabrielgurgel635@gmail.com" className="btn-3d">
                      <Mail size={15} aria-hidden="true" /> E-mail
                    </a>
                  </li>
                </ul>
              </div>
            </section>
            <section className="story-about" aria-labelledby="sobre-titulo">
              <div className="portfolio-content story-about-inner">
                <h2 id="sobre-titulo" className="story-about-title story-about-line">
                  Calma aí, deixa eu me apresentar.
                </h2>
                <p className="story-about-line">
                  Sou Gabriel Gurgel, ou Gab. Publicitário de formação, trabalho com imagem há mais
                  de cinco anos.
                </p>
                <p className="story-about-line">
                  Uso design, fotografia, vídeo e motion para dar identidade a cada história. A IA
                  generativa faz parte desse processo.
                </p>
                <p className="story-about-line">
                  <strong>Intenção em cada detalhe. Seja qual for a história.</strong>
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="chrome-line" />

        {/* FRENTES */}
        <section id="frentes" className="bg-surface2">
          <div className="portfolio-content circuit-content py-20 md:py-28">
            <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
              Frentes de atuação
            </p>
            <div className="story-disciplines-stage">
              <h2 className="story-disciplines-title" aria-label="Quatro formas de comunicar">
                {["Quatro", "formas", "de", "comunicar"].map((word) => (
                  <span key={word} className="story-disciplines-word" aria-hidden="true">
                    <span>{word}</span>
                  </span>
                ))}
              </h2>
              <div className="story-disciplines grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {disciplines.map((discipline) => (
                  <DisciplineCard key={discipline.title} discipline={discipline} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GALERIA */}
        <section id="galeria" className="bg-surface">
          <div className="flex flex-col gap-10 portfolio-content circuit-content py-20 md:py-28">
            <section aria-labelledby="featured-title">
              <h2
                id="featured-title"
                className="font-display font-semibold text-3xl md:text-4xl mb-8"
              >
                Projetos em destaque
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {featuredDesign && (
                  <Link
                    to="/projeto/$slug"
                    params={{ slug: featuredDesign.slug }}
                    className="story-feature"
                  >
                    <img
                      src={getProjectCover(featuredDesign.slug)}
                      alt=""
                      loading="lazy"
                      width={640}
                      height={360}
                    />
                    <div className="story-feature-copy">
                      <span>{featuredDesign.tag}</span>
                      <h3>{featuredDesign.title}</h3>
                      <p>
                        O monograma da Chic D+ ganha escala na vitrine e leva a identidade da marca
                        à rua.
                      </p>
                    </div>
                  </Link>
                )}
                {featuredMotion && (
                  <Link
                    to="/video/$slug"
                    params={{ slug: featuredMotion.slug }}
                    className="story-feature"
                  >
                    <div className="relative">
                      <img
                        src={getVideoCover(featuredMotion.slug)}
                        alt=""
                        loading="lazy"
                        width={640}
                        height={360}
                      />
                      <span className="button-orb absolute bottom-4 right-4">
                        <Play size={16} aria-hidden="true" />
                      </span>
                    </div>
                    <div className="story-feature-copy">
                      <span>{featuredMotion.tag}</span>
                      <h3>{featuredMotion.title}</h3>
                      <p>
                        Tipografia em movimento para apresentar o ArqCheck em um vídeo para
                        Instagram.
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            </section>
            <ProjectGallery />
          </div>
        </section>

        <div className="chrome-line" />

        <PortfolioToolbox />

        {/* CONTATO */}
        <section id="contato" className="portfolio-inverse">
          <div className="portfolio-content circuit-content py-24 md:py-32">
            <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
              Contato
            </p>
            <h2 className="font-display font-bold text-(--signal-white) text-balance leading-none text-4xl md:text-6xl lg:text-7xl mt-6 max-w-[16ch]">
              Bora conversar sobre o seu <span className="chrome-text">próximo projeto?</span>
            </h2>
            <div className="mt-12 flex flex-wrap gap-3">
              <a href="https://wa.me/5585999022371" className="btn-3d">
                WhatsApp
                <span className="button-orb">
                  <MessageCircle size={17} aria-hidden="true" />
                </span>
              </a>
              <a href="mailto:gabrielgurgel635@gmail.com" className="btn-3d">
                E-mail
                <span className="button-orb">
                  <Mail size={17} aria-hidden="true" />
                </span>
              </a>
              <a href="/cv-gabriel.pdf" download className="btn-3d">
                Baixar CV
                <span className="button-orb">
                  <Download size={17} aria-hidden="true" />
                </span>
              </a>
            </div>
          </div>
        </section>

        <footer className="portfolio-inverse">
          <div className="portfolio-content circuit-content py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-body text-xs text-(--interface-gray)">
              © 2026 Gabriel — Intenção em cada detalhe.
            </p>
            <p className="font-body text-xs text-(--interface-gray)">Portfólio · 2026</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
