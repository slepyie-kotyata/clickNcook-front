import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AuthInputComponent } from '../../shared/ui/auth-input/auth-input.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgOptimizedImage, AuthInputComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {}
