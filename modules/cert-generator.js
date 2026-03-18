import { copyToClipboard, downloadBlob, createResultItem } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-certificate me-2"></i> Certificate</h5>
    </div>
    <div class="card-body">

        <!-- Tabs -->
        <ul class="nav nav-tabs mb-4" id="cert-tabs">
            <li class="nav-item">
                <button class="nav-link active" data-cert-tab="generate">
                    <i class="fas fa-certificate me-1"></i> Générer
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link" data-cert-tab="decode">
                    <i class="fas fa-search me-1"></i> Décoder
                </button>
            </li>
        </ul>

        <!-- ══ Panel : Générer ══════════════════════════════════════════════ -->
        <div id="cert-panel-generate">

            <!-- Block 1 : Config -->
            <div class="cfg-block">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Algorithme de signature <span class="text-danger">*</span></label>
                        <select class="form-select" id="cert-algo">
                            <option value="rsa">SHA-256 avec RSA</option>
                            <option value="ecdsa">SHA-256 avec ECDSA</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold">Taille de clé <span class="text-danger">*</span></label>
                        <select class="form-select" id="cert-key-size">
                            <option value="2048">RSA 2048 bits (standard marché)</option>
                            <option value="4096">RSA 4096 bits</option>
                        </select>
                        <select class="form-select d-none" id="cert-ec-curve">
                            <option value="secp256r1">P-256 / 256 bits (standard marché)</option>
                            <option value="secp384r1">P-384 / 384 bits</option>
                            <option value="secp521r1">P-521 / 521 bits</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="cert-cn" class="form-label fw-bold">Common Name (CN) <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="cert-cn" placeholder="exemple.com">
                    </div>
                    <div class="col-md-6">
                        <label for="cert-validity" class="form-label fw-bold">Validité (autosigné)</label>
                        <select class="form-select" id="cert-validity">
                            <option value="365">1 an</option>
                            <option value="730">2 ans</option>
                            <option value="3650">10 ans</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="cert-o" class="form-label">Organization (O)</label>
                        <input type="text" class="form-control" id="cert-o" placeholder="Mon Organisation">
                    </div>
                    <div class="col-md-6">
                        <label for="cert-ou" class="form-label">Organizational Unit (OU)</label>
                        <input type="text" class="form-control" id="cert-ou" placeholder="IT Department">
                    </div>
                    <div class="col-md-6">
                        <label for="cert-l" class="form-label">Locality (L)</label>
                        <input type="text" class="form-control" id="cert-l" placeholder="Paris">
                    </div>
                    <div class="col-md-6">
                        <label for="cert-st" class="form-label">State / Province (ST)</label>
                        <input type="text" class="form-control" id="cert-st" placeholder="Île-de-France">
                    </div>
                    <div class="col-md-3">
                        <label for="cert-c" class="form-label">Country (C)</label>
                        <input type="text" class="form-control" id="cert-c" placeholder="FR" maxlength="2">
                        <small class="text-muted">2 lettres ISO 3166</small>
                    </div>
                    <div class="col-12">
                        <label class="form-label fw-bold">Subject Alternative Names (SAN)</label>
                        <div id="cert-san-list"></div>
                        <button type="button" class="btn btn-sm btn-outline-secondary mt-2" id="cert-add-san">
                            <i class="fas fa-plus me-1"></i> Ajouter un SAN
                        </button>
                    </div>
                </div>
                <div class="d-flex flex-wrap gap-2 mt-3">
                    <button class="btn btn-custom-primary" id="cert-gen-selfsigned">
                        <i class="fas fa-certificate me-2"></i> Générer un autosigné
                    </button>
                    <button class="btn btn-outline-primary" id="cert-gen-csr">
                        <i class="fas fa-file-alt me-2"></i> Générer un CSR
                    </button>
                    <button class="btn btn-outline-secondary" id="cert-clear">
                        <i class="fas fa-times me-2"></i> Effacer
                    </button>
                </div>
                <div id="cert-loading" class="d-none mt-3">
                    <div class="d-flex align-items-center gap-2">
                        <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                        <span id="cert-loading-msg">Génération en cours…</span>
                    </div>
                </div>
                <div id="cert-error" class="alert alert-danger mt-3 d-none"></div>
            </div>

            <!-- Block 2 : Linux command -->
            <div class="cmd-block">
                <div class="cmd-block-inner">
                    <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                    <pre id="cert-cmd">openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout private.key -out certificate.crt \
  -subj "/CN=exemple.com"</pre>
                </div>
                <button class="btn btn-sm btn-outline-warning" id="copy-cert-cmd" title="Copier la commande">
                    <i class="fas fa-copy"></i>
                </button>
            </div>

            <!-- Block 3 : Results -->
            <div class="results-block" id="cert-results-block" style="display:none;">
                <div id="cert-results-inner"></div>
            </div>

        </div>

        <!-- ══ Panel : Décoder ══════════════════════════════════════════════ -->
        <div id="cert-panel-decode" style="display:none;">

            <!-- Block 1 : Config -->
            <div class="cfg-block">
                <div class="mb-3">
                    <label for="certd-pem" class="form-label fw-bold">Certificat(s) PEM <span class="text-danger">*</span></label>
                    <textarea class="form-control font-monospace" id="certd-pem" rows="6"
                        placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----&#10;(Collez un ou plusieurs certificats pour analyser la chaîne)"></textarea>
                </div>
                <div class="mb-3">
                    <label for="certd-key" class="form-label fw-bold">Clé privée PEM <span class="text-muted fw-normal">(optionnel — vérifie la correspondance)</span></label>
                    <div class="input-group">
                        <textarea class="form-control font-monospace" id="certd-key" rows="3"
                            placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"></textarea>
                        <button class="btn btn-outline-secondary" type="button" id="certd-key-toggle" title="Afficher/Masquer" style="align-self:flex-start;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-custom-primary" id="certd-decode-btn">
                        <i class="fas fa-search me-2"></i> Analyser
                    </button>
                    <button class="btn btn-outline-secondary" id="certd-clear-btn">
                        <i class="fas fa-times me-2"></i> Effacer
                    </button>
                </div>
                <div id="certd-error" class="alert alert-danger mt-3 d-none"></div>
            </div>

            <!-- Block 2 : Linux command -->
            <div class="cmd-block">
                <div class="cmd-block-inner">
                    <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                    <pre id="certd-cmd">openssl x509 -in certificate.pem -text -noout</pre>
                </div>
                <button class="btn btn-sm btn-outline-warning" id="copy-certd-cmd" title="Copier la commande">
                    <i class="fas fa-copy"></i>
                </button>
            </div>

            <!-- Block 3 : Results -->
            <div class="results-block" id="certd-results-block" style="display:none;">
                <div id="certd-results-inner"></div>
            </div>

        </div>

    </div>
</div>
`;

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatCertTime(s) {
    if (!s) return 'N/A';
    let year, rest;
    if (s.length === 13) {           // UTCTime: YYMMDDHHMMSSZ
        const y = parseInt(s.slice(0, 2));
        year = y >= 50 ? 1900 + y : 2000 + y;
        rest = s.slice(2);
    } else {                         // GeneralizedTime: YYYYMMDDHHMMSSZ
        year = parseInt(s.slice(0, 4));
        rest = s.slice(4);
    }
    const d = new Date(Date.UTC(year, parseInt(rest.slice(0,2))-1, parseInt(rest.slice(2,4)),
        parseInt(rest.slice(4,6)), parseInt(rest.slice(6,8)), parseInt(rest.slice(8,10))));
    return d.toLocaleString('fr-FR', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' }) + ' UTC';
}

function dnToLines(dnStr) {
    return dnStr.replace(/^\//, '').split('/').map(p => {
        const [k, ...v] = p.split('=');
        return `${k.padEnd(3)} = ${v.join('=')}`;
    }).join('\n');
}

function splitPEMChain(pem) {
    const matches = pem.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g);
    return matches || [];
}

function parseCert(pem) {
    const x = new X509();
    x.readCertPEM(pem);

    const subjectStr = x.getSubjectString();
    const issuerStr  = x.getIssuerString();
    const notBefore  = formatCertTime(x.getNotBefore());
    const notAfter   = formatCertTime(x.getNotAfter());
    const serial     = x.getSerialNumberHex().toUpperCase().match(/.{1,2}/g).join(':');
    const sigAlg     = x.getSignatureAlgorithmField();

    const pubKey = x.getPublicKey();
    let keyInfo = 'Inconnu', modulus = null;
    if (pubKey.type === 'RSA') {
        const bits = pubKey.n.bitLength();
        keyInfo  = `RSA ${bits} bits`;
        modulus  = pubKey.n.toString(16).toUpperCase();
    } else if (pubKey.type === 'EC') {
        keyInfo = `EC (${pubKey.curveName || 'courbe inconnue'})`;
    }

    let sans = [];
    try {
        const sanArr = x.getExtSubjectAltName2();
        if (sanArr) sans = sanArr.map(e => `${e[0]}: ${e[1]}`);
    } catch(e) {}

    // Basic constraints
    let isCA = false;
    try { isCA = x.getExtBasicConstraints()?.cA === true; } catch(e) {}

    // Fingerprints (SHA-1 and SHA-256 over the DER)
    let fp1 = null, fp256 = null;
    try {
        const derHex = x.hex;
        fp1   = KJUR.crypto.Util.hashHex(derHex, 'sha1')  .toUpperCase().match(/.{2}/g).join(':');
        fp256 = KJUR.crypto.Util.hashHex(derHex, 'sha256').toUpperCase().match(/.{2}/g).join(':');
    } catch(e) {}

    return { subjectStr, issuerStr, notBefore, notAfter, serial, sigAlg, keyInfo, modulus, sans, isCA, fp1, fp256 };
}

function checkKeyMatch(certPEM, keyPEM) {
    const x = new X509();
    x.readCertPEM(certPEM);
    const certPub = x.getPublicKey();
    const priv    = KEYUTIL.getKey(keyPEM);
    if (certPub.type === 'RSA' && priv.n) {
        return certPub.n.toString() === priv.n.toString();
    }
    if (certPub.type === 'EC' && priv.pubKeyHex) {
        return certPub.pubKeyHex === priv.pubKeyHex;
    }
    return null;
}

// ─── init ─────────────────────────────────────────────────────────────────────

export function init() {

    // ── Tab switching ────────────────────────────────────────────────────────
    document.querySelectorAll('[data-cert-tab]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-cert-tab]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const tab = this.getAttribute('data-cert-tab');
            document.getElementById('cert-panel-generate').style.display = tab === 'generate' ? '' : 'none';
            document.getElementById('cert-panel-decode').style.display   = tab === 'decode'   ? '' : 'none';
        });
    });

    // ════════════════════════════════════════════════════════════════════════
    // PANEL GÉNÉRER
    // ════════════════════════════════════════════════════════════════════════
    const certAlgo         = document.getElementById('cert-algo');
    const certKeySize      = document.getElementById('cert-key-size');
    const certEcCurve      = document.getElementById('cert-ec-curve');
    const certCN           = document.getElementById('cert-cn');
    const certO            = document.getElementById('cert-o');
    const certOU           = document.getElementById('cert-ou');
    const certL            = document.getElementById('cert-l');
    const certST           = document.getElementById('cert-st');
    const certC            = document.getElementById('cert-c');
    const certValidity     = document.getElementById('cert-validity');
    const certSanList      = document.getElementById('cert-san-list');
    const certAddSan       = document.getElementById('cert-add-san');
    const certGenSelf      = document.getElementById('cert-gen-selfsigned');
    const certGenCSR       = document.getElementById('cert-gen-csr');
    const certLoading      = document.getElementById('cert-loading');
    const certLoadingMsg   = document.getElementById('cert-loading-msg');
    const certError        = document.getElementById('cert-error');
    const certResultsBlock = document.getElementById('cert-results-block');
    const certResultsInner = document.getElementById('cert-results-inner');
    const certCmd          = document.getElementById('cert-cmd');

    certAlgo.addEventListener('change', function() {
        certKeySize.classList.toggle('d-none', this.value !== 'rsa');
        certEcCurve.classList.toggle('d-none', this.value !== 'ecdsa');
        updateCmd();
    });
    certKeySize.addEventListener('change', updateCmd);
    certEcCurve.addEventListener('change', updateCmd);
    certCN.addEventListener('input', updateCmd);
    certValidity.addEventListener('change', updateCmd);
    certO.addEventListener('input', updateCmd);
    certOU.addEventListener('input', updateCmd);
    certL.addEventListener('input', updateCmd);
    certST.addEventListener('input', updateCmd);
    certC.addEventListener('input', updateCmd);

    function buildSubjectCmd() {
        let s = ''; const cn = certCN.value.trim() || 'exemple.com'; s += `/CN=${cn}`;
        const o = certO.value.trim();   if (o)  s += `/O=${o}`;
        const ou = certOU.value.trim(); if (ou) s += `/OU=${ou}`;
        const l  = certL.value.trim();  if (l)  s += `/L=${l}`;
        const st = certST.value.trim(); if (st) s += `/ST=${st}`;
        const c  = certC.value.trim().toUpperCase().slice(0, 2); if (c) s += `/C=${c}`;
        return s;
    }

    function getSanCmd() {
        const entries = [];
        certSanList.querySelectorAll('.cert-san-entry').forEach(e => {
            const type = e.querySelector('select').value;
            const val  = e.querySelector('input').value.trim();
            if (val) entries.push(type === 'ip' ? `IP:${val}` : `DNS:${val}`);
        });
        return entries;
    }

    function updateCmd() {
        if (!certCmd) return;
        const days = certValidity.value || '365';
        const subj = buildSubjectCmd();
        const sans = getSanCmd();
        const curve = certEcCurve.value === 'secp384r1' ? 'P-384' : certEcCurve.value === 'secp521r1' ? 'P-521' : 'P-256';
        let cmd = certAlgo.value === 'rsa'
            ? `openssl req -x509 -nodes -days ${days} -newkey rsa:${certKeySize.value || '2048'} \\\n  -keyout private.key -out certificate.crt \\\n  -subj "${subj}"`
            : `openssl req -x509 -nodes -days ${days} -newkey ec -pkeyopt ec_paramgen_curve:${curve} \\\n  -keyout private.key -out certificate.crt \\\n  -subj "${subj}"`;
        if (sans.length) cmd += ` \\\n  -addext "subjectAltName=${sans.join(',')}"`;
        certCmd.textContent = cmd;
    }

    function addSanEntry(type, value) {
        const div = document.createElement('div');
        div.className = 'd-flex gap-2 mb-2 cert-san-entry';
        div.innerHTML = `
            <select class="form-select form-select-sm" style="width:90px;flex:none;">
                <option value="dns"${type==='dns'?' selected':''}>DNS</option>
                <option value="ip"${type==='ip'?' selected':''}>IP</option>
            </select>
            <input type="text" class="form-control form-control-sm" placeholder="${type==='ip'?'192.168.1.1':'exemple.com'}" value="${value||''}">
            <button type="button" class="btn btn-sm btn-outline-danger cert-san-rm"><i class="fas fa-times"></i></button>`;
        div.querySelector('.cert-san-rm').addEventListener('click', () => {
            if (document.querySelectorAll('.cert-san-entry').length > 1) div.remove();
            updateCmd();
        });
        div.querySelector('select').addEventListener('change', function() {
            div.querySelector('input').placeholder = this.value === 'ip' ? '192.168.1.1' : 'exemple.com';
        });
        certSanList.appendChild(div);
    }

    addSanEntry('dns', '');
    certCN.addEventListener('input', function() {
        const first = certSanList.querySelector('.cert-san-entry input');
        if (first && first.dataset.touched !== '1') first.value = this.value;
    });
    certSanList.addEventListener('input', e => {
        if (e.target.matches('.cert-san-entry input')) { e.target.dataset.touched = '1'; updateCmd(); }
    });
    certSanList.addEventListener('change', e => {
        if (e.target.matches('.cert-san-entry select')) updateCmd();
    });
    certAddSan.addEventListener('click', () => addSanEntry('dns', ''));

    function buildSubject() {
        let s = '';
        const add = (key, el) => { const v = el.value.trim(); if (v) s += `/${key}=${v}`; };
        add('CN', certCN); add('O', certO); add('OU', certOU); add('L', certL); add('ST', certST);
        const c = certC.value.trim().toUpperCase().slice(0, 2);
        if (c) s += `/C=${c}`;
        return s;
    }

    function getSanArray() {
        const arr = [];
        certSanList.querySelectorAll('.cert-san-entry').forEach(e => {
            const type = e.querySelector('select').value;
            const val  = e.querySelector('input').value.trim();
            if (val) arr.push(type === 'ip' ? { ip: val } : { dns: val });
        });
        if (!arr.length) { const cn = certCN.value.trim(); if (cn) arr.push({ dns: cn }); }
        return arr;
    }

    function utcStr(date) {
        return date.getUTCFullYear() +
            String(date.getUTCMonth() + 1).padStart(2, '0') +
            String(date.getUTCDate()).padStart(2, '0') + '000000Z';
    }

    function showErr(msg) {
        certError.textContent = msg;
        certError.classList.remove('d-none');
        certLoading.classList.add('d-none');
    }

    function renderResults(privPEM, outPEM, isCSR) {
        certResultsInner.innerHTML = '';
        const ext   = isCSR ? 'csr' : 'crt';
        const label = isCSR ? 'CSR (PKCS#10)' : 'Certificat autosigné';
        const wPriv = createResultItem('fas fa-lock', 'Clé Privée (PKCS#8)', privPEM, 'info', 'private.key', true);
        const wOut  = createResultItem('fas fa-certificate', label, outPEM, 'info', `certificate.${ext}`, true);
        certResultsInner.appendChild(wPriv.el);
        certResultsInner.appendChild(wOut.el);
        certResultsBlock.style.display = '';
        certLoading.classList.add('d-none');
        certError.classList.add('d-none');
    }

    function generate(mode) {
        const cn = certCN.value.trim();
        if (!cn) { showErr('Le Common Name (CN) est obligatoire.'); return; }
        certError.classList.add('d-none');
        const isRSA = certAlgo.value === 'rsa';
        const rsaBits = parseInt(certKeySize.value);
        certLoadingMsg.textContent = isRSA && rsaBits === 4096
            ? 'Génération RSA 4096 bits en cours (peut prendre 10-30 s)…' : 'Génération en cours…';
        certLoading.classList.remove('d-none');
        setTimeout(() => {
            try {
                if (typeof KEYUTIL === 'undefined') { showErr('Librairie jsrsasign non chargée.'); return; }
                let kp, sigAlg;
                if (isRSA) { kp = KEYUTIL.generateKeypair('RSA', rsaBits); sigAlg = 'SHA256withRSA'; }
                else       { kp = KEYUTIL.generateKeypair('EC', certEcCurve.value); sigAlg = 'SHA256withECDSA'; }
                const privPEM  = KEYUTIL.getPEM(kp.prvKeyObj, 'PKCS8PRV');
                const subject  = buildSubject();
                const sanArray = getSanArray();
                if (mode === 'csr') {
                    const opts = { subject: {str: subject}, sbjpubkey: kp.pubKeyObj, sigalg: sigAlg, sbjprvkey: kp.prvKeyObj };
                    if (sanArray.length) opts.extreq = [{extname: 'subjectAltName', array: sanArray}];
                    renderResults(privPEM, KJUR.asn1.csr.CSRUtil.newCSRPEM(opts), true);
                } else {
                    const today    = new Date();
                    const notAfter = new Date(today.getTime() + parseInt(certValidity.value) * 86400000);
                    const exts = [
                        {extname: 'basicConstraints', cA: false},
                        {extname: 'keyUsage', critical: true, names: ['digitalSignature', 'keyEncipherment']}
                    ];
                    if (sanArray.length) exts.push({extname: 'subjectAltName', array: sanArray});
                    const cert = new KJUR.asn1.x509.Certificate({
                        version: 3, serial: {int: Math.floor(Math.random() * 0xFFFFFF) + 1},
                        issuer: {str: subject}, subject: {str: subject},
                        notbefore: {str: utcStr(today)}, notafter: {str: utcStr(notAfter)},
                        sbjpubkey: kp.pubKeyObj, ext: exts, cakey: kp.prvKeyObj, sigalg: sigAlg
                    });
                    renderResults(privPEM, cert.getPEM(), false);
                }
            } catch(e) { showErr('Erreur : ' + e.message); console.error(e); }
        }, 80);
    }

    certGenSelf.addEventListener('click', () => generate('selfsigned'));
    certGenCSR.addEventListener('click',  () => generate('csr'));
    document.getElementById('copy-cert-cmd')?.addEventListener('click', function() {
        copyToClipboard(certCmd.textContent, this);
    });
    document.getElementById('cert-clear')?.addEventListener('click', function() {
        ['cert-cn','cert-o','cert-ou','cert-l','cert-st','cert-c'].forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });
        certSanList.innerHTML = '';
        addSanEntry('dns', '');
        certResultsBlock.style.display = 'none';
        certResultsInner.innerHTML = '';
        certError.classList.add('d-none');
        updateCmd();
    });
    updateCmd();

    // ════════════════════════════════════════════════════════════════════════
    // PANEL DÉCODER
    // ════════════════════════════════════════════════════════════════════════
    const certdPem         = document.getElementById('certd-pem');
    const certdKey         = document.getElementById('certd-key');
    const certdKeyToggle   = document.getElementById('certd-key-toggle');
    const certdDecodeBtn   = document.getElementById('certd-decode-btn');
    const certdClearBtn    = document.getElementById('certd-clear-btn');
    const certdError       = document.getElementById('certd-error');
    const certdResultsBlock= document.getElementById('certd-results-block');
    const certdResultsInner= document.getElementById('certd-results-inner');
    const certdCmd         = document.getElementById('certd-cmd');

    // Key textarea show/hide (blur with CSS filter)
    let keyHidden = true;
    certdKeyToggle?.addEventListener('click', function() {
        keyHidden = !keyHidden;
        certdKey.style.filter = keyHidden ? 'blur(4px)' : 'none';
        this.querySelector('i').className = keyHidden ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
    certdKey.style.filter = 'blur(4px)';

    function updateCertdCmd() {
        if (!certdCmd) return;
        const hasKey = certdKey.value.trim();
        if (hasKey) {
            certdCmd.textContent =
                `openssl x509 -noout -modulus -in certificate.pem | openssl md5\n` +
                `openssl rsa  -noout -modulus -in private.key     | openssl md5\n` +
                `# Les deux empreintes doivent être identiques`;
        } else {
            certdCmd.textContent = `openssl x509 -in certificate.pem -text -noout`;
        }
    }

    certdPem?.addEventListener('input', updateCertdCmd);
    certdKey?.addEventListener('input', updateCertdCmd);

    document.getElementById('copy-certd-cmd')?.addEventListener('click', function() {
        copyToClipboard(certdCmd.textContent, this);
    });

    certdDecodeBtn?.addEventListener('click', function() {
        certdError.classList.add('d-none');
        const pem    = certdPem.value.trim();
        const keyPem = certdKey.value.trim();

        if (!pem) { certdError.textContent = 'Collez au moins un certificat PEM.'; certdError.classList.remove('d-none'); return; }
        if (typeof X509 === 'undefined') { certdError.textContent = 'Librairie jsrsasign non chargée.'; certdError.classList.remove('d-none'); return; }

        const certs = splitPEMChain(pem);
        if (!certs.length) { certdError.textContent = 'Aucun bloc -----BEGIN CERTIFICATE----- trouvé.'; certdError.classList.remove('d-none'); return; }

        certdResultsInner.innerHTML = '';

        try {
            certs.forEach((certPEM, idx) => {
                const info  = parseCert(certPEM);
                const role  = certs.length > 1
                    ? (idx === 0 ? ' — Certificat final' : idx === certs.length - 1 ? ' — Racine (CA)' : ` — Intermédiaire ${idx}`)
                    : '';

                // Build detail text
                let detail = '';
                detail += `Subject\n${dnToLines(info.subjectStr)}\n\n`;
                detail += `Issuer\n${dnToLines(info.issuerStr)}\n\n`;
                detail += `Validité\n  Not Before : ${info.notBefore}\n  Not After  : ${info.notAfter}\n\n`;
                detail += `Algorithme : ${info.sigAlg}\n`;
                detail += `Clé        : ${info.keyInfo}\n`;
                detail += `CA         : ${info.isCA ? 'Oui' : 'Non'}\n`;
                detail += `Numéro de série : ${info.serial}`;
                if (info.fp1 || info.fp256) {
                    detail += `\n\nFingerprint`;
                    if (info.fp1)   detail += `\n  SHA-1   : ${info.fp1}`;
                    if (info.fp256) detail += `\n  SHA-256 : ${info.fp256}`;
                }
                if (info.sans.length) {
                    detail += `\n\nSAN (Subject Alternative Names)\n${info.sans.map(s => '  ' + s).join('\n')}`;
                }
                if (info.modulus) {
                    const mod = info.modulus;
                    detail += `\n\nModulus (${Math.round(mod.length * 4)} bits)\n  ${mod.match(/.{1,64}/g).join('\n  ')}`;
                }

                const label = `Certificat ${certs.length > 1 ? (idx + 1) + '/' + certs.length : ''}${role}`;
                const w = createResultItem('fas fa-certificate', label, detail, 'info', `cert-${idx + 1}.pem`, true);

                // Also add the raw PEM as download
                const dlBtn = document.createElement('button');
                dlBtn.className = 'btn btn-sm ms-1';
                dlBtn.title = 'Télécharger le PEM';
                dlBtn.innerHTML = '<i class="fas fa-file-download"></i>';
                dlBtn.addEventListener('click', () => downloadBlob(certPEM, `cert-${idx + 1}.pem`));
                w.el.querySelector('.btn-group')?.appendChild(dlBtn);

                certdResultsInner.appendChild(w.el);
            });

            // Key match check
            if (keyPem) {
                let matchText, matchIcon;
                try {
                    const match = checkKeyMatch(certs[0], keyPem);
                    if (match === true)  { matchText = '✔ La clé privée correspond au certificat.'; matchIcon = 'fas fa-check-circle'; }
                    else if (match === false) { matchText = '✘ La clé privée NE correspond PAS au certificat.'; matchIcon = 'fas fa-times-circle'; }
                    else { matchText = 'Impossible de comparer (type de clé non supporté).'; matchIcon = 'fas fa-question-circle'; }
                } catch(e) {
                    matchText = 'Erreur lors de la vérification : ' + e.message;
                    matchIcon = 'fas fa-exclamation-triangle';
                }
                const wMatch = createResultItem(matchIcon, 'Correspondance clé / certificat', matchText, 'info', null);
                certdResultsInner.appendChild(wMatch.el);
            }

            certdResultsBlock.style.display = '';
        } catch(e) {
            certdError.textContent = 'Erreur de décodage : ' + e.message;
            certdError.classList.remove('d-none');
            console.error(e);
        }
    });

    certdClearBtn?.addEventListener('click', function() {
        certdPem.value = '';
        certdKey.value = '';
        certdKey.style.filter = 'blur(4px)';
        keyHidden = true;
        certdKeyToggle.querySelector('i').className = 'fas fa-eye';
        certdError.classList.add('d-none');
        certdResultsBlock.style.display = 'none';
        certdResultsInner.innerHTML = '';
        updateCertdCmd();
    });

    updateCertdCmd();
}
