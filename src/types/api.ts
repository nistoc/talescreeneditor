// Базовый URL API с версионированием
export const API_BASE_URL = '/api/v1';

// Общие типы для API
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Типы для профиля
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

// Типы для админки
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeProjects: number;
}

export interface UserManagement {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  lastLogin?: string;
}

// Типы для проектов
export interface Project {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  collaborators: number[];
}

// Дефолтные данные
export const defaultUserProfile: UserProfile = {
  id: 0,
  name: 'Гость',
  email: 'guest@example.com',
  role: 'user',
  createdAt: new Date().toISOString()
};

export const defaultAdminStats: AdminStats = {
  totalUsers: 0,
  activeUsers: 0,
  totalProjects: 0,
  activeProjects: 0
};

export const defaultProject: Project = {
  id: 0,
  title: 'Новый проект',
  description: 'Описание проекта',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: 0,
  collaborators: []
};

// Пустые массивы для списков
export const defaultUserList: UserManagement[] = [];
export const defaultProjectList: Project[] = []; 