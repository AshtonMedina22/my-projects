# Banking Intent Classification with Neural Networks

This project classifies customer banking questions into 77 intent categories using the Banking77 dataset. It compares a fast neural-network baseline against a transformer finetuning workflow and includes practical privacy safeguards for customer text.

## Project Goals

- Explore the Banking77 customer intent dataset.
- Build a baseline text classifier with TF-IDF features and a PyTorch MLP.
- Compare the baseline against a LoRA-finetuned transformer workflow.
- Evaluate performance with accuracy, macro F1, weighted F1, and classification reports.
- Add a PII redaction layer before inference to protect sensitive customer data.

## Project Framework

This project is organized with CRISP-DM:

1. Business Understanding: classify banking queries into 77 intents to improve routing, response speed, and customer experience.
2. Data Understanding: verify the Banking77 train/test files, inspect class balance, query lengths, and text patterns.
3. Data Preparation: encode intent labels, vectorize text for the MLP baseline, tokenize text for the transformer workflow, and protect PII.
4. Modeling: train a TF-IDF + PyTorch MLP baseline and compare it with a LoRA-finetuned RoBERTa workflow.
5. Evaluation: compare accuracy, macro F1, weighted F1, and per-intent class performance.
6. Deployment: prepare safe inference with PII redaction, saved artifacts, confidence thresholds, and monitoring recommendations.

See `PROJECT_FRAMEWORK.md` for the full project plan and artifact map.
See `MODELING_GUIDE.md` for the MLP and LoRA-RoBERTa training details.

## Why This Is Portfolio-Relevant

This project is closer to a real customer-support ML workflow than a toy classifier. It shows:

- End-to-end data loading, EDA, preprocessing, modeling, evaluation, and inference.
- A baseline-first approach before using heavier transformer methods.
- Awareness of class-level performance across many customer intents.
- Responsible AI handling of sensitive banking data.
- A path from notebook experimentation to reusable scripts.

## Structure

```text
engineer-neural-networks-portfolio/
  data/
    banking77_train.csv
    banking77_test.csv
  notebooks/
    banking_intent_classification_solution.ipynb
  src/
    train_mlp_baseline.py
    compare_model_reports.py
    pii_guardrails.py
  PROJECT_FRAMEWORK.md
  MODELING_GUIDE.md
  RESULTS.md
  README.md
  requirements.txt
```

## Dataset

The dataset contains customer banking queries:

- `text`: the customer query.
- `category`: the intent label.

There are 77 intent classes, making this a multi-class classification problem.

## Run the Baseline

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the PyTorch MLP baseline:

```bash
python src/train_mlp_baseline.py
```

For a faster smoke test:

```bash
python src/train_mlp_baseline.py --max-train-rows 1000 --epochs 2
```

## Privacy Guardrails

Run the PII redaction demo:

```bash
python src/pii_guardrails.py
```

The redactor removes or hashes common sensitive fields such as emails, phone numbers, credit card numbers, SSNs, CVVs, PINs, dates of birth, routing numbers, and IP addresses.

See `RESULTS.md` for local validation results. The MLP baseline reached **87.73% accuracy** and **0.877 macro F1** on the Banking77 test set.

## Performance Summary

The notebook comparison shows that the LoRA-finetuned RoBERTa model improves over the MLP baseline:

| Model | Accuracy | Macro F1 | Weighted F1 |
| --- | ---: | ---: | ---: |
| MLP baseline | 0.8799 | 0.8797 | 0.8797 |
| LoRA-RoBERTa | 0.9347 | 0.9347 | 0.9347 |

Main finding: the MLP is a strong and efficient baseline, while LoRA-RoBERTa provides a meaningful performance lift for subtle intent categories with overlapping language.

To compare saved classification report dictionaries:

```bash
python src/compare_model_reports.py --mlp-report reports/mlp_report.json --roberta-report reports/roberta_report.json --output-csv reports/model_comparison.csv
```

## Transformer Notebook

The notebook `notebooks/banking_intent_classification_solution.ipynb` includes the broader workflow:

- EDA and visualizations.
- TF-IDF MLP baseline.
- LoRA finetuning with RoBERTa.
- RoBERTa tokenization with dynamic padding.
- LoRA adapters on query, key, and value attention projections.
- Model saving/loading.
- Performance comparison.
- PII-safe inference examples.

The transformer section is best run with a GPU.
