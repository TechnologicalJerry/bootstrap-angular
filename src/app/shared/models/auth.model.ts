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