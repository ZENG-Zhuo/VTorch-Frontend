import { ChangeEvent, Children, ComponentType, forwardRef, useCallback, useState } from "react";
import { Connection, Handle, NodeProps, Position, useNodeId } from "reactflow";
import { ClassInfo, TypeInfo,FuncInfo } from "../common/pythonObjectTypes";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import { NodeId } from "../common/pythonFileTypes";
import { connect } from "http2";
import { ClassInstance, GetClassDict, SourceHandle, TargetHandle} from "./LayerNode";



let classdict = GetClassDict()
class FuncModule {
    sourcesHandle: SourceHandle[];
    targetsHandle: TargetHandle[];
    name: string;

    constructor(
        sourcesHandle: SourceHandle[],
        targetsHandle: TargetHandle[],
        moduleName: string
    ) {
        this.sourcesHandle = sourcesHandle;
        this.targetsHandle = targetsHandle;
        this.name = moduleName;
    }
}


function FucModuleToDiv(module: FuncModule) {
    let nodeid = useNodeId();
    // const module = props.module;
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
    }
    const nodeId: string = nodeid;
    // console.log("output classdict data", classdict[nodeid]);
    // console.log(classdict[nodeid].paramsHandles.length)

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
                />
            );
        }
    );

    const [boxValue, setBoxValue] = useState<string>("")

    const SourceHandlesComponent = classdict[nodeid].forwardHandles.map(
        (source_handle: SourceHandle, key: number) => {
            source_handle.id =
                moduleName + "-" + nodeId + "-fwd-input-" + String(key);
            if(nodeid){
                classdict[nodeid].forwardHandles[key].id =
                moduleName + "-" + nodeId + "-fwd-input-" + String(key);
            }
            let name = source_handle.name
            let initial_value = "";
            const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
                console.log(evt.target.value);
                source_handle.value = evt.target.value;
                setBoxValue(evt.target.value);
            }

            return (
                <div key={name}>
                    <span>{name}</span> <br />
                    <input
                        name="text"
                        onChange={onChange}
                        value={boxValue}
                        className="nodrag"
                        // placeholder={initial_value}
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
            <div>{targetHandlesComponent}</div>
            <div>{SourceHandlesComponent}</div>
        </div>
    );
}



function GenerateFunc(
    funcInfo: FuncInfo
): ComponentType<NodeProps> | undefined {
    
    let forwardFunc = funcInfo

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

    const moduleName: string = funcInfo.name;
    let module: FuncModule;
    const pureSourceHandle: SourceHandle[] = [];
    sourcesHandle.map((sourcehandle) => {
        if (sourcehandle) {
            pureSourceHandle.push(sourcehandle);
        }
    });

    module = new FuncModule(
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
                {FucModuleToDiv(module)}
            </div>
        );
    };
}



export { FucModuleToDiv, GenerateFunc };