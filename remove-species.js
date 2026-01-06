const fs = require('fs');
const path = require('path');

// Read register.html
const registerPath = 'register.html';
let registerContent = fs.readFileSync(registerPath, 'utf8');

// List all HTML files in species/ excluding Images/
const speciesDir = 'species';
const speciesFiles = fs.readdirSync(speciesDir)
    .filter(file => file.endsWith('.html') && !file.startsWith('Images') && file !== 'Images');

// Array to hold species to remove
const toRemove = [];

// Check each species file
speciesFiles.forEach(file => {
    const filePath = path.join(speciesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Find img src
    const imgMatch = content.match(/src="\.\.\/Images\/([^"]+)"/) || content.match(/src="\.\/Images\/([^"]+)"/);
    if (imgMatch) {
        const imgFilename = imgMatch[1];
        const imgPath = path.join(speciesDir, 'Images', imgFilename);

        if (!fs.existsSync(imgPath)) {
            toRemove.push({ file, imgFilename });
        }
    } else {
        console.log(`No image src found in ${file}, skipping.`);
    }
});

console.log('Species to remove:');
toRemove.forEach(({ file, imgFilename }) => {
    console.log(`- ${file} (missing ${imgFilename})`);
});

// Remove HTML files
toRemove.forEach(({ file }) => {
    const filePath = path.join(speciesDir, file);
    fs.unlinkSync(filePath);
    console.log(`Removed ${file}`);
});

// Remove from register.html
toRemove.forEach(({ file }) => {
    // Find and remove the card
    const escapedFile = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cardRegex = new RegExp(`\\s*<a href="species/${escapedFile}"[^>]*>[\\s\\S]*?<\\/a>`, 'g');
    const match = registerContent.match(cardRegex);
    if (match) {
        console.log(`Removing card for ${file}`);
        registerContent = registerContent.replace(cardRegex, '');
    } else {
        console.log(`Card for ${file} not found in register.html`);
    }
});

// Also remove any orphaned cards (cards pointing to non-existent HTML files)
const cardMatches = registerContent.match(/<a href="species\/([^"]+\.html)"[^>]*>[\s\S]*?<\/a>/g);
if (cardMatches) {
    cardMatches.forEach(card => {
        const hrefMatch = card.match(/href="species\/([^"]+\.html)"/);
        if (hrefMatch) {
            const fileName = hrefMatch[1];
            const filePath = path.join(speciesDir, fileName);
            if (!fs.existsSync(filePath)) {
                console.log(`Removing orphaned card for ${fileName}`);
                registerContent = registerContent.replace(card, '');
            }
        }
    });
}

fs.writeFileSync(registerPath, registerContent);

console.log(`Removed ${toRemove.length} species with missing images.`);
