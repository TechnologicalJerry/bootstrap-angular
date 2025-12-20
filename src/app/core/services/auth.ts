import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Api } from './api';
import { AuthResponse, LoginRequest, SignupRequest } from '../../shared/models/auth.model';
import { User } from '../../shared/models/user.model';
import { loginData } from './database/loginData';
import { signupData } from './database/signupData';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly api = inject(Api);
  private readonly router = inject(Router);
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  // Signals for reactive state
  private readonly _currentUser = signal<User | null>(this.getStoredUser());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  /**
   * Login user with email/username and password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Simulate API call - In production, use: return this.api.post<AuthResponse>('/auth/login', credentials);
    
    return of(this.mockLogin(credentials)).pipe(
      delay(1000), // Simulate network delay
      map((response) => {
        if (response) {
          this.setAuthData(response.accessToken, response.user);
          return response;
        }
        throw new Error('Invalid email/username or password');
      })
    );
  }

  /**
   * Signup new user
   */
  signup(userData: SignupRequest): Observable<AuthResponse> {
    // Simulate API call - In production, use: return this.api.post<AuthResponse>('/auth/signup', userData);
    
    return of(this.mockSignup(userData)).pipe(
      delay(1000), // Simulate network delay
      map((response) => {
        if (response) {
          this.setAuthData(response.accessToken, response.user);
          return response;
        }
        throw new Error('Signup failed');
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    removeStorageItem(this.tokenKey);
    removeStorageItem(this.userKey);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return getStorageItem(this.tokenKey);
  }

  /**
   * Check if user is authenticated
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get stored user from localStorage
   */
  private getStoredUser(): User | null {
    const userStr = getStorageItem(this.userKey);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Store auth data
   */
  private setAuthData(token: string, user: User): void {
    setStorageItem(this.tokenKey, token);
    setStorageItem(this.userKey, JSON.stringify(user));
    this._currentUser.set(user);
  }

  /**
   * Mock login - matches against loginData
   */
  private mockLogin(credentials: LoginRequest): AuthResponse | null {
    const user = loginData.find(
      (u) =>
        (u.email === credentials.emailOrUsername || u.userName === credentials.emailOrUsername) &&
        u.password === credentials.password
    );

    if (user) {
      // Find full user data from signupData
      const fullUser = signupData.find((u) => u.email === user.email || u.userName === user.userName);
      
      if (fullUser) {
        return {
          accessToken: this.generateMockToken(),
          expiresIn: 3600,
          user: {
            id: fullUser.id,
            firstName: fullUser.firstName,
            lastName: fullUser.lastName,
            userName: fullUser.userName,
            email: fullUser.email,
            phone: fullUser.phone,
            gender: fullUser.gender,
            dob: fullUser.dob,
            role: fullUser.role,
            name: user.name,
          },
        };
      }
    }

    return null;
  }

  /**
   * Mock signup - adds to signupData
   */
  private mockSignup(userData: SignupRequest): AuthResponse | null {
    // Check if user already exists
    const existingUser = signupData.find(
      (u) => u.email === userData.email || u.userName === userData.userName
    );

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      userName: userData.userName,
      email: userData.email,
      phone: userData.phone,
      gender: userData.gender,
      dob: userData.dob,
      role: userData.role,
      name: `${userData.firstName} ${userData.lastName}`,
    };

    return {
      accessToken: this.generateMockToken(),
      expiresIn: 3600,
      user: newUser,
    };
  }

  /**
   * Generate mock JWT token
   */
  private generateMockToken(): string {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}
