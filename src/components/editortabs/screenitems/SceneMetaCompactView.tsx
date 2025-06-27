import React from 'react';
import { Box, Typography } from '@mui/material';
import { Screen, ScreenNarrative, ScreenDialog, ScreenScene } from '../../../types/api.scenarios';

interface SceneMetaCompactViewProps {
  screen: Screen;
  compact?: boolean;
}

export const SceneMetaCompactView: React.FC<SceneMetaCompactViewProps> = ({
  screen,
  compact = false
}) => {
  const hasScreens = (screen: Screen): screen is ScreenNarrative | ScreenDialog | ScreenScene => {
    return 'screens' in screen && Array.isArray(screen.screens);
  };

  const hasChildren = hasScreens(screen) && screen.screens.length > 0;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Typography variant={compact ? "body2" : "body1"}>
          {screen.id}
        </Typography>
        {hasChildren && (
          <Typography variant="caption" color="text.secondary">
            ({screen.screens.length} screens)
          </Typography>
        )}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          Progress: {screen.progress}
        </Typography>
      </Box>
      {screen.notes && (
        <Typography variant="caption" color="text.secondary">
          Notes: {screen.notes}
        </Typography>
      )}
    </>
  );
}; 