# The Deck 🎴

Une collection d'outils web pratiques et conviviaux pour les développeurs et les utilisateurs avancés.

## 🚀 Fonctionnalités

### Crypto
- **Token Generator** - Générer des tokens aléatoires sécurisés avec calcul de l'entropie
- **Hash / HMAC** - Hasher du texte avec différents algorithmes
- **Bcrypt** - Générer et vérifier des mots de passe bcrypt
- **Key Generator** - Créer des clés cryptographiques
- **Certificat Generator** - Génération d'un certificat auto-signé ou d'un CSR
- **UUIDs Generator** - Générez des UUIDs v1, v3, v4, v5, v7
- **Base64** - Encoder et décoder en Base64
- **Hex (Base 16)** - Encoder et décoder en Hex (Base 16) : à venir
- **JWT Decoder** - Décodage d'un JWT (JSON Web Token)

### Design
- **Color Picker** - Sélectionner et convertir des couleurs


🛡️ Cryptographie & Secret (Le cœur du Deck)

Encodage / Décodage

URL Encode/Decode — très courant en debug d'APIs REST
HTML Entities Encode/Decode — utile pour le dev frontend / XSS analysis
Binary / Octal converter — compléter Base16/Base64 avec les autres bases
Hashing / Passwords

Argon2 — successeur moderne de Bcrypt (recommandé par OWASP)
PBKDF2 — standard pour la dérivation de clés (Web Crypto API natif)
Hash compare — vérifier si un texte correspond à un hash bcrypt/argon2 existant
Asymétrique / PKI

PEM Inspector — parser et afficher le contenu d'un PEM (certificat, clé) : subject, issuer, dates, SANs, fingerprint
SSH Key Generator — générer une paire ED25519/RSA au format OpenSSH (ssh-keygen en JS)
TOTP Generator — générer des codes OTP (Google Authenticator compatible, RFC 6238)
Symétrique

AES Encrypt/Decrypt — chiffrement symétrique AES-GCM ou AES-CBC avec clé et IV
HMAC standalone — actuellement intégré dans Hash/HMAC, mais un outil dédié avec choix d'algo et format de sortie serait plus lisible
Tokens / Auth

JWT Builder — en complément du JWT Decoder existant, construire et signer un JWT (HS256/RS256)
OAuth2 / PKCE helper — générer code_verifier + code_challenge (utile pour les devs qui intègrent des flows OAuth)
Utilitaires

Diff tool — comparer deux chaînes ou deux blocs PEM/JSON
Regex tester — tester des regex avec highlight des groupes
CRC32 / Adler32 — checksums courants en protocoles réseau/embarqué
Priorité suggérée si tu veux avancer par valeur ajoutée :

TOTP Generator — très demandé, 100% client-side avec WebCrypto
AES Encrypt/Decrypt — manque flagrant dans un toolbox crypto
URL Encode/Decode — usage quotidien
PEM Inspector — complète naturellement le Certificate Generator existant
JWT Builder — complète le JWT Decoder


🌐 Réseau & Infrastructure (Le côté Ops)

    Explorateur de Certificat TLS : Permet de coller un certificat PEM pour extraire les dates d'expiration, l'émetteur et les SAN (Subject Alternative Names).

    Générateur de Config SSH : Un petit formulaire pour générer un bloc de texte propre pour le fichier ~/.ssh/config.

    Validateur de Cron : Un champ pour tester une expression Cron et voir les prochaines exécutions (très utile pour les pipelines).

    Générateur de Policy (IAM/S3) : Des templates interactifs pour générer des JSON de politiques de sécurité AWS ou GCP de base.

📜 Analyse & Qualité (Le côté Dev)

    JSON / YAML / HCL Linter & Formatter : Pour nettoyer les fichiers de config Kubernetes ou Terraform.

    Extracteur de Secrets (Regex simple) : Un champ où l'on colle un log pour détecter si des patterns (API Keys, Token) s'y trouvent avant de les partager.

    Comparateur de texte (Diff Checker) : Pour comparer deux versions d'une config ou d'un fichier de déploiement.

🎨 Utilitaires UI/UX

    Convertisseur d'unités pour le Web : PX en REM, ou calcul de contraste (WCAG) entre deux couleurs pour l'accessibilité de tes dashboards.


## 📋 Prérequis

- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Connexion Internet (pour les CDN externes)

## 🛠️ Installation

1. Clonez le projet ou téléchargez les fichiers
2. Ouvrez `index.html` dans votre navigateur web
3. Commencez à utiliser les outils!

## 📁 Structure du projet

```
The-Deck/
├── index.html       # Page principale (HTML)
├── the-deck.css    # Styles (CSS)
├── the-deck.js     # Logique (JavaScript)
└── README.md       # Documentation
```

## 🎨 Technologie

- **HTML5** - Structure
- **CSS3** - Styling
- **JavaScript** - Interactivité
- **Bootstrap 5.3** - Framework CSS
- **Font Awesome 6.4** - Icônes
- **Google Fonts** - Typos (Roboto Mono)

## ⚙️ Fonctionnalités principales

### Navigation
- Barre latérale repliable
- Menu de navigation intuitif
- Recherche d'outils

### Thème
- Mode clair / mode sombre
- Préférences sauvegardées en localStorage

## 📝 Utilisation

1. Utilisez la barre latérale pour naviguer entre les différents outils
2. Cliquez sur un outil pour accéder à sa fonctionnalité
3. Utilisez le bouton thème (🌙/☀️) pour changer le mode d'affichage
4. Utilisez la barre de recherche pour trouver rapidement un outil

## 📄 Licence

À définir par l'auteur du projet

## 👨‍💻 Auteur

Créé avec ❤️ pour les développeurs
