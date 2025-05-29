import { DestroyRef, inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Subject, takeUntil, tap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameErrorService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly destroy$ = new Subject<void>();
  private readonly error$ = new Subject<void>();
  private readonly limit = 5;
  private errorCount: number = 0;

  constructor(private auth: AuthService) {
    this.destroyRef.onDestroy(() => this.destroy$.next());

    this.error$
      .pipe(
        tap(() => {
          this.errorCount++;
        }),
        tap(() => {
          if (this.errorCount >= this.limit) {
            this.auth.logout('Непредвиденная ошибка');
          }
        }),
        tap(() => {
          timer(5000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.errorCount--;
            });
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  public handle(error: any) {
    if (this.isHttpError(error)) {
      let logout = false;
      let message = '';
      switch (error.status) {
        case 403:
        case 409:
        case 400:
        case 404:
          break;
        default:
          message = 'Ошибка подключения к серверу';
          logout = true;
      }
      if (logout) {
        console.error(`[ERROR ${error.status}]: ${error.error.message}`);
        this.auth.logout(message);
        return;
      }
    } else if (this.isWebSocketError(error)) {
      switch (error.code) {
        case 1006:
          console.warn(
            '[WebSocket] Соединение закрыто: вход с другого устройства',
          );
          this.auth.logout('Вход на другом устройстве');
          return;
        default:
          console.error(
            `[WebSocket ERROR ${error.code}]:`,
            error.reason ?? 'Неизвестная причина',
          );
          this.auth.logout('Ошибка подключения к серверу');
          return;
      }
    } else {
      console.error('[ERROR UNKNOWN]: \n ', error);
      this.auth.logout('Непредвиденная ошибка');
      return;
    }

    this.error$.next();
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

  private isWebSocketError(error: unknown): error is CloseEvent {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'number' &&
      'reason' in error
    );
  }
}
