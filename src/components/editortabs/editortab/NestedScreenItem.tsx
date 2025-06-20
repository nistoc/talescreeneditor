import React, { useEffect, useState } from 'react';
import { Box, IconButton, ListItem, Typography, Tooltip } from '@mui/material';
import { Screen, ScreenScene } from '../../../types/api.scenarios';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { getScenarioImageUrl } from '../../../services/imageUtils';
import { ScreenViewMode } from './ScreenItem';

interface NestedScreenItemProps {
  screen: Screen;
  level: number;
  isEditing: boolean;
  viewMode: ScreenViewMode;
  selectedScreenId: string | null;
  onSelect: (screenId: string) => void;
  onEdit: (screenId: string) => void;
  isExpanded: boolean;
  scenarioId: string;
}

export const NestedScreenItem: React.FC<NestedScreenItemProps> = ({
  screen,
  level,
  isEditing,
  viewMode,
  selectedScreenId,
  onSelect,
  onEdit,
  isExpanded,
  scenarioId
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // Вычисляем isSelected на основе selectedScreenId и screen.id
  const isSelected = selectedScreenId === screen.id;

  useEffect(() => {
    async function loadImage() {
      if (screen.image) {
        const url = await getScenarioImageUrl(scenarioId, screen.image);
        setImageUrl(url);
      } else {
        setImageUrl(null);
      }
    }
    loadImage();
  }, [screen.image, scenarioId]);

  const handleClick = () => {
    onSelect(screen.id);
  };

  // Функция для рендеринга компактного представления
  const renderCompactView = () => (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">
          {screen.type} - {screen.id}
        </Typography>
      </Box>
      {screen.type === 'scene' && (screen as ScreenScene).title && (
        <Typography variant="body2" color="text.primary">
          {(screen as ScreenScene).title}
        </Typography>
      )}
      <Typography variant="caption" color="text.secondary">
        {screen.content}
      </Typography>
      {screen.notes && (
        <Typography variant="caption" color="text.secondary">
          Notes: {screen.notes}
        </Typography>
      )}
      {imageUrl && (
        <Box sx={{ my: 0.5 }}>
          <img src={imageUrl} alt="screen" style={{ maxWidth: '100%', maxHeight: 60 }} />
        </Box>
      )}
    </Box>
  );

  // Функция для рендеринга представления плеера с просмотром
  const renderPlayerView = () => (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="body1" color="primary">
          🎮 {screen.type} - {screen.id}
        </Typography>
      </Box>
      {screen.type === 'scene' && (screen as ScreenScene).title && (
        <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
          {(screen as ScreenScene).title}
        </Typography>
      )}
      <Box sx={{ 
        p: 1.5, 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 1,
        backgroundColor: 'background.paper',
        mb: 1
      }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {screen.content}
        </Typography>
        {screen.notes && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            💡 {screen.notes}
          </Typography>
        )}
      </Box>
      {imageUrl && (
        <Box sx={{ my: 0.5 }}>
          <img src={imageUrl} alt="screen" style={{ maxWidth: '100%', maxHeight: 80 }} />
        </Box>
      )}
    </Box>
  );

  // Функция для рендеринга представления плеера с редактированием
  const renderPlayerEdit = () => (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="body1" color="secondary">
          ✏️ {screen.type} - {screen.id}
        </Typography>
      </Box>
      {screen.type === 'scene' && (screen as ScreenScene).title && (
        <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
          {(screen as ScreenScene).title}
        </Typography>
      )}
      <Box sx={{ 
        p: 1.5, 
        border: '2px solid', 
        borderColor: 'secondary.main', 
        borderRadius: 1,
        backgroundColor: 'background.paper',
        mb: 1,
        position: 'relative'
      }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {screen.content}
        </Typography>
        {screen.notes && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            💡 {screen.notes}
          </Typography>
        )}
        <Box sx={{ 
          position: 'absolute', 
          top: 4, 
          right: 4, 
          backgroundColor: 'secondary.main',
          color: 'white',
          px: 0.5,
          py: 0.25,
          borderRadius: 0.5,
          fontSize: '0.6rem'
        }}>
          Редакт
        </Box>
      </Box>
      {imageUrl && (
        <Box sx={{ my: 0.5 }}>
          <img src={imageUrl} alt="screen" style={{ maxWidth: '100%', maxHeight: 80 }} />
        </Box>
      )}
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
    <ListItem
      onClick={handleClick}
      data-screen-id={screen.id}
      sx={{
        pl: 2,
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