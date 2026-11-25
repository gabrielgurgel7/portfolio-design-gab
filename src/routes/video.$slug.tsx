import { PortfolioHeader } from "@/components/portfolio-header";
import { useBudgetChat } from "@/lib/budget-chat-context";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getVideoBySlug, getVideoCover, getVideoSrc, videoProjects } from "@/data/videos";

const SITE_URL = "https://portfolio-design-gab.vercel.app";
const OG_IMAGE_URL = `${SITE_URL}/og-cover.png`;

export const Route = createFileRoute("/video/$slug")({
  loader: ({ params }) => {
    const video = getVideoBySlug(params.slug);
    if (!video) throw notFound();
    return video;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · Gabriel Gurgel` },
          { name: "description", content: loaderData.subtitle },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.subtitle },
          { property: "og:type", content: "video.other" },
          {
            property: "og:image",
            content: getVideoCover(loaderData.slug)
              ? `${SITE_URL}${getVideoCover(loaderData.slug)}`
              : OG_IMAGE_URL,
          },
        ]
      : [],
  }),
  component: VideoPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="circuit-content text-center max-w-md">
        <h1 className="font-display font-bold text-ink text-3xl">Vídeo não encontrado</h1>
        <p className="font-body text-ink2 mt-3">Esse vídeo não existe ou foi removido da seção.</p>
        <Link to="/" hash="video-motion" className="btn-3d mt-8">
          <ArrowLeft className="size-4" />
          Voltar para os vídeos
        </Link>
      </div>
    </div>
  ),
});

function VideoPage() {
  const { openChat } = useBudgetChat();
  const video = Route.useLoaderData();

  const currentIndex = videoProjects.findIndex((v) => v.slug === video.slug);
  const next = videoProjects[(currentIndex + 1) % videoProjects.length];
  const targetService = video.tag === "Motion" ? ("motion" as const) : ("video" as const);

  return (
    <div className="min-h-screen bg-surface text-ink font-body antialiased">
      {/* NAV simplificada */}
      <PortfolioHeader detail />

      <main className="bg-surface">
        {/* CABEÇALHO DO VÍDEO */}
        <section className="circuit-content mx-auto max-w-4xl px-6 pt-16 pb-10 md:pt-24 md:pb-14">
          <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
            {video.tag}
            {video.client ? ` · ${video.client}` : ""}
          </p>
          <h1 className="font-display font-bold text-ink text-balance leading-none text-4xl md:text-5xl lg:text-6xl mt-4 max-w-[24ch]">
            {video.title}
          </h1>
          <p className="font-body text-ink2 text-pretty mt-6 max-w-[52ch] text-lg md:text-xl leading-relaxed">
            {video.subtitle}
          </p>
          {video.description && (
            <p className="font-body text-ink2 text-pretty mt-4 max-w-[52ch] text-base leading-relaxed">
              {video.description}
            </p>
          )}
        </section>

        {/* PLAYER DO VÍDEO */}
        <section className="circuit-content mx-auto max-w-3xl px-6 pb-16 md:pb-20">
          <video
            key={video.slug}
            src={getVideoSrc(video.slug)}
            poster={getVideoCover(video.slug)}
            controls
            playsInline
            preload="metadata"
            className="w-full rounded-2xl ring-1 ring-black/5 bg-black aspect-9/16 max-h-[80vh] mx-auto object-contain"
          >
            Seu navegador não suporta a reprodução deste vídeo.
          </video>
        </section>

        {/* CTA CONTEXTUAL */}
        <section className="portfolio-content circuit-content pb-20 md:pb-24">
          <div className="gallery-cta-banner">
            <div>
              <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
                Gostou desse resultado?
              </p>
              <p className="font-display text-2xl md:text-3xl font-semibold text-ink mt-2">
                Precisa de um vídeo ou motion nesse ritmo?
              </p>
            </div>
            <button
              type="button"
              className="btn-3d shrink-0"
              onClick={() => openChat({ service: targetService, projectTitle: video.title })}
            >
              Orçar vídeo ou motion
              <span className="button-orb">
                <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </button>
          </div>
        </section>

        <div className="chrome-line" />

        {/* PRÓXIMO VÍDEO */}
        {next && (
          <section className="bg-surface2">
            <Link
              to="/video/$slug"
              params={{ slug: next.slug }}
              className="group portfolio-content circuit-content py-16 md:py-20 flex items-center justify-between gap-6"
            >
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
                  Próximo vídeo
                </p>
                <h2 className="font-display font-semibold text-ink text-2xl md:text-3xl mt-3">
                  {next.title}
                </h2>
              </div>
              <span className="button-orb size-12">
                <ArrowLeft className="size-4 rotate-180" />
              </span>
            </Link>
          </section>
        )}
      </main>

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
    </div>
  );
}
