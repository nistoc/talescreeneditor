import React from 'react';
import { Box, Typography } from '@mui/material';
import { Screen } from '../../../types/api.scenarios';

interface PointViewerProps {
  screens: Screen[];
  selectedScreenId: string | null;
  firstScreenId: string;
}

export const PointViewer: React.FC<PointViewerProps> = ({ screens, selectedScreenId, firstScreenId }) => {
  // Filter out block screens
  const filteredScreens = screens.filter(screen => screen.type !== 'block');

  return (
    <Box sx={{ p: 2, height: '500px' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Screen Hierarchy
      </Typography>
      <Box sx={{ height: '100%', border: '1px solid #ccc', borderRadius: '4px' }}>
        {/* Graph visualization will be implemented here */}
      </Box>
    </Box>
  );
}; 