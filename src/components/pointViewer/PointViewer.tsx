import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Screen } from '../../types/api.scenarios';
import { createFlattenedScreens } from './PointViewer.graphUtils';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { DagreLayoutOptions } from './PointViewer.cytoscape-dagre';
import { getScreenTypeEmoji } from '../../services/screenUtils';

// Register the dagre layout
cytoscape.use(dagre);

interface PointViewerProps {
  screens: Screen[];
  selectedScreenId: string;
  zoom?: number;
  onNodeClick?: (nodeId: string) => void;
}

interface GraphState {
  zoom: number;
  pan: { x: number; y: number };
}

export const PointViewer: React.FC<PointViewerProps> = ({
  screens,
  selectedScreenId,
  zoom,
  onNodeClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const debugTooltipRef = useRef<HTMLDivElement | null>(null);
  const [graphState, setGraphState] = useState<GraphState>({
    zoom: 0.2,
    pan: { x: 0, y: 0 },
  });
  const clickedNodeRef = useRef<string | null>(null);

  // Filter out block screens
  const filteredScreens = screens.filter(screen => screen.type !== 'block');

  // Create flattened screens
  const flattenedScreens = createFlattenedScreens(filteredScreens);

  useEffect(() => {
    if (!containerRef.current) return;

    // Store ref value to use in cleanup
    const container = containerRef.current;

    // Create debug tooltip element
    const debugTooltip = document.createElement('div');
    debugTooltip.style.position = 'absolute';
    debugTooltip.style.bottom = '10px';
    debugTooltip.style.left = '10px';
    debugTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    debugTooltip.style.color = 'white';
    debugTooltip.style.padding = '8px';
    debugTooltip.style.borderRadius = '4px';
    debugTooltip.style.fontSize = '12px';
    debugTooltip.style.zIndex = '1000';
    debugTooltip.style.fontFamily = 'monospace';
    debugTooltip.style.pointerEvents = 'none';
    debugTooltip.style.display = 'block';
    container.appendChild(debugTooltip);
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
    container.appendChild(tooltip);
    tooltipRef.current = tooltip;

    // Function to update debug tooltip content
    const updateDebugTooltip = () => {
      if (cyRef.current && debugTooltipRef.current) {
        const currentPan = cyRef.current.pan();
        const selectedNodes = cyRef.current.$('node:selected');
        debugTooltipRef.current.innerHTML = `Pan: x=${Math.round(currentPan.x)}, y=${Math.round(currentPan.y)}<br>Selected nodes: ${selectedNodes.length}`;
      }
    };

    // Initialize Cytoscape
    cyRef.current = cytoscape({
      container: container,
      elements: {
        nodes: flattenedScreens.map(screen => ({
          data: {
            id: screen.id,
            label: `${getScreenTypeEmoji(screen.type)} ${screen.label || screen.id}`,
            selected: screen.id === selectedScreenId,
            type: screen.type
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
            'content': getScreenTypeEmoji('-'),
            'width': 5,
            'height': 5,
            'padding': '20px',
            'font-size': '60px',
            'background-opacity': 0.5,
            'background-color': 'none',
            'border-width': 0,
            'border-color': 'none',
          }
        },
        {
          selector: 'node:selected',
          style: {
            'background-opacity': 1,
            'width': 90,
            'height': 90,
          }
        },
        {
          selector: 'node.scene',
          style: {
            'content': getScreenTypeEmoji('scene'),
          }
        },
        {
          selector: 'node.cutscene',
          style: {
            'content': getScreenTypeEmoji('cutscene'),
          }
        },
        {
          selector: 'node.narrative',
          style: {
            'content': getScreenTypeEmoji('narrative'),
          }
        },
        {
          selector: 'node.dialog',
          style: {
            'content': getScreenTypeEmoji('dialog'),
          }
        },
        {
          selector: 'node.choice',
          style: {
            'content': getScreenTypeEmoji('choice'),
          }
        },
        {
          selector: 'node.final',
          style: {
            'content': getScreenTypeEmoji('final'),
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
        //padding: 20,
        spacingFactor: 1.1
      } as DagreLayoutOptions,
      // Disable zooming gestures
      userZoomingEnabled: false,
      userPanningEnabled: true,
      boxSelectionEnabled: false
    });

    cyRef.current.zoom(graphState.zoom);
    cyRef.current.pan(graphState.pan);
    

    // Add pan change listener
    cyRef.current.on('pan', updateDebugTooltip);

    // Handle pan end
    const handlePanEnd = () => {
      if (cyRef.current) {
        const newPan = cyRef.current.pan();
        setGraphState(prev => ({ ...prev, pan: newPan }));
      }
    };

    container.addEventListener('mouseup', handlePanEnd);

    // Add scroll event listener for vertical panning
    const handleScroll = (event: WheelEvent) => {
      if (cyRef.current) {
        event.preventDefault();
        const currentPan = cyRef.current.pan();
        const deltaY = -event.deltaY;
        cyRef.current.pan({
          x: currentPan.x,
          y: currentPan.y + deltaY / 2
        });
      }
    };
    container.addEventListener('wheel', handleScroll, { passive: false });

    // Add tooltip event handlers
    cyRef.current.on('mouseover', 'node', (evt) => {
      const node = evt.target;
      const label = node.data('label');
      const renderedPosition = node.renderedPosition();
      const containerRect = container.getBoundingClientRect();
      const containerCenterX = containerRect.width / 2;
      const isLeftSide = renderedPosition.x < containerCenterX;

      if (tooltipRef.current) {
        tooltipRef.current.innerHTML = label + renderedPosition.x + " " + containerCenterX;
        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.left = '0px';
        tooltipRef.current.style.right = '0px';
        if(isLeftSide){
          tooltipRef.current.style.left = `${renderedPosition.x + 50}px`;
        }else{
          tooltipRef.current.style.right = `${-50}px`;
        }
        tooltipRef.current.style.top = `${renderedPosition.y + 20}px`;
      }
    });

    cyRef.current.on('mouseout', 'node', (evt) => {
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
      }
    });

    // Add click handler for nodes
    cyRef.current.on('tap', 'node', (evt) => {
      const nodeId = evt.target.id();
      clickedNodeRef.current = nodeId;
      if (onNodeClick) {
        onNodeClick(nodeId);
      }
    });

    cyRef.current.nodes().forEach(node => {
      node.addClass(node.data('type'));
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
      container.removeEventListener('wheel', handleScroll);
      container.removeEventListener('mouseup', handlePanEnd); // Clean up mouseup listener
    };
  }, []);

  // Update selected node when selectedScreenId changes
  useEffect(() => {
    if (!cyRef.current) return;

    if (zoom !== undefined && zoom !== cyRef.current.zoom()) {
      // Apply zoom
      cyRef.current.zoom(zoom);
      setGraphState(prev => ({ ...prev, zoom }));
    }
    
    // Deselect all nodes first
    cyRef.current.$('node:selected').unselect();
    const node = cyRef.current.getElementById(selectedScreenId);
    if (node.length > 0) {
      node.select();
      // Only center if the selection wasn't triggered by a click
      if (clickedNodeRef.current !== selectedScreenId) {
        cyRef.current.animate({
          center: {
            eles: node
          } as any,
          duration: 500,
          easing: 'ease-in-out-cubic'
        });
      }
      // Reset the clicked node reference
      clickedNodeRef.current = null;
    }
  }, [zoom, selectedScreenId]);

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
}; 