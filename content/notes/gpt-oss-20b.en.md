---
title: "LlamaCPP Python & GPT-OSS-20B"
date: "2025-02-24"
slug: "gpt-oss-20b"
description: "Trying to run an open-source model locally (GPT-OSS-20B) and seeing how it goes."
tags: ["lab", "ml"]
---

# Introduction

Basically, it's February 24th, I didn't manage to run Qwen 3.5 33B (A3B) on my PC, I'm a bit salty, so I want to do some experimentation with **GPT-OSS-20B** locally (careful, I'm an *aixpair*), a model I haven't used at all since its release except briefly for some translation work.

# First, let's consider

With my hardware, it was certain that it wouldn't run well, and that was kind of the point: trying to bypass my hardware's limits to get at least 25 Tokens/second. That would have been nice.

Oh, and here's my hardware:

- Intel(R) Core(TM) i7-14650HX (24) @ 5.20 GHz
- 32GB RAM
- RTX 5060 8GB (laptop, careful, it's scary)

A mini config, for a mini **AI aixpair**

> Knowing that my graphical interface (the little [GNOME](https://www.gnome.org/fr/)) runs on my RTX, I've already almost run out of VRAM just by launching Pycharm, so this is going to be fun.

# Let's run the beast with something that already works.

Well, since I'm a newbie, I'll use LM Studio, pick the GPT-OSS-20B model, and launch it.

![lmstudtest](/gpt-oss-20b_media/lmstudtest.png)

> Always test if a model knows [Gleam](https://gleam.run/), extremely important.

In my case, 17 tokens/second, that's already something!
But it's not enough for me. I've seen guys doing crazy optimizations with their hardware. I only have a laptop with an RTX 5060, 32GB of RAM, and an Intel(R) Core(TM) i7-14650HX (24 cores, watch out), so well, I need to optimize.

> And if I stopped there, I wouldn't really understand everything. I need to at least be able to understand how it works behind the scenes. With a beautiful interface, it's too easy :(

# Let's go, let's test other things.

## Testing with Python and transformers

So well, I'll first try to run this in Python with transformers, as it's written on the model's page (https://huggingface.co/openai/gpt-oss-20b).

> So I do my thing, conda environment, installation, etc.

And I start from this code:

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

> Exactly the same as on HuggingFace, 0 changes because I'm a developer who doesn't know how to think. (I just changed the prompt so it would talk to me about [Gleam](https://gleam.run/)).

And barely have I had time to install the model when:

```
MXFP4 quantization requires Triton and kernels installed: CUDA requires Triton >= 3.4.0, XPU requires Triton >= 3.5.0, we will default to dequantizing the model to bf16
```

> Well, okay, I'll install Triton. But wait, what is this thing?

Okay, so I stumbled upon this site: https://openai.com/index/triton/ and basically, Triton is a programming language for writing CUDA code without knowing CUDA. It looks like a CUDA abstraction, but in Python. Cool, I'll install this thing.

So I do:

```bash
pip install triton kernels
```

AND EXPLOSION `CUDA out of memory`. Normal, I have 8GB of VRAM, so I shouldn't try to load part of the model into my CPU at the same time.

Well, we'll skip Python and transformers, and I'll try directly with llama-cpp-python.

> Failure

## Testing with llama-cpp-python

Well, I'll try with llama-cpp-python, because it runs well, and I already have the model downloaded in GGUF.

Here we go:

```bash
pip install llama-cpp-python
```

And I start with this code:

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

To get this:

```
{'id': 'chatcmpl-94f78fa7-1e15-4b99-9219-94a34023924d', 'object': 'chat.completion', 'created': 1771974911, 'model': '/home/eth/.lmstudio/models/lmstudio-community/gpt-oss-20b-GGUF/gpt-oss-20b-MXFP4.gguf', 'choices': [{'index': 0, 'message': {'role': 'assistant', 'content': '<|channel|>analysis<|message|>We need to respond with basic code in Gleam. The user says "Give me basic code in gleam". Likely they want a simple example. Provide a small Gleam program, maybe a "Hello, world!" or a simple function. Also explanation. Provide code snippet. Possibly mention Gleam is a functional language for the BEAM VM. Provide a minimal main function. Provide comments. The user didn\'t specify context. So give a simple example. Also mention how to compile/run.\n\nWe should respond as helpful. Provide code and explanation.<|end|><|start|>assistant<|channel|>final<|message|>Below is a **minimal “Hello, world!” program** written in **Gleam**.  \nIt shows the core structure you’ll need: a module, an exported function, and a simple `main/0` that prints to the console.\n\n```gleam\n// hello.gleam\n//\n// A tiny Gleam program that prints “Hello, world!”\n//\n\nimport gleam/io\n\n// A simple function that returns a string\npub fn greet() -> String {\n  "Hello, world!"\n}\n\n// The entry‑point for the program.\n// `main/0` is automatically executed when the binary runs.\npub fn main() -> Result(() , io.Error) {\n  // Call `greet/0` and print the result\n  let message = greet()\n  // `println/1` returns `Result(() , io.Error)` so we propagate it\n  io.println(message)\n}\n```\n\n---\n\n### How to build & run\n\n1. **Install Gleam** (if you haven’t already):\n\n   ```bash\n   curl -sL https://gl.joeware.org/install | bash\n   ```\n\n   (On Windows you can use the Windows installer from the Gleam website.)\n\n2. **Create a new project** (optional, but convenient):\n\n   ```bash\n   gleam new hello\n   cd hello\n   ```\n\n   Replace the contents of `src/main.gleam` with the code above, or simply create a file called `hello.gle'}, 'logprobs': None, 'finish_reason': 'length'}], 'usage': {'prompt_tokens': 87, 'completion_tokens': 425, 'total_tokens': 512}}
```

And it actually works quite well!

> We should note, however, that the model gives us a broken Gleam installation link and a strange file extension **.gle** (I had never heard of it and I don't think it works), it might be useful for later.

```
llama_perf_context_print:        load time =    2296.82 ms
llama_perf_context_print: prompt eval time =    2296.61 ms /    87 tokens (   26.40 ms per token,    37.88 tokens per second)
llama_perf_context_print:        eval time =   43100.74 ms /   424 runs   (  101.65 ms per token,     9.84 tokens per second)
llama_perf_context_print:       total time =   46550.07 ms /   511 tokens
```

Well, the performance isn't great, but it's something. There's probably a way to optimize this.

And the answer might be found here:

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

> It's clearly visible that the model is loaded on the CPU, which explains the crappy performance. But I know I could never put everything on the GPU, though I might be able to put part of it on the GPU and the rest on the CPU to optimize performance.

So, after 2 seconds of research, I see that I need to reinstall llama-cpp-python with the appropriate compilation options.

```bash
CMAKE_ARGS="-DLLAMA_CUBLAS=on" pip install llama-cpp-python
```

> It was right there in the llama-cpp-python readme.

And now I can (partially) use my GPU.

Thanks to this: https://llama-cpp-python.readthedocs.io/en/latest/api-reference/

But as I thought, life would have been too beautiful; you can't select exactly which layer goes to the GPU and which goes to the CPU. You can only choose X consecutive layers to go on the GPU, and the rest on the CPU. (This is mainly because the layers are nested with each other, so you can't really separate them without breaking the model.)

So let's first try with **n_gpu_layers** set to 8.

And it works (and it only takes up an extra 4GB of VRAM).

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

> And we're up to 12 T/s, so let's increase the dose with 12 n_gpu_layers, which brings us up to 14 T/s (**14.57 tokens per second** to be exact).

Except I still have one card up my sleeve: flash attn might be able to speed all this up.

But to go further, I need a brand new version of pytorch that coincides with Cuda 13.1, which is a new version of Cuda and would run much better too.

```bash
pip3 install --pre torch torchvision --index-url https://download.pytorch.org/whl/nightly/cu131
```

> https://discuss.pytorch.org/t/nvidia-rtx-5070-with-cuda-13/223638/2 as this discussion testifies, people don't all agree, but well, you have to test to know. nightly build = danger.

Well, already there, by pushing num_gpu_layers to 14 and enabling flash_attn, I get between 18 and 20 T/s, which remains quite stable and correct. (It's already better than the result obtained with LM Studio).

# Conclusion

I would have probably arrived at a better result if I had done everything through the LM Studio graphical interface, but I probably wouldn't have done all the necessary research that allowed me to better understand how to run a model and what it implied. I finally didn't do much, but it was enough for this time.

It's a necessary step for my learning, I think—well, anyway, it's too late, I did it.

> I also take into account that the model struggles with Gleam :) (that will probably be the subject of a future experiment).

# Notes

![cpufeu](/gpt-oss-20b_media/cpufeu.png)

> CPU on fire because I'm compiling llama-cpp-python with the right compilation options. (It took 30 minutes, I'm not kidding), I should have used a pre-compiled version. (It would've been faster) (Simpler too).
