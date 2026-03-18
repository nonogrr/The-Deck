// ─── Module registry ─────────────────────────────────────────────────────────
const moduleMap = {
    'home':               () => import('./modules/home.js'),
    'token-generator':    () => import('./modules/token-generator.js'),
    'hash-text':          () => import('./modules/hash-hmac.js'),
    'bcrypt-generator':   () => import('./modules/bcrypt.js'),
    'key-generator':      () => import('./modules/key-generator.js'),
    'uuid-generator':     () => import('./modules/uuid-generator.js'),
    'base64':             () => import('./modules/base64.js'),
    'hex-encoder':        () => import('./modules/hex-encoder.js'),
    'jwt-decoder':        () => import('./modules/jwt.js'),
    'cert-generator':     () => import('./modules/cert-generator.js'),
    'color-picker':       () => import('./modules/color-picker.js'),
    'datetime-converter': () => import('./modules/datetime-converter.js'),
    'device-info':        () => import('./modules/device-info.js'),
    'http-codes':         () => import('./modules/http-codes.js'),
    'subnet-calculator':  () => import('./modules/subnet-calculator.js'),
    'diff-tools':         () => import('./modules/diff-tools.js'),
};

// ─── Router ───────────────────────────────────────────────────────────────────
const mainContent = document.getElementById('main-content');

async function loadSection(sectionId) {
    const loader = moduleMap[sectionId];
    if (!loader) return;
    try {
        const mod = await loader();
        mainContent.innerHTML = mod.html;
        mod.init({ navigate });
    } catch(e) {
        mainContent.innerHTML = `<div class="alert alert-danger m-3">Erreur de chargement du module <strong>${sectionId}</strong> : ${e.message}</div>`;
        console.error(e);
    }
}

// Updates sidebar active state + loads the section
function navigate(sectionId) {
    document.querySelectorAll('.nav-link[data-section]').forEach(l => l.classList.remove('active'));
    const link = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (link) link.classList.add('active');
    loadSection(sectionId);
}

function goHome(e) {
    if (e) e.preventDefault();
    document.querySelectorAll('.nav-link[data-section]').forEach(l => l.classList.remove('active'));
    loadSection('home');
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────
(function init() {

    // ── Sidebar collapse (icon-only mode) ───────────────────────────────────
    const sidebar      = document.getElementById('sidebar');
    const collapseBtn  = document.getElementById('sidebar-collapse-btn');
    const sidebarState = localStorage.getItem('sidebar') === 'collapsed';

    function setSidebarCollapsed(collapsed) {
        const icon = collapseBtn?.querySelector('i');
        if (collapsed) {
            sidebar?.classList.add('collapsed');
            if (icon) { icon.className = 'fas fa-angles-right'; }
            localStorage.setItem('sidebar', 'collapsed');
        } else {
            sidebar?.classList.remove('collapsed');
            if (icon) { icon.className = 'fas fa-angles-left'; }
            localStorage.setItem('sidebar', 'expanded');
        }
    }

    setSidebarCollapsed(sidebarState);

    collapseBtn?.addEventListener('click', () => {
        setSidebarCollapsed(!sidebar.classList.contains('collapsed'));
    });

    // ── Theme toggle ────────────────────────────────────────────────────────
    const themeBtn   = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    themeBtn?.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // ── Sidebar nav links ───────────────────────────────────────────────────
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigate(this.getAttribute('data-section'));
        });
    });

    // Brand → home
    document.getElementById('home-link')?.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.nav-link[data-section]').forEach(l => l.classList.remove('active'));
        loadSection('home');
    });

    // ── Live search ─────────────────────────────────────────────────────────
    const searchInput    = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-dropdown');

    // Build tool list from sidebar
    const tools = Array.from(document.querySelectorAll('.nav-link[data-section]')).map(el => ({
        id:   el.getAttribute('data-section'),
        name: el.querySelector('.menu-text')?.textContent?.trim() || '',
        icon: el.querySelector('i')?.className || 'fas fa-circle'
    }));

    let activeIdx = -1;

    function renderDropdown(term) {
        if (!term) { hideDropdown(); return; }
        const matches = tools.filter(t => t.name.toLowerCase().includes(term.toLowerCase()));
        activeIdx = -1;

        if (!matches.length) {
            searchDropdown.innerHTML = '<div class="search-empty">Aucun outil trouvé</div>';
        } else {
            searchDropdown.innerHTML = matches.map((t, i) =>
                `<div class="search-item" data-section="${t.id}" data-idx="${i}">
                    <i class="${t.icon}"></i>
                    <span>${t.name}</span>
                </div>`
            ).join('');
            searchDropdown.querySelectorAll('.search-item').forEach(item => {
                item.addEventListener('mousedown', e => {
                    e.preventDefault();
                    selectTool(item.getAttribute('data-section'));
                });
            });
        }
        searchDropdown.style.display = 'block';
    }

    function hideDropdown() {
        searchDropdown.style.display = 'none';
        searchDropdown.innerHTML = '';
        activeIdx = -1;
    }

    function selectTool(sectionId) {
        hideDropdown();
        searchInput.value = '';
        searchInput.blur();
        navigate(sectionId);
    }

    searchInput?.addEventListener('input', function() {
        renderDropdown(this.value.trim());
    });

    searchInput?.addEventListener('keydown', function(e) {
        const items = searchDropdown.querySelectorAll('.search-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIdx = Math.min(activeIdx + 1, items.length - 1);
            items.forEach((el, i) => el.classList.toggle('kbd-active', i === activeIdx));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIdx = Math.max(activeIdx - 1, -1);
            items.forEach((el, i) => el.classList.toggle('kbd-active', i === activeIdx));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIdx >= 0 && items[activeIdx]) {
                selectTool(items[activeIdx].getAttribute('data-section'));
            } else if (items.length === 1) {
                selectTool(items[0].getAttribute('data-section'));
            }
        } else if (e.key === 'Escape') {
            hideDropdown();
            this.blur();
        }
    });

    searchInput?.addEventListener('blur', () => setTimeout(hideDropdown, 150));

    // Ctrl+K shortcut
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput?.focus();
            searchInput?.select();
        }
    });

    // ── Load home on startup ─────────────────────────────────────────────────
    loadSection('home');
})();
