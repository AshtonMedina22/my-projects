# Modeling Guide

This project compares two text classification approaches for Banking77 customer intent detection: a fast MLP baseline and a LoRA-finetuned RoBERTa transformer.

## Multi-Layer Perceptron: Training and Evaluation

The MLP is the baseline model. Its purpose is to establish a strong, fast benchmark before using a heavier transformer.

### Architecture

Implemented in `src/train_mlp_baseline.py`:

- Input layer: matches the number of TF-IDF features.
- Hidden layers: two fully connected layers with ReLU activations.
- Dropout: added between hidden layers to reduce overfitting.
- Output layer: predicts one of the 77 banking intent classes.

The model outputs logits, not probabilities. The predicted class is selected with `argmax`.

### Training Components

The baseline uses:

- `nn.CrossEntropyLoss()` for multi-class classification.
- `torch.optim.AdamW()` for adaptive optimization with weight decay.
- PyTorch `DataLoader` batches for training and testing.

### Training Loop

The training loop performs:

- Forward pass through the MLP.
- Cross-entropy loss calculation.
- Backward pass with `loss.backward()`.
- Parameter update with `optimizer.step()`.
- Per-epoch average loss and training accuracy tracking.

### Evaluation

The evaluation step reports:

- Accuracy
- Macro F1
- Weighted F1
- Full classification report

Current MLP baseline:

- Accuracy: 0.8773
- Macro F1: 0.8771
- Weighted F1: 0.8771

## RoBERTa Transformer: Preprocessing

The transformer workflow finetunes `roberta-base` with LoRA. RoBERTa provides contextual token representations, so it can better separate banking intents with overlapping keywords.

Implemented in `notebooks/banking_intent_classification_solution.ipynb`.

### Label Encoding

Intent labels are converted from text strings into integer IDs with `LabelEncoder`.

Each banking intent maps to one class ID. These IDs are used as the `labels` field during transformer training and evaluation.

### Tokenization

Customer query text is tokenized with the Hugging Face `roberta-base` tokenizer:

- Raw text is converted into subword tokens.
- Text is truncated to a maximum sequence length of 256 tokens.
- Dynamic padding is applied with `DataCollatorWithPadding`.

Dynamic padding keeps each batch efficient by padding only to the longest sequence in that batch.

## RoBERTa Transformer: Finetuning and Evaluation

### Finetuning Configuration

The notebook uses Hugging Face `TrainingArguments` to configure:

- Output directory
- Logging directory
- Learning rate
- Learning rate scheduler
- Warmup ratio
- Number of epochs
- Training batch size
- Evaluation batch size
- Evaluation and logging strategy
- Random seed

### LoRA Configuration

LoRA is configured with PEFT:

- `TaskType.SEQ_CLS` for sequence classification.
- Rank: `r=32`
- Scaling factor: `lora_alpha=64`
- Dropout: `lora_dropout=0.05`
- Bias updates: `bias="none"`
- Target modules: `["query", "key", "value"]`

Applying adapters to query, key, and value projections lets the model adapt the attention mechanism without fully updating every RoBERTa parameter.

### Training and Evaluation

The notebook uses Hugging Face `Trainer` with:

- LoRA-wrapped RoBERTa model.
- Training arguments.
- Tokenized training dataset.
- Tokenized testing dataset.
- RoBERTa tokenizer.
- Dynamic padding collator.

After training, the notebook evaluates the model on the Banking77 test set and generates class predictions for comparison against the MLP baseline.

### Saved Artifacts

The notebook saves the finetuned LoRA-RoBERTa model and tokenizer to:

```text
finetuned_roberta_lora_model/
```

The saved model can be reloaded with `AutoModelForSequenceClassification.from_pretrained()` and used for batch inference.
