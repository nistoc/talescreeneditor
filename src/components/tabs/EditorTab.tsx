import React, { useState, useRef } from 'react';
import { Box, List, Typography, Paper, Button, Tooltip } from '@mui/material';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { useParams } from 'react-router-dom';
import { useScenario } from '../../api/scenarios';
import { ScreenItem } from './ScreenItem';
import { ScreenViewMode } from '../screenitems/index';
import { Player } from '../Player';
import { MainCharacterSelector } from '../MainCharacterSelector';
import { PointViewer } from '../pointViewer/PointViewer';
import { ZoomSlider } from '../ZoomSlider';
import {
  getScenarioData,
  saveSelectedScreenId,
  saveExpandedScreens,
  saveSelectedCharacterId,
  saveViewMode,
} from '../../services/localStorageUtils';

export const EditorTab: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const { data: scenario } = useScenario(scenarioId || '');

  // Получаем данные из localStorage при инициализации
  const scenarioData = getScenarioData(scenarioId || '');

  // Инициализация состояний с учетом localStorage
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(scenarioData.selectedScreenId);
  const [expandedScreens, setExpandedScreens] = useState<Record<string, boolean>>(scenarioData.expandedScreens);
  const [editingScreenId, setEditingScreenId] = useState<string | null>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(scenarioData.selectedCharacterId);
  const [graphZoom, setGraphZoom] = useState<number>(0.2);
  const [isBottomPanelCollapsed, setIsBottomPanelCollapsed] = useState<boolean>(false);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState<boolean>(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ScreenViewMode>((scenarioData.viewMode as ScreenViewMode) || ScreenViewMode.COMPACT,);
  const listRef = useRef<HTMLUListElement>(null);
  const bottomPanelRef = useRef<any>(null);
  const leftPanelRef = useRef<any>(null);
  const rightPanelRef = useRef<any>(null);

  React.useEffect(() => {
    if (scenario && scenario.characters) {
      setCharacters(scenario.characters);
    }
  }, [scenario]);

  React.useEffect(() => {
    if (scenario && scenario.firstScreenId && !selectedScreenId) {
      setSelectedScreenId(scenario.firstScreenId);
      saveSelectedScreenId(scenarioId || '', scenario.firstScreenId);
    }

    // Add effect to scroll to selected screen
    if (selectedScreenId && listRef.current) {
      const timeoutId = setTimeout(() => {
        const selectedElement = listRef.current?.querySelector(`[data-screen-id="${selectedScreenId}"]`);
        if (selectedElement && listRef.current) {

          let needToScrollSelectedElement = true;
          if (viewMode === ScreenViewMode.COMPACT) {
            const rect = selectedElement.getBoundingClientRect();
            const containerRect = listRef.current.getBoundingClientRect();

            // Check if element is not fully visible in the container
            needToScrollSelectedElement =
              rect.top < containerRect.top ||
              rect.bottom > containerRect.bottom;
          }
          if (needToScrollSelectedElement) {
            selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [scenario, selectedScreenId, scenarioId, viewMode]);

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

  // Очистка localStorage при изменении scenarioId или размонтировании компонента
  React.useEffect(() => {
    return () => {
      // При размонтировании компонента можно очистить данные, если нужно
      // Но лучше оставить их для возможности восстановления состояния
    };
  }, [scenarioId]);

  const handleScreenSelect = (screenId: string) => {
    setSelectedScreenId(screenId);
    saveSelectedScreenId(scenarioId || '', screenId);
  };

  const handleScreenExpand = (screenId: string, childScreenIds: string[]) => {
    setExpandedScreens(prev => {
      const newState = { ...prev };

      if (newState[screenId] && childScreenIds.includes(selectedScreenId as string)) {
        // If we're collapsing, make sure the parent screen becomes selected
        setSelectedScreenId(screenId);
        saveSelectedScreenId(scenarioId || '', screenId);
      }
      newState[screenId] = !newState[screenId];
      saveExpandedScreens(scenarioId || '', newState);
      return newState;
    });
  };

  const handleScreenEdit = (screenId: string) => {
    setEditingScreenId(screenId);
    setSelectedScreenId(screenId);
    saveSelectedScreenId(scenarioId || '', screenId);
  };

  const handleCharacterSelect = (characterId: string | null) => {
    setSelectedCharacterId(characterId);
    saveSelectedCharacterId(scenarioId || '', characterId);
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

  const handleToggleLeftPanel = () => {
    if (leftPanelRef.current) {
      if (isLeftPanelCollapsed) {
        leftPanelRef.current.expand();
      } else {
        leftPanelRef.current.collapse();
      }
      setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
    }
  };

  const handleToggleRightPanel = () => {
    if (rightPanelRef.current) {
      if (isRightPanelCollapsed) {
        rightPanelRef.current.expand();
      } else {
        rightPanelRef.current.collapse();
      }
      setIsRightPanelCollapsed(!isRightPanelCollapsed);
    }
  };

  const handleViewModeChange = (newViewMode: ScreenViewMode) => {
    setViewMode(newViewMode);
    saveViewMode(scenarioId || '', newViewMode);
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
            {/* Левая горизонтальная панель 20% ширины, сворачиваемая до 0px */}
            <Panel
              ref={leftPanelRef}
              defaultSize={20}
              minSize={20}
              maxSize={40}
              collapsible={true}
              collapsedSize={0}
              onCollapse={() => setIsLeftPanelCollapsed(true)}
              onExpand={() => setIsLeftPanelCollapsed(false)}
              style={{ padding: '2px' }}
            >
              {!isLeftPanelCollapsed && (
                <Paper
                  sx={{
                    p: 2,
                  }}
                >
                  <Player
                    screens={scenario.screens}
                    selectedScreenId={selectedScreenId}
                    characters={characters}
                    selectedCharacterId={selectedCharacterId}
                    scenarioId={scenarioId || ''}
                    onScreenSelect={handleScreenSelect}
                  />
                </Paper>
              )}
            </Panel>

            <PanelResizeHandle style={{ width: '4px', backgroundColor: '#f8f9fa' }} />

            {/* Центральная горизонтальная панель 60% */}
            <Panel defaultSize={60} minSize={20} style={{ padding: '2px' }}>
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
                    Сценарий
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'horizontal', gap: 5 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Левая панель">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleToggleLeftPanel}
                          sx={{
                            opacity: isLeftPanelCollapsed ? 0.5 : 1,
                            transition: 'opacity 0.2s ease-in-out',
                            backgroundColor: 'primary.dark',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                            }
                          }}
                        >
                          ⬅️📺
                        </Button>
                      </Tooltip>
                      <Tooltip title="Дерево сценария">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleToggleBottomPanel}
                          sx={{
                            opacity: isBottomPanelCollapsed ? 0.5 : 1,
                            transition: 'opacity 0.2s ease-in-out',
                            backgroundColor: 'primary.dark',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                            }
                          }}
                        >
                          🕸️⬇️
                        </Button>
                      </Tooltip>
                      <Tooltip title="Правая панель">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleToggleRightPanel}
                          sx={{
                            opacity: isRightPanelCollapsed ? 0.5 : 1,
                            transition: 'opacity 0.2s ease-in-out',
                            backgroundColor: 'primary.dark',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                            }
                          }}
                        >
                          ➡️
                        </Button>
                      </Tooltip>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleViewModeChange(ScreenViewMode.COMPACT)}
                        sx={{
                          backgroundColor: viewMode === ScreenViewMode.COMPACT ? 'primary.main' : 'primary.dark',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                          }
                        }}
                      >
                        Компакт
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleViewModeChange(ScreenViewMode.PLAYER_VIEW)}
                        sx={{
                          backgroundColor: viewMode === ScreenViewMode.PLAYER_VIEW ? 'primary.main' : 'primary.dark',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                          }
                        }}
                      >
                        Плеер
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleViewModeChange(ScreenViewMode.PLAYER_EDIT)}
                        sx={{
                          backgroundColor: viewMode === ScreenViewMode.PLAYER_EDIT ? 'primary.main' : 'primary.dark',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                          }
                        }}
                      >
                        Редакт
                      </Button>
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
                          screens={scenario.screens}
                          screen={screen}
                          isEditing={editingScreenId === screen.id}
                          isExpanded={expandedScreens[screen.id] || false}
                          selectedScreenId={selectedScreenId}
                          onSelect={handleScreenSelect}
                          onEdit={handleScreenEdit}
                          onExpand={handleScreenExpand}
                          scenarioId={scenarioId || ''}
                          viewMode={viewMode}
                          characters={characters}
                          selectedCharacterId={selectedCharacterId}
                        />
                      ))}
                  </List>
                </Box>
              </Paper>
            </Panel>

            <PanelResizeHandle style={{ width: '4px', backgroundColor: '#f8f9fa' }} />

            {/* Правая горизонтальная панель 20% ширины, сворачиваемая до 0px */}
            <Panel
              ref={rightPanelRef}
              defaultSize={10}
              minSize={5}
              maxSize={15}
              collapsible={true}
              collapsedSize={0}
              onCollapse={() => setIsRightPanelCollapsed(true)}
              onExpand={() => setIsRightPanelCollapsed(false)}
              style={{ padding: '2px' }}
            >
              {!isRightPanelCollapsed && (
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
                      onSelectCharacter={handleCharacterSelect}
                      scenarioId={scenarioId || null}
                    />
                  </Box>
                </Paper>
              )}
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle style={{ height: '4px', backgroundColor: '#f8f9fa' }} />

        {/* Нижняя вертикальная панель 20% высоты, сворачиваемая до 0px */}
        <Panel
          ref={bottomPanelRef}
          defaultSize={20}
          minSize={10}
          maxSize={20}
          collapsible={true}
          collapsedSize={0}
          onCollapse={() => setIsBottomPanelCollapsed(true)}
          onExpand={() => setIsBottomPanelCollapsed(false)}
          style={{ padding: '2px' }}
        >
          {!isBottomPanelCollapsed && (
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
          )}
        </Panel>
      </PanelGroup>
    </Box>
  );
}; 