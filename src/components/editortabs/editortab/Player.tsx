import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, Divider } from '@mui/material';
import { getScenarioImageUrl } from '../../../services/imageUtils';
import { Screen, Character } from '../../../types/api.scenarios';

interface PlayerProps {
  screens: Screen[];
  selectedScreenId: string | null;
  characters: Character[];
  selectedCharacterId: string | null;
  scenarioId: string;
}

// Рекурсивный поиск экрана по id среди всех уровней
function findScreenById(screens: any[], id: string | null): any | undefined {
  if (!id) return undefined;
  for (const screen of screens) {
    if (screen.id === id) return screen;
    if (screen.screens && Array.isArray(screen.screens)) {
      const found = findScreenById(screen.screens, id);
      if (found) return found;
    }
  }
  return undefined;
}

export const Player: React.FC<PlayerProps> = ({ screens, selectedScreenId, characters, selectedCharacterId, scenarioId }) => {
  const selectedScreen = selectedScreenId ? findScreenById(screens, selectedScreenId) : undefined;
  const parentScreen = selectedScreen?.parentId ? findScreenById(screens, selectedScreen.parentId) : undefined;
  const actorCharacter = selectedScreen?.actor?.playerId ? characters.find(c => c.id === selectedScreen.actor.playerId) : undefined;

  const [screenImageUrl, setScreenImageUrl] = useState<string | null>(null);
  const [actorImageUrl, setActorImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadScreenImage() {
      if (selectedScreen && selectedScreen.image) {
        const url = await getScenarioImageUrl(scenarioId, selectedScreen.image);
        setScreenImageUrl(url);
      } else if (parentScreen && parentScreen.image) {
        const url = await getScenarioImageUrl(scenarioId, parentScreen.image);
        setScreenImageUrl(url);
      } else {
        setScreenImageUrl(null);
      }
    }
    loadScreenImage();
  }, [selectedScreen, parentScreen, scenarioId]);

  useEffect(() => {
    async function loadActorImage() {
      if (actorCharacter && actorCharacter.image) {
        const url = await getScenarioImageUrl(scenarioId, actorCharacter.image);
        setActorImageUrl(url);
      } else {
        setActorImageUrl(null);
      }
    }
    loadActorImage();
  }, [actorCharacter, scenarioId]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Player</Typography>
      {selectedScreen ? (
        <Box>
          <Box data-background sx={{ 
            display: 'flex', 
            gap: 2, 
            alignItems: 'flex-start',
            backgroundImage: screenImageUrl ? `url(${screenImageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: screenImageUrl ? 200 : 'auto',
            position: 'relative',
            '&::before': screenImageUrl ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 0
            } : {},
            '& > *': screenImageUrl ? {
              position: 'relative',
              zIndex: 1
            } : {}
          }}>
            {actorCharacter && actorCharacter.id === selectedCharacterId && actorImageUrl && (
              <Box sx={{ flex: '0 0 120px' }}>
                <img src={actorImageUrl} alt="actor" style={{ maxWidth: '100%', maxHeight: 120 }} />
              </Box>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Screen: {selectedScreen.title || selectedScreen.name || selectedScreen.id}</Typography>
              <Divider sx={{ mb: 1 }} />
              {selectedScreen.title && <Typography variant="body2"><b>Title:</b> {selectedScreen.title}</Typography>}
              <Typography variant="body2"><b>Content:</b> {selectedScreen.content}</Typography>
              <Typography variant="body2"><b>Progress:</b> {selectedScreen.progress}</Typography>
              {selectedScreen.notes && <Typography variant="body2"><b>Notes:</b> {selectedScreen.notes}</Typography>}
              {selectedScreen.next && <Typography variant="body2"><b>Next:</b> {selectedScreen.next}</Typography>}
              {selectedScreen.actor && <Typography variant="body2"><b>Actor:</b> {actorCharacter?.name || selectedScreen.actor.playerId}</Typography>}
              {selectedScreen.availableFor && <Typography variant="body2"><b>Available For:</b> {selectedScreen.availableFor}</Typography>}
              {selectedScreen.options && Array.isArray(selectedScreen.options) && selectedScreen.options.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2"><b>Options:</b></Typography>
                  {selectedScreen.options.map((opt: any) => (
                    <Chip key={opt.id} label={opt.text || opt.id} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
              )}
            </Box>
            {actorCharacter && actorCharacter.id !== selectedCharacterId && actorImageUrl && (
              <Box sx={{ flex: '0 0 120px' }}>
                <img src={actorImageUrl} alt="actor" style={{ maxWidth: '100%', maxHeight: 120 }} />
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Typography variant="body2">No screen selected</Typography>
      )}
    </Paper>
  );
}; 