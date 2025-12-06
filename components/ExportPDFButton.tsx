"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import { withBasePath } from "@/lib/getBasePath";

interface Section {
  heading: string;
  body: string;
  image: string | string[];
}

interface ExportPDFButtonProps {
  title: string;
  studentName: string;
  sections: Section[];
}

/**
 * Componente que exporta o artigo completo em PDF
 * Cada atividade (seção) é organizada em uma página separada
 */
export default function ExportPDFButton({
  title,
  studentName,
  sections,
}: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (error) => {
        console.error("Erro ao carregar imagem:", src, error);
        reject(error);
      };
      // Se src já é uma URL completa, usa diretamente; caso contrário, aplica basePath
      img.src = src.startsWith("http") ? src : withBasePath(src);
    });
  };

  /**
   * Justifica um texto ajustando o espaçamento entre palavras
   */
  const justifyText = (
    pdf: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth: number
  ): number => {
    // Remove quebras de linha e normaliza espaços
    const cleanText = text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    const words = cleanText.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = pdf.getTextWidth(testLine);

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    let currentY = y;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Se não é a última linha e a linha tem mais de uma palavra, justifica
      if (i < lines.length - 1 && line.trim().length > 0) {
        const wordsInLine = line.split(" ").filter((w) => w.length > 0);
        if (wordsInLine.length > 1) {
          const totalWordsWidth = wordsInLine.reduce(
            (sum, word) => sum + pdf.getTextWidth(word),
            0
          );
          const totalSpaces = wordsInLine.length - 1;
          const spaceWidth =
            totalSpaces > 0 ? (maxWidth - totalWordsWidth) / totalSpaces : 0;
          let currentX = x;
          for (let j = 0; j < wordsInLine.length; j++) {
            pdf.text(wordsInLine[j], currentX, currentY);
            if (j < wordsInLine.length - 1) {
              currentX += pdf.getTextWidth(wordsInLine[j]) + spaceWidth;
            }
          }
        } else {
          pdf.text(line, x, currentY);
        }
      } else {
        // Última linha: alinha à esquerda
        pdf.text(line, x, currentY);
      }
      currentY += 7;
    }

    return currentY;
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      const maxImageHeight = 100; // altura máxima para imagens em mm (aumentada para melhor visualização)

      // ========== PRIMEIRA PÁGINA: Título, Banner e Cabeçalho ==========
      let yPosition = margin;

      // Título "MEU PORTIFÓLIO 2025" - Centralizado e em maiúsculas
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      const titleText = "MEU PORTIFÓLIO 2025";
      const titleWidth = pdf.getTextWidth(titleText);
      pdf.text(titleText, (pageWidth - titleWidth) / 2, yPosition);
      yPosition += 15;

      // Banner - de ponta a ponta (sem margens)
      try {
        // Constrói a URL completa da imagem do banner
        const bannerPath = withBasePath("/images/banner/arcoiris.jpeg");
        const bannerUrl = bannerPath.startsWith("http")
          ? bannerPath
          : `${window.location.origin}${bannerPath}`;

        console.log("Carregando banner de:", bannerUrl);
        const bannerImg = await loadImage(bannerUrl);
        console.log(
          "Banner carregado:",
          bannerImg.width,
          "x",
          bannerImg.height
        );

        const bannerAspectRatio = bannerImg.width / bannerImg.height;
        const bannerWidth = pageWidth; // Largura total da página (210mm para A4)
        const bannerHeight = bannerWidth / bannerAspectRatio;

        pdf.addImage(
          bannerImg,
          "JPEG",
          0, // Começa na borda esquerda
          yPosition,
          bannerWidth,
          bannerHeight
        );
        yPosition += bannerHeight + 10;
      } catch (error) {
        console.error("Erro ao carregar banner:", error);
        // Continua mesmo se o banner falhar
      }

      // Cabeçalho com informações da escola - Apenas labels em bold
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("REDE MUNICIPAL DE ENSINO DE ITAJAÍ", margin, yPosition);
      yPosition += 8;

      pdf.text("C.E.I HERCÍLIO BENTO", margin, yPosition);
      yPosition += 8;

      // PROFESSORA: em bold, nome em normal
      pdf.setFont("helvetica", "bold");
      pdf.text("PROFESSORA:", margin, yPosition);
      const professorLabelWidth = pdf.getTextWidth("PROFESSORA:");
      pdf.setFont("helvetica", "normal");
      pdf.text(" ANTONIA JOSILENE", margin + professorLabelWidth, yPosition);
      yPosition += 8;

      // AGENTES: em bold, nomes em normal
      pdf.setFont("helvetica", "bold");
      pdf.text("AGENTES:", margin, yPosition);
      const agentsLabelWidth = pdf.getTextWidth("AGENTES:");
      pdf.setFont("helvetica", "normal");
      pdf.text(" SUZANA E ALESSANDRA", margin + agentsLabelWidth, yPosition);
      yPosition += 8;

      // TURMA: em bold, valor em normal
      pdf.setFont("helvetica", "bold");
      pdf.text("TURMA:", margin, yPosition);
      const turmaLabelWidth = pdf.getTextWidth("TURMA:");
      pdf.setFont("helvetica", "normal");
      pdf.text(" MATERNAL II", margin + turmaLabelWidth, yPosition);
      yPosition += 8;

      // ALUNO(A): em bold, nome em normal
      if (studentName) {
        pdf.setFont("helvetica", "bold");
        pdf.text("ALUNO(A):", margin, yPosition);
        const alunoLabelWidth = pdf.getTextWidth("ALUNO(A):");
        pdf.setFont("helvetica", "normal");
        pdf.text(
          ` ${studentName.toUpperCase()}`,
          margin + alunoLabelWidth,
          yPosition
        );
      }

      // ========== PÁGINA DO OBJETIVO DO PROJETO ==========
      pdf.addPage();
      yPosition = margin + 20;

      // Título da seção
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      const objectiveTitle = "Objetivo do Portifólio";
      const objectiveTitleWidth = pdf.getTextWidth(objectiveTitle);
      pdf.text(
        objectiveTitle,
        (pageWidth - objectiveTitleWidth) / 2,
        yPosition
      );
      yPosition += 20;

      // Texto do objetivo - Justificado
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const objectiveText =
        "Este portfólio tem como objetivo registrar e valorizar o processo de aprendizagem e desenvolvimento das crianças, em alinhamento com a Base Nacional Comum Curricular (BNCC). Por meio da documentação das vivências cotidianas, interações, brincadeiras, explorações e descobertas, buscamos evidenciar como cada criança constrói saberes de forma progressiva, respeitando seu tempo, seus interesses e sua singularidade.\n\nO portfólio também fortalece a parceria entre escola e família, permitindo que os responsáveis acompanhem de perto as conquistas, avanços e experiências significativas vivenciadas pelas crianças. Assim, constitui-se como um instrumento pedagógico que celebra a infância, reconhece suas múltiplas linguagens e dá visibilidade ao desenvolvimento integral dos pequenos.";

      // Divide por parágrafos
      const paragraphs = objectiveText.split("\n\n");
      for (const paragraph of paragraphs) {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
        yPosition = justifyText(
          pdf,
          paragraph,
          margin,
          yPosition,
          contentWidth
        );
        yPosition += 4; // Espaço entre parágrafos
      }

      // ========== PRÓXIMAS PÁGINAS: Uma atividade por página ==========
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];

        // Nova página para cada atividade
        pdf.addPage();
        yPosition = margin;

        // Nome da atividade - Centralizado e maior
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        const activityTitle = section.heading || "Atividade";
        const titleLines = pdf.splitTextToSize(activityTitle, contentWidth);

        // Centraliza cada linha do título
        for (let lineIndex = 0; lineIndex < titleLines.length; lineIndex++) {
          const line = titleLines[lineIndex];
          const lineWidth = pdf.getTextWidth(line);
          const xPos = (pageWidth - lineWidth) / 2;
          pdf.text(line, xPos, yPosition);
          yPosition += 8;
        }
        yPosition += 5;

        // Carrega e adiciona imagens (reduzidas)
        const images = Array.isArray(section.image)
          ? section.image
          : [section.image];

        const validImages = images.filter((img) => img && img.trim());
        const imageCount = validImages.length;
        let maxImgHeight = 0;

        if (imageCount > 0) {
          // Carrega todas as imagens primeiro para calcular dimensões
          const loadedImages: Array<{
            img: HTMLImageElement;
            width: number;
            height: number;
          }> = [];

          for (const imageSrc of validImages) {
            try {
              const img = await loadImage(imageSrc);
              const imgAspectRatio = img.width / img.height;
              let imgW = imageCount > 1 ? (contentWidth - 5) / 2 : contentWidth;
              let imgH = imgW / imgAspectRatio;

              // Redimensiona se a imagem for muito alta
              if (imgH > maxImageHeight) {
                imgH = maxImageHeight;
                imgW = maxImageHeight * imgAspectRatio;
              }

              loadedImages.push({ img, width: imgW, height: imgH });
              if (imgH > maxImgHeight) {
                maxImgHeight = imgH;
              }
            } catch (error) {
              console.error(`Erro ao carregar imagem: ${imageSrc}`, error);
            }
          }

          // Adiciona as imagens ao PDF
          for (let imgIndex = 0; imgIndex < loadedImages.length; imgIndex++) {
            const { img, width: imgW, height: imgH } = loadedImages[imgIndex];
            let xPos = margin;

            if (imageCount > 1) {
              // Duas imagens lado a lado
              const spacing = 5;
              const totalWidth = imageCount * imgW + (imageCount - 1) * spacing;
              const startX = margin + (contentWidth - totalWidth) / 2;
              xPos = startX + imgIndex * (imgW + spacing);
            } else {
              // Uma imagem centralizada
              xPos = margin + (contentWidth - imgW) / 2;
            }

            pdf.addImage(img, "PNG", xPos, yPosition, imgW, imgH);
          }

          yPosition += maxImgHeight + 8;
        }

        // Objetivo - Tamanho maior e proporcional
        if (section.body && section.body.trim()) {
          if (yPosition > pageHeight - 60) {
            yPosition = margin + 10;
          }

          pdf.setFontSize(14);
          pdf.setFont("helvetica", "normal");

          const bodyText = section.body.startsWith("OBJETIVO:")
            ? section.body
            : `OBJETIVO: ${section.body}`;

          // Adiciona o texto do objetivo justificado
          yPosition = justifyText(
            pdf,
            bodyText,
            margin,
            yPosition,
            contentWidth
          );
        }
      }

      // ========== ÚLTIMA PÁGINA: DESPEDIDA ==========
      pdf.addPage();
      yPosition = margin + 20;

      // Título da seção
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      const farewellTitle = "DESPEDIDA";
      const farewellTitleWidth = pdf.getTextWidth(farewellTitle);
      pdf.text(farewellTitle, (pageWidth - farewellTitleWidth) / 2, yPosition);
      yPosition += 20;

      // Texto da despedida - Justificado
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const farewellText =
        "Encerramos este portfólio com o coração cheio de gratidão e orgulho. Ao longo deste percurso, vivenciamos juntos um início repleto de descobertas, um meio marcado por aprendizados, desafios e conquistas, e um fim que celebra o crescimento de cada criança. Cada página aqui registrada traz um pedacinho da trajetória construída com carinho, esforço e dedicação. Em cada traço, sorriso, tentativa e superação, vemos o brilho do desenvolvimento infantil acontecendo de forma única e especial. Levaremos no coração cada momento vivido com vocês, cada conquista celebrada e cada gesto de afeto compartilhado. Na Educação Infantil, ensinamos, mas também aprendemos: aprendemos a olhar o mundo com mais leveza, imaginação e verdade, exatamente como as crianças nos mostram todos os dias. Que este portfólio simbolize o quanto crescemos juntos. Que as sementes plantadas aqui floresçam em sucesso, coragem, organização, autonomia e novos sonhos. A todas as crianças, desejamos boa sorte em seus novos caminhos. Continuem curiosas, sensíveis e cheias de vontade de explorar o mundo. Que cada passo seja cheio de luz, descobertas e alegria.";

      // Divide por parágrafos
      const farewellParagraphs = farewellText.split("\n\n");
      for (const paragraph of farewellParagraphs) {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
        yPosition = justifyText(
          pdf,
          paragraph,
          margin,
          yPosition,
          contentWidth
        );
        yPosition += 4; // Espaço entre parágrafos
      }

      // Texto final (justificado)
      yPosition += 4;
      pdf.setFont("helvetica", "normal");
      const finalText =
        "levem um pedacinho de nós com vocês, assim como cada um de vocês ficará guardado em nosso coração.";
      yPosition = justifyText(pdf, finalText, margin, yPosition, contentWidth);
      yPosition += 10;

      pdf.text("Com gratidão e carinho,", margin, yPosition);
      yPosition += 8;

      pdf.setFont("helvetica", "bold");
      pdf.text("PROFª JOSY ALMEIDA", margin, yPosition);
      yPosition += 8;

      pdf.text("AGENTES: SUZANA E ALESSANDRA", margin, yPosition);

      // Salva o PDF
      const fileName = `${studentName || "artigo"}_${title.replace(
        /\s+/g,
        "_"
      )}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar PDF. Por favor, tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToPDF}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      aria-label="Exportar artigo em PDF"
      type="button"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="hidden sm:inline">Exportando...</span>
        </>
      ) : (
        <>
          <FileDown className="w-5 h-5" />
          <span className="hidden sm:inline">Exportar PDF</span>
        </>
      )}
    </button>
  );
}
