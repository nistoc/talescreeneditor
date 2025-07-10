// Базовый URL API с версионированием
export const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

// Общие типы для API
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}