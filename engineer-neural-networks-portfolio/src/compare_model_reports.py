import argparse
import json
from pathlib import Path

import pandas as pd


AGGREGATE_KEYS = {"accuracy", "macro avg", "weighted avg"}


def report_to_frame(report: dict) -> pd.DataFrame:
    """Convert a sklearn classification_report output_dict to per-class rows."""
    rows = {
        label: metrics
        for label, metrics in report.items()
        if label not in AGGREGATE_KEYS and isinstance(metrics, dict)
    }
    return pd.DataFrame(rows).T


def compare_reports(mlp_report: dict, roberta_report: dict) -> pd.DataFrame:
    mlp_df = report_to_frame(mlp_report)
    roberta_df = report_to_frame(roberta_report)

    comparison_df = pd.DataFrame(
        {
            "MLP_Precision": mlp_df["precision"],
            "RoBERTa_Precision": roberta_df["precision"],
            "MLP_Recall": mlp_df["recall"],
            "RoBERTa_Recall": roberta_df["recall"],
            "MLP_F1": mlp_df["f1-score"],
            "RoBERTa_F1": roberta_df["f1-score"],
            "Support": mlp_df["support"],
        }
    )

    comparison_df["Precision_Diff"] = (
        comparison_df["RoBERTa_Precision"] - comparison_df["MLP_Precision"]
    )
    comparison_df["Recall_Diff"] = comparison_df["RoBERTa_Recall"] - comparison_df["MLP_Recall"]
    comparison_df["F1_Diff"] = comparison_df["RoBERTa_F1"] - comparison_df["MLP_F1"]
    return comparison_df.sort_values("F1_Diff", ascending=False)


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Compare MLP and LoRA-RoBERTa classification report JSON files."
    )
    parser.add_argument("--mlp-report", required=True, help="Path to MLP report JSON.")
    parser.add_argument("--roberta-report", required=True, help="Path to LoRA-RoBERTa report JSON.")
    parser.add_argument("--output-csv", default=None, help="Optional path for comparison CSV.")
    parser.add_argument("--top-n", type=int, default=10)
    args = parser.parse_args()

    comparison_df = compare_reports(
        load_json(Path(args.mlp_report)),
        load_json(Path(args.roberta_report)),
    )

    print(f"\nTop {args.top_n} RoBERTa improvements by F1:")
    print(comparison_df[["MLP_F1", "RoBERTa_F1", "F1_Diff"]].head(args.top_n))

    print(f"\nBottom {args.top_n} RoBERTa changes by F1:")
    print(comparison_df[["MLP_F1", "RoBERTa_F1", "F1_Diff"]].tail(args.top_n))

    if args.output_csv:
        output_path = Path(args.output_csv)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        comparison_df.to_csv(output_path)
        print(f"\nSaved comparison table to {output_path}")


if __name__ == "__main__":
    main()
