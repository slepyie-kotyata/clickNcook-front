import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthInputComponent } from '../../shared/ui/auth-input/auth-input.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/lib/services/auth.service';
import { Router } from '@angular/router';
import {
  email,
  password,
  passwordsMatch,
} from '../../shared/lib/formValidators';

@Component({
  selector: 'app-reg',
  standalone: true,
  imports: [AuthInputComponent, ReactiveFormsModule],
  templateUrl: './reg.component.html',
  styleUrl: './reg.component.css',
})
export class RegComponent {
  protected regForm: FormGroup;
  private toastrService = inject(ToastrService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.regForm = this.fb.group(
      {
        email: ['', [Validators.required, email]],
        password: ['', [Validators.required, password]],
        repeat_password: [''],
      },
      { validator: passwordsMatch },
    );
  }

  get emailControl(): FormControl {
    return this.regForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.regForm.get('password') as FormControl;
  }

  get repeatPasswordControl(): FormControl {
    return this.regForm.get('repeat_password') as FormControl;
  }

  submitForm() {
    if (this.regForm.valid) {
      const formData = new FormData();
      formData.append('email', this.regForm.value.email);
      formData.append('password', this.regForm.value.password);
      this.authService.register(formData).subscribe({
        next: (response) => {
          this.toastrService.success('Регистрация успешна');
          this.regForm.reset();
          this.router.navigate(['']);
        },
        error: (error) => {
          if (error.status === 409) {
            this.toastrService.error(
              'Пользователь с такой почтой уже зарегистрирован',
              'Ошибка регистрации',
            );
          } else {
            this.toastrService.error(error.message, 'Ошибка регистрации');
            console.error(error);
          }
        },
      });
      return;
    }

    const errors = [];

    if (this.emailControl.hasError('required')) {
      errors.push('Поле "Почта" обязательно для заполнения.');
    }
    if (this.emailControl.hasError('invalidEmail')) {
      const errorText = this.emailControl.getError('invalidEmail');
      errors.push(errorText);
    }

    if (this.passwordControl.hasError('required')) {
      errors.push('Поле "Пароль" обязательно для заполнения.');
    }
    if (this.passwordControl.hasError('invalidPassword')) {
      const errorText = this.passwordControl.getError('invalidPassword');
      errors.push(errorText);
    }

    if (
      this.repeatPasswordControl.hasError('required') &&
      !this.regForm.hasError('passwordsMismatch')
    ) {
      errors.push('Поле "Повторите пароль" обязательно для заполнения.');
    }
    if (this.regForm.hasError('passwordsMismatch')) {
      const errorText = this.regForm.getError('passwordsMismatch');
      errors.push(errorText);
    }

    errors.forEach((error) => {
      this.toastrService.error(error);
    });
  }
}
