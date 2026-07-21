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
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as T
import torchvision.datasets as datasets
from torch.utils.data import DataLoader
```

**CIFAR-10 Testing Set Preprocessing**


```python
data_dir = '/home/ccuser/data'

transform = T.Compose([
    T.Resize(224),
    T.ToTensor(),
    T.Normalize(mean=(0.485, 0.456, 0.406),
                std=(0.229, 0.224, 0.225)),
])

test_dataset  = datasets.CIFAR10(root=data_dir, train=False, download=True, transform=transform)
test_loader  = DataLoader(test_dataset,  batch_size=64, shuffle=False)
```

#### Checkpoint 1/3

Let's load pre-trained weights for a **ResNet18** model (with 11.1M parameters) in this checkpoint.

**A.** Specify the **ResNet18** model architecture from the `torchvision.models` module (aliased as `M`) by using `M.resnet18()`. Since we're loading pre-trained weights, set `weights=None`. Initialize the model to the variable `model_resnet18`. 

**B.** Adapt the final classification layer to output predictions for the 10 classes in the CIFAR-10 dataset using a linear layer. 
- **Note:** **ResNet18** names its last classification layer `fc`, whereas **MobileNet** names it `classification`.

**C.** Save the weights we've pre-trained on the CIFAR-10 training set located in `models/resnet18_cifar10.pt` to the variable `state_dict_resnet18`, and load them into the **ResNet18** model.

**D.** Move the model to the device and set it to evaluation mode.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
import torchvision.models as M

# Move to CPU/GPU device -- DO NOT MODIFY
device = "cuda" if torch.cuda.is_available() else "cpu"

## YOUR SOLUTION HERE ##
# Load ResNet18 and adapt for CIFAR-10 
model_resnet18 = M.resnet18(weights=None)
in_feats = model_resnet18.fc.in_features
model_resnet18.fc = nn.Linear(in_feats, 10)

# Load pre-trained weights fine-tuned on CIFAR-10
state_dict_resnet18 = torch.load(
    "models/resnet18_cifar10.pt",
    map_location=device,
    weights_only=True
)
model_resnet18.load_state_dict(state_dict_resnet18)

# Move to device and set to evaluation mode
model_resnet18 = model_resnet18.to(device)
model_resnet18.eval()
model_resnet18

# Show output
from custom_torchinfo import custom_summary
custom_summary(model_resnet18, input_size=(1, 3, 224, 224))
```

#### Checkpoint 2/3

Create the `predict` function to build our CNN's prediction loop and generate predictions on the testing set images.

**A.** Build the prediction loop as follows:
1. Initialize empty lists for the logits (`all_logits`), predictions (`all_predictions`), and actual labels (`all_labels`).
2. Iterate over the batched data in the dataloader. For each batch:
   - Move them to the device (same as the model).
   - Input through the forward pass to obtain the logits.
   - Convert the logits into probabilities using `softmax()`.
   - Select the predicted class with the highest probability using `argmax()`.
   - Append each output to its respective list (ex., logits to `all_logits`).
3. Join all batched outputs to their respective variables: `y_logits`, `y_pred`, and `y_true`.
4. Return the complete list of outputs in the following order: `y_logits`, `y_pred`, and `y_true`.

**B.** Use the function to generate test predictions from `model_resnet18` from the test dataloader `test_loader`. Save the logits, predicted labels, and true labels to the variables `y_logits_resnet18`, `y_pred_resnet18`, and `y_true`, respectively.

Print the first 10 predicted labels and actual labels.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
def predict(model, dataloader, device="cpu"):
    model.eval()
    all_logits = []
    all_predictions = []
    all_labels = []

    with torch.no_grad():
        for batch_X, batch_y in dataloader:
            batch_X, batch_y = batch_X.to(device), batch_y.to(device)
            # Forward pass
            logits = model(batch_X)

            # Convert logits to predicted labels
            probs = torch.softmax(logits, dim=1)
            preds = probs.argmax(dim=1)

            # Save predictions
            all_logits.append(logits.cpu().numpy())
            all_predictions.append(preds.cpu().numpy())
            all_labels.append(batch_y.cpu().numpy())

    # Join predictions
    y_logits = np.concatenate(all_logits, axis=0)
    y_pred   = np.concatenate(all_predictions, axis=0)
    y_true   = np.concatenate(all_labels, axis=0)

    return y_logits, y_pred, y_true

# Generate test predictions
y_logits_resnet18, y_pred_resnet18, y_true = predict(
    model_resnet18,
    test_loader,
    device=device
)

# Show output
print("First 10 predictions:", y_pred_resnet18[:10])
print("First 10 labels:", y_true[:10])
```

#### Checkpoint 3/3

Evaluate the pre-trained ResNet18 on the testing set images by calculating the overall accuracy and creating a classification report.

**A.** Save the overall accuracy to the variable `test_accuracy_resnet18`.

**B.** Save the classification report to the variable `report_resnet18`.
- Add the parameter `target_names=test_dataset.classes` to display the CIFAR-10 class labels in the classification report.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
from sklearn.metrics import accuracy_score, classification_report

## YOUR SOLUTION HERE ##
test_accuracy_resnet18 = accuracy_score(y_true, y_pred_resnet18)
report_resnet18 = classification_report(
    y_true,
    y_pred_resnet18,
    target_names=test_dataset.classes
)

# Show output
print(f"Accuracy: {test_accuracy_resnet18:.4f}")
print(report_resnet18)
```

#### Summary

The pre-trained ResNet18 model has an overall accuracy of 88.53%, indicating fairly strong performance. 

**Class-Level Performance**
- Best-performing classes: `automobile`, `ship`, `horse`, and `frog` show strong F1 scores above 0.90.
- Moderate-performing classes: `airplane`, `deer`, `bird`, and `dog` achieve solid F1 scores between 0.84 and 0.89.
- Challenging class: `cat` falls behind with lower recall (0.72) and precision (0.83), resulting in the lowest F1 score of 0.77.

#### Optional Checkpoint

Let's compare the performance of our pre-trained ResNet18 with a pre-trained MobileNet (V3) from the narrative. 

MobileNet (V3) is designed for speed with roughly 1.5M parameters, whereas ResNet18 has about 10x more parameters.

Let's evaluate the pre-trained Mobilenet (V3) using pre-trained weights saved in `"models/mobilenet_cifar10.pt"` and compare the following:
- Classification Performance
- Latency
- Memory (Allocation + Peak During Inference)


```python
import torchvision.models as M

model_mobilenet = 
in_feats = 
model_mobilenet.classifier[-1] = 

state_dict = 
model_mobilenet.load_state_dict()
model_mobilenet  =

from custom_torchinfo import custom_summary
custom_summary(model_mobilenet, input_size=(1, 3, 224, 224))

y_logits_mobilenet, y_pred_mobilenet, y_true = 
test_accuracy_mobilenet = 
report_mobilenet = 
```


```python
import time

# Grab the first image in the testing dataset
batch_X, batch_y = next(iter(test_loader))
x1 = batch_X[0].unsqueeze(0).to(device)

def measure_latency(model, x, iters=30):
    """Return average latency (ms) per forward pass."""
    model.eval()
    start = time.perf_counter()
    with torch.inference_mode():
        for _ in range(iters):
            _ = model(x)
            if x.device.type == "cuda":
                torch.cuda.synchronize()
    elapsed = time.perf_counter() - start
    return (elapsed / iters) * 1e3  # ms

def measure_gpu_memory(model, x):
    """Return current and peak GPU memory in MB after one forward."""
    torch.cuda.empty_cache()                 
    torch.cuda.reset_peak_memory_stats()
    
    model.eval()
    with torch.inference_mode():
        y = model(x) # Optional - delete predictions afterwards
        
    torch.cuda.synchronize()
    current = torch.cuda.memory_allocated() / (1024**2)
    peak    = torch.cuda.max_memory_allocated() / (1024**2)
    return current, peak

# Measure latency
latency_mobilenet = 
latency_resnet18 = 

# Measure GPU allocation
memory_mobilenet = 
memory_resnet18 = 

# Show output
print("Latency Comparison")
warmup  = measure_latency(model_mobilenet, x1, iters=30)
print("MobileNetV3-Small:", f"{latency_mobilenet:.4f} ms")
print("ResNet-18:",         f"{latency_resnet18:.4f} ms")
print("====================================================================")

print("Memory Usage Comparison")
print(f"MobileNetV3-Small: [GPU Memory] Current allocated: {memory_mobilenet[0]:.2f} MB | Peak during forward: {memory_mobilenet[1]:.2f} MB")
print(f"ResNet-18: [GPU Memory] Current allocated: {memory_resnet18[0]:.2f} MB | Peak during forward: {memory_resnet18[1]:.2f} MB")
print("====================================================================")

print("Classification Performance Comparison")
print("MobileNetV3-Small Performance:")
print(f"Accuracy: {test_accuracy_mobilenet:.4f}")
print(report_mobilenet)
print("ResNet-18 Performance:")
print(f"Accuracy: {test_accuracy_resnet18:.4f}")
print(report_resnet18)
```

How does the MobileNet (V3) compare to the ResNet18 model in terms of size, latency, memory allocation, and classification performance?
- Why do you think _"Mobile"_ Net has higher latency? This is most likely due to the model being optimized for CPUs and smartphone devices rather than our GPU device. 

#### Clean Up


```python
import gc, torch

model_mobilenet.to("cpu")
model_resnet18.to("cpu")

del model_mobilenet, model_resnet18
gc.collect()

if torch.cuda.is_available():
    torch.cuda.empty_cache()
    torch.cuda.ipc_collect()
    torch.cuda.reset_peak_memory_stats()
    torch.cuda.synchronize()
```


```python

```
