import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { getScenarioImageUrl } from '../../../services/imageUtils';

interface MainCharacterSelectorProps {
  characters: any[];
  selectedCharacterId: string | null;
  onSelectCharacter: (id: string) => void;
  scenarioId: string | null;
}

export const MainCharacterSelector: React.FC<MainCharacterSelectorProps> = ({ 
  characters, 
  selectedCharacterId, 
  onSelectCharacter,
  scenarioId 
}) => {
  const [characterImages, setCharacterImages] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadCharacterImages() {
      if (!scenarioId) return;
      const imageUrls: Record<string, string> = {};
      for (const character of characters) {
        if (character.image) {
          try {
            const url = await getScenarioImageUrl(scenarioId, character.image);
            if (url) {
              imageUrls[character.id] = url;
            }
          } catch (error) {
            console.error('Failed to load character image:', error);
          }
        }
      }
      setCharacterImages(imageUrls);
    }
    loadCharacterImages();
  }, [characters, scenarioId]);

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
                {characterImages[character.id] && (
                  <Box sx={{ mb: 1 }}>
                    <img 
                      src={characterImages[character.id]} 
                      alt={character.name || character.id}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: 120,
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }} 
                    />
                  </Box>
                )}
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