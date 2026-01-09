const fs = require('fs');

const html = fs.readFileSync('register.html', 'utf8');

const species = [];

// Regex to match <h3>content</h3><p><em>scientific</em></p>
const regex = /<h3>(.+?)<\/h3>\s*<p><em>(.+?)<\/em><\/p>/g;

let match;
while ((match = regex.exec(html)) !== null) {
    const h3 = match[1];
    const scientific = match[2];

    // Parse h3: "Marathi (English)"
    const h3Match = h3.match(/^(.+?)\s*\((.+)\)$/);
    if (h3Match) {
        const marathi = h3Match[1].trim();
        const english = h3Match[2].trim();
        species.push(`${scientific},${english},${marathi}`);
    }
}

fs.writeFileSync('AllSpecies.txt', species.join('\n'));

console.log('Species collected to AllSpecies.txt');
