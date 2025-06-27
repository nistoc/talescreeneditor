import React from 'react';
import { Box, IconButton, ListItem, Tooltip } from '@mui/material';
import { Screen, ScreenChoice, Character } from '../../../types/api.scenarios';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { CompactView, CompactPlayer, CompactEditor, ScreenViewMode } from './index';

interface NestedScreenItemProps {
  screen: Screen;
  parentScreen?: Screen;
  level: number;
  isEditing: boolean;
  viewMode: ScreenViewMode;
  selectedScreenId: string | null;
  onSelect: (screenId: string) => void;
  onEdit: (screenId: string) => void;
  isExpanded: boolean;
  scenarioId: string;
  characters?: Character[];
  selectedCharacterId: string | null;
}

const hasOptions = (screen: Screen): screen is ScreenChoice => {
  return 'options' in screen && Array.isArray(screen.options);
};

export const NestedScreenItem: React.FC<NestedScreenItemProps> = ({
  screen,
  level,
  isEditing,
  viewMode,
  selectedScreenId,
  selectedCharacterId,
  onSelect,
  onEdit,
  isExpanded,
  scenarioId,
  characters = [],
  parentScreen
}) => {
  // Вычисляем isSelected на основе selectedScreenId и screen.id
  const isSelected = selectedScreenId === screen.id;

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
      compact={true}
      parentScreen={parentScreen}
    />
  );

  // Функция для рендеринга представления плеера с просмотром
  const renderCompactPlayer = () => (
    <CompactPlayer
      screen={screen}
      scenarioId={scenarioId}
      characters={characters}
      onScreenSelect={onSelect}
      parentScreen={parentScreen}
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
      parentScreen={parentScreen}
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
    <ListItem
      onClick={handleClick}
      data-screen-id={screen.id}
      sx={{
        pl: 5.25,
        pr: 1,
        py: 0.5,
        border: isSelected ? '1px solid' : 'none',
        borderColor: 'primary.main',
        backgroundColor: isSelected ? 'action.selected' : 'inherit',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: isSelected ? 'action.selected' : 'action.hover'
        },
        borderRadius: 1,
        m: 0.5,
        transition: 'all 0.2s ease',
        minHeight: '40px'
      }}
    >
      {renderContent()}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(screen.id);
            }}
            color={isEditing ? 'primary' : 'default'}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy">
          <IconButton size="small">
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </ListItem>
  );
}; 