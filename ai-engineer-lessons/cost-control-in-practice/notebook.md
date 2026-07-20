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
import hashlib

# Load the dataset
df = pd.read_csv('customer_support_clean.csv', on_bad_lines='skip', encoding='utf-8', sep=',', engine='python')
```

**Example**

Your dataset contains conversations that have already been routed using a three-tier strategy, indicated by columns `model_tier` and `model_used`. 

Examine the current dataset:


```python
print(f"Total conversations: {len(df):,}")
print(f"\nTiers:")
print(df['model_tier'].unique())
print(f"\nModels:")
print(df['model_used'].unique())
```

    Total conversations: 22,138
    
    Tiers:
    ['tier2' 'tier3' 'tier1']
    
    Models:
    ['gpt-3.5-turbo' 'gpt-4-turbo' 'gpt-4' 'rule-based']


#### Checkpoint 1/3

Before making improvements, you need to understand how much you're spending now.

1. Calculate the count and percentage of conversations in each tier (tier1, tier2, tier3); save as `tier_counts` and `tier_percentages`
2. Calculate the total cost for each tier
3. Calculate the average cost per conversation for each tier
4. Calculate what the cost would be if you used **only GPT-4** (Tier 3) for everything; use `gpt4_cost_per_conv` multiplied by the number of conversations for the `baseline_cost`
5. Calculate your current savings (total and percentage) compared to the all-GPT-4 baseline

Don't forget to run the cell and save the notebook before selecting `Test Work`!


```python
## YOUR SOLUTION HERE ##

# Calculate distribution by tier
tier_counts = None
tier_percentages =  None

# Calculate costs by tier
tier_costs =  None
tier_avg_costs =  None

# Calculate current total cost
current_total_cost =  None

# Calculate baseline cost (all GPT-4)
# GPT-4 costs approximately $0.01 per 1K tokens, avg 180 tokens
gpt4_cost_per_conv = 0.018  # Average GPT-4 cost from data
baseline_cost = len(df) * gpt4_cost_per_conv

# Calculate savings
total_savings =  None
savings_percentage =  None

# Display results
print("=== Current Routing Analysis ===")
print(f"\nTraffic Distribution:")
for tier in ['tier1', 'tier2', 'tier3']:
    if tier in tier_counts.index:
        count = tier_counts[tier]
        pct = tier_percentages[tier]
        print(f"  {tier}: {count:,} conversations ({pct:.1f}%)")

print(f"\nCost by Tier:")
for tier in ['tier1', 'tier2', 'tier3']:
    if tier in tier_costs.index:
        total = tier_costs[tier]
        avg = tier_avg_costs[tier]
        print(f"  {tier}: ${total:.2f} total (${avg:.4f} average)")

print(f"\n=== Cost Comparison ===")
print(f"Current total cost: ${current_total_cost:.2f}")
print(f"Baseline (all GPT-4): ${baseline_cost:.2f}")
print(f"Current savings: ${total_savings:.2f} ({savings_percentage:.1f}%)")

```

#### Checkpoint 2/3: Implement Caching System

Many users ask the same questions over and over. Instead of calling expensive APIs every time, you can save (cache) responses for repeated questions. This is one of the easiest ways to cut costs.

1. Create a `query_hash` column for each conversation's instruction using the created function `hash_query`
2. Identify the number of duplicate queries using the `query_hash` column; create a column `is_duplicate` in `df` to identify duplicate queries
3. Calculate the cache hit rate - what % of queries are repeats?
4. Calculate the cost savings from caching - add up the costs of all duplicate queries (these would be free with caching)
5. Calculate the total savings combining routing + caching

**How caching works:** The first time someone asks "What are your hours?", you call the API and cache the response. The next 100 people who ask get the cached response instantly for $0.

Don't forget to run the cell and save the notebook before selecting `Test Work`!


```python
## YOUR SOLUTION HERE ##

# Create query hash for each instruction
def hash_query(text):
    """Create MD5 hash of query for cache key"""
    if pd.isna(text):
        return None
    return hashlib.md5(str(text).lower().strip().encode()).hexdigest()

df['query_hash'] =  None

# Count query occurrences
query_counts =  None

# Identify duplicates (queries that appear more than once)
duplicate_hashes =  None
df['is_duplicate'] =  None

# Calculate cache statistics
total_queries =  None
unique_queries =  None
duplicate_queries =  None
cache_hit_rate =  None

# Calculate cost savings from caching
# First occurrence of each query still needs API call (cost remains)
# All subsequent occurrences are cache hits (cost = $0)
first_occurrences =  None
cost_with_cache =  None
cache_savings =  None

# Calculate total savings (routing + caching)
total_optimized_savings =  None
total_savings_pct =  None

# Display results
print("=== Caching Analysis ===")
print(f"\nQuery Statistics:")
print(f"  Total queries: {total_queries:,}")
print(f"  Unique queries: {unique_queries:,}")
print(f"  Duplicate queries: {duplicate_queries:,}")
print(f"  Cache hit rate: {cache_hit_rate:.1f}%")

print(f"\nMost Common Queries:")
top_queries = query_counts.head(5)
for i, (query_hash, count) in enumerate(top_queries.items(), 1):
    sample_text = df[df['query_hash'] == query_hash]['instruction'].iloc[0]
    print(f"  {i}. Asked {count} times: {sample_text[:60]}...")

print(f"\n=== Cost Impact ===")
print(f"Current cost (with routing): ${current_total_cost:.2f}")
print(f"Cost savings from caching: ${cache_savings:.2f}")
print(f"Cost with routing + caching: ${cost_with_cache:.2f}")

print(f"\n=== Total Optimization ===")
print(f"Baseline (all GPT-4, no cache): ${baseline_cost:.2f}")
print(f"Optimized (routing + caching): ${cost_with_cache:.2f}")
print(f"Total savings: ${total_optimized_savings:.2f} ({total_savings_pct:.1f}%)")

```

#### Checkpoint 3/3

Saving money only works if quality stays high. You need to ensure that your routing strategy doesn't decrease the effectiveness of problem-solving or customer satisfaction.

1. Calculate the resolution rate and average CSAT by tier and save in `quality_by_tier`
2. Print the metrics by tier - are customers equally satisfied?

**The key insight:** If Tier 2 resolves 70% of issues at `$0.004` each and Tier 3 resolves 75% at `$0.020` each, which is a better value? You need to consider cost AND quality together.

Don't forget to run the cell and save the notebook before selecting `Test Work`!


```python
## YOUR SOLUTION HERE ##

# Calculate quality metrics by tier
quality_by_tier =  None


# Display results
print("=== Quality Metrics by Tier ===")
print(f"\n{'Tier':<10} {'Resolution':<12} {'CSAT':<8} ")
print("-" * 60)
for tier in ['tier1', 'tier2', 'tier3']:
    if tier in quality_by_tier.index:
        res = quality_by_tier.loc[tier, 'resolved']
        csat = quality_by_tier.loc[tier, 'csat_score']
        print(f"{tier:<10} {res:<12.1%} {csat:<8.2f}")
  
```

`tier1` has a low resolution rate _and_ CSAT score -- customers' questions aren't being answered, and they are unhappy about it! It may be time to reconsider the logic of the first-tier routing. However, your other two tiers have significantly higher resolutions and CSAT scores.


```python

```
