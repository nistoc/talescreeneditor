import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiResponse, API_BASE_URL } from '../types/api';
import { AdminStats, UserManagement, defaultAdminStats, defaultUserList } from '../types/api.admins';

// Функции для работы с API
async function fetchAdminStats(): Promise<AdminStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<AdminStats> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return defaultAdminStats;
  }
}

async function fetchUsers(page: number = 1, limit: number = 10): Promise<UserManagement[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<UserManagement[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return defaultUserList;
  }
}

async function updateUserStatus(userId: number, status: UserManagement['status']): Promise<UserManagement> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse<UserManagement> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
}

// Хуки для использования в компонентах
export function useAdminStats(options?: UseQueryOptions<AdminStats>) {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    initialData: defaultAdminStats,
    ...options,
  });
}

export function useUsers(page: number = 1, limit: number = 10, options?: UseQueryOptions<UserManagement[]>) {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => fetchUsers(page, limit),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    initialData: defaultUserList,
    ...options,
  });
}

export function useUpdateUserStatus(userId: number, options?: UseMutationOptions<UserManagement, Error, UserManagement['status']>) {
  return useMutation({
    mutationFn: (status: UserManagement['status']) => updateUserStatus(userId, status),
    ...options,
  });
} 