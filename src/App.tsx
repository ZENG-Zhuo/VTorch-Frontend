import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import Canvas from './Canvas/Canvas';
import Sider from './Sider/Sider'
import './App.css'

export default function App(){
    return(
        <div className='container'>
        <ReactFlowProvider>
            <div className='main' >
                <Sider />
                <Canvas />
            </div>
        </ReactFlowProvider>
        </div>
    );
}