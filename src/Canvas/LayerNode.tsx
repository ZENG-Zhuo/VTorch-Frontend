import { ChangeEvent, ComponentType, useCallback } from "react";
import { Connection, Handle, NodeProps, Position, useNodeId } from "reactflow";
import { ClassInfo, TypeInfo } from "../common/pythonObjectTypes";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import { NodeId } from "../common/pythonFileTypes";

class Param {
    name: string;
    value: string | null = "";
    constructor(name: string) {
        this.name = name;
    }
}

class Module {
    paramsHandle: ParamHandle[];
    name: string;

    constructor(paramsHandle: ParamHandle[], moduleName: string) {
        this.paramsHandle = paramsHandle;
        this.name = moduleName;
    }
}

function ParamInput(
    moduleName: string,
    nodeid: string,
    name: string,
    paramHandle: ParamHandle,
    key: number
) {
    const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        console.log(evt.target.value);
        paramHandle.param.value = evt.target.value;
    }, []);

    function onConnect(connection: Connection) {
        const { source, sourceHandle, target, targetHandle } = connection;
        paramHandle.source = source;
    }

    // const onConnect = useCallback((evt: any) => {
    //   console.log(evt)
    // },[])

    let id_name: string = name as string;
    let id_key: string = key.toString();

    return (
        <div key={name}>
            <span>{name}</span> <br />
            <input name="text" onChange={onChange} className="nodrag" />
            <Handle
                className="handle"
                type="target"
                onConnect={onConnect}
                id={moduleName + "-" + nodeid + "-" + id_name + "-" + id_key}
                position={Position.Left}
                style={{ top: 46 * key + 85 }}
                isConnectable={true}
            />
        </div>
    );
}

type ParamType = "Tensor" | "Param";

class ParamHandle {
	source: string | null = "";
	type: ParamType;
	param: Param;
	optional: boolean;
	constructor(type: ParamType, param: Param, optional: boolean) {
		this.type = type;
		this.param = param;
		this.optional = optional;
	}
}

class SourceHandle {
    source: string | undefined;
    type: ParamType;
    optional: boolean;
    constructor(type: ParamType, optional: boolean) {
        this.type = type;
        this.optional = optional;
    }
}

class TargetHandle {
    targets: string[] = [];
    type: ParamType;
    constructor(type: ParamType) {
        this.type = type;
    }
}

export class ClassInstance {
    name: string;
    paramsHandles: ParamHandle[] = [];
    instanceNodeId: NodeId | undefined;
    forwardHandles: SourceHandle[] = [];
    targetHandles: TargetHandle[] = [];
    constructor(name: string, paramsHandles: ParamHandle[]) {
        this.name = name;
        this.paramsHandles = paramsHandles;
    }
}

let classdict: { [key: string]: ClassInstance } = {};

function GetClassDict() {
    return classdict;
}

function InputTensor() {
    let nodeid = useNodeId();
    if (nodeid == null) {
        nodeid = "node0";
    } else if (!(nodeid in classdict)) {
        let classInstance = new ClassInstance("input", []);
        classdict[nodeid] = classInstance;
    }

    function onConnect(connection: Connection) {
        const { source, sourceHandle, target, targetHandle } = connection;
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
                id="input"
                isConnectable={true}
                onConnect={onConnect}
            />
        </div>
    );
}

function OutputTensor() {
    let nodeid = useNodeId();
    if (nodeid == null) {
        nodeid = "node0";
    } else if (!(nodeid in classdict)) {
        let classInstance = new ClassInstance("output", []);
        classdict[nodeid] = classInstance;
    }

    function onConnect(connection: Connection) {
        const { source, sourceHandle, target, targetHandle } = connection;
    }

    return (
        <div className="const-node">
            <Handle
                className="handle"
                type="target"
                position={Position.Left}
                style={{ background: "#0ff" }}
                id="output"
                isConnectable={true}
                onConnect={onConnect}
            />
            <span className="Output Tensor">Output Tensor</span>
            {/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
        </div>
    );
}

function NNmoduleToDiv(module: any) {
    let nodeid = useNodeId();

    let params = module.params;
    let moduleName = module.name;

    if (nodeid === null) {
        nodeid = "node1";
    } else if (!(nodeid in classdict)) {
        let classInstance = new ClassInstance(module.name, params);
        classdict[nodeid] = classInstance;
    }
    const nodeId: string = nodeid;
    return [
        <div>
            {classdict[nodeid].paramsHandles.map((paramsHandle: ParamHandle, key: number) =>
                ParamInput(
                    moduleName,
                    nodeId,
                    paramsHandle.param.name,
                    paramsHandle,
                    key
                )
            )}
        </div>,
        nodeid,
    ];
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
): ComponentType<NodeProps> {
    const initFunc = classInfo.functions.find(
        (func) => func.name === "__init__"
    );
    if (!initFunc) {
        throw new Error(`__init__ function not found in ClassInfo`);
    }

    const typeInfos = initFunc.parameters.map((p) => {
        if (p.type_hint) return p.type_hint;
        throw "type_hint undefined" + p.name;
    });
    const [tensorNumber, tensorOption] = getTensorNum(typeInfos)

    const paramsHandle = initFunc.parameters.map(
        (param, key) =>{
            let newParam = new Param(param.name)
            let newParamHandle: ParamHandle;
            if((key+1)>0 && (key+1)<= Number(tensorNumber)){
                newParamHandle = new ParamHandle("Tensor",newParam,false);
            } else if((key+1)>Number(tensorNumber) && (key+1) < (Number(tensorNumber)+Number(tensorOption))){
                newParamHandle = new ParamHandle("Tensor",newParam,true);
            } else{
                newParamHandle = new ParamHandle("Param",newParam,true);
            }
            return newParamHandle;
        } 
    );

    const moduleName: string = classInfo.name;

    function onConnect(connection: Connection) {
        const { source, sourceHandle, target, targetHandle } = connection;
        if (
            targetHandle!.substring(
                targetHandle!.length - 3,
                targetHandle!.length
            ) == "put"
        ) {
            return;
        } else {
            let splitHandle: any = targetHandle!.split("-");
            let key: number = splitHandle[splitHandle.length - 1];
            // console.log(key)
            // console.log(classdict[target].params[key])
            classdict[target!].paramsHandles[key].param.value = source;
        }
    }

    return function () {
        const module = new Module(paramsHandle, moduleName);
        // return NNmoduleToDiv(module);
        const [div, nodeid] = NNmoduleToDiv(module);
        const item: CollapseProps["items"] = [
            {
                label: moduleName,
                children: div,
            },
        ];
        return (
            <div className="text-updater-node">
                <Handle
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
                />
            </div>
        );
    };
}

export { InputTensor, OutputTensor, GetClassDict, GenerateModuleFunction };
