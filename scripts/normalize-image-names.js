const fs = require('fs');
const path = require('path');

/**
 * Normaliza um texto para nome de arquivo
 * Remove acentos, converte para minúsculas, remove caracteres especiais
 */
function normalizeFileName(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais exceto espaços e hífens
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, ''); // Remove hífens no início e fim
}

// Mapeamento dos headings para os nomes das imagens
const imageMapping = {
  'MEU 1º DIA DE AULA': ['MEU 1 DIA DE AULA.png'],
  'PINTURA COLETIVA': ['PINTURA COLETIVA.png', 'PINTURA COLETIVA2.png'],
  'EXPLORANDO O PARQUE': ['EXPLORANDO O PARQUE.png'],
  'PINTURA DIRIGIDA': ['PINTURA DIRIGIDA.png'],
  'HORA DA LEITURA': ['HORA DA LEITURA.png', 'HORA DA LEITURA2.png'],
  'QUAL MINHA ALTURA?': ['QUAL MINHA ALTURA.png'],
  'CAÇA AOS ELÁSTICOS COLORIDOS': ['CAÇA AOS ELÁSTICOS COLORIDOS.png'],
  'ROTINA QUALIFICADA': ['ROTINA QUALIFICADA.png', 'ROTINA QUALIFICADA2.png'],
  'MÃOS QUE PINTAM O MUNDO': ['MÃOS QUE PINTAM O MUNDO.png'],
  'PAREAMENTO COM SOMBRA': ['PAREAMENTO COM SOMBRA.png'],
  'CHUVA DE CORES': ['CHUVA DE CORES.png'],
  'EXPLORANDO A NATUREZA': ['EXPLORANDO A NATUREZA.png', 'EXPLORANDO A NATUREZA2.png'],
  'PINÇA DAS CORES': ['PINÇA DAS CORES.png'],
  'DESAFIO DO PRENDEDOR': ['DESAFIO DO PRENDEDOR.png'],
  'PÁSCOA': ['PÁSCOA.png', 'PÁSCOA2.png'],
  'PIQUENIQUE': ['PIQUENIQUE.png'],
  'DIA DAS MÃES': ['DIA DAS MÃES.png'],
  'QUAL NÚMERO DO MEU SAPATO?': ['QUAL NÚMERO DO MEU SAPATO.png'],
  'RELEITURA DO BICO DO PAPAGAIO': ['RELEITURA DO BICO DO PAPAGAIO.png'],
  'TEMA JUNINO': ['TEMA JUNINO.png', 'TEMA JUNINO2.png'],
  'AUTORRETRATO': ['AUTORRETRATO.png'],
  'DIA DOS PAIS': ['DIA DOS PAIS.png'],
  '1º LETRA DO MEU NOME': ['1º LETRA DO MEU NOME.png'],
  'MOMENTO CULTURAL': ['MOMENTO CULTURAL.png'],
  'MOMENTO CÍVICO': ['MOMENTO CÍVICO.png'],
  'PRIMAVERA - RELEITURA DA OBRA DE VAN GOGH "OS GIRASSÓIS"': ['RELEITURA DA OBRA DE VAN GOGH "OS GIRASSÓIS".png'],
  'DIA DAS CRIANÇAS': ['DIA DAS CRIANÇAS.png', 'DIA DAS CRIANÇAS2.png'],
  'AS EMOÇÕES': ['AS EMOÇÕES.png'],
  'CONSCIÊNCIA NEGRA': ['CONSCIÊNCIA NEGRA.png'],
  'NATAL DE LUZ': ['NATAL DE LUZ.png'],
};

const imagesDir = path.join(process.cwd(), 'public/images/Theo');
const files = fs.readdirSync(imagesDir);

console.log('=== RENOMEAÇÃO DE IMAGENS ===\n');

// Renomear arquivos
files.forEach((file) => {
  if (!file.endsWith('.png')) return;
  
  // Encontrar o heading correspondente
  let foundHeading = null;
  let imageIndex = null;
  
  for (const [heading, imageFiles] of Object.entries(imageMapping)) {
    const index = imageFiles.findIndex(img => img === file);
    if (index !== -1) {
      foundHeading = heading;
      imageIndex = index;
      break;
    }
  }
  
  if (!foundHeading) {
    console.log(`⚠️  Arquivo não mapeado: ${file}`);
    return;
  }
  
  const baseName = normalizeFileName(foundHeading);
  const newName = imageIndex === 0 
    ? `${baseName}.png`
    : `${baseName}-${imageIndex + 1}.png`;
  
  const oldPath = path.join(imagesDir, file);
  const newPath = path.join(imagesDir, newName);
  
  if (file !== newName) {
    fs.renameSync(oldPath, newPath);
    console.log(`✓ ${file} → ${newName}`);
  } else {
    console.log(`- ${file} (já está no padrão)`);
  }
});

console.log('\n=== CONCLUÍDO ===');

