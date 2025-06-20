import React from 'react';
import { Box } from '@mui/material';
import { Screen, Character } from '../../../../types/api.scenarios';
import { SceneTypeCompactView } from './SceneTypeCompactView';
import { SceneContentCompactView } from './SceneContentCompactView';
import { SceneMetaCompactView } from './SceneMetaCompactView';

interface CompactViewProps {
    screen: Screen;
    scenarioId: string;
    characters: Character[];
    compact?: boolean;
    parentScreen?: Screen;
}

export const CompactView: React.FC<CompactViewProps> = ({
    screen,
    scenarioId,
    characters,
    compact = false,
    parentScreen
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
            <Box data-content sx={{ flex: 1, minWidth: 0 }}>
                <SceneContentCompactView
                    screen={screen}
                    compact={compact}
                />
            </Box>
            <Box data-meta sx={{ flex: 0.5, maxWidth: '200px' }}>
                <SceneMetaCompactView
                    screen={screen}
                    compact={compact}
                />
            </Box>
        </Box>
    );
}; 