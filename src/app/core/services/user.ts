import { Injectable, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Api } from './api';
import { User, CreateUserRequest, UpdateUserRequest } from '../../shared/models/user.model';
import { signupData } from './database/signupData';
import { getStorageItem, setStorageItem } from '../utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly api = inject(Api);
  private readonly _users = signal<User[]>(this.loadUsers());

  /**
   * Get all users
   */
  getUsers(): Observable<User[]> {
    // Simulate API call - In production, use: return this.api.get<User[]>('/users');
    return of(this._users()).pipe(delay(500));
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User | null> {
    // Simulate API call - In production, use: return this.api.get<User>(`/users/${id}`);
    const user = this._users().find((u) => u.id === id);
    return of(user || null).pipe(delay(300));
  }

  /**
   * Create new user
   */
  createUser(userData: CreateUserRequest): Observable<User> {
    // Simulate API call - In production, use: return this.api.post<User>('/users', userData);
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      name: `${userData.firstName} ${userData.lastName}`,
    };

    const users = [...this._users(), newUser];
    this._users.set(users);
    this.saveUsers(users);

    return of(newUser).pipe(delay(500));
  }

  /**
   * Update user
   */
  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    // Simulate API call - In production, use: return this.api.put<User>(`/users/${id}`, userData);
    const users = this._users();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...users[index],
      ...userData,
      name: userData.firstName && userData.lastName
        ? `${userData.firstName} ${userData.lastName}`
        : users[index].name,
    };

    users[index] = updatedUser;
    this._users.set([...users]);
    this.saveUsers(users);

    return of(updatedUser).pipe(delay(500));
  }

  /**
   * Delete user
   */
  deleteUser(id: string): Observable<boolean> {
    // Simulate API call - In production, use: return this.api.delete<boolean>(`/users/${id}`);
    const users = this._users().filter((u) => u.id !== id);
    this._users.set(users);
    this.saveUsers(users);

    return of(true).pipe(delay(500));
  }

  /**
   * Search users
   */
  searchUsers(query: string): Observable<User[]> {
    const lowerQuery = query.toLowerCase();
    const filtered = this._users().filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowerQuery) ||
        user.lastName.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.userName.toLowerCase().includes(lowerQuery)
    );
    return of(filtered).pipe(delay(300));
  }

  /**
   * Load users from localStorage or default data
   */
  private loadUsers(): User[] {
    try {
      const stored = getStorageItem('users_data');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fall through to default data
    }

    // Convert signupData to User format
    return signupData.map((u) => ({
      ...u,
      name: `${u.firstName} ${u.lastName}`,
    }));
  }

  /**
   * Save users to localStorage
   */
  private saveUsers(users: User[]): void {
    try {
      setStorageItem('users_data', JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  }
}
