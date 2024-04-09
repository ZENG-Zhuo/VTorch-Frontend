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
} from "reactflow";
import "reactflow/dist/style.css";

import {
    InputTensor,
    OutputTensor,
    GetClassDict,
    GenerateModuleFunction,
} from "./LayerNode";
import { FloatButton } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "./Canvas.css";
import { initialNodes, initialEdges } from "./defaultelements";
import { ClassInfo } from "../common/pythonObjectTypes";

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
let nodeTypes: { [key: string]: ComponentType<NodeProps> } = {
    Input: InputTensor,
    Output: OutputTensor,
};

let id = initialNodes.length;
const getId = () => `node${++id}`;

interface CanvasProp {
    modules: Map<string, ClassInfo> | undefined;
}

function Canvas(props: CanvasProp) {
    const reactFlowWrapper = useRef<HTMLInputElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const modules = props.modules;
    if (modules)
        modules.forEach((classInfo, name) => {
            const moduleFunction = GenerateModuleFunction(classInfo);
            nodeTypes[name] = moduleFunction;
        });

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

    const onConnect = useCallback((connection: any): any => {
        // console.log(connection)
        const { source, sourceHandle, target, targetHandle } = connection;
        let src_num: any = source.slice(4);
        let tag_num: any = target.slice(4);

        console.log(
            targetHandle.substring(targetHandle.length - 3, targetHandle.length)
        );

        let edge_id: string;

        if (
            targetHandle.substring(
                targetHandle.length - 3,
                targetHandle.length
            ) == "put"
        ) {
            edge_id = `edge${src_num}-${tag_num}_flow`;
        } else {
            let key_id: string = targetHandle.substring(
                targetHandle.length - 1,
                targetHandle.length
            );
            edge_id = `edge${src_num}-${tag_num}_data_${key_id}`;
        }

        const newEdge: any = {
            id: edge_id,
            source,
            sourceHandle,
            target,
            targetHandle,
            // type: 'customEdge',
            style: { strokeWidth: 3 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
            },
        };
        setEdges((prevElements: any): any => addEdge(newEdge, prevElements));
    }, []);

    const onEdgesDelete = useCallback((edges: any): any => {
        console.log(edges);
    }, []);

    return (
        <div className="canvas" ref={reactFlowWrapper}>
            <ReactFlow
                edges={edges}
                nodes={nodes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onEdgesDelete={onEdgesDelete}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
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
