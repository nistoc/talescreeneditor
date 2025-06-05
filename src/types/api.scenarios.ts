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
  notes: string;
}

// Specific screen type interfaces
interface ScreenNarrative extends BaseScreen {
  type: 'narrative';
  screens: Screen[];
}

interface ScreenDialog extends BaseScreen {
  type: 'dialog';
  actor: Actor;
  screens: Screen[];
}


interface ScreenBlock extends BaseScreen {
  type: 'block';
  actor: Actor;
  availableFor: string;
}
interface ScreenChoice extends BaseScreen {
  type: 'choice';
  actor: Actor;
  availableFor: string;
  options: ChoiceOption[];
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

interface Scenario {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
  ownerId: number;

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
  Scenario 
}; 

export const defaultScenario: Scenario = {
  id: '0',
  title: 'Новый сценарий',
  description: '',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: 0,
  characters: [],
  maxBranchLength: 0,
  firstScreenId: '',
  screens: []
};

const scenario_01: Scenario ={
  id: 'scenario_01',
  title: 'My First Project',
  description: 'This is my first project in the system',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: 1,
  characters: [],
  maxBranchLength: 0,
  firstScreenId: '',
  screens: []
};
const scenario_03: Scenario ={
  id: 'scenario_03',
  title: 'Project in Development',
  description: 'Project is in development stage',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: 1,
  characters: [],
  maxBranchLength: 0,
  firstScreenId: '',
  screens: []
};
const scenario_04: Scenario ={
  id: 'scenario_04',
  title: 'Completed Project',
  description: 'This project is already completed',
  status: 'archived',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: 1,
  characters: [],
  maxBranchLength: 0,
  firstScreenId: '',
  screens: []
};

export const defaultScenarioList: Scenario[] = [defaultScenario, scenario_01, scenario_03, scenario_04]; 