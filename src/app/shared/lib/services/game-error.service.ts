import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GameErrorService {
  constructor(private auth: AuthService) {}

  public handle(error: any) {
    if (this.isHttpError(error)) {
      let logout = false;
      let message = '';
      switch (error.status) {
        case 403:
        case 409:
        case 400:
          break;
        case 404:
          message = 'Ошибка синхронизации данных';
          logout = true;
          break;
        default:
          message = 'Ошибка подключения к серверу';
          logout = true;
      }
      if (logout) {
        console.error(`[ERROR ${error.status}]: ${error.error.message}`);
        this.auth.logout(message);
      }
    } else {
      this.auth.logout('Непредвиденная ошибка');
    }
  }

  private isHttpError(
    error: unknown,
  ): error is { status: number; error: { message: string } } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof (error as any).status === 'number'
    );
  }
}
