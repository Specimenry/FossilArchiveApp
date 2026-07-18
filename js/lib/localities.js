// =========================================================================
// SPECIMENRY — localities.js
// Reusable collecting sites. Visits stay in the "trips" store (localityId FK).
// Loaded as a classic script before app.js (see index.html).
// =========================================================================
var SpecimenryLocalities = (function() {
    function withStore(mode, fn) {
        return initDB().then(function(db) {
            if (!db.objectStoreNames.contains('localities')) {
                return Promise.reject(new Error('Localities store not available — reload after update.'));
            }
            return new Promise(function(resolve, reject) {
                var tx = db.transaction('localities', mode);
                var store = tx.objectStore('localities');
                tx.onerror = function(e) { reject(e); };
                fn(store, resolve, reject);
            });
        });
    }

    function getAll() {
        return withStore('readonly', function(store, resolve, reject) {
            var req = store.getAll();
            req.onsuccess = function() {
                var list = req.result || [];
                list.sort(function(a, b) {
                    return String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' }) ||
                        (b.updatedAt || 0) - (a.updatedAt || 0);
                });
                resolve(list);
            };
            req.onerror = function() { reject(req.error); };
        });
    }

    function getById(id) {
        return withStore('readonly', function(store, resolve, reject) {
            var req = store.get(id);
            req.onsuccess = function() { resolve(req.result || null); };
            req.onerror = function() { reject(req.error); };
        });
    }

    function save(loc) {
        if (!loc || !loc.id) {
            return Promise.reject(new Error('Locality requires an id'));
        }
        loc.updatedAt = Date.now();
        if (!loc.createdAt) loc.createdAt = loc.updatedAt;
        if (!Array.isArray(loc.photos)) loc.photos = [];
        return withStore('readwrite', function(store, resolve, reject) {
            var req = store.put(loc);
            req.onsuccess = function() { resolve(loc); };
            req.onerror = function() { reject(req.error); };
        });
    }

    function remove(id) {
        return withStore('readwrite', function(store, resolve, reject) {
            var req = store.delete(id);
            req.onsuccess = function() { resolve(); };
            req.onerror = function() { reject(req.error); };
        });
    }

    function createId() {
        return 'LOC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    }

    function newBlank() {
        return {
            id: createId(),
            name: '',
            country: '',
            region: '',
            lat: null,
            lng: null,
            notes: '',
            photos: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
    }

    function replaceAll(list) {
        return initDB().then(function(db) {
            if (!db.objectStoreNames.contains('localities')) {
                return Promise.resolve();
            }
            return new Promise(function(resolve, reject) {
                var tx = db.transaction('localities', 'readwrite');
                var store = tx.objectStore('localities');
                tx.onerror = function(e) { reject(e); };
                tx.oncomplete = function() { resolve(); };
                store.clear();
                (list || []).forEach(function(loc) {
                    if (loc && loc.id) store.put(loc);
                });
            });
        });
    }

    function mergeByUpdatedAt(localList, remoteList) {
        var map = {};
        (localList || []).forEach(function(t) {
            if (t && t.id) map[t.id] = t;
        });
        (remoteList || []).forEach(function(t) {
            if (!t || !t.id) return;
            if (!map[t.id]) {
                map[t.id] = t;
            } else if ((t.updatedAt || 0) > (map[t.id].updatedAt || 0)) {
                map[t.id] = t;
            }
        });
        return Object.keys(map).map(function(k) { return map[k]; });
    }

    /** Seed localities from unique free-text trip.locality values (skips existing names). */
    function importFromTrips(trips) {
        return getAll().then(function(existing) {
            var byName = {};
            (existing || []).forEach(function(loc) {
                var key = String(loc.name || '').trim().toLowerCase();
                if (key) byName[key] = loc;
            });
            var created = [];
            var chain = Promise.resolve();
            (trips || []).forEach(function(trip) {
                var name = String(trip.locality || '').trim();
                if (!name) return;
                var key = name.toLowerCase();
                if (byName[key]) {
                    if (trip.id && !trip.localityId) {
                        trip.localityId = byName[key].id;
                    }
                    return;
                }
                var loc = newBlank();
                loc.name = name;
                loc.country = trip.country || '';
                loc.lat = trip.lat != null ? trip.lat : null;
                loc.lng = trip.lng != null ? trip.lng : null;
                byName[key] = loc;
                created.push(loc);
                trip.localityId = loc.id;
                chain = chain.then(function() { return save(loc); });
            });
            return chain.then(function() { return created; });
        });
    }

    return {
        getAll: getAll,
        getById: getById,
        save: save,
        remove: remove,
        newBlank: newBlank,
        createId: createId,
        replaceAll: replaceAll,
        mergeByUpdatedAt: mergeByUpdatedAt,
        importFromTrips: importFromTrips
    };
})();
