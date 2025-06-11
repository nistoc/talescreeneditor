import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Screen } from '../../types/api.scenarios';
import { createFlattenedScreens } from './PointViewer.graphUtils';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { DagreLayoutOptions } from './PointViewer.cytoscape-dagre';

// Register the dagre layout
cytoscape.use(dagre);

interface PointViewerProps {
  screens: Screen[];
  selectedScreenId: string | null;
  firstScreenId: string;
}

export const PointViewer: React.FC<PointViewerProps> = ({ screens, selectedScreenId, firstScreenId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  // Filter out block screens
  const filteredScreens = screens.filter(screen => screen.type !== 'block');
  
  // Create flattened screens
  const flattenedScreens = createFlattenedScreens(filteredScreens);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Cytoscape
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: {
        nodes: flattenedScreens.map(screen => ({
          data: {
            id: screen.id,
            label: screen.label || screen.id,
            selected: screen.id === selectedScreenId
          }
        })),
        edges: flattenedScreens.flatMap(screen => 
          screen.downs.map(nextScreenId => ({
            data: {
              source: screen.id,
              target: nextScreenId
            }
          }))
        )
      },
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': '#666',
            'text-outline-color': '#fff',
            'text-outline-width': 2,
            'color': '#fff',
            'width': 'label',
            'height': 'label',
            'padding': '10px'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#ff0000'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#999',
            'target-arrow-color': '#999',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'dagre',
        rankDir: 'TB',
        padding: 50,
        spacingFactor: 1.5
      } as DagreLayoutOptions
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [flattenedScreens, selectedScreenId]);

  return (
    <Box sx={{ width: '100%', height: '600px' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
}; 