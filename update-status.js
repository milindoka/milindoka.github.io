const fs = require('fs');
const { execSync } = require('child_process');

async function updateStatuses() {
    // Read register.html
    const registerPath = 'register.html';
    let registerContent = fs.readFileSync(registerPath, 'utf8');

    // Function to format date
    function formatDate(dateStr) {
        if (!dateStr || dateStr.trim() === '') return '----';
        // exiftool outputs like 2023:10:15 12:30:45
        const parts = dateStr.split(' ')[0].split(':');
        if (parts.length !== 3) return '----';
        const [year, month, day] = parts;
        const yy = year.slice(-2);
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${yy}`;
    }

    // Find all species cards
    const speciesCardRegex = /<a href="species\/[^"]+\.html" class="species-card">[\s\S]*?<\/a>/g;
    const cards = registerContent.match(speciesCardRegex);

    if (!cards) {
        console.log('No species cards found.');
        return;
    }

    let updatedCount = 0;

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];

        // Extract image src
        const imgMatch = card.match(/src="species\/Images\/([^"]+)"/);
        if (!imgMatch) continue;

        const imageName = imgMatch[1];
        const imagePath = `species/Images/${imageName}`;

        try {
            // Run exiftool
            const output = execSync(`exiftool -DateTimeOriginal -DateTime -CreateDate -FileModifyDate -s3 "${imagePath}"`, { encoding: 'utf8' });
            const date = output.trim();
            const formattedDate = formatDate(date);

            // Replace status in card
            const newStatus = `Status : Recorded On ${formattedDate}`;
            const newCard = card.replace(/<p>Status.*<\/p>/, `<p>${newStatus}</p>`);
            registerContent = registerContent.replace(card, newCard);
            updatedCount++;

            console.log(`Updated ${imageName}: ${newStatus}`);
        } catch (error) {
            console.log(`Error processing ${imageName}: ${error.message}`);
            // If error, set to ----
            const newStatus = `Status : Recorded On ----`;
            const newCard = card.replace(/<p>Status.*<\/p>/, `<p>${newStatus}</p>`);
            registerContent = registerContent.replace(card, newCard);
            updatedCount++;
        }
    }

    // Write back
    fs.writeFileSync(registerPath, registerContent);

    console.log(`Updated ${updatedCount} species statuses.`);
}

updateStatuses();
