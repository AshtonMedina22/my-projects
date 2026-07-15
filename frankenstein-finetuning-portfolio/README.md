# Frankenstein Language Model Finetuning

This project finetunes a causal language model on text snippets from Mary Shelley's *Frankenstein* and evaluates whether the finetuned model better matches the source style than the base model.

The local, reproducible version uses **DistilGPT-2** because it can run on CPU/MPS hardware. The project also includes a GPU notebook showing the QLoRA path for **Mistral 7B** when a CUDA GPU or cloud notebook is available.

## Why This Project Matters

This is a compact end-to-end generative AI workflow:

- Explore and validate a literary text dataset.
- Convert pandas data into Hugging Face `Dataset` objects.
- Tokenize text for causal language modeling.
- Generate text before and after finetuning for qualitative comparison.
- Evaluate the model with perplexity.
- Train a language model with Hugging Face `Trainer`.
- Preserve both CPU-friendly full finetuning and GPU-focused QLoRA approaches.

## Project Structure

```text
frankenstein-finetuning-portfolio/
  data/
    frankenstein_chunks.csv
  notebooks/
    FrankensteinMPSCPU.ipynb
    FrankensteinGPU.ipynb
  src/
    train_distilgpt2.py
    generate.py
  requirements.txt
  README.md
```

## Main Approach

The main reproducible path is `src/train_distilgpt2.py`, which performs a small full finetune of DistilGPT-2.

The script:

1. Loads `data/frankenstein_chunks.csv`.
2. Prints basic EDA and missing value checks.
3. Splits the text into train/test sets.
4. Converts pandas DataFrames to Hugging Face Datasets.
5. Tokenizes the text with dynamic padding and truncation.
6. Generates a base-model sample.
7. Computes base-model perplexity.
8. Finetunes DistilGPT-2.
9. Generates a finetuned sample.
10. Computes finetuned perplexity.
11. Saves the model and tokenizer.

## Run Locally

Create a virtual environment, install dependencies, and run:

```bash
pip install -r requirements.txt
python src/train_distilgpt2.py
```

For a very quick smoke test:

```bash
python src/train_distilgpt2.py --max-rows 40 --epochs 1 --max-eval-rows 5
```

Generate with the saved model:

```bash
python src/generate.py --model-dir models/frankenstein-distilgpt2 --prompt "I beheld the creature"
```

See `RESULTS.md` for the local smoke-test run and sample generations.

## GPU / QLoRA Extension

The notebook `notebooks/FrankensteinGPU.ipynb` contains the GPU-focused QLoRA version:

- Mistral 7B base model
- 4-bit BitsAndBytes quantization
- LoRA adapters via PEFT
- Hugging Face `Trainer`
- Perplexity and informal generation comparison

This path requires a CUDA-capable GPU or a cloud notebook such as Google Colab with a T4 or better.

## Portfolio Notes

This project is intended to demonstrate practical understanding of modern LLM finetuning workflows, not just model API usage. The most important artifacts for a portfolio reviewer are:

- A clear before/after generation comparison.
- Base versus finetuned perplexity.
- The distinction between full finetuning and parameter-efficient QLoRA.
- Awareness of hardware constraints and why the local project uses DistilGPT-2.
