import { Component, Input } from '@angular/core';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-auth-input',
  standalone: true,
  imports: [NgOptimizedImage, NgIf, ReactiveFormsModule, NgClass],
  templateUrl: './auth-input.component.html',
  styleUrl: './auth-input.component.css',
})
export class AuthInputComponent {
  @Input({ required: true }) type: string = '';
  @Input({ required: true }) id: string = '';
  @Input({ required: true }) name: string = '';
  @Input({ required: true }) placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() control!: FormControl;
  @Input() parentGroup!: FormGroup;

  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getErrorMessage(): string | null {
    if (this.control.hasError('required')) return 'Поле обязательно';
    if (this.control.hasError('invalidEmail')) return this.control.getError('invalidEmail');
    if (this.control.hasError('invalidPassword')) return this.control.getError('invalidPassword');
    if (this.control.hasError('alreadyExistsEmail')) return 'Пользователь уже зарегистрирован';
    if (this.control.hasError('wrongEmailOrPassword') && this.name === 'password') return 'Неправильная почта или пароль';
    if (this.parentGroup?.hasError('passwordsMismatch') && this.name === 'repeat_password') {
      return this.parentGroup.getError('passwordsMismatch');
    }
    return null;
  }

}
