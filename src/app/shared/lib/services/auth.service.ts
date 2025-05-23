import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITokens } from '../../../entities/api';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = import.meta.env.NG_APP_API;
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(ToastrService);

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

  logout(reason?: string) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/auth']);
    if (reason) this.toastr.error(reason);
  }
}
