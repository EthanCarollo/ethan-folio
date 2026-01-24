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


# Introduction

Tout a commencé par une envie simple : participer à une Game Jam avec Théo ([Nak0x](https://github.com/nak0x)). Nous avons jeté notre dévolu sur la [Cosmic Horrors Jam 4](https://itch.io/jam/cosmichorrorsjam4), dont le thème tournait autour de l'horreur cosmique.

> C'est un thème qui nous plaisait plutôt bien car nous avions toujours
> été intéressé aux contes de H. P. Lovecraft sans avoir vraiment pu 
> mettre un pied.

Ce genre de thème peut rapidement faire penser à des jeux qui existent déja,
comme par exemple `Call of Cthulu` (un JDR sur table qui me fait de l'oeil) ou bien
`Worshippers of Cthulhu` (qui est un jeu de gestion étonnament), mais
nous n'avions pas envie de réutiliser directement des entités connus comme
`Cthulu`, mais de nous en inspirer pour créer les notres.

Dès le départ, l'idée a germé de créer **un jeu vidéo de type escape game**. Le joueur doit progresser dans un environnement oppressant en découvrant des secrets anciens. Pour avancer, il est nécessaire d'invoquer des esprits en traçant des rituels mystiques, une mécanique qui nous a permis de mettre en pratique l'entraînement d'un CNN (Réseau de Neurones Convolutif) avec PyTorch.

# Le concept

**Rituals** est un jeu d'énigmes atmosphérique. La progression dépend de votre capacité à découvrir et à reproduire des symboles anciens. 
Le cœur du gameplay repose sur cette mécanique unique : la découverte de dessins cachés qui, une fois tracés correctement, 
permettent d'invoquer des entitées via des rituels mystiques pour débloquer la suite de l'aventure.

# Les entitées

## La phase d'idéation

Pour notre phase d'idéation des entitées, on s'est mit d'accord sur ce qu'on voulait pour
notre histoire principalement. des entitées qui racontent des choses et qui sont en lien entre elle.

Pour ça, un carnet du papier et on a tout écrit et tout documenté jusqu'au premier croquis.

## La phase de production

Les entités sont un point central du gameplay, et on est deux, et on a pas beaucoup de temps.
Dôté d'une spécialisation en art plastique pendant ma Terminale générale (et oui !), je sors la tablette
graphique et je commence à gribouiller des entitées de manière chaotique, car c'est le sentiment qu'on
souhaite avoir quand on les voit. L'idée, n'est pas de faire des entitées parfaite, mais que ces entitées
sont tellement au dessus de nous, les humains, qu'on n'arrive à peine à les distinguer.

Donc on sort Krita et on gribouille les entitées.

| Mutus                                  | Regium                                  | Murmur                                  |
|----------------------------------------|-----------------------------------------|-----------------------------------------|
| <img src="/rituals_media/mutus.png" /> | <img src="/rituals_media/regium.png" /> | <img src="/rituals_media/murmur.png" /> |


> Le résultat reste assez peu maitrisé sur l'execution, ce n'est pas mon job, mais pour notre jeu vidéo, nous n'avions pas
> les prétentions de réaliser le jeu le plus beau du monde, il nous fallait un jeu, avec des énigmes, et une histoire.

# La technique derrière la magie

## Reconnaissance par Intelligence Artificielle

Pour ce projet, un **CNN (Convolutional Neural Network)** a été conçu spécifiquement pour reconnaître les différents rituels tracés par le joueur. 
Ce réseau de neurones permet une interaction fluide et organique, transformant de simples dessins en commandes de jeu complexes.

- **Entraînement** : Le modèle a été entraîné à l'aide de PyTorch. 
Vous pouvez consulter le [notebook d'entraînement (ipynb)](https://github.com/methil-mods/rituals/blob/main/ritualcnn/ritualcnn.ipynb) pour voir les détails de l'architecture et du dataset.
- **Données** : Le dataset est composé d'une vintaines d'exemples de rituels par catégorie dessinés à la main, 
comme cet [exemple de donnée brute](https://github.com/methil-mods/rituals/blob/main/ritualcnn/data/flosculus/flosculus-ritual11.png).

Une fois le modèle fait, il fallait pouvoir l'utiliser dans Unity, et pour ça
on a utilisé [Unity Barracuda](https://docs.unity3d.com/Packages/com.unity.barracuda@1.0/manual/index.html) qui 
est une bibliothèque d'inférence.

> Le plus gros soucis qu'on a eu était qu'au départ, nous avions entrainé
> le modèle avec Tensorflow, mais suite à des soucis d'export en .onnx (pour des raisons de
> compatibilité avec Barracuda), nous avons migré vers PyTorch.

Et c'est comme ça qu'à la fin, nous avons mis en place l'experience de
dessin pour invoquer des entités dans notre jeu.

# Liens

Retrouvez le code source complet sur le [repository GitHub officiel](https://github.com/methil-mods/rituals).
