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
        {characters.map(character => {
          const isPlayer = character.type === 'player';
          return (
            <Grid item xs={6} sm={3} key={character.id}>
              <Paper
                onClick={isPlayer ? () => onSelectCharacter(character.id) : undefined}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: isPlayer ? 'pointer' : 'not-allowed',
                  border: character.id === selectedCharacterId ? '2px solid #1976d2' : '1px solid #ccc',
                  boxShadow: character.id === selectedCharacterId ? 4 : 1,
                  transition: 'all 0.2s',
                  backgroundColor: isPlayer ? 'inherit' : '#f0f0f0',
                  opacity: isPlayer ? 1 : 0.6,
                }}
              >
                {/* Здесь можно добавить изображение персонажа, если есть character.image */}
                <Typography variant="body1">{character.name || character.id}</Typography>
                {!isPlayer && (
                  <Typography variant="caption" color="text.secondary">NPC</Typography>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}; 