const fs = require('fs');
const path = require('path');

// Array of species data extracted from register.html
const speciesData = [
    { img: 'Achyranthis_aspera_अघाडा_आघाडा.jpeg', localName: 'आघाडा', scientific: 'Achyranthis aspera' },
    { img: 'Chromolaena_odorat_तीव्रगंधा.jpeg', localName: 'तीव्रगंधा', scientific: 'Chromolaena odorata' },
    { img: 'Barleria_cristata_कोरांटी.jpeg', localName: 'कोरांटी', scientific: 'Barleria cristata' },
    { img: 'Zanthoxylum_rhetsa_तिरफळ.jpeg', localName: 'तिरफळ', scientific: 'Zanthoxylum rhetsa' },
    { img: 'Pavetta_indica_नाडुकली.jpeg', localName: 'नाडुकली', scientific: 'Pavetta indica' },
    { img: 'Tecoma_stans_टेकोमा.jpeg', localName: 'टेकोमा', scientific: 'Tecoma stans' },
    { img: 'Thunbergia_erecta01.jpeg', localName: 'थुंबर्गिया', scientific: 'Thunbergia erecta' },
    { img: 'Barleria_cristata_white_कोरांटी.jpeg', localName: 'पांढरी कोरांटी', scientific: 'Barleria cristata' },
    { img: 'Zingiber_cernuum_रानआले.jpeg', localName: 'रानआले', scientific: 'Zingiber cernuum' },
    { img: 'Justica_adhatoda_अडुळसा.jpeg', localName: 'अडुळसा', scientific: 'Justicia adhatoda' },
    { img: 'Cynarospermum_asperrimum_डिकणा.jpeg', localName: 'डिकणा', scientific: 'Cynarospermum asperrimum' },
    { img: 'Gliricidia_sepium_गिरीपुष्प.jpeg', localName: 'गिरीपुष्प', scientific: 'Gliricidia sepium' },
    { img: 'malabar-pied-hornbill.svg', localName: 'मलबारचा कवड्या धनेश', scientific: 'Anthracoceros coronatus' },
    { img: 'ain-tree.svg', localName: 'ऐन', scientific: 'Terminalia elliptica' },
    { img: 'cockscomb.svg', localName: 'कुरडू', scientific: 'Celosia argentea' },
    { img: 'fishtail-palm.svg', localName: 'भेरलीमाड', scientific: 'Caryota urens' },
    { img: 'fishtail-palm-2.svg', localName: 'माड', scientific: 'Caryota urens' },
    { img: 'porcupine-flower.svg', localName: 'काटेकोरंटी', scientific: 'Barleria prionitis' },
    { img: 'porcupine-flower-2.svg', localName: 'कोरांटी', scientific: 'Barleria prionitis' },
    { img: 'ringworm-bush.svg', localName: 'काटेआसान', scientific: 'Cassia alata' },
    { img: 'morning-glory.svg', localName: 'नीलभोवर', scientific: 'Ipomoea purpurea' },
    { img: 'jungle-geranium.svg', localName: 'Ixora', scientific: 'Ixora coccinea' },
    { img: 'mango.svg', localName: 'आंबा', scientific: 'Mangifera indica' },
    { img: 'jackfruit.svg', localName: 'फणस', scientific: 'Artocarpus heterophyllus' },
    { img: 'pineapple.svg', localName: 'आननस', scientific: 'Ananas comosus' },
    { img: 'flame-lily.svg', localName: 'अग्निशिखा', scientific: 'Gloriosa superba' },
    { img: 'china-rose.svg', localName: 'जास्वंद', scientific: 'Hibiscus rosa-sinensis' },
    { img: 'burr-bush.svg', localName: 'झिंझर्डी', scientific: 'Triumfetta rhomboidea' },
    { img: 'jackal-jujube.svg', localName: 'बुरेगी', scientific: 'Ziziphus oenoplia' },
    { img: 'wild-caper-bush.svg', localName: 'मांसतोडी', scientific: 'Capparis sepiaria' },
    { img: 'jackal-jujube-2.svg', localName: 'येरूणी', scientific: 'Ziziphus oenoplia' },
    { img: 'lantana.svg', localName: 'घाणेरी', scientific: 'Lantana camara' },
    { img: 'crepe-ginger.svg', localName: 'पेव', scientific: 'Cheilocostus speciosus' },
    { img: 'sensitive-plant.svg', localName: 'लाजाळू', scientific: 'Mimosa pudica' },
    { img: 'crape-jasmine.svg', localName: 'तगर', scientific: 'Tabernaemontana divaricata' },
    { img: 'champak.svg', localName: 'सोनचाफा', scientific: 'Magnolia champaca' },
    { img: 'starfruit.svg', localName: 'छोटा करमळ', scientific: 'Averrhoa carambola' },
    { img: 'golden-apple.svg', localName: 'अळू फळ', scientific: 'Meyna laxiflora' },
    { img: 'golden-apple-leaves.svg', localName: 'अळू पाने', scientific: 'Meyna laxiflora' },
    { img: 'babul.svg', localName: 'बाभूळ', scientific: 'Acacia nilotica' },
    { img: 'pomelo.svg', localName: 'पपनस', scientific: 'Citrus maxima' },
    { img: 'tamarind.svg', localName: 'चिंच', scientific: 'Tamarindus indica' },
    { img: 'bamboo.svg', localName: 'बांबू', scientific: 'Bambusa vulgaris' },
    { img: 'bengal-currant.svg', localName: 'करवंद', scientific: 'Carissa carandas' },
    { img: 'bermuda-grass.svg', localName: 'दुर्वा', scientific: 'Cynodon dactylon' },
    { img: 'kumbhi-tree.svg', localName: 'कुंभ', scientific: 'Careya arborea' },
    { img: 'red-silk-cotton-tree.svg', localName: 'काटेसावर', scientific: 'Bombax ceiba' },
    { img: 'bonfire-tree.svg', localName: 'कौशी', scientific: 'Sterculia colorata' },
    { img: 'banyan.svg', localName: 'वड', scientific: 'Ficus benghalensis' },
    { img: 'indian-coral-tree.svg', localName: 'पांगारा', scientific: 'Erythrina variegata' },
    { img: 'indian-jujube.svg', localName: 'बोर', scientific: 'Ziziphus mauritiana' },
    { img: 'white-ginger-lily.svg', localName: 'सोनटक्का', scientific: 'Hedychium coronarium' },
    { img: 'false-daisy.svg', localName: 'माका', scientific: 'Eclipta prostrata' },
    { img: 'arjuna.svg', localName: 'अर्जुन', scientific: 'Terminalia arjuna' },
    { img: 'night-flowering-jasmine.svg', localName: 'प्राजक्त', scientific: 'Nyctanthes arbor-tristis' },
    { img: 'bael.svg', localName: 'बेल', scientific: 'Aegle marmelos' },
    { img: 'sweet-lime.svg', localName: 'मोसुंब', scientific: 'Citrus limetta' },
    { img: 'black-catechu.svg', localName: 'खैर', scientific: 'Senegalia catechu' },
    { img: 'white-orchid-tree.svg', localName: 'पांढरा कांचन', scientific: 'Bauhinia acuminata' },
    { img: 'sandalwood.svg', localName: 'चंदन', scientific: 'Santalum album' },
    { img: 'bidi-leaf-tree.svg', localName: 'आपटा', scientific: 'Bauhinia racemosa' },
    { img: 'hapus.svg', localName: 'आंबा', scientific: 'Mangifera indica' },
    { img: 'saranga.svg', localName: 'सरंगा', scientific: 'Pampus argenteus (Silver Pomfret)' },
];

// Function to create slug from scientific name
function createSlug(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
}

// HTML template
function generateHTML(species) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${species.localName} (${species.scientific}) - 🌿 The Register (PBR)</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <a href="index.html" class="logo">🌿 BURAMBAD PBR</a>
        <nav>
            <a href="index.html">Home</a>
            <a href="register.html" class="active">The Register</a>
            <a href="village.html">The Village</a>
            <a href="contribute.html">Contribute</a>
        </nav>
    </header>

    <main>
        <div class="container">
            <section class="species-detail">
                <h1>${species.localName} (${species.scientific})</h1>
                <p><em>${species.scientific}</em></p>
                <img src="./Img/placeholders/${species.img}" alt="${species.localName}" style="width: 100%; max-width: 800px; display: block; margin: 0 auto;">
                <div class="text-info">
                    <!-- Text info to be added later -->
                    <p>Placeholder for text information about ${species.localName}.</p>
                </div>
            </section>
        </div>
    </main>

    <footer>
        <p>&copy; 2025 Burambad Biodiversity Management Committee | Taluka: Sangameshwar, District: Ratnagiri</p>
        <p>Managed under the Biological Diversity Act, 2002.</p>
        <p>Website Design : Milind Oka</p>
    </footer>
</body>
</html>`;
}

// Generate HTML files
speciesData.forEach(species => {
    const slug = createSlug(species.scientific);
    const filename = `${slug}.html`;
    const content = generateHTML(species);
    fs.writeFileSync(filename, content);
    console.log(`Generated ${filename}`);
});

console.log('All species pages generated.');

// Now update register.html to link to the new pages
const registerPath = 'register.html';
let registerContent = fs.readFileSync(registerPath, 'utf8');

let index = 0;
registerContent = registerContent.replace(/<a href="#" class="species-card">/g, (match) => {
    if (index < speciesData.length) {
        const slug = createSlug(speciesData[index].scientific);
        index++;
        return `<a href="${slug}.html" class="species-card">`;
    }
    return match;
});

fs.writeFileSync(registerPath, registerContent);
console.log('Updated register.html with new links.');
