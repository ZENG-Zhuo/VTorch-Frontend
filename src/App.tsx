import React, { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import Canvas from "./Canvas/Canvas";
import Sider from "./Sider/Sider";
import "./App.css";
import { FileModuleNode, FolderModuleNode } from "./common/pythonFileTypes";
import { ClassInfo, FuncInfo } from "./common/pythonObjectTypes";
import { jsonContent } from "./data";
import { updateDatabase } from "./communication";
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
    const [parsedClassesWithInit, setParsedClasses] = useState<
        Map<string, ClassInfo> | undefined
    >(undefined);
    const [functions, setFunctions] = useState<[string, FuncInfo[]][]>([]);
    if (!parsedClassesWithInit)
        updateDatabase(() => {
            const packageId = Database.findPackage("torch", "1.0.0");
            if (packageId) {
                const nodeId = Database.getPackage(packageId).getSubModule(
                    ["torch", "nn"],
                    false
                );
                const torchId = Database.getPackage(packageId).getSubModule(
                    ["torch"],
                    false
                );
                if (torchId) {
                    const torch = Database.getNode(torchId);
                    const torchFunctions = torch.getFunctions();
                    setFunctions(torchFunctions.filter((f) => !f[0].startsWith("_")));
                    console.log("functions detail1: ", functions);
                } else throw "torch not found";
                if (nodeId) {
                    const node = Database.getNode(nodeId);
                    const modulesNodeId = node.getSubModule(
                        ["nn", "modules"],
                        false
                    );
                    if (!modulesNodeId) {
                        throw "torch.nn.modules not found";
                    }
                    const modulesAll = Database.getNode(modulesNodeId).__all__;
                    if (!modulesAll) {
                        throw "torch.nn.modules has not yet initialized";
                    }
                    console.log("node: ", node);
                    const importedClasses: Map<string, ClassInfo> = new Map();
                    node.importedClasses.forEach((value, alias) => {
                        const classInfo = Database.getNode(value[1]).getClass(
                            value[0]
                        );
                        if (
                            classInfo &&
                            modulesAll.includes(classInfo.name) &&
                            classInfo.functions.find(
                                (f) => f.name === "__init__"
                            )
                        )
                            importedClasses.set(alias, classInfo);
                    });
                    node.classes.forEach((classInfo) => {
                        if (
                            classInfo &&
                            modulesAll.includes(classInfo.name) &&
                            classInfo.functions.find(
                                (f) => f.name === "__init__"
                            )
                        )
                            importedClasses.set(classInfo.name, classInfo);
                    });
                    setParsedClasses(importedClasses);
                    console.log("imported: ", importedClasses);
                } else throw "torch.nn not found";
            } else throw "torch not found";
        });

    console.log("functions detail2: ", functions);
    return (
        <div className="container">
            <ReactFlowProvider>
                <div className="main">
                    {parsedClassesWithInit ? (
                        <Sider
                            modules={parsedClassesWithInit}
                            funcs={functions}
                        />
                    ) : undefined}
                    {parsedClassesWithInit ? (
                        <Canvas
                            modules={parsedClassesWithInit}
                            funcs={functions}
                        />
                    ) : undefined}
                </div>
            </ReactFlowProvider>
        </div>
    );
}
