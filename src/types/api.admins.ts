export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalScenarios: number;
  activeScenarios: number;
}

export interface UserManagement {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  lastLogin?: string;
}

export const defaultAdminStats: AdminStats = {
  totalUsers: 0,
  activeUsers: 0,
  totalScenarios: 0,
  activeScenarios: 0
};

export const defaultUserList: UserManagement[] = []; 