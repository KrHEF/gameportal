import {Component, OnInit} from '@angular/core';
import {DataService} from './data.service';
import {StorageService} from './storage.service';
import {Category} from './classes/category';
import {Game} from './classes/game';
import {Merchant} from './classes/merchant';
import {Pager} from './classes/pager';
import set = Reflect.set;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly title = 'EF Game Portal';
  readonly author = 'EF';
  readonly version: number[] = [1, 0, 0, 5];

  public pager: Pager;
  public settings = {
    storageService: StorageService.get(),
    gamesOnPage: {
      keyStorage: 'GamesOnPage',
      values: [10, 20, 30, 40, 50],
      value: 10,
    },
    gamePageNumber: {
      keyStorage: 'GamePageNumber',
      value: 1,
    }
  };

  public categories: Category[] = [];
  public merchants: Merchant[] = [];
  private games: Game[] = [];
  private gamesOnPage: Game[] = [];
  private gamesInFavorite: Game[] = [];

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

  private saveInStorage(): void {
    for (const key in this.settings) {
      if (this.settings.hasOwnProperty(key)) {

        const setting = this.settings[key];
        if (!setting.hasOwnProperty('keyStorage') || !setting.hasOwnProperty('value')) {
          continue;
        }

        this.settings.storageService.setItem(setting.keyStorage, setting.value.toString());
      }
    }
  }

  private loadFromStorage(): void {
    for (const key in this.settings) {
      if (this.settings.hasOwnProperty(key)) {

        const setting = this.settings[key];
        if (!setting.hasOwnProperty('keyStorage') || !setting.hasOwnProperty('value')) {
          continue;
        }

        const value: string = this.settings.storageService.getItem(setting.keyStorage);
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
