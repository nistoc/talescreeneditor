import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, List, Typography, Paper, Button, Tooltip } from '@mui/material';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { useParams } from 'react-router-dom';
import { useScenario } from '../../../api/scenarios';
import { ScreenItem } from './ScreenItem';
import { Player } from './Player';
import { MainCharacterSelector } from './MainCharacterSelector';
import { PointViewer } from '../../pointViewer/PointViewer';
import { ZoomSlider } from './ZoomSlider';

export const EditorTab: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const { data: scenario } = useScenario(scenarioId || '');

  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [expandedScreens, setExpandedScreens] = useState<Record<string, boolean>>({});
  const [editingScreenId, setEditingScreenId] = useState<string | null>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [graphZoom, setGraphZoom] = useState<number>(0.2);
  const [isBottomPanelCollapsed, setIsBottomPanelCollapsed] = useState<boolean>(false);

  const listRef = useRef<HTMLUListElement>(null);
  const bottomPanelRef = useRef<any>(null);

  React.useEffect(() => {
    if (scenario && scenario.characters) {
      setCharacters(scenario.characters);
    }
  }, [scenario]);

  React.useEffect(() => {
    if (scenario && scenario.firstScreenId && !selectedScreenId) {
      setSelectedScreenId(scenario.firstScreenId);
    }

    // Add effect to scroll to selected screen
    if (selectedScreenId && listRef.current) {
      const timeoutId = setTimeout(() => {
        const selectedElement = listRef.current?.querySelector(`[data-screen-id="${selectedScreenId}"]`);
        if (selectedElement && listRef.current) {
          const rect = selectedElement.getBoundingClientRect();
          const containerRect = listRef.current.getBoundingClientRect();

          // Check if element is not fully visible in the container
          const isNotFullyVisible =
            rect.top < containerRect.top ||
            rect.bottom > containerRect.bottom;

          if (isNotFullyVisible) {
            selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [scenario, selectedScreenId]);

  // Инициализация состояния кнопки на основе реального состояния панели
  React.useEffect(() => {
    if (bottomPanelRef.current) {
      // Проверяем состояние панели после небольшой задержки, чтобы дать время на восстановление из localStorage
      const timeoutId = setTimeout(() => {
        if (bottomPanelRef.current) {
          const isCollapsed = bottomPanelRef.current.isCollapsed();
          setIsBottomPanelCollapsed(isCollapsed);
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const handleScreenSelect = (screenId: string) => {
    setSelectedScreenId(screenId);
  };

  const handleScreenExpand = (screenId: string, childScreenIds: string[]) => {
    setExpandedScreens(prev => {
      const newState = { ...prev };

      if (newState[screenId] && childScreenIds.includes(selectedScreenId as string)) {
        // If we're collapsing, make sure the parent screen becomes selected
        console.log('Collapsing screen, selecting parent:', screenId);
        setSelectedScreenId(screenId);
      }
      newState[screenId] = !newState[screenId];
      return newState;
    });
  };

  const handleScreenEdit = (screenId: string) => {
    setEditingScreenId(screenId);
    setSelectedScreenId(screenId);
  };

  const handleZoomChange = (newZoom: number) => {
    setGraphZoom(newZoom);
  };

  const handleToggleBottomPanel = () => {
    if (bottomPanelRef.current) {
      if (isBottomPanelCollapsed) {
        bottomPanelRef.current.expand();
      } else {
        bottomPanelRef.current.collapse();
      }
      setIsBottomPanelCollapsed(!isBottomPanelCollapsed);
    }
  };

  if (!scenario) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <PanelGroup direction="vertical" autoSaveId="editor-vertical-layout">
        {/* Верхняя вертикальная панель 80% высоты */}
        <Panel defaultSize={80} minSize={20}>
          <PanelGroup direction="horizontal" autoSaveId="editor-horizontal-layout">
            {/* Левая горизонтальная панель 20% ширины, сворачиваемая до 20px */}
            <Panel defaultSize={20} minSize={2} collapsible={true} collapsedSize={2} style={{ padding: '2px'}}>
              <Paper
                sx={{
                  height: '100%',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Player
                  screens={scenario.screens}
                  selectedScreenId={selectedScreenId}
                  characters={characters}
                  selectedCharacterId={selectedCharacterId}
                  scenarioId={scenarioId || ''}
                />
                <MainCharacterSelector
                  characters={characters}
                  selectedCharacterId={selectedCharacterId}
                  onSelectCharacter={setSelectedCharacterId}
                  scenarioId={scenarioId || null}
                />
              </Paper>
            </Panel>

            <PanelResizeHandle style={{ width: '4px', backgroundColor: '#f8f9fa' }} />

            {/* Центральная горизонтальная панель 60% */}
            <Panel defaultSize={60} minSize={20} style={{padding: '2px'}}>
              <Paper
                sx={{
                  height: '100%',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'none'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, margin: '3px' }}>
                  <Typography variant="h6">
                    Сценарии
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'horizontal', gap: 5 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Дерево сценария">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleToggleBottomPanel}
                          sx={{
                            opacity: isBottomPanelCollapsed ? 0.5 : 1,
                            transition: 'opacity 0.2s ease-in-out'
                          }}
                        >
                          🌳
                        </Button>
                      </Tooltip>
                      <Button size="small" variant="outlined">Кнопка 2</Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">Кнопка 3</Button>
                      <Button size="small" variant="outlined">Кнопка 4</Button>
                    </Box>
                  </Box>
                </Box>
                <Box ref={listRef} sx={{ flex: 1, overflow: 'auto' }}>
                  <List>
                    {scenario.screens
                      .filter(screen => screen.type !== 'block')
                      .map((screen) => (
                        <ScreenItem
                          key={screen.id}
                          screen={screen}
                          level={0}
                          isSelected={selectedScreenId === screen.id}
                          isEditing={editingScreenId === screen.id}
                          isExpanded={expandedScreens[screen.id] || false}
                          selectedScreenId={selectedScreenId}
                          onSelect={handleScreenSelect}
                          onEdit={handleScreenEdit}
                          onExpand={handleScreenExpand}
                          scenarioId={scenarioId || ''}
                        />
                      ))}
                  </List>
                </Box>
              </Paper>
            </Panel>

            <PanelResizeHandle style={{ width: '4px', backgroundColor: '#f8f9fa' }} />

            {/* Правая горизонтальная панель 20% ширины, сворачиваемая до 20px */}
            <Panel defaultSize={20} minSize={2} collapsible={true} collapsedSize={2} style={{ padding: '2px'}}>
              <Paper
                sx={{
                  height: '100%',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <MainCharacterSelector
                    characters={characters}
                    selectedCharacterId={selectedCharacterId}
                    onSelectCharacter={setSelectedCharacterId}
                    scenarioId={scenarioId || null}
                  />
                </Box>
              </Paper>
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle style={{ height: '4px', backgroundColor: '#f8f9fa' }} />

        {/* Нижняя вертикальная панель 20% высоты, сворачиваемая до 20px */}
        <Panel
          ref={bottomPanelRef}
          defaultSize={20}
          minSize={2}
          collapsible={true}
          collapsedSize={2}
          onCollapse={() => setIsBottomPanelCollapsed(true)}
          onExpand={() => setIsBottomPanelCollapsed(false)}
          style={{ padding: '2px'}}
        >
          <Paper
            sx={{
              height: '100%',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              position: 'relative'
            }}
          >
            <Box sx={{ flex: 1, margin: '2px', position: 'relative' }}>
              <PointViewer
                screens={scenario.screens}
                selectedScreenId={selectedScreenId || scenario.firstScreenId}
                zoom={graphZoom}
                onNodeClick={handleScreenSelect}
              />
              {/* Zoom контрол поверх графа */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 1,
                  p: 1,
                  boxShadow: 1,
                  zIndex: 10
                }}
              >
                <ZoomSlider value={graphZoom} onChange={handleZoomChange} />
              </Box>
            </Box>
          </Paper>
        </Panel>
      </PanelGroup>
    </Box>
  );
}; 