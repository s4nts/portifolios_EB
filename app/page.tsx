import { getAllArticles } from "@/lib/contentLoader";
import HomeClient from "@/components/HomeClient";

/**
 * Página inicial que lista todos os artigos disponíveis
 * Componente servidor que carrega os dados
 */
export default function Home() {
  const articles = getAllArticles().sort((a, b) =>
    a.studentName.localeCompare(b.studentName, "pt-BR", { sensitivity: "base" })
  );

  return <HomeClient articles={articles} />;
}
