import { initializePortfolioTheme } from "./portfolio-theme";

export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>${initializePortfolioTheme}</script>
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      .actions > * { padding: 0.6rem 1rem; border-radius: 999px; font: inherit; font-weight: 700; cursor: pointer; text-decoration: none; border: 0; color: #0b0d12; background: linear-gradient(180deg, white, #f2f2ed 65%, #d8dad4); box-shadow: inset 0 1px 1px white, inset 0 -2px 4px rgb(11 13 18 / 22%), 0 3px 8px rgb(11 13 18 / 30%); }
      .actions > .primary { background: linear-gradient(180deg, #f2f2ed, #c5ff42 65%); }
      .dark body { background: #0b0d12; color: #f2f2ed; }
      .dark p { color: #9ba3b2; }
      .dark .actions > * { color: #f2f2ed; background: linear-gradient(180deg, #414857, #252a35 66%, #171b24); box-shadow: inset 0 1px 2px rgb(242 242 237 / 24%), inset 0 -2px 4px rgb(11 13 18 / 60%), 0 3px 8px rgb(11 13 18 / 45%); }
      .actions > :active { box-shadow: inset 0 2px 5px rgb(11 13 18 / 25%); }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
