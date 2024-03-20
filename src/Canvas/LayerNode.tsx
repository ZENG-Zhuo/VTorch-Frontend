import { useCallback } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';

// function InputTensor() {
//   return (
//     <div className="text-updater-node">
//       <span className='Input Tensor'>Input Tensor</span>
//       {/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
//       <Handle type="source" position={Position.Right} id="b" isConnectable={true}/>
//     </div>
//   );
// }

// function OutputTensor() {
//   return (
//     <div className="text-updater-node">
//       <Handle type="target" position={Position.Left} id="b" isConnectable={true}/>
//       <span className='Output Tensor'>Output Tensor</span>
//       {/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
//     </div>
//   );
// }


// function Conv2D() {

//   const onChange = useCallback((evt: any) => {
//     console.log(evt.target.value);
//     console.log(evt.target.value);
//     console.log(evt.target)
//   }, []);

//   return (
//     <div className="text-updater-node">
//       <Handle type="target" position={Position.Left} isConnectable={true}/>
//       <span className='conv2d-title'>Conv2D</span>
//       <br/>
//       <div>
//         <span>in_channels:</span> <br/>
//         <input id="x1" name="x1" type="text" onChange={onChange} className="nodrag" />
//       </div>
//       <div>
//         <span>out_channels:</span> <br/>
//         <input name="text" onChange={onChange} className="nodrag" />
//       </div>
//       <div>
//         <span>kernel_size:</span> <br/>
//         <input name="text" onChange={onChange} className="nodrag" />
//       </div>
//       <div>
//         <span>stride:</span> <br/>
//         <input name="text" onChange={onChange} className="nodrag" defaultValue="None" ></input>
//       </div>
//       {/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
//       <Handle type="source" position={Position.Right} id="b" isConnectable={true}/>
//     </div>
//   );
// }

// function AvgPool2d() {
//   const onChange = useCallback((evt: any) => {
//     console.log(evt.target.value);
//   }, []);

//   return (
//     <div className="text-updater-node">
//       <Handle type="target" position={Position.Left} isConnectable={true}/>
//       <span className='conv2d-title'>AvgPool2d</span>
//       <br/>
//       <div>
//         <span>kernel_size:</span> <br/>
//         <input name="text" onChange={onChange} className="nodrag" />
//       </div>
//       <div>
//         <span>stride:</span> <br/>
//         <input name="text" onChange={onChange} className="nodrag" defaultValue={"None"}/>
//       </div>
//       {/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
//       <Handle type="source" position={Position.Right} id="b" isConnectable={true}/>
//     </div>
//   );
// }

// function BatchNorm2D(){
//   const onChange = useCallback((evt: any) => {
//     console.log(evt.target.value);
//   }, []);

//   return (
//     <div className="text-updater-node">
//       <Handle type="target" position={Position.Left} isConnectable={true}/>
//       <span className='conv2d-title'>BatchNorm2D</span>
//       <br/>
//       <div>
//         <span>num_feature:</span> <br/>
//         <input  name="text" onChange={onChange} className="nodrag" />
//       </div>
//       <div>
//         <span>eps:</span> <br/>
//         <input  name="text" onChange={onChange} className="nodrag" defaultValue={"1e-5"}/>
//       </div>
//       <div>
//         <span>momentum:</span> <br/>
//         <input name="text" onChange={onChange} className="nodrag" defaultValue={"0.1"}/>
//       </div>
//       {/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
//       <Handle type="source" position={Position.Right} id="b" isConnectable={true}/>
//     </div>
//   );
// }


class Param {
  name;
  type;
  value;
  constructor(name: any, type: any) {
    this.name = name;
    this.type = type;
    this.value = "";
  }
}

class ParamValue {
  name;
  value;
  constructor(name: any, value: any) {
    this.name = name;
    this.value = value;
  }
}



class Module {
  params;
  name;
  
  constructor(params: any, moduleName: any) {
    this.params = params;
    this.name = moduleName;
  }
}

function ParamInput(name: any, type: any, param: any) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
    param.value = evt.target.value;
  }, []);

  return (
    <div key={name}>
      <span>{name}</span> <br />
      <input name="text" onChange={onChange} className="nodrag" />
    </div>
  )
}

class ClassInstance {
  params;
  name;
  constructor(name: any, params: any) {
    this.name = name;
    this.params = params;
  }
}

let classdict: {[key:string]:ClassInstance} = {}

function InputTensor() {
  let nodeid = useNodeId()
  if(nodeid == null){
    nodeid = "node0"
  }else if (!(nodeid in classdict)){
    let classInstance = new ClassInstance("input", []);
    classdict[nodeid] = classInstance
  }

  return (
    <div className="text-updater-node">
      <span className='Input Tensor'>Input Tensor</span>
      {/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
      <Handle type="source" position={Position.Right} id="b" isConnectable={true} />
    </div>
  );
}

function OutputTensor() {
  let nodeid = useNodeId()
  if(nodeid == null){
    nodeid = "node0"
  }else if (!(nodeid in classdict)){
    let classInstance = new ClassInstance("output", []);
    classdict[nodeid] = classInstance
  }

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Left} id="b" isConnectable={true} />
      <span className='Output Tensor'>Output Tensor</span>
      {/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
    </div>
  );
}

function NNmoduleToDiv(module: any) {

  let nodeid = useNodeId() 
  let params = module.params
  let moduleName = module.name

  if(nodeid == null){
    nodeid = "node1"
  }else if (!(nodeid in classdict)){
      let classInstance = new ClassInstance(module.name, params);
      classdict[nodeid] = classInstance
    }

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Left} isConnectable={true} />
      <span className='conv2d-title'>{moduleName}</span>
      <br/>
      <span>{nodeid}</span>
      <br />
      {classdict[nodeid].params.map((param: any) => ParamInput(param.name, param.type,param))}
      <Handle type="source" position={Position.Right} id="b" isConnectable={true} />
    </div>
  )
}



function BatchNorm2D() {
  let param1 = new Param("num_feature", "int");
  let param2 = new Param("eps", "float");
  let param3 = new Param("momentum", "float");
  let module = new Module([param1, param2, param3], "BatchNorm2D");
  // console.log(module.params);
  return NNmoduleToDiv(module);
}

function Conv1D() {

  let param1 = new Param("in_channel", "int");
  let param2 = new Param("out_channel", "int")
  let module = new Module([param1, param2], "Conv1D");
  // console.log(module.params);
  return NNmoduleToDiv(module);
}

function AvgPool2d() {
  let param1 = new Param("Kernel_size", "int");
  let param2 = new Param("stride", "int");
  let module = new Module([param1, param2], "AvgPool2d");
  // console.log(module.params);
  return NNmoduleToDiv(module);
}

function Conv2D() {
  let param1 = new Param("in_channel", "int");
  let param2 = new Param("out_channel", "int");
  let param3 = new Param("kernel_size", "int");
  let param4 = new Param("stride", "int")
  let module = new Module([param1, param2, param3, param4], "Conv2D");
  // console.log(module.params);
  return NNmoduleToDiv(module);
}



export {InputTensor, OutputTensor, Conv2D, AvgPool2d, BatchNorm2D, Conv1D, classdict};
