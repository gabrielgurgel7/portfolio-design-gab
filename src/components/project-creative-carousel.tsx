import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slideDuration = 6500;
const options = {
  loop: true,
  breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } },
};
const arrowClass = "top-[42%] z-10 size-11 disabled:invisible";

export function ProjectCreativeCarousel({ images, title }: { images: string[]; title: string }) {
  const container = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setPlaying(!motion.matches);
    const syncTab = () => setTabVisible(!document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting === true),
      { threshold: 0.25 },
    );

    syncMotion();
    syncTab();
    observer.observe(node);
    motion.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncTab);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncTab);
    };
  }, []);

  useEffect(() => {
    if (!api) return;
    const reset = () => {
      setActive(api.selectedScrollSnap());
      elapsed.current = 0;
      container.current?.style.setProperty("--slide-progress", "0");
    };
    const startDrag = () => setDragging(true);
    const endDrag = () => setDragging(false);

    reset();
    api.on("select", reset).on("reInit", reset);
    api.on("pointerDown", startDrag).on("pointerUp", endDrag);
    return () => {
      api.off("select", reset).off("reInit", reset);
      api.off("pointerDown", startDrag).off("pointerUp", endDrag);
    };
  }, [api]);

  useEffect(() => {
    const node = container.current;
    if (!node || !api || !playing || !visible || !tabVisible || dragging) return;

    let frame: number;
    let lastTime: number | undefined;
    const update = (time: number) => {
      if (lastTime !== undefined) elapsed.current += time - lastTime;
      lastTime = time;
      if (elapsed.current >= slideDuration) {
        elapsed.current = 0;
        api.scrollNext();
      }
      node.style.setProperty("--slide-progress", String(elapsed.current / slideDuration));
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [api, dragging, playing, tabVisible, visible]);

  return (
    <div ref={container} className="creative-carousel mx-auto max-w-2xl">
      <Carousel
        opts={options}
        setApi={setApi}
        aria-label={title}
        aria-roledescription="carrossel"
        tabIndex={0}
      >
        <CarouselContent className="creative-carousel-track ml-0 touch-pan-y touch-pinch-zoom">
          {images.map((src, index) => (
            <CarouselItem
              key={src}
              aria-label={`Slide ${index + 1} de ${images.length}`}
              aria-roledescription="slide"
              aria-hidden={index !== active}
              className="pl-0"
            >
              <img
                src={src}
                alt={`${title} — imagem ${index + 1}`}
                loading={index < 2 || index === active ? "eager" : "lazy"}
                draggable={false}
                className="creative-carousel-image"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="portfolio"
          className={`left-2 ${arrowClass}`}
          aria-label="Slide anterior"
        />
        <CarouselNext
          variant="portfolio"
          className={`right-2 ${arrowClass}`}
          aria-label="Próximo slide"
        />
      </Carousel>
      <div className="creative-carousel-controls">
        <div className="creative-carousel-dots" aria-label="Escolher slide">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className="creative-carousel-dot"
              aria-label={`Ir para o slide ${index + 1}`}
              aria-current={active === index ? "true" : undefined}
              onClick={() => api?.scrollTo(index)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn-icon-3d"
          aria-label={playing ? "Pausar reprodução automática" : "Ativar reprodução automática"}
          onClick={() => setPlaying((current) => !current)}
        >
          {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
