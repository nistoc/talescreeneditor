import React from 'react';
import { Box } from '@mui/material';
import { Screen, Character } from '../../types/api.scenarios';
import { SceneTypeCompactView } from './SceneTypeCompactView';
import { SceneMetaCompactView } from './SceneMetaCompactView';
import { Player } from '../Player';

interface CompactPlayerProps {
    screens: Screen[];
    screen: Screen;
    scenarioId: string;
    characters: Character[];
    compact?: boolean;
    parentScreen?: Screen;
    selectedCharacterId?: string | null;
    onScreenSelect?: (screenId: string) => void;
}

export const CompactPlayer: React.FC<CompactPlayerProps> = ({
    screens,
    screen,
    scenarioId,
    characters,
    compact = false,
    parentScreen,
    selectedCharacterId,
    onScreenSelect
}) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
            <Box data-type sx={{ flex: 1, minWidth: 0, maxWidth: '100px' }}>
                <SceneTypeCompactView
                    screen={screen}
                    scenarioId={scenarioId}
                    characters={characters}
                    compact={compact}
                    parentScreen={parentScreen}
                />
            </Box>
            <Box data-content sx={{ flex: 1, minWidth: 0, maxWidth: '600px', mr: 6 }}>
                <Player
                    screens={screens}
                    selectedScreenId={screen.id}
                    characters={characters}
                    selectedCharacterId={selectedCharacterId ?? null}
                    scenarioId={scenarioId}
                    onScreenSelect={onScreenSelect}
                />
            </Box>
            <Box data-meta sx={{ flex: 0.5 }}>
                <SceneMetaCompactView
                    screen={screen}
                    compact={compact}
                />
            </Box>
        </Box>
    );
}; 