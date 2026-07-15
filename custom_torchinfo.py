import torch
import torch.nn as nn


def _shape(value):
    if isinstance(value, torch.Tensor):
        return list(value.shape)
    if isinstance(value, (list, tuple)) and value:
        return [_shape(item) for item in value]
    return type(value).__name__


def custom_summary(model, input_size):
    """Small local replacement for Codecademy's hidden custom_torchinfo helper."""
    device = next(model.parameters()).device
    x = torch.zeros(*input_size, device=device)
    rows = []
    hooks = []

    def hook(module, _inputs, output):
        params = sum(parameter.numel() for parameter in module.parameters())
        rows.append((module.__class__.__name__, _shape(output), params))

    for module in model.modules():
        if module is not model and not isinstance(module, nn.Sequential):
            hooks.append(module.register_forward_hook(hook))

    training = model.training
    model.eval()
    with torch.inference_mode():
        model(x)

    for handle in hooks:
        handle.remove()
    model.train(training)

    print("Layer (type)         Output Shape         Param #")
    print("=" * 52)
    for name, output_shape, params in rows:
        print(f"{name:<20} {str(output_shape):<20} {params:,}")
    print("=" * 52)
    print(f"Total params: {sum(parameter.numel() for parameter in model.parameters()):,}")
