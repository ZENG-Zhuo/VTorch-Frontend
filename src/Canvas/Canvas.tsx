import { ComponentType, useCallback, useRef, useState } from "react";
import ReactFlow, {
    Background,
    BackgroundVariant,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Controls,
    NodeProps,
    MarkerType,
    Connection,
    Edge,
    Node,
} from "reactflow";
import "reactflow/dist/style.css";

import {
    InputTensor,
    OutputTensor,
    GroundTruthLabel,
    GetClassDict,
    GenerateModuleFunction,
} from "./LayerNode";
import type { FormProps } from "antd";
import {
    FloatButton,
    Modal,
    Button,
    Checkbox,
    Form,
    Input,
    message,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "./Canvas.css";
import { FucModuleToDiv, GenerateFunc } from "./FucNodes";
import { initialNodes, initialEdges } from "./defaultelements";
import { ClassInfo, FuncInfo } from "../common/pythonObjectTypes";
import { connect } from "http2";
import { UDBInfo } from "../common/UDBTypes";

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
let NodesTypes: { [key: string]: ComponentType<NodeProps> } = {
    input: InputTensor,
    output: OutputTensor,
    groundtruth: GroundTruthLabel,
    // BatchNorm2D: BatchNorm2D
};

const backEndUrl = "http://10.89.2.170:8001";
// const backEndUrl = "http://192.168.8.17:8001";

// let id = initialNodes.length;

interface CanvasProp {
    modules: Map<string, ClassInfo> | undefined;
    funcs: [string, FuncInfo[]][];
    graphName: string;
    setGraphName: React.Dispatch<React.SetStateAction<string>>;
    UDBMap: Map<string, UDBInfo>;
    nodes: Node[];
    edges: Edge[];
    maxid: number;
}
// let moduleChanged: boolean = false;
// export function setModuleChanged() {
//     moduleChanged = true;
// }

let classdict = GetClassDict();

function Canvas(props: CanvasProp) {
    const reactFlowWrapper = useRef<HTMLInputElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const load_nodes = props.nodes;
    const load_edges = props.edges;
    const [nodes, setNodes] = useState(load_nodes);
    const [edges, setEdges] = useState(load_edges);

    let id: number = props.maxid;
    const getId = () => `node${++id}`;

    const [messageApi, contextHolder] = message.useMessage();

    // const [NodesTypes, setNodesTypes] = useState(initialNodeTypes);
    const msgKey = "canvas";
    const modules = props.modules;
    const graphName = props.graphName;
    const setGraphName = props.setGraphName;

    if (modules) {
        modules.forEach((classInfo, name) => {
            const moduleFunction = GenerateModuleFunction(classInfo, graphName);
            // let newNodes = { ...NodesTypes };
            // newNodes[name] = moduleFunction;
            if (moduleFunction) NodesTypes[name] = moduleFunction;
            // setNodesTypes(newNodes);
        });
    }

    const funcs = props.funcs;
    if (funcs) {
        funcs.forEach((funcinfo) => {
            if (funcinfo[1].length == 1) {
                const funcModule = GenerateFunc(funcinfo[1][0], graphName);
                if (funcModule) NodesTypes[funcinfo[1][0].name] = funcModule;
            } else {
                funcinfo[1].forEach((func, idx) => {
                    const funcModule = GenerateFunc(
                        funcinfo[1][idx],
                        graphName
                    );
                    // console.log("funcname:", func.name);
                    if (funcModule) NodesTypes[func.name] = funcModule;
                });
            }
        });
    }

    const UDBMap = props.UDBMap;
    if (UDBMap) {
        
        UDBMap.forEach((value,key) => {
            
            value.classes.map((value) => {
                console.log("UBDMAP INFO: ", value);
                const UBDClassModule = GenerateModuleFunction(value, graphName);
                let name = value.name
                let new_name = "UDBclass-"+key+'-'+name
                if (UBDClassModule) NodesTypes[new_name] = UBDClassModule;
            });

            value.functions.map((value) => {
                const UBDFuncModule = GenerateFunc(value, graphName);
                let name = value.name
                let new_name = "UDBfunc-"+key+'-'+name
                // console.log(name)
                if (UBDFuncModule) NodesTypes[new_name] = UBDFuncModule;
            });
        });
    }

    // console.log(reactFlowInstance);

    const onNodesChange = useCallback(
        (changes: any) =>
            setNodes((nds: any): any => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: any) =>
            setEdges((eds: any): any => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        // console.log("drag over here");
        // console.log("event")
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onNodeDragStop = useCallback(
        (event: React.MouseEvent, node: Node) => {
            console.log(node);
            console.log("move in graph: ", graphName);
            fetch(backEndUrl + "/api/changePosition", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    graphName: graphName,
                    id: node.id,
                    position: node.position,
                }),
            }).then((response) => console.log("pos", response.text()));
        },
        [graphName]
    );

    const onDrop = useCallback(
        (event: any) => {
            console.log("drop here");
            event.preventDefault();

            const reactFlowBounds =
                reactFlowWrapper?.current?.getBoundingClientRect();
            const type: string = event.dataTransfer.getData(
                "application/reactflow"
            );
            const submodule: string = event.dataTransfer.getData(
                "application/reactflow2"
            );
            const label: string = event.dataTransfer.getData(
                "application/reactflow3"
            );
            const subModule: string[] = submodule.split(",");
            // check if the dropped element is valid
            if (typeof type === "undefined" || !type) {
                return;
            }
            console.log("drag over:",type)

            const position = reactFlowInstance?.project({
                x: event.clientX - reactFlowBounds!.left,
                y: event.clientY - reactFlowBounds!.top,
            });
            const newNode = {
                id: getId(),
                type: type,
                position,
                // data: { label: `${type} node` },
            };
            console.log("graphName = ", graphName);
            console.log("submodule", submodule);
            console.log("name", newNode.type);

            fetch(backEndUrl + "/api/addBlock", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    graphName: graphName,
                    id: newNode.id,
                    name: type,
                    position: position,
                    submodule: subModule,
                }),
            })
                .then((data) => {
                    console.log(data.text());
                })
                .catch((e) => console.log(e));

            setNodes((nds: any) => nds.concat(newNode));
        },
        [reactFlowInstance, graphName]
    );

    const onConnect = useCallback(
        (connection: Connection) => {
            // console.log(connection)
            const { source, sourceHandle, target, targetHandle } = connection;
            let src_num = source!.slice(4);
            let tag_num = target!.slice(4);

            let source_info = sourceHandle!.split("-");
            let target_info = targetHandle!.split("-");

            console.log(
                "edge info: ",
                source,
                sourceHandle,
                target,
                targetHandle
            );

            let src_node_id = source_info[1];
            let tgt_node_id = target_info[1];
            let src_node_key = Number(source_info[source_info.length - 1]);
            let tgt_node_key = Number(target_info[target_info.length - 1]);

            if (Number.isNaN(src_node_key)) {
                src_node_key = 0;
            }
            if (Number.isNaN(tgt_node_key)) {
                tgt_node_key = 0;
            }

            let edge_id: string;
            let edge_color: string;

            console.log("connect in graph: ", graphName);

            fetch(backEndUrl + "/api/addEdge", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    graphName: graphName,
                    source: sourceHandle,
                    target: targetHandle,
                }),
            })
                .then((data) => {
                    if (data.status === 200) {
                        if (target_info[2] == "fwd") {
                            edge_id = `edge${src_num}-${tag_num}_flow`;
                            edge_color = "#000000";

                            console.log("connect edge of forward");

                            // console.log("classdict: ",classdict[tgt_node_id], src_node_key)
                            const tgt_to_src_id =
                                classdict[tgt_node_id].forwardHandles[
                                    tgt_node_key
                                ].id;
                            console.log("tgt_to_src_id ", tgt_to_src_id);
                            // console.log("src_node_key :", src_node_key)
                            if (tgt_to_src_id) {
                                classdict[src_node_id].targetHandles[
                                    src_node_key
                                ].targets.push(tgt_to_src_id);
                                console.log(classdict[src_node_id]);
                            }

                            const src_to_tgt_id =
                                classdict[src_node_id].targetHandles[
                                    src_node_key
                                ].id;
                            console.log("src_to_tgt_id ", src_to_tgt_id);
                            if (src_to_tgt_id) {
                                classdict[tgt_node_id].forwardHandles[
                                    tgt_node_key
                                ].source.push(src_to_tgt_id);
                            }
                        } else {
                            console.log("connect edge of data");
                            let key_id: string = targetHandle!.substring(
                                targetHandle!.length - 1,
                                targetHandle!.length
                            );
                            edge_id = `edge${src_num}-${tag_num}_data_${key_id}`;
                            edge_color = "#FF0072";

                            if (
                                source &&
                                target &&
                                sourceHandle &&
                                targetHandle
                            ) {
                                classdict[source].targetHandles[
                                    src_node_key
                                ].targets.push(targetHandle);
                                classdict[target].paramsHandles[
                                    tgt_node_key
                                ].source = sourceHandle;
                            }
                        }
                        console.log(sourceHandle);
                        console.log(targetHandle);

                        const newEdge: any = {
                            id: edge_id,
                            source,
                            sourceHandle,
                            target,
                            targetHandle,
                            // type: 'customEdge',
                            style: { strokeWidth: 3, stroke: edge_color },
                            markerEnd: {
                                type: MarkerType.ArrowClosed,
                                color: edge_color,
                            },
                        };
                        setEdges((prevElements: any): any =>
                            addEdge(newEdge, prevElements)
                        );
                    } else {
                        data.text().then((data) => {
                            messageApi.open({
                                key: msgKey,
                                type: "error",
                                content: data,
                                duration: 2,
                            });
                        });
                    }
                })
                .catch((e) => {
                    console.log(e);
                    messageApi.open({
                        key: msgKey,
                        type: "error",
                        content: "network error",
                        duration: 2,
                    });
                });
        },
        [graphName]
    );

    const onEdgesDelete = useCallback(
        (edges: Edge[]) => {
            console.log("edge info: ", edges);
            console.log("edge delete in graph: ", graphName);
            edges.forEach(function (edge) {
                const { source, sourceHandle, target, targetHandle } = edge;

                let source_info = sourceHandle!.split("-");
                let target_info = targetHandle!.split("-");

                let src_node_id = source_info[1];
                let tgt_node_id = target_info[1];
                let src_handle_key = Number(
                    source_info[source_info.length - 1]
                );
                let tgt_handle_key = Number(
                    target_info[target_info.length - 1]
                );
                if (Number.isNaN(src_handle_key)) {
                    src_handle_key = 0;
                }
                if (Number.isNaN(tgt_handle_key)) {
                    tgt_handle_key = 0;
                }

                fetch(backEndUrl + "/api/delEdge", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        graphName: graphName,
                        source: sourceHandle,
                        target: targetHandle,
                    }),
                })
                    .then((data) => {
                        console.log(data.text());
                    })
                    .catch((e) => console.log(e));

                // console.log("sourceHandle: ", source_info);
                // console.log("targetHandle: ", target_info);
                if (target_info[2] == "fwd") {
                    console.log("delete edge of forward");
                    let src_targets =
                        classdict[source].targetHandles[src_handle_key].targets;
                    src_targets.map((item, index) => {
                        if (item == targetHandle) {
                            src_targets.splice(index, 1);
                        }
                    });
                    let tgt_sources =
                        classdict[target].forwardHandles[tgt_handle_key].source;
                    tgt_sources.map((item, index) => {
                        if (item == sourceHandle) {
                            tgt_sources.splice(index, 1);
                        }
                    });
                } else if (target_info[2] == "data") {
                    console.log("delete edge of data");
                    let src_targets =
                        classdict[source].targetHandles[src_handle_key].targets;
                    src_targets.map((item, index) => {
                        if (item == targetHandle) {
                            src_targets.splice(index, 1);
                        }
                    });
                    classdict[target].paramsHandles[tgt_handle_key].source = "";
                }
            });
        },
        [graphName]
    );

    const onNodesDelete = useCallback(
        (nodes: Node[]) => {
            console.log("node info: ", nodes);

            console.log("NODes delete in graph: ", graphName);

            fetch(backEndUrl + "/api/delBlock", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    graphName: graphName,
                    id: nodes[0].id,
                }),
            })
                .then((data) => {
                    console.log(data.text());
                })
                .catch((e) => console.log(e));

            nodes.map((node: Node, idx: number) => {
                console.log(node.id);
                delete classdict[node.id];
            });
        },
        [graphName]
    );

    return (
        <>
            {contextHolder}
            <div className="canvas" ref={reactFlowWrapper}>
                {graphName === "" ? undefined : (
                    <ReactFlow
                        edges={edges}
                        nodes={nodes}
                        onNodesChange={onNodesChange}
                        onNodesDelete={onNodesDelete}
                        onEdgesChange={onEdgesChange}
                        onEdgesDelete={onEdgesDelete}
                        onNodeDragStop={onNodeDragStop}
                        onConnect={onConnect}
                        nodeTypes={NodesTypes}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    >
                        <Controls position="top-right" />
                        {/* <Background variant={BackgroundVariant.Lines} size={1}/> */}
                        <Background
                            id="1"
                            gap={10}
                            color="#f1f1f1"
                            variant={BackgroundVariant.Lines}
                        />

                        <Background
                            id="2"
                            gap={100}
                            color="#ccc"
                            variant={BackgroundVariant.Lines}
                        />
                        <FloatButton href="/homePage" icon={<LeftOutlined />} />
                    </ReactFlow>
                )}
            </div>
        </>
    );
}

export { Canvas };
