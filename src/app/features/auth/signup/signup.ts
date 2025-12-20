import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SignupRequest } from '../../../shared/models/auth.model';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  protected readonly signupForm: FormGroup;
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        userName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)]],
        gender: ['', [Validators.required]],
        dob: ['', [Validators.required]],
        role: ['user', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  protected onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const signupData: SignupRequest = {
        firstName: this.signupForm.value.firstName,
        lastName: this.signupForm.value.lastName,
        userName: this.signupForm.value.userName,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        confirmPassword: this.signupForm.value.confirmPassword,
        phone: this.signupForm.value.phone,
        gender: this.signupForm.value.gender,
        dob: new Date(this.signupForm.value.dob),
        role: this.signupForm.value.role,
      };

      this.auth.signup(signupData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (error: Error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.message || 'Signup failed. Please try again.');
        },
      });
    } else {
      this.markFormGroupTouched(this.signupForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  protected getFieldError(fieldName: string): string {
    const control = this.signupForm.get(fieldName);
    if (control?.hasError('required') && control.touched) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (control?.hasError('minlength') && control.touched) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    if (control?.hasError('email') && control.touched) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('pattern') && control.touched) {
      if (fieldName === 'userName') {
        return 'Username can only contain letters, numbers, and underscores';
      }
      if (fieldName === 'phone') {
        return 'Please enter a valid phone number';
      }
    }
    if (this.signupForm.hasError('passwordMismatch') && fieldName === 'confirmPassword' && control?.touched) {
      return 'Passwords do not match';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      userName: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phone: 'Phone',
      gender: 'Gender',
      dob: 'Date of Birth',
      role: 'Role',
    };
    return labels[fieldName] || fieldName;
  }
}
