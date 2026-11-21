import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

const themeKey = "portfolio-theme";

export const initializePortfolioTheme = `
  (() => {
    let theme;
    try { theme = localStorage.getItem(${JSON.stringify(themeKey)}); } catch {}
    const dark = theme === "dark" ||
      (theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  })();
`;

const sections = [
  { label: "Sobre", id: "sobre" },
  { label: "Projetos", id: "galeria" },
  { label: "Contato", id: "contato" },
];

export function PortfolioHeader({ detail = false }: { detail?: boolean }) {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }

    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(themeKey);
      } catch {
        // The theme can still be changed for this visit.
      }
      const active = saved === "dark" || (saved !== "light" && preference.matches);
      document.documentElement.classList.toggle("dark", active);
      setDark(active);
    };

    setDark(document.documentElement.classList.contains("dark"));
    preference.addEventListener("change", syncTheme);
    window.addEventListener("storage", syncTheme);
    return () => {
      preference.removeEventListener("change", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  function toggleTheme() {
    const active = document.documentElement.classList.toggle("dark");
    setDark(active);
    try {
      localStorage.setItem(themeKey, active ? "dark" : "light");
    } catch {
      // The chosen theme is already active for this visit.
    }
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <header ref={header} className="portfolio-content portfolio-header">
      <Link to="/" className="portfolio-brand" aria-label="Gab.Gurgel, início">
        Gab.Gurgel
      </Link>
      <button
        ref={menuButton}
        type="button"
        className="portfolio-menu-button"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>
      <div id={menuId} className="portfolio-menu" data-open={menuOpen}>
        <nav className="portfolio-nav" aria-label="Navegação principal">
          <Link to="/" className="portfolio-nav-link portfolio-mobile-home" onClick={closeMenu}>
            Início
          </Link>
          {detail ? (
            <Link to="/" hash="galeria" className="portfolio-nav-link" onClick={closeMenu}>
              <ArrowUpLeft size={16} aria-hidden="true" />
              Projetos
            </Link>
          ) : (
            sections.map(({ label, id }) => (
              <a key={id} href={`#${id}`} className="portfolio-nav-link" onClick={closeMenu}>
                {label}
              </a>
            ))
          )}
        </nav>
        <div className="portfolio-theme">
          <span className="portfolio-theme-label" aria-hidden="true">
            Tema escuro
          </span>
          <button
            type="button"
            className="theme-toggle"
            aria-label="Tema escuro"
            aria-pressed={dark}
            onClick={toggleTheme}
          >
            <span className="theme-thumb">
              <Sun className="theme-sun" size={16} aria-hidden="true" />
              <Moon className="theme-moon" size={16} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
      <Link to="/" hash="contato" className="btn-3d portfolio-budget" onClick={closeMenu}>
        Orçamento
        <span className="button-orb">
          <ArrowUpRight size={19} aria-hidden="true" />
        </span>
      </Link>
    </header>
  );
}
