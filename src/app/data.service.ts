import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TGameData} from './types';
import {Game} from './classes/game';
import {Category} from './classes/category';
import {Merchant} from './classes/merchant';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // Не поучилось подключиться из-за CORS, обойти не смог, пришлось саачать и положить в assets.
  // private url = 'https://www.rost.bet/api/v1/games?lang=ru';
  private url = '/assets/data.json';

  public categories: Category[] = [];
  public games: Game[] = [];
  public merchants: Merchant[] = [];

  constructor(
    private http: HttpClient
  ) {
  }

  // Не знаю как корректно загрузить файлы, итак долго ковырялся. Загрузил вот так.
  // Возможно надо было загружать по отдельности, возвращать помисы и подключать через Promise.all
  // Но пока имеем, что есть.
  public loadData(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http.get(this.url).subscribe((data: TGameData) => {

        if (data.categories) {
          this.categories = data.categories.map( (cat) => new Category(cat) );
        }

        for (const merchId in data.merchants) {
          if ( data.merchants.hasOwnProperty(merchId) ) {
            this.merchants.push( new Merchant( data.merchants[merchId]) );
          }
        }

        if (data.games) {
          this.games = data.games.map( (game) => new Game(game) );
        }

        observer.next(true);
        observer.complete();
      });
    });
  }

}
