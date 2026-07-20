<details><summary style="display:list-item; font-size:16px; color:blue;">Jupyter Help</summary>
    
Having trouble testing your work? Double-check that you have followed the steps below to write, run, save, and test your code!
    
[Click here for a walkthrough GIF of the steps below](https://static-assets.codecademy.com/Courses/ds-python/jupyter-help.gif)

Run all initial cells to import libraries and datasets. Then follow these steps for each question:
    
1. Add your solution to the cell with `## YOUR SOLUTION HERE ## `.
2. Run the cell by selecting the `Run` button or the `Shift`+`Enter` keys.
3. Save your work by selecting the `Save` button, the `command`+`s` keys (Mac), or `control`+`s` keys (Windows).
4. Select the `Test Work` button at the bottom left to test your work.

![Screenshot of the buttons at the top of a Jupyter Notebook. The Run and Save buttons are highlighted](https://static-assets.codecademy.com/Paths/ds-python/jupyter-buttons.png)

**Setup**

Import the required libraries and dataset.

* Dataset: bitext/customer-support-llm-chatbot-training-dataset (Modified)
* Original: https://huggingface.co/datasets/bitext/customer-support-llm-chatbot-training-dataset

MODIFICATIONS (Educational):
- Added synthetic PII columns and injected PII into text
- Introduced data quality issues
- Purpose: Simulate realistic data preprocessing challenges


```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load the dataset
df = pd.read_csv('customer_support_clean.csv')
```

**Example**

You'll work with production conversation logs from your AI chatbot. Each row represents one conversation with metrics like response time, cost, and quality indicators. Explore a sample conversation:


```python
sample = df.iloc[100]
print("=== Sample Conversation ===")
#print(f"Conversation ID: {sample['conversation_id']}")
print(f"Model used: {sample['model_used']}")
print(f"Latency: {sample['latency_seconds']:.2f}s")
print(f"Tokens used: {sample['tokens_used']}")
print(f"Cost: ${sample['cost']:.4f}")
print(f"Resolved: {sample['resolved']}")
print(f"CSAT: {sample['csat_score']}/5")
print(f"Hallucinated: {sample['hallucinated']}")
print(f"Instruction: {sample['instruction']}")
print(f"Response: {sample['response'][0:100]}...")
```

#### Checkpoint 1/3: Calculate Technical Metrics

Your first monitoring task is to measure technical performance, namely speed. Use both averages and percentiles to determine if users are waiting too long for responses.

1. Calculate the average latency across all conversations
2. Calculate the p95 latency (95th percentile) - this tells you the worst experience for 95% of users
3. Calculate the p99 latency (99th percentile) - this catches the slowest outliers
4. Count how many conversations exceed the 5-second threshold (considered too slow) and the percentage of these slow conversations

Don't forget to run the cell and save the notebook before selecting `Test Work`!


```python
## YOUR SOLUTION HERE ##

# Calculate latency metrics
avg_latency = None
p95_latency =  None
p99_latency = None

# Count slow conversations (>5 seconds)
slow_conversations =  None
slow_percentage =  None

# Display results
print("=== Performance Metrics ===")
print(f"Average latency: {avg_latency:.2f}s")
print(f"p95 latency: {p95_latency:.2f}s")
print(f"p99 latency: {p99_latency:.2f}s")
print(f"\nSlow conversations (>5s): {slow_conversations} ({slow_percentage:.1f}%)")

```

#### Checkpoint 2/3: Calculate Quality & Cost Metrics

Speed isn't everything—your chatbot needs to be accurate, helpful, and cost-effective. In this checkpoint, you'll monitor quality and spending.

1. Calculate the resolution rate - percentage of conversations where `resolved == True`
2. Calculate the hallucination rate - percentage where `hallucinated == True`
3. Calculate the average CSAT score - mean customer satisfaction
4. Calculate the escalation rate - percentage where `escalated_to_human == True`
5. Calculate the total cost across all conversations
6. Calculate the average cost per conversation
7. Calculate the total tokens used
8. Project the yearly cost - assume current data represents 1 month of data


Don't forget to run the cell and save the notebook before selecting `Test Work`!


```python
## YOUR SOLUTION HERE ##

# Quality metrics
resolution_rate =  None
hallucination_rate =  None
avg_csat = None
escalation_rate =  None

# Cost metrics
total_cost =  None
avg_cost =  None
total_tokens =  None
yearly_projection =  None

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

```

#### Checkpoint 3/3: Trend Analysis & Visualization

In this checkpoint, you'll analyze performance over time and visualize trends.

1. Group conversations by week number and calculate:
   - Average resolution rate per week
   - Average CSAT score per week
   - Average latency per week
2. Create a line plot showing these three metrics over time
3. Identify the week with the worst performance (lowest resolution rate)
4. Calculate the change from the first week to the last week for each metric

Don't forget to run the cell and save the notebook before selecting `Test Work`!


```python
## YOUR SOLUTION HERE ##

# Group by week and calculate metrics
weekly_metrics =  None

# Rename columns for clarity
weekly_metrics.columns = ['week', 'resolution_rate', 'avg_csat', 'avg_latency']

# Find worst performing week
worst_week_idx =  None
worst_week =  None
worst_resolution =  None

# Calculate changes from first to last week
first_week = None
last_week = None

resolution_change =  None
csat_change =  None
latency_change =  None

# Display summary
print("=== Weekly Trend Analysis ===")
print(f"Worst performing week: Week {worst_week} ({worst_resolution:.1%} resolution)")
print(f"\nFirst week → Last week changes:")
print(f"Resolution rate: {resolution_change:+.1%}")
print(f"CSAT score: {csat_change:+.2f}")
print(f"Latency: {latency_change:+.2f}s")

# Create visualization
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Plot 1: Resolution Rate
axes[0].plot( None, None, marker='o')
axes[0].axhline(y=0.70, color='r', linestyle='--', label='Target: 70%')
axes[0].set_xlabel('Week')
axes[0].set_ylabel('Resolution Rate')
axes[0].set_title('Resolution Rate Over Time')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# Plot 2: CSAT Score
axes[1].plot( None, None, marker='o', color='green')
axes[1].axhline(y=4.0, color='r', linestyle='--', label='Target: 4.0')
axes[1].set_xlabel('Week')
axes[1].set_ylabel('CSAT Score')
axes[1].set_title('Customer Satisfaction Over Time')
axes[1].legend()
axes[1].grid(True, alpha=0.3)

# Plot 3: Latency
axes[2].plot( None, None,  marker='o', color='orange')
axes[2].axhline(y=2.0, color='r', linestyle='--', label='Target: 2.0s')
axes[2].set_xlabel('Week')
axes[2].set_ylabel('Latency (seconds)')
axes[2].set_title('Response Time Over Time')
axes[2].legend()
axes[2].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

```


```python

```


```python

```
