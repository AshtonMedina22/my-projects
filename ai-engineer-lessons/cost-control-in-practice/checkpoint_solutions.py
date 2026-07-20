import hashlib

import pandas as pd


df = pd.read_csv("customer_support_clean.csv", on_bad_lines="skip", encoding="utf-8", sep=",", engine="python")


# Checkpoint 1
tier_counts = df["model_tier"].value_counts()
tier_percentages = df["model_tier"].value_counts(normalize=True) * 100

tier_costs = df.groupby("model_tier")["cost"].sum()
tier_avg_costs = df.groupby("model_tier")["cost"].mean()

current_total_cost = df["cost"].sum()

gpt4_cost_per_conv = 0.018
baseline_cost = len(df) * gpt4_cost_per_conv

total_savings = baseline_cost - current_total_cost
savings_percentage = (total_savings / baseline_cost) * 100


# Checkpoint 2
def hash_query(text):
    """Create MD5 hash of query for cache key"""
    if pd.isna(text):
        return None
    return hashlib.md5(str(text).lower().strip().encode()).hexdigest()


df["query_hash"] = df["instruction"].apply(hash_query)

query_counts = df["query_hash"].value_counts()

duplicate_hashes = query_counts[query_counts > 1].index
df["is_duplicate"] = df["query_hash"].duplicated()

total_queries = len(df)
unique_queries = df["query_hash"].nunique()
duplicate_queries = df["is_duplicate"].sum()
cache_hit_rate = (duplicate_queries / total_queries) * 100

first_occurrences = ~df["is_duplicate"]
cost_with_cache = df.loc[first_occurrences, "cost"].sum()
cache_savings = current_total_cost - cost_with_cache

total_optimized_savings = baseline_cost - cost_with_cache
total_savings_pct = (total_optimized_savings / baseline_cost) * 100


# Checkpoint 3
quality_by_tier = df.groupby("model_tier").agg(
    {
        "resolved": "mean",
        "csat_score": "mean",
    }
)

