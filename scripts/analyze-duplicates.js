const fs = require('fs');
const path = require('path');

const articlesDir = path.join(process.cwd(), 'content', 'articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));

const sectionsMap = new Map();
const students = [];

files.forEach(f => {
  const content = JSON.parse(fs.readFileSync(path.join(articlesDir, f), 'utf-8'));
  students.push(content.studentName);
  
  content.sections.forEach((sec) => {
    const key = sec.heading + '|' + sec.body;
    if (!sectionsMap.has(key)) {
      sectionsMap.set(key, { 
        heading: sec.heading, 
        body: sec.body, 
        count: 0, 
        students: [] 
      });
    }
    const entry = sectionsMap.get(key);
    entry.count++;
    if (!entry.students.includes(content.studentName)) {
      entry.students.push(content.studentName);
    }
  });
});

console.log('=== ANÁLISE DE DADOS ===\n');
console.log('Crianças cadastradas (' + students.length + '):');
students.sort().forEach(s => console.log('  - ' + s));

console.log('\n=== ANÁLISE DE DUPLICAÇÕES ===\n');
console.log('Total de seções únicas:', sectionsMap.size);
const duplicates = Array.from(sectionsMap.values()).filter(s => s.count > 1).sort((a, b) => b.count - a.count);
console.log('Seções duplicadas:', duplicates.length);
console.log('\nTop 10 seções mais duplicadas:');
duplicates.slice(0, 10).forEach(s => {
  console.log(`  - "${s.heading}": aparece em ${s.count} artigos (${s.students.length} alunos diferentes)`);
});

