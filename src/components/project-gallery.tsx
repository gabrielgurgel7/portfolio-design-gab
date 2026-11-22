import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Play, X } from "lucide-react";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getProjectCover } from "@/data/project-images";
import { projects } from "@/data/projects";
import { webProjects } from "@/data/web-projects";
import { getVideoCover, getVideoSrc, videoProjects } from "@/data/videos";

const groups = [
  {
    id: "design-grafico",
    title: "Design gráfico",
    route: "/projeto/$slug",
    items: projects.filter((project) => project.tag !== "Fotografia"),
  },
  {
    id: "fotografia",
    title: "Fotografia",
    route: "/projeto/$slug",
    items: projects.filter((project) => project.tag === "Fotografia"),
  },
  {
    id: "video-motion",
    title: "Vídeo & Motion",
    route: "/video/$slug",
    items: videoProjects,
  },
  {
    id: "sites-dev-web",
    title: "Sites e Dev Web",
    route: null,
    items: webProjects,
  },
] as const;

const screenSizes = [
  { device: "desktop", width: 1280, height: 800 },
  { device: "tablet", width: 768, height: 1024 },
  { device: "mobile", width: 390, height: 844 },
] as const;

function WebProjectScreens({ slug }: { slug: string }) {
  return (
    <span
      className="web-project-screens"
      role="img"
      aria-label="Visualizações em desktop, tablet e celular"
    >
      {screenSizes.map(({ device, width, height }) => (
        <span key={device} className={`web-project-device web-project-device-${device}`}>
          <img
            src={`/capas-web/${slug}/${device}.webp`}
            alt=""
            width={width}
            height={height}
            loading="lazy"
          />
        </span>
      ))}
    </span>
  );
}

const controlClass = "top-[42%] z-10 size-11 disabled:invisible";

type GalleryGroup = (typeof groups)[number];

function ProjectGalleryGroup({ id, title, route, items }: GalleryGroup) {
  const [selected, setSelected] = useState<string[]>([]);
  const tags = Array.from(new Set(items.map(({ tag }) => tag)));
  const visible = selected.length ? items.filter((item) => selected.includes(item.tag)) : items;

  function toggleFilter(tag: string) {
    setSelected((current) =>
      current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag].sort(),
    );
  }

  return (
    <section aria-labelledby={id}>
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <h2 id={id} className="font-display font-semibold text-3xl md:text-4xl">
          {title}
        </h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label={`Filtros de ${title}`}>
          {tags.map((tag) => {
            const active = selected.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                className="gallery-filter"
                aria-pressed={active}
                onClick={() => toggleFilter(tag)}
              >
                {tag}
                {active && <X size={14} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
        <p className="sr-only" role="status">
          {visible.length} {visible.length === 1 ? "projeto exibido" : "projetos exibidos"}
        </p>
      </div>
      <Carousel
        key={selected.join("|")}
        opts={{ align: "start" }}
        aria-label={title}
        aria-roledescription="carrossel"
      >
        <CarouselContent className="touch-pan-y py-1">
          {visible.map((item) => {
            const { slug, title, tag } = item;
            const isVideo = route === "/video/$slug";
            const external = "url" in item ? item.url : undefined;
            const cover = external
              ? undefined
              : isVideo
                ? getVideoCover(slug)
                : getProjectCover(slug);
            const content = (
              <>
                <span
                  className={
                    external ? "project-folder-cover project-folder-web" : "project-folder-cover"
                  }
                >
                  {cover ? (
                    <img src={cover} alt="" loading="lazy" width={640} height={500} />
                  ) : isVideo ? (
                    <video
                      src={getVideoSrc(slug)}
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    />
                  ) : null}
                  {external ? (
                    <>
                      <span className="web-project-title">{title}</span>
                      <WebProjectScreens slug={slug} />
                    </>
                  ) : (
                    <span className="project-folder-title">
                      {isVideo && <Play size={17} aria-hidden="true" />}
                      {title}
                    </span>
                  )}
                </span>
                <span className="project-folder-tags">
                  <span>{tag}</span>
                  {"client" in item && item.client && <span>{item.client}</span>}
                  {external && (
                    <span className="inline-flex items-center gap-1">
                      Abrir site <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  )}
                </span>
              </>
            );

            return (
              <CarouselItem
                key={slug}
                aria-roledescription="projeto"
                className="flex basis-full sm:basis-1/2 lg:basis-1/3"
              >
                {external ? (
                  <a
                    href={external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-folder"
                  >
                    {content}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                ) : route ? (
                  <Link to={route} params={{ slug }} className="project-folder">
                    {content}
                  </Link>
                ) : null}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious
          variant="portfolio"
          className={`left-2 ${controlClass}`}
          aria-label={`Anterior em ${title}`}
        />
        <CarouselNext
          variant="portfolio"
          className={`right-2 ${controlClass}`}
          aria-label={`Próximo em ${title}`}
        />
      </Carousel>
    </section>
  );
}

export function ProjectGallery() {
  return groups
    .filter((group) => group.items.length > 0)
    .map((group) => <ProjectGalleryGroup key={group.id} {...group} />);
}
