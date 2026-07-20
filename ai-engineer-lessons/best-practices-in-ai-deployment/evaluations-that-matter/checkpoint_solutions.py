import pandas as pd
import numpy as np
from scipy import stats


offline_test = pd.read_csv("offline_evaluation_test.csv")
ab_test = pd.read_csv("ab_test_results.csv")


# Checkpoint 1
# Calculate accuracy for both models
model_a_accuracy = offline_test["model_a_correct"].mean()
model_b_accuracy = offline_test["model_b_correct"].mean()

# Calculate hallucination rates
model_a_hallucination = offline_test["model_a_hallucinated"].mean()
model_b_hallucination = offline_test["model_b_hallucinated"].mean()

# Display results
print("=== Offline Evaluation Results ===")
print(f"\nModel A (GPT-3.5):")
print(f"  Accuracy: {model_a_accuracy:.1%}")
print(f"  Hallucination rate: {model_a_hallucination:.1%}")

print(f"\nModel B (GPT-4):")
print(f"  Accuracy: {model_b_accuracy:.1%}")
print(f"  Hallucination rate: {model_b_hallucination:.1%}")


# Checkpoint 2
# Model specifications
# Create contingency table for chi-square test
# Rows: Model A, Model B | Columns: Correct, Incorrect
model_a_correct = offline_test["model_a_correct"].sum()
model_a_incorrect = len(offline_test) - model_a_correct
model_b_correct = offline_test["model_b_correct"].sum()
model_b_incorrect = len(offline_test) - model_b_correct

contingency_table = [
    [model_a_correct, model_a_incorrect],
    [model_b_correct, model_b_incorrect],
]

# Run chi-square test
chi2, p_value, dof, expected = stats.chi2_contingency(contingency_table)


print(f"\nStatistical Test:")
print(f"  Chi-square statistic: {chi2:.2f}")
print(f"  P-value: {p_value:.4f}")

if p_value < 0.05:
    print(f"\n The accuracy difference IS statistically significant (p < 0.05)")
    print(f"   Model B is likely genuinely better than Model A")
else:
    print(f"\nThe accuracy difference is NOT statistically significant (p >= 0.05)")
    print(f"   The difference might just be random chance")


# Checkpoint 3
# Split data by variant
control = ab_test[ab_test["variant"] == "control"]
treatment = ab_test[ab_test["variant"] == "treatment"]

# Calculate resolution rates
control_resolution = control["resolved"].mean()
treatment_resolution = treatment["resolved"].mean()

# Calculate avg costs
control_cost = control["cost"].mean()
treatment_cost = treatment["cost"].mean()

# Chi-square test for resolution rates
control_resolved = control["resolved"].sum()
control_unresolved = len(control) - control_resolved
treatment_resolved = treatment["resolved"].sum()
treatment_unresolved = len(treatment) - treatment_resolved

resolution_contingency = [
    [control_resolved, control_unresolved],
    [treatment_resolved, treatment_unresolved],
]

chi2_resolution, resolution_p_value, dof, expected = stats.chi2_contingency(resolution_contingency)

# Display results
print("=== A/B Test Results ===")
print(f"\nSample sizes:")
print(f"  Control (Model A): {len(control):,} conversations")
print(f"  Treatment (Model B): {len(treatment):,} conversations")

print(f"\nResolution Rates:")
print(f"  Control: {control_resolution:.1%}")
print(f"  Treatment: {treatment_resolution:.1%}")
print(f"  Difference: {(treatment_resolution - control_resolution):.1%}")
print(f"  P-value: {resolution_p_value:.4f}")

if resolution_p_value < 0.05:
    print(f"  Statistically significant difference")
else:
    print(f"   Not statistically significant")

print(f"\nCosts:")
print(f"  Control: ${control_cost:.4f}")
print(f"  Treatment: ${treatment_cost:.4f}")
print(f"  Difference %: {(treatment_cost - control_cost)/control_cost:.1%}")
