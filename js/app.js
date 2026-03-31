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

    mapped.geologicalPeriod = keyMap['geologicalperiod'] || keyMap['geological period'] || keyMap['period'] || keyMap['age'] || '';
    mapped.epoch       = keyMap['epoch'] || '';
    mapped.country     = keyMap['country'] || keyMap['country of origin'] || keyMap['origin'] || '';
    mapped.location    = keyMap['location'] || keyMap['locality'] || keyMap['site'] || '';
    mapped.formation   = keyMap['formation'] || keyMap['geological formation'] || '';
    mapped.size        = keyMap['size'] || keyMap['dimensions'] || '';
    mapped.weight      = keyMap['weight'] || '';
    mapped.price       = parseFloat(keyMap['price'] || keyMap['value'] || keyMap['cost'] || '') || null;
    mapped.notes       = keyMap['notes'] || keyMap['description'] || keyMap['comments'] || '';
    mapped.ageMa       = parseInt(keyMap['agema'] || keyMap['age ma'] || keyMap['age (ma)'] || '0') || 0;

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
                var ageVal = f.ageMa || 0;
                document.getElementById('f-age').value = ageVal;
                document.getElementById('age-display').textContent = ageVal;
                document.getElementById('f-country').value = f.country || '';
                document.getElementById('f-location').value = f.location || '';
                document.getElementById('f-formation').value = f.formation || '';
                document.getElementById('f-size').value = f.size || '';
                document.getElementById('f-weight').value = f.weight || '';
                document.getElementById('f-price').value = f.price || '';
                document.getElementById('f-notes').value = f.notes || '';

                if (f.images && Array.isArray(f.images)) {
                    currentImages = f.images.slice();
                    window.app.renderImagePreview();
                }
            }
        } else {
            document.getElementById('fossil-id').value = '';
            document.getElementById('f-age').value = 0;
            document.getElementById('age-display').textContent = '0';
            window.app.updateEpochs();
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

    updateAgeSlider: function() {
        var period = document.getElementById('f-period').value;
        if (period && PERIOD_AGES[period] !== undefined) {
            var age = PERIOD_AGES[period];
            document.getElementById('f-age').value = age;
            document.getElementById('age-display').textContent = age;
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
    handleImageUpload: function(event) {
        var files = event.target.files;
        if (!files) return;
        for (var i = 0; i < files.length; i++) {
            (function(file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    currentImages.push(e.target.result);
                    window.app.renderImagePreview();
                };
                reader.readAsDataURL(file);
            })(files[i]);
        }
    },

    renderImagePreview: function() {
        var container = document.getElementById('image-preview');
        container.innerHTML = '';
        currentImages.forEach(function(imgSrc, index) {
            var img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'img-preview-item';
            img.alt = 'Preview ' + (index + 1) + ' (click to remove)';
            img.title = 'Click to remove';
            img.style.cursor = 'pointer';
            img.onclick = function() {
                currentImages.splice(index, 1);
                window.app.renderImagePreview();
            };
            container.appendChild(img);
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
            ageMa: parseInt(document.getElementById('f-age').value) || 0,
            country: document.getElementById('f-country').value,
            location: document.getElementById('f-location').value,
            formation: document.getElementById('f-formation').value,
            size: document.getElementById('f-size').value,
            weight: document.getElementById('f-weight').value,
            price: parseFloat(document.getElementById('f-price').value) || null,
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

                var hasImage = f.images && f.images.length > 0;
                var imgHtml = hasImage
                    ? '<img src="' + f.images[0] + '" alt="' + escapeHtml(f.specimen) + ' photograph" loading="lazy" />'
                    : '<svg class="card-placeholder-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';

                var badgeClass = f.isWishlist ? 'badge badge-wishlist' : 'badge';
                var periodText = f.geologicalPeriod ? ' &middot; ' + escapeHtml(f.geologicalPeriod) : '';
                var epochText  = f.epoch ? ' (' + escapeHtml(f.epoch) + ')' : '';
                var ageText    = f.ageMa ? ' &middot; ~' + f.ageMa + ' Ma' : '';

                card.innerHTML =
                    '<div class="checkbox-container">' +
                        '<input type="checkbox" aria-label="Select ' + escapeHtml(f.specimen) + '" onchange="app.toggleSelectFossil(event, \'' + f.id + '\')" ' + (selectedFossils.has(f.id) ? 'checked' : '') + '>' +
                    '</div>' +
                    '<div class="card-img-container">' + imgHtml + '</div>' +
                    '<div class="card-content">' +
                        '<h3 class="card-title">' + escapeHtml(f.specimen) + '</h3>' +
                        '<p class="card-meta"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> ' + escapeHtml(f.category) + periodText + epochText + ageText + '</p>' +
                        '<p class="card-meta"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ' + escapeHtml(f.country || 'Unknown Origin') + '</p>' +
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
