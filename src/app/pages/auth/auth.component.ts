import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AuthInputComponent } from '../../shared/ui/auth-input/auth-input.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    NgOptimizedImage,
    AuthInputComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  authForm: FormGroup;
  toastrService = inject(ToastrService);
  protected readonly FormControl = FormControl;

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get emailControl(): FormControl {
    return this.authForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.authForm.get('password') as FormControl;
  }

  submitForm() {
    if (this.authForm.valid) {
      console.log('✅ Форма валидна:', this.authForm.value);
      return;
    }

    const errors = [];

    if (this.emailControl.hasError('required')) {
      errors.push('Поле "Почта" обязательно для заполнения.');
    }
    if (this.emailControl.hasError('email')) {
      errors.push('Введите корректный email.');
    }

    if (this.passwordControl.hasError('required')) {
      errors.push('Поле "Пароль" обязательно для заполнения.');
    }

    errors.forEach((error) => {
      this.toastrService.error(error);
    });
  }
}
