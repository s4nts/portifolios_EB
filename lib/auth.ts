/**
 * Utilitários de autenticação para proteger os artigos
 */

const UNIVERSAL_PASSWORD = '312710';

/**
 * Gera a senha específica de um aluno
 */
export function getStudentPassword(studentName: string): string {
  return `${studentName.toLowerCase().replace(/\s+/g, '')}12345`;
}

/**
 * Verifica se a senha é válida para um aluno
 */
export function isValidPassword(password: string, studentName: string): boolean {
  const normalizedPassword = password.trim();
  const studentPassword = getStudentPassword(studentName);
  
  return normalizedPassword === studentPassword || normalizedPassword === UNIVERSAL_PASSWORD;
}

/**
 * Armazena a autenticação no localStorage
 */
export function setAuthenticated(slug: string): void {
  if (typeof window !== 'undefined') {
    const key = `auth_${slug}`;
    localStorage.setItem(key, 'true');
    // Expira em 24 horas
    localStorage.setItem(`${key}_expires`, String(Date.now() + 24 * 60 * 60 * 1000));
  }
}

/**
 * Verifica se o usuário está autenticado para um artigo
 */
export function isAuthenticated(slug: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const key = `auth_${slug}`;
  const authStatus = localStorage.getItem(key);
  const expires = localStorage.getItem(`${key}_expires`);
  
  if (!authStatus || authStatus !== 'true') {
    return false;
  }
  
  // Verifica se expirou
  if (expires && Date.now() > parseInt(expires, 10)) {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_expires`);
    return false;
  }
  
  return true;
}

