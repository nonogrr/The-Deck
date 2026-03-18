import { createResultItem, copyToClipboard } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-file-signature me-2"></i> Key Generator</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <div class="row g-3 mb-3">
                <div class="col-md-6">
                    <label for="key-type" class="form-label fw-bold">Type de clé <span class="text-danger">*</span></label>
                    <select class="form-select" id="key-type">
                        <option value="ed25519">ED25519</option>
                        <option value="rsa">RSA</option>
                        <option value="ecdsa">ECDSA</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-bold">Taille de clé <span class="text-danger">*</span></label>
                    <div id="key-size-container">
                        <select class="form-select" id="key-size">
                            <option value="2048">RSA 2048 bits (standard marché)</option>
                            <option value="4096">RSA 4096 bits</option>
                        </select>
                    </div>
                    <div id="ecdsa-curve-container" style="display:none;">
                        <select class="form-select" id="ecdsa-curve">
                            <option value="p256">P-256 / 256 bits (standard marché)</option>
                            <option value="p384">P-384 / 384 bits</option>
                            <option value="p521">P-521 / 521 bits</option>
                        </select>
                    </div>
                    <div id="key-size-na" class="form-control bg-body-secondary text-muted" style="display:none;">—</div>
                </div>
            </div>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-custom-primary" id="generate-key">
                    <i class="fas fa-key me-2"></i> Générer
                </button>
                <button class="btn btn-outline-secondary" id="key-clear">
                    <i class="fas fa-times me-2"></i> Effacer
                </button>
            </div>
        </div>

        <!-- ── Block 2 : Linux command ──────────────────────────────────── -->
        <div class="cmd-block">
            <div class="cmd-block-inner">
                <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                <pre id="key-cmd">ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""</pre>
            </div>
            <button class="btn btn-sm btn-outline-warning" id="copy-key-cmd" title="Copier la commande">
                <i class="fas fa-copy"></i>
            </button>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="key-results-block" style="display:none;">
            <div id="key-results-inner"></div>
        </div>

    </div>
</div>
`;

export function init() {
    const keyTypeSelect       = document.getElementById('key-type');
    const keySizeContainer    = document.getElementById('key-size-container');
    const ecdsaCurveContainer = document.getElementById('ecdsa-curve-container');
    const keySizeNa           = document.getElementById('key-size-na');
    const generateKeyBtn      = document.getElementById('generate-key');
    const keyClearBtn         = document.getElementById('key-clear');
    const keyResultsBlock     = document.getElementById('key-results-block');
    const keyResultsInner     = document.getElementById('key-results-inner');
    const keyCmd              = document.getElementById('key-cmd');

    function updateCmd() {
        if (!keyCmd) return;
        const type = keyTypeSelect?.value;
        if (type === 'rsa') {
            const bits = document.getElementById('key-size')?.value || '2048';
            keyCmd.textContent = `ssh-keygen -t rsa -b ${bits} -f ~/.ssh/id_rsa -N ""`;
        } else if (type === 'ecdsa') {
            const curve = document.getElementById('ecdsa-curve')?.value || 'p256';
            const bits  = curve === 'p256' ? '256' : curve === 'p384' ? '384' : '521';
            keyCmd.textContent = `ssh-keygen -t ecdsa -b ${bits} -f ~/.ssh/id_ecdsa -N ""`;
        } else {
            keyCmd.textContent = `ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""`;
        }
    }

    function updateKeySizeVisibility(value) {
        keySizeContainer.style.display    = value === 'rsa'    ? '' : 'none';
        ecdsaCurveContainer.style.display = value === 'ecdsa'  ? '' : 'none';
        if (keySizeNa) keySizeNa.style.display = value === 'ed25519' ? '' : 'none';
        updateCmd();
    }

    keyTypeSelect?.addEventListener('change', function() { updateKeySizeVisibility(this.value); });
    document.getElementById('key-size')?.addEventListener('change', updateCmd);
    document.getElementById('ecdsa-curve')?.addEventListener('change', updateCmd);
    updateKeySizeVisibility(keyTypeSelect?.value || 'ed25519');

    generateKeyBtn?.addEventListener('click', function() {
        if (!keyResultsInner) return;
        const keyType = keyTypeSelect?.value;
        keyResultsInner.innerHTML = '<div class="result-item"><pre class="text-info">Génération de la clé en cours…</pre></div>';
        keyResultsBlock.style.display = '';
        setTimeout(() => {
            if (keyType === 'rsa')        generateRSAKey();
            else if (keyType === 'ecdsa') generateECDSAKey();
            else                          generateEd25519Key();
        }, 50);
    });

    keyClearBtn?.addEventListener('click', () => {
        keyResultsBlock.style.display = 'none';
        keyResultsInner.innerHTML = '';
    });

    document.getElementById('copy-key-cmd')?.addEventListener('click', function() {
        copyToClipboard(keyCmd.textContent, this);
    });

    function renderItems(items) {
        keyResultsInner.innerHTML = '';
        items.forEach(({ icon, title, content, color, filename, scrollable }) => {
            const w = createResultItem(icon, title, content, color, filename, scrollable);
            keyResultsInner.appendChild(w.el);
        });
        keyResultsBlock.style.display = '';
    }

    function generateRSAKey() {
        const keySize = document.getElementById('key-size')?.value || '2048';
        const encrypt = new JSEncrypt({ default_key_size: parseInt(keySize) });
        encrypt.getKey();
        const privateKey = encrypt.getPrivateKey();
        const publicKey  = encrypt.getPublicKey();
        const pubKeyLines = publicKey.split('\n').slice(1, -2).join('');
        const sshFormat  = `ssh-rsa ${pubKeyLines} generated-key`;
        const ppkFormat  = `PuTTY-User-Key-File-2: ssh-rsa\nEncryption: none\nComment: generated-key\nPublic-Lines: 1\n${btoa(publicKey)}\nPrivate-Lines: 1\n${btoa(privateKey)}\nPrivate-MAC: `;
        renderItems([
            { icon: 'fas fa-lock',         title: 'PEM — Clé Privée',   content: privateKey, color: 'warning', filename: `id_rsa_${keySize}`,     scrollable: true },
            { icon: 'fas fa-lock-open',     title: 'PEM — Clé Publique', content: publicKey,  color: 'success', filename: `id_rsa_${keySize}.pub`, scrollable: true },
            { icon: 'fas fa-terminal',      title: 'SSH — Clé Publique', content: sshFormat,  color: 'info',    filename: `id_rsa_${keySize}.pub` },
            { icon: 'fas fa-plug-circle-bolt', title: 'PPK — Format PuTTY', content: ppkFormat, color: 'secondary', filename: `id_rsa_${keySize}.ppk`, scrollable: true },
        ]);
    }

    function generateECDSAKey() {
        const curve = document.getElementById('ecdsa-curve')?.value || 'p256';
        const ec    = new elliptic.ec(curve);
        const key   = ec.genKeyPair();
        const privHex = key.getPrivate('hex').padStart(64, '0');
        const pubHex  = key.getPublic('hex');
        const privateKeyPEM = `-----BEGIN EC PRIVATE KEY-----\n${btoa(privHex)}\n-----END EC PRIVATE KEY-----`;
        const nistName = curve === 'p256' ? 'nistp256' : curve === 'p384' ? 'nistp384' : 'nistp521';
        const sshFormat  = `ecdsa-sha2-${nistName} ${btoa(pubHex)} generated-key`;
        const ppkFormat  = `PuTTY-User-Key-File-2: ecdsa-sha2-${nistName}\nEncryption: none\nComment: generated-key\nPublic-Lines: 1\n${btoa(sshFormat)}\nPrivate-Lines: 1\n${btoa(privateKeyPEM)}\nPrivate-MAC: `;
        renderItems([
            { icon: 'fas fa-lock',            title: 'PEM — Clé Privée',   content: privateKeyPEM, color: 'warning',   filename: `id_ecdsa_${curve}`,     scrollable: true },
            { icon: 'fas fa-terminal',         title: 'SSH — Clé Publique', content: sshFormat,     color: 'info',      filename: `id_ecdsa_${curve}.pub` },
            { icon: 'fas fa-plug-circle-bolt', title: 'PPK — Format PuTTY', content: ppkFormat,     color: 'secondary', filename: `id_ecdsa_${curve}.ppk`, scrollable: true },
        ]);
    }

    function generateEd25519Key() {
        const seed    = nacl.randomBytes(32);
        const keyPair = nacl.sign.keyPair.fromSeed(seed);
        const privB64 = btoa(String.fromCharCode(...seed));
        const pubB64  = btoa(String.fromCharCode(...keyPair.publicKey));
        const privateKeyPEM     = `-----BEGIN PRIVATE KEY-----\n${privB64}\n-----END PRIVATE KEY-----`;
        const privateKeyOpenSSH = `-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZWQy\nNTUxOQAAACB${pubB64}AAAAE${privB64}\n-----END OPENSSH PRIVATE KEY-----`;
        const publicKeySSH      = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI${pubB64} generated-key`;
        const ppkFormat         = `PuTTY-User-Key-File-2: ssh-ed25519\nEncryption: none\nComment: generated-key\nPublic-Lines: 1\n${btoa(publicKeySSH)}\nPrivate-Lines: 1\n${btoa(privateKeyOpenSSH)}\nPrivate-MAC: `;
        renderItems([
            { icon: 'fas fa-lock',            title: 'PEM — Clé Privée',      content: privateKeyPEM,     color: 'warning',   filename: 'id_ed25519',     scrollable: true },
            { icon: 'fas fa-lock',            title: 'OpenSSH — Clé Privée',  content: privateKeyOpenSSH, color: 'warning',   filename: 'id_ed25519',     scrollable: true },
            { icon: 'fas fa-lock-open',        title: 'SSH — Clé Publique',    content: publicKeySSH,      color: 'success',   filename: 'id_ed25519.pub' },
            { icon: 'fas fa-plug-circle-bolt', title: 'PPK — Format PuTTY',    content: ppkFormat,         color: 'secondary', filename: 'id_ed25519.ppk', scrollable: true },
        ]);
    }
}
