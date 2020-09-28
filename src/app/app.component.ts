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
  readonly title = 'EF Game Portal';
  readonly author = 'EF';
  readonly version: number[] = [1, 0, 0, 4];

  public pager: Pager;
  public settings = {
    storageService: StorageService.get(),
    gamesOnPage: {
      keyStorage: 'GamesOnPageCount',
      values: [10, 20, 30, 40, 50],
      value: 10,
    },
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
    const gamesOnPageValue: number = parseInt(this.loadFromStorage(this.settings.gamesOnPage.keyStorage), 10);
    if (gamesOnPageValue) {
      this.settings.gamesOnPage.value = gamesOnPageValue;
    }

  }

  ngOnInit(): void {
    this.dataService.loadData().subscribe((isLoad) => {
      if (isLoad) {
        this.categories = this.dataService.categories;
        this.merchants = this.dataService.merchants;
        this.games = this.dataService.games;

        this.pager = new Pager(this.GamesCount, this.settings.gamesOnPage.value);
      }
    });
  }

  private setCurrentGames(): void {
    if (this.pager) {
      this.gamesOnPage = this.games.slice(this.pager.StartIndex, this.pager.EndIndex);
    }
  }

  public changePageNumber(): void {
    this.setCurrentGames();
  }

  public changeGamesOnPageCount(value: number): void {
    this.pager.ItemOnPage = value;
    this.settings.gamesOnPage.value = this.pager.ItemOnPage;
    this.setCurrentGames();

    this.saveInStorage(this.settings.gamesOnPage.keyStorage, this.pager.ItemOnPage);
  }

  private saveInStorage(key: string, value: any): void {
    this.settings.storageService.setItem(key, value.toString());
  }

  private loadFromStorage(key: string): string {
    return this.settings.storageService.getItem(key);
  }

}
