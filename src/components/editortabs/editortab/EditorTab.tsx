import React, { useState } from 'react';
import { Box, IconButton, List, Typography } from '@mui/material';
import { Column } from '../../columnTabs/Column';
import { useColumnProportions } from '../../columnTabs/ColumnProportions';
import { useParams } from 'react-router-dom';
import { useScenario } from '../../../api/scenarios';
import { Screen } from '../../../types/api.scenarios';
import { ScreenItem } from './ScreenItem';

export const EditorTab: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const { data: scenario } = useScenario(scenarioId || '');
  
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [expandedScreens, setExpandedScreens] = useState<Record<string, boolean>>({});
  const [editingScreenId, setEditingScreenId] = useState<string | null>(null);

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

  const handleScreenSelect = (screenId: string) => {
    console.log('Selected screen:', screenId);
    setSelectedScreenId(screenId);
  };

  const handleScreenExpand = (screenId: string) => {
    setExpandedScreens(prev => {
      const newState = { ...prev };
      if (newState[screenId]) {
        // If we're collapsing, make sure the parent screen becomes selected
        console.log('Collapsing screen, selecting parent:', screenId);
        setSelectedScreenId(screenId);
      }
      newState[screenId] = !newState[screenId];
      return newState;
    });
  };

  const handleScreenEdit = (screenId: string) => {
    setEditingScreenId(screenId);
    setSelectedScreenId(screenId);
  };

  const defaultButtons = (
    <>
      <IconButton size="small" onClick={() => {}}>➕</IconButton>
      <IconButton size="small" onClick={() => {}}>➖</IconButton>
    </>
  );

  if (!scenario) {
    return <Typography>Loading...</Typography>;
  }

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
        <List>
          {scenario.screens
            .filter(screen => screen.type !== 'block')
            .map((screen) => (
              <ScreenItem
                key={screen.id}
                screen={screen}
                level={0}
                isSelected={selectedScreenId === screen.id}
                isEditing={editingScreenId === screen.id}
                isExpanded={expandedScreens[screen.id] || false}
                selectedScreenId={selectedScreenId}
                onSelect={handleScreenSelect}
                onEdit={handleScreenEdit}
                onExpand={handleScreenExpand}
              />
            ))}
        </List>
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