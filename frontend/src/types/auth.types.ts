export interface User {
  id: string;
  username: string;
  email: string;
  fullNameAr: string;
  fullNameEn: string;
  role: string;
  roleAr: string;
  permissions: string[];
  departmentId?: number;
  departmentNameAr?: string;
  departmentNameEn?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
