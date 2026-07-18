// =========================================================================
// SPECIMENRY — backup.js
// Backup reminders, fingerprint / "last backup OK" meta, and file save helpers.
// Loaded as a classic script before app.js (see index.html).
// =========================================================================
var SpecimenryBackup = (function() {
    var REMIND_AFTER_NEW = 10;
    var REMIND_AFTER_DAYS = 7;
    var DISMISS_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;
    var META_KEY = 'last_backup_meta';
    var ADDED_KEY = 'specimens_added_since_backup';
    var LAST_TS_KEY = 'last_backup';
    var DISMISS_KEY = 'backup_banner_dismissed_time';

    function simpleHash(str) {
        var h = 5381;
        var s = String(str || '');
        for (var i = 0; i < s.length; i++) {
            h = ((h << 5) + h) + s.charCodeAt(i);
            h = h | 0;
        }
        return (h >>> 0).toString(16);
    }

    function fingerprintLists(fossilsList, tripsList, localitiesList, groupsList) {
        var fIds = (fossilsList || []).map(function(f) { return f && f.id ? String(f.id) : ''; }).filter(Boolean).sort();
        var tIds = (tripsList || []).map(function(t) { return t && t.id ? String(t.id) : ''; }).filter(Boolean).sort();
        var lIds = (localitiesList || []).map(function(l) { return l && l.id ? String(l.id) : ''; }).filter(Boolean).sort();
        var gIds = (groupsList || []).map(function(g) { return g && g.id ? String(g.id) : ''; }).filter(Boolean).sort();
        return simpleHash(
            fIds.join('|') + '#' + tIds.join('|') + '#' + lIds.join('|') + '#' + gIds.join('|') + '#' +
            fIds.length + '#' + tIds.length + '#' + lIds.length + '#' + gIds.length
        );
    }

    function buildFilename() {
        var stamp = new Date();
        var y = stamp.getFullYear();
        var mo = stamp.getMonth() + 1;
        var da = stamp.getDate();
        var h = stamp.getHours();
        var mi = stamp.getMinutes();
        var p = function(n) { return (n < 10 ? '0' : '') + n; };
        return 'specimenry-backup-' + y + '-' + p(mo) + '-' + p(da) + '-' + p(h) + p(mi) + '.json';
    }

    function getAddedSince() {
        try {
            return parseInt(localStorage.getItem(ADDED_KEY) || '0', 10) || 0;
        } catch (e) {
            return 0;
        }
    }

    function setAddedSince(n) {
        try {
            localStorage.setItem(ADDED_KEY, String(Math.max(0, n | 0)));
        } catch (e) {}
    }

    function noteSpecimenAdded(fossil) {
        if (fossil && fossil.isCartItem) return getAddedSince();
        var n = getAddedSince() + 1;
        setAddedSince(n);
        return n;
    }

    function getMeta() {
        try {
            return JSON.parse(localStorage.getItem(META_KEY) || 'null');
        } catch (e) {
            return null;
        }
    }

    function recordSuccessfulBackup(info) {
        info = info || {};
        var meta = {
            ok: true,
            at: Date.now(),
            filename: info.filename || '',
            specimenCount: info.specimenCount || 0,
            tripCount: info.tripCount || 0,
            localityCount: info.localityCount || 0,
            groupCount: info.groupCount || 0,
            fingerprint: info.fingerprint || '',
            method: info.method || 'download',
            source: info.source || 'export'
        };
        try {
            localStorage.setItem(META_KEY, JSON.stringify(meta));
            localStorage.setItem(LAST_TS_KEY, String(meta.at));
            localStorage.setItem(ADDED_KEY, '0');
            localStorage.removeItem(DISMISS_KEY);
        } catch (e) {}
        return meta;
    }

    function evaluateNeed() {
        var lastTs = null;
        try { lastTs = localStorage.getItem(LAST_TS_KEY); } catch (e) {}
        var added = getAddedSince();
        var daysMs = REMIND_AFTER_DAYS * 24 * 60 * 60 * 1000;
        var staleByTime = !lastTs || (Date.now() - parseInt(lastTs, 10) > daysMs);
        var staleByCount = added >= REMIND_AFTER_NEW;
        var reasons = [];
        if (!lastTs) reasons.push('never');
        else if (staleByTime) reasons.push('days');
        if (staleByCount) reasons.push('new');
        return {
            needsBackup: staleByTime || staleByCount,
            reasons: reasons,
            addedSince: added,
            threshold: REMIND_AFTER_NEW,
            remindAfterDays: REMIND_AFTER_DAYS
        };
    }

    function wasRecentlyDismissed() {
        try {
            var t = localStorage.getItem(DISMISS_KEY);
            return !!(t && Date.now() - parseInt(t, 10) < DISMISS_COOLDOWN_MS);
        } catch (e) {
            return false;
        }
    }

    function reasonMessage(evalResult) {
        evalResult = evalResult || evaluateNeed();
        if (evalResult.reasons.indexOf('never') !== -1) {
            return 'No backup yet. Your data lives in this browser — download a backup (specimens + trips) before you clear site data or switch devices.';
        }
        var parts = [];
        if (evalResult.reasons.indexOf('new') !== -1) {
            parts.push('you added ' + evalResult.addedSince + '+ specimens since the last backup');
        }
        if (evalResult.reasons.indexOf('days') !== -1) {
            parts.push('it has been more than ' + REMIND_AFTER_DAYS + ' days');
        }
        return 'Time to back up — ' + parts.join(', and ') + '. Your data lives in this browser; export regularly.';
    }

    /**
     * Save a Blob to disk. Prefers the File System Access API (Downloads),
     * falls back to an <a download> click (browser Downloads folder).
     * Returns Promise<{ ok, cancelled?, method, filename }>.
     */
    function saveBlobToDownloads(blob, filename) {
        filename = filename || buildFilename();

        if (typeof window.showSaveFilePicker === 'function') {
            return window.showSaveFilePicker({
                suggestedName: filename,
                startIn: 'downloads',
                types: [{
                    description: 'Specimenry backup',
                    accept: { 'application/json': ['.json'] }
                }]
            }).then(function(handle) {
                return handle.createWritable().then(function(writable) {
                    return writable.write(blob).then(function() {
                        return writable.close();
                    });
                }).then(function() {
                    return { ok: true, method: 'picker', filename: filename };
                });
            }).catch(function(err) {
                if (err && err.name === 'AbortError') {
                    return { ok: false, cancelled: true, method: 'picker', filename: filename };
                }
                // Fall through to anchor download
                return saveBlobViaAnchor(blob, filename);
            });
        }

        return Promise.resolve(saveBlobViaAnchor(blob, filename));
    }

    function saveBlobViaAnchor(blob, filename) {
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
        return { ok: true, method: 'download', filename: filename };
    }

    function describeRestoreCheck(fossilsList, tripsList, fileName, localitiesList, groupsList) {
        var fp = fingerprintLists(fossilsList, tripsList, localitiesList, groupsList);
        var meta = getMeta();
        var lines = [];
        lines.push('Backup check: OK — readable Specimenry backup.');
        lines.push('File: ' + (fileName || 'backup.json'));
        lines.push(
            'Contents: ' + (fossilsList || []).length + ' specimen(s), ' +
            (tripsList || []).length + ' trip(s), ' +
            (localitiesList || []).length + ' site(s), ' +
            (groupsList || []).length + ' group(s).'
        );
        if (meta && meta.ok && meta.fingerprint) {
            if (meta.fingerprint === fp) {
                lines.push('Matches your last successful backup on this browser.');
            } else {
                var when = meta.at ? new Date(meta.at).toLocaleString() : 'unknown time';
                lines.push('Different from last backup here (' + (meta.specimenCount || 0) + ' specimens, ' + when + ').');
            }
        }
        return { fingerprint: fp, message: lines.join('\n'), matchesLast: !!(meta && meta.fingerprint === fp) };
    }

    return {
        REMIND_AFTER_NEW: REMIND_AFTER_NEW,
        REMIND_AFTER_DAYS: REMIND_AFTER_DAYS,
        fingerprintLists: fingerprintLists,
        buildFilename: buildFilename,
        getAddedSince: getAddedSince,
        noteSpecimenAdded: noteSpecimenAdded,
        getMeta: getMeta,
        recordSuccessfulBackup: recordSuccessfulBackup,
        evaluateNeed: evaluateNeed,
        wasRecentlyDismissed: wasRecentlyDismissed,
        reasonMessage: reasonMessage,
        saveBlobToDownloads: saveBlobToDownloads,
        describeRestoreCheck: describeRestoreCheck
    };
})();
