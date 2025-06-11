import React, { useEffect, useState } from 'react';
import { Box, IconButton, ListItem, Typography, Tooltip } from '@mui/material';
import { Screen } from '../../../types/api.scenarios';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { getScenarioImageUrl } from '../../../services/imageUtils';

interface NestedScreenItemProps {
  screen: Screen;
  level: number;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: (screenId: string) => void;
  onEdit: (screenId: string) => void;
  isExpanded: boolean;
  scenarioId: string;
}

export const NestedScreenItem: React.FC<NestedScreenItemProps> = ({
  screen,
  level,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  isExpanded,
  scenarioId
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" noWrap>
            {screen.type} - {screen.id}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" noWrap>
          {screen.content}
        </Typography>
        {imageUrl && (
          <Box sx={{ my: 0.5 }}>
            <img src={imageUrl} alt="screen" style={{ maxWidth: '100%', maxHeight: 60 }} />
          </Box>
        )}
      </Box>
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