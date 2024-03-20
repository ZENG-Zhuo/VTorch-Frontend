import React, {useState} from 'react';
import Sidernodes from './SiderNodes'
import classnames from 'classnames';
import './Sider.css'
import { useStore } from 'reactflow';
import {InputTensor, OutputTensor, Conv2D, AvgPool2d, BatchNorm2D, Conv1D, classdict} from '../Canvas/LayerNode'

function Sider() {
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
      <div className="nodes">
          {Sidernodes?.map((x) => (
            <div
              key = {x.data.label}
              className={classnames(["sider-node", x.data.label])}
              onDragStart={(event: any) => onDragStart(event, x.type)}
              draggable
            >
              {x.data.label}
            </div>
          ))}
      </div>
      <button  className="save"  onClick={OnClickButton}>show the state</button>
    </div>
  );
}

export default Sider;