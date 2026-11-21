export function enableSmoothWheelScroll(gsap: typeof import("gsap").gsap) {
  let tween: gsap.core.Tween | undefined;
  let destination = window.scrollY;

  function smoothWheel(event: WheelEvent) {
    if (
      event.defaultPrevented ||
      !event.cancelable ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      Math.abs(event.deltaX) >= Math.abs(event.deltaY)
    ) {
      return;
    }

    // Let independently scrollable menus and carousels handle the wheel themselves.
    for (
      let element = event.target instanceof Element ? event.target : null;
      element && element !== document.body;
      element = element.parentElement
    ) {
      if (
        element.getAttribute("aria-roledescription") === "carrossel" ||
        (element.scrollHeight > element.clientHeight &&
          /auto|scroll/.test(getComputedStyle(element).overflowY))
      ) {
        return;
      }
    }

    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const bottom = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const current = tween?.isActive() ? destination : window.scrollY;
    const next = gsap.utils.clamp(0, Math.max(0, bottom), current + event.deltaY * scale);
    if (next === current) return;

    event.preventDefault();
    destination = next;
    tween?.kill();
    tween = gsap.to(window, {
      scrollTo: { y: destination, autoKill: true },
      duration: 0.38,
      ease: "power2.out",
    });
  }

  window.addEventListener("wheel", smoothWheel, { passive: false });
  return () => {
    window.removeEventListener("wheel", smoothWheel);
    tween?.kill();
  };
}
