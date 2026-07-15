# Project Framework: Banking Intent Classification

This project follows the CRISP-DM framework so the work is organized like a real AI engineering project, not just a collection of model experiments.

## 1. Business Understanding

Goal: classify customer banking queries into predefined intent categories so a banking support system can route messages faster and respond more accurately.

Business value:

- Improve first-response accuracy.
- Reduce manual triage for customer support teams.
- Route customer questions to the correct workflow or specialist.
- Support chatbot and self-service experiences.
- Protect sensitive customer data before model inference.

Success criteria:

- Strong overall accuracy across all 77 banking intents.
- Strong macro F1 so smaller or harder intent categories are not ignored.
- Clear comparison between a lightweight baseline and a transformer approach.
- A privacy layer that redacts or hashes common PII before inference.

## 2. Data Understanding

Dataset files:

- `data/banking77_train.csv`
- `data/banking77_test.csv`

Expected columns:

- `text`: customer query written in natural language.
- `category`: banking intent label as a text string.

Verified dataset checks:

- Training rows: 10,003
- Testing rows: 3,080
- Intent classes: 77
- Missing `text` values: 0
- Missing `category` values: 0

EDA questions:

- How many observations are in the training and testing datasets?
- What is the distribution of labels across all intents?
- Do customer query lengths vary across intents?
- Which words occur most often in each intent?
- Are there words that overlap heavily across similar intents?
- Are there keywords that help distinguish close intent categories?
- Does temporal language, such as "pending", "already", or "when", help separate intents?

Initial risks:

- Many banking intents use overlapping vocabulary.
- Some customer questions are very short and may lack context.
- Similar categories can be difficult to distinguish without contextual language understanding.
- Raw customer text may contain sensitive financial or personal information.

## 3. Data Preparation

For the MLP baseline:

- Encode intent labels with `LabelEncoder`.
- Convert text into numerical features with `TfidfVectorizer`.
- Train on encoded labels and TF-IDF vectors.
- Use the resulting TF-IDF feature count as the MLP input layer size.

For the transformer workflow:

- Convert Pandas DataFrames into Hugging Face Datasets.
- Tokenize customer query text with a pretrained tokenizer.
- Use the `roberta-base` tokenizer for subword tokenization.
- Apply truncation and dynamic padding for efficient batches.
- Use train/test splits consistently across evaluation.

For privacy:

- Redact sensitive values such as emails, phone numbers, card numbers, SSNs, CVVs, PINs, routing numbers, and IP addresses.
- Optionally hash lower-risk identifiers when stable matching is useful without exposing raw values.

## 4. Modeling

Baseline model:

- TF-IDF vectorizer plus a PyTorch Multi-Layer Perceptron.
- ReLU hidden layers with dropout.
- 77-class output layer.
- Cross-entropy loss and AdamW optimizer.
- Implemented in `src/train_mlp_baseline.py`.
- Purpose: establish a fast, interpretable baseline before using a transformer.

Advanced model:

- LoRA-finetuned RoBERTa workflow.
- `TrainingArguments` and `Trainer` manage finetuning and evaluation.
- `LoraConfig` uses sequence classification with adapters on query, key, and value projections.
- The finetuned model and tokenizer are saved after training.
- Implemented in `notebooks/banking_intent_classification_solution.ipynb`.
- Purpose: compare whether contextual transformer representations justify the added complexity.

## 5. Evaluation

Metrics:

- Accuracy
- Macro F1
- Weighted F1
- Classification report
- Per-intent class performance

Current baseline result:

- Accuracy: 0.8773
- Macro F1: 0.8771
- Weighted F1: 0.8771

Evaluation focus:

- Compare overall MLP and transformer performance.
- Identify which intent classes improve most with transformer finetuning.
- Identify confusing intent pairs where wording overlaps.
- Decide whether the additional transformer cost is justified.

## 6. Deployment

Production-readiness considerations:

- Run PII redaction before inference.
- Save trained model artifacts and label mappings.
- Track model version, dataset version, and preprocessing settings.
- Add confidence thresholds for human review.
- Monitor drift in customer language and intent frequency.
- Log predictions safely without storing raw sensitive text.

## Artifact Map

| CRISP-DM Step | Project Artifact |
| --- | --- |
| Business Understanding | `README.md`, this framework |
| Data Understanding | Notebook EDA section, dataset checks in `RESULTS.md` |
| Data Preparation | `src/train_mlp_baseline.py`, notebook preprocessing cells |
| Modeling | `MODELING_GUIDE.md`, MLP baseline script, LoRA RoBERTa notebook |
| Evaluation | `RESULTS.md`, notebook reports and plots |
| Deployment | `src/pii_guardrails.py`, safe inference examples |
