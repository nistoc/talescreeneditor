// Function to get emoji for screen type
export function getScreenTypeEmoji(screenType: string): string {
    switch (screenType) {
        case 'scene':
            return '🎬';
        case 'cutscene':
            return '🎥';
        case 'narrative':
            return '📖';
        case 'dialog':
            return '💬';
        case 'block':
            return '⏳';
        case 'choice':
            return '❓';
        case 'final':
            return '🏁';
        default:
            return '📄';
    }
} 