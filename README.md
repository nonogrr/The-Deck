# The Deck 🎴

Une collection d'outils web pratiques et conviviaux pour les développeurs et les utilisateurs avancés.

## 🚀 Fonctionnalités

### Crypto
- **Token Generator** - Générer des tokens aléatoires sécurisés avec calcul de l'entropie
- **Hash / HMAC** - Hasher du texte avec différents algorithmes
- **Bcrypt** - Générer et vérifier des mots de passe bcrypt
- **SSH Key Generator** - Créer des clés cryptographiques SSH
- **Certificat** - Génération d'un certificat auto-signé ou d'un CSR / Explorateur de Certificat TLS
- **UUIDs Generator** - Générez des UUIDs v1, v3, v4, v5, v7
- **Base64** - Encoder et décoder en Base64
- **Hex (Base 16)** - Encoder et décoder en Hex (Base 16) : à venir
- **JWT** - Encodage et décodage d'un JWT (JSON Web Token)

### Utilitaires
- **Diff tool** — comparer deux chaînes ou deux blocs 

### Design
- **Color Picker** - Sélectionner et convertir des couleurs

## 🚀 RoadMap

🛡️ Cryptographie & Secret (Le cœur du Deck)

Encodage / Décodage
- URL Encode/Decode — très courant en debug d'APIs REST
- HTML Entities Encode/Decode — utile pour le dev frontend / XSS analysis
- Binary / Octal converter — compléter Base16/Base64 avec les autres bases
- Hashing / Passwords
- Argon2 — successeur moderne de Bcrypt (recommandé par OWASP)
- PBKDF2 — standard pour la dérivation de clés (Web Crypto API natif)
- Hash compare — vérifier si un texte correspond à un hash bcrypt/argon2 existant
- Asymétrique / PKI
- TOTP Generator — générer des codes OTP (Google Authenticator compatible, RFC 6238)
- AES Encrypt/Decrypt — chiffrement symétrique AES-GCM ou AES-CBC avec clé et IV
- HMAC standalone — actuellement intégré dans Hash/HMAC, mais un outil dédié avec choix d'algo et format de sortie 
- OAuth2 / PKCE helper — générer code_verifier + code_challenge (utile pour les devs qui intègrent des flows OAuth)

Utilitaires
  - Diff tool — comparer deux chaînes ou deux blocs PEM/JSON
  - Regex tester — tester des regex avec highlight des groupes
  - CRC32 / Adler32 — checksums courants en protocoles réseau/embarqué
  

SysOps
  -  Générateur de Config SSH : Un petit formulaire pour générer un bloc de texte propre pour le fichier ~/.ssh/config.
  - Validateur de Cron : Un champ pour tester une expression Cron et voir les prochaines exécutions (très utile pour les pipelines).
  - PS1 BASH générator avec des templates

🌐 Réseau & Infrastructure (Le côté Ops)

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
- **Font Awesome 7.2** - Icônes
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
3. Utilisez le bouton thème  pour changer le mode d'affichage
4. Utilisez la barre de recherche pour trouver rapidement un outil

## 📄 Licence

À définir par l'auteur du projet

## 👨‍💻 Auteur

Créé avec ❤️ pour les développeurs
