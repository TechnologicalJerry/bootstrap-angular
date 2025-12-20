import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../../shared/models/auth.model';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  protected readonly loginForm: FormGroup;
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      emailOrUsername: ['john.doe@example.com', [Validators.required, Validators.minLength(3)]],
      password: ['password123', [Validators.required, Validators.minLength(6)]],
    });
  }

  protected onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const loginData: LoginRequest = {
        emailOrUsername: this.loginForm.value.emailOrUsername,
        password: this.loginForm.value.password,
      };

      this.auth.login(loginData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (error: Error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.message || 'Login failed. Please check your credentials.');
        },
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  protected getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.hasError('required') && control.touched) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (control?.hasError('minlength') && control.touched) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      emailOrUsername: 'Email or Username',
      password: 'Password',
    };
    return labels[fieldName] || fieldName;
  }
}
