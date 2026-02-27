---
title: "LlamaCPP Python & GPT-OSS-20B"
date: "2026-02-24"
slug: "gpt-oss-20b"
description: "Essayon de faire tourner un modèle open source en local (GPT-OSS-20B) avec LlamaCPP Python et voyons ce que ça donne."
tags: ["lab", "ml"]
---

# Introduction

En gros, on est le 24 février, j'ai pas réussi à faire tourner Qwen 3.5 33B (A3B) sur mon pc, j'ai un peu le seum donc, j'ai envie de me tapper un peu d'experimentation avec **GPT-OSS-20B** en local (attention je suis un *aixpair*), un modèle que j'ai pas du tout utilisé depuis sa sortie si ce n'est vite fait pour de la traduction. 

# Prenons d'abord en considération

Avec mon hardware, c'était sûr que ça allait pas bien tourner et c'était un peu le but, essayer de contourner les limites de mon hardware pour avoir, au moins, 25 Tokens/secondes. Ca aurait été bien.

Ah et donc, mon hardware :

- Intel(R) Core(TM) i7-14650HX (24) @ 5.20 GHz
- 32Go de RAM
- RTX 5060 8GB (laptop, attention ça fait peur)

Une mini config, pour un mini **aixpair IA**

> En sachant que mon interface graphique (petit [GNOME](https://www.gnome.org/fr/)) tourne sur ma RTX, j'ai déja presque plus de VRAM rien qu'en lancant Pycharm du coup, ça va etre fun.

# Faisons tourner la bête avec un truc qui marche déja.

Bon, étant donné que je suis un newbie, je prends LM Studio, je prends le modèle GPT-OSS-20B et je lance.

![lmstudtest](/gpt-oss-20b_media/lmstudtest.png)

> Toujours tester si un modèle connait [Gleam](https://gleam.run/), extremement important.

Dans mon cas, 17 tokens/secondes, c'est déja ça !
Mais, ça me suffit pas, j'ai vu des mecs qui faisaient des optis de fous avec leur hardware, moi j'ai qu'un pc portable avec une RTX 5060, 32Go de RAM et un Intel(R) Core(TM) i7-14650HX (24 cores, attention), donc bon, faut optimiser. 

> Et si je m'arretais à là, je n'arriverais pas vraiment à comprendre tout, il faut que je puisse à minima comprendre comment ça marche derrière, avec une interface toute belle, c'est trop simple :(

# Allons-y, testons d'autres choses.

## Testons en python avec transformers

Donc bon, je vais d'abord tester de run ça en python avec transformers, comme c'est écrit sur la page du modèle (https://huggingface.co/openai/gpt-oss-20b).

> Donc je fais ma popote, environnement conda, installation,..

Et je pars donc de ce code : 

```python
from transformers import pipeline
import torch

model_id = "openai/gpt-oss-20b"

pipe = pipeline(
    "text-generation",
    model=model_id,
    torch_dtype="auto",
    device_map="auto",
)

messages = [
    {"role": "user", "content": "Tell me how can I code in Gleam efficiently."},
]

outputs = pipe(
    messages,
    max_new_tokens=256,
)
print(outputs[0]["generated_text"][-1])
```

> Exactement le même que sur HuggingFace, 0 changement car je suis un développeur qui ne sait pas réflechir. (J'ai juste changé le prompt pour qu'il me parle de [Gleam](https://gleam.run/)).

Et donc à peine j'ai le temps d'installer le modèle que : 

```
MXFP4 quantization requires Triton and kernels installed: CUDA requires Triton >= 3.4.0, XPU requires Triton >= 3.5.0, we will default to dequantizing the model to bf16
```

> Bon, ok, je vais installer triton. Mais attends c'est quoi ce truc

Ok donc je suis tombé sur ce site : https://openai.com/index/triton/ et en gros, Triton c'est un langage de programmation pour écrire du code CUDA sans connaitre le CUDA, on dirait un peu une abstraction du CUDA, mais en Python. Bon, sympa, je vais installer ce truc. 

Donc je

``̀
pip install triton kernels
```

ET EXPLOSION `CUDA out of memory`, normal j'ai 8GB de VRAM, donc bon, je vais pas essayer de loader le modele en partie sur mon CPU en même temps.

Bon, on va zapper avec python et transformers, et je vais tenter direct avec llama-cpp-python.

> Echec

## Testons avec llama-cpp-python

Bon, je vais tenter avec llama-cpp-python, parce que bon, ça tourne bien, et j'ai déja le model download en GGUF.

hopla :

``̀ bash
pip install llama-cpp-python
``` 

Et je pars avec ce code 

```python
from llama_cpp import Llama

llm = Llama(
      model_path="/home/eth/.lmstudio/models/lmstudio-community/gpt-oss-20b-GGUF/gpt-oss-20b-MXFP4.gguf",
)

output = llm.create_chat_completion(
    messages=[
        { "role": "system","content": "You are a helpful assistant." },
        { "role": "user", "content": "Give me basic code in gleam" },
    ],
    temperature=0.7)

print(output)
```

Pour obtenir ça :

``` 
{'id': 'chatcmpl-94f78fa7-1e15-4b99-9219-94a34023924d', 'object': 'chat.completion', 'created': 1771974911, 'model': '/home/eth/.lmstudio/models/lmstudio-community/gpt-oss-20b-GGUF/gpt-oss-20b-MXFP4.gguf', 'choices': [{'index': 0, 'message': {'role': 'assistant', 'content': '<|channel|>analysis<|message|>We need to respond with basic code in Gleam. The user says "Give me basic code in gleam". Likely they want a simple example. Provide a small Gleam program, maybe a "Hello, world!" or a simple function. Also explanation. Provide code snippet. Possibly mention Gleam is a functional language for the BEAM VM. Provide a minimal main function. Provide comments. The user didn\'t specify context. So give a simple example. Also mention how to compile/run.\n\nWe should respond as helpful. Provide code and explanation.<|end|><|start|>assistant<|channel|>final<|message|>Below is a **minimal “Hello, world!” program** written in **Gleam**.  \nIt shows the core structure you’ll need: a module, an exported function, and a simple `main/0` that prints to the console.\n\n```gleam\n// hello.gleam\n//\n// A tiny Gleam program that prints “Hello, world!”\n//\n\nimport gleam/io\n\n// A simple function that returns a string\npub fn greet() -> String {\n  "Hello, world!"\n}\n\n// The entry‑point for the program.\n// `main/0` is automatically executed when the binary runs.\npub fn main() -> Result(() , io.Error) {\n  // Call `greet/0` and print the result\n  let message = greet()\n  // `println/1` returns `Result(() , io.Error)` so we propagate it\n  io.println(message)\n}\n```\n\n---\n\n### How to build & run\n\n1. **Install Gleam** (if you haven’t already):\n\n   ```bash\n   curl -sL https://gl.joeware.org/install | bash\n   ```\n\n   (On Windows you can use the Windows installer from the Gleam website.)\n\n2. **Create a new project** (optional, but convenient):\n\n   ```bash\n   gleam new hello\n   cd hello\n   ```\n\n   Replace the contents of `src/main.gleam` with the code above, or simply create a file called `hello.gle'}, 'logprobs': None, 'finish_reason': 'length'}], 'usage': {'prompt_tokens': 87, 'completion_tokens': 425, 'total_tokens': 512}}
```

Et ça marche plutot bien finalement !

> On notera quand même que le modele nous file un lien peter d'installation de gleam et une extension de fichier étrange **.gle** (j'avais jamais entendu parler et je crois pas que ça marche ça), ça peut servir pour plus tard.

```
llama_perf_context_print:        load time =    2296.82 ms
llama_perf_context_print: prompt eval time =    2296.61 ms /    87 tokens (   26.40 ms per token,    37.88 tokens per second)
llama_perf_context_print:        eval time =   43100.74 ms /   424 runs   (  101.65 ms per token,     9.84 tokens per second)
llama_perf_context_print:       total time =   46550.07 ms /   511 tokens
```

Bon, c'est pas fou niveau perf, mais c'est déja ça, il y a surement un moyen d'optimiser ça. 

Et la réponse peut se trouver là :

``̀
load_tensors: layer   0 assigned to device CPU, is_swa = 1
load_tensors: layer   1 assigned to device CPU, is_swa = 0
load_tensors: layer   2 assigned to device CPU, is_swa = 1
load_tensors: layer   3 assigned to device CPU, is_swa = 0
load_tensors: layer   4 assigned to device CPU, is_swa = 1
load_tensors: layer   5 assigned to device CPU, is_swa = 0
load_tensors: layer   6 assigned to device CPU, is_swa = 1
load_tensors: layer   7 assigned to device CPU, is_swa = 0
load_tensors: layer   8 assigned to device CPU, is_swa = 1
load_tensors: layer   9 assigned to device CPU, is_swa = 0
load_tensors: layer  10 assigned to device CPU, is_swa = 1
load_tensors: layer  11 assigned to device CPU, is_swa = 0
load_tensors: layer  12 assigned to device CPU, is_swa = 1
load_tensors: layer  13 assigned to device CPU, is_swa = 0
load_tensors: layer  14 assigned to device CPU, is_swa = 1
load_tensors: layer  15 assigned to device CPU, is_swa = 0
load_tensors: layer  16 assigned to device CPU, is_swa = 1
load_tensors: layer  17 assigned to device CPU, is_swa = 0
load_tensors: layer  18 assigned to device CPU, is_swa = 1
load_tensors: layer  19 assigned to device CPU, is_swa = 0
load_tensors: layer  20 assigned to device CPU, is_swa = 1
load_tensors: layer  21 assigned to device CPU, is_swa = 0
load_tensors: layer  22 assigned to device CPU, is_swa = 1
load_tensors: layer  23 assigned to device CPU, is_swa = 0
load_tensors: layer  24 assigned to device CPU, is_swa = 0
```

> On voit bien que le modèle est chargé sur le CPU, ce qui explique les perfs de merde. Mais je sais que je pourrais jamais tout mettre sur le GPU, mais je peux peut être mettre une partie sur le GPU, et le reste sur le CPU, pour optimiser les perfs. 

Et donc après 2 secondes de recherches, je vois que je dois réinstaller llama-cpp-python avec les options de compilation qui vont bien. 

```bash
CMAKE_ARGS="-DLLAMA_CUBLAS=on" pip install llama-cpp-python
```

> C'était juste dans le readme de llama-cpp-python

Et là déja je peux utiliser (en partie) mon GPU.

Grace à ça : https://llama-cpp-python.readthedocs.io/en/latest/api-reference/

Mais comme je le pensais, la vie aurait été trop belle, on ne peut pas selectionner quelle couche va sur le GPU, et quelle couche va sur le CPU. Mais on peut choisir les X couches d'affilées qui vont sur le GPU, et le reste sur le CPU. (C'est principalement dû au fait que les couches sont imbriqués entre elle donc on ne peut pas vraiment les séparer sans casser le modèle)

Donc on va déja tenté avec un **n_gpu_layers** à 8.

Et ça marche (et ça me prend que 4g de VRAM en plus).

```
load_tensors: layer   0 assigned to device CPU, is_swa = 1
load_tensors: layer   1 assigned to device CPU, is_swa = 0
load_tensors: layer   2 assigned to device CPU, is_swa = 1
load_tensors: layer   3 assigned to device CPU, is_swa = 0
load_tensors: layer   4 assigned to device CPU, is_swa = 1
load_tensors: layer   5 assigned to device CPU, is_swa = 0
load_tensors: layer   6 assigned to device CPU, is_swa = 1
load_tensors: layer   7 assigned to device CPU, is_swa = 0
load_tensors: layer   8 assigned to device CPU, is_swa = 1
load_tensors: layer   9 assigned to device CPU, is_swa = 0
load_tensors: layer  10 assigned to device CPU, is_swa = 1
load_tensors: layer  11 assigned to device CPU, is_swa = 0
load_tensors: layer  12 assigned to device CPU, is_swa = 1
load_tensors: layer  13 assigned to device CPU, is_swa = 0
load_tensors: layer  14 assigned to device CPU, is_swa = 1
load_tensors: layer  15 assigned to device CPU, is_swa = 0
load_tensors: layer  16 assigned to device CUDA0, is_swa = 1
load_tensors: layer  17 assigned to device CUDA0, is_swa = 0
load_tensors: layer  18 assigned to device CUDA0, is_swa = 1
load_tensors: layer  19 assigned to device CUDA0, is_swa = 0
load_tensors: layer  20 assigned to device CUDA0, is_swa = 1
load_tensors: layer  21 assigned to device CUDA0, is_swa = 0
load_tensors: layer  22 assigned to device CUDA0, is_swa = 1
load_tensors: layer  23 assigned to device CUDA0, is_swa = 0
load_tensors: layer  24 assigned to device CPU, is_swa = 0
```

> Et on monte à 12 T/s, donc augmentons la dose avec 12 n_gpu_layers, ce qui nous fait monter à 14 T/s (**14.57 tokens per second** pour être exact)

Sauf que il reste encore une carte dans ma manche, flash attn pourrait peut être accélerer tout ça.

Mais pour aller plus loin il me faut une version toute neuve de pytorch qui coincide avec Cuda 13.1 qui est une nouvelle version de Cuda et qui tournerait vachement mieux aussi.

```
pip3 install --pre torch torchvision --index-url https://download.pytorch.org/whl/nightly/cu131
```

> https://discuss.pytorch.org/t/nvidia-rtx-5070-with-cuda-13/223638/2 comme peut en temoigner cette discussion, les gens sont pas tous d'accord mais bon, faut tester pour savoir. nightly build = danger.

Bon déja là, en poussant le num_gpu_layers à 14 et en activant flash_attn j'obtiens entre 18 et 20 T/s, ce qui reste encore assez stable et correct. (c'est déja mieux que le résultat obtenu avec LM Studio)

# Conclusion

Je serais arrivé à un résultat surement mieux si j'avais tout fait via l'interface graphique de LM Studio, mais j'aurais surement pas fait toutes les recherches nécessaires qui m'ont permis de comprendre mieux comment run un modèle et ce que ça impliquait. J'ai finalement pas fait grand chose mais c'était suffisant pour cette fois. 

C'est une étape nécessaire pour mon apprentissage je pense, enfin de toute façon c'est trop tard je l'ai fait.

> Je prends aussi en compte le fait que le modèle a du mal avec le gleam :) (ca fera surement l'objet d'une prochaine expérimentation)

# Notes

![cpufeu](/gpt-oss-20b_media/cpufeu.png)

> CPU feu parce que je compile llama-cpp-python avec les options de compilation qui vont bien. (ça a pris 30 minutes, je ne rigole pas), j'aurais du prendre une version pré-compilée. (ça aurait été plus rapide) (plus simple aussi)