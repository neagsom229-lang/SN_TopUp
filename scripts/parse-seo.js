const fs = require('fs');
const data = JSON.parse(fs.readFileSync('evidence/seo.json', 'utf8'));
const audits = data.audits;
const failing = Object.values(audits).filter((a) => a.score !== 1 && a.score !== null);
console.log('SEO Score:', data.categories.seo.score * 100);
let output = `SEO Score: ${data.categories.seo.score * 100}\n\n`;
failing.forEach((a) => {
  console.log(a.id, a.title);
  output += `ID: ${a.id}\nTitle: ${a.title}\nDetails: ${JSON.stringify(a.details || {})}\n---\n`;
});
fs.writeFileSync('evidence/seo-failures.txt', output);
