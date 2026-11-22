import { useEffect, type RefObject } from "react";

export function useHeroLiquify(story: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const stage = story.current?.querySelector<HTMLElement>(".portfolio-story-stage");
    const panel = stage?.querySelector<HTMLElement>(".hero-panel");
    if (!stage || !panel) return;

    const mouse = matchMedia(
      "(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const isOpening = () => mouse.matches && !document.hidden && window.scrollY <= 2;
    let frame = 0;
    let lastMove = -Infinity;
    let lastFrame = 0;
    let intensity = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastMove = -Infinity;
      intensity = 0;
      stage.removeAttribute("data-hero-liquify");
    };

    const draw = (time: number) => {
      if (!isOpening()) {
        reset();
        return;
      }

      const delta = Math.min(40, time - lastFrame);
      const ease = 1 - Math.exp(-delta / 80);
      lastFrame = time;
      const moving = time - lastMove < 185;
      intensity += ((moving ? 1 : 0) - intensity) * ease;
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      if (!moving && intensity < 0.02) {
        reset();
        return;
      }

      const ripple = Math.sin(time / 235);
      stage.style.setProperty("--liquify-x", `${x}px`);
      stage.style.setProperty("--liquify-y", `${y}px`);
      stage.style.setProperty("--liquify-rx", `${(112 + ripple * 13) * intensity}px`);
      stage.style.setProperty("--liquify-ry", `${(83 - ripple * 12) * intensity}px`);
      stage.style.setProperty("--liquify-shift", `${(27 + ripple * 10) * intensity}px`);
      frame = requestAnimationFrame(draw);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !isOpening()) return;
      const bounds = stage.getBoundingClientRect();
      targetX = event.clientX - bounds.left;
      targetY = event.clientY - bounds.top;
      lastMove = performance.now();
      if (frame) return;

      const rectangle = panel.getBoundingClientRect();
      stage.style.setProperty("--liquify-panel-x", `${rectangle.left - bounds.left}px`);
      stage.style.setProperty("--liquify-panel-y", `${rectangle.top - bounds.top}px`);
      x = targetX;
      y = targetY;
      lastFrame = lastMove;
      stage.setAttribute("data-hero-liquify", "");
      frame = requestAnimationFrame(draw);
    };

    const leave = () => {
      lastMove = -Infinity;
    };

    panel.addEventListener("pointermove", move, { passive: true });
    panel.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("resize", reset);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    mouse.addEventListener("change", reset);

    return () => {
      reset();
      panel.removeEventListener("pointermove", move);
      panel.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("resize", reset);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
      mouse.removeEventListener("change", reset);
    };
  }, [story]);
}
