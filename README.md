# The Deck 🎴

Une collection d'outils web pratiques et conviviaux pour les développeurs et les utilisateurs avancés.

## 🚀 Fonctionnalités

### Crypto
- **Token Generator** - Générer des tokens aléatoires sécurisés
- **Hash / HMAC** - Hasher du texte avec différents algorithmes
- **Bcrypt** - Générer et vérifier des mots de passe bcrypt
- **Key Generator** - Créer des clés cryptographiques
- **Base64** - Encoder et décoder en Base64

### Design
- **Color Picker** - Sélectionner et convertir des couleurs


🛡️ Cryptographie & Secret (Le cœur du Deck)

    Générateur de mot de passe / Secret : Avec options (longueur, caractères spéciaux, entropie estimée).

    Encodeur / Décodeur multi-formats : Base64, Hex, URL Encode, mais aussi JWT Decoder (pour inspecter le payload d'un token sans le valider).

    Formatage de clés : Un outil pour convertir une clé privée du format .pem vers une seule ligne (pour les variables d'environnement CI/CD) et inversement.

    Vérificateur de robustesse (Password Strength) : Utilise une bibliothèque comme zxcvbn pour donner un score réel.

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
