export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  collaborators: number[];
}

export const defaultProject: Project = {
  id: '0',
  title: 'Новый проект',
  description: 'Описание проекта',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: 0,
  collaborators: []
};

export const defaultProjectList: Project[] = [
  {
    id: '1',
    title: 'Мой первый проект',
    description: 'Это мой первый проект в системе',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: 1,
    collaborators: []
  },
  {
    id: '2',
    title: 'Проект в разработке',
    description: 'Проект находится в стадии разработки',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: 1,
    collaborators: []
  },
  {
    id: '3',
    title: 'Завершенный проект',
    description: 'Этот проект уже завершен',
    status: 'archived',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: 1,
    collaborators: []
  },
  {
    id: 'scenario_01',
    title: 'Завершенный проект',
    description: 'Этот проект уже завершен',
    status: 'archived',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: 1,
    collaborators: []
  }
]; 