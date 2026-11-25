import { useEffect, useRef } from "react";

const interactiveSelector =
  "a, button, input, textarea, select, summary, [role='button'], [role='tab'], [role='radio']";

export function DesktopCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor) return;
    const mouse = matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const root = document.documentElement;

    const hide = () => {
      root.removeAttribute("data-ring-cursor");
      cursor.removeAttribute("data-interactive");
    };
    const move = (event: PointerEvent) => {
      if (!mouse.matches || event.pointerType !== "mouse") {
        hide();
        return;
      }
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      const target =
        event.target instanceof Element ? event.target.closest(interactiveSelector) : null;
      cursor.toggleAttribute("data-interactive", Boolean(target));
      if (!root.hasAttribute("data-ring-cursor")) root.setAttribute("data-ring-cursor", "");
    };
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leave);
    window.addEventListener("blur", hide);
    mouse.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", hide);
      mouse.removeEventListener("change", hide);
    };
  }, []);

  return <div ref={ref} className="desktop-cursor-ring" aria-hidden="true" />;
}
