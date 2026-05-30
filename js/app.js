// =========================================================================
// SPECIMENRY — app.js
// Local-only fossil collection database
// =========================================================================

// --- CONSTANTS ---
var CATEGORIES = [
    "Vertebrate",
    "Invertebrate",
    "Plant",
    "Trace (Ichnofossil)",
    "Microfossil"
];

var FOSSIL_TYPES = [
    "Dinosaur",
    "Shark",
    "Trilobite",
    "Ammonite",
    "Fish",
    "Reptile / Amphibian",
    "Mammal",
    "Bird",
    "Invertebrate (Other)",
    "Plant / Flora",
    "Other"
];

var PERIODS_AND_EPOCHS = {
    "Cenozoic Era": {
        "Quaternary": ["Holocene", "Pleistocene"],
        "Neogene": ["Pliocene", "Miocene"],
        "Paleogene": ["Oligocene", "Eocene", "Paleocene"]
    },
    "Mesozoic Era": {
        "Cretaceous": ["Late Cretaceous", "Early Cretaceous"],
        "Jurassic": ["Late Jurassic", "Middle Jurassic", "Early Jurassic"],
        "Triassic": ["Late Triassic", "Middle Triassic", "Early Triassic"]
    },
    "Paleozoic Era": {
        "Permian": ["Lopingian", "Guadalupian", "Cisuralian"],
        "Carboniferous": ["Pennsylvanian", "Mississippian"],
        "Devonian": ["Late Devonian", "Middle Devonian", "Early Devonian"],
        "Silurian": ["Pridoli", "Ludlow", "Wenlock", "Llandovery"],
        "Ordovician": ["Late Ordovician", "Middle Ordovician", "Early Ordovician"],
        "Cambrian": ["Furongian", "Miaolingian", "Series 2", "Terreneuvian"]
    },
    "Precambrian": {
        "Proterozoic": ["Neoproterozoic", "Mesoproterozoic", "Paleoproterozoic"],
        "Archean": ["Neoarchean", "Mesoarchean", "Paleoarchean", "Eoarchean"],
        "Hadean": []
    }
};

// Approximate mid-point age (Ma) for each period — capped to 541 slider max
var PERIOD_AGES = {
    'Quaternary': 1, 'Neogene': 15, 'Paleogene': 50,
    'Cretaceous': 100, 'Jurassic': 175, 'Triassic': 230,
    'Permian': 275, 'Carboniferous': 325, 'Devonian': 390,
    'Silurian': 430, 'Ordovician': 470, 'Cambrian': 510,
    'Proterozoic': 541, 'Archean': 541, 'Hadean': 541
};

var GEOLOGICAL_CONTEXT = {
    'Quaternary': "The Age of Humans. Glacial cycles and the rise of modern civilization.",
    'Neogene': "The Rise of Grasslands. Mammals and birds continue to evolve into modern forms.",
    'Paleogene': "The Dawn of Modern Mammals. Recovery from the K-Pg extinction, dense forests.",
    'Cretaceous': "The Zenith of Dinosaurs. Flowering plants appear, ending with a massive asteroid impact.",
    'Jurassic': "The Golden Age of Dinosaurs. Giant sauropods roam the land, first birds appear.",
    'Triassic': "The Dawn of Dinosaurs. Earth recovers from the 'Great Dying', first mammals.",
    'Permian': "The Age of Synapsids. Dense forests, single supercontinent Pangea, ended by the 'Great Dying'.",
    'Carboniferous': "The Age of Coal. Giant insects, vast swamp forests, high oxygen levels.",
    'Devonian': "The Age of Fishes. First forests appear, amphibians begin colonizing land.",
    'Silurian': "The First Land Plants. Diversification of jawed fishes and reef-building corals.",
    'Ordovician': "The Great Diversification. Massive marine radiation, first primitive plants on land.",
    'Cambrian': "The Cambrian Explosion. Rapid appearance of most major animal groups.",
    'Proterozoic': "The Rise of Complexity. Oxygenation of the atmosphere, first multicellular life.",
    'Archean': "The Dawn of Life. Formation of Earth's crust, first single-celled organisms.",
    'Hadean': "The Hellish Eon. Formation of the solar system, Earth cooling, early crust and oceans."
};

// Sorted longest-first so the matcher always prefers the most specific
var COUNTRY_TO_ISO = {
    'afghanistan': 'af', 'albania': 'al', 'algeria': 'dz', 'andorra': 'ad', 'angola': 'ao',
    'argentina': 'ar', 'armenia': 'am', 'australia': 'au', 'austria': 'at', 'azerbaijan': 'az',
    'bahamas': 'bs', 'bahrain': 'bh', 'bangladesh': 'bd', 'barbados': 'bb', 'belarus': 'by',
    'belgium': 'be', 'belize': 'bz', 'benin': 'bj', 'bhutan': 'bt', 'bolivia': 'bo',
    'bosnia': 'ba', 'botswana': 'bw', 'brazil': 'br', 'brunei': 'bn', 'bulgaria': 'bg',
    'burkina faso': 'bf', 'burundi': 'bi', 'cambodia': 'kh', 'cameroon': 'cm', 'canada': 'ca',
    'cape verde': 'cv', 'central african republic': 'cf', 'chad': 'td', 'chile': 'cl', 'china': 'cn',
    'colombia': 'co', 'comoros': 'km', 'congo': 'cg', 'costa rica': 'cr', 'croatia': 'hr',
    'cuba': 'cu', 'cyprus': 'cy', 'czech republic': 'cz', 'denmark': 'dk', 'djibouti': 'dj',
    'dominica': 'dm', 'dominican republic': 'do', 'ecuador': 'ec', 'egypt': 'eg', 'el salvador': 'sv',
    'equatorial guinea': 'gq', 'eritrea': 'er', 'estonia': 'ee', 'ethiopia': 'et', 'fiji': 'fj',
    'finland': 'fi', 'france': 'fr', 'gabon': 'ga', 'gambia': 'gm', 'georgia': 'ge',
    'germany': 'de', 'ghana': 'gh', 'greece': 'gr', 'grenada': 'gd', 'guatemala': 'gt',
    'guinea': 'gn', 'guinea-bissau': 'gw', 'guyana': 'gy', 'haiti': 'ht', 'honduras': 'hn',
    'hungary': 'hu', 'iceland': 'is', 'india': 'in', 'indonesia': 'id', 'iran': 'ir',
    'iraq': 'iq', 'ireland': 'ie', 'israel': 'il', 'italy': 'it', 'jamaica': 'jm',
    'japan': 'jp', 'jordan': 'jo', 'kazakhstan': 'kz', 'kenya': 'ke', 'kiribati': 'ki',
    'kuwait': 'kw', 'kyrgyzstan': 'kg', 'laos': 'la', 'latvia': 'lv', 'lebanon': 'lb',
    'lesotho': 'ls', 'liberia': 'lr', 'libya': 'ly', 'liechtenstein': 'li', 'lithuania': 'lt',
    'luxembourg': 'lu', 'macedonia': 'mk', 'madagascar': 'mg', 'malawi': 'mw', 'malaysia': 'my',
    'maldives': 'mv', 'mali': 'ml', 'malta': 'mt', 'marshall islands': 'mh', 'mauritania': 'mr',
    'mauritius': 'mu', 'mexico': 'mx', 'micronesia': 'fm', 'moldova': 'md', 'monaco': 'mc',
    'mongolia': 'mn', 'montenegro': 'me', 'morocco': 'ma', 'mozambique': 'mz', 'myanmar': 'mm',
    'namibia': 'na', 'nauru': 'nr', 'nepal': 'np', 'netherlands': 'nl', 'new zealand': 'nz',
    'nicaragua': 'ni', 'niger': 'ne', 'nigeria': 'ng', 'north korea': 'kp', 'norway': 'no',
    'oman': 'om', 'pakistan': 'pk', 'palau': 'pw', 'panama': 'pa', 'papua new guinea': 'pg',
    'paraguay': 'py', 'peru': 'pe', 'philippines': 'ph', 'poland': 'pl', 'portugal': 'pt',
    'qatar': 'qa', 'romania': 'ro', 'russia': 'ru', 'rwanda': 'rw', 'st kitts': 'kn',
    'st lucia': 'lc', 'st vincent': 'vc', 'samoa': 'ws', 'san marino': 'sm', 'sao tome': 'st',
    'saudi arabia': 'sa', 'senegal': 'sn', 'serbia': 'rs', 'seychelles': 'sc', 'sierra leone': 'sl',
    'singapore': 'sg', 'slovakia': 'sk', 'slovenia': 'si', 'solomon islands': 'sb', 'somalia': 'so',
    'south africa': 'za', 'south korea': 'kr', 'south sudan': 'ss', 'spain': 'es', 'sri lanka': 'lk',
    'sudan': 'sd', 'suriname': 'sr', 'swaziland': 'sz', 'sweden': 'se', 'switzerland': 'ch',
    'syria': 'sy', 'taiwan': 'tw', 'tajikistan': 'tj', 'tanzania': 'tz', 'thailand': 'th',
    'timor-leste': 'tl', 'togo': 'tg', 'tonga': 'to', 'trinidad': 'tt', 'tunisia': 'tn',
    'turkey': 'tr', 'turkmenistan': 'tm', 'tuvalu': 'tv', 'uganda': 'ug', 'ukraine': 'ua',
    'uae': 'ae', 'united arab emirates': 'ae', 'uk': 'gb', 'united kingdom': 'gb', 'usa': 'us',
    'united states': 'us', 'uruguay': 'uy', 'uzbekistan': 'uz', 'vanuatu': 'vu', 'vatican city': 'va',
    'venezuela': 've', 'vietnam': 'vn', 'yemen': 'ye', 'zambia': 'zm', 'zimbabwe': 'zw'
};

function getConditionTierBadgeHtml(tier, isCompact) {
    if (!tier) return '';
    var color = '';
    var label = '';
    var shadow = '';
    
    switch (tier.toUpperCase()) {
        case 'S':
            color = '#ffb300'; // Gold
            label = isCompact ? 'S' : '👑 S-Tier';
            shadow = 'rgba(255, 179, 0, 0.35)';
            break;
        case 'A':
            color = '#e53935'; // Bright Red
            label = isCompact ? 'A' : '💎 A-Tier';
            shadow = 'rgba(229, 57, 53, 0.3)';
            break;
        case 'B':
            color = '#00acc1'; // Cyan / Teal
            label = isCompact ? 'B' : '📖 B-Tier';
            shadow = 'rgba(0, 172, 193, 0.25)';
            break;
        case 'C':
            color = '#43a047'; // Green
            label = isCompact ? 'C' : '🧭 C-Tier';
            shadow = 'rgba(67, 160, 71, 0.2)';
            break;
        case 'D':
            color = '#757575'; // Dark Grey
            label = isCompact ? 'D' : '🪵 D-Tier';
            shadow = 'rgba(117, 117, 117, 0.15)';
            break;
        default:
            return '';
    }

    if (isCompact) {
        return '<span class="condition-tier-badge compact-tier" title="Preservation Grade: ' + tier.toUpperCase() + '-Tier" style="display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: rgba(' + hexToRgb(color) + ', 0.15); color: ' + color + '; border: 1px solid rgba(' + hexToRgb(color) + ', 0.4); border-radius: 50%; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; margin-left: 0.4rem; vertical-align: middle; box-shadow: 0 1px 4px ' + shadow + '; font-family: system-ui, -apple-system, sans-serif;">' + label + '</span>';
    }

    return '<span class="condition-tier-badge" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem; background: rgba(' + hexToRgb(color) + ', 0.12); color: ' + color + '; border: 1px solid ' + color + '; padding: 0.15rem 0.65rem; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 2px 8px ' + shadow + '; vertical-align: middle; margin-left: 0.4rem; font-family: system-ui, -apple-system, sans-serif;">' + label + '</span>';
}

function hexToRgb(hex) {
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x' + c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255].join(',');
    }
    return '127,127,127';
}

function getFlagHtml(countryName) {
    if (!countryName) return '';
    var clean = countryName.toLowerCase().trim();
    
    // Direct match
    var code = COUNTRY_TO_ISO[clean];
    
    // Handle complex names or common aliases
    if (!code) {
        if (clean.indexOf('united states') !== -1 || clean === 'usa') code = 'us';
        else if (clean.indexOf('united kingdom') !== -1 || clean === 'uk') code = 'gb';
        else if (clean.indexOf('morocco') !== -1) code = 'ma';
        else if (clean.indexOf('netherlands') !== -1) code = 'nl';
        else if (clean.indexOf('germany') !== -1) code = 'de';
        else if (clean.indexOf('france') !== -1) code = 'fr';
    }

    // Fallback: if the user typed "US", "MA", etc directly
    if (!code && clean.length === 2) code = clean;
    
    if (code) {
        return '<img src="https://flagcdn.com/w20/' + code.toLowerCase() + '.png" srcset="https://flagcdn.com/w40/' + code.toLowerCase() + '.png 2x" width="20" alt="' + countryName + '" class="flag-icon" style="vertical-align: middle; margin-right: 0.4rem; border-radius: 2px; box-shadow: 0 0 1px rgba(0,0,0,0.2);">';
    }
    return '';
}
var PREHISTORIC_SIZES = {
    // Large Theropods
    "tyrannosaurus": 12.3, "spinosaurus": 14.0, "giganotosaurus": 13.0, "carcharodontosaurus": 12.0, "allosaurus": 8.5,
    // Sauropods
    "argentinosaurus": 35.0, "patagotitan": 37.0, "diplodocus": 24.0, "brachiosaurus": 20.0, "apatosaurus": 21.0,
    "dreadnoughtus": 26.0, "brontosaurus": 22.0,
    // Other Dinosaurs
    "triceratops": 8.0, "stegosaurus": 9.0, "ankylosaurus": 7.5, "parasaurolophus": 9.5, "iguanodon": 10.0,
    "velociraptor": 2.0, "utahraptor": 6.0, "deinonychus": 3.4, "pachycephalosaurus": 4.5, "therizinosaurus": 10.0,
    // Marine Reptiles
    "mosasaurus": 17.0, "megalodon": 15.5, "plesiosaurus": 3.5, "liopleurodon": 7.0, "elamosaurus": 13.0,
    "shastasaurus": 21.0, "basilosaurus": 18.0, "livyatan": 15.0, "dunkleosteus": 6.0,
    // Mammals
    "mammuthus": 4.0, "mammut": 3.0, "smilodon": 2.2, "megatherium": 6.0, "paraceratherium": 4.8,
    "woolly mammoth": 3.5, "saber-toothed tiger": 2.2, "glyptodon": 3.3, "elasmotherium": 4.5,
    "mammoth": 3.5, "mastodon": 3.0,
    // Pterosaurs
    "quetzalcoatlus": 11.0, "pteranodon": 6.0, "alanqa": 5.0, "hatzegopteryx": 11.0,
    // Common Invertebrates (Average sizes for typical specimens)
    "ammonite": 0.15, "trilobite": 0.05, "belemnite": 0.2, "orthoceras": 0.2, "gryphaea": 0.08,
    "micraster": 0.06, "hemiaster": 0.04, "phylloceras": 0.12, "dactylioceras": 0.09,
    "hildoceras": 0.1, "peronopsis": 0.005, "calymene": 0.06, "paradoxides": 0.3,
    "elrathia": 0.02, "flexicalymene": 0.05, "phacops": 0.05, "greenops": 0.03,
    "manticoceras": 0.15, "psiloceras": 0.12, "pleuroceras": 0.15, "parkinsonia": 0.25,
    "perisphinctes": 0.2, "macraster": 0.07, "clypeaster": 0.15, "echinocorys": 0.08,
    "modiolus": 0.06, "rhynchonella": 0.03, "terebratula": 0.04, "spirifer": 0.05,
    "goniatite": 0.04, "nautilus": 0.2, "baculites": 1.0, "scaphites": 0.1,
    "turrilites": 0.25, "ostrea": 0.1, "pecten": 0.1, "trigonia": 0.08,
    "acanthoceras": 0.3, "ancyloceras": 0.2, "asteroceras": 0.2, "beudanticeras": 0.15,
    "douvilleiceras": 0.2, "euhoplites": 0.1, "kosmoceras": 0.08, "oppelia": 0.1,
    "oxynoticeras": 0.2, "peltoceras": 0.15, "quenstedtoceras": 0.12, "sigaloceras": 0.1,
    "zarafasaurus": 7.0, "zarafasaurus oceanis": 7.0,
    "maroccosuchus": 3.5, "maroccosuchus zennaroi": 3.5,
    "isurus crassus": 3.5, "isurus subserratus": 4.0,
    "ammonite sp.": 0.15,
    // Sharks & Marine
    "carcharocles": 15.5, "otodus": 15.5, "megalodon": 15.5, "carcharodon": 6.0,
    "isurus": 3.5, "isurus hastalis": 6.0, "cosmopolitodus": 5.0, "cosmopolitodus hastalis": 6.0,
    "carcharias taurus": 2.5, "cretolamna": 2.5, "ctealamna": 2.5, "squalicorax": 4.0,
    "galeocerdo": 5.5, "hemipristis": 5.0, "hexanchus": 5.0, "odontaspis": 3.2,
    "striatolamia": 3.0, "sand tiger shark": 2.5, "great white shark": 5.0,
    "mako shark": 3.5, "bull shark": 2.5, "tiger shark": 5.0,
    // Ammonites (Common UK/Europe/US)
    "dactylioceras": 0.09, "hildoceras": 0.1, "perisphinctes": 0.2, "kosmoceras": 0.08,
    "parkinsonia": 0.25, "pleuroceras": 0.15, "asteroceras": 0.2, "amaltheus": 0.1,
    "lytoceras": 0.3, "phylloceras": 0.12, "douvilleiceras": 0.2, "acanthoceras": 0.3,
    "schloenbachia": 0.1, "hoplocrioceras": 0.4, "deshayesites": 0.15, "anarcestes": 0.05,
    "clymenia": 0.05, "goniatite": 0.04, "nautilus": 0.2, "baculites": 1.0,
    "scaphites": 0.1, "turrilites": 0.25, "ostrea": 0.1, "pecten": 0.1, "trigonia": 0.08,
    "gryphaea": 0.08, "devil's toenail": 0.08, "micraster": 0.06, "hemiaster": 0.04,
    "echinocorys": 0.08, "clypeaster": 0.15, "macraster": 0.07, "knightia": 0.15, "diplomystus": 0.45,
    "pristiophorus": 1.4, "onchopristis": 8.0, "pappocetus": 2.5, "oreodont": 1.0, "brontothere": 4.5,
    // Trilobites (Common Morocco/US/Russia)
    "calymene": 0.06, "paradoxides": 0.3, "elrathia": 0.02, "phacops": 0.05,
    "dalmanites": 0.1, "flexicalymene": 0.05, "asaphus": 0.1, "ogygiocarella": 0.15,
    "ellipsocephalus": 0.03, "conocoryphe": 0.04, "greenops": 0.03, "gerastos": 0.02,
    "crophaspis": 0.02, "drotops": 0.12, "scutellum": 0.06, "acaste": 0.02,
    "onnia": 0.03, "trinucleus": 0.02, "cambropallas": 0.2, "acadoparadoxides": 0.3,
    // Mammals & Megafauna
    "mammuthus": 4.0, "mammut": 3.0, "mammoth": 3.5, "mastodon": 3.0, "smilodon": 2.2,
    "saber-tooth": 2.2, "megatherium": 6.0, "glyptodon": 3.3, "elasmotherium": 4.5,
    "coelodonta": 3.5, "woolly rhino": 3.5, "dire wolf": 1.5, "canis dirus": 1.5,
    "cave bear": 3.0, "ursus spelaeus": 3.0, "megaloceros": 2.1, "irish elk": 2.1,
    // Others
    "sarcosuchus": 9.5, "deinosuchus": 10.5, "titanoboa": 12.8, "megalania": 6.0, "carbonemys": 1.7,
    "helicoprion": 7.5, "cameroceras": 6.0, "archelon": 4.5, "dunkleosteus": 6.0, "basilosaurus": 18.0,
    "prognathodon curii": 10.0, "prognathodon": 10.0,
    // Genus & Aliases
    "t-rex": 12.3, "t.rex": 12.3, "trex": 12.3, "meg": 15.5,
    "carcharhinus leucas": 2.5, "acreolamna": 3.0, "alopias": 4.0, "serratolamna": 3.0,
    "lapparentosaurus": 15.0, "archaeodontosaurus": 15.0, "psittacosaurus": 2.0, "hadrosaur": 10.0, "ouranosaurid": 7.5
};

var ETYMOLOGY = [
    // Multi-syllable compound roots (longest first)
    { root: 'madagascariensis', meaning: 'from Madagascar' },
    { root: 'crenatissimus', meaning: 'very notched/crenate (Latin)' },
    { root: 'appendiculata', meaning: 'with appendages (Latin)' },
    { root: 'carcharodon', meaning: 'jagged tooth (Greek)' },
    { root: 'carcharo', meaning: 'jagged / sharp (Greek: karcharos)' },
    { root: 'tyranno', meaning: 'tyrant (Greek: tyrannos)' },
    { root: 'mammuthus', meaning: 'earth burrower (Tatar: mamma)' },
    { root: 'mammut', meaning: 'earth burrower (Tatar)' },
    { root: 'rhinoceros', meaning: 'nose horn (Greek)' },
    { root: 'pithecus', meaning: 'ape (Greek: pithekos)' },
    { root: 'styraco', meaning: 'spiked (Greek: styrax)' },
    { root: 'rhyncho', meaning: 'snout / beak (Greek)' },
    { root: 'cephalo', meaning: 'head (Greek: kephale)' },
    { root: 'opisth', meaning: 'behind (Greek: opisthen)' },
    { root: 'gnathus', meaning: 'jaw (Greek: gnathos)' },
    { root: 'onychus', meaning: 'claw (Greek: onyx)' },
    { root: 'therium', meaning: 'beast (Greek: therion)' },
    { root: 'ichthyo', meaning: 'fish (Greek: ichthys)' },
    { root: 'ichthy', meaning: 'fish (Greek: ichthys)' },
    { root: 'morpho', meaning: 'form / shape (Greek)' },
    { root: 'venator', meaning: 'hunter (Latin)' },
    { root: 'mosasaur', meaning: 'Meuse lizard (Latin: Mosa + Greek: sauros)' },
    { root: 'ankylo', meaning: 'fused / stiff (Greek: ankylos)' },
    { root: 'pseudo', meaning: 'false (Greek: pseudos)' },
    { root: 'brachy', meaning: 'short (Greek: brakhys)' },
    { root: 'veloci', meaning: 'swift (Latin: velox)' },
    { root: 'campto', meaning: 'flexible / bent (Greek)' },
    { root: 'archae', meaning: 'ancient / beginning (Greek)' },
    { root: 'palaeo', meaning: 'ancient (Greek: palaios)' },
    { root: 'paleo', meaning: 'ancient (Greek: palaios)' },
    { root: 'amphi', meaning: 'both / around (Greek)' },
    { root: 'ammon', meaning: 'Egyptian god Amun (spiral horns)' },
    { root: 'Lapparento', meaning: 'after Lapparent (Alber-Félix de Lapparent)' },
    { root: 'annectens', meaning: 'linking / joining (Latin)' },
    { root: 'saharicus', meaning: 'from the Sahara' },
    { root: 'Cretalamna', meaning: 'Cretaceous comb-tooth shark' },
    { root: 'tenerensis', meaning: 'from the Ténéré desert' },

    // 6-8 letter roots
    { root: 'saurus', meaning: 'lizard (Greek: sauros)' },
    { root: 'raptor', meaning: 'thief / plunderer (Latin)' },
    { root: 'pteryx', meaning: 'wing (Greek: pteryx)' },
    { root: 'pteron', meaning: 'wing (Greek)' },
    { root: 'pterus', meaning: 'winged (Greek)' },
    { root: 'theria', meaning: 'beasts (Greek)' },
    { root: 'suchus', meaning: 'crocodile (Greek: soukhos)' },
    { root: 'chelys', meaning: 'turtle (Greek)' },
    { root: 'chelone', meaning: 'turtle (Greek)' },
    { root: 'rhinus', meaning: 'nose / snout (Greek: rhis)' },
    { root: 'spino', meaning: 'spine / thorn (Latin: spina)' },
    { root: 'carno', meaning: 'flesh (Latin: caro)' },
    { root: 'diplo', meaning: 'double (Greek: diploos)' },
    { root: 'apato', meaning: 'deceptive (Greek: apate)' },
    { root: 'iguan', meaning: 'iguana (Taíno: iwana)' },
    { root: 'stego', meaning: 'roof / covered (Greek: stegos)' },
    { root: 'hadro', meaning: 'thick / stout (Greek: hadros)' },
    { root: 'archo', meaning: 'ruling / chief (Greek: arkhon)' },
    { root: 'ptero', meaning: 'wing (Greek: pteron)' },
    { root: 'thero', meaning: 'beast (Greek: therion)' },
    { root: 'platy', meaning: 'flat / broad (Greek: platys)' },
    { root: 'brachio', meaning: 'arm (Greek: brakhion)' },
    { root: 'Edmonto', meaning: 'after Edmonton, Canada (Edmontosaurus)' },
    { root: 'corytho', meaning: 'helmet / crest (Greek: korys)' },
    { root: 'Majunga', meaning: 'from the Majunga region (Madagascar)' },
    { root: 'Psittaco', meaning: 'parrot (Greek: psittakos)' },
    { root: 'Ourano', meaning: 'brave / monitor lizard (Ouranosaurus)' },
    { root: 'obliquus', meaning: 'slanting / oblique (Latin)' },
    { root: 'belemn', meaning: 'dart / arrow (Greek: belemnon)' },
    { root: 'blasto', meaning: 'bud / sprout (Greek: blastos)' },
    { root: 'gastro', meaning: 'stomach (Greek: gaster)' },
    { root: 'plesio', meaning: 'near / close to (Greek: plesios)' },
    { root: 'lambeo', meaning: 'after Lawrence Lambe (paleontologist)' },

    // 5-letter roots
    { root: 'saura', meaning: 'lizard (Greek: saura)' },
    { root: 'ceras', meaning: 'horn (Greek: keras)' },
    { root: 'ceros', meaning: 'horned (Greek)' },
    { root: 'stoma', meaning: 'mouth (Greek)' },
    { root: 'ornis', meaning: 'bird (Greek)' },
    { root: 'rhina', meaning: 'nose / snout (Greek)' },
    { root: 'derma', meaning: 'skin (Greek)' },
    { root: 'lopho', meaning: 'crest (Greek: lophos)' },
    { root: 'mimus', meaning: 'mimic (Greek: mimos)' },
    { root: 'titan', meaning: 'giant (Greek: Titan)' },
    { root: 'orbis', meaning: 'circle / disc (Latin)' },
    { root: 'proto', meaning: 'first (Greek: protos)' },
    { root: 'macro', meaning: 'large (Greek: makros)' },
    { root: 'micro', meaning: 'small (Greek: makros)' },
    { root: 'dacty', meaning: 'finger (Greek: daktylos)' },
    { root: 'phyll', meaning: 'leaf (Greek: phyllon)' },
    { root: 'scler', meaning: 'hard (Greek: skleros)' },
    { root: 'Krypt', meaning: 'hidden (Greek: kryptos)' },
    { root: 'Abeli', meaning: 'after Roberto Abel (Abelisaurus)' },
    { root: 'Sucho', meaning: 'crocodile (Greek: soukhos)' },
    { root: 'cerat', meaning: 'horn (Greek: keras)' },
    { root: 'trilo', meaning: 'three-lobed (Greek: trilobos)' },
    { root: 'crino', meaning: 'lily (Greek: krinon)' },
    { root: 'pachy', meaning: 'thick (Greek: pakhys)' },
    { root: 'kentro', meaning: 'spike / prickle (Greek: kentron)' },
    { root: 'plateo', meaning: 'flat / broad (Greek: platys)' },
    { root: 'masso', meaning: 'massive / large (Latin: massa)' },
    { root: 'ortho', meaning: 'straight (Greek: orthos)' },
    { root: 'petri', meaning: 'stone / rock (Greek: petra)' },
    { root: 'docidae', meaning: 'common family ending for sauropods like Diplodocidae' },
    { root: 'indet.', meaning: 'indeterminate (could not be identified to species level)' },
    { root: 'spino', meaning: 'spine / thorn (Latin: spina)' },
    { root: 'archi', meaning: 'first / chief (Greek: archos)' },
    { root: 'paleo', meaning: 'ancient (Greek: palaios)' },
    { root: 'stego', meaning: 'roof / covered (Greek: stegos)' },
    { root: 'ankyl', meaning: 'fused / stiff (Greek: ankylos)' },
    { root: 'hadro', meaning: 'sturdy / large (Greek: hadros)' },
    { root: 'bronto', meaning: 'thunder (Greek: bronte)' },
    { root: 'plesio', meaning: 'near / close to (Greek: plesios)' },
    { root: 'isurus', meaning: 'equal tail (Greek)' },
    { root: 'otodus', meaning: 'ear-tooth (Greek: ous + odon)' },
    { root: 'coelo', meaning: 'hollow (Greek: koilos)' },
    { root: 'donta', meaning: 'tooth (Greek: odont- variant)' },
    { root: 'lodon', meaning: 'tooth (Greek: odon variant)' },
    { root: 'corax', meaning: 'raven / crow (Greek: korax)' },
    { root: 'creta', meaning: 'chalk / Cretaceous (Latin: creta)' },
    { root: 'planus', meaning: 'flat (Latin)' },

    // 4-letter roots
    { root: 'mega', meaning: 'great / large (Greek: megas)' },
    { root: 'dino', meaning: 'terrible (Greek: deinos)' },
    { root: 'odon', meaning: 'tooth (Greek: odous)' },
    { root: 'dont', meaning: 'tooth (Greek: odont-)' },
    { root: 'odus', meaning: 'tooth (Greek)' },
    { root: 'onyx', meaning: 'claw (Greek)' },
    { root: 'baro', meaning: 'heavy / weight (Greek: baros)' },
    { root: 'carchar', meaning: 'jagged / sharp (Greek: karkharos)' },
    { root: 'smilo', meaning: 'knife / chisel (Greek: smile)' },
    { root: 'cetus', meaning: 'whale / sea monster (Greek: ketos)' },
    { root: 'allo', meaning: 'other / different (Greek: allos)' },
    { root: 'para', meaning: 'beside / near (Greek)' },
    { root: 'mono', meaning: 'single (Greek)' },
    { root: 'poly', meaning: 'many (Greek)' },
    { root: 'lith', meaning: 'stone (Greek: lithos)' },
    { root: 'meso', meaning: 'middle (Greek: mesos)' },
    { root: 'xeno', meaning: 'strange / foreign (Greek)' },
    { root: 'xero', meaning: 'dry (Greek: xeros)' },
    { root: 'nycho', meaning: 'claw (Greek: onyx)' },
    { root: 'nyx', meaning: 'claw / night (Greek)' },
    { root: 'giga', meaning: 'giant (Greek: gigas)' },
    { root: 'nano', meaning: 'dwarf (Greek: nanos)' },
    { root: 'plio', meaning: 'more (Greek: pleion)' },
    { root: 'naut', meaning: 'sailor (Greek: nautilos)' },
    { root: 'mammut', meaning: 'mammoth (Russian: mammot)' },
    { root: 'lamna', meaning: 'shark / thin plate (Greek)' },
    { root: 'ceros', meaning: 'horn (Greek: keras)' },
    { root: 'diplo', meaning: 'double (Greek: diplos)' },
    { root: 'docus', meaning: 'beam / bar (Greek: dokos)' },
    { root: 'raptor', meaning: 'thief / robber (Latin)' },
    { root: 'veloci', meaning: 'fast / swift (Latin: velox)' },
    { root: 'hastalis', meaning: 'spear-like (Latin: hasta)' },
    { root: 'obliquus', meaning: 'slanted / indirect (Latin)' },
    { root: 'mantelli', meaning: 'after Gideon Mantell' },
    { root: 'serratus', meaning: 'saw-toothed (Latin: serra)' },
    { root: 'antiqu', meaning: 'ancient (Latin: antiquus)' },
    { root: 'primige', meaning: 'first-born / original (Latin)' },
    { root: 'mammut', meaning: 'mammoth (Russian: mammot)' },
    { root: 'lamna', meaning: 'shark / thin plate (Greek)' },
    { root: 'otodus', meaning: 'ear-tooth (Greek: ous + odon)' },
    { root: 'idae', meaning: 'standard suffix for animal family names' },
    { root: 'mosa', meaning: 'of the Meuse river (Latin)' },
    { root: 'croc', meaning: 'pebble / crocodile (Greek: kroke)' },
    { root: 'hypo', meaning: 'under / below (Greek)' },
    { root: 'ovis', meaning: 'sheep (Latin)' },
    { root: 'equu', meaning: 'horse (Latin: equus)' },
    { root: 'urus', meaning: 'wild ox (Latin)' },
    { root: 'leon', meaning: 'lion (Greek: leon)' },
    { root: 'loph', meaning: 'crest (Greek: lophos)' },
    { root: 'acan', meaning: 'spine / thorn (Greek: akantha)' },
    { root: 'glyp', meaning: 'carved (Greek: glypho)' },
    { root: 'cyan', meaning: 'blue (Greek: kyanos)' },
    { root: 'tyranno', meaning: 'tyrant (Greek: tyrannos)' },
    { root: 'rhyncho', meaning: 'snout / beak (Greek)' },
    { root: 'scapan', meaning: 'spade / shovel (Greek)' },
    { root: 'ichthyo', meaning: 'fish (Greek: ichthys)' },
    { root: 'pteron', meaning: 'wing / feather (Greek)' },
    { root: 'megal', meaning: 'great / large (Greek: megas)' },
    { root: 'elephas', meaning: 'elephant (Greek)' },
    { root: 'ecto', meaning: 'outside (Greek)' },
    { root: 'endo', meaning: 'within (Greek)' },
    { root: 'phago', meaning: 'eater (Greek: phagein)' },
    { root: 'sauro', meaning: 'lizard (Greek: sauros)' },
    { root: 'therium', meaning: 'beast / wild animal (Greek: therion)' },
    { root: 'isurus', meaning: 'equal tail (Greek)' },
    { root: 'galeo', meaning: 'shark (Greek: galeos)' },
    { root: 'Saur', meaning: 'lizard (Greek: sauros)' },
    { root: 'podo', meaning: 'foot (Greek: pous)' },

    // 3-letter roots (careful — only match these at word boundaries ideally)
    { root: 'tri', meaning: 'three (Greek/Latin)' },
    { root: 'ops', meaning: 'face / eye (Greek)' },
    { root: 'pod', meaning: 'foot (Greek: pous)' },
    { root: 'pes', meaning: 'foot (Latin)' },
    { root: 'pus', meaning: 'foot (Greek)' },
    { root: 'rex', meaning: 'king (Latin)' },
    { root: 'ther', meaning: 'beast (Greek: ther)' },
    { root: 'sp.', meaning: 'species (abbreviation for unknown species)' },
    { root: 'leo', meaning: 'lion (Latin)' },
    { root: 'neo', meaning: 'new (Greek: neos)' },
    { root: 'borealis', meaning: 'northern (Latin)' },
    { root: 'australis', meaning: 'southern (Latin)' },
    { root: 'occidentalis', meaning: 'western (Latin)' },
    { root: 'orientalis', meaning: 'eastern (Latin)' },
    { root: 'japonicus', meaning: 'from Japan' },
    { root: 'sinensis', meaning: 'from China (Sino-)' },
    { root: 'canadensis', meaning: 'from Canada' },
    { root: 'maroccanus', meaning: 'from Morocco' },
    { root: 'africanus', meaning: 'from Africa' },
    { root: 'americanus', meaning: 'from America' },
    { root: 'europaeus', meaning: 'from Europe' },
    { root: 'indicus', meaning: 'from India' },
    { root: 'giganteus', meaning: 'giant / very large (Latin)' },
    { root: 'nanus', meaning: 'dwarf / small (Latin)' },
    { root: 'gracilis', meaning: 'slender / graceful (Latin)' },
    { root: 'robustus', meaning: 'strong / sturdy (Latin)' },
    { root: 'armatus', meaning: 'armored / armed (Latin)' },
    { root: 'serratus', meaning: 'saw-toothed (Latin)' },
    { root: 'grandis', meaning: 'large / great (Latin)' },
    { root: 'elegans', meaning: 'elegant / fine (Latin)' },
    { root: 'magnus', meaning: 'great (Latin)' },
    { root: 'minor', meaning: 'smaller (Latin)' },
    { root: 'major', meaning: 'larger (Latin)' },
    { root: 'medius', meaning: 'middle (Latin)' },
    { root: 'parvus', meaning: 'small (Latin)' },
    { root: 'validus', meaning: 'strong / valid (Latin)' },
    { root: 'regalis', meaning: 'royal (Latin)' },
    { root: 'imperator', meaning: 'emperor / commander (Latin)' },
    { root: 'rex', meaning: 'king (Latin)' },
    { root: 'regina', meaning: 'queen (Latin)' },
    { root: 'primus', meaning: 'first (Latin)' },
    { root: 'secundus', meaning: 'second (Latin)' },
    { root: 'tertio', meaning: 'third (Latin)' },
    { root: 'quart', meaning: 'fourth (Latin)' },
    { root: 'longus', meaning: 'long (Latin)' },
    { root: 'brevis', meaning: 'short (Latin)' },
    { root: 'latus', meaning: 'broad / wide (Latin)' },
    { root: 'crassus', meaning: 'thick / fat (Latin)' },
    { root: 'altis', meaning: 'high / tall (Latin)' },
    { root: 'boreo', meaning: 'north (Greek: boreas)' },
    { root: 'noto', meaning: 'south (Greek: notos)' },
    { root: 'euro', meaning: 'east / south-east (Greek)' },
    { root: 'zephr', meaning: 'west (Greek: zephyros)' },
    { root: 'calli', meaning: 'beautiful (Greek: kallos)' },
    { root: 'eu', meaning: 'good / well / true (Greek)' },
    { root: 'ortho', meaning: 'straight (Greek)' },
    { root: 'crypto', meaning: 'hidden (Greek)' },
    { root: 'philo', meaning: 'loving (Greek: philein)' },
    { root: 'phobos', meaning: 'fear (Greek)' },
    { root: 'hydro', meaning: 'water (Greek)' },
    { root: 'pyro', meaning: 'fire (Greek)' },
    { root: 'geo', meaning: 'earth (Greek)' },
    { root: 'cryo', meaning: 'cold / icy (Greek)' },
    { root: 'thermo', meaning: 'heat (Greek)' },
    { root: 'macro', meaning: 'large (Greek)' },
    { root: 'micro', meaning: 'small (Greek)' },
    { root: 'mega', meaning: 'huge (Greek)' },
    { root: 'giga', meaning: 'giant (Greek)' },
    { root: 'mono', meaning: 'one (Greek)' },
    { root: 'di', meaning: 'two (Greek)' },
    { root: 'tri', meaning: 'three (Greek)' },
    { root: 'tetra', meaning: 'four (Greek)' },
    { root: 'penta', meaning: 'five (Greek)' },
    { root: 'hexa', meaning: 'six (Greek)' },
    { root: 'hepta', meaning: 'seven (Greek)' },
    { root: 'octo', meaning: 'eight (Greek)' },
    { root: 'poly', meaning: 'many (Greek)' },
    { root: 'multi', meaning: 'many (Latin)' },
    { root: 'pauci', meaning: 'few (Latin)' },
    { root: 'omni', meaning: 'all / every (Latin)' },
    { root: 'pan', meaning: 'all (Greek)' },
    { root: 'holo', meaning: 'whole / entire (Greek)' },
    { root: 'hemi', meaning: 'half (Greek)' },
    { root: 'semi', meaning: 'half (Latin)' },
    { root: 'aero', meaning: 'air / flight (Greek)' },
    { root: 'ornitho', meaning: 'bird (Greek: ornis)' },
    { root: 'herpeto', meaning: 'reptile (Greek)' },
    { root: 'ophi', meaning: 'snake (Greek)' },
    { root: 'entomo', meaning: 'insect (Greek)' },
    { root: 'malaco', meaning: 'soft / mollusk (Greek)' },
    { root: 'concho', meaning: 'shell (Greek)' },
    { root: 'rhizo', meaning: 'root (Greek)' },
    { root: 'xylo', meaning: 'wood (Greek)' },
    { root: 'phyllo', meaning: 'leaf (Greek)' },
    { root: 'antho', meaning: 'flower (Greek)' },
    { root: 'carpo', meaning: 'fruit (Greek)' },
    { root: 'litho', meaning: 'stone / rock (Greek)' },
    { root: 'chryso', meaning: 'gold (Greek)' },
    { root: 'argyro', meaning: 'silver (Greek)' },
    { root: 'melano', meaning: 'black (Greek: melas)' },
    { root: 'leuco', meaning: 'white (Greek: leukos)' },
    { root: 'erythro', meaning: 'red (Greek: erythros)' },
    { root: 'cyano', meaning: 'blue (Greek: kyanos)' },
    { root: 'chloro', meaning: 'green (Greek: chloros)' },
    { root: 'xantho', meaning: 'yellow (Greek: xanthos)' },
    { root: 'ensis', meaning: 'from / belonging to (suffix)' },
    { root: 'idae', meaning: 'family (standard suffix)' },
    { root: 'inae', meaning: 'subfamily (standard suffix)' },
    { root: 'iformes', meaning: 'form / order (standard suffix)' }
];

// Scan specimen name for etymology roots and wrap matches in tooltip spans
function annotateSpecimenName(rawName, fossil) {
    if (!rawName) return '';
    var safeName = escapeHtml(rawName);
    
    var authHtml = '';
    if (fossil && fossil.authority) {
        var cleanAuth = fossil.authority.trim();
        if (cleanAuth) {
            if (cleanAuth.charAt(0) !== '(' && !cleanAuth.startsWith('(')) {
                authHtml = ' <span class="taxonomic-authority">(' + escapeHtml(cleanAuth) + ')</span>';
            } else {
                authHtml = ' <span class="taxonomic-authority">' + escapeHtml(cleanAuth) + '</span>';
            }
        }
    }

    if (fossil && fossil.isWishlist) {
        return safeName + authHtml;
    }

    var nameLower = rawName.toLowerCase();
    var matches = [];

    // 1. Collect all root matches
    ETYMOLOGY.forEach(function(entry) {
        var idx = nameLower.indexOf(entry.root.toLowerCase());
        while (idx !== -1) {
            // Check for overlaps
            var dominated = false;
            for (var m = 0; m < matches.length; m++) {
                var em = matches[m];
                if (em.start <= idx && em.end >= idx + entry.root.length) { dominated = true; break; }
                if (idx <= em.start && idx + entry.root.length >= em.end) { matches.splice(m, 1); m--; }
            }
            if (!dominated) {
                matches.push({ start: idx, end: idx + entry.root.length, meaning: entry.meaning });
            }
            idx = nameLower.indexOf(entry.root.toLowerCase(), idx + 1);
        }
    });

    // 2. Build the tooltip content
    var tooltipText = '';
    
    // Include full description if cached
    if (fossil && fossil.etymology) {
        tooltipText = fossil.etymology;
        if (matches.length > 0) tooltipText += ' — Sub-meanings: ';
    }
    
    if (matches.length > 0) {
        matches.sort(function(a, b) { return a.start - b.start; });
        var rootMeanings = matches.map(function(m) { return rawName.substring(m.start, m.end) + ': ' + m.meaning; });
        tooltipText += (fossil && fossil.etymology ? '' : 'Name meaning: ') + rootMeanings.join(', ');
    }

    if (!tooltipText) return safeName + authHtml;

    // 3. Return a SINGLE unified hover element
    // Only the WHOLE name triggers the tooltip. No nested spans with titles.
    var cursor = 0;
    var annotatedName = '';
    var cleaned = [];
    if (matches.length > 0) {
        cleaned = [matches[0]];
        for (var i = 1; i < matches.length; i++) {
            if (matches[i].start >= cleaned[cleaned.length - 1].end) cleaned.push(matches[i]);
        }
    }

    cleaned.forEach(function(m) {
        annotatedName += escapeHtml(rawName.substring(cursor, m.start));
        // Subtle dotted underline only for the roots
        annotatedName += '<span class="root-underline">' + escapeHtml(rawName.substring(m.start, m.end)) + '</span>';
        cursor = m.end;
    });
    annotatedName += escapeHtml(rawName.substring(cursor));

    // The whole name is wrapped in one container for a single clean tooltip
    var cssClass = fossil && fossil.etymology ? 'etym-unified-summary' : 'etym-unified-roots';
    return '<span class="' + cssClass + '" data-meaning="' + escapeHtml(tooltipText) + '">' + annotatedName + '</span>' + authHtml;
}

// Map exact millions of years ago to proper Epoch, Period, and Age
var AGE_RANGES = [
    { max: 0.0042, period: "Quaternary", epoch: "Holocene", age: "Meghalayan" },
    { max: 0.0082, period: "Quaternary", epoch: "Holocene", age: "Northgrippian" },
    { max: 0.0117, period: "Quaternary", epoch: "Holocene", age: "Greenlandian" },
    { max: 0.129, period: "Quaternary", epoch: "Pleistocene", age: "Upper/Late (Tarantian)" },
    { max: 0.774, period: "Quaternary", epoch: "Pleistocene", age: "Chibanian" },
    { max: 1.80, period: "Quaternary", epoch: "Pleistocene", age: "Calabrian" },
    { max: 2.58, period: "Quaternary", epoch: "Pleistocene", age: "Gelasian" },
    { max: 3.60, period: "Neogene", epoch: "Pliocene", age: "Piacenzian" },
    { max: 5.333, period: "Neogene", epoch: "Pliocene", age: "Zanclean" },
    { max: 7.246, period: "Neogene", epoch: "Miocene", age: "Messinian" },
    { max: 11.63, period: "Neogene", epoch: "Miocene", age: "Tortonian" },
    { max: 13.82, period: "Neogene", epoch: "Miocene", age: "Serravallian" },
    { max: 15.97, period: "Neogene", epoch: "Miocene", age: "Langhian" },
    { max: 20.44, period: "Neogene", epoch: "Miocene", age: "Burdigalian" },
    { max: 23.03, period: "Neogene", epoch: "Miocene", age: "Aquitanian" },
    { max: 27.82, period: "Paleogene", epoch: "Oligocene", age: "Chattian" },
    { max: 33.9, period: "Paleogene", epoch: "Oligocene", age: "Rupelian" },
    { max: 37.71, period: "Paleogene", epoch: "Eocene", age: "Priabonian" },
    { max: 41.2, period: "Paleogene", epoch: "Eocene", age: "Bartonian" },
    { max: 47.8, period: "Paleogene", epoch: "Eocene", age: "Lutetian" },
    { max: 56.0, period: "Paleogene", epoch: "Eocene", age: "Ypresian" },
    { max: 59.2, period: "Paleogene", epoch: "Paleocene", age: "Thanetian" },
    { max: 61.6, period: "Paleogene", epoch: "Paleocene", age: "Selandian" },
    { max: 66.0, period: "Paleogene", epoch: "Paleocene", age: "Danian" },
    { max: 72.1, period: "Cretaceous", epoch: "Late Cretaceous", age: "Maastrichtian" },
    { max: 83.6, period: "Cretaceous", epoch: "Late Cretaceous", age: "Campanian" },
    { max: 86.3, period: "Cretaceous", epoch: "Late Cretaceous", age: "Santonian" },
    { max: 89.8, period: "Cretaceous", epoch: "Late Cretaceous", age: "Coniacian" },
    { max: 93.9, period: "Cretaceous", epoch: "Late Cretaceous", age: "Turonian" },
    { max: 100.5, period: "Cretaceous", epoch: "Late Cretaceous", age: "Cenomanian" },
    { max: 113.0, period: "Cretaceous", epoch: "Early Cretaceous", age: "Albian" },
    { max: 121.4, period: "Cretaceous", epoch: "Early Cretaceous", age: "Aptian" },
    { max: 125.77, period: "Cretaceous", epoch: "Early Cretaceous", age: "Barremian" },
    { max: 132.6, period: "Cretaceous", epoch: "Early Cretaceous", age: "Hauterivian" },
    { max: 139.8, period: "Cretaceous", epoch: "Early Cretaceous", age: "Valanginian" },
    { max: 145.0, period: "Cretaceous", epoch: "Early Cretaceous", age: "Berriasian" },
    { max: 152.1, period: "Jurassic", epoch: "Late Jurassic", age: "Tithonian" },
    { max: 157.3, period: "Jurassic", epoch: "Late Jurassic", age: "Kimmeridgian" },
    { max: 163.5, period: "Jurassic", epoch: "Late Jurassic", age: "Oxfordian" },
    { max: 166.1, period: "Jurassic", epoch: "Middle Jurassic", age: "Callovian" },
    { max: 168.3, period: "Jurassic", epoch: "Middle Jurassic", age: "Bathonian" },
    { max: 170.3, period: "Jurassic", epoch: "Middle Jurassic", age: "Bajocian" },
    { max: 174.1, period: "Jurassic", epoch: "Middle Jurassic", age: "Aalenian" },
    { max: 182.7, period: "Jurassic", epoch: "Early Jurassic", age: "Toarcian" },
    { max: 190.8, period: "Jurassic", epoch: "Early Jurassic", age: "Pliensbachian" },
    { max: 199.3, period: "Jurassic", epoch: "Early Jurassic", age: "Sinemurian" },
    { max: 201.3, period: "Jurassic", epoch: "Early Jurassic", age: "Hettangian" },
    { max: 208.5, period: "Triassic", epoch: "Late Triassic", age: "Rhaetian" },
    { max: 227, period: "Triassic", epoch: "Late Triassic", age: "Norian" },
    { max: 237, period: "Triassic", epoch: "Late Triassic", age: "Carnian" },
    { max: 242, period: "Triassic", epoch: "Middle Triassic", age: "Ladinian" },
    { max: 247.2, period: "Triassic", epoch: "Middle Triassic", age: "Anisian" },
    { max: 251.2, period: "Triassic", epoch: "Early Triassic", age: "Olenekian" },
    { max: 251.9, period: "Triassic", epoch: "Early Triassic", age: "Induan" },
    { max: 254.14, period: "Permian", epoch: "Lopingian", age: "Changhsingian" },
    { max: 259.1, period: "Permian", epoch: "Lopingian", age: "Wuchiapingian" },
    { max: 265.1, period: "Permian", epoch: "Guadalupian", age: "Capitanian" },
    { max: 268.8, period: "Permian", epoch: "Guadalupian", age: "Wordian" },
    { max: 272.95, period: "Permian", epoch: "Guadalupian", age: "Roadian" },
    { max: 283.5, period: "Permian", epoch: "Cisuralian", age: "Kungurian" },
    { max: 290.1, period: "Permian", epoch: "Cisuralian", age: "Artinskian" },
    { max: 293.52, period: "Permian", epoch: "Cisuralian", age: "Sakmarian" },
    { max: 298.9, period: "Permian", epoch: "Cisuralian", age: "Asselian" },
    { max: 303.7, period: "Carboniferous", epoch: "Pennsylvanian", age: "Gzhelian" },
    { max: 307.0, period: "Carboniferous", epoch: "Pennsylvanian", age: "Kasimovian" },
    { max: 315.2, period: "Carboniferous", epoch: "Pennsylvanian", age: "Moscovian" },
    { max: 323.2, period: "Carboniferous", epoch: "Pennsylvanian", age: "Bashkirian" },
    { max: 330.9, period: "Carboniferous", epoch: "Mississippian", age: "Serpukhovian" },
    { max: 346.7, period: "Carboniferous", epoch: "Mississippian", age: "Visean" },
    { max: 358.9, period: "Carboniferous", epoch: "Mississippian", age: "Tournaisian" },
    { max: 372.2, period: "Devonian", epoch: "Late Devonian", age: "Famennian" },
    { max: 382.7, period: "Devonian", epoch: "Late Devonian", age: "Frasnian" },
    { max: 387.7, period: "Devonian", epoch: "Middle Devonian", age: "Givetian" },
    { max: 393.3, period: "Devonian", epoch: "Middle Devonian", age: "Eifelian" },
    { max: 407.6, period: "Devonian", epoch: "Early Devonian", age: "Emsian" },
    { max: 410.8, period: "Devonian", epoch: "Early Devonian", age: "Pragian" },
    { max: 419.2, period: "Devonian", epoch: "Early Devonian", age: "Lochkovian" },
    { max: 423.0, period: "Silurian", epoch: "Pridoli", age: "Pridoli" },
    { max: 425.6, period: "Silurian", epoch: "Ludlow", age: "Ludfordian" },
    { max: 427.4, period: "Silurian", epoch: "Ludlow", age: "Gorstian" },
    { max: 430.5, period: "Silurian", epoch: "Wenlock", age: "Homerian" },
    { max: 433.4, period: "Silurian", epoch: "Wenlock", age: "Sheinwoodian" },
    { max: 438.5, period: "Silurian", epoch: "Llandovery", age: "Telychian" },
    { max: 440.8, period: "Silurian", epoch: "Llandovery", age: "Aeronian" },
    { max: 443.8, period: "Silurian", epoch: "Llandovery", age: "Rhuddanian" },
    { max: 445.2, period: "Ordovician", epoch: "Late Ordovician", age: "Hirnantian" },
    { max: 453.0, period: "Ordovician", epoch: "Late Ordovician", age: "Katian" },
    { max: 458.4, period: "Ordovician", epoch: "Late Ordovician", age: "Sandbian" },
    { max: 467.3, period: "Ordovician", epoch: "Middle Ordovician", age: "Darriwilian" },
    { max: 470.0, period: "Ordovician", epoch: "Middle Ordovician", age: "Dapingian" },
    { max: 477.7, period: "Ordovician", epoch: "Early Ordovician", age: "Floian" },
    { max: 485.4, period: "Ordovician", epoch: "Early Ordovician", age: "Tremadocian" },
    { max: 489.5, period: "Cambrian", epoch: "Furongian", age: "Stage 10" },
    { max: 494, period: "Cambrian", epoch: "Furongian", age: "Jiangshanian" },
    { max: 497, period: "Cambrian", epoch: "Furongian", age: "Paibian" },
    { max: 500.5, period: "Cambrian", epoch: "Miaolingian", age: "Guzhangian" },
    { max: 504.5, period: "Cambrian", epoch: "Miaolingian", age: "Drumian" },
    { max: 509, period: "Cambrian", epoch: "Miaolingian", age: "Wuliuan" },
    { max: 514, period: "Cambrian", epoch: "Series 2", age: "Stage 4" },
    { max: 521, period: "Cambrian", epoch: "Series 2", age: "Stage 3" },
    { max: 529, period: "Cambrian", epoch: "Terreneuvian", age: "Stage 2" },
    { max: 538.8, period: "Cambrian", epoch: "Terreneuvian", age: "Fortunian" },
    { max: 635, period: "Proterozoic", epoch: "Neoproterozoic", age: "Ediacaran" },
    { max: 720, period: "Proterozoic", epoch: "Neoproterozoic", age: "Cryogenian" },
    { max: 1000, period: "Proterozoic", epoch: "Neoproterozoic", age: "Tonian" },
    { max: 1200, period: "Proterozoic", epoch: "Mesoproterozoic", age: "Stenian" },
    { max: 1400, period: "Proterozoic", epoch: "Mesoproterozoic", age: "Ectasian" },
    { max: 1600, period: "Proterozoic", epoch: "Mesoproterozoic", age: "Calymmian" },
    { max: 1800, period: "Proterozoic", epoch: "Paleoproterozoic", age: "Statherian" },
    { max: 2050, period: "Proterozoic", epoch: "Paleoproterozoic", age: "Orosirian" },
    { max: 2300, period: "Proterozoic", epoch: "Paleoproterozoic", age: "Rhyacian" },
    { max: 2500, period: "Proterozoic", epoch: "Paleoproterozoic", age: "Siderian" },
    { max: 2800, period: "Archean", epoch: "Neoarchean", age: "" },
    { max: 3200, period: "Archean", epoch: "Mesoarchean", age: "" },
    { max: 3600, period: "Archean", epoch: "Paleoarchean", age: "" },
    { max: 4000, period: "Archean", epoch: "Eoarchean", age: "" },
    { max: 9999, period: "Hadean", epoch: "", age: "" }
];

function getPeriodsGrouped() {
    var groups = [];
    for (var era in PERIODS_AND_EPOCHS) {
        groups.push({ era: era, periods: Object.keys(PERIODS_AND_EPOCHS[era]) });
    }
    return groups;
}

function getEpochsForPeriod(period) {
    for (var era in PERIODS_AND_EPOCHS) {
        if (PERIODS_AND_EPOCHS[era][period]) {
            return PERIODS_AND_EPOCHS[era][period];
        }
    }
    return [];
}

function getAgesForEpoch(epoch) {
    if (!epoch) return [];
    var ages = [];
    var seen = {};
    for (var i = 0; i < AGE_RANGES.length; i++) {
        var a = AGE_RANGES[i].age;
        if (AGE_RANGES[i].epoch === epoch && a && !seen[a]) {
            ages.push(a);
            seen[a] = true;
        }
    }
    return ages;
}


// =========================================================================
// DATABASE (IndexedDB)
// =========================================================================
var DB_NAME = 'FossilArchiveDB';
var DB_VERSION = 1;
var dbInstance = null;

function initDB() {
    return new Promise(function(resolve, reject) {
        if (dbInstance) return resolve(dbInstance);
        var request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = function(e) { reject('IndexedDB error: ' + e.target.errorCode); };
        request.onsuccess = function(e) {
            dbInstance = e.target.result;
            resolve(dbInstance);
        };
        request.onupgradeneeded = function(e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains('fossils')) {
                var store = db.createObjectStore('fossils', { keyPath: 'id' });
                store.createIndex('category', 'category', { unique: false });
                store.createIndex('geologicalPeriod', 'geologicalPeriod', { unique: false });
                store.createIndex('isWishlist', 'isWishlist', { unique: false });
            }
        };
    });
}

// FIX: withStore had a race condition where both transaction.oncomplete and
// request.onsuccess could call resolve(). Now we only resolve/reject from
// the request callbacks and let the transaction handle errors.
function withStore(type, callback) {
    return initDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            var transaction = db.transaction('fossils', type);
            var store = transaction.objectStore('fossils');
            transaction.onerror = function(e) { reject(e); };
            callback(store, resolve, reject);
        });
    });
}

function getAllFossils() {
    return initDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            var tx = db.transaction('fossils', 'readonly');
            var store = tx.objectStore('fossils');
            var request = store.getAll();
            request.onsuccess = function() { resolve(request.result); };
            request.onerror = function() { reject(request.error); };
        });
    });
}

function addFossil(fossil) {
    return withStore('readwrite', function(store, resolve, reject) {
        var request = store.add(fossil);
        request.onsuccess = function() { fossilsCacheLoaded = false; resolve(); };
        request.onerror = function() { reject(request.error); };
    });
}

function updateFossil(fossil) {
    return withStore('readwrite', function(store, resolve, reject) {
        var request = store.put(fossil);
        request.onsuccess = function() { fossilsCacheLoaded = false; resolve(); };
        request.onerror = function() { reject(request.error); };
    });
}

function deleteFossil(id) {
    return withStore('readwrite', function(store, resolve, reject) {
        var request = store.delete(id);
        request.onsuccess = function() { fossilsCacheLoaded = false; resolve(); };
        request.onerror = function() { reject(request.error); };
    });
}

function deleteMultipleFossils(ids) {
    return initDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            var tx = db.transaction('fossils', 'readwrite');
            var store = tx.objectStore('fossils');
            tx.onerror = function(e) { reject(e); };
            tx.oncomplete = function() { fossilsCacheLoaded = false; resolve(); };
            ids.forEach(function(id) { store.delete(id); });
        });
    });
}

function exportToJSON() {
    return getAllFossils().then(function(fossilsList) {
        if (!fossilsList || fossilsList.length === 0) {
            if (window.app && window.app.showToast) {
                window.app.showToast('No fossil records found to export.', 'warning');
            }
            return;
        }
        var dataStr = JSON.stringify(fossilsList, null, 2);
        var blob = new Blob([dataStr], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'fossil-archive-backup.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        if (window.app && window.app.showToast) {
            window.app.showToast('Backup completed! fossil-archive-backup.json downloaded successfully.', 'success');
        }
    }).catch(function(err) {
        console.error('Export failed:', err);
        if (window.app && window.app.showToast) {
            window.app.showToast('Export failed: ' + err.message, 'danger');
        }
    });
}


// =========================================================================
// CSV IMPORT — flexible header mapping
// =========================================================================
function normalizeCSVRow(row) {
    var mapped = {};
    var keyMap = {};
    for (var key in row) {
        if (row.hasOwnProperty(key)) {
            keyMap[key.toLowerCase().trim()] = (row[key] || '').toString();
        }
    }

    mapped.specimen   = keyMap['specimen'] || keyMap['specimen name'] || keyMap['name'] || keyMap['fossil'] || keyMap['fossil name'] || '';
    mapped.anatomy    = keyMap['anatomy'] || keyMap['part'] || '';
    mapped.category   = keyMap['category'] || keyMap['type'] || keyMap['fossil type'] || keyMap['type of fossil'] || '';

    var wl = (keyMap['iswishlist'] || keyMap['wishlist'] || keyMap['is wishlist'] || '').toLowerCase();
    mapped.isWishlist  = (wl === 'true' || wl === '1' || wl === 'yes');

    mapped.geologicalPeriod = keyMap['geologicalperiod'] || keyMap['geological period'] || keyMap['period'] || '';
    mapped.epoch       = keyMap['epoch'] || '';
    mapped.stratAge    = keyMap['stratigraphic age'] || keyMap['stratigraphic_age'] || keyMap['stage'] || keyMap['age (stage)'] || keyMap['age'] || '';
    mapped.country     = keyMap['country'] || keyMap['country of origin'] || keyMap['origin'] || '';
    mapped.location    = keyMap['location'] || keyMap['locality'] || keyMap['site'] || '';
    mapped.formation   = keyMap['formation'] || keyMap['geological formation'] || '';
    mapped.size        = parseFloat(keyMap['size'] || keyMap['dimensions'] || '') || null;
    mapped.sizeUnit    = (keyMap['size unit'] || keyMap['size_unit'] || keyMap['unit'] || 'cm').toLowerCase();
    mapped.weight      = parseFloat(keyMap['weight'] || '') || null;
    mapped.price       = parseFloat(keyMap['price'] || keyMap['value'] || keyMap['cost'] || '') || null;
    mapped.currency    = (keyMap['currency'] || 'USD').toUpperCase();
    mapped.notes       = keyMap['notes'] || keyMap['description'] || keyMap['comments'] || '';
    mapped.ageMa       = parseFloat(keyMap['agema'] || keyMap['age ma'] || keyMap['age (ma)'] || '0') || 0;

    var sold = (keyMap['issold'] || keyMap['sold'] || keyMap['is sold'] || '').toLowerCase();
    mapped.isSold  = (sold === 'true' || sold === '1' || sold === 'yes');
    mapped.salePrice = parseFloat(keyMap['saleprice'] || keyMap['sale price'] || keyMap['soldprice'] || keyMap['sold price'] || '') || null;
    mapped.saleCurrency = (keyMap['salecurrency'] || keyMap['sale currency'] || keyMap['soldcurrency'] || keyMap['sold currency'] || 'USD').toUpperCase();

    return mapped;
}

// --- Taxonomic Hierarchy (PBDB API) ---
function fetchTaxonomyData(specimenName) {
    if (!specimenName) return Promise.reject('No specimen name');
    
    // Clean name: take only the first two words (Genus species) to avoid noise
    var cleanName = specimenName.trim().split(/\s+/).slice(0, 2).join(' ');
    var url = 'https://paleobiodb.org/data1.2/taxa/list.json?name=' + encodeURIComponent(cleanName) + '&rel=all_parents&show=class';
    
    return fetch(url)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (!data || !data.records || data.records.length === 0) {
                throw new Error('No taxonomic data found');
            }
            
            // Map common ranks we want to display
            var desiredRanks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
            var hierarchy = {};
            
            data.records.forEach(function(rec) {
                var rnk = (rec.rnk || '').toLowerCase();
                if (desiredRanks.indexOf(rnk) !== -1) {
                    hierarchy[rnk] = rec.nam;
                }
            });
            
            return hierarchy;
        });
}


var GEOLOGICAL_HISTORY_DATA = {
    'Quaternary': {
        era: 'Cenozoic',
        time: '2.58 Ma – Present',
        climate: 'Glacial cycles (Ice Ages) alternating with warmer interglacials.',
        continent: 'Modern positions; extensive ice sheets covered northern landmasses.',
        evolution: 'Rapid evolution of hominids, leading to Homo sapiens. Extinction of megafauna (mammoths, saber-toothed cats) at the end of the last glaciation.',
        description: 'The Quaternary represents the most recent geological period, characterized by repeated glaciations and the rise of human civilization. Fossils from this era are usually highly preserved bones, teeth, and shells.'
    },
    'Neogene': {
        era: 'Cenozoic',
        time: '23.03 – 2.58 Ma',
        climate: 'Moderate cooling; seasonal cycles become more pronounced.',
        continent: 'North and South America connect via the Isthmus of Panama; India continues pushing into Asia.',
        evolution: 'Grasslands expand extensively, driving the evolution of grazing mammals, horses, and songbirds. Apex marine predators like the Megalodon shark rule the oceans.',
        description: 'During the Neogene, continents took on virtually modern shapes. The cooler, drier climate favored grasslands over forests, prompting mammals and birds to adapt rapidly to open savannas.'
    },
    'Paleogene': {
        era: 'Cenozoic',
        time: '66.0 – 23.03 Ma',
        climate: 'Warm and tropical early on (PETM thermal maximum), cooling to temperate climates later.',
        continent: 'Atlantic Ocean continues widening; Australia begins drifting away from Antarctica.',
        evolution: 'Following the K-Pg extinction, mammals and birds diversify from tiny nocturnal creatures into the dominant terrestrial vertebrates (early horses, whales, primates).',
        description: 'The Paleogene marks the beginning of the Cenozoic Era. With the dinosaurs gone, Earth\'s ecological niches were open, triggering an evolutionary explosion of mammals, birds, and modern flowering plants.'
    },
    'Cretaceous': {
        era: 'Mesozoic',
        time: '145.0 – 66.0 Ma',
        climate: 'Very warm, greenhouse climate with high sea levels and no polar ice caps.',
        continent: 'Supercontinent Gondwana splits completely; massive inland seaways divide North America.',
        evolution: 'Dinosaurs like T-Rex and Triceratops dominate the land. Marine reptiles like mosasaurs rule the seas. Flowering plants (angiosperms) and social insects emerge. Ends with the catastrophic K-Pg asteroid impact.',
        description: 'The Cretaceous was the longest period of the Mesozoic. It was a lush, warm world of giants. The period ended abruptly 66 million years ago, wiping out the non-avian dinosaurs, pterosaurs, and ammonites.'
    },
    'Jurassic': {
        era: 'Mesozoic',
        time: '201.3 – 145.0 Ma',
        climate: 'Warm and moist; arid deserts of the Triassic transform into lush rainforests.',
        continent: 'Supercontinent Pangaea splits into two large landmasses: Laurasia and Gondwana.',
        evolution: 'Sauropods (giant long-necked herbivores) and theropods (allosaurs) dominate. Pterosaurs rule the skies. Archaeopteryx, the first bird, emerges. Abundant ammonites and belemnites fill the oceans.',
        description: 'The Jurassic was the golden age of dinosaurs. The split of Pangaea created new coastlines, transforming the climate from dry deserts into humid, tropical environments teeming with diverse lifeforms.'
    },
    'Triassic': {
        era: 'Mesozoic',
        time: '252.17 – 201.3 Ma',
        climate: 'Hot, dry, and highly arid inland, with massive monsoonal rainfall on the coasts.',
        continent: 'Pangaea remains assembled as a single supercontinent but begins rifting late in the period.',
        evolution: 'First dinosaurs, pterosaurs, and true mammals appear. Therapsids (mammal-like reptiles) recover, and marine reptiles like ichthyosaurs populate the seas.',
        description: 'The Triassic emerged from the ashes of the Permian extinction. It was a transition period where life slowly recovered, paving the way for the age of dinosaurs. It ended with another major extinction event.'
    },
    'Permian': {
        era: 'Paleozoic',
        time: '298.9 – 252.17 Ma',
        climate: 'Extreme continental interiors; dry deserts dominate the massive supercontinent.',
        continent: 'All of Earth\'s major landmasses collide to form the massive C-shaped supercontinent Pangaea.',
        evolution: 'Synapsids (sail-backed Dimetrodon) dominate land. Seed plants like conifers diversify. Ends with the Permian-Triassic extinction ("The Great Dying"), wiping out 95% of marine and 70% of land species.',
        description: 'The Permian was the final period of the Paleozoic Era. Life was dominated by early mammal ancestors and diverse seed plants. The period ended with the largest mass extinction event in Earth\'s history.'
    },
    'Carboniferous': {
        era: 'Paleozoic',
        time: '358.9 – 298.9 Ma',
        climate: 'Hot and humid, turning colder and glaciated in the southern hemisphere later.',
        continent: 'Laurasia and Gondwana collide, forming early stages of Pangaea.',
        evolution: 'Vast lycopod and fern swamps cover the equator, producing Earth\'s coal deposits. High oxygen levels fuel giant insects (Meganeura). First reptiles evolve, and amphibians proliferate.',
        description: 'The Carboniferous is famous for its dense coal forests. The high atmospheric oxygen levels allowed arthropods to grow to massive sizes. The first amniotes (reptiles) evolved, laying shelled eggs on dry land.'
    },
    'Devonian': {
        era: 'Paleozoic',
        time: '419.2 – 358.9 Ma',
        climate: 'Warm and dry; sea levels are high, creating warm, shallow inland reefs.',
        continent: 'North America and Europe collide to form Euramerica; Gondwana sits to the south.',
        evolution: 'The "Age of Fishes" — jawed fish, placoderms (Dunkleosteus), and sharks dominate. First vascular forests expand, pulling CO2 from the air. Early tetrapods (Tiktaalik) take their first steps onto land.',
        description: 'The Devonian was a time of immense evolutionary transition. Marine life exploded with diverse armored fishes, while the land was colonized by early trees, arachnids, and our own tetrapod ancestors.'
    },
    'Silurian': {
        era: 'Paleozoic',
        time: '443.8 – 419.2 Ma',
        climate: 'Warm, greenhouse climate; sea levels stabilize after the Ordovician glaciation melt.',
        continent: 'Continents drift closer together near the equator.',
        evolution: 'First vascular land plants (Cooksonia) establish terrestrial ecosystems. Jawed fishes emerge and diversify. Coral reefs expand, and early arachnids (scorpions) colonize the land.',
        description: 'The Silurian recovered from a massive ice age. The stabilizing climate allowed early plants to colonize riverbanks, and jawed fishes gained a permanent evolutionary foothold in the oceans.'
    },
    'Ordovician': {
        era: 'Paleozoic',
        time: '485.4 – 443.8 Ma',
        climate: 'Warm and tropical early on, followed by severe global cooling and massive glaciation at the end.',
        continent: 'Gondwana sits in the southern hemisphere; other landmasses are scattered near the equator.',
        evolution: 'Invertebrates flourish (ammonites, straight cephalopods like Orthoceras, trilobites, brachiopods). First jawless fishes appear. Ends with the second largest mass extinction due to a massive glaciation.',
        description: 'The Ordovician saw a massive diversification of marine life. Trilobites, brachiopods, and giant straight nautiloids ruled the seas. The period ended with an ice age that wiped out 85% of marine species.'
    },
    'Cambrian': {
        era: 'Paleozoic',
        time: '541.0 – 485.4 Ma',
        climate: 'Warm and humid, with no polar ice.',
        continent: 'Gondwana is the largest continent, surrounded by smaller scattered landmasses.',
        evolution: 'The "Cambrian Explosion" — the rapid appearance of almost all major animal phyla in the fossil record. Trilobites, Anomalocaris, and early chordates (Pikaia) evolve in the oceans.',
        description: 'The Cambrian is the dawn of complex multicellular life. In a geological blink of an eye, marine ecosystems transformed from simple microbial mats into diverse food webs populated by bizarre armored creatures.'
    }
};

var KEY_SPECIMENS = [
    // Quaternary
    { name: 'Woolly Mammoth', category: 'Vertebrate', period: 'Quaternary', description: 'The iconic ice age giant, close relative of modern elephants.', importance: 'Ice Age Megafauna' },
    { name: 'Smilodon', category: 'Vertebrate', period: 'Quaternary', description: 'The famous saber-toothed cat with massive canine teeth.', importance: 'Ice Age Apex Predator' },
    
    // Neogene
    { name: 'Megalodon', category: 'Vertebrate', period: 'Neogene', description: 'The legendary colossal prehistoric shark.', importance: 'Apex Predator of the Cenozoic' },
    { name: 'Hipparion', category: 'Vertebrate', period: 'Neogene', description: 'An early three-toed horse that spread across grasslands.', importance: 'Neogene Evolutionary Index' },

    // Paleogene
    { name: 'Basilosaurus', category: 'Vertebrate', period: 'Paleogene', description: 'A colossal predatory ancient whale with vestigial hind limbs.', importance: 'Early Marine Mammal Pioneer' },
    { name: 'Knightia', category: 'Vertebrate', period: 'Paleogene', description: 'A classic schooling Eocene herring fossil from the Green River Formation.', importance: 'Green River Index Fish' },

    // Cretaceous
    { name: 'Tyrannosaurus Rex', category: 'Vertebrate', period: 'Cretaceous', description: 'The famous "king of the tyrant lizards."', importance: 'Iconic Mesozoic Carnivore' },
    { name: 'Triceratops', category: 'Vertebrate', period: 'Cretaceous', description: 'Famous three-horned herbivorous dinosaur.', importance: 'Late Cretaceous Index Herbivore' },
    { name: 'Spinosaurus', category: 'Vertebrate', period: 'Cretaceous', description: 'The largest known carnivorous dinosaur, adapted to semi-aquatic life.', importance: 'Unique Piscivorous Theropod' },
    { name: 'Ammonite', category: 'Invertebrate', period: 'Cretaceous', description: 'Coiled marine cephalopods related to modern nautiluses.', importance: 'Mesozoic Index Marine Fossil' },

    // Jurassic
    { name: 'Archaeopteryx', category: 'Vertebrate', period: 'Jurassic', description: 'The transitional link between dinosaurs and birds.', importance: 'Key Evolutionary Milestone' },
    { name: 'Allosaurus', category: 'Vertebrate', period: 'Jurassic', description: 'The dominant large theropod dinosaur of the Jurassic.', importance: 'Apex Jurassic Carnivore' },
    { name: 'Brachiosaurus', category: 'Vertebrate', period: 'Jurassic', description: 'A giant sauropod dinosaur with longer front limbs than hind limbs.', importance: 'Iconic Jurassic Giant' },

    // Triassic
    { name: 'Coelophysis', category: 'Vertebrate', period: 'Triassic', description: 'One of the earliest and most successful theropod dinosaurs.', importance: 'Dawn of Dinosaurs Index' },
    { name: 'Ichthyosaurus', category: 'Vertebrate', period: 'Triassic', description: 'A dolphin-like marine reptile that ruled Triassic seas.', importance: 'Triassic Marine Pioneer' },

    // Permian
    { name: 'Dimetrodon', category: 'Vertebrate', period: 'Permian', description: 'The famous synapsid with a large neural-spine sail.', importance: 'Iconic Permian Land Vertebrate' },
    { name: 'Helicoprion', category: 'Vertebrate', period: 'Permian', description: 'An ancient shark-like fish with a circular buzzsaw whorl of teeth.', importance: 'Permian Marine Mystery' },

    // Carboniferous
    { name: 'Pecopteris', category: 'Plant', period: 'Carboniferous', description: 'A common seed fern leaf fossil from the ancient coal swamps.', importance: 'Carboniferous Flora Index Fossil' },
    { name: 'Meganeura', category: 'Invertebrate', period: 'Carboniferous', description: 'A giant dragonfly-like insect with a wingspan up to 70 cm.', importance: 'Carboniferous Giant Insect' },

    // Devonian
    { name: 'Phacops', category: 'Invertebrate', period: 'Devonian', description: 'A classic Devonian trilobite capable of rolling into a ball.', importance: 'Devonian Marine Index Fossil' },
    { name: 'Dunkleosteus', category: 'Vertebrate', period: 'Devonian', description: 'A massive armored prehistoric predator fish with razor bone plates.', importance: 'Age of Fishes Apex Predator' },

    // Silurian
    { name: 'Eurypterus', category: 'Invertebrate', period: 'Silurian', description: 'An iconic sea scorpion that ruled shallow coastal waters.', importance: 'Silurian Apex Predator' },
    { name: 'Cooksonia', category: 'Plant', period: 'Silurian', description: 'One of the earliest known land plants with Y-branched stems.', importance: 'Dawn of Land Plants' },

    // Ordovician
    { name: 'Orthoceras', category: 'Invertebrate', period: 'Ordovician', description: 'A straight-shelled nautiloid cephalopod.', importance: 'Ordovician Ocean Predator' },
    { name: 'Flexicalymene', category: 'Invertebrate', period: 'Ordovician', description: 'A common and beautiful trilobite found rolled or flat.', importance: 'Ordovician Index Invertebrate' },

    // Cambrian
    { name: 'Elrathia kingii', category: 'Invertebrate', period: 'Cambrian', description: 'One of the most famous and recognizable trilobites.', importance: 'Cambrian Explosion Index Fossil' },
    { name: 'Anomalocaris', category: 'Invertebrate', period: 'Cambrian', description: 'The largest predator of the Cambrian seas, with circular mouthparts.', importance: 'First Apex Predator of Earth' },

    // Precambrian / Ediacaran
    { name: 'Ediacaran Dickinsonia', category: 'Invertebrate', period: 'Ediacaran', description: 'An enigmatic oval, ribbed organism representing Earth\'s earliest complex life.', importance: 'Precambrian Metazoan Pioneer' }
];

var fossils = [];
var fossilsCacheLoaded = false;
var selectedFossils = new Set();
var expandedTaxonomyIds = new Set();
var currentImages = [];
var currentView = 'false'; // 'false' = Collection, 'true' = Wishlist
var isStatsOpen = false;
var isAutoEnhanceActive = localStorage.getItem('photo_auto_enhance') === 'true';
var comparePickerModeActive = false;

// Debounce utility — delays fn execution until wait ms after the last call
function debounce(fn, wait) {
    var timer = null;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() { fn.apply(context, args); }, wait);
    };
}

// Debounced search handler (250ms) to avoid Levenshtein stutter on large collections
var renderFossilsDebounced = debounce(function() {
    window.app.renderFossils();
}, 250);

var isDataInsightsOpen = false;
var isTreemapOpen = false;
var isEarthHistoryOpen = false;
var isFossilMapOpen = false;
var isDeepDiveOpen = false;
var activeDeepDiveFossilId = null;
var isScoreboardOpen = false;
var isChronoChartOpen = false;
var isPortfolioOpen = false;
var isPhylogenyOpen = false;
var portfolioSortField = 'specimen';
var portfolioSortAsc = true;
var activeBaseCurrency = 'USD';
var leafletMapInstance = null;
var leafletMarkerGroup = null;
var leafletActiveTileLayer = null;
var isAutoFetching = false;
var newlyAddedFossilId = null;
var chartCountry = null;
var chartPeriod = null;
var exchangeRates = null;
var lightboxFossilId = null;
var lightboxIdx = 0;
var lightboxFilteredList = []; // The current filtered+sorted fossil list, used for inter-fossil navigation
var isShowcaseActive = false;
var showcaseList = [];
var showcaseIndex = 0;
var showcaseIntervalId = null;
var showcasePlayActive = true;

function fetchExchangeRates() {
    var cached = localStorage.getItem('exchangeRates_SEK');
    var cachedTime = localStorage.getItem('exchangeRates_time');
    var now = Date.now();
    // Cache for 12 hours (43200000 ms)
    if (cached && cachedTime && (now - cachedTime < 43200000)) {
        exchangeRates = JSON.parse(cached);
        if(isStatsOpen) window.app.renderFossils();
        return;
    }
    
    fetch('https://open.er-api.com/v6/latest/SEK')
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data && data.result === 'success' && data.rates) {
                exchangeRates = data.rates;
                localStorage.setItem('exchangeRates_SEK', JSON.stringify(data.rates));
                localStorage.setItem('exchangeRates_time', now.toString());
                if(isStatsOpen) window.app.renderFossils();
            }
        })
        .catch(function(err) { console.error('Failed to fetch exchange rates', err); });
}

window.addEventListener('DOMContentLoaded', function() {
    var sizeUnitSelect = document.getElementById('f-size-unit');
    if (sizeUnitSelect) {
        sizeUnitSelect.addEventListener('change', function() {
            var val = sizeUnitSelect.value;
            var wDisp = document.getElementById('f-width-unit-display');
            var tDisp = document.getElementById('f-thickness-unit-display');
            if (wDisp) wDisp.textContent = val;
            if (tDisp) tDisp.textContent = val;
        });
    }

    var savedTheme = localStorage.getItem('oceanic_theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        var themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
        }
    }

    // Initialize Auto-Enhance Dropdown Label
    var enrichLabel = document.getElementById('toggle-enrich-lighting');
    if (enrichLabel) {
        enrichLabel.innerHTML = '💡 Auto-Enhance Lighting: ' + (isAutoEnhanceActive ? 'On' : 'Off');
    }

    // Backup Pulse logic
    var lastBackup = localStorage.getItem('last_backup');
    var sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (!lastBackup || Date.now() - parseInt(lastBackup, 10) > sevenDaysMs) {
        var exportBtn = document.getElementById('btn-export');
        if (exportBtn) {
            exportBtn.style.position = 'relative';
            exportBtn.insertAdjacentHTML('beforeend', '<div class="pulse-dot" title="You haven\'t backed up in over 7 days!"></div>');
        }
        var dbCenterBtn = document.getElementById('btn-db-center');
        if (dbCenterBtn) {
            dbCenterBtn.style.position = 'relative';
            dbCenterBtn.insertAdjacentHTML('beforeend', '<div class="pulse-dot" title="You haven\'t backed up in over 7 days!"></div>');
        }
    }

    populateDropdowns();
    fetchExchangeRates();
    initDB().then(function() {
        window.app.renderFossils();
        // Run background check for bloated images 2 seconds after load
        setTimeout(optimizeExistingDatabase, 2000);
        // Automatic ID Migration (UUID -> Catalog) 1 second after load
        setTimeout(migrateToCatalogIds, 1000);
        // Automatic Background Data Enrichment 3 seconds after load
        setTimeout(enrichDatabaseInBackground, 3000);
    });

    // Close dropdowns on outside clicks
    document.addEventListener('click', function() {
        var menu = document.getElementById('enrich-dropdown');
        if (menu && menu.classList.contains('active')) {
            menu.classList.remove('active');
        }
        var dbMenu = document.getElementById('db-dropdown');
        if (dbMenu && dbMenu.classList.contains('active')) {
            dbMenu.classList.remove('active');
        }
        var mobileMenu = document.getElementById('mobile-menu-dropdown-content');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
        if (window.app && typeof window.app.closeAllCardMenus === 'function') {
            window.app.closeAllCardMenus();
        }
    });

    // Floating Back to Top Button scroll handler
    var backToTopBtn = document.getElementById('btn-back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
                backToTopBtn.style.transform = 'translateY(0)';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
                backToTopBtn.style.transform = 'translateY(15px)';
            }
        }, { passive: true });
    }
});

// Global keyboard navigation (Lightbox & Showcase & Zoom & Compare)
document.addEventListener('keydown', function(e) {
    var deepDiveModal = document.getElementById('deep-dive-modal');
    if (deepDiveModal && deepDiveModal.style.display === 'flex') {
        if (e.key === 'Escape') {
            window.app.closeDeepDive();
            e.preventDefault();
            return;
        }
        if (e.key === 'ArrowLeft') {
            window.app.navigateDeepDive(-1);
            e.preventDefault();
            return;
        }
        if (e.key === 'ArrowRight') {
            window.app.navigateDeepDive(1);
            e.preventDefault();
            return;
        }
    }

    var compareModal = document.getElementById('compare-modal');
    if (compareModal && compareModal.style.display === 'flex') {
        if (e.key === 'Escape') {
            window.app.closeCompareMode();
            e.preventDefault();
            return;
        }
    }

    var zoomOverlay = document.getElementById('zoom-overlay');
    if (zoomOverlay && zoomOverlay.classList.contains('active')) {
        if (e.key === 'Escape') {
            window.app.closeZoomOverlay();
            e.stopPropagation();
        }
        return;
    }
    
    // Showcase mode key binds
    var showcase = document.getElementById('showcase-mode');
    if (showcase && showcase.style.display === 'block') {
        if (e.key === 'Escape') {
            window.app.exitShowcaseMode();
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            window.app.showcaseNav(-1);
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            window.app.showcaseNav(1);
            e.preventDefault();
        } else if (e.key === ' ') { // spacebar
            window.app.toggleShowcasePlay();
            e.preventDefault();
        }
        return;
    }

    var overlay = document.getElementById('lightbox');
    if (!overlay || !overlay.classList.contains('active')) return;
    if (e.key === 'Escape') { window.app.closeLightbox(); }
    else if (e.key === 'ArrowLeft') { window.app.lightboxNav(-1); }
    else if (e.key === 'ArrowRight') { window.app.lightboxNav(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); window.app.lightboxFossilNav(-1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); window.app.lightboxFossilNav(1); }
});

function getEraColor(period) {
    if (!period) return '#4a5568';
    var p = period.trim().toLowerCase();
    if (p === 'quaternary' || p === 'neogene' || p === 'paleogene') return '#319795'; // Teal
    if (p === 'cretaceous' || p === 'jurassic' || p === 'triassic') return '#dd6b20'; // Orange
    if (p === 'permian' || p === 'carboniferous' || p === 'devonian' || p === 'silurian' || p === 'ordovician' || p === 'cambrian') return '#2b6cb0'; // Blue
    return '#4a5568'; // Grey
}

function getSmartGeocodeQueries(location, formation, country) {
    var loc = (location || '').trim();
    var form = (formation || '').trim();
    var cntry = (country || '').trim();
    
    function clean(str) {
        if (!str) return '';
        var parts = str.split(/\b(?:or|and|\/)\b/i);
        var firstPart = parts[0].trim();
        
        var cleanStr = firstPart
            .replace(/\b(?:formation|beds|group|member|fossils?|quarries?|pits?|deposits?|sites?|areas?|regions?|limestones?|shales?|clays?|sands?|beds?)\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
            
        return cleanStr;
    }
    
    var cleanLoc = clean(loc);
    var cleanForm = clean(form);
    var cleanCountry = cntry;
    
    var queries = [];
    
    // Famous formation region injection helper
    var famousMappings = {
        'hell creek': { region: 'Montana', country: 'USA' },
        'kem kem': { region: 'Morocco', country: 'Morocco' },
        'solnhofen': { region: 'Bavaria', country: 'Germany' },
        'yixian': { region: 'Liaoning', country: 'China' },
        'lyme regis': { region: 'Dorset', country: 'UK' },
        'morrison': { region: 'Colorado', country: 'USA' },
        'green river': { region: 'Wyoming', country: 'USA' },
        'brule': { region: 'Nebraska', country: 'USA' },
        'white river': { region: 'Nebraska', country: 'USA' },
        'london clay': { region: 'London', country: 'UK' },
        'liaoning': { region: 'Liaoning', country: 'China' },
        'jurassic coast': { region: 'Dorset', country: 'UK' }
    };
    
    var injectedRegion = '';
    var injectedCountry = '';
    
    var formLower = cleanForm.toLowerCase();
    for (var key in famousMappings) {
        if (formLower.indexOf(key) !== -1) {
            injectedRegion = famousMappings[key].region;
            injectedCountry = famousMappings[key].country;
            break;
        }
    }
    
    var locLower = cleanLoc.toLowerCase();
    if (!injectedRegion) {
        for (var key in famousMappings) {
            if (locLower.indexOf(key) !== -1) {
                injectedRegion = famousMappings[key].region;
                injectedCountry = famousMappings[key].country;
                break;
            }
        }
    }

    // 1. Precise combinations with injected famous regions (Highest priority)
    if (cleanForm && injectedRegion && injectedCountry) {
        queries.push(cleanForm + ', ' + injectedRegion + ', ' + injectedCountry);
    }
    if (cleanLoc && injectedRegion && injectedCountry && cleanLoc.toLowerCase() !== injectedRegion.toLowerCase()) {
        queries.push(cleanLoc + ', ' + injectedRegion + ', ' + injectedCountry);
    }

    // 2. Standard combinations (Specific before general order)
    if (cleanLoc && cleanForm && cleanCountry) {
        queries.push(cleanForm + ', ' + cleanLoc + ', ' + cleanCountry);
        queries.push(cleanLoc + ', ' + cleanForm + ', ' + cleanCountry);
    }
    
    // 3. Fallbacks using two elements
    if (cleanLoc && cleanCountry) {
        queries.push(cleanLoc + ', ' + cleanCountry);
    }
    if (cleanForm && cleanCountry) {
        queries.push(cleanForm + ', ' + cleanCountry);
    }
    if (cleanForm && cleanLoc) {
        queries.push(cleanForm + ', ' + cleanLoc);
    }
    
    // 4. Injected region fallback
    if (injectedRegion && injectedCountry) {
        queries.push(injectedRegion + ', ' + injectedCountry);
    }

    // 5. Individual terms
    if (cleanLoc) {
        queries.push(cleanLoc);
    }
    if (cleanForm) {
        queries.push(cleanForm);
    }
    if (cleanCountry) {
        queries.push(cleanCountry);
    }
    
    return queries.filter(function(q, index) {
        return queries.indexOf(q) === index && q.trim().length > 0;
    });
}

function trySmartGeocode(queries, index, onSuccess, onFailure) {
    if (index >= queries.length) {
        onFailure();
        return;
    }
    
    var query = queries[index];
    var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&email=fossilarchiveapp@gmail.com';
    
    fetch(url, { headers: { 'Accept': 'application/json' } })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data && data.length > 0) {
                onSuccess(data[0], query);
            } else {
                setTimeout(function() {
                    trySmartGeocode(queries, index + 1, onSuccess, onFailure);
                }, 1300);
            }
        })
        .catch(function(err) {
            console.error('Geocoding error for query: ' + query, err);
            setTimeout(function() {
                trySmartGeocode(queries, index + 1, onSuccess, onFailure);
            }, 1300);
        });
}

async function fetchSmartCoordinates(location, formation, country) {
    var queries = getSmartGeocodeQueries(location, formation, country);
    if (queries.length === 0) return null;
    
    for (var i = 0; i < queries.length; i++) {
        var query = queries[i];
        try {
            var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&email=fossilarchiveapp@gmail.com';
            var response = await fetch(url, { headers: { 'Accept': 'application/json' } });
            var data = await response.json();
            
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    query: query
                };
            }
        } catch (err) {
            console.error('Batch geocoding error for query: ' + query, err);
        }
        
        // Strict 1300ms delay between fallbacks to respect Nominatim limits
        if (i < queries.length - 1) {
            await new Promise(function(resolve) { setTimeout(resolve, 1300); });
        }
    }
    return null;
}

// =========================================================================
// APP METHODS — attached to window.app for inline HTML handlers
// =========================================================================
window.app = {

    isVideo: function(imgSrc) {
        if (!imgSrc) return false;
        return imgSrc.startsWith('data:video/') || 
               imgSrc.toLowerCase().endsWith('.mp4') || 
               imgSrc.toLowerCase().endsWith('.webm') || 
               imgSrc.toLowerCase().endsWith('.mov');
    },

    // --- Modal Tab Sizing & Switching ---
    setModalTab: function(tabName) {
        var tabs = ['classification', 'geology', 'curator'];
        var slider = document.getElementById('tab-slider-wrapper');
        var tabIndex = tabs.indexOf(tabName);
        
        if (slider && tabIndex !== -1) {
            slider.style.transform = 'translateX(' + (-tabIndex * (100 / 3)) + '%)';
        }

        tabs.forEach(function(t) {
            var btn = document.getElementById('tab-btn-' + t);
            var content = document.getElementById('tab-' + t);
            if (t === tabName) {
                if (btn) {
                    btn.classList.add('active');
                    btn.style.borderBottom = '2px solid var(--accent)';
                    btn.style.color = 'var(--text-primary)';
                }
                if (content) {
                    content.classList.add('active');
                }
            } else {
                if (btn) {
                    btn.classList.remove('active');
                    btn.style.borderBottom = '2px solid transparent';
                    btn.style.color = 'var(--text-secondary)';
                }
                if (content) {
                    content.classList.remove('active');
                }
            }
        });
    },

    // --- Notifications ---
    showToast: function(msg, type, duration) {
        showToast(msg, type, duration);
    },

    toggleSalePriceField: function() {
        var wishlistSelect = document.getElementById('f-wishlist');
        var salePriceGroup = document.getElementById('group-sale-price');
        if (wishlistSelect && salePriceGroup) {
            var labelEl = salePriceGroup.querySelector('label');
            if (wishlistSelect.value === 'sold') {
                salePriceGroup.style.display = 'block';
                if (labelEl) labelEl.innerHTML = 'Sale Price <span class="required-asterisk">*</span>';
            } else if (wishlistSelect.value === 'sale') {
                salePriceGroup.style.display = 'block';
                if (labelEl) labelEl.innerHTML = 'Asking Price <span class="required-asterisk">*</span>';
            } else {
                salePriceGroup.style.display = 'none';
            }
        }
    },

    markAsSoldQuick: function(id, specimen) {
        var priceInput = prompt('Enter sale price for "' + specimen + '" (leave blank if unknown):');
        if (priceInput === null) return; // user cancelled
        
        var price = parseFloat(priceInput) || null;
        var currency = 'USD';
        if (price !== null) {
            var currInput = prompt('Enter currency (USD, EUR, SEK):', 'USD');
            if (currInput) currency = currInput.toUpperCase();
        }
        
        var f = fossils.find(function(x) { return x.id === id; });
        if (f) {
            f.isSold = true;
            f.salePrice = price;
            f.saleCurrency = currency;
            updateFossil(f).then(function() {
                window.app.showToast('"' + specimen + '" marked as sold.', 'success');
                window.app.renderFossils();
            });
        }
    },

    restoreToCollectionQuick: function(id, specimen) {
        if (confirm('Are you sure you want to restore "' + specimen + '" back to your active collection?')) {
            var f = fossils.find(function(x) { return x.id === id; });
            if (f) {
                f.isSold = false;
                updateFossil(f).then(function() {
                    window.app.showToast('"' + specimen + '" restored to collection.', 'success');
                    window.app.renderFossils();
                });
            }
        }
    },

    // --- Theme ---
    toggleTheme: function() {
        var current = document.documentElement.getAttribute('data-theme');
        var icon = document.getElementById('theme-icon');
        if (current === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('oceanic_theme', 'light');
            if (icon) icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('oceanic_theme', 'dark');
            if (icon) icon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
        }

        if (leafletMapInstance && leafletActiveTileLayer) {
            leafletMapInstance.removeLayer(leafletActiveTileLayer);
            var isDarkNow = document.documentElement.getAttribute('data-theme') === 'dark';
            var newTileUrl = isDarkNow ? 
                'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' :
                'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
            var attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
            leafletActiveTileLayer = L.tileLayer(newTileUrl, {
                attribution: attribution,
                maxZoom: 20
            });
            leafletActiveTileLayer.addTo(leafletMapInstance);
        }
    },

    // --- Lightbox ---
    openLightbox: function(fossilId, imgIndex) {
        if (comparePickerModeActive) {
            var cardEl = document.querySelector('.fossil-card[data-id="' + fossilId + '"]');
            if (cardEl) {
                var cb = cardEl.querySelector('.checkbox-container input[type="checkbox"]');
                if (cb) {
                    cb.checked = !cb.checked;
                    var evt = document.createEvent('HTMLEvents');
                    evt.initEvent('change', true, true);
                    cb.dispatchEvent(evt);
                }
            }
            return;
        }
        var f = fossils.find(function(x) { return x.id === fossilId; });
        if (!f || !f.images || f.images.length === 0) return;
        lightboxFossilId = fossilId;
        lightboxIdx = imgIndex || 0;

        var overlay = document.getElementById('lightbox');
        var img = document.getElementById('lightbox-img');
        var vid = document.getElementById('lightbox-video');
        var title = document.getElementById('lightbox-title');
        var detail = document.getElementById('lightbox-detail');
        var loc = document.getElementById('lightbox-location');
        var counter = document.getElementById('lightbox-counter');

        var isVid = window.app.isVideo(f.images[lightboxIdx]);
        if (isVid) {
            img.style.display = 'none';
            if (vid) {
                vid.style.display = 'block';
                vid.src = f.images[lightboxIdx];
                vid.play().catch(function(e) { console.log("Video auto play blocked: ", e); });
                vid.onclick = function() {
                    window.app.openZoomOverlay(vid.src);
                };
            }
        } else {
            if (vid) {
                vid.pause();
                vid.style.display = 'none';
            }
            img.style.display = '';
            img.src = f.images[lightboxIdx];
            img.style.cursor = 'zoom-in';
            img.onclick = function() {
                window.app.openZoomOverlay(img.src);
            };
        }
        img.classList.toggle('enhanced-photo', isAutoEnhanceActive);

        var lightboxBtn = document.getElementById('lightbox-auto-enhance');
        if (lightboxBtn) {
            lightboxBtn.style.color = isAutoEnhanceActive ? '#e6a817' : 'var(--text-primary)';
            lightboxBtn.style.textShadow = isAutoEnhanceActive ? '0 0 8px rgba(230,168,23,0.6)' : 'none';
        }

        title.textContent = f.specimen || 'Unknown Specimen';

        var detailParts = [];
        if (f.category) detailParts.push(f.category);
        if (f.geologicalPeriod) detailParts.push(f.geologicalPeriod);
        if (f.epoch) detailParts.push(f.epoch);
        if (f.ageMa) detailParts.push('~' + f.ageMa + ' Ma');
        if (f.anatomy) detailParts.push('⚡ ' + f.anatomy);
        detail.textContent = detailParts.join(' · ');

        var locParts = [];
        if (f.location) locParts.push(f.location);
        if (f.country) locParts.push(f.country);
        if (f.formation) locParts.push(f.formation);
        loc.textContent = locParts.length > 0 ? '📍 ' + locParts.join(', ') : '';

        if (f.images.length > 1) {
            var label = '';
            if (lightboxIdx === 0) label = ' (Fossil Specimen)';
            else if (lightboxIdx === 1) label = ' (Life Reconstruction)';
            counter.textContent = 'Photo ' + (lightboxIdx + 1) + ' of ' + f.images.length + label;
        } else {
            counter.textContent = '';
        }

        // Show/hide within-fossil nav arrows
        var prevBtn = overlay.querySelector('.lightbox-nav.prev');
        var nextBtn = overlay.querySelector('.lightbox-nav.next');
        prevBtn.style.display = f.images.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = f.images.length > 1 ? 'flex' : 'none';

        // Render fossil carousel strip
        window.app._renderLightboxCarousel();

        // Render geological timeline ruler
        var rulerElem = document.getElementById('lightbox-timeline-ruler');
        if (rulerElem) {
            var period = (f.geologicalPeriod || '').trim();
            if (period && period.toLowerCase() !== 'unknown') {
                var ERAS = [
                    { name: 'Precambrian', periods: ['Precambrian'], color: '#4a5568' },
                    { name: 'Paleozoic', periods: ['Cambrian', 'Ordovician', 'Silurian', 'Devonian', 'Carboniferous', 'Permian'], color: '#2b6cb0' },
                    { name: 'Mesozoic', periods: ['Triassic', 'Jurassic', 'Cretaceous'], color: '#dd6b20' },
                    { name: 'Cenozoic', periods: ['Paleogene', 'Neogene', 'Quaternary'], color: '#319795' }
                ];
                
                var activeEraIndex = -1;
                var activePeriodIndex = -1;
                for (var e = 0; e < ERAS.length; e++) {
                    var eraPer = ERAS[e].periods;
                    for (var p = 0; p < eraPer.length; p++) {
                        if (eraPer[p].toLowerCase() === period.toLowerCase()) {
                            activeEraIndex = e;
                            activePeriodIndex = p;
                            break;
                        }
                    }
                    if (activeEraIndex !== -1) break;
                }
                
                if (activeEraIndex !== -1) {
                    var timelineHtml = '<div style="font-size: 0.75rem; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 4px;">' +
                                       '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg> Geological Deep-Time Ruler</div>' +
                                       '<div class="timeline-ruler" style="display: flex; height: 16px; border-radius: 9999px; overflow: hidden; background: var(--bg-warm); border: 1px solid var(--border-color); position: relative;">';
                    
                    for (var e = 0; e < ERAS.length; e++) {
                        var era = ERAS[e];
                        var isCurrentEra = (e === activeEraIndex);
                        var eraWeight = era.periods.length;
                        
                        timelineHtml += '<div style="flex: ' + eraWeight + '; background: ' + era.color + '; opacity: ' + (isCurrentEra ? '0.9' : '0.25') + '; height: 100%; position: relative;" title="' + era.name + ' Era">';
                        if (isCurrentEra) {
                            var stepPercent = Math.round((activePeriodIndex / eraWeight) * 100) + Math.round((0.5 / eraWeight) * 100);
                            timelineHtml += '<div style="position: absolute; left: ' + stepPercent + '%; top: 50%; transform: translate(-50%, -50%); width: 10px; height: 10px; border-radius: 50%; background: #ffffff; border: 2px solid var(--accent); box-shadow: 0 0 6px rgba(255,255,255,0.8); z-index: 10;"></div>';
                        }
                        timelineHtml += '</div>';
                    }
                    timelineHtml += '</div>' +
                                   '<div style="display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--text-secondary); margin-top: 0.4rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">' +
                                       '<span>Precambrian</span>' +
                                       '<span style="color: ' + (activeEraIndex === 1 ? 'var(--text-primary)' : 'inherit') + ';">Paleozoic</span>' +
                                       '<span style="color: ' + (activeEraIndex === 2 ? 'var(--text-primary)' : 'inherit') + ';">Mesozoic</span>' +
                                       '<span style="color: ' + (activeEraIndex === 3 ? 'var(--text-primary)' : 'inherit') + ';">Cenozoic</span>' +
                                   '</div>' +
                                   '<div style="font-size: 0.75rem; text-align: center; margin-top: 0.5rem; font-weight: 600; color: var(--text-primary);">Geologic Period: <span style="color: var(--accent); font-weight: 800;">' + escapeHtml(period) + '</span> (' + ERAS[activeEraIndex].name + ' Era)</div>';
                    
                    rulerElem.innerHTML = timelineHtml;
                    rulerElem.style.display = '';
                } else {
                    rulerElem.style.display = 'none';
                }
            } else {
                rulerElem.style.display = 'none';
            }
        }

        // Render curatorial details (Size, Weight, Price, Condition, Notes)
        var curatorElem = document.getElementById('lightbox-curator-details');
        if (curatorElem) {
            var curHtml = '';
            var curParts = [];
            if (f.size) curParts.push('📏 <strong>Size:</strong> ' + formatSpecimenDimensions(f));
            if (f.weight) curParts.push('⚖️ <strong>Weight:</strong> ' + formatSpecimenWeight(f.weight));
            if (f.isSold && f.salePrice > 0) {
                curParts.push('💰 <strong>Sold Price:</strong> ' + f.salePrice + ' ' + (f.saleCurrency || 'USD'));
            } else if (f.isForSale && f.salePrice > 0) {
                curParts.push('🏷️ <strong>Asking Price:</strong> ' + f.salePrice + ' ' + (f.saleCurrency || 'USD'));
            } else if (f.price && !f.isWishlist) {
                curParts.push('💰 <strong>Value:</strong> ' + f.price + ' ' + (f.currency || 'USD'));
            }
            if (f.fossilType) curParts.push('🦕 <strong>Fossil Type:</strong> ' + escapeHtml(f.fossilType));
            
            // Condition mapping
            var cond = f.condition || {};
            var condLabels = [];
            if (cond.stable || (!cond.cracking && !cond.efflorescence && !cond.pyrite)) condLabels.push('🟢 Stable');
            if (cond.cracking) condLabels.push('⚡ Cracking');
            if (cond.efflorescence) condLabels.push('⚪ Efflorescence');
            if (cond.pyrite) condLabels.push('🔥 Pyrite Decay');
            
            if (condLabels.length > 0) {
                var tierBadge = f.conditionTier ? getConditionTierBadgeHtml(f.conditionTier) : '';
                curParts.push('🩺 <strong>Condition:</strong> ' + condLabels.join(', ') + tierBadge);
            }
            
            // Treatment mapping
            var treat = f.treatment || {};
            var treatLabels = [];
            if (treat.paraloid) treatLabels.push('🧪 Consolidated (Paraloid B-72)');
            if (treat.scribe) treatLabels.push('⛏️ Cleaned (Air Scribe)');
            if (treat.cyano) treatLabels.push('💧 Glued (Cyanoacrylate)');
            if (treat.water) treatLabels.push('🛡️ Stabilized (B-67/PVA/PEG)');
            
            if (treatLabels.length > 0) {
                curParts.push('🛠️ <strong>Treatments Applied:</strong> ' + treatLabels.join(', '));
            }
            
            if (f.restorationDetails) {
                curParts.push('✨ <strong>Restoration Details:</strong> ' + escapeHtml(f.restorationDetails));
            }
            
            if (f.notes) {
                curParts.push('📝 <strong>Curation Notes:</strong> ' + escapeHtml(f.notes));
            }
            
            if (curParts.length > 0) {
                curHtml = '<div style="font-size: 0.75rem; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 4px;">' +
                           '🔬 Curatorial & Preservation Records</div>' +
                           '<div style="font-size: 0.8rem; line-height: 1.6; display: flex; flex-direction: column; gap: 0.4rem; color: var(--text-primary);">';
                curParts.forEach(function(part) {
                    curHtml += '<div>' + part + '</div>';
                });
                curHtml += '</div>';
                
                // Add Copy Sales Description button
                curHtml += '<button class="btn-primary" onclick="app.copyListingDescription(\'' + f.id + '\')" style="margin-top: 1rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--accent); color: var(--bg-surface); font-weight: 700; padding: 0.55rem; border-radius: var(--radius-sm); border: none; cursor: pointer; font-size: 0.75rem; transition: transform 0.1s ease;" onmousedown="this.style.transform=\'scale(0.98)\'" onmouseup="this.style.transform=\'scale(1)\'">' +
                           '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>' +
                           '📋 Copy Sales Description' +
                           '</button>';

                // Add Paleo Deep Dive button
                curHtml += '<button class="btn-primary" onclick="app.closeLightbox(); app.openDeepDive(\'' + f.id + '\')" style="margin-top: 0.5rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: linear-gradient(135deg, #2a52be, #319795); color: #ffffff; font-weight: 700; padding: 0.55rem; border-radius: var(--radius-sm); border: none; cursor: pointer; font-size: 0.75rem; transition: transform 0.1s ease; box-shadow: 0 4px 12px rgba(49, 151, 149, 0.2);" onmousedown="this.style.transform=\'scale(0.98)\'" onmouseup="this.style.transform=\'scale(1)\'">' +
                           '🦕 Paleo Deep Dive' +
                           '</button>';

                curatorElem.innerHTML = curHtml;
                curatorElem.style.display = '';
            } else {
                curatorElem.style.display = 'none';
            }
        }

        // Render prehistoric biology / animal description details
        var biologyElem = document.getElementById('lightbox-biology-details');
        if (biologyElem) {
            var bioHtml = '';
            var bioParts = [];
            if (f.authority) {
                bioParts.push('🧬 <strong>Taxonomic Authority:</strong> ' + escapeHtml(f.authority));
            }
            if (f.description) {
                bioParts.push('📖 <strong>Paleo-Biology & History:</strong> <span style="font-style: italic; display: block; margin-top: 0.25rem; line-height: 1.4; color: var(--text-secondary);">' + escapeHtml(f.description) + '</span>');
            }
            
            if (bioParts.length > 0) {
                bioHtml = '<div style="font-size: 0.75rem; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 4px;">' +
                           '🦕 Prehistoric Biology & Classification</div>' +
                           '<div style="font-size: 0.8rem; line-height: 1.6; display: flex; flex-direction: column; gap: 0.5rem; color: var(--text-primary);">';
                bioParts.forEach(function(part) {
                    bioHtml += '<div>' + part + '</div>';
                });
                bioHtml += '</div>';
                
                biologyElem.innerHTML = bioHtml;
                biologyElem.style.display = '';
            } else {
                biologyElem.style.display = 'none';
            }
        }

        // Render prehistoric co-existence finder
        var coexElem = document.getElementById('lightbox-coexistence');
        if (coexElem) {
            var period = (f.geologicalPeriod || '').trim();
            var coexisting = [];
            if (period && period.toLowerCase() !== 'unknown') {
                coexisting = fossils.filter(function(x) {
                    return x.id !== fossilId && 
                           !x.isWishlist && 
                           !x.isSold && 
                           (x.geologicalPeriod || '').trim().toLowerCase() === period.toLowerCase();
                });
            }
            
            if (coexisting.length > 0) {
                var coexHtml = '<div style="font-size: 0.75rem; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 4px;">' +
                               '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg> Prehistoric Co-existence Finder</div>' +
                               '<div style="font-size: 0.8rem; opacity: 0.8; margin-bottom: 0.5rem;">Specimens in your collection from the <strong>' + escapeHtml(period) + '</strong>:</div>' +
                               '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; max-height: 80px; overflow-y: auto; padding-right: 0.25rem;">';
                
                coexisting.forEach(function(cx) {
                    var name = escapeHtml(cx.specimen || 'Unknown');
                    var catEmoji = '🦴';
                    if (cx.category) {
                        var catLower = cx.category.toLowerCase();
                        if (catLower.indexOf('tooth') !== -1 || catLower.indexOf('teeth') !== -1) catEmoji = '🦷';
                        else if (catLower.indexOf('dinosaur') !== -1 || catLower.indexOf('reptile') !== -1) catEmoji = '🦖';
                        else if (catLower.indexOf('plant') !== -1 || catLower.indexOf('flora') !== -1) catEmoji = '🌿';
                        else if (catLower.indexOf('ammonite') !== -1 || catLower.indexOf('shell') !== -1) catEmoji = '🐚';
                        else if (catLower.indexOf('fish') !== -1 || catLower.indexOf('shark') !== -1) catEmoji = '🐟';
                    }
                    coexHtml += '<span class="tag-pill" style="cursor: pointer; background: var(--bg-surface); border: 1px solid var(--border-color); display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; margin: 0; padding: 0.2rem 0.5rem; border-radius: 4px;" onclick="app.openLightbox(\'' + cx.id + '\', 0)">' + catEmoji + ' ' + name + '</span>';
                });
                coexHtml += '</div>';
                coexElem.innerHTML = coexHtml;
                coexElem.style.display = '';
            } else {
                coexElem.style.display = 'none';
            }
        }

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    // Render the inter-fossil carousel strip
    _renderLightboxCarousel: function() {
        var strip = document.getElementById('lightbox-fossil-strip');
        var fossilNavPrev = document.getElementById('lightbox-fossil-prev');
        var fossilNavNext = document.getElementById('lightbox-fossil-next');
        var fossilPos = document.getElementById('lightbox-fossil-pos');
        if (!strip) return;

        var list = lightboxFilteredList;
        if (!list || list.length === 0) {
            strip.style.display = 'none';
            if (fossilNavPrev) fossilNavPrev.style.display = 'none';
            if (fossilNavNext) fossilNavNext.style.display = 'none';
            return;
        }

        var currentIdx = -1;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === lightboxFossilId) { currentIdx = i; break; }
        }
        if (currentIdx === -1) { strip.style.display = 'none'; return; }

        // Update fossil position indicator
        if (fossilPos) {
            fossilPos.textContent = (currentIdx + 1) + ' / ' + list.length;
        }

        // Show/hide fossil nav arrows
        var showFossilNav = list.length > 1;
        if (fossilNavPrev) fossilNavPrev.style.display = showFossilNav ? 'flex' : 'none';
        if (fossilNavNext) fossilNavNext.style.display = showFossilNav ? 'flex' : 'none';

        // Build carousel: show up to 5 fossils centered on current
        var VISIBLE = 5;
        var half = Math.floor(VISIBLE / 2);
        var items = [];
        for (var j = -half; j <= half; j++) {
            var idx = currentIdx + j;
            if (idx < 0 || idx >= list.length) {
                items.push(null);
            } else {
                items.push({ fossil: list[idx], offset: j });
            }
        }

        var html = '';
        items.forEach(function(item) {
            if (!item) {
                html += '<div class="lb-strip-slot lb-strip-empty"></div>';
                return;
            }
            var fo = item.fossil;
            var isCurrent = (item.offset === 0);
            var thumb = (fo.images && fo.images.length > 0) ? fo.images[0] : null;
            var cls = 'lb-strip-slot' + (isCurrent ? ' lb-strip-current' : '');
            var onclick = isCurrent ? '' : 'onclick="app.openLightbox(\'' + fo.id + '\', 0)"';
            html += '<div class="' + cls + '" ' + onclick + ' title="' + escapeHtml(fo.specimen || '') + '">';
            if (thumb) {
                var imgCls = isAutoEnhanceActive ? 'class="enhanced-photo"' : '';
                var isVid = window.app.isVideo(thumb);
                if (isVid) {
                    html += '<video src="' + thumb + '" style="width: 100%; height: 100%; object-fit: cover;" muted autoplay loop playsinline></video>';
                } else {
                    html += '<img src="' + thumb + '" ' + imgCls + ' alt="' + escapeHtml(fo.specimen || '') + '" loading="lazy">';
                }
            } else {
                html += '<div class="lb-strip-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>';
            }
            if (isCurrent) {
                html += '<div class="lb-strip-label">' + escapeHtml(fo.specimen || 'Unknown') + '</div>';
            }
            html += '</div>';
        });

        strip.innerHTML = html;
        strip.style.display = 'flex';
    },

    // Navigate to the previous/next fossil in the filtered list
    lightboxFossilNav: function(dir) {
        if (!lightboxFossilId || !lightboxFilteredList || lightboxFilteredList.length < 2) return;
        var currentIdx = -1;
        for (var i = 0; i < lightboxFilteredList.length; i++) {
            if (lightboxFilteredList[i].id === lightboxFossilId) { currentIdx = i; break; }
        }
        if (currentIdx === -1) return;
        var nextIdx = (currentIdx + dir + lightboxFilteredList.length) % lightboxFilteredList.length;
        var nextFossil = lightboxFilteredList[nextIdx];
        if (!nextFossil || !nextFossil.images || nextFossil.images.length === 0) {
            // Fossil has no images — still navigate but handle gracefully
            lightboxFossilId = nextFossil.id;
            lightboxIdx = 0;
            var img = document.getElementById('lightbox-img');
            var vid = document.getElementById('lightbox-video');
            if (vid) {
                vid.pause();
                vid.style.display = 'none';
            }
            var title = document.getElementById('lightbox-title');
            var counter = document.getElementById('lightbox-counter');
            var detail = document.getElementById('lightbox-detail');
            var loc = document.getElementById('lightbox-location');
            img.src = '';
            img.style.display = 'none';
            title.textContent = nextFossil.specimen || 'Unknown Specimen';
            var detailParts = [];
            if (nextFossil.category) detailParts.push(nextFossil.category);
            if (nextFossil.geologicalPeriod) detailParts.push(nextFossil.geologicalPeriod);
            detail.textContent = detailParts.join(' · ');
            var locParts = [];
            if (nextFossil.location) locParts.push(nextFossil.location);
            if (nextFossil.country) locParts.push(nextFossil.country);
            loc.textContent = locParts.length > 0 ? '📍 ' + locParts.join(', ') : '';
            counter.textContent = 'No photos';
            var overlay = document.getElementById('lightbox');
            var prevBtn = overlay.querySelector('.lightbox-nav.prev');
            var nextBtn = overlay.querySelector('.lightbox-nav.next');
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            window.app._renderLightboxCarousel();
            return;
        }
        window.app.openLightbox(nextFossil.id, 0);
    },

    closeLightbox: function() {
        var overlay = document.getElementById('lightbox');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        lightboxFossilId = null;
        var vid = document.getElementById('lightbox-video');
        if (vid) {
            vid.pause();
        }
    },

    openZoomOverlay: function(src) {
        var zoomOverlay = document.getElementById('zoom-overlay');
        var zoomImg = document.getElementById('zoom-overlay-img');
        var zoomVid = document.getElementById('zoom-overlay-video');
        if (zoomOverlay && zoomImg && zoomVid) {
            var isVid = window.app.isVideo(src);
            if (isVid) {
                zoomImg.style.display = 'none';
                zoomVid.style.display = 'block';
                zoomVid.src = src;
                zoomVid.play().catch(function(e) { console.log(e); });
            } else {
                zoomVid.pause();
                zoomVid.style.display = 'none';
                zoomImg.style.display = 'block';
                zoomImg.src = src;
            }
            zoomOverlay.style.display = 'flex';
            // Trigger reflow for transition
            void zoomOverlay.offsetWidth;
            zoomOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeZoomOverlay: function() {
        var zoomOverlay = document.getElementById('zoom-overlay');
        var zoomVid = document.getElementById('zoom-overlay-video');
        if (zoomVid) {
            zoomVid.pause();
        }
        if (zoomOverlay) {
            zoomOverlay.classList.remove('active');
            if (window.app._zoomTimeout) {
                clearTimeout(window.app._zoomTimeout);
            }
            window.app._zoomTimeout = setTimeout(function() {
                if (!zoomOverlay.classList.contains('active')) {
                    zoomOverlay.style.display = 'none';
                }
            }, 300); // matches transition
            // Restore hidden body overflow only if lightbox is active
            var lightbox = document.getElementById('lightbox');
            if (lightbox && lightbox.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    },

    enterShowcaseMode: function() {
        if (!lightboxFilteredList || lightboxFilteredList.length === 0) {
            window.app.showToast('No specimens in the current view to showcase.', 'warning');
            return;
        }
        
        var menu = document.getElementById('enrich-dropdown');
        if (menu) menu.style.display = 'none';

        isShowcaseActive = true;
        showcaseList = lightboxFilteredList.slice();
        showcaseIndex = 0;
        showcasePlayActive = true;

        var overlay = document.getElementById('showcase-mode');
        if (overlay) {
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Close other overlays just in case
            var lightbox = document.getElementById('lightbox');
            if (lightbox) lightbox.classList.remove('active');
            var modal = document.getElementById('fossil-modal');
            if (modal) modal.close();
            var zoomOverlay = document.getElementById('zoom-overlay');
            if (zoomOverlay) zoomOverlay.classList.remove('active');

            window.app.renderShowcaseSpecimen();
        }
    },

    exitShowcaseMode: function() {
        isShowcaseActive = false;
        if (showcaseIntervalId) {
            clearInterval(showcaseIntervalId);
            showcaseIntervalId = null;
        }
        var overlay = document.getElementById('showcase-mode');
        if (overlay) {
            overlay.style.display = 'none';
        }
        document.body.style.overflow = '';
        var showcaseVid = document.getElementById('showcase-video');
        if (showcaseVid) {
            showcaseVid.pause();
        }
    },

    renderShowcaseSpecimen: function() {
        if (!showcaseList || showcaseList.length === 0) return;
        var f = showcaseList[showcaseIndex];
        if (!f) return;

        var img = document.getElementById('showcase-img');
        var title = document.getElementById('showcase-title');
        var catTag = document.getElementById('showcase-category-tag');
        var subtitles = document.getElementById('showcase-subtitles');
        var indexText = document.getElementById('showcase-index-text');
        
        var metaPeriod = document.getElementById('showcase-meta-period');
        var metaOrigin = document.getElementById('showcase-meta-origin');
        var metaAnatomy = document.getElementById('showcase-meta-anatomy');
        var metaNotes = document.getElementById('showcase-meta-notes');

        // Populate Image & Video (with fallback)
        var vid = document.getElementById('showcase-video');
        var hasMedia = f.images && f.images.length > 0;
        var mediaSrc = hasMedia ? f.images[0] : 'img/placeholder.png';
        var isVid = hasMedia ? window.app.isVideo(mediaSrc) : false;

        if (img && vid) {
            img.style.opacity = '0';
            vid.style.opacity = '0';
            setTimeout(function() {
                if (isVid) {
                    img.style.display = 'none';
                    vid.style.display = 'block';
                    vid.src = mediaSrc;
                    vid.play().catch(function(e) { console.log(e); });
                    vid.style.opacity = '1';
                } else {
                    vid.pause();
                    vid.style.display = 'none';
                    img.style.display = 'block';
                    img.src = mediaSrc;
                    img.classList.toggle('enhanced-photo', isAutoEnhanceActive);
                    img.style.opacity = '1';
                }
            }, 150);
        }

        // Title & Category Badge
        if (title) title.textContent = f.specimen || 'Unknown Specimen';
        if (catTag) {
            catTag.textContent = f.category || 'Specimen';
            catTag.className = 'showcase-info-badge ' + (f.category ? f.category.toLowerCase().replace(/[\s()]/g, '-') : '');
        }

        // Subtitles (Epoch, Age, Part)
        if (subtitles) {
            var subParts = [];
            if (f.epoch) subParts.push(f.epoch);
            if (f.ageMa) subParts.push('~' + f.ageMa + ' Ma');
            if (f.anatomy) subParts.push(f.anatomy);
            subtitles.textContent = subParts.join(' · ');
        }

        // Counter (Index)
        if (indexText) {
            indexText.textContent = 'Specimen ' + (showcaseIndex + 1) + ' of ' + showcaseList.length;
        }

        // Geological Timeline
        if (metaPeriod) {
            var timelineParts = [];
            if (f.geologicalPeriod) timelineParts.push(f.geologicalPeriod);
            metaPeriod.textContent = timelineParts.length > 0 ? timelineParts.join(', ') : 'Unknown Era / Period';
        }

        // Formation / Origin
        if (metaOrigin) {
            var originParts = [];
            if (f.formation) originParts.push(f.formation);
            if (f.country) originParts.push((f.location ? f.location + ', ' : '') + f.country);
            metaOrigin.innerHTML = originParts.length > 0 ? '📍 ' + originParts.join(' · ') : 'Unknown Locality / Formation';
        }

        // Dimensions
        if (metaAnatomy) {
            var dimParts = [];
            if (f.size) dimParts.push('Size: ' + formatSpecimenDimensions(f));
            if (f.weight) dimParts.push('Weight: ' + formatSpecimenWeight(f.weight));
            metaAnatomy.textContent = dimParts.length > 0 ? dimParts.join(' · ') : 'Dimensions not recorded';
        }

        // Notes
        if (metaNotes) {
            metaNotes.textContent = f.notes ? f.notes : 'No curatorial notes recorded for this specimen.';
        }

        // Condition in Showcase
        var metaCondition = document.getElementById('showcase-meta-condition');
        if (metaCondition) {
            var cond = f.condition || {};
            var condLabels = [];
            if (cond.stable || (!cond.cracking && !cond.efflorescence && !cond.pyrite)) condLabels.push('🟢 Stable');
            if (cond.cracking) condLabels.push('⚡ Cracking');
            if (cond.efflorescence) condLabels.push('⚪ Efflorescence');
            if (cond.pyrite) condLabels.push('🔥 Pyrite Decay');
            
            var condText = condLabels.length > 0 ? condLabels.join(', ') : '🟢 Stable';
            
            // Append treatments if present
            var treat = f.treatment || {};
            var treatLabels = [];
            if (treat.paraloid) treatLabels.push('B-72');
            if (treat.scribe) treatLabels.push('Scribed');
            if (treat.cyano) treatLabels.push('Glued');
            if (treat.water) treatLabels.push('Stabilized');
            
            if (treatLabels.length > 0) {
                condText += ' (Prepared: ' + treatLabels.join(', ') + ')';
            }
            
            metaCondition.textContent = condText;
        }

        // Trigger Auto-Play progress bar
        window.app._runShowcaseProgressBar();
    },

    showcaseNav: function(dir) {
        if (!showcaseList || showcaseList.length <= 1) return;
        showcaseIndex = (showcaseIndex + dir + showcaseList.length) % showcaseList.length;
        window.app.renderShowcaseSpecimen();
    },

    toggleShowcasePlay: function() {
        showcasePlayActive = !showcasePlayActive;
        var btn = document.getElementById('showcase-play-btn');
        if (btn) {
            btn.innerHTML = showcasePlayActive ? '⏸️ Pause' : '▶️ Play';
            btn.className = 'showcase-action-btn play-btn' + (showcasePlayActive ? '' : ' paused');
        }
        window.app._runShowcaseProgressBar();
    },

    _runShowcaseProgressBar: function() {
        if (showcaseIntervalId) {
            clearInterval(showcaseIntervalId);
            showcaseIntervalId = null;
        }

        var bar = document.getElementById('showcase-progress-bar');
        if (!bar) return;

        // Reset transition and width
        bar.style.transition = 'none';
        bar.style.width = '0%';

        if (!showcasePlayActive || showcaseList.length <= 1) {
            return;
        }

        // Trigger reflow
        void bar.offsetWidth;

        // Animate width to 100% over 6 seconds
        bar.style.transition = 'width 6000ms linear';
        bar.style.width = '100%';

        // Set interval to navigate next after 6 seconds
        showcaseIntervalId = setInterval(function() {
            window.app.showcaseNav(1);
        }, 6000);
    },

    lightboxNav: function(dir) {
        if (!lightboxFossilId) return;
        var f = fossils.find(function(x) { return x.id === lightboxFossilId; });
        if (!f || !f.images || f.images.length <= 1) return;
        lightboxIdx = (lightboxIdx + dir + f.images.length) % f.images.length;
        
        var img = document.getElementById('lightbox-img');
        var vid = document.getElementById('lightbox-video');
        var isVid = window.app.isVideo(f.images[lightboxIdx]);
        
        if (isVid) {
            img.style.display = 'none';
            if (vid) {
                vid.style.display = 'block';
                vid.src = f.images[lightboxIdx];
                vid.play().catch(function(e) { console.log(e); });
                vid.onclick = function() {
                    window.app.openZoomOverlay(vid.src);
                };
            }
        } else {
            if (vid) {
                vid.pause();
                vid.style.display = 'none';
            }
            img.style.display = '';
            img.src = f.images[lightboxIdx];
            img.onclick = function() {
                window.app.openZoomOverlay(img.src);
            };
        }
        
        var label = '';
        if (lightboxIdx === 0) label = ' (Fossil Specimen)';
        else if (lightboxIdx === 1) label = ' (Life Reconstruction)';
        document.getElementById('lightbox-counter').textContent = 'Photo ' + (lightboxIdx + 1) + ' of ' + f.images.length + label;
    },

    // --- Taxonomy ---
    toggleTaxonomy: function(id) {
        var f = fossils.find(function(x) { return x.id === id; });
        if (!f) return;
        
        var card = document.querySelector('[data-id="' + id + '"]');
        var tray = card.querySelector('.taxonomy-tray');
        var btn = card.querySelector('.btn-taxonomy');
        
        if (expandedTaxonomyIds.has(id)) {
            expandedTaxonomyIds.delete(id);
            tray.classList.remove('active');
            btn.classList.remove('active');
            return;
        }
        
        expandedTaxonomyIds.add(id);
        
        // If we already have the data, just show it
        if (f.taxonomy) {
            tray.classList.add('active');
            btn.classList.add('active');
            return;
        }
        
        // Otherwise, fetch it
        btn.classList.add('loading');
        fetchTaxonomyData(f.specimen)
            .then(function(taxonomy) {
                f.taxonomy = taxonomy;
                return updateFossil(f);
            })
            .then(function() {
                btn.classList.remove('loading');
                window.app.renderFossils(); 
            })
            .catch(function(err) {
                console.error("fetchTaxonomy Error:", err);
                // Fail gracefully: stop loading but don't crash
                document.getElementById('fetch-loader').style.display = 'none';
                if (window.app && window.app.showToast) {
                    window.app.showToast("Taxonomy fetch failed. Check network.", 3000);
                }
            });
    },

    // --- Dashboard ---
    toggleStats: function() {
        isStatsOpen = !isStatsOpen;
        var container = document.getElementById('stats-summary');
        if (container) {
            container.style.display = isStatsOpen && fossils.length > 0 ? 'flex' : 'none';
        }
        
        // Handle both mobile FAB and desktop button states
        ['btn-toggle-stats', 'btn-toggle-stats-desktop'].forEach(function(id) {
            var btn = document.getElementById(id);
            if (btn) btn.classList.toggle('active', isStatsOpen);
        });

        if (isStatsOpen) {
            window.app.renderFossils();
        }
    },

    resetToHome: function() {
        var searchInput = document.getElementById('search');
        if (searchInput) searchInput.value = '';
        
        var filterCategory = document.getElementById('filter-category');
        if (filterCategory) filterCategory.value = '';
        
        var filterPeriod = document.getElementById('filter-period');
        if (filterPeriod) filterPeriod.value = '';
        
        var filterSort = document.getElementById('filter-sort');
        if (filterSort) filterSort.value = 'newest';
        
        if (isStatsOpen) {
            isStatsOpen = false;
            var container = document.getElementById('stats-summary');
            if (container) container.style.display = 'none';
            ['btn-toggle-stats', 'btn-toggle-stats-desktop'].forEach(function(id) {
                var btn = document.getElementById(id);
                if (btn) btn.classList.remove('active');
            });
        }
        
        isDataInsightsOpen = false;
        isTreemapOpen = false;
        isEarthHistoryOpen = false;
        isScoreboardOpen = false;
        
        if (typeof window.app.closeDeepDive === 'function') {
            window.app.closeDeepDive();
        }
        
        window.app.setView('false'); // return to active collection
    },

    showMainCharts: function() {
        window.app.hideNewVisualContainers();
        
        var btnCharts = document.getElementById('btn-toggle-charts');
        if (btnCharts) btnCharts.classList.add('active');
        
        var chartsContainer = document.getElementById('stats-charts-container');
        if (chartsContainer) chartsContainer.style.display = 'flex';
        
        if (isStatsOpen) {
            window.app.renderFossils();
        }
    },

    toggleData: function() {
        isDataInsightsOpen = !isDataInsightsOpen;
        window.app.hideNewVisualContainers('data');

        var btnCharts = document.getElementById('btn-toggle-charts');
        var chartsContainer = document.getElementById('stats-charts-container');

        if (isDataInsightsOpen) {
            window.app.renderDataInsights();
        } else {
            if (btnCharts) btnCharts.classList.add('active');
            if (chartsContainer) chartsContainer.style.display = 'flex';
        }
        
        if (isStatsOpen) {
            window.app.renderFossils();
        }
    },

    toggleTreemap: function() {
        isTreemapOpen = !isTreemapOpen;
        window.app.hideNewVisualContainers('treemap');

        var btnCharts = document.getElementById('btn-toggle-charts');
        var chartsContainer = document.getElementById('stats-charts-container');

        if (isTreemapOpen) {
            window.app.renderMissingSpecimens();
        } else {
            if (btnCharts) btnCharts.classList.add('active');
            if (chartsContainer) chartsContainer.style.display = 'flex';
        }
        
        if (isStatsOpen) {
            window.app.renderFossils();
        }
    },

    toggleEarthHistory: function() {
        isEarthHistoryOpen = !isEarthHistoryOpen;
        window.app.hideNewVisualContainers('earth');

        var btnCharts = document.getElementById('btn-toggle-charts');
        var chartsContainer = document.getElementById('stats-charts-container');

        if (isEarthHistoryOpen) {
            window.app.renderEarthHistory('Quaternary');
        } else {
            if (btnCharts) btnCharts.classList.add('active');
            if (chartsContainer) chartsContainer.style.display = 'flex';
        }
        
        if (isStatsOpen) {
            window.app.renderFossils();
        }
    },

    autoGeocodeLookup: function(event) {
        if (event) event.preventDefault();
        var country = document.getElementById('f-country').value.trim();
        var location = document.getElementById('f-location').value.trim();
        var formation = document.getElementById('f-formation').value.trim();
        
        if (!country && !location && !formation) {
            window.app.showToast('Please enter Country, Precise Location, or Formation first.', 'warning');
            return;
        }
        
        var queries = getSmartGeocodeQueries(location, formation, country);
        if (queries.length === 0) {
            window.app.showToast('Could not formulate a geocoding query.', 'warning');
            return;
        }
        
        window.app.showToast('Searching coordinates...', 'info');
        
        trySmartGeocode(queries, 0, function(result, matchedQuery) {
            var lat = parseFloat(result.lat);
            var lon = parseFloat(result.lon);
            document.getElementById('f-lat').value = lat.toFixed(6);
            document.getElementById('f-lng').value = lon.toFixed(6);
            window.app.showToast('Found coordinates via: "' + matchedQuery + '"', 'success');
        }, function() {
            window.app.showToast('Could not automatically geocode this specimen.', 'error');
        });
    },

    toggleFossilMap: function() {
        isFossilMapOpen = !isFossilMapOpen;
        window.app.hideNewVisualContainers('map');

        var btnCharts = document.getElementById('btn-toggle-charts');
        var chartsContainer = document.getElementById('stats-charts-container');

        if (isFossilMapOpen) {
            window.app.initFossilMap();
        } else {
            if (btnCharts) btnCharts.classList.add('active');
            if (chartsContainer) chartsContainer.style.display = 'flex';
        }

        if (isStatsOpen) {
            window.app.renderFossils();
        }
    },

    toggleScoreboard: function() {
        isScoreboardOpen = !isScoreboardOpen;
        window.app.hideNewVisualContainers('scoreboard');

        var btnCharts = document.getElementById('btn-toggle-charts');
        var chartsContainer = document.getElementById('stats-charts-container');

        if (isScoreboardOpen) {
            window.app.renderScoreboard('price');
        } else {
            if (btnCharts) btnCharts.classList.add('active');
            if (chartsContainer) chartsContainer.style.display = 'flex';
        }

        if (isStatsOpen) {
            window.app.renderFossils();
        }
    },

    hideNewVisualContainers: function(exceptId) {
        isChronoChartOpen = exceptId === 'chrono' ? isChronoChartOpen : false;
        isPortfolioOpen = exceptId === 'portfolio' ? isPortfolioOpen : false;
        isPhylogenyOpen = exceptId === 'phylogeny' ? isPhylogenyOpen : false;
        isFossilMapOpen = exceptId === 'map' ? isFossilMapOpen : false;
        isScoreboardOpen = exceptId === 'scoreboard' ? isScoreboardOpen : false;
        isTreemapOpen = exceptId === 'treemap' ? isTreemapOpen : false;
        isEarthHistoryOpen = exceptId === 'earth' ? isEarthHistoryOpen : false;
        isDataInsightsOpen = exceptId === 'data' ? isDataInsightsOpen : false;

        var anyOpen = isChronoChartOpen || isPortfolioOpen || isPhylogenyOpen || 
                      isFossilMapOpen || isScoreboardOpen || isTreemapOpen || 
                      isEarthHistoryOpen || isDataInsightsOpen;

        var chartsContainer = document.getElementById('stats-charts-container');
        if (chartsContainer) {
            chartsContainer.style.display = anyOpen ? 'none' : 'flex';
        }

        var btnCharts = document.getElementById('btn-toggle-charts');
        if (btnCharts) {
            btnCharts.classList.toggle('active', !anyOpen);
        }

        var buttons = [
            { id: 'btn-toggle-chrono-chart', active: isChronoChartOpen },
            { id: 'btn-toggle-portfolio', active: isPortfolioOpen },
            { id: 'btn-toggle-phylogeny', active: isPhylogenyOpen },
            { id: 'btn-toggle-map', active: isFossilMapOpen },
            { id: 'btn-toggle-scoreboard', active: isScoreboardOpen },
            { id: 'btn-toggle-treemap', active: isTreemapOpen },
            { id: 'btn-toggle-earth-history', active: isEarthHistoryOpen },
            { id: 'btn-toggle-data', active: isDataInsightsOpen }
        ];

        buttons.forEach(function(item) {
            var btn = document.getElementById(item.id);
            if (btn) {
                btn.classList.toggle('active', item.active);
            }
        });

        var containers = [
            { id: 'chrono-chart-container', active: isChronoChartOpen },
            { id: 'portfolio-container', active: isPortfolioOpen },
            { id: 'phylogeny-container', active: isPhylogenyOpen },
            { id: 'fossil-map-container', active: isFossilMapOpen },
            { id: 'scoreboard-container', active: isScoreboardOpen },
            { id: 'treemap-container', active: isTreemapOpen },
            { id: 'earth-history-container', active: isEarthHistoryOpen },
            { id: 'data-insights-container', active: isDataInsightsOpen }
        ];

        containers.forEach(function(item) {
            var c = document.getElementById(item.id);
            if (c) {
                c.style.display = item.active ? 'block' : 'none';
            }
        });
    },

    toggleChronoChart: function() {
        isChronoChartOpen = !isChronoChartOpen;
        window.app.hideNewVisualContainers('chrono');

        var btnCharts = document.getElementById('btn-toggle-charts');
        var chartsContainer = document.getElementById('stats-charts-container');

        if (isChronoChartOpen) {
            window.app.renderChronoChart();
        } else {
            if (btnCharts) btnCharts.classList.add('active');
            if (chartsContainer) chartsContainer.style.display = 'flex';
        }

        if (isStatsOpen) {
            window.app.renderFossils();
        }
    },

    togglePortfolio: function() {
        isPortfolioOpen = !isPortfolioOpen;
        window.app.hideNewVisualContainers('portfolio');

        var btnCharts = document.getElementById('btn-toggle-charts');
        var chartsContainer = document.getElementById('stats-charts-container');

        if (isPortfolioOpen) {
            window.app.renderPortfolio();
        } else {
            if (btnCharts) btnCharts.classList.add('active');
            if (chartsContainer) chartsContainer.style.display = 'flex';
        }

        if (isStatsOpen) {
            window.app.renderFossils();
        }
    },

    togglePhylogeny: function() {
        isPhylogenyOpen = !isPhylogenyOpen;
        window.app.hideNewVisualContainers('phylogeny');

        var btnCharts = document.getElementById('btn-toggle-charts');
        var chartsContainer = document.getElementById('stats-charts-container');

        if (isPhylogenyOpen) {
            window.app.renderPhylogeny();
        } else {
            if (btnCharts) btnCharts.classList.add('active');
            if (chartsContainer) chartsContainer.style.display = 'flex';
        }

        if (isStatsOpen) {
            window.app.renderFossils();
        }
    },

    _convertCurrency: function(amount, from, to) {
        if (!amount) return 0;
        var val = parseFloat(amount);
        if (isNaN(val)) return 0;
        if (from === to) return val;
        
        // Normalize to SEK
        var inSek = val;
        if (from === 'USD') inSek = val * 10.5;
        else if (from === 'EUR') inSek = val * 11.4;
        
        // Convert SEK to target
        var rate = 1;
        if (to === 'USD') rate = 1 / 10.5;
        else if (to === 'EUR') rate = 1 / 11.4;
        return inSek * rate;
    },

    _getChronoPeriods: function() {
        return [
            {
                id: 'cenozoic',
                name: 'Cenozoic Era (Pleistocene)',
                span: '2.58 Ma – 11.7 ka',
                epochs: 'Holocene · Pleistocene · Pliocene · Miocene · Oligocene · Eocene · Paleocene',
                danger: 6,
                temp: '8°C - 15°C',
                o2: '100% of Modern (21%)',
                clm: 'Global Icehouse / Cooling Plains',
                narration: 'We have stepped out into the grassy Pleistocene plains... massive mammoths graze nearby, but danger lurks in the long grass where the saber-toothed Smilodon hunts.',
                target: 'Woolly Mammoth Tooth or Saber-Toothed Cat Jaw fragment'
            },
            {
                id: 'cretaceous',
                name: 'Cretaceous Period',
                span: '145.0 Ma – 66.0 Ma',
                epochs: 'Late Cretaceous · Early Cretaceous',
                danger: 7,
                temp: '22°C - 24°C',
                o2: '150% of Modern (30%)',
                clm: 'Humid Tropical Greenhouse / High Seaways',
                narration: 'Welcome to the late Cretaceous. It is a humid swamp environment. In the distance, a Tyrannosaurus rex bellows, while massive mosasaurs patrol the warm, shallow coastal waters.',
                target: 'Tyrannosaurus Rex Tooth or Mosasaur tooth/vertebra'
            },
            {
                id: 'jurassic',
                name: 'Jurassic Period',
                span: '201.0 Ma – 145.0 Ma',
                epochs: 'Late (Malm) · Middle (Dogger) · Early (Lias) Jurassic',
                danger: 6,
                temp: '20°C - 22°C',
                o2: '130% of Modern (26%)',
                clm: 'Warm Greenhouse / Extensive Conifer Forests',
                narration: 'Stepping into the late Jurassic conifer forests. The ground trembles beneath the feet of giant Diplodocus herds. Stegosaurs keep their spiked tails ready for Allosaurus encounters.',
                target: 'Allosaurus sp. tooth or Stegosaurus tail spike'
            },
            {
                id: 'triassic',
                name: 'Triassic Period',
                span: '252.0 Ma – 201.0 Ma',
                epochs: 'Late (Keuper) · Middle (Muschelkalk) · Early (Buntsandstein) Triassic',
                danger: 5,
                temp: '23°C - 25°C',
                o2: '80% of Modern (16%)',
                clm: 'Arid Megamonsoonal / Red Desert Basin',
                narration: 'Stepping onto the red sand dunes of the Triassic. Pterosaurs fly overhead, and early dinosaurs like Coelophysis forage along drying lakes.',
                target: 'Triassic Ceratite ammonite or early dinosaur tooth'
            },
            {
                id: 'permian-carboniferous',
                name: 'Permian & Carboniferous Periods',
                span: '359.0 Ma – 252.0 Ma',
                epochs: 'Lopingian · Guadalupian · Cisuralian (Permian) · Pennsylvanian · Mississippian (Carboniferous)',
                danger: 4,
                temp: '14°C - 16°C',
                o2: '160% of Modern (35%)',
                clm: 'Humid Swamp Forests / Massive Coal Bogs',
                narration: 'Diving back into the giant swamp forests. With oxygen levels soaring at 35%, giant Meganeura dragonflies buzz through the humid canopy, and giant amphibians wade through the coal bogs.',
                target: 'Calamites / Sigillaria leaf fossils or early amphibian trackway'
            },
            {
                id: 'devonian-silurian',
                name: 'Devonian & Silurian Periods',
                span: '443.0 Ma – 359.0 Ma',
                epochs: 'Late/Middle/Early Devonian · Pridoli · Ludlow · Wenlock · Llandovery (Silurian)',
                danger: 4,
                temp: '20°C',
                o2: '75% of Modern (15%)',
                clm: 'Tropical Coral Reefs / First Land Plants',
                narration: 'Diving down into the Devonian warm seas. Armor-plated Dunkleosteus sharks swim through the waters, while early plants begin greening the stark landmasses.',
                target: 'Armor-plated Placoderm fish shield or early Silurian coral'
            },
            {
                id: 'ordovician-cambrian',
                name: 'Ordovician & Cambrian Periods',
                span: '541.0 Ma – 443.0 Ma',
                epochs: 'Late/Middle/Early Ordovician · Furongian · Miaolingian · Series 2 · Terreneuvian (Cambrian)',
                danger: 3,
                temp: '22°C',
                o2: '65% of Modern (13%)',
                clm: 'Shallow Marine Pools / Epicontinental Seas',
                narration: 'Submerging into the tropical Ordovician seas. Watch out for Cameroceras, a ten-meter long straight-shelled nautiloid, patrolling the coral reefs next to massive trilobite colonies.',
                target: 'Elrathia Kingii trilobite or Cameroceras / Orthoceras shell'
            },
            {
                id: 'precambrian',
                name: 'Precambrian Time (Ediacaran)',
                span: '4600.0 Ma – 541.0 Ma',
                epochs: 'Ediacaran · Cryogenian · Tonian (Neoproterozoic) · Mesoproterozoic · Paleoproterozoic · Hadean',
                danger: 1,
                temp: '15°C (Fluctuating)',
                o2: '1% to 15% of Modern (0.2 - 3%)',
                clm: 'Primordial Cold Oceans / Early Crustal Layers',
                narration: 'We have reached deep time—the late Precambrian. The ocean is completely silent. Soft-bodied Dickinsonia and Charnia cling to microbial mats along the shallow sandy seafloor.',
                target: 'Ediacaran Dickinsonia fossil impression or Stromatolite dome'
            }
        ];
    },

    renderChronoChart: function() {
        var container = document.getElementById('chrono-chart-container');
        if (!container) return;

        var CHRONO_PERIODS = this._getChronoPeriods();

        // Period grouping helper
        var getPeriodGroup = function(f) {
            var p = (f.geologicalPeriod || '').toLowerCase();
            var n = (f.specimen || '').toLowerCase();
            
            if (p.indexOf('precambrian') !== -1 || p.indexOf('ediacaran') !== -1 || p.indexOf('proterozoic') !== -1 || n.indexOf('dickinsonia') !== -1 || n.indexOf('charnia') !== -1 || n.indexOf('stromatolite') !== -1) {
                return 'precambrian';
            }
            if (p.indexOf('cambrian') !== -1 || p.indexOf('ordovician') !== -1 || n.indexOf('anomalocaris') !== -1 || n.indexOf('trilobite') !== -1 || n.indexOf('calymene') !== -1 || n.indexOf('orthoceras') !== -1) {
                return 'ordovician-cambrian';
            }
            if (p.indexOf('devonian') !== -1 || p.indexOf('silurian') !== -1 || n.indexOf('dunkleosteus') !== -1 || n.indexOf('placoderm') !== -1) {
                return 'devonian-silurian';
            }
            if (p.indexOf('permian') !== -1 || p.indexOf('carboniferous') !== -1 || p.indexOf('mississippian') !== -1 || p.indexOf('pennsylvanian') !== -1) {
                return 'permian-carboniferous';
            }
            if (p.indexOf('triassic') !== -1) {
                return 'triassic';
            }
            if (p.indexOf('jurassic') !== -1 || n.indexOf('stegosaurus') !== -1 || n.indexOf('allosaurus') !== -1 || n.indexOf('brachiosaurus') !== -1) {
                return 'jurassic';
            }
            if (p.indexOf('cretaceous') !== -1 || n.indexOf('tyrannosaurus') !== -1 || n.indexOf('triceratops') !== -1 || n.indexOf('spinosaurus') !== -1 || n.indexOf('mosasaur') !== -1 || n.indexOf('ammonite') !== -1) {
                return 'cretaceous';
            }
            if (p.indexOf('quaternary') !== -1 || p.indexOf('neogene') !== -1 || p.indexOf('paleogene') !== -1 || p.indexOf('tertiary') !== -1 || p.indexOf('pleistocene') !== -1 || p.indexOf('miocene') !== -1 || p.indexOf('eocene') !== -1 || p.indexOf('oligocene') !== -1 || p.indexOf('cenozoic') !== -1 || n.indexOf('mammoth') !== -1 || n.indexOf('megalodon') !== -1 || n.indexOf('saber-toothed') !== -1) {
                return 'cenozoic';
            }
            
            // Age fallback
            var age = parseFloat(f.ageMa);
            if (!isNaN(age)) {
                if (age > 541) return 'precambrian';
                if (age > 443) return 'ordovician-cambrian';
                if (age > 359) return 'devonian-silurian';
                if (age > 252) return 'permian-carboniferous';
                if (age > 201) return 'triassic';
                if (age > 145) return 'jurassic';
                if (age > 66) return 'cretaceous';
                return 'cenozoic';
            }
            return null;
        };

        var html = '<div class="chrono-dashboard-wrapper">';
        html += '<div class="chrono-intro-header">' +
                '<h2>⏳ Geologic Time Drill-Down</h2>' +
                '<p>Travel back through Deep Time. Check where your fossil specimens reside across stratigraphy layers, and expose missing geological gaps.</p>' +
                '</div>';

        html += '<div class="chrono-vertical-column">';

        CHRONO_PERIODS.forEach(function(pInfo) {
            // Find fossils matching this group
            var periodFossils = fossils.filter(function(f) {
                return getPeriodGroup(f) === pInfo.id;
            });

            var count = periodFossils.length;
            var gapClass = count === 0 ? 'time-gap-exposed' : '';
            var dangerBars = '';
            for (var i = 1; i <= 7; i++) {
                var filled = i <= pInfo.danger ? 'filled' : '';
                dangerBars += '<span class="danger-bar-tick ' + filled + '"></span>';
            }

            html += '<div class="chrono-layer-card ' + pInfo.id + ' ' + gapClass + '">' +
                        '<div class="chrono-layer-bed-texture"></div>' +
                        '<div class="chrono-layer-header">' +
                            '<div class="chrono-layer-main-info">' +
                                '<span class="chrono-badge-era">' + pInfo.span + '</span>' +
                                '<h3 class="chrono-layer-title">' + escapeHtml(pInfo.name) + '</h3>' +
                                '<div class="chrono-epochs-strip">' + escapeHtml(pInfo.epochs || '') + '</div>' +
                                '<div class="chrono-climate-grid">' +
                                    '<span class="chrono-climate-stat">🌡️ ' + escapeHtml(pInfo.temp) + '</span>' +
                                    '<span class="chrono-climate-stat">💨 ' + escapeHtml(pInfo.o2) + '</span>' +
                                    '<span class="chrono-climate-stat-wide">🌍 ' + escapeHtml(pInfo.clm) + '</span>' +
                                '</div>' +
                            '</div>' +
                            '<div class="chrono-danger-container">' +
                                '<span class="danger-label">⚠️ Prehistoric Hazard: ' + pInfo.danger + '/7</span>' +
                                '<div class="danger-bar-wrapper">' + dangerBars + '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="chrono-narration-box">' +
                            '<em>&ldquo;' + escapeHtml(pInfo.narration) + '&rdquo;</em>' +
                        '</div>';

            if (count > 0) {
                html += '<div class="chrono-specimens-section">' +
                            '<h4 class="chrono-section-title">🦴 Mapped Specimens (' + count + ')</h4>' +
                            '<div class="chrono-specimens-shelf">';
                
                periodFossils.forEach(function(f) {
                    var thumbUrl = (f.images && f.images.length > 0) ? f.images[0] : null;
                    var imgHtml = '';
                    if (thumbUrl) {
                        imgHtml = '<img src="' + thumbUrl + '" class="chrono-spec-thumb" alt="">';
                    } else {
                        var catEmoji = '🦴';
                        var cat = (f.category || '').toLowerCase();
                        if (cat.indexOf('vertebrate') !== -1 && cat.indexOf('invertebrate') === -1) catEmoji = '🦖';
                        else if (cat.indexOf('invertebrate') !== -1) catEmoji = '🐚';
                        else if (cat.indexOf('plant') !== -1) catEmoji = '🌿';
                        else if (cat.indexOf('trace') !== -1) catEmoji = '🐾';
                        imgHtml = '<div class="chrono-spec-thumb-emoji">' + catEmoji + '</div>';
                    }

                    var binomial = f.specimen || 'Unnamed';
                    var words = binomial.split(/\s+/);
                    if (words.length >= 2 && /^[A-Z][a-z]+$/.test(words[0]) && /^[a-z]+$/.test(words[1])) {
                        binomial = '<em>' + escapeHtml(words[0]) + ' ' + escapeHtml(words[1]) + '</em>' + (words.slice(2).join(' ') ? ' ' + escapeHtml(words.slice(2).join(' ')) : '');
                    } else if (words.length >= 1 && /^[A-Z][a-z]+$/.test(words[0])) {
                        binomial = '<em>' + escapeHtml(words[0]) + '</em>' + (words.length > 1 ? ' ' + escapeHtml(words.slice(1).join(' ')) : '');
                    }

                    html += '<div class="chrono-spec-pill" onclick="window.app.openLightbox(\'' + f.id + '\', 0)" title="Inspect Curation">' +
                                imgHtml +
                                '<div class="chrono-spec-pill-text">' +
                                    '<span class="chrono-spec-pill-title">' + binomial + '</span>' +
                                    '<span class="chrono-spec-pill-sub">' + escapeHtml(f.anatomy || 'Specimen') + '</span>' +
                                '</div>' +
                            '</div>';
                });

                html += '</div></div>';
            } else {
                html += '<div class="chrono-time-gap-alert">' +
                            '<div class="gap-glow-bullet"></div>' +
                            '<div class="gap-text-content">' +
                                '<h4 class="gap-title">⏳ Geological Time Gap Exposed</h4>' +
                                '<p class="gap-desc">Your database has no specimens cataloged from this prehistoric period.</p>' +
                                '<p class="gap-hint">🎯 **Collector\'s Target Hunt:** Add a **' + escapeHtml(pInfo.target) + '** to secure this epoch!</p>' +
                            '</div>' +
                        '</div>';
            }

            html += '</div>'; // Layer card close
        });

        html += '</div></div>'; // Vertical timeline and wrapper close
        container.innerHTML = html;
    },

    renderPortfolio: function() {
        var container = document.getElementById('portfolio-container');
        if (!container) return;

        // Base currency sign
        var baseSign = '$';
        if (activeBaseCurrency === 'EUR') baseSign = '€';
        else if (activeBaseCurrency === 'SEK') baseSign = 'kr ';

        var formatVal = function(val) {
            return baseSign + parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        // Calculations
        var totalCost = 0;
        var totalEstValue = 0;
        var soldTotalCost = 0;
        var soldTotalRevenue = 0;
        var activeCount = 0;
        var soldCount = 0;

        fossils.forEach(function(f) {
            var cost = parseFloat(f.price) || 0;
            var costBase = window.app._convertCurrency(cost, f.currency || 'USD', activeBaseCurrency);

            if (f.isSold) {
                soldCount++;
                soldTotalCost += costBase;
                var salePrice = parseFloat(f.salePrice) || 0;
                var salePriceBase = window.app._convertCurrency(salePrice, f.currency || 'USD', activeBaseCurrency);
                soldTotalRevenue += salePriceBase;
            } else {
                activeCount++;
                totalCost += costBase;
                
                var est = parseFloat(f.estimatedValue) || parseFloat(f.price) || 0; // fallback est to price
                var estBase = window.app._convertCurrency(est, f.estimatedCurrency || f.currency || 'USD', activeBaseCurrency);
                totalEstValue += estBase;
            }
        });

        var netAppreciation = totalEstValue - totalCost;
        var appreciationPct = totalCost > 0 ? (netAppreciation / totalCost) * 100 : 0;
        var appreciationSign = netAppreciation >= 0 ? '📈' : '📉';
        var appreciationClass = netAppreciation >= 0 ? 'appreciation-positive' : 'appreciation-negative';

        var soldProfit = soldTotalRevenue - soldTotalCost;
        var soldProfitPct = soldTotalCost > 0 ? (soldProfit / soldTotalCost) * 100 : 0;

        // Header controls HTML
        var html = '<div class="portfolio-wrapper">';
        
        html += '<div class="portfolio-header-bar">' +
                    '<div class="portfolio-header-text">' +
                        '<h2>💼 Acquisition Portfolio & Valuations</h2>' +
                        '<p>Track capital investments, curatorial appreciation, and liquidation records across currencies.</p>' +
                    '</div>' +
                    '<div class="portfolio-header-actions">' +
                        '<div class="portfolio-currency-picker">' +
                            '<span class="picker-label">Base Valuation:</span>' +
                            '<select class="portfolio-select" onchange="window.app.setPortfolioBaseCurrency(this.value)">' +
                                '<option value="USD" ' + (activeBaseCurrency === 'USD' ? 'selected' : '') + '>USD ($)</option>' +
                                '<option value="EUR" ' + (activeBaseCurrency === 'EUR' ? 'selected' : '') + '>EUR (€)</option>' +
                                '<option value="SEK" ' + (activeBaseCurrency === 'SEK' ? 'selected' : '') + '>SEK (kr)</option>' +
                            '</select>' +
                        '</div>' +
                        '<button type="button" class="btn-primary flex-btn" onclick="window.app.generateInsuranceReport()">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' +
                            'Export Insurance Report' +
                        '</button>' +
                    '</div>' +
                '</div>';

        // KPI Dashboard Grid
        html += '<div class="portfolio-dashboard-grid">' +
                    '<div class="portfolio-kpi-card">' +
                        '<span class="kpi-label">Active Capital Invested</span>' +
                        '<span class="kpi-val">' + formatVal(totalCost) + '</span>' +
                        '<span class="kpi-sub">' + activeCount + ' active curated specimens</span>' +
                    '</div>' +
                    '<div class="portfolio-kpi-card">' +
                        '<span class="kpi-label">Assessed Portfolio Value</span>' +
                        '<span class="kpi-val">' + formatVal(totalEstValue) + '</span>' +
                        '<span class="kpi-sub">Aggregated portfolio value</span>' +
                    '</div>' +
                    '<div class="portfolio-kpi-card ' + appreciationClass + '">' +
                        '<span class="kpi-label">Assessed Appreciation</span>' +
                        '<span class="kpi-val ' + appreciationClass + '">' + appreciationSign + ' ' + formatVal(netAppreciation) + '</span>' +
                        '<span class="kpi-sub ' + appreciationClass + '">' + (appreciationPct >= 0 ? '+' : '') + appreciationPct.toFixed(1) + '% Net Return</span>' +
                    '</div>' +
                    '<div class="portfolio-kpi-card">' +
                        '<span class="kpi-label">Liquidation Revenue</span>' +
                        '<span class="kpi-val">' + formatVal(soldTotalRevenue) + '</span>' +
                        '<span class="kpi-sub">Sold: ' + soldCount + ' (' + (soldProfit >= 0 ? '+' : '') + soldProfitPct.toFixed(1) + '% profit)</span>' +
                    '</div>' +
                '</div>';

        // Sorting arrow indicator helper
        var getSortArrow = function(field) {
            if (portfolioSortField !== field) return '';
            return portfolioSortAsc ? ' <span style="font-size: 0.65rem;">▲</span>' : ' <span style="font-size: 0.65rem;">▼</span>';
        };

        // Inventory table / list
        html += '<div class="portfolio-inventory-section">' +
                    '<h3 class="section-title">📂 Asset Registry Ledger</h3>' +
                    '<div class="portfolio-table-wrapper">' +
                        '<table class="portfolio-table">' +
                            '<thead>' +
                                '<tr>' +
                                    '<th onclick="window.app.sortPortfolioBy(\'specimen\')" style="cursor:pointer; user-select:none;">Specimen Fossil' + getSortArrow('specimen') + '</th>' +
                                    '<th onclick="window.app.sortPortfolioBy(\'category\')" style="cursor:pointer; user-select:none;">Category' + getSortArrow('category') + '</th>' +
                                    '<th onclick="window.app.sortPortfolioBy(\'period\')" style="cursor:pointer; user-select:none;">Geological Period' + getSortArrow('period') + '</th>' +
                                    '<th onclick="window.app.sortPortfolioBy(\'stable\')" style="cursor:pointer; user-select:none;">Preservation Stable' + getSortArrow('stable') + '</th>' +
                                    '<th onclick="window.app.sortPortfolioBy(\'cost\')" style="cursor:pointer; user-select:none;">Acquisition Cost' + getSortArrow('cost') + '</th>' +
                                    '<th onclick="window.app.sortPortfolioBy(\'value\')" style="cursor:pointer; user-select:none;">Assessed Value' + getSortArrow('value') + '</th>' +
                                    '<th onclick="window.app.sortPortfolioBy(\'status\')" style="cursor:pointer; user-select:none;">Status' + getSortArrow('status') + '</th>' +
                                '</tr>' +
                            '</thead>' +
                            '<tbody>';

        var sortedFossils = fossils.slice();
        if (fossils.length === 0) {
            html += '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No specimens in your collection to display in the ledger.</td></tr>';
        } else {
            sortedFossils.sort(function(a, b) {
                var valA = '';
                var valB = '';
                
                if (portfolioSortField === 'specimen') {
                    valA = (a.specimen || '').toLowerCase();
                    valB = (b.specimen || '').toLowerCase();
                } else if (portfolioSortField === 'category') {
                    valA = (a.category || '').toLowerCase();
                    valB = (b.category || '').toLowerCase();
                } else if (portfolioSortField === 'period') {
                    valA = (a.geologicalPeriod || '').toLowerCase();
                    valB = (b.geologicalPeriod || '').toLowerCase();
                } else if (portfolioSortField === 'stable') {
                    valA = (a.condition && a.condition.stable) ? 'a' : 'b';
                    valB = (b.condition && b.condition.stable) ? 'a' : 'b';
                } else if (portfolioSortField === 'cost') {
                    var priceA = parseFloat(a.price) || 0;
                    valA = window.app._convertCurrency(priceA, a.currency || 'USD', activeBaseCurrency);
                    var priceB = parseFloat(b.price) || 0;
                    valB = window.app._convertCurrency(priceB, b.currency || 'USD', activeBaseCurrency);
                } else if (portfolioSortField === 'value') {
                    var estA = parseFloat(a.estimatedValue) || parseFloat(a.price) || 0;
                    valA = window.app._convertCurrency(estA, a.estimatedCurrency || a.currency || 'USD', activeBaseCurrency);
                    var estB = parseFloat(b.estimatedValue) || parseFloat(b.price) || 0;
                    valB = window.app._convertCurrency(estB, b.estimatedCurrency || b.currency || 'USD', activeBaseCurrency);
                } else if (portfolioSortField === 'status') {
                    valA = a.isSold ? 'c' : (a.isForSale ? 'b' : (a.isWishlist ? 'd' : 'a'));
                    valB = b.isSold ? 'c' : (b.isForSale ? 'b' : (b.isWishlist ? 'd' : 'a'));
                }

                if (valA < valB) return portfolioSortAsc ? -1 : 1;
                if (valA > valB) return portfolioSortAsc ? 1 : -1;
                return 0;
            });

            sortedFossils.forEach(function(f) {
                var cost = parseFloat(f.price) || 0;
                var costBase = window.app._convertCurrency(cost, f.currency || 'USD', activeBaseCurrency);

                var est = parseFloat(f.estimatedValue) || parseFloat(f.price) || 0;
                var estBase = window.app._convertCurrency(est, f.estimatedCurrency || f.currency || 'USD', activeBaseCurrency);

                var statusBadge = f.isSold ? '<span class="status-pill sold">Sold</span>' : (f.isForSale ? '<span class="status-pill sale" style="background: rgba(229, 142, 38, 0.12); border: 1px solid var(--warning); color: var(--warning); padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase;">For Sale</span>' : '<span class="status-pill active">Curated</span>');
                
                // Formatted scientific name
                var rawName = f.specimen || 'Unnamed';
                var formattedName = escapeHtml(rawName);
                var words = rawName.split(/\s+/);
                if (words.length >= 2 && /^[A-Z][a-z]+$/.test(words[0]) && /^[a-z]+$/.test(words[1])) {
                    formattedName = '<em>' + escapeHtml(words[0]) + ' ' + escapeHtml(words[1]) + '</em>' + (words.slice(2).join(' ') ? ' ' + escapeHtml(words.slice(2).join(' ')) : '');
                } else if (words.length >= 1 && /^[A-Z][a-z]+$/.test(words[0])) {
                    formattedName = '<em>' + escapeHtml(words[0]) + '</em>' + (words.length > 1 ? ' ' + escapeHtml(words.slice(1).join(' ')) : '');
                }

                // Condition display
                var cond = f.condition || {};
                var condStr = '🟢 Stable';
                if (cond.cracking) condStr = '⚡ Fractured';
                else if (cond.efflorescence) condStr = '⚪ Efflorescent';
                else if (cond.pyrite) condStr = '🔥 Pyrite Decay';

                html += '<tr>' +
                            '<td>' +
                                '<div class="table-spec-cell">' +
                                    '<span class="table-spec-name" onclick="window.app.openLightbox(\'' + f.id + '\', 0)">' + formattedName + '</span>' + (f.conditionTier ? getConditionTierBadgeHtml(f.conditionTier) : '') +
                                    '<span class="table-spec-sub">ID: ' + escapeHtml(f.id.slice(0, 8)) + '</span>' +
                                '</div>' +
                            '</td>' +
                            '<td>' + escapeHtml(f.category || 'N/A') + (f.fossilType ? '<br><small style="color:var(--text-secondary); opacity: 0.8; font-size: 0.75rem;">' + escapeHtml(f.fossilType) + '</small>' : '') + '</td>' +
                            '<td>' + escapeHtml(f.geologicalPeriod || 'N/A') + '</td>' +
                            '<td>' + condStr + (f.conditionTier ? getConditionTierBadgeHtml(f.conditionTier) : '') + '</td>' +
                            '<td>' + formatVal(costBase) + ' <small style="color:rgba(255,255,255,0.3); font-size:0.65rem;">(' + cost + ' ' + (f.currency || 'USD') + ')</small></td>' +
                            '<td>' + formatVal(estBase) + '</td>' +
                            '<td>' + statusBadge + '</td>' +
                        '</tr>';
            });
        }

        html += '</tbody></table></div></div></div>';
        container.innerHTML = html;
    },

    generateInsuranceReport: function() {
        var baseSign = '$';
        if (activeBaseCurrency === 'EUR') baseSign = '€';
        else if (activeBaseCurrency === 'SEK') baseSign = 'kr ';

        var formatVal = function(val) {
            return baseSign + parseFloat(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        var printWindow = window.open('', '_blank');
        if (!printWindow) {
            window.app.showToast('Please allow popups to export the insurance report.', 'warning');
            return;
        }

        var activeFossils = fossils.filter(function(f) { return !f.isWishlist && !f.isSold; });
        var totalCost = 0;
        var totalEst = 0;
        
        var rowsHtml = '';
        activeFossils.forEach(function(f, idx) {
            var cost = parseFloat(f.price) || 0;
            var costBase = window.app._convertCurrency(cost, f.currency || 'USD', activeBaseCurrency);
            totalCost += costBase;

            var est = parseFloat(f.estimatedValue) || parseFloat(f.price) || 0;
            var estBase = window.app._convertCurrency(est, f.estimatedCurrency || f.currency || 'USD', activeBaseCurrency);
            totalEst += estBase;

            // Formatted scientific name
            var rawName = f.specimen || 'Unnamed Specimen';
            var formattedName = escapeHtml(rawName);
            var words = rawName.split(/\s+/);
            if (words.length >= 2 && /^[A-Z][a-z]+$/.test(words[0]) && /^[a-z]+$/.test(words[1])) {
                formattedName = '<em>' + escapeHtml(words[0]) + ' ' + escapeHtml(words[1]) + '</em>' + (words.slice(2).join(' ') ? ' ' + escapeHtml(words.slice(2).join(' ')) : '');
            } else if (words.length >= 1 && /^[A-Z][a-z]+$/.test(words[0])) {
                formattedName = '<em>' + escapeHtml(words[0]) + '</em>' + (words.length > 1 ? ' ' + escapeHtml(words.slice(1).join(' ')) : '');
            }

            var cond = f.condition || {};
            var condStr = '🟢 Stable';
            if (cond.cracking) condStr = '⚡ Fractured';
            else if (cond.efflorescence) condStr = '⚪ Efflorescent';
            else if (cond.pyrite) condStr = '🔥 Pyrite Decay';

            var treat = f.treatment || {};
            var treatList = [];
            if (treat.paraloid) treatList.push('Paraloid B-72');
            if (treat.scribe) treatList.push('Air Scribed');
            if (treat.cyano) treatList.push('Glued');
            if (treat.water) treatList.push('Stabilized');
            var treatStr = treatList.length > 0 ? treatList.join(', ') : 'None';

            var originParts = [];
            if (f.formation) originParts.push(f.formation);
            if (f.location) originParts.push(f.location);
            if (f.country) originParts.push(f.country);
            var origin = originParts.join(', ') || 'N/A';

            var sizeText = f.size ? formatSpecimenDimensions(f) : 'N/A';
            if (f.weight) sizeText += ' / ' + formatSpecimenWeight(f.weight);

            var thumbUrl = (f.images && f.images.length > 0) ? f.images[0] : '';
            var isVid = thumbUrl ? window.app.isVideo(thumbUrl) : false;
            var thumbHtml = thumbUrl ? 
                (isVid ? '<video src="' + thumbUrl + '" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;" muted autoplay loop playsinline></video>' : '<img src="' + thumbUrl + '" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;">') : 
                '<div style="width:50px; height:50px; display:flex; align-items:center; justify-content:center; background:#eee; color:#aaa; font-size:1.5rem; border-radius:4px;">🦴</div>';

            var fossilYear = f.createdAt ? new Date(f.createdAt).getFullYear() : 2026;
            var customCatalogId = 'FA-' + fossilYear + '-' + String(idx + 1).padStart(4, '0');

            rowsHtml += '<tr>' +
                            '<td><strong>' + customCatalogId + '</strong></td>' +
                            '<td>' + thumbHtml + '</td>' +
                            '<td>' + formattedName + '<br><small style="color:#666;">Category: ' + escapeHtml(f.category || 'N/A') + (f.fossilType ? ' &middot; ' + escapeHtml(f.fossilType) : '') + '</small></td>' +
                            '<td>' + escapeHtml(f.geologicalPeriod || 'N/A') + '<br><small style="color:#666;">' + escapeHtml(origin) + '</small></td>' +
                            '<td>' + escapeHtml(sizeText) + '</td>' +
                            '<td>' + condStr + '<br><small style="color:#666;">Prep: ' + escapeHtml(treatStr) + '</small></td>' +
                            '<td>' + formatVal(costBase) + '</td>' +
                            '<td><strong>' + formatVal(estBase) + '</strong></td>' +
                        '</tr>';
        });

        var appreciation = totalEst - totalCost;
        var appPct = totalCost > 0 ? (appreciation / totalCost) * 100 : 0;

        var html = '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '<title>Smithsonian-Grade Fossil Insurance Inventory</title>' +
            '<style>' +
                'body { font-family: "Georgia", "Times New Roman", serif; padding: 2rem; color: #111; line-height: 1.4; }' +
                '.header { text-align: center; border-bottom: 3px double #111; padding-bottom: 1.5rem; margin-bottom: 2rem; }' +
                '.header h1 { font-family: "Times New Roman", serif; font-size: 1.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin: 0; }' +
                '.header p { font-size: 0.85rem; color: #555; text-transform: uppercase; letter-spacing: 0.05em; margin: 0.5rem 0 0 0; }' +
                '.summary-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; font-size: 0.9rem; }' +
                '.summary-table th, .summary-table td { border: 1px solid #ccc; padding: 0.6rem 1rem; text-align: left; }' +
                '.summary-table th { background: #f5f5f5; font-weight: bold; }' +
                '.inventory-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }' +
                '.inventory-table th, .inventory-table td { border: 1px solid #aaa; padding: 0.5rem; text-align: left; vertical-align: top; }' +
                '.inventory-table th { background: #e0e0e0; font-weight: bold; text-transform: uppercase; font-size: 0.72rem; }' +
                '.footer-signatures { display: flex; justify-content: space-between; margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #ccc; font-size: 0.85rem; }' +
                '.signature-line { width: 250px; border-top: 1px solid #111; text-align: center; padding-top: 0.5rem; margin-top: 3rem; }' +
                '@media print { ' +
                    'body { padding: 0; }' +
                    '.no-print { display: none; }' +
                '}' +
            '</style>' +
            '</head>' +
            '<body>' +
            '<div class="header">' +
                '<h1>Specimenry Collection Register</h1>' +
                '<p>Official Curation Valuation Index & Insurance Inventory</p>' +
                '<p style="font-size:0.7rem; color:#888; margin-top:0.25rem;">Date Generated: ' + new Date().toLocaleDateString() + ' · Base Currency: ' + activeBaseCurrency + '</p>' +
            '</div>' +
            
            '<table class="summary-table">' +
                '<thead>' +
                    '<tr>' +
                        '<th>Total Specimens Curated</th>' +
                        '<th>Capital Invested (Cost)</th>' +
                        '<th>Assessed Assessed Value</th>' +
                        '<th>Net Portfolio Return</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    '<tr>' +
                        '<td><strong>' + activeFossils.length + ' specimens</strong></td>' +
                        '<td>' + formatVal(totalCost) + '</td>' +
                        '<td><strong>' + formatVal(totalEst) + '</strong></td>' +
                        '<td><strong>' + (appreciation >= 0 ? '+' : '') + formatVal(appreciation) + ' (' + (appreciation >= 0 ? '+' : '') + appPct.toFixed(1) + '%)</strong></td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +

            '<table class="inventory-table">' +
                '<thead>' +
                    '<tr>' +
                        '<th>Catalog ID</th>' +
                        '<th>Image</th>' +
                        '<th>Taxon / Description</th>' +
                        '<th>Stratigraphy / Locality</th>' +
                        '<th>Dimensions</th>' +
                        '<th>Preservation & Prep</th>' +
                        '<th>Acq. Cost</th>' +
                        '<th>Assessed Value</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    rowsHtml +
                '</tbody>' +
            '</table>' +

            '<div class="footer-signatures">' +
                '<div>' +
                    '<p><strong>Curator Declaration:</strong></p>' +
                    '<p style="color:#444; max-width:400px; font-size:0.75rem; line-height:1.4;">I hereby certify that the specimens listed in this registry represent authentic paleobiological entities present in this curated cabinet, stabilized and preserved in accordance with the prep logs herein.</p>' +
                    '<div class="signature-line">Lead Curator Signature</div>' +
                '</div>' +
                '<div>' +
                    '<div class="signature-line" style="margin-top:5.35rem;">Assessing Inspector Signature & Date</div>' +
                '</div>' +
            '</div>' +
            '</body>' +
            '</html>';

        printWindow.document.write(html);
        printWindow.document.close();
        
        // Wait for images to load before printing
        printWindow.onload = function() {
            printWindow.print();
        };
    },

    renderScoreboard: function(criteria) {
        var container = document.getElementById('scoreboard-container');
        if (!container) return;

        criteria = criteria || 'price';

        // Helper: convert a fossil's price to SEK for normalized comparison
        var toSEK = function(f) {
            if (!f.price) return 0;
            var curr = f.currency || 'USD';
            if (curr === 'SEK') return parseFloat(f.price);
            if (exchangeRates && exchangeRates[curr]) {
                return parseFloat(f.price) / exchangeRates[curr];
            }
            // Approximate fallback rates
            if (curr === 'USD') return parseFloat(f.price) * 10.50;
            if (curr === 'EUR') return parseFloat(f.price) * 11.50;
            return parseFloat(f.price);
        };

        // 1. Smart Filtering based on active collection
        var rankedFossils = (fossils || []).filter(function(f) {
            if (f.isWishlist) return false;

            if (criteria === 'price') {
                return f.price !== undefined && f.price !== null && !isNaN(parseFloat(f.price)) && parseFloat(f.price) > 0;
            } else if (criteria === 'animalSize') {
                return f.animalSize !== undefined && f.animalSize !== null && !isNaN(parseFloat(f.animalSize)) && parseFloat(f.animalSize) > 0;
            } else if (criteria === 'size') {
                return f.size !== undefined && f.size !== null && !isNaN(parseFloat(f.size)) && parseFloat(f.size) > 0;
            } else if (criteria === 'weight') {
                return f.weight !== undefined && f.weight !== null && !isNaN(parseFloat(f.weight)) && parseFloat(f.weight) > 0;
            }
            return false;
        });

        // 2. Sort Descending (Price uses normalized toSEK values)
        rankedFossils.sort(function(a, b) {
            if (criteria === 'price') {
                return toSEK(b) - toSEK(a);
            } else if (criteria === 'animalSize') {
                return parseFloat(b.animalSize) - parseFloat(a.animalSize);
            } else if (criteria === 'size') {
                return parseFloat(b.size) - parseFloat(a.size);
            } else if (criteria === 'weight') {
                return parseFloat(b.weight) - parseFloat(a.weight);
            }
            return 0;
        });

        // 3. Slice to Top 100
        var topEntries = rankedFossils.slice(0, 100);

        // 4. Build Navigation pills markup
        var navHtml = 
            '<div class="scoreboard-nav-pills">' +
                '<button type="button" class="' + (criteria === 'price' ? 'active' : '') + '" onclick="app.renderScoreboard(\'price\')">' +
                    '💰 Value Leaderboard' +
                '</button>' +
                '<button type="button" class="' + (criteria === 'animalSize' ? 'active' : '') + '" onclick="app.renderScoreboard(\'animalSize\')">' +
                    '📐 Largest Animals' +
                '</button>' +
                '<button type="button" class="' + (criteria === 'size' ? 'active' : '') + '" onclick="app.renderScoreboard(\'size\')">' +
                    '📏 Largest Fossils' +
                '</button>' +
                '<button type="button" class="' + (criteria === 'weight' ? 'active' : '') + '" onclick="app.renderScoreboard(\'weight\')">' +
                    '⚖️ Heaviest Specimens' +
                '</button>' +
            '</div>';

        var contentHtml = '';

        if (topEntries.length === 0) {
            // Render beautiful zero state
            var criteriaNames = {
                price: 'financial value',
                animalSize: 'estimated whole-animal size',
                size: 'physical fossil dimension',
                weight: 'specimen weight'
            };
            var criteriaFields = {
                price: 'Purchase Price (Curation & Value tab)',
                animalSize: 'Est. Animal Size (Geology & Location tab)',
                size: 'Fossil Size (Curation & Value tab)',
                weight: 'Fossil Weight (Curation & Value tab)'
            };
            var zeroIcons = {
                price: '💎',
                animalSize: '🦕',
                size: '📐',
                weight: '⚖️'
            };

            contentHtml = 
                '<div class="scoreboard-zero-state">' +
                    '<div class="scoreboard-zero-icon">' + zeroIcons[criteria] + '</div>' +
                    '<h4 class="scoreboard-zero-title">No Ranked Specimens Found</h4>' +
                    '<p class="scoreboard-zero-desc">There are currently no specimens in your archive with a logged ' + criteriaNames[criteria] + '. You can rank your specimens by updating the <strong>' + criteriaFields[criteria] + '</strong> field in any specimen\'s edit modal!</p>' +
                    '<button class="btn-primary" onclick="app.toggleScoreboard()" style="padding:0.5rem 1.25rem; font-size:0.8rem; border-radius:99px; cursor:pointer;">Return to Charts</button>' +
                '</div>';
        } else {
            // Render scoreboard ranking list
            contentHtml += '<div class="scoreboard-list">';

            topEntries.forEach(function(f, idx) {
                var rank = idx + 1;
                var podiumClass = (rank === 1) ? ' rank-1' : ((rank === 2) ? ' rank-2' : ((rank === 3) ? ' rank-3' : ''));
                var rankText = (rank === 1) ? '🥇' : ((rank === 2) ? '🥈' : ((rank === 3) ? '🥉' : rank));

                // 1. Picture Circle Thumbnail Stage
                var imgHtml = '';
                if (f.images && f.images.length > 0) {
                    var isVid = window.app.isVideo(f.images[0]);
                    if (isVid) {
                        imgHtml = '<video src="' + f.images[0] + '" alt="' + escapeHtml(f.specimen) + '" muted autoplay loop playsinline style="width:100%; height:100%; object-fit:cover; border-radius:50%;"></video>';
                    } else {
                        imgHtml = '<img src="' + f.images[0] + '" alt="' + escapeHtml(f.specimen) + '">';
                    }
                } else {
                    var placeholderIcons = {
                        'Invertebrate': '🐚',
                        'Vertebrate': '🦖',
                        'Plant': '🌿',
                        'Trace': '👣',
                        'Microfossil': '🔬'
                    };
                    var pIcon = placeholderIcons[f.category] || '🦴';
                    imgHtml = '<div class="scoreboard-thumb-placeholder">' + pIcon + '</div>';
                }

                // 2. Parsed Metric Value Highlight Capsule
                var metricText = '';
                if (criteria === 'price') {
                    var currency = f.currency || 'USD';
                    var origPrice = parseFloat(f.price).toLocaleString() + ' ' + currency;
                    if (currency !== 'SEK') {
                        var sekEquiv = Math.round(toSEK(f));
                        metricText = '💰 ' + origPrice + ' <small style="opacity: 0.85; font-size: 0.7rem; font-weight: 500; margin-left: 0.25rem; font-family: monospace;">(~' + sekEquiv.toLocaleString() + ' SEK)</small>';
                    } else {
                        metricText = '💰 ' + origPrice;
                    }
                } else if (criteria === 'animalSize') {
                    metricText = '🦕 ' + parseFloat(f.animalSize) + ' m (' + window.app.getScaleDescription(f.animalSize) + ')';
                } else if (criteria === 'size') {
                    metricText = '📏 ' + formatSpecimenDimensions(f);
                } else if (criteria === 'weight') {
                    metricText = '⚖️ ' + formatSpecimenWeight(f.weight);
                }

                // 3. Render Card item row
                contentHtml += 
                    '<div class="scoreboard-item' + podiumClass + '">' +
                        '<div class="scoreboard-left-group">' +
                            '<div class="scoreboard-rank-badge">' + rankText + '</div>' +
                            '<div class="scoreboard-thumb-stage" onclick="event.stopPropagation(); app.openLightbox(\'' + f.id + '\')">' +
                                imgHtml +
                            '</div>' +
                            '<div class="scoreboard-specimen-info">' +
                                '<div class="scoreboard-specimen-name" onclick="event.stopPropagation(); app.openLightbox(\'' + f.id + '\')">' +
                                    annotateSpecimenName(f.specimen, f) +
                                '</div>' +
                                '<div class="scoreboard-specimen-meta">' +
                                    '<span>ID: ' + escapeHtml(f.id) + '</span> &middot; ' +
                                    '<span>' + escapeHtml(f.category) + '</span> &middot; ' +
                                    '<span class="epoch-badge">' + escapeHtml(f.geologicalPeriod || 'Unknown') + '</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="scoreboard-metric-capsule">' +
                            metricText +
                        '</div>' +
                    '</div>';
            });

            contentHtml += '</div>';
        }

        container.innerHTML = navHtml + contentHtml;
    },

    initFossilMap: function() {
        var container = document.getElementById('fossil-map-container');
        if (!container) return;

        if (!leafletMapInstance) {
            var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            var tileUrl = isDark ? 
                'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' :
                'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
            var attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

            leafletMapInstance = L.map('fossil-map-container', {
                center: [20, 0],
                zoom: 2,
                minZoom: 1.5,
                maxZoom: 18,
                zoomControl: true
            });

            leafletActiveTileLayer = L.tileLayer(tileUrl, {
                attribution: attribution,
                maxZoom: 20
            });
            leafletActiveTileLayer.addTo(leafletMapInstance);

            leafletMarkerGroup = L.layerGroup().addTo(leafletMapInstance);
        }

        setTimeout(function() {
            if (leafletMapInstance) {
                leafletMapInstance.invalidateSize();
            }
        }, 100);
    },

    drawMapMarkers: function() {
        if (!leafletMapInstance || !leafletMarkerGroup) return;
        
        leafletMarkerGroup.clearLayers();
        
        var mapFossils = lightboxFilteredList.filter(function(f) { 
            return f.lat !== undefined && f.lat !== null && !isNaN(f.lat) &&
                   f.lng !== undefined && f.lng !== null && !isNaN(f.lng); 
        });

        var coordGroups = {};
        mapFossils.forEach(function(f) {
            var key = parseFloat(f.lat).toFixed(5) + ',' + parseFloat(f.lng).toFixed(5);
            if (!coordGroups[key]) coordGroups[key] = [];
            coordGroups[key].push(f);
        });
        
        var container = document.getElementById('fossil-map-container');
        if (container) {
            var pill = document.getElementById('map-locations-pill');
            if (!pill) {
                var pillHtml = '<div id="map-locations-pill" style="position: absolute; top: 10px; right: 10px; background: var(--bg-surface-glass, rgba(255, 255, 255, 0.85)); backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); border: 1px solid var(--border-color); border-radius: 1.5rem; padding: 0.4rem 1rem; box-shadow: var(--shadow-sm); z-index: 1000; font-size: 0.75rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.35rem; pointer-events: none; transition: all 0.25s ease; opacity: 0;">' +
                                    '📍 <span id="map-locations-count">0 Specimens Pinned</span>' +
                               '</div>';
                container.insertAdjacentHTML('beforeend', pillHtml);
                pill = document.getElementById('map-locations-pill');
            }
            
            var pillCount = document.getElementById('map-locations-count');
            if (pillCount) {
                var uniqueLocations = Object.keys(coordGroups).length;
                if (mapFossils.length > 0) {
                    pillCount.innerHTML = 'Showing <strong>' + mapFossils.length + '</strong> Specimens (' + uniqueLocations + ' Locations)';
                    pill.style.opacity = '1';
                } else {
                    pillCount.innerHTML = 'No specimens pinned';
                    pill.style.opacity = '0.6';
                }
            }
        }
        
        if (mapFossils.length === 0) return;
        
        for (var key in coordGroups) {
            var group = coordGroups[key];
            var isMultiple = group.length > 1;
            
            group.forEach(function(f, index) {
                var markerLat = parseFloat(f.lat);
                var markerLng = parseFloat(f.lng);
                
                if (isMultiple) {
                    var angle = (index / group.length) * 2 * Math.PI;
                    var radius = 0.015 + (index * 0.008); 
                    markerLat += Math.sin(angle) * radius;
                    markerLng += Math.cos(angle) * radius;
                }
                
                var markerIcon;
                var color = getEraColor(f.geologicalPeriod);
                
                if (f.isSelfFound) {
                    var svgTeardrop = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40" class="fossil-marker-teardrop">' +
                        '<path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25c0-8.3-6.7-15-15-15z" fill="' + color + '" stroke="#fff" stroke-width="1.5"/>' +
                        '<circle cx="15" cy="15" r="5" fill="#fff"/>' +
                        '</svg>';
                    markerIcon = L.divIcon({
                        className: 'custom-fossil-teardrop-icon',
                        html: svgTeardrop,
                        iconSize: [30, 40],
                        iconAnchor: [15, 40],
                        popupAnchor: [0, -35]
                    });
                } else {
                    var svgRadar = '<div class="radar-marker" style="background: ' + color + '; border: 2px solid #fff; box-shadow: 0 0 8px ' + color + ';">' +
                        '<div class="radar-pulse" style="border: 2px solid ' + color + ';"></div>' +
                        '</div>';
                    markerIcon = L.divIcon({
                        className: 'custom-fossil-radar-icon',
                        html: svgRadar,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                        popupAnchor: [0, -10]
                    });
                }
                
                var popupHtml = '<div class="fossil-popup-container">';
                
                if (!isMultiple) {
                    var flag = getFlagHtml(f.country);
                    var isVid = (f.images && f.images.length > 0) ? window.app.isVideo(f.images[0]) : false;
                    var imageHtml = (f.images && f.images.length > 0) ? 
                        (isVid ? '<div class="popup-img-wrapper"><video src="' + f.images[0] + '" class="popup-img" autoplay muted loop playsinline style="width:100%; height:100%; object-fit:cover;"></video></div>' : '<div class="popup-img-wrapper"><img src="' + f.images[0] + '" class="popup-img"></div>') : '';
                    
                    popupHtml += imageHtml +
                        '<div class="popup-content">' +
                            '<span class="popup-era-badge" style="background: ' + color + '; color: #fff;">' + (f.geologicalPeriod || 'Unknown') + '</span>' +
                            '<h3 class="popup-title">' + (f.specimen || 'Unnamed Specimen') + '</h3>' +
                            '<p class="popup-subtitle">' + (f.anatomy ? f.anatomy : 'Specimen') + '</p>' +
                            '<div class="popup-meta-row">📍 ' + (f.formation ? f.formation + ', ' : '') + (f.location ? f.location + ', ' : '') + flag + ' ' + (f.country || 'Unknown') + '</div>' +
                            '<div class="popup-meta-row">⏳ ' + (f.ageMa ? f.ageMa + ' Ma' : 'Unknown Age') + '</div>' +
                            '<div class="popup-actions">' +
                                '<button class="popup-btn" onclick="app.openLightbox(\'' + f.id + '\', 0)">🔬 Inspect Specimen</button>' +
                            '</div>' +
                        '</div>';
                } else {
                    popupHtml += '<div class="popup-stacked-header">' +
                                    '<h4>📍 ' + group.length + ' Specimens at this region</h4>' +
                                 '</div>' +
                                 '<div class="popup-stacked-list">';
                    
                    var orderedGroup = [f].concat(group.filter(function(x) { return x.id !== f.id; }));
                    
                    orderedGroup.forEach(function(item, idx) {
                        var itemColor = getEraColor(item.geologicalPeriod);
                        var isItemVid = (item.images && item.images.length > 0) ? window.app.isVideo(item.images[0]) : false;
                        var imgThumb = (item.images && item.images.length > 0) ? 
                            (isItemVid ? '<video src="' + item.images[0] + '" class="popup-stacked-thumb" autoplay muted loop playsinline style="object-fit:cover;"></video>' : '<img src="' + item.images[0] + '" class="popup-stacked-thumb">') : 
                            '<div class="popup-stacked-thumb-placeholder" style="background: ' + itemColor + ';">🧬</div>';
                        var highlightStyle = idx === 0 ? 'background: var(--bg-warm); border-left: 3px solid var(--accent);' : '';
                            
                        popupHtml += '<div class="popup-stacked-item" style="' + highlightStyle + '">' +
                                        imgThumb +
                                        '<div class="popup-stacked-item-info">' +
                                            '<span class="popup-stacked-item-title" style="font-weight: ' + (idx === 0 ? '700' : '500') + ';">' + (item.specimen || 'Unnamed') + '</span>' +
                                            '<span class="popup-stacked-item-sub">' + (item.geologicalPeriod || 'Unknown') + ' · ' + (item.anatomy || 'Specimen') + '</span>' +
                                        '</div>' +
                                        '<button class="popup-stacked-btn" onclick="app.openLightbox(\'' + item.id + '\', 0)" title="Inspect">🔬</button>' +
                                     '</div>';
                    });
                    
                    popupHtml += '</div>';
                }
                
                popupHtml += '</div>';
                
                var marker = L.marker([markerLat, markerLng], { icon: markerIcon }).addTo(leafletMarkerGroup);
                marker.bindPopup(popupHtml, {
                    maxWidth: 250,
                    minWidth: 220,
                    className: 'fossil-custom-popup'
                });
            });
        }
        
        if (mapFossils.length > 0 && leafletMapInstance) {
            var groupBounds = L.latLngBounds(mapFossils.map(function(f) { return [f.lat, f.lng]; }));
            leafletMapInstance.fitBounds(groupBounds, { padding: [40, 40], maxZoom: 8 });
        }
    },

    showBatchProgress: function(text, current, total) {
        var banner = document.getElementById('batch-progress-banner');
        if (!banner) {
            var html = '<div id="batch-progress-banner" style="display: none; position: fixed; top: 1.5rem; left: 50%; transform: translateX(-50%) translateY(-20px); background: var(--bg-surface-glass, rgba(255, 255, 255, 0.85)); backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); border: 1px solid var(--border-color); border-radius: 2rem; padding: 0.6rem 1.5rem; box-shadow: var(--shadow-md); z-index: 9999; align-items: center; gap: 0.75rem; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; pointer-events: none;">' +
                            '<div class="batch-spinner" style="width: 16px; height: 16px; border: 2px solid var(--accent); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>' +
                            '<span id="batch-progress-text" style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Processing...</span>' +
                            '<div style="width: 80px; height: 6px; background: var(--border-color); border-radius: 3px; overflow: hidden; margin-left: 0.25rem;">' +
                                '<div id="batch-progress-bar" style="width: 0%; height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.2s ease;"></div>' +
                            '</div>' +
                        '</div>';
            document.body.insertAdjacentHTML('beforeend', html);
            banner = document.getElementById('batch-progress-banner');
        }
        
        banner.style.display = 'flex';
        banner.offsetHeight;
        banner.style.opacity = '1';
        banner.style.transform = 'translateX(-50%) translateY(0)';
        banner.style.pointerEvents = 'auto';
        
        var pct = Math.round((current / total) * 100);
        document.getElementById('batch-progress-text').textContent = text + ' (' + current + '/' + total + ')';
        document.getElementById('batch-progress-bar').style.width = pct + '%';
    },

    hideBatchProgress: function() {
        var banner = document.getElementById('batch-progress-banner');
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transform = 'translateX(-50%) translateY(-20px)';
            banner.style.pointerEvents = 'none';
            setTimeout(function() {
                banner.style.display = 'none';
            }, 300);
        }
    },

    renderEarthHistory: function(selectedPeriodName) {
        var container = document.getElementById('earth-history-container');
        if (!container) return;
        
        // If no period is selected, default to Quaternary
        selectedPeriodName = selectedPeriodName || 'Quaternary';
        
        var period = GEOLOGICAL_HISTORY_DATA[selectedPeriodName];
        if (!period) return;
        
        // Count owned fossils per period (from all fossils)
        var counts = {};
        for (var pName in GEOLOGICAL_HISTORY_DATA) {
            counts[pName] = fossils.filter(function(f) {
                if (f.isWishlist) return false;
                var fp = f.geologicalPeriod ? f.geologicalPeriod.trim().toLowerCase() : '';
                return fp === pName.toLowerCase();
            }).length;
        }

        var html = '<div class="earth-history-info-section" style="padding: 1.5rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">';
        
        // Header
        html += '<h3 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">' +
                    '<span style="display: flex; align-items: center; gap: 0.5rem;">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' +
                        'Earth History & Deep Time Encyclopedia' +
                    '</span>' +
                    '<button class="btn-secondary" onclick="app.showMainCharts()" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg> Back to Dashboard' +
                    '</button>' +
                '</h3>';
        
        html += '<p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.5;">' +
                    'Explore the deep geologic history of Earth. Select a geological period from the timeline sidebar on the left to read about its climate, continents, and major evolutionary milestones, and view specimens from your own collection!' +
                '</p>';
        
        // Two-column layout
        html += '<div class="geological-grid" style="display: flex; gap: 1.5rem; flex-wrap: wrap;">';
        
        // Left Column: Period List (Sidebar)
        html += '<div class="geological-sidebar" style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 0.5rem; max-height: 500px; overflow-y: auto; padding-right: 0.5rem; border-right: 1px solid var(--border-color);">';
        
        // Group by Era
        var eras = ['Cenozoic', 'Mesozoic', 'Paleozoic'];
        eras.forEach(function(era) {
            html += '<div class="geological-era-group" style="margin-bottom: 0.75rem;">';
            var eraColor = '#a878d0';
            if (era === 'Cenozoic') eraColor = '#e6a817';
            else if (era === 'Mesozoic') eraColor = '#439775';
            else if (era === 'Paleozoic') eraColor = '#3a8fb7';

            html += '<h4 style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: ' + eraColor + '; letter-spacing: 0.05em; margin-bottom: 0.35rem; display: flex; align-items: center; justify-content: space-between;">' +
                        '<span>' + era + ' Era</span>' +
                    '</h4>';
            
            for (var pName in GEOLOGICAL_HISTORY_DATA) {
                var pData = GEOLOGICAL_HISTORY_DATA[pName];
                if (pData.era === era) {
                    var isActive = pName === selectedPeriodName;
                    var activeStyle = isActive ? 'background: var(--accent-bg); border-color: var(--accent); color: var(--accent); font-weight: 700;' : 'background: var(--bg-warm); border-color: var(--border-color); color: var(--text-primary);';
                    var badgeCount = counts[pName] > 0 ? '<span class="badge" style="font-size: 0.6rem; padding: 1px 6px; background: ' + (isActive ? 'var(--accent)' : 'var(--border-color)') + '; color: ' + (isActive ? '#fff' : 'var(--text-secondary)') + '; border: none;">' + counts[pName] + '</span>' : '';
                    
                    html += '<button onclick="app.renderEarthHistory(\'' + pName + '\')" style="width: 100%; text-align: left; padding: 0.5rem 0.75rem; font-size: 0.8rem; border-radius: var(--radius-sm); border: 1px solid; cursor: pointer; transition: all 0.15s ease; display: flex; align-items: center; justify-content: space-between; ' + activeStyle + '" onmouseover="this.style.borderColor=\'var(--accent)\'" onmouseout="if(\'' + pName + '\' !== \'' + selectedPeriodName + '\') this.style.borderColor=\'var(--border-color)\'">' +
                                '<span>' + pName + ' <small style="font-size: 0.65rem; opacity: 0.7; font-weight: 400; display: block;">' + pData.time + '</small></span>' +
                                badgeCount +
                            '</button>';
                }
            }
            html += '</div>';
        });
        
        html += '</div>'; // End Left Column
        
        // Right Column: Period Detail View
        var eraColor = '#a878d0';
        if (period.era === 'Cenozoic') eraColor = '#e6a817';
        else if (period.era === 'Mesozoic') eraColor = '#439775';
        else if (period.era === 'Paleozoic') eraColor = '#3a8fb7';

        html += '<div class="geological-details" style="flex: 2; min-width: 320px; display: flex; flex-direction: column; gap: 1rem;">';
        
        html += '<div style="background: var(--bg-warm); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">';
        html += '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">' +
                    '<span class="badge" style="background: ' + eraColor + '; color: #fff; border: none; font-size: 0.65rem; padding: 2px 8px;">' + period.era + ' Era</span>' +
                    '<span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">' + period.time + '</span>' +
                '</div>';
        html += '<h2 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 1.8rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">' + selectedPeriodName + ' Period</h2>';
        html += '<p style="font-size: 0.9rem; color: var(--text-primary); line-height: 1.6; margin-bottom: 1rem;">' + period.description + '</p>';
        html += '</div>';
        
        // Climate, Continents, and Evolution Sections
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">';
        
        // Climate Card
        html += '<div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-sm); background: var(--bg-surface);">';
        html += '<h4 style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--accent); margin-bottom: 0.35rem; display: flex; align-items: center; gap: 4px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> Climate</h4>';
        html += '<p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">' + period.climate + '</p>';
        html += '</div>';

        // Continents Card
        html += '<div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-sm); background: var(--bg-surface);">';
        html += '<h4 style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--accent); margin-bottom: 0.35rem; display: flex; align-items: center; gap: 4px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> Geography</h4>';
        html += '<p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">' + period.continent + '</p>';
        html += '</div>';

        // Evolution Card
        html += '<div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-sm); background: var(--bg-surface);">';
        html += '<h4 style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--accent); margin-bottom: 0.35rem; display: flex; align-items: center; gap: 4px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Biota & Evolution</h4>';
        html += '<p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">' + period.evolution + '</p>';
        html += '</div>';

        html += '</div>'; // End Detail Cards
        
        // Show specimens from active collection representing this period
        var periodFossils = fossils.filter(function(f) {
            if (f.isWishlist) return false;
            var fp = f.geologicalPeriod ? f.geologicalPeriod.trim().toLowerCase() : '';
            return fp === selectedPeriodName.toLowerCase();
        });
        
        html += '<div style="border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.5rem;">';
        html += '<h4 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 0.75rem;">Represented Specimens (' + periodFossils.length + ')</h4>';
        if (periodFossils.length > 0) {
            html += '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; max-height: 120px; overflow-y: auto;">';
            periodFossils.forEach(function(f) {
                html += '<span class="badge" style="background: var(--bg-warm); color: var(--text-primary); border-color: var(--border-color); text-transform: none; display: flex; align-items: center; gap: 4px; padding: 0.25rem 0.65rem; border-radius: 4px; font-size: 0.75rem;">' +
                            '<strong>' + escapeHtml(f.specimen) + '</strong>' +
                            (f.anatomy ? ' <small style="opacity: 0.7;">(' + escapeHtml(f.anatomy) + ')</small>' : '') +
                        '</span>';
            });
            html += '</div>';
        } else {
            html += '<div style="font-size: 0.85rem; color: var(--text-secondary); font-style: italic; background: var(--bg-warm); padding: 0.75rem; border-radius: var(--radius-sm); text-align: center; border: 1px dashed var(--border-color);">' +
                        'No specimens from the ' + selectedPeriodName + ' in your active collection. Collect index fossils to bridge this gap!' +
                    '</div>';
        }
        html += '</div>'; // End Specimens
        
        html += '</div>'; // End Right Column
        html += '</div>'; // End Geological Grid
        html += '</div>'; // End main outer div
        
        container.innerHTML = html;
    },

    renderMissingSpecimens: function() {
        var container = document.getElementById('treemap-container');
        if (!container) return;
        
        var ownedFossils = fossils.filter(function(f) { return !f.isWishlist && !f.isSold; });
        var wishlistedFossils = fossils.filter(function(f) { return f.isWishlist && !f.isSold; });
        
        var collectedList = [];
        var wishlistedList = [];
        var missingCandidates = [];
        
        KEY_SPECIMENS.forEach(function(spec) {
            var owned = ownedFossils.some(function(f) {
                var sName = f.specimen ? f.specimen.toLowerCase() : '';
                return sName.indexOf(spec.name.toLowerCase()) !== -1;
            });
            var wishlisted = wishlistedFossils.some(function(f) {
                var sName = f.specimen ? f.specimen.toLowerCase() : '';
                return sName.indexOf(spec.name.toLowerCase()) !== -1;
            });
            
            if (owned) {
                collectedList.push(spec);
            } else if (wishlisted) {
                wishlistedList.push(spec);
            } else {
                missingCandidates.push(spec);
            }
        });

        // Compute collection statistics for dynamic recommendations
        var ownedPeriods = new Set();
        ownedFossils.forEach(function(f) {
            if (f.geologicalPeriod) {
                ownedPeriods.add(f.geologicalPeriod.trim().toLowerCase());
            }
        });

        var ownedCategories = new Set();
        ownedFossils.forEach(function(f) {
            if (f.category) {
                ownedCategories.add(f.category.trim().toLowerCase());
            }
        });

        // Generate dynamic suggestions with reasoning
        var recommendations = missingCandidates.map(function(spec) {
            var periodLower = spec.period ? spec.period.trim().toLowerCase() : '';
            var catLower = spec.category ? spec.category.trim().toLowerCase() : '';

            // Rule 1: Geologic Time Gap
            if (!ownedPeriods.has(periodLower)) {
                return {
                    spec: spec,
                    badge: '🌍 Geologic Time Gap',
                    badgeColor: 'var(--danger)', // Brick red
                    badgeBg: 'rgba(235, 94, 85, 0.08)',
                    badgeBorder: 'rgba(235, 94, 85, 0.25)',
                    rationale: 'Your archive currently has 0 specimens from the ' + spec.period + ' period. Collecting this will fill a major temporal gap!',
                    priority: 1
                };
            }

            // Rule 2: Taxonomic Gap
            if (!ownedCategories.has(catLower)) {
                return {
                    spec: spec,
                    badge: '🌿 Taxonomic Gap',
                    badgeColor: 'var(--accent)', // Purple/blue
                    badgeBg: 'rgba(120, 80, 160, 0.08)',
                    badgeBorder: 'rgba(120, 80, 160, 0.25)',
                    rationale: 'You have 0 owned ' + spec.category + ' specimens. Broaden your collection taxonomy by targeting this ' + spec.category.toLowerCase() + '.',
                    priority: 2
                };
            }

            // Rule 3: Ecosystem Companion
            if (ownedPeriods.has(periodLower)) {
                var companionCount = ownedFossils.filter(function(x) { 
                    var xp = x.geologicalPeriod ? x.geologicalPeriod.trim().toLowerCase() : '';
                    return xp === periodLower; 
                }).length;
                return {
                    spec: spec,
                    badge: '🦖 Ecosystem Companion',
                    badgeColor: '#e6a817', // Amber/gold
                    badgeBg: 'rgba(230, 168, 23, 0.08)',
                    badgeBorder: 'rgba(230, 168, 23, 0.25)',
                    rationale: 'You own ' + companionCount + ' specimen(s) from the ' + spec.period + '. Add ' + spec.name + ' to complete your ' + spec.period + ' drawer!',
                    priority: 3
                };
            }

            // Rule 4: Evolutionary Landmark (Default)
            return {
                spec: spec,
                badge: '⚡ Evolutionary Landmark',
                badgeColor: '#2db3a1', // Teal
                badgeBg: 'rgba(45, 179, 161, 0.08)',
                badgeBorder: 'rgba(45, 179, 161, 0.25)',
                rationale: 'A legendary index fossil demonstrating key prehistoric evolutionary milestones.',
                priority: 4
            };
        });

        // Sort recommendations: Gaps first, then companions, then standard landmarks
        recommendations.sort(function(a, b) {
            return a.priority - b.priority;
        });

        var html = '<div class="missing-specimens-section" style="padding: 1.5rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">';
        
        // Header
        html += '<h3 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">' +
                    '<span style="display: flex; align-items: center; gap: 0.5rem;">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>' +
                        'Specimen Discovery & Gaps Album' +
                    '</span>' +
                    '<button class="btn-secondary" onclick="app.showMainCharts()" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg> Back to Dashboard' +
                    '</button>' +
                '</h3>';
        
        html += '<p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.5;">' +
                    'Track important evolutionary index fossils in Earth\'s history. This album lists legendary specimens that are currently missing from your active collection. You can add them to your Wishlist with a single click to help complete your archive!' +
                '</p>';
                
        // Progress Bar
        var totalKey = KEY_SPECIMENS.length;
        var collectedCount = collectedList.length;
        var progressPercent = Math.round((collectedCount / totalKey) * 100);
        html += '<div style="margin-bottom: 1.5rem;">' +
                    '<div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">' +
                        '<span>Prehistoric Milestones Album (Legendary Index Fossils)</span>' +
                        '<span>' + collectedCount + ' / ' + totalKey + ' Specimens (' + progressPercent + '%)</span>' +
                    '</div>' +
                    '<div style="width: 100%; height: 8px; background: var(--bg-warm); border-radius: 4px; overflow: hidden; border: 1px solid var(--border-color);">' +
                        '<div style="width: ' + progressPercent + '%; height: 100%; background: var(--accent); transition: width 0.3s ease;"></div>' +
                    '</div>' +
                    '<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.35rem; line-height: 1.3;">' +
                        'ℹ️ Tracks specifically your collection representation of the 27 legendary index species defined in our geologic discovery catalog.' +
                    '</div>' +
                '</div>';
                
        // Section 1: Dynamic Recommendations & Gaps
        html += '<div style="margin-bottom: 2rem;">';
        html += '<h4 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">' +
                    '<span style="color: var(--danger); font-size: 1.3rem;">&bull;</span> Recommended Discovery Targets (' + recommendations.length + ')' +
                '</h4>';
        if (recommendations.length > 0) {
            html += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">';
            recommendations.forEach(function(rec) {
                html += '<div style="border: 1px solid var(--border-color); border-left: 4px solid ' + rec.badgeColor + '; background: var(--bg-warm); padding: 1rem; border-radius: var(--radius-sm); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.15s ease;">' +
                            '<div>' +
                                '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 4px;">' +
                                    '<span style="font-size: 0.65rem; background: ' + rec.badgeBg + '; color: ' + rec.badgeColor + '; border: 1px solid ' + rec.badgeBorder + '; padding: 2px 8px; border-radius: 99px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">' +
                                        rec.badge +
                                    '</span>' +
                                    '<span style="font-size: 0.65rem; background: var(--border-color); color: var(--text-secondary); padding: 2px 6px; border-radius: 99px; text-transform: uppercase; font-weight: 700;">' + rec.spec.period + '</span>' +
                                '</div>' +
                                '<h5 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">' + rec.spec.name + '</h5>' +
                                '<div style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; font-style: italic;">' + rec.spec.importance + ' · <span style="text-transform: capitalize;">' + rec.spec.category + '</span></div>' +
                                '<p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 0.75rem;">' + rec.spec.description + '</p>' +
                                '<p style="font-size: 0.75rem; color: var(--text-primary); background: var(--bg-surface); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color); line-height: 1.3; margin-bottom: 1rem; font-style: italic; font-weight: 500;">' +
                                    '💡 <strong>Why this?</strong> ' + rec.rationale +
                                '</p>' +
                            '</div>' +
                            '<button onclick="app.addSpecimenToWishlist(\'' + rec.spec.name.replace(/'/g, "\\'") + '\', \'' + rec.spec.category + '\', \'' + rec.spec.period + '\')" style="width: 100%; border: 1px solid var(--accent); color: var(--accent); background: transparent; padding: 0.4rem; font-size: 0.75rem; font-weight: 700; cursor: pointer; border-radius: 4px; transition: all 0.2s;" onmouseover="this.style.background=\'var(--accent-bg)\'" onmouseout="this.style.background=\'transparent\'">+ Add to Wishlist</button>' +
                        '</div>';
            });
            html += '</div>';
        } else {
            html += '<div style="font-size: 0.85rem; color: var(--text-secondary); font-style: italic; background: var(--bg-warm); padding: 0.75rem; border-radius: var(--radius-sm); text-align: center; border: 1px dashed var(--border-color);">You have targeted or collected all iconic specimens! Marvelous achievement!</div>';
        }
        html += '</div>';
        
        // Section 2: Wishlisted Index Specimens
        if (wishlistedList.length > 0) {
            html += '<div style="margin-bottom: 2rem;">';
            html += '<h4 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">' +
                        '<span style="color: var(--wishlist-color); font-size: 1.3rem;">&bull;</span> Wishlisted Index Specimens (' + wishlistedList.length + ')' +
                    '</h4>';
            html += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">';
            wishlistedList.forEach(function(spec) {
                html += '<div style="border: 1px dashed var(--wishlist-color); background: rgba(120, 80, 160, 0.03); padding: 1rem; border-radius: var(--radius-sm); display: flex; flex-direction: column; justify-content: space-between; opacity: 0.9;">' +
                            '<div>' +
                                '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">' +
                                    '<span style="font-size: 0.65rem; background: var(--wishlist-bg); color: var(--wishlist-color); padding: 2px 6px; border-radius: 99px; text-transform: uppercase; font-weight: 700;">' + spec.period + '</span>' +
                                    '<span style="font-size: 0.65rem; background: var(--wishlist-bg); color: var(--wishlist-color); padding: 2px 6px; border-radius: 99px; text-transform: uppercase; font-weight: 700;">Wishlisted</span>' +
                                '</div>' +
                                '<h5 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">' + spec.name + '</h5>' +
                                '<div style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; font-style: italic;">' + spec.importance + '</div>' +
                                '<p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">' + spec.description + '</p>' +
                            '</div>' +
                        '</div>';
            });
            html += '</div>';
            html += '</div>';
        }
        
        // Section 3: Collected Specimens
        if (collectedList.length > 0) {
            html += '<div style="margin-bottom: 0.5rem;">';
            html += '<h4 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">' +
                        '<span style="color: #2db3a1; font-size: 1.3rem;">&bull;</span> Iconic Index Fossils Collected (' + collectedList.length + ' of ' + totalKey + ')' +
                    '</h4>';
            html += '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">';
            collectedList.forEach(function(spec) {
                html += '<span class="badge" style="background: rgba(45, 179, 161, 0.08); color: #2db3a1; border-color: rgba(45, 179, 161, 0.25); text-transform: none; display: inline-flex; align-items: center; gap: 6px; padding: 0.35rem 0.75rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
                            spec.name + 
                            ' <small style="opacity: 0.7; font-weight: 400;">(' + spec.period + ')</small>' +
                        '</span>';
            });
            html += '</div>';
            html += '</div>';
        }
        
        html += '</div>';
        container.innerHTML = html;
    },

    addSpecimenToWishlist: function(name, category, period) {
        var newFossil = {
            id: generateCatalogId(category, fossils),
            specimen: name,
            category: category,
            isWishlist: true,
            isSold: false,
            geologicalPeriod: period,
            ageMa: PERIOD_AGES[period] || 0,
            notes: 'Added automatically from Geologic Discovery Recommendations.',
            tags: ['discovery', 'index-fossil'],
            images: [],
            createdAt: Date.now()
        };
        
        addFossil(newFossil).then(function() {
            window.app.showToast('"' + name + '" added to your Wishlist!', 'success');
            getAllFossils().then(function(allFossils) {
                fossils = allFossils;
                window.app.renderMissingSpecimens();
                window.app.renderFossils();
            });
        });
    },

    // --- Modal ---
    openModal: function(id) {
        var modal = document.getElementById('fossil-modal');
        var form = document.getElementById('fossil-form');
        document.getElementById('modal-title').innerText = id ? 'Edit Fossil' : 'Add New Fossil';
        form.reset();
        currentImages = [];
        window.app.renderImagePreview();
        if (document.getElementById('modal-flag-preview')) {
            document.getElementById('modal-flag-preview').innerHTML = '';
        }

        // Reset active tab to classification
        window.app.setModalTab('classification');

        if (id) {
            var f = fossils.find(function(x) { return x.id === id; });
            if (f) {
                document.getElementById('fossil-id').value = f.id;
                document.getElementById('f-specimen').value = f.specimen || '';
                document.getElementById('f-animal-size').value = f.animalSize || '';
                document.getElementById('f-anatomy').value = f.anatomy || '';
                document.getElementById('f-category').value = f.category || '';
                document.getElementById('f-type').value = f.fossilType || '';
                if (f.isSold) {
                    document.getElementById('f-wishlist').value = 'sold';
                    document.getElementById('f-sale-price').value = f.salePrice || '';
                    document.getElementById('f-sale-currency').value = f.saleCurrency || 'USD';
                } else if (f.isForSale) {
                    document.getElementById('f-wishlist').value = 'sale';
                    document.getElementById('f-sale-price').value = f.salePrice || '';
                    document.getElementById('f-sale-currency').value = f.saleCurrency || 'USD';
                } else {
                    document.getElementById('f-wishlist').value = f.isWishlist ? 'true' : 'false';
                    document.getElementById('f-sale-price').value = '';
                    document.getElementById('f-sale-currency').value = 'USD';
                }
                window.app.toggleSalePriceField();
                document.getElementById('f-self-found').checked = !!f.isSelfFound;
                document.getElementById('f-period').value = f.geologicalPeriod || '';
                window.app.updateEpochs(f.epoch);
                window.app.updateStratAges(f.stratAge);
                var ageVal = f.ageMa || 0;
                document.getElementById('f-age').value = ageVal;
                document.getElementById('f-age-slider').value = ageVal;
                document.getElementById('f-country').value = f.country || '';
                window.app.updateModalFlag();
                document.getElementById('f-location').value = f.location || '';
                document.getElementById('f-formation').value = f.formation || '';
                document.getElementById('f-lat').value = f.lat !== undefined && f.lat !== null ? f.lat : '';
                document.getElementById('f-lng').value = f.lng !== undefined && f.lng !== null ? f.lng : '';
                document.getElementById('f-size').value = f.size || '';
                document.getElementById('f-size-unit').value = f.sizeUnit || 'cm';
                document.getElementById('f-width').value = f.width || '';
                document.getElementById('f-thickness').value = f.thickness || '';
                var val = f.sizeUnit || 'cm';
                var wDisp = document.getElementById('f-width-unit-display');
                var tDisp = document.getElementById('f-thickness-unit-display');
                if (wDisp) wDisp.textContent = val;
                if (tDisp) tDisp.textContent = val;
                document.getElementById('f-weight').value = f.weight || '';
                document.getElementById('f-price').value = f.price || '';
                document.getElementById('f-currency').value = f.currency || 'USD';
                document.getElementById('f-est-value').value = f.estimatedValue || '';
                document.getElementById('f-est-currency').value = f.estimatedCurrency || 'USD';
                document.getElementById('f-link').value = f.sourceUrl || '';
                document.getElementById('f-notes').value = f.notes || '';
                document.getElementById('f-etymology').value = f.etymology || '';
                document.getElementById('f-restoration').value = f.restorationDetails || '';
                document.getElementById('f-authority').value = f.authority || '';
                document.getElementById('f-description').value = f.description || '';
                document.getElementById('f-condition-tier').value = f.conditionTier || '';
                document.getElementById('f-tags').value = (f.tags || []).join(', ');

                // Condition report checkboxes
                var cond = f.condition || {};
                document.getElementById('cond-stable').checked = cond.stable !== undefined ? !!cond.stable : true;
                document.getElementById('cond-cracking').checked = !!cond.cracking;
                document.getElementById('cond-efflorescence').checked = !!cond.efflorescence;
                document.getElementById('cond-pyrite').checked = !!cond.pyrite;

                // Treatment history checkboxes
                var treat = f.treatment || {};
                document.getElementById('treat-paraloid').checked = !!treat.paraloid;
                document.getElementById('treat-scribe').checked = !!treat.scribe;
                document.getElementById('treat-cyano').checked = !!treat.cyano;
                document.getElementById('treat-water').checked = !!treat.water;

                if (f.images && Array.isArray(f.images)) {
                    currentImages = f.images.slice();
                    window.app.renderImagePreview();
                }
            }
        } else {
            document.getElementById('f-specimen').value = '';
            document.getElementById('f-animal-size').value = '';
            document.getElementById('fossil-id').value = '';
            document.getElementById('f-anatomy').value = '';
            document.getElementById('f-age').value = 0;
            document.getElementById('f-age-slider').value = 0;
            document.getElementById('f-size-unit').value = 'cm';
            document.getElementById('f-width').value = '';
            document.getElementById('f-thickness').value = '';
            var wDisp = document.getElementById('f-width-unit-display');
            var tDisp = document.getElementById('f-thickness-unit-display');
            if (wDisp) wDisp.textContent = 'cm';
            if (tDisp) tDisp.textContent = 'cm';
            document.getElementById('f-currency').value = 'USD';
            document.getElementById('f-est-value').value = '';
            document.getElementById('f-est-currency').value = 'USD';
            document.getElementById('f-link').value = '';
            document.getElementById('f-etymology').value = '';
            document.getElementById('f-restoration').value = '';
            document.getElementById('f-authority').value = '';
            document.getElementById('f-description').value = '';
            document.getElementById('f-condition-tier').value = '';
            document.getElementById('f-type').value = '';
            document.getElementById('f-tags').value = '';
            document.getElementById('f-lat').value = '';
            document.getElementById('f-lng').value = '';

            // Reset condition checkboxes to stable
            document.getElementById('cond-stable').checked = true;
            document.getElementById('cond-cracking').checked = false;
            document.getElementById('cond-efflorescence').checked = false;
            document.getElementById('cond-pyrite').checked = false;

            // Reset treatment checkboxes
            document.getElementById('treat-paraloid').checked = false;
            document.getElementById('treat-scribe').checked = false;
            document.getElementById('treat-cyano').checked = false;
            document.getElementById('treat-water').checked = false;

            // Auto-load last used geography/geology for batch logging
            document.getElementById('f-country').value = localStorage.getItem('last_country') || '';
            window.app.updateModalFlag();
            document.getElementById('f-location').value = localStorage.getItem('last_location') || '';
            document.getElementById('f-formation').value = localStorage.getItem('last_formation') || '';
            document.getElementById('f-period').value = localStorage.getItem('last_period') || '';
            document.getElementById('f-self-found').checked = false;
            document.getElementById('f-wishlist').value = 'false';
            document.getElementById('f-sale-price').value = '';
            document.getElementById('f-sale-currency').value = 'USD';
            window.app.toggleSalePriceField();
            
            window.app.updateEpochs(localStorage.getItem('last_epoch') || '');
            window.app.updateStratAges(localStorage.getItem('last_stratAge') || '');
        }

        modal.showModal();
    },

    closeModal: function() {
        document.getElementById('fossil-modal').close();
    },

    autoFetchAllSpecimenData: async function(event) {
        var name = document.getElementById('f-specimen').value;
        if (!name) { 
            window.app.showToast('Please enter a specimen name first.', 'warning'); 
            return; 
        }
        
        var btn = event ? event.currentTarget : null;
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="loading-spinner" style="width:12px; height:12px; border-width:2px; border-color: white; border-top-color: transparent;"></span> Fetching All...';
        }

        try {
            window.app.showToast('Initiating Auto-Fetch for all taxonomy, biology, and location data...', 'info');
            var genus = name.split(' ')[0];

            // 1. Fetch Scientific Info in parallel
            var results = await Promise.allSettled([
                window.app.fetchTaxonomy(genus),
                window.app.fetchEtymology(genus),
                window.app.fetchWikipediaSummary(genus)
            ]);
            
            var tax = results[0].status === 'fulfilled' ? results[0].value : null;
            var etym = results[1].status === 'fulfilled' ? results[1].value : null;
            var wikiDesc = results[2].status === 'fulfilled' ? results[2].value : null;

            // Update DOM fields for scientific info
            var localSize = window.app.autoSizeLookup();

            if (tax) {
                if (tax.period) document.getElementById('f-period').value = tax.period;
                if (tax.age) {
                    document.getElementById('f-age').value = tax.age;
                    document.getElementById('f-age-slider').value = Math.min(tax.age, 541);
                    window.app.updateDropdownsFromAge();
                }
                if (tax.authority) {
                    document.getElementById('f-authority').value = tax.authority;
                }
            }

            if (wikiDesc) {
                document.getElementById('f-description').value = wikiDesc;
            }

            if (etym) {
                document.getElementById('f-etymology').value = etym;
                if (!localSize) {
                    var extractedSize = window.app.extractSizeFromText(etym);
                    if (extractedSize) {
                        document.getElementById('f-animal-size').value = extractedSize;
                    }
                }
            }

            // 2. Perform Geocoding coordinates fetch in parallel (if location info exists)
            var country = document.getElementById('f-country').value.trim();
            var location = document.getElementById('f-location').value.trim();
            var formation = document.getElementById('f-formation').value.trim();

            if (country || location || formation) {
                var queries = getSmartGeocodeQueries(location, formation, country);
                if (queries.length > 0) {
                    trySmartGeocode(queries, 0, function(result, matchedQuery) {
                        var lat = parseFloat(result.lat);
                        var lon = parseFloat(result.lon);
                        document.getElementById('f-lat').value = lat.toFixed(6);
                        document.getElementById('f-lng').value = lon.toFixed(6);
                        window.app.showToast('⚡ Auto-fetched all taxonomy, prehistoric biology, and geocoded coordinates successfully!', 'success');
                    }, function() {
                        window.app.showToast('Fetched taxonomy & biology successfully, but could not geocode coordinates.', 'warning');
                    });
                } else {
                    window.app.showToast('⚡ Auto-fetched scientific taxonomy & biology successfully!', 'success');
                }
            } else {
                window.app.showToast('⚡ Auto-fetched taxonomy & biology! (To auto-geocode coordinates, add Location/Country and click again).', 'success');
            }

        } catch (err) {
            console.error('Unified Auto-Fetch failed', err);
            window.app.showToast('Auto-Fetch encountered an error.', 'error');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '⚡ Auto-Fetch All';
            }
        }
    },

    fetchScientificInfo: async function(event) {
        var name = document.getElementById('f-specimen').value;
        if (!name) { window.app.showToast('Please enter a specimen name first.', 'warning'); return; }
        
        var genus = name.split(' ')[0];
        var btn = event ? event.currentTarget : null;
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="loading-spinner" style="width:12px; height:12px; border-width:2px;"></span> Fetching...';
        }

        try {
            // Parallel fetch
            var results = await Promise.allSettled([
                window.app.fetchTaxonomy(genus),
                window.app.fetchEtymology(genus),
                window.app.fetchWikipediaSummary(genus)
            ]);
            
            var tax = results[0].status === 'fulfilled' ? results[0].value : null;
            var etym = results[1].status === 'fulfilled' ? results[1].value : null;
            var wikiDesc = results[2].status === 'fulfilled' ? results[2].value : null;

            // 1. Check local size database first
            var localSize = window.app.autoSizeLookup();

            if (tax) {
                if (tax.period) document.getElementById('f-period').value = tax.period;
                if (tax.age) {
                    document.getElementById('f-age').value = tax.age;
                    document.getElementById('f-age-slider').value = Math.min(tax.age, 541);
                    window.app.updateDropdownsFromAge();
                }
                if (tax.authority) {
                    document.getElementById('f-authority').value = tax.authority;
                }
            }

            if (wikiDesc) {
                document.getElementById('f-description').value = wikiDesc;
            }

            if (etym) {
                document.getElementById('f-etymology').value = etym;
                // If not found in local DB, try to extract from Wikipedia text
                if (!localSize) {
                    var extractedSize = window.app.extractSizeFromText(etym);
                    if (extractedSize) {
                        document.getElementById('f-animal-size').value = extractedSize;
                    }
                }
            } else if (!tax && !wikiDesc) {
                window.app.showToast('No definitive scientific data found for "' + genus + '".', 'info');
            }
        } catch (err) {
            console.error('Fetch failed', err);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Fetch info';
            }
        }
    },

    autoSizeLookup: function() {
        var nameElem = document.getElementById('f-specimen');
        var sizeElem = document.getElementById('f-animal-size');
        if (!nameElem || !sizeElem) return null;

        var name = nameElem.value;
        if (!name) return null;
        
        var nameLower = name.toLowerCase().trim();
        var words = nameLower.split(/\s+/);
        
        // Strategy: 
        // 1. Check full string (e.g. "Woolly Mammoth")
        // 2. Check each word (e.g. "Megalodon" in "Otodus Megalodon")
        var size = PREHISTORIC_SIZES[nameLower];
        
        if (!size) {
            for (var i = 0; i < words.length; i++) {
                var word = words[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""); // strip punctuation
                if (PREHISTORIC_SIZES[word]) {
                    size = PREHISTORIC_SIZES[word];
                    break;
                }
            }
        }

        if (size) {
            sizeElem.value = size;
        }
        return size;
    },

    getScaleDescription: function(size) {
        if (!size) return '';
        var s = parseFloat(size);
        if (s < 0.03) return 'Penny sized';
        if (s < 0.15) return 'Palm sized';
        if (s < 0.5) return 'Hand sized';
        if (s < 1.5) return 'Dog sized';
        if (s < 2.5) return 'Human sized';
        if (s < 6) return 'Car sized';
        if (s < 15) return 'Bus sized';
        return 'Colossal';
    },

    extractSizeFromText: function(text) {
        if (!text) return null;
        
        // 1. Aggressive cleaning of non-size numbers (Million years, weights, depths)
        var cleanText = text
            .replace(/\d+(?:\.\d+)?\s*(?:million years|mya|Ma)\b/gi, '') // ages
            .replace(/\b(?:at depths? of|down to|below sea level)\s*(?:of\s+)?(?:\d+(?:\.\d+)?\s*(?:m|ft)\s*)+\b/gi, '') // very specific depths
            .replace(/\d+(?:\.\d+)?\s*(?:kg|lbs?|tonnes?|pounds?)\b/gi, ''); // weights

        // 2. Multipurpose regex for units
        var sizeRegex = /(?:(?:up to|reach|attaining|measured|around|estimated|approximately|approx|length of|height of|diameter of|across|wide|width|long|average|mean|total length|tl|sl|diameter|size|d|w)\s+)?(?:(\d+(?:\.\d+)?)(?:\s*(?:-|–|to)\s*(\d+(?:\.\d+)?))?)\s*(m|meter|meters|cm|centimeter|centimeters|mm|millimeter|millimeters|ft|feet|in|inch|inches)\b/gi;

        var matches = Array.from(cleanText.matchAll(sizeRegex));
        if (matches.length === 0) return null;

        // NEW LOGIC: Take the FIRST significant adult size mentioned.
        // REJECTION: Only reject if the number is IMMEDIATELY preceded by 'depth of' (within 15 chars).
        for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            var startIdx = match.index;
            var prep = cleanText.substring(Math.max(0, startIdx - 15), startIdx).toLowerCase();
            
            if (prep.includes('depth') || prep.includes('deep') || prep.includes('weigh')) {
                continue;
            }

            var minVal = parseFloat(match[1]);
            var maxVal = match[2] ? parseFloat(match[2]) : minVal;
            var val = (minVal + maxVal) / 2; // Use average of the range for realism
            var unit = match[3].toLowerCase();
            var meters = val;

            if (unit.startsWith('cm')) meters = val / 100;
            else if (unit.startsWith('mm')) meters = val / 1000;
            else if (unit.startsWith('f')) meters = val * 0.3048;
            else if (unit.startsWith('i')) meters = val * 0.0254;

            if (meters > 0.001 && meters < 40) {
                return Math.round(meters * 10) / 10; 
            }
        }
        
        return null;
    },

    fetchTaxonomy: async function(name) {
        try {
            var url = 'https://paleobiodb.org/data1.2/taxa/list.json?name=' + encodeURIComponent(name) + '&rel=all';
            var resp = await fetch(url);
            var data = await resp.json();
            if (data.records && data.records.length > 0) {
                var r = data.records[0];
                // PBDB doesn't give a simple "Period", but we can try to find one via age
                var age = (r.eag + r.lag) / 2;
                return { age: age, authority: r.att || '' };
            }
        } catch (e) { console.error('PBDB error', e); }
        return null;
    },

    fetchWikipediaSummary: async function(name) {
        try {
            var url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(name);
            var resp = await fetch(url);
            if (!resp.ok) return null;
            var data = await resp.json();
            return data.extract || '';
        } catch (e) { console.error('Wikipedia summary error', e); }
        return null;
    },

    fetchEtymology: async function(name) {
        try {
            var url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(name);
            var resp = await fetch(url);
            if (!resp.ok) return null;
            var data = await resp.json();
            var summary = data.extract || '';
            
            // 1. Clean summary and split into sentences
            var cleanSummary = summary.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' '); 
            var sentences = cleanSummary.split(/[.!?] /);
            
            // 2. High priority keywords
            var etymSentence = sentences.find(function(s) {
                var l = s.toLowerCase();
                return l.includes('derived from') || l.includes('named in honor') || l.includes('meaning') || l.includes('named after') || l.includes('from the greek') || l.includes('from the latin');
            });

            // 3. Medium priority (mentions greek/latin without "from")
            if (!etymSentence) {
                etymSentence = sentences.find(function(s) {
                    var l = s.toLowerCase();
                    return l.includes('greek') || l.includes('latin') || l.includes('ancient greek');
                });
            }

            // 4. Fallback: First sentence (usually "Genus is a...")
            if (!etymSentence && sentences[0]) {
                etymSentence = sentences[0];
            }

            if (etymSentence) {
                var final = etymSentence.trim();
                if (!final.endsWith('.')) final += '.';
                return final;
            }
        } catch (e) { console.error('Wikipedia error', e); }
        return null;
    },

    updateModalFlag: function() {
        var input = document.getElementById('f-country');
        var preview = document.getElementById('modal-flag-preview');
        if (input && preview) {
            preview.innerHTML = getFlagHtml(input.value);
        }
    },

    // --- Epoch / Age helpers ---
    updateEpochs: function(preselectEpoch) {
        preselectEpoch = preselectEpoch || '';
        var period = document.getElementById('f-period').value;
        var sel = document.getElementById('f-epoch');
        sel.innerHTML = '<option value="">— Select Epoch —</option>';

        if (period) {
            var epochs = getEpochsForPeriod(period);
            epochs.forEach(function(ep) {
                var opt = document.createElement('option');
                opt.value = ep;
                opt.textContent = ep;
                sel.appendChild(opt);
            });
        } else {
            // Show ALL epochs grouped by period
            getPeriodsGrouped().forEach(function(group) {
                group.periods.forEach(function(per) {
                    var epochs = getEpochsForPeriod(per);
                    if (epochs.length > 0) {
                        var og = document.createElement('optgroup');
                        og.label = per;
                        epochs.forEach(function(ep) {
                            var opt = document.createElement('option');
                            opt.value = ep;
                            opt.textContent = ep;
                            og.appendChild(opt);
                        });
                        sel.appendChild(og);
                    }
                });
            });
        }

        if (preselectEpoch) { sel.value = preselectEpoch; }
    },

    updateStratAges: function(preselectAge) {
        preselectAge = preselectAge || '';
        var epoch = document.getElementById('f-epoch').value;
        var period = document.getElementById('f-period').value;
        var sel = document.getElementById('f-strat-age');
        sel.innerHTML = '<option value="">— Select Age —</option>';

        if (epoch) {
            var ages = getAgesForEpoch(epoch);
            ages.forEach(function(a) {
                var opt = document.createElement('option');
                opt.value = a;
                opt.textContent = a;
                sel.appendChild(opt);
            });
        } else if (period) {
            var epochs = getEpochsForPeriod(period);
            epochs.forEach(function(ep) {
                var ages = getAgesForEpoch(ep);
                if (ages.length > 0) {
                    var og = document.createElement('optgroup');
                    og.label = ep;
                    ages.forEach(function(a) {
                        var opt = document.createElement('option');
                        opt.value = a;
                        opt.textContent = a;
                        og.appendChild(opt);
                    });
                    sel.appendChild(og);
                }
            });
        }
        if (preselectAge) { sel.value = preselectAge; }
    },

    updateAgeSlider: function() {
        var period = document.getElementById('f-period').value;
        if (period && PERIOD_AGES[period] !== undefined) {
            var age = PERIOD_AGES[period];
            document.getElementById('f-age').value = age;
            document.getElementById('f-age-slider').value = age;
        }
    },

    updateDropdownsFromAge: function() {
        var age = Number(document.getElementById('f-age').value);
        var res = null;
        for (var i = 0; i < AGE_RANGES.length; i++) {
            if (age <= AGE_RANGES[i].max) {
                res = AGE_RANGES[i];
                break;
            }
        }
        if (res && res.period) {
            document.getElementById('f-period').value = res.period;
            window.app.updateEpochs(res.epoch);
            window.app.updateStratAges(res.age || '');
        }
    },

    // --- View toggle ---
    setView: function(view) {
        currentView = view;
        document.getElementById('btn-collection').classList.toggle('active', view === 'false');
        document.getElementById('btn-wishlist').classList.toggle('active', view === 'true');
        if (document.getElementById('btn-sold')) {
            document.getElementById('btn-sold').classList.toggle('active', view === 'sold');
        }
        if (document.getElementById('btn-sale')) {
            document.getElementById('btn-sale').classList.toggle('active', view === 'sale');
        }
        window.app.renderFossils();
    },

    // --- Images ---
    handleImageUpload: async function(event) {
        var files = event.target.files;
        if (!files || files.length === 0) return;

        var inputElement = event.target;
        var processFile = function(file) {
            return new Promise(function(resolve) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    if (e.target.result) {
                        if (file.type && file.type.startsWith('video/')) {
                            currentImages.push(e.target.result);
                            resolve();
                        } else {
                            downscaleImage(e.target.result, 1200, 0.85).then(function(optimizedStr) {
                                currentImages.push(optimizedStr);
                                resolve();
                            }).catch(function(err) {
                                console.error('Image optimization failed', err);
                                currentImages.push(e.target.result); // Fallback to original
                                resolve();
                            });
                        }
                    } else {
                        resolve();
                    }
                };
                reader.readAsDataURL(file);
            });
        };

        var previewContainer = document.getElementById('image-preview');
        var existingLoader = document.getElementById('heic-processing');
        if (existingLoader) existingLoader.remove();

        var showLoader = function(msg) {
            var loader = document.getElementById('heic-processing');
            if (!loader) {
                loader = document.createElement('div');
                loader.id = 'heic-processing';
                loader.className = 'processing-indicator';
                if (previewContainer) previewContainer.insertAdjacentElement('beforebegin', loader);
            }
            loader.innerHTML = '<span class="loading-spinner"></span> ' + msg;
            return loader;
        };

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var isHeic = file.type === 'image/heic' || (file.name && (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')));

            if (isHeic && typeof heic2any !== 'undefined') {
                showLoader('Converting iPhone photo ' + (i + 1) + ' of ' + files.length + ' format (may take a moment)...');
                try {
                    // Convert sequentially to prevent memory spike crashes
                    var resultBlob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
                    var processBlob = Array.isArray(resultBlob) ? resultBlob[0] : resultBlob;
                    await processFile(processBlob);
                } catch (e) {
                    console.error("HEIC conversion error", e);
                    showLoader('<span style="color:var(--danger)">Failed to process photo ' + (i + 1) + '. It may be too large.</span>');
                    await new Promise(function(r) { setTimeout(r, 2000); });
                    await processFile(file); // Try native fallback anyway
                }
            } else {
                if (isHeic && typeof heic2any === 'undefined') {
                    window.app.showToast('Connecting to the internet is required to process HEIC iPhone photos.', 'warning');
                }
                await processFile(file);
            }
        }

        var finalLoader = document.getElementById('heic-processing');
        if (finalLoader) finalLoader.remove();

        // Render preview once all files are in the array
        window.app.renderImagePreview();
        
        // Reset the file input so the user can upload the same files again if needed
        inputElement.value = '';
    },

    renderImagePreview: function() {
        var container = document.getElementById('image-preview');
        container.innerHTML = '';
        currentImages.forEach(function(imgSrc, index) {
            var imgContainer = document.createElement('div');
            imgContainer.className = 'img-preview-item-wrapper';
            
            var mediaEl;
            var isVideo = imgSrc.startsWith('data:video/') || imgSrc.toLowerCase().endsWith('.mp4') || imgSrc.toLowerCase().endsWith('.webm') || imgSrc.toLowerCase().endsWith('.mov');
            
            if (isVideo) {
                mediaEl = document.createElement('video');
                mediaEl.src = imgSrc;
                mediaEl.className = 'img-preview-item';
                mediaEl.muted = true;
                mediaEl.autoplay = false;
                mediaEl.playsInline = true;
                mediaEl.controls = false;
            } else {
                mediaEl = document.createElement('img');
                mediaEl.src = imgSrc;
                mediaEl.className = 'img-preview-item';
                mediaEl.alt = 'Media ' + (index + 1);
            }
            mediaEl.title = 'Click to remove';
            
            mediaEl.onclick = function() {
                currentImages.splice(index, 1);
                window.app.renderImagePreview();
            };
            
            imgContainer.appendChild(mediaEl);
            
            if (index > 0) {
                var coverBtn = document.createElement('button');
                coverBtn.type = 'button';
                coverBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg> Cover';
                coverBtn.style.cssText = 'position:absolute; top:4px; right:4px; background:rgba(0,0,0,0.65); color:#fff; border:none; padding:3px 6px; font-size:9px; border-radius:4px; z-index:10; cursor:pointer; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; display:flex; align-items:center; opacity:0.8; transition:opacity 0.2s;';
                coverBtn.onmouseover = function() { this.style.opacity = '1'; };
                coverBtn.onmouseout = function() { this.style.opacity = '0.8'; };
                coverBtn.onclick = function(e) {
                    e.stopPropagation();
                    var clickedImg = currentImages.splice(index, 1)[0];
                    currentImages.unshift(clickedImg);
                    window.app.renderImagePreview();
                };
                imgContainer.style.position = 'relative';
                imgContainer.appendChild(coverBtn);
            }
            
            container.appendChild(imgContainer);
        });
    },

    // --- Save ---
    saveFossil: function(event) {
        event.preventDefault();
        var idVal = document.getElementById('fossil-id').value;
        var isEditing = !!idVal;

        var fossil = {
            id: isEditing ? idVal : generateCatalogId(document.getElementById('f-category').value, fossils),
            specimen: document.getElementById('f-specimen').value,
            animalSize: parseFloat(document.getElementById('f-animal-size').value) || null,
            anatomy: document.getElementById('f-anatomy').value,
            category: document.getElementById('f-category').value,
            fossilType: document.getElementById('f-type').value || null,
            isWishlist: document.getElementById('f-wishlist').value === 'true',
            isSold: document.getElementById('f-wishlist').value === 'sold',
            isForSale: document.getElementById('f-wishlist').value === 'sale',
            salePrice: (document.getElementById('f-wishlist').value === 'sold' || document.getElementById('f-wishlist').value === 'sale') ? parseFloat(document.getElementById('f-sale-price').value) || null : null,
            saleCurrency: (document.getElementById('f-wishlist').value === 'sold' || document.getElementById('f-wishlist').value === 'sale') ? document.getElementById('f-sale-currency').value : 'USD',
            isSelfFound: document.getElementById('f-self-found').checked,
            geologicalPeriod: document.getElementById('f-period').value,
            epoch: document.getElementById('f-epoch').value,
            stratAge: document.getElementById('f-strat-age').value,
            ageMa: parseFloat(document.getElementById('f-age').value) || 0,
            country: document.getElementById('f-country').value,
            location: document.getElementById('f-location').value,
            formation: document.getElementById('f-formation').value,
            lat: (document.getElementById('f-lat').value.trim() !== '' && !isNaN(parseFloat(document.getElementById('f-lat').value))) ? parseFloat(document.getElementById('f-lat').value) : null,
            lng: (document.getElementById('f-lng').value.trim() !== '' && !isNaN(parseFloat(document.getElementById('f-lng').value))) ? parseFloat(document.getElementById('f-lng').value) : null,
            size: parseFloat(document.getElementById('f-size').value) || null,
            sizeUnit: document.getElementById('f-size-unit').value,
            width: parseFloat(document.getElementById('f-width').value) || null,
            thickness: parseFloat(document.getElementById('f-thickness').value) || null,
            weight: parseFloat(document.getElementById('f-weight').value) || null,
            price: parseFloat(document.getElementById('f-price').value) || null,
            currency: document.getElementById('f-currency').value,
            estimatedValue: parseFloat(document.getElementById('f-est-value').value) || null,
            estimatedCurrency: document.getElementById('f-est-currency').value,
            sourceUrl: document.getElementById('f-link').value,
            notes: document.getElementById('f-notes').value,
            etymology: document.getElementById('f-etymology').value,
            restorationDetails: document.getElementById('f-restoration').value,
            authority: document.getElementById('f-authority').value,
            description: document.getElementById('f-description').value,
            conditionTier: document.getElementById('f-condition-tier').value || null,
            tags: (document.getElementById('f-tags').value || '').split(/[,\s]+/).map(function(t) { return t.trim().toLowerCase().replace(/^#/, ''); }).filter(function(t) { return t.length > 0; }),
            images: currentImages,
            condition: {
                stable: document.getElementById('cond-stable').checked,
                cracking: document.getElementById('cond-cracking').checked,
                efflorescence: document.getElementById('cond-efflorescence').checked,
                pyrite: document.getElementById('cond-pyrite').checked
            },
            treatment: {
                paraloid: document.getElementById('treat-paraloid').checked,
                scribe: document.getElementById('treat-scribe').checked,
                cyano: document.getElementById('treat-cyano').checked,
                water: document.getElementById('treat-water').checked
            },
            createdAt: isEditing ? undefined : Date.now()  // timestamp for sort
        };

        // Preserve original creation date on edit
        if (isEditing) {
            var existing = fossils.find(function(f){ return f.id === idVal; });
            if (existing) fossil.createdAt = existing.createdAt || Date.now();
        } else {
            // Save last used geography/geology for future batch logging
            localStorage.setItem('last_country', document.getElementById('f-country').value);
            localStorage.setItem('last_location', document.getElementById('f-location').value);
            localStorage.setItem('last_formation', document.getElementById('f-formation').value);
            localStorage.setItem('last_period', document.getElementById('f-period').value);
            localStorage.setItem('last_epoch', document.getElementById('f-epoch').value);
            localStorage.setItem('last_stratAge', document.getElementById('f-strat-age').value);
        }

        var action = isEditing ? updateFossil(fossil) : addFossil(fossil);
        action.then(function() {
            if (!isEditing) {
                newlyAddedFossilId = fossil.id;
                setTimeout(function() {
                    newlyAddedFossilId = null;
                }, 4000);
            }
            window.app.closeModal();
            window.app.renderFossils();
        });
    },

    quickAddWishlist: function() {
        var nameInput = document.getElementById('wl-quick-name');
        var priceInput = document.getElementById('wl-quick-price');
        var linksInput = document.getElementById('wl-quick-links');
        
        if (!nameInput) return;
        var name = nameInput.value.trim();
        if (!name) {
            if (window.app.showToast) {
                window.app.showToast('Please enter a specimen name.', 'warning');
            } else {
                alert('Please enter a specimen name.');
            }
            return;
        }
        
        var price = parseFloat(priceInput ? priceInput.value : '') || null;
        var links = linksInput ? linksInput.value.trim() : '';
        
        // Find highest rank in current wishlist to assign new rank at bottom
        var nextRank = 1;
        var wlFossils = fossils.filter(function(f) { return f.isWishlist && !f.isSold; });
        if (wlFossils.length > 0) {
            nextRank = Math.max.apply(null, wlFossils.map(function(f) { return f.wishlistRank || 0; })) + 1;
        }
        
        // Create new specimen object
        var newFossil = {
            id: generateId(),
            specimen: name,
            category: 'Uncategorized',
            isWishlist: true,
            isSold: false,
            price: price,
            currency: 'USD',
            sourceUrl: links,
            wishlistRank: nextRank,
            images: [],
            tags: [],
            notes: '',
            createdAt: Date.now()
        };
        
        addFossil(newFossil).then(function() {
            if (window.app.showToast) {
                window.app.showToast('✨ "' + name + '" added to your Wishlist!', 'success');
            }
            // Clear inputs
            nameInput.value = '';
            if (priceInput) priceInput.value = '';
            if (linksInput) {
                linksInput.value = '';
                linksInput.style.height = '';
            }
            // Re-render
            window.app.renderFossils();
        });
    },

    // --- Delete ---
    deleteFossilItem: function(id) {
        if (confirm('Are you sure you want to delete this fossil?')) {
            deleteFossil(id).then(function() {
                selectedFossils.delete(id);
                window.app.updateMassDeleteButton();
                window.app.renderFossils();
            });
        }
    },

    toggleSelectFossil: function(event, id) {
        if (event.target.checked) { selectedFossils.add(id); }
        else { selectedFossils.delete(id); }
        
        var cardEl = document.querySelector('.fossil-card[data-id="' + id + '"]');
        if (cardEl) {
            if (event.target.checked) cardEl.classList.add('picker-selected');
            else cardEl.classList.remove('picker-selected');
        }
        
        window.app.updateMassDeleteButton();
    },

    updateMassDeleteButton: function() {
        var selectionBar = document.getElementById('selection-bar');
        var selectionCountText = document.getElementById('selection-count-text');
        
        var btnDelete = document.getElementById('btn-mass-delete');
        var btnTag = document.getElementById('btn-mass-tag');
        var btnPrint = document.getElementById('btn-mass-print');
        var btnSelectAll = document.getElementById('btn-mass-select-all');
        var btnDeselect = document.getElementById('btn-mass-deselect');
        
        var count = selectedFossils.size;
        
        if (selectionBar) {
            if (count > 0 && !comparePickerModeActive) {
                selectionBar.style.display = 'block';
                // Trigger a reflow for CSS transition
                void selectionBar.offsetWidth;
                selectionBar.classList.add('active');
            } else {
                selectionBar.classList.remove('active');
                if (window.app._selectionBarTimeout) {
                    clearTimeout(window.app._selectionBarTimeout);
                }
                window.app._selectionBarTimeout = setTimeout(function() {
                    if (!selectionBar.classList.contains('active') || comparePickerModeActive) {
                        selectionBar.style.display = 'none';
                    }
                }, 400); // matches CSS transition
            }
        }
        
        if (selectionCountText) {
            selectionCountText.textContent = count + (count === 1 ? ' fossil selected' : ' fossils selected');
        }
        
        var btnCompare = document.getElementById('btn-mass-compare');
        if (btnCompare) {
            btnCompare.style.display = (count === 2 || count === 3) ? 'inline-flex' : 'none';
        }
        var btnPickerCompare = document.getElementById('btn-picker-compare');
        if (btnPickerCompare) {
            btnPickerCompare.style.display = (count === 2 || count === 3) ? 'inline-flex' : 'none';
        }

        if (btnDelete) {
            btnDelete.style.display = count > 0 ? 'inline-flex' : 'none';
            btnDelete.innerText = '🗑️ Delete (' + count + ')';
        }
        
        if (btnTag) {
            btnTag.style.display = count > 0 ? 'inline-flex' : 'none';
            btnTag.innerText = '🏷️ Tag (' + count + ')';
        }

        if (btnPrint) {
            btnPrint.style.display = count > 0 ? 'inline-flex' : 'none';
            btnPrint.innerText = '🖨️ Print (' + count + ')';
        }
        if (btnSelectAll) {
            btnSelectAll.style.display = (count < lightboxFilteredList.length) ? 'inline-flex' : 'none';
        }
        if (btnDeselect) {
            btnDeselect.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    },

    deselectAllSelected: function() {
        selectedFossils.clear();
        window.app.updateMassDeleteButton();
        var checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
        checkboxes.forEach(function(cb) {
            cb.checked = false;
        });
    },

    selectAllVisible: function() {
        if (!lightboxFilteredList || lightboxFilteredList.length === 0) return;
        lightboxFilteredList.forEach(function(f) {
            selectedFossils.add(f.id);
        });
        window.app.updateMassDeleteButton();
        var checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
        checkboxes.forEach(function(cb) {
            cb.checked = true;
        });
    },

    massTagSelected: function() {
        if (selectedFossils.size === 0) return;
        var tagInput = prompt('Enter tags to add (comma or space separated):');
        if (!tagInput) return;
        
        var newTags = tagInput.split(/[,\s]+/).map(function(t) { 
            return t.trim().toLowerCase().replace(/^#/, ''); 
        }).filter(function(t) { return t.length > 0; });
        
        if (newTags.length === 0) return;

        var ids = Array.from(selectedFossils);
        var chain = Promise.resolve();
        
        ids.forEach(function(id) {
            chain = chain.then(function() {
                var f = fossils.find(function(x) { return x.id === id; });
                if (f) {
                    var currentTags = f.tags || [];
                    newTags.forEach(function(nt) {
                        if (currentTags.indexOf(nt) === -1) {
                            currentTags.push(nt);
                        }
                    });
                    f.tags = currentTags;
                    return updateFossil(f);
                }
            });
        });

        chain.then(function() {
            selectedFossils.clear();
            window.app.updateMassDeleteButton();
            window.app.renderFossils();
        });
    },

    deleteSelected: function() {
        if (selectedFossils.size === 0) return;
        if (confirm('Are you sure you want to delete ' + selectedFossils.size + ' fossil(s)?')) {
            deleteMultipleFossils(Array.from(selectedFossils)).then(function() {
                selectedFossils.clear();
                window.app.updateMassDeleteButton();
                window.app.renderFossils();
            });
        }
    },

    toggleEnrichDropdown: function(event) {
        if (event) event.stopPropagation();
        var dbMenu = document.getElementById('db-dropdown');
        if (dbMenu && dbMenu.classList.contains('active')) {
            dbMenu.classList.remove('active');
        }
        var menu = document.getElementById('enrich-dropdown');
        if (menu) {
            menu.classList.toggle('active');
        }
    },

    toggleDbDropdown: function(event) {
        if (event) event.stopPropagation();
        var enrichMenu = document.getElementById('enrich-dropdown');
        if (enrichMenu && enrichMenu.classList.contains('active')) {
            enrichMenu.classList.remove('active');
        }
        var menu = document.getElementById('db-dropdown');
        if (menu) {
            menu.classList.toggle('active');
        }
    },

    toggleAutoEnhance: function() {
        isAutoEnhanceActive = !isAutoEnhanceActive;
        localStorage.setItem('photo_auto_enhance', isAutoEnhanceActive ? 'true' : 'false');
        
        // Update Utilities Dropdown label
        var enrichLabel = document.getElementById('toggle-enrich-lighting');
        if (enrichLabel) {
            enrichLabel.innerHTML = '💡 Auto-Enhance Lighting: ' + (isAutoEnhanceActive ? 'On' : 'Off');
        }
        
        // Update Lightbox button styling if active
        var lightboxBtn = document.getElementById('lightbox-auto-enhance');
        if (lightboxBtn) {
            lightboxBtn.style.color = isAutoEnhanceActive ? '#e6a817' : 'var(--text-primary)';
            lightboxBtn.style.textShadow = isAutoEnhanceActive ? '0 0 8px rgba(230,168,23,0.6)' : 'none';
        }
        
        // Toggle CSS class on active images
        var gridImages = document.querySelectorAll('.fossil-card img, .lightbox-inner img, .lb-strip-slot img');
        gridImages.forEach(function(img) {
            img.classList.toggle('enhanced-photo', isAutoEnhanceActive);
        });
        
        window.app.showToast(isAutoEnhanceActive ? 'Museum spot-lighting enhancement active! 💡' : 'Photo lighting restored to original.', 'info');
    },

    toggleMobileFilters: function() {
        var filterBar = document.querySelector('.filter-bar');
        if (filterBar) {
            filterBar.classList.toggle('show-mobile-filters');
            var isShow = filterBar.classList.contains('show-mobile-filters');
            var btn = document.getElementById('btn-mobile-filter-toggle');
            if (btn) {
                btn.classList.toggle('active', isShow);
            }
        }
    },

    toggleMobileMenu: function(event) {
        if (event) event.stopPropagation();
        
        // Close other dropdowns
        var dbMenu = document.getElementById('db-dropdown');
        if (dbMenu) dbMenu.classList.remove('active');
        var enrichMenu = document.getElementById('enrich-dropdown');
        if (enrichMenu) enrichMenu.classList.remove('active');
        
        var menu = document.getElementById('mobile-menu-dropdown-content');
        if (menu) {
            menu.classList.toggle('active');
        }
    },

    closeMobileMenu: function() {
        var menu = document.getElementById('mobile-menu-dropdown-content');
        if (menu) {
            menu.classList.remove('active');
        }
    },

    updateFilterBadges: function() {
        var badgesContainer = document.getElementById('active-filter-badges');
        if (!badgesContainer) return;
        
        var searchInput = document.getElementById('search');
        var catSelect = document.getElementById('filter-category');
        var typeSelect = document.getElementById('filter-type');
        var periodSelect = document.getElementById('filter-period');
        
        var searchVal = searchInput ? searchInput.value.trim() : '';
        var catVal = catSelect ? catSelect.value : '';
        var typeVal = typeSelect ? typeSelect.value : '';
        var periodVal = periodSelect ? periodSelect.value : '';
        
        var html = '';
        
        if (searchVal) {
            html += '<span class="filter-badge-pill" onclick="document.getElementById(\'search\').value=\'\'; app.renderFossils();" title="Clear search query">' +
                    '🔍 ' + escapeHtml(searchVal) + ' <span class="clear-cross">&times;</span></span>';
        }
        if (catVal) {
            html += '<span class="filter-badge-pill" onclick="document.getElementById(\'filter-category\').value=\'\'; app.renderFossils();" title="Clear category filter">' +
                    '📂 ' + escapeHtml(catVal) + ' <span class="clear-cross">&times;</span></span>';
        }
        if (typeVal) {
            html += '<span class="filter-badge-pill" onclick="document.getElementById(\'filter-type\').value=\'\'; app.renderFossils();" title="Clear type filter">' +
                    '🦕 ' + escapeHtml(typeVal) + ' <span class="clear-cross">&times;</span></span>';
        }
        if (periodVal) {
            html += '<span class="filter-badge-pill" onclick="document.getElementById(\'filter-period\').value=\'\'; app.renderFossils();" title="Clear period filter">' +
                    '⏳ ' + escapeHtml(periodVal) + ' <span class="clear-cross">&times;</span></span>';
        }
        
        if (html) {
            html += '<span class="filter-badge-pill" onclick="app.resetFiltersOnly();" style="background: rgba(186, 58, 58, 0.1); color: var(--danger); border-color: rgba(186, 58, 58, 0.2);" title="Clear all filters">' +
                    '🗑️ Clear All <span class="clear-cross">&times;</span></span>';
            badgesContainer.innerHTML = html;
            badgesContainer.style.display = 'flex';
        } else {
            badgesContainer.innerHTML = '';
            badgesContainer.style.display = 'none';
        }

        // Count active mobile filters (Category, Type, Period, and Sort if not newest)
        var activeCount = 0;
        if (catVal) activeCount++;
        if (typeVal) activeCount++;
        if (periodVal) activeCount++;
        var sortSelect = document.getElementById('filter-sort');
        var sortVal = sortSelect ? sortSelect.value : 'newest';
        if (sortVal !== 'newest') activeCount++;

        var badge = document.getElementById('mobile-filter-count-badge');
        if (badge) {
            if (activeCount > 0) {
                badge.textContent = activeCount;
                badge.style.display = 'inline-flex';
            } else {
                badge.style.display = 'none';
            }
        }
    },

    resetFiltersOnly: function() {
        var searchInput = document.getElementById('search');
        var catSelect = document.getElementById('filter-category');
        var typeSelect = document.getElementById('filter-type');
        var periodSelect = document.getElementById('filter-period');
        if (searchInput) searchInput.value = '';
        if (catSelect) catSelect.value = '';
        if (typeSelect) typeSelect.value = '';
        if (periodSelect) periodSelect.value = '';
        window.app.renderFossils();
    },

    batchAutoEnrichAll: async function() {
        if (!confirm('Start batch Auto-Enrichment?\n\nThis will scan your entire archive database and automatically fetch missing Sizes, Wikipedia Etymologies, Taxonomic Authorities, Biology Descriptions, and location coordinates in parallel.\n\nNote: We respect API rate limits with polite request throttling.')) {
            return;
        }

        var total = fossils.length;
        if (total === 0) {
            window.app.showToast('No specimens in database to enrich!', 'warning');
            return;
        }

        var count = 0;
        var i = 0;
        window.app.showBatchProgress('⚡ Auto-Enriching Database', 0, total);

        for (var f of fossils) {
            i++;
            window.app.showBatchProgress('⚡ Auto-Enriching Database', i, total);

            var genus = (f.specimen || '').split(' ')[0];
            if (!genus) continue;

            var changed = false;

            // 1. Fetch missing Taxonomy / Authority / Period
            if (!f.geologicalPeriod || !f.ageMa || !f.authority) {
                try {
                    var tax = await window.app.fetchTaxonomy(genus);
                    if (tax) {
                        if (!f.geologicalPeriod && tax.period) { f.geologicalPeriod = tax.period; changed = true; }
                        if (!f.ageMa && tax.age) { f.ageMa = tax.age; changed = true; }
                        if (!f.authority && tax.authority) { f.authority = tax.authority; changed = true; }
                    }
                } catch (e) { console.error('Taxonomy batch fetch error', e); }
            }

            // 2. Fetch missing Wikipedia Description / Biology
            if (!f.description) {
                try {
                    var wikiDesc = await window.app.fetchWikipediaSummary(genus);
                    if (wikiDesc) { f.description = wikiDesc; changed = true; }
                } catch (e) { console.error('Description batch fetch error', e); }
            }

            // 3. Fetch missing Wikipedia Etymology
            if (!f.etymology) {
                try {
                    var etym = await window.app.fetchEtymology(genus);
                    if (etym) { f.etymology = etym; changed = true; }
                } catch (e) { console.error('Etymology batch fetch error', e); }
            }

            // 4. Fetch missing coordinates if location details exist
            var hasLocation = (f.country && f.country.trim() !== '') || 
                              (f.location && f.location.trim() !== '') ||
                              (f.formation && f.formation.trim() !== '');
            var lacksCoords = f.lat === undefined || f.lat === null || f.lat === '' ||
                              f.lng === undefined || f.lng === null || f.lng === '';
            if (hasLocation && lacksCoords) {
                try {
                    var queries = getSmartGeocodeQueries(f.location, f.formation, f.country);
                    if (queries.length > 0) {
                        var geoRes = await new Promise(function(resolve) {
                            trySmartGeocode(queries, 0, function(result) {
                                resolve(result);
                            }, function() {
                                resolve(null);
                            });
                        });
                        if (geoRes) {
                            f.lat = parseFloat(geoRes.lat).toFixed(6);
                            f.lng = parseFloat(geoRes.lon).toFixed(6);
                            changed = true;
                        }
                    }
                } catch (e) { console.error('Geocode batch fetch error', e); }
            }

            if (changed) {
                await updateFossil(f);
                count++;
            }

            // Small delay to be polite to Wikipedia & OpenStreetMap
            await new Promise(function(r) { setTimeout(r, 200); });
        }

        window.app.hideBatchProgress();
        window.app.showToast('Successfully auto-enriched ' + count + ' specimens with new data!', 'success');
        window.app.renderFossils();
    },

    batchFetchEtymologies: async function() {
        var missing = fossils.filter(function(f) { return !f.etymology; });
        if (missing.length === 0) { window.app.showToast('All specimens already have etymologies!', 'info'); return; }
        
        if (!confirm('Attempt to fetch etymologies for ' + missing.length + ' specimens from Wikipedia? This may take a minute.')) return;
        
        var count = 0;
        var i = 0;
        window.app.showBatchProgress('📖 Fetching Etymologies', 0, missing.length);

        for (var f of missing) {
            i++;
            window.app.showBatchProgress('📖 Fetching Etymologies', i, missing.length);
            var genus = (f.specimen || '').split(' ')[0];
            if (!genus) continue;
            
            var etym = await window.app.fetchEtymology(genus);
            if (etym) {
                f.etymology = etym;
                await updateFossil(f);
                count++;
            }
            // Small delay to be nice to Wikipedia
            await new Promise(function(r) { setTimeout(r, 200); });
        }
        
        window.app.hideBatchProgress();
        window.app.showToast('Successfully fetched and saved ' + count + ' new etymologies.', 'success');
        window.app.renderFossils();
    },

    batchFetchCoordinates: async function() {
        var missing = fossils.filter(function(f) { 
            var hasLocation = (f.country && f.country.trim() !== '') || 
                              (f.location && f.location.trim() !== '') ||
                              (f.formation && f.formation.trim() !== '');
            var lacksCoords = f.lat === undefined || f.lat === null || f.lat === '' ||
                              f.lng === undefined || f.lng === null || f.lng === '';
            return hasLocation && lacksCoords;
        });

        var hasLocationFossils = fossils.filter(function(f) {
            return (f.country && f.country.trim() !== '') || 
                   (f.location && f.location.trim() !== '') ||
                   (f.formation && f.formation.trim() !== '');
        });

        if (hasLocationFossils.length === 0) {
            window.app.showToast('No specimens have country, location, or formation data to geocode!', 'warning');
            return;
        }

        if (!confirm('Start batch geocoding from OpenStreetMap?')) {
            return;
        }

        var forceAll = false;
        if (missing.length < hasLocationFossils.length) {
            forceAll = !confirm(
                'Only geocode specimens that currently LACK coordinates?\n\n' +
                '• Click OK to only geocode missing ones (' + missing.length + ' specimens).\n' +
                '• Click CANCEL to overwrite and re-geocode ALL specimens (' + hasLocationFossils.length + ' specimens).'
            );
        } else {
            // All fossils with location lack coordinates anyway, so just run them
            forceAll = false;
        }

        var targets = forceAll ? hasLocationFossils : missing;

        if (targets.length === 0) { 
            window.app.showToast('No specimens to geocode based on your choice.', 'info'); 
            return; 
        }

        var count = 0;
        var i = 0;
        window.app.showToast('Starting batch geocoding of ' + targets.length + ' fossils...', 'info');
        window.app.showBatchProgress('🌍 Geocoding', 0, targets.length);

        for (var f of targets) {
            i++;
            window.app.showBatchProgress('🌍 Geocoding', i, targets.length);

            var res = await fetchSmartCoordinates(f.location, f.formation, f.country);
            if (res) {
                f.lat = res.lat;
                f.lng = res.lng;
                await updateFossil(f);
                count++;
            }

            // Await 1.4 seconds to strictly respect Nominatim's 1-second rate limit with buffer
            await new Promise(function(resolve) { setTimeout(resolve, 1400); });
        }

        window.app.hideBatchProgress();
        window.app.showToast('Geocoded and saved coordinates for ' + count + ' specimens!', 'success');
        window.app.renderFossils();
    },

    batchFetchMissingSizes: async function() {
        var allSpecimens = fossils; 
        if (allSpecimens.length === 0) { window.app.showToast('Your collection is empty!', 'warning'); return; }
        
        var btn = document.getElementById('btn-batch-size');
        var originalHtml = btn ? btn.innerHTML : '';
        
        if (!confirm('Re-fetch and update sizes for all ' + allSpecimens.length + ' specimens? This will overwrite existing data with the latest estimates.')) return;
        
        var count = 0;
        var i = 0;
        window.app.showBatchProgress('📏 Fetching Sizes', 0, allSpecimens.length);

        for (var f of allSpecimens) {
            i++;
            window.app.showBatchProgress('📏 Fetching Sizes', i, allSpecimens.length);
            
            var name = (f.specimen || '').trim();
            if (!name) continue;

            // 1. Sanitize: Remove bracketed text, common tags like "cf.", "sp.", "?"
            var cleanName = name.replace(/\([^)]*\)/g, '').replace(/\b(?:cf\.|sp\.|\?)\b/g, '').replace(/\s+/g, ' ').trim();
            if (!cleanName) continue;

            // 2. Precise and Fuzzy local lookup
            var searchLower = cleanName.toLowerCase();
            var localSize = null;
            
            // Exact Match
            if (PREHISTORIC_SIZES[searchLower]) {
                localSize = PREHISTORIC_SIZES[searchLower];
            } else {
                // Fuzzy/Contains Match: Scan for any known name in the db
                // CRITICAL: We sort keys by length (longest first) to catch "Isurus hastalis" before "Isurus".
                var sortedKeys = Object.keys(PREHISTORIC_SIZES).sort(function(a, b) { return b.length - a.length; });
                for (var j = 0; j < sortedKeys.length; j++) {
                    var key = sortedKeys[j];
                    if (searchLower.indexOf(key) !== -1) {
                        localSize = PREHISTORIC_SIZES[key];
                        break;
                    }
                }
            }
            
            if (localSize) {
                f.animalSize = localSize;
                await updateFossil(f);
                count++;
                continue;
            }

            // Wikipedia API Headers (Required to avoid blocking)
            var wikiHeaders = { 'Api-User-Agent': 'FossilArchiveApp/1.0 (contact@fossilarchive.app) MediaWiki/1.3' };

            // 3. Wikipedia Fallback Strategy (Triple-Query Search -> Extract)
            var found = false;
            var words = cleanName.split(/\s+/);
            var searchQueries = [];
            
            if (words.length > 0) searchQueries.push(cleanName + ' size');
            if (words.length > 0) searchQueries.push(cleanName);
            if (words.length > 1) searchQueries.push(words[0]); 

            for (var sq of searchQueries) {
                try {
                    // A. Search for the best matching page title
                    var searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=' + encodeURIComponent(sq);
                    var sResp = await fetch(searchUrl, { headers: wikiHeaders });
                    if (sResp.ok) {
                        var sData = await sResp.json();
                        if (sData.query && sData.query.search && sData.query.search.length > 0) {
                            var bestTitle = sData.query.search[0].title;
                            if (btn) btn.innerHTML = '<span class="loading-spinner"></span> ' + bestTitle + '... ' + i + '/' + allSpecimens.length;
                            
                            // B. Fetch DEEP extract (2,500 chars) for this title
                            var fetchUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exchars=2500&explaintext=1&origin=*&titles=' + encodeURIComponent(bestTitle);
                            var fResp = await fetch(fetchUrl, { headers: wikiHeaders });
                            if (fResp.ok) {
                                var fData = await fResp.json();
                                var pages = fData.query.pages;
                                var pageId = Object.keys(pages)[0];
                                var extract = pages[pageId].extract || '';
                                
                                var size = window.app.extractSizeFromText(extract);
                                if (size) {
                                    f.animalSize = size;
                                    await updateFossil(f);
                                    count++;
                                    found = true;
                                    break;
                                }
                            }
                        }
                    }
                } catch (e) { console.error('Search fetch error (' + sq + ')', e); }
                if (found) break;
            }

            // Small delay to keep the UI responsive and respect API limits
            await new Promise(function(r) { setTimeout(r, 150); });
        }
        
        if (btn) btn.innerHTML = originalHtml;
        window.app.hideBatchProgress();
        var successRate = Math.round((count / allSpecimens.length) * 100);
        window.app.showToast('Batch update complete! Updated ' + count + ' out of ' + allSpecimens.length + ' specimens (' + successRate + '% success rate).', 'success');
        window.app.renderFossils();
    },

    changeImage: function(id, dir) {
        var f = fossils.find(function(x) { return x.id === id; });
        if (!f || !f.images || f.images.length <= 1) return;
        
        var container = document.querySelector('[data-id="' + id + '"] .card-img-container');
        if (!container) return;
        
        var currentIndex = parseInt(container.getAttribute('data-current-index') || '0');
        var nextIndex = (currentIndex + dir + f.images.length) % f.images.length;
        
        container.setAttribute('data-current-index', nextIndex);
        
        var currentMedia = container.querySelector('img, video');
        if (currentMedia) {
            currentMedia.remove();
        }
        
        var isVid = window.app.isVideo(f.images[nextIndex]);
        var newMedia;
        if (isVid) {
            newMedia = document.createElement('video');
            newMedia.src = f.images[nextIndex];
            newMedia.className = 'card-video';
            newMedia.autoplay = true;
            newMedia.muted = true;
            newMedia.loop = true;
            newMedia.playsInline = true;
            newMedia.style.cursor = 'zoom-in';
            newMedia.onclick = function(e) {
                e.stopPropagation();
                app.openLightbox(f.id, nextIndex);
            };
        } else {
            var imgCls = isAutoEnhanceActive ? 'enhanced-photo' : '';
            newMedia = document.createElement('img');
            newMedia.src = f.images[nextIndex];
            newMedia.className = imgCls;
            newMedia.style.cursor = 'zoom-in';
            newMedia.onclick = function(e) {
                e.stopPropagation();
                app.openLightbox(f.id, nextIndex);
            };
        }
        
        container.insertBefore(newMedia, container.firstChild);
        
        var dots = document.querySelectorAll('#dots-' + id + ' .dot');
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === nextIndex);
        });

        var counter = document.getElementById('counter-' + id);
        if (counter) {
            counter.innerText = (nextIndex + 1) + ' / ' + f.images.length;
        }
    },

    duplicateFossil: function(id) {
        window.app.openModal(); // opens as new (resets form and images)
        var f = fossils.find(function(x) { return x.id === id; });
        if (!f) return;
        document.getElementById('modal-title').innerText = 'Duplicate Fossil';
        document.getElementById('f-specimen').value = f.specimen || '';
        document.getElementById('f-animal-size').value = f.animalSize || '';
        document.getElementById('f-anatomy').value = f.anatomy || '';
        document.getElementById('f-category').value = f.category || '';
        document.getElementById('f-type').value = f.fossilType || '';
        if (f.isSold) {
            document.getElementById('f-wishlist').value = 'sold';
            document.getElementById('f-sale-price').value = f.salePrice || '';
            document.getElementById('f-sale-currency').value = f.saleCurrency || 'USD';
        } else if (f.isForSale) {
            document.getElementById('f-wishlist').value = 'sale';
            document.getElementById('f-sale-price').value = f.salePrice || '';
            document.getElementById('f-sale-currency').value = f.saleCurrency || 'USD';
        } else {
            document.getElementById('f-wishlist').value = f.isWishlist ? 'true' : 'false';
            document.getElementById('f-sale-price').value = '';
            document.getElementById('f-sale-currency').value = 'USD';
        }
        window.app.toggleSalePriceField();
        document.getElementById('f-self-found').checked = !!f.isSelfFound;
        document.getElementById('f-period').value = f.geologicalPeriod || '';
        window.app.updateEpochs(f.epoch);
        window.app.updateStratAges(f.stratAge);
        var ageVal = f.ageMa || 0;
        document.getElementById('f-age').value = ageVal;
        document.getElementById('f-age-slider').value = ageVal;
        document.getElementById('f-country').value = f.country || '';
        if (window.app.updateModalFlag) window.app.updateModalFlag();
        document.getElementById('f-location').value = f.location || '';
        document.getElementById('f-formation').value = f.formation || '';
        document.getElementById('f-size').value = f.size || '';
        document.getElementById('f-condition-tier').value = f.conditionTier || '';
        document.getElementById('f-size-unit').value = f.sizeUnit || 'cm';
        document.getElementById('f-width').value = f.width || '';
        document.getElementById('f-thickness').value = f.thickness || '';
        var val = f.sizeUnit || 'cm';
        var wDisp = document.getElementById('f-width-unit-display');
        var tDisp = document.getElementById('f-thickness-unit-display');
        if (wDisp) wDisp.textContent = val;
        if (tDisp) tDisp.textContent = val;
        document.getElementById('f-weight').value = f.weight || '';
        document.getElementById('f-price').value = f.price || '';
        document.getElementById('f-currency').value = f.currency || 'USD';
        document.getElementById('f-est-value').value = f.estimatedValue || '';
        document.getElementById('f-est-currency').value = f.estimatedCurrency || 'USD';
        document.getElementById('f-link').value = f.sourceUrl || '';
        document.getElementById('f-notes').value = f.notes || '';
        document.getElementById('f-tags').value = (f.tags || []).join(', ');
        document.getElementById('f-restoration').value = f.restorationDetails || '';
        document.getElementById('f-authority').value = f.authority || '';
        document.getElementById('f-description').value = f.description || '';
    },

    // --- Print Label ---
    printLabel: function(id) {
        var f = fossils.find(function(x) { return x.id === id; });
        if (!f) return;

        var specimen = f.specimen || 'Unknown Specimen';
        var catalogId = f.id || '';
        var category = f.category || '';
        var anatomy = f.anatomy || '';
        var period = f.geologicalPeriod || '';
        var epoch = f.epoch || '';
        var stratAge = f.stratAge || '';
        var ageMa = f.ageMa ? '~' + f.ageMa + ' Ma' : '';
        var country = f.country || '';
        var location = f.location || '';
        var formation = f.formation || '';

        var geoLine = [period, epoch, stratAge].filter(Boolean).join(' · ');
        var locLine = [location, country].filter(Boolean).join(', ');
        if (formation) locLine += locLine ? ' (' + formation + ')' : formation;
        var detailParts = [category, anatomy].filter(Boolean).join(' — ');

        var labelHtml = '<!DOCTYPE html><html><head><title>Specimen Label — ' + specimen + '</title>' +
            '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">' +
            '<style>' +
            '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }' +
            'body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f0ece4; font-family: "Inter", sans-serif; }' +
            '.label-card { width: 3in; height: 2in; border: 1.5pt solid #2c2418; border-radius: 4px; padding: 0.18in 0.22in; display: flex; flex-direction: column; justify-content: space-between; background: #fff; position: relative; overflow: hidden; }' +
            '.label-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #8b6914, #b8942e, #8b6914); }' +
            '.label-top { display: flex; flex-direction: column; gap: 2px; }' +
            '.specimen-name { font-family: "Playfair Display", Georgia, serif; font-size: 13pt; font-weight: 700; color: #2c2418; line-height: 1.15; letter-spacing: -0.01em; }' +
            '.specimen-detail { font-size: 7pt; color: #7a6e5d; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 1px; }' +
            '.label-mid { display: flex; flex-direction: column; gap: 2px; border-top: 0.5pt solid #e0d8cc; padding-top: 4px; }' +
            '.label-row { display: flex; align-items: baseline; gap: 4px; }' +
            '.label-key { font-size: 5.5pt; font-weight: 600; color: #7a6e5d; text-transform: uppercase; letter-spacing: 0.08em; min-width: 42px; flex-shrink: 0; }' +
            '.label-val { font-size: 7.5pt; color: #2c2418; font-weight: 500; }' +
            '.label-bottom { display: flex; justify-content: space-between; align-items: flex-end; border-top: 0.5pt solid #e0d8cc; padding-top: 3px; }' +
            '.catalog-id { font-size: 7pt; font-weight: 700; color: #8b6914; letter-spacing: 0.1em; text-transform: uppercase; }' +
            '.label-archive { font-size: 5pt; color: #b0a898; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }' +
            '.no-print { text-align: center; margin-top: 1rem; }' +
            '.no-print button { font-family: "Inter", sans-serif; padding: 0.5rem 1.5rem; background: #8b6914; color: #fff; border: none; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }' +
            '.no-print button:hover { background: #b8942e; }' +
            '@media print {' +
            '  body { background: #fff; min-height: auto; }' +
            '  .no-print { display: none !important; }' +
            '  .label-card { border: 1.5pt solid #000; border-radius: 0; page-break-inside: avoid; }' +
            '  @page { size: 3in 2in; margin: 0; }' +
            '}' +
            '</style></head><body>' +
            '<div>' +
            '<div class="label-card">' +
                '<div class="label-top">' +
                    '<div class="specimen-name">' + escapeHtml(specimen) + '</div>' +
                    (detailParts ? '<div class="specimen-detail">' + escapeHtml(detailParts) + '</div>' : '') +
                '</div>' +
                '<div class="label-mid">' +
                    (geoLine ? '<div class="label-row"><span class="label-key">Age</span><span class="label-val">' + escapeHtml(geoLine) + (ageMa ? ' · ' + ageMa : '') + '</span></div>' : '') +
                    (locLine ? '<div class="label-row"><span class="label-key">Locality</span><span class="label-val">' + escapeHtml(locLine) + '</span></div>' : '') +
                '</div>' +
                '<div class="label-bottom">' +
                    '<span class="catalog-id">' + escapeHtml(catalogId) + '</span>' +
                    '<span class="label-archive">Specimenry</span>' +
                '</div>' +
            '</div>' +
            '<div class="no-print"><button onclick="window.print()">Print Label</button></div>' +
            '</div>' +
            '</body></html>';

        var labelWindow = window.open('', '_blank', 'width=420,height=380,menubar=no,toolbar=no,location=no,status=no');
        if (labelWindow) {
            labelWindow.document.write(labelHtml);
            labelWindow.document.close();
        }
    },

    printLabelsSelected: function() {
        if (selectedFossils.size === 0) return;
        var ids = Array.from(selectedFossils);
        var labelCardsHtml = '';
        
        var eraColors = {
            'Cenozoic': '#319795',
            'Mesozoic': '#dd6b20',
            'Paleozoic': '#2b6cb0',
            'Precambrian': '#4a5568'
        };

        ids.forEach(function(id) {
            var f = fossils.find(function(x) { return x.id === id; });
            if (!f) return;
            
            var specimen = f.specimen || 'Unknown Specimen';
            
            // Format Scientific Name: wrap first two words in <em> tags if they look like a species binomial name
            var formattedName = escapeHtml(specimen);
            var words = specimen.split(/\s+/);
            if (words.length >= 2 && /^[A-Z][a-z]+$/.test(words[0]) && /^[a-z]+$/.test(words[1])) {
                var genus = words[0];
                var species = words[1];
                var rest = words.slice(2).join(' ');
                formattedName = '<em>' + escapeHtml(genus) + ' ' + escapeHtml(species) + '</em>' + (rest ? ' ' + escapeHtml(rest) : '');
            } else if (words.length >= 1 && /^[A-Z][a-z]+$/.test(words[0])) {
                formattedName = '<em>' + escapeHtml(words[0]) + '</em>' + (words.length > 1 ? ' ' + escapeHtml(words.slice(1).join(' ')) : '');
            }

            // Custom Museum-style Registration ID
            var fossilYear = f.createdAt ? new Date(f.createdAt).getFullYear() : 2026;
            var fossilIdx = fossils.indexOf(f) + 1;
            var paddedIdx = String(fossilIdx).padStart(4, '0');
            var customCatalogId = 'FA-' + fossilYear + '-' + paddedIdx;

            var category = f.category || '';
            var anatomy = f.anatomy || '';
            var period = f.geologicalPeriod || '';
            var epoch = f.epoch || '';
            var stratAge = f.stratAge || '';
            var ageMa = f.ageMa ? '~' + f.ageMa + ' Ma' : '';
            var country = f.country || '';
            var location = f.location || '';
            var formation = f.formation || '';

            // Get Era Color
            var fossilEra = 'Precambrian';
            if (period) {
                var cleanPeriod = period.trim();
                for (var era in PERIODS_AND_EPOCHS) {
                    if (PERIODS_AND_EPOCHS[era][cleanPeriod]) {
                        fossilEra = era.replace(' Era', '');
                        break;
                    }
                }
            }
            var eraColor = eraColors[fossilEra] || '#718096';

            // FlagsCDN helper
            var flagHtml = '';
            if (country) {
                var cleanCountry = country.toLowerCase().trim();
                var code = COUNTRY_TO_ISO[cleanCountry];
                if (!code) {
                    if (cleanCountry.indexOf('united states') !== -1 || cleanCountry === 'usa') code = 'us';
                    else if (cleanCountry.indexOf('united kingdom') !== -1 || cleanCountry === 'uk') code = 'gb';
                    else if (cleanCountry.indexOf('morocco') !== -1) code = 'ma';
                    else if (cleanCountry.indexOf('netherlands') !== -1) code = 'nl';
                    else if (cleanCountry.indexOf('germany') !== -1) code = 'de';
                    else if (cleanCountry.indexOf('france') !== -1) code = 'fr';
                }
                if (!code && cleanCountry.length === 2) code = cleanCountry;
                if (code) {
                    flagHtml = '<img class="flag-icon" src="https://flagcdn.com/w20/' + code.toLowerCase() + '.png" alt="' + escapeHtml(country) + '" />';
                }
            }

            var geoLine = [period, epoch, stratAge].filter(Boolean).join(' · ');
            var locLine = [location, country].filter(Boolean).join(', ');
            if (formation) locLine += locLine ? ' (' + formation + ')' : formation;
            var detailParts = [category, anatomy].filter(Boolean).join(' — ');

            // Wikipedia QR URL
            var qrGenus = words[0] || 'Fossil';
            var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent('https://en.wikipedia.org/wiki/' + qrGenus);

            labelCardsHtml += '<div class="label-card">' +
                '<div class="label-top">' +
                    '<div class="specimen-name">' + formattedName + '</div>' +
                    (detailParts ? '<div class="specimen-detail">' + escapeHtml(detailParts) + '</div>' : '') +
                '</div>' +
                '<div class="label-mid">' +
                    (geoLine ? '<div class="label-row"><span class="label-key">Age</span><span class="label-val">' + escapeHtml(geoLine) + (ageMa ? ' · ' + ageMa : '') + '</span></div>' : '') +
                    (locLine ? '<div class="label-row"><span class="label-key">Locality</span><span class="label-val">' + flagHtml + escapeHtml(locLine) + '</span></div>' : '') +
                '</div>' +
                '<div class="label-bottom">' +
                    '<div class="label-bottom-left">' +
                        '<span class="catalog-id">' + escapeHtml(customCatalogId) + '</span>' +
                        '<span class="label-archive">Specimenry</span>' +
                    '</div>' +
                    '<div class="label-bottom-right">' +
                        '<img class="label-qr" src="' + qrUrl + '" alt="QR code" />' +
                    '</div>' +
                '</div>' +
                '<div class="era-indicator" style="background: ' + eraColor + ';" title="' + fossilEra + ' Era"></div>' +
            '</div>';
        });

        var printHtml = '<!DOCTYPE html><html><head><title>Batch Specimen Labels — Specimenry</title>' +
            '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">' +
            '<style>' +
            '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }' +
            'body { background: #f4f1ea; font-family: "Inter", sans-serif; padding: 2rem; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }' +
            '.no-print-header { width: 100%; max-width: 6.8in; background: #fff; border-radius: 12px; padding: 1.25rem 1.75rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05); border: 1px solid #e2dddb; }' +
            '.no-print-header h1 { font-family: "Playfair Display", serif; font-size: 1.4rem; color: #1a1510; font-weight: 700; }' +
            '.no-print-header p { font-size: 0.8rem; color: #736b63; margin-top: 0.25rem; font-weight: 500; }' +
            '.no-print-header button { font-family: "Inter", sans-serif; padding: 0.65rem 1.75rem; background: #1a1510; color: #fff; border: none; border-radius: 9999px; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }' +
            '.no-print-header button:hover { background: var(--accent, #4ca1a3); transform: translateY(-1px); }' +
            '.labels-grid { display: grid; grid-template-columns: repeat(2, 3in); gap: 0.4in; justify-content: center; }' +
            '.label-card { width: 3in; height: 2in; border: 1pt solid #1a1510; outline: 0.5pt solid rgba(0,0,0,0.15); outline-offset: -3pt; padding: 0.16in 0.18in; display: flex; flex-direction: column; justify-content: space-between; background: #fff; position: relative; overflow: hidden; page-break-inside: avoid; }' +
            '.era-indicator { position: absolute; top: 0; left: 0; right: 0; height: 4px; }' +
            '.label-top { display: flex; flex-direction: column; gap: 1px; }' +
            '.specimen-name { font-family: "Playfair Display", Georgia, serif; font-size: 11pt; font-weight: 700; color: #1a1510; line-height: 1.15; letter-spacing: -0.01em; }' +
            '.specimen-name em { font-style: italic; }' +
            '.specimen-detail { font-size: 6pt; color: #736b63; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 1px; }' +
            '.label-mid { display: flex; flex-direction: column; gap: 2px; border-top: 0.5pt solid #eae5e3; padding-top: 4px; margin-top: 2px; }' +
            '.label-row { display: flex; align-items: baseline; gap: 4px; }' +
            '.label-key { font-size: 5pt; font-weight: 700; color: #8c837b; text-transform: uppercase; letter-spacing: 0.08em; min-width: 38px; flex-shrink: 0; }' +
            '.label-val { font-size: 6.5pt; color: #1a1510; font-weight: 600; display: flex; align-items: center; gap: 3px; }' +
            '.flag-icon { width: 11px; height: auto; border-radius: 1px; border: 0.2pt solid rgba(0,0,0,0.1); }' +
            '.label-bottom { display: flex; justify-content: space-between; align-items: flex-end; border-top: 0.5pt solid #eae5e3; padding-top: 3px; }' +
            '.label-bottom-left { display: flex; flex-direction: column; gap: 1px; }' +
            '.catalog-id { font-size: 6.5pt; font-weight: 800; color: #1a1510; letter-spacing: 0.05em; text-transform: uppercase; }' +
            '.label-archive { font-size: 4.5pt; color: #a69e97; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }' +
            '.label-bottom-right { width: 0.35in; height: 0.35in; display: flex; align-items: center; justify-content: center; }' +
            '.label-qr { width: 100%; height: 100%; object-fit: contain; }' +
            '@media print {' +
            '  body { background: #fff; padding: 0; }' +
            '  .no-print-header { display: none !important; }' +
            '  .labels-grid { gap: 0.3in 0.4in; grid-template-columns: repeat(2, 3in); margin: 0.5in auto; }' +
            '  .label-card { border: 1.2pt solid #000; border-radius: 0; box-shadow: none; outline: 0.5pt solid #000; outline-offset: -3pt; }' +
            '  @page { size: portrait; margin: 0.5in; }' +
            '}' +
            '</style></head><body>' +
            '<div class="no-print-header">' +
            '<div>' +
            '<h1>Museum Exhibition Labels</h1>' +
            '<p>Selected samlingsobjekt: <strong>' + ids.length + '</strong>. Utskriftsstorlek: 3&times;2 tum (passar i monterfack).</p>' +
            '</div>' +
            '<button onclick="window.print()">Skriv ut etikettark</button>' +
            '</div>' +
            '<div class="labels-grid">' +
            labelCardsHtml +
            '</div>' +
            '</body></html>';

        var printWindow = window.open('', '_blank', 'width=850,height=650,menubar=no,toolbar=no,location=no,status=no');
        if (printWindow) {
            printWindow.document.write(printHtml);
            printWindow.document.close();
        }
    },

    // --- Render ---
    renderFossils: function() {
        var promise = fossilsCacheLoaded ? Promise.resolve(fossils) : getAllFossils();
        return promise.then(function(allFossils) {
            fossils = allFossils;
            fossilsCacheLoaded = true;
            
            // --- UPDATE DROPDOWN OPTIONS WITH COUNTS ---
            // Tally all specimens in active collection view (owned, sold, or wishlist)
            var activeCollectionFossils = fossils.filter(function(f) { 
                if (currentView === 'sold') return !!f.isSold;
                if (currentView === 'true') return !!f.isWishlist && !f.isSold;
                if (currentView === 'sale') return !f.isWishlist && !f.isSold && !!f.isForSale;
                return !f.isWishlist && !f.isSold;
            });
            
            var catTallies = {};
            var typeTallies = {};
            var periodTallies = {};
            activeCollectionFossils.forEach(function(f) {
                if (f.category) catTallies[f.category] = (catTallies[f.category] || 0) + 1;
                if (f.fossilType) typeTallies[f.fossilType] = (typeTallies[f.fossilType] || 0) + 1;
                if (f.geologicalPeriod) periodTallies[f.geologicalPeriod] = (periodTallies[f.geologicalPeriod] || 0) + 1;
            });
            
            // Category filter dropdown options update
            var catSelect = document.getElementById('filter-category');
            if (catSelect) {
                var selectedVal = catSelect.value;
                var html = '<option value="">All Categories (' + activeCollectionFossils.length + ')</option>';
                CATEGORIES.forEach(function(cat) {
                    var count = catTallies[cat] || 0;
                    html += '<option value="' + escapeHtml(cat) + '"' + (cat === selectedVal ? ' selected' : '') + '>' + escapeHtml(cat) + ' (' + count + ')</option>';
                });
                catSelect.innerHTML = html;
            }

            // Fossil Type filter dropdown options update
            var typeSelect = document.getElementById('filter-type');
            if (typeSelect) {
                var selectedVal = typeSelect.value;
                var html = '<option value="">All Types (' + activeCollectionFossils.length + ')</option>';
                FOSSIL_TYPES.forEach(function(type) {
                    var count = typeTallies[type] || 0;
                    html += '<option value="' + escapeHtml(type) + '"' + (type === selectedVal ? ' selected' : '') + '>' + escapeHtml(type) + ' (' + count + ')</option>';
                });
                typeSelect.innerHTML = html;
            }
            
            // Period filter dropdown options update
            var periodSelect = document.getElementById('filter-period');
            if (periodSelect) {
                var selectedVal = periodSelect.value;
                var html = '<option value="">All Periods (' + activeCollectionFossils.length + ')</option>';
                var groups = getPeriodsGrouped();
                groups.forEach(function(group) {
                    html += '<optgroup label="' + escapeHtml(group.era) + '">';
                    group.periods.forEach(function(per) {
                        var count = periodTallies[per] || 0;
                        html += '<option value="' + escapeHtml(per) + '"' + (per === selectedVal ? ' selected' : '') + '>' + escapeHtml(per) + ' (' + count + ')</option>';
                    });
                    html += '</optgroup>';
                });
                periodSelect.innerHTML = html;
            }
            
            // Update filter badges
            window.app.updateFilterBadges();

            var grid = document.getElementById('fossil-grid');
            grid.innerHTML = '';

            var searchQ   = document.getElementById('search').value.toLowerCase().trim();
            var catQ      = document.getElementById('filter-category').value;
            var typeQ     = document.getElementById('filter-type') ? document.getElementById('filter-type').value : '';
            var periodQ   = document.getElementById('filter-period').value;
            var sortQ     = document.getElementById('filter-sort').value;
            var wlQ       = currentView === 'true';
            var soldQ     = currentView === 'sold';

            // --- FILTER ---
            var filtered = fossils.filter(function(f) {
                var s = f.specimen ? f.specimen.toLowerCase() : '';
                var a = f.anatomy  ? f.anatomy.toLowerCase()  : '';
                var n = f.notes    ? f.notes.toLowerCase()    : '';
                var c = f.country  ? f.country.toLowerCase()  : '';
                var fm = f.formation ? f.formation.toLowerCase() : '';
                var tg = (f.tags || []).join(' ').toLowerCase();
                var foundText = f.isSelfFound ? 'self found found collected' : '';

                var matchSearch = false;
                if (!searchQ) {
                    matchSearch = true;
                } else if (searchQ.startsWith('#')) {
                    // Precise Tag Search (Exact matching for organization)
                    var tagQ = searchQ.substring(1).trim();
                    matchSearch = (f.tags || []).some(function(t) { return t.toLowerCase().indexOf(tagQ) !== -1; });
                } else {
                    // "Smart" Search: check against a virtual index for this fossil
                    // This index includes specimen name, anatomy, notes, location, and the 'Self Found' status keywords
                    if (s.indexOf(searchQ) !== -1 || a.indexOf(searchQ) !== -1 || 
                        n.indexOf(searchQ) !== -1 || c.indexOf(searchQ) !== -1 || 
                        fm.indexOf(searchQ) !== -1 || tg.indexOf(searchQ) !== -1 ||
                        foundText.indexOf(searchQ) !== -1) {
                        matchSearch = true;
                    } else {
                        // 2. Fallback to Precision Fuzzy (handles "Megladon", "Shrak", etc.)
                        // Only perform fuzzy evaluation for queries longer than 3 characters to ensure intent
                        if (searchQ.length > 3) {
                            var distSpecimen = getLevenshteinDistance(s, searchQ);
                            var distAnatomy  = getLevenshteinDistance(a, searchQ);
                            var distLocation = Math.min(getLevenshteinDistance(c, searchQ), getLevenshteinDistance(fm, searchQ));
                            
                            // We allow up to 2 typos for specimen names (longer words = more room for error)
                            // This prevents "Allosaurus" matching "Spinosaurus" (dist ~4) while
                            // still catching "Megladon" (dist 1) or "Shrak" (dist 2).
                            matchSearch = (distSpecimen <= 2) || 
                                          (distAnatomy <= 1) || 
                                          (distLocation <= 1);
                        } else {
                            matchSearch = false; // Too short for fuzzy matching
                        }
                    }
                }

                var matchCat      = !catQ    || f.category === catQ;
                var matchType     = !typeQ   || f.fossilType === typeQ;
                var matchPeriod   = !periodQ || f.geologicalPeriod === periodQ;
                var matchView = false;
                if (currentView === 'sold') {
                    matchView = !!f.isSold;
                } else if (currentView === 'true') {
                    matchView = !!f.isWishlist && !f.isSold;
                } else if (currentView === 'sale') {
                    matchView = !f.isWishlist && !f.isSold && !!f.isForSale;
                } else {
                    matchView = !f.isWishlist && !f.isSold;
                }
                return matchSearch && matchCat && matchType && matchPeriod && matchView;
            });

            // --- UPDATE SEARCH COUNT ---
            var countEl = document.getElementById('search-count');
            if (countEl) {
                countEl.innerText = filtered.length;
                if (searchQ || catQ || typeQ || periodQ) {
                    countEl.classList.add('active');
                } else {
                    countEl.classList.remove('active');
                }
            }

            // --- SORT ---
            // Helper: convert a fossil's price to SEK for normalized comparison
            var toSEK = function(f) {
                if (!f.price) return 0;
                var curr = f.currency || 'USD';
                if (curr === 'SEK') return f.price;
                if (exchangeRates && exchangeRates[curr]) {
                    return f.price / exchangeRates[curr];
                }
                // Approximate fallback rates
                if (curr === 'USD') return f.price * 10.50;
                if (curr === 'EUR') return f.price * 11.50;
                return f.price;
            };

            if (wlQ) {
                var maxRank = 0;
                var unassigned = [];
                filtered.forEach(function(f) {
                    if (typeof f.wishlistRank === 'number') {
                        if (f.wishlistRank > maxRank) maxRank = f.wishlistRank;
                    } else {
                        unassigned.push(f);
                    }
                });
                if (unassigned.length > 0) {
                    unassigned.forEach(function(f) {
                        maxRank++;
                        f.wishlistRank = maxRank;
                        updateFossil(f);
                    });
                }
                filtered.sort(function(a, b) {
                    return a.wishlistRank - b.wishlistRank;
                });
            } else {
                filtered.sort(function(a, b) {
                    switch (sortQ) {
                        case 'name-asc':   return (a.specimen || '').localeCompare(b.specimen || '');
                        case 'name-desc':  return (b.specimen || '').localeCompare(a.specimen || '');
                        case 'age-asc':    return (a.ageMa || 0) - (b.ageMa || 0);
                        case 'age-desc':   return (b.ageMa || 0) - (a.ageMa || 0);
                        case 'price-asc':  return toSEK(a) - toSEK(b);
                        case 'price-desc': return toSEK(b) - toSEK(a);
                        case 'oldest':     return (a.createdAt || 0) - (b.createdAt || 0);
                        case 'newest':
                        default:           return (b.createdAt || 0) - (a.createdAt || 0);
                    }
                });
            }

            // --- STATS DASHBOARD (OPTIMIZED: Execute ONLY if open to ensure instant tab-switching) ---
            var statsContainer = document.getElementById('stats-summary');
            if (!isStatsOpen) {
                if (statsContainer) statsContainer.style.display = 'none';
            } else {
                if (filtered.length > 0) {
                    statsContainer.style.display = 'flex';

                    // GROUP AND TALLY VALUE
                    var valueByCurrency = {};
                    var estValueByCurrency = {};
                    
                    // Charts Data Arrays
                    var countryCounts = {};
                    var maxCountryCount = 0;
                    var mostCommonCountry = null;
                    var periodCounts = {};

                    var catCounts = {};
                    var maxCatCount = 0;
                    var mostCommonCat = null;

                    var totalWeight = 0;
                    var weightCount = 0;
                    var totalSizeCm = 0;
                    var sizeCount = 0;
                    var tagCounts = {};

                    for (var i = 0; i < filtered.length; i++) {
                        var f = filtered[i];

                        // Tally Category
                        var c = f.category;
                        if (c) {
                            catCounts[c] = (catCounts[c] || 0) + 1;
                            if (catCounts[c] > maxCatCount) {
                                maxCatCount = catCounts[c];
                                mostCommonCat = c;
                            }
                        }

                        // Tally Purchase Value
                        if (f.price > 0) {
                            var curr = f.currency || 'USD';
                            valueByCurrency[curr] = (valueByCurrency[curr] || 0) + f.price;
                        }

                        // Tally Estimated Value
                        if (f.estimatedValue > 0) {
                            var estCurr = f.estimatedCurrency || 'USD';
                            estValueByCurrency[estCurr] = (estValueByCurrency[estCurr] || 0) + f.estimatedValue;
                        }

                        // Tally Country
                        var cntry = f.country ? f.country.trim() : 'Unknown';
                        if (cntry.length === 0) cntry = 'Unknown';
                        countryCounts[cntry] = (countryCounts[cntry] || 0) + 1;
                        if (countryCounts[cntry] > maxCountryCount && cntry !== 'Unknown') {
                            maxCountryCount = countryCounts[cntry];
                            mostCommonCountry = cntry;
                        }

                        // Tally Period
                        var per = f.geologicalPeriod ? f.geologicalPeriod : 'Unknown';
                        periodCounts[per] = (periodCounts[per] || 0) + 1;

                        // Tally Weight
                        if (f.weight > 0) {
                            totalWeight += f.weight;
                            weightCount++;
                        }

                        // Tally Size (Normalize to cm)
                        if (f.size > 0) {
                            var s = f.size;
                            var su = (f.sizeUnit || '').toLowerCase().trim();
                            if (su === 'inch' || su === 'in' || su === 'inches') {
                                s *= 2.54;
                            }
                            totalSizeCm += s;
                            sizeCount++;
                        }

                        // Tally Tags
                        if (f.tags && Array.isArray(f.tags)) {
                            f.tags.forEach(function(t) {
                                tagCounts[t] = (tagCounts[t] || 0) + 1;
                            });
                        }
                    }
                    
                    function calculateTotalSEK(map) {
                        var total = 0;
                        for (var k in map) {
                            var val = map[k];
                            if (exchangeRates && exchangeRates[k]) {
                                total += val / exchangeRates[k];
                            } else {
                                if (k === 'USD') total += val * 10.50;
                                else if (k === 'EUR') total += val * 11.50;
                                else total += val;
                            }
                        }
                        return total;
                    }

                    var totalCostSEK = calculateTotalSEK(valueByCurrency);
                    var totalEstSEK = calculateTotalSEK(estValueByCurrency);
                    var totalAppreciation = totalEstSEK - totalCostSEK;

                    // Redesigned Quick Stats (Better visuals)
                    var statsHtml = '<div class="stats-summary-pills" style="display: flex; flex-wrap: wrap; gap: 0.65rem; align-items: center; justify-content: flex-start;">';
                    
                    if (currentView === 'sold') {
                        var saleValueByCurrency = {};
                        filtered.forEach(function(f) {
                            if (f.isSold && f.salePrice > 0) {
                                var saleCurr = f.saleCurrency || 'USD';
                                saleValueByCurrency[saleCurr] = (saleValueByCurrency[saleCurr] || 0) + f.salePrice;
                            }
                        });
                        var totalSaleSEK = calculateTotalSEK(saleValueByCurrency);
                        var totalProfitSEK = totalSaleSEK - totalCostSEK;

                        // Count Pill
                        statsHtml += '<div class="stats-pill" style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-warm); padding: 0.4rem 0.85rem; border-radius: 2rem; border: 1px solid var(--border-color); font-size: 0.85rem; font-weight: 500;">' +
                                        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"/></svg>' +
                                        '<span><strong>' + filtered.length + '</strong> Sold Specimens</span>' +
                                      '</div>';

                        // Acquisition Cost Pill
                        if (totalCostSEK > 0) {
                            statsHtml += '<div class="stats-pill" style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-warm); padding: 0.4rem 0.85rem; border-radius: 2rem; border: 1px solid var(--border-color); font-size: 0.85rem; font-weight: 500;">' +
                                            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b5d4d" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8l-8 8M8 8l8 8"/></svg>' +
                                            '<span>Acquisition Cost: <strong>' + Math.round(totalCostSEK).toLocaleString() + ' SEK</strong></span>' +
                                          '</div>';
                        }

                        // Sales Revenue Pill
                        if (totalSaleSEK > 0) {
                            statsHtml += '<div class="stats-pill" style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-warm); padding: 0.4rem 0.85rem; border-radius: 2rem; border: 1px solid var(--border-color); font-size: 0.85rem; font-weight: 500;">' +
                                            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' +
                                            '<span>Sales Revenue: <strong>' + Math.round(totalSaleSEK).toLocaleString() + ' SEK</strong></span>' +
                                          '</div>';
                        }

                        // Net Profit / ROI Pill
                        if (totalSaleSEK > 0 && totalCostSEK > 0) {
                            var percentProfit = Math.round((totalProfitSEK / totalCostSEK) * 100);
                            var profitColor = totalProfitSEK >= 0 ? '#439775' : '#b33a3a';
                            var profitBg = totalProfitSEK >= 0 ? 'rgba(67, 151, 117, 0.1)' : 'rgba(179, 58, 58, 0.1)';
                            var profitBorder = totalProfitSEK >= 0 ? 'rgba(67, 151, 117, 0.2)' : 'rgba(179, 58, 58, 0.2)';
                            statsHtml += '<div class="stats-pill" style="display: flex; align-items: center; gap: 0.5rem; background: ' + profitBg + '; color: ' + profitColor + '; padding: 0.4rem 0.85rem; border-radius: 2rem; border: 1px solid ' + profitBorder + '; font-size: 0.85rem; font-weight: 700;">' +
                                            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>' +
                                            '<span>Net Profit: ' + (totalProfitSEK >= 0 ? '+' : '') + Math.round(totalProfitSEK).toLocaleString() + ' SEK (' + (totalProfitSEK >= 0 ? 'â†‘' : 'â†“') + percentProfit + '%)</span>' +
                                          '</div>';
                        }
                    } else {
                        // Count Pill
                        statsHtml += '<div class="stats-pill" style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-warm); padding: 0.4rem 0.85rem; border-radius: 2rem; border: 1px solid var(--border-color); font-size: 0.85rem; font-weight: 500;">' +
                                        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"/></svg>' +
                                        '<span><strong>' + filtered.length + '</strong> Specimens</span>' +
                                      '</div>';

                        // Top Origin Pill
                        if (mostCommonCountry && mostCommonCountry !== 'Unknown') {
                            var summaryFlag = getFlagHtml(mostCommonCountry);
                            statsHtml += '<div class="stats-pill" style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-warm); padding: 0.4rem 0.85rem; border-radius: 2rem; border: 1px solid var(--border-color); font-size: 0.85rem; font-weight: 500;">' +
                                            summaryFlag + '<span>Top Origin: <strong>' + (window.escapeHtml ? escapeHtml(mostCommonCountry) : mostCommonCountry) + '</strong></span>' +
                                          '</div>';
                        }

                        // Pricing Pillar (Cost)
                        if (totalCostSEK > 0) {
                            statsHtml += '<div class="stats-pill" style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-warm); padding: 0.4rem 0.85rem; border-radius: 2rem; border: 1px solid var(--border-color); font-size: 0.85rem; font-weight: 500;">' +
                                            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b5d4d" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8l-8 8M8 8l8 8"/></svg>' +
                                            '<span>Cost: <strong>' + Math.round(totalCostSEK).toLocaleString() + ' SEK</strong></span>' +
                                          '</div>';
                        }

                        // Value Pillar (Total Estimated Value)
                        if (totalEstSEK > 0) {
                            statsHtml += '<div class="stats-pill" style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-warm); padding: 0.4rem 0.85rem; border-radius: 2rem; border: 1px solid var(--border-color); font-size: 0.85rem; font-weight: 500;">' +
                                            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e6a817" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M17 12H7"/></svg>' +
                                            '<span>Value: <strong>' + Math.round(totalEstSEK).toLocaleString() + ' SEK</strong></span>' +
                                          '</div>';
                        }

                        // Appreciation Pill
                        if (totalAppreciation > 0) {
                            var percentGain = Math.round((totalAppreciation / totalCostSEK) * 100);
                            statsHtml += '<div class="stats-pill" style="display: flex; align-items: center; gap: 0.5rem; background: rgba(67, 151, 117, 0.1); color: #439775; padding: 0.4rem 0.85rem; border-radius: 2rem; border: 1px solid rgba(67, 151, 117, 0.2); font-size: 0.85rem; font-weight: 700;">' +
                                            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>' +
                                            '<span>Appreciation: +' + Math.round(totalAppreciation).toLocaleString() + ' SEK (â†‘' + percentGain + '%)</span>' +
                                          '</div>';
                        }
                    }
                    
                    statsHtml += '</div>';

                    var textContainer = document.getElementById('stats-summary-text');
                    if (textContainer) {
                        textContainer.innerHTML = statsHtml;
                    }

                    // Compressed Horizontal Legend with Flags
                    var countryListHtml = '<div class="dashboard-custom-legend" style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; align-items: center;">';
                    var sortedCountries = Object.entries(countryCounts).sort(function(a,b){ return b[1] - a[1]; });
                    var chartColors = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];
                    
                    sortedCountries.forEach(function(entry, idx) {
                        var cName = entry[0];
                        var cValue = entry[1];
                        var cFlagHtml = getFlagHtml(cName);
                        var color = chartColors[idx % chartColors.length];
                        
                        countryListHtml += '<div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; background: var(--bg-warm); padding: 0.25rem 0.6rem; border-radius: 1rem; border: 1px solid var(--border-color); white-space: nowrap;">' +
                                            '<div style="width: 8px; height: 8px; border-radius: 50%; background: ' + color + '; flex-shrink: 0;"></div>' +
                                            cFlagHtml.replace('margin-right: 0.4rem;', 'margin-right: 0;') + 
                                            '<span style="font-weight: 600;">' + (window.escapeHtml ? escapeHtml(cName) : cName) + '</span>' +
                                            '<span style="opacity: 0.6; font-weight: 700; color: var(--accent); margin-left: 0.15rem;">' + cValue + '</span>' +
                                          '</div>';
                    });
                    countryListHtml += '</div>';

                    var countryChartElem = document.getElementById('chart-country');
                    if (countryChartElem && countryChartElem.parentElement) {
                        var countryChartWrapper = countryChartElem.parentElement;
                        var existingList = countryChartWrapper.querySelector('.dashboard-country-list') || countryChartWrapper.querySelector('.dashboard-custom-legend');
                        if (existingList) existingList.remove();
                        countryChartWrapper.insertAdjacentHTML('beforeend', countryListHtml);
                    }

                    // Compressed Horizontal Legend for PERIODS
                    var periodListHtml = '<div class="dashboard-custom-legend" style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; align-items: center;">';
                    var sortedPeriods = Object.entries(periodCounts).sort(function(a,b){ return b[1] - a[1]; });
                    
                    sortedPeriods.forEach(function(entry, idx) {
                        var pName = entry[0];
                        var pValue = entry[1];
                        var color = chartColors[idx % chartColors.length];
                        
                        periodListHtml += '<div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; background: var(--bg-warm); padding: 0.25rem 0.6rem; border-radius: 1rem; border: 1px solid var(--border-color); white-space: nowrap;">' +
                                            '<div style="width: 8px; height: 8px; border-radius: 50%; background: ' + color + '; flex-shrink: 0;"></div>' +
                                            '<span style="font-weight: 600;">' + (window.escapeHtml ? escapeHtml(pName) : pName) + '</span>' +
                                            '<span style="opacity: 0.6; font-weight: 700; color: var(--accent); margin-left: 0.15rem;">' + pValue + '</span>' +
                                          '</div>';
                    });
                    periodListHtml += '</div>';

                    var periodChartElem = document.getElementById('chart-period');
                    if (periodChartElem && periodChartElem.parentElement) {
                        var periodChartWrapper = periodChartElem.parentElement;
                        var existingList = periodChartWrapper.querySelector('.dashboard-custom-legend');
                        if (existingList) existingList.remove();
                        periodChartWrapper.insertAdjacentHTML('beforeend', periodListHtml);
                    }

                    // --- DATA INSIGHTS VIEW ---
                    var dataContainer = document.getElementById('data-insights-container');
                    if (dataContainer) {
                        var dataHtml = '';

                        if (currentView === 'true') {
                            // Wishlist-Specific Data Insights
                            var targetBudgetEst = totalEstSEK;
                            var targetBudgetCost = totalCostSEK;
                            var totalBudget = targetBudgetEst > 0 ? targetBudgetEst : targetBudgetCost;
                            var missingCount = filtered.length;
                            
                            var topWantedCats = Object.entries(catCounts)
                                .sort(function(a, b) { return b[1] - a[1]; })
                                .slice(0, 4);

                            dataHtml = '<div class="data-insights-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; padding: 1rem 0;">' +
                                            // Budget Card
                                            '<div class="data-card" style="background: var(--bg-warm); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border-color); text-align: center; box-shadow: var(--shadow-sm);">' +
                                                '<div style="color: var(--accent); margin-bottom: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>' +
                                                '<div style="font-size: 0.9rem; opacity: 0.7; font-weight: 600; text-transform: uppercase;">Total Target Budget</div>' +
                                                '<div style="font-size: 2.25rem; font-weight: 800; color: var(--text-main); margin-top: 0.5rem;">' + Math.round(totalBudget).toLocaleString() + ' SEK</div>' +
                                                '<div style="font-size: 0.8rem; opacity: 0.6; margin-top: 0.25rem;">For ' + missingCount + ' tracked specimens</div>' +
                                            '</div>' +
                                            // Most Wanted Card
                                            '<div class="data-card" style="background: var(--bg-warm); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border-color); text-align: left; box-shadow: var(--shadow-sm);">' +
                                                '<div style="color: var(--accent); margin-bottom: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></div>' +
                                                '<div style="font-size: 0.9rem; opacity: 0.7; font-weight: 600; text-transform: uppercase; margin-bottom: 1rem;">Most Wanted Categories</div>';
                                                
                                                topWantedCats.forEach(function(cat) {
                                                    dataHtml += '<div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.25rem;">' +
                                                                    '<span style="font-weight: 600; opacity: 0.8;">' + cat[0] + '</span>' +
                                                                    '<span class="badge badge-wishlist">' + cat[1] + '</span>' +
                                                                '</div>';
                                                });
                                                if (topWantedCats.length === 0) dataHtml += '<div style="font-size: 0.85rem; opacity: 0.6;">No categories found.</div>';
                                                
                            dataHtml +=     '</div></div>';
                        } else {
                            // Standard Collection Data Insights
                            var avgSize = sizeCount > 0 ? (totalSizeCm / sizeCount).toFixed(2) : 0;
                            var weightStr = totalWeight >= 1000 ? (totalWeight / 1000).toFixed(2) + ' kg' : totalWeight.toFixed(1) + ' g';
                            
                            // --- CALCULATE MISSING PERIODS ---
                            var missingByEra = {};
                            var totalMissing = 0;
                            for (var era in PERIODS_AND_EPOCHS) {
                                var eraMissing = [];
                                for (var per in PERIODS_AND_EPOCHS[era]) {
                                    if (!periodCounts[per]) {
                                        eraMissing.push(per);
                                        totalMissing++;
                                    }
                                }
                                if (eraMissing.length > 0) {
                                    missingByEra[era] = eraMissing;
                                }
                            }

                            // --- CALCULATE TOP TAGS ---
                            var topTags = Object.entries(tagCounts)
                                .sort(function(a, b) { return b[1] - a[1]; })
                                .slice(0, 8);

                            // --- CALCULATE FIELD DISCOVERY SCORE ---
                            var overallOwned = fossils.filter(function(f) { return !f.isWishlist && !f.isSold; });
                            var ownedCount = overallOwned.length;
                            var selfFoundCount = overallOwned.filter(function(f) { return !!f.isSelfFound; }).length;
                            var selfFoundPercent = ownedCount > 0 ? Math.round((selfFoundCount / ownedCount) * 100) : 0;
                            
                            var rankTitle = 'Curator';
                            var rankEmoji = 'ðŸ›ï¸';
                            if (selfFoundCount >= 25) {
                                rankTitle = 'Veteran Prospector';
                                rankEmoji = 'ðŸ¦–';
                            } else if (selfFoundCount >= 10) {
                                rankTitle = 'Field Paleontologist';
                                rankEmoji = 'âš’ï¸';
                            } else if (selfFoundCount >= 3) {
                                rankTitle = 'Fossil Hunter';
                                rankEmoji = 'ðŸ¥¾';
                            } else if (selfFoundCount >= 1) {
                                rankTitle = 'Novice Explorer';
                                rankEmoji = 'ðŸ§­';
                            } else {
                                rankTitle = 'Museum Curator';
                                rankEmoji = 'ðŸ›ï¸';
                            }

                            dataHtml = '<div class="data-insights-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; padding: 1rem 0;">' +
                                            // Weight Card
                                            '<div class="data-card" style="background: var(--bg-warm); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border-color); text-align: center; box-shadow: var(--shadow-sm);">' +
                                                '<div style="color: var(--accent); margin-bottom: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></div>' +
                                                '<div style="font-size: 0.9rem; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Total Collection Weight</div>' +
                                                '<div style="font-size: 2.25rem; font-weight: 800; color: var(--text-main); margin-top: 0.5rem;">' + weightStr + '</div>' +
                                                '<div style="font-size: 0.8rem; opacity: 0.6; margin-top: 0.25rem;">From ' + weightCount + ' weighed specimens</div>' +
                                            '</div>' +
                                            // Size Card
                                            '<div class="data-card" style="background: var(--bg-warm); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border-color); text-align: center; box-shadow: var(--shadow-sm);">' +
                                                '<div style="color: var(--accent); margin-bottom: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></div>' +
                                                '<div style="font-size: 0.9rem; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Average Specimen Size</div>' +
                                                '<div style="font-size: 2.25rem; font-weight: 800; color: var(--text-main); margin-top: 0.5rem;">' + avgSize + ' cm</div>' +
                                                '<div style="font-size: 0.8rem; opacity: 0.6; margin-top: 0.25rem;">Based on ' + sizeCount + ' measured specimens</div>' +
                                            '</div>' +
                                            // Missing Periods Card
                                            '<div class="data-card" style="background: var(--bg-warm); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border-color); text-align: left; box-shadow: var(--shadow-sm);">' +
                                                '<div style="color: var(--danger); margin-bottom: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>' +
                                                '<div style="font-size: 0.9rem; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Lacking Fossils From</div>' +
                                                '<div style="margin-top: 1rem; max-height: 120px; overflow-y: auto; padding-right: 0.5rem;">';
                                                
                                                for (var era in missingByEra) {
                                                    dataHtml += '<div style="margin-bottom: 0.5rem;">' +
                                                                    '<div style="font-size: 0.7rem; font-weight: 800; color: var(--accent); text-transform: uppercase; margin-bottom: 0.25rem;">' + era + '</div>' +
                                                                    '<div style="font-size: 0.85rem; color: var(--text-primary); opacity: 0.9;">' + missingByEra[era].join(', ') + '</div>' +
                                                                '</div>';
                                                }
                                                if (totalMissing === 0) {
                                                    dataHtml += '<div style="font-size: 0.85rem; color: #439775; font-weight: 600;">You collection is geologically complete!</div>';
                                                }

                            dataHtml +=         '</div>' +
                                            '</div>' +
                                            // Top Tags Card
                                            '<div class="data-card" style="background: var(--bg-warm); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border-color); text-align: left; box-shadow: var(--shadow-sm);">' +
                                                '<div style="color: var(--accent); margin-bottom: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></div>' +
                                                '<div style="font-size: 0.9rem; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Most Frequent Tags</div>' +
                                                '<div style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">';
                                                
                                                topTags.forEach(function(tagPair) {
                                                    dataHtml += '<span class="tag-pill" style="margin: 0; background: var(--bg-surface); border: 1px solid var(--border-color); cursor: pointer;" onclick="document.getElementById(\'search\').value = \'#' + tagPair[0] + '\'; app.renderFossils();">#' + tagPair[0] + ' <small style="opacity: 0.6; margin-left: 2px;">' + tagPair[1] + '</small></span>';
                                                });
                                                if (topTags.length === 0) {
                                                    dataHtml += '<div style="font-size: 0.85rem; opacity: 0.6;">No tags used yet.</div>';
                                                }

                            dataHtml +=         '</div>' +
                                            '</div>' +
                                            // Paleontological Field Score Card
                                            '<div class="data-card" style="background: var(--bg-warm); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border-color); text-align: center; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">' +
                                                '<div>' +
                                                    '<div style="color: #e6a817; margin-bottom: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg></div>' +
                                                    '<div style="font-size: 0.9rem; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Field Discovery Score</div>' +
                                                    '<div style="font-size: 2.25rem; font-weight: 800; color: var(--text-main); margin-top: 0.5rem;">' + selfFoundPercent + '%</div>' +
                                                    '<div class="badge" style="display: inline-flex; align-items: center; gap: 0.25rem; background: var(--bg-surface); border: 1px solid var(--border-color); color: #e6a817; font-weight: 700; font-size: 0.85rem; padding: 0.25rem 0.75rem; border-radius: 2rem; margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 0.03em;">' + rankEmoji + ' ' + rankTitle + '</div>' +
                                                '</div>' +
                                                '<div>' +
                                                    '<div style="background: var(--border-color); border-radius: 9999px; height: 8px; margin-top: 1.25rem; overflow: hidden; position: relative;" title="' + selfFoundPercent + '% field discoveries">' +
                                                        '<div style="background: linear-gradient(90deg, #e6a817, #f7d070); height: 100%; width: ' + selfFoundPercent + '%; border-radius: 9999px; transition: width 0.6s ease;"></div>' +
                                                    '</div>' +
                                                    '<div style="font-size: 0.8rem; opacity: 0.6; margin-top: 0.75rem;">You collected ' + selfFoundCount + ' of your ' + ownedCount + ' active specimens personally in the field.</div>' +
                                                '</div>' +
                                            '</div>' +
                                           '</div>';
                        }
                        dataContainer.innerHTML = dataHtml;
                    }

                    // --- STRATIGRAPHIC COLUMN ---
                    // (Existing strat logic follows...)

                    if (isStatsOpen) {
                        statsContainer.style.display = 'flex';
                        
                        if (isFossilMapOpen) {
                            window.app.drawMapMarkers();
                        } else if (isDataInsightsOpen) {
                            // Logic is already handled above in the inline section
                        } else if (isTreemapOpen) {
                            window.app.renderMissingSpecimens();
                        } else if (isEarthHistoryOpen) {
                            // Refresh represented specimens list in earth history based on currently selected period
                            var activePeriodBtn = document.querySelector('.geological-sidebar button[style*="background: var(--accent-bg)"]');
                            var activePeriod = activePeriodBtn ? activePeriodBtn.textContent.trim().split('\n')[0].trim() : 'Quaternary';
                            window.app.renderEarthHistory(activePeriod);
                        } else {
                            // Render Charts with Dynamic In-Place Caching (MASSIVE Speed Boost!)
                            try {
                                var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                                var chartBorderColor = isDark ? '#141d26' : '#ffffff';

                                if (chartCountry) {
                                    // Efficient dynamic update instead of expensive destroy-recreate cycle!
                                    chartCountry.data.labels = Object.keys(countryCounts);
                                    chartCountry.data.datasets[0].data = Object.values(countryCounts);
                                    chartCountry.data.datasets[0].borderColor = chartBorderColor;
                                    chartCountry.update('none'); // silent update without layout shifts
                                } else {
                                    var ctxCountry = document.getElementById('chart-country').getContext('2d');
                                    chartCountry = new Chart(ctxCountry, {
                                        type: 'pie',
                                        data: {
                                            labels: Object.keys(countryCounts),
                                            datasets: [{
                                                data: Object.values(countryCounts),
                                                backgroundColor: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'],
                                                borderColor: chartBorderColor,
                                                borderWidth: 1.5
                                            }]
                                        },
                                        options: { 
                                            responsive: true, 
                                            maintainAspectRatio: true,
                                            aspectRatio: 1.15,
                                            plugins: { 
                                                legend: { display: false }, 
                                                title: { display: false } 
                                            } 
                                        }
                                    });
                                }

                                if (chartPeriod) {
                                    chartPeriod.data.labels = Object.keys(periodCounts);
                                    chartPeriod.data.datasets[0].data = Object.values(periodCounts);
                                    chartPeriod.data.datasets[0].borderColor = chartBorderColor;
                                    chartPeriod.update('none');
                                } else {
                                    var ctxPeriod = document.getElementById('chart-period').getContext('2d');
                                    chartPeriod = new Chart(ctxPeriod, {
                                        type: 'pie',
                                        data: {
                                            labels: Object.keys(periodCounts),
                                            datasets: [{
                                                data: Object.values(periodCounts),
                                                backgroundColor: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'],
                                                borderColor: chartBorderColor,
                                                borderWidth: 1.5
                                            }]
                                        },
                                        options: { 
                                            responsive: true, 
                                            maintainAspectRatio: true,
                                            aspectRatio: 1.15,
                                            plugins: { 
                                                legend: { display: false }, 
                                                title: { display: false } 
                                            } 
                                        }
                                    });
                                }
                            } catch (e) {
                                console.error('Chart.js update error:', e);
                            }
                        }
                    } else {
                        statsContainer.style.display = 'none';
                    }
                } else {
                    statsContainer.style.display = 'none';
                }
            }// --- RENDER CARDS ---
            grid.classList.toggle('wishlist-mode', wlQ);
            var fragment = document.createDocumentFragment();

            // Store filtered list for lightbox inter-fossil navigation
            lightboxFilteredList = filtered.slice();

            // Always prepend the Quick Add Card at the very top if in wishlist view
            if (wlQ) {
                var quickAddDiv = document.createElement('div');
                quickAddDiv.className = 'wishlist-quick-add-card';
                quickAddDiv.innerHTML = 
                    '<div class="quick-add-row">' +
                        '<div class="quick-add-inputs">' +
                            '<input type="text" id="wl-quick-name" placeholder="➕ New Specimen Name... (e.g. Spinosaurus Tooth)" aria-label="Specimen Name" onkeydown="if(event.key===\'Enter\') app.quickAddWishlist()">' +
                            '<div class="price-input-wrapper">' +
                                '<span class="currency-symbol">$</span>' +
                                '<input type="number" step="0.01" id="wl-quick-price" placeholder="Target Price" aria-label="Target Price" onkeydown="if(event.key===\'Enter\') app.quickAddWishlist()">' +
                            '</div>' +
                        '</div>' +
                        '<button class="btn-wl-quick-add" onclick="app.quickAddWishlist()" title="Add to Wishlist">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add' +
                        '</button>' +
                    '</div>' +
                    '<div class="quick-add-row-links">' +
                        '<textarea id="wl-quick-links" placeholder="Paste source links / URLs here... (Separate multiple links with space or newlines)" rows="1" oninput="this.style.height=\'\';this.style.height=this.scrollHeight+\'px\'"></textarea>' +
                    '</div>';
                fragment.appendChild(quickAddDiv);
            }

            if (filtered.length === 0) {
                var empty = document.createElement('div');
                empty.className = 'empty-state';
                empty.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
                    '<h3>No Specimens Found</h3>' +
                    '<p>' + (wlQ ? 'Quickly add a specimen to your wishlist above!' : 'Add your first fossil using the button above, or import a CSV file.') + '</p>';
                
                grid.innerHTML = '';
                if (wlQ) {
                    grid.appendChild(fragment); // Render quick add card
                }
                grid.appendChild(empty);
                return;
            }

            filtered.forEach(function(f) {
                var card = document.createElement('article');
                card.setAttribute('data-id', f.id);
                var cardInnerHtml = '';

                if (wlQ) {
                    // WISHLIST CHECKLIST VIEW
                    card.className = 'wishlist-row reminders-style';
                    
                    var urls = [];
                    if (f.sourceUrl) {
                        urls = f.sourceUrl.split(/[\n, ]+/).map(function(u) { return u.trim(); }).filter(function(u) {
                            return u.length > 0 && (u.startsWith('http://') || u.startsWith('https://') || u.indexOf('.') !== -1);
                        });
                    }

                    var linksHtml = '';
                    if (urls.length > 0) {
                        linksHtml = '<div class="wishlist-links-container">';
                        urls.forEach(function(url, idx) {
                            var displayLabel = 'Link ' + (idx + 1);
                            try {
                                var parsedUrl = new URL(url.startsWith('http') ? url : 'https://' + url);
                                displayLabel = parsedUrl.hostname.replace('www.', '');
                            } catch(e) {}
                            
                            linksHtml += '<a href="' + (url.startsWith('http') ? url : 'https://' + url) + '" target="_blank" class="wishlist-link-pill" onclick="event.stopPropagation();" title="' + escapeHtml(url) + '">' +
                                '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> ' + escapeHtml(displayLabel) +
                                '</a>';
                        });
                        linksHtml += '</div>';
                    }

                    var priceTarget = '';
                    if (f.price > 0 || f.estimatedValue > 0) {
                        var val = f.price > 0 ? f.price : f.estimatedValue;
                        var curr = f.price > 0 ? (f.currency || 'USD') : (f.estimatedCurrency || 'USD');
                        priceTarget = '<span class="wishlist-price-badge">Target: ' + val.toLocaleString() + ' ' + curr + '</span>';
                    } else {
                        priceTarget = '<span class="wishlist-price-badge empty-placeholder">—</span>';
                    }

                    cardInnerHtml = 
                        '<div class="wishlist-check-container" style="cursor: grab;" title="Drag to reorder">' +
                            '<div class="wishlist-rank-num">#' + f.wishlistRank + '</div>' +
                            '<input type="checkbox" class="wishlist-checkbox" title="Mark as Found" onchange="app.markAsFound(event, \'' + f.id + '\', \'' + escapeHtml(f.specimen) + '\')">' +
                        '</div>' +
                        '<div class="wishlist-title-column">' +
                            '<h3 class="wishlist-title">' + escapeHtml(f.specimen) + '</h3>' +
                        '</div>' +
                        '<div class="wishlist-price-column">' +
                            priceTarget +
                        '</div>' +
                        '<div class="wishlist-links-column">' +
                            (linksHtml || '<span class="wishlist-link-placeholder">—</span>') +
                        '</div>' +
                        '<div class="wishlist-row-actions-container">' +
                            '<button class="btn-acquire" onclick="app.acquireWishlistFossil(\'' + f.id + '\')" title="Acquire Specimen and Add to Collection">🚀 Acquire</button>' +
                            '<button class="btn-edit-info" title="Full Settings / Edit Specimen" onclick="app.openModal(\'' + f.id + '\')">' +
                                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:3px;"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Full Settings' +
                            '</button>' +
                            '<button class="btn-delete-wishlist" title="Delete from Wishlist" onclick="app.deleteFossilItem(\'' + f.id + '\')">' +
                                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' +
                            '</button>' +
                        '</div>';
                } else {
                    // STANDARD COLLECTION CARD VIEW
                    card.className = 'fossil-card';
                    if (selectedFossils.has(f.id)) {
                        card.classList.add('picker-selected');
                    }
                    if (newlyAddedFossilId === f.id) {
                        card.classList.add('newly-added-pulse');
                    }
                    if (f.geologicalPeriod) {
                        var pLowCard = f.geologicalPeriod.toLowerCase();
                        if (pLowCard.indexOf('ordovician') !== -1) card.classList.add('period-ordovician');
                        else if (pLowCard.indexOf('cambrian') !== -1) card.classList.add('period-cambrian');
                        else if (pLowCard.indexOf('silurian') !== -1) card.classList.add('period-silurian');
                        else if (pLowCard.indexOf('devonian') !== -1) card.classList.add('period-devonian');
                        else if (pLowCard.indexOf('carboniferous') !== -1) card.classList.add('period-carboniferous');
                        else if (pLowCard.indexOf('permian') !== -1) card.classList.add('period-permian');
                        else if (pLowCard.indexOf('triassic') !== -1) card.classList.add('period-triassic');
                        else if (pLowCard.indexOf('jurassic') !== -1) card.classList.add('period-jurassic');
                        else if (pLowCard.indexOf('cretaceous') !== -1) card.classList.add('period-cretaceous');
                        else if (pLowCard.indexOf('paleogene') !== -1) card.classList.add('period-paleogene');
                        else if (pLowCard.indexOf('neogene') !== -1) card.classList.add('period-neogene');
                        else if (pLowCard.indexOf('quaternary') !== -1) card.classList.add('period-quaternary');
                    }
                    var hasImage = f.images && f.images.length > 0;
                    var multipleImages = f.images && f.images.length > 1;
                    
                    var imgHtml = '';
                    if (hasImage) {
                        var imgCls = isAutoEnhanceActive ? 'enhanced-photo' : '';
                        var isCoverVideo = window.app.isVideo(f.images[0]);
                        
                        if (isCoverVideo) {
                            imgHtml = '<video src="' + f.images[0] + '" class="card-video" autoplay muted loop playsinline style="cursor: zoom-in;" onclick="event.stopPropagation(); var idx = parseInt(this.parentElement.getAttribute(\'data-current-index\') || 0); app.openLightbox(\'' + f.id + '\', idx);"></video>';
                        } else {
                            imgHtml = '<img src="' + f.images[0] + '" class="' + imgCls + '" alt="' + escapeHtml(f.specimen) + ' photograph" loading="lazy" style="cursor: zoom-in;" onclick="event.stopPropagation(); var idx = parseInt(this.parentElement.getAttribute(\'data-current-index\') || 0); app.openLightbox(\'' + f.id + '\', idx);" />';
                        }
                        
                        if (multipleImages) {
                            imgHtml += '<button class="carousel-btn prev" onclick="event.stopPropagation(); app.changeImage(\'' + f.id + '\', -1)">&#10094;</button>' +
                                       '<button class="carousel-btn next" onclick="event.stopPropagation(); app.changeImage(\'' + f.id + '\', 1)">&#10095;</button>' +
                                       '<div class="photo-counter" id="counter-' + f.id + '">1 / ' + f.images.length + '</div>' +
                                       '<div class="carousel-dots" id="dots-' + f.id + '">' +
                                            f.images.map(function(_, i) { return '<span class="dot ' + (i === 0 ? 'active' : '') + '"></span>'; }).join('') +
                                       '</div>';
                        }
                    } else {
                        imgHtml = '<svg class="card-placeholder-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                    }

                    var fullTimelineBlock = '';
                    if (f.ageMa > 0) {
                        var percentage = Math.min((f.ageMa / 541) * 100, 100);
                        var eraColor = '#a878d0';
                        if (f.ageMa <= 66) eraColor = '#e6a817';
                        else if (f.ageMa <= 252) eraColor = '#439775';
                        else if (f.ageMa <= 541) eraColor = '#3a8fb7';
                        
                        var geoText = (f.geologicalPeriod || 'Unknown Period') + (f.epoch ? ' (' + f.epoch + ')' : '') + (f.stratAge ? ' · ' + f.stratAge : '');

                        fullTimelineBlock = '<div class="card-timeline-container">' +
                                            '<div class="card-timeline-header">' +
                                                '<span class="card-timeline-label">Present</span>' +
                                                '<span class="card-timeline-value" style="color: ' + eraColor + ';" title="' + escapeHtml(geoText) + '">' + escapeHtml(geoText) + ' &middot; ' + f.ageMa + ' Ma</span>' +
                                            '</div>' +
                                            '<div class="card-timeline-bar-track">' +
                                                '<div class="card-timeline-bar-fill" style="width: ' + Math.max(percentage, 1) + '%; background-color: ' + eraColor + ';"></div>' +
                                            '</div></div>';
                    }

                    var speciesFirstWord = (f.specimen || '').trim().split(' ')[0] || '';
                    var wikiQuery = encodeURIComponent(speciesFirstWord);
                    var locQueryArr = [];
                    if (f.location) locQueryArr.push(f.location);
                    if (f.formation) locQueryArr.push(f.formation);
                    if (f.country) locQueryArr.push(f.country);
                    var mapQuery = encodeURIComponent(locQueryArr.join(', '));
                    
                    var flagHtml = getFlagHtml(f.country);
                    var locationTextRaw = (f.location ? escapeHtml(f.location) + ', ' : '') + flagHtml + escapeHtml(f.country || 'Unknown Origin') + (f.formation ? ' (' + escapeHtml(f.formation) + ')' : '');
                    var locationHtmlStr = locQueryArr.length > 0 ? '<a href="https://www.google.com/maps/search/?api=1&query=' + mapQuery + '" target="_blank" onclick="event.stopPropagation();" title="View on Google Maps" style="color: inherit; text-decoration: none; transition: color 0.15s ease;" onmouseover="this.style.color=\'var(--accent)\'" onmouseout="this.style.color=\'inherit\'">' + locationTextRaw + '</a>' : locationTextRaw;

                    var detailsHtml = '';
                    if (f.size || f.weight || f.price || (f.isSold && f.salePrice > 0)) {
                        detailsHtml += '<div class="card-specs-bar" style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.6rem; border-top: 1px solid var(--border-color); padding-top: 0.6rem;">';
                        
                        if (f.size) {
                            var sizeStr = formatSpecimenDimensions(f);
                            var len = parseFloat(f.size);
                            var u = (f.sizeUnit || 'cm').toLowerCase().trim();
                            var primaryDim = len + ' ' + u;
                            if (f.width && !isNaN(parseFloat(f.width))) {
                                primaryDim += ' x ' + parseFloat(f.width) + ' ' + u;
                            }
                            if (f.thickness && !isNaN(parseFloat(f.thickness))) {
                                primaryDim += ' x ' + parseFloat(f.thickness) + ' ' + u;
                            }
                            detailsHtml += '<span class="spec-micro-pill" title="Size: ' + escapeHtml(sizeStr) + '" style="display: inline-flex; align-items: center; gap: 0.25rem; background: var(--bg-warm); border: 1px solid var(--border-color); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 600; color: var(--text-secondary); cursor: pointer;">' +
                                                '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M7 9v6"/><path d="M12 9v6"/><path d="M17 9v6"/></svg>' +
                                                escapeHtml(primaryDim) +
                                           '</span>';
                        }
                        
                        if (f.weight) {
                            var weightStr = formatSpecimenWeight(f.weight);
                            var primaryWeight = parseFloat(f.weight).toLocaleString() + ' g';
                            detailsHtml += '<span class="spec-micro-pill" title="Weight: ' + escapeHtml(weightStr) + '" style="display: inline-flex; align-items: center; gap: 0.25rem; background: var(--bg-warm); border: 1px solid var(--border-color); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 600; color: var(--text-secondary); cursor: pointer;">' +
                                                '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M20 4 8 16"/><path d="m16 4-4 4"/></svg>' +
                                                escapeHtml(primaryWeight) +
                                           '</span>';
                        }
                        
                        if (f.isSold && f.salePrice > 0) {
                            var saleVal = f.salePrice + ' ' + (f.saleCurrency || 'USD');
                            detailsHtml += '<span class="spec-micro-pill" title="Sold for: ' + escapeHtml(saleVal) + '" style="display: inline-flex; align-items: center; gap: 0.25rem; background: rgba(220, 95, 60, 0.08); border: 1px solid rgba(220, 95, 60, 0.2); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; color: #eb7350;">' +
                                                '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' +
                                                'Sold: ' + escapeHtml(saleVal) +
                                           '</span>';
                        } else if (f.isForSale && f.salePrice > 0) {
                            var askVal = f.salePrice + ' ' + (f.saleCurrency || 'USD');
                            detailsHtml += '<span class="spec-micro-pill" title="Asking Price: ' + escapeHtml(askVal) + '" style="display: inline-flex; align-items: center; gap: 0.25rem; background: rgba(229, 142, 38, 0.08); border: 1px solid rgba(229, 142, 38, 0.25); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; color: var(--warning);">' +
                                                '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' +
                                                'Asking: ' + escapeHtml(askVal) +
                                           '</span>';
                        } else if (f.price) {
                            var priceVal = f.price + ' ' + (f.currency || 'USD');
                            detailsHtml += '<span class="spec-micro-pill" title="Acquisition Cost: ' + escapeHtml(priceVal) + '" style="display: inline-flex; align-items: center; gap: 0.25rem; background: var(--accent-bg); border: 1px solid rgba(139, 105, 20, 0.15); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; color: var(--accent);">' +
                                                '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' +
                                                escapeHtml(priceVal) +
                                           '</span>';
                        }
                        
                        detailsHtml += '</div>';
                    }

                    cardInnerHtml =
                        '<div class="checkbox-container">' +
                            '<input type="checkbox" aria-label="Select ' + escapeHtml(f.specimen) + '" onchange="app.toggleSelectFossil(event, \'' + f.id + '\')" ' + (selectedFossils.has(f.id) ? 'checked' : '') + '>' +
                        '</div>' +
                        '<div class="card-img-container" data-current-index="0" style="position: relative;">' + imgHtml + '</div>' +
                        '<div class="card-content">' +
                            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">' +
                                '<div style="display: flex; align-items: center; gap: 0.35rem;">' +
                                    '<span style="font-size: 0.7rem; color: var(--text-secondary); opacity: 0.8; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">' + escapeHtml(f.id) + '</span>' +
                                    (f.conditionTier ? getConditionTierBadgeHtml(f.conditionTier, true) : '') +
                                '</div>' +
                                (f.animalSize ? '<div class="animal-size-tag">' +
                                    '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m10 10-2 2 2 2"/><path d="m14 14 2-2-2-2"/><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Z"/></svg>' +
                                    f.animalSize + 'm (' + window.app.getScaleDescription(f.animalSize) + ')' +
                                '</div>' : '') +
                            '</div>' +
                            '<h3 class="card-title">' + annotateSpecimenName(f.specimen, f) + '</h3>' +
                            (f.description ? '<p class="card-description-snippet" style="font-size: 0.8rem; font-style: italic; color: var(--text-secondary); margin-top: 0.15rem; margin-bottom: 0.4rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="' + escapeHtml(f.description) + '">' + escapeHtml(f.description) + '</p>' : '') +
                            '<p class="card-meta"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> <span>' + escapeHtml(f.category) + (f.fossilType ? ' &middot; ' + escapeHtml(f.fossilType) : '') + (f.anatomy ? ' &middot; <span style="font-weight:600; color:var(--accent);">' + escapeHtml(f.anatomy) + '</span>' : '') + '</span></p>' +
                            '<p class="card-meta" style="margin-top: 0.35rem;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> <span style="word-break: break-word;">' + locationHtmlStr + '</span></p>' +
                            detailsHtml +
                            ((f.tags && f.tags.length > 0) ? '<div class="card-tags">' + f.tags.map(function(t) { return '<span class="tag-pill" onclick="event.stopPropagation(); document.getElementById(\'search\').value = \'#' + t + '\'; app.renderFossils();">#' + t + '</span>'; }).join('') + '</div>' : '') +
                            '<div class="card-footer">' +
                                '<div style="display: flex; gap: 0.5rem; align-items: center;">' +
                                    (f.isSold ? '<span class="badge badge-sold">Sold</span>' : (f.isForSale ? '<span class="badge badge-for-sale" style="background: rgba(229, 142, 38, 0.12); border: 1px solid var(--warning); color: var(--warning); font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; text-transform: uppercase;">For Sale</span>' : '<span class="badge badge-owned">Owned</span>')) +
                                    (f.isSelfFound ? '<span class="badge badge-self-found" style="display: flex; align-items: center; gap: 4px;"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Found</span>' : '') +
                                '</div>' +
                                '<div class="card-actions">' +
                                    '<button class="btn-taxonomy ' + (expandedTaxonomyIds.has(f.id) ? 'active' : '') + '" title="Biological Taxonomy" onclick="app.toggleTaxonomy(\'' + f.id + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12h14"/><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg></button>' +
                                    '<button title="Edit" onclick="app.openModal(\'' + f.id + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
                                    '<div class="card-more-menu-container">' +
                                        '<button class="btn-card-more" title="Curator Toolkit" onclick="event.stopPropagation(); app.toggleCardMenu(event, \'' + f.id + '\')">' +
                                            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' +
                                            '<span class="btn-text">Manage</span>' +
                                            '<svg class="chevron-indicator" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.85; margin-left: 1px;"><path d="m6 9 6 6 6-6"/></svg>' +
                                        '</button>' +
                                        '<div class="card-dropdown-list" id="dropdown-' + f.id + '">' +
                                            '<button class="dropdown-item" onclick="event.stopPropagation(); app.openDeepDive(\'' + f.id + '\'); app.closeAllCardMenus()"><span class="icon">🦕</span> Paleo Deep Dive</button>' +
                                            (speciesFirstWord ? '<button class="dropdown-item" onclick="event.stopPropagation(); window.open(\'https://en.wikipedia.org/wiki/Special:Search?search=\' + \'' + wikiQuery + '\', \'_blank\'); app.closeAllCardMenus()"><span class="icon">📖</span> Wikipedia Search</button>' : '') +
                                            '<button class="dropdown-item" onclick="event.stopPropagation(); app.copyListingDescription(\'' + f.id + '\'); app.closeAllCardMenus()"><span class="icon">📋</span> Copy Sales Info</button>' +
                                            '<button class="dropdown-item" onclick="event.stopPropagation(); app.printLabel(\'' + f.id + '\'); app.closeAllCardMenus()"><span class="icon">🖨️</span> Print Label</button>' +
                                            '<button class="dropdown-item" onclick="event.stopPropagation(); app.duplicateFossil(\'' + f.id + '\'); app.closeAllCardMenus()"><span class="icon">👥</span> Duplicate Specimen</button>' +
                                            (f.isSold ? 
                                                '<button class="dropdown-item" onclick="event.stopPropagation(); app.restoreToCollectionQuick(\'' + f.id + '\', \'' + escapeHtml(f.specimen).replace(/'/g, "\\'") + '\'); app.closeAllCardMenus()"><span class="icon">↩️</span> Restore to Collection</button>' : 
                                                (!f.isWishlist ? '<button class="dropdown-item" onclick="event.stopPropagation(); app.markAsSoldQuick(\'' + f.id + '\', \'' + escapeHtml(f.specimen).replace(/'/g, "\\'") + '\'); app.closeAllCardMenus()"><span class="icon">💰</span> Mark as Sold</button>' : '')
                                            ) +
                                            '<div class="dropdown-divider"></div>' +
                                            '<button class="dropdown-item danger-action" onclick="event.stopPropagation(); app.deleteFossilItem(\'' + f.id + '\'); app.closeAllCardMenus()"><span class="icon">🗑️</span> Delete Specimen</button>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        fullTimelineBlock +
                        getFullTaxonomyTray(f);
                }

                if (wlQ) {
                    card.draggable = true;
                    card.addEventListener('dragstart', window.app.handleDragStart);
                    card.addEventListener('dragover', window.app.handleDragOver);
                    card.addEventListener('dragenter', window.app.handleDragEnter);
                    card.addEventListener('dragleave', window.app.handleDragLeave);
                    card.addEventListener('drop', window.app.handleDrop);
                    card.addEventListener('dragend', window.app.handleDragEnd);
                }

                card.innerHTML = cardInnerHtml;
                
                if (!wlQ) {
                    card.onclick = function(e) {
                        if (comparePickerModeActive) {
                            var action = e.target.closest('.card-actions, .wishlist-actions, a, button, .carousel-btn, .tag-pill, .checkbox-container');
                            if (!action) {
                                e.preventDefault();
                                e.stopPropagation();
                                var cb = card.querySelector('.checkbox-container input[type="checkbox"]');
                                if (cb) {
                                    cb.checked = !cb.checked;
                                    var evt = document.createEvent('HTMLEvents');
                                    evt.initEvent('change', true, true);
                                    cb.dispatchEvent(evt);
                                }
                            }
                        }
                    };
                }
                
                fragment.appendChild(card);
            });

            grid.innerHTML = ''; // Batch clear
            grid.appendChild(fragment); // Batch append
        });
    },
    draggedFossilId: null,

    handleDragStart: function(e) {
        window.app.draggedFossilId = this.getAttribute('data-id');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', window.app.draggedFossilId);
        this.classList.add('dragging');
    },

    handleDragOver: function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    },

    handleDragEnter: function(e) {
        this.classList.add('drag-over');
    },

    handleDragLeave: function(e) {
        this.classList.remove('drag-over');
    },

    handleDrop: function(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        this.classList.remove('drag-over');
        
        var draggedId = window.app.draggedFossilId;
        var targetId = this.getAttribute('data-id');
        
        if (draggedId !== targetId && draggedId) {
            var grid = document.getElementById('fossil-grid');
            var rows = Array.from(grid.querySelectorAll('.wishlist-row'));
            
            var draggedIndex = rows.findIndex(function(row) { return row.getAttribute('data-id') === draggedId; });
            var targetIndex = rows.findIndex(function(row) { return row.getAttribute('data-id') === targetId; });
            
            if (draggedIndex < 0 || targetIndex < 0) return false;
            
            var draggedRow = rows.splice(draggedIndex, 1)[0];
            rows.splice(targetIndex, 0, draggedRow);
            
            grid.innerHTML = '';
            rows.forEach(function(row) { grid.appendChild(row); });
            
            var updates = [];
            rows.forEach(function(row, index) {
                var id = row.getAttribute('data-id');
                var f = fossils.find(function(x) { return x.id === id; });
                if (f && f.wishlistRank !== index + 1) {
                    f.wishlistRank = index + 1;
                    updates.push(updateFossil(f));
                }
            });
            
            Promise.all(updates).then(function() {
                window.app.renderFossils();
            });
        }
        return false;
    },

    handleDragEnd: function(e) {
        this.classList.remove('dragging');
        var cols = document.querySelectorAll('.wishlist-row');
        [].forEach.call(cols, function (col) {
            col.classList.remove('drag-over');
        });
    },

    copySpecimenName: function(name) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(name).then(function() {
                if (window.app.showToast) {
                    window.app.showToast('Copied: ' + name, 2000);
                }
            });
        }
    },

    markAsFound: function(event, id, specimenName) {
        if (event.target.checked) {
            if (confirm('Did you find this specimen? Move "' + specimenName + '" from Wishlist to your Physical Collection?')) {
                var f = fossils.find(function(x) { return x.id === id; });
                if (f) {
                    f.isWishlist = false;
                    updateFossil(f).then(function() {
                        window.app.renderFossils();
                    });
                }
            } else {
                // User cancelled - uncheck the box
                event.target.checked = false;
            }
        }
    },

    acquireWishlistFossil: function(id) {
        var f = fossils.find(function(x) { return x.id === id; });
        if (!f) return;
        
        var name = f.specimen || 'this specimen';
        var costInput = prompt('Enter acquisition cost for "' + name + '" (leave blank if unknown):');
        if (costInput === null) return; // user cancelled
        
        var cost = parseFloat(costInput) || null;
        var currency = 'USD';
        if (cost !== null) {
            var currInput = prompt('Enter currency (USD, EUR, SEK):', 'USD');
            if (currInput) currency = currInput.toUpperCase();
        }
        
        f.isWishlist = false;
        if (cost !== null) {
            f.price = cost;
            f.currency = currency;
        }
        
        updateFossil(f).then(function() {
            if (window.app.showToast) {
                window.app.showToast('🚀 "' + name + '" is now part of your Physical Collection!', 'success');
            }
            window.app.renderFossils();
        });
    },

    renderStratigraphicColumn: function(currentFossils) {
        var stratContainer = document.getElementById('strat-column-container');
        if (!stratContainer) return;
        
        // Count owned fossils per period (only non-wishlist from the current filtered set)
        var ownedByPeriod = {};
        currentFossils.forEach(function(f) {
            if (!f.isWishlist && f.geologicalPeriod) {
                ownedByPeriod[f.geologicalPeriod] = (ownedByPeriod[f.geologicalPeriod] || 0) + 1;
            }
        });
        
        // Define the column from newest (top) to oldest (bottom)
        var phanerozoicGroups = [
            {
                era: 'Cenozoic', color: '#e6a817', 
                periods: ['Quaternary', 'Neogene', 'Paleogene']
            },
            {
                era: 'Mesozoic', color: '#439775', 
                periods: ['Cretaceous', 'Jurassic', 'Triassic']
            },
            {
                era: 'Paleozoic', color: '#3a8fb7', 
                periods: ['Permian', 'Carboniferous', 'Devonian', 'Silurian', 'Ordovician', 'Cambrian']
            }
        ];
        
        var html = '<div class="strat-column">';
        
        phanerozoicGroups.forEach(function(group) {
            html += '<div class="strat-era-group">';
            html += '<div class="strat-era-label" style="background-color: ' + group.color + ';">' + group.era + '</div>';
            html += '<div class="strat-periods">';
            
            group.periods.forEach(function(per) {
                var count = ownedByPeriod[per] || 0;
                var isMissing = count === 0;
                var bgColor = isMissing ? 'var(--bg-card)' : group.color + 'E6'; // slightly transparent era color
                var textColor = isMissing ? 'var(--text-muted)' : '#ffffff';
                var missingClass = isMissing ? ' strat-missing' : '';
                
                var context = GEOLOGICAL_CONTEXT[per] || "";
                var tooltipHTML = per + " — " + context + " (You have " + count + " specimens)";
                
                html += '<div class="strat-block' + missingClass + ' strat-tooltip-trigger" style="background-color: ' + bgColor + '; color: ' + textColor + ';" data-tooltip="' + escapeHtml(tooltipHTML) + '">';
                html += '<span class="strat-name">' + per + '</span>';
                if (!isMissing) {
                    html += '<span class="strat-count">' + count + '</span>';
                }
                html += '</div>';
            });
            
            html += '</div></div>';
        });
        
        html += '</div>';
        stratContainer.innerHTML = html;
    },

    copyLLMContext: function() {
        if (!fossils || fossils.length === 0) {
            window.app.showToast('No specimens in database to copy!', 'warning');
            return;
        }

        var text = '# Specimenry Personal Fossil Collection Database\n' +
                   'Exported on: ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + '\n' +
                   'Total Specimens: ' + fossils.length + '\n\n' +
                   'This file contains the full curatorial context of all fossils in the user\'s private collection database. ' +
                   'Use this context to analyze, summarize, estimate scientific values, or answer general paleontological questions based on their specimens.\n\n' +
                   '==================================================\n\n';

        fossils.forEach(function(f, idx) {
            text += '## Specimen #' + (idx + 1) + ': ' + (f.specimen || 'Unnamed Specimen') + ' (' + (f.id || 'N/A') + ')\n';
            text += '- **Catalog ID**: ' + (f.id || 'N/A') + '\n';
            text += '- **Category**: ' + (f.category || 'N/A') + '\n';
            if (f.fossilType) text += '- **Fossil Type**: ' + f.fossilType + '\n';
            if (f.anatomy) text += '- **Anatomy/Part**: ' + f.anatomy + '\n';
            
            var periodText = f.geologicalPeriod || '';
            if (f.epoch) periodText += ' (' + f.epoch + ')';
            if (f.ageMa) periodText += ' - ' + f.ageMa + ' Ma';
            if (periodText) text += '- **Geological Age**: ' + periodText + '\n';
            
            if (f.formation) text += '- **Geological Formation**: ' + f.formation + '\n';
            
            var locText = '';
            if (f.location) locText += f.location;
            if (f.country) locText += (locText ? ', ' : '') + f.country;
            if (locText) text += '- **Origin Location**: ' + locText + '\n';
            
            var dimensions = [];
            if (f.size) dimensions.push('Size: ' + formatSpecimenDimensions(f));
            if (f.weight) dimensions.push('Weight: ' + formatSpecimenWeight(f.weight));
            if (f.animalSize) dimensions.push('Est. Entire Animal Size: ' + f.animalSize + 'm');
            if (dimensions.length > 0) text += '- **Physical Dimensions**: ' + dimensions.join(' | ') + '\n';
            
            var statusText = f.isWishlist ? 'Wishlist Specimen' : (f.isSold ? 'Sold' : 'Owned / Physical Collection');
            text += '- **Curation Status**: ' + statusText + '\n';
            
            var cond = f.condition || {};
            var condLabels = [];
            if (cond.stable) condLabels.push('Stable');
            if (cond.cracking) condLabels.push('Cracking/Fractured');
            if (cond.efflorescence) condLabels.push('Efflorescence');
            if (cond.pyrite) condLabels.push('Pyrite Decay');
            if (condLabels.length === 0) condLabels.push('Stable');
            text += '- **Preservation Condition**: ' + condLabels.join(', ') + '\n';
            if (f.conditionTier) {
                var tierName = '';
                switch(f.conditionTier.toUpperCase()) {
                    case 'S': tierName = 'S-Tier (Museum Grade)'; break;
                    case 'A': tierName = 'A-Tier (Excellent)'; break;
                    case 'B': tierName = 'B-Tier (Good)'; break;
                    case 'C': tierName = 'C-Tier (Fair)'; break;
                    case 'D': tierName = 'D-Tier (Field Grade)'; break;
                    default: tierName = f.conditionTier.toUpperCase() + '-Tier';
                }
                text += '- **Preservation Grade**: ' + tierName + '\n';
            }
            
            var financial = [];
            if (f.price) financial.push('Acquisition Cost: ' + f.price + ' ' + (f.currency || 'USD'));
            if (f.isSold && f.salePrice) financial.push('Sale Price: ' + f.salePrice + ' ' + (f.saleCurrency || 'USD'));
            if (financial.length > 0) text += '- **Financial Valuation**: ' + financial.join(' | ') + '\n';
            
            text += '- **Self-Found**: ' + (f.isSelfFound ? 'Yes' : 'No') + '\n';
            
            if (f.tags && f.tags.length > 0) text += '- **Custom Tags**: #' + f.tags.join(' #') + '\n';
            if (f.notes) text += '- **Curator Notes**: ' + f.notes + '\n';
            if (f.description) text += '- **Prehistoric Biology & Description**: ' + f.description + '\n';
            if (f.authority) text += '- **Taxonomic Authority**: ' + f.authority + '\n';
            if (f.scientificEtymology) text += '- **Scientific Name Etymology**: ' + f.scientificEtymology + '\n';
            
            if (f.taxonomy) {
                var taxKeys = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
                var taxChain = [];
                taxKeys.forEach(function(k) {
                    if (f.taxonomy[k]) taxChain.push(f.taxonomy[k]);
                });
                if (taxChain.length > 0) text += '- **Biological Taxonomy Hierarchy**: ' + taxChain.join(' > ') + '\n';
            }
            
            text += '\n--------------------------------------------------\n\n';
        });

        text += '=== End of Specimen Context ===\n';

        // 1. Trigger text file download for Claude/ChatGPT direct drag-and-drop
        try {
            var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'specimenry_fossils_ai_context.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('File download failed', e);
        }

        // 2. Attempt to copy to clipboard for instant paste
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function() {
                window.app.showToast('📋 Copied AI/LLM Context (' + fossils.length + ' Specimens) & Downloaded Context File!', 'success', 3500);
            }).catch(function(err) {
                console.error('Copy failed', err);
                window.app.showToast('Downloaded text file, but clipboard copy failed.', 'info', 3000);
            });
        } else {
            window.app.showToast('Downloaded context file (clipboard not supported).', 'info', 3000);
        }
    },

    // --- Export / Import ---
    exportData: function() {
        try {
            localStorage.setItem('last_backup', Date.now().toString());
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
        var pd = document.querySelector('#btn-export .pulse-dot');
        if (pd) pd.remove();
        exportToJSON(); 
    },

    importJSON: function(event) {
        var file = event.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var data = JSON.parse(e.target.result);
                if (!Array.isArray(data)) {
                    throw new Error("Invalid format: Expected an array of fossils.");
                }

                var successCount = 0;
                var chain = Promise.resolve();

                data.forEach(function(fossil) {
                    chain = chain.then(function() {
                        // "put" handles both insert (if id is brand new) and update
                        return updateFossil(fossil).then(function() {
                            successCount++;
                        });
                    });
                });

                chain.then(function() {
                    window.app.showToast('Successfully restored ' + successCount + ' fossil(s) from backup!', 'success');
                    window.app.renderFossils();
                    document.getElementById('file-restore-json').value = '';
                });

            } catch (err) {
                window.app.showToast('Error reading JSON backup: ' + err.message, 'error');
                document.getElementById('file-restore-json').value = '';
            }
        };
        reader.readAsText(file);
    },

    autoFetchMissingTaxonomy: function(toFetchList) {
        if (isAutoFetching) return;
        
        var missing = (toFetchList || []).filter(function(f) { 
            return !f.taxonomy && f.specimen && f.specimen.trim() !== ''; 
        });
        
        if (missing.length === 0) return;
        
        isAutoFetching = true;
        var count = 0;
        var total = missing.length;
        
        function fetchNext() {
            if (!isTreemapOpen || missing.length === 0) {
                isAutoFetching = false;
                var statusEl = document.getElementById('treemap-status');
                if (statusEl) statusEl.style.display = 'none';
                return;
            }
            
            var f = missing.shift();
            count++;
            
            var statusEl = document.getElementById('treemap-status');
            if (statusEl) {
                statusEl.innerText = 'Updating taxonomy database: ' + count + ' / ' + total + '...';
                statusEl.style.display = 'block';
            }
            
            fetchTaxonomyData(f.specimen)
                .then(function(taxonomy) {
                    f.taxonomy = taxonomy;
                    return updateFossil(f);
                })
                .then(function() {
                    // Update only the treemap if it's still open
                    if (isTreemapOpen) {
                        window.app.renderMissingSpecimens();
                    }
                    setTimeout(fetchNext, 1000); // 1s second delay to be gentle with PBDB API
                })
                .catch(function() {
                    setTimeout(fetchNext, 500); // Shorter delay on error
                });
        }
        
        fetchNext();
    },

    renderTaxonomyTreemap: function(filtered) {
        var container = document.getElementById('treemap-container');
        if (!container) return;

        // --- 1. Aggregation ---
        var hierarchy = { name: "Root", children: [] };
        var phylaMap = {};

        filtered.forEach(function(f) {
            var tax = f.taxonomy || {};
            var phylum = tax.phylum || f.category || "Unknown Phylum";
            var className = tax.class || "Unknown Class";
            var order = tax.order || "Unknown Order";

            if (!phylaMap[phylum]) {
                phylaMap[phylum] = { name: phylum, children: [], map: {}, value: 0 };
                hierarchy.children.push(phylaMap[phylum]);
            }
            phylaMap[phylum].value++;
            
            var pNode = phylaMap[phylum];
            if (!pNode.map[className]) {
                pNode.map[className] = { name: className, children: [], map: {}, value: 0 };
                pNode.children.push(pNode.map[className]);
            }
            pNode.map[className].value++;
        });

        // --- 2. Squarified Algorithm ---
        function getSquarifiedLayout(rect, nodes) {
            var totalValue = nodes.reduce(function(a, b) { return a + b.value; }, 0);
            var sorted = nodes.slice().sort(function(a, b) { return b.value - a.value; });
            var result = [];

            function worst(row, side) {
                var rSum = row.reduce(function(a, b) { return a + b; }, 0);
                var rMax = Math.max.apply(null, row);
                var rMin = Math.min.apply(null, row);
                return Math.max((side * side * rMax) / (rSum * rSum), (rSum * rSum) / (side * side * rMin));
            }

            function layoutRow(row, r, total) {
                var rowTotal = row.reduce(function(a, b) { return a + b.value; }, 0);
                var isVertical = r.w < r.h;
                var side = isVertical ? r.w : r.h;
                var otherSide = rowTotal / total * (isVertical ? r.h : r.w);
                var offset = 0;

                row.forEach(function(item) {
                    var length = item.value / rowTotal * side;
                    var nodeRect = isVertical 
                        ? { x: r.x + offset, y: r.y, w: length, h: otherSide }
                        : { x: r.x, y: r.y + offset, w: otherSide, h: length };
                    result.push({ name: item.name, value: item.value, x: nodeRect.x, y: nodeRect.y, w: nodeRect.w, h: nodeRect.h });
                    offset += length;
                });

                if (isVertical) { r.y += otherSide; r.h -= otherSide; }
                else { r.x += otherSide; r.w -= otherSide; }
            }

            var currentRow = [];
            while (sorted.length > 0) {
                var item = sorted[0];
                var side = rect.w < rect.h ? rect.w : rect.h;
                var rowValues = currentRow.map(function(d) { return d.value; });
                var curWorst = currentRow.length === 0 ? Infinity : worst(rowValues, side);
                var nextWorst = worst(rowValues.concat([item.value]), side);

                if (curWorst >= nextWorst) {
                    currentRow.push(sorted.shift());
                } else {
                    layoutRow(currentRow, rect, totalValue);
                    currentRow = [];
                }
            }
            if (currentRow.length > 0) layoutRow(currentRow, rect, totalValue);
            return result;
        }

        // --- 3. Render SVG ---
        var width = container.clientWidth - 40;
        if (width <= 0) width = 800; // Fallback
        var height = 500;
        var svgHtml = '<svg class="treemap-svg" viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="xMidYMid meet">';
        
        var colors = ['#a878d0', '#6eb4f2', '#82c91e', '#fab005', '#fd7e14', '#fa5252', '#be4bdb', '#7950f2', '#228be6', '#12b886', '#40c057', '#82c91e'];
        
        var phylaLayout = getSquarifiedLayout({x: 0, y: 0, w: width, h: height}, hierarchy.children);
        
        phylaLayout.forEach(function(node, idx) {
            var color = colors[idx % colors.length];
            svgHtml += '<g class="treemap-node" data-name="' + node.name + '" data-count="' + node.value + '">';
            svgHtml += '<rect class="treemap-rect" x="' + node.x + '" y="' + node.y + '" width="' + node.w + '" height="' + node.h + '" fill="' + color + '"></rect>';
            
            if (node.w > 40 && node.h > 30) {
                var fontSize = Math.min(node.w / 6, node.h / 4, 14);
                svgHtml += '<text class="treemap-label" x="' + (node.x + node.w/2) + '" y="' + (node.y + node.h/2 - 5) + '" style="font-size: ' + fontSize + 'px;" dominant-baseline="middle" text-anchor="middle">' + node.name + '</text>';
                svgHtml += '<text class="treemap-sublabel" x="' + (node.x + node.w/2) + '" y="' + (node.y + node.h/2 + 10) + '" style="font-size: ' + (fontSize * 0.8) + 'px;" dominant-baseline="middle" text-anchor="middle">' + node.value + ' specimens</text>';
            }
            svgHtml += '<title>' + node.name + ': ' + node.value + ' specimens</title>';
            svgHtml += '</g>';
        });
        
        svgHtml += '</svg>';
        
        var statusHtml = '<div id="treemap-status" style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.5rem; text-align: center; display: ' + (isAutoFetching ? 'block' : 'none') + ';">Updating taxonomy...</div>';
        
        container.innerHTML = '<h3 class="chart-title" style="margin-bottom: 0.5rem; text-align: center;">Taxonomic Diversity (Treemap)</h3>' + 
                             '<p style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-bottom: 1.5rem;">Hierarchy: Phylum > Class > Order</p>' + 
                             svgHtml + statusHtml;
    },

    fetchSourceThumb: function(f) {
        if (!f.sourceUrl || f.sourceThumb || f.sourceThumbFailed) return;
        
        f.sourceThumbFailed = true; // Set to prevent concurrent fetches
        
        var proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(f.sourceUrl);
        
        fetch(proxyUrl)
            .then(function(response) {
                if (response.ok) return response.json();
                throw new Error('Network response was not ok.');
            })
            .then(function(data) {
                if (!data || !data.contents) return;
                var html = data.contents;
                
                // Extremely simple regex to parse og:image
                var match = html.match(/<meta[^>]*property=['"]og:image['"][^>]*content=['"]([^'"]+)['"]/i) || 
                            html.match(/<meta[^>]*content=['"]([^'"]+)['"][^>]*property=['"]og:image['"]/i) ||
                            html.match(/<meta[^>]*name=['"]twitter:image['"][^>]*content=['"]([^'"]+)['"]/i);
                            
                if (match && match[1]) {
                    var imgUrl = match[1];
                    // Handle relative URLs
                    if (imgUrl.startsWith('/')) {
                        var urlObj = new URL(f.sourceUrl);
                        imgUrl = urlObj.protocol + '//' + urlObj.host + imgUrl;
                    }
                    
                    // Avoid data URIs being too large to store or invalid strings
                    if (imgUrl.startsWith('http')) {
                        delete f.sourceThumbFailed;
                        f.sourceThumb = imgUrl;
                        updateFossil(f).then(function() {
                            // Re-render if we are in wishlist view
                            if (currentView === 'true') {
                                window.app.renderFossils();
                            }
                        });
                    }
                }
            })
            .catch(function(error) {
                console.warn('Could not fetch source thumb for:', f.specimen, error);
            });
    },

    importCSV: function(event) {
        var file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                var successCount = 0;
                var chain = Promise.resolve();

                results.data.forEach(function(row) {
                    var m = normalizeCSVRow(row);
                    if (m.specimen && m.specimen.trim() !== '') {
                        chain = chain.then(function() {
                            successCount++;
                            return addFossil({
                                id: generateId(),
                                specimen: m.specimen.trim(),
                                category: m.category || '',
                                isWishlist: m.isWishlist,
                                geologicalPeriod: m.geologicalPeriod,
                                epoch: m.epoch,
                                ageMa: m.ageMa,
                                country: m.country,
                                location: m.location,
                                formation: m.formation,
                                size: m.size,
                                weight: m.weight,
                                price: m.price,
                                notes: m.notes,
                                isSold: m.isSold || false,
                                salePrice: m.salePrice || null,
                                saleCurrency: m.saleCurrency || 'USD',
                                images: [],
                                createdAt: Date.now()
                            });
                        });
                    }
                });

                chain.then(function() {
                    window.app.showToast('Successfully imported ' + successCount + ' fossil(s)!', 'success');
                    window.app.renderFossils();
                    document.getElementById('file-import').value = '';
                });
            }
        });
    },

    openCompareSelected: function() {
        var selected = fossils.filter(function(f) {
            return selectedFossils.has(f.id);
        });
        if (selected.length < 2 || selected.length > 3) {
            window.app.showToast('Please select exactly 2 or 3 specimens to compare side-by-side.', 'warning');
            return;
        }
        window.app.openCompareMode(selected);
    },

    openCompareMode: function(selectedList) {
        var modal = document.getElementById('compare-modal');
        var container = document.getElementById('compare-columns-container');
        if (!modal || !container) return;
        
        // Calculate highlight differences (size, age, weight)
        // Size normalization: convert inches to cm if sizeUnit matches inches
        var sizes = selectedList.map(function(f) {
            if (!f.size) return 0;
            var num = parseFloat(f.size);
            if (isNaN(num)) return 0;
            var su = (f.sizeUnit || 'cm').toLowerCase().trim();
            var isInch = (su === 'inch' || su === 'in' || su === 'inches');
            return isInch ? num * 2.54 : num;
        });
        var ages = selectedList.map(function(f) {
            var num = parseFloat(f.ageMa);
            return isNaN(num) ? 0 : num;
        });
        var weights = selectedList.map(function(f) {
            var num = parseFloat(f.weight);
            return isNaN(num) ? 0 : num;
        });
        
        var maxSizeIdx = -1;
        var maxAgeIdx = -1;
        var maxWeightIdx = -1;

        if (sizes.some(function(s) { return s > 0; })) {
            maxSizeIdx = sizes.indexOf(Math.max.apply(null, sizes));
        }
        if (ages.some(function(a) { return a > 0; })) {
            maxAgeIdx = ages.indexOf(Math.max.apply(null, ages));
        }
        if (weights.some(function(w) { return w > 0; })) {
            maxWeightIdx = weights.indexOf(Math.max.apply(null, weights));
        }
        
        var html = '';
        selectedList.forEach(function(f, idx) {
            var color = getEraColor(f.geologicalPeriod);
            
            // Construct highlight badges
            var highlightsHtml = '<div class="compare-highlights">';
            
            if (idx === maxAgeIdx && ages[idx] > 0 && selectedList.length > 1) {
                var otherAges = ages.filter(function(x, i) { return i !== idx && x > 0; });
                if (otherAges.length > 0) {
                    var ageDiff = (ages[idx] - Math.min.apply(null, otherAges)).toFixed(1);
                    if (parseFloat(ageDiff) > 0) {
                        highlightsHtml += '<span class="comp-badge older">⏳ Older (+' + ageDiff + ' Ma)</span>';
                    }
                }
            }
            if (idx === maxSizeIdx && sizes[idx] > 0 && selectedList.length > 1) {
                var otherSizes = sizes.filter(function(x, i) { return i !== idx && x > 0; });
                if (otherSizes.length > 0) {
                    var sizeDiff = (sizes[idx] - Math.min.apply(null, otherSizes)).toFixed(1);
                    if (parseFloat(sizeDiff) > 0) {
                        highlightsHtml += '<span class="comp-badge larger">📐 Larger (+' + sizeDiff + ' cm)</span>';
                    }
                }
            }
            if (idx === maxWeightIdx && weights[idx] > 0 && selectedList.length > 1) {
                var otherWeights = weights.filter(function(x, i) { return i !== idx && x > 0; });
                if (otherWeights.length > 0) {
                    var weightDiff = (weights[idx] - Math.min.apply(null, otherWeights)).toFixed(1);
                    if (parseFloat(weightDiff) > 0) {
                        highlightsHtml += '<span class="comp-badge heavier">⚖️ Heavier (+' + weightDiff + ' g)</span>';
                    }
                }
            }
            highlightsHtml += '</div>';
            
            // Standardize condition and treatments text
            var cond = f.condition || {};
            var condLabels = [];
            if (cond.stable) condLabels.push('🟢 Stable');
            if (cond.cracking) condLabels.push('⚡ Cracking');
            if (cond.efflorescence) condLabels.push('⚪ Efflorescence');
            if (cond.pyrite) condLabels.push('🔥 Pyrite Decay');
            if (condLabels.length === 0) condLabels.push('🟢 Stable');
            
            var treat = f.treatment || {};
            var treatLabels = [];
            if (treat.paraloid) treatLabels.push('🧪 B-72');
            if (treat.scribe) treatLabels.push('⛏️ Air Scribe');
            if (treat.cyano) treatLabels.push('💧 Glued');
            if (treat.water) treatLabels.push('🛡️ Stabilized');
            
            var imgHtml = '';
            if (f.images && f.images.length > 0) {
                var isVid = window.app.isVideo(f.images[0]);
                if (isVid) {
                    imgHtml = '<video id="compare-img-' + f.id + '" src="' + f.images[0] + '" class="compare-img" autoplay muted loop playsinline onclick="window.app.openZoomOverlay(this.src)"></video>';
                } else {
                    imgHtml = '<img id="compare-img-' + f.id + '" src="' + f.images[0] + '" class="compare-img" onclick="window.app.openZoomOverlay(this.src)">';
                }
                if (f.images.length > 1) {
                    imgHtml += '<button type="button" class="compare-img-toggle-btn" onclick="window.app.toggleCompareImage(\'' + f.id + '\')" title="Toggle Fossil vs Life Reconstruction">🦴 Fossil View</button>';
                }
            } else {
                imgHtml = '<div class="compare-img-placeholder" style="display:flex;align-items:center;justify-content:center;height:100%;background:rgba(255,255,255,0.02);color:rgba(255,255,255,0.2);">' +
                          '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' +
                          '</div>';
            }
            
            var epochStage = [];
            if (f.epoch) epochStage.push(f.epoch);
            if (f.stratAge) epochStage.push(f.stratAge);
            var epochStageText = epochStage.length > 0 ? epochStage.join(' · ') : 'N/A';

            html += '<div class="compare-column-card">' +
                        '<div class="compare-img-box" style="border-bottom-color: ' + color + ';">' +
                            imgHtml +
                        '</div>' +
                        '<div class="compare-card-body">' +
                            '<div class="compare-card-header">' +
                                '<h4 class="compare-card-title">' + escapeHtml(f.specimen || 'Unnamed') + '</h4>' +
                                '<p class="compare-card-subtitle">' + escapeHtml(f.anatomy || 'Specimen') + '</p>' +
                            '</div>' +
                            highlightsHtml +
                            '<div class="compare-spec-section">' +
                                '<h5>🧬 Classification & Timeline</h5>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Catalog ID</span><span class="compare-spec-value">' + escapeHtml(f.id || 'N/A') + '</span></div>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Category</span><span class="compare-spec-value">' + escapeHtml(f.category || 'N/A') + '</span></div>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Fossil Type</span><span class="compare-spec-value">' + escapeHtml(f.fossilType || 'N/A') + '</span></div>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Timeline</span><span class="compare-spec-value">' + escapeHtml(f.geologicalPeriod || 'N/A') + '</span></div>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Epoch / Stage</span><span class="compare-spec-value">' + escapeHtml(epochStageText) + '</span></div>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Est. Age</span><span class="compare-spec-value">' + (f.ageMa ? f.ageMa + ' Ma' : 'N/A') + '</span></div>' +
                            '</div>' +
                            '<div class="compare-spec-section">' +
                                '<h5>📍 Geological Origin</h5>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Formation</span><span class="compare-spec-value">' + escapeHtml(f.formation || 'N/A') + '</span></div>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Location / Site</span><span class="compare-spec-value">' + escapeHtml(f.location || 'N/A') + '</span></div>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Country</span><span class="compare-spec-value">' + escapeHtml(f.country || 'N/A') + '</span></div>' +
                            '</div>' +
                            '<div class="compare-spec-section">' +
                                '<h5>📐 Sizing & Curation</h5>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Specimen Size</span><span class="compare-spec-value">' + (f.size ? formatSpecimenDimensions(f) : 'N/A') + '</span></div>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Weight</span><span class="compare-spec-value">' + (f.weight ? formatSpecimenWeight(f.weight) : 'N/A') + '</span></div>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Est. Animal Size</span><span class="compare-spec-value">' + (f.animalSize ? f.animalSize + ' m' : 'N/A') + '</span></div>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Value</span><span class="compare-spec-value">' + (f.price ? f.price + ' ' + (f.currency || 'USD') : 'N/A') + '</span></div>' +
                            '</div>' +
                            (f.authority || f.description ? 
                            '<div class="compare-spec-section">' +
                                '<h5>🦕 Prehistoric Biology</h5>' +
                                (f.authority ? '<div class="compare-spec-row"><span class="compare-spec-label">Named By / Authority</span><span class="compare-spec-value">' + escapeHtml(f.authority) + '</span></div>' : '') +
                                (f.description ? '<div class="compare-notes-box" style="font-style: italic; line-height: 1.35; max-height: 80px; overflow-y: auto;">' + escapeHtml(f.description) + '</div>' : '') +
                            '</div>' : '') +
                            '<div class="compare-spec-section">' +
                                '<h5>🩺 Curation & Preservation</h5>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Condition</span><span class="compare-spec-value">' + escapeHtml(condLabels.join(', ')) + (f.conditionTier ? getConditionTierBadgeHtml(f.conditionTier) : '') + '</span></div>' +
                                '<div class="compare-spec-row"><span class="compare-spec-label">Treatments</span><span class="compare-spec-value">' + escapeHtml(treatLabels.join(', ') || 'None') + '</span></div>' +
                            '</div>' +
                            '<div class="compare-spec-section">' +
                                '<h5>📝 Curatorial Notes</h5>' +
                                '<div class="compare-notes-box">' + escapeHtml(f.notes || 'No notes logged.') + '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        });
        
        container.innerHTML = html;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },

    closeCompareMode: function() {
        var modal = document.getElementById('compare-modal');
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = '';
    },

    toggleComparePickerMode: function() {
        comparePickerModeActive = !comparePickerModeActive;
        
        var btnToggle = document.getElementById('btn-toggle-compare-picker');
        var linkToggle = document.getElementById('link-compare-picker');
        var banner = document.getElementById('compare-picker-banner');
        var grid = document.getElementById('fossil-grid');
        
        if (comparePickerModeActive) {
            // Enter Mode
            if (btnToggle) {
                btnToggle.style.background = 'var(--accent)';
                btnToggle.style.color = 'var(--bg-surface)';
                btnToggle.style.borderColor = 'var(--accent)';
                btnToggle.innerText = '⚖️ Close Compare';
            }
            if (linkToggle) {
                linkToggle.innerHTML = '⚖️ Compare Mode: On';
                linkToggle.style.fontWeight = 'bold';
                linkToggle.style.color = 'var(--accent)';
            }
            if (banner) {
                banner.style.display = 'block';
                // Trigger reflow
                void banner.offsetWidth;
                banner.classList.add('active');
            }
            if (grid) {
                grid.classList.add('compare-picker-active');
            }
            window.app.showToast('Compare Mode Active! Click any 2 or 3 cards to select.', 'info');
        } else {
            // Exit Mode
            if (btnToggle) {
                btnToggle.style.background = '';
                btnToggle.style.color = '';
                btnToggle.style.borderColor = '';
                btnToggle.innerText = '⚖️ Compare';
            }
            if (linkToggle) {
                linkToggle.innerHTML = '⚖️ Compare Mode: Off';
                linkToggle.style.fontWeight = '';
                linkToggle.style.color = '';
            }
            if (banner) {
                banner.classList.remove('active');
                setTimeout(function() {
                    if (!comparePickerModeActive) banner.style.display = 'none';
                }, 400);
            }
            if (grid) {
                grid.classList.remove('compare-picker-active');
            }
        }
        
        window.app.updateMassDeleteButton(); // update counts
    },

    copyListingDescription: function(fossilId) {
        var f = fossils.find(function(x) { return x.id === fossilId; });
        if (!f) return;
        
        var name = (f.specimen || 'Unnamed Specimen').trim();
        var anatomy = (f.anatomy || 'N/A').trim();
        var cat = (f.category || 'N/A').trim();
        
        var taxonomyText = '';
        if (f.taxonomy) {
            var ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
            var ranksArr = [];
            ranks.forEach(function(rnk) {
                if (f.taxonomy[rnk]) {
                    ranksArr.push(rnk.charAt(0).toUpperCase() + rnk.slice(1) + ': ' + f.taxonomy[rnk]);
                }
            });
            if (ranksArr.length > 0) {
                taxonomyText = '\nTaxonomic Classification:\n  ' + ranksArr.join('\n  ');
            }
        }
        
        var ageText = f.ageMa ? f.ageMa + ' Million Years Ago (Ma)' : 'N/A';
        var epochStage = [];
        if (f.epoch) epochStage.push(f.epoch);
        if (f.stratAge) epochStage.push(f.stratAge);
        var epochStageText = epochStage.length > 0 ? epochStage.join(' · ') : 'N/A';
        
        var form = f.formation || 'N/A';
        var loc = f.location || 'N/A';
        var country = f.country || 'N/A';
        
        var sizeVal = f.size ? formatSpecimenDimensions(f) : 'N/A';
        var weightVal = f.weight ? formatSpecimenWeight(f.weight) : 'N/A';
        var animalSizeVal = f.animalSize ? f.animalSize + ' m' : 'N/A';
        
        var cond = f.condition || {};
        var condLabels = [];
        if (cond.stable || (!cond.cracking && !cond.efflorescence && !cond.pyrite)) condLabels.push('Stable (No decay)');
        if (cond.cracking) condLabels.push('Cracking / Fracturing');
        if (cond.efflorescence) condLabels.push('Efflorescence (Powdery white dust)');
        if (cond.pyrite) condLabels.push('Pyrite Decay / Sulfide rot');
        
        var treat = f.treatment || {};
        var treatLabels = [];
        if (treat.paraloid) treatLabels.push('Consolidated with Paraloid B-72');
        if (treat.scribe) treatLabels.push('Mechanically cleaned (Air scribe / needle)');
        if (treat.cyano) treatLabels.push('Glued with Cyanoacrylate (Superglue)');
        if (treat.water) treatLabels.push('Stabilized with Paraloid B-67 / PVA / PEG');
        if (treatLabels.length === 0) treatLabels.push('None logged');
        
        var notesVal = f.notes || 'No curatorial notes logged.';
        
        var salesText = '';
        if (f.isForSale && f.salePrice > 0) {
            salesText = '* Commercial Offering:\n' +
                        '  - Status: UP FOR SALE\n' +
                        '  - Asking Price: ' + f.salePrice + ' ' + (f.saleCurrency || 'USD') + '\n\n';
        } else if (f.isSold && f.salePrice > 0) {
            salesText = '* Commercial Offering:\n' +
                        '  - Status: SOLD\n' +
                        '  - Sale Price: ' + f.salePrice + ' ' + (f.saleCurrency || 'USD') + '\n\n';
        }

        var desc = 
            '==================================================\n' +
            'SPECIMEN CATALOG RECORD: ' + name.toUpperCase() + '\n' +
            '==================================================\n\n' +
            '* Classification & Biology:\n' +
            '  - Specimen Name: ' + name + '\n' +
            '  - Category: ' + cat + '\n' +
            '  - Anatomy / Part: ' + anatomy + '\n' +
            (taxonomyText ? '  - ' + taxonomyText.trim() + '\n' : '') + '\n' +
            '* Geological Origin & Timeline:\n' +
            '  - Timeline / Period: ' + (f.geologicalPeriod || 'N/A') + '\n' +
            '  - Epoch / Stage: ' + epochStageText + '\n' +
            '  - Estimated Age: ' + ageText + '\n' +
            '  - Geological Formation: ' + form + '\n' +
            '  - Precise Locality: ' + loc + '\n' +
            '  - Country of Origin: ' + country + '\n\n' +
            '* Physical Specifications:\n' +
            '  - Dimensions: ' + sizeVal + '\n' +
            '  - Weight: ' + weightVal + '\n' +
            '  - Est. Entire Animal Size: ' + animalSizeVal + '\n\n' +
            '* Preservation & Curation History:\n' +
            '  - Preservation Condition: ' + condLabels.join(', ') + '\n' +
            '  - Preparation Treatments Applied: ' + treatLabels.join(', ') + '\n\n' +
            (salesText ? salesText : '') +
            '* Curatorial Notes & Provenance:\n' +
            '  ' + notesVal + '\n\n' +
            '==================================================\n' +
            'Generated via Specimenry Curator Platform\n' +
            '==================================================';
            
        navigator.clipboard.writeText(desc).then(function() {
            window.app.showToast('📋 Copied listing description to clipboard!', 'success');
        }).catch(function(err) {
            console.error('Clipboard copy failed', err);
            window.app.showToast('Failed to copy to clipboard.', 'error');
        });
    },

    toggleCardMenu: function(event, fossilId) {
        event.stopPropagation();
        var dropdown = document.getElementById('dropdown-' + fossilId);
        var container = dropdown ? dropdown.closest('.card-more-menu-container') : null;
        var wasActive = dropdown && dropdown.classList.contains('active');
        
        // Close all first
        window.app.closeAllCardMenus();
        
        // If it wasn't active, open it now
        if (dropdown && !wasActive) {
            dropdown.classList.add('active');
            if (container) container.classList.add('active');
        }
    },

    closeAllCardMenus: function() {
        var dropdowns = document.querySelectorAll('.card-dropdown-list.active');
        dropdowns.forEach(function(d) {
            d.classList.remove('active');
            var container = d.closest('.card-more-menu-container');
            if (container) container.classList.remove('active');
        });
    },

    // =========================================================================
    // PREMIUM PALEO DEEP DIVE & SIMULATOR LOGIC
    // =========================================================================
    openDeepDive: function(fossilId) {
        isDeepDiveOpen = true;
        
        var modal = document.getElementById('deep-dive-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Lock background scroll
        }
        
        // Clear simulator console
        var consoleElem = document.getElementById('deep-dive-simulation-console');
        if (consoleElem) {
            consoleElem.innerHTML = '<div class="console-placeholder">🎮 Select a prehistoric behavior above to begin the simulation...</div>';
        }
        
        // Close dropdown menu in header
        var enrichDropdown = document.getElementById('enrich-dropdown');
        if (enrichDropdown) enrichDropdown.classList.remove('active');
        
        // Populate quick-switcher picker dropdown with all owned collection fossils
        var picker = document.getElementById('deep-dive-picker');
        if (picker) {
            picker.innerHTML = '';
            var ownedFossils = fossils.filter(function(x) { return !x.isWishlist && !x.isSold; });
            if (ownedFossils.length === 0) {
                ownedFossils = fossils;
            }
            window.app._deepDiveFossils = ownedFossils;
            
            ownedFossils.forEach(function(f) {
                var opt = document.createElement('option');
                opt.value = f.id;
                opt.textContent = (f.specimen || 'Unnamed Specimen');
                if (f.id === fossilId) {
                    opt.selected = true;
                }
                picker.appendChild(opt);
            });
        }
        
        // Select target fossil
        var targetId = fossilId || (fossils.length > 0 ? fossils[0].id : null);
        if (targetId) {
            window.app.renderDeepDiveProfile(targetId);
        } else {
            window.app.showToast('No specimens available for Deep Dive.', 'warning');
        }
    },

    closeDeepDive: function() {
        isDeepDiveOpen = false;
        activeDeepDiveFossilId = null;
        var modal = document.getElementById('deep-dive-modal');
        if (modal) {
            modal.style.display = 'none';
            
            // Check if lightbox is also NOT active to restore body scroll
            var lightbox = document.getElementById('lightbox');
            if (!lightbox || !lightbox.classList.contains('active')) {
                document.body.style.overflow = '';
            }
        }
    },

    navigateDeepDive: function(direction) {
        if (!window.app._deepDiveFossils || window.app._deepDiveFossils.length <= 1) return;
        var currentId = activeDeepDiveFossilId;
        var currentIndex = window.app._deepDiveFossils.findIndex(function(x) { return x.id === currentId; });
        if (currentIndex === -1) return;
        
        var nextIndex = currentIndex + direction;
        if (nextIndex < 0) {
            nextIndex = window.app._deepDiveFossils.length - 1;
        } else if (nextIndex >= window.app._deepDiveFossils.length) {
            nextIndex = 0;
        }
        
        var nextFossil = window.app._deepDiveFossils[nextIndex];
        if (nextFossil) {
            // Update picker selection
            var picker = document.getElementById('deep-dive-picker');
            if (picker) {
                picker.value = nextFossil.id;
            }
            window.app.renderDeepDiveProfile(nextFossil.id);
        }
    },

    renderDeepDiveProfile: function(fossilId) {
        var f = fossils.find(function(x) { return x.id === fossilId; });
        if (!f) return;
        
        activeDeepDiveFossilId = fossilId;
        
        // Update picker select if someone changed via click instead of dropdown
        var picker = document.getElementById('deep-dive-picker');
        if (picker && picker.value !== fossilId) {
            picker.value = fossilId;
        }

        // Update navigation arrow buttons with coming fossil names permanently visible
        if (window.app._deepDiveFossils && window.app._deepDiveFossils.length > 0) {
            var currentIndex = window.app._deepDiveFossils.findIndex(function(x) { return x.id === fossilId; });
            if (currentIndex !== -1) {
                var prevIdx = currentIndex - 1;
                if (prevIdx < 0) prevIdx = window.app._deepDiveFossils.length - 1;
                var nextIdx = currentIndex + 1;
                if (nextIdx >= window.app._deepDiveFossils.length) nextIdx = 0;
                
                var prevF = window.app._deepDiveFossils[prevIdx];
                var nextF = window.app._deepDiveFossils[nextIdx];
                
                var prevBtn = document.getElementById('deep-dive-prev-btn');
                var nextBtn = document.getElementById('deep-dive-next-btn');
                
                if (prevBtn && prevF) {
                    prevBtn.innerHTML = '&#10094; <span class="nav-species-name">' + escapeHtml(prevF.specimen || 'Unnamed') + '</span>';
                    prevBtn.setAttribute('title', 'Previous: ' + (prevF.specimen || 'Unnamed') + ' (←)');
                }
                if (nextBtn && nextF) {
                    nextBtn.innerHTML = '<span class="nav-species-name">' + escapeHtml(nextF.specimen || 'Unnamed') + '</span> &#10095;';
                    nextBtn.setAttribute('title', 'Next: ' + (nextF.specimen || 'Unnamed') + ' (→)');
                }
            }
        }
        
        // Geological Era classification & class updates
        var nameLower = (f.specimen || '').toLowerCase();
        var period = (f.geologicalPeriod || '').trim().toLowerCase();
        
        // Smart name-based overrides to guarantee academic accuracy
        var nameEra = null;
        var nameEraLabel = null;
        var namePeriod = null;
        var nameClimate = null;
        var nameTemp = null;
        var nameOxygen = null;
        var nameCoexisting = null;
        var nameEcology = null;
        
        if (nameLower.indexOf('dickinsonia') !== -1 || nameLower.indexOf('charnia') !== -1 || nameLower.indexOf('spriggina') !== -1 || nameLower.indexOf('kimberella') !== -1 || nameLower.indexOf('ediacara') !== -1 || nameLower.indexOf('precambrian') !== -1 || nameLower.indexOf('stromatolite') !== -1) {
            nameEra = 'precambrian';
            nameEraLabel = 'Precambrian Time';
            namePeriod = 'Ediacaran / Precambrian';
            nameClimate = "Primordial Cool Greenhouse";
            nameTemp = "12°C - 15°C (Cool & Stable)";
            nameOxygen = "10% to 15% of Modern levels (2-3%)";
            nameCoexisting = "Ediacaran Biota (Dickinsonia, Spriggina, Charnia), microbial mats";
            nameEcology = "Passive benthic absorption (osmotrophy) or grazing on thick cyanobacterial microbial mats along shallow oxygen-depleted sandstone seafloors.";
        } else if (nameLower.indexOf('anomalocaris') !== -1 || nameLower.indexOf('elrathia') !== -1 || nameLower.indexOf('pikaia') !== -1 || nameLower.indexOf('hallucigenia') !== -1 || nameLower.indexOf('cambrian') !== -1) {
            nameEra = 'paleozoic';
            nameEraLabel = 'Paleozoic Era';
            namePeriod = 'Cambrian Period';
            nameClimate = "Tropical Shallow Epicontinental Shelf Seas";
            nameTemp = "22°C - 25°C (Warm Ocean Pools)";
            nameOxygen = "75% of Modern levels (approx. 16%)";
            nameCoexisting = "Anomalocaris, Elrathia trilobites, Wiwaxia, Hallucigenia, sponges";
            nameEcology = "Benthic scavenger or predatory nektonic hunter navigating early ocean beds during the Cambrian Explosion.";
        } else if (nameLower.indexOf('flexicalymene') !== -1 || nameLower.indexOf('calymene') !== -1 || nameLower.indexOf('orthoceras') !== -1 || nameLower.indexOf('cameroceras') !== -1 || nameLower.indexOf('ordovician') !== -1 || nameLower.indexOf('silurian') !== -1) {
            nameEra = 'paleozoic';
            nameEraLabel = 'Paleozoic Era';
            namePeriod = (nameLower.indexOf('orthoceras') !== -1 || nameLower.indexOf('flexicalymene') !== -1 || nameLower.indexOf('ordovician') !== -1) ? 'Ordovician Period' : 'Silurian Period';
            nameClimate = "Warm Carbonate Shelf Seas & High Sea Levels";
            nameTemp = "20°C - 24°C (Temperate)";
            nameOxygen = "100% of Modern levels (approx. 21%)";
            nameCoexisting = "Orthoceras cephalopods, Flexicalymene trilobites, crinoid beds, brachiopods";
            nameEcology = "Active cephalopod apex predator or detritivorous trilobite crawling along Ordovician seafloor muds.";
        } else if (nameLower.indexOf('dunkleosteus') !== -1 || nameLower.indexOf('phacops') !== -1 || nameLower.indexOf('devonian') !== -1) {
            nameEra = 'paleozoic';
            nameEraLabel = 'Paleozoic Era';
            namePeriod = 'Devonian Period';
            nameClimate = "Warm Greenhouse to Late Devonian Glaciation";
            nameTemp = "20°C - 22°C";
            nameOxygen = "90% of Modern levels (approx. 19%)";
            nameCoexisting = "Jawed placoderm fish (Dunkleosteus), Phacops trilobites, early seed ferns";
            nameEcology = "Armored predatory placoderm ruling Devonian waterways or benthic calcified scavenger.";
        } else if (nameLower.indexOf('dimetrodon') !== -1 || nameLower.indexOf('permian') !== -1) {
            nameEra = 'paleozoic';
            nameEraLabel = 'Paleozoic Era';
            namePeriod = 'Permian Period';
            nameClimate = "Arid Supercontinent Pangea Climates";
            nameTemp = "19°C - 23°C";
            nameOxygen = "110% of Modern levels (approx. 23%)";
            nameCoexisting = "Dimetrodon synapsids, Eryops amphibians, seed ferns, early conifers";
            nameEcology = "Apex terrestrial synapsid predator displaying a massive heat-regulating dorsal sail.";
        } else if (nameLower.indexOf('stegosaurus') !== -1 || nameLower.indexOf('allosaurus') !== -1 || nameLower.indexOf('diplodocus') !== -1 || nameLower.indexOf('brachiosaurus') !== -1 || nameLower.indexOf('jurassic') !== -1) {
            nameEra = 'mesozoic';
            nameEraLabel = 'Mesozoic Era';
            namePeriod = 'Jurassic Period';
            nameClimate = "Humid Megamonsoonal Forested Plains";
            nameTemp = "22°C - 26°C (Warm & Humid)";
            nameOxygen = "120% of Modern levels (approx. 26%)";
            nameCoexisting = "Stegosaurus, Allosaurus, Brachiosaurus, Archaeopteryx, giant tree ferns";
            
            if (nameLower.indexOf('allosaurus') !== -1) {
                nameEcology = "Fearsome terrestrial apex theropod predator ('the Lion of the Jurassic') utilizing blade-like serrated teeth, active ambush tactics, and muscular limbs to hunt sub-adult sauropods.";
            } else if (nameLower.indexOf('stegosaurus') !== -1) {
                nameEcology = "Large herbivorous armored dinosaur browsing low conifers and ferns, relying on vascularized bony plates for heat regulation and a spiked tail (thagomizer) for defense.";
            } else {
                nameEcology = "Immensely sized herbivorous sauropod, browsing high gymnosperm tree canopies and relying on pure bulk as a passive defense against giant theropods.";
            }
        } else if (nameLower.indexOf('tyrannosaurus') !== -1 || nameLower.indexOf('t-rex') !== -1 || nameLower.indexOf('trex') !== -1 || nameLower.indexOf('triceratops') !== -1 || nameLower.indexOf('velociraptor') !== -1 || nameLower.indexOf('spinosaurus') !== -1 || nameLower.indexOf('carcharodontosaurus') !== -1 || nameLower.indexOf('mosasaur') !== -1 || nameLower.indexOf('pteranodon') !== -1 || nameLower.indexOf('cretaceous') !== -1 || nameLower.indexOf('hell creek') !== -1 || nameLower.indexOf('kem kem') !== -1) {
            nameEra = 'mesozoic';
            nameEraLabel = 'Mesozoic Era';
            namePeriod = 'Cretaceous Period';
            nameClimate = "Hot Greenhouse & Vast Epicontinental Inland Seaways";
            nameTemp = "24°C - 28°C (Extreme Greenhouse)";
            nameOxygen = "140% to 150% of Modern levels (approx. 29-30%)";
            nameCoexisting = "Tyrannosaurus Rex, Triceratops, Edmontosaurus, Mosasaurs, Pteranodon, cycads";
            
            if (nameLower.indexOf('tyrannosaurus') !== -1 || nameLower.indexOf('t-rex') !== -1 || nameLower.indexOf('trex') !== -1) {
                nameEcology = "Late Cretaceous apex land predator, possessing highly vascularized crushing jaws with a bone-shattering bite force of ~6 metric tons and binocular vision.";
            } else if (nameLower.indexOf('spinosaurus') !== -1) {
                nameEcology = "Highly specialized semiaquatic river giant, utilizing a crocodile-like skull, conical teeth, and dense bones to hunt giant Cretaceous sawfish and lungfish.";
            } else if (nameLower.indexOf('triceratops') !== -1) {
                nameEcology = "Massive herbivorous ceratopsian browsing low-lying shrubbery, utilizing its signature three-horned frill for combat, protection, and species display.";
            } else if (nameLower.indexOf('mosasaur') !== -1) {
                nameEcology = "Marine apex predator reptile patrolling warm shallow oceans, employing powerful flippers and double-hinged jaw lines to swallow ammonites and sharks whole.";
            } else {
                nameEcology = "High-metabolism Cretaceous terrestrial dinosaur or coastal pterosaur, specialized for active foraging and survival across coastal floodplains.";
            }
        } else if (nameLower.indexOf('ammonite') !== -1 || nameLower.indexOf('cleoniceras') !== -1 || nameLower.indexOf('dactylioceras') !== -1 || nameLower.indexOf('baculites') !== -1 || nameLower.indexOf('belemnite') !== -1) {
            nameEra = 'mesozoic';
            nameEraLabel = 'Mesozoic Era';
            namePeriod = nameLower.indexOf('dactylioceras') !== -1 ? 'Jurassic Period' : 'Cretaceous Period';
            nameClimate = "Warm Shallow Coastal Seaways & Carbonate Shelves";
            nameTemp = "22°C - 25°C";
            nameOxygen = "130% of Modern levels (approx. 27%)";
            nameCoexisting = "Mosasaur predators, Belemnites, marine bivalves, Cretaceous fish";
            nameEcology = "Buoyant cephalopod floating through water columns, adjusting gas/liquid ratios in chambered shells.";
        } else if (nameLower.indexOf('megalodon') !== -1 || nameLower.indexOf('carcharocles') !== -1 || nameLower.indexOf('miocene') !== -1) {
            nameEra = 'cenozoic';
            nameEraLabel = 'Cenozoic Era';
            namePeriod = 'Neogene Period (Miocene)';
            nameClimate = "Global Cooling & Warm Temperate Oceans";
            nameTemp = "16°C - 19°C (Oceanic)";
            nameOxygen = "100% of Modern levels (21%)";
            nameCoexisting = "Megalodon sharks, ancient baleen whales, early dolphins, sea lions";
            nameEcology = "Apex macropredatory shark cruising warm temperate coastlines, feeding on calorie-rich cetaceans.";
        } else if (nameLower.indexOf('mammoth') !== -1 || nameLower.indexOf('mastodon') !== -1 || nameLower.indexOf('smilodon') !== -1 || nameLower.indexOf('saber-toothed') !== -1 || nameLower.indexOf('sabre-toothed') !== -1 || nameLower.indexOf('pleistocene') !== -1) {
            nameEra = 'cenozoic';
            nameEraLabel = 'Cenozoic Era';
            namePeriod = 'Quaternary Period (Pleistocene)';
            nameClimate = "Fluctuating Glacial-Interglacial Icehouse (Ice Age)";
            nameTemp = "10°C - 14°C (Cold & Seasonally Extreme)";
            nameOxygen = "100% of Modern levels (21%)";
            nameCoexisting = "Woolly Mammoths, Smilodon saber-toothed cats, mastodons, early humans, woolly rhinos";
            nameEcology = "Cold-adapted megafauna roaming expansive mammoth-steppe tundras or specialized ambush mammalian predator.";
        }
        
        var era = 'mesozoic'; // default fallback
        var eraLabel = 'Mesozoic Era';
        
        if (nameEra !== null) {
            era = nameEra;
            eraLabel = nameEraLabel;
            period = namePeriod.toLowerCase();
        } else {
            if (period.indexOf('precambrian') !== -1 || period.indexOf('ediacaran') !== -1 || period.indexOf('archean') !== -1 || period.indexOf('proterozoic') !== -1) {
                era = 'precambrian';
                eraLabel = 'Precambrian Time';
            } else if (period.indexOf('cambrian') !== -1 || period.indexOf('ordovician') !== -1 || period.indexOf('silurian') !== -1 || period.indexOf('devonian') !== -1 || period.indexOf('carboniferous') !== -1 || period.indexOf('permian') !== -1) {
                era = 'paleozoic';
                eraLabel = 'Paleozoic Era';
            } else if (period.indexOf('triassic') !== -1 || period.indexOf('jurassic') !== -1 || period.indexOf('cretaceous') !== -1) {
                era = 'mesozoic';
                eraLabel = 'Mesozoic Era';
            } else if (period.indexOf('paleogene') !== -1 || period.indexOf('neogene') !== -1 || period.indexOf('quaternary') !== -1 || period.indexOf('eocene') !== -1 || period.indexOf('miocene') !== -1 || period.indexOf('oligocene') !== -1 || period.indexOf('pleistocene') !== -1 || period.indexOf('cenozoic') !== -1) {
                era = 'cenozoic';
                eraLabel = 'Cenozoic Era';
            }
        }
        
        var scenicStage = document.getElementById('deep-dive-scenic-stage');
        if (scenicStage) {
            // Remove previous era classes and add current one
            scenicStage.className = 'deep-dive-scenic-stage era-' + era;
        }
        
        // Populate Scenic details
        var eraTag = document.getElementById('deep-dive-era-tag');
        var specimenName = document.getElementById('deep-dive-specimen-name');
        var specimenSub = document.getElementById('deep-dive-specimen-sub');
        var photoCircle = document.getElementById('deep-dive-photo-circle');
        
        if (eraTag) eraTag.textContent = eraLabel;
        if (specimenName) specimenName.textContent = f.specimen || 'Unnamed Specimen';
        if (specimenSub) {
            var subParts = [];
            if (nameEra !== null) {
                subParts.push(namePeriod);
            } else if (f.geologicalPeriod) {
                subParts.push(f.geologicalPeriod);
            }
            if (f.epoch) subParts.push(f.epoch);
            if (f.ageMa) subParts.push('~' + f.ageMa + ' Ma');
            specimenSub.textContent = subParts.join(' · ');
        }
        
        if (photoCircle) {
            if (f.images && f.images.length > 0) {
                var isVid = window.app.isVideo(f.images[0]);
                if (isVid) {
                    photoCircle.innerHTML = '<video src="' + f.images[0] + '" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid rgba(255,255,255,0.15); cursor: zoom-in;" muted autoplay loop playsinline onclick="window.app.openZoomOverlay(this.src)"></video>';
                } else {
                    photoCircle.innerHTML = '<img src="' + f.images[0] + '" alt="' + escapeHtml(f.specimen) + ' fossil specimen" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid rgba(255,255,255,0.15); cursor: zoom-in;" onclick="window.app.openZoomOverlay(this.src)">';
                }
            } else {
                var catEmoji = '🦴';
                if (f.category) {
                    var cat = f.category.toLowerCase();
                    if (cat.indexOf('vertebrate') !== -1 && cat.indexOf('invertebrate') === -1) catEmoji = '🦖';
                    else if (cat.indexOf('invertebrate') !== -1) catEmoji = '🐚';
                    else if (cat.indexOf('plant') !== -1) catEmoji = '🌿';
                    else if (cat.indexOf('trace') !== -1) catEmoji = '🐾';
                    else if (cat.indexOf('microfossil') !== -1) catEmoji = '🔬';
                }
                photoCircle.innerHTML = '<div style="font-size: 3rem; display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; background: rgba(255,255,255,0.05); color: #fff; border-radius: 50%; border: 3px solid rgba(255,255,255,0.1);">' + catEmoji + '</div>';
            }
        }
        
        var lifeCircle = document.getElementById('deep-dive-life-circle');
        if (lifeCircle) {
            if (f.images && f.images.length > 1) {
                var isVid = window.app.isVideo(f.images[1]);
                if (isVid) {
                    lifeCircle.innerHTML = '<video src="' + f.images[1] + '" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid rgba(255,255,255,0.15); cursor: zoom-in;" muted autoplay loop playsinline onclick="window.app.openZoomOverlay(this.src)"></video>';
                } else {
                    lifeCircle.innerHTML = '<img src="' + f.images[1] + '" alt="' + escapeHtml(f.specimen) + ' life reconstruction" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid rgba(255,255,255,0.15); cursor: zoom-in;" onclick="window.app.openZoomOverlay(this.src)">';
                }
            } else {
                var nameClean = (f.specimen || '').trim();
                var genus = nameClean.split(' ')[0];
                genus = genus.replace(/\([^)]*\)/g, '').replace(/\b(?:cf\.|sp\.|\?)\b/g, '').replace(/[^a-zA-Z]/g, '');
                if (genus) {
                    window.app.fetchWikipediaLifeImage(genus, f);
                } else {
                    var catEmoji = '🦖';
                    if (f.category) {
                        var cat = f.category.toLowerCase();
                        if (cat.indexOf('vertebrate') !== -1 && cat.indexOf('invertebrate') === -1) catEmoji = '🦖';
                        else if (cat.indexOf('invertebrate') !== -1) catEmoji = '🐚';
                        else if (cat.indexOf('plant') !== -1) catEmoji = '🌿';
                        else if (cat.indexOf('trace') !== -1) catEmoji = '🐾';
                        else if (cat.indexOf('microfossil') !== -1) catEmoji = '🔬';
                    }
                    lifeCircle.innerHTML = '<div style="font-size: 2.2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%; background: rgba(255,255,255,0.04); color: #cbd5e0; border-radius: 50%; border: 3px solid rgba(255,255,255,0.1); line-height: 1.2; text-align: center; padding: 0.2rem;">' +
                                           '<span>' + catEmoji + '</span>' +
                                           '<span style="font-size: 0.52rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #a0aec0; margin-top: 0.2rem;">No Image</span>' +
                                           '</div>';
                }
            }
        }
        
        // Compile scientific environmental dossier details
        var climate = "Global Temperate Greenhouse";
        var temp = "18°C (Mild)";
        var oxygen = "100% of Modern levels (21%)";
        var coexisting = "Various ancient flora and fauna";
        var ecology = "Occupy standard ecological niches of the time.";
        
        if (nameEra !== null) {
            climate = nameClimate;
            temp = nameTemp;
            oxygen = nameOxygen;
            coexisting = nameCoexisting;
            ecology = nameEcology;
        } else {
            if (era === 'precambrian') {
                climate = "Primordial Cool Greenhouse";
                temp = "12°C - 15°C (Cool & Stable)";
                oxygen = "10% to 15% of Modern levels (2-3%)";
                coexisting = "Ediacaran Biota (Dickinsonia, Spriggina, Charnia), microbial mats";
                ecology = "Passive benthic absorption (osmotrophy) or grazing on thick microbial mats along shallow oxygen-depleted sandstone sea floors.";
            } else if (era === 'paleozoic') {
                climate = "Epicontinental Seas to Icehouse Fluctuations";
                temp = "20°C - 25°C (Warm marine pools)";
                oxygen = "80% to 110% of Modern levels (18-23%)";
                coexisting = "Trilobites (Flexicalymene, Elrathia), Orthoceras, Anomalocaris, ancient crinoids, vascular seed ferns";
                ecology = "Marine benthic scavenger or nektonic apex predator navigating warm, shallow carbonate coral reef networks.";
            } else if (era === 'mesozoic') {
                climate = "Hot Greenhouse & High Transgression Seas";
                temp = "22°C - 28°C (Warm, Humid & Equatorial)";
                oxygen = "120% to 150% of Modern levels (25-30%)";
                coexisting = "Triceratops, Tyrannosaurus Rex, Ammonites, Ichthyosaurs, Pterosaurs, Cycads";
                ecology = "Terrestrial apex predator, active filter-feeder, or pioneering gymnosperm flora growing in highly carbonaceous forest ecosystems.";
            } else if (era === 'cenozoic') {
                climate = "Progressive Cooling Icehouse & Grassland Expansion";
                temp = "14°C - 20°C (Seasonally variable)";
                oxygen = "95% to 100% of Modern levels (20.9%)";
                coexisting = "Mammoths, Saber-toothed cats (Smilodon), Megalodon shark, early hominids, angiosperms";
                ecology = "Adapted for grassland foraging, high energy herd migration, or modern open ocean continental shelf systems.";
            }
        }
        
        // Category-based fine-tuning
        if (f.category) {
            var catLower = f.category.toLowerCase();
            if (catLower.indexOf('vertebrate') !== -1 && catLower.indexOf('invertebrate') === -1) {
                if (era === 'mesozoic') {
                    ecology = "High-energy terrestrial megafauna carnivore or herbivore, relying on highly advanced metabolism and bone vascularization to sustain rapid growth.";
                } else if (era === 'cenozoic') {
                    ecology = "Cenozoic mammalian explorer adapted for warm, seasonal plain migrations, relying on specialized dental batteries or predatory adaptations.";
                }
            } else if (catLower.indexOf('invertebrate') !== -1) {
                if (era === 'paleozoic') {
                    ecology = "Calcified marine invertebrate exploiting early benthic niches, utilizing complex composite calcite compound eyes to dodge predators.";
                }
            } else if (catLower.indexOf('plant') !== -1) {
                ecology = "Terrestrial primary producer utilizing advanced stomatal regulation to metabolize high atmospheric carbon levels, producing spores or seed cones.";
            }
        }
        
        // Dynamic Formation-Based Co-Existing Life Finder
        var formationClean = (f.formation || '').trim().toLowerCase();
        var localCoexisting = [];
        
        // 1. Search user's own collection for matching formations
        if (formationClean) {
            localCoexisting = fossils.filter(function(x) {
                return x.id !== f.id && 
                       !x.isWishlist && 
                       (x.formation || '').trim().toLowerCase().indexOf(formationClean) !== -1;
            });
        }
        
        var coexList = [];
        if (localCoexisting.length > 0) {
            localCoexisting.forEach(function(lc) {
                coexList.push('🦕 ' + (lc.specimen || 'Specimen') + ' (Your Collection)');
            });
        }
        
        // 2. Add globally famous species known from this exact formation
        var globalFamous = [];
        if (formationClean.indexOf('hell creek') !== -1) {
            globalFamous = ["Triceratops", "Tyrannosaurus Rex", "Edmontosaurus", "Ankylosaurus", "Dakotaraptor"];
        } else if (formationClean.indexOf('kem kem') !== -1) {
            globalFamous = ["Spinosaurus", "Carcharodontosaurus", "Onchopristis", "Alanqa"];
        } else if (formationClean.indexOf('morrison') !== -1) {
            globalFamous = ["Allosaurus", "Stegosaurus", "Diplodocus", "Brontosaurus"];
        } else if (formationClean.indexOf('solnhofen') !== -1) {
            globalFamous = ["Archaeopteryx", "Compsognathus", "Rhamphorhynchus"];
        } else if (formationClean.indexOf('green river') !== -1) {
            globalFamous = ["Knightia fish", "Diplomystus", "Priscacara"];
        } else if (formationClean.indexOf('white river') !== -1 || formationClean.indexOf('brule') !== -1) {
            globalFamous = ["Merycoidodon oreodont", "Mesohippus early horse", "Hyracodon", "Hoplophoneus"];
        }
        
        if (globalFamous.length > 0) {
            globalFamous.forEach(function(gf) {
                var gfLower = gf.toLowerCase();
                var alreadyListed = coexList.some(function(item) { return item.toLowerCase().indexOf(gfLower) !== -1; });
                var isSelf = (f.specimen || '').toLowerCase().indexOf(gfLower) !== -1 || gfLower.indexOf((f.specimen || '').toLowerCase()) !== -1;
                if (!alreadyListed && !isSelf) {
                    coexList.push(gf);
                }
            });
        }
        
        // 3. Override if any formation-specific co-existing fauna was found
        if (coexList.length > 0) {
            coexisting = coexList.join(', ');
        }
        
        var climElem = document.getElementById('deep-dive-dossier-climate');
        var tempElem = document.getElementById('deep-dive-dossier-temp');
        var oxyElem = document.getElementById('deep-dive-dossier-oxygen');
        var coexElem = document.getElementById('deep-dive-dossier-coexisting');
        var ecoNotesElem = document.getElementById('deep-dive-dossier-ecology');
        
        if (climElem) climElem.textContent = climate;
        if (tempElem) tempElem.textContent = temp;
        if (oxyElem) oxyElem.textContent = oxygen;
        if (coexElem) coexElem.textContent = coexisting;
        if (ecoNotesElem) ecoNotesElem.textContent = ecology;
        
        // Anatomy Analyzer
        var part = f.anatomy || "Partial Fossilized Structure";
        var desc = "Preserves original calcium carbonate or silicate skeletal matrix, offering clear scientific insights into prehistoric growth rates and biomineralization.";
        
        var partLower = part.toLowerCase();
        var catL = (f.category || '').toLowerCase();
        
        if (partLower.indexOf('tooth') !== -1 || partLower.indexOf('teeth') !== -1 || partLower.indexOf('jaw') !== -1) {
            desc = "Highly calcified enameloid structures with serrated borders or crushing crown plates, optimizing biting forces to shred tough fiber or crush shell skeletons.";
        } else if (partLower.indexOf('shell') !== -1 || partLower.indexOf('carapace') !== -1 || partLower.indexOf('exoskeleton') !== -1) {
            desc = "Aragonite or calcite composite shell. Features chambered septa (e.g. ammonites) for hydrostatic buoyancy control, or mineralized chitinous plates for predation defense.";
        } else if (partLower.indexOf('bone') !== -1 || partLower.indexOf('vertebra') !== -1 || partLower.indexOf('limb') !== -1) {
            desc = "Cortical bone structure displaying hollow vascular channels, indicating high metabolic rates, active homeothermy, and robust stress support for cursorial movement.";
        } else if (partLower.indexOf('leaf') !== -1 || partLower.indexOf('frond') !== -1 || partLower.indexOf('wood') !== -1) {
            desc = "Carbonized organic film preserving microscopic stomatal densities and vascular vein structures, providing proxy records of ancient carbon cycles.";
        } else if (catL.indexOf('invertebrate') !== -1) {
            desc = "Dense biomineralized structural components highlighting early developmental bilateral or radial symmetry and advanced defensive attributes.";
        }
        
        var partElem = document.getElementById('deep-dive-anatomy-part');
        var descElem = document.getElementById('deep-dive-anatomy-desc');
        if (partElem) partElem.innerHTML = 'Preserved Part: <strong style="color: var(--accent);">' + escapeHtml(part) + '</strong>';
        if (descElem) descElem.textContent = desc;
        
        // Fetch Wikipedia extract
        window.app.fetchWikipediaPaleoExtract(f);
    },

    simulatePrehistoricBehavior: function(behavior) {
        var f = fossils.find(function(x) { return x.id === activeDeepDiveFossilId; });
        if (!f) return;
        
        var consoleElem = document.getElementById('deep-dive-simulation-console');
        if (!consoleElem) return;
        
        consoleElem.innerHTML = ''; // Clear placeholder
        
        var category = (f.category || 'Other').toLowerCase();
        var specimenName = f.specimen || 'Specimen';
        var timeStr = new Date().toLocaleTimeString();
        
        var steps = [
            '[' + timeStr + '] INIT: Calibrating habitat neural matrix for ' + specimenName + '...',
            '[' + timeStr + '] SYSTEM: Category detected: ' + (f.category || 'Extinct Organism') + ' | Period: ' + (f.geologicalPeriod || 'Unknown'),
            '[' + timeStr + '] ACTION: Deploying behavior protocol: "' + behavior.toUpperCase() + '"...'
        ];
        
        // Narrative outcomes
        var success = Math.random() > 0.4;
        var outcomeText = "";
        var scoreAdjust = 0;
        
        if (behavior === 'hunt') {
            if (category.indexOf('vertebrate') !== -1 && category.indexOf('invertebrate') === -1) {
                if (success) {
                    outcomeText = "Success! The predator tracks movement through high-frequency vibrations in the damp coastal soil. Tensing its massive hind limbs, it launches an explosive sprint through ancient ferns, securing its prey! +30 Gold Curatorial Score.";
                    scoreAdjust = 30;
                } else {
                    outcomeText = "Failure. A sudden scent shift alerts a nearby herd of ceratopsians. They form an impenetrable wall of horned shields, forcing a quick retreat to conserve energy. +10 Curatorial Score.";
                    scoreAdjust = 10;
                }
            } else if (category.indexOf('invertebrate') !== -1) {
                if (success) {
                    outcomeText = "Success! Crawling quietly beneath ancient marine seaweed, it uses its sensitive antennae to detect a soft-bodied trilobite shedding its shell. It strikes quickly, securing an abundant meal! +25 Gold Curatorial Score.";
                    scoreAdjust = 25;
                } else {
                    outcomeText = "Failure. A sweeping undercurrent carries the creature's scent away. The target burrows deep into oceanic silt, leaving empty claws. +5 Curatorial Score.";
                    scoreAdjust = 5;
                }
            } else if (category.indexOf('plant') !== -1) {
                outcomeText = "Success! Unfolding its fronds to capture the abundant Mesozoic sunlight, it maximizes carbon fixation. Stomatal pores open wide, processing atmospheric CO2 into structural lignin. +25 Gold Curatorial Score.";
                scoreAdjust = 25;
            } else {
                outcomeText = "Success! Navigating microscopic water films or sediment layers, it filters suspended organic detritus, securing vital carbon compounds. +20 Gold Curatorial Score.";
                scoreAdjust = 20;
            }
        } else if (behavior === 'defend') {
            if (category.indexOf('vertebrate') !== -1 && category.indexOf('invertebrate') === -1) {
                if (success) {
                    outcomeText = "Success! An intruder enters the nesting grounds. Displaying its massive skull structures and issuing a low-frequency infrasonic growl, the rival is successfully intimidated and flees. +35 Gold Curatorial Score.";
                    scoreAdjust = 35;
                } else {
                    outcomeText = "Failure. A larger rival theropod challenges the territory. After a brief exchange of snapping jaws and tail-swipes, it retreats slightly to high ground to nurse minor abrasions. +15 Curatorial Score.";
                    scoreAdjust = 15;
                }
            } else if (category.indexOf('invertebrate') !== -1) {
                if (success) {
                    outcomeText = "Success! Retracting into its dense coiled, calcified shell, it withstands the crushing bites of an early cephalopod predator, completely unscathed. +25 Gold Curatorial Score.";
                    scoreAdjust = 25;
                } else {
                    outcomeText = "Failure. A massive storm surge rolls it out of its protective rocky crevice, forcing it to consume precious energy to re-anchor in the shifting seabed. +10 Curatorial Score.";
                    scoreAdjust = 10;
                }
            } else if (category.indexOf('plant') !== -1) {
                outcomeText = "Success! Synthesizing high concentrations of tannin and sticky resin in its cellular walls, it successfully deters hungry insects and herbivorous larvae. +25 Gold Curatorial Score.";
                scoreAdjust = 25;
            } else {
                outcomeText = "Success! Secretion of defensive biopolymers or thick gelatinous matrices shields the colony from shifting chemical toxicities in ancient tidal pools. +20 Gold Curatorial Score.";
                scoreAdjust = 20;
            }
        } else { // rest
            if (success) {
                outcomeText = "Success! Entering a state of low-metabolic torpor beneath a towering cycad tree. Body temperature drops to match the humid ambient night, conserving crucial oxygen and calories. +20 Gold Curatorial Score.";
                scoreAdjust = 20;
            } else {
                outcomeText = "Success! Basking on a sunny limestone ledge, absorbing geothermal radiation. Cellular recovery is maximized under clear prebiotic skies. +20 Gold Curatorial Score.";
                scoreAdjust = 20;
            }
        }
        
        steps.push('[' + timeStr + '] SIMULATION: ' + outcomeText);
        steps.push('[' + timeStr + '] STATUS: Complete. Generated +' + scoreAdjust + ' Curation Index logged.');
        
        var index = 0;
        function printNextLine() {
            if (index < steps.length) {
                var line = document.createElement('div');
                line.className = 'console-line';
                if (steps[index].indexOf('Success!') !== -1) {
                    line.style.color = '#48bb78';
                } else if (steps[index].indexOf('Failure') !== -1) {
                    line.style.color = '#ed8936';
                } else if (steps[index].indexOf('STATUS:') !== -1) {
                    line.style.color = '#ffd700';
                    line.style.fontWeight = 'bold';
                } else {
                    line.style.color = '#cbd5e0'; // High contrast light-grey for system logs
                }
                
                line.textContent = steps[index];
                consoleElem.appendChild(line);
                consoleElem.scrollTop = consoleElem.scrollHeight;
                
                index++;
                setTimeout(printNextLine, 350);
            }
        }
        
        printNextLine();
    },

    fetchWikipediaPaleoExtract: function(f) {
        var name = (f.specimen || '').trim();
        var genus = name.split(' ')[0];
        genus = genus.replace(/\([^)]*\)/g, '').replace(/\b(?:cf\.|sp\.|\?)\b/g, '').replace(/[^a-zA-Z]/g, '');
        
        var wikiContent = document.getElementById('deep-dive-wiki-content');
        if (wikiContent) {
            wikiContent.innerHTML = '<div class="wiki-loader-spinner"><div class="spinner"></div><span>Retrieving paleobiological records for ' + escapeHtml(genus) + '...</span></div>';
        }
        
        if (!genus) {
            if (wikiContent) {
                wikiContent.innerHTML = '<div style="padding: 1rem; color: #edf2f7; text-align: center;">No genus specified. Showing specimen description:</div>' +
                                       '<div style="font-size: 0.85rem; padding: 0.5rem; background: rgba(255,255,255,0.02); border-radius: 4px; line-height: 1.5; color: #f7fafc;">' + escapeHtml(f.notes || f.description || 'No curation details available.') + '</div>';
            }
            return;
        }
        
        var wikiTitle = genus.charAt(0).toUpperCase() + genus.slice(1).toLowerCase();
        var wikiHeaders = { 'Api-User-Agent': 'FossilArchiveApp/1.0 (contact@fossilarchive.app) MediaWiki/1.3' };
        
        // Tier 1: Try exact Genus page title directly (highly robust for dinosaur/fossil groups)
        var exactUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=1&explaintext=1&origin=*&titles=' + encodeURIComponent(wikiTitle);
        
        fetch(exactUrl, { headers: wikiHeaders })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                var pages = data.query.pages;
                var pageId = Object.keys(pages)[0];
                
                if (pageId !== "-1" && pages[pageId].extract) {
                    // Success! Exact authentic page found
                    renderExtract(pages[pageId].extract, wikiTitle);
                } else {
                    // Tier 2: Fallback to fuzzy search query
                    var searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=' + encodeURIComponent(genus + ' (fossil OR paleobiology OR dinosaur OR extinct)');
                    fetch(searchUrl, { headers: wikiHeaders })
                        .then(function(res) { return res.json(); })
                        .then(function(sData) {
                            var title = wikiTitle;
                            if (sData.query && sData.query.search && sData.query.search.length > 0) {
                                title = sData.query.search[0].title;
                            }
                            
                            var fetchUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=1&explaintext=1&origin=*&titles=' + encodeURIComponent(title);
                            return fetch(fetchUrl, { headers: wikiHeaders });
                        })
                        .then(function(res) { return res.json(); })
                        .then(function(fData) {
                            var pages = fData.query.pages;
                            var pageId = Object.keys(pages)[0];
                            var extract = pages[pageId].extract || '';
                            
                            if (extract) {
                                renderExtract(extract, pages[pageId].title);
                            } else {
                                renderFallbackDescription();
                            }
                        })
                        .catch(function() {
                            renderFallbackDescription();
                        });
                }
            })
            .catch(function(err) {
                console.error('Wikipedia query error:', err);
                renderFallbackDescription();
            });
            
        function renderExtract(extract, title) {
            if (wikiContent) {
                wikiContent.innerHTML = '<div style="font-size: 0.85rem; line-height: 1.6; color: #f7fafc; text-align: justify;">' +
                                       escapeHtml(extract) +
                                       '</div>' +
                                       '<div style="margin-top: 1rem; font-size: 0.7rem; color: #cbd5e0; display: flex; align-items: center; gap: 4px;">' +
                                       '<span>Source: English Wikipedia</span> · <a href="https://en.wikipedia.org/wiki/' + encodeURIComponent(title) + '" target="_blank" style="color: #4fd1c5; text-decoration: underline; font-weight: 700;">Read Full Article</a>' +
                                       '</div>';
            }
        }
        
        function renderFallbackDescription() {
            if (wikiContent) {
                wikiContent.innerHTML = '<div style="padding: 1rem; color: #edf2f7; text-align: center;">No scientific article found for ' + escapeHtml(genus) + '. Showing specimen description:</div>' +
                                       '<div style="font-size: 0.85rem; padding: 0.5rem; background: rgba(255,255,255,0.02); border-radius: 4px; line-height: 1.5; text-align: justify; color: #f7fafc;">' + escapeHtml(f.notes || f.description || 'No curation details available.') + '</div>';
            }
        }
    },

    fetchWikipediaLifeImage: function(genus, f) {
        var lifeCircle = document.getElementById('deep-dive-life-circle');
        if (!lifeCircle) return;

        // Show a premium glassmorphic loader spinner in the life circle
        lifeCircle.innerHTML = '<div class="wiki-loader-spinner" style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; font-size: 0.55rem; color: #cbd5e0; flex-direction: column; text-align: center; padding: 0.2rem; background: rgba(255, 255, 255, 0.03); border-radius: 50%;">' +
                               '<div class="spinner" style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #4fd1c5; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 0.3rem;"></div>' +
                               '<span>Loading...</span></div>';

        var wikiTitle = genus.charAt(0).toUpperCase() + genus.slice(1).toLowerCase();
        var wikiHeaders = { 'Api-User-Agent': 'FossilArchiveApp/1.0 (contact@fossilarchive.app) MediaWiki/1.3' };

        // Tier 1: Try exact Genus page first for the PageImage
        var exactUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=400&origin=*&titles=' + encodeURIComponent(wikiTitle);

        fetch(exactUrl, { headers: wikiHeaders })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                var pages = data.query.pages;
                var pageId = Object.keys(pages)[0];
                if (pageId !== "-1" && pages[pageId].thumbnail && pages[pageId].thumbnail.source) {
                    renderImage(pages[pageId].thumbnail.source);
                } else {
                    // Tier 2: Search fallback
                    var searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=' + encodeURIComponent(genus + ' (fossil OR paleobiology OR dinosaur OR extinct)');
                    fetch(searchUrl, { headers: wikiHeaders })
                        .then(function(res) { return res.json(); })
                        .then(function(sData) {
                            var title = wikiTitle;
                            if (sData.query && sData.query.search && sData.query.search.length > 0) {
                                title = sData.query.search[0].title;
                            }
                            var fetchUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=400&origin=*&titles=' + encodeURIComponent(title);
                            return fetch(fetchUrl, { headers: wikiHeaders });
                        })
                        .then(function(res) { return res.json(); })
                        .then(function(fData) {
                            var pages = fData.query.pages;
                            var pageId = Object.keys(pages)[0];
                            if (pageId !== "-1" && pages[pageId].thumbnail && pages[pageId].thumbnail.source) {
                                renderImage(pages[pageId].thumbnail.source);
                            } else {
                                renderFallback();
                            }
                        })
                        .catch(function() {
                            renderFallback();
                        });
                }
            })
            .catch(function(err) {
                console.error('Wikipedia PageImage query error:', err);
                renderFallback();
            });

        function renderImage(imgUrl) {
            lifeCircle.innerHTML = '<img src="' + imgUrl + '" alt="' + escapeHtml(genus) + ' life reconstruction" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid rgba(255,255,255,0.15); cursor: zoom-in;" onclick="window.app.openZoomOverlay(this.src)">';
        }

        function renderFallback() {
            var catEmoji = '🦖';
            if (f.category) {
                var cat = f.category.toLowerCase();
                if (cat.indexOf('vertebrate') !== -1 && cat.indexOf('invertebrate') === -1) catEmoji = '🦖';
                else if (cat.indexOf('invertebrate') !== -1) catEmoji = '🐚';
                else if (cat.indexOf('plant') !== -1) catEmoji = '🌿';
                else if (cat.indexOf('trace') !== -1) catEmoji = '🐾';
                else if (cat.indexOf('microfossil') !== -1) catEmoji = '🔬';
            }
            lifeCircle.innerHTML = '<div style="font-size: 2.2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%; background: rgba(255,255,255,0.04); color: #cbd5e0; border-radius: 50%; border: 3px solid rgba(255,255,255,0.1); line-height: 1.2; text-align: center; padding: 0.2rem;">' +
                                   '<span>' + catEmoji + '</span>' +
                                   '<span style="font-size: 0.52rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #a0aec0; margin-top: 0.2rem;">No Image</span>' +
                                   '</div>';
        }
    },

    toggleCompareImage: function(fossilId) {
        var f = fossils.find(function(x) { return x.id === fossilId; });
        if (!f || !f.images || f.images.length <= 1) return;
        var media = document.getElementById('compare-img-' + fossilId);
        if (media) {
            var currentSrc = media.getAttribute('src');
            var newSrc = (currentSrc === f.images[0]) ? f.images[1] : f.images[0];
            
            var isVid = window.app.isVideo(newSrc);
            var parent = media.parentElement;
            
            var newMedia;
            if (isVid) {
                newMedia = document.createElement('video');
                newMedia.id = 'compare-img-' + fossilId;
                newMedia.src = newSrc;
                newMedia.className = 'compare-img';
                newMedia.autoplay = true;
                newMedia.muted = true;
                newMedia.loop = true;
                newMedia.playsInline = true;
                newMedia.onclick = function() {
                    window.app.openZoomOverlay(this.src);
                };
            } else {
                newMedia = document.createElement('img');
                newMedia.id = 'compare-img-' + fossilId;
                newMedia.src = newSrc;
                newMedia.className = 'compare-img';
                newMedia.onclick = function() {
                    window.app.openZoomOverlay(this.src);
                };
            }
            
            parent.replaceChild(newMedia, media);
            
            var btn = parent.querySelector('.compare-img-toggle-btn');
            if (btn) {
                if (newSrc === f.images[1]) {
                    btn.innerHTML = '🎨 Life View';
                    btn.classList.add('active');
                } else {
                    btn.innerHTML = '🦴 Fossil View';
                    btn.classList.remove('active');
                }
            }
        }
    }
};

function getFullTaxonomyTray(f) {
    if (!f) return '';
    var isActive = expandedTaxonomyIds.has(f.id) ? 'active' : '';
    var html = '<div class="taxonomy-tray ' + isActive + '">';
    
    if (f.taxonomy) {
        html += '<div class="taxonomy-content">';
        html += '<h4 class="taxonomy-header">Taxonomic Hierarchy</h4>';
        html += '<div class="taxonomy-tree">';
        
        var ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
        ranks.forEach(function(rnk) {
            if (f.taxonomy[rnk]) {
                html += '<div class="taxonomy-node">' +
                        '<span class="node-rank">' + rnk + '</span>' +
                        '<span class="node-name">' + escapeHtml(f.taxonomy[rnk]) + '</span>' +
                        '</div>';
            }
        });
        
        html += '</div></div>';
    } else {
        html += '<div class="taxonomy-placeholder">Click the taxonomy icon to load biological hierarchy...</div>';
    }
    
    html += '</div>';
    return html;
}


function formatSpecimenSize(size, unit) {
    if (size === undefined || size === null || size === '') return '';
    var num = parseFloat(size);
    if (isNaN(num) || num <= 0) return size;
    
    var u = (unit || 'cm').toLowerCase().trim();
    if (u === 'cm') {
        var inches = num / 2.54;
        return num + ' cm (' + inches.toFixed(1) + ' in)';
    } else if (u === 'inch' || u === 'in' || u === 'inches') {
        var cm = num * 2.54;
        return num + ' in (' + cm.toFixed(1) + ' cm)';
    }
    return num + ' ' + unit;
}

function formatSpecimenDimensions(f) {
    if (!f) return '';
    if (f.size === undefined || f.size === null || f.size === '') return '';
    var sizeNum = parseFloat(f.size);
    if (isNaN(sizeNum) || sizeNum <= 0) return f.size;

    var u = (f.sizeUnit || 'cm').toLowerCase().trim();
    var hasWidth = f.width !== undefined && f.width !== null && f.width !== '' && !isNaN(parseFloat(f.width)) && parseFloat(f.width) > 0;
    var hasThick = f.thickness !== undefined && f.thickness !== null && f.thickness !== '' && !isNaN(parseFloat(f.thickness)) && parseFloat(f.thickness) > 0;

    var len = parseFloat(f.size);
    var wid = hasWidth ? parseFloat(f.width) : 0;
    var thick = hasThick ? parseFloat(f.thickness) : 0;

    if (u === 'cm') {
        var main = len + ' cm';
        var alt = (len / 2.54).toFixed(1) + ' in';
        if (hasWidth) {
            main += ' x ' + wid + ' cm';
            alt += ' x ' + (wid / 2.54).toFixed(1) + ' in';
        }
        if (hasThick) {
            main += ' x ' + thick + ' cm';
            alt += ' x ' + (thick / 2.54).toFixed(1) + ' in';
        }
        return main + ' (' + alt + ')';
    } else {
        var main = len + ' in';
        var alt = (len * 2.54).toFixed(1) + ' cm';
        if (hasWidth) {
            main += ' x ' + wid + ' in';
            alt += ' x ' + (wid * 2.54).toFixed(1) + ' cm';
        }
        if (hasThick) {
            main += ' x ' + thick + ' in';
            alt += ' x ' + (thick * 2.54).toFixed(1) + ' cm';
        }
        return main + ' (' + alt + ')';
    }
}

function formatSpecimenWeight(weight) {
    if (weight === undefined || weight === null || weight === '') return '';
    var num = parseFloat(weight);
    if (isNaN(num) || num <= 0) return weight;
    var lbs = num / 453.59237;
    return num.toLocaleString() + ' g (' + lbs.toFixed(2) + ' lb)';
}

// =========================================================================
// HELPERS
// =========================================================================
function generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Fallback for file:// protocol
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function() {
        return Math.floor(Math.random() * 16).toString(16);
    });
}

function getCategoryPrefix(cat) {
    if (!cat) return "FOSL";
    var c = cat.toLowerCase();
    if (c.indexOf('vertebrate') !== -1 && c.indexOf('invertebrate') === -1) return "VERT";
    if (c.indexOf('invertebrate') !== -1) return "INVT";
    if (c.indexOf('plant') !== -1) return "PLNT";
    if (c.indexOf('trace') !== -1 || c.indexOf('ichno') !== -1) return "TRCE";
    if (c.indexOf('micro') !== -1) return "MICR";
    return "FOSL";
}

function generateCatalogId(category, list) {
    var prefix = getCategoryPrefix(category);
    var maxNum = 0;
    var listToSearch = list || fossils || [];
    
    listToSearch.forEach(function(f) {
        if (f.id && f.id.startsWith(prefix + '-')) {
            var num = parseInt(f.id.split('-')[1], 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        }
    });
    
    var nextNum = maxNum + 1;
    var padded = nextNum.toString().padStart(3, '0');
    return prefix + '-' + padded;
}

function migrateToCatalogIds() {
    return getAllFossils().then(function(allFossils) {
        if (!allFossils || allFossils.length === 0) return;

        // Find fossils with UUID-like IDs or non-catalog IDs.
        // Catalog IDs follow the format: [PREFIX]-[3+ DIGITS]
        var toMigrate = allFossils.filter(function(f) {
            var id = f.id || "";
            var dashIndex = id.indexOf('-');
            if (dashIndex === -1) return true; // No dash = migrate
            
            var prefix = id.split('-')[0];
            var numPart = id.split('-')[1];
            
            // If prefix isn't one of ours or number part isn't purely numeric or too short (UUIDs have hex)
            var validPrefixes = ['VERT', 'INVT', 'PLNT', 'TRCE', 'MICR', 'FOSL'];
            var isLegacy = validPrefixes.indexOf(prefix) === -1 || isNaN(parseInt(numPart, 10)) || id.length > 12;
            return isLegacy;
        });

        if (toMigrate.length === 0) return;

        console.log('Migrating ' + toMigrate.length + ' fossils to professional Catalog IDs...');
        
        var workingList = JSON.parse(JSON.stringify(allFossils));
        var chain = Promise.resolve();
        var migratedCount = 0;

        toMigrate.forEach(function(orig) {
            chain = chain.then(function() {
                var idx = workingList.findIndex(function(x) { return x.id === orig.id; });
                if (idx !== -1) workingList.splice(idx, 1);

                var newId = generateCatalogId(orig.category, workingList);
                var updatedFossil = JSON.parse(JSON.stringify(orig));
                updatedFossil.id = newId;

                workingList.push(updatedFossil);

                return deleteFossil(orig.id).then(function() {
                    return addFossil(updatedFossil).then(function() {
                        migratedCount++;
                    });
                });
            });
        });

        return chain.then(function() {
            if (migratedCount > 0) {
                showToast('Successfully cataloged ' + migratedCount + ' specimens!');
                window.app.renderFossils();
            }
        });
    });
}

function showToast(msg, type, duration) {
    type = type || 'success';
    duration = duration || 4000;
    
    var toastContainer = document.getElementById('toast-hub');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-hub';
        toastContainer.style.cssText = 'position:fixed; bottom:30px; right:30px; z-index:100000; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
        document.body.appendChild(toastContainer);
    }
    
    var icons = {
        success: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color:#2ecc71; flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        error: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color:#e74c3c; flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
        warning: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color:#f39c12; flex-shrink:0;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color:#3498db; flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };
    
    var borderColors = {
        success: 'rgba(46, 204, 113, 0.4)',
        error: 'rgba(231, 76, 60, 0.4)',
        warning: 'rgba(243, 156, 18, 0.4)',
        info: 'rgba(52, 152, 219, 0.4)'
    };

    var toast = document.createElement('div');
    toast.className = 'premium-toast toast-' + type;
    toast.style.cssText = 'pointer-events:auto; background:var(--bg-surface); color:var(--text-primary); padding:1rem 1.5rem; border-radius:var(--radius-md); box-shadow:var(--shadow-lg); border:1px solid ' + borderColors[type] + '; font-weight:600; font-size:0.9rem; display:flex; align-items:center; gap:0.85rem; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); animation:toastSlideIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275); position:relative; overflow:hidden; min-width:280px; max-width:420px;';
    
    var contentHtml = '<div style="display:flex; align-items:center; gap:0.85rem; width:100%;">' + (icons[type] || icons.info) + '<span style="flex:1; line-height:1.4;">' + msg + '</span></div>';
    contentHtml += '<div style="position:absolute; bottom:0; left:0; height:3px; background:' + borderColors[type].replace('0.4', '0.8') + '; animation:toastProgress ' + duration + 'ms linear forwards; width:100%;"></div>';
    
    toast.innerHTML = contentHtml;
    
    // Auto-inject animation if missing
    if (!document.getElementById('toast-animation')) {
        var s = document.createElement('style');
        s.id = 'toast-animation';
        s.innerHTML = '@keyframes toastSlideIn { from { transform:translateX(100%) scale(0.9); opacity:0; } to { transform:translateX(0) scale(1); opacity:1; } } @keyframes toastProgress { from { width:100%; } to { width:0%; } }';
        document.head.appendChild(s);
    }
    
    toastContainer.appendChild(toast);
    setTimeout(function() {
        toast.style.transform = 'translateX(120%) scale(0.9)';
        toast.style.opacity = '0';
        toast.style.transition = 'all 0.35s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
        setTimeout(function() { toast.remove(); }, 400);
    }, duration);
}





function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

/**
 * Levenshtein Distance Algorithm
 * Calculates the number of single-character edits (insertions, deletions, substitutions) 
 * required to change one string into another.
 */
function getLevenshteinDistance(s1, s2) {
    var a = (s1 || '').trim().toLowerCase();
    var b = (s2 || '').trim().toLowerCase();
    if (a === b) return 0;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    // Use a more memory-efficient one-dimensional array approach
    var row = new Array(a.length + 1);
    for (var i = 0; i <= a.length; i++) { row[i] = i; }

    for (var i = 1; i <= b.length; i++) {
        var prev = i;
        for (var j = 1; j <= a.length; j++) {
            var val;
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                val = row[j - 1]; // No edit needed
            } else {
                val = Math.min(
                    row[j - 1] + 1, // Substitution
                    prev + 1,      // Insertion
                    row[j] + 1       // Deletion
                );
            }
            row[j - 1] = prev;
            prev = val;
        }
        row[a.length] = prev;
    }
    return row[a.length];
}



function populateDropdowns() {
    // --- Category (form + filter) ---
    var catForm   = document.getElementById('f-category');
    var catFilter = document.getElementById('filter-category');
    catForm.innerHTML = '<option value="">— Select Category —</option>';
    CATEGORIES.forEach(function(cat) {
        catForm.appendChild(makeOption(cat, cat));
        catFilter.appendChild(makeOption(cat, cat));
    });

    // --- Fossil Type (form + filter) ---
    var typeForm   = document.getElementById('f-type');
    var typeFilter = document.getElementById('filter-type');
    if (typeForm && typeFilter) {
        typeForm.innerHTML = '<option value="">— Select Type —</option>';
        typeFilter.innerHTML = '<option value="">All Types</option>';
        FOSSIL_TYPES.forEach(function(type) {
            typeForm.appendChild(makeOption(type, type));
            typeFilter.appendChild(makeOption(type, type));
        });
    }

    // --- Period (form: grouped optgroups) ---
    var periodForm   = document.getElementById('f-period');
    var periodFilter = document.getElementById('filter-period');
    periodForm.innerHTML = '<option value="">— Select Period —</option>';

    var groups = getPeriodsGrouped();
    groups.forEach(function(group) {
        var og  = document.createElement('optgroup');
        var og2 = document.createElement('optgroup');
        og.label = group.era;
        og2.label = group.era;
        group.periods.forEach(function(per) {
            og.appendChild(makeOption(per, per));
            og2.appendChild(makeOption(per, per));
        });
        periodForm.appendChild(og);
        periodFilter.appendChild(og2);
    });
}

function makeOption(value, text) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.textContent = text;
    return opt;
}

// --- Image Optimization Helpers ---
function downscaleImage(dataUrl, maxDimension, quality) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.onload = function() {
            var width = img.width;
            var height = img.height;
            
            // Only resize if it exceeds the max dimension
            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = Math.round(height *= maxDimension / width);
                    width = maxDimension;
                } else {
                    width = Math.round(width *= maxDimension / height);
                    height = maxDimension;
                }
            }
            
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to compressed JPEG regardless of input format
            resolve(canvas.toDataURL('image/jpeg', quality || 0.85));
        };
        img.onerror = function(e) { reject(e); };
        img.src = dataUrl;
    });
}

function optimizeExistingDatabase() {
    getAllFossils().then(function(fossils) {
        var needsUpdate = [];
        fossils.forEach(function(f) {
            if (f.images && f.images.length > 0) {
                // If a base64 string is > 800,000 characters (~600KB), it's likely unoptimized
                var hasLarge = f.images.some(function(img) { return img && img.length > 800000; });
                if (hasLarge) needsUpdate.push(f);
            }
        });
        
        if (needsUpdate.length > 0) {
            console.log('Found ' + needsUpdate.length + ' fossil(s) with large images. Running retroactive optimization...');
            var chain = Promise.resolve();
            needsUpdate.forEach(function(f) {
                chain = chain.then(function() {
                    var optPromises = f.images.map(function(imgStr) {
                        if (imgStr && imgStr.length > 800000 && !window.app.isVideo(imgStr)) {
                            return downscaleImage(imgStr, 1200, 0.85).catch(function() { return imgStr; });
                        }
                        return Promise.resolve(imgStr);
                    });
                    
                    return Promise.all(optPromises).then(function(optimizedImages) {
                        f.images = optimizedImages;
                        return updateFossil(f);
                    });
                });
            });
            
            chain.then(function() {
                console.log('Retroactive optimization complete. The database footprint has been reduced.');
                // Optionally re-render if needed, but it's okay to just leave it until next view change.
            });
        }
    });
}

function enrichDatabaseInBackground() {
    if (!fossils || fossils.length === 0) return;
    
    var needy = fossils.filter(function(f) {
        return !f.etymology || !f.animalSize;
    });
    
    if (needy.length === 0) return;
    
    var batch = needy.slice(0, 3);
    
    (async function() {
        var updatedAny = false;
        for (var f of batch) {
            var name = (f.specimen || '').trim();
            if (!name) continue;
            
            var genus = name.split(' ')[0];
            var cleanName = name.replace(/\([^)]*\)/g, '').replace(/\b(?:cf\.|sp\.|\?)\b/g, '').replace(/\s+/g, ' ').trim();
            
            var wikiHeaders = { 'Api-User-Agent': 'FossilArchiveApp/1.0 (contact@fossilarchive.app) MediaWiki/1.3' };
            var localUpdated = false;

            if (!f.etymology && genus) {
                try {
                    var etym = await window.app.fetchEtymology(genus);
                    if (etym) {
                        f.etymology = etym;
                        localUpdated = true;
                    }
                } catch (e) { console.error('BG Etymology fetch failed', e); }
            }
            
            if (!f.animalSize && cleanName) {
                var searchLower = cleanName.toLowerCase();
                var localSize = null;
                if (PREHISTORIC_SIZES[searchLower]) {
                    localSize = PREHISTORIC_SIZES[searchLower];
                } else {
                    var sortedKeys = Object.keys(PREHISTORIC_SIZES).sort(function(a, b) { return b.length - a.length; });
                    for (var j = 0; j < sortedKeys.length; j++) {
                        var key = sortedKeys[j];
                        if (searchLower.indexOf(key) !== -1) {
                            localSize = PREHISTORIC_SIZES[key];
                            break;
                        }
                    }
                }
                
                if (localSize) {
                    f.animalSize = localSize;
                    localUpdated = true;
                } else {
                    try {
                        var searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=' + encodeURIComponent(cleanName);
                        var sResp = await fetch(searchUrl, { headers: wikiHeaders });
                        if (sResp.ok) {
                            var sData = await sResp.json();
                            if (sData.query && sData.query.search && sData.query.search.length > 0) {
                                var bestTitle = sData.query.search[0].title;
                                var fetchUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exchars=2500&explaintext=1&origin=*&titles=' + encodeURIComponent(bestTitle);
                                var fResp = await fetch(fetchUrl, { headers: wikiHeaders });
                                if (fResp.ok) {
                                    var fData = await fResp.json();
                                    var pages = fData.query.pages;
                                    var pageId = Object.keys(pages)[0];
                                    var extract = pages[pageId].extract || '';
                                    var size = window.app.extractSizeFromText(extract);
                                    if (size) {
                                        f.animalSize = size;
                                        localUpdated = true;
                                    }
                                }
                            }
                        }
                    } catch (e) { console.error('BG Size fetch failed', e); }
                }
            }
            
            if (localUpdated) {
                await updateFossil(f);
                updatedAny = true;
            }
            
            await new Promise(function(r) { setTimeout(r, 250); });
        }
        
        if (updatedAny) {
            getAllFossils().then(function(allFossils) {
                fossils = allFossils;
                window.app.renderFossils();
            });
        }
    })();
}

// =========================================================================
// SEA MONSTERS - THEME EFFECTS
// =========================================================================
var seaMonsterScrollTimeout;
window.addEventListener('scroll', function() {
    var grid = document.getElementById('fossil-grid');
    if (!grid) return;
    
    grid.classList.add('sea-monster-scroll');
    
    clearTimeout(seaMonsterScrollTimeout);
    seaMonsterScrollTimeout = setTimeout(function() {
        grid.classList.remove('sea-monster-scroll');
    }, 150);
}, { passive: true });
