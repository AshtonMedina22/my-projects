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
import hashlib
import numpy as np
import pandas as pd
# Load the dataset
df = pd.read_csv('customer_support_raw.csv')
```

**Example**

You'll work with a dataset called `customer_support_raw.csv`, which contains realistic customer support conversations. Explore a sample of the dataset, which includes customer information, like email, name, and phone number, along with the chat support instruction and response, which may also include details like order numbers and phone numbers


```python
row = df.iloc[12]
print(f"Customer info:\n {row[['conversation_id', 'customer_id', 'customer_name', 'email', 'phone', 'customer_type', 'zipcode', 'timestamp',]]}\n")
print(f"Instruction: {row['instruction_raw'][:150]} \n")
print(f"Response: {row['response_raw'][:150]} ...\n")
```

#### Checkpoint 1/4

Your goal is to build a complete data protection pipeline that validates data quality, removes PII, anonymizes customer identities, and applies differential privacy to statistics. As a first step, you will validate the data and remove invalid records.

* Check for and remove records with missing (or blank) timestamps. Update the dictionary `issues` to save the number of records with a missing timestamp using the key `missing_timestamp`.
* Check for and remove records with invalid customer IDs (should start with `cust_`). Update `issues` to save the number of records with an invalid customer ID.
* Check for and remove records with instructions less than three characters long (after removing whitespace). Update `issues` to save the number of records with a near-empty message.
* Print how many records were removed for each reason and the total number of clean records remaining.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
print(f"Starting with {len(df)} conversations")

# Track issues found
issues = {
    'missing_timestamp': 0,
    'invalid_customer_id': 0,
    'near_empty_message': 0
}

# Remove missing timestamps
missing_timestamp = None
issues['missing_timestamp'] =None
df = None

# Remove invalid customer IDs (must start with 'cust_')
invalid_id = None
issues['invalid_customer_id'] = None
df = None

# Remove empty messages
near_empty_message = None
issues['near_empty_message'] = None
df = None

# Print validation report
print("\n=== Validation Report ===")
print(f"Removed {issues['missing_timestamp']} rows with missing timestamps")
print(f"Removed {issues['invalid_customer_id']} rows with invalid customer IDs")
print(f"Removed {issues['near_empty_message']} rows with near empty messages")
print(f"Clean dataset: {len(df)} conversations remaining")
```

#### Checkpoint 2/4
In this checkpoint, you will look specifically for email and phone patterns in the chat instructions or responses. Use the supplied regular expression patterns, and complete the function `remove_pii`, which will replace the email and phone patterns with placeholders, `[EMAIL]` and `[PHONE]`.

* Complete the `remove_pii()` function that replaces emails with `[EMAIL]` and phones with `[PHONE]`. To use the regular expression pattern, use `re.sub(pattern, replacement_text, text)`.
* Apply to the function to both the `instruction` and `response` columns to create _new_ columns, `instruction_cleaned` and `response_cleaned`.
* Print two before/after examples to verify the function worked correctly.


Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
import re
EMAIL_PATTERN = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
PHONE_PATTERN = r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b'

def remove_pii(text):
    if pd.isna(text):
        return text
    text = None#remove email pattern
    text =  None #remove phone pattern pattern
    return text

df['instruction_cleaned'] = None
df['response_cleaned'] =None

print("\n=== Before/After Examples ===")
samples = df[df['instruction_raw'].str.contains(EMAIL_PATTERN, regex=True, na=False)].head(2)
for _, row in samples.iterrows():
    print(f"Before: {row['instruction_raw'][:100]}")
    print(f"After:  {row['instruction_cleaned'][:100]}\n")

```

#### Checkpoint 3/4
In this checkpoint, you will anonymize customer identities by creating a new hashed customer ID and removing identifying columns.

1. Complete the `hash_customer_id()` function to:
      * Return `None` if the `customer_id` is missing
      * Use SHA-256 hashing to convert customer IDs into anonymous codes. Use `hashlib.sha256()`, but make sure to convert the original customer ID to a string and then encode before passing. Once the ID is hashed, apply `.hexdigest()` to get the hexadecimal representation.
      * Return only the first 16 characters of the hash.
2. Create the `customer_id_hashed` using the function above.
3. Drop the PII columns: `customer_id`, `customer_name`, `email`, and `phone`.
4. Show an example of original vs hashed ID to verify the function worked correctly.

Why Hashing Works: A hash function is one-way—you can turn `cust_12345` into `a3f8d9e1b2c4f7a9`, but you can't reverse it. This means:
* The same customer always gets the same hash (you can still track their conversations)
* Different customers get different hashes
* Nobody can figure out the original customer ID from the hash

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
def hash_customer_id(customer_id):
    if pd.isna(customer_id):
        return None
    return None

sample_id = df['customer_id'].iloc[0]
print("=== Anonymization Example ===")
print(f"Original: {sample_id} -> Hashed: {hash_customer_id(sample_id)}")

df['customer_id_hashed'] = None
df = None
print("Dropped: customer_id, customer_name, email, phone")
```

#### Checkpoint 4/4
Last, you will apply differential privacy using random noise and identify low-count groups. When groups are small, aggregate statistics can still reveal individual identities. You will add random noise to the zip code statistics to protect individuals and identify low-count zip codes that are most at risk of exposing individuals. 

1. Count the number of conversations by zipcode and save as `zipcode_counts`
2. Create noise using `np.random.laplace(0,5.0, size)` using the length of `zipcode_counts` as the `size`
3. Create `private_counts` by adding the random noise to `zipcode_counts` and clipping values less than zero and rounding to integers
4. Identify zipcodes with fewer than five conversations as `at_risk` and print the at-risk zip codes.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
zipcode_counts = None
noise = np.random.laplace(0, 5.0, len(zipcode_counts))
private_counts = None

print("\n=== Differential Privacy ===")
print(f"{'Zipcode':<10} {'Original':>10} {'Private':>10}")
for zipcode in zipcode_counts.index[:5]:
    print(f"{zipcode:<10} {zipcode_counts[zipcode]:>10} {private_counts[zipcode]:>10.0f}")

at_risk = None
if len(at_risk) > 0:
    print(f"\n⚠️  Zipcodes with <5 conversations protected: {list(at_risk.index)}")
```


```python

```
