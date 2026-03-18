import { copyToClipboard } from './utils.js';

const HTTP_CODES = [
    { code: 100, name: 'Continue',              desc: "Le serveur a reçu les en-têtes et le client peut continuer à envoyer le corps." },
    { code: 101, name: 'Switching Protocols',   desc: "Le serveur accepte de changer de protocole (ex. HTTP → WebSocket)." },
    { code: 200, name: 'OK',                    desc: "La requête a réussi." },
    { code: 201, name: 'Created',               desc: "La requête a réussi et une nouvelle ressource a été créée." },
    { code: 202, name: 'Accepted',              desc: "La requête a été acceptée mais pas encore traitée." },
    { code: 204, name: 'No Content',            desc: "La requête a réussi mais il n'y a pas de contenu à renvoyer." },
    { code: 206, name: 'Partial Content',       desc: "Le serveur renvoie une partie de la ressource (Range request)." },
    { code: 301, name: 'Moved Permanently',     desc: "La ressource a été définitivement déplacée vers une nouvelle URL." },
    { code: 302, name: 'Found',                 desc: "La ressource a été temporairement déplacée." },
    { code: 304, name: 'Not Modified',          desc: "La ressource n'a pas changé depuis la dernière requête (cache valide)." },
    { code: 307, name: 'Temporary Redirect',    desc: "Redirection temporaire en conservant la méthode HTTP." },
    { code: 308, name: 'Permanent Redirect',    desc: "Redirection permanente en conservant la méthode HTTP." },
    { code: 400, name: 'Bad Request',           desc: "La requête est malformée ou invalide." },
    { code: 401, name: 'Unauthorized',          desc: "Authentification requise." },
    { code: 403, name: 'Forbidden',             desc: "Le serveur refuse d'exécuter la requête (accès interdit)." },
    { code: 404, name: 'Not Found',             desc: "La ressource demandée n'existe pas." },
    { code: 405, name: 'Method Not Allowed',    desc: "La méthode HTTP utilisée n'est pas autorisée sur cette ressource." },
    { code: 408, name: 'Request Timeout',       desc: "Le serveur n'a pas reçu la requête complète dans le délai imparti." },
    { code: 409, name: 'Conflict',              desc: "La requête entre en conflit avec l'état actuel du serveur." },
    { code: 410, name: 'Gone',                  desc: "La ressource n'existe plus et ne reviendra pas." },
    { code: 413, name: 'Content Too Large',     desc: "Le corps de la requête dépasse la limite autorisée." },
    { code: 415, name: 'Unsupported Media Type',desc: "Le type de contenu n'est pas supporté par le serveur." },
    { code: 422, name: 'Unprocessable Entity',  desc: "La requête est bien formée mais contient des erreurs sémantiques." },
    { code: 429, name: 'Too Many Requests',     desc: "Le client a envoyé trop de requêtes dans un laps de temps donné (rate limiting)." },
    { code: 500, name: 'Internal Server Error', desc: "Le serveur a rencontré une erreur inattendue." },
    { code: 501, name: 'Not Implemented',       desc: "La méthode HTTP n'est pas supportée par le serveur." },
    { code: 502, name: 'Bad Gateway',           desc: "Le serveur agissant comme passerelle a reçu une réponse invalide." },
    { code: 503, name: 'Service Unavailable',   desc: "Le serveur est temporairement indisponible (surcharge ou maintenance)." },
    { code: 504, name: 'Gateway Timeout',       desc: "Le serveur passerelle n'a pas reçu de réponse à temps." },
];

function badgeClass(code) {
    if (code < 200) return 'bg-secondary';
    if (code < 300) return 'bg-success';
    if (code < 400) return 'bg-info text-dark';
    if (code < 500) return 'bg-warning text-dark';
    return 'bg-danger';
}

export const html = `
<div class="card mb-3 border-0 shadow-sm">
    <div class="card-header bg-custom-primary text-white">
        <h5 class="mb-0"><i class="fas fa-list-ol me-2"></i> Codes HTTP</h5>
    </div>
    <div class="card-body">

        <!-- ── Block 1 : Config ─────────────────────────────────────────── -->
        <div class="cfg-block">
            <label for="http-search" class="form-label fw-bold">Rechercher</label>
            <input type="text" class="form-control" id="http-search" placeholder="Code, nom ou description…">
        </div>

        <!-- ── Block 2 : Linux command ──────────────────────────────────── -->
        <div class="cmd-block">
            <div class="cmd-block-inner">
                <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
                <pre id="http-cmd">curl -s -o /dev/null -w "%{http_code}" https://exemple.com</pre>
            </div>
            <button class="btn btn-sm btn-outline-warning" id="copy-http-cmd" title="Copier la commande">
                <i class="fas fa-copy"></i>
            </button>
        </div>

        <!-- ── Block 3 : Results ─────────────────────────────────────────── -->
        <div class="results-block" id="http-results-block">
            <div id="http-results-inner" style="padding: 0.5rem 0;"></div>
            <div id="http-no-result" class="result-item d-none" style="color: var(--custom-text);">
                <i class="fas fa-search me-2"></i>Aucun code ne correspond à votre recherche.
            </div>
        </div>

    </div>
</div>
`;

export function init() {
    const searchInput  = document.getElementById('http-search');
    const resultsInner = document.getElementById('http-results-inner');
    const noResult     = document.getElementById('http-no-result');
    const httpCmd      = document.getElementById('http-cmd');

    function renderRows(codes) {
        resultsInner.innerHTML = '';
        codes.forEach(({ code, name, desc }) => {
            const row = document.createElement('div');
            row.className = 'result-item d-flex align-items-start gap-3';
            row.innerHTML = `
                <span class="badge ${badgeClass(code)} font-monospace flex-shrink-0" style="font-size:0.85rem;min-width:3rem;text-align:center;padding:0.35em 0.6em;">${code}</span>
                <div>
                    <div class="fw-bold" style="font-size:0.875rem;">${name}</div>
                    <div class="text-muted" style="font-size:0.8rem;">${desc}</div>
                </div>
            `;
            resultsInner.appendChild(row);
        });
        noResult.classList.toggle('d-none', codes.length > 0);
    }

    searchInput?.addEventListener('input', function() {
        const q = this.value.trim().toLowerCase();
        const filtered = q
            ? HTTP_CODES.filter(c => String(c.code).includes(q) || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
            : HTTP_CODES;
        renderRows(filtered);
    });

    document.getElementById('copy-http-cmd')?.addEventListener('click', function() {
        navigator.clipboard.writeText(httpCmd.textContent).then(() => {
            const orig = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => { this.innerHTML = orig; }, 1500);
        });
    });

    renderRows(HTTP_CODES);
}
