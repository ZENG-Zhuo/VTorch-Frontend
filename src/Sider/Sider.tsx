import React, { useState } from "react";
// import Sidernodes from './SiderNodes'
import classnames from "classnames";
import "./Sider.css";
// import {Scrollbars} from 'react-custom-scrollbars';
import { useStore, useReactFlow } from "reactflow";
import {
    InputTensor,
    OutputTensor,
    GetClassDict,
    ClassInstance,
} from "../Canvas/LayerNode";
import { ClassInfo, FuncInfo } from "../common/pythonObjectTypes";
import { Sidenav, Nav, Toggle } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import MagicIcon from "@rsuite/icons/legacy/Magic";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import { Database } from "../common/objectStorage";

interface SiderProp {
    modules: Map<string, ClassInfo> | undefined;
    funcs: [string, FuncInfo[]][];
}

function Sider(props: SiderProp) {
    let modules = props.modules;
    let funcs = props.funcs;
    const BasicNodes = [
        // need type def here
        { type: "Input", data: { label: "input tensor", submodule: ["kysten"] } },
        { type: "Output", data: { label: "output tensor", submodule: ["kysten"] } },
        { type: "GroundTruth", data: { label: "Ground Truth", submodule: ["kysten"]} },
    ];

    let NnNodes: Array<{ type: string; data: { label: string, submodule: string[] } }> = [];
    if (modules)
        Array.from(modules, (classNameAndInfo) => {
            if (classNameAndInfo[1].functions.find((f) => f.name === "forward"))
                NnNodes.push({
                    type: classNameAndInfo[0],
                    data: { label: classNameAndInfo[0], submodule: ["torch", "nn"] },
                });
        });

    let funcNodes: Array<{ type: string; data: { label: string, submodule: string[] } }> = [];
    // console.log("func info ,",funcs)
    if (funcs) {
        funcs.forEach((func)=>{
            // console.log("func info", func)
            if (func[1].length == 1){
                funcNodes.push({
                    type: func[0],
                    data: { label: func[0], submodule: ["torch"] },
                });
            } else {
                func[1].forEach((fc,idx)=>{
                    let func_label = func[0] + '<' + String(idx+1) + '>'
                    funcNodes.push({
                        type: func_label,
                        data: { label: func_label, submodule: ["torch"] },
                    });
                })
            }
        })
    }else {
        // console.log('func info fail to get')
    }

    const onDragStart = (event: any, data: any) => {
        console.log("output the nodetype");
        // console.log("drag the data:",data);
        event.dataTransfer.setData("application/reactflow", data.label);
        event.dataTransfer.setData("application/reactflow2",data.submodule);
        event.dataTransfer.effectAllowed = "move";
    };

    const edges = useStore((state) => state.edges);
    const reactflow = useReactFlow();

    function LogOutInfo() {
        // let nodes: any = classdict
        // console.log(nodes)
        // console.log(edges)
        console.log(reactflow.getNodes());
    }

    function OnClickButton() {
        let nodes = structuredClone(
            GetClassDict()
        );

        console.log("nodes: ", nodes)
        // let jsonObj:any = {}
        // nodes.forEach((value:ClassInstance,key:string) => {
        //     jsonObj[key] = value
        // })
        var jsonData = JSON.stringify(nodes, null, "\t");
        console.log(jsonData);

        // edges.forEach((edge) => {
        //     console.log(edge.id);
        //     console.log(edge.targetHandle);
        //     console.log(edge.sourceHandle);

        //     let targetHandle = edge.targetHandle;
        //     let sourceHandle = edge.sourceHandle;

        //     if (
        //         targetHandle!.substring(
        //             targetHandle!.length - 5,
        //             targetHandle!.length - 2
        //         ) == "put"
        //     ) {
        //         // input and output, forward transfer
        //         let source_key = edge.sourceHandle!.slice(-1);
        //         let target_key = edge.targetHandle!.slice(-1);

        //         nodes[edge.target].forwardHandles[Number(target_key)].source =
        //             String(edge.source);
        //         nodes[edge.source].targetHandles[
        //             Number(source_key)
        //         ].targets.push(String(edge.target));
        //     } else {
        //         // parameter transfer
        //         let param_key = edge.targetHandle!.slice(-1);

        //         nodes[edge.target].paramsHandles[Number(param_key)].source =
        //             edge.source;
        //     }
        // });
        // var jsonData = JSON.stringify(nodes, null, "\t");
        // console.log(jsonData);
    }

    return (
        <div className="sider">
            <span className="sider_title"> Layer Choice </span>
            <button className="save" onClick={OnClickButton}>
                show the state
            </button>

            <Sidenav>
                <Sidenav.Body>
                    <Nav>
                        <Nav.Menu
                            key="Basic"
                            placement="rightStart"
                            title="BasicNodes"
                            icon={<MagicIcon />}
                        >
                            <div className="nodes">
                                {BasicNodes?.map((x) => (
                                    <Nav.Item>
                                        <div
                                            key={x.data.label}
                                            className={classnames([
                                                "sider-node",
                                                x.data.label,
                                            ])}
                                            onDragStart={(event: any) =>
                                                onDragStart(event, x.data)
                                            }
                                            draggable
                                        >
                                            {x.data.label}
                                        </div>
                                    </Nav.Item>
                                ))}
                            </div>
                        </Nav.Menu>
                        <Nav.Menu
                            key="NN"
                            placement="rightStart"
                            title="NNModule"
                            icon={<MagicIcon />}
                        >
                            <div className="nodes">
                                {NnNodes?.map((x) => (
                                    <Nav.Item>
                                        <div
                                            key={x.data.label}
                                            className={classnames([
                                                "sider-node",
                                                x.data.label,
                                            ])}
                                            onDragStart={(event: any) =>
                                                onDragStart(event, x.data)
                                            }
                                            draggable
                                        >
                                            {x.data.label}
                                        </div>
                                    </Nav.Item>
                                ))}
                            </div>
                        </Nav.Menu>
                        <Nav.Menu
                            key="Func"
                            placement="rightStart"
                            title="FuncModule"
                            icon={<MagicIcon />}
                        >
                            <div className="nodes">
                                {funcNodes?.map((x) => (
                                    <Nav.Item>
                                        <div
                                            key={x.data.label}
                                            className={classnames([
                                                "sider-node",
                                                x.data.label,
                                            ])}
                                            onDragStart={(event: any) =>
                                                onDragStart(event, x.data)
                                            }
                                            draggable
                                        >
                                            {x.data.label}
                                        </div>
                                    </Nav.Item>
                                ))}
                            </div>
                        </Nav.Menu>
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </div>
    );
}

export default Sider;
