# Validation Results

## MLP Baseline

Command:

```bash
python src/train_mlp_baseline.py --epochs 5 --batch-size 256
```

Dataset:

```text
Train shape: (10003, 2)
Test shape: (3080, 2)
Intent classes: 77
Missing values:
text        0
category    0
```

Training:

```text
Epoch 1/5 | loss=4.1927 | train_acc=0.0591
Epoch 2/5 | loss=2.7070 | train_acc=0.4840
Epoch 3/5 | loss=0.8676 | train_acc=0.8195
Epoch 4/5 | loss=0.3590 | train_acc=0.9206
Epoch 5/5 | loss=0.2016 | train_acc=0.9565
```

Test metrics:

```text
Accuracy: 0.8773
Macro F1: 0.8771
Weighted F1: 0.8771
```

Interpretation:

The TF-IDF + PyTorch MLP baseline is strong for a lightweight model, reaching about 88% accuracy across 77 intent classes. This gives the transformer/LoRA notebook a meaningful baseline to beat, rather than comparing against a weak or missing baseline.

## MLP vs LoRA-RoBERTa Comparison

The notebook compares the baseline MLP against a LoRA-finetuned RoBERTa model by regenerating both classification reports with `output_dict=True`, extracting per-intent precision, recall, and F1 scores, and calculating the metric differences per class.

Notebook comparison metrics:

```text
MLP Accuracy: 0.8799
MLP Macro F1: 0.8797
MLP Weighted F1: 0.8797

LoRA-RoBERTa Accuracy: 0.9347
LoRA-RoBERTa Macro F1: 0.9347
LoRA-RoBERTa Weighted F1: 0.9347
```

Key comparison:

- LoRA-RoBERTa improved macro F1 by about 5.5 percentage points.
- The strongest improvements appeared in intent classes with overlapping wording, especially card problems and identity verification.
- The MLP remained strong for keyword-heavy intents, showing that simpler baselines are still valuable.
- A small number of intents had minor MLP advantages, but both models still performed well on those classes.

Largest improvement themes:

- Card issue intents such as `contactless_not_working` and `card_not_working`.
- Identity verification intents such as `verify_my_identity`, `unable_to_verify_identity`, and `why_verify_identity`.
- Semantically similar support questions where contextual representation matters more than simple keyword matching.

Conclusion:

The MLP baseline is fast, inexpensive, and surprisingly effective. LoRA-RoBERTa is slower and more complex, but the performance gain is meaningful for a production banking support system where routing accuracy, customer trust, and consistent handling across all intents matter.

## PII Guardrail Smoke Test

Command:

```bash
python src/pii_guardrails.py
```

Observed behavior:

```text
Original: Email me at john.doe@email.com or call 123-456-7890.
Redacted: Email me at <EMAIL_REDACTED> or call <PHONE_REDACTED>.
Hashed: Email me at <HASH:55f537baf7> or call <HASH:29ec0a0604>.

Original: My card is 4532-1234-5678-9010 and CVV is 123.
Redacted: My card is <CREDIT_CARD_REDACTED> and <CVV_REDACTED>.
Hashed: My card is <CREDIT_CARD_REDACTED> and <CVV_REDACTED>.

Original: Routing number is 021000021 and my PIN is 4567.
Redacted: <ROUTING_NUMBER_REDACTED> and my <PIN_REDACTED>.
Hashed: <ROUTING_NUMBER_REDACTED> and my <PIN_REDACTED>.
```

The guardrail correctly redacts highly sensitive financial fields and can hash contact identifiers when stable customer matching is needed without exposing raw values.

## Final Takeaways

- Banking77 is well suited for demonstrating real-world NLP classification because it has many fine-grained customer intents.
- TF-IDF plus an MLP gives a strong benchmark and helps justify whether a transformer is worth the extra cost.
- LoRA-RoBERTa improves performance most where intent wording is subtle or overlapping.
- PII handling is essential before using customer banking text in inference, logs, or demos.
- Next improvements should include confidence thresholds, confusion-matrix analysis, hard-class retraining, model artifact versioning, and a small inference API or web demo.
