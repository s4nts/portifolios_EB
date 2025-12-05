import fs from 'fs';
import path from 'path';

export interface ArticleSection {
  heading: string;
  body: string;
  image: string;
}

export interface Article {
  title: string;
  slug: string;
  studentName: string;
  sections: ArticleSection[];
}

const articlesDirectory = path.join(process.cwd(), 'content/articles');

/**
 * Valida se um objeto é um Article válido
 */
function isValidArticle(data: unknown): data is Article {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const article = data as Record<string, unknown>;

  if (
    typeof article.title !== 'string' ||
    typeof article.slug !== 'string' ||
    typeof article.studentName !== 'string' ||
    !Array.isArray(article.sections)
  ) {
    return false;
  }

  return article.sections.every(
    (section): section is ArticleSection =>
      typeof section === 'object' &&
      section !== null &&
      typeof (section as ArticleSection).heading === 'string' &&
      typeof (section as ArticleSection).body === 'string' &&
      typeof (section as ArticleSection).image === 'string'
  );
}

/**
 * Sanitiza o slug para prevenir path traversal
 */
function sanitizeSlug(slug: string): string {
  // Remove caracteres perigosos e normaliza o slug
  return slug.replace(/[^a-z0-9-]/gi, '').toLowerCase();
}

/**
 * Carrega e valida um artigo de um arquivo
 */
function loadArticleFromFile(filePath: string): Article | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(fileContents) as unknown;

    if (!isValidArticle(parsed)) {
      console.error(`Invalid article format in ${filePath}`);
      return null;
    }

    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error loading article from ${filePath}:`, error.message);
    }
    return null;
  }
}

/**
 * Retorna todos os artigos disponíveis
 */
export function getAllArticles(): Article[] {
  try {
    if (!fs.existsSync(articlesDirectory)) {
      console.warn(`Articles directory not found: ${articlesDirectory}`);
      return [];
    }

    const fileNames = fs.readdirSync(articlesDirectory);
    const articles = fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => {
        const filePath = path.join(articlesDirectory, fileName);
        return loadArticleFromFile(filePath);
      })
      .filter((article): article is Article => article !== null);

    return articles;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error reading articles directory:', error.message);
    }
    return [];
  }
}

/**
 * Retorna um artigo específico pelo slug
 */
export function getArticleBySlug(slug: string): Article | null {
  if (!slug || typeof slug !== 'string') {
    return null;
  }

  const sanitizedSlug = sanitizeSlug(slug);
  if (!sanitizedSlug) {
    return null;
  }

  try {
    const filePath = path.join(articlesDirectory, `${sanitizedSlug}.json`);
    return loadArticleFromFile(filePath);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error loading article with slug "${slug}":`, error.message);
    }
    return null;
  }
}

/**
 * Retorna todos os slugs disponíveis
 */
export function getAllSlugs(): string[] {
  try {
    if (!fs.existsSync(articlesDirectory)) {
      console.warn(`Articles directory not found: ${articlesDirectory}`);
      return [];
    }

    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => fileName.replace('.json', ''))
      .filter((slug) => slug.length > 0);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error reading articles directory:', error.message);
    }
    return [];
  }
}
