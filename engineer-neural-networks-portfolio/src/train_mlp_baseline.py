import argparse
from pathlib import Path

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from scipy import sparse
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.preprocessing import LabelEncoder
from torch.utils.data import DataLoader, Dataset


class TfidfDataset(Dataset):
    def __init__(self, x_sparse: sparse.spmatrix, y: np.ndarray):
        self.x_sparse = x_sparse
        self.y = y

    def __len__(self) -> int:
        return self.x_sparse.shape[0]

    def __getitem__(self, idx: int):
        x = self.x_sparse[idx].toarray().astype(np.float32).squeeze(0)
        y = np.int64(self.y[idx])
        return torch.from_numpy(x), torch.tensor(y)


class IntentMLP(nn.Module):
    def __init__(self, input_size: int, hidden_size: int, output_size: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_size, output_size),
        )

    def forward(self, x):
        return self.net(x)


def train_one_epoch(model, dataloader, loss_fn, optimizer, device):
    model.train()
    total_loss = 0.0
    correct = 0
    total = 0

    for x_batch, y_batch in dataloader:
        x_batch = x_batch.to(device)
        y_batch = y_batch.to(device)

        logits = model(x_batch)
        loss = loss_fn(logits, y_batch)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
        preds = logits.argmax(dim=1)
        correct += (preds == y_batch).sum().item()
        total += y_batch.size(0)

    return total_loss / len(dataloader), correct / total


def predict(model, dataloader, device):
    model.eval()
    predictions = []
    labels = []

    with torch.no_grad():
        for x_batch, y_batch in dataloader:
            logits = model(x_batch.to(device))
            predictions.append(logits.argmax(dim=1).cpu().numpy())
            labels.append(y_batch.numpy())

    return np.concatenate(predictions), np.concatenate(labels)


def stratified_head(df: pd.DataFrame, max_rows: int | None) -> pd.DataFrame:
    if max_rows is None or max_rows >= len(df):
        return df

    classes = df["category"].nunique()
    per_class = max(1, max_rows // classes)
    samples = []
    for _, group in df.groupby("category"):
        samples.append(group.sample(min(len(group), per_class), random_state=42))
    subset = pd.concat(samples).sample(frac=1, random_state=42).reset_index(drop=True)
    return subset.head(max_rows)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--train-csv", default="data/banking77_train.csv")
    parser.add_argument("--test-csv", default="data/banking77_test.csv")
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch-size", type=int, default=256)
    parser.add_argument("--hidden-size", type=int, default=512)
    parser.add_argument("--max-features", type=int, default=50000)
    parser.add_argument("--max-train-rows", type=int, default=None)
    args = parser.parse_args()

    torch.manual_seed(42)
    project_root = Path(__file__).resolve().parents[1]
    train = pd.read_csv(project_root / args.train_csv)
    test = pd.read_csv(project_root / args.test_csv)

    train = stratified_head(train, args.max_train_rows)

    print("Train shape:", train.shape)
    print("Test shape:", test.shape)
    print("Intent classes:", train["category"].nunique())
    print("Missing values:")
    print(train.isnull().sum())

    label_encoder = LabelEncoder()
    y_train = label_encoder.fit_transform(train["category"].astype(str))
    y_test = label_encoder.transform(test["category"].astype(str))

    vectorizer = TfidfVectorizer(
        lowercase=True,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95,
        max_features=args.max_features,
        strip_accents="unicode",
    )
    x_train = vectorizer.fit_transform(train["text"].astype(str))
    x_test = vectorizer.transform(test["text"].astype(str))

    train_loader = DataLoader(
        TfidfDataset(x_train, y_train),
        batch_size=args.batch_size,
        shuffle=True,
    )
    test_loader = DataLoader(
        TfidfDataset(x_test, y_test),
        batch_size=args.batch_size,
        shuffle=False,
    )

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = IntentMLP(
        input_size=x_train.shape[1],
        hidden_size=args.hidden_size,
        output_size=len(label_encoder.classes_),
    ).to(device)
    loss_fn = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)

    for epoch in range(args.epochs):
        avg_loss, accuracy = train_one_epoch(model, train_loader, loss_fn, optimizer, device)
        print(f"Epoch {epoch + 1}/{args.epochs} | loss={avg_loss:.4f} | train_acc={accuracy:.4f}")

    y_pred, y_true = predict(model, test_loader, device)
    accuracy = accuracy_score(y_true, y_pred)
    macro_f1 = f1_score(y_true, y_pred, average="macro")
    weighted_f1 = f1_score(y_true, y_pred, average="weighted")

    print("\n=== MLP Baseline Metrics ===")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Macro F1: {macro_f1:.4f}")
    print(f"Weighted F1: {weighted_f1:.4f}")
    print("\nClassification report:")
    print(classification_report(y_true, y_pred, target_names=label_encoder.classes_, zero_division=0))


if __name__ == "__main__":
    main()
