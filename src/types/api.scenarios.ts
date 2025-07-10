import { 
  defaultScenarioDataMoonlightHeist,
  defaultScenarioDataCrimsonMasquerade, 
  defaultScenarioDataDaughterOfTheFlame, 
  defaultScenarioDataShareTheBed,
  defaultScenarioDataThreadsOfTheMoon
 } from './defaults';

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
  parentId?: string;
  progress: number;
  image: string;
  next?: string;
  notes: string;
}

// Specific screen type interfaces
interface ScreenNarrative extends BaseScreen {
  type: 'narrative';
  content: string;
  screens: Screen[];
}

interface ScreenDialog extends BaseScreen {
  type: 'dialog';
  content: string;
  actor: Actor;
  screens: Screen[];
}


interface ScreenBlock extends BaseScreen {
  type: 'block';
  content: string;
  actor: Actor;
  availableFor: string;
}
interface ScreenChoice extends BaseScreen {
  type: 'choice';
  content: string;
  actor: Actor;
  availableFor: string;
  options: ChoiceOption[];
}

interface ScreenScene extends BaseScreen {
  type: 'scene';
  content: string;
  title: string;
  screens: Screen[];
}

interface ScreenFinal extends BaseScreen {
  type: 'final';
  content: string;
}

interface ScreenCutscene extends BaseScreen {
  type: 'cutscene';
}

// Union type for all screen types
type Screen = ScreenNarrative | ScreenDialog | ScreenChoice | ScreenBlock | ScreenScene | ScreenFinal | ScreenCutscene;

interface IntroContent {
  content: string;
  image: string;
}

interface Intro {
  mal: IntroContent;
  fem: IntroContent;
}

interface Scenario {
  id: string;
  title: string;
  status: 'active' | 'archived' | 'draft';
  updatedAt: string;
  ownerId: number;
  characters: Character[];
  maxBranchLength: number;
  firstScreenId: string;
  screens: Screen[];
  price?: Price;
  animatedCover?: string;
  intro?: Intro;
  genres?: string[];
  labels?: string[];
  createdDate?: string;
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
  ScreenCutscene,
  Screen, 
  Scenario 
}; 

function transformScreen(screen: any, parentScreen?: Screen): Screen {
  const baseScreen = {
    id: screen.id,
    parentId: parentScreen?.id,
    progress: screen.progress,
    content: screen.content,
    image: screen.image,
    notes: screen.notes || '',
    next: screen.next
  };

  switch (screen.type) {
    case 'narrative':
      return {
        ...baseScreen,
        type: 'narrative',
        screens: screen.screens?.map((s: any) => transformScreen(s, screen)) || []
      };
    case 'dialog':
      return {
        ...baseScreen,
        type: 'dialog',
        actor: screen.actor,
        screens: screen.screens?.map((s: any) => transformScreen(s, screen)) || []
      };
    case 'choice':
      return {
        ...baseScreen,
        type: 'choice',
        actor: screen.actor,
        availableFor: screen.availableFor,
        options: screen.options || []
      };
    case 'block':
      return {
        ...baseScreen,
        type: 'block',
        actor: screen.actor,
        availableFor: screen.availableFor
      };
    case 'scene':
      return {
        ...baseScreen,
        type: 'scene',
        title: screen.title,
        screens: screen.screens?.map((s: any) => transformScreen(s, screen)) || []
      };
    case 'final':
      return {
        ...baseScreen,
        type: 'final'
      };
    case 'cutscene':
      return {
        ...baseScreen,
        type: 'cutscene'
      };
    default:
      throw new Error(`Unknown screen type: ${screen.type}`);
  }
}

export const defaultScenarioMoonlightHeist: Scenario = {
  ...defaultScenarioDataMoonlightHeist,
  status: defaultScenarioDataMoonlightHeist.status as 'draft' | 'active' | 'archived',
  characters: defaultScenarioDataMoonlightHeist.characters.map(char => ({
    ...char,
    type: char.type as 'player' | 'npc',
    gender: char.gender as 'mal' | 'fem'
  })),
  screens: defaultScenarioDataMoonlightHeist.screens.map(s => transformScreen(s)),
  updatedAt: new Date().toISOString(),
  price: {
    type: 'credits',
    value: defaultScenarioDataMoonlightHeist.price?.value || 0
  },
  animatedCover: defaultScenarioDataMoonlightHeist.animatedCover || '',
  intro: defaultScenarioDataMoonlightHeist.intro || {
    mal: { content: '', image: '' },
    fem: { content: '', image: '' }
  },
  genres: defaultScenarioDataMoonlightHeist.genres || [],
  labels: defaultScenarioDataMoonlightHeist.labels || [],
  createdDate: defaultScenarioDataMoonlightHeist.createdDate || new Date().toISOString()
};

export const defaultScenarioCrimsonMasquerade: Scenario = {
  ...defaultScenarioDataCrimsonMasquerade,
  status: defaultScenarioDataCrimsonMasquerade.status as 'draft' | 'active' | 'archived',
  characters: defaultScenarioDataCrimsonMasquerade.characters.map(char => ({
    ...char,
    type: char.type as 'player' | 'npc',
    gender: char.gender as 'mal' | 'fem'
  })),
  screens: defaultScenarioDataCrimsonMasquerade.screens.map(s => transformScreen(s)),
  updatedAt: new Date().toISOString(),
  price: {
    type: 'credits',
    value: defaultScenarioDataCrimsonMasquerade.price?.value || 0
  },
  animatedCover: defaultScenarioDataCrimsonMasquerade.animatedCover || '',
  intro: defaultScenarioDataCrimsonMasquerade.intro || {
    mal: { content: '', image: '' },
    fem: { content: '', image: '' }
  },
  genres: defaultScenarioDataCrimsonMasquerade.genres || [],
  labels: defaultScenarioDataCrimsonMasquerade.labels || [],
  createdDate: defaultScenarioDataCrimsonMasquerade.createdDate || new Date().toISOString()
};

export const defaultScenarioDaughterOfTheFlame: Scenario = {
  ...defaultScenarioDataDaughterOfTheFlame,
  status: defaultScenarioDataDaughterOfTheFlame.status as 'draft' | 'active' | 'archived',
  characters: defaultScenarioDataDaughterOfTheFlame.characters.map(char => ({
    ...char,
    type: char.type as 'player' | 'npc',
    gender: char.gender as 'mal' | 'fem'
  })),
  screens: defaultScenarioDataDaughterOfTheFlame.screens.map(s => transformScreen(s)),
  updatedAt: new Date().toISOString(),
  price: {
    type: 'credits',
    value: defaultScenarioDataDaughterOfTheFlame.price?.value || 0
  },
  animatedCover: defaultScenarioDataDaughterOfTheFlame.animatedCover || '',
  intro: defaultScenarioDataDaughterOfTheFlame.intro || {
    mal: { content: '', image: '' },
    fem: { content: '', image: '' }
  },
  genres: defaultScenarioDataDaughterOfTheFlame.genres || [],
  labels: defaultScenarioDataDaughterOfTheFlame.labels || [],
  createdDate: defaultScenarioDataDaughterOfTheFlame.createdDate || new Date().toISOString()
};

export const defaultScenarioShareTheBed: Scenario = {
  ...defaultScenarioDataShareTheBed,
  status: defaultScenarioDataShareTheBed.status as 'draft' | 'active' | 'archived',
  characters: defaultScenarioDataShareTheBed.characters.map(char => ({
    ...char,
    type: char.type as 'player' | 'npc',
    gender: char.gender as 'mal' | 'fem'
  })),
  screens: defaultScenarioDataShareTheBed.screens.map(s => transformScreen(s)),
  updatedAt: new Date().toISOString(),
  price: {
    type: 'credits',
    value: defaultScenarioDataShareTheBed.price?.value || 0
  },
  animatedCover: defaultScenarioDataShareTheBed.animatedCover || '',
  intro: defaultScenarioDataShareTheBed.intro || {
    mal: { content: '', image: '' },
    fem: { content: '', image: '' }
  },
  genres: defaultScenarioDataShareTheBed.genres || [],
  labels: defaultScenarioDataShareTheBed.labels || [],
  createdDate: defaultScenarioDataShareTheBed.createdDate || new Date().toISOString()
};

export const defaultScenarioThreadsOfTheMoon: Scenario = {
  ...defaultScenarioDataThreadsOfTheMoon,
  status: defaultScenarioDataThreadsOfTheMoon.status as 'draft' | 'active' | 'archived',
  characters: defaultScenarioDataThreadsOfTheMoon.characters.map(char => ({
    ...char,
    type: char.type as 'player' | 'npc',
    gender: char.gender as 'mal' | 'fem'
  })),
  screens: defaultScenarioDataThreadsOfTheMoon.screens.map(s => transformScreen(s)),
  updatedAt: new Date().toISOString(),
  price: {
    type: 'credits',
    value: defaultScenarioDataThreadsOfTheMoon.price?.value || 0
  },
  animatedCover: defaultScenarioDataThreadsOfTheMoon.animatedCover || '',
  intro: defaultScenarioDataThreadsOfTheMoon.intro || {
    mal: { content: '', image: '' },
    fem: { content: '', image: '' }
  },
  genres: defaultScenarioDataThreadsOfTheMoon.genres || [],
  labels: defaultScenarioDataThreadsOfTheMoon.labels || [],
  createdDate: defaultScenarioDataThreadsOfTheMoon.createdDate || new Date().toISOString()
};

const scenario_01: Scenario = {
  id: 'scenario_01',
  title: 'My First Project',
  status: 'active',
  updatedAt: new Date().toISOString(),
  ownerId: 1,
  characters: [],
  maxBranchLength: 0,
  firstScreenId: '',
  screens: []
};

const scenario_03: Scenario = {
  id: 'scenario_03',
  title: 'Project in Development',
  status: 'draft',
  updatedAt: new Date().toISOString(),
  ownerId: 1,
  characters: [],
  maxBranchLength: 0,
  firstScreenId: '',
  screens: []
};

const scenario_04: Scenario = {
  id: 'scenario_04',
  title: 'Completed Project',
  status: 'archived',
  updatedAt: new Date().toISOString(),
  ownerId: 1,
  characters: [],
  maxBranchLength: 0,
  firstScreenId: '',
  screens: []
};

export const defaultScenarioList: Scenario[] = [
  defaultScenarioMoonlightHeist, 
  defaultScenarioCrimsonMasquerade, 
  defaultScenarioDaughterOfTheFlame, 
  defaultScenarioShareTheBed, 
  defaultScenarioThreadsOfTheMoon,
  scenario_01, 
  scenario_03, 
  scenario_04]; 