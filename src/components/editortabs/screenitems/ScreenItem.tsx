import React, { useEffect } from 'react';
import { Box, IconButton, ListItem, Tooltip, Collapse, List } from '@mui/material';
import { Screen, ScreenNarrative, ScreenDialog, ScreenScene, ScreenChoice, Character } from '../../../types/api.scenarios';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { NestedScreenItem, CompactView, CompactPlayer, CompactEditor, ScreenViewMode } from './index';


interface ScreenItemProps {
  screen: Screen;
  level: number;
  isEditing: boolean;
  isExpanded: boolean;
  selectedScreenId: string | null;
  viewMode: ScreenViewMode;
  onSelect: (screenId: string) => void;
  onEdit: (screenId: string) => void;
  onExpand: (screenId: string, childScreenIds: string[]) => void;
  scenarioId: string;
  characters?: Character[];
  selectedCharacterId: string | null;
}

const hasScreens = (screen: Screen): screen is ScreenNarrative | ScreenDialog | ScreenScene => {
  return 'screens' in screen && Array.isArray(screen.screens);
};

const hasOptions = (screen: Screen): screen is ScreenChoice => {
  return 'options' in screen && Array.isArray(screen.options);
};

export const ScreenItem: React.FC<ScreenItemProps> = ({
  screen,
  level,
  isEditing,
  isExpanded,
  selectedScreenId,
  selectedCharacterId,
  viewMode,
  onSelect,
  onEdit,
  onExpand,
  scenarioId,
  characters = []
}) => {
  const hasChildren = hasScreens(screen) && screen.screens.length > 0;
  const childScreenIds = hasChildren ? screen.screens.map(s => s.id) : [];

  // Вычисляем isSelected на основе selectedScreenId и screen.id
  const isSelected = selectedScreenId === screen.id;

  useEffect(() => {
    if (selectedScreenId && hasChildren && !isExpanded) {
      if (childScreenIds.includes(selectedScreenId)) {
        onExpand(screen.id, childScreenIds);
      }
    }
  }, [selectedScreenId]);

  const handleClick = () => {
    if (screen.id !== selectedScreenId) {
      onSelect(screen.id);
    }
  };

  // Функция для рендеринга компактного представления
  const renderCompactView = () => (
    <CompactView 
      screen={screen} 
      scenarioId={scenarioId} 
      characters={characters} 
    />
  );

  // Функция для рендеринга представления плеера с просмотром
  const renderCompactPlayer = () => (
    <CompactPlayer
      screen={screen}
      scenarioId={scenarioId}
      characters={characters}
      onScreenSelect={onSelect}
      selectedCharacterId={selectedCharacterId}
    />
  );

  // Функция для рендеринга представления плеера с редактированием
  const renderCompactEditor = () => (
    <CompactEditor
      screen={screen}
      scenarioId={scenarioId}
      characters={characters}
      onScreenSelect={onSelect}
      selectedCharacterId={selectedCharacterId}
    />
  );

  // Функция для выбора представления на основе режима
  const renderContent = () => {
    // Определяем режим на основе того, выбран ли этот экран
    const currentViewMode = isSelected ? viewMode : ScreenViewMode.COMPACT;

    switch (currentViewMode) {
      case ScreenViewMode.COMPACT:
        return renderCompactView();
      case ScreenViewMode.PLAYER_VIEW:
        return renderCompactPlayer();
      case ScreenViewMode.PLAYER_EDIT:
        return renderCompactEditor();
      default:
        return renderCompactView();
    }
  };

  return (
    <React.Fragment>
      <ListItem
        onClick={handleClick}
        data-screen-id={screen.id}
        sx={{
          pl: level === 0 ? 2 : 4 + (level * 3),
          border: isSelected ? '1px solid' : (level > 0 ? '2px solid' : 'none'),
          borderColor: isSelected ? 'primary.main' : 'divider',
          backgroundColor: isSelected ? 'action.selected' : 'inherit',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: isSelected ? 'action.selected' : 'action.hover'
          },
          borderRadius: 1,
          m: 0.5,
          transition: 'all 0.2s ease'
        }}
      >
        {hasChildren && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) {
                onExpand(screen.id, childScreenIds);
              }
            }}
            sx={{ mr: 1 }}
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
        {renderContent()}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(screen.id);
              }}
              color={isEditing ? 'primary' : 'default'}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Child">
            <IconButton size="small">
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </ListItem>
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {screen.screens
              .filter(childScreen => childScreen.type !== 'block')
              .map((childScreen) => (
                <NestedScreenItem
                  key={childScreen.id}
                  screen={childScreen}
                  level={level + 1}
                  isEditing={isEditing}
                  viewMode={viewMode}
                  selectedScreenId={selectedScreenId}
                  onSelect={onSelect}
                  onEdit={onEdit}
                  isExpanded={isExpanded}
                  scenarioId={scenarioId}
                  characters={characters}
                  parentScreen={screen}
                  selectedCharacterId={selectedCharacterId}
                />
              ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
}; 