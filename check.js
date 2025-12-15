const fs = require('fs');

const htmlFiles = fs.readdirSync('species').filter(f => f.endsWith('.html'));

const imgFiles = fs.readdirSync('species/Images');

function getKeyFromHtml(filename) {
  const name = filename.replace('.html', '');
  const parts = name.split('-');
  return parts.map((word, i) => {
    if (i === 0) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    else return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('_');
}

const imgKeys = imgFiles.map(f => f.replace('.jpeg', ''));

const matchingHtml = [];

const nonMatchingHtml = [];

htmlFiles.forEach(html => {
  const key = getKeyFromHtml(html);
  if (html === 'achyranthis-aspera.html') console.log('key:', key);
  const hasMatch = imgKeys.some(img => img.startsWith(key));
  if (hasMatch) {
    matchingHtml.push(html);
  } else {
    nonMatchingHtml.push(html);
  }
});

console.log('Matching HTML:', matchingHtml.length);
console.log(matchingHtml);
console.log('Non-matching HTML:', nonMatchingHtml.length);
console.log(nonMatchingHtml);
