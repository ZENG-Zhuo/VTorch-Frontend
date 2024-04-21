import {Edge, Node} from "reactflow"
import { MarkerType } from "reactflow";

const initialNodes: Node[] = [
    // {
    //   id: 'node1',
    //   type: 'Input',
    //   data: {},
    //   position: {x:-200, y:0}
      
    // },
    // { id: 'node2', 
    //   type: 'Conv2d', 
    //   data: {},
    //   position: { x: 0, y: -200 }
    // },
    // { id: 'node3', 
    //   type: 'Conv2d', 
    //   data: {},
    //   position: { x: 0, y: 600 }
    // },
    // { id: 'node4', 
    //   type: 'Conv2d', 
    //   data: {},
    //   position: { x: 300, y: -200 }
    // },
    // {
    //   id: 'node5',
    //   type: 'AvgPool2d',
    //   data: {},
    //   position: { x: 600, y: 0 }
    // },
    // {
    //   id: 'node6',
    //   type: 'ReLU',
    //   data: {},
    //   position: { x: 900, y: 0 }
    // },
    // {
    //   id: 'node7',
    //   type: 'Output',
    //   data: {},
    //   position: { x: 1200, y: 0 }
    // },
  ];
  
  
  const initialEdges: Edge[] = [
    // { id: 'edge1-2_flow', source: 'node1',sourceHandle:'input',
    //  target: 'node2', targetHandle:'Conv2d-node2-fwd-input-0' ,
    //  style: { strokeWidth: 3 },markerEnd: {type: MarkerType.ArrowClosed}},
     
    // { id: 'edge2-4_flow', source: 'node2',sourceHandle:'Conv2d-node2-fwd-output-0',
    //  target: 'node4', targetHandle:'Conv2d-node4-fwd-input-0' ,
    //  style: { strokeWidth: 3 },markerEnd: {type: MarkerType.ArrowClosed}},

    // { id: 'edge1-3_flow', source: 'node1',sourceHandle:'input',
    //  target: 'node3', targetHandle:'Conv2d-node3-fwd-input-0' ,
    //  style: { strokeWidth: 3 },markerEnd: {type: MarkerType.ArrowClosed}},

    // { id: 'edge4-5_flow', source: 'node4',sourceHandle:'Conv2d-node4-fwd-output-0',
    //  target: 'node5',targetHandle:'AvgPool2d-node5-fwd-input-0',
    //   style: { strokeWidth: 3 },markerEnd: {type: MarkerType.ArrowClosed}},

    // { id: 'edge3-5_flow', source: 'node3',sourceHandle:'Conv2d-node3-fwd-output-0',
    //  target: 'node5',targetHandle:'AvgPool2d-node5-fwd-input-0',
    //  style: { strokeWidth: 3 },markerEnd: {type: MarkerType.ArrowClosed}},

    // { id: 'edge5-6_flow', source: 'node5',sourceHandle:'AvgPool2d-node5-fwd-output-0' ,
    // target: 'node6',targetHandle:'ReLU-node6-fwd-input-0' ,
    // style: { strokeWidth: 3 },markerEnd: {type: MarkerType.ArrowClosed}},

    // { id: 'edge6-7_flow', source: 'node6', sourceHandle:"ReLU-node6-fwd-output-0",
    //  target: 'node7', targetHandle:"output",
    //   style: { strokeWidth: 3},markerEnd: {type: MarkerType.ArrowClosed}},
  ];

  export {initialNodes, initialEdges};