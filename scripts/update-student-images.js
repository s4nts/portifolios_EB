const fs = require('fs');
const path = require('path');

// Função para normalizar o nome do arquivo (converter heading para nome de arquivo)
function normalizeFileName(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
}

// Mapeamento dos headings para os nomes de arquivos normalizados
// Este mapeamento é usado para encontrar as imagens corretas nas pastas
const headingToFileName = {
  'MEU 1º DIA DE AULA': 'meu-1-dia-de-aula',
  'PINTURA COLETIVA': 'pintura-coletiva',
  'EXPLORANDO O PARQUE': 'explorando-o-parque',
  'PINTURA DIRIGIDA': 'pintura-dirigida',
  'HORA DA LEITURA': 'hora-da-leitura',
  'QUAL MINHA ALTURA?': 'qual-minha-altura',
  'CAÇA AOS ELÁSTICOS COLORIDOS': 'caca-aos-elasticos-coloridos',
  'ROTINA QUALIFICADA': 'rotina-qualificada',
  'MÃOS QUE PINTAM O MUNDO': 'maos-que-pintam-o-mundo',
  'PAREAMENTO COM SOMBRA': 'pareamento-com-sombra',
  'CHUVA DE CORES': 'chuva-de-cores',
  'EXPLORANDO A NATUREZA': 'explorando-a-natureza',
  'PINÇA DAS CORES': 'pinca-das-cores',
  'DESAFIO DO PRENDEDOR': 'desafio-do-prendedor',
  'PÁSCOA': 'pascoa',
  'PIQUENIQUE': 'piquenique',
  'DIA DAS MÃES': 'dia-das-maes',
  'QUAL NÚMERO DO MEU SAPATO?': 'qual-numero-do-meu-sapato',
  'RELEITURA DO BICO DO PAPAGAIO': 'releitura-do-bico-do-papagaio',
  'TEMA JUNINO': 'tema-junino',
  'AUTORRETRATO': 'autorretrato',
  'DIA DOS PAIS': 'dia-dos-pais',
  '1º LETRA DO MEU NOME': '1-letra-do-meu-nome',
  'MOMENTO CULTURAL': 'momento-cultural',
  'MOMENTO CÍVICO': 'momento-civico',
  'PRIMAVERA - RELEITURA DA OBRA DE VAN GOGH "OS GIRASSÓIS"': 'primavera-releitura-van-gogh-girassois',
  'DIA DAS CRIANÇAS': 'dia-das-criancas',
  'AS EMOÇÕES': 'as-emocoes',
  'CONSCIÊNCIA NEGRA': 'consciencia-negra',
  'NATAL DE LUZ': 'natal-de-luz',
};

// Mapeamento de nomes de pastas para slugs dos arquivos JSON
// Algumas pastas têm espaços ou nomes diferentes dos slugs
const folderToSlugMap = {
  'Allana': 'allana',
  'Beatriz': 'beatriz',
  'Emilly': 'emilly',
  'Bernardo': 'bernardo',
  'Caio': 'caio',
  'Ezekiel': 'ezekiel',
  'Heitor': 'heitor',
  'Isabella': 'isabella',
  'Juan': 'juan',
  'Levi': 'levi',
  'Luiza': 'luiza',
  'Maria Antonella': 'maria-antonella',
  'Maria Cecilia': 'maria-cecilia',
  'Maria Clara': 'maria-clara',
  'Miguel': 'miguel',
  'Pedro': 'pedro',
  'Theo': 'theo',
};

// Detecta automaticamente todas as pastas de alunos
const imagesBaseDir = path.join(process.cwd(), 'public/images');
const allFolders = fs.readdirSync(imagesBaseDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .filter(name => !['banner'].includes(name)); // Exclui pastas que não são de alunos

// Filtra apenas pastas que estão no mapeamento
const students = allFolders.filter(folder => folderToSlugMap.hasOwnProperty(folder));

console.log(`\n📁 Pastas de alunos encontradas: ${students.length}`);
students.forEach(folder => {
  console.log(`   - ${folder} → ${folderToSlugMap[folder]}`);
});

students.forEach((studentFolder) => {
  const studentSlug = folderToSlugMap[studentFolder];
  const imagesDir = path.join(process.cwd(), 'public/images', studentFolder);
  const jsonPath = path.join(process.cwd(), 'content/articles', `${studentSlug}.json`);

  if (!fs.existsSync(imagesDir)) {
    console.log(`⚠️  Pasta de imagens não encontrada para ${studentFolder}: ${imagesDir}`);
    return;
  }

  if (!fs.existsSync(jsonPath)) {
    console.log(`⚠️  Arquivo JSON não encontrado para ${studentFolder} (slug: ${studentSlug}): ${jsonPath}`);
    return;
  }

  const files = fs.readdirSync(imagesDir);
  const studentData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  console.log(`\n=== ATUALIZANDO IMAGENS DO ${studentFolder.toUpperCase()} (${studentSlug}) ===\n`);

  const sectionsWithImages = [];
  const sectionsWithoutImages = [];

  // Atualizar cada seção
  studentData.sections.forEach((section) => {
    const heading = section.heading;
    const baseFileName = headingToFileName[heading];

    if (!baseFileName) {
      console.log(`⚠️  Heading não mapeado: ${heading}`);
      sectionsWithoutImages.push(heading);
      return;
    }

    // Procurar imagens que correspondem ao heading
    const matchingImages = files.filter((file) => {
      const fileNameWithoutExt = file.replace('.png', '');
      // Verifica se o arquivo começa com o nome base ou tem variações (com -2, -3, etc)
      return (
        fileNameWithoutExt === baseFileName ||
        fileNameWithoutExt.startsWith(`${baseFileName}-`)
      );
    });

    if (matchingImages.length === 0) {
      console.log(`⚠️  Nenhuma imagem encontrada para: ${heading} - SEÇÃO SERÁ REMOVIDA`);
      sectionsWithoutImages.push(heading);
      return;
    }

    // Ordenar as imagens (primeira sem sufixo, depois -2, -3, etc)
    matchingImages.sort((a, b) => {
      const aName = a.replace('.png', '');
      const bName = b.replace('.png', '');
      if (aName === baseFileName) return -1;
      if (bName === baseFileName) return 1;
      return a.localeCompare(b);
    });

    // Criar os caminhos das imagens (usa o nome da pasta original)
    const imagePaths = matchingImages.map((img) => `/images/${studentFolder}/${img}`);

    const newImage = imagePaths.length === 1 ? imagePaths[0] : imagePaths;
    console.log(`✓ ${heading}: ${imagePaths.length} imagem(ns)`);

    sectionsWithImages.push({
      ...section,
      image: newImage,
    });
  });

  // Atualizar apenas com seções que têm imagens
  studentData.sections = sectionsWithImages;

  // Salvar o JSON atualizado
  fs.writeFileSync(jsonPath, JSON.stringify(studentData, null, 2), 'utf-8');
  
  if (sectionsWithoutImages.length > 0) {
    console.log(`\n⚠️  Seções removidas (sem imagens): ${sectionsWithoutImages.length}`);
    sectionsWithoutImages.forEach((heading) => {
      console.log(`   - ${heading}`);
    });
  }
  
  console.log(`\n✓ ${studentFolder} atualizado com sucesso! (${sectionsWithImages.length} seções com imagens)`);
});

console.log('\n=== CONCLUÍDO ===');

