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
import { UDBInfo } from "../common/UDBTypes";



const backEndUrl = "http://10.89.2.170:8001";
// const backEndUrl = "http://192.168.8.17:8001";

interface SiderProp {
    modules: Map<string, ClassInfo> | undefined;
    funcs: [string, FuncInfo[]][];
    graphName: string,
    setGraphName: React.Dispatch<React.SetStateAction<string>>,
    UDBMap:Map<string, UDBInfo>;
}


function Sider(props: SiderProp) {
    let modules = props.modules;
    let funcs = props.funcs;
    let graphName = props.graphName;
    let setGraphName = props.setGraphName;
    let UDBMap = props.UDBMap;

    

    const BasicNodes = [
        // need type def here
        { type: "input", data: { label: "input", submodule: [] } },
        { type: "output", data: { label: "output", submodule: [] } },
        { type: "groundtruth", data: { label: "groundtruth", submodule: []} },
    ];

    let NnNodes: Array<{ type: string; data: { label: string, submodule: string[] } }> = [];
    if (modules)
        Array.from(modules, (classNameAndInfo) => {
            if (classNameAndInfo[1].getFunctions("forward").length > 0)
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
                    type: func[1][0].name,
                    data: { label: func[0], submodule: ["torch"] },
                });
            } else {
                func[1].forEach((fc,idx)=>{
                    let func_label = func[0] + '<' + String(idx+1) + '>'
                    // let func_label = fc.name
                    // console.log("fc info: ",fc)
                    // console.log("func info:", func)
                    funcNodes.push({
                        type: fc.name,
                        data: { label: func_label, submodule: ["torch"] },
                    });
                })
            }
        })
        // console.log("funcNodesss", funcNodes);
    }else {
        // console.log('func info fail to get')
    }

    function UDBInfotoDiv(value:UDBInfo, key: string){
        return (
            <div>
                <Nav.Menu
                    eventKey={"UDBtoDiv"+key + "-classes"}
                    placement="rightStart"
                    title={"UDBtoDiv-"+key + "-classes"}
                    icon={<MagicIcon />}
                >
                <div className="nodes">
                    {value.classes.map(x => {
                        // console.log("xxxxx",x)
                        return (
                        <div
                        key={"UDB-"+key+'-'+x.name}
                        className={classnames([
                            "sider-node",
                            x.name,
                        ])}
                        onDragStart={(event: any) =>
                            onDragStart(event, {label: x.name, submodule: ["UDB",key]}, "UDBclass-"+key+'-'+x.name)
                        }
                        draggable>
                            {x.name}
                        </div>)
                    })}
                </div>
                </Nav.Menu>

                <Nav.Menu
                    eventKey={"UDBtoDiv-"+key + "-funcs"}
                    placement="rightStart"
                    title={"UDBtoDiv-"+key + "-funcs"}
                    icon={<MagicIcon />}
                >
                    <div className="nodes">
                {value.functions.map(x => {
                    let new_name = x.name.split('$')[0]
                    console.log("newname = ",new_name)
                    return (
                    <div
                    key={"UDB-"+key+'-'+new_name}
                    className={classnames([
                        "sider-node",
                        new_name,
                    ])}
                    onDragStart={(event: any) =>
                        onDragStart(event, {label:new_name, submodule:["UDB",key]},"UDBfunc-"+key+'-'+x.name)
                    }
                    draggable>
                        {new_name}
                    </div>)
                })}
                </div>
                </Nav.Menu>
            </div>
        )
    }

    const onDragStart = (event: any, data: any, type:string) => {
        console.log("output the nodetype");
        console.log("drag start:",type);
        event.dataTransfer.setData("application/reactflow", type);
        event.dataTransfer.setData("application/reactflow2",data.submodule);
        event.dataTransfer.setData("application/reactflow3",data.label);
        event.dataTransfer.effectAllowed = "move";
    };

    const edges = useStore((state) => state.edges);
    const reactflow = useReactFlow();
    function OnClickButton() {
        // let nodes = structuredClone(
        //     GetClassDict()
        // );
        // console.log("nodes: ", nodes)
        // var jsonData = JSON.stringify(nodes, null, "\t");
        // console.log(jsonData);

        window.location.reload();

    }

    return (
        <div className="sider">
            <span className="sider_title"> Layer Choice </span>
            <button className="save" onClick={OnClickButton} style={{color:"#F00000"}}>
                Enter Another Graph
            </button>
            <br/><br/>
            <Sidenav>
                <Sidenav.Body>
                    <Nav>
                        <div className="choose">
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
                                                onDragStart(event, x.data, x.type)
                                            }
                                            draggable
                                        >
                                            {x.data.label}
                                        </div>
                                    </Nav.Item>
                                ))}
                            </div>
                        </Nav.Menu>
                        </div>
                        <div className="choose">
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
                                                onDragStart(event, x.data, x.type)
                                            }
                                            draggable
                                        >
                                            {x.data.label}
                                        </div>
                                    </Nav.Item>
                                ))}
                            </div>
                        </Nav.Menu>
                        </div>
                        <div className="choose">
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
                                                onDragStart(event, x.data, x.type)
                                            }
                                            draggable
                                        >
                                            {x.data.label}
                                        </div>
                                    </Nav.Item>
                                ))}
                            </div>
                        </Nav.Menu>
                        </div>
                        {Array.from(UDBMap, function(value){
                            return UDBInfotoDiv(value[1],value[0])
                        })}
                        {/* {UDBtoDiv(UDBMap)} */}
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </div>
    );
}

export default Sider;
