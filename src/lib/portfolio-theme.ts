export const themeKey = "portfolio-theme";

export const initializePortfolioTheme = `
  (() => {
    let theme;
    try { theme = localStorage.getItem(${JSON.stringify(themeKey)}); } catch {}
    const dark = theme === "dark" ||
      (theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  })();
`;
