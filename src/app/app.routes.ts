import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { LoginLayoutComponent } from './shared/ui/login-layout/login-layout.component';
import { RegComponent } from './pages/reg/reg.component';
import { authGuard } from './shared/lib/guards/auth.guard';
import { GameplayLayoutComponent } from './shared/ui/gameplay-layout/gameplay-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: GameplayLayoutComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    component: LoginLayoutComponent,
    canDeactivate: [authGuard],
    children: [
      { path: 'auth', component: AuthComponent },
      { path: 'reg', component: RegComponent },
    ],
  },
];
