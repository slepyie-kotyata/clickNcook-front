import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ITokens } from '../../../entities/api';

@Injectable({
  providedIn: 'root',
})
export class GameApiService {
  private readonly api = import.meta.env.NG_APP_API;
  private httpClient = inject(HttpClient);

  private tokenSubject = new BehaviorSubject<{
    status: number;
    tokens: ITokens;
  } | null>(null);

  getGameInit(): Observable<{
    session: {
      id: number;
      money: number;
      dishes: number;
      upgrades: [];
      user_id: number;
    };
    status: number;
  }> {
    return this.tokenSubject.pipe(
      take(1),
      switchMap((token) => {
        return this.httpClient.get<{
          session: {
            id: number;
            money: number;
            dishes: number;
            upgrades: [];
            user_id: number;
          };
          status: number;
        }>(this.api + 'game/init', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          },
        });
      }),
    );
  }

  cook(count: number): Observable<{ dishes: number; status: number }> {
    return this.tokenSubject.pipe(
      take(1),
      switchMap((token) => {
        return this.httpClient.patch<{
          dishes: number;
          status: number;
        }>(
          this.api + 'game/cook',
          {},
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
          },
        );
      }),
    );
  }

  sell(
    count: number,
  ): Observable<{ dishes: number; money: number; status: number }> {
    return this.tokenSubject.pipe(
      take(1),
      switchMap((token) => {
        return this.httpClient.patch<{
          dishes: number;
          money: number;
          status: number;
        }>(
          this.api + 'game/sell',
          {},
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
          },
        );
      }),
    );
  }
}
