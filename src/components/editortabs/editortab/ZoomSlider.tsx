import React from 'react';
import { Slider, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSlider = styled(Slider)({
  width: 100,
  margin: '0 8px',
  '& .MuiSlider-thumb': {
    width: 12,
    height: 12,
  },
  '& .MuiSlider-track': {
    height: 2,
  },
  '& .MuiSlider-rail': {
    height: 2,
  },
});

interface ZoomSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const ZoomSlider: React.FC<ZoomSliderProps> = ({ value, onChange }) => {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    onChange(newValue as number);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ minWidth: 40, textAlign: 'right', mr: 1 }}>
        {value.toFixed(2)}x
      </Box>
      <StyledSlider
        value={value}
        onChange={handleChange}
        min={0.1}
        max={2}
        step={0.05}
        aria-label="Zoom"
        size="small"
      />
    </Box>
  );
}; 