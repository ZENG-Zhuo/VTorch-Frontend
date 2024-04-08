import React, {useState} from 'react';
// import Sidernodes from './SiderNodes'
import classnames from 'classnames';
import './Sider.css';
// import {Scrollbars} from 'react-custom-scrollbars';
import { useStore } from 'reactflow';
import {InputTensor, OutputTensor, classdict} from '../Canvas/LayerNode'
import { ClassInfo } from '../common/pythonObjectTypes';
import { Sidenav, Nav, Toggle } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';


interface SiderProp{
  modules : ClassInfo[] | undefined;
};

function Sider(props: SiderProp) {
  let modules = props.modules;
  if (!modules){
    throw "module undefined unhandled!"
  }
  const sidernodes = [
    { type: 'Input', data: { label: 'input tensor' } },
    { type: 'Output', data: { label: 'output tensor' } },
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
  const state = useStore((state) => state);

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
      <button  className="save"  onClick={OnClickButton}>show the state</button>

      <Sidenav>
      <Sidenav.Body>
      
      <Nav>
      <Nav.Menu placement="rightStart" eventKey="3" title="NNModule" icon={<MagicIcon />}>
      <div className="nodes">
          {sidernodes?.map((x) => (
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