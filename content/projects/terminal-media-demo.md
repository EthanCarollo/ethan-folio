---
title: Terminal Media Demo - Performance Optimisée
date: 12-12-2025
image: /images/project-placeholder.svg
role: Developer
category: Demo
tags: ["Performance", "Terminal", "Media"]
---

# Terminal Media Demo - Performance Optimisée

## Vidéo optimisée (pour une seule vidéo)

<TerminalVideoPlayer 
  src="/virusmania_media/les_debuts.mp4"
  title="Demo Video Optimisée"
/>

## Image légère (pour plusieurs médias)

<TerminalImagePlayer 
  src="/images/project-placeholder.svg"
  title="Demo Image Ultra-Light"
/>

## Recommandations de performance

### Pour une seule vidéo :
- Utilisez `TerminalVideoPlayer` avec `forceMute="true"` si pas besoin de son
- La vidéo est lazy-loaded et optimisée

### Pour plusieurs médias :
- **Utilisez `TerminalImagePlayer`** au lieu de `TerminalVideoPlayer`
- Les images sont beaucoup plus légères que les vidéos
- Pas de lag, chargement instantané

### Optimisations appliquées :
1. **MouseTrail désactivé** sur les pages projet
2. **Lazy loading** des vidéos
3. **Mises à jour limitées** à 500ms
4. **Pause automatique** des vidéos hors écran
5. **Version image ultra-légère** disponible

## Code d'exemple

```html
<!-- Pour une vidéo unique -->
<TerminalVideoPlayer 
  src="/video.mp4"
  title="Ma vidéo"
  :forceMute="true"
/>

<!-- Pour plusieurs médias (RECOMMANDÉ) -->
<TerminalImagePlayer 
  src="/image.jpg"
  title="Mon image"
/>
```

## Performance maximale

Pour des performances optimales avec plusieurs médias :
- **Privilégiez les images** aux vidéos
- **Utilisez le mode forceMute** pour les vidéos
- **Évitez les autoplay** multiples

Le résultat : **0 lag**, navigation fluide, expérience utilisateur parfaite !
