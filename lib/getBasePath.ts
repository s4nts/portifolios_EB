/**
 * Obtém o basePath dinamicamente
 * Funciona tanto no servidor (build) quanto no cliente (runtime)
 */
export function getBasePath(): string {
  // No cliente, podemos detectar do window.location
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    
    // Lista de rotas conhecidas que não são basePath
    const knownRoutes = ['articles', 'index.html', ''];
    
    // Se o pathname começa com /portifolios_EB ou outro nome de repo
    // Extrai o basePath
    const match = pathname.match(/^\/([^/]+)/);
    if (match && match[1] !== '') {
      const firstSegment = match[1];
      // Verifica se não é uma rota de página conhecida
      if (!knownRoutes.includes(firstSegment)) {
        return `/${firstSegment}`;
      }
    }
    
    // Se não encontrou no pathname, tenta verificar se estamos em GitHub Pages
    // verificando se o hostname contém github.io
    if (window.location.hostname.includes('github.io')) {
      // Tenta extrair do pathname completo
      const pathSegments = pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0 && !knownRoutes.includes(pathSegments[0])) {
        return `/${pathSegments[0]}`;
      }
      
      // Se ainda não encontrou, tenta extrair do hostname
      // github.io URLs são: username.github.io/repo-name
      const hostnameParts = window.location.hostname.split('.');
      if (hostnameParts.length >= 3 && hostnameParts[1] === 'github' && hostnameParts[2] === 'io') {
        // Se o pathname tem mais de um segmento, o primeiro pode ser o repo
        if (pathSegments.length > 1) {
          return `/${pathSegments[0]}`;
        }
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

