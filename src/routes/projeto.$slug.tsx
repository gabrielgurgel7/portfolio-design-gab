import { ProjectCreativeCarousel } from "@/components/project-creative-carousel";
import { PortfolioHeader } from "@/components/portfolio-header";
import { useBudgetChat } from "@/lib/budget-chat-context";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProjectBySlug, projects } from "@/data/projects";
import { getProjectImages } from "@/data/project-images";

const SITE_URL = "https://portfolio-design-gab.vercel.app";
const OG_IMAGE_URL = `${SITE_URL}/og-cover.png`;

export const Route = createFileRoute("/projeto/$slug")({
  loader: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · Gabriel Gurgel` },
          { name: "description", content: loaderData.subtitle },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.subtitle },
          { property: "og:type", content: "article" },
          { property: "og:image", content: OG_IMAGE_URL },
        ]
      : [],
  }),
  component: ProjectPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="circuit-content text-center max-w-md">
        <h1 className="font-display font-bold text-ink text-3xl">Projeto não encontrado</h1>
        <p className="font-body text-ink2 mt-3">
          Esse projeto não existe ou foi removido da galeria.
        </p>
        <Link to="/" hash="galeria" className="btn-3d mt-8">
          Voltar para a galeria
          <span className="button-orb">
            <ArrowLeft className="size-4" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </div>
  ),
});

function ProjectPage() {
  const { openChat } = useBudgetChat();
  const project = Route.useLoaderData();
  const images = getProjectImages(project.slug);

  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <div className="min-h-screen bg-surface text-ink font-body antialiased">
      {/* NAV simplificada */}
      <PortfolioHeader detail />

      <main className="bg-surface">
        {/* CABEÇALHO DO PROJETO */}
        <section className="circuit-content mx-auto max-w-4xl px-6 pt-16 pb-10 md:pt-24 md:pb-14">
          <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
            {project.tag}
            {project.client ? ` · ${project.client}` : ""}
          </p>
          <h1 className="font-display font-bold text-ink text-balance leading-none text-4xl md:text-5xl lg:text-6xl mt-4 max-w-[24ch]">
            {project.title}
          </h1>
          <p className="font-body text-ink2 text-pretty mt-6 max-w-[52ch] text-lg md:text-xl leading-relaxed">
            {project.subtitle}
          </p>
          {project.description && (
            <p className="font-body text-ink2 text-pretty mt-4 max-w-[52ch] text-base leading-relaxed">
              {project.description}
            </p>
          )}
        </section>

        {/* IMAGENS DO PROJETO */}
        <section className="portfolio-content circuit-content pb-16 md:pb-20">
          {images.length > 0 ? (
            <ProjectCreativeCarousel key={project.slug} images={images} title={project.title} />
          ) : (
            <p className="font-body text-ink2 text-sm">
              Nenhuma imagem cadastrada para este projeto ainda.
            </p>
          )}
        </section>

        {/* CTA CONTEXTUAL */}
        <section className="portfolio-content circuit-content pb-20 md:pb-24">
          <div className="gallery-cta-banner">
            <div>
              <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
                Gostou desse projeto?
              </p>
              <p className="font-display text-2xl md:text-3xl font-semibold text-ink mt-2">
                Vamos criar algo nesse nível para a sua marca.
              </p>
            </div>
            <button
              type="button"
              className="btn-3d shrink-0"
              onClick={() => openChat({ service: "design", projectTitle: project.title })}
            >
              Orçar projeto parecido
              <span className="button-orb">
                <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </button>
          </div>
        </section>

        <div className="chrome-line" />

        {/* PRÓXIMO PROJETO */}
        {next && (
          <section className="bg-surface2">
            <Link
              to="/projeto/$slug"
              params={{ slug: next.slug }}
              className="group portfolio-content circuit-content py-16 md:py-20 flex items-center justify-between gap-6"
            >
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-accent">
                  Próximo projeto
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
