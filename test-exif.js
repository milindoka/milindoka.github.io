const exifr = require('exifr');

async function test() {
    try {
        const exif = await exifr.parse('species/Images/Eranthemum_roseum=Rosy_Eranthemum=रान_आबोली.jpg', { pick: ['DateTimeOriginal', 'CreateDate', 'ModifyDate'] });
        console.log('EXIF data:', exif);
    } catch (error) {
        console.log('Error:', error.message);
    }
}

test();
