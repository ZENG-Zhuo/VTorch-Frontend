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
import { FloatButton } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "./Canvas.css";
import {FucModuleToDiv, GenerateFunc} from  './FucNodes';
import { initialNodes, initialEdges } from "./defaultelements";
import { ClassInfo, FuncInfo } from "../common/pythonObjectTypes";
import { connect } from "http2";

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
let NodesTypes: { [key: string]: ComponentType<NodeProps> } = {
    Input: InputTensor,
    Output: OutputTensor,
    GroundTruth: GroundTruthLabel,
    // BatchNorm2D: BatchNorm2D
};

let id = initialNodes.length;
const getId = () => `node${++id}`;

interface CanvasProp {
    modules: Map<string, ClassInfo> | undefined;
    funcs: [string, FuncInfo[]][];
}
// let moduleChanged: boolean = false;
// export function setModuleChanged() {
//     moduleChanged = true;
// }

let classdict = GetClassDict();

function Canvas(props: CanvasProp) {
    const reactFlowWrapper = useRef<HTMLInputElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    // const [NodesTypes, setNodesTypes] = useState(initialNodeTypes);

    const modules = props.modules;
    if (modules) {
        modules.forEach((classInfo, name) => {
            const moduleFunction = GenerateModuleFunction(classInfo);
            // let newNodes = { ...NodesTypes };
            // newNodes[name] = moduleFunction;
            if (moduleFunction) NodesTypes[name] = moduleFunction;
            // setNodesTypes(newNodes);
        });
    }

    const funcs = props.funcs;
    if (funcs) {
        funcs.forEach((funcinfo) => {
            if (funcinfo[1].length == 1){
                const funcModule = GenerateFunc(funcinfo[1][0])
                if (funcModule) NodesTypes[funcinfo[0]] = funcModule
            } else {
                funcinfo[1].forEach((func,idx) => {
                    const funcModule = GenerateFunc(funcinfo[1][idx])
                    if (funcModule) NodesTypes[funcinfo[0]+'<'+String(idx+1)+'>'] = funcModule
                })
            }
            
        })
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
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: any) => {
            event.preventDefault();

            const reactFlowBounds =
                reactFlowWrapper?.current?.getBoundingClientRect();
            const type = event.dataTransfer.getData("application/reactflow");

            // check if the dropped element is valid
            if (typeof type === "undefined" || !type) {
                return;
            }

            const position = reactFlowInstance?.project({
                x: event.clientX - reactFlowBounds!.left,
                y: event.clientY - reactFlowBounds!.top,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
            };

            setNodes((nds: any) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    const onConnect = useCallback((connection: Connection) => {
        // console.log(connection)
        const { source, sourceHandle, target, targetHandle } = connection;
        let src_num = source!.slice(4);
        let tag_num = target!.slice(4);

        let source_info = sourceHandle!.split("-");
        let target_info = targetHandle!.split("-");

        console.log("edge info: ", source, sourceHandle, target, targetHandle);

        let src_node_id = source_info[1];
        let tgt_node_id = target_info[1];
        let src_node_key = Number(source_info[source_info.length-1]);
        let tgt_node_key = Number(target_info[target_info.length-1]);


        let edge_id: string;
        let edge_color:string;

        if (target_info[2] == "fwd") {
            edge_id = `edge${src_num}-${tag_num}_flow`;
            edge_color = "#000000"

            console.log("connect edge of forward");
            
            // console.log("classdict: ",classdict[tgt_node_id], src_node_key)
            const tgt_to_src_id = classdict[tgt_node_id].forwardHandles[tgt_node_key].id;
            console.log("tgt_to_src_id ",tgt_to_src_id )
            if (tgt_to_src_id) {
                classdict[src_node_id].targetHandles[src_node_key].targets.push(
                    tgt_to_src_id
                );
                console.log(classdict[src_node_id])
            }

            const src_to_tgt_id = classdict[src_node_id].targetHandles[src_node_key].id
            console.log("src_to_tgt_id ",src_to_tgt_id)
            if (src_to_tgt_id){
                classdict[tgt_node_id].forwardHandles[tgt_node_key].source = src_to_tgt_id
            }

        } else {
            console.log("connect edge of data");
            let key_id: string = targetHandle!.substring(
                targetHandle!.length - 1,
                targetHandle!.length
            );
            edge_id = `edge${src_num}-${tag_num}_data_${key_id}`;
            edge_color = "#FF0072"

            if(source && target && sourceHandle && targetHandle){
                classdict[source].targetHandles[src_node_key].targets.push(targetHandle)
                classdict[target].paramsHandles[tgt_node_key].source = sourceHandle
            }
        }
        console.log(sourceHandle);
        console.log(targetHandle)

        const newEdge: any = {
            id: edge_id,
            source,
            sourceHandle,
            target,
            targetHandle,
            // type: 'customEdge',
            style: { strokeWidth: 3,stroke: edge_color },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: edge_color
            },
        };
        setEdges((prevElements: any): any => addEdge(newEdge, prevElements));
    }, []);

    const onEdgesDelete = useCallback((edges: Edge[]) => {
        console.log("edge info: ",edges);
        edges.forEach(
            function(edge){
                const {source, sourceHandle, target, targetHandle} = edge

                let source_info = sourceHandle!.split("-");
                let target_info = targetHandle!.split("-");

                let src_node_id = source_info[1];
                let tgt_node_id = target_info[1];
                let src_handle_key = Number(source_info[source_info.length-1]);
                let tgt_handle_key = Number(target_info[target_info.length-1]);

                // console.log("sourceHandle: ", source_info);
                // console.log("targetHandle: ", target_info);
                if(target_info[2] == 'fwd'){
                    console.log('delete edge of forward')
                    let src_targets = classdict[source].targetHandles[src_handle_key].targets
                    src_targets.map( (item,index) => {
                        if(item == targetHandle){
                            src_targets.splice(index,1)
                        }
                    }
                    )
                    classdict[target].forwardHandles[tgt_handle_key].source = ""
                }else if(target_info[2] == 'data'){
                    console.log('delete edge of data');
                    let src_targets = classdict[source].targetHandles[src_handle_key].targets
                    src_targets.map( (item,index) => {
                        if(item == targetHandle){
                            src_targets.splice(index,1)
                        }
                    }
                    )
                    classdict[target].paramsHandles[tgt_handle_key].source = ""
                }
                
            }
        )
        
    }, []);

    const onNodesDelete = useCallback((nodes: Node[]) => {
        console.log("node info: ", nodes);
        nodes.map((node: Node,idx: number)=>{
            console.log(node.id)
            delete classdict[node.id]
        })
        
    },[])

    return (
        <div className="canvas" ref={reactFlowWrapper}>
            <ReactFlow
                edges={edges}
                nodes={nodes}
                onNodesChange={onNodesChange}
                onNodesDelete={onNodesDelete}
                onEdgesChange={onEdgesChange}
                onEdgesDelete={onEdgesDelete}
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
                <FloatButton href="/" icon={<LeftOutlined />} />
            </ReactFlow>
        </div>
    );
}

export default Canvas;
