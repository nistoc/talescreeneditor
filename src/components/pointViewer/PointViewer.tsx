import React, { useEffect, useRef, useState } from 'react';
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

interface GraphState {
  zoom: number;
  pan: { x: number; y: number };
  isInitialRender: boolean;
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
  const debugTooltipRef = useRef<HTMLDivElement | null>(null);
  const [graphState, setGraphState] = useState<GraphState>({
    zoom: 0.2,
    pan: { x: 0, y: 0 },
    isInitialRender: true
  });

  // Filter out block screens
  const filteredScreens = screens.filter(screen => screen.type !== 'block');
  
  // Create flattened screens
  const flattenedScreens = createFlattenedScreens(filteredScreens);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create debug tooltip element
    const debugTooltip = document.createElement('div');
    debugTooltip.style.position = 'absolute';
    debugTooltip.style.top = '10px';
    debugTooltip.style.left = '10px';
    debugTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    debugTooltip.style.color = 'white';
    debugTooltip.style.padding = '8px';
    debugTooltip.style.borderRadius = '4px';
    debugTooltip.style.fontSize = '12px';
    debugTooltip.style.zIndex = '1000';
    debugTooltip.style.fontFamily = 'monospace';
    containerRef.current.appendChild(debugTooltip);
    debugTooltipRef.current = debugTooltip;

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
        //padding: 50,
        spacingFactor: 1.1
      } as DagreLayoutOptions,
      // Disable zooming gestures
      userZoomingEnabled: false,
      userPanningEnabled: true,
      boxSelectionEnabled: false
    });

    // Set initial zoom and fit if no saved state
    if (graphState.isInitialRender) {
      cyRef.current.zoom(0.2);

      let centeringObject: any = null;
      if(firstScreenId) {
        centeringObject = cyRef.current.getElementById(firstScreenId);
      } else {
        centeringObject = cyRef.current.elements();
      }
      cyRef.current.fit(centeringObject, 250);
      
      setGraphState(prev => ({ ...prev, isInitialRender: false }));
    } else {
      // Restore saved state
      cyRef.current.zoom(graphState.zoom);
      cyRef.current.pan(graphState.pan);
    }

    // Add pan change listener
    cyRef.current.on('pan', () => {
      if (cyRef.current && debugTooltipRef.current) {
        const currentPan = cyRef.current.pan();
        debugTooltipRef.current.innerHTML = `Pan: x=${Math.round(currentPan.x)}, y=${Math.round(currentPan.y)}`;
      }
    });

    cyRef.current.on('panend', () => {
      if (cyRef.current) {
        const newPan = cyRef.current.pan();
        setGraphState(prev => ({ ...prev, pan: newPan }));
      }
    });

    // Add scroll event listener for vertical panning
    const handleScroll = (event: WheelEvent) => {
      if (cyRef.current) {
        event.preventDefault();
        const currentPan = cyRef.current.pan();
        const deltaY = -event.deltaY;
        cyRef.current.pan({
          x: currentPan.x,
          y: currentPan.y + deltaY
        });
      }
    };

    containerRef.current.addEventListener('wheel', handleScroll, { passive: false });

    // Add tooltip event handlers
    cyRef.current.on('mouseover', 'node', (evt) => {
      const node = evt.target;
      const label = node.data('label');
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
      if (debugTooltipRef.current && debugTooltipRef.current.parentNode) {
        debugTooltipRef.current.parentNode.removeChild(debugTooltipRef.current);
      }
      if (containerRef.current) {
        containerRef.current.removeEventListener('wheel', handleScroll);
      }
    };
  }, [flattenedScreens, selectedScreenId]);

  // Handle zoom changes from parent
  useEffect(() => {
    if (cyRef.current && zoom !== undefined && zoom !== cyRef.current.zoom()) {
      // Store current selection before zoom
      const selectedNodes = cyRef.current.$('node:selected');
      
      // Apply zoom
      cyRef.current.zoom(zoom);
      setGraphState(prev => ({ ...prev, zoom }));
      
      // Restore selection after zoom
      selectedNodes.select();
    }
  }, [zoom]);

  // Update selected node when selectedScreenId changes
  useEffect(() => {
    if (cyRef.current) {
      // Deselect all nodes first
      cyRef.current.$('node:selected').unselect();
      
      // Select the new node if selectedScreenId is provided
      if (selectedScreenId) {
        const node = cyRef.current.getElementById(selectedScreenId);
        if (node.length > 0) {
          node.select();
        }
      }
    }
  }, [selectedScreenId]);

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
}; 