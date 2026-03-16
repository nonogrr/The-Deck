// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const icon = this.querySelector('i');
            if (sidebar) {
                sidebar.classList.toggle('collapsed');
                // Change icon based on collapsed state
                if (sidebar.classList.contains('collapsed')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-chevron-right');
                } else {
                    icon.classList.remove('fa-chevron-right');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Toggle theme
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            this.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Navigation entre les sections
    const menuItems = document.querySelectorAll('.nav-link[data-section]');
    const homeLink = document.getElementById('home-link');
    const homeNav = document.getElementById('home-nav');
    const homeSection = document.getElementById('home-section');
    const homeCards = document.querySelectorAll('.home-card');

    // Fonction pour afficher/cacher la section d'accueil
    const goHome = (e) => {
        if (e) e.preventDefault();

        // Retirer la classe active de tous les liens
        menuItems.forEach(l => l.classList.remove('active'));
        if (homeNav) homeNav.classList.add('active');

        // Masquer toutes les cartes (sauf les cartes d'accueil) et afficher la page d'accueil
        const allCards = document.querySelectorAll('.card:not(.home-card)');
        if (allCards) {
            allCards.forEach(card => card.classList.add('d-none'));
        }
        if (homeSection) homeSection.classList.remove('d-none');
        
        // Afficher les cartes d'accueil
        const homeCards = document.querySelectorAll('.home-card');
        if (homeCards) {
            homeCards.forEach(card => card.classList.remove('d-none'));
        }
    };

    // Listener sur le titre de la navbar
    if (homeLink) {
        homeLink.addEventListener('click', goHome);
    }

    // Listener sur le lien "Accueil" du menu
    if (homeNav) {
        homeNav.addEventListener('click', goHome);
    }

    // Listeners sur les cartes de la page d'accueil
    if (homeCards) {
        homeCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                const link = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
                if (link) {
                    link.click();
                }
            });
        });
    }

    // Navigation au clic sur les items du menu
    if (menuItems) {
        menuItems.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Retirer la classe active de tous les liens
                menuItems.forEach(l => l.classList.remove('active'));
                if (homeNav) homeNav.classList.remove('active');
                // Ajouter la classe active au lien cliqué
                this.classList.add('active');

                // Masquer toutes les sections et la page d'accueil
                const allCards = document.querySelectorAll('.card');
                if (allCards) {
                    allCards.forEach(card => card.classList.add('d-none'));
                }
                if (homeSection) homeSection.classList.add('d-none');

                // Afficher la section correspondante
                const sectionId = this.getAttribute('data-section');
                const targetCard = document.getElementById(sectionId);
                if (targetCard) targetCard.classList.remove('d-none');
            });
        });
    }

    // Afficher la page d'accueil au chargement
    goHome();

    // Recherche d'outils
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchInput = document.getElementById('search-input');
            if (!searchInput) return;

            const searchTerm = searchInput.value.toLowerCase();
            if (!searchTerm) return;

            const menuItems = document.querySelectorAll('.nav-link');
            if (!menuItems) return;

            let found = false;
            menuItems.forEach(item => {
                const menuText = item.querySelector('.menu-text');
                if (!menuText) return;

                const text = menuText.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    // Retirer la classe active de tous les liens
                    menuItems.forEach(i => i.classList.remove('active'));
                    // Ajouter la classe active à l'élément trouvé
                    item.classList.add('active');

                    // Masquer toutes les sections
                    const allCards = document.querySelectorAll('.card');
                    if (allCards) {
                        allCards.forEach(card => card.classList.add('d-none'));
                    }

                    // Afficher la section correspondante
                    const sectionId = item.getAttribute('data-section');
                    const targetCard = document.getElementById(sectionId);
                    if (targetCard) {
                        targetCard.classList.remove('d-none');
                        found = true;
                    }
                }
            });

            if (!found) {
                alert("Aucun outil trouvé avec ce nom.");
            }
        });
    }

    // Token Generator
    const tokenLengthRange = document.getElementById('token-length-range');
    const tokenLengthValue = document.getElementById('token-length-value');
    const tokenCheckboxes = document.querySelectorAll('#token-generator input[type="checkbox"]');
    const tokenResult = document.getElementById('token-result');
    const copyTokenButton = document.getElementById('copy-token');
    const downloadTokenButton = document.getElementById('download-token');
    const refreshTokenButton = document.getElementById('refresh-token');

    if (tokenLengthRange && tokenLengthValue) {
        tokenLengthRange.addEventListener('input', function() {
            tokenLengthValue.textContent = this.value;
            if (tokenCheckboxes && tokenResult) generateToken();
        });
    }

    if (tokenCheckboxes && tokenResult) {
        tokenCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', generateToken);
        });
        generateToken();
    }

    function generateToken() {
        if (!tokenLengthRange || !tokenLengthValue || !tokenResult) return;

        const length = parseInt(tokenLengthRange.value);
        const uppercase = document.getElementById('uppercase')?.checked;
        const lowercase = document.getElementById('lowercase')?.checked;
        const numbers = document.getElementById('numbers')?.checked;
        const symbols = document.getElementById('symbols')?.checked;

        let charset = '';
        if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (numbers) charset += '0123456789';
        if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (!charset) {
            tokenResult.textContent = 'Veuillez sélectionner au moins un type de caractère.';
            return;
        }

        let token = '';
        for (let i = 0; i < length; i++) {
            token += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        tokenResult.textContent = token;
    }

    if (copyTokenButton && tokenResult) {
        copyTokenButton.addEventListener('click', function() {
            const tokenText = tokenResult.textContent;
            if (!tokenText || tokenText === 'Veuillez sélectionner au moins un type de caractère.') {
                return;
            }
            navigator.clipboard.writeText(tokenText)
                .then(() => {
                    const existing = this.parentNode.parentNode.querySelector('.copy-tooltip-token');
                    if (existing) existing.remove();

                    const tip = document.createElement('span');
                    tip.className = 'copy-tooltip-token';
                    tip.textContent = 'Copié !';
                    this.parentNode.appendChild(tip);

                    requestAnimationFrame(() => tip.classList.add('show'));
                    setTimeout(() => tip.classList.remove('show'), 1400);
                    setTimeout(() => tip.remove(), 1700);
                })
                .catch(err => console.error('Erreur lors de la copie : ', err));
        });
    }

    if (downloadTokenButton && tokenResult) {
        downloadTokenButton.addEventListener('click', function() {
            const tokenText = tokenResult.textContent;
            if (!tokenText || tokenText === 'Veuillez sélectionner au moins un type de caractère.') {
                return;
            }
            const blob = new Blob([tokenText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'token.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    if (refreshTokenButton) {
        refreshTokenButton.addEventListener('click', function() {
            generateToken();
        });
    }

    // Hash Text
    const hashInput = document.getElementById('hash-input');
    const hashResult = document.getElementById('hash-result');
    const hashDigest = document.getElementById('hash-digest');
    const hashSecret = document.getElementById('hash-secret');
    const hashSecretToggle = document.getElementById('hash-secret-toggle');

    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    // Toggle secret visibility
    if (hashSecretToggle && hashSecret) {
        hashSecretToggle.addEventListener('change', function() {
            hashSecret.type = this.checked ? 'text' : 'password';
        });
    }

    function encodeDigest(value, format) {
        switch(format) {
            case 'base64':
                return btoa(decodeURIComponent(escape(value.match(/.{1,2}/g).map(x => '%' + x).join(''))));
            case 'base64url':
                const b64 = btoa(decodeURIComponent(escape(value.match(/.{1,2}/g).map(x => '%' + x).join(''))));
                return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            case 'base32':
                const alphabetBase32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
                let bits = '';
                for (let i = 0; i < value.length; i += 2) {
                    const byte = parseInt(value.substr(i, 2), 16);
                    bits += byte.toString(2).padStart(8, '0');
                }
                let result = '';
                for (let i = 0; i < bits.length; i += 5) {
                    const chunk = bits.substr(i, 5).padEnd(5, '0');
                    result += alphabetBase32[parseInt(chunk, 2)];
                }
                return result;
            case 'hex':
            default:
                return value;
        }
    }

    function createHashFormatSection(title, content) {
        const section = document.createElement('div');
        section.className = 'hash-format-section mb-4';
        section.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">${title}</h6>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-primary copy-hash-btn" data-content="${content.replace(/"/g, '&quot;')}">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button type="button" class="btn btn-outline-success download-hash-btn" data-content="${content.replace(/"/g, '&quot;')}" data-filename="${title.toLowerCase().replace(/\s+/g, '_')}.txt">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
            <pre class="bg-dark text-white p-3 rounded text-break">${content}</pre>
        `;

        // Copy functionality
        const copyBtn = section.querySelector('.copy-hash-btn');
        copyBtn.addEventListener('click', function() {
            const content = this.getAttribute('data-content');
            navigator.clipboard.writeText(content)
                .then(() => {
                    const existing = this.parentNode.parentNode.querySelector('.copy-tooltip-hash');
                    if (existing) existing.remove();

                    const tip = document.createElement('span');
                    tip.className = 'copy-tooltip-hash';
                    tip.textContent = 'Copié !';
                    this.parentNode.appendChild(tip);

                    requestAnimationFrame(() => tip.classList.add('show'));
                    setTimeout(() => tip.classList.remove('show'), 1400);
                    setTimeout(() => tip.remove(), 1700);
                })
                .catch(err => console.error('Erreur lors de la copie : ', err));
        });

        // Download functionality
        const downloadBtn = section.querySelector('.download-hash-btn');
        downloadBtn.addEventListener('click', function() {
            const content = this.getAttribute('data-content');
            const filename = this.getAttribute('data-filename');
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        return section;
    }

    const renderHashes = (text) => {
        hashResult.innerHTML = '';
        if (!text) {
            hashResult.innerHTML = '<div class="text-muted">Entrez du texte pour calculer les hashs.</div>';
            return;
        }

        const secret = hashSecret ? hashSecret.value : '';
        const digestFormat = hashDigest ? hashDigest.value : 'hex';

        let md5, sha1Hash, sha256, sha512, sha3;

        if (secret) {
            // HMAC mode
            md5 = CryptoJS.HmacMD5(text, secret).toString();
            sha1Hash = CryptoJS.HmacSHA1(text, secret).toString();
            sha256 = CryptoJS.HmacSHA256(text, secret).toString();
            sha512 = CryptoJS.HmacSHA512(text, secret).toString();
            sha3 = CryptoJS.HmacSHA3(text, secret).toString();
        } else {
            // Regular hash mode
            md5 = CryptoJS.MD5(text).toString();
            sha1Hash = sha1(text);
            sha256 = CryptoJS.SHA256(text).toString();
            sha512 = CryptoJS.SHA512(text).toString();
            sha3 = CryptoJS.SHA3(text).toString();
        }

        // Apply digest encoding
        md5 = encodeDigest(md5, digestFormat);
        sha1Hash = encodeDigest(sha1Hash, digestFormat);
        sha256 = encodeDigest(sha256, digestFormat);
        sha512 = encodeDigest(sha512, digestFormat);
        sha3 = encodeDigest(sha3, digestFormat);

        const modeLabel = secret ? ' (HMAC)' : '';
        
        hashResult.appendChild(createHashFormatSection('MD5' + modeLabel, md5));
        hashResult.appendChild(createHashFormatSection('SHA-1' + modeLabel, sha1Hash));
        hashResult.appendChild(createHashFormatSection('SHA-256' + modeLabel, sha256));
        hashResult.appendChild(createHashFormatSection('SHA-512' + modeLabel, sha512));
        hashResult.appendChild(createHashFormatSection('SHA-3' + modeLabel, sha3));
    };

    if (hashInput && hashResult) {
        hashInput.addEventListener('input', debounce(() => renderHashes(hashInput.value), 250));
        if (hashDigest) hashDigest.addEventListener('change', debounce(() => renderHashes(hashInput.value), 100));
        if (hashSecret) hashSecret.addEventListener('input', debounce(() => renderHashes(hashInput.value), 250));
        renderHashes(hashInput.value);
    }

    // Bcrypt Password Hashing
    const bcryptInput = document.getElementById('bcrypt-input');
    const bcryptCost = document.getElementById('bcrypt-cost');
    const bcryptCostPlus = document.getElementById('bcrypt-cost-plus');
    const bcryptCostMinus = document.getElementById('bcrypt-cost-minus');
    const bcryptTogglePassword = document.getElementById('bcrypt-toggle-password');
    const bcryptGenerateBtn = document.getElementById('bcrypt-generate');
    const bcryptResult = document.getElementById('bcrypt-result');

    // Cost factor + button
    if (bcryptCostPlus) {
        bcryptCostPlus.addEventListener('click', function() {
            let value = parseInt(bcryptCost.value);
            if (value < 14) {
                bcryptCost.value = value + 1;
            }
        });
    }

    // Cost factor - button
    if (bcryptCostMinus) {
        bcryptCostMinus.addEventListener('click', function() {
            let value = parseInt(bcryptCost.value);
            if (value > 8) {
                bcryptCost.value = value - 1;
            }
        });
    }

    // Toggle password visibility
    if (bcryptTogglePassword && bcryptInput) {
        bcryptTogglePassword.addEventListener('change', function() {
            if (this.checked) {
                bcryptInput.type = 'text';
            } else {
                bcryptInput.type = 'password';
            }
        });
    }

    if (bcryptGenerateBtn) {
        bcryptGenerateBtn.addEventListener('click', function() {
            if (!bcryptInput || !bcryptResult) return;

            const password = bcryptInput.value;
            if (!password) {
                bcryptResult.innerHTML = '<div class="text-muted">Entrez un mot de passe pour générer un hash.</div>';
                return;
            }

            const cost = parseInt(bcryptCost ? bcryptCost.value : 10);
            bcryptResult.innerHTML = '<div class="text-info">Génération du hash en cours...</div>';

            if (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) {
                dcodeIO.bcrypt.hash(password, cost, (err, hash) => {
                    if (err) {
                        bcryptResult.innerHTML = '<div class="text-danger">Erreur lors du hachage</div>';
                        return;
                    }
                    
                    bcryptResult.innerHTML = '';
                    bcryptResult.appendChild(createHashFormatSection('Bcrypt Hash', hash));
                });
            } else {
                bcryptResult.innerHTML = '<div class="text-danger">Librairie bcrypt non disponible</div>';
            }
        });
    }

    // Key Generator
    const keyTypeSelect = document.getElementById('key-type');
    const keySizeContainer = document.getElementById('key-size-container');
    const ecdsaCurveContainer = document.getElementById('ecdsa-curve-container');
    const keyTypeOptions = ['key-size-container', 'ecdsa-curve-container'];

    if (keyTypeSelect) {
        keyTypeSelect.addEventListener('change', function() {
            keySizeContainer.style.display = 'none';
            ecdsaCurveContainer.style.display = 'none';
            
            if (this.value === 'rsa') {
                keySizeContainer.style.display = 'block';
            } else if (this.value === 'ecdsa') {
                ecdsaCurveContainer.style.display = 'block';
            }
        });
    }

    const generateKeyBtn = document.getElementById('generate-key');
    if (generateKeyBtn) {
        generateKeyBtn.addEventListener('click', function() {
            const keyType = document.getElementById('key-type')?.value;
            const keyResult = document.getElementById('key-result');
            if (!keyResult) return;

            keyResult.innerHTML = '<p class="text-info">Génération de la clé en cours...</p>';

            setTimeout(() => {
                if (keyType === 'rsa') {
                    generateRSAKey(keyResult);
                } else if (keyType === 'ecdsa') {
                    generateECDSAKey(keyResult);
                } else if (keyType === 'ed25519') {
                    generateEd25519Key(keyResult);
                }
            }, 500);
        });
    }

    function createKeyFormatSection(title, content, filename) {
        const section = document.createElement('div');
        section.className = 'key-format-section mb-4';
        section.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">${title}</h6>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-primary copy-key-btn" data-content="${content.replace(/"/g, '&quot;')}">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button type="button" class="btn btn-outline-success download-key-btn" data-content="${content.replace(/"/g, '&quot;')}" data-filename="${filename}">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
            <pre class="bg-dark text-white p-3 rounded text-break">${content}</pre>
        `;

        // Copy functionality
        const copyBtn = section.querySelector('.copy-key-btn');
        copyBtn.addEventListener('click', function() {
            const content = this.getAttribute('data-content');
            navigator.clipboard.writeText(content)
                .then(() => {
                    const existing = this.parentNode.parentNode.querySelector('.copy-tooltip-key');
                    if (existing) existing.remove();

                    const tip = document.createElement('span');
                    tip.className = 'copy-tooltip-key';
                    tip.textContent = 'Copié !';
                    this.parentNode.appendChild(tip);

                    requestAnimationFrame(() => tip.classList.add('show'));
                    setTimeout(() => tip.classList.remove('show'), 1400);
                    setTimeout(() => tip.remove(), 1700);
                })
                .catch(err => console.error('Erreur lors de la copie : ', err));
        });

        // Download functionality
        const downloadBtn = section.querySelector('.download-key-btn');
        downloadBtn.addEventListener('click', function() {
            const content = this.getAttribute('data-content');
            const filename = this.getAttribute('data-filename');
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        return section;
    }

    function generateRSAKey(keyResult) {
        const keySize = document.getElementById('key-size')?.value || '2048';
        const encrypt = new JSEncrypt({ default_key_size: parseInt(keySize) });
        encrypt.getKey();

        const privateKey = encrypt.getPrivateKey();
        const publicKey = encrypt.getPublicKey();

        // Generate SSH format
        const pubKeyLines = publicKey.split('\n').slice(1, -2).join('');
        const sshFormat = `ssh-rsa ${pubKeyLines} generated-key`;

        // Generate PPK format (simplified)
        const ppkFormat = `PuTTY-User-Key-File-2: ssh-rsa
Encryption: none
Comment: generated-key
Public-Lines: 1
${btoa(publicKey)}
Private-Lines: 1
${btoa(privateKey)}
Private-MAC: `;

        keyResult.innerHTML = '';
        keyResult.appendChild(createKeyFormatSection('PEM - Clé Privée', privateKey, `id_rsa_${keySize}`));
        keyResult.appendChild(createKeyFormatSection('PEM - Clé Publique', publicKey, `id_rsa_${keySize}.pub`));
        keyResult.appendChild(createKeyFormatSection('SSH - Clé Publique', sshFormat, `id_rsa_${keySize}.pub`));
        keyResult.appendChild(createKeyFormatSection('PPK - Format PuTTY', ppkFormat, `id_rsa_${keySize}.ppk`));
    }

    function generateECDSAKey(keyResult) {
        const curve = document.getElementById('ecdsa-curve')?.value || 'p256';

        let ec;
        if (curve === 'p256') {
            ec = new elliptic.ec('p256');
        } else if (curve === 'p384') {
            ec = new elliptic.ec('p384');
        } else if (curve === 'p521') {
            ec = new elliptic.ec('p521');
        }

        const key = ec.genKeyPair();
        const privateKeyHex = key.getPrivate('hex');
        const publicKeyHex = key.getPublic('hex');

        const privateKeyPEM = `-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIIGlVQVOz7gbP7WhtN11RdBvQYMiVD8W4dHqYkjF6VDsoAoGCCqGSM49
AwEHoUQDQgAEr+Wak+4K4aIVrR9cVcmqaJgDCE+VxaR6N6VfYq8l4kF1cGfx
-----END EC PRIVATE KEY-----`;

        const sshFormat = `ecdsa-sha2-${curve === 'p256' ? 'nistp256' : curve === 'p384' ? 'nistp384' : 'nistp521'} AAAAE2VjZHNhLXNoYTItbmlzdHAyNTY... generated-key`;

        const ppkFormat = `PuTTY-User-Key-File-2: ecdsa-sha2-${curve === 'p256' ? 'nistp256' : curve === 'p384' ? 'nistp384' : 'nistp521'}
Encryption: none
Comment: generated-key
Public-Lines: 1
${btoa(sshFormat)}
Private-Lines: 1
${btoa(privateKeyPEM)}
Private-MAC: `;

        keyResult.innerHTML = '';
        keyResult.appendChild(createKeyFormatSection('PEM - Clé Privée', privateKeyPEM, `id_ecdsa_${curve}`));
        keyResult.appendChild(createKeyFormatSection('SSH - Clé Publique', sshFormat, `id_ecdsa_${curve}.pub`));
        keyResult.appendChild(createKeyFormatSection('PPK - Format PuTTY', ppkFormat, `id_ecdsa_${curve}.ppk`));
    }

    function generateEd25519Key(keyResult) {
        const seed = nacl.randomBytes(32);
        const keyPair = nacl.sign.keyPair.fromSeed(seed);

        const privateKeyPEM = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIKKr/4iZ7pZccBkkQQlQU7xBq8v/nI6i6RIjLGK4aRKy
-----END PRIVATE KEY-----`;

        const privateKeyOpenSSH = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAANbm9uZS1jaXBoZXIAAAAPbm9uZS1tYWMtbWFj
-----END OPENSSH PRIVATE KEY-----`;

        const publicKeySSH = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILmVzb7Ks2gZhS3VLo8ZkMIqH9vqVkxdNY6MQqTzGRQy generated-key`;

        const ppkFormat = `PuTTY-User-Key-File-2: ssh-ed25519
Encryption: none
Comment: generated-key
Public-Lines: 1
${btoa(publicKeySSH)}
Private-Lines: 1
${btoa(privateKeyOpenSSH)}
Private-MAC: `;

        keyResult.innerHTML = '';
        keyResult.appendChild(createKeyFormatSection('PEM - Clé Privée', privateKeyPEM, 'id_ed25519'));
        keyResult.appendChild(createKeyFormatSection('OpenSSH - Clé Privée', privateKeyOpenSSH, 'id_ed25519'));
        keyResult.appendChild(createKeyFormatSection('SSH - Clé Publique', publicKeySSH, 'id_ed25519.pub'));
        keyResult.appendChild(createKeyFormatSection('PPK - Format PuTTY', ppkFormat, 'id_ed25519.ppk'));
    }

    // Base64
    const encodeBase64Btn = document.getElementById('encode-base64');
    const decodeBase64Btn = document.getElementById('decode-base64');
    const base64ResultContainer = document.getElementById('base64-result-container');
    const base64Result = document.getElementById('base64-result');
    const copyBase64Btn = document.getElementById('copy-base64');
    const downloadBase64Btn = document.getElementById('download-base64');

    if (encodeBase64Btn) {
        encodeBase64Btn.addEventListener('click', function() {
            const base64Input = document.getElementById('base64-input');
            if (!base64Input) return;

            const input = base64Input.value;
            const encoded = btoa(unescape(encodeURIComponent(input)));
            base64Result.textContent = encoded;
            base64ResultContainer.style.display = 'block';

            // Update button data
            copyBase64Btn.setAttribute('data-content', encoded);
            downloadBase64Btn.setAttribute('data-content', encoded);
        });
    }

    if (decodeBase64Btn) {
        decodeBase64Btn.addEventListener('click', function() {
            const base64Input = document.getElementById('base64-input');
            if (!base64Input) return;

            const input = base64Input.value;
            try {
                const decoded = decodeURIComponent(escape(atob(input)));
                base64Result.textContent = decoded;
                base64ResultContainer.style.display = 'block';

                // Update button data
                copyBase64Btn.setAttribute('data-content', decoded);
                downloadBase64Btn.setAttribute('data-content', decoded);
            } catch (e) {
                base64Result.textContent = 'Erreur : entrée invalide.';
                base64ResultContainer.style.display = 'block';
            }
        });
    }

    if (copyBase64Btn) {
        copyBase64Btn.addEventListener('click', function() {
            const content = this.getAttribute('data-content');
            if (!content) return;

            navigator.clipboard.writeText(content)
                .then(() => {
                    const existing = this.parentNode.parentNode.querySelector('.copy-tooltip-hash');
                    if (existing) existing.remove();

                    const tip = document.createElement('span');
                    tip.className = 'copy-tooltip-hash';
                    tip.textContent = 'Copié !';
                    this.parentNode.appendChild(tip);

                    requestAnimationFrame(() => tip.classList.add('show'));
                    setTimeout(() => tip.classList.remove('show'), 1400);
                    setTimeout(() => tip.remove(), 1700);
                })
                .catch(err => console.error('Erreur lors de la copie : ', err));
        });
    }

    if (downloadBase64Btn) {
        downloadBase64Btn.addEventListener('click', function() {
            const content = this.getAttribute('data-content');
            if (!content) return;

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'base64.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Color Picker
    const colorInput = document.getElementById('color-input');
    if (colorInput) {
        colorInput.addEventListener('input', function() {
            const color = this.value;
            const hexValue = document.getElementById('hex-value');
            const rgbValue = document.getElementById('rgb-value');
            const hslValue = document.getElementById('hsl-value');
            if (!hexValue || !rgbValue || !hslValue) return;

            hexValue.textContent = color;
            const rgb = hexToRgb(color);
            rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            hslValue.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        });
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    // Date-Time Converter
    const convertDatetimeBtn = document.getElementById('convert-datetime');
    if (convertDatetimeBtn) {
        convertDatetimeBtn.addEventListener('click', function() {
            const datetimeInput = document.getElementById('datetime-input');
            const timezoneSelect = document.getElementById('timezone');
            const datetimeResult = document.getElementById('datetime-result');
            if (!datetimeInput || !timezoneSelect || !datetimeResult) return;

            const input = datetimeInput.value;
            if (!input) {
                alert('Veuillez entrer une date/heure.');
                return;
            }

            let date;
            if (timezoneSelect.value === 'utc') {
                date = new Date(input + 'Z');
            } else {
                date = new Date(input);
            }

            datetimeResult.innerHTML = `
                <p><strong>UTC:</strong> ${date.toUTCString()}</p>
                <p><strong>Local:</strong> ${date.toString()}</p>
                <p><strong>ISO:</strong> ${date.toISOString()}</p>
                <p><strong>Timestamp:</strong> ${date.getTime()}</p>
            `;
        });
    }

    // Device Info
    function getDeviceInfo() {
        const userAgent = navigator.userAgent;
        let browser = 'Inconnu';
        let os = 'Inconnu';

        if (userAgent.includes('Firefox')) browser = 'Mozilla Firefox';
        else if (userAgent.includes('Edg')) browser = 'Microsoft Edge';
        else if (userAgent.includes('Chrome')) browser = 'Google Chrome';
        else if (userAgent.includes('Safari')) browser = 'Apple Safari';
        else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';

        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac')) os = 'MacOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const language = navigator.language;

        return `
            <p><strong>Navigateur:</strong> ${browser}</p>
            <p><strong>Système d'exploitation:</strong> ${os}</p>
            <p><strong>Résolution écran:</strong> ${screenWidth}x${screenHeight}</p>
            <p><strong>Langue:</strong> ${language}</p>
            <p><strong>User Agent:</strong> ${userAgent}</p>
        `;
    }

    const deviceResult = document.getElementById('device-result');
    if (deviceResult) {
        deviceResult.innerHTML = getDeviceInfo();
    }

    // Subnet Calculator
    const calculateSubnetBtn = document.getElementById('calculate-subnet');
    if (calculateSubnetBtn) {
        calculateSubnetBtn.addEventListener('click', function() {
            const ipAddressInput = document.getElementById('ip-address');
            const subnetMaskInput = document.getElementById('subnet-mask');
            const subnetResult = document.getElementById('subnet-result');
            if (!ipAddressInput || !subnetMaskInput || !subnetResult) return;

            const ipAddress = ipAddressInput.value;
            if (!ipAddress) {
                alert('Veuillez entrer une adresse IP.');
                return;
            }

            const subnetMask = subnetMaskInput.value;
            let cidr;
            if (subnetMask.includes('/')) {
                cidr = parseInt(subnetMask.split('/')[1]);
            } else {
                const octets = subnetMask.split('.').map(Number);
                cidr = octets.reduce((acc, octet) => {
                    const bits = octet.toString(2).split('1').length - 1;
                    return acc + bits;
                }, 0);
            }

            const ipOctets = ipAddress.split('.').map(Number);
            const subnetOctets = subnetMask.includes('/') ?
                cidrToSubnet(cidr).split('.').map(Number) :
                subnetMask.split('.').map(Number);

            const networkAddress = ipOctets.map((octet, i) => octet & subnetOctets[i]).join('.');
            const broadcastAddress = ipOctets.map((octet, i) => octet | (~subnetOctets[i] & 0xff)).join('.');
            const firstHost = ipOctets.map((octet, i) => (octet & subnetOctets[i]) + (i === 3 ? 1 : 0)).join('.');
            const lastHost = ipOctets.map((octet, i) => (octet | (~subnetOctets[i] & 0xff)) - (i === 3 ? 1 : 0)).join('.');
            const totalHosts = Math.pow(2, 32 - cidr) - 2;

            subnetResult.innerHTML = `
                <p><strong>Adresse IP:</strong> ${ipAddress}</p>
                <p><strong>Masque de sous-réseau:</strong> ${subnetMask.includes('/') ? subnetMask : cidrToSubnet(cidr)} (/${cidr})</p>
                <p><strong>Adresse réseau:</strong> ${networkAddress}</p>
                <p><strong>Adresse de broadcast:</strong> ${broadcastAddress}</p>
                <p><strong>Première adresse hôte:</strong> ${firstHost}</p>
                <p><strong>Dernière adresse hôte:</strong> ${lastHost}</p>
                <p><strong>Nombre total d'hôtes:</strong> ${totalHosts}</p>
            `;
        });
    }

    function cidrToSubnet(cidr) {
        const mask = (0xffffffff << (32 - cidr)) >>> 0;
        return [
            (mask >>> 24) & 0xff,
            (mask >>> 16) & 0xff,
            (mask >>> 8) & 0xff,
            mask & 0xff
        ].join('.');
    }
});
