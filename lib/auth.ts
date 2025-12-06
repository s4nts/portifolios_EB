/**
 * Utilitários de autenticação para proteger os artigos
 */

const ADMIN_PASSWORD = "312710";

/**
 * Extrai o primeiro nome de um nome completo
 * Ex: "MARIA CECÍLIA DA SILVA MABBA" -> "maria"
 * Ex: "THÉO WEBER FUSIEGER" -> "theo"
 */
function getFirstName(studentName: string): string {
  const nameParts = studentName.trim().split(/\s+/);
  if (nameParts.length === 0) return "";

  // Pega sempre o primeiro nome
  const firstName = nameParts[0];

  // Remove acentos e caracteres especiais, converte para minúsculas
  return firstName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Gera a senha específica de um aluno baseada apenas no primeiro nome
 */
export function getStudentPassword(studentName: string): string {
  const firstName = getFirstName(studentName);
  return `${firstName}12345`;
}

/**
 * Verifica se a senha é válida para um aluno
 * Aceita: senha do aluno OU senha admin
 */
export function isValidPassword(
  password: string,
  studentName: string
): boolean {
  const normalizedPassword = password.trim().toLowerCase();
  const studentPassword = getStudentPassword(studentName);
  const adminPassword = ADMIN_PASSWORD.toLowerCase();

  return (
    normalizedPassword === studentPassword ||
    normalizedPassword === adminPassword
  );
}

/**
 * Verifica se a senha é a senha do admin
 */
export function isAdminPassword(password: string): boolean {
  return password.trim().toLowerCase() === ADMIN_PASSWORD.toLowerCase();
}

/**
 * Armazena a autenticação no localStorage
 */
export function setAuthenticated(slug: string): void {
  if (typeof window !== "undefined") {
    const key = `auth_${slug}`;
    localStorage.setItem(key, "true");
    // Expira em 24 horas
    localStorage.setItem(
      `${key}_expires`,
      String(Date.now() + 24 * 60 * 60 * 1000)
    );
  }
}

/**
 * Verifica se há um token de compartilhamento válido na URL
 */
export function hasValidShareToken(pathname: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const shareToken = urlParams.get("share");

  if (!shareToken) {
    return false;
  }

  // Gera o token esperado baseado no pathname e data atual (válido por 24h)
  const expectedToken = btoa(
    `${pathname}-${Math.floor(Date.now() / (1000 * 60 * 60 * 24))}`
  ).replace(/[+/=]/g, "");

  // Verifica se o token corresponde
  // Também aceita tokens do dia anterior (para links compartilhados no mesmo dia)
  const previousDayToken = btoa(
    `${pathname}-${Math.floor(
      (Date.now() - 24 * 60 * 60 * 1000) / (1000 * 60 * 60 * 24)
    )}`
  ).replace(/[+/=]/g, "");

  return shareToken === expectedToken || shareToken === previousDayToken;
}

/**
 * Verifica se o usuário está autenticado para um artigo
 */
export function isAuthenticated(slug: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // Se é admin, está autenticado para tudo
  if (isAdminAuthenticated()) {
    return true;
  }

  // Se tem token de compartilhamento válido, permite acesso
  if (hasValidShareToken(window.location.pathname)) {
    return true;
  }

  const key = `auth_${slug}`;
  const authStatus = localStorage.getItem(key);
  const expires = localStorage.getItem(`${key}_expires`);

  if (!authStatus || authStatus !== "true") {
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

/**
 * Define que o admin está autenticado
 */
export function setAdminAuthenticated(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_auth", "true");
    // Expira em 24 horas
    localStorage.setItem(
      "admin_auth_expires",
      String(Date.now() + 24 * 60 * 60 * 1000)
    );
  }
}

/**
 * Verifica se o admin está autenticado
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const authStatus = localStorage.getItem("admin_auth");
  const expires = localStorage.getItem("admin_auth_expires");

  if (!authStatus || authStatus !== "true") {
    return false;
  }

  // Verifica se expirou
  if (expires && Date.now() > parseInt(expires, 10)) {
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_auth_expires");
    return false;
  }

  return true;
}
