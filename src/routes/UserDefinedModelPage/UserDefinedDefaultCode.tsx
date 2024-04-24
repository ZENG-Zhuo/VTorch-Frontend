export const defaultCode =
    "# Define your own model or function here\r\nimport torch\r\nfrom torch import Tensor\r\n\r\nclass MyModule(torch.nn.Module):\r\n    def __init__(self):\r\n        super(self)\r\n\r\n    \r\n    def forward(self, x: Tensor)->Tensor:\r\n        return x\r\n\r\ndef add(a: Tensor, b: Tensor)->Tensor:\r\n    return a+b";
