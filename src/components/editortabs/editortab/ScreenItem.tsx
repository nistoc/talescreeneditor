import React, { useEffect } from 'react';
import { Box, IconButton, ListItem, Typography, Tooltip, Collapse, List } from '@mui/material';
import { Screen, ScreenNarrative, ScreenDialog, ScreenScene } from '../../../types/api.scenarios';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { NestedScreenItem } from './NestedScreenItem';

interface ScreenItemProps {
  screen: Screen;
  level: number;
  isSelected: boolean;
  isEditing: boolean;
  isExpanded: boolean;
  selectedScreenId: string | null;
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
  isSelected,
  isEditing,
  isExpanded,
  selectedScreenId,
  onSelect,
  onEdit,
  onExpand,
  scenarioId
}) => {
  const hasChildren = hasScreens(screen) && screen.screens.length > 0;
  const childScreenIds = hasChildren ? screen.screens.map(s => s.id) : [];

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

  return (
    <React.Fragment>
      <ListItem
        onClick={handleClick}
        data-screen-id={screen.id}
        sx={{
          pl: level === 0 ? 2 : 4 + (level * 3),
          borderLeft: level > 0 ? '2px solid' : 'none',
          borderColor: isSelected ? 'primary.main' : 'divider',
          backgroundColor: isSelected ? 'action.selected' : 'inherit',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: isSelected ? 'action.selected' : 'action.hover'
          },
          border: isSelected ? '1px solid' : 'none',
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {screen.content}
          </Typography>
          {screen.notes && (
            <Typography variant="caption" color="text.secondary">
              Notes: {screen.notes}
            </Typography>
          )}
        </Box>
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
                  isSelected={selectedScreenId === childScreen.id}
                  isEditing={isEditing}
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