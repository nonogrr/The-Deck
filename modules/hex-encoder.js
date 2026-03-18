import { copyToClipboard, downloadBlob, createResultItem } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-hashtag me-2"></i> Hex (Base16)</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <div class="mb-3">
                <label class="form-label">Texte ou valeur hexadécimale</label>
                <textarea class="form-control" id="hex-input" rows="4" placeholder="Texte à encoder, ou valeur hexadécimale à décoder..."></textarea>
            </div>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-custom-primary" id="encode-hex">
                    <i class="fas fa-arrow-right me-2"></i> Encoder
                </button>
                <button class="btn btn-outline-primary" id="decode-hex">
                    <i class="fas fa-arrow-left me-2"></i> Décoder
                </button>
                <button class="btn btn-outline-secondary" id="clear-hex">
                    <i class="fas fa-times me-2"></i> Effacer
                </button>
            </div>
            <div id="hex-error" class="alert alert-danger mt-3 d-none"></div>
        </div>

        <!-- ── Block 2 : Linux command ──────────────────────────────────── -->
        <div class="cmd-block">
            <div class="cmd-block-inner">
                <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                <pre id="hex-cmd">echo -n "text" | xxd -p</pre>
            </div>
            <button class="btn btn-sm btn-outline-warning" id="copy-hex-cmd" title="Copier la commande">
                <i class="fas fa-copy"></i>
            </button>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="hex-results-block" style="display:none;">
            <div id="hex-results-inner"></div>
        </div>

    </div>
</div>
`;

export function init() {
    const hexInput        = document.getElementById('hex-input');
    const hexResultsBlock = document.getElementById('hex-results-block');
    const hexResultsInner = document.getElementById('hex-results-inner');
    const hexCmd          = document.getElementById('hex-cmd');
    const hexError        = document.getElementById('hex-error');
    let widget = null;

    function showError(msg) {
        hexError.textContent = msg;
        hexError.classList.remove('d-none');
    }

    function updateCmd(mode) {
        if (!hexCmd) return;
        const val = hexInput.value;
        if (!val) { hexCmd.textContent = `echo -n "text" | xxd -p`; return; }
        if (mode === 'decode') {
            hexCmd.textContent = `printf '%s' "${val.trim()}" | xxd -r -p`;
        } else {
            hexCmd.textContent = `echo -n ${JSON.stringify(val)} | xxd -p`;
        }
    }

    function showResult(text, mode) {
        hexError.classList.add('d-none');
        if (!widget) {
            widget = createResultItem('fas fa-hashtag', 'Résultat', text, 'info', 'hex.txt');
            hexResultsInner.innerHTML = '';
            hexResultsInner.appendChild(widget.el);
        } else {
            widget.pre.textContent = text;
        }
        hexResultsBlock.style.display = '';
        updateCmd(mode);
    }

    hexInput?.addEventListener('input', () => updateCmd('encode'));

    document.getElementById('encode-hex')?.addEventListener('click', () => {
        const input = hexInput.value;
        if (!input) return;
        showResult(
            Array.from(new TextEncoder().encode(input))
                .map(b => b.toString(16).padStart(2, '0')).join(''),
            'encode'
        );
    });

    document.getElementById('decode-hex')?.addEventListener('click', () => {
        const input = hexInput.value.trim().replace(/\s+/g, '');
        if (!input) return;
        if (!/^[0-9a-fA-F]+$/.test(input) || input.length % 2 !== 0) {
            showError('Erreur : valeur hexadécimale invalide (caractères non-hex ou longueur impaire).');
            return;
        }
        try {
            const bytes = new Uint8Array(input.length / 2);
            for (let i = 0; i < input.length; i += 2) bytes[i / 2] = parseInt(input.substr(i, 2), 16);
            showResult(new TextDecoder().decode(bytes), 'decode');
        } catch(e) {
            showError('Erreur : impossible de décoder cette valeur.');
        }
    });

    document.getElementById('clear-hex')?.addEventListener('click', () => {
        hexInput.value = '';
        hexResultsBlock.style.display = 'none';
        hexResultsInner.innerHTML = '';
        hexError.classList.add('d-none');
        widget = null;
        if (hexCmd) hexCmd.textContent = `echo -n "text" | xxd -p`;
    });

    document.getElementById('copy-hex-cmd')?.addEventListener('click', function() {
        copyToClipboard(hexCmd.textContent, this);
    });
}
