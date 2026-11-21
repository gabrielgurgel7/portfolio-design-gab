import { enableSmoothWheelScroll } from "@/lib/smooth-wheel-scroll";
import { useEffect, useRef, useState } from "react";

export function usePortfolioStory() {
  const story = useRef<HTMLElement>(null);
  const marquee = useRef<gsap.core.Tween | null>(null);
  const paused = useRef(false);
  const visible = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const root = story.current;
    const scene = root?.querySelector<HTMLElement>(".portfolio-story");
    const stage = scene?.querySelector<HTMLElement>(".portfolio-story-stage");
    const backdrop = stage?.querySelector<HTMLElement>(".hero-backdrop");
    const hero = stage?.querySelector<HTMLElement>(".portfolio-hero");
    const panel = hero?.querySelector<HTMLElement>(".hero-panel");
    const portrait = panel?.querySelector<HTMLElement>(".hero-portrait-frame");
    const track = panel?.querySelector<HTMLElement>(".hero-marquee-track");
    const lines = stage?.querySelectorAll<HTMLElement>(".story-about-line");
    const aboutAnchor = scene?.querySelector<HTMLElement>("#sobre");
    if (
      !root ||
      !scene ||
      !stage ||
      !backdrop ||
      !hero ||
      !panel ||
      !portrait ||
      !track ||
      !lines?.length ||
      !aboutAnchor
    ) {
      return;
    }

    let disposed = false;
    let media: ReturnType<typeof gsap.matchMedia> | undefined;

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }, { ScrollToPlugin }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/ScrollToPlugin"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

      media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const loop = gsap.to(track, {
          xPercent: -50,
          duration: 19,
          ease: "none",
          repeat: -1,
          paused: true,
        });
        marquee.current = loop;
        setIsAnimated(true);

        const speed = gsap.quickTo(loop, "timeScale", { duration: 0.25 });
        const settle = gsap.delayedCall(0.13, () => speed(1)).pause();
        scene.classList.add("portfolio-story-animated");
        const entering = { y: 44, opacity: 0, filter: "blur(10px)" };
        const centered = { y: 0, opacity: 1, filter: "blur(0px)" };
        const leaving = { y: -44, opacity: 0, filter: "blur(10px)" };
        gsap.set(lines, entering);

        const sequence = gsap.timeline({
          defaults: { duration: 0.65, ease: "power1.inOut" },
          paused: true,
        });
        sequence
          .fromTo(backdrop, { "--hero-expansion": 0 }, { "--hero-expansion": 1, duration: 1.2 })
          .to(portrait, { autoAlpha: 0, duration: 0.72 }, 0.13)
          .to(hero, { y: () => -stage.clientHeight * 0.36, autoAlpha: 0, duration: 0.95 }, 1.2);

        const aboutStart = sequence.duration();

        lines.forEach((line, index) => {
          const entry = aboutStart + index * 1.3;
          sequence.to(line, centered, entry);
          if (index < lines.length - 1) {
            sequence.to(line, leaving, entry + 0.95);
          }
        });

        // Hold the last line at the center before the stage leaves with the page.
        sequence.to({}, { duration: 0.7 });

        const aboutProgress = aboutStart / sequence.duration();
        const anchorProgress = (aboutStart + 0.65) / sequence.duration();
        const updatePlayback = (trigger: ReturnType<typeof ScrollTrigger.create>) => {
          const heroVisible = trigger.progress < aboutProgress;
          hero.inert = !heroVisible;
          if (visible.current !== heroVisible) {
            visible.current = heroVisible;
            loop.paused(paused.current || !heroVisible);
          }
          if (heroVisible && !paused.current) {
            speed(1 + Math.min(Math.abs(trigger.getVelocity()) / 2400, 0.85));
            settle.restart(true);
          }
        };

        const trigger = ScrollTrigger.create({
          trigger: scene,
          animation: sequence,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: updatePlayback,
          onRefresh: (self) => {
            const inset =
              parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
            aboutAnchor.style.top = `${(self.end - self.start) * anchorProgress + inset}px`;
            updatePlayback(self);
          },
        });

        if (window.location.hash === "#sobre") {
          aboutAnchor.scrollIntoView();
          trigger.update();
        }

        const title = root.querySelector(".story-disciplines-title");
        const words = title?.querySelectorAll(".story-disciplines-word > span");
        if (title && words?.length) {
          gsap.set(words, { yPercent: 115, opacity: 0 });
          gsap.to(words, {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.3,
            ease: "power2.out",
            scrollTrigger: { trigger: title, start: "top 86%", end: "bottom 74%", scrub: 0.2 },
          });
        }

        return () => {
          scene.classList.remove("portfolio-story-animated");
          aboutAnchor.style.removeProperty("top");
          hero.inert = false;
          marquee.current = null;
          visible.current = false;
          if (!disposed) setIsAnimated(false);
        };
      });
      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          compact: "(max-width: 43rem), (pointer: coarse)",
        },
        ({ conditions }) => {
          if (!conditions?.motion) return;
          const compact = conditions.compact;
          const stage = root.querySelector<HTMLElement>(".story-disciplines-stage");
          const word = stage?.querySelector<HTMLElement>(".story-disciplines-word:last-child");
          const slots = stage?.querySelectorAll<HTMLElement>(".story-discipline-slot");
          if (!stage || !word || !slots?.length) return;

          const cards = Array.from(slots, (slot) => ({
            slot,
            card: slot.firstElementChild as HTMLElement,
            x: 0,
            y: 0,
            phase: -1,
          }));
          const playhead = { progress: 0 };
          const stagger = compact ? 0.2 : 0.13;
          const travel = 1 - stagger * (cards.length - 1);
          const orbitEnd = compact ? 0.56 : 0.76;
          const clamp = gsap.utils.clamp(0, 1);
          const easeSettle = gsap.parseEase("power2.inOut");
          let radiusX = 0;
          let radiusY = 0;

          const measure = () => {
            const wordBox = word.getBoundingClientRect();
            const centerX = wordBox.left + wordBox.width / 2;
            const centerY = wordBox.top + wordBox.height / 2;
            radiusX = compact
              ? Math.min(stage.clientWidth * 0.17, 64)
              : Math.min(stage.clientWidth * 0.36, 320);
            radiusY = compact ? 42 : Math.min(window.innerHeight * 0.23, 195);
            cards.forEach((item) => {
              const box = item.slot.getBoundingClientRect();
              item.x = centerX - box.left - box.width / 2;
              item.y = centerY - box.top - box.height / 2;
            });
          };

          const draw = (refresh = false) => {
            cards.forEach((item, index) => {
              const { card } = item;
              const phase = clamp((playhead.progress - index * stagger) / travel);
              if (!refresh && phase === item.phase) return;
              item.phase = phase;
              if (phase === 1) {
                card.style.removeProperty("transform");
                card.style.removeProperty("opacity");
                return;
              }
              if (phase === 0) {
                card.style.opacity = "0";
                return;
              }

              const orbit = clamp(phase / orbitEnd);
              const offset = 1 - easeSettle(clamp((phase - orbitEnd) / (1 - orbitEnd)));
              const angle = compact ? -2.5 + orbit * Math.PI * 1.15 : -2.8 + orbit * Math.PI * 2;
              const radius = 1 - orbit * 0.85;
              const x = (item.x + radiusX * radius * Math.cos(angle)) * offset;
              const y = (item.y + radiusY * radius * Math.sin(angle)) * offset;
              const translate = `translate3d(${x}px, ${y}px, 0)`;
              if (compact) {
                card.style.transform = `${translate} rotate(${7 * Math.cos(angle) * offset}deg)`;
              } else {
                const scale = 1 - (0.36 - 0.24 * Math.sin(Math.PI * orbit)) * offset;
                card.style.transform = `perspective(1050px) ${translate} scale(${scale}) rotate(${22 * Math.cos(angle) * offset}deg) rotateY(${28 * Math.sin(angle) * offset}deg)`;
              }
              card.style.opacity = String(clamp(phase / 0.15));
            });
          };

          stage.classList.add("story-disciplines-animated");
          measure();
          draw();
          gsap.to(playhead, {
            progress: 1,
            ease: "none",
            onUpdate: draw,
            scrollTrigger: {
              trigger: word,
              start: compact ? "center 70%" : "center 52%",
              end: () =>
                `+=${compact ? Math.max(260, window.innerHeight * 0.48) : Math.max(650, window.innerHeight * 0.95)}`,
              ...(compact ? {} : { pin: stage, pinType: "transform" as const }),
              scrub: compact ? true : 0.3,
              onRefresh: () => {
                measure();
                draw(true);
              },
            },
          });

          return () => {
            stage.classList.remove("story-disciplines-animated");
            cards.forEach(({ card }) => {
              card.style.removeProperty("transform");
              card.style.removeProperty("opacity");
            });
          };
        },
      );
      media.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () =>
        enableSmoothWheelScroll(gsap),
      );
    };

    void setup().catch((error: unknown) => {
      media?.revert();
      console.error("Falha ao iniciar as animações do portfólio", error);
    });
    return () => {
      disposed = true;
      media?.revert();
    };
  }, []);

  function toggleMarquee() {
    paused.current = !paused.current;
    marquee.current?.paused(paused.current || !visible.current);
    setIsPaused(paused.current);
  }

  return { story, isAnimated, isPaused, toggleMarquee };
}
