import {inject, Injectable} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import {Observable, take, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {AuthService} from './services/auth.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private authService: AuthService = inject(AuthService);
  private isRefreshing = false;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    req = req.clone();

    const url = new URL(req.url);
    if (['/auth', '/reg', '/refresh'].some((i) => i == url.pathname)) {
      return next.handle(req);
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'X-timestamp': Date.now().toString(),
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }

        if (
          error instanceof HttpErrorResponse &&
          error.status >= 400 &&
          error.status < 500
        ) {
          console.error('Client error occurred');
          return throwError(() => error);
        }

        if (error instanceof HttpErrorResponse && error.status >= 500) {
          console.error('Server error occurred');
          return throwError(() => error);
        }

        return throwError(() => error);
      }),
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.authService.refreshToken().pipe(
        switchMap((response) => {
          this.isRefreshing = false;

          localStorage.setItem('accessToken', response.tokens.access_token);
          localStorage.setItem('refreshToken', response.tokens.refresh_token);

          const newRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${response.tokens.access_token}`,
              'X-timestamp': Date.now().toString(),
            },
          });

          return next.handle(newRequest);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout('Время сессии истекло');

          return throwError(() => error);
        }),
      );
    } else {
      return this.authService.refreshToken().pipe(
        take(1),
        switchMap((response) => {
          localStorage.setItem('accessToken', response.tokens.access_token);
          localStorage.setItem('refreshToken', response.tokens.refresh_token);

          const newRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${response.tokens.access_token}`,
              'X-timestamp': Date.now().toString(),
            },
          });
          return next.handle(newRequest);
        }),
      );
    }
  }
}

export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true},
];
