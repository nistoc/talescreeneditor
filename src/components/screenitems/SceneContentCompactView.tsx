import React from 'react';
import { Typography } from '@mui/material';
import { Screen, ScreenScene, ScreenChoice } from '../../types/api.scenarios';
import { OptionsCompactView } from './OptionsCompactView';

interface SceneContentCompactViewProps {
  screen: Screen;
  compact?: boolean;
}

export const SceneContentCompactView: React.FC<SceneContentCompactViewProps> = ({ 
  screen, 
  compact = false 
}) => {
  const hasOptions = (screen: Screen): screen is ScreenChoice => {
    return 'options' in screen && Array.isArray(screen.options);
  };

  return (
    <>
      {screen.type === 'scene' && (screen as ScreenScene).title && (
        <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
          {(screen as ScreenScene).title}
        </Typography>
      )}
      <Typography 
        variant={compact ? "caption" : "body2"} 
        color="text.secondary" 
        sx={{ mb: 0.5 }}
      >
        {'content' in screen && screen.content && screen.content}
      </Typography>
      {/* Options в компактном виде */}
      {hasOptions(screen) && screen.options && (
        <OptionsCompactView options={screen.options} compact={compact} />
      )}
    </>
  );
}; 