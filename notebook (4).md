<details><summary style="display:list-item; font-size:16px; color:blue;">Jupyter Help</summary>
    
Having trouble testing your work? Double-check that you have followed the steps below to write, run, save, and test your code!
    
[Click here for a walkthrough GIF of the steps below](https://static-assets.codecademy.com/Courses/ds-python/jupyter-help.gif)

Run all initial cells to import libraries and datasets. Then follow these steps for each question:
    
1. Add your solution to the cell with `## YOUR SOLUTION HERE ## `.
2. Run the cell by selecting the `Run` button or the `Shift`+`Enter` keys.
3. Save your work by selecting the `Save` button, the `command`+`s` keys (Mac), or `control`+`s` keys (Windows).
4. Select the `Test Work` button at the bottom left to test your work.

![Screenshot of the buttons at the top of a Jupyter Notebook. The Run and Save buttons are highlighted](https://static-assets.codecademy.com/Paths/ds-python/jupyter-buttons.png)

**Setup** Run the following cell to import libraries and helper function.


```python
import torch
import torch.nn as nn
torch.manual_seed(42)
import pandas as pd
import numpy as np
```

In this exercise, we'll look to predict the next closing price of $SPY (which is an ETF tracking the S&P 500 performance) using a time series dataset containing the daily price action (Open, High, Low, Close, Volume) and indicators (SMA, EMA, RSI, MACD, etc.).

Specifically, we'll predict the next day's closing **price change** in the column named `TargetDelta`:
- `Target`: The actual closing price of the next day.
- `TargetDelta`: The difference between today's close and tomorrow's close (what we'll actually predict).


```python
spy_train_df = pd.read_csv("datasets/spy_train.csv", index_col="Date")
spy_train_df.round(2).head()
```

#### Checkpoint 1/3

Let's create a function named `make_lag_df` that creates lagged sequences with a specified window.

**A.** The function should have the following inputs:
- `df`: The original DataFrame of $SPY prices and technical indicators.
- `feature_cols`: List of (unlagged) feature names.
- `window`: Specifies the window size (set default to `14`).

**B.** The function should return `df_seq`, which is the lagged DataFrame where each row is a lagged sequence for each date. Be sure to set the `Date` column as the index for the lagged DataFrame.

**C.** Use the function to create a lagged DataFrame with a **24-day** window and save it to the variable `spy_train_seq_df`.
- Use the following features: `['Open', 'High', 'Low', 'Close', 'Volume', 'sma_10', 'ema_20', 'rsi_14',
       'macd', 'macd_signal', 'macd_hist', 'atr_14', 'bb_upper', 'bb_lower']` and save the list to the variable `features`.
- Save the new lagged columns to the variable `lagged_features`.

**D.** Re-assign the target column `TargetDelta` to the lagged DataFrame.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
import pandas as pd

## YOUR SOLUTION HERE ##
def make_lag_df(df, feature_cols, window=14):
    out = {}
    for col in feature_cols:
        s = df[col]
        for lag in range(window, 0, -1):
            out[f"{col}_t-{lag}"] = s.shift(lag)
    df_seq = pd.DataFrame(out, index=df.index).dropna()
    return df_seq

features = [
    'Open', 'High', 'Low', 'Close', 'Volume', 'sma_10', 'ema_20', 'rsi_14',
    'macd', 'macd_signal', 'macd_hist', 'atr_14', 'bb_upper', 'bb_lower'
]

spy_train_seq_df = make_lag_df(spy_train_df, features, window=24)

lagged_features = list(spy_train_seq_df.columns)

# Show output
print("Number of lagged features:", len(lagged_features))
spy_train_seq_df.head()
```

#### Checkpoint 2/3

Let's re-assign the target column `TargetDelta` from `spy_train_df` to the lagged DataFrame `spy_train_seq_df`. 

Be sure to use the same string name, use only row indices from `spy_train_df` contained in `spy_train_seq_df`, and set `float32` as the datatype.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
## YOUR SOLUTION HERE ##
spy_train_seq_df["TargetDelta"] = spy_train_df.loc[
    spy_train_seq_df.index,
    "TargetDelta"
].astype("float32")

# Show output
spy_train_seq_df["TargetDelta"].head()
```

#### Checkpoint 3/3

Let's create a function named `df_to_loader` that formats and batches our input feature sequences and targets correctly into PyTorch dataloaders.

**A.** The function should have the following inputs:
- `df_seq`: The original DataFrame of $SPY prices and technical indicators.
- `feature_cols`: List of (unlagged) feature names.
- `lagged_feature_cols`: List of (lagged) feature names.
- `target_col`: The target name (set default to `"TargetDelta"`). 
- `window`: Specifies the window size (set default to `14`).
- `batch_size`: The batch size (set default to `128`).
- `shuffle`: Boolean to shuffle the input sequences or not (set default to `False`).

**B.** The function should format the input feature sequences into variables `X` and targets `y`.
- `X` should have shape `(N, T, F)` where `N` is the number of sequences, `T` is the window size, and `F` is the number of unlagged features.
- `y` should have shape `(N, 1)`.

**C.** Use the `TensorDataset` and `DataLoader` utility classes to batch `X` and `y`. The function should return the dataloader.

**D.** Use the function with `spy_train_seq_df` to format and batch the training sequences into dataloaders. Be sure to input the unlagged and lagged features, the target column `"TargetDelta"`, set the window size to `24`, batch size to `128`, and shuffle to `True`. Save the dataloader to the variable `train_loader`.

Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.


```python
import torch
from torch.utils.data import TensorDataset, DataLoader

## YOUR SOLUTION HERE ##
def df_to_loader(df_seq, feature_cols, lagged_feature_cols, target_col="TargetDelta",
                 window=14, batch_size=128, shuffle=False):

    # Create input feature sequences X with shape (N, T, F)
    Xflat = torch.tensor(df_seq[lagged_feature_cols].to_numpy(), dtype=torch.float32)
    N = Xflat.shape[0]
    T = window
    F = len(feature_cols)
    X = Xflat.view(N, T, F)

    # Create targets y with shape (N, 1)
    y = torch.tensor(df_seq[target_col].to_numpy(), dtype=torch.float32).unsqueeze(1)

    # Create TensorDataset and DataLoader
    dataset = TensorDataset(X, y)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=shuffle)
    return loader

train_loader = df_to_loader(
    spy_train_seq_df,
    features,
    lagged_features,
    target_col="TargetDelta",
    window=24,
    batch_size=128,
    shuffle=True
)
```


```python

```
