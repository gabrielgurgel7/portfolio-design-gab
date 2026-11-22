import { useEffect, useRef } from "react";
import type { createCircuitRenderer } from "@/lib/circuit-renderer";

export function CircuitCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const preference = matchMedia(
      "(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let engine: ReturnType<typeof createCircuitRenderer> | undefined;
    let loading = false;
    let unavailable = false;
    let disposed = false;
    let frame = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let lastMove = -Infinity;
    let intensity = 0;
    let previousTime = 0;

    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      intensity = 0;
      lastMove = -Infinity;
      engine?.hide();
    };

    const draw = (time: number) => {
      const delta = Math.min(time - previousTime, 40);
      previousTime = time;
      const tracking = 1 - Math.exp(-delta / 65);
      x += (targetX - x) * tracking;
      y += (targetY - y) * tracking;
      const moving = time - lastMove < 210;
      intensity += ((moving ? 1 : 0) - intensity) * (1 - Math.exp(-delta / (moving ? 75 : 95)));

      if (!moving && intensity < 0.025) {
        hide();
        return;
      }

      engine?.render(x, y, intensity, time);
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!engine || frame || !preference.matches || document.hidden) return;
      const now = performance.now();
      if (now - lastMove >= 210) return;
      x = targetX;
      y = targetY;
      previousTime = now;
      frame = requestAnimationFrame(draw);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !preference.matches || unavailable) return;
      targetX = event.clientX;
      targetY = event.clientY;
      lastMove = performance.now();
      if (engine) {
        start();
      } else if (!loading) {
        loading = true;
        void import("@/lib/circuit-renderer")
          .then(({ createCircuitRenderer }) => {
            if (disposed || !preference.matches) return;
            engine = createCircuitRenderer(canvas);
            start();
          })
          .catch(() => {
            unavailable = true;
            hide();
          })
          .finally(() => {
            loading = false;
          });
      }
    };

    const leave = (event: PointerEvent) => {
      if (event.relatedTarget === null) hide();
    };
    const preferenceChanged = () => {
      if (!preference.matches) hide();
    };

    const contextLost = () => {
      unavailable = true;
      hide();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leave);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", hide);
    preference.addEventListener("change", preferenceChanged);
    canvas.addEventListener("webglcontextlost", contextLost);
    return () => {
      disposed = true;
      hide();
      engine?.dispose();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", hide);
      preference.removeEventListener("change", preferenceChanged);
      canvas.removeEventListener("webglcontextlost", contextLost);
    };
  }, []);

  return <canvas ref={ref} className="circuit-cursor" aria-hidden="true" />;
}
