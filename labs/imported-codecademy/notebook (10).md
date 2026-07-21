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
Run the following cell to import libraries and helper function.


```python
import torch
from PIL import Image
```

#### Checkpoint 1/3

Load a faster, CLIP variant that uses 32x32 patches from Hugging Face under the name `"openai/clip-vit-base-patch32"`. 

Here's a table summarizing the differences between the **patch 16** and **patch 32** versions.

| Model                                                   | Patch Size | Layers | Hidden Size | Parameters (approx.) | Relative Size | Summary                                                                                                                                                                                                              |
| ------------------------------------------------------- | ---------- | ------ | ----------- | -------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CLIP ViT-B/32** <br> `"openai/clip-vit-base-patch32"` | 32×32      | 12     | 768         | ~151M                | 100%          | Uses large 32×32 patches, reducing the number of tokens the Vision Transformer must process. Faster and lower computational cost, but slightly lower accuracy.           |
| **CLIP ViT-B/16** <br> `"openai/clip-vit-base-patch16"` | 16×16      | 12     | 768         | ~151M                | 100%          | Uses smaller 16×16 patches, which increases spatial resolution and improves visual detail recognition. More computationally expensive and slower, but higher accuracy. |

- Note: The number of parameters is approximately equal. The key difference is the number of tokens each model must process, which depends directly on the patch size. Smaller patch sizes generate more tokens to be processed to compute self-attention. For example, processing a 224x224 image with a 16x16 patch generates `(224 / 16)^2 = 14^2 = 196 tokens`, while a 32x32 patch generates `(224 / 32)^2 = 7^2 = 49 tokens`.

**A**. Save the model name string to the variable `clip_model_name`.

**B**. Load the matching architecture and pretrained weights using `CLIPModel` to the variable `clip_model`.

**C**. Load the matching processor using `CLIPProcessor` to the variable `clip_processor`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
from transformers import CLIPProcessor, CLIPModel

## YOUR SOLUTION HERE ##
clip_model_name = "openai/clip-vit-base-patch32"
clip_model = CLIPModel.from_pretrained(clip_model_name)
clip_processor  = CLIPProcessor.from_pretrained(clip_model_name)
```

#### Checkpoint 2/3

Create a function named `zero_shot_classification` that performs zero-shot classification with the pretrained CLIP model in **inference mode**.

**A.** The model should take in **four parameters**:
- `img_url`: filename of the image (e.g., `"images/example.jpg"`).
- `text_descriptions`: list of text descriptions.
- `model`: the CLIP model.
- `processor`: the CLIP model's processor.

**B.** Wrap the model call in `torch.inference_mode()`, use the processor to process the image and text descriptions, pass the processed inputs, and extract the raw outputs, similarity scores, and convert the scores to probabilities.

**C.** The function should return the **similarity scores** and **probabilities**. 

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
def zero_shot_classification(img_url, text_descriptions, model, processor):
    with torch.inference_mode():
        inputs = processor(
            text=text_descriptions,
            images=Image.open(img_url),
            return_tensors="pt",
            padding=True
        )
        
        outputs = model(**inputs)
        scores = outputs.logits_per_image[0]
        probs = scores.softmax(-1)
        return scores, probs
```

#### Checkpoint 3/3

Apply the zero-shot classification function on the following image of a **red traffic light** saved in `images/image_1.jpg`.

| image_1.jpg |
|-------|
|<img src="images/image_1.jpg"/>|

**A.** Save the scores to the variable `image_1_scores` and probabilities to `image_1_probs`.

**B.** We've provided a `show_clip_results` function (already implemented for you) to format and print the results. Call the function on the scores and probabilities for the first image.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.






```python
img_url = "images/image_1.jpg"

text_descriptions = [
    "Red traffic light",
    "Green traffic light",
    "Yellow traffic light",
    "Yellow schoolbus",
    "Traffic workers"
]

## YOUR SOLUTION HERE ##
image_1_scores, image_1_probs = zero_shot_classification(
    img_url,
    text_descriptions,
    clip_model,
    clip_processor
)

# Show output - similarity and probabilities
def show_clip_results(img_url, text_descriptions, scores, probs):
    """
    Print similarity scores and probabilities for CLIP zero-shot results.
    """
    print(f"\nSimilarity Scores and Probabilities for '{img_url}':")
    print("-" * 80)

    # Find index of highest probability
    best_idx = int(probs.argmax())
    best_label = text_descriptions[best_idx]

    # Loop over each description, score, and probability
    for desc, s, p in zip(text_descriptions, scores, probs):
        print(f"{desc:<55}  score={float(s):7.3f}   prob={float(p):.4f}")

    print("-" * 80)
    print(f"Top Prediction → '{best_label}' (prob={float(probs[best_idx]):.4f})")
    print()
    
show_clip_results(img_url, text_descriptions, image_1_scores, image_1_probs)
```

**Optional Checkpoint** 

Perform zero-shot classification on the rest of the traffic images and see how the pretrained CLIP performs on classifying traffic objects.

| image_1.jpg | image_2.jpg |
|-------|----------------|
|<img src="images/image_1.jpg"/>| <img src="images/image_2.jpg"/>| 

| image_3.jpg | image_4.jpg | image_5.jpg |
|-------------|------------|------------|
|<img src="images/image_3.jpg"/>| <img src="images/image_4.jpg"/>| <img src="images/image_5.jpg"/>| 



```python
image_paths = [
    "images/image_1.jpg",
    "images/image_2.jpg",
    "images/image_3.jpg",
    "images/image_4.jpg",
    "images/image_5.jpg",]

text_descriptions = [
    "Red traffic light",
    "Green traffic light",
    "Yellow traffic light",
    "Yellow schoolbus",
    "Traffic workers"]

for img_url in image_paths:
    scores, probs = zero_shot_classification(
        img_url,
        text_descriptions,
        clip_model,
        clip_processor)
    
    show_clip_results(img_url, text_descriptions, scores, probs)
```

<details><summary style="display:list-item; font-size:16px; color:blue;">Conclusion: How Accurate Was the Pretrained CLIP? </summary>
    
<br>

| Image | Top Prediction | Probability | Conclusion |
|-------|----------------|-------------|------------|
| <img src="images/image_1.jpg" width="450"/> | <span style="font-size:12px">Red traffic light</span> | <span style="font-size:12px">0.5142</span> | <span style="font-size:12px">CLIP correctly matched the text description with decent confidence.</span> |
| <img src="images/image_2.jpg" width="450"/> | <span style="font-size:12px">Green traffic light</span> | <span style="font-size:12px">0.4097</span> | <span style="font-size:12px">CLIP correctly matched the text description.</span> |
| <img src="images/image_3.jpg" width="450"/> | <span style="font-size:12px">Green traffic light</span> | <span style="font-size:12px">0.3964</span> | <span style="font-size:12px">CLIP <b>did not match</b> the correct description. The probability difference between the green and yellow lights is fairly small (yellow = 0.2942). Modifying the image—such as cropping or centering the traffic light—may improve accuracy.</span> |
| <img src="images/image_4.jpg" width="450"/> | <span style="font-size:12px">Yellow schoolbus</span> | <span style="font-size:12px">0.9998</span> | <span style="font-size:12px">CLIP correctly matched the text description with extremely high confidence.</span> |
| <img src="images/image_5.jpg" width="450"/> | <span style="font-size:12px">Traffic workers</span> | <span style="font-size:12px">0.9926</span> | <span style="font-size:12px">CLIP correctly matched the text description with very high confidence.</span> |

</details>


```python

```
