const fs = require('fs');
const path = require('path');

const articlesDir = path.join(process.cwd(), 'content', 'articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));

const registered = files.map(f => {
  const content = JSON.parse(fs.readFileSync(path.join(articlesDir, f), 'utf-8'));
  return content.studentName.toLowerCase();
});

const required = [
  'beatriz', 'levi', 'maria clara', 'isabella', 'bernardo', 
  'allana', 'emilly', 'maria cecília', 'ezekiel', 'juan',
  'heitor', 'pedro', 'caio', 'théo', 'luiza', 
  'maria antonella', 'miguel'
];

console.log('=== CRIANÇAS CADASTRADAS ===');
registered.forEach(r => console.log('  ✓', r));

console.log('\n=== CRIANÇAS FALTANDO ===');
const missing = required.filter(r => !registered.includes(r));
missing.forEach(m => console.log('  ✗', m));

console.log(`\nTotal: ${registered.length} cadastradas de ${required.length} necessárias`);

