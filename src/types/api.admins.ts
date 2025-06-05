export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeProjects: number;
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
  totalProjects: 0,
  activeProjects: 0
};

export const defaultUserList: UserManagement[] = []; 