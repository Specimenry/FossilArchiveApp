// =========================================================================
// SPECIMENRY — export-zip.js
// Portable ZIP export: collection.csv + photos/ (and videos/).
// Requires JSZip (loaded via CDN before this script).
// =========================================================================
var SpecimenryExportZip = (function() {
    var CSV_HEADERS = [
        'Id', 'Specimen Name', 'Type', 'Category', 'Geological Period', 'Epoch', 'Stage',
        'Formula', 'Crystal System', 'Hardness', 'Luster', 'Streak', 'Cleavage', 'Color',
        'Anatomy', 'Fossil Type', 'Formation', 'Location', 'Country', 'Latitude', 'Longitude',
        'Size', 'Size Unit', 'Weight', 'Price', 'Currency', 'Notes',
        'Is Wishlist', 'Is Sold', 'Is For Sale', 'Is Dream', 'Is Traded', 'Is Self Found',
        'Trip Id', 'Locality Id', 'Photo Files'
    ];

    function csvEscape(val) {
        var s = val == null ? '' : String(val);
        if (/[",\n\r]/.test(s)) {
            return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
    }

    function safeId(id) {
        return String(id || 'unknown').replace(/[^\w\-]+/g, '_').slice(0, 64);
    }

    function extForDataUrl(dataUrl) {
        if (!dataUrl || typeof dataUrl !== 'string') return 'bin';
        if (dataUrl.indexOf('data:video/webm') === 0) return 'webm';
        if (dataUrl.indexOf('data:video/mp4') === 0 || dataUrl.indexOf('data:video/quicktime') === 0) return 'mp4';
        if (dataUrl.indexOf('data:image/png') === 0) return 'png';
        if (dataUrl.indexOf('data:image/webp') === 0) return 'webp';
        if (dataUrl.indexOf('data:image/gif') === 0) return 'gif';
        if (dataUrl.indexOf('data:video/') === 0) return 'mp4';
        return 'jpg';
    }

    function dataUrlToUint8Array(dataUrl) {
        var comma = dataUrl.indexOf(',');
        if (comma === -1) return null;
        var meta = dataUrl.slice(0, comma);
        var payload = dataUrl.slice(comma + 1);
        try {
            var bin = meta.indexOf(';base64') !== -1
                ? atob(payload)
                : decodeURIComponent(payload);
            var arr = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
            return arr;
        } catch (e) {
            return null;
        }
    }

    function buildCsvRow(f, photoFiles) {
        return [
            f.id || '',
            f.specimen || '',
            f.type || 'fossil',
            f.category || '',
            f.geologicalPeriod || '',
            f.epoch || '',
            f.stratAge || '',
            f.formula || '',
            f.crystalSystem || '',
            f.hardness != null ? f.hardness : '',
            f.luster || '',
            f.streak || '',
            f.cleavage || '',
            f.color || '',
            f.anatomy || '',
            f.fossilType || '',
            f.formation || '',
            f.location || '',
            f.country || '',
            f.lat != null ? f.lat : '',
            f.lng != null ? f.lng : '',
            f.size != null ? f.size : '',
            f.sizeUnit || '',
            f.weight != null ? f.weight : '',
            f.price != null ? f.price : '',
            f.currency || '',
            f.notes || '',
            f.isWishlist ? 'true' : 'false',
            f.isSold ? 'true' : 'false',
            f.isForSale ? 'true' : 'false',
            f.isDream ? 'true' : 'false',
            f.isTraded ? 'true' : 'false',
            f.isSelfFound ? 'true' : 'false',
            f.tripId || '',
            f.localityId || '',
            (photoFiles || []).join('; ')
        ].map(csvEscape).join(',');
    }

    function buildCsv(fossilsList) {
        var lines = [CSV_HEADERS.join(',')];
        (fossilsList || []).forEach(function(f) {
            if (!f || f.isCartItem) return;
            var files = [];
            var images = f.images || [];
            for (var i = 0; i < images.length; i++) {
                var src = images[i];
                if (typeof src !== 'string') {
                    src = (src && (src.data || src.url || src.src)) || '';
                }
                if (!src) continue;
                var n = String(i + 1);
                if (n.length < 2) n = '0' + n;
                var folder = src.indexOf('data:video/') === 0 ? 'videos' : 'photos';
                files.push(folder + '/' + safeId(f.id) + '_' + n + '.' + extForDataUrl(src));
            }
            lines.push(buildCsvRow(f, files));
        });
        return lines.join('\n');
    }

    function buildFilename() {
        var d = new Date();
        var p = function(n) { return (n < 10 ? '0' : '') + n; };
        return 'specimenry-export-' + d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + '.zip';
    }

    /**
     * Build and download a ZIP with collection.csv + media files.
     * @param {Array} fossilsList
     * @param {{ onProgress?: function(done, total, label) }} options
     */
    function exportArchive(fossilsList, options) {
        options = options || {};
        if (typeof JSZip === 'undefined') {
            return Promise.reject(new Error('JSZip is not loaded'));
        }

        var list = (fossilsList || []).filter(function(f) { return f && !f.isCartItem; });
        if (!list.length) {
            return Promise.reject(new Error('No specimens to export'));
        }

        var zip = new JSZip();
        var csv = buildCsv(list);
        zip.file('collection.csv', csv);
        zip.file('README.txt',
            'Specimenry portable export\n' +
            '-------------------------\n' +
            'collection.csv — spreadsheet of your specimens (re-importable fields).\n' +
            'photos/ and videos/ — media referenced by the Photo Files column.\n' +
            'This is not a full JSON backup (trips, localities, change logs).\n' +
            'For a complete restore use Database → Backup & Restore.\n' +
            'Exported: ' + new Date().toISOString() + '\n'
        );

        var mediaJobs = [];
        list.forEach(function(f) {
            var images = f.images || [];
            for (var i = 0; i < images.length; i++) {
                var src = images[i];
                if (typeof src !== 'string') {
                    src = (src && (src.data || src.url || src.src)) || '';
                }
                if (!src || src.indexOf('data:') !== 0) continue;
                var n = String(i + 1);
                if (n.length < 2) n = '0' + n;
                var isVid = src.indexOf('data:video/') === 0;
                var folder = isVid ? 'videos' : 'photos';
                var path = folder + '/' + safeId(f.id) + '_' + n + '.' + extForDataUrl(src);
                mediaJobs.push({ path: path, src: src, label: f.specimen || f.id });
            }
        });

        var done = 0;
        var total = mediaJobs.length;
        if (typeof options.onProgress === 'function') {
            options.onProgress(0, total, 'Preparing…');
        }

        mediaJobs.forEach(function(job) {
            var bytes = dataUrlToUint8Array(job.src);
            if (bytes) {
                zip.file(job.path, bytes);
            }
            done++;
            if (typeof options.onProgress === 'function' && (done % 5 === 0 || done === total)) {
                options.onProgress(done, total, job.label);
            }
        });

        var filename = buildFilename();
        return zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
            .then(function(blob) {
                var savePromise = (typeof SpecimenryBackup !== 'undefined' && SpecimenryBackup.saveBlobToDownloads)
                    ? SpecimenryBackup.saveBlobToDownloads(blob, filename)
                    : Promise.resolve((function() {
                        var url = URL.createObjectURL(blob);
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        a.rel = 'noopener';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
                        return { ok: true, method: 'download', filename: filename };
                    })());

                return savePromise.then(function(result) {
                    return {
                        ok: !!(result && result.ok),
                        cancelled: !!(result && result.cancelled),
                        filename: (result && result.filename) || filename,
                        specimenCount: list.length,
                        mediaCount: total,
                        method: result && result.method
                    };
                });
            });
    }

    return {
        CSV_HEADERS: CSV_HEADERS,
        buildCsv: buildCsv,
        exportArchive: exportArchive,
        buildFilename: buildFilename
    };
})();
