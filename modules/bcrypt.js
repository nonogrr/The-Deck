import { createResultItem, copyToClipboard } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-shield-halved me-2"></i> Bcrypt</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <div class="mb-3">
                <label for="bcrypt-input" class="form-label">Mot de passe :</label>
                <input type="password" class="form-control" id="bcrypt-input" placeholder="Entrez un mot de passe...">
            </div>
            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="bcrypt-toggle-password">
                <label class="form-check-label" for="bcrypt-toggle-password">Afficher le mot de passe</label>
            </div>
            <div class="mb-3">
                <label class="form-label">Cost factor (rounds) :</label>
                <div class="input-group" style="max-width:160px;">
                    <button class="btn btn-outline-secondary" type="button" id="bcrypt-cost-minus">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="form-control text-center" id="bcrypt-cost" min="8" max="14" value="10">
                    <button class="btn btn-outline-secondary" type="button" id="bcrypt-cost-plus">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <small class="text-muted d-block mt-1">Plus élevé = plus sécurisé mais plus lent. 10-12 recommandé.</small>
            </div>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-custom-primary" id="bcrypt-generate">
                    <i class="fas fa-shield-halved me-2"></i> Générer
                </button>
                <button class="btn btn-outline-secondary" id="bcrypt-clear">
                    <i class="fas fa-times me-2"></i> Effacer
                </button>
            </div>
        </div>

        <!-- ── Block 2 : Linux command ──────────────────────────────────── -->
        <div class="cmd-block">
            <div class="cmd-block-inner">
                <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                <pre id="bcrypt-cmd">htpasswd -bnBC 10 "" "password" | tr -d ':\n'</pre>
            </div>
            <button class="btn btn-sm btn-outline-warning" id="copy-bcrypt-cmd" title="Copier la commande">
                <i class="fas fa-copy"></i>
            </button>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="bcrypt-results-block" style="display:none;">
            <div id="bcrypt-results-inner"></div>
        </div>

    </div>
</div>
`;

export function init() {
    const bcryptInput          = document.getElementById('bcrypt-input');
    const bcryptCost           = document.getElementById('bcrypt-cost');
    const bcryptCostPlus       = document.getElementById('bcrypt-cost-plus');
    const bcryptCostMinus      = document.getElementById('bcrypt-cost-minus');
    const bcryptTogglePassword = document.getElementById('bcrypt-toggle-password');
    const bcryptGenerateBtn    = document.getElementById('bcrypt-generate');
    const bcryptClearBtn       = document.getElementById('bcrypt-clear');
    const bcryptResultsBlock   = document.getElementById('bcrypt-results-block');
    const bcryptResultsInner   = document.getElementById('bcrypt-results-inner');
    const bcryptCmd            = document.getElementById('bcrypt-cmd');

    function updateCmd() {
        const cost = bcryptCost.value || 10;
        if (bcryptCmd) bcryptCmd.textContent = `htpasswd -bnBC ${cost} "" "password" | tr -d ':\\n'`;
    }

    bcryptCostPlus?.addEventListener('click', () => {
        const v = parseInt(bcryptCost.value);
        if (v < 14) { bcryptCost.value = v + 1; updateCmd(); }
    });

    bcryptCostMinus?.addEventListener('click', () => {
        const v = parseInt(bcryptCost.value);
        if (v > 8) { bcryptCost.value = v - 1; updateCmd(); }
    });

    bcryptCost?.addEventListener('input', updateCmd);

    bcryptTogglePassword?.addEventListener('change', function() {
        bcryptInput.type = this.checked ? 'text' : 'password';
    });

    let widget = null;

    bcryptGenerateBtn?.addEventListener('click', function() {
        const password = bcryptInput.value;
        if (!password) {
            bcryptResultsBlock.style.display = 'none';
            return;
        }
        const cost = parseInt(bcryptCost.value || 10);

        bcryptResultsInner.innerHTML = '<div class="result-item"><pre class="text-info">Génération en cours…</pre></div>';
        bcryptResultsBlock.style.display = '';
        widget = null;

        if (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) {
            dcodeIO.bcrypt.hash(password, cost, (err, hash) => {
                bcryptResultsInner.innerHTML = '';
                if (err) {
                    bcryptResultsInner.innerHTML = '<div class="result-item"><pre class="text-danger">Erreur lors du hachage</pre></div>';
                    return;
                }
                widget = createResultItem('fas fa-shield-halved', 'Bcrypt Hash', hash, 'success', 'bcrypt.txt');
                bcryptResultsInner.appendChild(widget.el);
            });
        } else {
            bcryptResultsInner.innerHTML = '<div class="result-item"><pre class="text-danger">Librairie bcrypt non disponible</pre></div>';
        }
    });

    bcryptClearBtn?.addEventListener('click', function() {
        bcryptInput.value = '';
        bcryptResultsBlock.style.display = 'none';
        bcryptResultsInner.innerHTML = '';
        widget = null;
    });

    document.getElementById('copy-bcrypt-cmd')?.addEventListener('click', function() {
        copyToClipboard(bcryptCmd.textContent, this);
    });

    updateCmd();
}
