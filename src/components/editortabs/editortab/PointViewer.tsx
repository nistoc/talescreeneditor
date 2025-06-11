import React from 'react';
import { Box, Typography } from '@mui/material';
import { Screen, ScreenNarrative, ScreenDialog, ScreenScene } from '../../../types/api.scenarios';

interface FlattenedScreen {
  id: string;
  downs: string[];
  label: string;
  upIds: string[];
  containerParentId: string | null;
}

interface PointViewerProps {
  screens: Screen[];
  selectedScreenId: string | null;
  firstScreenId: string;
}

const createFlattenedScreens = (screens: Screen[]): FlattenedScreen[] => {
  const flattenedScreens: FlattenedScreen[] = [];
  const screenMap = new Map<string, FlattenedScreen>();

  // First pass: create basic flattened screens
  const processScreen = (screen: Screen, containerParentId: string | null = null) => {
    const downValues: string[] = [];
    
    // Add the main next value if it exists
    if (screen.next) {
      downValues.push(screen.next);
    }
    
    // Add values from options if they exist
    if ('options' in screen && Array.isArray(screen.options)) {
      screen.options.forEach(option => {
        // For choice options, we use the option's id as the next value
        downValues.push(option.id);
      });
    }

    const flattenedScreen: FlattenedScreen = {
      upIds: [],
      id: screen.id,
      downs: downValues,
      label: screen.content || '',
      containerParentId
    };
    
    screenMap.set(screen.id, flattenedScreen);
    flattenedScreens.push(flattenedScreen);

    // Process nested screens if they exist
    if ('screens' in screen && Array.isArray(screen.screens)) {
      screen.screens.filter(s => s.type !== 'block').forEach(nestedScreen => {
        processScreen(nestedScreen, screen.id);
      });
    }
  };

  // Process all screens
  screens.forEach(screen => processScreen(screen));

  // Second pass: populate upIds
  flattenedScreens.forEach(screen => {
    screen.downs.forEach(downId => {
      const downScreen = screenMap.get(downId);
      if (downScreen) {
        downScreen.upIds.push(screen.id);
      }
    });
  });

  return flattenedScreens;
};

export const PointViewer: React.FC<PointViewerProps> = ({ screens, selectedScreenId, firstScreenId }) => {
  // Filter out block screens
  const filteredScreens = screens.filter(screen => screen.type !== 'block');
  
  // Create flattened screens
  const flattenedScreens = createFlattenedScreens(filteredScreens);
  console.log('Flattened screens:', flattenedScreens);

  return (
    <Box>
      {/* We'll implement the visualization in the next step */}
    </Box>
  );
}; 