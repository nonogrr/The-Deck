# The Deck — Instructions & Conventions

## UX / UI

### Architecture générale

L'application est un toolbox développeur en **frontend pur** (HTML/CSS/JS ES Modules, aucun build step).
Chaque outil est un module ES (`modules/*.js`) qui exporte :
- `html` — template string contenant le markup de l'outil
- `init()` — fonction d'initialisation des événements et de la logique

---

### Structure en 3 blocs

Chaque outil suit obligatoirement une structure à **3 blocs verticaux** dans cet ordre :

```
[ cfg-block   ]  ← Configuration / inputs utilisateur
[ cmd-block   ]  ← Commande Linux équivalente
[ results-block] ← Résultats générés
```

#### `.cfg-block` — Configuration

- Contient tous les champs de saisie (inputs, selects, textareas, checkboxes)
- Contient les boutons d'action (Générer, Encoder, Décoder, Effacer…)
- Peut contenir des spinners de chargement et des alertes d'erreur
- Le bouton principal utilise `btn-custom-primary`, les secondaires `btn-outline-*` ou `btn-outline-secondary`

#### `.cmd-block` — Commande Linux

- Affiche la commande shell équivalente à l'opération en cours
- La commande se **met à jour dynamiquement** en fonction des inputs utilisateur (algo, longueur, texte saisi…)
- Structure interne fixe :
  ```html
  <div class="cmd-block">
      <div class="cmd-block-inner">
          <div class="cmd-block-label"><i class="fas fa-terminal me-1"></i> Linux</div>
          <pre id="xxx-cmd">commande par défaut</pre>
      </div>
      <button class="btn btn-sm btn-outline-warning" id="copy-xxx-cmd" title="Copier la commande">
          <i class="fas fa-copy"></i>
      </button>
  </div>
  ```

#### `.results-block` — Résultats

- Masqué par défaut (`style="display:none;"`) et affiché après la première action
- Contient un ou plusieurs `.result-item`
- Chaque `.result-item` est créé via la fonction utilitaire `createResultItem()` (voir `modules/utils.js`)

---

### `.result-item` — Anatomie d'un résultat

```
┌─────────────────────────────────────────────────────┐
│  TITRE DU RÉSULTAT           [icone copie] [icone dl]│  ← .result-item-header
│  ┌───────────────────────────────────────────────┐   │
│  │ contenu du résultat sur fond noir             │   │  ← <pre>
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

Créé avec :
```javascript
const w = createResultItem(icon, title, content, color, filename, scrollable);
// w.el  → élément DOM à appender
// w.pre → référence au <pre> pour mise à jour via w.pre.textContent = newValue
```

- `icon` : classe Font Awesome (ex. `'fas fa-key'`)
- `color` : couleur Bootstrap (ex. `'warning'`, `'success'`, `'info'`, `'primary'`) — ignoré visuellement en thème clair/sombre car les couleurs sont overridées par CSS (voir ci-dessous), mais conservé pour cohérence sémantique
- `filename` : si fourni, affiche le bouton de téléchargement
- `scrollable` : si `true`, ajoute `max-height: 180px` avec scroll sur le `<pre>`

**Pattern de mise à jour sans reconstruction DOM :**
```javascript
let widget = null;
// Première fois :
widget = createResultItem(...);
container.appendChild(widget.el);
// Mises à jour suivantes :
widget.pre.textContent = newValue;
```

---

### Thèmes — Clair / Sombre

Le thème est géré par la classe `.dark-mode` sur `<body>`.
Les variables CSS sont définies dans `:root` (clair) et `body.dark-mode` (sombre).

| Variable CSS           | Thème clair  | Thème sombre |
|------------------------|--------------|--------------|
| `--custom-primary`     | `#4CAF50`    | `#2E7D32`    |
| `--custom-secondary`   | `#f5f5f5`    | `#1e1e1e`    |
| `--custom-sidebar`     | `#3a3b45`    | `#25262e`    |
| `--custom-border`      | `#dddddd`    | `#444444`    |
| `--custom-text`        | `#000000`    | `#ffffff`    |

---

### Palette des 3 blocs

Tous les blocs partagent le même fond, avec des accents de couleur différents :

| Propriété                     | Thème clair   | Thème sombre  |
|-------------------------------|---------------|---------------|
| **Fond** (les 3 blocs)        | `#f5f5f5`     | `#1e1e1e`     |
| **Bord gauche cmd-block**     | `#d4890a`     | `#ffa500`     |
| **Bord gauche results-block** | `#2e7d32`     | `#4CAF50`     |
| **Fond des `<pre>`**          | `#000000`     | `#000000`     |
| **Texte dans `<pre>` (cmd)**  | `#ffa500`     | `#ffa500`     |
| **Texte dans `<pre>` (result)**| `#4CAF50`    | `#4CAF50`     |

---

### Titres, icônes et boutons dans les blocs

| Élément                          | Thème clair  | Thème sombre |
|----------------------------------|--------------|--------------|
| Label "Linux" (`cmd-block-label`)| `#000000`    | `#ffffff`     |
| Bouton copie cmd (`cmd-block`)   | `#000000`    | `#ffffff`     |
| Titres résultats (`.result-item-title`) | `#000000` | `#ffffff`  |
| Boutons copie/save résultats     | `#000000`    | `#ffffff`     |
| Hover boutons (tous)             | fond `#000000` / texte `#ffffff` | fond `#ffffff` / texte `#000000` |

---

### Typographie

- **Interface générale** : Bootstrap 5 par défaut
- **Contenu monospace** (commandes, résultats) : `'Roboto Mono', 'SF Mono', 'Consolas', monospace` — taille `0.8rem`
- **Titres de blocs résultats** : `0.75rem`, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.07em`
- **Label cmd-block** : `0.7rem`, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.08em`

---

### Icônes

- Librairie : **Font Awesome 6.7.2** (`cdnjs.cloudflare.com`)
- Ne jamais utiliser une autre version ou une URL non vérifiée (risque de casser toutes les icônes)
- Préfixe `fas` pour les icônes solid

---

### Librairies crypto disponibles (globales CDN)

| Global         | Usage                                      |
|----------------|--------------------------------------------|
| `CryptoJS`     | MD5, SHA-1/256/512/3, HMAC, AES            |
| `sha1()`       | SHA-1 natif                                |
| `bcrypt`       | bcryptjs — hash de mots de passe           |
| `KEYUTIL`      | jsrsasign — génération clés RSA/EC         |
| `KJUR`         | jsrsasign — certificats X.509, CSR, JWT    |
| `nacl`         | TweetNaCl — Ed25519                        |
| `elliptic`     | ECDSA/ECDH                                 |
| `JSEncrypt`    | RSA chiffrement/déchiffrement              |

---

### Comportements attendus

- Les résultats sont **toujours masqués au départ** et affichés après la première action
- La commande Linux se met à jour **en temps réel** sur chaque changement d'input pertinent
- Le bouton **Effacer** remet à zéro les inputs, masque les résultats et réinitialise la commande Linux
- Les erreurs s'affichent dans une `alert alert-danger` dans le `.cfg-block`, jamais dans le `.results-block`
- Le chargement asynchrone (ex. bcrypt, RSA 4096) affiche un spinner dans le `.cfg-block` avant de peupler les résultats
