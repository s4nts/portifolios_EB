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
  sections: ArticleSection[];
}

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export function getAllArticles(): Article[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    const articles = fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => {
        const filePath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const article: Article = JSON.parse(fileContents);
        return article;
      });

    return articles;
  } catch (error) {
    return [];
  }
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const filePath = path.join(articlesDirectory, `${slug}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const article: Article = JSON.parse(fileContents);
    return article;
  } catch (error) {
    return null;
  }
}

export function getAllSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => fileName.replace('.json', ''));
  } catch (error) {
    return [];
  }
}
