interface Character {
  id: string;
  name: string;
  type: 'player' | 'npc';
  gender: 'mal' | 'fem';
  image: string;
  notes: string;
}

interface Price {
  type: 'credits';
  value: number;
}

interface ChoiceOption {
  text: string;
  id: string;
  price?: Price;
}

interface Actor {
  playerId: string;
}

// Base interface for common screen properties
interface BaseScreen {
  id: string;
  progress: number;
  content: string;
  image: string;
  next?: string;
}

// Specific screen type interfaces
interface ScreenNarrative extends BaseScreen {
  type: 'narrative';
}

interface ScreenDialog extends BaseScreen {
  type: 'dialog';
  actor: Actor;
}

interface ScreenChoice extends BaseScreen {
  type: 'choice';
  actor: Actor;
  availableFor: string;
  options: ChoiceOption[];
}

interface ScreenBlock extends BaseScreen {
  type: 'block';
  actor: Actor;
  availableFor: string;
}

interface ScreenScene extends BaseScreen {
  type: 'scene';
  title: string;
  screens: Screen[];
}

interface ScreenFinal extends BaseScreen {
  type: 'final';
}

// Union type for all screen types
type Screen = ScreenNarrative | ScreenDialog | ScreenChoice | ScreenBlock | ScreenScene | ScreenFinal;

interface Story {
  id: string;
  characters: Character[];
  maxBranchLength: number;
  firstScreenId: string;
  screens: Screen[];
}

export type { 
  Character, 
  Price, 
  ChoiceOption, 
  Actor, 
  BaseScreen,
  ScreenNarrative,
  ScreenDialog,
  ScreenChoice,
  ScreenBlock,
  ScreenScene,
  ScreenFinal,
  Screen, 
  Story 
}; 