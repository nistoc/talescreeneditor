import React, { useEffect, useState, useMemo } from 'react';
import { Typography, Paper, Chip, Divider, Container, Grid, Card, CardContent, LinearProgress, Box, Tooltip, Button } from '@mui/material';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { getScenarioImageUrl } from '../../../services/imageUtils';
import { Screen, Character } from '../../../types/api.scenarios';

interface PlayerProps {
  screens: Screen[];
  selectedScreenId: string | null;
  characters: Character[];
  selectedCharacterId: string | null;
  scenarioId: string;
  onScreenSelect?: (screenId: string) => void;
}

// Рекурсивный поиск экрана по id среди всех уровней
function findScreenById(screens: any[], id: string | null): any | undefined {
  if (!id) return undefined;
  for (const screen of screens) {
    // Пропускаем экраны с типом block
    if (screen.type === 'block') continue;

    if (screen.id === id) return screen;
    if (screen.screens && Array.isArray(screen.screens)) {
      const found = findScreenById(screen.screens, id);
      if (found) return found;
    }
  }
  return undefined;
}

// Рекурсивная функция для поиска максимального значения прогресса
function findMaxProgress(screens: Screen[]): number {
  let maxProgress = 0;

  const traverseScreens = (screenList: Screen[]) => {
    for (const screen of screenList) {
      if (screen.progress > maxProgress) {
        maxProgress = screen.progress;
      }
      // Проверяем, есть ли вложенные экраны (только для определенных типов)
      if ('screens' in screen && screen.screens && Array.isArray(screen.screens)) {
        traverseScreens(screen.screens);
      }
    }
  };

  traverseScreens(screens);
  return maxProgress;
}

export const Player: React.FC<PlayerProps> = ({ screens, selectedScreenId, characters, selectedCharacterId, scenarioId, onScreenSelect }) => {
  const selectedScreen = selectedScreenId ? findScreenById(screens, selectedScreenId) : undefined;
  const parentScreen = selectedScreen?.parentId ? findScreenById(screens, selectedScreen.parentId) : undefined;
  const actorCharacter = selectedScreen?.actor?.playerId ? characters.find(c => c.id === selectedScreen.actor.playerId) : undefined;

  const [screenImageUrl, setScreenImageUrl] = useState<string | null>(null);
  const [actorImageUrl, setActorImageUrl] = useState<string | null>(null);
  const [availableForCharacterImageUrl, setAvailableForCharacterImageUrl] = useState<string | null>(null);

  // Вычисляем максимальный прогресс и текущий прогресс
  const maxProgress = useMemo(() => findMaxProgress(screens), [screens]);
  const currentProgress = selectedScreen?.progress || 0;
  const progressPercentage = maxProgress > 0 ? (currentProgress / maxProgress) * 100 : 0;

  // Проверяем, нужно ли показывать контент в нижней части
  const shouldShowContentBelow = selectedScreen && selectedScreen.type !== 'scene';
  const isSceneType = selectedScreen && selectedScreen.type === 'scene';

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

  useEffect(() => {
    async function loadAvailableForCharacterImage() {
      if (selectedScreen?.actor?.playerId) {
        const character = characters.find(c => c.id === selectedScreen.actor.playerId);
        if (character && character.image) {
          const url = await getScenarioImageUrl(scenarioId, character.image);
          setAvailableForCharacterImageUrl(url);
        } else {
          setAvailableForCharacterImageUrl(null);
        }
      } else {
        setAvailableForCharacterImageUrl(null);
      }
    }
    loadAvailableForCharacterImage();
  }, [selectedScreen?.actor?.playerId, characters, scenarioId]);

  const handleNextClick = () => {
    if (selectedScreen?.next && onScreenSelect) {
      onScreenSelect(selectedScreen.next);
    }
  };

  const handleOptionClick = (optionId: string) => {
    if (onScreenSelect) {
      onScreenSelect(optionId);
    }
  };

  return (
    <Paper
      sx={{
        height: '100%',
        p: 2,
        pb: 8,
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: screenImageUrl ? `url(${screenImageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        '&::before': screenImageUrl ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 0
        } : {}
      }}
    >
      {/* Шкала прогресса */}
      <LinearProgress
        variant="determinate"
        value={progressPercentage}
        sx={{
          height: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'primary.main',
          }
        }}
      />
      {/* Актер - поверх Paper, но под контентом */}
      {actorCharacter && actorImageUrl && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: actorCharacter.id === selectedCharacterId ? 0 : 'auto',
            right: actorCharacter.id === selectedCharacterId ? 'auto' : 0,
            width: '50%',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px'
          }}
        >
          <img
            src={actorImageUrl}
            alt="actor"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}
          >
            {actorCharacter.name}
          </Typography>
        </div>
      )}

      {selectedScreen ? (
        <Container data-text-container
          sx={{
            position: 'relative',
            zIndex: 2,
            p: 0,
            pt: 30,
            display: 'flex',
            flexDirection: 'column',
            flex: 1
          }}
        >
          {/* Показываем Content в центре для экранов типа scene */}
          {isSceneType && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: '600px',
                zIndex: 2
              }}
            >
              {/* Title - 50px выше контента */}
              {selectedScreen.title && (
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'center',
                    mb: 6.25, // 50px in Material-UI units (8 * 6.25 = 50px)
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    fontWeight: 'bold',
                    fontSize: '2rem'
                  }}
                >
                  {selectedScreen.title}
                </Typography>
              )}

              {/* Content */}
              <Card
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  zIndex: 2
                }}
              >
                <CardContent>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedScreen.content}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Показываем Content в нижней части для экранов, которые не являются scene */}
          {shouldShowContentBelow && (
            <Card data-content
              sx={{
                mt: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                zIndex: 2
              }}
            >
              <CardContent>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedScreen.content}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Options */}
          {selectedScreen.options && Array.isArray(selectedScreen.options) && selectedScreen.options.length > 0 && (
            <Card
              sx={{
                mt: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
                zIndex: 2
              }}
            >
              <CardContent>
                {/* Available For */}
                {selectedScreen.availableFor && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 2 }}>
                    {selectedScreen.actor && selectedScreen.actor.playerId && (
                      <Tooltip
                        title="Available for"
                        placement="top"
                        arrow
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              mr: 1,
                              fontWeight: 500,
                              color: 'text.primary'
                            }}
                          >
                            {characters.find(c => c.id === selectedScreen.actor.playerId)?.name || 'Unknown'}
                          </Typography>
                          {availableForCharacterImageUrl && (
                            <img
                              src={availableForCharacterImageUrl}
                              alt="character"
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid rgba(0, 0, 0, 0.1)'
                              }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                )}

                {/* Options */}
                {selectedScreen.options.map((opt: any) => (
                  <Box
                    key={opt.id}
                    onClick={() => handleOptionClick(opt.id)}
                    sx={{
                      display: 'block',
                      mb: 1,
                      p: 1.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 1,
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      },
                      '&:last-child': {
                        mb: 0
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          lineHeight: 1.5,
                          m: 0,
                          flex: 1
                        }}
                      >
                        {opt.text}
                      </Typography>
                      {opt.price && (
                        <Chip
                          label={`${opt.price.value} ${opt.price.type}`}
                          size="small"
                          sx={{
                            ml: 1,
                            backgroundColor: 'primary.main',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            minWidth: 'fit-content'
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

        </Container>
      ) : (
        <Container
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2
          }}
        >
          <Card
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent>
              <Typography variant="body1">No screen selected</Typography>
            </CardContent>
          </Card>
        </Container>
      )}

      {/* Next Button - показываем если нет options или options пустые */}
      {selectedScreen && (!selectedScreen.options || !Array.isArray(selectedScreen.options) || selectedScreen.options.length === 0) && selectedScreen?.next && (
        <Box sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 3
        }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleNextClick}
            sx={{
              px: 3,
              py: 1,
              fontSize: '0.875rem',
              fontWeight: 'bold',
              backgroundColor: 'primary.main',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Next
          </Button>
        </Box>
      )}
    </Paper>
  );
}; 