/**
 * Carrega automaticamente todas as imagens dentro de src/assets/projetos/<slug>/.
 * Não é necessário importar imagem por imagem: basta colocar os arquivos na pasta
 * do projeto (nomeados 01.jpg, 02.jpg, ...) que eles aparecem aqui, já otimizados
 * pelo Vite no build.
 */
const modules = import.meta.glob("../assets/projetos/*/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

// Agrupa os caminhos por slug (nome da pasta), já ordenados pelo nome do arquivo.
const imagesBySlug: Record<string, string[]> = {};

for (const path of Object.keys(modules).sort()) {
  const match = path.match(/projetos\/([^/]+)\//);
  if (!match) continue;
  const slug = match[1];
  if (!imagesBySlug[slug]) imagesBySlug[slug] = [];
  imagesBySlug[slug].push(modules[path]);
}

/** Retorna todas as imagens de um projeto, na ordem dos arquivos (01, 02, 03...). */
export function getProjectImages(slug: string): string[] {
  return imagesBySlug[slug] ?? [];
}

/** Retorna só a primeira imagem — usada como miniatura/capa na galeria. */
export function getProjectCover(slug: string): string | undefined {
  return getProjectImages(slug)[0];
}
