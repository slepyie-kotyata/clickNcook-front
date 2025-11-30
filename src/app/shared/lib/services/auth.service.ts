import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ITokens} from '../../../entities/api';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
/** Сервис для аутентификации пользователя
 @module AuthService
 @description Этот сервис предоставляет методы для регистрации, аутентификации, обновления токенов и выхода пользователя из системы.
 @example
 const authService = new AuthService();
 authService.auth(formData).subscribe(response => {
 console.log(response.tokens);
 });
 */
export class AuthService {
  private readonly api = import.meta.env.NG_APP_API;
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  /**
   Регистрация нового пользователя
   @param data - данные формы регистрации
   @returns Observable с токенами и статусом
   */
  register(data: FormData): Observable<{ tokens: ITokens; status: number }> {
    return this.httpClient.post<{ tokens: ITokens; status: number }>(
      this.api + 'reg',
      data,
    );
  }

  /**
   Аутентификация пользователя
   @param data - данные формы аутентификации
   @returns Observable с токенами и статусом
   */
  auth(data: FormData): Observable<{ tokens: ITokens; status: number }> {
    return this.httpClient.post<{ tokens: ITokens; status: number }>(
      this.api + 'auth',
      data,
    );
  }

  /**
   Обновление токенов доступа
   @returns Observable с новым статусом и токенами
   */
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

  /**
   Выход пользователя из системы
   @param reason - причина выхода (необязательно)
   */
  logout(reason?: string) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/auth']).then(
      () => {
        if (reason) this.toastr.error(reason);
      }
    );
  }
}
