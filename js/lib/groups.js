// =========================================================================
// SPECIMENRY — groups.js
// Lots / groups of specimens (ex-collections, fair purchases, same matrix).
// Stored in IndexedDB object store "groups".
// =========================================================================
var SpecimenryGroups = (function() {
    function withGroupStore(mode, fn) {
        return initDB().then(function(db) {
            if (!db.objectStoreNames.contains('groups')) {
                return Promise.reject(new Error('Groups store not available — reload after update.'));
            }
            return new Promise(function(resolve, reject) {
                var tx = db.transaction('groups', mode);
                var store = tx.objectStore('groups');
                tx.onerror = function(e) { reject(e); };
                fn(store, resolve, reject);
            });
        });
    }

    function getAll() {
        return withGroupStore('readonly', function(store, resolve, reject) {
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
        return withGroupStore('readonly', function(store, resolve, reject) {
            var req = store.get(id);
            req.onsuccess = function() { resolve(req.result || null); };
            req.onerror = function() { reject(req.error); };
        });
    }

    function save(group) {
        if (!group || !group.id) {
            return Promise.reject(new Error('Group requires an id'));
        }
        group.updatedAt = Date.now();
        if (!group.createdAt) group.createdAt = group.updatedAt;
        if (!Array.isArray(group.specimenIds)) group.specimenIds = [];
        return withGroupStore('readwrite', function(store, resolve, reject) {
            var req = store.put(group);
            req.onsuccess = function() { resolve(group); };
            req.onerror = function() { reject(req.error); };
        });
    }

    function remove(id) {
        return withGroupStore('readwrite', function(store, resolve, reject) {
            var req = store.delete(id);
            req.onsuccess = function() { resolve(); };
            req.onerror = function() { reject(req.error); };
        });
    }

    function createId() {
        return 'GRP-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    }

    function newBlank() {
        return {
            id: createId(),
            name: '',
            notes: '',
            source: '',
            acquiredDate: '',
            price: null,
            currency: 'USD',
            specimenIds: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
    }

    function linkSpecimen(groupId, specimenId) {
        return getById(groupId).then(function(group) {
            if (!group) throw new Error('Group not found');
            if (group.specimenIds.indexOf(specimenId) === -1) {
                group.specimenIds.push(specimenId);
            }
            return save(group);
        });
    }

    function linkSpecimens(groupId, specimenIds) {
        return getById(groupId).then(function(group) {
            if (!group) throw new Error('Group not found');
            (specimenIds || []).forEach(function(specimenId) {
                if (specimenId && group.specimenIds.indexOf(specimenId) === -1) {
                    group.specimenIds.push(specimenId);
                }
            });
            return save(group);
        });
    }

    function unlinkSpecimen(groupId, specimenId) {
        return getById(groupId).then(function(group) {
            if (!group) return null;
            group.specimenIds = (group.specimenIds || []).filter(function(id) { return id !== specimenId; });
            return save(group);
        });
    }

    function replaceAll(list) {
        return initDB().then(function(db) {
            if (!db.objectStoreNames.contains('groups')) {
                return Promise.resolve();
            }
            return new Promise(function(resolve, reject) {
                var tx = db.transaction('groups', 'readwrite');
                var store = tx.objectStore('groups');
                tx.onerror = function(e) { reject(e); };
                tx.oncomplete = function() { resolve(); };
                store.clear();
                (list || []).forEach(function(g) {
                    if (g && g.id) store.put(g);
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
