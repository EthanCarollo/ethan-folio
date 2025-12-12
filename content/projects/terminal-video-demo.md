---
title: Terminal Video Player Demo
date: 12-12-2025
image: /images/project-placeholder.svg
role: Developer
category: Demo
tags: ["Vue", "Nuxt", "Video", "Terminal"]
---

# Terminal Video Player Demo

Voici une démonstration du lecteur vidéo terminal avec la nouvelle props `forceMute` :

## Vidéo avec contrôles complets

<TerminalVideoPlayer 
  src="/virusmania_media/les_debuts.mp4"
  poster="/images/project-placeholder.svg"
  title="Demo Video avec contrôles"
/>

## Vidéo en mode forceMute (sans contrôles audio)

<TerminalVideoPlayer 
  src="/virusmania_media/les_debuts.mp4"
  title="Demo Video mode muet forcé"
  :forceMute="true"
/>

## Caractéristiques

Ce lecteur vidéo terminal inclut :

- **Interface terminal** avec design épuré
- **Props `forceMute`** pour forcer le mode muet et cacher les contrôles audio
- **Contrôles intelligents** qui s'adaptent selon l'état de la vidéo
- **Thumbnail automatique** : capture de la première frame si aucune image fournie
- **Design responsive** qui s'adapte aux mobiles
- **Style cohérent** avec le thème terminal du site

## Utilisation

Le composant peut être utilisé dans n'importe quel contenu markdown avec :

### Mode normal (avec contrôles audio) :
```html
<TerminalVideoPlayer 
  src="/path/to/video.mp4"
  poster="/path/to/poster.jpg"
  title="Titre de la vidéo"
  :autoplay="false"
/>
```

### Mode forceMute (sans contrôles audio) :
```html
<TerminalVideoPlayer 
  src="/path/to/video.mp4"
  title="Vidéo en mode muet"
  :forceMute="true"
/>
```

Les props disponibles sont :
- `src` (obligatoire) : URL de la vidéo
- `poster` (optionnel) : Image de miniature
- `title` (optionnel) : Titre affiché dans l'en-tête
- `autoplay` (optionnel) : Lecture automatique (défaut: false)
- `forceMute` (optionnel) : Force le mode muet et cache les contrôles audio (défaut: false)
