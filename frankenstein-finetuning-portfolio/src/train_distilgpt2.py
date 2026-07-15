import argparse
import math
import random
from pathlib import Path

import pandas as pd
import torch
import transformers
from datasets import Dataset
from sklearn.model_selection import train_test_split
from transformers import AutoModelForCausalLM, AutoTokenizer


def set_seed(seed: int = 42) -> None:
    random.seed(seed)
    torch.manual_seed(seed)


def get_device() -> str:
    if torch.cuda.is_available():
        return "cuda"
    if torch.backends.mps.is_available():
        return "mps"
    return "cpu"


def load_dataset(csv_path: Path, max_rows: int | None) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    df = df.dropna(subset=["text"]).copy()
    if max_rows is not None:
        df = df.head(max_rows)
    return df


def print_eda(df: pd.DataFrame) -> None:
    lengths = df["text"].str.len()
    print("Rows:", len(df))
    print("Columns:", list(df.columns))
    print("Null values:")
    print(df.isnull().sum())
    print("Character length summary:")
    print(lengths.describe())


def tokenize_dataset(dataset: Dataset, tokenizer: AutoTokenizer) -> Dataset:
    return dataset.map(
        lambda examples: tokenizer(
            examples["text"],
            padding="longest",
            truncation=True,
        ),
        batched=True,
        remove_columns=[col for col in dataset.column_names if col != "text"],
    )


def generate_text(model, tokenizer, prompt: str, device: str, max_new_tokens: int) -> str:
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(
        **inputs,
        max_new_tokens=max_new_tokens,
        pad_token_id=tokenizer.eos_token_id,
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)


def calc_perplexity(model, tokenizer, dataset: Dataset, device: str, max_rows: int | None) -> float:
    model.eval()
    rows = list(dataset)
    if max_rows is not None:
        rows = rows[:max_rows]

    losses = []
    for row in rows:
        inputs = tokenizer(row["text"], return_tensors="pt", truncation=True).to(device)
        input_ids = inputs["input_ids"]
        with torch.no_grad():
            outputs = model(**inputs, labels=input_ids)
        losses.append(outputs.loss.detach().float().cpu().item())

    avg_loss = sum(losses) / len(losses)
    return math.exp(avg_loss)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="data/frankenstein_chunks.csv")
    parser.add_argument("--model-name", default="distilbert/distilgpt2")
    parser.add_argument("--output-dir", default="models/frankenstein-distilgpt2")
    parser.add_argument("--prompt", default="I'm afraid I've created a ")
    parser.add_argument("--epochs", type=int, default=2)
    parser.add_argument("--batch-size", type=int, default=2)
    parser.add_argument("--learning-rate", type=float, default=2e-5)
    parser.add_argument("--max-rows", type=int, default=None)
    parser.add_argument("--max-eval-rows", type=int, default=25)
    parser.add_argument("--max-new-tokens", type=int, default=100)
    args = parser.parse_args()

    set_seed()
    project_root = Path(__file__).resolve().parents[1]
    csv_path = project_root / args.data
    output_dir = project_root / args.output_dir
    device = get_device()

    df = load_dataset(csv_path, args.max_rows)
    print_eda(df)

    train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
    train_dataset = Dataset.from_pandas(train_df, preserve_index=False)
    test_dataset = Dataset.from_pandas(test_df, preserve_index=False)

    tokenizer = AutoTokenizer.from_pretrained(args.model_name)
    tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(args.model_name).to(device)
    model.config.use_cache = False

    tokenized_train_dataset = tokenize_dataset(train_dataset, tokenizer)

    base_generation = generate_text(
        model,
        tokenizer,
        args.prompt,
        device,
        args.max_new_tokens,
    )
    base_ppl = calc_perplexity(model, tokenizer, test_dataset, device, args.max_eval_rows)

    trainer = transformers.Trainer(
        train_dataset=tokenized_train_dataset,
        model=model,
        args=transformers.TrainingArguments(
            warmup_steps=200,
            logging_steps=10,
            save_steps=200,
            output_dir=str(project_root / "outputs"),
            per_device_train_batch_size=args.batch_size,
            num_train_epochs=args.epochs,
            learning_rate=args.learning_rate,
            optim="adamw_torch",
            report_to=[],
        ),
        data_collator=transformers.DataCollatorForLanguageModeling(tokenizer, mlm=False),
    )
    trainer.train()

    finetuned_generation = generate_text(
        model,
        tokenizer,
        args.prompt,
        device,
        args.max_new_tokens,
    )
    finetuned_ppl = calc_perplexity(model, tokenizer, test_dataset, device, args.max_eval_rows)

    output_dir.mkdir(parents=True, exist_ok=True)
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)

    print("\n=== Base Generation ===")
    print(base_generation)
    print("\n=== Finetuned Generation ===")
    print(finetuned_generation)
    print("\n=== Perplexity ===")
    print(f"Base model perplexity: {base_ppl:.2f}")
    print(f"Finetuned model perplexity: {finetuned_ppl:.2f}")
    print(f"\nSaved model to: {output_dir}")


if __name__ == "__main__":
    main()
