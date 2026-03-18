import { createResultItem } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-network-wired me-2"></i> IPv4 Subnet Calculator</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="ip-address" class="form-label fw-bold">Adresse IP <span class="text-danger">*</span></label>
                    <input type="text" class="form-control font-monospace" id="ip-address" placeholder="192.168.1.0">
                </div>
                <div class="col-md-6">
                    <label for="subnet-mask" class="form-label fw-bold">Masque / CIDR <span class="text-danger">*</span></label>
                    <input type="text" class="form-control font-monospace" id="subnet-mask" placeholder="255.255.255.0 ou /24">
                </div>
            </div>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-custom-primary" id="calculate-subnet">
                    <i class="fas fa-calculator me-2"></i> Calculer
                </button>
                <button class="btn btn-outline-secondary" id="subnet-clear-btn">
                    <i class="fas fa-times me-2"></i> Effacer
                </button>
            </div>
            <div id="subnet-error" class="alert alert-danger mt-3 d-none"></div>
        </div>

        <!-- ── Block 2 : Linux command ──────────────────────────────────── -->
        <div class="cmd-block">
            <div class="cmd-block-inner">
                <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                <pre id="subnet-cmd">ipcalc 192.168.1.0/24</pre>
            </div>
            <button class="btn btn-sm btn-outline-warning" id="copy-subnet-cmd" title="Copier la commande">
                <i class="fas fa-copy"></i>
            </button>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="subnet-results-block" style="display:none;">
            <div id="subnet-results-inner"></div>
        </div>

    </div>
</div>
`;

export function init() {
    const ipInput         = document.getElementById('ip-address');
    const maskInput       = document.getElementById('subnet-mask');
    const calcBtn         = document.getElementById('calculate-subnet');
    const clearBtn        = document.getElementById('subnet-clear-btn');
    const subnetError     = document.getElementById('subnet-error');
    const subnetCmd       = document.getElementById('subnet-cmd');
    const resultsBlock    = document.getElementById('subnet-results-block');
    const resultsInner    = document.getElementById('subnet-results-inner');

    const widgets = {};

    function showError(msg) {
        subnetError.textContent = msg;
        subnetError.classList.remove('d-none');
    }

    function cidrToMask(cidr) {
        const mask = (0xffffffff << (32 - cidr)) >>> 0;
        return [(mask >>> 24) & 0xff, (mask >>> 16) & 0xff, (mask >>> 8) & 0xff, mask & 0xff].join('.');
    }

    function maskToCidr(mask) {
        return mask.split('.').map(Number).reduce((acc, o) => acc + o.toString(2).split('1').length - 1, 0);
    }

    function updateCmd() {
        const ip   = ipInput.value.trim() || '192.168.1.0';
        const mask = maskInput.value.trim() || '/24';
        const cidr = mask.startsWith('/') ? mask : '/' + maskToCidr(mask);
        if (subnetCmd) subnetCmd.textContent = `ipcalc ${ip}${cidr}`;
    }

    calcBtn?.addEventListener('click', function() {
        subnetError.classList.add('d-none');
        const ipAddress  = ipInput.value.trim();
        const subnetMask = maskInput.value.trim();

        if (!ipAddress) { showError('Veuillez entrer une adresse IP.'); return; }
        if (!subnetMask) { showError('Veuillez entrer un masque ou un préfixe CIDR.'); return; }

        const ipOcts = ipAddress.split('.').map(Number);
        if (ipOcts.length !== 4 || ipOcts.some(o => isNaN(o) || o < 0 || o > 255)) {
            showError('Adresse IP invalide.'); return;
        }

        let cidr, smOcts;
        if (subnetMask.startsWith('/')) {
            cidr   = parseInt(subnetMask.slice(1));
            smOcts = cidrToMask(cidr).split('.').map(Number);
        } else {
            smOcts = subnetMask.split('.').map(Number);
            if (smOcts.length !== 4 || smOcts.some(o => isNaN(o))) { showError('Masque invalide.'); return; }
            cidr = maskToCidr(subnetMask);
        }

        if (cidr < 0 || cidr > 32) { showError('Préfixe CIDR invalide (0–32).'); return; }

        const network  = ipOcts.map((o, i) => o & smOcts[i]).join('.');
        const bcast    = ipOcts.map((o, i) => o | (~smOcts[i] & 0xff)).join('.');
        const first    = network.split('.').map((o, i) => i === 3 ? +o + 1 : +o).join('.');
        const last     = bcast.split('.').map((o, i) => i === 3 ? +o - 1 : +o).join('.');
        const total    = Math.pow(2, 32 - cidr) - 2;

        const values = {
            'Adresse IP':        ipAddress,
            'Masque':            `${cidrToMask(cidr)} (/${cidr})`,
            'Adresse réseau':    network,
            'Broadcast':         bcast,
            'Première adresse':  cidr < 31 ? first : '—',
            'Dernière adresse':  cidr < 31 ? last  : '—',
            'Hôtes disponibles': cidr < 31 ? String(total) : (cidr === 31 ? '2 (point-à-point)' : '1'),
        };
        const icons = {
            'Adresse IP':        'fas fa-map-pin',
            'Masque':            'fas fa-filter',
            'Adresse réseau':    'fas fa-network-wired',
            'Broadcast':         'fas fa-broadcast-tower',
            'Première adresse':  'fas fa-arrow-right',
            'Dernière adresse':  'fas fa-arrow-left',
            'Hôtes disponibles': 'fas fa-server',
        };

        const needRebuild = Object.keys(widgets).length === 0;
        if (needRebuild) {
            resultsInner.innerHTML = '';
            Object.keys(values).forEach(k => {
                const w = createResultItem(icons[k], k, values[k], 'info', null);
                resultsInner.appendChild(w.el);
                widgets[k] = w;
            });
        } else {
            Object.keys(values).forEach(k => { if (widgets[k]) widgets[k].pre.textContent = values[k]; });
        }

        resultsBlock.style.display = '';
        updateCmd();
    });

    clearBtn?.addEventListener('click', function() {
        ipInput.value   = '';
        maskInput.value = '';
        subnetError.classList.add('d-none');
        resultsBlock.style.display = 'none';
        resultsInner.innerHTML = '';
        Object.keys(widgets).forEach(k => delete widgets[k]);
        updateCmd();
    });

    document.getElementById('copy-subnet-cmd')?.addEventListener('click', function() {
        navigator.clipboard.writeText(subnetCmd.textContent).then(() => {
            const orig = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => { this.innerHTML = orig; }, 1500);
        });
    });

    ipInput?.addEventListener('input', updateCmd);
    maskInput?.addEventListener('input', updateCmd);
    updateCmd();
}
