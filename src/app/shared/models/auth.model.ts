// models/auth.model.ts
export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dob: Date;
  role: 'admin' | 'user' | 'supervisor';
}