export interface Scenario {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  collaborators: number[];
}

export const defaultScenario: Scenario = {
  id: '0',
  title: 'Новый сценарий',
  description: '',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: 0,
  collaborators: []
};

const scenario_01: Scenario ={
  id: 'scenario_01',
  title: 'Мой первый проект',
  description: 'Это мой первый проект в системе',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: 1,
  collaborators: []
};
const scenario_02: Scenario ={
  id: 'scenario_02',
  title: 'Мой первый проект',
  description: 'Это мой первый проект в системе',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: 1,
  collaborators: []
};
const scenario_03: Scenario ={
  id: 'scenario_03',
  title: 'Проект в разработке',
  description: 'Проект находится в стадии разработки',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: 1,
  collaborators: []
};
const scenario_04: Scenario ={
  id: 'scenario_04',
  title: 'Завершенный проект',
  description: 'Этот проект уже завершен',
  status: 'archived',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: 1,
  collaborators: []
};
const scenario_05: Scenario ={
  id: 'scenario_05',
  title: 'Завершенный проект',
  description: 'Этот проект уже завершен',
  status: 'archived',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: 1,
  collaborators: []
};

export const defaultScenarioList: Scenario[] = [defaultScenario, scenario_01, scenario_02, scenario_03, scenario_04, scenario_05]; 