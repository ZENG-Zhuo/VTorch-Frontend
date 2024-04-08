import React, {useState} from 'react';
// import Sidernodes from './SiderNodes'
import classnames from 'classnames';
import './Sider.css';
// import {Scrollbars} from 'react-custom-scrollbars';
import { useStore, useReactFlow } from 'reactflow';
import {InputTensor, OutputTensor, classdict} from '../Canvas/LayerNode'
import { ClassInfo } from '../ParsePythonFuncClass';
import { Sidenav, Nav, Toggle } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';


interface SiderProp{
  modules : ClassInfo[];
};

function Sider(props: SiderProp) {
  let modules = props.modules;
  const BasicNodes = [
    { type: 'Input', data: { label: 'input tensor' } },
    { type: 'Output', data: { label: 'output tensor' } },
  ]
  const NnNodes = [
    ...modules.map(classInfo => ({
      type: classInfo.name,
      data: { label: classInfo.name }
    }))
  ];
  const onDragStart = (event: any, nodeType: any) => {
    console.log("output the nodetype");
    console.log(nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };  

  const edges = useStore(state => state.edges);
  const reactflow = useReactFlow()

  function LogOutInfo(){
    // let nodes: any = classdict
    // console.log(nodes)
    // console.log(edges)
    console.log(reactflow.getNodes())
  }

  function OnClickButton(){
    let nodes: any = classdict

    for(let key in nodes){
      if(String(nodes[key].name) == "input"){
        nodes[key]["source"] = []
      }
      if(String(nodes[key].name) == "output"){
        nodes[key]["target"] = []
      }
    }
    
    edges.forEach((edge)=>{
      nodes[edge.target]["source"] = []
      nodes[edge.source]["target"] = []
    })
    
    edges.forEach((edge)=>{
      console.log(edge.target)
      console.log(edge.source)
      
      nodes[edge.target]["source"].push(String(edge.source))
      nodes[edge.source]["target"].push(String(edge.target))
    })
    var jsonData = JSON.stringify(nodes, null, "\t")
    console.log(jsonData)
  };


  return (
    <div className='sider'>
      
      <span className='sider_title'> Layer Choice </ span>
      <button  className="save"  onClick={LogOutInfo}>show the state</button>

      <Sidenav>
      <Sidenav.Body>
      
      <Nav>
      <Nav.Menu  key="Basic" placement="rightStart" title="BasicNodes" icon={<MagicIcon />}>
        <div className="nodes">
            {BasicNodes?.map((x) => (
              <Nav.Item >
              <div
                key = {x.data.label}
                className={classnames(["sider-node", x.data.label])}
                onDragStart={(event: any) => onDragStart(event, x.type)}
                draggable
              >
                {x.data.label}
              </div>
              </Nav.Item>
            ))}
        </div>
      </Nav.Menu>
      <Nav.Menu key="NN" placement="rightStart" title="NNModule" icon={<MagicIcon />}>
      <div className="nodes">
          {NnNodes?.map((x) => (
            <Nav.Item >
            <div
              key = {x.data.label}
              className={classnames(["sider-node", x.data.label])}
              onDragStart={(event: any) => onDragStart(event, x.type)}
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