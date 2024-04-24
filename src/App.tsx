import React, { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { Canvas } from "./Canvas/Canvas";
import Sider from "./Sider/Sider";
import "./App.css";
import { FileModuleNode, FolderModuleNode } from "./common/pythonFileTypes";
import { ClassInfo, FuncInfo } from "./common/pythonObjectTypes";
import { jsonContent } from "./data";
import { updateDatabase } from "./communication";
import { Database } from "./common/objectStorage";
import { parse } from "path";
import type { FormProps } from "antd";
import { FloatButton, Modal, Button, Checkbox, Form, Input } from "antd";
import { UDBInfo } from "./common/UDBTypes";

const backEndUrl = "http://10.89.2.170:8001";
// const backEndUrl = "http://192.168.8.17:8001";

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
    const [UDBMap, setUDBMap] = useState<Map<string, UDBInfo>>(new Map());

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
                    setFunctions(
                        torchFunctions.filter((f) => !f[0].startsWith("_"))
                    );
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
                            classInfo.getFunctions("__init__").length > 0
                        )
                            importedClasses.set(alias, classInfo);
                    });
                    node.classes.forEach((classInfo) => {
                        if (
                            classInfo &&
                            modulesAll.includes(classInfo.name) &&
                            classInfo.getFunctions("__init__").length > 0
                        )
                            importedClasses.set(classInfo.name, classInfo);
                    });

                    // console.log("importedClasses: ",importedClasses)

                    setParsedClasses(importedClasses);
                    // console.log("imported: ", importedClasses);
                } else throw "torch.nn not found";
            } else throw "torch not found";
        });

    const [isModalOpen, setIsModalOpen] = useState(true);
    const [graphName, setGraphName] = useState("");

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    type FieldType = {
        canvasname?: string;
    };

    const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
        const name = values.canvasname!;
        setGraphName(name);
        console.log("Success load value:", name);
        fetch(backEndUrl + "/api/createGraph", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                graphName: name,
            }),
        }).then((data) => {
            console.log(data.text());
        });

        setIsModalOpen(false);
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo
    ) => {
        console.log("Failed:", errorInfo);
    };

    if (UDBMap.size == 0){
        fetch(backEndUrl + "/api/getUDBs", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) =>
                response.json().then((data) => {
                    // console.log("datatxt", data);
                    data.map((item: any) => {
                        setUDBMap((prev) => {
                        const newUDB = structuredClone(prev);
                        newUDB.set(
                            item[0],
                            UDBInfo.fromJSON(JSON.parse(item[1])),
                        );
                        return newUDB;
                    });
                        // let UDBinfo: UDBInfo = new UDBInfo(item[1].data)

                        // UDBinfo.classes = item[1].classes
                        // UDBinfo.functions = item[1].functions

                        // UDBMap.set(item[0], UDBinfo)
                    });
                })
            )
            .catch((e) => console.log("data error", e));
    }

    // console.log("UDBMap: ", UDBMap);

    return (
        <div className="container">
            <Modal
                title="Please input Canvas name"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={(_, { OkBtn, CancelBtn }) => <></>}
            >
                <br />
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="CanvasName"
                        name="canvasname"
                        rules={[
                            {
                                required: true,
                                message: "Please input your CanvaName!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <br />

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <ReactFlowProvider>
                <div className="main">
                    {parsedClassesWithInit && UDBMap ? (
                        <Sider
                            modules={parsedClassesWithInit}
                            funcs={functions}
                            graphName={graphName}
                            setGraphName={setGraphName}
                            UDBMap={UDBMap}
                        />
                    ) : undefined}
                    {parsedClassesWithInit && UDBMap ? (
                        <Canvas
                            modules={parsedClassesWithInit}
                            funcs={functions}
                            graphName={graphName}
                            setGraphName={setGraphName}
                            UDBMap={UDBMap}
                        />
                    ) : undefined}
                </div>
            </ReactFlowProvider>
        </div>
    );
}
