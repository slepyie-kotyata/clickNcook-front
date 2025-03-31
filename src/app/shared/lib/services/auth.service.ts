import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITokens } from '../../../entities/tokens';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly api = import.meta.env.NG_APP_API;
  httpClient = inject(HttpClient);

  register(data: FormData): Observable<{ tokens: ITokens; status: number }> {
    console.log(this.api + 'reg');
    return this.httpClient.post<{ tokens: ITokens; status: number }>(
      this.api + 'reg',
      data,
    );
  }

  auth(data: FormData): Observable<{
    status: string;
    tokens: { access_token: string; refresh_token: string };
  }> {
    return this.httpClient.post<{
      status: string;
      tokens: { access_token: string; refresh_token: string };
    }>(this.api + 'auth', data);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('pinnedIDs');
    this.router.navigate(['/auth']);
  }
}
