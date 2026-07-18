// =========================================================================
// SPECIMENRY — db.js
// DATABASE (IndexedDB) — core persistence layer for fossil/mineral records.
// Extracted from app.js. Loaded as a classic script before app.js
// (see index.html).
// =========================================================================
var DB_NAME = 'FossilArchiveDB';
var DB_VERSION = 4;
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
            if (!db.objectStoreNames.contains('trips')) {
                db.createObjectStore('trips', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('localities')) {
                db.createObjectStore('localities', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('groups')) {
                db.createObjectStore('groups', { keyPath: 'id' });
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

function addFossil(fossil, options) {
    var keep = options && options.keepTimestamps;
    if (!keep) {
        if (!fossil.createdAt) {
            fossil.createdAt = Date.now();
        }
        fossil.updatedAt = Date.now();
    } else {
        if (!fossil.createdAt) fossil.createdAt = Date.now();
        if (!fossil.updatedAt) fossil.updatedAt = Date.now();
    }
    if (!keep && typeof SpecimenryChangeLog !== 'undefined' && (!fossil.changeLog || !fossil.changeLog.length)) {
        fossil.changeLog = [{
            at: Date.now(),
            actor: SpecimenryChangeLog.getActor(),
            summary: 'specimen created',
            changes: [{ field: 'specimen', label: 'Name', from: '', to: String(fossil.specimen || '') }]
        }];
    }
    return withStore('readwrite', function(store, resolve, reject) {
        var request = store.add(fossil);
        request.onsuccess = function() { 
            fossilsCacheLoaded = false; 
            resolve(); 
            if (!keep && window.app && typeof window.app.autoPushCloud === 'function') {
                window.app.autoPushCloud();
            }
            if (!keep && fossil && !fossil.isCartItem && typeof SpecimenryBackup !== 'undefined') {
                SpecimenryBackup.noteSpecimenAdded(fossil);
                if (window.app && typeof window.app.refreshBackupReminder === 'function') {
                    window.app.refreshBackupReminder();
                }
            }
        };
        request.onerror = function() { reject(request.error); };
    });
}

function updateFossil(fossil, options) {
    options = options || {};
    var keep = options.keepTimestamps;
    if (!keep) {
        if (!fossil.createdAt) {
            fossil.createdAt = Date.now();
        }
        fossil.updatedAt = Date.now();
    } else {
        if (!fossil.createdAt) fossil.createdAt = Date.now();
        if (!fossil.updatedAt) fossil.updatedAt = Date.now();
    }

    return initDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            var tx = db.transaction('fossils', 'readwrite');
            var store = tx.objectStore('fossils');
            tx.onerror = function(e) { reject(e); };

            var finishPut = function() {
                var request = store.put(fossil);
                request.onsuccess = function() {
                    fossilsCacheLoaded = false;
                    resolve();
                    if (!keep && window.app && typeof window.app.autoPushCloud === 'function') {
                        window.app.autoPushCloud();
                    }
                };
                request.onerror = function() { reject(request.error); };
            };

            // Import / sync with keepTimestamps: still preserve local changeLog when the
            // incoming record omits it or sends an empty array (avoids silent wipe).
            if (options.skipChangeLog || options.keepTimestamps || typeof SpecimenryChangeLog === 'undefined' || !fossil || !fossil.id) {
                if (options.keepTimestamps && fossil && fossil.id) {
                    var keepGet = store.get(fossil.id);
                    keepGet.onerror = function() { reject(keepGet.error); };
                    keepGet.onsuccess = function() {
                        var prevKeep = keepGet.result || null;
                        if (prevKeep && Array.isArray(prevKeep.changeLog) && prevKeep.changeLog.length) {
                            if (!Array.isArray(fossil.changeLog) || !fossil.changeLog.length) {
                                fossil.changeLog = prevKeep.changeLog.slice();
                            }
                        }
                        finishPut();
                    };
                    return;
                }
                finishPut();
                return;
            }

            var getReq = store.get(fossil.id);
            getReq.onerror = function() { reject(getReq.error); };
            getReq.onsuccess = function() {
                var prev = getReq.result || null;
                if (prev) {
                    // Preserve log if caller omitted it
                    if (!Array.isArray(fossil.changeLog) && Array.isArray(prev.changeLog)) {
                        fossil.changeLog = prev.changeLog.slice();
                    }
                    SpecimenryChangeLog.applyDiff(fossil, prev);
                } else if (!Array.isArray(fossil.changeLog)) {
                    fossil.changeLog = [{
                        at: Date.now(),
                        actor: SpecimenryChangeLog.getActor(),
                        summary: 'specimen created',
                        changes: [{ field: 'specimen', label: 'Name', from: '', to: String(fossil.specimen || '') }]
                    }];
                }
                finishPut();
            };
        });
    });
}

function deleteFossil(id) {
    var deletedIds = [];
    try {
        deletedIds = JSON.parse(localStorage.getItem('fossil_deleted_ids') || '[]');
    } catch(e) {}
    if (deletedIds.indexOf(id) === -1) {
        deletedIds.push(id);
        localStorage.setItem('fossil_deleted_ids', JSON.stringify(deletedIds));
    }

    return withStore('readwrite', function(store, resolve, reject) {
        var request = store.delete(id);
        request.onsuccess = function() { 
            fossilsCacheLoaded = false; 
            resolve(); 
            if (window.app && typeof window.app.autoPushCloud === 'function') {
                window.app.autoPushCloud();
            }
        };
        request.onerror = function() { reject(request.error); };
    });
}

/** Remove IDs from the sync tombstone list (used when undoing a delete). */
function clearDeletedIdMarkers(ids) {
    var list = ids || [];
    if (!list.length) return;
    var deletedIds = [];
    try {
        deletedIds = JSON.parse(localStorage.getItem('fossil_deleted_ids') || '[]');
    } catch (e) {
        deletedIds = [];
    }
    var next = deletedIds.filter(function(id) { return list.indexOf(id) === -1; });
    localStorage.setItem('fossil_deleted_ids', JSON.stringify(next));
}

function deleteMultipleFossils(ids) {
    var deletedIds = [];
    try {
        deletedIds = JSON.parse(localStorage.getItem('fossil_deleted_ids') || '[]');
    } catch(e) {}
    ids.forEach(function(id) {
        if (deletedIds.indexOf(id) === -1) {
            deletedIds.push(id);
        }
    });
    localStorage.setItem('fossil_deleted_ids', JSON.stringify(deletedIds));

    return initDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            var tx = db.transaction('fossils', 'readwrite');
            var store = tx.objectStore('fossils');
            tx.onerror = function(e) { reject(e); };
            tx.oncomplete = function() { 
                fossilsCacheLoaded = false; 
                resolve(); 
                if (window.app && typeof window.app.autoPushCloud === 'function') {
                    window.app.autoPushCloud();
                }
            };
            ids.forEach(function(id) { store.delete(id); });
        });
    });
}

/** Serialize a full backup object (fossils + trips + localities + groups). */
function serializeFullBackup(fossilsList, tripsList, localitiesList, groupsList) {
    return JSON.stringify({
        format: 'specimenry-backup',
        version: 4,
        exportedAt: new Date().toISOString(),
        fossils: fossilsList || [],
        trips: tripsList || [],
        localities: localitiesList || [],
        groups: groupsList || []
    }, null, 2);
}

/** @deprecated Prefer serializeFullBackup — kept for tests/compat */
function serializeFossilsBackup(fossilsList) {
    return JSON.stringify(fossilsList || [], null, 2);
}

/**
 * Parse a JSON backup string. Returns { ok, fossils, trips, error, format }.
 * Accepts a bare array (legacy), or { fossils, trips } / { data } wrappers.
 */
function parseFossilsBackup(jsonStr) {
    try {
        var data = (typeof jsonStr === 'string') ? JSON.parse(jsonStr) : jsonStr;
        var trips = [];
        var localities = [];
        var groups = [];
        if (data && !Array.isArray(data) && typeof data === 'object') {
            if (Array.isArray(data.trips)) trips = data.trips;
            if (Array.isArray(data.localities)) localities = data.localities;
            if (Array.isArray(data.groups)) groups = data.groups;
            if (Array.isArray(data.fossils)) {
                return { ok: true, fossils: data.fossils, trips: trips, localities: localities, groups: groups, error: null, format: data.format || 'specimenry-backup' };
            }
            if (Array.isArray(data.data)) {
                return { ok: true, fossils: data.data, trips: trips, localities: localities, groups: groups, error: null, format: 'legacy-data' };
            }
            if (Array.isArray(data.specimens)) {
                return { ok: true, fossils: data.specimens, trips: trips, localities: localities, groups: groups, error: null, format: 'sync-style' };
            }
        }
        if (!Array.isArray(data)) {
            return { ok: false, fossils: null, trips: [], localities: [], groups: [], error: 'Invalid format: Expected an array of fossils.', format: null };
        }
        return { ok: true, fossils: data, trips: [], localities: [], groups: [], error: null, format: 'legacy-array' };
    } catch (err) {
        return { ok: false, fossils: null, trips: [], localities: [], groups: [], error: (err && err.message) ? err.message : String(err), format: null };
    }
}

function exportToJSON() {
    var fossilsPromise = getAllFossils();
    var tripsPromise = (typeof SpecimenryTrips !== 'undefined' && SpecimenryTrips.getAll)
        ? SpecimenryTrips.getAll().catch(function() { return []; })
        : Promise.resolve([]);
    var localitiesPromise = (typeof SpecimenryLocalities !== 'undefined' && SpecimenryLocalities.getAll)
        ? SpecimenryLocalities.getAll().catch(function() { return []; })
        : Promise.resolve([]);
    var groupsPromise = (typeof SpecimenryGroups !== 'undefined' && SpecimenryGroups.getAll)
        ? SpecimenryGroups.getAll().catch(function() { return []; })
        : Promise.resolve([]);

    return Promise.all([fossilsPromise, tripsPromise, localitiesPromise, groupsPromise]).then(function(results) {
        var fossilsList = results[0] || [];
        var tripsList = results[1] || [];
        var localitiesList = results[2] || [];
        var groupsList = results[3] || [];
        if ((!fossilsList || fossilsList.length === 0) && (!tripsList || tripsList.length === 0) &&
            (!localitiesList || localitiesList.length === 0) && (!groupsList || groupsList.length === 0)) {
            if (window.app && window.app.showToast) {
                window.app.showToast('No fossil records found to export.', 'warning');
            }
            return { ok: false, empty: true };
        }
        var dataStr = (typeof serializeFullBackup === 'function')
            ? serializeFullBackup(fossilsList, tripsList, localitiesList, groupsList)
            : JSON.stringify(fossilsList, null, 2);
        var blob = new Blob([dataStr], { type: 'application/json' });
        var filename = (typeof SpecimenryBackup !== 'undefined' && SpecimenryBackup.buildFilename)
            ? SpecimenryBackup.buildFilename()
            : 'specimenry-backup.json';
        var fingerprint = (typeof SpecimenryBackup !== 'undefined')
            ? SpecimenryBackup.fingerprintLists(fossilsList, tripsList, localitiesList, groupsList)
            : '';

        var savePromise = (typeof SpecimenryBackup !== 'undefined' && SpecimenryBackup.saveBlobToDownloads)
            ? SpecimenryBackup.saveBlobToDownloads(blob, filename)
            : Promise.resolve((function() {
                var url = URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                return { ok: true, method: 'download', filename: filename };
            })());

        return savePromise.then(function(saveResult) {
            if (!saveResult || !saveResult.ok) {
                if (saveResult && saveResult.cancelled && window.app && window.app.showToast) {
                    window.app.showToast('Backup cancelled.', 'warning');
                }
                return saveResult || { ok: false };
            }

            if (typeof SpecimenryBackup !== 'undefined') {
                SpecimenryBackup.recordSuccessfulBackup({
                    filename: saveResult.filename || filename,
                    specimenCount: fossilsList.length,
                    tripCount: tripsList.length,
                    localityCount: localitiesList.length,
                    groupCount: groupsList.length,
                    fingerprint: fingerprint,
                    method: saveResult.method,
                    source: 'export'
                });
            }

            if (window.app && window.app.showToast) {
                var tripNote = tripsList.length ? ' + ' + tripsList.length + ' trip(s)' : '';
                var locNote = localitiesList.length ? ' + ' + localitiesList.length + ' site(s)' : '';
                var grpNote = groupsList.length ? ' + ' + groupsList.length + ' group(s)' : '';
                var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
                var where;
                if (saveResult.method === 'picker') {
                    where = 'Saved to the folder you chose (Downloads is a good default).';
                } else if (isIOS) {
                    where = 'Where is the file? Check Files → Downloads (or use the iOS share sheet).';
                } else {
                    where = 'Where is the file? Check your Downloads folder.';
                }
                window.app.showToast(
                    'Backup OK (' + fossilsList.length + ' specimens' + tripNote + locNote + grpNote + '). ' + where,
                    'success',
                    7500
                );
            }
            if (window.app && typeof window.app.refreshBackupReminder === 'function') {
                window.app.refreshBackupReminder();
            }
            if (window.app && typeof window.app.refreshBackupCenterStats === 'function') {
                window.app.refreshBackupCenterStats();
            }
            return {
                ok: true,
                filename: saveResult.filename || filename,
                specimenCount: fossilsList.length,
                tripCount: tripsList.length,
                localityCount: localitiesList.length,
                groupCount: groupsList.length,
                fingerprint: fingerprint,
                method: saveResult.method
            };
        });
    }).catch(function(err) {
        if (typeof reportAppError === 'function') {
            reportAppError(err, 'Export backup', {
                type: 'error',
                retry: function() { exportToJSON(); }
            });
        } else if (window.app && window.app.showToast) {
            window.app.showToast('Export failed: ' + err.message, 'error');
        }
        return { ok: false, error: err };
    });
}
