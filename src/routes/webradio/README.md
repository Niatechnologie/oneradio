# 🎵 Webradios - Application Svelte 5

Application de lecteurs audio pour webradios construite avec **Svelte 5**.

## ✨ Fonctionnalités

- ✅ Lecture de flux audio en streaming
- ✅ Jauge de chargement avant lecture
- ✅ Arrêt automatique des autres lecteurs lors du démarrage d'une radio
- ✅ Contrôle du volume individuel pour chaque radio
- ✅ Indicateurs de statut en temps réel
- ✅ Gestion des erreurs
- ✅ Design responsive
- ✅ Pochettes des radios affichées à droite

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration de l'API

Dans le fichier `src/App.svelte`, modifiez la ligne 6 :

```javascript
const API_URL = 'votre_api.php'; // Remplacez par l'URL de votre fichier PHP
```

### 3. Structure des dossiers

Créez la structure suivante pour les pochettes :

```
public/
└── pochettes/
    ├── jazz/
    │   └── jazz.png
    ├── zouglou/
    │   └── zouglou.png
    ├── reggae/
    │   └── raggae.png
    ├── rumba/
    │   └── rumba.png
    ├── techno/
    │   └── electro.png
    ├── zouk/
    │   └── zouk.png
    ├── metal/
    │   └── metal.png
    ├── urban/
    │   └── urban.png
    ├── mandingue/
    │   └── mandingue.png
    ├── gospel/
    │   └── gospel.png
    ├── retro/
    │   └── retro.png
    └── amapiano/
        └── amapiano.png
```

## 🏃 Lancer l'application

### Mode développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`

### Prévisualiser le build

```bash
npm run preview
```

## 📁 Structure du projet

```
webradios-svelte5/
├── src/
│   ├── App.svelte          # Composant principal
│   ├── RadioCard.svelte    # Composant carte radio
│   └── main.js             # Point d'entrée
├── public/
│   └── pochettes/          # Images des pochettes
├── index.html              # HTML de base
├── package.json            # Dépendances
├── vite.config.js          # Configuration Vite
├── svelte.config.js        # Configuration Svelte
└── README.md               # Documentation
```

## 🎯 Technologies utilisées

- **Svelte 5** - Framework réactif avec les nouveaux runes ($state, $props, $derived)
- **Vite** - Build tool rapide
- **Vanilla JavaScript** - Pour l'API Audio HTML5

## 🔧 Nouveautés Svelte 5

Ce projet utilise les nouvelles fonctionnalités de Svelte 5 :

- `$state` - Pour la réactivité locale
- `$props` - Pour les propriétés des composants
- `$derived` - Pour les valeurs calculées
- `mount()` - Nouvelle API de montage

## 📝 Notes

- Les pochettes doivent être placées dans `public/pochettes/[repertoire]/[nom_fichier]`
- Le volume par défaut est à 70%
- Un seul lecteur peut jouer à la fois
- Les flux audio utilisent `preload='none'` pour économiser la bande passante

## 🐛 Dépannage

Si vous rencontrez des problèmes CORS avec votre API PHP, ajoutez ces headers dans votre fichier PHP :

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
```

## 📄 Licence

MIT
