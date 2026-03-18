import { copyToClipboard, downloadBlob } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-code-compare me-2"></i> Diff Tools</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <div class="row g-3 mb-3">
                <div class="col-md-6">
                    <label for="diff-a" class="form-label fw-bold">Texte A <span class="text-muted fw-normal">(référence)</span></label>
                    <textarea class="form-control font-monospace" id="diff-a" rows="12"
                        placeholder="Collez le texte original ici…" spellcheck="false"></textarea>
                </div>
                <div class="col-md-6">
                    <label for="diff-b" class="form-label fw-bold">Texte B <span class="text-muted fw-normal">(comparé)</span></label>
                    <textarea class="form-control font-monospace" id="diff-b" rows="12"
                        placeholder="Collez le texte modifié ici…" spellcheck="false"></textarea>
                </div>
            </div>
            <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
                <div class="form-check mb-0">
                    <input class="form-check-input" type="checkbox" id="diff-ignore-ws">
                    <label class="form-check-label" for="diff-ignore-ws">Ignorer les espaces en fin de ligne</label>
                </div>
                <div class="form-check mb-0">
                    <input class="form-check-input" type="checkbox" id="diff-ignore-case">
                    <label class="form-check-label" for="diff-ignore-case">Ignorer la casse</label>
                </div>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-custom-primary" id="diff-compare-btn">
                    <i class="fas fa-code-compare me-2"></i> Comparer
                </button>
                <button class="btn btn-outline-secondary" id="diff-clear-btn">
                    <i class="fas fa-times me-2"></i> Effacer
                </button>
            </div>
            <div id="diff-error" class="alert alert-danger mt-3 d-none"></div>
        </div>

        <!-- ── Block 2 : Linux command ──────────────────────────────────── -->
        <div class="cmd-block">
            <div class="cmd-block-inner">
                <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                <pre id="diff-cmd">diff -u file_a.txt file_b.txt</pre>
            </div>
            <button class="btn btn-sm btn-outline-warning" id="copy-diff-cmd" title="Copier la commande">
                <i class="fas fa-copy"></i>
            </button>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="diff-results-block" style="display:none;">
            <div class="result-item">
                <div class="result-item-header">
                    <h6 class="result-item-title"><i class="fas fa-code-compare me-1"></i> Résultat</h6>
                    <div class="d-flex align-items-center gap-2">
                        <span id="diff-stat" class="font-monospace" style="font-size:0.78rem;"></span>
                        <button class="btn btn-sm" id="diff-copy-result" title="Copier le diff unifié"><i class="fas fa-copy"></i></button>
                        <button class="btn btn-sm" id="diff-download-result" title="Télécharger .patch"><i class="fas fa-download"></i></button>
                    </div>
                </div>
                <div class="diff-table-wrap">
                    <table class="diff-table">
                        <colgroup>
                            <col class="diff-col-ln">
                            <col class="diff-col-content">
                            <col class="diff-col-ln">
                            <col class="diff-col-content">
                        </colgroup>
                        <thead>
                            <tr>
                                <th class="diff-th-ln">#</th>
                                <th>Texte A — référence</th>
                                <th class="diff-th-ln">#</th>
                                <th>Texte B — comparé</th>
                            </tr>
                        </thead>
                        <tbody id="diff-tbody"></tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</div>
`;

// ─── LCS (line-by-line) ───────────────────────────────────────────────────────

function lcsBacktrack(normA, normB) {
    const m = normA.length, n = normB.length;
    let prev = new Int32Array(n + 1);
    const table = [prev.slice()];
    for (let i = 1; i <= m; i++) {
        const curr = new Int32Array(n + 1);
        for (let j = 1; j <= n; j++) {
            curr[j] = normA[i - 1] === normB[j - 1]
                ? prev[j - 1] + 1
                : Math.max(curr[j - 1], prev[j]);
        }
        table.push(curr.slice());
        prev = curr;
    }
    const ops = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && normA[i - 1] === normB[j - 1]) {
            ops.push('='); i--; j--;
        } else if (j > 0 && (i === 0 || table[i][j - 1] >= table[i - 1][j])) {
            ops.push('+'); j--;
        } else {
            ops.push('-'); i--;
        }
    }
    return ops.reverse();
}

// Group raw ops into display rows, pairing consecutive deletes+inserts as "change"
function groupOps(ops, rawA, rawB) {
    const rows = [];
    let ia = 0, ib = 0, k = 0;
    while (k < ops.length) {
        if (ops[k] === '=') {
            rows.push({ type: 'equal', left: rawA[ia], right: rawB[ib] });
            ia++; ib++; k++;
        } else {
            const dels = [], ins = [];
            while (k < ops.length && ops[k] === '-') { dels.push(rawA[ia++]); k++; }
            while (k < ops.length && ops[k] === '+') { ins.push(rawB[ib++]); k++; }
            const maxLen = Math.max(dels.length, ins.length);
            for (let j = 0; j < maxLen; j++) {
                if (j < dels.length && j < ins.length) rows.push({ type: 'change',  left: dels[j], right: ins[j] });
                else if (j < dels.length)              rows.push({ type: 'delete',  left: dels[j], right: null   });
                else                                   rows.push({ type: 'insert',  left: null,    right: ins[j] });
            }
        }
    }
    return rows;
}

// Character-level highlight for changed lines (common prefix/suffix approach)
function charHighlight(a, b) {
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    if (a.length > 500 || b.length > 500) return { l: esc(a), r: esc(b) };
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    let j = 0;
    const maxJ = Math.min(a.length - i, b.length - i);
    while (j < maxJ && a[a.length - 1 - j] === b[b.length - 1 - j]) j++;
    const wrap = (s, cls) => s ? `<mark class="${cls}">${esc(s)}</mark>` : '';
    return {
        l: esc(a.slice(0, i)) + wrap(a.slice(i, j > 0 ? a.length - j : undefined), 'diff-char-del') + esc(j > 0 ? a.slice(a.length - j) : ''),
        r: esc(b.slice(0, i)) + wrap(b.slice(i, j > 0 ? b.length - j : undefined), 'diff-char-ins') + esc(j > 0 ? b.slice(b.length - j) : ''),
    };
}

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function makeRow(type, leftLn, leftHtml, rightLn, rightHtml) {
    const tr = document.createElement('tr');
    tr.className = `diff-row-${type}`;

    const tdll = document.createElement('td'); tdll.className = 'diff-ln diff-left-ln';
    tdll.textContent = leftLn ?? '';

    const tdlc = document.createElement('td'); tdlc.className = 'diff-cell diff-left-cell';
    tdlc.innerHTML = leftHtml ?? '';

    const tdrl = document.createElement('td'); tdrl.className = 'diff-ln diff-right-ln';
    tdrl.textContent = rightLn ?? '';

    const tdrc = document.createElement('td'); tdrc.className = 'diff-cell diff-right-cell';
    tdrc.innerHTML = rightHtml ?? '';

    tr.append(tdll, tdlc, tdrl, tdrc);
    return tr;
}

// ─── init ─────────────────────────────────────────────────────────────────────

export function init() {
    const diffA       = document.getElementById('diff-a');
    const diffB       = document.getElementById('diff-b');
    const ignoreWs   = document.getElementById('diff-ignore-ws');
    const ignoreCase = document.getElementById('diff-ignore-case');
    const compareBtn = document.getElementById('diff-compare-btn');
    const clearBtn   = document.getElementById('diff-clear-btn');
    const diffError        = document.getElementById('diff-error');
    const diffResultsBlock = document.getElementById('diff-results-block');
    const diffStat         = document.getElementById('diff-stat');
    const diffTbody  = document.getElementById('diff-tbody');
    const diffCmd    = document.getElementById('diff-cmd');

    let patchText = '';

    function updateCmd() {
        if (!diffCmd) return;
        const ws = ignoreWs.checked   ? ' --strip-trailing-cr' : '';
        const ic = ignoreCase.checked ? ' -i' : '';
        diffCmd.textContent = `diff -u${ic}${ws} file_a.txt file_b.txt`;
    }
    ignoreWs.addEventListener('change', updateCmd);
    ignoreCase.addEventListener('change', updateCmd);
    document.getElementById('copy-diff-cmd')?.addEventListener('click', function() {
        copyToClipboard(diffCmd.textContent, this);
    });

    compareBtn?.addEventListener('click', function() {
        diffError.classList.add('d-none');

        const rawA = diffA.value, rawB = diffB.value;
        if (!rawA && !rawB) {
            diffError.textContent = 'Veuillez saisir du texte dans les deux champs.';
            diffError.classList.remove('d-none');
            return;
        }

        const normalize = s => {
            let v = s;
            if (ignoreWs.checked)   v = v.replace(/[ \t]+$/mg, '');
            if (ignoreCase.checked) v = v.toLowerCase();
            return v;
        };

        const normLinesA = normalize(rawA).split('\n');
        const normLinesB = normalize(rawB).split('\n');
        const rawLinesA  = rawA.split('\n');
        const rawLinesB  = rawB.split('\n');

        if (normLinesA.length + normLinesB.length > 4000) {
            diffError.textContent = 'Textes trop longs (max 4000 lignes au total).';
            diffError.classList.remove('d-none');
            return;
        }

        const ops  = lcsBacktrack(normLinesA, normLinesB);
        const rows = groupOps(ops, rawLinesA, rawLinesB);

        diffTbody.innerHTML = '';
        let lnA = 1, lnB = 1;
        let added = 0, deleted = 0, changed = 0;
        const patchLines = ['--- Texte A', '+++ Texte B'];

        rows.forEach(row => {
            let tr;
            switch (row.type) {
                case 'equal':
                    tr = makeRow('equal', lnA++, esc(row.left), lnB++, esc(row.right));
                    patchLines.push(' ' + row.left);
                    break;
                case 'delete':
                    tr = makeRow('delete', lnA++, esc(row.left), null, '');
                    patchLines.push('-' + row.left);
                    deleted++;
                    break;
                case 'insert':
                    tr = makeRow('insert', null, '', lnB++, esc(row.right));
                    patchLines.push('+' + row.right);
                    added++;
                    break;
                case 'change': {
                    const h = charHighlight(row.left, row.right);
                    tr = makeRow('change', lnA++, h.l, lnB++, h.r);
                    patchLines.push('-' + row.left);
                    patchLines.push('+' + row.right);
                    changed++;
                    break;
                }
            }
            diffTbody.appendChild(tr);
        });

        patchText = patchLines.join('\n');

        // Stat
        const statParts = [];
        if (!added && !deleted && !changed) {
            statParts.push('Aucune différence');
        } else {
            if (changed) statParts.push(`<span style="color:#b8860b;">~${changed} modifiée${changed>1?'s':''}</span>`);
            if (added)   statParts.push(`<span style="color:#2e7d32;">+${added} ajoutée${added>1?'s':''}</span>`);
            if (deleted) statParts.push(`<span style="color:#c62828;">-${deleted} supprimée${deleted>1?'s':''}</span>`);
        }
        diffStat.innerHTML = statParts.join(' &nbsp;·&nbsp; ');
        diffResultsBlock.style.display = '';
    });

    document.getElementById('diff-copy-result')?.addEventListener('click', function() {
        copyToClipboard(patchText, this);
    });

    document.getElementById('diff-download-result')?.addEventListener('click', () => {
        downloadBlob(patchText, 'diff.patch', 'text/plain');
    });

    clearBtn?.addEventListener('click', () => {
        diffA.value = '';
        diffB.value = '';
        diffTbody.innerHTML = '';
        diffStat.innerHTML  = '';
        patchText = '';
        diffError.classList.add('d-none');
        diffResultsBlock.style.display = 'none';
    });

    updateCmd();
}
