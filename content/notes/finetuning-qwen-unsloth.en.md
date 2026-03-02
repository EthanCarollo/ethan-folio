---
title: "Finetuning Qwen3-4B with Unsloth"
date: "2026-03-02"
slug: "finetuning-qwen-unsloth"
description: "Adapting a model for a specific use case."
tags: ["lab", "ml"]
---

# Introduction

Digging around out of curiosity, I stumbled upon [Unsloth](https://unsloth.ai/) during my watch about 6 months ago. But at the time, I didn't have the hardware necessary to really run it locally and I'm not a huge fan of [Google Colab](https://colab.research.google.com/) (even though Google Colab can be super interesting if we don't have a TPU/GPU on hand).

# Well, let's make a little notebook

This way, it's quick, easy, modular, and we can tinker easily.

> Extremely important: I'm setting up my favorite pastel theme in the whole world. ([Catppuccin](https://github.com/catppuccin/jupyterlab))

# Testing the model first

Okay, first we're going to run Qwen3-4B with Unsloth and see what the model has to say and what it knows. My goal right now is to see if it has any knowledge about [Gleam](https://gleam.run/). So we'll take a look at the [docs](https://unsloth.ai/docs/models/qwen3-how-to-run-and-fine-tune).

```python
from unsloth import FastLanguageModel
import torch
import os
from transformers import TextStreamer

MODEL_PATH = "unsloth/Qwen3-4B" 
MAX_SEQ_LENGTH = 1024

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = MODEL_PATH,
    max_seq_length = MAX_SEQ_LENGTH,
    load_in_4bit = True,
    fast_inference = False,
)
FastLanguageModel.for_inference(model)
```

> So here, we're simply loading the model into RAM so we can chat with it chill.

```python
def chat():
    history = []
    print("Type 'exit' to stop.")
    while True:
        user_input = input("\n[You] > ")
        if user_input.lower() in ["exit", "quit", "q"]:
            break

        history.append(
            {"role": "user", "content": user_input}
        )
        
        tokenized_data = tokenizer.apply_chat_template(
            history,
            tokenize = True,
            add_generation_prompt = True,
            return_tensors = "pt",
        ).to("cuda")

        text_streamer = TextStreamer(tokenizer, skip_prompt = True)
        
        print("\n[Assistant] > ", end="", flush=True)
        outputs = model.generate(
            input_ids = tokenized_data,
            streamer = text_streamer,
            max_new_tokens = 512,
            use_cache = True,
            temperature = 0.7,
            do_sample = True,
            pad_token_id = tokenizer.pad_token_id,
        )
        
        response = tokenizer.decode(outputs[0][len(tokenized_data[0]):], skip_special_tokens=True)
        history.append({"role": "assistant", "content": response})

chat()
```

> And I'm reusing this little piece of code I made a while ago for llama-cpp, but adapting it a bit for Unsloth.

![talk-to-qwen](/finetuning-qwen-unsloth_media/talk-to-qwen.png)

> Well, okay, already we notice the `<think>` and `</think>` tags in the response. It's not bad, it's a model that "thinks" before answering, but still, it's not quite there.

So, let's talk to it a bit about Gleam and ask it to generate some code :p with a simple prompt: `"Give an example of code in Gleam to make a 'hello world'"`.

And we immediately notice that it doesn't think too badly, actually quite okay!

```
Okay, the user is asking for an example of code in Gleam to print "hello world". 
Let me recall how Gleam works. Gleam is a functional programming language that's similar to Elixir, but with a focus on performance. 
It uses a compile-to-WebAssembly approach, so the code would be written in a way that's compatible with that.
```

> It's still pretty okay, similar to Elixir, it knows it's a functional language...

But damn, when it comes to the outputted code, it shits its pants really hard.

---
Qwen3-4B's response
```gleam
module HelloWorld

@main
fn main() {
  IO.println("hello world")
}
```

- Explanation:
- `module HelloWorld`: Defines the module name.
- `@main`: Marks the function as the entry point of the program.
- `fn main() { ... }`: Defines the main function.
- `IO.println("hello world")`: Prints "hello world" to the console.
---

So there, we clearly see that it doesn't know what it's saying or what it's doing. For it to know more, we have two choices: inject data about Gleam into the prompt, but that would potentially consume more tokens and take a bit longer, or specialize the model for Gleam by making a LoRA with Unsloth ([Low Rank Adapter](https://www.cloudflare.com/learning/ai/what-is-lora/)).

In my case, I want to do LoRA, but I don't have the hardware so it'll be QLoRA, 4-bit LoRA.

# The real goal

To make the model really performant for modifying and creating code in Gleam.

Why? It might seem like a silly use case, but being a "nascent" language, Gleam doesn't have a lot of information available online, so small models often have very little knowledge. We'll be able to see the before/after very clearly in Gleam.

# Making a dataset

As we saw previously, the model thinks, so we'll need to take that into account when generating the dataset.

I'm going to favor XML for generating my dataset because I find it more readable than JSON and we can easily add line breaks. Nah, I just really love XML.

And so if I really want to specialize the model, I'm going to impose a clear structure:

```xml
<entry>
  <user></user>
  <think></think>
  <code></code>
  <explanation></explanation>
</entry>
```

![data-sample](/finetuning-qwen-unsloth_media/data-sample.png)

# On train

> For what follows, I'll largely base it on this article: https://medium.com/@matteo28/qlora-fine-tuning-with-unsloth-a-complete-guide-8652c9c7edb3

Okay, so we're going to configure a LoRA adapter on our completely frozen model! (Basically, finetuning with QLoRA means we add weights on top of our model, and we only train those weights, which means we consume much less VRAM and incidentally keep the base power of the model).

```python
LORA_R = 16  # Rank of LoRA matrices
LORA_ALPHA = 16  # Scaling factor
TARGET_MODULES = [
    "q_proj", "k_proj", "v_proj", "o_proj",  # Attention
    "gate_proj", "up_proj", "down_proj",      # MLP
]

model = FastLanguageModel.get_peft_model(
    model,
    r=LORA_R,
    target_modules=TARGET_MODULES,
    lora_alpha=LORA_ALPHA,
    lora_dropout=0,  # 0 is optimized for speed
    bias="none",
    use_gradient_checkpointing="unsloth",  # 30% less VRAM
    random_state=3407,
)
```

And in our case, we can train `Trainable: 33,030,144 (1.2996%)`.

```python
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
all_params = sum(p.numel() for p in model.parameters())
print(f"Trainable: {trainable_params:,} ({100 * trainable_params / all_params:.4f}%)")
```

And so I'm going to load the dataset using the folder from earlier.

```python
return {
    "user": example["user"],
    "response": f"<think>\n{example['think']}\n</think>\n\n{example['code']}\n\n<explanation>\n{example['explanation']}\n</explanation>"
}
# The goal here is to format the dataset response efficiently
```

Okay, and so we have a bunch of data generated with Gemini Flash (I have Google AI Pro with my student status, so I'm maxed out).

# Launching the training

Now that we have everything, we configure the `SFTTrainer` which will handle coordinating the training.

```python
trainer = SFTTrainer(
    model = model,
    tokenizer = tokenizer,
    train_dataset = gleam_ds,  # Using the raw dataset
    formatting_func = formatting_prompts_func,
    max_seq_length = 1024,
    dataset_num_proc = 2,
    packing = False,
    args = TrainingArguments(
        per_device_train_batch_size = 1,
        gradient_accumulation_steps = 8,
        gradient_checkpointing = True,
        warmup_steps = 5,
        max_steps = 60,
        learning_rate = 2e-4,
        fp16 = not is_bfloat16_supported(),
        bf16 = is_bfloat16_supported(),
        logging_steps = 1,
        optim = "paged_adamw_8bit",
        weight_decay = 0.01,
        lr_scheduler_type = "linear",
        seed = 3407,
        output_dir = "outputs",
    ),
)
```

Basically, the `SFTTrainer` acts as a bridge between the model, the tokenizer, and our formatted data. The `TrainingArguments` let us define how the model learns (speed, memory, number of iterations). Here, we're fully optimizing it so it runs even on a modest (slightly crappy) setup thanks to QLoRA and checkpointing.

# It's trained, let's test :3

Okay, now the hardest part is over, let's test! By default, I'd say we should prepare a real benchmark for this specific use case and compare it with other models to get an idea of our performance, but that'll probably do for another article!

So we are going to test this little model with a simple question about Gleam: "Give an example of code in Gleam to make a 'hello world'"

![test-qwen-on-google-collab](/finetuning-qwen-unsloth_media/test-qwen-on-google-collab.png)

And the code works!!!!! WE HAVE CODE THAT WORKS!!!!!!!! I am very very happy. I love this. What a joy.

(I just added a log to see if the code worked and presto)

![test-gleam](/finetuning-qwen-unsloth_media/test-gleam.png)

> Notes: It's 14:12, I just saw that Qwen released Qwen3.5 in 4B (basically they released the 3.5 in a small version). Well, I'm a bit salty, I should have fine-tuned that one, but whatever, I think I'll use it for something else.

# Conclusion

I did a test, it worked, I'm happy, but to be sure we should test in practice and with a benchmark. But that'll be for another note :)
