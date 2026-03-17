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
            const entropyEl = document.getElementById('token-entropy');
            if (entropyEl) entropyEl.style.display = 'none';
            return;
        }

        let token = '';
        for (let i = 0; i < length; i++) {
            token += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        tokenResult.textContent = token;

        // Calcul et affichage de l'entropie
        const entropy = length * Math.log2(charset.length);
        const entropyEl = document.getElementById('token-entropy');
        const entropyBits = document.getElementById('entropy-bits');
        const entropyBadge = document.getElementById('entropy-badge');
        if (entropyEl && entropyBits && entropyBadge) {
            entropyBits.textContent = entropy.toFixed(1);
            let label, color;
            if (entropy < 28) {
                label = 'Très Faible'; color = 'bg-danger';
            } else if (entropy < 60) {
                label = 'Faible'; color = 'bg-warning text-dark';
            } else if (entropy < 80) {
                label = 'Sécurisé'; color = 'bg-info text-dark';
            } else if (entropy < 128) {
                label = 'Très Sécurisé'; color = 'bg-success';
            } else {
                label = 'Militaire / Futuriste'; color = 'bg-primary';
            }
            entropyBadge.textContent = label;
            entropyBadge.className = 'badge ' + color;
            entropyEl.style.display = '';
        }
    }

    if (copyTokenButton && tokenResult) {
        copyTokenButton.addEventListener('click', function() {
            const tokenText = tokenResult.textContent;
            if (!tokenText || tokenText === 'Veuillez sélectionner au moins un type de caractère.') return;
            navigator.clipboard.writeText(tokenText).then(() => {
                const orig = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => { this.innerHTML = orig; }, 1500);
            }).catch(err => console.error('Erreur copie :', err));
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

    function createHashFormatSection(title, content, color) {
        color = color || 'info';
        const filename = title.toLowerCase().replace(/[\s()\/]+/g, '_') + '.txt';
        const section = document.createElement('div');
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
            navigator.clipboard.writeText(pre.textContent).then(() => {
                const orig = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => { this.innerHTML = orig; }, 1500);
            }).catch(err => console.error('Erreur copie :', err));
        });

        section.querySelector('.download-hash-btn').addEventListener('click', function() {
            const blob = new Blob([pre.textContent], { type: 'text/plain' });
            const url  = URL.createObjectURL(blob);
            const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
            document.body.appendChild(a); a.click();
            document.body.removeChild(a); URL.revokeObjectURL(url);
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

    const hashClearBtn = document.getElementById('hash-clear');
    if (hashClearBtn) {
        hashClearBtn.addEventListener('click', function() {
            if (hashInput) hashInput.value = '';
            if (hashSecret) hashSecret.value = '';
            if (hashResult) hashResult.innerHTML = '';
        });
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
                    bcryptResult.appendChild(createHashFormatSection('Bcrypt Hash', hash, 'success'));
                });
            } else {
                bcryptResult.innerHTML = '<div class="text-danger">Librairie bcrypt non disponible</div>';
            }
        });
    }

    const bcryptClearBtn = document.getElementById('bcrypt-clear');
    if (bcryptClearBtn) {
        bcryptClearBtn.addEventListener('click', function() {
            if (bcryptInput) bcryptInput.value = '';
            if (bcryptResult) bcryptResult.innerHTML = '';
        });
    }

    // Key Generator
    const keyTypeSelect       = document.getElementById('key-type');
    const keySizeContainer    = document.getElementById('key-size-container');
    const ecdsaCurveContainer = document.getElementById('ecdsa-curve-container');
    const keySizeNa           = document.getElementById('key-size-na');

    function updateKeySizeVisibility(value) {
        keySizeContainer.style.display    = value === 'rsa'   ? '' : 'none';
        ecdsaCurveContainer.style.display = value === 'ecdsa' ? '' : 'none';
        if (keySizeNa) keySizeNa.style.display = value === 'ed25519' ? '' : 'none';
    }

    if (keyTypeSelect) {
        keyTypeSelect.addEventListener('change', function() {
            updateKeySizeVisibility(this.value);
        });
        updateKeySizeVisibility(keyTypeSelect.value);
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

    const keyClearBtn = document.getElementById('key-clear');
    if (keyClearBtn) {
        keyClearBtn.addEventListener('click', function() {
            const keyResult = document.getElementById('key-result');
            if (keyResult) keyResult.innerHTML = '';
        });
    }

    function createKeyFormatSection(title, content, filename, color) {
        color = color || 'success';
        const icon = color === 'warning' ? 'fa-key'
                   : color === 'success' ? 'fa-lock-open'
                   : color === 'info'    ? 'fa-terminal'
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
            navigator.clipboard.writeText(pre.textContent).then(() => {
                const orig = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => { this.innerHTML = orig; }, 1500);
            }).catch(err => console.error('Erreur copie :', err));
        });

        section.querySelector('.download-key-btn').addEventListener('click', function() {
            const blob = new Blob([pre.textContent], { type: 'text/plain' });
            const url  = URL.createObjectURL(blob);
            const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
            document.body.appendChild(a); a.click();
            document.body.removeChild(a); URL.revokeObjectURL(url);
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
        keyResult.appendChild(createKeyFormatSection('PEM - Clé Privée',   privateKey, `id_rsa_${keySize}`,       'warning'));
        keyResult.appendChild(createKeyFormatSection('PEM - Clé Publique', publicKey,  `id_rsa_${keySize}.pub`,   'success'));
        keyResult.appendChild(createKeyFormatSection('SSH - Clé Publique', sshFormat,  `id_rsa_${keySize}.pub`,   'info'));
        keyResult.appendChild(createKeyFormatSection('PPK - Format PuTTY', ppkFormat,  `id_rsa_${keySize}.ppk`,   'secondary'));
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
        keyResult.appendChild(createKeyFormatSection('PEM - Clé Privée',   privateKeyPEM, `id_ecdsa_${curve}`,       'warning'));
        keyResult.appendChild(createKeyFormatSection('SSH - Clé Publique', sshFormat,     `id_ecdsa_${curve}.pub`,   'info'));
        keyResult.appendChild(createKeyFormatSection('PPK - Format PuTTY', ppkFormat,     `id_ecdsa_${curve}.ppk`,   'secondary'));
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
        keyResult.appendChild(createKeyFormatSection('PEM - Clé Privée',      privateKeyPEM,    'id_ed25519',     'warning'));
        keyResult.appendChild(createKeyFormatSection('OpenSSH - Clé Privée',  privateKeyOpenSSH,'id_ed25519',     'warning'));
        keyResult.appendChild(createKeyFormatSection('SSH - Clé Publique',    publicKeySSH,     'id_ed25519.pub', 'success'));
        keyResult.appendChild(createKeyFormatSection('PPK - Format PuTTY',    ppkFormat,        'id_ed25519.ppk', 'secondary'));
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
            base64Result.textContent = btoa(unescape(encodeURIComponent(base64Input.value)));
            base64ResultContainer.style.display = 'block';
        });
    }

    if (decodeBase64Btn) {
        decodeBase64Btn.addEventListener('click', function() {
            const base64Input = document.getElementById('base64-input');
            if (!base64Input) return;
            try {
                base64Result.textContent = decodeURIComponent(escape(atob(base64Input.value)));
            } catch (e) {
                base64Result.textContent = 'Erreur : entrée invalide.';
            }
            base64ResultContainer.style.display = 'block';
        });
    }

    if (copyBase64Btn) {
        copyBase64Btn.addEventListener('click', function() {
            if (!base64Result.textContent) return;
            navigator.clipboard.writeText(base64Result.textContent).then(() => {
                const orig = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => { this.innerHTML = orig; }, 1500);
            }).catch(err => console.error('Erreur copie :', err));
        });
    }

    if (downloadBase64Btn) {
        downloadBase64Btn.addEventListener('click', function() {
            if (!base64Result.textContent) return;
            const blob = new Blob([base64Result.textContent], { type: 'text/plain' });
            const url  = URL.createObjectURL(blob);
            const a    = Object.assign(document.createElement('a'), { href: url, download: 'base64.txt' });
            document.body.appendChild(a); a.click();
            document.body.removeChild(a); URL.revokeObjectURL(url);
        });
    }

    const clearBase64Btn = document.getElementById('clear-base64');
    if (clearBase64Btn) {
        clearBase64Btn.addEventListener('click', function() {
            const base64Input = document.getElementById('base64-input');
            if (base64Input) base64Input.value = '';
            if (base64Result) base64Result.textContent = '';
            if (base64ResultContainer) base64ResultContainer.style.display = 'none';
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

    // JWT Decoder
    (function() {
        const jwtInput      = document.getElementById('jwt-input');
        const jwtDecodeBtn  = document.getElementById('jwt-decode-btn');
        const jwtClearBtn   = document.getElementById('jwt-clear-btn');
        const jwtResult     = document.getElementById('jwt-result');
        const jwtError      = document.getElementById('jwt-error');
        const jwtHeaderOut  = document.getElementById('jwt-header-out');
        const jwtPayloadOut = document.getElementById('jwt-payload-out');
        const jwtSigOut     = document.getElementById('jwt-signature-out');
        const jwtClaims     = document.getElementById('jwt-claims');
        const jwtClaimsSec  = document.getElementById('jwt-claims-section');

        if (!jwtDecodeBtn) return;

        function b64urlDecode(str) {
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4) str += '=';
            return atob(str);
        }

        function showError(msg) {
            jwtError.textContent = msg;
            jwtError.classList.remove('d-none');
        }

        function claimBadge(key, value) {
            const badge = document.createElement('span');
            badge.className = 'badge bg-secondary font-monospace';
            let display = value;
            if ((key === 'exp' || key === 'iat' || key === 'nbf') && typeof value === 'number') {
                const d = new Date(value * 1000);
                const expired = key === 'exp' && d < new Date();
                display = `${d.toLocaleString()}`;
                badge.className = `badge ${expired ? 'bg-danger' : 'bg-success'}`;
            }
            badge.title = key;
            badge.textContent = `${key}: ${display}`;
            return badge;
        }

        jwtDecodeBtn.addEventListener('click', function() {
            const raw = jwtInput.value.trim();
            jwtError.classList.add('d-none');

            if (!raw) { showError('Veuillez coller un token JWT.'); return; }

            const parts = raw.split('.');
            if (parts.length !== 3) { showError('Format invalide : un JWT doit comporter 3 parties séparées par des points.'); return; }

            let header, payload;
            try { header  = JSON.parse(b64urlDecode(parts[0])); } catch(e) { showError('Impossible de décoder le header : ' + e.message); return; }
            try { payload = JSON.parse(b64urlDecode(parts[1])); } catch(e) { showError('Impossible de décoder le payload : ' + e.message); return; }

            jwtHeaderOut.textContent  = JSON.stringify(header,  null, 2);
            jwtPayloadOut.textContent = JSON.stringify(payload, null, 2);
            jwtSigOut.textContent     = parts[2];

            // Claims notables
            const notableClaims = ['iss','sub','aud','exp','iat','nbf','jti'];
            jwtClaims.innerHTML = '';
            let hasClaims = false;
            notableClaims.forEach(k => {
                if (payload[k] !== undefined) {
                    jwtClaims.appendChild(claimBadge(k, payload[k]));
                    hasClaims = true;
                }
            });
            jwtClaimsSec.style.display = hasClaims ? '' : 'none';
        });

        jwtClearBtn.addEventListener('click', function() {
            jwtInput.value = '';
            jwtHeaderOut.textContent  = 'Décodez un JWT pour voir le header.';
            jwtPayloadOut.textContent = 'Décodez un JWT pour voir le payload.';
            jwtSigOut.textContent     = '–';
            jwtClaimsSec.style.display = 'none';
            jwtError.classList.add('d-none');
        });

        function copyText(text, btn) {
            navigator.clipboard.writeText(text).then(() => {
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => { btn.innerHTML = orig; }, 1500);
            });
        }

        document.getElementById('jwt-copy-header')?.addEventListener('click', () => copyText(jwtHeaderOut.textContent, document.getElementById('jwt-copy-header')));
        document.getElementById('jwt-copy-payload')?.addEventListener('click', () => copyText(jwtPayloadOut.textContent, document.getElementById('jwt-copy-payload')));
    })();

    // Certificate Generator
    (function() {
        const certAlgo        = document.getElementById('cert-algo');
        const certKeySize     = document.getElementById('cert-key-size');
        const certEcCurve     = document.getElementById('cert-ec-curve');
        const certCN          = document.getElementById('cert-cn');
        const certO           = document.getElementById('cert-o');
        const certOU          = document.getElementById('cert-ou');
        const certL           = document.getElementById('cert-l');
        const certST          = document.getElementById('cert-st');
        const certC           = document.getElementById('cert-c');
        const certValidity    = document.getElementById('cert-validity');
        const certSanList     = document.getElementById('cert-san-list');
        const certAddSan      = document.getElementById('cert-add-san');
        const certGenSelf     = document.getElementById('cert-gen-selfsigned');
        const certGenCSR      = document.getElementById('cert-gen-csr');
        const certLoading     = document.getElementById('cert-loading');
        const certLoadingMsg  = document.getElementById('cert-loading-msg');
        const certError       = document.getElementById('cert-error');
        const certResult      = document.getElementById('cert-result');
        const certPrivkeyOut  = document.getElementById('cert-privkey-out');
        const certCertOut     = document.getElementById('cert-cert-out');
        const certOutputLabel = document.getElementById('cert-output-label');

        if (!certGenSelf) return;

        // Switch RSA / ECC key size selectors
        certAlgo.addEventListener('change', function() {
            if (this.value === 'rsa') {
                certKeySize.classList.remove('d-none');
                certEcCurve.classList.add('d-none');
            } else {
                certKeySize.classList.add('d-none');
                certEcCurve.classList.remove('d-none');
            }
        });

        // SAN helpers
        function addSanEntry(type, value) {
            const div = document.createElement('div');
            div.className = 'd-flex gap-2 mb-2 cert-san-entry';
            div.innerHTML = `
                <select class="form-select form-select-sm" style="width:90px;flex:none;">
                    <option value="dns"${type==='dns'?' selected':''}>DNS</option>
                    <option value="ip"${type==='ip'?' selected':''}>IP</option>
                </select>
                <input type="text" class="form-control form-control-sm" placeholder="${type==='ip'?'192.168.1.1':'exemple.com'}" value="${value||''}">
                <button type="button" class="btn btn-sm btn-outline-danger cert-san-rm"><i class="fas fa-times"></i></button>`;
            div.querySelector('.cert-san-rm').addEventListener('click', function() {
                if (document.querySelectorAll('.cert-san-entry').length > 1) div.remove();
            });
            div.querySelector('select').addEventListener('change', function() {
                div.querySelector('input').placeholder = this.value === 'ip' ? '192.168.1.1' : 'exemple.com';
            });
            certSanList.appendChild(div);
        }

        // Default: 1 SAN DNS vide
        addSanEntry('dns', '');

        // CN => premier SAN auto-sync
        certCN.addEventListener('input', function() {
            const first = certSanList.querySelector('.cert-san-entry input');
            if (first && (first.dataset.touched !== '1')) first.value = this.value;
        });
        certSanList.addEventListener('input', function(e) {
            if (e.target.matches('.cert-san-entry input')) e.target.dataset.touched = '1';
        });

        certAddSan.addEventListener('click', () => addSanEntry('dns', ''));

        function buildSubject() {
            let s = '';
            const add = (key, el) => { const v = el.value.trim(); if (v) s += `/${key}=${v}`; };
            add('CN', certCN);
            add('O', certO);
            add('OU', certOU);
            add('L', certL);
            add('ST', certST);
            const c = certC.value.trim().toUpperCase().slice(0,2);
            if (c) s += `/C=${c}`;
            return s;
        }

        function getSanArray() {
            const arr = [];
            certSanList.querySelectorAll('.cert-san-entry').forEach(e => {
                const type = e.querySelector('select').value;
                const val  = e.querySelector('input').value.trim();
                if (val) arr.push(type === 'ip' ? {ip: val} : {dns: val});
            });
            if (!arr.length) {
                const cn = certCN.value.trim();
                if (cn) arr.push({dns: cn});
            }
            return arr;
        }

        function utcStr(date) {
            return date.getUTCFullYear() +
                String(date.getUTCMonth()+1).padStart(2,'0') +
                String(date.getUTCDate()).padStart(2,'0') +
                '000000Z';
        }

        function showErr(msg) {
            certError.textContent = msg;
            certError.classList.remove('d-none');
            certLoading.classList.add('d-none');
        }

        function showResult(privPEM, outPEM, isCSR, dlExt) {
            certPrivkeyOut.textContent = privPEM;
            certCertOut.textContent    = outPEM;
            certOutputLabel.innerHTML  = isCSR
                ? '<i class="fas fa-file-alt me-1 text-success"></i> CSR (PKCS#10)'
                : '<i class="fas fa-certificate me-1 text-success"></i> Certificat autosigné';
            const dlBtn = document.getElementById('cert-dl-cert');
            if (dlBtn) dlBtn.dataset.ext = dlExt;
            certLoading.classList.add('d-none');
            certError.classList.add('d-none');
        }

        function generate(mode) {
            const cn = certCN.value.trim();
            if (!cn) { showErr('Le Common Name (CN) est obligatoire.'); return; }

            certError.classList.add('d-none');

            const isRSA  = certAlgo.value === 'rsa';
            const rsaBits = parseInt(certKeySize.value);

            certLoadingMsg.textContent = isRSA && rsaBits === 4096
                ? 'Génération RSA 4096 bits en cours (peut prendre 10-30 s)…'
                : 'Génération en cours…';
            certLoading.classList.remove('d-none');

            setTimeout(() => {
                try {
                    if (typeof KEYUTIL === 'undefined') {
                        showErr('Librairie jsrsasign non chargée.'); return;
                    }

                    let kp, sigAlg;
                    if (isRSA) {
                        kp     = KEYUTIL.generateKeypair('RSA', rsaBits);
                        sigAlg = 'SHA256withRSA';
                    } else {
                        kp     = KEYUTIL.generateKeypair('EC', certEcCurve.value);
                        sigAlg = 'SHA256withECDSA';
                    }

                    const privPEM  = KEYUTIL.getPEM(kp.prvKeyObj, 'PKCS8PRV');
                    const subject  = buildSubject();
                    const sanArray = getSanArray();

                    if (mode === 'csr') {
                        const csrOpts = {
                            subject:    {str: subject},
                            sbjpubkey:  kp.pubKeyObj,
                            sigalg:     sigAlg,
                            sbjprvkey:  kp.prvKeyObj
                        };
                        if (sanArray.length) {
                            csrOpts.extreq = [{extname: 'subjectAltName', array: sanArray}];
                        }
                        const csrPEM = KJUR.asn1.csr.CSRUtil.newCSRPEM(csrOpts);
                        showResult(privPEM, csrPEM, true, 'csr');

                    } else {
                        const today   = new Date();
                        const notAfter = new Date(today.getTime() + parseInt(certValidity.value) * 86400000);
                        const exts = [
                            {extname: 'basicConstraints', cA: false},
                            {extname: 'keyUsage', critical: true, names: ['digitalSignature', 'keyEncipherment']}
                        ];
                        if (sanArray.length) exts.push({extname: 'subjectAltName', array: sanArray});

                        const cert = new KJUR.asn1.x509.Certificate({
                            version:   3,
                            serial:    {int: (Math.floor(Math.random() * 0xFFFFFF) + 1)},
                            issuer:    {str: subject},
                            subject:   {str: subject},
                            notbefore: {str: utcStr(today)},
                            notafter:  {str: utcStr(notAfter)},
                            sbjpubkey: kp.pubKeyObj,
                            ext:       exts,
                            cakey:     kp.prvKeyObj,
                            sigalg:    sigAlg
                        });
                        showResult(privPEM, cert.getPEM(), false, 'crt');
                    }
                } catch(e) {
                    showErr('Erreur : ' + e.message);
                    console.error(e);
                }
            }, 80);
        }

        certGenSelf.addEventListener('click', () => generate('selfsigned'));
        certGenCSR.addEventListener('click',  () => generate('csr'));

        // Copy / Download
        function copyPEM(btnId, srcId) {
            document.getElementById(btnId)?.addEventListener('click', function() {
                navigator.clipboard.writeText(document.getElementById(srcId).textContent).then(() => {
                    const orig = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => { this.innerHTML = orig; }, 1500);
                });
            });
        }
        function dlPEM(btnId, srcId, defaultName) {
            document.getElementById(btnId)?.addEventListener('click', function() {
                const ext  = this.dataset.ext || defaultName.split('.').pop();
                const name = defaultName.replace(/\.[^.]+$/, '.' + ext);
                const blob = new Blob([document.getElementById(srcId).textContent], {type: 'text/plain'});
                const url  = URL.createObjectURL(blob);
                const a    = Object.assign(document.createElement('a'), {href: url, download: name});
                document.body.appendChild(a); a.click();
                document.body.removeChild(a); URL.revokeObjectURL(url);
            });
        }
        copyPEM('cert-copy-privkey', 'cert-privkey-out');
        copyPEM('cert-copy-cert',    'cert-cert-out');
        dlPEM('cert-dl-privkey', 'cert-privkey-out', 'private.key');
        dlPEM('cert-dl-cert',    'cert-cert-out',    'certificate.crt');

        document.getElementById('cert-clear')?.addEventListener('click', function() {
            ['cert-cn','cert-o','cert-ou','cert-l','cert-st','cert-c'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            document.getElementById('cert-san-list').innerHTML = '';
            if (certPrivkeyOut) certPrivkeyOut.textContent = 'Générez un certificat ou un CSR pour voir la clé privée.';
            if (certCertOut)    certCertOut.textContent    = 'Générez un certificat ou un CSR pour voir le résultat.';
            document.getElementById('cert-error')?.classList.add('d-none');
        });
    })();

    // UUID Generator
    (function() {
        const uuidVersion  = document.getElementById('uuid-version');
        const uuidCount    = document.getElementById('uuid-count');
        const uuidNsSec    = document.getElementById('uuid-namespace-section');
        const uuidNs       = document.getElementById('uuid-namespace');
        const uuidName     = document.getElementById('uuid-name');
        const uuidGenBtn   = document.getElementById('uuid-generate');
        const uuidList        = document.getElementById('uuid-list');
        const uuidResultBlock = document.getElementById('uuid-result-block');
        const uuidCopyAll     = document.getElementById('uuid-copy-all');
        const uuidDlAll       = document.getElementById('uuid-download-all');
        if (!uuidGenBtn) return;

        const NS = {
            dns:  '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
            url:  '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
            oid:  '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
            x500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8'
        };

        uuidVersion.addEventListener('change', function() {
            uuidNsSec.style.display = (this.value === '3' || this.value === '5') ? '' : 'none';
        });

        function uuidToBytes(uuid) {
            const h = uuid.replace(/-/g, '');
            return Array.from({length: 16}, (_, i) => parseInt(h.substr(i * 2, 2), 16));
        }

        function applyVersionVariant(hashHex, version) {
            const h = hashHex.slice(0, 32);
            const v  = ((parseInt(h[12], 16) & 0x0F) | (version << 4)).toString(16);
            const va = ((parseInt(h[16], 16) & 0x3F) | 0x80).toString(16);
            return `${h.slice(0,8)}-${h.slice(8,12)}-${v}${h.slice(13,16)}-${va}${h.slice(17,20)}-${h.slice(20,32)}`;
        }

        function genV1() {
            const t = BigInt(Date.now()) * 10000n + 122192928000000000n;
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
            const tsHex = BigInt(Date.now()).toString(16).padStart(12, '0');
            const rand  = crypto.getRandomValues(new Uint8Array(10));
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

        function renderUUIDs(uuids) {
            uuidList.innerHTML = '';
            uuids.forEach(uuid => {
                const row = document.createElement('div');
                row.className = 'd-flex align-items-center justify-content-between gap-2 mb-1';
                const code = document.createElement('span');
                code.className = 'text-info';
                code.textContent = uuid;
                const btn = document.createElement('button');
                btn.className = 'btn btn-sm btn-outline-info flex-shrink-0';
                btn.title = 'Copier';
                btn.innerHTML = '<i class="fas fa-copy"></i>';
                btn.addEventListener('click', function() {
                    navigator.clipboard.writeText(uuid).then(() => {
                        this.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => { this.innerHTML = '<i class="fas fa-copy"></i>'; }, 1500);
                    });
                });
                row.appendChild(code);
                row.appendChild(btn);
                uuidList.appendChild(row);
            });
        }

        uuidGenBtn.addEventListener('click', function() {
            const ver   = uuidVersion.value;
            const count = Math.min(100, Math.max(1, parseInt(uuidCount.value) || 1));
            const nsKey = uuidNs?.value || 'dns';
            const name  = uuidName?.value.trim() || '';

            if ((ver === '3' || ver === '5') && !name) {
                uuidList.innerHTML = '<p class="text-danger mb-0"><i class="fas fa-exclamation-triangle me-1"></i>Un nom est requis pour les versions v3 et v5.</p>';
                return;
            }
            lastUUIDs = Array.from({length: count}, () => generateOne(ver, nsKey, name));
            renderUUIDs(lastUUIDs);
            uuidResultBlock.style.display = '';
        });

        uuidCopyAll?.addEventListener('click', function() {
            if (!lastUUIDs.length) return;
            navigator.clipboard.writeText(lastUUIDs.join('\n')).then(() => {
                const orig = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => { this.innerHTML = orig; }, 1500);
            });
        });

        document.getElementById('uuid-clear')?.addEventListener('click', function() {
            lastUUIDs = [];
            uuidList.innerHTML = '';
            uuidResultBlock.style.display = 'none';
        });

        uuidDlAll?.addEventListener('click', function() {
            if (!lastUUIDs.length) return;
            const blob = new Blob([lastUUIDs.join('\n')], {type: 'text/plain'});
            const url  = URL.createObjectURL(blob);
            const a    = Object.assign(document.createElement('a'), {href: url, download: 'uuids.txt'});
            document.body.appendChild(a); a.click();
            document.body.removeChild(a); URL.revokeObjectURL(url);
        });
    })();

    // Hex (Base16) Encoder / Decoder
    (function() {
        const hexInput     = document.getElementById('hex-input');
        const encodeBtn    = document.getElementById('encode-hex');
        const decodeBtn    = document.getElementById('decode-hex');
        const clearBtn     = document.getElementById('clear-hex');
        const resultBlock  = document.getElementById('hex-result-container');
        const resultPre    = document.getElementById('hex-result');
        const copyBtn      = document.getElementById('copy-hex');
        const dlBtn        = document.getElementById('download-hex');
        if (!encodeBtn) return;

        function showResult(text) {
            resultPre.textContent = text;
            resultBlock.style.display = '';
        }

        encodeBtn.addEventListener('click', function() {
            const input = hexInput.value;
            if (!input) return;
            const hex = Array.from(new TextEncoder().encode(input))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
            showResult(hex);
        });

        decodeBtn.addEventListener('click', function() {
            const input = hexInput.value.trim().replace(/\s+/g, '');
            if (!input) return;
            if (!/^[0-9a-fA-F]+$/.test(input) || input.length % 2 !== 0) {
                showResult('Erreur : valeur hexadécimale invalide (caractères non-hex ou longueur impaire).');
                return;
            }
            try {
                const bytes = new Uint8Array(input.length / 2);
                for (let i = 0; i < input.length; i += 2) {
                    bytes[i / 2] = parseInt(input.substr(i, 2), 16);
                }
                showResult(new TextDecoder().decode(bytes));
            } catch(e) {
                showResult('Erreur : impossible de décoder cette valeur.');
            }
        });

        clearBtn?.addEventListener('click', function() {
            hexInput.value = '';
            resultPre.textContent = '';
            resultBlock.style.display = 'none';
        });

        copyBtn?.addEventListener('click', function() {
            navigator.clipboard.writeText(resultPre.textContent).then(() => {
                const orig = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => { this.innerHTML = orig; }, 1500);
            });
        });

        dlBtn?.addEventListener('click', function() {
            const blob = new Blob([resultPre.textContent], {type: 'text/plain'});
            const url  = URL.createObjectURL(blob);
            const a    = Object.assign(document.createElement('a'), {href: url, download: 'hex.txt'});
            document.body.appendChild(a); a.click();
            document.body.removeChild(a); URL.revokeObjectURL(url);
        });
    })();

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
