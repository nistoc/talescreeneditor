import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { UserProfile, defaultUserProfile, ApiResponse, API_BASE_URL } from '../types/api';

// Функции для работы с API
async function fetchProfile(userId: number): Promise<UserProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<UserProfile> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return defaultUserProfile;
  }
}

async function updateProfile(userId: number, profile: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<UserProfile> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Хуки для использования в компонентах
export function useProfile(userId: number, options?: UseQueryOptions<UserProfile>) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    initialData: defaultUserProfile,
    ...options,
  });
}

export function useUpdateProfile(userId: number, options?: UseMutationOptions<UserProfile, Error, Partial<UserProfile>>) {
  return useMutation({
    mutationFn: (profile: Partial<UserProfile>) => updateProfile(userId, profile),
    ...options,
  });
} 