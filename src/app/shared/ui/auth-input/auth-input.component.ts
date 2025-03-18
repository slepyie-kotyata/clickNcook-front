import { Component, Input } from '@angular/core';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-input',
  standalone: true,
  imports: [NgOptimizedImage, NgIf, ReactiveFormsModule],
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

  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
