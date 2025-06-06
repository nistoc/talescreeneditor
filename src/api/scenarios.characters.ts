import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiResponse, API_BASE_URL } from '../types/api';
import { Scenario, Character } from '../types/api.scenarios';

// Character management functions
async function updateCharacterOrder(scenarioId: string, characterIds: string[]): Promise<Scenario> {
  try {
    const response = await fetch(`${API_BASE_URL}/scenarios/${scenarioId}/characters/order`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ characterIds }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<Scenario> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating character order:', error);
    throw error;
  }
}

async function updateCharacter(scenarioId: string, characterIndex: number, character: Partial<Character>): Promise<Scenario> {
  try {
    const response = await fetch(`${API_BASE_URL}/scenarios/${scenarioId}/characters/${characterIndex}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<Scenario> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating character:', error);
    throw error;
  }
}

async function deleteCharacter(scenarioId: string, characterId: string): Promise<Scenario> {
  try {
    const response = await fetch(`${API_BASE_URL}/scenarios/${scenarioId}/characters/${characterId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<Scenario> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error deleting character:', error);
    throw error;
  }
}

async function addCharacter(scenarioId: string, character: Omit<Character, 'id'>): Promise<Scenario> {
  try {
    const response = await fetch(`${API_BASE_URL}/scenarios/${scenarioId}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<Scenario> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error adding character:', error);
    throw error;
  }
}

// Character management hooks
export function useUpdateCharacterOrder(scenarioId: string, options?: UseMutationOptions<Scenario, Error, string[]>) {
  return useMutation({
    mutationFn: (characterIds: string[]) => updateCharacterOrder(scenarioId, characterIds),
    ...options,
  });
}

export function useUpdateCharacter(scenarioId: string, options?: UseMutationOptions<Scenario, Error, { index: number; character: Partial<Character> }>) {
  return useMutation({
    mutationFn: ({ index, character }) => updateCharacter(scenarioId, index, character),
    ...options,
  });
}

export function useDeleteCharacter(scenarioId: string, options?: UseMutationOptions<Scenario, Error, string>) {
  return useMutation({
    mutationFn: (characterId: string) => deleteCharacter(scenarioId, characterId),
    ...options,
  });
}

export function useAddCharacter(scenarioId: string, options?: UseMutationOptions<Scenario, Error, Omit<Character, 'id'>>) {
  return useMutation({
    mutationFn: (character: Omit<Character, 'id'>) => addCharacter(scenarioId, character),
    ...options,
  });
} 