// ─── Shared utility helpers ──────────────────────────────────────────────────

export function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => { btn.innerHTML = orig; }, 1500);
    }).catch(err => console.error('Erreur copie :', err));
}

export function downloadBlob(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
}

export function createHashFormatSection(title, content, color = 'info') {
    const filename = title.toLowerCase().replace(/[\s()\/]+/g, '_') + '.txt';
    const section  = document.createElement('div');
    section.className = 'hash-format-section mb-3';
    section.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-1">
            <h6 class="mb-0 text-${color}"><i class="fas fa-fingerprint me-1"></i>${title}</h6>
            <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-${color} copy-hash-btn" title="Copier">
                    <i class="fas fa-copy"></i>
                </button>
                <button type="button" class="btn btn-outline-${color} download-hash-btn" title="Télécharger">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        </div>
        <pre class="bg-dark text-${color} p-3 rounded text-break" style="font-size:0.85rem;">${content}</pre>
    `;
    const pre = section.querySelector('pre');
    section.querySelector('.copy-hash-btn').addEventListener('click', function() {
        copyToClipboard(pre.textContent, this);
    });
    section.querySelector('.download-hash-btn').addEventListener('click', () => {
        downloadBlob(pre.textContent, filename);
    });
    return section;
}

export function createKeyFormatSection(title, content, filename, color = 'success') {
    const icon = color === 'warning'   ? 'fa-key'
               : color === 'success'   ? 'fa-lock-open'
               : color === 'info'      ? 'fa-terminal'
               : 'fa-plug-circle-bolt';
    const section = document.createElement('div');
    section.className = 'key-format-section mb-3';
    section.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-1">
            <h6 class="mb-0 text-${color}"><i class="fas ${icon} me-1"></i>${title}</h6>
            <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-${color} copy-key-btn" title="Copier">
                    <i class="fas fa-copy"></i>
                </button>
                <button type="button" class="btn btn-outline-${color} download-key-btn" title="Télécharger">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        </div>
        <pre class="bg-dark text-${color} p-3 rounded text-break" style="max-height:200px;overflow-y:auto;font-size:0.75rem;">${content}</pre>
    `;
    const pre = section.querySelector('pre');
    section.querySelector('.copy-key-btn').addEventListener('click', function() {
        copyToClipboard(pre.textContent, this);
    });
    section.querySelector('.download-key-btn').addEventListener('click', () => {
        downloadBlob(pre.textContent, filename);
    });
    return section;
}

export function createResultItem(icon, title, content, color = 'info', filename = null, scrollable = false) {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
        <div class="result-item-header">
            <h6 class="result-item-title text-${color}">
                <i class="${icon}"></i> ${title}
            </h6>
            <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-${color} ri-copy-btn" title="Copier">
                    <i class="fas fa-copy"></i>
                </button>
                ${filename ? `<button type="button" class="btn btn-outline-${color} ri-dl-btn" title="Télécharger"><i class="fas fa-download"></i></button>` : ''}
            </div>
        </div>
        <pre class="text-${color}${scrollable ? ' scrollable' : ''}">${content}</pre>
    `;
    const pre = item.querySelector('pre');
    item.querySelector('.ri-copy-btn').addEventListener('click', function() {
        copyToClipboard(pre.textContent, this);
    });
    if (filename) {
        item.querySelector('.ri-dl-btn')?.addEventListener('click', () => {
            downloadBlob(pre.textContent, filename);
        });
    }
    return { el: item, pre };
}

export const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};
