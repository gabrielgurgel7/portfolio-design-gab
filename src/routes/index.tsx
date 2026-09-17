import { createFileRoute, Link } from "@tanstack/react-router";
import profile from "@/assets/profile.png";
import { projects } from "@/data/projects";
import { getProjectCover } from "@/data/project-images";
import {
  ArrowUpRight,
  Palette,
  Camera,
  Clapperboard,
  Sparkles,
  Code2,
  MessageCircle,
  Mail,
  Download,
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

const disciplines = [
  {
    num: "01",
    title: "Design",
    desc: "Peças gráficas, social media e identidade visual, com direção de arte pensada pra cada contexto.",
    icon: Palette,
  },
  {
    num: "02",
    title: "Fotografia",
    desc: "Cobertura de eventos e produção still, com olhar de composição e narrativa.",
    icon: Camera,
  },
  {
    num: "03",
    title: "Vídeo & Motion",
    desc: "Roteiro, captação e edição — do conceito ao corte final, com motion quando a peça pede.",
    icon: Clapperboard,
  },
  {
    num: "04",
    title: "IA aplicada à imagem",
    desc: "Uso de ferramentas de IA generativa (imagem e vídeo) integradas ao processo criativo, acelerando produção sem perder direção de arte.",
    icon: Sparkles,
  },
];

const tools = [
  "Photoshop",
  "Illustrator",
  "Affinity",
  "Figma",
  "Canva",
  "CapCut",
  "Firefly",
  "Gemini",
];

function Index() {
  return (
    <div className="min-h-screen bg-surface text-ink font-body antialiased">
      {/* NAV */}
      <header className="sticky top-4 z-50 mx-auto w-[calc(100%-3rem)] max-w-6xl bg-surface/85 backdrop-blur-sm shadow-md rounded-full">
        <div className="flex px-4 py-4 items-center justify-between">
          <a href="#top" className="font-display font-bold text-xl tracking-tight text-ink">
            GAB<span className="text-accent">.</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink2">
            <a href="#sobre" className="hover:text-ink transition-colors">
              Sobre
            </a>
            <a href="#frentes" className="hover:text-ink transition-colors">
              Frentes
            </a>
            <a href="#galeria" className="hover:text-ink transition-colors">
              Galeria
            </a>
            <a href="#ferramentas" className="hover:text-ink transition-colors">
              Ferramentas
            </a>
          </nav>
          <a
            href="#contato"
            className="text-sm font-semibold text-ink ring-1 ring-ink/20 rounded-full px-4 py-2 hover:ring-ink/50 transition-colors"
          >
            Contato
          </a>
        </div>
      </header>

      <main id="top" className="bg-surface">
        {/* HERO */}
        <section className="bg-surface">
          <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
            <div className="grid md:grid-cols-12 gap-10 md:gap-8 items-center">
              <div className="md:col-span-7 fade-up">
                <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-ink2 mb-6">
                  Gabriel Gurgel · Especialista em imagem
                </p>
                <h1 className="font-display font-bold text-ink text-balance leading-none text-5xl md:text-6xl lg:text-7xl max-w-[20ch]">
                  Intenção em cada <span className="chrome-text">detalhe</span>. Seja qual for a
                  história.
                </h1>
                <p className="font-body text-ink2 text-pretty mt-8 max-w-[52ch] text-base md:text-lg leading-relaxed">
                  Crio soluções visuais que transformam ideias em comunicação clara, relevante e
                  memorável. Design, fotografia, vídeo e motion, unidos por conceito, direção e
                  consistência.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href="#contato"
                    className="btn-3d [--c:#ff5a1f] group inline-flex items-center gap-2 py-2 pr-6 pl-2 text-sm font-semibold text-white shadow-xl rounded-full hover:bg-accent/90 transition-transform"
                  >
                    <span className="grid place-items-center size-7 rounded-full">
                      <span className="text-[11px] font-bold text-ink bg-surface shrink-0 rounded-full">
                        <ArrowUpRight />
                      </span>
                    </span>
                    Fale comigo
                  </a>
                  <a
                    href="#galeria"
                    className="inline-flex items-center gap-2 py-2 pr-3 pl-3 text-sm font-semibold text-ink rounded-full ring-1 ring-ink/20 hover:ring-ink/50 transition-colors"
                  >
                    Ver galeria
                  </a>
                </div>
              </div>
              <div className="md:col-span-5 fade-up">
                <div className="relative">
                  <img
                    src={profile}
                    alt="Retrato de Gabriel, especialista em imagem"
                    width={1024}
                    height={1280}
                    className="w-full aspect-3/4 object-cover object-top rounded-2xl shadow-xl ring-1 ring-black/5"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="chrome-line" />

        {/* SOBRE */}
        <section id="sobre" className="bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-4">
                <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
                  Sobre mim
                </p>
                <h2 className="font-display font-semibold text-ink text-3xl md:text-4xl leading-tight mt-4 max-w-[20ch]">
                  Da ideia à tela.
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="font-body text-ink text-pretty text-lg md:text-xl leading-relaxed max-w-[45ch]">
                  Sou Gabriel Gurgel — <strong>ou Gab</strong>. Publicitário de formação, atuo há
                  mais de 5 anos com imagem em vários formatos: design, fotografia, vídeo e motion,
                  sempre pensando em contar uma história e como melhor se comunica com seu público,
                  gerando <i>identidade</i>.
                </p>
                <p className="font-body text-ink2 text-pretty text-base md:text-lg leading-relaxed max-w-[45ch] mt-5">
                  Acompanho de perto pra onde a criação de imagem está indo — incluindo o uso de IA
                  generativa (como Firefly, Gemini, e outras ferramentas inovadoras) como parte do
                  processo criativo, não como atalho. Gosto de entender como as coisas funcionam por
                  dentro, sempre atento aos detalhes. Acredito muito na força da personalidade, e
                  que isso é o motor que faz cada projeto único e agente de uma boa comunicação.
                </p>
                <p className="font-display font-semibold text-ink text-2xl mt-8 max-w-[28ch]">
                  Intenção em cada detalhe. <br />
                  Seja qual for a história.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="chrome-line" />

        {/* FRENTES */}
        <section id="frentes" className="bg-surface2">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
                  Frentes de atuação
                </p>
                <h2 className="font-display font-semibold text-ink text-3xl md:text-4xl leading-tight mt-4">
                  Quatro formas de comunicar
                </h2>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {disciplines.map((d) => {
                const Icon = d.icon;
                return (
                  <div
                    key={d.num}
                    className="bg-surface ring-1 ring-black/5 rounded-2xl p-6 flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <div className="size-10 rounded-lg chip-3d [--c:#e5e5ea] grid place-items-center text-ink font-bold text-sm">
                        {d.num}
                      </div>
                      <Icon className="size-5 text-ink2" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <h3 className="font-display font-semibold text-ink text-xl mt-5">{d.title}</h3>
                    <p className="font-body text-ink2 text-sm leading-relaxed mt-2">{d.desc}</p>
                    {d.link && (
                      <a
                        href={d.link.href}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent mt-3"
                      >
                        {d.link.label}
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* GALERIA */}
        <section id="galeria" className="bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
                  Galeria de criativos
                </p>
                <h2 className="font-display font-semibold text-ink text-3xl md:text-4xl leading-tight mt-4 max-w-[24ch]">
                  Trabalhos selecionados
                </h2>
              </div>
              <p className="hidden md:block font-body text-sm text-ink2 max-w-[28ch]">
                Uma folha de contato — cada frame colocado com intenção.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map((p) => {
                const cover = getProjectCover(p.slug);
                return (
                  <Link
                    key={p.slug}
                    to="/projeto/$slug"
                    params={{ slug: p.slug }}
                    className="group relative block overflow-hidden rounded-[min(1vw,12px)] ring-1 ring-black/5"
                  >
                    <figure className="m-0">
                      {cover && (
                        <img
                          src={cover}
                          alt={p.title}
                          width={1024}
                          height={1280}
                          loading="lazy"
                          className="w-full aspect-4/5 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
                          {p.tag}
                        </span>
                        <span className="block text-sm font-semibold text-white">{p.title}</span>
                      </figcaption>
                    </figure>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <div className="chrome-line" />

        {/* FERRAMENTAS */}
        <section id="ferramentas" className="bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
              Ferramentas
            </p>
            <h2 className="font-display font-semibold text-ink text-3xl md:text-4xl leading-tight mt-4 max-w-[24ch]">
              A caixa de ferramentas
            </h2>
            <ul className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-6">
              {tools.map((t) => (
                <li key={t} className="py-3 border-t border-ink/10 font-body text-ink font-medium">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CONTATO */}
        <section id="contato" className="bg-ink">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
              Contato
            </p>
            <h2 className="font-display font-bold text-surface text-balance leading-none text-4xl md:text-6xl lg:text-7xl mt-6 max-w-[16ch]">
              Bora conversar sobre o seu <span className="chrome-text">próximo projeto?</span>
            </h2>
            <div className="mt-12 flex flex-wrap gap-3">
              <a
                href="https://wa.me/5585999022371"
                className="btn-3d [--c:#ff5a1f] group inline-flex items-center gap-2 py-2 pr-6 pl-2 text-sm font-semibold text-white shadow-xl rounded-full hover:bg-accent/90 transition-transform"
              >
                <span className="grid place-items-center size-7 rounded-full shrink-0 bg-surface">
                  <MessageCircle className="size-3.5 text-ink" strokeWidth={2} />
                </span>
                WhatsApp
              </a>
              <a
                href="mailto:gabrielgurgel635@gmail.com"
                className="inline-flex items-center gap-2 py-2 pr-3 pl-2 text-sm font-semibold text-surface rounded-full ring-1 ring-surface/25 hover:ring-surface/60 transition-colors"
              >
                <span className="grid place-items-center size-7 rounded-full ring-1 ring-surface/40">
                  <Mail className="size-3.5" strokeWidth={2} />
                </span>
                E-mail
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 py-2 pr-3 pl-2 text-sm font-semibold text-surface rounded-full ring-1 ring-surface/25 hover:ring-surface/60 transition-colors"
              >
                <span className="grid place-items-center size-7 rounded-full ring-1 ring-surface/40">
                  <Download className="size-3.5" strokeWidth={2} />
                </span>
                Baixar CV
              </a>
            </div>
          </div>
        </section>

        <footer className="bg-ink">
          <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-body text-xs text-surface/50">
              © 2026 Gabriel — Intenção em cada detalhe.
            </p>
            <p className="font-body text-xs text-surface/50">Portfólio · 2026</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
