const fs = require('fs');
const path = require('path');

// Mapeamento dos headings para os novos nomes de imagens
const imageMapping = {
  'MEU 1º DIA DE AULA': ['/images/Theo/meu-1-dia-de-aula.png'],
  'PINTURA COLETIVA': ['/images/Theo/pintura-coletiva.png', '/images/Theo/pintura-coletiva-2.png'],
  'EXPLORANDO O PARQUE': ['/images/Theo/explorando-o-parque.png'],
  'PINTURA DIRIGIDA': ['/images/Theo/pintura-dirigida.png'],
  'HORA DA LEITURA': ['/images/Theo/hora-da-leitura.png', '/images/Theo/hora-da-leitura-2.png'],
  'QUAL MINHA ALTURA?': ['/images/Theo/qual-minha-altura.png'],
  'CAÇA AOS ELÁSTICOS COLORIDOS': ['/images/Theo/caca-aos-elasticos-coloridos.png'],
  'ROTINA QUALIFICADA': ['/images/Theo/rotina-qualificada.png', '/images/Theo/rotina-qualificada-2.png'],
  'MÃOS QUE PINTAM O MUNDO': ['/images/Theo/maos-que-pintam-o-mundo.png'],
  'PAREAMENTO COM SOMBRA': ['/images/Theo/pareamento-com-sombra.png'],
  'CHUVA DE CORES': ['/images/Theo/chuva-de-cores.png'],
  'EXPLORANDO A NATUREZA': ['/images/Theo/explorando-a-natureza.png', '/images/Theo/explorando-a-natureza-2.png'],
  'PINÇA DAS CORES': ['/images/Theo/pinca-das-cores.png'],
  'DESAFIO DO PRENDEDOR': ['/images/Theo/desafio-do-prendedor.png'],
  'PÁSCOA': ['/images/Theo/pascoa.png', '/images/Theo/pascoa-2.png'],
  'PIQUENIQUE': ['/images/Theo/piquenique.png'],
  'DIA DAS MÃES': ['/images/Theo/dia-das-maes.png'],
  'QUAL NÚMERO DO MEU SAPATO?': ['/images/Theo/qual-numero-do-meu-sapato.png'],
  'RELEITURA DO BICO DO PAPAGAIO': ['/images/Theo/releitura-do-bico-do-papagaio.png'],
  'TEMA JUNINO': ['/images/Theo/tema-junino.png', '/images/Theo/tema-junino-2.png'],
  'AUTORRETRATO': ['/images/Theo/autorretrato.png'],
  'DIA DOS PAIS': ['/images/Theo/dia-dos-pais.png'],
  '1º LETRA DO MEU NOME': ['/images/Theo/1-letra-do-meu-nome.png'],
  'MOMENTO CULTURAL': ['/images/Theo/momento-cultural.png'],
  'MOMENTO CÍVICO': ['/images/Theo/momento-civico.png'],
  'PRIMAVERA - RELEITURA DA OBRA DE VAN GOGH "OS GIRASSÓIS"': ['/images/Theo/primavera-releitura-van-gogh-girassois.png'],
  'DIA DAS CRIANÇAS': ['/images/Theo/dia-das-criancas.png', '/images/Theo/dia-das-criancas-2.png'],
  'AS EMOÇÕES': ['/images/Theo/as-emocoes.png'],
  'CONSCIÊNCIA NEGRA': ['/images/Theo/consciencia-negra.png'],
  'NATAL DE LUZ': ['/images/Theo/natal-de-luz.png'],
};

const theoJsonPath = path.join(process.cwd(), 'content/articles/theo.json');
const theoData = JSON.parse(fs.readFileSync(theoJsonPath, 'utf-8'));

console.log('=== ATUALIZANDO IMAGENS DO THÉO ===\n');

// Atualizar cada seção
theoData.sections = theoData.sections.map((section) => {
  const heading = section.heading;
  const images = imageMapping[heading];
  
  if (images) {
    const newImage = images.length === 1 ? images[0] : images;
    console.log(`✓ ${heading}: ${Array.isArray(newImage) ? newImage.length : 1} imagem(ns)`);
    return {
      ...section,
      image: newImage,
    };
  }
  
  console.log(`⚠️  Heading não encontrado: ${heading}`);
  return section;
});

// Salvar o JSON atualizado
fs.writeFileSync(theoJsonPath, JSON.stringify(theoData, null, 2), 'utf-8');
console.log('\n=== CONCLUÍDO ===');

