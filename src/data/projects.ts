export type Project = {
  /** Identificador único usado na URL: /projeto/{slug} */
  slug: string;
  /** Título exibido na galeria e no topo da página do projeto */
  title: string;
  /** Frase curta que resume o projeto (aparece como subtítulo na página do projeto) */
  subtitle: string;
  /** Texto mais longo, opcional, exibido no corpo da página do projeto */
  description?: string;
  /** Categoria usada como etiqueta na galeria */
  tag: string;
  /** Cliente/contexto, opcional — aparece como metadado na página do projeto */
  client?: string;
};

/**
 * Fonte única de verdade para todos os projetos da galeria.
 * Para adicionar um novo projeto:
 * 1. Crie uma pasta em src/assets/projetos/<slug>/ com as imagens (01.jpg, 02.jpg, ...)
 * 2. Adicione um novo objeto aqui com o mesmo slug
 * As imagens são carregadas automaticamente por slug (veja src/data/project-images.ts)
 */
export const projects: Project[] = [
  {
    slug: "identidade-visual-chic-d-mais",
    title: "Identidade Visual — Chic D+",
    subtitle: "Construção da identidade visual da marca Chic D+, do conceito à aplicação.",
    description:
      "Desenvolvimento do monograma, sistema de cores, tipografia e desdobramentos em vitrine, embalagens e pontos de contato físicos e digitais.",
    tag: "Identidade Visual",
    client: "Chic D+",
  },
  {
    slug: "panfleto-otica-genesis",
    title: "Panfleto — Ótica Gênesis",
    subtitle: "Panfleto promocional criado para a Ótica Gênesis.",
    description:
      "Peça impressa com hierarquia clara de oferta, chamada direta e leitura rápida para distribuição local.",
    tag: "Design",
    client: "Ótica Gênesis",
  },
  {
    slug: "capa-radionovela-os-cinzas",
    title: "Capa — Radionovela Os Cinzas",
    subtitle:
      'Arte de capa para a radionovela "Os Cinzas", unindo tipografia e atmosfera à narrativa.',
    description:
      "Direção de arte focada em atmosfera dramática e tipografia expressiva para destacar o título em plataformas digitais.",
    tag: "Design",
  },
  {
    slug: "ciclo-literario",
    title: "Ciclo Literário",
    subtitle: "Peças gráficas de identidade e divulgação para o Ciclo Literário.",
    tag: "Design",
  },
  {
    slug: "carrossel-palestras-vozes-que-libertam",
    title: "Carrossel — Palestras Vozes que Libertam",
    subtitle: 'Peças para redes sociais divulgando o ciclo de palestras "Vozes que Libertam".',
    tag: "Social Media",
    client: "UNI7",
  },
  {
    slug: "storys-contato-coordenadores",
    title: "Stories — Contato de Coordenadores",
    subtitle:
      "Série de stories com contato direto de coordenadores e consultores comerciais dos cursos.",
    tag: "Social Media",
    client: "UNI7",
  },
  {
    slug: "palestra-consciencia-negra",
    title: "Palestra — Reflexões sobre Consciência Negra",
    subtitle: "Peças gráficas para divulgar a palestra sobre Consciência Negra.",
    tag: "Design",
    client: "UNI7",
  },
  {
    slug: "trote-legal",
    title: "Trote Legal",
    subtitle: "Peças gráficas e voucher para a campanha Trote Legal.",
    tag: "Design",
    client: "UNI7",
  },
  {
    slug: "carrossel-educacao-classica",
    title: "Carrossel — Educação Clássica",
    subtitle: "Série de posts explicando os pilares da educação clássica.",
    tag: "Social Media",
    client: "Educando para Deus",
  },
  {
    slug: "carrossel-sistemas-de-informacao",
    title: "Carrossel — Sistemas de Informação",
    subtitle: "Peças para redes sociais apresentando o curso de Sistemas de Informação.",
    tag: "Social Media",
    client: "UNI7",
  },
  {
    slug: "carrossel-sobre-nos-educando-para-deus",
    title: "Carrossel — Sobre Nós",
    subtitle: "Carrossel institucional apresentando a proposta do projeto Educando para Deus.",
    tag: "Social Media",
    client: "Educando para Deus",
  },
  {
    slug: "carrossel-leitura-em-voz-alta",
    title: "Carrossel — Leitura em Voz Alta",
    subtitle: "Conteúdo educativo sobre os benefícios da leitura em voz alta para crianças.",
    tag: "Social Media",
    client: "Educando para Deus",
  },
  {
    slug: "dia-dos-professores-saude",
    title: "Dia dos Professores — Área da Saúde",
    subtitle: "Peças de homenagem aos professores dos cursos da área da saúde.",
    tag: "Social Media",
    client: "UNI7",
  },
  {
    slug: "transferencia-arquitetura-urbanismo",
    title: "Transferência — Arquitetura e Urbanismo",
    subtitle:
      "Peças gráficas de divulgação do processo de transferência para o curso de Arquitetura e Urbanismo.",
    tag: "Design",
    client: "UNI7",
  },
  {
    slug: "cerimonia-do-jaleco",
    title: "Cerimônia do Jaleco",
    subtitle:
      "Peças gráficas de divulgação da cerimônia que marca a entrada de estudantes da área da saúde.",
    tag: "Design",
    client: "UNI7",
  },
  {
    slug: "cerimonia-do-vade-mecum",
    title: "Cerimônia do Vade Mecum",
    subtitle:
      "Peça gráfica de divulgação da cerimônia de entrega do código aos estudantes de Direito.",
    tag: "Design",
    client: "UNI7",
  },
  {
    slug: "post-colacao-de-grau-2025",
    title: "Post — Colação de Grau 2025",
    subtitle: "Peça comemorativa para a colação de grau da turma de 2025.",
    tag: "Social Media",
    client: "UNI7",
  },
  {
    slug: "post-transferidos",
    title: "Post — Transferidos",
    subtitle: "Peça de divulgação voltada a estudantes em processo de transferência.",
    tag: "Social Media",
    client: "UNI7",
  },
  {
    slug: "stories-vila-escalada",
    title: "Stories — Vila Escalada",
    subtitle: "Série de seis stories criada em um projeto acadêmico para divulgar a Vila Escalada.",
    tag: "Social Media",
    client: "Vila Escalada",
  },
  {
    slug: "amplifique-seu-talento-duetos",
    title: "Amplifique seu talento — Duetos",
    subtitle:
      "Peça gráfica de um projeto acadêmico para a Duetos Escola de Música, com os níveis de aprendizado representados no seletor de um amplificador.",
    tag: "Design",
    client: "Duetos Escola de Música",
  },
  {
    slug: "mes-do-cliente-dragao-dos-parafusos",
    title: "Mês do Cliente — Dragão dos Parafusos",
    subtitle:
      "Peça promocional criada em um projeto acadêmico para a campanha de Mês do Cliente da Dragão dos Parafusos.",
    tag: "Social Media",
    client: "Dragão dos Parafusos",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
