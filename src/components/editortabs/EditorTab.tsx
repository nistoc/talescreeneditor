import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Column } from '../columnTabs/Column';
import { useColumnProportions } from '../columnTabs/ColumnProportions';

export const EditorTab: React.FC = () => {
  const { 
    getEffectiveProportions,
    isLeftCollapsed, 
    isRightCollapsed, 
    toggleLeftCollapse, 
    toggleRightCollapse 
  } = useColumnProportions();

  const effectiveProportions = getEffectiveProportions();

  const getColumnWidthPercentage = (column: 'left' | 'central' | 'right') => {
    if (column === 'left' && isLeftCollapsed) return '40px';
    if (column === 'right' && isRightCollapsed) return '40px';
    const percentageField = `${column}Percentage` as keyof typeof effectiveProportions;
    return `${effectiveProportions[percentageField]}%`;
  };

  const defaultButtons = (
    <>
      <IconButton size="small" onClick={() => {}}>➕</IconButton>
      <IconButton size="small" onClick={() => {}}>➖</IconButton>
    </>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100%', 
      gap: 2,
      position: 'relative'
    }}>
      {/* Left Column */}
      <Column
        collapseButtonPosition={{ vertical: 'top', horizontal: 'left' }}
        collapseDirection="left"
        title="Left"
        isCollapsed={isLeftCollapsed}
        onCollapseChange={toggleLeftCollapse}
        width={getColumnWidthPercentage('left')}
        buttons={defaultButtons}
      >
        Left Content
      </Column>

      {/* Central Column */}
      <Column
        title="Central"
        isCollapsed={false}
        onCollapseChange={() => {}}
        width={getColumnWidthPercentage('central')}
        buttons={defaultButtons}
      >
        Central Content
      </Column>

      {/* Right Column */}
      <Column
        collapseButtonPosition={{ vertical: 'top', horizontal: 'right' }}
        collapseDirection="right"
        title="Right"
        isCollapsed={isRightCollapsed}
        onCollapseChange={toggleRightCollapse}
        width={getColumnWidthPercentage('right')}
        buttons={defaultButtons}
      >
        Right Content
      </Column>
    </Box>
  );
}; 