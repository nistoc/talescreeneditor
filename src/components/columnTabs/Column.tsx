import React from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ColumnProps } from './types';

export const Column: React.FC<ColumnProps> = ({
  collapseButtonPosition,
  collapseDirection,
  buttons,
  title,
  children,
  isCollapsed,
  onCollapseChange,
  width,
  className
}) => {
  const getButtonPosition = () => {
    if (!collapseButtonPosition) return {};
    
    const { vertical, horizontal } = collapseButtonPosition;
    const position: Record<string, string | number> = {};

    // Vertical positioning
    switch (vertical) {
      case 'top':
        position.alignSelf = 'flex-start';
        break;
      case 'center':
        position.alignSelf = 'center';
        break;
      case 'bottom':
        position.alignSelf = 'flex-end';
        break;
    }

    return position;
  };

  return (
    <Paper 
      sx={{ 
        width,
        height: '100%',
        position: 'relative',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
      className={className}
    >
      {/* Header with Collapse Button */}
      <Box sx={{ 
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexDirection: collapseButtonPosition?.horizontal === 'right' ? 'row-reverse' : 'row'
      }}>
        {collapseButtonPosition && collapseDirection && (
          <IconButton
            onClick={() => onCollapseChange(!isCollapsed)}
            size="small"
            sx={getButtonPosition()}
          >
            {isCollapsed ? (
              collapseDirection === 'left' ? <ChevronRightIcon /> : <ChevronLeftIcon />
            ) : (
              collapseDirection === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />
            )}
          </IconButton>
        )}
        {!isCollapsed && title && <Typography variant="h6">{title}</Typography>}
      </Box>

      {/* Buttons Row */}
      {!isCollapsed && buttons && (
        <Box sx={{ 
          p: 1, 
          display: 'flex', 
          justifyContent: 'flex-end',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          {buttons}
        </Box>
      )}

      {/* Content */}
      {!isCollapsed && (
        <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
          {children}
        </Box>
      )}
    </Paper>
  );
}; 