export const html = `
<div class="container">
    <h2 class="mb-4">Bienvenue dans The Deck</h2>
    <div class="row g-4">
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="token-generator">
                <div class="card-body text-center">
                    <i class="fas fa-key fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">Token Generator</h5>
                    <p class="card-text text-muted">Générez des tokens aléatoires sécurisés</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="hash-text">
                <div class="card-body text-center">
                    <i class="fas fa-fingerprint fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">Hash / HMAC</h5>
                    <p class="card-text text-muted">Calculez des hashes avec clé secrète</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="bcrypt-generator">
                <div class="card-body text-center">
                    <i class="fas fa-shield-alt fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">Bcrypt</h5>
                    <p class="card-text text-muted">Hashage sécurisé de mots de passe</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="key-generator">
                <div class="card-body text-center">
                    <i class="fas fa-lock fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">Key Generator</h5>
                    <p class="card-text text-muted">Générez des clés cryptographiques</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="jwt-decoder">
                <div class="card-body text-center">
                    <i class="fas fa-id-card fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">JWT</h5>
                    <p class="card-text text-muted">Encodez et décodez vos tokens JWT</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="cert-generator">
                <div class="card-body text-center">
                    <i class="fas fa-certificate fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">Certificate Generator</h5>
                    <p class="card-text text-muted">Générez certificats autosignés et CSR</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="uuid-generator">
                <div class="card-body text-center">
                    <i class="fas fa-dice fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">UUID Generator</h5>
                    <p class="card-text text-muted">Générez des UUIDs v1, v3, v4, v5, v7</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="hex-encoder">
                <div class="card-body text-center">
                    <i class="fas fa-hashtag fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">Hex (Base16)</h5>
                    <p class="card-text text-muted">Encodez et décodez en hexadécimal</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="color-picker">
                <div class="card-body text-center">
                    <i class="fas fa-palette fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">Color Picker</h5>
                    <p class="card-text text-muted">Convertissez les formats de couleurs</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="datetime-converter">
                <div class="card-body text-center">
                    <i class="fas fa-clock fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">Date-Time</h5>
                    <p class="card-text text-muted">Convertissez les dates et fuseaux</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="device-info">
                <div class="card-body text-center">
                    <i class="fas fa-mobile-alt fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">Device Info</h5>
                    <p class="card-text text-muted">Consultez les infos de votre appareil</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="http-codes">
                <div class="card-body text-center">
                    <i class="fas fa-list-ol fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">HTTP Codes</h5>
                    <p class="card-text text-muted">Consultez les codes HTTP</p>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-custom cursor-pointer home-card" data-section="subnet-calculator">
                <div class="card-body text-center">
                    <i class="fas fa-network-wired fa-3x mb-3" style="color: var(--custom-primary);"></i>
                    <h5 class="card-title">Subnet Calculator</h5>
                    <p class="card-text text-muted">Calculez les subnets réseau</p>
                </div>
            </div>
        </div>
    </div>
</div>
`;

export function init({ navigate } = {}) {
    document.querySelectorAll('.home-card').forEach(card => {
        card.addEventListener('click', () => {
            const sectionId = card.getAttribute('data-section');
            if (navigate) navigate(sectionId);
        });
    });
}
