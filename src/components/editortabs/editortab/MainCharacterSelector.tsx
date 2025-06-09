import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

interface MainCharacterSelectorProps {
  characters: any[];
  selectedCharacterId: string | null;
  onSelectCharacter: (id: string) => void;
}

export const MainCharacterSelector: React.FC<MainCharacterSelectorProps> = ({ characters, selectedCharacterId, onSelectCharacter }) => {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Select a character to play</Typography>
      <Grid container spacing={2}>
        {characters.map(character => (
          <Grid item xs={6} sm={3} key={character.id}>
            <Paper
              onClick={() => onSelectCharacter(character.id)}
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                border: character.id === selectedCharacterId ? '2px solid #1976d2' : '1px solid #ccc',
                boxShadow: character.id === selectedCharacterId ? 4 : 1,
                transition: 'all 0.2s',
              }}
            >
              {/* Здесь можно добавить изображение персонажа, если есть character.image */}
              <Typography variant="body1">{character.name || character.id}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 