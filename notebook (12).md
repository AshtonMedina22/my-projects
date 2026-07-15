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

The most basic object in the Hugging Face Transformers library is the pipeline() function. Run the Setup cell where we’ve already imported the pipeline object and setup a sentiment classifier pipeline.


```python
## Importing pipeline from transformers package
from transformers import pipeline

## Setting up a sentiment analysis classifier
classifier = pipeline(task = "sentiment-analysis", 
                     model = "distilbert-base-uncased-finetuned-sst-2-english")
```

**Checkpoint 1/2: Loading `pipeline`**

Uncomment the line pertaining to printing the classifier object and run it to examine the output.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##

print(classifier)
```

**Checkpoint 2/2: Performing Sentiment Analysis**

We’ve presented some sample text to be classified using this pipeline object. Uncomment the relevant lines and press run to view the results of the sentiment analysis!

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## Some sample text
sample_text =  ["I've been waiting to learn about transformers my whole life.",
               "I hate this so much!"]

## YOUR SOLUTION HERE ##

print(classifier(sample_text))
```

<details><summary style="display:list-item; font-size:16px; color:blue;"> Notice anything interesting? </summary>
    
Do the sentiment labels and score make sense?


```python

```
