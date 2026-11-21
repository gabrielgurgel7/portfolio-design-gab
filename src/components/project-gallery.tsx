import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
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

export function ProjectGallery() {
  return groups.map(({ id, title, route, items }) => (
    <section key={id} aria-labelledby={id}>
      <h2 id={id} className="font-display font-semibold text-3xl md:text-4xl mb-5">
        {title}
      </h2>
      <Carousel opts={{ align: "start" }} aria-label={title} aria-roledescription="carrossel">
        <CarouselContent className="touch-pan-y py-1">
          {items.map(({ slug, title, tag, client }) => {
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
  ));
}
