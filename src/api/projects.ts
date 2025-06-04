import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { 
  Project, 
  defaultProject, 
  defaultProjectList,
  ApiResponse, 
  API_BASE_URL 
} from '../types/api';

// Функции для работы с API
async function fetchProjects(page: number = 1, limit: number = 10): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<Project[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return defaultProjectList;
  }
}

async function fetchProject(projectId: number): Promise<Project> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<Project> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return defaultProject;
  }
}

async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<Project> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

async function updateProject(projectId: number, project: Partial<Project>): Promise<Project> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<Project> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// Хуки для использования в компонентах
export function useProjects(page: number = 1, limit: number = 10, options?: UseQueryOptions<Project[]>) {
  return useQuery({
    queryKey: ['projects', page, limit],
    queryFn: () => fetchProjects(page, limit),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    initialData: defaultProjectList,
    ...options,
  });
}

export function useProject(projectId: number, options?: UseQueryOptions<Project>) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    initialData: defaultProject,
    ...options,
  });
}

export function useCreateProject(options?: UseMutationOptions<Project, Error, Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) {
  return useMutation({
    mutationFn: createProject,
    ...options,
  });
}

export function useUpdateProject(projectId: number, options?: UseMutationOptions<Project, Error, Partial<Project>>) {
  return useMutation({
    mutationFn: (project: Partial<Project>) => updateProject(projectId, project),
    ...options,
  });
} 