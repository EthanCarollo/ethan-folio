---
title: "L'espace latent"
date: "2026-06-26"
slug: "espace-latent"
description: "Le concept le plus important en deep learning, expliqué simplement."
tags: ["lab", "ml"]
---

# C'est quoi ?

Un **espace latent**, c'est juste une représentation compressée et abstraite de tes données dans un espace avec beaucoup moins de dimensions.

Prenons une image 256×256 en RGB. Ça fait `256 × 256 × 3 = 196 608` nombres. Un bordel monstre. Mais l'information *utile* dans cette image (ce qu'elle représente vraiment : un chat, la couleur de ses yeux, la forme de ses oreilles) tient dans beaucoup, beaucoup moins de dimensions.

Un bon encodeur va prendre tes 196 608 nombres et les compresser en, allez, 128 nombres. Ces 128 nombres, c'est ton **vecteur latent**. Et l'espace dans lequel ils vivent, c'est l'**espace latent**.

```python
# En gros, un autoencoder ça fait ça :
image = torch.randn(1, 3, 256, 256)  # 196 608 valeurs

# Encodeur : écrase tout dans 128 dimensions
latent = encoder(image)  # torch.Size([1, 128])

# Décodeur : reconstruit l'image depuis ces 128 nombres
reconstructed = decoder(latent)  # torch.Size([1, 3, 256, 256])
```

> 196k nombres → 128 nombres → 196k nombres. Si la reconstruction est bonne, c'est que les 128 nombres capturent l'essentiel.

# Pourquoi c'est stylé

Une fois que t'as un espace latent bien foutu, tu peux faire des trucs de fou :

**Interpolation.** Tu prends le vecteur latent d'un chat et celui d'un chien, tu fais la moyenne, et boum, t'as une image qui ressemble à un mix des deux.

**Arithmétique.** `roi - homme + femme = reine`. Dans l'espace latent de Word2Vec, ce calcul vectoriel marche vraiment. Les directions dans l'espace encodent des concepts sémantiques.

**Génération.** Tu tires un point au pif dans l'espace latent, tu le passes dans un décodeur, et t'as une nouvelle image réaliste. C'est comme ça que marchent les VAE et les GANs.

::mermaid-diagram
---
code: |
  flowchart LR
      A["🖼️ Données brutes\n(haute dimension)"] -->|"Encodeur"| B["🧠 Vecteur latent\n(basse dimension)"]
      B -->|"Décodeur"| C["🖼️ Reconstruction\n(haute dimension)"]
      B -->|"Navigation"| D["✨ Interpolation\nArithmétique\nGénération"]
---
::

# Et les LLMs dans tout ça ?

Les embeddings des tokens dans un LLM, c'est un espace latent. Chaque token est représenté par un vecteur dans un espace où la proximité encode la similarité sémantique.

Le vecteur de "chat" est plus proche de "chien" que de "voiture". Et toutes les couches du transformer ne font que déplacer ces vecteurs dans cet espace pour les raffiner avec le contexte.

```python
# Avec sentence-transformers, tu peux le voir en vrai :
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

chat = model.encode("chat")
chien = model.encode("chien")
voiture = model.encode("voiture")

# Cosine similarity : chat vs chien > chat vs voiture
from sklearn.metrics.pairwise import cosine_similarity

print(f"chat / chien : {cosine_similarity([chat], [chien])[0][0]:.3f}")
print(f"chat / voiture : {cosine_similarity([chat], [voiture])[0][0]:.3f}")
# chat / chien : 0.72
# chat / voiture : 0.31
```

> Les mots proches sémantiquement sont proches dans l'espace. C'est tout le principe.

# Pour résumer

L'espace latent, c'est là où tes données vivent une fois débarrassées du bruit et de la redondance. C'est une carte compressée du réel où la distance a du sens. Et c'est probablement le concept le plus important à piger en deep learning.

> Si t'as compris ça, t'as compris la moitié du ML moderne.
