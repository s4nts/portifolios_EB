/**
 * Componente de rodapé para a página inicial
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 mt-16" role="contentinfo">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-600">
            © {currentYear} Centro de Educação Infantil Hercílio Bento. Todos os direitos reservados.
          </p>
          <p className="text-xs text-slate-500">
            Agradecemos a todos os alunos, famílias e educadores que tornaram este projeto possível.
          </p>
        </div>
      </div>
    </footer>
  );
}

