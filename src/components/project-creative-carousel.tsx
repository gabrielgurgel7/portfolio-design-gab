import { Maximize, Minimize, Pause, Play, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
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
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const multiple = images.length > 1;
  const carouselOptions = useRef({
    ...options,
    watchDrag: () => !container.current?.hasAttribute("data-zoomed"),
  });
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
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === node);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting === true),
      { threshold: 0.25 },
    );

    syncMotion();
    setCanFullscreen(document.fullscreenEnabled === true);
    document.addEventListener("fullscreenchange", syncFullscreen);
    syncTab();
    observer.observe(node);
    motion.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncTab);
    return () => {
      observer.disconnect();
      document.removeEventListener("fullscreenchange", syncFullscreen);
      motion.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncTab);
    };
  }, []);

  useEffect(() => {
    if (!api) return;
    const reset = () => {
      setActive(api.selectedScrollSnap());
      setZoom(1);
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
    if (!node || !api || !playing || !visible || !tabVisible || dragging || zoom > 1) return;

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
  }, [api, dragging, playing, tabVisible, visible, zoom]);

  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    node.scrollLeft = (node.scrollWidth - node.clientWidth) / 2;
    node.scrollTop = (node.scrollHeight - node.clientHeight) / 2;
  }, [active, zoom, fullscreen]);

  const toggleFullscreen = () => {
    if (fullscreen) void document.exitFullscreen().catch(() => {});
    else void container.current?.requestFullscreen().catch(() => {});
  };

  function startPan(event: PointerEvent<HTMLDivElement>) {
    if (zoom === 1 || event.pointerType !== "mouse" || event.button !== 0) return;
    const node = event.currentTarget;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      left: node.scrollLeft,
      top: node.scrollTop,
    };
    node.setPointerCapture(event.pointerId);
  }

  function pan(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    event.currentTarget.scrollLeft = drag.current.left + drag.current.x - event.clientX;
    event.currentTarget.scrollTop = drag.current.top + drag.current.y - event.clientY;
  }

  function imageFrame(src: string, index: number) {
    const current = index === active;
    return (
      <div
        ref={current ? viewport : undefined}
        className="creative-carousel-viewport"
        data-zoomed={current && zoom > 1 ? "" : undefined}
        data-carousel-ignore-keys={current && zoom > 1 ? "" : undefined}
        tabIndex={current && zoom > 1 ? 0 : undefined}
        aria-label={current && zoom > 1 ? "Imagem ampliada, use as setas para explorar" : undefined}
        onPointerDown={startPan}
        onPointerMove={pan}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
        style={{ "--creative-zoom": current ? zoom : 1 } as CSSProperties}
      >
        <img
          src={src}
          alt={multiple ? `${title} — imagem ${index + 1}` : title}
          loading={index < 2 || current ? "eager" : "lazy"}
          draggable={false}
          className="creative-carousel-image"
        />
      </div>
    );
  }

  return (
    <div
      ref={container}
      className="creative-carousel mx-auto max-w-2xl"
      data-zoomed={zoom > 1 ? "" : undefined}
    >
      {multiple ? (
        <Carousel
          opts={carouselOptions.current}
          setApi={setApi}
          aria-label={title}
          aria-roledescription="carrossel"
          tabIndex={0}
        >
          <CarouselContent
            className={`creative-carousel-track ml-0 ${zoom === 1 ? "touch-pan-y touch-pinch-zoom" : ""}`}
          >
            {images.map((src, index) => (
              <CarouselItem
                key={src}
                aria-label={`Slide ${index + 1} de ${images.length}`}
                aria-roledescription="slide"
                aria-hidden={index !== active}
                className="pl-0"
              >
                {imageFrame(src, index)}
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
      ) : (
        <div className="creative-carousel-single">{images[0] && imageFrame(images[0], 0)}</div>
      )}
      <div className="creative-carousel-controls">
        {multiple && (
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
        )}
        <div
          className="creative-carousel-toolbar"
          role="group"
          aria-label="Controles de visualização"
        >
          {multiple && (
            <button
              type="button"
              className="btn-icon-3d"
              aria-label={playing ? "Pausar reprodução automática" : "Ativar reprodução automática"}
              onClick={() => setPlaying((current) => !current)}
            >
              {playing ? (
                <Pause size={16} aria-hidden="true" />
              ) : (
                <Play size={16} aria-hidden="true" />
              )}
            </button>
          )}
          <button
            type="button"
            className="btn-icon-3d"
            aria-label="Reduzir zoom"
            disabled={zoom <= 1}
            onClick={() => setZoom((current) => Math.max(1, current - 0.5))}
          >
            <ZoomOut size={17} aria-hidden="true" />
          </button>
          <output aria-label="Nível de zoom" aria-live="polite">
            {zoom * 100}%
          </output>
          <button
            type="button"
            className="btn-icon-3d"
            aria-label="Aumentar zoom"
            disabled={zoom >= 3}
            onClick={() => setZoom((current) => Math.min(3, current + 0.5))}
          >
            <ZoomIn size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn-icon-3d"
            aria-label="Restaurar zoom"
            disabled={zoom === 1}
            onClick={() => setZoom(1)}
          >
            <RotateCcw size={16} aria-hidden="true" />
          </button>
          {canFullscreen && (
            <button
              type="button"
              className="btn-icon-3d"
              aria-label={fullscreen ? "Sair da tela cheia" : "Abrir em tela cheia"}
              onClick={toggleFullscreen}
            >
              {fullscreen ? (
                <Minimize size={17} aria-hidden="true" />
              ) : (
                <Maximize size={17} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
