import React, { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import Canvas, { setModuleChanged } from "./Canvas/Canvas";
import Sider from "./Sider/Sider";
import "./App.css";
import { FileModuleNode, FolderModuleNode } from "./common/pythonFileTypes";
import { ClassInfo } from "./common/pythonObjectTypes";
import { jsonContent } from "./data";
import { updateDatabase } from "./dataCom";
import { Database } from "./common/objectStorage";
import { parse } from "path";

function extractClassBaseModule(
    node: FolderModuleNode | FileModuleNode
): ClassInfo[] {
    let changed: boolean = true;
    let result: ClassInfo[] = [];
    let resultName: string[] = [];
    while (changed) {
        changed = false;
        node.classes.forEach((classInfo) => {
            if (!resultName.includes(classInfo.name)) {
                if (classInfo.bases?.includes("Module")) {
                    result.push(classInfo);
                    resultName.push(classInfo.name);
                    changed = true;
                } else {
                    let cross = false;
                    classInfo.bases?.forEach((baseName) => {
                        if (resultName.includes(baseName)) {
                            cross = true;
                        }
                    });
                    if (cross) {
                        result.push(classInfo);
                        resultName.push(classInfo.name);
                        changed = true;
                    }
                }
            }
        });
    }
    return result;
}

let allClasses = [
    "Module",
    "Identity",
    "Linear",
    "Conv1d",
    "Conv2d",
    "Conv3d",
    "ConvTranspose1d",
    "ConvTranspose2d",
    "ConvTranspose3d",
    "Threshold",
    "ReLU",
    "Hardtanh",
    "ReLU6",
    "Sigmoid",
    "Tanh",
    "Softmax",
    "Softmax2d",
    "LogSoftmax",
    "ELU",
    "SELU",
    "CELU",
    "GLU",
    "GELU",
    "Hardshrink",
    "LeakyReLU",
    "LogSigmoid",
    "Softplus",
    "Softshrink",
    "MultiheadAttention",
    "PReLU",
    "Softsign",
    "Softmin",
    "Tanhshrink",
    "RReLU",
    "L1Loss",
    "NLLLoss",
    "KLDivLoss",
    "MSELoss",
    "BCELoss",
    "BCEWithLogitsLoss",
    "NLLLoss2d",
    "PoissonNLLLoss",
    "CosineEmbeddingLoss",
    "CTCLoss",
    "HingeEmbeddingLoss",
    "MarginRankingLoss",
    "MultiLabelMarginLoss",
    "MultiLabelSoftMarginLoss",
    "MultiMarginLoss",
    "SmoothL1Loss",
    "GaussianNLLLoss",
    "HuberLoss",
    "SoftMarginLoss",
    "CrossEntropyLoss",
    "Container",
    "Sequential",
    "ModuleList",
    "ModuleDict",
    "ParameterList",
    "ParameterDict",
    "AvgPool1d",
    "AvgPool2d",
    "AvgPool3d",
    "MaxPool1d",
    "MaxPool2d",
    "MaxPool3d",
    "MaxUnpool1d",
    "MaxUnpool2d",
    "MaxUnpool3d",
    "FractionalMaxPool2d",
    "FractionalMaxPool3d",
    "LPPool1d",
    "LPPool2d",
    "LPPool3d",
    "LocalResponseNorm",
    "BatchNorm1d",
    "BatchNorm2d",
    "BatchNorm3d",
    "InstanceNorm1d",
    "InstanceNorm2d",
    "InstanceNorm3d",
    "LayerNorm",
    "GroupNorm",
    "SyncBatchNorm",
    "Dropout",
    "Dropout1d",
    "Dropout2d",
    "Dropout3d",
    "AlphaDropout",
    "FeatureAlphaDropout",
    "ReflectionPad1d",
    "ReflectionPad2d",
    "ReflectionPad3d",
    "ReplicationPad2d",
    "ReplicationPad1d",
    "ReplicationPad3d",
    "CrossMapLRN2d",
    "Embedding",
    "EmbeddingBag",
    "RNNBase",
    "RNN",
    "LSTM",
    "GRU",
    "RNNCellBase",
    "RNNCell",
    "LSTMCell",
    "GRUCell",
    "PixelShuffle",
    "PixelUnshuffle",
    "Upsample",
    "UpsamplingNearest2d",
    "UpsamplingBilinear2d",
    "PairwiseDistance",
    "AdaptiveMaxPool1d",
    "AdaptiveMaxPool2d",
    "AdaptiveMaxPool3d",
    "AdaptiveAvgPool1d",
    "AdaptiveAvgPool2d",
    "AdaptiveAvgPool3d",
    "TripletMarginLoss",
    "ZeroPad1d",
    "ZeroPad2d",
    "ZeroPad3d",
    "ConstantPad1d",
    "ConstantPad2d",
    "ConstantPad3d",
    "Bilinear",
    "CosineSimilarity",
    "Unfold",
    "Fold",
    "AdaptiveLogSoftmaxWithLoss",
    "TransformerEncoder",
    "TransformerDecoder",
    "TransformerEncoderLayer",
    "TransformerDecoderLayer",
    "Transformer",
    "LazyLinear",
    "LazyConv1d",
    "LazyConv2d",
    "LazyConv3d",
    "LazyConvTranspose1d",
    "LazyConvTranspose2d",
    "LazyConvTranspose3d",
    "LazyBatchNorm1d",
    "LazyBatchNorm2d",
    "LazyBatchNorm3d",
    "LazyInstanceNorm1d",
    "LazyInstanceNorm2d",
    "LazyInstanceNorm3d",
    "Flatten",
    "Unflatten",
    "Hardsigmoid",
    "Hardswish",
    "SiLU",
    "Mish",
    "TripletMarginWithDistanceLoss",
    "ChannelShuffle",
    "CircularPad1d",
    "CircularPad2d",
    "CircularPad3d",
];
async function readFileContent(fileName: string) {
    try {
        const response = await fetch(fileName);
        const content = await response.text();
        return content;
    } catch (error) {
        console.error("Error reading file:", error);
        return "";
    }
}

export default function App() {
    console.log(jsonContent);
    const [parsedClassesWithInit, setParsedClasses] = useState<
        Map<string, ClassInfo> | undefined
    >(undefined);
    if (!parsedClassesWithInit)
        updateDatabase(() => {
            const packageId = Database.findPackage("torch", "1.0.0");
            if (packageId) {
                const nodeId = Database.getPackage(packageId).getSubModule(
                    ["torch", "nn"],
                    false
                );
                if (nodeId) {
                    const node = Database.getNode(nodeId);
                    console.log("node: ", node);
                    const importedClasses: Map<string, ClassInfo> = new Map();
                    node.importedClasses.forEach((value, alias) => {
                        const classInfo = Database.getNode(value[1]).getClass(
                            value[0]
                        );
                        if (
                            classInfo?.functions.find(
                                (f) => f.name === "__init__"
                            )
                        )
                            importedClasses.set(alias, classInfo);
                    });
                    node.classes.forEach((c) => {
                        if (c.functions.find((f) => f.name === "__init__"))
                            importedClasses.set(c.name, c);
                    });
                    setModuleChanged();
                    setParsedClasses(importedClasses);
                    console.log("imported: ", importedClasses);
                } else throw "torch.nn not found";
            } else throw "torch not found";
        });
    return (
        <div className="container">
            <ReactFlowProvider>
                <div className="main">
                    {parsedClassesWithInit?<Sider modules={parsedClassesWithInit} />:undefined}
                    {parsedClassesWithInit?<Canvas modules={parsedClassesWithInit} />:undefined}
                </div>
            </ReactFlowProvider>
        </div>
    );
}
