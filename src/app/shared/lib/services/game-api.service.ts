import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import ISession from '../../../entities/game';

@Injectable({
  providedIn: 'root',
})
export class GameApiService {
  private readonly api = import.meta.env.NG_APP_API;
  private httpClient = inject(HttpClient);

  getGameInit(): Observable<{ session: ISession; status: number }> {
    return this.httpClient.get<{ session: ISession; status: number }>(
      this.api + 'game/init',
    );
  }

  cook(count: number): Observable<{ dishes: number; status: number }> {
    return this.httpClient.patch<{ dishes: number; status: number }>(
      this.api + 'game/cook',
      { clickCount: count },
    );
  }

  sell(
    count: number,
  ): Observable<{ dishes: number; money: number; status: number }> {
    return this.httpClient.patch<{
      dishes: number;
      money: number;
      status: number;
    }>(this.api + 'game/sell', { clickCount: count });
  }
}
