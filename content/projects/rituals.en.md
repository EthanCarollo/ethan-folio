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

It all started with a simple desire: to participate in a Game Jam with Théo ([Nak0x](https://github.com/nak0x)). We chose the [Cosmic Horrors Jam 4](https://itch.io/jam/cosmichorrorsjam4), whose theme was centered around cosmic horror.

> It's a theme that we liked quite well because we had always been interested in H. P. Lovecraft's stories without ever really having set foot in this type of universe.

This type of theme can quickly bring to mind existing games, such as `Call of Cthulhu` (a tabletop RPG that caught my eye) or `Worshippers of Cthulhu` (which is surprisingly a management game), but we didn't want to directly reuse well-known entities like `Cthulhu`, but rather draw inspiration from them to create our own.

From the start, the idea emerged to create **an escape room-style video game**. The player must progress through an oppressive environment while discovering ancient secrets. To advance, they must summon spirits by tracing mystical rituals, a mechanic that allowed us to put into practice the training of a CNN (Convolutional Neural Network) with PyTorch.

# The concept

**Rituals** is an atmospheric puzzle game. Progression relies on your ability to discover and reproduce ancient symbols. 
The core of the gameplay rests on this unique mechanic: discovering hidden drawings that, once traced correctly, allow for the summoning of entities via mystical rituals to unlock the rest of the adventure.

# The entities

## The ideation phase

For our entity ideation phase, we agreed on what we wanted for our story primarily: entities that tell things and are linked to each other.

For that, a notebook, paper, and we wrote and documented everything down to the first sketch.

## The production phase

Entities are a central point of the gameplay, and there are two of us, and we don't have much time.
Equipped with a specialization in plastic arts during my final year of high school (yes!), I pulled out the graphic tablet and started scribbling entities in a chaotic way, as that's the feeling we want to have when seeing them. The idea isn't to make perfect entities, but that these entities are so far above us humans that we can barely distinguish them.

So we used Krita and scribbled the entities.

| Mutus                                  | Regium                                  | Murmur                                  |
|----------------------------------------|-----------------------------------------|-----------------------------------------|
| <img src="/rituals_media/mutus.png" /> | <img src="/rituals_media/regium.png" /> | <img src="/rituals_media/murmur.png" /> |


> The result remains somewhat unrefined in its execution—it's not my job—but for our video game, we didn't have the pretension of making the most beautiful game in the world; we needed a game with puzzles and a story.

# The technique behind the magic

## Artificial Intelligence Recognition

For this project, a **CNN (Convolutional Neural Network)** was specifically designed to recognize the different rituals traced by the player. 
This neural network allows for fluid and organic interaction, transforming simple drawings into complex game commands.

- **Training** : The model was trained using PyTorch. 
You can check out the [training notebook (ipynb)](https://github.com/methil-mods/rituals/blob/main/ritualcnn/ritualcnn.ipynb) to see the details of the architecture and the dataset.
- **Data** : The dataset is composed of about twenty hand-drawn ritual examples per category, 
like this [raw data example](https://github.com/methil-mods/rituals/blob/main/ritualcnn/data/flosculus/flosculus-ritual11.png).

Once the model was ready, we needed to be able to use it in Unity, and for that, we used [Unity Barracuda](https://docs.unity3d.com/Packages/com.unity.barracuda@1.0/manual/index.html), which is an inference library.

> The biggest issue we had was that initially, we had trained the model with TensorFlow, but following export issues to .onnx (for compatibility reasons with Barracuda), we migrated to PyTorch.

And that's how, in the end, we implemented the drawing experience to summon entities in our game.

# Links

Find the full source code on the [official GitHub repository](https://github.com/methil-mods/rituals).
