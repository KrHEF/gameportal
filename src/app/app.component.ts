import {Component, OnInit} from '@angular/core';
import {DataService} from './data.service';
import {StorageService} from './storage.service';
import {Category} from './classes/category';
import {Game} from './classes/game';
import {Merchant} from './classes/merchant';
import {Pager} from './classes/pager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly title = 'Game Portal';
  readonly author = 'EF';
  readonly version: number[] = [1, 0, 0, 6];

  public pager: Pager;
  public settings = {
    storageService: StorageService.get(),
    gamesOnPage: {
      storable: 1,
      values: [10, 20, 30, 40, 50],
      value: 10,
    },
    gamePageNumber: {
      storable: 1,
      value: 1,
    },
    gameInFavorites: {
      storable: 1,
      value: '',
    },
  };

  public categories: Category[] = [];
  public merchants: Merchant[] = [];
  private games: Game[] = [];
  private gamesOnPage: Game[] = [];
  private gamesInFavorites: Game[] = [];

  public get GamesCount(): number {
    return this.games.length;
  }

  public get Games(): Game[] {
    if (!this.gamesOnPage.length) {
      this.setCurrentGames();
    }
    return this.gamesOnPage;
  }

  constructor(
    private dataService: DataService,
  ) {
    this.loadFromStorage();
  }

  ngOnInit(): void {
    this.dataService.loadData().subscribe((isLoad) => {
      if (isLoad) {
        this.categories = this.dataService.categories;
        this.merchants = this.dataService.merchants;
        this.games = this.dataService.games;
        this.initFavorites();

        this.pager = new Pager(this.GamesCount,
          this.settings.gamesOnPage.value,
          this.settings.gamePageNumber.value);
      }
    });
  }

  private setCurrentGames(): void {
    if (this.pager) {
      this.gamesOnPage = this.games.slice(this.pager.StartIndex, this.pager.EndIndex);
    }
  }

  // События

  public changePageNumber(): void {
    this.settings.gamePageNumber.value = this.pager.PageNumber;
    this.setCurrentGames();

    this.saveInStorage();
  }

  public changeGamesOnPageCount(value: number): void {
    this.pager.ItemOnPage = value;
    this.settings.gamesOnPage.value = this.pager.ItemOnPage;
    this.setCurrentGames();

    this.saveInStorage();
  }

  private initFavorites(): void {
    const gameIds: number[] = this.settings.gameInFavorites.value
      .split(',')
      .map((id: string) => parseInt(id, 10))
      .filter((id: number) => !isNaN(id));

    this.games.forEach((game) => game.isFavorites = (gameIds.indexOf(game.id) >= 0));
    this.changeFavorites();
  }

  public changeFavorites(): void {
    this.gamesInFavorites = this.games.filter((game) => game.isFavorites);
    this.settings.gameInFavorites.value = this.gamesInFavorites.map((item) => item.id).join();
    this.saveInStorage();
  }

  public toggleFavorites(): void {
    console.warn('Не забыть прицепить к фильтрации');
  }

  // LocalStorage

  /**
   * Сохранение всех сохраняемых настроек в localStorage
   * @private
   */
  private saveInStorage(): void {
    for (const key in this.settings) {
      if (this.settings.hasOwnProperty(key)) {

        const setting = this.settings[key];
        if (setting.hasOwnProperty('storable')
          && setting.hasOwnProperty('value')
          && setting.storable) {
          this.settings.storageService.setItem(key, setting.value.toString());
        }
      }
    }
  }

  /**
   * Получение настроек сохраняемых настроек из localStorage
   * @private
   */
  private loadFromStorage(): void {
    for (const key in this.settings) {
      if (this.settings.hasOwnProperty(key)) {

        const setting = this.settings[key];
        if (!setting.hasOwnProperty('storable')
          || !setting.hasOwnProperty('value')
          || !setting.storable) {
          continue;
        }

        const value: string = this.settings.storageService.getItem(key);
        if (!value) {
          continue;
        } else if ((typeof setting.value === 'string')) {
          setting.value = value;
        } else if ((typeof setting.value === 'number') && parseInt(value, 10)) {
          setting.value = parseInt(value, 10);
        }
      }
    }
  }


}
