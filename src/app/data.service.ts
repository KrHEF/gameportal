import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TGame, TGameCategory, TGameData, TLanguage, TMerchant, IMerchant} from './types';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private url = 'https://www.rost.bet/api/v1/games?lang=ru';
  private categories: TGameCategory[];
  private games: TGame[];
  private merchants: TMerchant[] = [];

  constructor(
    private http: HttpClient
  ) {
    this.loadData('/assets/data.json');
  }

  private loadData(url: string): void {
    this.http.get(url).subscribe((data: TGameData) => {
      if (data.categories) {
        this.categories = data.categories;
        // this.loadCategories(data.categories);
      }
      if (data.games) {
        this.games = data.games;
        // this.loadGames(data.games);
      }
      for (const merchId in data.merchants) {
        if (data.merchants[merchId]) {
          this.merchants.push(data.merchants[merchId]);
        }
      }
    });
  }

  // private loadCategories(categories: TGameCategory[]): void {
  //   this.categories = categories.map((cat: TGameCategory) => {
  //     return {
  //       ID: cat.ID,
  //       Name: {
  //         en: cat.Name.en,
  //         ru: cat.Name.ru,
  //       },
  //       CSort: cat.CSort,
  //       Slug: cat.Slug,
  //     };
  //   });
  // }
  //
  // private loadGames(games: TGame[]): void {
  //   this.games = games.map((game: TGame) => {
  //     return {
  //       ID: game.ID,
  //       Image: game.Image,
  //       ImageFullPath: game.ImageFullPath,
  //       Name: game.Name,
  //       Description: game.Description,
  //       CategoryID: game.CategoryID,
  //       MerchantId: game.MerchantId,
  //       Sort: game.Sort,
  //     };
  //     console.log(this.games);
  //   });
  // }
  //
  // private loadMerchant(merchants: TMerchant[]): void {
  //   this.merchants = merchants.map( (merch: TMerchant) => {
  //     return {
  //
  //     }
  //   });
  // }

}
