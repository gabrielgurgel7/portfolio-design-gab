export type VideoProject = {
  /** Identificador único usado na URL: /video/{slug} */
  slug: string;
  /** Título exibido na galeria e no topo da página do vídeo */
  title: string;
  /** Frase curta que resume o projeto (aparece como subtítulo na página do vídeo) */
  subtitle: string;
  /** Texto mais longo, opcional, exibido no corpo da página do vídeo */
  description?: string;
  /** Categoria usada como etiqueta na galeria */
  tag: string;
  /** Cliente/contexto, opcional — aparece como metadado na página do vídeo */
  client?: string;
};

/**
 * Fonte única de verdade para todos os vídeos da seção "Vídeo & Motion".
 * Para adicionar um novo vídeo:
 * 1. Crie uma pasta em public/videos/<slug>/ com o arquivo video.mp4
 *    e, se quiser uma miniatura customizada, capa.jpg (senão o navegador
 *    usa o primeiro frame do vídeo)
 * 2. Adicione um novo objeto aqui com o mesmo slug
 */
export const videoProjects: VideoProject[] = [
  {
    slug: "arqcheck-sandy-gurgel",
    title: "ArqCheck — Sandy Gurgel",
    subtitle: "Vídeo de divulgação para Instagram, unindo motion e tipografia.",
    tag: "Motion",
    client: "Arquiteta Sandy Gurgel",
  },
  {
    slug: "sandy-gurgel-abertura",
    title: "Abertura de Marca — Sandy Gurgel",
    subtitle: "Vinheta de abertura com o monograma da marca.",
    tag: "Motion",
    client: "Arquiteta Sandy Gurgel",
  },
  {
    slug: "sandy-gurgel-still",
    title: "Still — Sandy Gurgel",
    subtitle: "Peça de marca em tom cinematográfico, unindo still e motion.",
    tag: "Motion",
    client: "Arquiteta Sandy Gurgel",
  },
  {
    slug: "uni7-curso-arquitetura",
    title: "UNI7 — Curso de Arquitetura e Urbanismo",
    subtitle: "Vídeo institucional de divulgação do curso de Arquitetura e Urbanismo.",
    tag: "Vídeo Institucional",
    client: "UNI7",
  },
  {
    slug: "uni7-curso-direito",
    title: "UNI7 — Curso de Direito",
    subtitle: "Vídeo institucional de divulgação do curso de Direito.",
    tag: "Vídeo Institucional",
    client: "UNI7",
  },
  {
    slug: "uni7-curso-comunicacao-social",
    title: "UNI7 — Curso de Comunicação Social",
    subtitle: "Vídeo institucional de divulgação do curso de Comunicação Social.",
    tag: "Vídeo Institucional",
    client: "UNI7",
  },
  {
    slug: "uni7-curso-psicologia",
    title: "UNI7 — Curso de Psicologia",
    subtitle: "Vídeo institucional de divulgação do curso de Psicologia.",
    tag: "Vídeo Institucional",
    client: "UNI7",
  },
  {
    slug: "uni7-administracao",
    title: "UNI7 — Curso de Administrção",
    subtitle:
      "Vídeo institucional destacando resultados práticos da formação em administração da UNI7.",
    tag: "Vídeo Institucional",
    client: "UNI7",
  },
  {
    slug: "uni7-premio-osga-2025",
    title: "UNI7 — Prêmio Osga 2025",
    subtitle: "Vídeo de campanha divulgando o prazo de inscrição do prêmio Osga 2025.",
    tag: "Vídeo Institucional",
    client: "UNI7",
  },
  {
    slug: "uni7-depoimento-projetos",
    title: "UNI7 — Depoimento sobre Projetos",
    subtitle: "Depoimento institucional sobre os projetos oferecidos aos alunos.",
    tag: "Depoimento",
    client: "UNI7",
  },
  {
    slug: "uni7-depoimento-seriedade",
    title: "UNI7 — Depoimento Institucional",
    subtitle: "Depoimento institucional sobre o compromisso da instituição com os alunos.",
    tag: "Depoimento",
    client: "UNI7",
  },
];

export function getVideoBySlug(slug: string): VideoProject | undefined {
  return videoProjects.find((v) => v.slug === slug);
}

/** Caminho do arquivo de vídeo, servido estaticamente a partir de /public. */
export function getVideoSrc(slug: string): string {
  return `/videos/${slug}/video.mp4`;
}

/** Caminho da miniatura (poster) do vídeo, servido estaticamente a partir de /public. */
export function getVideoCover(slug: string): string {
  return `/videos/${slug}/capa.jpg`;
}
