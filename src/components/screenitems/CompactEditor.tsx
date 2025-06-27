import React from 'react';
import { Box } from '@mui/material';
import { Screen, Character } from '../../types/api.scenarios';
import { SceneTypeCompactView } from './SceneTypeCompactView';
import { Player } from '../Player';
import { ScreenPopulator } from '../fieldseditor/ScreenPopulator';

interface CompactEditorProps {
    screens: Screen[];
    screen: Screen;
    scenarioId: string;
    characters: Character[];
    compact?: boolean;
    parentScreen?: Screen;
    selectedCharacterId?: string | null;
    onScreenSelect?: (screenId: string) => void;
}

export const CompactEditor: React.FC<CompactEditorProps> = ({
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
            <Box data-content sx={{ flex: 2, minWidth: 0, maxWidth: '600px', mr: 6 }}>
                <Player
                    screens={screens}
                    selectedScreenId={screen.id}
                    characters={characters}
                    selectedCharacterId={selectedCharacterId ?? null}
                    scenarioId={scenarioId}
                    onScreenSelect={onScreenSelect}
                />
            </Box>
            <Box data-content sx={{ flex: 3, minWidth: 0 }}>
                <ScreenPopulator
                    screens={screens}
                    screen={screen}
                    parentScreen={parentScreen}
                    characters={characters}
                />
            </Box>
        </Box>
    );
}; 