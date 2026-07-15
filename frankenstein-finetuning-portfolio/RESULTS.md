# Validation Results

This project was smoke-tested locally on CPU using a small subset of the Frankenstein dataset.

Command:

```bash
python src/train_distilgpt2.py --max-rows 12 --epochs 1 --max-eval-rows 2 --max-new-tokens 20 --batch-size 1
```

Environment:

- Device path: CPU
- Model: `distilbert/distilgpt2`
- Training rows after split: 9
- Test rows after split: 3
- Epochs: 1

Observed output:

```text
Rows: 12
Columns: ['text']
Null values:
text    0
Character length summary:
count      12.000000
mean      902.166667
std        81.383306
min       813.000000
25%       837.500000
50%       879.500000
75%       971.250000
max      1057.000000
```

Base generation:

```text
I'm afraid I've created a vernacular language for you. I'm not a fan of the vernacular, but I'm
```

Finetuned generation:

```text
I'm afraid I've created a vernacular for you.”

“I'm not going to be
```

Perplexity:

```text
Base model perplexity: 66.73
Finetuned model perplexity: 66.53
```

Saved-model generation test:

```bash
python src/generate.py --model-dir models/frankenstein-distilgpt2 --prompt "The creature opened his eyes" --max-new-tokens 20
```

Output:

```text
The creature opened his eyes and said, “I’m not going to let you down.”
```

These results validate that the full local pipeline runs end to end. The tiny smoke-test dataset is intentionally too small to produce a strong literary model; a full portfolio run should use the full dataset and more training time.
