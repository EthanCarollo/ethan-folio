---
title: VirusMania
date: 01-12-2025
image: /virusmania_media/virusmania_banner.png
role: Lead Developer
category: VideoGame
slug: virusmania
tags: ["Unity"]
---

# Introduction

Le but de ce projet, au départ, l'idée était de faire suite
à un jeu que l'on avait fait avec un ami (hello Théo si tu 
passes par là), nous avons donc rejoint une GameJam sur
itch.io sur le sujet de la transformation, un peu naivement,
(c'est seulement à la fin de la Jam que nous avons compris
exactement le sous texte de la GameJam). Nous étions donc lancé
et c'est ainsi que nous avons eu l'idée un
peu bizarre d'un jeu dans le style cartoon
où le personnage principal, est un 
scientifique enfermé par l'état pour créer des Virus afin
de controler la population, le jeu s'inspire grandement
des noms comme [PlateUp!](https://store.steampowered.com/app/1599600/PlateUp/?l=french)
ou même [OverCooked](https://store.steampowered.com/app/448510/Overcooked/).
Pour la répartition des rôles, Théo a décidé qu'il voulait
faire beaucoup + de modelisation 3D, et de mon côté, je
suis sur la partie technique comme à mon habitude.


# Les débuts

Pour commencer, on est parti sur Unity car, bien que nous avions
1 mois pour faire ce projet, le rythme scolaire et professionnel
que nous avions ne nous permettait pas de prendre le temps de
découvrir une technologie si nous souhaitions faire quelque chose
de clean, et étant donné que nous avions déja travaillé ensemble
auparavant sur un jeu Unity, nous avons pu rapidement prendre nos
aises. Après avoir défini le gameplay, nous avons fait un prototype
le plus rapidement possible, Théo s'est occupé de faire le personnage,
pendant que je faisais le reste de la logique.

<TerminalVideoPlayer
src="/virusmania_media/les_debuts.mp4"
title="virusmania-prototype.mp4">
</TerminalVideoPlayer>

A partir de ce premier prototype, une chose était déja un peu sûr,
on est parti un peu trop loin au niveau de nos ambitions, on a donc décidé
d'aggrandir un peu nos rangs et de travailler avec de nouvelles personnes.

# L'équipe s'aggrandit

C'est donc ainsi que Mederic et Danielle ont rejoint l'aventure
pour réaliser l'idée un peu bête de 2 développeurs qui s'ennuyaient
un jeudi matin. Et c'est ainsi que le rythme de production global du
jeu a commencé à s'accélerer

<TerminalVideoPlayer
src="/virusmania_media/animation_movement.mov"
title="animation-movement.mp4">
</TerminalVideoPlayer>

# Début des problèmes 1 - Les metaball

Pour faire des Virus qui se mélange correctement, on a réfléchi. Pas
suffisamment longtemps. Et on a décidé de partir sur un systeme de metaball
ou chaque Virus se mélange convenablement.
Mais les metaball c'est quoi ? Pour faire simple, voici un gif qui va 
parfaitement l'illustrer :

<div class="w-full flex justify-center">
<img src="/virusmania_media/gifmetaball.gif" />
</div>

> Efficace non ? Et bah ça c'était tellement galère à faire, qu'on a
> décidé de mettre ça de coté pour la première version.



> Un de nos rares essais qui mangeaient beaucoup trop de performances

# Début des problèmes 2 - Le style cartoon

C'est mignon le style cartoon, mais en vrai c'est comment
qu'on fait un style cartoon à peu près potable ?

Prenons l'exemple d'un jeu à peine connu, Fortnite.

Et on voit qu'il y a 2 choses, un contour (outline) et
pour l'ombrage, on est sur quelque chose par étapes (foncé,
 moins foncé, pas foncé,...). En gros, c'est pas si compliqué
à faire, mais c'est compliqué à **bien faire**.

Donc en route pour regarder si il y a des shaders qui sont pas mal
pour faire ça !

## Le ToonShading

pour le ToonShading (l'effet
d'ombrage par étape dont on parlait + haut), il y en a, mais aucun
n'est suffisamment bien pour nous, et c'est ainsi que nous sommes
en route pour créer notre propre ToonShader sur Unity !

> Disclaimer, je ne connaissais pas du tout le langage de programmation
> de shader utilisé par Unity et toute les subtilités qui venaient avec,
> et j'étais encore moins à l'aise à l'idée de faire un .shadergraph

Donc pour ce shader, la consigne était simple, avoir un rendu step
par step de la lumière sur un objet. Donc c'est assez simple.

<TerminalVideoPlayer
src="/virusmania_media/toon_on_metaball.mov"
title="toon1.mov">
</TerminalVideoPlayer>

<TerminalVideoPlayer
src="/virusmania_media/toon_on_guy.mov"
title="toon2.mov">
</TerminalVideoPlayer>

> Et hop on avait notre shader de Toon ! Avec certes quelques defauts
> (actuellement il ne prend pas en compte l'ombre si un objet est
> devant) mais c'est parfait et on avait pas besoin de mieux !


```js
// On prend la direction de la lumière light
var mainLightDirection = GetMainLight().direction;
// Et ici on obtient de "combien la surface regarde vers la lumière"
var lookAtLight = saturate(dot(N, -mainDir));
// On découpe pour avoir un dégradé avec des steps plutot que lisse
var render = floor(lookAtLight * steps) / (steps - 1.0);
```
> Une version extremement simplifié ecrite en pseudo code JS. 
> L'idée c'est de regarder si la texture fait face à la lumière, 
> et au lieu du dégradé habituel, on va arrondir la valeur
> avec notre système. Ainsi on a que des zones de couleurs plates

## L'outline 

Pour l'outline, 
[QuickOutline](github.com/chrisnolet/quickoutline) existe 

