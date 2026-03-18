import { copyToClipboard, downloadBlob, createResultItem } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-dice me-2"></i> UUID Generator</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <div class="row g-3 mb-3">
                <div class="col-md-6">
                    <label for="uuid-version" class="form-label fw-bold">Version UUID <span class="text-danger">*</span></label>
                    <select class="form-select" id="uuid-version">
                        <option value="4">v4 — Aléatoire (RFC 4122)</option>
                        <option value="7">v7 — Temporel ordonné (RFC 9562)</option>
                        <option value="1">v1 — Temporel horodaté (RFC 4122)</option>
                        <option value="5">v5 — Basé sur un nom / SHA-1 (RFC 4122)</option>
                        <option value="3">v3 — Basé sur un nom / MD5 (RFC 4122)</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="uuid-count" class="form-label fw-bold">Quantité <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="uuid-count" min="1" max="100" value="1">
                    <small class="text-muted">Entre 1 et 100</small>
                </div>
            </div>
            <div class="row g-3 mb-3" id="uuid-namespace-section" style="display:none;">
                <div class="col-md-6">
                    <label for="uuid-namespace" class="form-label fw-bold">Namespace <span class="text-danger">*</span></label>
                    <select class="form-select" id="uuid-namespace">
                        <option value="dns">DNS — 6ba7b810-9dad-11d1-80b4-00c04fd430c8</option>
                        <option value="url">URL — 6ba7b811-9dad-11d1-80b4-00c04fd430c8</option>
                        <option value="oid">OID — 6ba7b812-9dad-11d1-80b4-00c04fd430c8</option>
                        <option value="x500">X500 — 6ba7b814-9dad-11d1-80b4-00c04fd430c8</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label for="uuid-name" class="form-label fw-bold">Nom <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="uuid-name" placeholder="exemple.com">
                </div>
            </div>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-custom-primary" id="uuid-generate">
                    <i class="fas fa-dice me-2"></i> Générer
                </button>
                <button class="btn btn-outline-secondary" id="uuid-clear">
                    <i class="fas fa-times me-2"></i> Effacer
                </button>
            </div>
        </div>

        <!-- ── Block 2 : Linux command ──────────────────────────────────── -->
        <div class="cmd-block">
            <div class="cmd-block-inner">
                <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                <pre id="uuid-cmd">python3 -c "import uuid; print(uuid.uuid4())"</pre>
            </div>
            <button class="btn btn-sm btn-outline-warning" id="copy-uuid-cmd" title="Copier la commande">
                <i class="fas fa-copy"></i>
            </button>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="uuid-results-block" style="display:none;">
            <div id="uuid-results-inner"></div>
        </div>

    </div>
</div>
`;

export function init() {
    const uuidVersion      = document.getElementById('uuid-version');
    const uuidCount        = document.getElementById('uuid-count');
    const uuidNsSec        = document.getElementById('uuid-namespace-section');
    const uuidNs           = document.getElementById('uuid-namespace');
    const uuidName         = document.getElementById('uuid-name');
    const uuidGenBtn       = document.getElementById('uuid-generate');
    const uuidClearBtn     = document.getElementById('uuid-clear');
    const uuidResultsBlock = document.getElementById('uuid-results-block');
    const uuidResultsInner = document.getElementById('uuid-results-inner');
    const uuidCmd          = document.getElementById('uuid-cmd');

    const NS = {
        dns:  '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        url:  '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
        oid:  '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
        x500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8'
    };

    const NS_PYTHON = { dns: 'NAMESPACE_DNS', url: 'NAMESPACE_URL', oid: 'NAMESPACE_OID', x500: 'NAMESPACE_X500' };

    function updateCmd() {
        if (!uuidCmd) return;
        const ver  = uuidVersion?.value;
        const name = uuidName?.value.trim() || 'example.com';
        const ns   = NS_PYTHON[uuidNs?.value] || 'NAMESPACE_DNS';
        if      (ver === '4') uuidCmd.textContent = `python3 -c "import uuid; print(uuid.uuid4())"`;
        else if (ver === '7') uuidCmd.textContent = `python3 -c "import uuid6; print(uuid6.uuid7())"  # pip install uuid6`;
        else if (ver === '1') uuidCmd.textContent = `python3 -c "import uuid; print(uuid.uuid1())"`;
        else if (ver === '5') uuidCmd.textContent = `python3 -c "import uuid; print(uuid.uuid5(uuid.${ns}, ${JSON.stringify(name)}))"`;
        else if (ver === '3') uuidCmd.textContent = `python3 -c "import uuid; print(uuid.uuid3(uuid.${ns}, ${JSON.stringify(name)}))"`;
        else                  uuidCmd.textContent = `python3 -c "import uuid; print(uuid.uuid4())"`;
    }

    uuidVersion?.addEventListener('change', function() {
        uuidNsSec.style.display = (this.value === '3' || this.value === '5') ? '' : 'none';
        updateCmd();
    });
    uuidNs?.addEventListener('change', updateCmd);
    uuidName?.addEventListener('input', updateCmd);

    function uuidToBytes(uuid) {
        const h = uuid.replace(/-/g, '');
        return Array.from({ length: 16 }, (_, i) => parseInt(h.substr(i * 2, 2), 16));
    }

    function applyVersionVariant(hashHex, version) {
        const h  = hashHex.slice(0, 32);
        const v  = ((parseInt(h[12], 16) & 0x0F) | (version << 4)).toString(16);
        const va = ((parseInt(h[16], 16) & 0x3F) | 0x80).toString(16);
        return `${h.slice(0,8)}-${h.slice(8,12)}-${v}${h.slice(13,16)}-${va}${h.slice(17,20)}-${h.slice(20,32)}`;
    }

    function genV1() {
        const t   = BigInt(Date.now()) * 10000n + 122192928000000000n;
        const tl  = (t & 0xFFFFFFFFn).toString(16).padStart(8, '0');
        const tm  = ((t >> 32n) & 0xFFFFn).toString(16).padStart(4, '0');
        const th  = (((t >> 48n) & 0x0FFFn) | 0x1000n).toString(16).padStart(4, '0');
        const clk = ((Math.random() * 0x3FFF | 0) | 0x8000).toString(16).padStart(4, '0');
        const node = Array.from(crypto.getRandomValues(new Uint8Array(6)))
                         .map(b => b.toString(16).padStart(2, '0')).join('');
        return `${tl}-${tm}-${th}-${clk}-${node}`;
    }

    function genV4() {
        if (crypto.randomUUID) return crypto.randomUUID();
        return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
    }

    function genV3(nsKey, name) {
        const data = new Uint8Array([...uuidToBytes(NS[nsKey]), ...new TextEncoder().encode(name)]);
        const hash = CryptoJS.MD5(CryptoJS.lib.WordArray.create(data)).toString();
        return applyVersionVariant(hash, 3);
    }

    function genV5(nsKey, name) {
        const data = new Uint8Array([...uuidToBytes(NS[nsKey]), ...new TextEncoder().encode(name)]);
        const hash = sha1(data);
        return applyVersionVariant(hash, 5);
    }

    function genV7() {
        const tsHex   = BigInt(Date.now()).toString(16).padStart(12, '0');
        const rand    = crypto.getRandomValues(new Uint8Array(10));
        const verRand = (0x7000 | ((rand[0] & 0x0F) << 8 | rand[1])).toString(16).padStart(4, '0');
        rand[2] = (rand[2] & 0x3F) | 0x80;
        const randB = Array.from(rand.slice(2)).map(b => b.toString(16).padStart(2, '0')).join('');
        return `${tsHex.slice(0,8)}-${tsHex.slice(8,12)}-${verRand}-${randB.slice(0,4)}-${randB.slice(4)}`;
    }

    function generateOne(ver, nsKey, name) {
        switch (ver) {
            case '1': return genV1();
            case '3': return genV3(nsKey, name);
            case '4': return genV4();
            case '5': return genV5(nsKey, name);
            case '7': return genV7();
            default:  return genV4();
        }
    }

    let lastUUIDs = [];

    uuidGenBtn?.addEventListener('click', function() {
        const ver   = uuidVersion.value;
        const count = Math.min(100, Math.max(1, parseInt(uuidCount.value) || 1));
        const nsKey = uuidNs?.value || 'dns';
        const name  = uuidName?.value.trim() || '';

        uuidResultsInner.innerHTML = '';

        if ((ver === '3' || ver === '5') && !name) {
            uuidResultsInner.innerHTML = '<div class="alert alert-danger m-2">Un nom est requis pour les versions v3 et v5.</div>';
            uuidResultsBlock.style.display = '';
            return;
        }

        lastUUIDs = Array.from({ length: count }, () => generateOne(ver, nsKey, name));

        const w = createResultItem('fas fa-dice', `UUID${count > 1 ? 's' : ''} (${count})`, lastUUIDs.join('\n'), 'info', 'uuids.txt');
        uuidResultsInner.appendChild(w.el);

        // Ajouter des boutons de copie individuels sous le <pre> si count > 1
        if (count > 1) {
            const listDiv = document.createElement('div');
            listDiv.style.cssText = 'font-family:"Roboto Mono","SF Mono","Consolas",monospace;font-size:0.8rem;margin-top:0.5rem;';
            lastUUIDs.forEach(uuid => {
                const row = document.createElement('div');
                row.className = 'd-flex align-items-center justify-content-between gap-2 mb-1';
                const span = document.createElement('span');
                span.textContent = uuid;
                const btn = document.createElement('button');
                btn.className = 'btn btn-sm flex-shrink-0';
                btn.title     = 'Copier';
                btn.innerHTML = '<i class="fas fa-copy"></i>';
                btn.addEventListener('click', function() { copyToClipboard(uuid, this); });
                row.appendChild(span);
                row.appendChild(btn);
                listDiv.appendChild(row);
            });
            w.el.appendChild(listDiv);
        }

        uuidResultsBlock.style.display = '';
    });

    uuidClearBtn?.addEventListener('click', function() {
        lastUUIDs = [];
        uuidResultsInner.innerHTML = '';
        uuidResultsBlock.style.display = 'none';
    });

    document.getElementById('copy-uuid-cmd')?.addEventListener('click', function() {
        copyToClipboard(uuidCmd.textContent, this);
    });

    updateCmd();
}
