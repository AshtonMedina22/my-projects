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

Import the required libraries and load the chatbot conversation dataset.

* Dataset: bitext/customer-support-llm-chatbot-training-dataset (Modified)
* Original: https://huggingface.co/datasets/bitext/customer-support-llm-chatbot-training-dataset

MODIFICATIONS (Educational):
- Added synthetic PII columns and injected PII into text
- Introduced data quality issues
- Purpose: Simulate realistic data preprocessing challenges


```python
import re
import pandas as pd
import numpy as np
from collections import defaultdict, Counter

# Load the chatbot conversation dataset
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
```

#### Checkpoint 1/3: Detect Jailbreak Attempts in Real Conversations

Some users attempt to trick our chatbot with jailbreak prompts, such as "Ignore your previous instructions" or "Pretend you're not an AI." Our security team needs to identify these attempts to enhance our defenses and understand how individuals attempt to compromise our system.

1. Update the function `detect_jailbreak(text)` that checks if text contains any jailbreak patterns, and if so, returns `True` and the jailbreak pattern found; if no jailbreak pattern is detected, the function should return `False` and `None`
2. Apply this function to the `instruction` column to flag suspicious conversations
3. Count how many conversations contain jailbreak attempts
4. Print the counts for each pattern detected

**Jailbreak patterns to detect:**
- "ignore previous instructions"
- "disregard your programming" 
- "act as if you are"
- "pretend you are not an ai"
- "forget your rules"
- "system prompt"
- "new instructions"

Don't forget to run the cell and save the notebook before selecting `Test Work`!


```python
## YOUR SOLUTION HERE ##

JAILBREAK_PATTERNS = [
    "ignore previous instructions",
    "disregard your programming",
    "act as if you are",
    "pretend you are not an ai",
    "forget your rules",
    "system prompt",
    "new instructions"
]

def detect_jailbreak(text):
    """
    Detect if text contains jailbreak attempt patterns.
    
    Args:
        text (str): Text to check for jailbreak patterns
        
    Returns:
        tuple: (has_jailbreak: bool, matched_pattern: str or None)
    """
    if pd.isna(text):
        return False, None
    
    text_lower = str(text).lower()
    
    for pattern in JAILBREAK_PATTERNS:
        if pattern in text_lower:
            return None, None #update return values
    
    return False, None

# Apply detection to all instructions
df[['has_jailbreak', 'jailbreak_pattern']] = None

# Count jailbreak attempts
jailbreak_count = None
jailbreak_pct = None

print("=== Jailbreak Detection Results ===")
print(f"\nTotal conversations: {len(df):,}")
print(f"Jailbreak attempts detected: {jailbreak_count:,} ({jailbreak_pct:.2f}%)")

# Pattern frequency analysis
if jailbreak_count > 0:
    pattern_counts = df[df['has_jailbreak']]['jailbreak_pattern'].value_counts()
    print(f"\nMost common jailbreak patterns:")
    for pattern, count in pattern_counts.head().items():
        print(f"  • '{pattern}': {count} times")

```

#### Checkpoint 2/3: Identify PII Leakage in Bot Responses

Our chatbot should never include real customer PII (such as emails, phone numbers, and credit card information) in its responses. But due to a bug, the bot occasionally repeats sensitive information. You need to scan all responses to identify where PII is being leaked.

1. Update the functions to detect PII patterns in text:
   - `contains_email(text)` - detects email addresses
   - `contains_phone(text)` - detects phone numbers (format: XXX-XXX-XXXX or similar)
   - `contains_credit_card(text)` - detects credit card patterns (16 digits with optional dashes/spaces)
2. Apply these functions to the `response` column to flag PII leakage
3. Count how many responses contain each type of PII
4. Calculate the PII leakage rate (% of responses with PII)
5. Print examples of responses that leaked PII

**Hint:** Use regular expressions (regex) to match patterns:
```python
import re
EMAIL_PATTERN = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
has_email = bool(re.search(EMAIL_PATTERN, text))
```

Don't forget to run the cell and save the notebook before selecting `Test Work`!


```python
## YOUR SOLUTION HERE ##

# PII detection patterns
EMAIL_PATTERN = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
PHONE_PATTERN = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
CC_PATTERN = r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'

def contains_email(text):
    """Check if text contains an email address."""
    if pd.isna(text):
        return False
    return None

def contains_phone(text):
    """Check if text contains a phone number."""
    if pd.isna(text):
        return False
    return None

def contains_credit_card(text):
    """Check if text contains a credit card number."""
    if pd.isna(text):
        return False
    return None

# Apply PII detection to all responses
df['leaked_email'] = None
df['leaked_phone'] = None
df['leaked_cc'] = None

# Create overall PII leakage flag
df['leaked_pii'] = None

# Count PII leakage
total_responses = None
email_leaks = None
phone_leaks = None
cc_leaks = None
total_leaks =None

print("=== PII Leakage Detection Results ===")
print(f"\nTotal responses analyzed: {total_responses:,}")
print(f"Responses with PII leakage: {total_leaks:,} ({(total_leaks/total_responses)*100:.2f}%)")
print(f"\nBreakdown by PII type:")
print(f"  • Email addresses: {email_leaks:,} ({(email_leaks/total_responses)*100:.2f}%)")
print(f"  • Phone numbers: {phone_leaks:,} ({(phone_leaks/total_responses)*100:.2f}%)")
print(f"  • Credit cards: {cc_leaks:,} ({(cc_leaks/total_responses)*100:.2f}%)")

    
print(f"\n=== Example PII Leakage Cases ===")

leak_example = df[df['leaked_pii']==True].iloc[0]
print(f"\nPII Leak Example:")
print(f"Category: {leak_example['category']}")
print(f"Response: {leak_example['response']}")
         

    

```

#### Checkpoint 3/3: Analyze Abuse Patterns and Cost Impact

We think some users are abusing our chatbot—sending too many requests, attempting jailbreaks, or causing costly errors. We need to identify these users and calculate the financial impact to justify adding rate limits.

1. Identify users with suspicious behavior patterns:
   - High request volume (>50 conversations)
   - Excessive token usage (>300 tokens per conversation on average)
2. Calculate the total cost impact of abusive users vs. normal users

Don't forget to run the cell and save the notebook before selecting `Test Work`!


```python
## YOUR SOLUTION HERE ##

# Analyze user behavior patterns
user_stats = None

# Define abuse criteria
high_volume = None
excessive_tokens = None

# Flag abusive users
user_stats['is_abusive'] = None

# Separate abusive and normal users
abusive_users = None
normal_users = None

print("=== Abuse Pattern Analysis ===")
print(f"\nTotal unique users: {len(user_stats):,}")
print(f"Abusive users identified: {len(abusive_users):,} ({(len(abusive_users)/len(user_stats))*100:.1f}%)")
print(f"Normal users: {len(normal_users):,} ({(len(normal_users)/len(user_stats))*100:.1f}%)")

# Cost impact analysis
print(f"\n=== Cost Impact Analysis ===")

total_cost = user_stats['total_cost'].sum()
abusive_cost = abusive_users['total_cost'].sum()
normal_cost = normal_users['total_cost'].sum()
abusive_cost_pct = (abusive_cost / total_cost) * 100

print(f"\nTotal API costs: ${total_cost:,.2f}")
print(f"Cost from abusive users: ${abusive_cost:,.2f} ({abusive_cost_pct:.1f}% of total)")
print(f"Cost from normal users: ${normal_cost:,.2f} ({(normal_cost/total_cost)*100:.1f}% of total)")

```


```python

```
