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

// Approximate mid-point age (Ma) for each period — capped to 650 slider max
var PERIOD_AGES = {
    'Quaternary': 1, 'Neogene': 15, 'Paleogene': 50,
    'Cretaceous': 100, 'Jurassic': 175, 'Triassic': 230,
    'Permian': 275, 'Carboniferous': 325, 'Devonian': 390,
    'Silurian': 430, 'Ordovician': 470, 'Cambrian': 510,
    'Proterozoic': 650, 'Archean': 650, 'Hadean': 650
};

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

window.addEventListener('DOMContentLoaded', function() {
    populateDropdowns();
    initDB().then(function() {
        window.app.renderFossils();
    });
});


// =========================================================================
// APP METHODS — attached to window.app for inline HTML handlers
// =========================================================================
window.app = {

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
            document.getElementById('f-age').value = 0;
            document.getElementById('f-age-slider').value = 0;
            document.getElementById('f-size-unit').value = 'cm';
            document.getElementById('f-currency').value = 'USD';
            window.app.updateEpochs();
            window.app.updateStratAges();
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
                        currentImages.push(e.target.result);
                    }
                    resolve();
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
            container.appendChild(imgContainer);
        });
    },

    // --- Save ---
    saveFossil: function(event) {
        event.preventDefault();
        var idVal = document.getElementById('fossil-id').value;
        var isEditing = !!idVal;

        var fossil = {
            id: isEditing ? idVal : generateId(),
            specimen: document.getElementById('f-specimen').value,
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
                var n = f.notes    ? f.notes.toLowerCase()    : '';
                var c = f.country  ? f.country.toLowerCase()  : '';
                var fm = f.formation ? f.formation.toLowerCase() : '';
                var matchSearch = s.indexOf(searchQ) !== -1 || n.indexOf(searchQ) !== -1 ||
                                  c.indexOf(searchQ) !== -1 || fm.indexOf(searchQ) !== -1;
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
                    imgHtml = '<img src="' + f.images[0] + '" alt="' + escapeHtml(f.specimen) + ' photograph" loading="lazy" />';
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

                card.innerHTML =
                    '<div class="checkbox-container">' +
                        '<input type="checkbox" aria-label="Select ' + escapeHtml(f.specimen) + '" onchange="app.toggleSelectFossil(event, \'' + f.id + '\')" ' + (selectedFossils.has(f.id) ? 'checked' : '') + '>' +
                    '</div>' +
                    '<div class="card-img-container" data-current-index="0">' + imgHtml + '</div>' +
                    '<div class="card-content">' +
                        '<h3 class="card-title">' + escapeHtml(f.specimen) + '</h3>' +
                        '<p class="card-meta"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> ' + escapeHtml(f.category) + periodText + epochText + stratAgeText + ageText + '</p>' +
                        '<p class="card-meta"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ' + escapeHtml(f.country || 'Unknown Origin') + (f.formation ? ' (' + escapeHtml(f.formation) + ')' : '') + '</p>' +
                        detailsText +
                        '<div class="card-footer">' +
                            '<span class="' + badgeClass + '">' + (f.isWishlist ? 'Wishlist' : 'Owned') + '</span>' +
                            '<div class="card-actions">' +
                                '<button title="Edit" onclick="app.openModal(\'' + f.id + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
                                '<button class="btn-delete" title="Delete" onclick="app.deleteFossilItem(\'' + f.id + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

                grid.appendChild(card);
            });
        });
    },

    // --- Export / Import ---
    exportData: function() { exportToJSON(); },

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
