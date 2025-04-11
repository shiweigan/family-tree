interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  birthDate?: string;
  deathDate?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}