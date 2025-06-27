import React from 'react';
import { Box, IconButton, ListItem, Typography, Tooltip, Chip } from '@mui/material';
import { Screen, ScreenScene, ScreenChoice, ChoiceOption, Character } from '../../../types/api.scenarios';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { ScreenViewMode } from './ScreenItem';
import { CompactView } from './screenitems/CompactView';

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
  characters?: Character[];
  parentScreen?: Screen;
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
    onSelect(screen.id);
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
          {'content' in screen && screen.content && screen.content}
        </Typography>
        {screen.notes && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            💡 {screen.notes}
          </Typography>
        )}
        {/* Options in player view */}
        {hasOptions(screen) && screen.options.length > 0 && (
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.primary" sx={{ mb: 0.5, fontWeight: 500 }}>
              Options:
            </Typography>
            {screen.options.map((opt: ChoiceOption) => (
              <Box
                key={opt.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  p: 0.5,
                  pl: 1.5,
                  mb: 0.25,
                  backgroundColor: 'action.hover',
                  borderRadius: 0.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { mb: 0 }
                }}
              >
                <Typography variant="caption" sx={{ flex: 1, mr: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {opt.text}
                </Typography>
                {opt.price && (
                  <Chip
                    label={`${opt.price.value} ${opt.price.type}`}
                    size="small"
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.6rem',
                      height: '16px',
                      flexShrink: 0
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        )}
        {/* Compact view for background display */}
        <Box sx={{ mt: 1 }}>
          <CompactView 
            screen={screen} 
            scenarioId={scenarioId} 
            characters={characters} 
            compact={true}
            parentScreen={parentScreen}
          />
        </Box>
      </Box>
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
          {'content' in screen && screen.content && screen.content}
        </Typography>
        {screen.notes && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            💡 {screen.notes}
          </Typography>
        )}
        {/* Options in player edit view */}
        {hasOptions(screen) && screen.options.length > 0 && (
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'secondary.main' }}>
            <Typography variant="caption" color="secondary.main" sx={{ mb: 0.5, fontWeight: 500 }}>
              Options:
            </Typography>
            {screen.options.map((opt: ChoiceOption) => (
              <Box
                key={opt.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  p: 0.5,
                  pl: 1.5,
                  mb: 0.25,
                  backgroundColor: 'secondary.light',
                  borderRadius: 0.5,
                  border: '1px solid',
                  borderColor: 'secondary.main',
                  '&:last-child': { mb: 0 }
                }}
              >
                <Typography variant="caption" sx={{ flex: 1, mr: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {opt.text}
                </Typography>
                {opt.price && (
                  <Chip
                    label={`${opt.price.value} ${opt.price.type}`}
                    size="small"
                    sx={{
                      backgroundColor: 'secondary.main',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.6rem',
                      height: '16px',
                      flexShrink: 0
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
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