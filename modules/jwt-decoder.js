import { copyToClipboard, createResultItem } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-id-card me-2"></i> JWT Decoder</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <div class="mb-3">
                <label for="jwt-input" class="form-label fw-bold">Token JWT <span class="text-danger">*</span></label>
                <textarea class="form-control font-monospace" id="jwt-input" rows="4" placeholder="Collez votre JWT ici… (eyJ...)"></textarea>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-custom-primary" id="jwt-decode-btn">
                    <i class="fas fa-unlock me-2"></i> Décoder
                </button>
                <button class="btn btn-outline-secondary" id="jwt-clear-btn">
                    <i class="fas fa-times me-2"></i> Effacer
                </button>
            </div>
            <div id="jwt-error" class="alert alert-danger mt-3 d-none"></div>
        </div>

        <!-- ── Block 2 : Linux command ──────────────────────────────────── -->
        <div class="cmd-block">
            <div class="cmd-block-inner">
                <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux — décoder le payload</div>
                <pre id="jwtd-cmd">echo "TOKEN" | cut -d. -f2 | base64 -d 2>/dev/null</pre>
            </div>
            <button class="btn btn-sm btn-outline-warning" id="copy-jwtd-cmd" title="Copier la commande">
                <i class="fas fa-copy"></i>
            </button>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="jwt-results-block" style="display:none;">
            <div id="jwt-results-inner"></div>
            <div class="result-item" id="jwt-claims-section" style="display:none;">
                <div class="result-item-header">
                    <h6 class="result-item-title"><i class="fas fa-info-circle"></i> Claims</h6>
                </div>
                <div id="jwt-claims" class="d-flex flex-wrap gap-2 pb-1"></div>
            </div>
        </div>

    </div>
</div>
`;

export function init() {
    const jwtInput      = document.getElementById('jwt-input');
    const jwtDecodeBtn  = document.getElementById('jwt-decode-btn');
    const jwtClearBtn   = document.getElementById('jwt-clear-btn');
    const jwtError      = document.getElementById('jwt-error');
    const jwtResultsBlock = document.getElementById('jwt-results-block');
    const jwtResultsInner = document.getElementById('jwt-results-inner');
    const jwtClaimsSec  = document.getElementById('jwt-claims-section');
    const jwtClaims     = document.getElementById('jwt-claims');

    const jwtdCmd = document.getElementById('jwtd-cmd');
    const widgets = {};

    function updateCmd(token) {
        if (!jwtdCmd) return;
        const t = token ? JSON.stringify(token) : '"TOKEN"';
        jwtdCmd.textContent = `echo ${t} | cut -d. -f2 | base64 -d 2>/dev/null`;
    }

    jwtInput?.addEventListener('input', () => updateCmd(jwtInput.value.trim()));

    document.getElementById('copy-jwtd-cmd')?.addEventListener('click', function() {
        navigator.clipboard.writeText(jwtdCmd.textContent).then(() => {
            const orig = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => { this.innerHTML = orig; }, 1500);
        });
    });

    function b64urlDecode(str) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) str += '=';
        return atob(str);
    }

    function showError(msg) {
        jwtError.textContent = msg;
        jwtError.classList.remove('d-none');
    }

    function claimBadge(key, value) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-secondary font-monospace';
        let display = value;
        if ((key === 'exp' || key === 'iat' || key === 'nbf') && typeof value === 'number') {
            const d = new Date(value * 1000);
            const expired = key === 'exp' && d < new Date();
            display = d.toLocaleString();
            badge.className = `badge ${expired ? 'bg-danger' : 'bg-success'}`;
        }
        badge.title       = key;
        badge.textContent = `${key}: ${display}`;
        return badge;
    }

    jwtDecodeBtn?.addEventListener('click', function() {
        jwtError.classList.add('d-none');
        const raw = jwtInput.value.trim();
        if (!raw) { showError('Veuillez coller un token JWT.'); return; }

        const parts = raw.split('.');
        if (parts.length !== 3) { showError('Format invalide : un JWT doit comporter 3 parties séparées par des points.'); return; }

        let header, payload;
        try { header  = JSON.parse(b64urlDecode(parts[0])); } catch(e) { showError('Impossible de décoder le header : ' + e.message); return; }
        try { payload = JSON.parse(b64urlDecode(parts[1])); } catch(e) { showError('Impossible de décoder le payload : ' + e.message); return; }

        const values = {
            'Header':    JSON.stringify(header,  null, 2),
            'Payload':   JSON.stringify(payload, null, 2),
            'Signature': parts[2],
        };
        const icons = {
            'Header':    'fas fa-heading',
            'Payload':   'fas fa-database',
            'Signature': 'fas fa-signature',
        };

        const needRebuild = Object.keys(widgets).length === 0;
        if (needRebuild) {
            jwtResultsInner.innerHTML = '';
            ['Header', 'Payload', 'Signature'].forEach(k => {
                const w = createResultItem(icons[k], k, values[k], 'info', `jwt-${k.toLowerCase()}.txt`);
                jwtResultsInner.appendChild(w.el);
                widgets[k] = w;
            });
        } else {
            ['Header', 'Payload', 'Signature'].forEach(k => { if (widgets[k]) widgets[k].pre.textContent = values[k]; });
        }

        const notableClaims = ['iss', 'sub', 'aud', 'exp', 'iat', 'nbf', 'jti'];
        jwtClaims.innerHTML = '';
        let hasClaims = false;
        notableClaims.forEach(k => {
            if (payload[k] !== undefined) { jwtClaims.appendChild(claimBadge(k, payload[k])); hasClaims = true; }
        });
        jwtClaimsSec.style.display = hasClaims ? '' : 'none';

        jwtResultsBlock.style.display = '';
    });

    jwtClearBtn?.addEventListener('click', function() {
        jwtInput.value = '';
        jwtError.classList.add('d-none');
        jwtResultsBlock.style.display = 'none';
        jwtResultsInner.innerHTML = '';
        jwtClaimsSec.style.display = 'none';
        jwtClaims.innerHTML = '';
        Object.keys(widgets).forEach(k => delete widgets[k]);
    });
}
