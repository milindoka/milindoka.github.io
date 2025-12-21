const fs = require('fs');
const path = require('path');
const exifr = require('exifr');

// Function to parse filename
function parseFilename(filename) {
    const base = filename.replace('.jpeg', '').replace('.jpg', '');
    const parts = base.split('=').map(s => s.replace(/_/g, ' '));
    let scientific = parts[0];
    let english = parts[1] || scientific;
    let marathi = parts[2] || parts[1] || scientific;

    // Clean scientific: remove trailing numbers
    scientific = scientific.replace(/\d+$/, '');

    // Known corrections for misspellings
    const corrections = {
        'Achyranthis aspera': 'Achyranthes aspera',
        'Chromolaena odorat': 'Chromolaena odorata',
        'Justica adhatoda': 'Justicia adhatoda',
        'Mucaana pruriens': 'Mucuna pruriens',
        'Bridellia retusa': 'Bridelia retusa',
        'Hydrophila auriculata': 'Hygrophila auriculata',
        // Add more corrections as needed
    };

    if (corrections[scientific]) {
        scientific = corrections[scientific];
    }

    return { latin: scientific, english, marathi };
}

// Function to create display name
function getDisplayName(latin, english) {
    const latinLower = latin.toLowerCase();
    const englishLower = english.toLowerCase();
    if (latinLower !== englishLower) {
        return english.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    } else {
        return latin.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
}

// Function to create page name
function createPageName(latin) {
    return latin.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') + '.html';
}

// Read register.html
const registerPath = 'register.html';
let registerContent = fs.readFileSync(registerPath, 'utf8');

// Extract existing images
const existingImages = new Set();
const speciesGridMatch = registerContent.match(/<section class="species-grid">([\s\S]*?)<\/section>/);
if (speciesGridMatch) {
    const speciesGrid = speciesGridMatch[1];
    const imgMatches = speciesGrid.match(/src="species\/Images\/([^"]+)"/g);
    if (imgMatches) {
        imgMatches.forEach(match => {
            const imgSrc = match.match(/src="species\/Images\/([^"]+)"/)[1];
            existingImages.add(imgSrc);
        });
    }
}

// List images in species/Images/
const imagesDir = 'species/Images';
const imageFiles = fs.readdirSync(imagesDir).filter(file => file.endsWith('.jpeg') || file.endsWith('.jpg'));

// Find new images
const newImages = imageFiles.filter(file => !existingImages.has(file));

if (newImages.length === 0) {
    console.log('No new images found.');
    process.exit(0);
}

// Read model HTML
const modelPath = 'species/achyranthes-aspera.html';
let modelContent = fs.readFileSync(modelPath, 'utf8');

// Process each new image
(async () => {
    for (const filename of newImages) {
        const { latin, english, marathi } = parseFilename(filename);
        const displayName = getDisplayName(latin, english);
        const pageName = createPageName(latin);

        // Extract creation date from image EXIF
        let recordedDate = 'Unknown';
        try {
            const exif = await exifr.parse(path.join(imagesDir, filename), { pick: ['DateTimeOriginal', 'CreateDate', 'ModifyDate'] });
            const dateValue = exif?.DateTimeOriginal || exif?.CreateDate || exif?.ModifyDate;
            if (dateValue) {
                const date = new Date(dateValue);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = String(date.getFullYear()).slice(-2);
                recordedDate = `${day}/${month}/${year}`;
            }
        } catch (error) {
            console.log(`Could not extract date from ${filename}: ${error.message}`);
        }

        // Create HTML page
        let pageContent = modelContent
            .replace('<title>आघाडा (Achyranthis aspera) - 🌿 The Register (PBR)</title>', `<title>${marathi} (${latin}) - 🌿 The Register (PBR)</title>`)
            .replace('आघाडा (Achyranthes aspera) - 🌿 The Register (PBR)', `${marathi} (${latin}) - 🌿 The Register (PBR)`)
            .replace('<h1>आघाडा (Achyranthis aspera)</h1>', `<h1>${marathi} (${latin})</h1>`)
            .replace('<h1>आघाडा (Achyranthes aspera)</h1>', `<h1>${marathi} (${latin})</h1>`)
            .replace('<em>Achyranthis aspera</em>', `<em>${latin}</em>`)
            .replace('<em>Achyranthes aspera</em>', `<em>${latin}</em>`)
            .replace('src="./Images/Achyranthes_aspera_अघाडा_आघाडा.jpeg"', `src="./Images/${filename}"`)
            .replace('alt="आघाडा"', `alt="${marathi}"`)
            .replace('Placeholder for text information about आघाडा.', `Placeholder for text information about ${marathi}.`);

        fs.writeFileSync(path.join('species', pageName), pageContent);

        // Add to register.html
        const cardHTML = `
                     <a href="species/${pageName}" class="species-card">
                        <img src="species/Images/${filename}" alt="${marathi}">
                        <div class="card-content">
                            <h3>${marathi} (${displayName})</h3>
                            <p><em>${latin}</em></p>
                            <p>Recorded on: ${recordedDate}</p>
                            <p class="tag">Flora</p>
                        </div>
                    </a>`;

        registerContent = registerContent.replace(/(<section class="species-grid">[\s\S]*?)(\s*<\/section>)/, `$1${cardHTML}$2`);
    }

    fs.writeFileSync(registerPath, registerContent);

    console.log(`Added ${newImages.length} new species.`);
})();
