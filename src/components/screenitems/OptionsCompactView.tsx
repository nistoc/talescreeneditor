import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { ChoiceOption } from '../../types/api.scenarios';

interface OptionsCompactViewProps {
  options: ChoiceOption[];
  compact?: boolean;
}

export const OptionsCompactView: React.FC<OptionsCompactViewProps> = ({ 
  options, 
  compact = false 
}) => {
  if (!options || options.length === 0) {
    return null;
  }

  const paddingLeft = compact ? 0.75 : 1;
  const paddingY = compact ? 0.25 : 0.25;
  const marginBottom = compact ? 0.5 : 0.5;
  const borderRadius = compact ? 0.5 : 0.5;
  const fontSize = compact ? 'caption' : 'caption';

  return (
    <Box sx={{ mt: 0.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        Options ({options.length}):
      </Typography>
      {options.map((opt: ChoiceOption) => (
        <Box key={opt.id} sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: 0.5, 
          mb: marginBottom,
          pl: paddingLeft,
          py: paddingY,
          backgroundColor: 'action.hover',
          borderRadius: borderRadius,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography 
            variant={fontSize as any} 
            color="text.secondary" 
            sx={{ flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          >
            {opt.text}
          </Typography>
          {opt.price && (
            <Chip
              label={`${opt.price.value} ${opt.price.type}`}
              size="small"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontSize: '0.6rem',
                height: '16px',
                flexShrink: 0
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}; 