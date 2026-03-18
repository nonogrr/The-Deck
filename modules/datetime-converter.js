import { createResultItem } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-clock me-2"></i> Date-Time Converter</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="datetime-input" class="form-label fw-bold">Date / Heure <span class="text-danger">*</span></label>
                    <input type="datetime-local" class="form-control" id="datetime-input">
                </div>
                <div class="col-md-6">
                    <label for="dt-timestamp-input" class="form-label fw-bold">Unix Timestamp</label>
                    <input type="number" class="form-control font-monospace" id="dt-timestamp-input" placeholder="1700000000">
                </div>
            </div>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-custom-primary" id="dt-convert-btn">
                    <i class="fas fa-exchange-alt me-2"></i> Convertir
                </button>
                <button class="btn btn-outline-secondary" id="dt-now-btn">
                    <i class="fas fa-clock me-2"></i> Maintenant
                </button>
                <button class="btn btn-outline-secondary" id="dt-clear-btn">
                    <i class="fas fa-times me-2"></i> Effacer
                </button>
            </div>
            <div id="dt-error" class="alert alert-danger mt-3 d-none"></div>
        </div>

        <!-- ── Block 2 : Linux command ──────────────────────────────────── -->
        <div class="cmd-block">
            <div class="cmd-block-inner">
                <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                <pre id="dt-cmd">date -d "2024-01-01T00:00:00" -u "+%Y-%m-%dT%H:%M:%SZ"</pre>
            </div>
            <button class="btn btn-sm btn-outline-warning" id="copy-dt-cmd" title="Copier la commande">
                <i class="fas fa-copy"></i>
            </button>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="dt-results-block" style="display:none;">
            <div id="dt-results-inner"></div>
        </div>

    </div>
</div>
`;

export function init() {
    const datetimeInput   = document.getElementById('datetime-input');
    const timestampInput  = document.getElementById('dt-timestamp-input');
    const convertBtn      = document.getElementById('dt-convert-btn');
    const nowBtn          = document.getElementById('dt-now-btn');
    const clearBtn        = document.getElementById('dt-clear-btn');
    const dtError         = document.getElementById('dt-error');
    const dtResultsBlock  = document.getElementById('dt-results-block');
    const dtResultsInner  = document.getElementById('dt-results-inner');
    const dtCmd           = document.getElementById('dt-cmd');

    const widgets = {};

    function showError(msg) {
        dtError.textContent = msg;
        dtError.classList.remove('d-none');
    }

    function updateCmd(isoStr) {
        if (dtCmd) dtCmd.textContent = `date -d "${isoStr || '2024-01-01T00:00:00'}" -u "+%Y-%m-%dT%H:%M:%SZ"`;
    }

    function renderResults(date) {
        const values = {
            'UTC':       date.toUTCString(),
            'Local':     date.toString(),
            'ISO 8601':  date.toISOString(),
            'Timestamp': String(Math.floor(date.getTime() / 1000)),
        };
        const icons = {
            'UTC':       'fas fa-globe',
            'Local':     'fas fa-map-marker-alt',
            'ISO 8601':  'fas fa-calendar-alt',
            'Timestamp': 'fas fa-hashtag',
        };

        const needRebuild = Object.keys(widgets).length === 0;
        if (needRebuild) {
            dtResultsInner.innerHTML = '';
            Object.keys(values).forEach(k => {
                const w = createResultItem(icons[k], k, values[k], 'info', null);
                dtResultsInner.appendChild(w.el);
                widgets[k] = w;
            });
        } else {
            Object.keys(values).forEach(k => { if (widgets[k]) widgets[k].pre.textContent = values[k]; });
        }
        dtResultsBlock.style.display = '';
    }

    convertBtn?.addEventListener('click', function() {
        dtError.classList.add('d-none');
        let date;

        if (timestampInput.value.trim()) {
            const ts = parseInt(timestampInput.value.trim());
            if (isNaN(ts)) { showError('Timestamp invalide.'); return; }
            date = new Date(ts * 1000);
            datetimeInput.value = new Date(ts * 1000 - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        } else if (datetimeInput.value) {
            date = new Date(datetimeInput.value);
        } else {
            showError('Veuillez entrer une date ou un timestamp.');
            return;
        }

        if (isNaN(date.getTime())) { showError('Date invalide.'); return; }
        updateCmd(datetimeInput.value || new Date(date).toISOString().slice(0, 19));
        renderResults(date);
    });

    nowBtn?.addEventListener('click', function() {
        const now = new Date();
        datetimeInput.value = new Date(now - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        timestampInput.value = '';
        dtError.classList.add('d-none');
        updateCmd(datetimeInput.value);
        renderResults(now);
    });

    clearBtn?.addEventListener('click', function() {
        datetimeInput.value  = '';
        timestampInput.value = '';
        dtError.classList.add('d-none');
        dtResultsBlock.style.display = 'none';
        dtResultsInner.innerHTML = '';
        Object.keys(widgets).forEach(k => delete widgets[k]);
        updateCmd('');
    });

    document.getElementById('copy-dt-cmd')?.addEventListener('click', function() {
        navigator.clipboard.writeText(dtCmd.textContent).then(() => {
            const orig = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => { this.innerHTML = orig; }, 1500);
        });
    });

    datetimeInput?.addEventListener('input', () => updateCmd(datetimeInput.value));
    updateCmd('');
}
