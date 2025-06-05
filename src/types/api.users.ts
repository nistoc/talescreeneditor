export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export const defaultUserProfile: UserProfile = {
  id: 0,
  name: 'Гость',
  email: 'guest@example.com',
  role: 'user',
  createdAt: new Date().toISOString()
}; 