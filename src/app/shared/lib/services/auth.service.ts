import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITokens } from '../../../entities/tokens';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly api = import.meta.env.NG_APP_API;
  httpClient = inject(HttpClient);
  router = inject(Router);

  register(data: FormData): Observable<{ tokens: ITokens; status: number }> {
    return this.httpClient.post<{ tokens: ITokens; status: number }>(
      this.api + 'reg',
      data,
    );
  }

  auth(data: FormData): Observable<{ tokens: ITokens; status: number }> {
    return this.httpClient.post<{ tokens: ITokens; status: number }>(
      this.api + 'auth',
      data,
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/auth']);
  }
}
