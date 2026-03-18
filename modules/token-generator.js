import { copyToClipboard, downloadBlob, createResultItem } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-key me-2"></i> Token Generator</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <div class="mb-3">
                <label for="token-length-range" class="form-label">Longueur : <span id="token-length-value">32</span></label>
                <input type="range" class="form-range" id="token-length-range" min="1" max="512" value="32">
            </div>
            <div class="mb-3">
                <div class="form-check form-switch mb-2">
                    <input class="form-check-input" type="checkbox" id="uppercase" checked>
                    <label class="form-check-label" for="uppercase">Majuscules (A-Z)</label>
                </div>
                <div class="form-check form-switch mb-2">
                    <input class="form-check-input" type="checkbox" id="lowercase" checked>
                    <label class="form-check-label" for="lowercase">Minuscules (a-z)</label>
                </div>
                <div class="form-check form-switch mb-2">
                    <input class="form-check-input" type="checkbox" id="numbers" checked>
                    <label class="form-check-label" for="numbers">Chiffres (0-9)</label>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="symbols">
                    <label class="form-check-label" for="symbols">Symboles (!@#$...)</label>
                </div>
            </div>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-custom-primary" id="refresh-token">
                    <i class="fas fa-sync me-2"></i> Actualiser
                </button>
            </div>
        </div>

        <!-- ── Block 2 : Linux command ──────────────────────────────────── -->
        <div class="cmd-block">
            <div class="cmd-block-inner">
                <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                <pre id="token-cmd">openssl rand -base64 32 | head -c 32</pre>
            </div>
            <button class="btn btn-sm btn-outline-warning" id="copy-token-cmd" title="Copier la commande">
                <i class="fas fa-copy"></i>
            </button>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="token-results-block">
            <div id="token-result-item"></div>
            <div id="token-entropy-item" class="result-item" style="display:none;">
                <div class="result-item-header">
                    <h6 class="result-item-title text-secondary">
                        <i class="fas fa-shield-alt"></i> Entropie
                    </h6>
                </div>
                <pre class="text-secondary" id="token-entropy-out"></pre>
            </div>
        </div>

    </div>
</div>
`;

export function init() {
    const tokenLengthRange    = document.getElementById('token-length-range');
    const tokenLengthValue    = document.getElementById('token-length-value');
    const refreshTokenButton  = document.getElementById('refresh-token');
    const tokenResultItem     = document.getElementById('token-result-item');
    const tokenEntropyItem    = document.getElementById('token-entropy-item');
    const tokenEntropyOut     = document.getElementById('token-entropy-out');
    const tokenCmd            = document.getElementById('token-cmd');

    let currentToken = '';
    let resultWidget = null;

    function buildCharset() {
        let charset = '';
        if (document.getElementById('uppercase')?.checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (document.getElementById('lowercase')?.checked) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (document.getElementById('numbers')?.checked)   charset += '0123456789';
        if (document.getElementById('symbols')?.checked)   charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        return charset;
    }

    function updateCmd(length) {
        if (!tokenCmd) return;
        const upper   = document.getElementById('uppercase')?.checked;
        const lower   = document.getElementById('lowercase')?.checked;
        const nums    = document.getElementById('numbers')?.checked;
        const syms    = document.getElementById('symbols')?.checked;

        let charClass = '';
        if (upper) charClass += 'A-Z';
        if (lower) charClass += 'a-z';
        if (nums)  charClass += '0-9';
        if (syms)  charClass += '!@#$%^&*()_+\\-=\\[\\]{}|;:,.<>?';

        if (!charClass) {
            tokenCmd.textContent = `# Sélectionnez au moins un type de caractère`;
            return;
        }

        tokenCmd.textContent = `LC_ALL=C tr -dc '${charClass}' </dev/urandom | head -c ${length}`;
    }

    function generateToken() {
        const length  = parseInt(tokenLengthRange.value);
        const charset = buildCharset();
        updateCmd(length);

        if (!charset) {
            if (resultWidget) resultWidget.pre.textContent = 'Veuillez sélectionner au moins un type de caractère.';
            tokenEntropyItem.style.display = 'none';
            return;
        }

        const arr = crypto.getRandomValues(new Uint32Array(length));
        currentToken = Array.from(arr, v => charset[v % charset.length]).join('');

        if (!resultWidget) {
            resultWidget = createResultItem('fas fa-key', 'Token', currentToken, 'warning', 'token.txt');
            tokenResultItem.appendChild(resultWidget.el);
        } else {
            resultWidget.pre.textContent = currentToken;
        }

        const entropy     = length * Math.log2(charset.length);
        let label, color;
        if (entropy < 28)       { label = 'Très Faible';          color = 'text-danger'; }
        else if (entropy < 60)  { label = 'Faible';               color = 'text-warning'; }
        else if (entropy < 80)  { label = 'Sécurisé';             color = 'text-info'; }
        else if (entropy < 128) { label = 'Très Sécurisé';        color = 'text-success'; }
        else                    { label = 'Militaire / Futuriste'; color = 'text-primary'; }
        tokenEntropyOut.textContent = `${entropy.toFixed(1)} bits — ${label}`;
        tokenEntropyOut.className   = `text-secondary`;
        tokenEntropyItem.style.display = '';
    }

    tokenLengthRange?.addEventListener('input', function() {
        tokenLengthValue.textContent = this.value;
        generateToken();
    });

    document.querySelectorAll('input#uppercase, input#lowercase, input#numbers, input#symbols')
        .forEach(cb => cb.addEventListener('change', generateToken));

    refreshTokenButton?.addEventListener('click', generateToken);

    document.getElementById('copy-token-cmd')?.addEventListener('click', function() {
        copyToClipboard(tokenCmd.textContent, this);
    });

    generateToken();
}
