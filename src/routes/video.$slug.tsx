import { PortfolioHeader } from "@/components/portfolio-header";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getVideoBySlug, getVideoCover, getVideoSrc, videoProjects } from "@/data/videos";

export const Route = createFileRoute("/video/$slug")({
  loader: ({ params }) => {
    const video = getVideoBySlug(params.slug);
    if (!video) throw notFound();
    return video;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · Gabriel · Especialista em imagem` },
          { name: "description", content: loaderData.subtitle },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.subtitle },
          { property: "og:type", content: "video.other" },
        ]
      : [],
  }),
  component: VideoPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-display font-bold text-ink text-3xl">Vídeo não encontrado</h1>
        <p className="font-body text-ink2 mt-3">Esse vídeo não existe ou foi removido da seção.</p>
        <Link to="/" hash="video-e-motion" className="btn-3d mt-8">
          <ArrowLeft className="size-4" />
          Voltar para os vídeos
        </Link>
      </div>
    </div>
  ),
});

function VideoPage() {
  const video = Route.useLoaderData();

  // Vídeo anterior/próximo, para navegação sequencial ao final da página
  const currentIndex = videoProjects.findIndex((v) => v.slug === video.slug);
  const next = videoProjects[(currentIndex + 1) % videoProjects.length];

  return (
    <div className="min-h-screen bg-surface text-ink font-body antialiased">
      {/* NAV simplificada */}
      <PortfolioHeader detail />

      <main className="bg-surface">
        {/* CABEÇALHO DO VÍDEO */}
        <section className="mx-auto max-w-4xl px-6 pt-16 pb-10 md:pt-24 md:pb-14">
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
        <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-28">
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

        <div className="chrome-line" />

        {/* PRÓXIMO VÍDEO */}
        <section className="bg-surface2">
          <Link
            to="/video/$slug"
            params={{ slug: next.slug }}
            className="group portfolio-content py-16 md:py-20 flex items-center justify-between gap-6"
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
      </main>

      <footer className="portfolio-inverse">
        <div className="portfolio-content py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-(--interface-gray)">
            © 2026 Gabriel — Intenção em cada detalhe.
          </p>
          <p className="font-body text-xs text-(--interface-gray)">Portfólio · 2026</p>
        </div>
      </footer>
    </div>
  );
}
