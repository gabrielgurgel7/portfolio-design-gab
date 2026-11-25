import { DesktopCursor } from "@/components/desktop-cursor";
import { CircuitCursor } from "@/components/circuit-cursor";
import { BudgetChatbot } from "@/components/budget-chatbot";
import { BudgetChatProvider } from "@/lib/budget-chat-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  type ErrorComponentProps,
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { initializePortfolioTheme } from "@/lib/portfolio-theme";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const SITE_URL = "https://portfolio-design-gab.vercel.app";
const OG_IMAGE_URL = `${SITE_URL}/og-cover.png`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="circuit-content max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-ink">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold text-ink">Página não encontrada</h2>
        <p className="mt-2 text-sm text-ink2">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-3d">
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="circuit-content max-w-md text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink">
          Algo deu errado ao carregar esta página
        </h1>
        <p className="mt-2 text-sm text-ink2">Tente recarregar ou voltar para a página inicial.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              void router.invalidate();
              reset();
            }}
            className="btn-3d"
          >
            Tentar novamente
          </button>
          <a href="/" className="btn-3d">
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Gabriel Gurgel · Sites Front-end, Motion Design, Design & Vídeo" },
      {
        name: "description",
        content:
          "Portfólio de Gabriel Gurgel: sites front-end, motion design, identidade visual e edição de vídeo para marcas, agências e times.",
      },
      { name: "author", content: "Gabriel Gurgel" },
      {
        property: "og:title",
        content: "Gabriel Gurgel · Sites Front-end, Motion Design, Design & Vídeo",
      },
      {
        property: "og:description",
        content:
          "Sua marca com visual de alto nível — do design ao site e ao vídeo. Orçamento sob medida para marcas, empreendedores e agências.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: OG_IMAGE_URL },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initializePortfolioTheme }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <CircuitCursor />
        <DesktopCursor />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <BudgetChatProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <BudgetChatbot />
      </BudgetChatProvider>
    </QueryClientProvider>
  );
}
