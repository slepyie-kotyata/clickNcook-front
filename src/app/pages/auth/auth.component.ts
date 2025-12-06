import {Component, inject} from '@angular/core';
import {AuthInputComponent} from '../../shared/ui/auth-input/auth-input.component';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../shared/lib/services/auth.service';
import {Router} from '@angular/router';
import {email} from '../../shared/lib/formValidators';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    AuthInputComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  protected authForm: FormGroup;
  private toastrService = inject(ToastrService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, email]],
      password: ['', [Validators.required]],
    });

    this.listenForInputResetWrongCredentials();
  }

  get emailControl(): FormControl {
    return this.authForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.authForm.get('password') as FormControl;
  }

  submitForm() {
    if (this.authForm.valid) {
      const formData = new FormData();
      formData.append('email', this.authForm.value.email);
      formData.append('password', this.authForm.value.password);

      this.authService.auth(formData).subscribe({
        next: (user) => {
          this.authForm.reset();
          localStorage.setItem('accessToken', user.tokens.access_token);
          localStorage.setItem('refreshToken', user.tokens.refresh_token);
          this.toastrService.success('Авторизация успешна');
          this.router.navigate(['/']);
        },
        error: (error) => {
          if (error.status === 401) {
            this.authForm.get('email')?.setErrors({wrongEmailOrPassword: true});
            this.authForm.get('password')?.setErrors({wrongEmailOrPassword: true});
          } else {
            this.toastrService.error(error.message, 'Ошибка авторизации');
          }
        },
      });
    }
  }

  private listenForInputResetWrongCredentials() {
    this.authForm.valueChanges.subscribe(() => {
      if (this.emailControl.hasError('wrongEmailOrPassword') || this.passwordControl.hasError('wrongEmailOrPassword')) {
        this.emailControl.setErrors(null);
        this.passwordControl.setErrors(null);
      }
    });
  }
}
