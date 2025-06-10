import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import ReactFlow, { Node, Edge, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { Screen } from '../../../types/api.scenarios';

interface PointViewerProps {
  screens: Screen[];
  selectedScreenId: string | null;
}

export const PointViewer: React.FC<PointViewerProps> = ({ screens, selectedScreenId }) => {
  // Filter out block screens
  const filteredScreens = screens.filter(screen => screen.type !== 'block');

  // Convert screens to nodes and edges
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = filteredScreens.map((screen) => ({
      id: screen.id,
      data: { 
        label: screen.type === 'scene' ? screen.title : screen.content.substring(0, 30) + '...'
      },
      position: { x: 0, y: 0 }, // You might want to calculate positions based on hierarchy
      style: {
        background: selectedScreenId === screen.id ? '#1976d2' : '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
      },
    }));

    const edges: Edge[] = filteredScreens
      .filter(screen => screen.next)
      .map((screen) => ({
        id: `${screen.id}-${screen.next}`,
        source: screen.id,
        target: screen.next!,
        type: 'smoothstep',
      }));

    return { nodes, edges };
  }, [filteredScreens, selectedScreenId]);

  return (
    <Box sx={{ p: 2, height: '500px' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Screen Hierarchy
      </Typography>
      <Box sx={{ height: '100%', border: '1px solid #ccc', borderRadius: '4px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </Box>
    </Box>
  );
}; 