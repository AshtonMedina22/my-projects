### Visualizing Convolutional Neural Networks (Slideshow)

Run the next cell and examine the images illustrating key operations in convolutional neural networks as explained in the narrative:

Convolutional Layers: 
1. Apply a **filter** (or kernel), a small grid containing learnable weights, that slides over the image.
2. A **convolution** is performed by computing a weighted sum of the pixel values and filter weights at every location. This outputs a feature map capturing the filter's activations across different regions of the image.
3. The filter slides to the next location based on the **stride** (step size) and performs the next convolution, and the result is added to the output feature map.
4. The filter continually shifts until the feature map contains activations for the entire image.
5. Multiple filters can be applied to create multiple feature maps, with each filter learning to detect different patterns (edges, textures, shapes, etc.).


```python
from IPython.display import IFrame
IFrame(src="https://static-assets.codecademy.com/Courses/image_classification/stride/index.html", width="100%", height="750")
```

Pooling Layers (downsampling):
- A small window slides across the feature map and selects the most representative value that retains the most information.
- For example, max pooling selects the largest value in the feature map. 


```python
IFrame(src="https://static-assets.codecademy.com/Courses/image_classification/pooling/index.html", width="100%", height="750")
```

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
import torch.nn as nn
import torch.nn.functional as F
```

#### Checkpoint 1/3

Let's create a transformation pipeline that processes the CIFAR-10 images using `transforms.Compose()` with the following:
- Resizing the images to 224x224 pixels.
- Convert the images into PyTorch tensors scaled between 0 and 1.
- Normalize each RGB color channel with the mean values `(0.485, 0.456, 0.406)` and standard deviation values `(0.229, 0.224, 0.225)`.

Create a transformation to resize an image to 64x64 pixels.
Use the transform on the sample image, image.
Visualize the results by plotting the original and resized image.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
import torchvision.transforms as T

## YOUR SOLUTION HERE ##
transform = T.Compose([
    T.Resize(224),
    T.ToTensor(),
    T.Normalize(
        mean=(0.485, 0.456, 0.406),
        std=(0.229, 0.224, 0.225)
    ),
])

# Show output
print(transform)
```

#### Checkpoint 2/3

Next, load the CIFAR-10 training and testing sets while applying the transformation pipeline to images in each:

- Load/save the dataset within the `data_dir` directory.
- Set `train` to `True` for the training set (`False` for the testing set).
- Use `transforms=` to apply the `transform` pipeline to each image.
- Set `download` to `True`.

Save the training set to the variable `train_dataset` and the testing set to the variable `test_dataset`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
import torchvision.datasets as datasets
data_dir = '/home/ccuser/data'

## YOUR SOLUTION HERE ##
train_dataset = datasets.CIFAR10(
    root=data_dir,
    train=True,
    transform=transform,
    download=True
)
test_dataset  = datasets.CIFAR10(
    root=data_dir,
    train=False,
    transform=transform,
    download=True
)

# Show output
print("CIFAR-10 Training Set: \n", train_dataset)
print("CIFAR-10 Testing Set: \n", test_dataset)
```

#### Checkpoint 3/3

Lastly, create dataloaders for the training and testing sets using the `DataLoader` utility class to load the images in batches:

For the training set:
- Load `32` image per batch.
- Shuffle the images.
- Save the dataloader to the variable `train_loader`.

For the testing set:
- Load `64` images per batch for the **testing set**.
- Do not shuffle the images.
- Save the dataloader to the variable `test_loader`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.ook for more det


```python
from torch.utils.data import DataLoader

## YOUR SOLUTION HERE ##
train_loader = DataLoader(
    train_dataset,
    batch_size=32,
    shuffle=True
)
test_loader  = DataLoader(
    test_dataset,
    batch_size=64,
    shuffle=False
)

# Show output
first_batch = next(iter(test_loader))
images, labels = first_batch
print("Batch shape:", images.shape)
print("Testing labels:", labels)
```


```python

```
