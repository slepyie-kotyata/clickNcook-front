import {DestroyRef, inject, Injectable} from '@angular/core';
import {AuthService} from '../auth.service';
import {Subject, takeUntil, tap, timer} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Сервис для обработки ошибок HTTP и WebSocket с ограничением количества ошибок
 * и автоматическим выходом при превышении лимита
 */
export class ErrorService {
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
            this.auth.logout('Ошибка подключения к серверу');
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

  /**
   * Обрабатывает ошибку HTTP или WebSocket
   * @param error - объект ошибки для обработки
   * @return void
   * @remarks
   * Если ошибка является HTTP ошибкой, проверяет статус и при необходимости выполняет выход из системы.
   * Если ошибка является WebSocket ошибкой, проверяет код и при необходимости выполняет выход из системы.
   * Если ошибка является строковой ошибкой, добавляет ее в очередь ошибок.
   * Если ошибка неизвестного типа, выполняет выход из системы с сообщением о непредвиденной ошибке.
   * */
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
        case 1000:
          console.warn(`[WS ${error.code}]: closed by client`);
          break;
        case 1001:
        case 1006:
          console.warn(`[WS ${error.code}]: closed by server`);
          break;
        default:
          console.error(
            `[WS ERROR ${error.code}]:`,
            error.reason ?? 'Неизвестная причина',
          );
          this.error$.next();
          return;
      }
    } else if (this.isWebSocketEvent(error)) {
      console.warn("[WS BROWSER EVENT ERROR]");
      this.error$.next();
      return;
    } else if (this.isStringError(error)) {
      console.warn('[SERVER ERROR]', error);
      this.error$.next();
      return;
    } else {
      console.error('[UNKNOWN ERROR]: \n ', error);
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

  private isWebSocketEvent(error: unknown): error is Event {
    return error instanceof Event && error.type === "error";
  }

  private isStringError(error: unknown): error is string {
    return typeof error === 'string';
  }

}
