import { ComponentType, useCallback } from 'react';
import { Background, Handle, NodeProps, Position, useNodeId } from 'reactflow';
import { ClassInfo } from '../common/pythonObjectTypes';
import internal from 'stream';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';


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

function ParamInput(moduleName: any, nodeid: any, name: any, type: any, param: any, key: any) {
	const onChange = useCallback((evt: any) => {
		console.log(evt.target.value);
		param.value = evt.target.value;
	}, []);

	function onConnect(connection: any){
		const {source, sourceHandle, target, targetHandle} = connection
		param.value = source
	}

	// const onConnect = useCallback((evt: any) => {
	//   console.log(evt)
	// },[])

	let id_name: string = name as string
	let id_key: string = key as string

	return (
		<div key={name}>
			<span>{name}</span> <br />
			<input name="text" onChange={onChange} className="nodrag" />
			<Handle className="handle" type="target" onConnect={onConnect} id={moduleName + '-' + nodeid + '-' + id_name + '-' + id_key} position={Position.Left} style={{ top: (46 * key + 85) }} isConnectable={true} />
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

let classdict: { [key: string]: ClassInstance } = {}

function GetClassDict(){
	return classdict;
}

function InputTensor() {
	let nodeid = useNodeId()
	if (nodeid == null) {
		nodeid = "node0"
	} else if (!(nodeid in classdict)) {
		let classInstance = new ClassInstance("input", []);
		classdict[nodeid] = classInstance
	}


	function onConnect(connection: any){
		const {source, sourceHandle, target, targetHandle} = connection
	}

	return (
		<div className="const-node">
			<span className='Input Tensor'>Input Tensor</span>
			{/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
			<Handle className="handle" type="source" position={Position.Right} style={{ background: "#ff0" }} id="input" isConnectable={true} onConnect={onConnect}/>
		</div>
	);
}

function OutputTensor() {
	let nodeid = useNodeId()
	if (nodeid == null) {
		nodeid = "node0"
	} else if (!(nodeid in classdict)) {
		let classInstance = new ClassInstance("output", []);
		classdict[nodeid] = classInstance
	}

	function onConnect(connection: any){
		const {source, sourceHandle, target, targetHandle} = connection
	}

	return (
		<div className="const-node">
			<Handle className="handle" type="target" position={Position.Left} style={{ background: "#0ff" }} id="output" isConnectable={true} onConnect={onConnect} />
			<span className='Output Tensor'>Output Tensor</span>
			{/* <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable}/> */}
		</div>
	);
}

function NNmoduleToDiv(module: any) {

	let nodeid = useNodeId()
	let params = module.params
	let moduleName = module.name

	if (nodeid == null) {
		nodeid = "node1"
	} else if (!(nodeid in classdict)) {
		let classInstance = new ClassInstance(module.name, params);
		classdict[nodeid] = classInstance
	}



	return (
		<div>
			{classdict[nodeid].params.map((param: any, key: any) => ParamInput(moduleName, nodeid, param.name, param.type, param, key))}
		</div>
	)
}

function GenerateModuleFunction(classInfo: ClassInfo): ComponentType<NodeProps> {
	let nodeid = useNodeId()

	const initFunc = classInfo.functions.find(func => func.name === '__init__');
	if (!initFunc) {
		throw new Error(`__init__ function not found in ClassInfo`);
	}

	const params = initFunc.parameters.map(param => new Param(param.name, param.type_hint?.toString()));
	
	const moduleName:string = classInfo.name;

	function onConnect(connection: any){
		const {source, sourceHandle, target, targetHandle} = connection
		if(targetHandle.substring(targetHandle.length-3,targetHandle.length) == 'put'){
			return
		} else {
			let splitHandle:any = targetHandle.split('-')
			let key:number = splitHandle[splitHandle.length-1]
			// console.log(key)
			// console.log(classdict[target].params[key])
			classdict[target].params[key].value = source
		}
	}

	return function () {
		const module = new Module(params, moduleName);
		// return NNmoduleToDiv(module);
		const item: CollapseProps['items'] = [
			{
				label: moduleName,
				children: NNmoduleToDiv(module)
			}
		]
		return <div className="text-updater-node">
					<Handle className="handle" type="target" onConnect={onConnect} position={Position.Left} id={moduleName + '-' + nodeid + '-input'} style={{ top: 10, background: '#00ffff' }} isConnectable={true} />
						<Collapse items={item}/>
					<Handle className="handle" type="source" onConnect={onConnect} position={Position.Right} id={moduleName + '-' + nodeid + '-output'} style={{ top: 10, background: '#ffff00' }} isConnectable={true} />
				</div>
	};
}


function BatchNorm2D() {
let param1 = new Param("num_feature", "int");
let param2 = new Param("eps", "float");
let param3 = new Param("momentum", "float");
let module = new Module([param1, param2, param3], "BatchNorm2D");
// console.log(module.params);
return NNmoduleToDiv(module);
}

export { InputTensor, OutputTensor, GetClassDict, GenerateModuleFunction, BatchNorm2D };
