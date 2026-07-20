import hashlib
import numpy as np
import pandas as pd


df = pd.read_csv("customer_support_raw.csv")


# Checkpoint 1
print(f"Starting with {len(df)} conversations")

# Track issues found
issues = {
    "missing_timestamp": 0,
    "invalid_customer_id": 0,
    "near_empty_message": 0,
}

# Remove missing timestamps
missing_timestamp = df["timestamp"].isna() | (df["timestamp"].astype(str).str.strip() == "")
issues["missing_timestamp"] = missing_timestamp.sum()
df = df[~missing_timestamp]

# Remove invalid customer IDs (must start with 'cust_')
invalid_id = ~df["customer_id"].astype(str).str.startswith("cust_")
issues["invalid_customer_id"] = invalid_id.sum()
df = df[~invalid_id]

# Remove empty messages
near_empty_message = df["instruction_raw"].astype(str).str.strip().str.len() < 3
issues["near_empty_message"] = near_empty_message.sum()
df = df[~near_empty_message]

# Print validation report
print("\n=== Validation Report ===")
print(f"Removed {issues['missing_timestamp']} rows with missing timestamps")
print(f"Removed {issues['invalid_customer_id']} rows with invalid customer IDs")
print(f"Removed {issues['near_empty_message']} rows with near empty messages")
print(f"Clean dataset: {len(df)} conversations remaining")


# Checkpoint 2
import re

EMAIL_PATTERN = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
PHONE_PATTERN = r"\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b"


def remove_pii(text):
    if pd.isna(text):
        return text
    text = re.sub(EMAIL_PATTERN, "[EMAIL]", text)
    text = re.sub(PHONE_PATTERN, "[PHONE]", text)
    return text


df["instruction_cleaned"] = df["instruction_raw"].apply(remove_pii)
df["response_cleaned"] = df["response_raw"].apply(remove_pii)

print("\n=== Before/After Examples ===")
samples = df[df["instruction_raw"].str.contains(EMAIL_PATTERN, regex=True, na=False)].head(2)
for _, row in samples.iterrows():
    print(f"Before: {row['instruction_raw'][:100]}")
    print(f"After:  {row['instruction_cleaned'][:100]}\n")


# Checkpoint 3
def hash_customer_id(customer_id):
    if pd.isna(customer_id):
        return None
    return hashlib.sha256(str(customer_id).encode()).hexdigest()[:16]


sample_id = df["customer_id"].iloc[0]
print("=== Anonymization Example ===")
print(f"Original: {sample_id} -> Hashed: {hash_customer_id(sample_id)}")

df["customer_id_hashed"] = df["customer_id"].apply(hash_customer_id)
df = df.drop(columns=["customer_id", "customer_name", "email", "phone"])
print("Dropped: customer_id, customer_name, email, phone")


# Checkpoint 4
zipcode_counts = df["zipcode"].value_counts()
noise = np.random.laplace(0, 5.0, len(zipcode_counts))
private_counts = (zipcode_counts + noise).clip(lower=0).round()

print("\n=== Differential Privacy ===")
print(f"{'Zipcode':<10} {'Original':>10} {'Private':>10}")
for zipcode in zipcode_counts.index[:5]:
    print(f"{zipcode:<10} {zipcode_counts[zipcode]:>10} {private_counts[zipcode]:>10.0f}")

at_risk = zipcode_counts[zipcode_counts < 5]
if len(at_risk) > 0:
    print(f"\nZipcodes with <5 conversations protected: {list(at_risk.index)}")
