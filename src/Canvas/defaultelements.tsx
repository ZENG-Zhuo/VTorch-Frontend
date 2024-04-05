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
    { id: 'edge1-2', source: 'node1', target: 'node2',style: { strokeWidth: 3 }},
    { id: 'edge2-4', source: 'node2', target: 'node4',style: { strokeWidth: 3 }},
    { id: 'edge1-3', source: 'node1', target: 'node3',style: { strokeWidth: 3 }},
    { id: 'edge4-5', source: 'node4', target: 'node5',style: { strokeWidth: 3 }},
    { id: 'edge3-5', source: 'node3', target: 'node5',style: { strokeWidth: 3 }},
    { id: 'edge5-6', source: 'node5', target: 'node6',style: { strokeWidth: 3 }},
    { id: 'edge6-7', source: 'node6', target: 'node7',style: { strokeWidth: 3 }},
  ];

  export {initialNodes, initialEdges};