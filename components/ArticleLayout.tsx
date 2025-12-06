"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import BackButton from "./BackButton";
import LogoImage from "./LogoImage";
import AuthModal from "./AuthModal";
import ExportPDFButton from "./ExportPDFButton";
import { isAuthenticated } from "@/lib/auth";
import { withBasePath } from "@/lib/getBasePath";

interface Section {
  heading: string;
  body: string;
  image: string | string[];
}

interface ArticleLayoutProps {
  children: React.ReactNode;
  title: string;
  studentName: string;
  slug: string;
  sections: Section[];
}

/**
 * Layout para páginas de artigos individuais com proteção por senha
 */
export default function ArticleLayout({
  children,
  title,
  studentName,
  slug,
  sections,
}: ArticleLayoutProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verifica autenticação ao montar o componente
    const checkAuth = () => {
      const authenticated = isAuthenticated(slug);
      setIsAuthorized(authenticated);
      setIsAuthModalOpen(!authenticated);
    };

    checkAuth();
  }, [slug]);

  const handleAuthSuccess = () => {
    setIsAuthorized(true);
    setIsAuthModalOpen(false);
  };

  const safeTitle = title?.trim() || "Artigo";
  const safeStudentName = studentName?.trim() || "";
  const [bannerPath, setBannerPath] = useState<string>(
    "/images/banner/arcoiris.jpeg"
  );

  useEffect(() => {
    // Aplica basePath após montagem do componente (no cliente)
    setBannerPath(withBasePath("/images/banner/arcoiris.jpeg"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white relative">
      <header className="w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <BackButton />
            <div className="flex-1 flex justify-center">
              <div className="scale-150">
                <LogoImage />
              </div>
            </div>
            {isAuthorized && (
              <div className="flex items-center">
                <ExportPDFButton
                  title={safeTitle}
                  studentName={safeStudentName}
                  sections={sections}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <main
        className={`max-w-4xl mx-auto px-4 py-12 ${
          !isAuthorized ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {/* Título do Portifólio */}
        <div className="text-center mb-6">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6 uppercase"
            style={{ color: "#000000" }}
          >
            Meu Portifólio 2025
          </h2>
        </div>

        {/* Banner */}
        <div className="relative w-full mb-6 rounded-lg overflow-hidden shadow-md">
          <div className="relative w-full">
            <Image
              src={bannerPath}
              alt="Banner do portifólio"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Cabeçalho com informações da escola */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8 shadow-sm">
          <div className="text-left space-y-2">
            <p className="text-lg font-semibold text-slate-800 uppercase">
              Rede Municipal de Ensino de Itajaí
            </p>
            <p className="text-lg font-semibold text-slate-800 uppercase">
              C.E.I Hercílio Bento
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-base text-slate-700 uppercase">
                <span className="font-semibold">Professora:</span> Antonia
                Josilene
              </p>
              <p className="text-base text-slate-700 uppercase">
                <span className="font-semibold">Agentes:</span> Suzana e
                Alessandra
              </p>
              <p className="text-base text-slate-700 uppercase">
                <span className="font-semibold">Turma:</span> MATERNAL II
              </p>
              {safeStudentName && (
                <p className="text-base text-slate-700 uppercase">
                  <span className="font-semibold">Aluno(a):</span>{" "}
                  {safeStudentName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Seção Introdutória - Objetivo do Portifólio */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 mb-8 shadow-md">
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 uppercase">
              Objetivo do Portifólio
            </h3>
          </div>
          <div className="text-justify space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
            <p>
              Este portfólio tem como objetivo registrar e valorizar o processo
              de aprendizagem e desenvolvimento das crianças, em alinhamento com
              a Base Nacional Comum Curricular (BNCC). Por meio da documentação
              das vivências cotidianas, interações, brincadeiras, explorações e
              descobertas, buscamos evidenciar como cada criança constrói
              saberes de forma progressiva, respeitando seu tempo, seus
              interesses e sua singularidade.
            </p>
            <p>
              O portfólio também fortalece a parceria entre escola e família,
              permitindo que os responsáveis acompanhem de perto as conquistas,
              avanços e experiências significativas vivenciadas pelas crianças.
              Assim, constitui-se como um instrumento pedagógico que celebra a
              infância, reconhece suas múltiplas linguagens e dá visibilidade ao
              desenvolvimento integral dos pequenos.
            </p>
          </div>
        </div>

        {children}

        {/* Seção de Despedida */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 mb-8 shadow-md mt-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 uppercase">
              Despedida
            </h3>
          </div>
          <div className="text-justify space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
            <p>
              Encerramos este portfólio com o coração cheio de gratidão e
              orgulho. Ao longo deste percurso, vivenciamos juntos um início
              repleto de descobertas, um meio marcado por aprendizados, desafios
              e conquistas, e um fim que celebra o crescimento de cada criança.
              Cada página aqui registrada traz um pedacinho da trajetória
              construída com carinho, esforço e dedicação. Em cada traço,
              sorriso, tentativa e superação, vemos o brilho do desenvolvimento
              infantil acontecendo de forma única e especial. Levaremos no
              coração cada momento vivido com vocês, cada conquista celebrada e
              cada gesto de afeto compartilhado. Na Educação Infantil,
              ensinamos, mas também aprendemos: aprendemos a olhar o mundo com
              mais leveza, imaginação e verdade, exatamente como as crianças nos
              mostram todos os dias. Que este portfólio simbolize o quanto
              crescemos juntos. Que as sementes plantadas aqui floresçam em
              sucesso, coragem, organização, autonomia e novos sonhos. A todas
              as crianças, desejamos boa sorte em seus novos caminhos. Continuem
              curiosas, sensíveis e cheias de vontade de explorar o mundo. Que
              cada passo seja cheio de luz, descobertas e alegria.
            </p>
            <p>
              levem um pedacinho de nós com vocês, assim como cada um de vocês
              ficará guardado em nosso coração.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-center">Com gratidão e carinho,</p>
              <p className="text-center font-semibold">PROFª JOSY ALMEIDA</p>
              <p className="text-center font-semibold">
                AGENTES: SUZANA E ALESSANDRA
              </p>
            </div>
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        studentName={safeStudentName}
        slug={slug}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
