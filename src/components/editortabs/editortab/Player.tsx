import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, Divider } from '@mui/material';
import { getScenarioImageUrl } from '../../../services/imageUtils';

interface PlayerProps {
  screens: any[];
  selectedScreenId: string | null;
  selectedScreenParentId: string | null;
  characters: any[];
  selectedCharacterId: string | null;
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

export const Player: React.FC<PlayerProps> = ({ screens, selectedScreenId, selectedScreenParentId, characters, selectedCharacterId }) => {
  const screen = findScreenById(screens, selectedScreenId);
  const parentScreen = selectedScreenParentId ? findScreenById(screens, selectedScreenParentId) : undefined;
  const character = characters.find(c => c.id === selectedCharacterId);

  const [screenImageUrl, setScreenImageUrl] = useState<string | null>(null);
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadScreenImage() {
      if (screen && screen.image) {
        const url = await getScenarioImageUrl(screen.id, screen.image);
        setScreenImageUrl(url);
      } else if (parentScreen && parentScreen.image) {
        const url = await getScenarioImageUrl(parentScreen.id, parentScreen.image);
        setScreenImageUrl(url);
      } else {
        setScreenImageUrl(null);
      }
    }
    loadScreenImage();
  }, [screen, parentScreen]);

  useEffect(() => {
    async function loadCharacterImage() {
      if (character && character.image) {
        const url = await getScenarioImageUrl(character.id, character.image);
        setCharacterImageUrl(url);
      } else {
        setCharacterImageUrl(null);
      }
    }
    loadCharacterImage();
  }, [character]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Player</Typography>
      {screen ? (
        <Box>
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
          {screen.actor && <Typography variant="body2"><b>Actor:</b> {typeof screen.actor === 'object' ? JSON.stringify(screen.actor) : screen.actor}</Typography>}
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
      ) : (
        <Typography variant="body2">No screen selected</Typography>
      )}
      <Divider sx={{ my: 2 }} />
      <Box>
        <Typography variant="subtitle2">Selected Character:</Typography>
        {character ? (
          <Box>
            <Typography variant="body2">{character.name || character.id}</Typography>
            {characterImageUrl && <Box sx={{ my: 1 }}><img src={characterImageUrl} alt="character" style={{ maxWidth: '100%', maxHeight: 120 }} /></Box>}
          </Box>
        ) : (
          <Typography variant="body2">No character selected</Typography>
        )}
      </Box>
    </Paper>
  );
}; 