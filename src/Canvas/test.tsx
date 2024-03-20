import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
 
function Conv1d(){ 
	const onChange = useCallback((evt: any) => { 
		console.log(evt.target.value); 
	}, []); 

	return( 
		<div className="text-updater-node"> 
			<Handle type="target" position={Position.Left} isConnectable={true}/> 
			<span className='Conv1d-updater-node'> Conv1d </span> 
			<br/> 
			<div>
				<span>in_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>out_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>kernel_size: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>stride: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>dilation: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>groups: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>bias: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding_mode: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<Handle type='source' position={Position.Right} id='b' isConnectable={true}/>
		</div> 
	); 
}

 
function Conv2d(){ 
	const onChange = useCallback((evt: any) => { 
		console.log(evt.target.value); 
	}, []); 

	return( 
		<div className="text-updater-node"> 
			<Handle type="target" position={Position.Left} isConnectable={true}/> 
			<span className='Conv2d-updater-node'> Conv2d </span> 
			<br/> 
			<div>
				<span>in_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>out_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>kernel_size: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>stride: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>dilation: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>groups: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>bias: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding_mode: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<Handle type='source' position={Position.Right} id='b' isConnectable={true}/>
		</div> 
	); 
}

 
function Conv3d(){ 
	const onChange = useCallback((evt: any) => { 
		console.log(evt.target.value); 
	}, []); 

	return( 
		<div className="text-updater-node"> 
			<Handle type="target" position={Position.Left} isConnectable={true}/> 
			<span className='Conv3d-updater-node'> Conv3d </span> 
			<br/> 
			<div>
				<span>in_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>out_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>kernel_size: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>stride: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>dilation: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>groups: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>bias: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding_mode: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<Handle type='source' position={Position.Right} id='b' isConnectable={true}/>
		</div> 
	); 
}

 
function ConvTranspose1d(){ 
	const onChange = useCallback((evt: any) => { 
		console.log(evt.target.value); 
	}, []); 

	return( 
		<div className="text-updater-node"> 
			<Handle type="target" position={Position.Left} isConnectable={true}/> 
			<span className='ConvTranspose1d-updater-node'> ConvTranspose1d </span> 
			<br/> 
			<div>
				<span>in_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>out_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>kernel_size: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>stride: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>output_padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>groups: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>bias: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>dilation: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding_mode: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<Handle type='source' position={Position.Right} id='b' isConnectable={true}/>
		</div> 
	); 
}

 
function ConvTranspose2d(){ 
	const onChange = useCallback((evt: any) => { 
		console.log(evt.target.value); 
	}, []); 

	return( 
		<div className="text-updater-node"> 
			<Handle type="target" position={Position.Left} isConnectable={true}/> 
			<span className='ConvTranspose2d-updater-node'> ConvTranspose2d </span> 
			<br/> 
			<div>
				<span>in_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>out_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>kernel_size: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>stride: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>output_padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>groups: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>bias: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>dilation: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding_mode: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<Handle type='source' position={Position.Right} id='b' isConnectable={true}/>
		</div> 
	); 
}

 
function ConvTranspose3d(){ 
	const onChange = useCallback((evt: any) => { 
		console.log(evt.target.value); 
	}, []); 

	return( 
		<div className="text-updater-node"> 
			<Handle type="target" position={Position.Left} isConnectable={true}/> 
			<span className='ConvTranspose3d-updater-node'> ConvTranspose3d </span> 
			<br/> 
			<div>
				<span>in_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>out_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>kernel_size: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>stride: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>output_padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>groups: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>bias: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>dilation: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding_mode: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<Handle type='source' position={Position.Right} id='b' isConnectable={true}/>
		</div> 
	); 
}

 
function LazyConv1d(){ 
	const onChange = useCallback((evt: any) => { 
		console.log(evt.target.value); 
	}, []); 

	return( 
		<div className="text-updater-node"> 
			<Handle type="target" position={Position.Left} isConnectable={true}/> 
			<span className='LazyConv1d-updater-node'> LazyConv1d </span> 
			<br/> 
			<div>
				<span>out_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>kernel_size: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>stride: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>dilation: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>groups: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>bias: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding_mode: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<Handle type='source' position={Position.Right} id='b' isConnectable={true}/>
		</div> 
	); 
}

 
function LazyConv2d(){ 
	const onChange = useCallback((evt: any) => { 
		console.log(evt.target.value); 
	}, []); 

	return( 
		<div className="text-updater-node"> 
			<Handle type="target" position={Position.Left} isConnectable={true}/> 
			<span className='LazyConv2d-updater-node'> LazyConv2d </span> 
			<br/> 
			<div>
				<span>out_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>kernel_size: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>stride: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>dilation: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>groups: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>bias: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding_mode: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<Handle type='source' position={Position.Right} id='b' isConnectable={true}/>
		</div> 
	); 
}

 
function LazyConv3d(){ 
	const onChange = useCallback((evt: any) => { 
		console.log(evt.target.value); 
	}, []); 

	return( 
		<div className="text-updater-node"> 
			<Handle type="target" position={Position.Left} isConnectable={true}/> 
			<span className='LazyConv3d-updater-node'> LazyConv3d </span> 
			<br/> 
			<div>
				<span>out_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>kernel_size: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>stride: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>dilation: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>groups: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>bias: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding_mode: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<Handle type='source' position={Position.Right} id='b' isConnectable={true}/>
		</div> 
	); 
}

 
function LazyConvTranspose1d(){ 
	const onChange = useCallback((evt: any) => { 
		console.log(evt.target.value); 
	}, []); 

	return( 
		<div className="text-updater-node"> 
			<Handle type="target" position={Position.Left} isConnectable={true}/> 
			<span className='LazyConvTranspose1d-updater-node'> LazyConvTranspose1d </span> 
			<br/> 
			<div>
				<span>out_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>kernel_size: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>stride: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>output_padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>groups: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>bias: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>dilation: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding_mode: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<Handle type='source' position={Position.Right} id='b' isConnectable={true}/>
		</div> 
	); 
}

 
function LazyConvTranspose2d(){ 
	const onChange = useCallback((evt: any) => { 
		console.log(evt.target.value); 
	}, []); 

	return( 
		<div className="text-updater-node"> 
			<Handle type="target" position={Position.Left} isConnectable={true}/> 
			<span className='LazyConvTranspose2d-updater-node'> LazyConvTranspose2d </span> 
			<br/> 
			<div>
				<span>out_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>kernel_size: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>stride: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>output_padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>groups: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>bias: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>dilation: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding_mode: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<Handle type='source' position={Position.Right} id='b' isConnectable={true}/>
		</div> 
	); 
}

 
function LazyConvTranspose3d(){ 
	const onChange = useCallback((evt: any) => { 
		console.log(evt.target.value); 
	}, []); 

	return( 
		<div className="text-updater-node"> 
			<Handle type="target" position={Position.Left} isConnectable={true}/> 
			<span className='LazyConvTranspose3d-updater-node'> LazyConvTranspose3d </span> 
			<br/> 
			<div>
				<span>out_channels: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>kernel_size: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>stride: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>output_padding: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>groups: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>bias: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>dilation: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<div>
				<span>padding_mode: </span> <br/> 
				<input name='text' onChange={onChange} className='nodrag' defaultValue={'None'}/>
			</div> 
			<Handle type='source' position={Position.Right} id='b' isConnectable={true}/>
		</div> 
	); 
}

 
export {Conv1d, Conv2d, Conv3d, ConvTranspose1d, ConvTranspose2d, ConvTranspose3d, LazyConv1d, LazyConv2d, LazyConv3d, LazyConvTranspose1d, LazyConvTranspose2d, LazyConvTranspose3d}