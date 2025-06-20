import React, { useEffect } from 'react';
import { Box, IconButton, ListItem, Typography, Tooltip, Collapse, List } from '@mui/material';
import { Screen, ScreenNarrative, ScreenDialog, ScreenScene } from '../../../types/api.scenarios';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { NestedScreenItem } from './NestedScreenItem';

// Режимы представления экранов
export enum ScreenViewMode {
  COMPACT = 'compact',           // Компактное представление
  PLAYER_VIEW = 'player_view',   // В виде плеера с просмотром
  PLAYER_EDIT = 'player_edit'    // В виде плеера с редактированием
}

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
}

const hasScreens = (screen: Screen): screen is ScreenNarrative | ScreenDialog | ScreenScene => {
  return 'screens' in screen && Array.isArray(screen.screens);
};

export const ScreenItem: React.FC<ScreenItemProps> = ({
  screen,
  level,
  isEditing,
  isExpanded,
  selectedScreenId,
  viewMode,
  onSelect,
  onEdit,
  onExpand,
  scenarioId
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
    onSelect(screen.id);
  };

  // Функция для рендеринга компактного представления
  const renderCompactView = () => (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Typography variant="body1">
          {screen.type} - {screen.id}
        </Typography>
        {hasChildren && (
          <Typography variant="caption" color="text.secondary">
            ({screen.screens.length} screens)
          </Typography>
        )}
      </Box>
      {screen.type === 'scene' && (screen as ScreenScene).title && (
        <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
          {(screen as ScreenScene).title}
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {screen.content}
      </Typography>
      {screen.notes && (
        <Typography variant="caption" color="text.secondary">
          Notes: {screen.notes}
        </Typography>
      )}
    </Box>
  );

  // Функция для рендеринга представления плеера с просмотром
  const renderPlayerView = () => (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="h6" color="primary">
          🎮 {screen.type} - {screen.id}
        </Typography>
        {hasChildren && (
          <Typography variant="caption" color="text.secondary">
            ({screen.screens.length} screens)
          </Typography>
        )}
      </Box>
      {screen.type === 'scene' && (screen as ScreenScene).title && (
        <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
          {(screen as ScreenScene).title}
        </Typography>
      )}
      <Box sx={{ 
        p: 2, 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 1,
        backgroundColor: 'background.paper',
        mb: 1
      }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {screen.content}
        </Typography>
        {screen.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            💡 {screen.notes}
          </Typography>
        )}
      </Box>
    </Box>
  );

  // Функция для рендеринга представления плеера с редактированием
  const renderPlayerEdit = () => (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="h6" color="secondary">
          ✏️ {screen.type} - {screen.id}
        </Typography>
        {hasChildren && (
          <Typography variant="caption" color="text.secondary">
            ({screen.screens.length} screens)
          </Typography>
        )}
      </Box>
      {screen.type === 'scene' && (screen as ScreenScene).title && (
        <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
          {(screen as ScreenScene).title}
        </Typography>
      )}
      <Box sx={{ 
        p: 2, 
        border: '2px solid', 
        borderColor: 'secondary.main', 
        borderRadius: 1,
        backgroundColor: 'background.paper',
        mb: 1,
        position: 'relative'
      }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {screen.content}
        </Typography>
        {screen.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            💡 {screen.notes}
          </Typography>
        )}
        <Box sx={{ 
          position: 'absolute', 
          top: 4, 
          right: 4, 
          backgroundColor: 'secondary.main',
          color: 'white',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontSize: '0.75rem'
        }}>
          Редактирование
        </Box>
      </Box>
    </Box>
  );

  // Функция для выбора представления на основе режима
  const renderContent = () => {
    // Определяем режим на основе того, выбран ли этот экран
    const currentViewMode = isSelected ? viewMode : ScreenViewMode.COMPACT;
    
    switch (currentViewMode) {
      case ScreenViewMode.COMPACT:
        return renderCompactView();
      case ScreenViewMode.PLAYER_VIEW:
        return renderPlayerView();
      case ScreenViewMode.PLAYER_EDIT:
        return renderPlayerEdit();
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
                />
              ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
}; 