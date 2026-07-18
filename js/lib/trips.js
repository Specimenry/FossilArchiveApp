// =========================================================================
// SPECIMENRY — trips.js
// Field diary / trip log. Stored in IndexedDB object store "trips".
// Loaded as a classic script before app.js (see index.html).
// =========================================================================
var SpecimenryTrips = (function() {
    function withTripStore(mode, fn) {
        return initDB().then(function(db) {
            if (!db.objectStoreNames.contains('trips')) {
                return Promise.reject(new Error('Trips store not available — reload after update.'));
            }
            return new Promise(function(resolve, reject) {
                var tx = db.transaction('trips', mode);
                var store = tx.objectStore('trips');
                tx.onerror = function(e) { reject(e); };
                fn(store, resolve, reject);
            });
        });
    }

    function getAll() {
        return withTripStore('readonly', function(store, resolve, reject) {
            var req = store.getAll();
            req.onsuccess = function() {
                var list = req.result || [];
                list.sort(function(a, b) {
                    return String(b.date || '').localeCompare(String(a.date || '')) || (b.updatedAt || 0) - (a.updatedAt || 0);
                });
                resolve(list);
            };
            req.onerror = function() { reject(req.error); };
        });
    }

    function getById(id) {
        return withTripStore('readonly', function(store, resolve, reject) {
            var req = store.get(id);
            req.onsuccess = function() { resolve(req.result || null); };
            req.onerror = function() { reject(req.error); };
        });
    }

    function save(trip) {
        if (!trip || !trip.id) {
            return Promise.reject(new Error('Trip requires an id'));
        }
        trip.updatedAt = Date.now();
        if (!trip.createdAt) trip.createdAt = trip.updatedAt;
        if (!Array.isArray(trip.specimenIds)) trip.specimenIds = [];
        if (!Array.isArray(trip.photos)) trip.photos = [];
        return withTripStore('readwrite', function(store, resolve, reject) {
            var req = store.put(trip);
            req.onsuccess = function() { resolve(trip); };
            req.onerror = function() { reject(req.error); };
        });
    }

    function remove(id) {
        return withTripStore('readwrite', function(store, resolve, reject) {
            var req = store.delete(id);
            req.onsuccess = function() { resolve(); };
            req.onerror = function() { reject(req.error); };
        });
    }

    function createId() {
        return 'TRIP-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    }

    function newBlank() {
        var today = new Date();
        var y = today.getFullYear();
        var m = today.getMonth() + 1;
        var d = today.getDate();
        var iso = y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
        return {
            id: createId(),
            title: '',
            date: iso,
            localityId: '',
            locality: '',
            country: '',
            lat: null,
            lng: null,
            notes: '',
            photos: [],
            specimenIds: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
    }

    function linkSpecimen(tripId, specimenId) {
        return getById(tripId).then(function(trip) {
            if (!trip) throw new Error('Trip not found');
            if (trip.specimenIds.indexOf(specimenId) === -1) {
                trip.specimenIds.push(specimenId);
            }
            return save(trip);
        });
    }

    function unlinkSpecimen(tripId, specimenId) {
        return getById(tripId).then(function(trip) {
            if (!trip) return null;
            trip.specimenIds = (trip.specimenIds || []).filter(function(id) { return id !== specimenId; });
            return save(trip);
        });
    }

    function linkSpecimens(tripId, specimenIds) {
        return getById(tripId).then(function(trip) {
            if (!trip) throw new Error('Trip not found');
            var ids = specimenIds || [];
            ids.forEach(function(specimenId) {
                if (specimenId && trip.specimenIds.indexOf(specimenId) === -1) {
                    trip.specimenIds.push(specimenId);
                }
            });
            return save(trip);
        });
    }

    function replaceAll(tripsList) {
        return initDB().then(function(db) {
            if (!db.objectStoreNames.contains('trips')) {
                return Promise.resolve();
            }
            return new Promise(function(resolve, reject) {
                var tx = db.transaction('trips', 'readwrite');
                var store = tx.objectStore('trips');
                tx.onerror = function(e) { reject(e); };
                tx.oncomplete = function() { resolve(); };
                store.clear();
                (tripsList || []).forEach(function(t) {
                    if (t && t.id) store.put(t);
                });
            });
        });
    }

    /** Last-write-wins merge by updatedAt (used by Drive / P2P sync). */
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

    return {
        getAll: getAll,
        getById: getById,
        save: save,
        remove: remove,
        newBlank: newBlank,
        createId: createId,
        linkSpecimen: linkSpecimen,
        linkSpecimens: linkSpecimens,
        unlinkSpecimen: unlinkSpecimen,
        replaceAll: replaceAll,
        mergeByUpdatedAt: mergeByUpdatedAt
    };
})();
