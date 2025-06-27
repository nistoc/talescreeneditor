import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiResponse, API_BASE_URL } from '../types/api';
import { Scenario, defaultScenarioList } from '../types/api.scenarios';

// Функции для работы с API
async function fetchScenarios(page: number = 1, limit: number = 10): Promise<Scenario[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/scenarios?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<Scenario[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    return defaultScenarioList;
  }
}

async function fetchScenario(scenarioId: string): Promise<Scenario> {
  try {
    const response = await fetch(`${API_BASE_URL}/scenarios/${scenarioId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<Scenario> = await response.json();
    return data.data;
  } catch (error) {
    return defaultScenarioList.find(scenario => scenario.id === scenarioId) || defaultScenarioList[0];
  }
}

async function createScenario(scenario: Omit<Scenario, 'id' | 'updatedAt'>): Promise<Scenario> {
  try {
    const response = await fetch(`${API_BASE_URL}/scenarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scenario),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<Scenario> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating scenario:', error);
    throw error;
  }
}

async function updateScenario(scenarioId: string, scenario: Partial<Scenario>): Promise<Scenario> {
  try {
    const response = await fetch(`${API_BASE_URL}/scenarios/${scenarioId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scenario),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<Scenario> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating scenario:', error);
    throw error;
  }
}

// Хуки для использования в компонентах
export function useScenarios(page: number = 1, limit: number = 10, options?: UseQueryOptions<Scenario[]>) {
  return useQuery({
    queryKey: ['scenarios', page, limit],
    queryFn: () => fetchScenarios(page, limit),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useScenario(scenarioId: string, options?: UseQueryOptions<Scenario>) {
  return useQuery({
    queryKey: ['scenario', scenarioId],
    queryFn: () => fetchScenario(scenarioId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useCreateScenario(options?: UseMutationOptions<Scenario, Error, Omit<Scenario, 'id' | 'updatedAt'>>) {
  return useMutation({
    mutationFn: createScenario,
    ...options,
  });
}

export function useUpdateScenario(scenarioId: string, options?: UseMutationOptions<Scenario, Error, Partial<Scenario>>) {
  return useMutation({
    mutationFn: (scenario: Partial<Scenario>) => updateScenario(scenarioId, scenario),
    ...options,
  });
} 