import { copyToClipboard } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-id-card me-2"></i> JWT</h5>
    </div>
    <div class="card-body">
        <!-- Tabs -->
        <ul class="nav nav-tabs mb-4" id="jwt-tabs">
            <li class="nav-item">
                <button class="nav-link active" id="jwt-tab-encode" data-jwt-tab="encode">
                    <i class="fas fa-pen me-1"></i> Encoder
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link" id="jwt-tab-decode" data-jwt-tab="decode">
                    <i class="fas fa-unlock me-1"></i> Décoder
                </button>
            </li>
        </ul>

        <!-- ══ Encoder panel ══════════════════════════════════════════════ -->
        <div id="jwt-panel-encode">

            <!-- Block 1 : Config -->
            <div class="cfg-block">
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Algorithme <span class="text-danger">*</span></label>
                        <select class="form-select" id="jwt-algo">
                            <option value="HS256">HS256 — HMAC SHA-256</option>
                            <option value="HS384">HS384 — HMAC SHA-384</option>
                            <option value="HS512">HS512 — HMAC SHA-512</option>
                            <option value="RS256">RS256 — RSA SHA-256</option>
                            <option value="RS384">RS384 — RSA SHA-384</option>
                            <option value="RS512">RS512 — RSA SHA-512</option>
                        </select>
                    </div>
                    <div class="col-md-6" id="jwt-secret-group">
                        <label for="jwt-secret" class="form-label fw-bold">Secret <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <input type="password" class="form-control font-monospace" id="jwt-secret" placeholder="Clé secrète HMAC">
                            <button class="btn btn-outline-secondary" type="button" id="jwt-secret-toggle" title="Afficher/Masquer">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-12" id="jwt-privkey-group" style="display:none;">
                        <label for="jwt-privkey" class="form-label fw-bold">Clé privée RSA (PEM) <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <textarea class="form-control font-monospace" id="jwt-privkey" rows="4"
                                placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                                style="filter:blur(4px);"></textarea>
                            <button class="btn btn-outline-secondary" type="button" id="jwt-privkey-toggle" title="Afficher/Masquer" style="align-self:flex-start;">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label for="jwt-header-in" class="form-label fw-bold">Header (JSON)</label>
                        <textarea class="form-control font-monospace" id="jwt-header-in" rows="3">{"alg":"HS256","typ":"JWT"}</textarea>
                    </div>
                    <div class="col-md-6">
                        <label for="jwt-payload-in" class="form-label fw-bold">Payload (JSON)</label>
                        <textarea class="form-control font-monospace" id="jwt-payload-in" rows="3">{"sub":"1234567890","name":"John Doe","iat":1516239022}</textarea>
                    </div>
                </div>
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-custom-primary" id="jwt-encode-btn">
                        <i class="fas fa-pen me-2"></i> Générer le token
                    </button>
                    <button class="btn btn-outline-secondary" id="jwt-encode-clear">
                        <i class="fas fa-times me-2"></i> Effacer
                    </button>
                </div>
                <div id="jwt-encode-error" class="alert alert-danger mt-2 d-none"></div>
            </div>

            <!-- Block 2 : Linux command -->
            <div class="cmd-block">
                <div class="cmd-block-inner">
                    <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux (jwt-cli)</div>
                    <pre id="jwt-encode-cmd">jwt encode --alg HS256 --secret "your-secret" '{"sub":"1234567890","name":"John Doe","iat":1516239022}'</pre>
                </div>
                <button class="btn btn-sm btn-outline-warning" id="copy-jwt-encode-cmd" title="Copier la commande">
                    <i class="fas fa-copy"></i>
                </button>
            </div>

            <!-- Block 3 : Results -->
            <div class="results-block" id="jwt-encode-results-block" style="display:none;">
                <div class="result-item">
                    <div class="result-item-header">
                        <h6 class="result-item-title text-warning"><i class="fas fa-id-card"></i> Token JWT</h6>
                        <button class="btn btn-sm btn-outline-warning" id="jwt-copy-token" title="Copier">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <pre class="text-warning" id="jwt-token-out" style="word-break:break-all;"></pre>
                    <div class="mt-2">
                        <small>
                            <span class="text-primary fw-bold">Header</span> ·
                            <span class="text-success fw-bold">Payload</span> ·
                            <span class="text-danger fw-bold">Signature</span>
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <!-- ══ Decoder panel ══════════════════════════════════════════════ -->
        <div id="jwt-panel-decode" style="display:none;">

            <!-- Block 1 : Config -->
            <div class="cfg-block">
                <div class="mb-3">
                    <label for="jwt-input" class="form-label">Token JWT :</label>
                    <textarea class="form-control font-monospace" id="jwt-input" rows="4" placeholder="Collez votre JWT ici... (eyJ...)"></textarea>
                </div>
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-custom-primary" id="jwt-decode-btn">
                        <i class="fas fa-unlock me-2"></i> Décoder
                    </button>
                    <button class="btn btn-outline-secondary" id="jwt-clear-btn">
                        <i class="fas fa-times me-2"></i> Effacer
                    </button>
                </div>
                <div id="jwt-error" class="alert alert-danger mt-2 d-none"></div>
            </div>

            <!-- Block 2 : Linux command -->
            <div class="cmd-block">
                <div class="cmd-block-inner">
                    <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux — décoder le payload</div>
                    <pre id="jwt-decode-cmd">echo "TOKEN" | cut -d. -f2 | base64 -d 2>/dev/null</pre>
                </div>
                <button class="btn btn-sm btn-outline-warning" id="copy-jwt-decode-cmd" title="Copier la commande">
                    <i class="fas fa-copy"></i>
                </button>
            </div>

            <!-- Block 3 : Results -->
            <div class="results-block" id="jwt-decode-results-block" style="display:none;">
                <div class="result-item">
                    <div class="result-item-header">
                        <h6 class="result-item-title text-primary"><i class="fas fa-heading"></i> Header</h6>
                        <button class="btn btn-sm btn-outline-primary" id="jwt-copy-header" title="Copier"><i class="fas fa-copy"></i></button>
                    </div>
                    <pre class="text-primary" id="jwt-header-out">—</pre>
                </div>
                <div class="result-item">
                    <div class="result-item-header">
                        <h6 class="result-item-title text-success"><i class="fas fa-database"></i> Payload</h6>
                        <button class="btn btn-sm btn-outline-success" id="jwt-copy-payload" title="Copier"><i class="fas fa-copy"></i></button>
                    </div>
                    <pre class="text-success" id="jwt-payload-out">—</pre>
                </div>
                <div class="result-item" id="jwt-claims-section" style="display:none;">
                    <div class="result-item-header">
                        <h6 class="result-item-title text-warning"><i class="fas fa-info-circle"></i> Claims</h6>
                    </div>
                    <div id="jwt-claims" class="d-flex flex-wrap gap-2"></div>
                </div>
                <div class="result-item">
                    <div class="result-item-header">
                        <h6 class="result-item-title text-danger"><i class="fas fa-signature"></i> Signature</h6>
                    </div>
                    <pre class="text-danger" id="jwt-signature-out">—</pre>
                    <small class="text-muted d-block mt-1">La vérification de signature nécessite la clé secrète/publique côté serveur.</small>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// ─── helpers ──────────────────────────────────────────────────────────────────
function b64url(str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function b64urlFromWords(wordArray) {
    return CryptoJS.enc.Base64.stringify(wordArray)
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function b64urlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return atob(str);
}

export function init() {
    // ── Tab switching ────────────────────────────────────────────────────────
    const panelEncode = document.getElementById('jwt-panel-encode');
    const panelDecode = document.getElementById('jwt-panel-decode');

    document.querySelectorAll('[data-jwt-tab]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-jwt-tab]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const tab = this.getAttribute('data-jwt-tab');
            panelEncode.style.display = tab === 'encode' ? '' : 'none';
            panelDecode.style.display = tab === 'decode' ? '' : 'none';
        });
    });

    // ── Encoder ──────────────────────────────────────────────────────────────
    const algoSelect        = document.getElementById('jwt-algo');
    const secretInput       = document.getElementById('jwt-secret');
    const secretToggle      = document.getElementById('jwt-secret-toggle');
    const privkeyInput      = document.getElementById('jwt-privkey');
    const privkeyToggle     = document.getElementById('jwt-privkey-toggle');
    const secretGroup       = document.getElementById('jwt-secret-group');
    const privkeyGroup      = document.getElementById('jwt-privkey-group');
    const headerIn          = document.getElementById('jwt-header-in');
    const payloadIn         = document.getElementById('jwt-payload-in');
    const encodeBtn         = document.getElementById('jwt-encode-btn');
    const encodeClear       = document.getElementById('jwt-encode-clear');
    const encodeError       = document.getElementById('jwt-encode-error');
    const encodeResultsBlock = document.getElementById('jwt-encode-results-block');
    const tokenOut          = document.getElementById('jwt-token-out');
    const copyTokenBtn      = document.getElementById('jwt-copy-token');
    const jwtEncodeCmd      = document.getElementById('jwt-encode-cmd');

    // RS private key blur toggle
    let privkeyHidden = true;
    privkeyToggle?.addEventListener('click', function() {
        privkeyHidden = !privkeyHidden;
        privkeyInput.style.filter = privkeyHidden ? 'blur(4px)' : 'none';
        this.querySelector('i').className = privkeyHidden ? 'fas fa-eye' : 'fas fa-eye-slash';
    });

    algoSelect?.addEventListener('change', function() {
        const isRS = this.value.startsWith('RS');
        secretGroup.style.display   = isRS ? 'none' : '';
        privkeyGroup.style.display  = isRS ? ''     : 'none';
        try {
            const h = JSON.parse(headerIn.value);
            h.alg = this.value;
            headerIn.value = JSON.stringify(h, null, 0).replace(/,/g, ', ');
        } catch(e) { /* leave as-is */ }
        updateEncodeCmd();
    });

    secretToggle?.addEventListener('click', function() {
        const isText = secretInput.type === 'text';
        secretInput.type = isText ? 'password' : 'text';
        this.querySelector('i').classList.toggle('fa-eye',      isText);
        this.querySelector('i').classList.toggle('fa-eye-slash', !isText);
    });

    function updateEncodeCmd() {
        if (!jwtEncodeCmd) return;
        const algo  = algoSelect?.value || 'HS256';
        let payload = '{}';
        try { payload = payloadIn.value.trim(); } catch(e) {}
        if (algo.startsWith('RS')) {
            jwtEncodeCmd.textContent = `jwt encode --alg ${algo} --secret @private.key '${payload}'`;
        } else {
            jwtEncodeCmd.textContent = `jwt encode --alg ${algo} --secret "your-secret" '${payload}'`;
        }
    }

    payloadIn?.addEventListener('input', updateEncodeCmd);

    function showEncodeError(msg) {
        encodeError.textContent = msg;
        encodeError.classList.remove('d-none');
    }

    encodeBtn?.addEventListener('click', function() {
        encodeError.classList.add('d-none');

        const algo = algoSelect.value;
        const isRS = algo.startsWith('RS');

        let headerObj, payloadObj;
        try { headerObj  = JSON.parse(headerIn.value);  } catch(e) { showEncodeError('Header invalide : ' + e.message); return; }
        try { payloadObj = JSON.parse(payloadIn.value); } catch(e) { showEncodeError('Payload invalide : ' + e.message); return; }

        headerObj.alg = algo;
        headerObj.typ = headerObj.typ || 'JWT';

        const headerB64  = b64url(JSON.stringify(headerObj));
        const payloadB64 = b64url(JSON.stringify(payloadObj));
        const sigInput   = `${headerB64}.${payloadB64}`;

        let sigB64;

        if (isRS) {
            const keyPem = privkeyInput.value.trim();
            if (!keyPem) { showEncodeError('La clé privée RSA (PEM) est obligatoire.'); return; }
            if (typeof KEYUTIL === 'undefined' || typeof KJUR === 'undefined') {
                showEncodeError('Librairie jsrsasign non chargée.'); return;
            }
            const algMap = { RS256: 'SHA256withRSA', RS384: 'SHA384withRSA', RS512: 'SHA512withRSA' };
            try {
                const priv = KEYUTIL.getKey(keyPem);
                const sig  = new KJUR.crypto.Signature({ alg: algMap[algo] });
                sig.init(priv);
                sig.updateString(sigInput);
                const sigHex = sig.sign();
                sigB64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(sigHex))
                    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            } catch(e) { showEncodeError('Erreur de signature RSA : ' + e.message); return; }
        } else {
            const secret = secretInput.value;
            if (!secret) { showEncodeError('La clé secrète est obligatoire.'); return; }
            let hmacFn;
            if (algo === 'HS256') hmacFn = CryptoJS.HmacSHA256;
            else if (algo === 'HS384') hmacFn = CryptoJS.HmacSHA384;
            else hmacFn = CryptoJS.HmacSHA512;
            sigB64 = b64urlFromWords(hmacFn(sigInput, secret));
        }

        tokenOut.innerHTML = `<span class="text-primary">${headerB64}</span>.<span class="text-success">${payloadB64}</span>.<span class="text-danger">${sigB64}</span>`;
        encodeResultsBlock.style.display = '';
    });

    copyTokenBtn?.addEventListener('click', function() {
        const raw = tokenOut.textContent;
        if (raw) copyToClipboard(raw, this);
    });

    encodeClear?.addEventListener('click', () => {
        secretInput.value  = '';
        privkeyInput.value = '';
        privkeyInput.style.filter = 'blur(4px)';
        privkeyHidden = true;
        privkeyToggle.querySelector('i').className = 'fas fa-eye';
        algoSelect.value = 'HS256';
        secretGroup.style.display  = '';
        privkeyGroup.style.display = 'none';
        headerIn.value  = '{"alg":"HS256","typ":"JWT"}';
        payloadIn.value = '{"sub":"1234567890","name":"John Doe","iat":1516239022}';
        encodeError.classList.add('d-none');
        encodeResultsBlock.style.display = 'none';
        tokenOut.innerHTML = '';
        updateEncodeCmd();
    });

    document.getElementById('copy-jwt-encode-cmd')?.addEventListener('click', function() {
        copyToClipboard(jwtEncodeCmd.textContent, this);
    });

    updateEncodeCmd();

    // ── Decoder ──────────────────────────────────────────────────────────────
    const jwtInput           = document.getElementById('jwt-input');
    const jwtDecodeCmd       = document.getElementById('jwt-decode-cmd');

    function updateDecodeCmd() {
        if (!jwtDecodeCmd) return;
        const t = jwtInput?.value.trim();
        jwtDecodeCmd.textContent = t
            ? `echo ${JSON.stringify(t)} | cut -d. -f2 | base64 -d 2>/dev/null`
            : `echo "TOKEN" | cut -d. -f2 | base64 -d 2>/dev/null`;
    }

    jwtInput?.addEventListener('input', updateDecodeCmd);

    document.getElementById('copy-jwt-decode-cmd')?.addEventListener('click', function() {
        navigator.clipboard.writeText(jwtDecodeCmd.textContent).then(() => {
            const orig = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => { this.innerHTML = orig; }, 1500);
        });
    });

    const jwtDecodeBtn       = document.getElementById('jwt-decode-btn');
    const jwtClearBtn        = document.getElementById('jwt-clear-btn');
    const jwtError           = document.getElementById('jwt-error');
    const jwtHeaderOut       = document.getElementById('jwt-header-out');
    const jwtPayloadOut      = document.getElementById('jwt-payload-out');
    const jwtSigOut          = document.getElementById('jwt-signature-out');
    const jwtClaims          = document.getElementById('jwt-claims');
    const jwtClaimsSec       = document.getElementById('jwt-claims-section');
    const jwtDecodeResultsBlock = document.getElementById('jwt-decode-results-block');

    function showDecodeError(msg) {
        jwtError.textContent = msg;
        jwtError.classList.remove('d-none');
    }

    function claimBadge(key, value) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-secondary font-monospace';
        let display = value;
        if ((key === 'exp' || key === 'iat' || key === 'nbf') && typeof value === 'number') {
            const d = new Date(value * 1000);
            display = d.toLocaleString();
            badge.className = `badge ${key === 'exp' && d < new Date() ? 'bg-danger' : 'bg-success'}`;
        }
        badge.title = key;
        badge.textContent = `${key}: ${display}`;
        return badge;
    }

    jwtDecodeBtn?.addEventListener('click', function() {
        const raw = jwtInput.value.trim();
        jwtError.classList.add('d-none');
        if (!raw) { showDecodeError('Veuillez coller un token JWT.'); return; }

        const parts = raw.split('.');
        if (parts.length !== 3) { showDecodeError('Format invalide : un JWT doit comporter 3 parties séparées par des points.'); return; }

        let header, payload;
        try { header  = JSON.parse(b64urlDecode(parts[0])); } catch(e) { showDecodeError('Impossible de décoder le header : ' + e.message); return; }
        try { payload = JSON.parse(b64urlDecode(parts[1])); } catch(e) { showDecodeError('Impossible de décoder le payload : ' + e.message); return; }

        jwtHeaderOut.textContent  = JSON.stringify(header,  null, 2);
        jwtPayloadOut.textContent = JSON.stringify(payload, null, 2);
        jwtSigOut.textContent     = parts[2];

        const notable = ['iss','sub','aud','exp','iat','nbf','jti'];
        jwtClaims.innerHTML = '';
        let hasClaims = false;
        notable.forEach(k => {
            if (payload[k] !== undefined) { jwtClaims.appendChild(claimBadge(k, payload[k])); hasClaims = true; }
        });
        jwtClaimsSec.style.display = hasClaims ? '' : 'none';
        jwtDecodeResultsBlock.style.display = '';
    });

    jwtClearBtn?.addEventListener('click', () => {
        jwtInput.value = '';
        jwtHeaderOut.textContent  = '—';
        jwtPayloadOut.textContent = '—';
        jwtSigOut.textContent     = '—';
        jwtClaimsSec.style.display = 'none';
        jwtError.classList.add('d-none');
        jwtDecodeResultsBlock.style.display = 'none';
    });

    document.getElementById('jwt-copy-header')?.addEventListener('click', function() {
        copyToClipboard(jwtHeaderOut.textContent, this);
    });
    document.getElementById('jwt-copy-payload')?.addEventListener('click', function() {
        copyToClipboard(jwtPayloadOut.textContent, this);
    });
}
