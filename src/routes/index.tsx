import { useId, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import profile from "@/assets/profile-cutout.png";
import { useHeroLiquify } from "@/hooks/use-hero-liquify";
import { usePortfolioStory } from "@/hooks/use-portfolio-story";
import { ProjectGallery } from "@/components/project-gallery";
import { PortfolioToolbox } from "@/components/portfolio-toolbox";
import { PortfolioHeader } from "@/components/portfolio-header";
import { type BudgetService, useBudgetChat } from "@/lib/budget-chat-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { projects } from "@/data/projects";
import { getProjectCover } from "@/data/project-images";
import { getVideoCover, videoProjects } from "@/data/videos";
import { webProjects } from "@/data/web-projects";
import {
  ArrowUpRight,
  RotateCw,
  Palette,
  Clapperboard,
  Sparkles,
  Code2,
  Play,
  Pause,
  MessageCircle,
  Mail,
} from "lucide-react";

const SITE_URL = "https://portfolio-design-gab.vercel.app";
const OG_IMAGE_URL = `${SITE_URL}/og-cover.png`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Gabriel Gurgel · Sites Front-end, Motion Design, Design & Vídeo",
      },
      {
        name: "description",
        content:
          "Portfólio de Gabriel Gurgel: sites front-end, motion design, identidade visual e edição de vídeo sob medida para marcas, empreendedores e agências.",
      },
      {
        property: "og:title",
        content: "Gabriel Gurgel · Sites Front-end, Motion Design, Design & Vídeo",
      },
      {
        property: "og:description",
        content:
          "Sua marca com visual de alto nível — do design ao site e ao vídeo. Orçamento sob medida para marcas, empreendedores e agências.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: OG_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
  }),
  component: Index,
});

type Discipline = {
  service: BudgetService;
  color: string;
  title: string;
  desc: string;
  icon: typeof Palette;
  href: string;
  linkLabel: string;
  quoteLabel: string;
};

const disciplines: Discipline[] = [
  {
    service: "site",
    color: "var(--digital-blue)",
    title: "Sites & Front-end",
    desc: "Landing pages, portfólios e interfaces web rápidas, responsivas e pensadas para converter.",
    icon: Code2,
    href: "#sites-dev-web",
    linkLabel: "Ver sites",
    quoteLabel: "Orçar site",
  },
  {
    service: "motion",
    color: "var(--digital-violet)",
    title: "Motion Design",
    desc: "Vinhetas, tipografia cinética e animações que dão ritmo, impacto e clareza à sua marca.",
    icon: Sparkles,
    href: "#video-motion",
    linkLabel: "Ver motion",
    quoteLabel: "Orçar motion",
  },
  {
    service: "design",
    color: "var(--neural-green)",
    title: "Identidade Visual & Design",
    desc: "Identidades visuais, campanhas e social media com direção de arte consistente.",
    icon: Palette,
    href: "#design-grafico",
    linkLabel: "Ver design",
    quoteLabel: "Orçar design",
  },
  {
    service: "video",
    color: "var(--signal-orange)",
    title: "Edição de Vídeo",
    desc: "Vídeos institucionais, reels e depoimentos com ritmo narrativo, do conceito ao corte final.",
    icon: Clapperboard,
    href: "#video-motion",
    linkLabel: "Ver vídeos",
    quoteLabel: "Orçar vídeo",
  },
];

const brands = [
  "UNI7",
  "Sandy Gurgel Arquitetura",
  "Chic D+",
  "Ótica Gênesis",
  "Educando para Deus",
  "Bytebank",
];

const proofMetrics = [
  { value: "+5 anos", label: "atuando com imagem, design e digital" },
  { value: "4 frentes", label: "integradas — do conceito ao código e à tela" },
  { value: "Remoto", label: "atendimento para marcas e agências em todo o Brasil" },
];

const processSteps = [
  {
    step: "01",
    title: "Alinhamento rápido",
    desc: "Você responde 3 perguntas rápidas no chat de orçamento; eu avalio o escopo e respondo com clareza em até 1 dia útil.",
  },
  {
    step: "02",
    title: "Direção criativa e produção",
    desc: "Construo layout, código, motion ou edição com pontos de validação objetivos, sem ruído entre fornecedores.",
  },
  {
    step: "03",
    title: "Entrega pronta para publicar",
    desc: "Arquivos organizados, site no ar ou vídeos exportados no formato exato de cada canal.",
  },
];

const faqs = [
  {
    q: "Qual é o prazo médio para um site ou motion?",
    a: "Landing pages e peças de motion curtas costumam levar de 1 a 2 semanas após o alinhamento inicial. Projetos maiores (sites multi-página ou pacotes completos) têm cronograma fechado já na proposta.",
  },
  {
    q: "Como funcionam as revisões durante o projeto?",
    a: "Trabalho com etapas claras de aprovação (estrutura/roteiro antes da finalização) e rodadas de ajuste incluídas no orçamento para você aprovar com segurança.",
  },
  {
    q: "Você atende empresas, agências e outros profissionais?",
    a: "Sim. Atendo diretamente empreendedores e PMEs e também atuo como braço de front-end, design ou motion para agências e estúdios sob demanda.",
  },
  {
    q: "Como funciona o investimento e o pagamento?",
    a: "Cada projeto tem proposta fechada de acordo com o escopo e o prazo. Em geral, trabalhamos com 50% na aprovação para iniciar e 50% na entrega final.",
  },
];

function DisciplineCard({
  discipline,
  onQuote,
}: {
  discipline: Discipline;
  onQuote: (service: BudgetService) => void;
}) {
  const { service, color, title, desc, href, linkLabel, quoteLabel, icon: Icon } = discipline;
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
            <p className="font-body text-ink2 text-sm leading-relaxed mt-2 flex-1">{desc}</p>
            <a href={href} className="discipline-front-cta mt-5">
              {linkLabel}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div id={backId} className="discipline-face discipline-back">
            <div className="flex flex-col items-center gap-3 w-full px-2">
              <a href={href} className="btn-3d" onClick={() => setFlipped(false)}>
                {linkLabel}
                <span className="button-orb">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </a>
              <button
                type="button"
                className="discipline-quote-btn"
                onClick={() => {
                  setFlipped(false);
                  onQuote(service);
                }}
              >
                {quoteLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const featuredWeb = webProjects.find(({ slug }) => slug === "soloist");
const featuredMotion = videoProjects.find(({ slug }) => slug === "arqcheck-sandy-gurgel");
const featuredDesign = projects.find(({ slug }) => slug === "identidade-visual-chic-d-mais");

function Index() {
  const { openChat } = useBudgetChat();
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
                <p className="hero-name">Gabriel Gurgel</p>
                <p className="hero-role">
                  // Sites · Motion
                  <br />
                  Design · Vídeo
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
                <div className="hero-pitch">
                  <h1 id="hero-name" className="hero-headline">
                    Sua marca com visual de alto nível — do design ao site e ao vídeo.
                  </h1>
                  <p className="hero-subheadline">
                    Sites front-end, motion design, identidade visual e edição de vídeo sob medida
                    para marcas, empreendedores e agências.
                  </p>
                  <div className="hero-actions">
                    <button type="button" className="btn-3d" onClick={() => openChat()}>
                      Pedir orçamento
                      <span className="button-orb">
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </span>
                    </button>
                    <a href="#galeria" className="hero-cta-secondary">
                      Ver projetos
                    </a>
                  </div>
                  <p className="hero-availability">Agenda aberta para novos projetos freelance</p>
                </div>
              </div>
            </section>
            <section className="story-about" aria-labelledby="sobre-titulo">
              <div className="portfolio-content story-about-inner">
                <h2 id="sobre-titulo" className="story-about-title story-about-line">
                  Calma aí, deixa eu me apresentar.
                </h2>
                <p className="story-about-line">
                  Sou Gabriel Gurgel, ou Gab. Publicitário, designer e dev front-end há mais de
                  cinco anos.
                </p>
                <p className="story-about-line">
                  Crio sites, motion design, identidades visuais e vídeos — com IA generativa
                  integrada ao processo.
                </p>
                <p className="story-about-line">
                  <strong>Intenção em cada detalhe. Do conceito ao código e à tela.</strong>
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
                  <DisciplineCard
                    key={discipline.title}
                    discipline={discipline}
                    onQuote={(service) => openChat({ service })}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GALERIA */}
        <section id="galeria" className="bg-surface">
          <div className="flex flex-col gap-12 portfolio-content circuit-content py-20 md:py-28">
            <div className="proof-strip" aria-label="Marcas atendidas e experiência">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
                  Marcas e projetos atendidos
                </p>
                <ul className="proof-brands">
                  {brands.map((brand) => (
                    <li key={brand} className="proof-brand-pill">
                      {brand}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="proof-metrics mt-6 grid gap-4 sm:grid-cols-3">
                {proofMetrics.map((item) => (
                  <div key={item.value} className="proof-metric-card">
                    <span className="font-display text-2xl font-bold text-ink">{item.value}</span>
                    <span className="font-body text-sm text-ink2">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <section aria-labelledby="featured-title">
              <h2
                id="featured-title"
                className="font-display font-semibold text-3xl md:text-4xl mb-8"
              >
                Projetos em destaque
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {featuredWeb && (
                  <a
                    href={featuredWeb.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="story-feature"
                  >
                    <img
                      src={`/capas-web/${featuredWeb.slug}/desktop.webp`}
                      alt={`Prévia do projeto ${featuredWeb.title}`}
                      loading="lazy"
                      width={640}
                      height={360}
                    />
                    <div className="story-feature-copy">
                      <span>{featuredWeb.tag}</span>
                      <h3>{featuredWeb.title}</h3>
                      <p>{featuredWeb.subtitle}</p>
                    </div>
                  </a>
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
              </div>
            </section>
            <ProjectGallery />

            <div className="gallery-cta-banner">
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
                  Próximo passo
                </p>
                <p className="font-display text-2xl md:text-3xl font-semibold text-ink mt-2">
                  Quer tirar um site, motion ou identidade visual do papel?
                </p>
              </div>
              <button type="button" className="btn-3d shrink-0" onClick={() => openChat()}>
                Pedir orçamento
                <span className="button-orb">
                  <ArrowUpRight size={17} aria-hidden="true" />
                </span>
              </button>
            </div>
          </div>
        </section>

        <div className="chrome-line" />

        <PortfolioToolbox />

        {/* PROCESSO + FAQ */}
        <section id="processo" className="bg-surface2" aria-labelledby="process-title">
          <div className="portfolio-content circuit-content py-20 md:py-28">
            <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
              Processo e dúvidas
            </p>
            <h2
              id="process-title"
              className="font-display font-semibold text-ink text-3xl md:text-4xl mt-3"
            >
              Como funciona trabalhar comigo
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {processSteps.map((item) => (
                <div key={item.step} className="process-card">
                  <span className="process-step-number">{item.step}</span>
                  <h3 className="font-display font-semibold text-ink text-xl mt-3">{item.title}</h3>
                  <p className="font-body text-ink2 text-sm leading-relaxed mt-2">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 max-w-3xl">
              <h3 className="font-display font-semibold text-ink text-xl md:text-2xl mb-4">
                Perguntas frequentes
              </h3>
              <Accordion type="single" collapsible className="faq-accordion">
                {faqs.map((item, index) => (
                  <AccordionItem key={item.q} value={`faq-${index}`} className="faq-item">
                    <AccordionTrigger className="font-display text-base font-semibold text-ink hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-sm leading-relaxed text-ink2">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* FECHAMENTO */}
        <section className="portfolio-inverse" aria-labelledby="closing-title">
          <div className="portfolio-content circuit-content py-20 md:py-24 flex flex-col items-start gap-6">
            <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
              Vamos conversar
            </p>
            <h2
              id="closing-title"
              className="font-display font-bold text-(--signal-white) text-balance leading-none text-4xl md:text-5xl lg:text-6xl max-w-[16ch]"
            >
              Bora tirar o seu <span className="chrome-text">próximo projeto</span> do papel?
            </h2>
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <button type="button" className="btn-3d" onClick={() => openChat()}>
                Abrir chat de orçamento
                <span className="button-orb">
                  <MessageCircle size={17} aria-hidden="true" />
                </span>
              </button>
              <a
                href="mailto:gabrielgurgel635@gmail.com"
                className="inline-flex items-center gap-2 text-sm font-semibold text-(--interface-gray) hover:text-(--electric-lime)"
              >
                <Mail size={15} aria-hidden="true" />
                Prefere e-mail? gabrielgurgel635@gmail.com
              </a>
            </div>
          </div>
        </section>

        <footer className="portfolio-inverse border-t border-white/10">
          <div className="portfolio-content circuit-content py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-(--interface-gray)">
              © 2026 Gabriel Gurgel — Intenção em cada detalhe.
            </p>
            <nav aria-label="Links diretos" className="flex flex-wrap items-center gap-5 text-xs">
              <a
                href="https://wa.me/5585999022371"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                WhatsApp
              </a>
              <a href="mailto:gabrielgurgel635@gmail.com" className="footer-link">
                E-mail
              </a>
            </nav>
          </div>
        </footer>
      </main>
    </div>
  );
}
