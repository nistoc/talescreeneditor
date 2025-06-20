import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { getScenarioImageUrl } from '../../../services/imageUtils';
import { Character } from '../../../types/api.scenarios';

interface MainCharacterSelectorProps {
  characters: Character[];
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
      <Grid container spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
        {characters.map(character => {
          const isPlayer = character.type === 'player';
          return (
            <Grid 
              item 
              key={character.id}
              sx={{
              }}
            >
              <Box
                onClick={isPlayer ? () => onSelectCharacter(character.id) : undefined}
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                  cursor: isPlayer ? 'pointer' : 'not-allowed',
                  border: character.id === selectedCharacterId ? '2px solid #1976d2' : '2px solid transparent',
                  boxShadow: character.id === selectedCharacterId ? 4 : 1,
                  transition: 'all 0.2s',
                  backgroundColor: isPlayer ? 'inherit' : '#f0f0f0',
                  opacity: isPlayer ? 1 : 0.6,
                  borderRadius: '4px'
                }}
              >
                {characterImages[character.id] && (
                  <Box sx={{ position: 'relative' }}>
                    <img 
                      src={characterImages[character.id]} 
                      alt={character.name || character.id}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: 120,
                        objectFit: 'cover',
                      }} 
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '8px 4px',
                        borderRadius: '0 0 4px 4px'
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {character.name || character.id}
                      </Typography>
                      {!isPlayer && (
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          NPC
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}; 