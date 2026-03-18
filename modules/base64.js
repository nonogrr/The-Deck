import { copyToClipboard, downloadBlob, createResultItem } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-right-left me-2"></i> Base64</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <div class="mb-3">
                <label class="form-label">Texte ou valeur Base64</label>
                <textarea class="form-control" id="base64-input" rows="4" placeholder="Texte à encoder, ou valeur Base64 à décoder..."></textarea>
            </div>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-custom-primary" id="encode-base64">
                    <i class="fas fa-lock me-2"></i> Encoder
                </button>
                <button class="btn btn-outline-primary" id="decode-base64">
                    <i class="fas fa-unlock me-2"></i> Décoder
                </button>
                <button class="btn btn-outline-secondary" id="clear-base64">
                    <i class="fas fa-times me-2"></i> Effacer
                </button>
            </div>
            <div id="base64-error" class="alert alert-danger mt-3 d-none"></div>
        </div>

        <!-- ── Block 2 : Linux command ──────────────────────────────────── -->
        <div class="cmd-block">
            <div class="cmd-block-inner">
                <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                <pre id="base64-cmd">echo -n "text" | base64</pre>
            </div>
            <button class="btn btn-sm btn-outline-warning" id="copy-base64-cmd" title="Copier la commande">
                <i class="fas fa-copy"></i>
            </button>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="base64-results-block" style="display:none;">
            <div id="base64-results-inner"></div>
        </div>

    </div>
</div>
`;

export function init() {
    const base64Input        = document.getElementById('base64-input');
    const base64ResultsBlock = document.getElementById('base64-results-block');
    const base64ResultsInner = document.getElementById('base64-results-inner');
    const base64Cmd          = document.getElementById('base64-cmd');
    const base64Error        = document.getElementById('base64-error');
    let widget = null;

    function showError(msg) {
        base64Error.textContent = msg;
        base64Error.classList.remove('d-none');
    }

    function updateCmd(mode) {
        if (!base64Cmd) return;
        const val = base64Input.value;
        if (!val) { base64Cmd.textContent = `echo -n "text" | base64`; return; }
        if (mode === 'decode') {
            base64Cmd.textContent = `echo ${JSON.stringify(val.trim())} | base64 -d`;
        } else {
            base64Cmd.textContent = `echo -n ${JSON.stringify(val)} | base64`;
        }
    }

    function showResult(text, mode) {
        base64Error.classList.add('d-none');
        if (!widget) {
            widget = createResultItem('fas fa-right-left', 'Résultat', text, 'info', 'base64.txt');
            base64ResultsInner.innerHTML = '';
            base64ResultsInner.appendChild(widget.el);
        } else {
            widget.pre.textContent = text;
        }
        base64ResultsBlock.style.display = '';
        updateCmd(mode);
    }

    base64Input?.addEventListener('input', () => updateCmd('encode'));

    document.getElementById('encode-base64')?.addEventListener('click', () => {
        if (!base64Input.value) return;
        try {
            showResult(btoa(unescape(encodeURIComponent(base64Input.value))), 'encode');
        } catch(e) {
            showError('Erreur : ' + e.message);
        }
    });

    document.getElementById('decode-base64')?.addEventListener('click', () => {
        if (!base64Input.value) return;
        try {
            showResult(decodeURIComponent(escape(atob(base64Input.value.trim()))), 'decode');
        } catch(e) {
            showError('Erreur : entrée Base64 invalide.');
        }
    });

    document.getElementById('clear-base64')?.addEventListener('click', () => {
        base64Input.value = '';
        base64ResultsBlock.style.display = 'none';
        base64ResultsInner.innerHTML = '';
        base64Error.classList.add('d-none');
        widget = null;
        if (base64Cmd) base64Cmd.textContent = `echo -n "text" | base64`;
    });

    document.getElementById('copy-base64-cmd')?.addEventListener('click', function() {
        copyToClipboard(base64Cmd.textContent, this);
    });
}
