// =========================================================================
// FOSSIL ARCHIVE — app.js
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

// Sorted longest-first so the matcher always prefers the most specific
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

    // 4-letter roots
    { root: 'mega', meaning: 'great / large (Greek: megas)' },
    { root: 'dino', meaning: 'terrible (Greek: deinos)' },
    { root: 'odon', meaning: 'tooth (Greek: odous)' },
    { root: 'dont', meaning: 'tooth (Greek: odont-)' },
    { root: 'odus', meaning: 'tooth (Greek)' },
    { root: 'onyx', meaning: 'claw (Greek)' },
    { root: 'baro', meaning: 'heavy / weight (Greek: baros)' },
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
    { root: 'ecto', meaning: 'outside (Greek)' },
    { root: 'endo', meaning: 'within (Greek)' },
    { root: 'phago', meaning: 'eater (Greek: phagein)' },
    { root: 'sauro', meaning: 'lizard (Greek: sauros)' },
    { root: 'Saur', meaning: 'lizard (Greek: sauros)' },
    { root: 'podo', meaning: 'foot (Greek: pous)' },

    // 3-letter roots (careful — only match these at word boundaries ideally)
    { root: 'tri', meaning: 'three (Greek/Latin)' },
    { root: 'ops', meaning: 'face / eye (Greek)' },
    { root: 'pod', meaning: 'foot (Greek: pous)' },
    { root: 'pes', meaning: 'foot (Latin)' },
    { root: 'pus', meaning: 'foot (Greek)' },
    { root: 'rex', meaning: 'king (Latin)' },
    { root: 'sp.', meaning: 'species (abbreviation for unknown species)' },
    { root: 'leo', meaning: 'lion (Latin)' },
    { root: 'neo', meaning: 'new (Greek: neos)' }
];

// Scan specimen name for etymology roots and wrap matches in tooltip spans
function annotateSpecimenName(rawName) {
    if (!rawName) return '';
    var safeName = escapeHtml(rawName);
    var nameLower = rawName.toLowerCase();
    var matches = [];

    ETYMOLOGY.forEach(function(entry) {
        var idx = nameLower.indexOf(entry.root.toLowerCase());
        while (idx !== -1) {
            // Avoid overlapping matches — only keep the longest at each position
            var dominated = false;
            for (var m = 0; m < matches.length; m++) {
                var em = matches[m];
                // If existing match fully covers this one, skip
                if (em.start <= idx && em.end >= idx + entry.root.length) { dominated = true; break; }
                // If this match fully covers existing, replace it
                if (idx <= em.start && idx + entry.root.length >= em.end) { matches.splice(m, 1); m--; }
            }
            if (!dominated) {
                matches.push({ start: idx, end: idx + entry.root.length, meaning: entry.meaning });
            }
            idx = nameLower.indexOf(entry.root.toLowerCase(), idx + 1);
        }
    });

    if (matches.length === 0) return safeName;

    // Sort by start position
    matches.sort(function(a, b) { return a.start - b.start; });

    // Remove overlapping matches (keep longer ones)
    var cleaned = [matches[0]];
    for (var i = 1; i < matches.length; i++) {
        var last = cleaned[cleaned.length - 1];
        if (matches[i].start >= last.end) {
            cleaned.push(matches[i]);
        }
    }

    // Build annotated HTML
    var result = '';
    var cursor = 0;
    cleaned.forEach(function(m) {
        result += escapeHtml(rawName.substring(cursor, m.start));
        result += '<span class="etym-hint" data-meaning="' + escapeHtml(m.meaning) + '">' +
                  escapeHtml(rawName.substring(m.start, m.end)) + '</span>';
        cursor = m.end;
    });
    result += escapeHtml(rawName.substring(cursor));
    return result;
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
        request.onsuccess = function() { resolve(); };
        request.onerror = function() { reject(request.error); };
    });
}

function updateFossil(fossil) {
    return withStore('readwrite', function(store, resolve, reject) {
        var request = store.put(fossil);
        request.onsuccess = function() { resolve(); };
        request.onerror = function() { reject(request.error); };
    });
}

function deleteFossil(id) {
    return withStore('readwrite', function(store, resolve, reject) {
        var request = store.delete(id);
        request.onsuccess = function() { resolve(); };
        request.onerror = function() { reject(request.error); };
    });
}

function deleteMultipleFossils(ids) {
    return initDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            var tx = db.transaction('fossils', 'readwrite');
            var store = tx.objectStore('fossils');
            tx.onerror = function(e) { reject(e); };
            tx.oncomplete = function() { resolve(); };
            ids.forEach(function(id) { store.delete(id); });
        });
    });
}

function exportToJSON() {
    return getAllFossils().then(function(fossils) {
        var dataStr = JSON.stringify(fossils, null, 2);
        var blob = new Blob([dataStr], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'fossil-archive-backup.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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

    return mapped;
}


// =========================================================================
// APP STATE
// =========================================================================
var fossils = [];
var selectedFossils = new Set();
var currentImages = [];
var currentView = 'false'; // 'false' = Collection, 'true' = Wishlist
var isStatsOpen = false;
var chartCountry = null;
var chartPeriod = null;
var exchangeRates = null;
var lightboxFossilId = null;
var lightboxIdx = 0;

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
    var savedTheme = localStorage.getItem('oceanic_theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        var themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
        }
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
    }

    populateDropdowns();
    fetchExchangeRates();
    initDB().then(function() {
        window.app.renderFossils();
        // Run background check for bloated images 2 seconds after load
        setTimeout(optimizeExistingDatabase, 2000);
        // Automatic ID Migration (UUID -> Catalog) 1 second after load
        setTimeout(migrateToCatalogIds, 1000);
    });
});

// Lightbox keyboard navigation
document.addEventListener('keydown', function(e) {
    var overlay = document.getElementById('lightbox');
    if (!overlay || !overlay.classList.contains('active')) return;
    if (e.key === 'Escape') { window.app.closeLightbox(); }
    else if (e.key === 'ArrowLeft') { window.app.lightboxNav(-1); }
    else if (e.key === 'ArrowRight') { window.app.lightboxNav(1); }
});

// =========================================================================
// APP METHODS — attached to window.app for inline HTML handlers
// =========================================================================
window.app = {

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
    },

    // --- Lightbox ---
    openLightbox: function(fossilId, imgIndex) {
        var f = fossils.find(function(x) { return x.id === fossilId; });
        if (!f || !f.images || f.images.length === 0) return;
        lightboxFossilId = fossilId;
        lightboxIdx = imgIndex || 0;

        var overlay = document.getElementById('lightbox');
        var img = document.getElementById('lightbox-img');
        var title = document.getElementById('lightbox-title');
        var detail = document.getElementById('lightbox-detail');
        var loc = document.getElementById('lightbox-location');
        var counter = document.getElementById('lightbox-counter');

        img.src = f.images[lightboxIdx];
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

        counter.textContent = f.images.length > 1 ? 'Photo ' + (lightboxIdx + 1) + ' of ' + f.images.length : '';

        // Show/hide nav arrows
        var prevBtn = overlay.querySelector('.lightbox-nav.prev');
        var nextBtn = overlay.querySelector('.lightbox-nav.next');
        prevBtn.style.display = f.images.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = f.images.length > 1 ? 'flex' : 'none';

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeLightbox: function() {
        var overlay = document.getElementById('lightbox');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        lightboxFossilId = null;
    },

    lightboxNav: function(dir) {
        if (!lightboxFossilId) return;
        var f = fossils.find(function(x) { return x.id === lightboxFossilId; });
        if (!f || !f.images || f.images.length <= 1) return;
        lightboxIdx = (lightboxIdx + dir + f.images.length) % f.images.length;
        document.getElementById('lightbox-img').src = f.images[lightboxIdx];
        document.getElementById('lightbox-counter').textContent = 'Photo ' + (lightboxIdx + 1) + ' of ' + f.images.length;
    },

    // --- Dashboard ---
    toggleStats: function() {
        isStatsOpen = !isStatsOpen;
        var container = document.getElementById('stats-summary');
        if (container) {
            container.style.display = isStatsOpen && fossils.length > 0 ? 'flex' : 'none';
        }
        var btn = document.getElementById('btn-toggle-stats');
        if (btn) {
            btn.classList.toggle('active', isStatsOpen);
        }
        if (isStatsOpen) {
            window.app.renderFossils();
        }
    },

    // --- Modal ---
    openModal: function(id) {
        var modal = document.getElementById('fossil-modal');
        var form = document.getElementById('fossil-form');
        document.getElementById('modal-title').innerText = id ? 'Edit Fossil' : 'Add New Fossil';
        form.reset();
        currentImages = [];
        window.app.renderImagePreview();

        if (id) {
            var f = fossils.find(function(x) { return x.id === id; });
            if (f) {
                document.getElementById('fossil-id').value = f.id;
                document.getElementById('f-specimen').value = f.specimen || '';
                document.getElementById('f-anatomy').value = f.anatomy || '';
                document.getElementById('f-category').value = f.category || '';
                document.getElementById('f-wishlist').value = f.isWishlist ? 'true' : 'false';
                document.getElementById('f-period').value = f.geologicalPeriod || '';
                window.app.updateEpochs(f.epoch);
                window.app.updateStratAges(f.stratAge);
                var ageVal = f.ageMa || 0;
                document.getElementById('f-age').value = ageVal;
                document.getElementById('f-age-slider').value = ageVal;
                document.getElementById('f-country').value = f.country || '';
                document.getElementById('f-location').value = f.location || '';
                document.getElementById('f-formation').value = f.formation || '';
                document.getElementById('f-size').value = f.size || '';
                document.getElementById('f-size-unit').value = f.sizeUnit || 'cm';
                document.getElementById('f-weight').value = f.weight || '';
                document.getElementById('f-price').value = f.price || '';
                document.getElementById('f-currency').value = f.currency || 'USD';
                document.getElementById('f-notes').value = f.notes || '';

                if (f.images && Array.isArray(f.images)) {
                    currentImages = f.images.slice();
                    window.app.renderImagePreview();
                }
            }
        } else {
            document.getElementById('fossil-id').value = '';
            document.getElementById('f-anatomy').value = '';
            document.getElementById('f-age').value = 0;
            document.getElementById('f-age-slider').value = 0;
            document.getElementById('f-size-unit').value = 'cm';
            document.getElementById('f-currency').value = 'USD';

            // Auto-load last used geography/geology for batch logging
            document.getElementById('f-country').value = localStorage.getItem('last_country') || '';
            document.getElementById('f-location').value = localStorage.getItem('last_location') || '';
            document.getElementById('f-formation').value = localStorage.getItem('last_formation') || '';
            document.getElementById('f-period').value = localStorage.getItem('last_period') || '';
            
            window.app.updateEpochs(localStorage.getItem('last_epoch') || '');
            window.app.updateStratAges(localStorage.getItem('last_stratAge') || '');
        }

        modal.showModal();
    },

    closeModal: function() {
        document.getElementById('fossil-modal').close();
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
                        downscaleImage(e.target.result, 1200, 0.85).then(function(optimizedStr) {
                            currentImages.push(optimizedStr);
                            resolve();
                        }).catch(function(err) {
                            console.error('Image optimization failed', err);
                            currentImages.push(e.target.result); // Fallback to original
                            resolve();
                        });
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
                    alert('Connecting to the internet is required to process HEIC iPhone photos.');
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
            
            var img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'img-preview-item';
            img.alt = 'Photo ' + (index + 1);
            img.title = 'Click to remove';
            
            img.onclick = function() {
                currentImages.splice(index, 1);
                window.app.renderImagePreview();
            };
            
            imgContainer.appendChild(img);
            
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
            anatomy: document.getElementById('f-anatomy').value,
            category: document.getElementById('f-category').value,
            isWishlist: document.getElementById('f-wishlist').value === 'true',
            geologicalPeriod: document.getElementById('f-period').value,
            epoch: document.getElementById('f-epoch').value,
            stratAge: document.getElementById('f-strat-age').value,
            ageMa: parseFloat(document.getElementById('f-age').value) || 0,
            country: document.getElementById('f-country').value,
            location: document.getElementById('f-location').value,
            formation: document.getElementById('f-formation').value,
            size: parseFloat(document.getElementById('f-size').value) || null,
            sizeUnit: document.getElementById('f-size-unit').value,
            weight: parseFloat(document.getElementById('f-weight').value) || null,
            price: parseFloat(document.getElementById('f-price').value) || null,
            currency: document.getElementById('f-currency').value,
            notes: document.getElementById('f-notes').value,
            images: currentImages,
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
            window.app.closeModal();
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
        window.app.updateMassDeleteButton();
    },

    updateMassDeleteButton: function() {
        var btn = document.getElementById('btn-mass-delete');
        btn.style.display = selectedFossils.size > 0 ? 'inline-flex' : 'none';
        btn.innerText = 'Delete Selected (' + selectedFossils.size + ')';
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

    changeImage: function(id, dir) {
        var f = fossils.find(function(x) { return x.id === id; });
        if (!f || !f.images || f.images.length <= 1) return;
        
        var container = document.querySelector('[data-id="' + id + '"] .card-img-container');
        if (!container) return;
        
        var currentIndex = parseInt(container.getAttribute('data-current-index') || '0');
        var nextIndex = (currentIndex + dir + f.images.length) % f.images.length;
        
        container.setAttribute('data-current-index', nextIndex);
        
        var img = container.querySelector('img');
        if (img) img.src = f.images[nextIndex];
        
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
        document.getElementById('f-anatomy').value = f.anatomy || '';
        document.getElementById('f-category').value = f.category || '';
        document.getElementById('f-wishlist').value = f.isWishlist ? 'true' : 'false';
        document.getElementById('f-period').value = f.geologicalPeriod || '';
        window.app.updateEpochs(f.epoch);
        window.app.updateStratAges(f.stratAge);
        var ageVal = f.ageMa || 0;
        document.getElementById('f-age').value = ageVal;
        document.getElementById('f-age-slider').value = ageVal;
        document.getElementById('f-country').value = f.country || '';
        document.getElementById('f-location').value = f.location || '';
        document.getElementById('f-formation').value = f.formation || '';
        document.getElementById('f-size').value = f.size || '';
        document.getElementById('f-size-unit').value = f.sizeUnit || 'cm';
        document.getElementById('f-weight').value = f.weight || '';
        document.getElementById('f-price').value = f.price || '';
        document.getElementById('f-currency').value = f.currency || 'USD';
        document.getElementById('f-notes').value = f.notes || '';
    },

    // --- Render ---
    renderFossils: function() {
        return getAllFossils().then(function(allFossils) {
            fossils = allFossils;
            var grid = document.getElementById('fossil-grid');
            grid.innerHTML = '';

            var searchQ   = document.getElementById('search').value.toLowerCase();
            var catQ      = document.getElementById('filter-category').value;
            var periodQ   = document.getElementById('filter-period').value;
            var sortQ     = document.getElementById('filter-sort').value;
            var wlQ       = currentView === 'true';

            // --- FILTER ---
            var filtered = fossils.filter(function(f) {
                var s = f.specimen ? f.specimen.toLowerCase() : '';
                var a = f.anatomy  ? f.anatomy.toLowerCase()  : '';
                var n = f.notes    ? f.notes.toLowerCase()    : '';
                var c = f.country  ? f.country.toLowerCase()  : '';
                var fm = f.formation ? f.formation.toLowerCase() : '';
                var matchSearch = s.indexOf(searchQ) !== -1 || a.indexOf(searchQ) !== -1 ||
                                  n.indexOf(searchQ) !== -1 || c.indexOf(searchQ) !== -1 || fm.indexOf(searchQ) !== -1;
                var matchCat      = !catQ    || f.category === catQ;
                var matchPeriod   = !periodQ || f.geologicalPeriod === periodQ;
                var matchWishlist = !!f.isWishlist === wlQ;
                return matchSearch && matchCat && matchPeriod && matchWishlist;
            });

            // --- SORT ---
            filtered.sort(function(a, b) {
                switch (sortQ) {
                    case 'name-asc':   return (a.specimen || '').localeCompare(b.specimen || '');
                    case 'name-desc':  return (b.specimen || '').localeCompare(a.specimen || '');
                    case 'age-asc':    return (a.ageMa || 0) - (b.ageMa || 0);
                    case 'age-desc':   return (b.ageMa || 0) - (a.ageMa || 0);
                    case 'price-asc':  return (a.price || 0) - (b.price || 0);
                    case 'price-desc': return (b.price || 0) - (a.price || 0);
                    case 'oldest':     return (a.createdAt || 0) - (b.createdAt || 0);
                    case 'newest':
                    default:           return (b.createdAt || 0) - (a.createdAt || 0);
                }
            });

            // --- STATS DASHBOARD ---
            var statsContainer = document.getElementById('stats-summary');
            if (filtered.length > 0) {
                // Group by Currency
                var valueByCurrency = {};
                
                // Charts Data Arrays
                var countryCounts = {};
                var periodCounts = {};

                var catCounts = {};
                var maxCatCount = 0;
                var mostCommonCat = null;

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

                    // Tally Currency
                    if (f.price > 0) {
                        var curr = f.currency || 'USD';
                        valueByCurrency[curr] = (valueByCurrency[curr] || 0) + f.price;
                    }

                    // Tally Country
                    var cntry = f.country ? f.country.trim() : 'Unknown';
                    if (cntry.length === 0) cntry = 'Unknown';
                    countryCounts[cntry] = (countryCounts[cntry] || 0) + 1;

                    // Tally Period
                    var per = f.geologicalPeriod ? f.geologicalPeriod : 'Unknown';
                    periodCounts[per] = (periodCounts[per] || 0) + 1;
                }
                
                var statsHtml = 'Showing <strong>' + filtered.length + '</strong> specimens';
                
                var totalValueSEK = 0;
                var hasTotalValue = false;
                for (var currencyKey in valueByCurrency) {
                    var val = valueByCurrency[currencyKey];
                    // Use dynamic exchangeRates if available
                    if (exchangeRates && exchangeRates[currencyKey]) {
                        totalValueSEK += val / exchangeRates[currencyKey];
                    } else {
                        // Approximate conversion rates fallback
                        if (currencyKey === 'USD') totalValueSEK += val * 10.50;
                        else if (currencyKey === 'EUR') totalValueSEK += val * 11.50;
                        else if (currencyKey === 'SEK') totalValueSEK += val;
                        else totalValueSEK += val; // fallback for unhandled
                    }
                    if (val > 0) hasTotalValue = true;
                }
                
                if (hasTotalValue) {
                    statsHtml += ' &middot; Est. Total Value: <strong>' + Math.round(totalValueSEK).toLocaleString() + ' SEK</strong>';
                }

                if (mostCommonCat) {
                    statsHtml += ' &middot; Primary: <strong>' + (window.escapeHtml ? escapeHtml(mostCommonCat) : mostCommonCat) + '</strong>';
                }
                
                var textContainer = document.getElementById('stats-summary-text');
                if (textContainer) {
                    textContainer.innerHTML = statsHtml;
                }

                if (isStatsOpen) {
                    statsContainer.style.display = 'flex';
                    
                    // Render Charts
                    try {
                        if (chartCountry) chartCountry.destroy();
                        var ctxCountry = document.getElementById('chart-country').getContext('2d');
                        chartCountry = new Chart(ctxCountry, {
                            type: 'pie',
                            data: {
                                labels: Object.keys(countryCounts),
                                datasets: [{
                                    data: Object.values(countryCounts),
                                    backgroundColor: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab']
                                }]
                            },
                            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' }, title: { display: true, text: 'Country of Origin' } } }
                        });

                        if (chartPeriod) chartPeriod.destroy();
                        var ctxPeriod = document.getElementById('chart-period').getContext('2d');
                        chartPeriod = new Chart(ctxPeriod, {
                            type: 'pie',
                            data: {
                                labels: Object.keys(periodCounts),
                                datasets: [{
                                    data: Object.values(periodCounts),
                                    backgroundColor: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab']
                                }]
                            },
                            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' }, title: { display: true, text: 'Geological Period' } } }
                        });
                    } catch (e) {
                        console.error('Chart.js error:', e);
                    }
                } else {
                    statsContainer.style.display = 'none';
                }
            } else {
                statsContainer.style.display = 'none';
            }



            // --- EMPTY STATE ---
            if (filtered.length === 0) {
                grid.innerHTML =
                    '<div class="empty-state">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
                        '<h3>No Specimens Found</h3>' +
                        '<p>Add your first fossil using the button above, or import a CSV file.</p>' +
                    '</div>';
                return;
            }

            // --- RENDER CARDS ---
            filtered.forEach(function(f) {
                var card = document.createElement('article');
                card.className = 'fossil-card';
                card.setAttribute('data-id', f.id);

                var hasImage = f.images && f.images.length > 0;
                var multipleImages = f.images && f.images.length > 1;
                
                var imgHtml = '';
                if (hasImage) {
                    imgHtml = '<img src="' + f.images[0] + '" alt="' + escapeHtml(f.specimen) + ' photograph" loading="lazy" style="cursor: zoom-in;" onclick="event.stopPropagation(); var idx = parseInt(this.parentElement.getAttribute(\'data-current-index\') || 0); app.openLightbox(\'' + f.id + '\', idx);" />';
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

                var timelineHtml = '';

                var fullTimelineBlock = '';
                if (f.ageMa > 0) {
                    var percentage = Math.min((f.ageMa / 541) * 100, 100);
                    var eraColor = '#a878d0';
                    var eraName = 'Precambrian';
                    if (f.ageMa <= 66) { eraColor = '#e6a817'; eraName = 'Cenozoic'; }
                    else if (f.ageMa <= 252) { eraColor = '#439775'; eraName = 'Mesozoic'; }
                    else if (f.ageMa <= 541) { eraColor = '#3a8fb7'; eraName = 'Paleozoic'; }
                    
                    var geoText = (f.geologicalPeriod || 'Unknown Period') + (f.epoch ? ' (' + f.epoch + ')' : '') + (f.stratAge ? ' · ' + f.stratAge : '') + ' · ~' + f.ageMa + ' Ma';

                    fullTimelineBlock = '<div class="card-timeline-container">' +
                                        '<div class="card-timeline-header">' +
                                            '<span class="card-timeline-label">Present</span>' +
                                            '<span class="card-timeline-value" style="color: ' + eraColor + ';" title="' + escapeHtml(geoText) + '">' + escapeHtml(geoText) + '</span>' +
                                        '</div>' +
                                        '<div class="card-timeline-bar-track">' +
                                            '<div class="card-timeline-bar-fill" style="width: ' + Math.max(percentage, 1) + '%; background-color: ' + eraColor + ';"></div>' +
                                        '</div></div>';
                }

                var badgeClass = f.isWishlist ? 'badge badge-wishlist' : 'badge';
                var periodText = f.geologicalPeriod ? ' &middot; ' + escapeHtml(f.geologicalPeriod) : '';
                var epochText  = f.epoch ? ' (' + escapeHtml(f.epoch) + ')' : '';
                var stratAgeText = f.stratAge ? ' &middot; ' + escapeHtml(f.stratAge) + ' Age' : '';
                var ageText    = f.ageMa ? ' &middot; ~' + f.ageMa + ' Ma' : '';

                var detailsArr = [];
                if (f.size) detailsArr.push('Size: ' + escapeHtml(f.size) + ' ' + (f.sizeUnit || 'cm'));
                if (f.weight) detailsArr.push('Weight: ' + escapeHtml(f.weight) + 'g');
                if (f.price) detailsArr.push('Price: ' + f.price + ' ' + (f.currency || 'USD'));
                var detailsText = detailsArr.length > 0 ? '<p class="card-meta" style="margin-top: 0.25rem; font-weight: 500;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ' + detailsArr.join(' &middot; ') + '</p>' : '';
                
                var speciesFirstWord = (f.specimen || '').trim().split(' ')[0] || '';
                var wikiQuery = encodeURIComponent(speciesFirstWord);
                
                var locQueryArr = [];
                if (f.location) locQueryArr.push(f.location);
                if (f.formation) locQueryArr.push(f.formation);
                if (f.country) locQueryArr.push(f.country);
                var mapQuery = encodeURIComponent(locQueryArr.join(', '));
                
                var locationTextRaw = (f.location ? escapeHtml(f.location) + ', ' : '') + escapeHtml(f.country || 'Unknown Origin') + (f.formation ? ' (' + escapeHtml(f.formation) + ')' : '');
                var locationHtmlStr = locQueryArr.length > 0 ? '<a href="https://www.google.com/maps/search/?api=1&query=' + mapQuery + '" target="_blank" onclick="event.stopPropagation();" title="View on Google Maps" style="color: inherit; text-decoration: none; transition: color 0.15s ease;" onmouseover="this.style.color=\'var(--accent)\'" onmouseout="this.style.color=\'inherit\'">' + locationTextRaw + '</a>' : locationTextRaw;

                card.innerHTML =
                    '<div class="checkbox-container">' +
                        '<input type="checkbox" aria-label="Select ' + escapeHtml(f.specimen) + '" onchange="app.toggleSelectFossil(event, \'' + f.id + '\')" ' + (selectedFossils.has(f.id) ? 'checked' : '') + '>' +
                    '</div>' +
                    '<div class="card-img-container" data-current-index="0" style="position: relative;">' + imgHtml + '</div>' +
                    '<div class="card-content">' +
                        '<div style="font-size: 0.625rem; color: var(--text-secondary); opacity: 0.7; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.2rem;">' + escapeHtml(f.id) + '</div>' +
                        '<h3 class="card-title">' + annotateSpecimenName(f.specimen) + '</h3>' +
                        (f.anatomy ? '<div style="margin-top: -0.25rem; margin-bottom: 0.5rem;"><span style="display: inline-flex; align-items: center; gap: 0.35rem; background: transparent; border: 1px solid var(--accent); color: var(--accent); padding: 0.15rem 0.5rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> ' + escapeHtml(f.anatomy) + '</span></div>' : '') +
                        '<p class="card-meta"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> ' + escapeHtml(f.category) + '</p>' +
                        '<p class="card-meta" style="margin-top: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ' + locationHtmlStr + '</p>' +
                        detailsText +
                        '<div class="card-footer">' +
                            '<span class="' + badgeClass + '">' + (f.isWishlist ? 'Wishlist' : 'Owned') + '</span>' +
                            '<div class="card-actions">' +
                                (speciesFirstWord ? '<button title="Read about ' + escapeHtml(speciesFirstWord) + ' on Wikipedia" onclick="window.open(\'https://en.wikipedia.org/wiki/Special:Search?search=\' + \'' + wikiQuery + '\', \'_blank\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg></button>' : '') +
                                '<button title="Edit" onclick="app.openModal(\'' + f.id + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
                                '<button title="Duplicate" onclick="app.duplicateFossil(\'' + f.id + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>' +
                                '<button class="btn-delete" title="Delete" onclick="app.deleteFossilItem(\'' + f.id + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    fullTimelineBlock;

                grid.appendChild(card);
            });
        });
    },

    // --- Export / Import ---
    exportData: function() { 
        localStorage.setItem('last_backup', Date.now());
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
                    alert('Successfully restored ' + successCount + ' fossil(s) from backup!');
                    window.app.renderFossils();
                    document.getElementById('file-restore-json').value = '';
                });

            } catch (err) {
                alert('Error reading JSON backup: ' + err.message);
                document.getElementById('file-restore-json').value = '';
            }
        };
        reader.readAsText(file);
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
                                images: [],
                                createdAt: Date.now()
                            });
                        });
                    }
                });

                chain.then(function() {
                    alert('Successfully imported ' + successCount + ' fossil(s)!');
                    window.app.renderFossils();
                    document.getElementById('file-import').value = '';
                });
            }
        });
    }
};


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

function showToast(msg) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed; bottom:30px; right:30px; background:var(--accent); color:#fff; padding:1rem 1.5rem; border-radius:var(--radius-md); box-shadow:0 10px 30px rgba(0,0,0,0.3); z-index:10001; font-weight:700; display:flex; align-items:center; gap:0.75rem; animation:toastSlideIn 0.4s ease-out;';
    toast.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> ' + msg;
    
    // Auto-inject animation if missing
    if (!document.getElementById('toast-animation')) {
        var s = document.createElement('style');
        s.id = 'toast-animation';
        s.innerHTML = '@keyframes toastSlideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }';
        document.head.appendChild(s);
    }
    
    document.body.appendChild(toast);
    setTimeout(function() {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        toast.style.transition = 'all 0.4s ease-in';
        setTimeout(function() { toast.remove(); }, 400);
    }, 4000);
}




function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
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
                        if (imgStr && imgStr.length > 800000) {
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



