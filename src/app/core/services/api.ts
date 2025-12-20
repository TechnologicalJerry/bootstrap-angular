import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api'; // Change this to your actual API base URL

  /**
   * Generic GET request
   */
  get<T>(endpoint: string, params?: Record<string, string | number>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.set(key, params[key].toString());
      });
    }

    return this.http
      .get<T>(`${this.baseUrl}${endpoint}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic POST request
   */
  post<T>(endpoint: string, body: unknown): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<T>(`${this.baseUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic PUT request
   */
  put<T>(endpoint: string, body: unknown): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .put<T>(`${this.baseUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic PATCH request
   */
  patch<T>(endpoint: string, body: unknown): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .patch<T>(`${this.baseUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`).pipe(catchError(this.handleError));
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: unknown): Observable<never> => {
    let errorMessage = 'An unknown error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'error' in error) {
      const httpError = error as { error?: { message?: string }; message?: string };
      errorMessage = httpError.error?.message || httpError.message || errorMessage;
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  };
}
