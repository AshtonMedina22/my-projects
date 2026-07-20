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

Import the required libraries and datasets.

* Dataset: bitext/customer-support-llm-chatbot-training-dataset (Modified)
* Original: https://huggingface.co/datasets/bitext/customer-support-llm-chatbot-training-dataset

MODIFICATIONS (Educational):
- Added synthetic PII columns and injected PII into text
- Introduced data quality issues
- Purpose: Simulate realistic data preprocessing challenges


```python
import pandas as pd
import numpy as np
from scipy import stats

# Load datasets
offline_test = pd.read_csv('offline_evaluation_test.csv')
ab_test = pd.read_csv('ab_test_results.csv')
```

**Example**

You'll work with two datasets:

1. **Offline test set** - 500 conversations with human-labeled correct responses, tested with both Model A (GPT-3.5) and Model B (GPT-4)
2. **A/B test results** - Real customer interactions split between both models

Explore the offline test data:


```python
print("=== Offline Test Dataset ===")
print(f"Total test conversations: {len(offline_test)}")
print(f"\nColumns: {list(offline_test.columns)}")
print(f"\nSample:")
print(offline_test[['conversation_id', 'ground_truth', 'model_a_correct', 'model_b_correct', 'model_a_hallucinated', 'model_b_hallucinated']].head(3))
```

    === Offline Test Dataset ===
    Total test conversations: 500
    
    Columns: ['conversation_id', 'ground_truth', 'model_a_correct', 'model_a_hallucinated', 'model_b_correct', 'model_b_hallucinated']
    
    Sample:
      conversation_id  ground_truth  model_a_correct  model_b_correct  \
    0     conv_009329          True            False             True   
    1     conv_004160         False             True             True   
    2     conv_018500          True            False            False   
    
       model_a_hallucinated  model_b_hallucinated  
    0                 False                 False  
    1                 False                 False  
    2                  True                 False  


#### Checkpoint 1/3: 
You're about to upgrade your AI chatbot from GPT-3.5 to GPT-4. You have 500 conversations where humans already labeled the correct responses. Both GPT-3.5 (Model A) and GPT-4 (Model B) attempted to answer these same questions. Now it's your job to figure out which one actually performs better in the offline evaluation.

1. Calculate the accuracy for Model A (GPT-3.5) - what % of responses were correct?
2. Calculate the accuracy for Model B (GPT-4)
3. Calculate the hallucination rate for both models (how often did they make stuff up?)

Don't forget to run the cell and save the notebook before selecting `Test Work`!


```python
## YOUR SOLUTION HERE ##

# Calculate accuracy for both models
model_a_accuracy = None
model_b_accuracy = None

# Calculate hallucination rates
model_a_hallucination = None
model_b_hallucination = None

# Display results
print("=== Offline Evaluation Results ===")
print(f"\nModel A (GPT-3.5):")
print(f"  Accuracy: {model_a_accuracy:.1%}")
print(f"  Hallucination rate: {model_a_hallucination:.1%}")

print(f"\nModel B (GPT-4):")
print(f"  Accuracy: {model_b_accuracy:.1%}")
print(f"  Hallucination rate: {model_b_hallucination:.1%}")
```

#### Checkpoint 2/3: 
Now that you've calculated the differences in accuracy and hallucination rate, it's time to see if those differences are statistically significant.

1. Run a statistical significance test using `stats.chi2_contingency()` to determine if the accuracy difference is real or just due to chance
   - The input to the Chi-squared test requires a contingency table, a 2×2 array with the counts of outcomes for each model (rows) and result (correct/incorrect columns)
2. Display the p-value and interpret the results

**What's this statistical test about?** Think of it like this: if you flip a coin 10 times and get 6 heads, is that coin unfair, or did you just get lucky? The chi-square test answers: "Is this performance difference big enough that it's probably real and not just random?" If the p-value is less than 0.05, the difference is statistically significant (meaning it's likely real, not just chance).

Don't forget to run the cell and save the notebook before selecting `Test Work`!


```python
## YOUR SOLUTION HERE ##
# Model specifications
# Create contingency table for chi-square test
# Rows: Model A, Model B | Columns: Correct, Incorrect
model_a_correct = None
model_a_incorrect =None
model_b_correct = None
model_b_incorrect = None

contingency_table = [None
]

# Run chi-square test
chi2, p_value, dof, expected = stats.chi2_contingency(None)


print(f"\nStatistical Test:")
print(f"  Chi-square statistic: {chi2:.2f}")
print(f"  P-value: {p_value:.4f}")

if p_value < 0.05:
    print(f"\n The accuracy difference IS statistically significant (p < 0.05)")
    print(f"   Model B is likely genuinely better than Model A")
else:
    print(f"\nThe accuracy difference is NOT statistically significant (p >= 0.05)")
    print(f"   The difference might just be random chance")
```

#### Checkpoint 3/3:
Offline evaluation suggested Model B is better in terms of accuracy, but the difference was _not_ statistically significant. So you ran an A/B test with real users. Now you need to analyze the results to make a final deployment decision.

1. Calculate the resolution rate for both variants (control = Model A, treatment = Model B)
2. Calculate the average costs for both variants
3. Run a Chi-squared test on the resolution rates to check significance
4. Print a comparison of the model metrics

Don't forget to run the cell and save the notebook before selecting `Test Work`!


```python
## YOUR SOLUTION HERE ##

# Split data by variant
control = None
treatment = None

# Calculate resolution rates
control_resolution = None
treatment_resolution = None

# Calculate avg costs 
control_cost = None
treatment_cost = None

# Chi-square test for resolution rates
control_resolved = None
control_unresolved = None
treatment_resolved = None
treatment_unresolved = None

resolution_contingency = [None
]

chi2_resolution, resolution_p_value, dof, expected = stats.chi2_contingency(None)

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
```


```python

```
