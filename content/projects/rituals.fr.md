---
title: "Rituals"
date: "23-10-2025"
image: "/images/rituals.png"
category: "Game Dev"
tags: ["Unity", "C#", "PyTorch", "AI"]
slug: "rituals"
repo: "https://github.com/methil-mods/rituals"
link: "https://ethanzxv.itch.io/rituals"
---

**Rituals** est un jeu d'énigmes atmosphérique créé en collaboration avec **Théo ([nak0x](https://github.com/nak0x))** dans le cadre de la [Cosmic Horrors Jam 4](https://itch.io/jam/cosmichorrorsjam4). La progression dépend de votre capacité à découvrir et à reproduire des symboles anciens. Le cœur du gameplay repose sur une mécanique unique : la découverte de dessins cachés qui, une fois tracés correctement, permettent d'invoquer des monstres via des rituels mystiques pour débloquer la suite de l'aventure.

### Reconnaissance par Intelligence Artificielle

Pour ce projet, un **CNN (Convolutional Neural Network)** a été conçu spécifiquement pour reconnaître les différents rituels tracés par le joueur. Ce réseau de neurones permet une interaction fluide et organique, transformant de simples dessins en commandes de jeu complexes.

- **Entraînement** : Le modèle a été entraîné à l'aide de PyTorch. Vous pouvez consulter le [notebook d'entraînement (ipynb)](https://github.com/methil-mods/rituals/blob/main/ritualcnn/ritualcnn.ipynb) pour voir les détails de l'architecture et du dataset.
- **Données** : Le dataset est composé de milliers d'exemples de rituels dessinés à la main, comme cet [exemple de donnée brute](https://github.com/methil-mods/rituals/blob/main/ritualcnn/data/flosculus/flosculus-ritual11.png).

Retrouvez le code source complet sur le [repository GitHub officiel](https://github.com/methil-mods/rituals).
