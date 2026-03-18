import { createResultItem, copyToClipboard, debounce } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-fingerprint me-2"></i> Hash / HMAC</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <div class="row g-3 mb-3">
                <div class="col-md-6">
                    <label for="hash-algo" class="form-label fw-bold">Algorithme <span class="text-danger">*</span></label>
                    <select class="form-select" id="hash-algo">
                        <option value="SHA-256">SHA-256</option>
                        <option value="SHA-512">SHA-512</option>
                        <option value="SHA-3">SHA-3 (256 bits)</option>
                        <option value="SHA-1">SHA-1</option>
                        <option value="MD5">MD5</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="hash-digest" class="form-label fw-bold">Format de sortie</label>
                    <select class="form-select" id="hash-digest">
                        <option value="hex">Hexadécimal (hex)</option>
                        <option value="base64">Base64</option>
                        <option value="base64url">Base64 URL</option>
                        <option value="base32">Base32</option>
                    </select>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Contenu source</label>
                <textarea class="form-control" id="hash-input" rows="4" placeholder="Texte à hacher..."></textarea>
            </div>
            <div class="mb-3">
                <label for="hash-secret" class="form-label fw-bold">Clé secrète <span class="text-muted fw-normal">(optionnel — active le mode HMAC)</span></label>
                <div class="input-group">
                    <input type="password" class="form-control" id="hash-secret" placeholder="Laissez vide pour un hash simple">
                    <button class="btn btn-outline-secondary" type="button" id="hash-secret-toggle" title="Afficher/Masquer">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-outline-secondary" id="hash-clear">
                    <i class="fas fa-times me-2"></i> Effacer
                </button>
            </div>
        </div>

        <!-- ── Block 2 : Linux command ──────────────────────────────────── -->
        <div class="cmd-block">
            <div class="cmd-block-inner">
                <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                <pre id="hash-cmd">echo -n "text" | sha256sum</pre>
            </div>
            <button class="btn btn-sm btn-outline-warning" id="copy-hash-cmd" title="Copier la commande">
                <i class="fas fa-copy"></i>
            </button>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="hash-results-block" style="display:none;">
            <div id="hash-results-inner"></div>
        </div>

    </div>
</div>
`;

// Commandes Linux par algorithme
const CMD_MAP = {
    'MD5':    { plain: 'md5sum',    hmac: 'md5',    openssl: 'md5'    },
    'SHA-1':  { plain: 'sha1sum',   hmac: 'sha1',   openssl: 'sha1'   },
    'SHA-256':{ plain: 'sha256sum', hmac: 'sha256', openssl: 'sha256' },
    'SHA-512':{ plain: 'sha512sum', hmac: 'sha512', openssl: 'sha512' },
    'SHA-3':  { plain: null,        hmac: 'sha3-256',openssl: 'sha3-256'},
};

export function init() {
    const hashAlgo         = document.getElementById('hash-algo');
    const hashInput        = document.getElementById('hash-input');
    const hashDigest       = document.getElementById('hash-digest');
    const hashSecret       = document.getElementById('hash-secret');
    const hashSecretToggle = document.getElementById('hash-secret-toggle');
    const hashClearBtn     = document.getElementById('hash-clear');
    const hashResultsBlock = document.getElementById('hash-results-block');
    const hashResultsInner = document.getElementById('hash-results-inner');
    const hashCmd          = document.getElementById('hash-cmd');

    hashSecretToggle?.addEventListener('click', function() {
        const isText = hashSecret.type === 'text';
        hashSecret.type = isText ? 'password' : 'text';
        this.querySelector('i').classList.toggle('fa-eye',      isText);
        this.querySelector('i').classList.toggle('fa-eye-slash', !isText);
    });

    function encodeDigest(hexValue, format) {
        switch (format) {
            case 'base64': {
                const bytes = hexValue.match(/.{1,2}/g).map(x => parseInt(x, 16));
                return btoa(String.fromCharCode(...bytes));
            }
            case 'base64url': {
                const bytes = hexValue.match(/.{1,2}/g).map(x => parseInt(x, 16));
                return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            }
            case 'base32': {
                const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
                let bits = '';
                for (let i = 0; i < hexValue.length; i += 2)
                    bits += parseInt(hexValue.substr(i, 2), 16).toString(2).padStart(8, '0');
                let result = '';
                for (let i = 0; i < bits.length; i += 5)
                    result += alpha[parseInt(bits.substr(i, 5).padEnd(5, '0'), 2)];
                return result;
            }
            default: return hexValue;
        }
    }

    function updateCmd(text, secret, algo) {
        if (!hashCmd) return;
        const t    = text ? JSON.stringify(text) : '"text"';
        const info = CMD_MAP[algo] || CMD_MAP['SHA-256'];

        if (secret) {
            hashCmd.textContent = `echo -n ${t} | openssl dgst -${info.openssl} -hmac ${JSON.stringify(secret)}`;
        } else if (algo === 'SHA-3') {
            hashCmd.textContent = `echo -n ${t} | openssl dgst -sha3-256`;
        } else {
            hashCmd.textContent = `echo -n ${t} | ${info.plain}`;
        }
    }

    function computeHash(text, secret, algo) {
        if (secret) {
            switch (algo) {
                case 'MD5':    return CryptoJS.HmacMD5(text, secret).toString();
                case 'SHA-1':  return CryptoJS.HmacSHA1(text, secret).toString();
                case 'SHA-256':return CryptoJS.HmacSHA256(text, secret).toString();
                case 'SHA-512':return CryptoJS.HmacSHA512(text, secret).toString();
                case 'SHA-3':  return CryptoJS.HmacSHA3(text, secret).toString();
            }
        } else {
            switch (algo) {
                case 'MD5':    return CryptoJS.MD5(text).toString();
                case 'SHA-1':  return sha1(text);
                case 'SHA-256':return CryptoJS.SHA256(text).toString();
                case 'SHA-512':return CryptoJS.SHA512(text).toString();
                case 'SHA-3':  return CryptoJS.SHA3(text).toString();
            }
        }
        return '';
    }

    let widget = null;

    const render = () => {
        const text   = hashInput?.value || '';
        const secret = hashSecret?.value || '';
        const algo   = hashAlgo?.value || 'SHA-256';
        const format = hashDigest?.value || 'hex';

        updateCmd(text, secret, algo);

        if (!text) {
            hashResultsBlock.style.display = 'none';
            hashResultsInner.innerHTML = '';
            widget = null;
            return;
        }

        const hexHash = computeHash(text, secret, algo);
        const result  = encodeDigest(hexHash, format);
        const label   = secret ? `${algo} (HMAC)` : algo;

        if (!widget) {
            widget = createResultItem('fas fa-fingerprint', label, result, 'info', `${algo.toLowerCase().replace(/[^a-z0-9]/g,'_')}.txt`);
            hashResultsInner.innerHTML = '';
            hashResultsInner.appendChild(widget.el);
        } else {
            widget.pre.textContent = result;
            const titleEl = widget.el.querySelector('.result-item-title');
            if (titleEl) titleEl.innerHTML = `<i class="fas fa-fingerprint"></i> ${label}`;
        }

        hashResultsBlock.style.display = '';
    };

    const debouncedRender = debounce(render, 200);

    hashInput?.addEventListener('input',   debouncedRender);
    hashSecret?.addEventListener('input',  debouncedRender);
    hashAlgo?.addEventListener('change',   render);
    hashDigest?.addEventListener('change', render);

    hashClearBtn?.addEventListener('click', function() {
        hashInput.value  = '';
        hashSecret.value = '';
        hashSecret.type  = 'password';
        hashSecretToggle.querySelector('i').className = 'fas fa-eye';
        hashResultsBlock.style.display = 'none';
        hashResultsInner.innerHTML = '';
        widget = null;
        updateCmd('', '', hashAlgo?.value || 'SHA-256');
    });

    document.getElementById('copy-hash-cmd')?.addEventListener('click', function() {
        copyToClipboard(hashCmd.textContent, this);
    });

    updateCmd('', '', 'SHA-256');
}
