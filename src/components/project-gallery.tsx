import { Link } from "@tanstack/react-router";
import { Play, X } from "lucide-react";
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
] as const;

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
          {visible.map(({ slug, title, tag, client }) => {
            const isVideo = route === "/video/$slug";
            const cover = isVideo ? getVideoCover(slug) : getProjectCover(slug);

            return (
              <CarouselItem
                key={slug}
                aria-roledescription="projeto"
                className="flex basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Link to={route} params={{ slug }} className="project-folder">
                  <span className="project-folder-cover">
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
                    <span className="project-folder-title">
                      {isVideo && <Play size={17} aria-hidden="true" />}
                      {title}
                    </span>
                  </span>
                  <span className="project-folder-tags">
                    <span>{tag}</span>
                    {client && <span>{client}</span>}
                  </span>
                </Link>
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
