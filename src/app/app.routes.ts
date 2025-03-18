import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { LoginLayoutComponent } from './shared/ui/login-layout/login-layout.component';
import { RegComponent } from './pages/reg/reg.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'auth',
        component: AuthComponent,
      },
      {
        path: 'reg',
        component: RegComponent,
      },
    ],
  },
];
