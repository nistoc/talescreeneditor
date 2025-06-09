import React, { useCallback } from 'react';
import { Box, IconButton, Paper, Typography, SxProps, Theme, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ColumnProps } from './types';

// Styles
const styles = {
  paper: {
    height: '100%',
    position: 'relative',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    p: 2,
    borderBottom: '1px solid',
    borderColor: 'divider',
    display: 'flex',
    alignItems: 'center',
    gap: 1
  },
  buttonsRow: {
    p: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    borderBottom: '1px solid',
    borderColor: 'divider'
  },
  content: {
    p: 2,
    flex: 1,
    overflow: 'auto',
    transition: 'opacity 0.3s ease',
    opacity: 1
  },
  contentCollapsed: {
    opacity: 0,
    height: 0,
    padding: 0
  }
} as const;

// Sub-components
const CollapseButton: React.FC<{
  isCollapsed: boolean;
  collapseDirection: 'left' | 'right';
  onCollapseChange: (isCollapsed: boolean) => void;
  position: SxProps<Theme>;
}> = ({ isCollapsed, collapseDirection, onCollapseChange, position }) => {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onCollapseChange(!isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  const tooltipTitle = isCollapsed 
    ? `Expand ${collapseDirection} panel (Enter/Space)`
    : `Collapse ${collapseDirection} panel (Enter/Space)`;

  return (
    <Tooltip title={tooltipTitle} arrow placement="top">
      <IconButton
        onClick={() => onCollapseChange(!isCollapsed)}
        onKeyDown={handleKeyDown}
        size="small"
        sx={position}
        aria-label={tooltipTitle}
        role="button"
        tabIndex={0}
      >
        {isCollapsed ? (
          collapseDirection === 'left' ? <ChevronRightIcon /> : <ChevronLeftIcon />
        ) : (
          collapseDirection === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

const Header: React.FC<{
  title?: string;
  isCollapsed: boolean;
  collapseButtonPosition?: ColumnProps['collapseButtonPosition'];
  collapseDirection?: 'left' | 'right';
  onCollapseChange: (isCollapsed: boolean) => void;
}> = ({ title, isCollapsed, collapseButtonPosition, collapseDirection, onCollapseChange }) => {
  const getButtonPosition = () => {
    if (!collapseButtonPosition) return {};
    
    const { vertical } = collapseButtonPosition;
    const position: Record<string, string | number> = {};

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
    <Box 
      sx={{
        ...styles.header,
        flexDirection: collapseButtonPosition?.horizontal === 'right' ? 'row-reverse' : 'row'
      }}
      role="banner"
    >
      {collapseButtonPosition && collapseDirection && (
        <CollapseButton
          isCollapsed={isCollapsed}
          collapseDirection={collapseDirection}
          onCollapseChange={onCollapseChange}
          position={getButtonPosition()}
        />
      )}
      {!isCollapsed && title && (
        <Typography 
          variant="h6" 
          component="h2"
          role="heading"
          aria-level={2}
        >
          {title}
        </Typography>
      )}
    </Box>
  );
};

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
  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && !isCollapsed) {
      onCollapseChange(true);
    }
  }, [isCollapsed, onCollapseChange]);

  return (
    <Paper 
      sx={{ 
        ...styles.paper, 
        width,
        transform: isCollapsed ? 'scaleX(0.95)' : 'scaleX(1)',
        transformOrigin: collapseDirection === 'left' ? 'left' : 'right'
      }}
      className={className}
      onKeyDown={handleKeyPress}
      role="region"
      aria-label={title || 'Column'}
      tabIndex={0}
    >
      <Header
        title={title}
        isCollapsed={isCollapsed}
        collapseButtonPosition={collapseButtonPosition}
        collapseDirection={collapseDirection}
        onCollapseChange={onCollapseChange}
      />

      {buttons && (
        <Box 
          sx={{
            ...styles.buttonsRow,
            opacity: isCollapsed ? 0 : 1,
            height: isCollapsed ? 0 : 'auto',
            transition: 'all 0.3s ease'
          }}
        >
          {buttons}
        </Box>
      )}

      <Box 
        sx={{
          ...styles.content,
          ...(isCollapsed ? styles.contentCollapsed : {})
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}; 