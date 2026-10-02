# Neural Networks and Deep Learning Architecture

## Fundamental Principles

An Artificial Neural Network (ANN) consists of layered nodes: an input layer, one or more hidden layers, and an output layer. Each connection between nodes carries a numeric weight and bias.

### Forward Propagation and Activation Functions
During forward propagation, inputs are multiplied by connection weights, summed with a bias term, and passed through a non-linear activation function:
$$z = W \cdot x + b$$
$$a = \sigma(z)$$

Common activation functions include:
- **ReLU (Rectified Linear Unit)**: $f(x) = \max(0, x)$. Solves vanishing gradients for positive inputs and enables fast convergence.
- **Sigmoid**: $f(x) = \frac{1}{1 + e^{-x}}$. Compresses values between 0 and 1; susceptible to vanishing gradients at extreme values.
- **Softmax**: Normalizes unconstrained logits into a multi-class probability distribution.

### Backpropagation and Gradient Descent
Loss functions quantify prediction discrepancy. Backpropagation computes the partial derivative of the loss function with respect to every parameter using the chain rule of calculus. Parameters are iteratively updated via optimizers such as Adam or SGD:
$$\theta \leftarrow \theta - \eta \nabla_\theta \mathcal{L}$$

### Common Misconceptions
- **Vanishing vs Exploding Gradients**: Vanishing gradients occur when multiplying many small derivatives ($< 1.0$), causing early layers to train exceedingly slowly. Exploding gradients happen when derivatives exceed $1.0$, causing weight updates to destabilize exponentially.
