import { copyToClipboard, createResultItem } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-palette me-2"></i> Color Picker</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <div class="row g-3 align-items-end">
                <div class="col-auto">
                    <label for="color-input" class="form-label fw-bold">Couleur</label>
                    <input type="color" class="form-control form-control-color" id="color-input" value="#3498db" style="width:56px;height:38px;">
                </div>
                <div class="col">
                    <label for="color-hex-input" class="form-label fw-bold">Valeur HEX</label>
                    <input type="text" class="form-control font-monospace" id="color-hex-input" placeholder="#3498db" maxlength="7">
                </div>
            </div>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="color-results-block">
            <div id="color-results-inner"></div>
        </div>

    </div>
</div>
`;

export function init() {
    const colorInput    = document.getElementById('color-input');
    const colorHexInput = document.getElementById('color-hex-input');
    const resultsInner  = document.getElementById('color-results-inner');

    const widgets = {};

    function hexToRgb(hex) {
        return {
            r: parseInt(hex.slice(1, 3), 16),
            g: parseInt(hex.slice(3, 5), 16),
            b: parseInt(hex.slice(5, 7), 16)
        };
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function update(hex) {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const values = {
            'HEX': hex.toUpperCase(),
            'RGB': `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            'HSL': `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        };
        const icons = { 'HEX': 'fas fa-hashtag', 'RGB': 'fas fa-circle', 'HSL': 'fas fa-sliders-h' };

        if (Object.keys(widgets).length === 0) {
            resultsInner.innerHTML = '';
            ['HEX', 'RGB', 'HSL'].forEach(k => {
                const w = createResultItem(icons[k], k, values[k], 'info', `color-${k.toLowerCase()}.txt`);
                resultsInner.appendChild(w.el);
                widgets[k] = w;
            });
        } else {
            ['HEX', 'RGB', 'HSL'].forEach(k => { if (widgets[k]) widgets[k].pre.textContent = values[k]; });
        }
    }

    colorInput?.addEventListener('input', function() {
        colorHexInput.value = this.value;
        update(this.value);
    });

    colorHexInput?.addEventListener('input', function() {
        const val = this.value.trim();
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
            colorInput.value = val;
            update(val);
        }
    });

    colorHexInput.value = colorInput.value;
    update(colorInput.value);
}
