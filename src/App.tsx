import React, { useState } from "react";
import { Edge, MarkerType, Node, ReactFlowProvider } from "reactflow";
import { Canvas } from "./Canvas/Canvas";
import Sider from "./Sider/Sider";
import "./App.css";
import { FileModuleNode, FolderModuleNode } from "./common/pythonFileTypes";
import { ClassInfo, FuncInfo } from "./common/pythonObjectTypes";
import { jsonContent } from "./data";
import { getAllModules, getModules, updateDatabase } from "./communication";
import { Database } from "./common/objectStorage";
import { parse } from "path";
import type { FormProps } from "antd";
import {
    FloatButton,
    Modal,
    Button,
    Checkbox,
    Form,
    Input,
    Select,
} from "antd";
import { UDBInfo } from "./common/UDBTypes";
import { Console } from "console";

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
    const [updatedDatabase, setUpdateDataBase] = useState<boolean>(true);
    const [functions, setFunctions] = useState<[string, FuncInfo[]][]>([]);
    const [UDBMap, setUDBMap] = useState({items: new Map()});
    const [replay, setReplay] = useState(false);

    if (!parsedClassesWithInit && updatedDatabase) {
        setUpdateDataBase(false);
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
    }

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

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [maxLength, setMaxLength] = useState(0);
    const [modulesName, setmodulesName] = useState<string[]>([]);
    const [lock, setLock] = useState<boolean>(true);

    if (modulesName.length === 0) {
        if (lock) {
            setLock(false);
            getAllModules().then((r) => {
                r.json().then((d) => {
                    setmodulesName(d);
                });
            });
        }
    }

    const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
        const name = values.canvasname![0];
        setGraphName(name);
        console.log("Success load value:", name);
        fetch(backEndUrl + "/api/replayGraph", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                graphName: name,
            }),
        }).then((response) =>
            response.json().then((data) => {
                console.log("replay data: ", data);
                data.map((item: any, key: Number) => {
                    if (item.op == "addBlock") {
                        setNodes((prev) => {
                            let nodeid = item.body.id as string;
                            const id = Number(
                                nodeid.substring(4, nodeid.length)
                            );
                            if (id > maxLength) {
                                setMaxLength(id);
                            }

                            return [...prev, item.body];
                        });
                    } else if (item.op == "addEdge") {
                        setEdges((prev) => {
                            let source_info = item.body.source as string;
                            let target_info = item.body.target as string;

                            //node id
                            let source = source_info.split("-")[1];
                            let target = target_info.split("-")[1];

                            //node name
                            let source_name = source_info.split("-")[0];
                            let target_name = target_info.split("-")[0];

                            let source_handle: string;
                            let target_handle: string;
                            if (
                                (source_name == "input" ||
                                    source_name == "GTLabel") &&
                                source_info.endsWith("-")
                            ) {
                                source_handle = source_info.substring(
                                    0,
                                    source_info.length - 1
                                );
                            } else {
                                source_handle = source_info;
                            }
                            if (target_info.endsWith("-")) {
                                target_handle = target_info.substring(
                                    0,
                                    target_info.length - 1
                                );
                            } else {
                                target_handle = target_info;
                            }

                            let edge_color: string;
                            if (source_info.split("-")[2] == "fwd") {
                                edge_color = "#000000";
                            } else {
                                edge_color = "#FF0072";
                            }

                            let edge: Edge = {
                                id: String(key),
                                source: source,
                                target: target,
                                sourceHandle: source_handle,
                                targetHandle: target_handle,
                                style: { strokeWidth: 3, stroke: edge_color },
                                markerEnd: {
                                    type: MarkerType.ArrowClosed,
                                    color: edge_color,
                                },
                            };
                            console.log("replay of edge: ", edge);

                            return [...prev, edge];
                        });
                    }
                    setReplay(true);
                });
                setIsModalOpen(false);
                setReplay(true);
            })
        );
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo
    ) => {
        console.log("Failed:", errorInfo);
    };

    const [UDBlock, setUDBlock] = useState<boolean>(true);
    if (UDBMap.items.size == 0) {
        // if (UDBlock) {
        // setUDBlock(false)
        fetch(backEndUrl + "/api/getUDBs", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) =>
                response.json().then((data) => {
                    console.log("datatxt", data);
                    data.map((item: any) => {
                        console.log("item: ", item);
                        setUDBMap((prev) => {
                            prev.items.set(item[0],
                            UDBInfo.fromJSON(JSON.parse(item[1])));
                            return {items: prev.items};
                        });
                    });
                    console.log("UDBMap :", UDBMap);
                })
            )
            .catch((e) => console.log("data error", e));
        // }
    }

    // console.log("UDBMap: ", UDBMap);
    const filterOption = (
        input: string,
        option?: { label: string; value: string }
    ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

    return (
        <div className="container">
            <Modal
                title="Please input Canvas name"
                open={isModalOpen}
                // onCancel={handleCancel}
                closable={false}
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
                        {/* <Input /> */}
                        <Select
                            showSearch
                            mode="tags"
                            style={{ width: 300 }}
                            placeholder="choose or enter a name"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={
                                modulesName
                                    ? modulesName.map((name) => {
                                          return {
                                              label: name,
                                              value: name,
                                          };
                                      })
                                    : []
                            }
                        />
                    </Form.Item>
                    <br />
                    <br />
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                {/* <h3 > Edited Recently </h3>
                <br/>
                {modulesName.map((value,key) => {
                    return (<div><span>{value}</span>
                            <br/></div>)
                })} */}
            </Modal>

            <ReactFlowProvider>
                <div className="main">
                    {parsedClassesWithInit && UDBMap && replay ? (
                        <Sider
                            modules={parsedClassesWithInit}
                            funcs={functions}
                            graphName={graphName}
                            setGraphName={setGraphName}
                            UDBMap={UDBMap.items}
                        />
                    ) : undefined}
                    {parsedClassesWithInit && UDBMap && replay ? (
                        <Canvas
                            modules={parsedClassesWithInit}
                            funcs={functions}
                            graphName={graphName}
                            setGraphName={setGraphName}
                            UDBMap={UDBMap.items}
                            nodes={nodes}
                            edges={edges}
                            maxid={maxLength}
                        />
                    ) : undefined}
                </div>
            </ReactFlowProvider>
        </div>
    );
}
