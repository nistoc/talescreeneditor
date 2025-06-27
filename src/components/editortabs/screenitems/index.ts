
// Режимы представления экранов
export enum ScreenViewMode {
    COMPACT = 'compact',           // Компактное представление
    PLAYER_VIEW = 'player_view',   // В виде плеера с просмотром
    PLAYER_EDIT = 'player_edit'    // В виде плеера с редактированием
  }

export { NestedScreenItem } from './NestedScreenItem';
export { CompactView } from './CompactView';
export { CompactPlayer } from './CompactPlayer';
export { CompactEditor } from './CompactEditor';
export { OptionsCompactView } from './OptionsCompactView';
export { SceneTypeCompactView } from './SceneTypeCompactView';
export { SceneContentCompactView } from './SceneContentCompactView';
export { SceneMetaCompactView } from './SceneMetaCompactView'; 