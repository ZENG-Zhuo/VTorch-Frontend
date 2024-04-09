import React, { useState } from "react";
// import Sidernodes from './SiderNodes'
import classnames from "classnames";
import "./Sider.css";
// import {Scrollbars} from 'react-custom-scrollbars';
import { useStore, useReactFlow } from "reactflow";
import { InputTensor, OutputTensor, GetClassDict } from "../Canvas/LayerNode";
import { ClassInfo } from "../common/pythonObjectTypes";
import { Sidenav, Nav, Toggle } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import MagicIcon from "@rsuite/icons/legacy/Magic";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import { Database } from "../common/objectStorage";

interface SiderProp {
    modules: Map<string, ClassInfo> | undefined;
}

function Sider(props: SiderProp) {
    let modules = props.modules;
    const BasicNodes = [ // need type def here
        { type: "Input", data: { label: "input tensor" } },
        { type: "Output", data: { label: "output tensor" } },
    ];
    let NnNodes:Array<any> = [];
    if (modules)
        NnNodes = Array.from(modules, (classNameAndInfo) => {
            return {
                type: classNameAndInfo[0],
                data: { label: classNameAndInfo[0] },
            };
        });
    const onDragStart = (event: any, nodeType: any) => {
        console.log("output the nodetype");
        console.log(nodeType);
        event.dataTransfer.setData("application/reactflow", nodeType);
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
        let nodes: any = GetClassDict();

        for (let key in nodes) {
            if (String(nodes[key].name) == "input") {
                nodes[key]["source"] = [];
            }
            if (String(nodes[key].name) == "output") {
                nodes[key]["target"] = [];
            }
        }

        edges.forEach((edge) => {
            nodes[edge.target]["source"] = [];
            nodes[edge.source]["target"] = [];
        });

        edges.forEach((edge) => {
            console.log(edge.target);
            console.log(edge.source);

            nodes[edge.target]["source"].push(String(edge.source));
            nodes[edge.source]["target"].push(String(edge.target));
        });
        var jsonData = JSON.stringify(nodes, null, "\t");
        console.log(jsonData);
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
                                                onDragStart(event, x.type)
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
                                                onDragStart(event, x.type)
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
