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
    upgrades: IUpgrade[];
  }> {
    return this.httpClient.get<{
      session: ISession;
      status: number;
      upgrades: IUpgrade[];
    }>(this.api + 'game/init');
  }

  getUpgrades(): Observable<{
    status: number;
    upgrades: IUpgrade[];
  }> {
    return this.httpClient.get<{
      status: number;
      upgrades: IUpgrade[];
    }>(this.api + 'game/upgrades');
  }

  getLevelInfo(): Observable<{
    current_rank: number;
    current_xp: number;
    needed_xp: number;
    status: number;
  }> {
    return this.httpClient.get<{
      current_rank: number;
      current_xp: number;
      needed_xp: number;
      status: number;
    }>(this.api + 'game/levels');
  }

  cook(): Observable<{ dishes: number; status: number; xp: number }> {
    return this.httpClient.patch<{
      dishes: number;
      status: number;
      xp: number;
    }>(this.api + 'game/cook', {});
  }

  sell(): Observable<{
    dishes: number;
    money: number;
    status: number;
    xp: number;
  }> {
    return this.httpClient.patch<{
      dishes: number;
      money: number;
      status: number;
      xp: number;
    }>(this.api + 'game/sell', {});
  }

  buy(id: number): Observable<{ status: number; money: number }> {
    return this.httpClient.patch<{
      status: number;
      money: number;
    }>(this.api + 'game/buy/' + id, {});
  }

  prestige(): Observable<{ message: string; status: number }> {
    return this.httpClient.patch<{ message: string; status: number }>(
      this.api + 'game/reset',
      {},
    );
  }

  levelUp(): Observable<{
    current_rank: number;
    current_xp: number;
    next_xp: number;
  }> {
    return this.httpClient.patch<{
      current_rank: number;
      current_xp: number;
      next_xp: number;
    }>(this.api + 'game/levels', {});
  }
}
