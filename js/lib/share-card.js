// =========================================================================
// SPECIMENRY — share-card.js
// One-tap social share card (PNG). Public fields only — never prices.
// Loaded as a classic script before app.js (see index.html).
// =========================================================================
var SpecimenryShareCard = (function() {
    var W = 1080;
    var H = 1350;

    function firstImageSrc(f) {
        if (!f || !f.images || !f.images.length) return '';
        var img = f.images[0];
        if (typeof img === 'string') return img;
        if (img && img.data) return img.data;
        if (img && img.url) return img.url;
        if (img && img.src) return img.src;
        return '';
    }

    function loadImage(src) {
        return new Promise(function(resolve) {
            if (!src) {
                resolve(null);
                return;
            }
            var img = new Image();
            img.onload = function() { resolve(img); };
            img.onerror = function() { resolve(null); };
            img.src = src;
        });
    }

    function wrapText(ctx, text, maxWidth) {
        var words = String(text || '').split(/\s+/).filter(Boolean);
        if (!words.length) return [];
        var lines = [];
        var line = words[0];
        for (var i = 1; i < words.length; i++) {
            var test = line + ' ' + words[i];
            if (ctx.measureText(test).width <= maxWidth) {
                line = test;
            } else {
                lines.push(line);
                line = words[i];
            }
        }
        lines.push(line);
        return lines;
    }

    function drawCover(ctx, img, x, y, w, h) {
        if (!img) {
            ctx.fillStyle = '#2c2418';
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.font = '600 36px Georgia, "Times New Roman", serif';
            ctx.textAlign = 'center';
            ctx.fillText('No photo', x + w / 2, y + h / 2);
            ctx.textAlign = 'left';
            return;
        }
        var scale = Math.max(w / img.width, h / img.height);
        var dw = img.width * scale;
        var dh = img.height * scale;
        var dx = x + (w - dw) / 2;
        var dy = y + (h - dh) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
    }

    function renderToCanvas(fossil) {
        var f = fossil || {};
        return loadImage(firstImageSrc(f)).then(function(img) {
            var canvas = document.createElement('canvas');
            canvas.width = W;
            canvas.height = H;
            var ctx = canvas.getContext('2d');

            // Atmosphere background
            var bg = ctx.createLinearGradient(0, 0, 0, H);
            bg.addColorStop(0, '#1a1612');
            bg.addColorStop(1, '#0f0d0b');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            var pad = 48;
            var photoH = 820;
            drawCover(ctx, img, pad, pad, W - pad * 2, photoH);

            // Soft fade under photo into text panel
            var fade = ctx.createLinearGradient(0, pad + photoH - 80, 0, pad + photoH);
            fade.addColorStop(0, 'rgba(15,13,11,0)');
            fade.addColorStop(1, 'rgba(15,13,11,0.85)');
            ctx.fillStyle = fade;
            ctx.fillRect(pad, pad + photoH - 80, W - pad * 2, 80);

            var textY = pad + photoH + 56;
            var maxTextW = W - pad * 2;

            var name = f.specimen || 'Untitled specimen';
            ctx.fillStyle = '#f3ebe0';
            ctx.font = '700 54px Georgia, "Times New Roman", serif';
            var nameLines = wrapText(ctx, name, maxTextW).slice(0, 3);
            nameLines.forEach(function(line, i) {
                ctx.fillText(line, pad, textY + i * 62);
            });
            textY += nameLines.length * 62 + 18;

            var periodBits = [];
            if (f.geologicalPeriod) periodBits.push(f.geologicalPeriod);
            if (f.epoch) periodBits.push(f.epoch);
            if (f.stratAge) periodBits.push(f.stratAge);
            var period = periodBits.join(' · ') || (f.type === 'mineral' ? (f.formula || 'Mineral') : '');
            if (period) {
                ctx.fillStyle = '#c4a574';
                ctx.font = '600 28px system-ui, -apple-system, sans-serif';
                ctx.fillText(period, pad, textY);
                textY += 42;
            }

            var placeBits = [];
            if (f.location) placeBits.push(f.location);
            if (f.country) placeBits.push(f.country);
            var place = placeBits.join(' · ');
            if (place) {
                ctx.fillStyle = 'rgba(243,235,224,0.72)';
                ctx.font = '400 26px system-ui, -apple-system, sans-serif';
                var placeLines = wrapText(ctx, place, maxTextW).slice(0, 2);
                placeLines.forEach(function(line, i) {
                    ctx.fillText(line, pad, textY + i * 34);
                });
            }

            ctx.fillStyle = 'rgba(243,235,224,0.45)';
            ctx.font = '600 22px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('Specimenry', W - pad, H - 40);
            ctx.textAlign = 'left';

            return canvas;
        });
    }

    function toBlob(canvas, type, quality) {
        return new Promise(function(resolve) {
            if (canvas.toBlob) {
                canvas.toBlob(function(blob) { resolve(blob); }, type || 'image/png', quality);
            } else {
                var dataUrl = canvas.toDataURL(type || 'image/png', quality);
                var parts = dataUrl.split(',');
                var bin = atob(parts[1] || '');
                var arr = new Uint8Array(bin.length);
                for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
                resolve(new Blob([arr], { type: type || 'image/png' }));
            }
        });
    }

    function safeFilename(fossil) {
        var base = String((fossil && fossil.specimen) || 'specimen')
            .replace(/[^\w\-]+/g, '_')
            .replace(/_+/g, '_')
            .slice(0, 48) || 'specimen';
        return 'specimenry-' + base + '.png';
    }

    function download(fossil) {
        return renderToCanvas(fossil).then(function(canvas) {
            return toBlob(canvas, 'image/png').then(function(blob) {
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = safeFilename(fossil);
                a.rel = 'noopener';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
                return { ok: true, method: 'download', blob: blob };
            });
        });
    }

    function share(fossil) {
        return renderToCanvas(fossil).then(function(canvas) {
            return toBlob(canvas, 'image/png').then(function(blob) {
                var file = new File([blob], safeFilename(fossil), { type: 'image/png' });
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    return navigator.share({
                        files: [file],
                        title: fossil.specimen || 'Specimen',
                        text: [fossil.geologicalPeriod, fossil.location, fossil.country].filter(Boolean).join(' · ')
                    }).then(function() {
                        return { ok: true, method: 'share' };
                    });
                }
                // Fallback: download
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = safeFilename(fossil);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
                return { ok: true, method: 'download' };
            });
        });
    }

    return {
        renderToCanvas: renderToCanvas,
        download: download,
        share: share
    };
})();
