import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Типы для примера
interface User {
  id: number;
  name: string;
  email: string;
}

// Дефолтные данные
const defaultUser: User = {
  id: 0,
  name: 'Гость',
  email: 'guest@example.com'
};

// Функция для получения данных
async function fetchUser(userId: number): Promise<User> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    // В случае ошибки возвращаем дефолтные данные
    console.error('Error fetching user:', error);
    return defaultUser;
  }
}

// Хук для использования в компонентах
export function useUser(userId: number, options?: UseQueryOptions<User>) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    // Настройки по умолчанию
    retry: 1, // Количество попыток повтора запроса
    staleTime: 5 * 60 * 1000, // Время, после которого данные считаются устаревшими (5 минут)
    gcTime: 30 * 60 * 1000, // Время хранения данных в кэше (30 минут)
    // Дефолтные данные, которые будут использоваться до загрузки
    initialData: defaultUser,
    ...options,
  });
} 