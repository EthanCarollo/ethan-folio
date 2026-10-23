---
title: "Reincarnate As A Mimi"
date: "2026-10-20"
slug: "reincarnate-as-a-mimi"
description: "Un petit jeu vidéo vraiment bete."
tags: ["lab", "unity", "videogame"]
---

# Reincarnate As A Mimi

## Idée de base

C'est un petit projet tranquille que j'ai commencé pendant mon projet de mémoire à l'école car je voulais tester de faire un jeu vidéo complet en créant l'histoire et en générant tout le reste, l'idée est pas de se limiter à l'usage de X techs, mais vraiment tout utilisé.

Donc dans l'idée, d'abord j'ai fait une histoire toute simple inspirée d'Isekai lambda :

```
En gros, on est réincarné en tant que Mimi, on apparait niveau zéro et on ne connait rien à ce monde, ce 
sont les anciens citoyens du royaume des mimis qui s'est fait envahir par les tenebres qui vous ont appelé
vous devez donc sauver tout le monde pour revenir dans votre monde en anéantissant les tenebres.

Dans ce monde ruiné, vous devrez donc vaincre, explorer, crafter, farmer et évoluer pour devenir plus 
fort et sauver tout le monde.
```

Un scénario un peu débile, un peu normal, mon but est vraiment de testé, et de voir ce que je peux faire en taffant dessus le soir jusqu'au 24/10. Donc c'est mon point de départ, et cette note retracera un peu tout ce que j'ai fais chaque soir.

Donc je vais simplement utiliser le plugin Unity sorti il y a genre 3 semaines, et c'est parti, tout sera sur Unity. En gros, je veux un Isekai Chibi Hack And Slash, un mélange un peu spécial sachant que d'habitude, les Hack N Slash sont plutot genre mediévaux sombres.

## 20/10/2026 - Début, idée, sprites, tests

### Sprites et personnages

Premier soir, pour un projet full IA, je vais créer un dossier Specs (pour Spécificités en gros, je vais écrire dedans, tout ce que je veux et ce à quoi je veux que ça ressemble, pour qu'ensuite l'IA execute une premiere fois et ensuite faire aller retours etc,... le workflow n'est pas parfait, je veux simplement le tester et partager ici ce que j'en pense).

Dans ce dossier, je vais mettre mon histoire écrite plus haut, ainsi que les grands boss principaux qu'on affrontera

```
1: Mango
2: Myrtilla
3: Colladà
4: Amarena
5: Anone
6: Framboise
```

Et le style graphique que je veux, je vais faire un dossier refs avec des images d'exemples du style graphique que je veux

<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/reincarnate_media/ref/style-reference-01.png" alt="Ref 1" style="min-width: 200px; border-radius: 8px;" />
  <img src="/reincarnate_media/ref/style-reference-03.png" alt="Ref 3" style="min-width: 200px; border-radius: 8px;" />
</div>

Je prends des illustrations de Yu-Gi-Oh en exemple, je les donne à GPT 6.1 Sol qui va se charger d'appeler son tool de
création d'image pour faire les 7 character sheet des persos (le personnage du joueur + les boss), pas très fan de tout les
résultats, mais je me dis que ça va mieux rendre en jeu.

<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/reincarnate_media/characters/mimi.png" alt="Mimi" style="min-width: 200px; border-radius: 8px;" />
  <img src="/reincarnate_media/characters/amarena.png" alt="Amarena" style="min-width: 200px; border-radius: 8px;" />
</div>

> Le personnage principal, serait donc la petite fée verte, un "mimi"

On peut noté que l'inspiration n'est pas non plus extremement évidente, je suis à la fois content et déçu de ce coté là.
Bref maintenant, le truc le plus important, c'est peut être d'essayer de faire une animation, par exemple tout simple,
notre personnage en train de marcher, donc je me lance :

```
Juste pour le personnage de mimi, tu penses pouvoir générer dans character/mimi/... un sprite sheet de mimi qui marche ? montré dans un .gif ?
```

> Je demande à ce qu'il le montre dans un .gif, car je souhaite avoir un résultat lisible facilement par l'humain, plutot que d'interpreter 1 grande image avec 4 sprites ou devoir les remonter à la mano dans aseprite.


<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/reincarnate_media/characters/mimi/mimi-walk-v1.gif" alt="Mimi" style="min-width: 100px; border-radius: 8px;" />
</div>

Bon on a un résultat, pas non plus très convaincant. je pense je vais pas m'embeter, je vais lui dire qu'il vole, et le faire dans 4 directions, en haut à droite, en haut à gauche, en bas à droite, en bas à gauche. A la manière isometrique.

Donc on reformule un prompt, dont je ne suis pas peu fier, un prompt + que flou même :

```
Je veux que ce soit dans le dossiers specs/character/mimi, 
et je veux maintenant plutot que tu fasses en mode vue isometrique, 
avec le personnage qui va vers en bas à droite, vers en bas à gauche, vers en haut à droite, 
vers en haut à gauche, dans l'idée, je veux avoir un gif qui regroupent toutes les animations, 
je veux quue le personnage se déplace en volant.
```

<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/reincarnate_media/characters/mimi/mimi-flight-all-directions.gif" alt="Mimi" style="min-width: 100px; border-radius: 8px;" />
</div>

On un résultat bien mieux, pour un hack n slash, ça peut etre vraiment pas mauvais, je trouve ça même plutot correct et cool ! Je pense que ça peut bien fonctionner dans notre univers. Maintenant, je demande de faire une animation idle, et je demande de générer ça pour... TOUT LES PERSONNAGES.


<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/reincarnate_media/characters/gif/all-characters-flight.gif" alt="Flight" style="min-width: 100px; border-radius: 8px;" />
  <img src="/reincarnate_media/characters/gif/all-characters-idle.gif" alt="Idle" style="min-width: 100px; border-radius: 8px;" />
</div>


### Cartes et terrains

La carte et les différents terrains dans lesquels on va pouvoir progresser dans le jeu est un élément quand même essentiel du jeu, il faut une certaine logique mais aussi avoir un sentiment de progression.

Je n'ai cependant pas envie de faire un jeu linéaire, c'est à dire, un jeu qui force à faire zone par zone avant d'atteindre le boss final. Je veux qu'il soit possible de directemment courir tuer le boss final, mais pas pour autant d'avoir le niveau pour le tuer.

Là est le dilemme, un peu à la Elden Ring, avoir des endroits cachés pour récupérer des objets et des petits tricks.

Donc pour l'instant j'ai une liste de zone avec des terrains en fonction des différents boss. Rien de concret, simplement, "Framboise" a une zone rouge avec des fruits, des framboises, voilà...

### UI et tests

J'ai aussi essayé de demandé à obtenir une application d'une interface mélangant "world of warcraft", "path of exile" et "league of legends" en gardant le style actuel pour me donner une ordre d'idée

<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/reincarnate_media/mimi_visualize.png" alt="Mimi" style="min-width: 100px; border-radius: 8px;" />
</div>

Et donc ça, c'est un des premiers concept arts, fais en 1 minute rapidos, qui nous permet de nous projeter legerement, donc on un clique gauche pour attaquer une cible, des sorts A Z E R qui font : j'en ai AUCUNE IDEE. va falloir définir ça demain, mais je sais que je veux que ça s'articule comme ça.

### Conclusion

Ok c'est finit ! Il est 00:00 donc pour cette journée on est bon, demain je vais essayer de générer les permieres maps, et de me fixer plus précisemment sur le gameplay. Aussi pourquoi pas les premiers mobs.


## 21/10/2026 - Maps, mobs, combat, et dev...

### Maps

### Mobs

Pour les mobs, je vais pas m'embeter, pour l'instant, ce sera simplement les mobs de bases, du genre des versions plus petites des boss, avec un peu plus de variété. Mais pour l'instant, je vais me focus sur 3 mobs.

<div style="display: flex; flex-direction: row; gap: 20px; align-items: center; margin-top: 40px;">
  <img src="/reincarnate_media/gif/all-mobs-idle.gif" alt="Mimi" style="min-width: 100px; border-radius: 8px;" />
</div>

### Combat // Dev

J'ai écris une TONNE de fichiers de spécifications. Vraiment beaucoup.

## 22/10/2026 - On va executer tout ça.

Maintenant l'idée, c'est de tout faire, on va tester donc le plugin Unity, on va tout faire à coup de GPT 6.1 Sol et voir ce que le plugin Unity propose en le poussant au max de la paresse. Donc là je vais générer avec GPT 6.1 Sol et GPT Image (en gros 6.1 Sol me servira d'interface pour utiliser GPT Image)

### Premier resultat, mitigé.