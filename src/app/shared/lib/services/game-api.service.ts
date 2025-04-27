import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import ISession, { IUpgrade } from '../../../entities/game';

@Injectable({
  providedIn: 'root',
})
export class GameApiService {
  private readonly api = import.meta.env.NG_APP_API;
  private httpClient = inject(HttpClient);

  getGameInit(): Observable<{
    session: ISession;
    status: number;
    upgrades: { upgrade: IUpgrade; times_bought: number }[];
  }> {
    return this.httpClient.get<{
      session: ISession;
      status: number;
      upgrades: { upgrade: IUpgrade; times_bought: number }[];
    }>(this.api + 'game/init');
  }

  cook(count: number): Observable<{ dishes: number; status: number }> {
    let body: FormData = new FormData();
    body.set('click_count', count.toString());
    return this.httpClient.patch<{ dishes: number; status: number }>(
      this.api + 'game/cook',
      body,
    );
  }

  sell(
    count: number,
  ): Observable<{ dishes: number; money: number; status: number }> {
    let body: FormData = new FormData();
    body.set('click_count', count.toString());
    return this.httpClient.patch<{
      dishes: number;
      money: number;
      status: number;
    }>(this.api + 'game/sell', body);
  }

  buy(id: number): Observable<{ message: string; status: number }> {
    return this.httpClient.patch<{ message: string; status: number }>(
      this.api + 'game/buy/' + id,
      {},
    );
  }

  getUpgrades(): Observable<{
    status: number;
    upgrades: { upgrade: IUpgrade; times_bought: number }[];
  }> {
    return this.httpClient.get<{
      status: number;
      upgrades: { upgrade: IUpgrade; times_bought: number }[];
    }>(this.api + 'game/upgrades');
  }
}
