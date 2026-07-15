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

NumPy (or Numerical Python) is a Python library that allows us to perform numerical operations on arrays of numbers with Python. NumPy's linear algebra module, `linalg`, enables us to perform operations on matrices. The function `matrix_rank` in this module calculates the rank of a matrix. Run the following cell to get a demonstration of how this works:


```python
import numpy as np
A = np.array([[1, 3, 2],
              [4, 0, 8],
              [5, 7, 10]])
print("Rank of A:") 
print(np.linalg.matrix_rank(A))
```

![Three matrices, A, B and C, are shown with different ranks. All these matrices are 3 by 3, i.e., they have 3 rows and 3 columns each. In matrix A, the numbers in the third column are exactly twice as the first column. A is a rank 2 matrix. In B, the first and third column are both multiples of the middle column. B is rank 1. In C, the third column is exactly what one would get if the first column were subtracted from twice the second column. C has a rank of 2.](https://static-assets.codecademy.com/Courses/finetuning-transformer-models/2a_rank_matrix.svg)

**Checkpoint (1/3): Rank of a matrix**

Calculate the ranks of matrices `B` and `C` below and store them as variables `rank_B` and `rank_C`, respectively. Print them to compare them with the expected values from the diagram above.

**Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.**


```python
B = [[3,1,0],
    [15,5,0],
    [12,4,0]]

C = [[5,3,1],
    [1,5,9],
    [4,3,2]]

### YOUR SOLUTION HERE ###
rank_B = np.linalg.matrix_rank(B)
rank_C = np.linalg.matrix_rank(C)

print(rank_B, rank_C)
```

**Checkpoint (2/3): Matrix decomposition**

We're now going to examine an example of matrix decomposition. Below are three matrices, `W`, `P`, and `Q`, which are all rank 2. 

The NumPy library allows us to multiply matrices using the `@` symbol. For instance, the product of `B` and `C` matrices in the previous checkpoint would be `B@C`. We will check if `P` and `Q` are rank-decomposed matrices of `W`.

- Create a matrix `S` that's the product of `P` and `Q`.
- Create another matrix, `difference_matrix`, that's `W` subtracted from `S`.

Print both to ensure that `S` and `W` are the same matrix.

**Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.**


```python
W = np.array([[ 5,  6, -3,  8,  9],
       [ 0,  0,  0,  0,  0],
       [ 2,  2, -1,  3,  3],
       [-5,  0,  0, -5,  0],
       [ 0,  4, -2,  2,  6]])



P = np.array([[3,1],
              [0,0],
              [1,0],
              [0,5],
              [2,4]])

Q = np.array([[2,2,-1,3,3],
              [-1,0,0,-1,0]])


print("Rank of W:", np.linalg.matrix_rank(W))
print("Rank of P:", np.linalg.matrix_rank(P))
print("Rank of Q:", np.linalg.matrix_rank(Q))

### YOUR SOLUTION HERE ##
S = P @ Q
difference_matrix = S - W

print(S)
print(difference_matrix)
```

**Checkpoint (3/3): Parameter reduction** 

Suppose the `W` matrix in the previous checkpoint was the weight matrix in a LLM. (This is a slightly ridiculous assumption given that the typical LLM has huge weight matrices with dimensions in the order of millions or even billions - but let's go along with this for a minute! :))

Recall that the number of training parameters of the neural network is the same as the number of elements in the weight matrix. To calculate this, let's print the shapes of the weight matrix `W` and the decomposed matrices `P` and `Q`. 


```python
print (W.shape, P.shape, Q.shape)
```

The number of parameters in W would be:

$$W_{\text{params}} = 5*5 = 25$$

The number of parameters after decomposition would be the sum of the number of parameters in `P` and `Q`. Calculate this and store it as the variable `total_params_after_lora`.

**Don't forget to run the cell and save the notebook before selecting `Test Work`! Open the `Jupyter Help` toggle at the top of the notebook for more details.**


```python
### YOUR SOLUTION HERE ###
total_params_after_lora = P.size + Q.size

print(total_params_after_lora)
```

**Scaling this calculation for LLMs!**

It might seem like rank decomposition didn't make much of a difference in this case, but let's look at what happens when these numbers get as big as they are in your average LLM. Consider a LLM with 256 million parameters. (For comparison, BERT has ~ 340 million parameters.)

The weight matrix has a shape:

$$W_{\text{shape}} = (16000 , 16000)$$

Suppose the rank of this matrix was 300 and `W` was decomposed into two rank-300 matrices, `P` and `Q`, similar to the math we did above. 

**Can you estimate the number of parameters to finetune _after the decomposition_?**

<details><summary style="display:list-item; font-size:16px; color:blue;">Click here for the answer!</summary>

The shapes of `P` and `Q` would be:
$$P_{\text{shape}} = (16000 , 300)$$
$$Q_{\text{shape}} = (300 , 16000)$$

So, the total number of parameters after decomposition would be:
$$ 16000*300 + 300*16000 = 9600000 = 9.6 \text{ million!}  $$
 
9.6 million is quite a bit smaller than 256 million! 
