// models/user.model.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dob: Date | string;
  role: 'admin' | 'user' | 'supervisor';
  name?: string; // For backward compatibility
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dob: Date | string;
  role: 'admin' | 'user' | 'supervisor';
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {}
