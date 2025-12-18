const fs = require('fs');
const { execSync } = require('child_process');

function formatDate(dateStr) {
    if (!dateStr || dateStr.trim() === '') return '----';
    // exiftool outputs like 2023:10:15 12:30:45
    const parts = dateStr.split(' ')[0].split(':');
    if (parts.length !== 3) return '----';
    const [year, month, day] = parts;
    const yy = year.slice(-2);
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${yy}`;
}

const imagePath = 'species/Images/Achyranthis_aspera_अघाडा_आघाडा.jpeg';

try {
    const output = execSync(`exiftool -DateTimeOriginal -DateTime -CreateDate -FileModifyDate -s3 "${imagePath}"`, { encoding: 'utf8' });
    const date = output.trim();
    console.log('Raw date:', date);
    const formattedDate = formatDate(date);
    console.log('Formatted date:', formattedDate);
} catch (error) {
    console.log('Error:', error.message);
}
