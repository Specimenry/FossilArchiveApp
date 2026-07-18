/* Lightweight browser tests — no build step */
(function() {
    var resultsEl = document.getElementById('results');
    var summaryEl = document.getElementById('summary');
    var passed = 0;
    var failed = 0;

    function assert(name, cond, detail) {
        var ok = !!cond;
        var line = document.createElement('div');
        line.className = ok ? 'pass' : 'fail';
        line.textContent = (ok ? '✓ ' : '✗ ') + name + (detail && !ok ? ' — ' + detail : '');
        resultsEl.appendChild(line);
        if (ok) passed++; else failed++;
    }

    function assertEq(name, actual, expected) {
        var ok = actual === expected;
        assert(name, ok, 'expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
    }

    // --- Formula parser ---
    (function() {
        var pyrite = parseChemicalFormula('FeS2');
        assert('parse FeS2 has Fe', pyrite && pyrite.Fe === 1);
        assert('parse FeS2 has S2', pyrite && pyrite.S === 2);

        var hydrate = parseChemicalFormula('CuSO4·5H2O');
        assert('parse hydrate Cu', hydrate && hydrate.Cu === 1);
        assert('parse hydrate O from sulfate+water', hydrate && hydrate.O >= 5);

        var analysis = analyzeMineralCare('HgS', 'Cinnabar');
        assert('cinnabar analysis has hazard alerts', analysis && analysis.alerts && analysis.alerts.length > 0);

        var empty = parseChemicalFormula('');
        assert('empty formula returns null/empty', !empty || Object.keys(empty).length === 0);
    })();

    // --- Provenance restriction matching ---
    (function() {
        var china = analyzeProvenanceRestrictions('China', '', '');
        assert('China matches restriction', china.length >= 1);
        assert('China is danger-level', china[0].level === 'danger');

        var mongolia = analyzeProvenanceRestrictions('', 'Gobi Desert, Mongolia', '');
        assert('Mongolia in location matches', mongolia.length >= 1);

        var park = analyzeProvenanceRestrictions('', 'Near UNESCO World Heritage site', '');
        assert('Protected site cue matches', park.length >= 1);

        var sweden = analyzeProvenanceRestrictions('Sweden', 'Gotland', 'Hemse');
        assert('Sweden has no restriction alert', sweden.length === 0);

        var html = renderProvenanceRestrictionHtml(china);
        assert('restriction HTML is compact non-empty', typeof html === 'string' && html.indexOf('provenance-alert') !== -1);
        assert('restriction HTML has no long USA disclaimer', html.toLowerCase().indexOf('prpa') === -1);
    })();

    // --- JSON import / export helpers ---
    (function() {
        var sample = [
            { id: 'CAT-1', specimen: 'Megalodon', country: 'USA', tags: ['shark'] },
            { id: 'CAT-2', specimen: 'Amethyst', country: 'Brazil', tags: ['quartz'] }
        ];
        var json = serializeFossilsBackup(sample);
        assert('serialize returns string', typeof json === 'string' && json.indexOf('Megalodon') !== -1);

        var roundtrip = parseFossilsBackup(json);
        assert('parse ok', roundtrip.ok === true);
        assertEq('parse count', roundtrip.fossils.length, 2);
        assertEq('parse specimen', roundtrip.fossils[0].specimen, 'Megalodon');

        var wrapped = parseFossilsBackup(JSON.stringify({ fossils: sample }));
        assert('accepts { fossils: [] } wrapper', wrapped.ok && wrapped.fossils.length === 2);

        var withTrips = parseFossilsBackup(JSON.stringify({
            format: 'specimenry-backup',
            version: 2,
            fossils: sample,
            trips: [{ id: 'trip1', title: 'Kem Kem' }]
        }));
        assert('accepts trips in backup', withTrips.ok && withTrips.trips && withTrips.trips.length === 1);

        var full = serializeFullBackup(sample, [{ id: 't1', title: 'Field day' }], [{ id: 'l1', name: 'Kem Kem' }]);
        assert('serializeFullBackup includes trips', typeof full === 'string' && full.indexOf('Field day') !== -1 && full.indexOf('specimenry-backup') !== -1);
        assert('serializeFullBackup includes localities', full.indexOf('Kem Kem') !== -1 && full.indexOf('"localities"') !== -1);

        var withLoc = parseFossilsBackup(JSON.stringify({
            format: 'specimenry-backup',
            fossils: sample,
            trips: [],
            localities: [{ id: 'loc1', name: 'Lyme Regis' }]
        }));
        assert('accepts localities in backup', withLoc.ok && withLoc.localities && withLoc.localities.length === 1);

        var bad = parseFossilsBackup('{ "not": "an array" }');
        assert('rejects non-array', bad.ok === false && !!bad.error);

        var broken = parseFossilsBackup('{ invalid');
        assert('rejects invalid JSON', broken.ok === false);

        if (typeof escapeHtml === 'function') {
            assert('escapeHtml escapes quotes', escapeHtml('"x"') === '&quot;x&quot;');
            assert('escapeHtml escapes angle', escapeHtml('<script>') === '&lt;script&gt;');
        }
    })();

    // --- Shareable catalog privacy ---
    (function() {
        if (typeof SpecimenryShareCatalog === 'undefined') {
            assert('SpecimenryShareCatalog loaded', false);
            return;
        }
        var dirty = {
            id: 'X1',
            specimen: 'T. rex',
            country: 'USA',
            price: 9999,
            purchasePrice: 100,
            salePrice: 200,
            storageRoom: 'Vault',
            storageDrawer: 'D1',
            seller: 'Secret Dealer',
            provenanceDocs: [{ name: 'permit.pdf' }],
            notes: 'Private note',
            images: ['data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='],
            isWishlist: false,
            isSold: false,
            isForSale: false,
            isDream: false,
            isCartItem: false
        };
        var pub = SpecimenryShareCatalog.pickPublicSpecimen(dirty, { includeNotes: false, includePhotos: true });
        assert('public catalog keeps specimen name', pub && pub.specimen === 'T. rex');
        assert('public catalog strips price', pub && pub.price == null);
        assert('public catalog strips storage', pub && pub.storageDrawer == null && pub.storageRoom == null);
        assert('public catalog strips seller', pub && pub.seller == null);
        assert('public catalog strips provenance docs', pub && pub.provenanceDocs == null);
        assert('public catalog omits notes by default', pub && !pub.notes);
        assert('public catalog can include photo', pub && pub.images && pub.images.length === 1);

        var payload = SpecimenryShareCatalog.buildPayload([dirty], { title: 'Test', includePhotos: false });
        assert('payload marks privacy', payload.privacy && payload.privacy.pricesExcluded === true);
        assertEq('payload count', payload.count, 1);
        var html = SpecimenryShareCatalog.renderHtml(payload);
        assert('html is shareable document', html.indexOf('Read-only') !== -1 && html.indexOf('T. rex') !== -1);
        assert('html does not contain price', html.indexOf('9999') === -1);
    })();

    // --- Share card (no prices in canvas pipeline inputs) ---
    (function() {
        if (typeof SpecimenryShareCard === 'undefined') {
            assert('SpecimenryShareCard loaded', false);
            return;
        }
        assert('share card API has share', typeof SpecimenryShareCard.share === 'function');
        assert('share card API has download', typeof SpecimenryShareCard.download === 'function');
        assert('share card API has renderToCanvas', typeof SpecimenryShareCard.renderToCanvas === 'function');
    })();

    // --- ZIP / CSV export helpers ---
    (function() {
        if (typeof SpecimenryExportZip === 'undefined') {
            assert('SpecimenryExportZip loaded', false);
            return;
        }
        var csv = SpecimenryExportZip.buildCsv([{
            id: 'S1',
            specimen: 'T. rex',
            type: 'fossil',
            country: 'USA',
            notes: 'Has, comma',
            images: ['data:image/jpeg;base64,/9j/4AAQ'],
            isCartItem: false
        }, {
            id: 'CART',
            specimen: 'skip',
            isCartItem: true,
            images: []
        }]);
        assert('csv has header', csv.indexOf('Specimen Name') !== -1);
        assert('csv includes specimen', csv.indexOf('T. rex') !== -1);
        assert('csv escapes commas', csv.indexOf('"Has, comma"') !== -1);
        assert('csv skips cart items', csv.indexOf('skip') === -1);
        assert('csv references photo path', csv.indexOf('photos/S1_01.jpg') !== -1);
    })();

    // --- Backup reminders / fingerprint ---
    (function() {
        if (typeof SpecimenryBackup === 'undefined') {
            assert('SpecimenryBackup loaded', false);
            return;
        }
        var fp1 = SpecimenryBackup.fingerprintLists(
            [{ id: 'A' }, { id: 'B' }],
            [{ id: 'T1' }]
        );
        var fp2 = SpecimenryBackup.fingerprintLists(
            [{ id: 'B' }, { id: 'A' }],
            [{ id: 'T1' }]
        );
        var fp3 = SpecimenryBackup.fingerprintLists([{ id: 'A' }], [{ id: 'T1' }]);
        assert('fingerprint stable regardless of order', fp1 === fp2);
        assert('fingerprint changes when ids change', fp1 !== fp3);

        var check = SpecimenryBackup.describeRestoreCheck(
            [{ id: 'A', specimen: 'X' }],
            [],
            'test.json'
        );
        assert('restore check message mentions OK', check.message.indexOf('Backup check: OK') !== -1);
        assert('restore check has fingerprint', !!check.fingerprint);

        assert('remind-after-new default is 10', SpecimenryBackup.REMIND_AFTER_NEW === 10);
        assert('filename looks dated', /specimenry-backup-\d{4}-\d{2}-\d{2}-\d{4}\.json/.test(SpecimenryBackup.buildFilename()));
    })();

    summaryEl.textContent = passed + ' passed, ' + failed + ' failed';
    summaryEl.className = failed ? 'fail' : 'pass';
    if (failed) {
        document.title = 'FAIL — Specimenry tests';
    } else {
        document.title = 'PASS — Specimenry tests';
    }
})();
