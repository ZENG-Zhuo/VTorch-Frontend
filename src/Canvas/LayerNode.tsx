import { ChangeEvent, Children, ComponentType, useCallback } from "react";
import { Connection, Handle, NodeProps, Position, useNodeId } from "reactflow";
import { ClassInfo, TypeInfo } from "../common/pythonObjectTypes";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import { NodeId } from "../common/pythonFileTypes";
import { connect } from "http2";

class Param {
    name: string;
    initial_value: string = "";
    value: string = "";
    constructor(name: string) {
        this.name = name;
    }
}

class Module {
    paramsHandle: ParamHandle[];
    sourcesHandle: SourceHandle[];
    targetsHandle: TargetHandle[];
    name: string;

    constructor(
        paramsHandle: ParamHandle[],
        sourcesHandle: SourceHandle[],
        targetsHandle: TargetHandle[],
        moduleName: string
    ) {
        this.paramsHandle = paramsHandle;
        this.sourcesHandle = sourcesHandle;
        this.targetsHandle = targetsHandle;
        this.name = moduleName;
    }
}

type ParamType = "Tensor" | "Param";

class ParamHandle {
    source: string | null = "";
    type: ParamType;
    id: string | undefined;
    param: Param;
    optional: boolean;
    constructor(type: ParamType, param: Param, optional: boolean) {
        this.type = type;
        this.param = param;
        this.optional = optional;
    }
}

// input handle, one source can only acceplt one line input
export class SourceHandle {
    //  handle id which connect
    source: string = "";
    // self id
    id: string | undefined;
    // pre-defined, initial_value
    value: string | undefined;
    //  forward parameter name
    name: string | undefined;
    type: ParamType;
    optional: boolean;
    constructor(
        type: ParamType,
        name: string | undefined,
        optional: boolean,
        value: string | undefined
    ) {
        this.type = type;
        this.name = name;
        this.optional = optional;
        this.value = value;
    }
}

// output handle, one target handle can accept multiple lines
export class TargetHandle {
    // handle target id that is connected
    targets: string[] = [];
    // target handle id itself
    id: string | undefined;
    // target type
    type: string;
    constructor(type: string) {
        this.type = type;
    }
}

export class ClassInstance {
    name: string;
    // id: string;
    paramsHandles: ParamHandle[] = [];
    instanceNodeId: string;
    forwardHandles: SourceHandle[] = [];
    targetHandles: TargetHandle[] = [];
    constructor(
        name: string,
        instanceNodeId: string
        // id: string
        // paramsHandles: ParamHandle[],
        // forwardHandles: SourceHandle[],
        // targetHandles: TargetHandle[]
    ) {
        this.name = name;
        // this.id = id
        this.instanceNodeId = instanceNodeId;
        // this.paramsHandles = paramsHandles;
        // this.forwardHandles = forwardHandles;
        // this.targetHandles = targetHandles;
    }
}

let classdict: { [key: string]: ClassInstance } = {};

function GetClassDict() {
    return classdict;
}

function InputTensor() {
    let nodeid = useNodeId();
    let node_name = "";
    if (nodeid == null) {
        nodeid = "node0";
        node_name = "input-" + nodeid;
    } else if (!(nodeid in classdict)) {
        node_name = "input-" + nodeid;
        let classInstance = new ClassInstance(node_name, nodeid);
        classdict[nodeid] = classInstance;
        let targethandle = new TargetHandle("Tensor");
        targethandle.id = "input-" + nodeid + "-fwd-output-0";
        classdict[nodeid].targetHandles.push(targethandle);
        classdict[nodeid].targetHandles[0].id = "input-" + nodeid + "-fwd-output-0";
    }

    return (
        <div className="const-node">
            <span className="Input Tensor">Input Tensor</span>
            {/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
            <Handle
                className="handle"
                type="source"
                position={Position.Right}
                style={{ background: "#ff0" }}
                id={"input-" + nodeid + "-fwd-output-0"}
                isConnectable={true}
                // onConnect={onConnect}
            />
        </div>
    );
}


function GroundTruthLabel() {
    let nodeid = useNodeId();
    let node_name = "";
    if (nodeid == null) {
        nodeid = "node0";
        node_name = "GTLabel-" + nodeid;
    } else if (!(nodeid in classdict)) {
        node_name = "GTLabel-" + nodeid;
        let classInstance = new ClassInstance(node_name, nodeid);
        classdict[nodeid] = classInstance;
        let targethandle = new TargetHandle("Tensor");
        targethandle.id = "GTLabel-" + nodeid + "-fwd-output-0";
        classdict[nodeid].targetHandles.push(targethandle);
        classdict[nodeid].targetHandles[0].id = "GTLabel-" + nodeid + "-fwd-output-0";
    }

    return (
        <div className="const-node">
            <span className="Input Tensor">Ground Truth</span>
            {/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
            <Handle 
                className="handle"
                type="source"
                position={Position.Right}
                style={{ background: "#ff0" }}
                id={"GTLabel-" + nodeid + "-fwd-output-0"}
                isConnectable={true}
                // onConnect={onConnect}
            />
        </div>
    );
}



function OutputTensor() {
    let nodeid = useNodeId();
    let node_name = "output-" + nodeid;
    if (nodeid == null) {
        nodeid = "node0";
        node_name = "output-" + nodeid;
    } else if (!(nodeid in classdict)) {
        node_name = "output-" + nodeid;
        let classInstance = new ClassInstance(node_name, nodeid);
        let forward_handle = new SourceHandle("Tensor",node_name,true,"");
        forward_handle.id = node_name + "-fwd-input-0"
        classInstance.forwardHandles.push(forward_handle);
        classdict[nodeid] = classInstance;
    }

    return (
        <div className="const-node">
            <Handle
                className="handle"
                type="target"
                position={Position.Left}
                style={{ background: "#0ff" }}
                id={node_name + "-fwd-input-0"}
                isConnectable={true}
                // onConnect={onConnect}
            />
            <span className="Output Tensor">Output Tensor</span>
            {/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
        </div>
    );
}

function ParamToInput(
    moduleName: string,
    nodeid: string,
    paramHandle: ParamHandle,
    key: number,
    pre_length: number
) {
    let name = paramHandle.param.name;
    // console.log(name)
    let initial_value = paramHandle.param.initial_value;

    const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        console.log(evt.target.value);
        paramHandle.param.value = evt.target.value;
    }, []);

    let id_name: string = name as string;
    let id_key: string = key.toString();
    paramHandle.id = moduleName + "-" + nodeid + "-data-" + id_name + "-" + id_key;

    return (
        <div key={name}>
            <span>{name}</span> <br />
            <input
                name="text"
                onChange={onChange}
                className="nodrag"
                placeholder={initial_value}
            />
            <Handle
                className="handle"
                type="target"
                // onConnect={onConnect}
                id={paramHandle.id}
                position={Position.Left}
                style={{
                    top: (pre_length + 1) * 45.75 + 49.75 * (key) + 75,
                }}
                isConnectable={true}
            />
        </div>
    );
}

function SourcesToInput(
    moduleName: string,
    nodeid: string,
    sourcesHandle: SourceHandle,
    key: number
) {
    sourcesHandle = structuredClone(sourcesHandle)
    let name = sourcesHandle.name;
    let initial_value = sourcesHandle.value;

    const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        console.log(evt.target.value);
        sourcesHandle.value = evt.target.value;
    }, []);

    // const onConnect = (connection: Connection) => {
    //     console.log(connection);
    //     const { source, sourceHandle, target, targetHandle } = connection;
    //     if (source) {
    //         sourcesHandle.source = source;
    //     }
    // };

    let sourceHandleId: string =
        moduleName + "-" + nodeid + "-fwd-" + name + "-" + String(key);

    sourcesHandle.id = sourceHandleId;

    return (
        <div key={name}>
            <span>{name}</span> <br />
            <input
                name="text"
                onChange={onChange}
                className="nodrag"
                placeholder={initial_value}
            />
            <Handle
                className="handle"
                type="target"
                // onConnect={onConnect}
                id={sourceHandleId}
                position={Position.Left}
                style={{
                    top: 45.75 * key + 75,
                    backgroundColor: "#00ffff",
                }}
                isConnectable={true}
            />
        </div>
    );
}

// interface NNprops {
//     module: Module;
// }
function NNmoduleToDiv(module: Module) {
    let nodeid = useNodeId();
    // const module = props.module;
    let paramsHandle = module.paramsHandle;
    let forwardHandles = module.sourcesHandle;
    let targetHandles = module.targetsHandle;
    let moduleName = module.name;

    // console.log("Target2: ", module);
    if (nodeid === null) {
        nodeid = "node1";
    } else if (!(nodeid in classdict)) {
        let classInstance = new ClassInstance(module.name, nodeid);
        classdict[nodeid] = classInstance;
        classdict[nodeid].forwardHandles = structuredClone(forwardHandles);
        classdict[nodeid].targetHandles = structuredClone(targetHandles);
        classdict[nodeid].paramsHandles = structuredClone(paramsHandle);
    }
    const nodeId: string = nodeid;
    // console.log("output classdict data", classdict[nodeid]);
    // console.log(classdict[nodeid].paramsHandles.length)
    let pure_paramHandles:ParamHandle[] = []
    classdict[nodeid].paramsHandles.map(
        (paramHandle:ParamHandle, key:number) => {
            if(paramHandle.param.name != 'self'){
                pure_paramHandles.push(paramHandle)
            }
        }
    )

    classdict[nodeid].paramsHandles = structuredClone(pure_paramHandles)

    const initItems: CollapseProps["items"] = [
        {
            label: "init info",
            children: (
                <div>
                    {classdict[nodeid].paramsHandles.map(
                        (paramHandle: ParamHandle, key: number) =>
                            ParamToInput(
                                moduleName,
                                nodeId,
                                paramHandle,
                                key,
                                Number(forwardHandles.length)
                            )
                    )}
                </div>
            ),
        },
    ];

    // console.log("Target information: ",targetHandles);
    // console.log(
    //     "IDT1: ",
    //     targetHandles.map((t) => t.id)
    // );
    // console.log("IDT1: ", targetHandles);
    const targetHandlesComponent = classdict[nodeid].targetHandles.map(
        (targetHandle_split: TargetHandle, key: number) => {
            targetHandle_split.id =
                moduleName + "-" + nodeId + "-fwd-output-" + String(key);
            // console.log("IDT: ", nodeId);
            // console.log("IDT", module.targetsHandle[0].id);
            if(nodeid){
                classdict[nodeid].targetHandles[key].id =
                moduleName + "-" + nodeId + "-fwd-output-" + String(key);
            }

            

            return (
                <Handle
                    className="handle"
                    type="source"
                    // onConnect={onConnect}
                    id={targetHandle_split.id}
                    position={Position.Right}
                    style={{
                        top: 45.75 * key + 75,
                        backgroundColor: "#ffff00",
                    }}
                    isConnectable={true}
                    // onConnect={(connect: Connection) => {
                    //     const { source, sourceHandle, target, targetHandle } =
                    //         connect;
                    //     if (targetHandle) {
                    //         targetHandle_split.targets.push(targetHandle);
                    //     }
                    // }}
                />
            );
        }
    );


    const SourceHandlesComponent = classdict[nodeid].forwardHandles.map(
        (source_handle: SourceHandle, key: number) => {
            source_handle.id =
                moduleName + "-" + nodeId + "-fwd-input-" + String(key);
            // console.log("IDT: ", nodeId);
            // console.log("IDT", module.targetsHandle[0].id);
            if(nodeid){
                classdict[nodeid].forwardHandles[key].id =
                moduleName + "-" + nodeId + "-fwd-input-" + String(key);
            }
            let name = source_handle.name
            let initial_value = "";
            const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
                console.log(evt.target.value);
                source_handle.value = evt.target.value;
            }

            return (
                <div key={name}>
                    <span>{name}</span> <br />
                    <input
                        name="text"
                        onChange={onChange}
                        className="nodrag"
                        placeholder={initial_value}
                    />
                    <Handle
                        className="handle"
                        type="target"
                        // onConnect={onConnect}
                        id={source_handle.id}
                        position={Position.Left}
                        style={{
                            top: 45.75 * key + 75,
                            backgroundColor: "#00ffff",
                        }}
                        isConnectable={true}
                    />
                </div>
            );
        }
    );

    return (
        <div>
            {/* <span>{nodeId}</span> */}
            <div>{targetHandlesComponent}</div>
            {/* {forwardHandles.map((SourceHandle: SourceHandle, key: number) => {
                return SourcesToInput(moduleName, nodeId, SourceHandle, key);
            })} */}
            <div>{SourceHandlesComponent}</div>
            <br />
            <Collapse items={initItems} />
        </div>
    );
}
function checkIfTensor(
    typeInfo: TypeInfo
): "Tensor" | "Optional" | "Any" | undefined {
    if (typeInfo.type === "Tensor") {
        return "Tensor";
    } else if (
        typeInfo.type === "Optional" &&
        typeInfo.subtypes.length > 0 &&
        typeInfo.subtypes[0].type === "Tensor"
    ) {
        return "Optional";
    } else if (
        typeInfo.type === "List" &&
        typeInfo.subtypes.length > 0 &&
        typeInfo.subtypes[0].type === "Tensor"
    ) {
        return "Any";
    } else if (
        typeInfo.type === "Tuple" &&
        typeInfo.subtypes.length === 2 &&
        typeInfo.subtypes[0].type === "Tensor" &&
        typeInfo.subtypes[1].type === "Variadic"
    ) {
        return "Any";
    }
}

function getTensorNum(params: TypeInfo[]): [number, number] | "any" {
    if (params.length === 0) {
        return [0, 0];
    }
    const [head, ...tail] = params;
    let type_hint = head;
    if (type_hint) {
        if (type_hint.type === "UNION") {
            if (type_hint.subtypes[0]) type_hint = type_hint.subtypes[0];
        }
        const ifTensor = checkIfTensor(type_hint);
        switch (ifTensor) {
            case "Any":
                return "any";
            case "Optional":
                var recursionResult = getTensorNum(tail);
                if (recursionResult === "any") {
                    throw "any after optional!";
                }
                return [recursionResult[0], recursionResult[1] + 1];
            case "Tensor":
                var recursionResult = getTensorNum(tail);
                if (recursionResult === "any") {
                    throw "any after tensor!";
                }
                return [recursionResult[0] + 1, recursionResult[1]];
            default:
                return [0, 0];
        }
    } else {
        return [0, 0];
    }
} // return [compulsory tensor, optional tensor] or "any" --- any number of tensor tensor

function GenerateModuleFunction(
    classInfo: ClassInfo
): ComponentType<NodeProps> | undefined {
    const initFunc = classInfo.functions.find(
        (func) => func.name === "__init__"
    );
    if (!initFunc) {
        throw new Error(`__init__ function not found in ClassInfo`);
    }

    const typeInfoU = initFunc.parameters.slice(1).map((p) => {
        if (p.type_hint) return p.type_hint;
    });
    const typeInfos: TypeInfo[] = [];
    typeInfoU.map((t) => {
        if (t) typeInfos.push(t);
    });
    const forwardFunc = classInfo.functions.find((f) => f.name === "forward");
    if (forwardFunc) {
        // console.log("forward func info: ", forwardFunc);
    } else {
        return;
    }

    const paramsHandle = initFunc.parameters.map((param) => {
        let newParam = new Param(param.name);
        let newParamHandle: ParamHandle;

        if (param.initial_value) {
            // console.log(param.initial_value)
            newParam.initial_value = param.initial_value;
            newParamHandle = new ParamHandle("Param", newParam, true);
        } else {
            newParam.initial_value = "";
            newParamHandle = new ParamHandle("Param", newParam, false);
        }

        return newParamHandle;

        // return new ParamHandle("Tensor", newParam, true);
    });

    const sourcesHandle = forwardFunc.parameters.map((param) => {
        let newSourceHandle: SourceHandle;
        let initial_value = param.initial_value;

        if (param.name == "self") {
            return;
        }

        if (param.initial_value) {
            newSourceHandle = new SourceHandle(
                "Tensor",
                param.name,
                false,
                initial_value
            );
        } else {
            newSourceHandle = new SourceHandle("Tensor", param.name, true, "");
        }

        return newSourceHandle;
    });
    

    let targetsHandle: TargetHandle[] = [];
    if (forwardFunc.return_type?.getType() == "Tuple") {
        targetsHandle = forwardFunc
            .return_type!.getSubtypes()
            .map((param, key) => {
                const turn_type = param.getType();
                let targetHandle: TargetHandle;
                targetHandle = new TargetHandle(turn_type);

                return targetHandle;
            });
    } else {
        targetsHandle.push(new TargetHandle("Tensor"));
    }

    const moduleName: string = classInfo.name;
    let module: Module;
    const pureSourceHandle: SourceHandle[] = [];
    sourcesHandle.map((sourcehandle) => {
        if (sourcehandle) {
            pureSourceHandle.push(sourcehandle);
        }
    });

    module = new Module(
        paramsHandle,
        pureSourceHandle,
        targetsHandle,
        moduleName
    );
    // console.log("Target0: ", module);
    return function () {
        // return NNmoduleToDiv(module);
        // console.log("Target1: ", module);
        return (
            <div className="text-updater-node">
                <span style={{ fontSize: 25 }}>{moduleName}</span>
                <br />
                {NNmoduleToDiv(module)}
            </div>
        );
    };
}

export { InputTensor, OutputTensor, GroundTruthLabel, GetClassDict, GenerateModuleFunction };

{
    /* <Handle
    className="handle"
    type="target"
    onConnect={onConnect}
    position={Position.Left}
    id={moduleName + "-" + nodeid + "-input"}
    style={{ top: 10, background: "#00ffff" }}
    isConnectable={true}
/>
<Collapse items={item} />
<Handle
    className="handle"
    type="source"
    onConnect={onConnect}
    position={Position.Right}
    id={moduleName + "-" + nodeid + "-output"}
    style={{ top: 10, background: "#ffff00" }}
    isConnectable={true}
/> */
}
