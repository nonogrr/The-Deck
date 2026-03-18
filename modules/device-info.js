import { copyToClipboard, createResultItem } from './utils.js';

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-mobile-alt me-2"></i> Device / Browser Info</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <p class="text-muted mb-3" style="font-size:0.875rem;">Informations détectées automatiquement depuis le navigateur.</p>
            <div class="d-flex gap-2">
                <button class="btn btn-custom-primary" id="device-refresh-btn">
                    <i class="fas fa-sync me-2"></i> Rafraîchir
                </button>
            </div>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="device-results-block">
            <div id="device-results-inner"></div>
        </div>

    </div>
</div>
`;

export function init() {
    const resultsInner = document.getElementById('device-results-inner');
    const widgets = {};

    function detect() {
        const ua = navigator.userAgent;
        let browser = 'Inconnu', os = 'Inconnu';

        if (ua.includes('Firefox'))                             browser = 'Mozilla Firefox';
        else if (ua.includes('Edg'))                            browser = 'Microsoft Edge';
        else if (ua.includes('Chrome'))                         browser = 'Google Chrome';
        else if (ua.includes('Safari'))                         browser = 'Apple Safari';
        else if (ua.includes('Opera') || ua.includes('OPR'))    browser = 'Opera';

        if (ua.includes('Windows'))                             os = 'Windows';
        else if (ua.includes('Mac'))                            os = 'MacOS';
        else if (ua.includes('Linux'))                          os = 'Linux';
        else if (ua.includes('Android'))                        os = 'Android';
        else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

        return {
            'Navigateur':          browser,
            'Système':             os,
            'Résolution':          `${window.screen.width} × ${window.screen.height} px`,
            'Viewport':            `${window.innerWidth} × ${window.innerHeight} px`,
            'Langue':              navigator.language,
            'Fuseau horaire':      Intl.DateTimeFormat().resolvedOptions().timeZone,
            'Connexion':           navigator.onLine ? 'En ligne' : 'Hors ligne',
            'User Agent':          ua,
        };
    }

    const icons = {
        'Navigateur':    'fas fa-globe',
        'Système':       'fab fa-linux',
        'Résolution':    'fas fa-expand',
        'Viewport':      'fas fa-desktop',
        'Langue':        'fas fa-language',
        'Fuseau horaire':'fas fa-clock',
        'Connexion':     'fas fa-wifi',
        'User Agent':    'fas fa-code',
    };

    function render() {
        const data = detect();
        const keys = Object.keys(data);
        const needRebuild = Object.keys(widgets).length === 0;

        if (needRebuild) {
            resultsInner.innerHTML = '';
            keys.forEach(k => {
                const w = createResultItem(icons[k] || 'fas fa-info-circle', k, data[k], 'info', null);
                resultsInner.appendChild(w.el);
                widgets[k] = w;
            });
        } else {
            keys.forEach(k => { if (widgets[k]) widgets[k].pre.textContent = data[k]; });
        }
    }

    document.getElementById('device-refresh-btn')?.addEventListener('click', render);

    render();
}
