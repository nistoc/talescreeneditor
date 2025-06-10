import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, Divider } from '@mui/material';
import { getScenarioImageUrl } from '../../../services/imageUtils';

interface PlayerProps {
  screens: any[];
  selectedScreenId: string | null;
  selectedScreenParentId: string | null;
  characters: any[];
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

export const Player: React.FC<PlayerProps> = ({ screens, selectedScreenId, selectedScreenParentId, characters, selectedCharacterId, scenarioId }) => {
  const screen = findScreenById(screens, selectedScreenId);
  const parentScreen = selectedScreenParentId ? findScreenById(screens, selectedScreenParentId) : undefined;
  const actorCharacter = screen?.actor?.playerId ? characters.find(c => c.id === screen.actor.playerId) : undefined;

  const [screenImageUrl, setScreenImageUrl] = useState<string | null>(null);
  const [actorImageUrl, setActorImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadScreenImage() {
      if (screen && screen.image) {
        const url = await getScenarioImageUrl(scenarioId, screen.image);
        setScreenImageUrl(url);
      } else if (parentScreen && parentScreen.image) {
        const url = await getScenarioImageUrl(scenarioId, parentScreen.image);
        setScreenImageUrl(url);
      } else {
        setScreenImageUrl(null);
      }
    }
    loadScreenImage();
  }, [screen, parentScreen, scenarioId]);

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
      {screen ? (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            {actorCharacter && actorCharacter.id === selectedCharacterId && actorImageUrl && (
              <Box sx={{ flex: '0 0 120px' }}>
                <img src={actorImageUrl} alt="actor" style={{ maxWidth: '100%', maxHeight: 120 }} />
              </Box>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Screen: {screen.title || screen.name || screen.id}</Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2"><b>ID:</b> {screen.id}</Typography>
              <Typography variant="body2"><b>Type:</b> {screen.type}</Typography>
              {screen.title && <Typography variant="body2"><b>Title:</b> {screen.title}</Typography>}
              <Typography variant="body2"><b>Content:</b> {screen.content}</Typography>
              {screenImageUrl && <Box sx={{ my: 1 }}><img src={screenImageUrl} alt="screen" style={{ maxWidth: '100%', maxHeight: 120 }} /></Box>}
              <Typography variant="body2"><b>Progress:</b> {screen.progress}</Typography>
              {screen.notes && <Typography variant="body2"><b>Notes:</b> {screen.notes}</Typography>}
              {screen.next && <Typography variant="body2"><b>Next:</b> {screen.next}</Typography>}
              {screen.actor && <Typography variant="body2"><b>Actor:</b> {actorCharacter?.name || screen.actor.playerId}</Typography>}
              {screen.availableFor && <Typography variant="body2"><b>Available For:</b> {screen.availableFor}</Typography>}
              {screen.options && Array.isArray(screen.options) && screen.options.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2"><b>Options:</b></Typography>
                  {screen.options.map((opt: any) => (
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