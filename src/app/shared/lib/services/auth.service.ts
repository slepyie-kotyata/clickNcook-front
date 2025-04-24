import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITokens } from '../../../entities/api';
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

  refreshToken(): Observable<{ status: string; tokens: ITokens }> {
    return this.httpClient.post<{ status: string; tokens: ITokens }>(
      this.api + 'refresh',
      {},
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('refreshToken'),
        },
      },
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.router.navigate(['/auth']);
  }
}
