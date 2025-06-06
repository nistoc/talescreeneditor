import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiResponse, API_BASE_URL } from '../types/api';

// Function to load JSON from default files
async function loadDefaultJson(scenarioId: string): Promise<string> {
  try {
    // Try to fetch the default JSON file
    const response = await fetch(`/src/types/defaults/${scenarioId}.json`);
    if (!response.ok) {
      throw new Error('Default file not found');
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading default JSON:', error);
    throw error;
  }
}

// Function to get full JSON data of a scenario
async function fetchScenarioJson(scenarioId: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/scenarios/${scenarioId}/json`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<string> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching scenario JSON from API:', error);
    // Try to load from default files
    return loadDefaultJson(scenarioId);
  }
}

// Function to update full JSON data of a scenario
async function updateScenarioJson(scenarioId: string, jsonData: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/scenarios/${scenarioId}/json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData,
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<string> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating scenario JSON:', error);
    throw error;
  }
}

// Hooks for using in components
export function useScenarioJson(scenarioId: string, options?: UseQueryOptions<string>) {
  return useQuery({
    queryKey: ['scenarioJson', scenarioId],
    queryFn: () => fetchScenarioJson(scenarioId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useUpdateScenarioJson(scenarioId: string, options?: UseMutationOptions<string, Error, string>) {
  return useMutation({
    mutationFn: (jsonData: string) => updateScenarioJson(scenarioId, jsonData),
    ...options,
  });
} 