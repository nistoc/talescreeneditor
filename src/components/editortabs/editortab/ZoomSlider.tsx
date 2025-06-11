import { useEffect, useRef } from 'react';
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
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    onChange(newValue as number);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.05 : 0.05;
      const newValue = Math.min(Math.max(value + delta, 0.05), 1);
      onChange(newValue);
    };

    slider.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      slider.removeEventListener('wheel', handleWheel);
    };
  }, [value, onChange]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ minWidth: 40, textAlign: 'right', mr: 1 }}>
        {value.toFixed(2)}x
      </Box>
      <StyledSlider
        ref={sliderRef}
        value={value}
        onChange={handleChange}
        min={0.05}
        max={1}
        step={0.05}
        aria-label="Zoom"
        size="small"
      />
    </Box>
  );
}; 