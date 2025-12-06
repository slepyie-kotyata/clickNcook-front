import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {PwaService} from '../../lib/services/pwa.service';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.css',
})
export class LoginLayoutComponent {
  constructor(protected pwa: PwaService) {
  }
}
