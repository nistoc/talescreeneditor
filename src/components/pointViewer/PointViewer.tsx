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
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
}

export const PointViewer: React.FC<PointViewerProps> = ({ 
  screens, 
  selectedScreenId, 
  firstScreenId,
  zoom,
  onZoomChange 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Filter out block screens
  const filteredScreens = screens.filter(screen => screen.type !== 'block');
  
  // Create flattened screens
  const flattenedScreens = createFlattenedScreens(filteredScreens);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    tooltip.style.backgroundColor = 'white';
    tooltip.style.padding = '8px';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.borderRadius = '4px';
    tooltip.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    tooltip.style.zIndex = '1000';
    tooltip.style.maxWidth = '200px';
    tooltip.style.fontSize = '14px';
    containerRef.current.appendChild(tooltip);
    tooltipRef.current = tooltip;

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
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': '#666',
            'width': 80,
            'height': 40,
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

    // Set initial zoom and fit
    cyRef.current.fit(cyRef.current.elements(), 50);
    cyRef.current.zoom(1.2);

    // Add zoom change listener
    cyRef.current.on('zoom', () => {
      if (onZoomChange && cyRef.current) {
        onZoomChange(cyRef.current.zoom());
      }
    });

    // Add tooltip event handlers
    cyRef.current.on('mouseover', 'node', (evt) => {
      const node = evt.target;
      const label = node.data('label');
      const position = node.position();
      const renderedPosition = node.renderedPosition();
      
      if (tooltipRef.current) {
        tooltipRef.current.innerHTML = label;
        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.left = `${renderedPosition.x + 50}px`;
        tooltipRef.current.style.top = `${renderedPosition.y - 20}px`;
      }
    });

    cyRef.current.on('mouseout', 'node', () => {
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
      }
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
      if (tooltipRef.current && tooltipRef.current.parentNode) {
        tooltipRef.current.parentNode.removeChild(tooltipRef.current);
      }
    };
  }, [flattenedScreens, selectedScreenId, onZoomChange]);

  // Handle zoom changes from parent
  useEffect(() => {
    if (cyRef.current && zoom !== undefined && zoom !== cyRef.current.zoom()) {
      cyRef.current.zoom(zoom);
    }
  }, [zoom]);

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
}; 