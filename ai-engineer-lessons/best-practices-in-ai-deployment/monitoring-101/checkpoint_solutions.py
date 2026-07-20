import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


df = pd.read_csv("customer_support_clean.csv")


# Checkpoint 1
# Calculate latency metrics
avg_latency = df["latency_seconds"].mean()
p95_latency = df["latency_seconds"].quantile(0.95)
p99_latency = df["latency_seconds"].quantile(0.99)

# Count slow conversations (>5 seconds)
slow_conversations = (df["latency_seconds"] > 5).sum()
slow_percentage = slow_conversations / len(df) * 100

# Display results
print("=== Performance Metrics ===")
print(f"Average latency: {avg_latency:.2f}s")
print(f"p95 latency: {p95_latency:.2f}s")
print(f"p99 latency: {p99_latency:.2f}s")
print(f"\nSlow conversations (>5s): {slow_conversations} ({slow_percentage:.1f}%)")


# Checkpoint 2
# Quality metrics
resolution_rate = df["resolved"].mean()
hallucination_rate = df["hallucinated"].mean()
avg_csat = df["csat_score"].mean()
escalation_rate = df["escalated_to_human"].mean()

# Cost metrics
total_cost = df["cost"].sum()
avg_cost = df["cost"].mean()
total_tokens = df["tokens_used"].sum()
yearly_projection = total_cost * 12

# Display results
print("=== Quality Metrics ===")
print(f"Resolution rate: {resolution_rate:.1%}")
print(f"Hallucination rate: {hallucination_rate:.1%}")
print(f"Average CSAT: {avg_csat:.2f}/5")
print(f"Escalation rate: {escalation_rate:.1%}")

print("\n=== Cost Metrics ===")
print(f"Total cost (today): ${total_cost:.2f}")
print(f"Average per conversation: ${avg_cost:.4f}")
print(f"Total tokens: {total_tokens:,}")
print(f"Yearly projection: ${yearly_projection:,.2f}")


# Checkpoint 3
# Create week number from timestamp
df["timestamp"] = pd.to_datetime(df["timestamp"])
df["week"] = df["timestamp"].dt.isocalendar().week

# Group by week and calculate metrics
weekly_metrics = df.groupby("week")[["resolved", "csat_score", "latency_seconds"]].mean().reset_index()

# Rename columns for clarity
weekly_metrics.columns = ["week", "resolution_rate", "avg_csat", "avg_latency"]

# Find worst performing week
worst_week_idx = weekly_metrics["resolution_rate"].idxmin()
worst_week = weekly_metrics.loc[worst_week_idx, "week"]
worst_resolution = weekly_metrics.loc[worst_week_idx, "resolution_rate"]

# Calculate changes from first to last week
first_week = weekly_metrics.iloc[0]
last_week = weekly_metrics.iloc[-1]

resolution_change = last_week["resolution_rate"] - first_week["resolution_rate"]
csat_change = last_week["avg_csat"] - first_week["avg_csat"]
latency_change = last_week["avg_latency"] - first_week["avg_latency"]

# Display summary
print("=== Weekly Trend Analysis ===")
print(f"Worst performing week: Week {worst_week} ({worst_resolution:.1%} resolution)")
print(f"\nFirst week -> Last week changes:")
print(f"Resolution rate: {resolution_change:+.1%}")
print(f"CSAT score: {csat_change:+.2f}")
print(f"Latency: {latency_change:+.2f}s")

# Create visualization
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Plot 1: Resolution Rate
axes[0].plot(weekly_metrics["week"], weekly_metrics["resolution_rate"], marker="o")
axes[0].axhline(y=0.70, color="r", linestyle="--", label="Target: 70%")
axes[0].set_xlabel("Week")
axes[0].set_ylabel("Resolution Rate")
axes[0].set_title("Resolution Rate Over Time")
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# Plot 2: CSAT Score
axes[1].plot(weekly_metrics["week"], weekly_metrics["avg_csat"], marker="o", color="green")
axes[1].axhline(y=4.0, color="r", linestyle="--", label="Target: 4.0")
axes[1].set_xlabel("Week")
axes[1].set_ylabel("CSAT Score")
axes[1].set_title("Customer Satisfaction Over Time")
axes[1].legend()
axes[1].grid(True, alpha=0.3)

# Plot 3: Latency
axes[2].plot(weekly_metrics["week"], weekly_metrics["avg_latency"], marker="o", color="orange")
axes[2].axhline(y=2.0, color="r", linestyle="--", label="Target: 2.0s")
axes[2].set_xlabel("Week")
axes[2].set_ylabel("Latency (seconds)")
axes[2].set_title("Response Time Over Time")
axes[2].legend()
axes[2].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()
