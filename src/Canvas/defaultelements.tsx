import {Node} from "reactflow"

const initialNodes: Node[] = [
    {
      id: 'node1',
      type: 'Input',
      data: {},
      position: {x:-200, y:0}
      
    },
    { id: 'node2', 
      type: 'Conv2d', 
      data: {},
      position: { x: 0, y: -200 }
    },
    { id: 'node3', 
      type: 'Conv2d', 
      data: {},
      position: { x: 0, y: 600 }
    },
    { id: 'node4', 
      type: 'Conv2d', 
      data: {},
      position: { x: 300, y: -200 }
    },
    {
      id: 'node5',
      type: 'AvgPool2d',
      data: {},
      position: { x: 600, y: 0 }
    },
    {
      id: 'node6',
      type: 'ReLU',
      data: {},
      position: { x: 900, y: 0 }
    },
    {
      id: 'node7',
      type: 'Output',
      data: {},
      position: { x: 1200, y: 0 }
    },
  ];
  
  
  const initialEdges = [
    { id: 'edge1-2_flow', source: 'node1',sourceHandle:'input', target: 'node2', targetHandle:'Conv2d-node2-input' ,style: { strokeWidth: 3 }},
    { id: 'edge2-4_flow', source: 'node2',sourceHandle:'Conv2d-node2-output', target: 'node4', targetHandle:'Conv2d-node4-input' ,style: { strokeWidth: 3 }},
    { id: 'edge1-3_flow', source: 'node1',sourceHandle:'input', target: 'node3', targetHandle:'Conv2d-node3-input' ,style: { strokeWidth: 3 }},
    { id: 'edge4-5_flow', source: 'node4',sourceHandle:'Conv2d-node4-output', target: 'node5',targetHandle:'AvgPool2d-node5-input', style: { strokeWidth: 3 }},
    { id: 'edge3-5_flow', source: 'node3',sourceHandle:'Conv2d-node3-output', target: 'node5',targetHandle:'AvgPool2d-node5-input',style: { strokeWidth: 3 }},
    { id: 'edge5-6_flow', source: 'node5',sourceHandle:'AvgPool2d-node5-output' ,target: 'node6',targetHandle:'ReLU-node6-input' ,style: { strokeWidth: 3 }},
    { id: 'edge6-7_flow', source: 'node6', sourceHandle:"ReLU-node6-output", target: 'node7', targetHandle:"output", style: { strokeWidth: 3 }},
  ];

  export {initialNodes, initialEdges};