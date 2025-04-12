import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ITokens } from '../../../entities/tokens';

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
    session: { ID: number; Money: number; Dishes: []; UserID: number };
    status: number;
  }> {
    return this.tokenSubject.pipe(
      take(1),
      switchMap((token) => {
        return this.httpClient.get<{
          session: { ID: number; Money: number; Dishes: []; UserID: number };
          status: number;
        }>(this.api + 'game/init', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          },
        });
      }),
    );
  }
}
