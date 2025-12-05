/**
 * Obtém o basePath dinamicamente
 * Funciona tanto no servidor (build) quanto no cliente (runtime)
 */
export function getBasePath(): string {
  // No cliente, podemos detectar do window.location
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    // Se o pathname começa com /portifolios_EB ou outro nome de repo
    // Extrai o basePath
    const match = pathname.match(/^\/([^/]+)/);
    if (match && match[1] !== '') {
      const firstSegment = match[1];
      // Verifica se não é uma rota de página (articles, etc)
      if (firstSegment !== 'articles' && firstSegment !== 'index.html') {
        return `/${firstSegment}`;
      }
    }
    return '';
  }
  
  // No servidor durante build, tenta da variável de ambiente
  return process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || '';
}

/**
 * Adiciona o basePath a um caminho
 */
export function withBasePath(path: string): string {
  const basePath = getBasePath();
  
  // Remove barra inicial do path se existir
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Se não há basePath, retorna o path original
  if (!basePath || basePath === '') {
    return cleanPath;
  }
  
  // Garante que basePath não termine com /
  const cleanBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  
  return `${cleanBasePath}${cleanPath}`;
}

