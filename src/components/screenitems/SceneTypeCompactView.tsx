import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Screen, Character } from '../../types/api.scenarios';
import { getScenarioImageUrl } from '../../services/imageUtils';

interface SceneTypeCompactViewProps {
  screen: Screen;
  scenarioId: string;
  characters: Character[];
  compact?: boolean;
  parentScreen?: Screen;
}

// Универсальный компонент для отображения актера с именем
const ActorDisplay: React.FC<{
  characterImageUrl: string;
  characterName?: string;
  isOverBackground?: boolean;
}> = ({ characterImageUrl, characterName, isOverBackground = false }) => (
  <Box sx={{
    position: isOverBackground ? 'absolute' : 'relative',
    left: isOverBackground ? '20px' : 'auto',
    top: isOverBackground ? '50%' : 'auto',
    transform: isOverBackground ? 'translateY(-50%)' : 'none',
    zIndex: isOverBackground ? 1 : 'auto'
  }}>
    <Box sx={{ position: 'relative' }}>
      <img
        src={characterImageUrl}
        alt={characterName || 'character'}
        style={{
          maxWidth: '100px',
          maxHeight: '80px',
          borderRadius: '4px',
          objectFit: 'cover'
        }}
      />
      {characterName && (
        <Typography
          variant="caption"
          color="white"
          sx={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'rgba(0,0,0,0.7)',
            padding: '2px 4px',
            borderRadius: '0 0 4px 4px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          {characterName}
        </Typography>
      )}
    </Box>
  </Box>
);

export const SceneTypeCompactView: React.FC<SceneTypeCompactViewProps> = ({
  screen,
  scenarioId,
  characters,
  compact = false,
  parentScreen
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);
  const [parentImageUrl, setParentImageUrl] = useState<string | null>(null);

  // Получаем персонажа для диалогов
  const actorCharacter = screen.type === 'dialog' && screen.actor?.playerId
    ? characters.find(c => c.id === screen.actor.playerId)
    : undefined;

  useEffect(() => {
    async function loadImage() {
      if (screen.image) {
        const url = await getScenarioImageUrl(scenarioId, screen.image);
        setImageUrl(url);
      } else {
        setImageUrl(null);
      }
    }
    loadImage();
  }, [screen.image, scenarioId]);

  useEffect(() => {
    async function loadCharacterImage() {
      if (actorCharacter && actorCharacter.image) {
        const url = await getScenarioImageUrl(scenarioId, actorCharacter.image);
        setCharacterImageUrl(url);
      } else {
        setCharacterImageUrl(null);
      }
    }
    loadCharacterImage();
  }, [actorCharacter, scenarioId]);

  useEffect(() => {
    async function loadParentImage() {
      if (parentScreen && parentScreen.image) {
        const url = await getScenarioImageUrl(scenarioId, parentScreen.image);
        setParentImageUrl(url);
      } else {
        setParentImageUrl(null);
      }
    }
    loadParentImage();
  }, [parentScreen, scenarioId]);

  const maxHeight = compact ? 60 : 60;
  const marginY = compact ? 0.5 : 0.5;

  return (
    <>
      {screen.type !== 'dialog' && screen.type !== 'choice' && screen.type !== 'narrative' && (
        <Typography variant="body1">
          {screen.type}
        </Typography>
      )}

      <Box sx={{ my: marginY, position: 'relative' }}>
        <Box>
          {imageUrl && (
            <img
              src={imageUrl || parentImageUrl || ''}
              alt="screen background"
              style={{
                maxWidth: '100%',
                maxHeight: maxHeight,
                borderRadius: '4px',
                objectFit: 'cover'
              }}
            />
          )}
          {!imageUrl && parentImageUrl && (
            <img
              src={parentImageUrl}
              alt="parent screen background"
              style={{
                maxWidth: '100%',
                maxHeight: maxHeight,
                borderRadius: '4px',
                objectFit: 'cover',
                opacity: 0.5
              }}
            />
          )}
        </Box>

        {/* Актер поверх фона */}
        {screen.type === 'dialog' && characterImageUrl && (
          <ActorDisplay data-type-one={true}
            characterImageUrl={characterImageUrl}
            characterName={actorCharacter?.name}
            isOverBackground={true}
          />
        )}
      </Box>

      {/* Если нет фона, но есть актер для диалога */}
      {!imageUrl && !parentImageUrl && screen.type === 'dialog' && characterImageUrl && (
        <Box sx={{ my: marginY }}>
          <ActorDisplay data-type-two={true}
            characterImageUrl={characterImageUrl}
            characterName={actorCharacter?.name}
            isOverBackground={false}
          />
        </Box>
      )}
    </>
  );
}; 