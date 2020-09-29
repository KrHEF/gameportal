import {Component, OnInit} from '@angular/core';
import {DataService} from './data.service';
import {StorageService} from './storage.service';
import {Category} from './classes/category';
import {Game} from './classes/game';
import {Merchant} from './classes/merchant';
import {Pager} from './classes/pager';
import {TFiltered, TSorting} from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  readonly title = 'Game Portal';
  readonly author = 'EF';
  readonly version: number[] = [1, 0, 0, 8];

  public pager: Pager;
  public storageSettings = {
    storageService: StorageService.get(),
    gamesOnPage: {
      storable: 1,
      values: [10, 20, 30, 40, 50],
      value: 10,
    },
    gamePageNumber: {
      // storable: 1,
      value: 1,
    },
    gameInFavorites: {
      storable: 1,
      value: '',
    },
    filterCategories: {
      storable: 1,
      value: '',
    },
    filterMerchant: {
      storable: 1,
      value: '',
    },
    filterName: {
      storable: 1,
      value: '',
    },
  };

  public categories: Category[] = [];
  public merchants: Merchant[] = [];
  private games: Game[] = [];
  private gamesOnPage: Game[] = [];
  private gamesInFavorites: Game[] = [];
  private gamesFiltered: Game[];

  private filters: TFiltered = {
    categories: [],
    merchants: [],
    name: '',
  };
  private sorting: TSorting = {
    favorites: false,
    property: 'name',
    direction: 'asc',
  };


  /**
   * Количество загруженных игр
   * @constructor
   */
  public get GamesCount(): number {
    return this.games.length;
  }

  /**
   * Количество игр в избранном
   * @constructor
   */
  public get FavoriteGamesCount(): number {
    return this.gamesInFavorites.length;
  }

  /**
   * Количество отфильтрованных игр
   * @constructor
   */
  public get FilteredGamesCount(): number {
    return this.gamesFiltered.length;
  }

  /**
   * Возвращает true, если хотя бы один из фильтров установлен
   */
  public get isFiltered(): boolean {
    for (const key in this.filters) {
      if (this.filters.hasOwnProperty(key)) {
        if (this.filters[key].length > 0) {
          return true;
        }
      }
    }
    return false;
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
    const sortByName = (a: { Name: string }, b: { Name: string }) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1;

    this.dataService.loadData().subscribe((isLoad) => {
      if (isLoad) {
        const favoritesCategory: Category = new Category({
          ID: '0',
          Name: {en: 'Favorites', ru: 'Избранное'},
          CSort: '1000',
          Slug: 'favorites',
          menuId: 'favorites'
        });

        this.categories = this.dataService.categories.sort(sortByName);
        this.categories.unshift(favoritesCategory);
        this.merchants = this.dataService.merchants.sort(sortByName);
        this.games = this.dataService.games;
        this.gamesFiltered = this.games;

        this.pager = new Pager(this.GamesCount,
          this.storageSettings.gamesOnPage.value,
          this.storageSettings.gamePageNumber.value);

        this.sortGames();

        this.initFavorites();
        // this.initFilters();
      }
    });
  }

  // Игры, отображающиеся на странице с учетом текущей страницы
  private setCurrentGames(): void {
    if (this.pager) {
      this.gamesOnPage = this.gamesFiltered.slice(this.pager.StartIndex, this.pager.EndIndex + 1);
    }
  }

  // Отфильтрованные игры
  private filterGames(): void {
    const f = this.filters;
    let result: Game[] = this.games;

    if (this.isFiltered) {
      // Фильтр по категориям
      if (f.categories.length > 0) {
        result = result.filter((game) => {
          return f.categories.some((cat) => {
            return game.categoryIds.includes(cat.id)
              || (cat.id === 0 && game.isFavorites);
          });
        });
      }
      // Фильтр по производителям
      if (f.merchants.length > 0) {
        result = result.filter((game) => {
          return f.merchants.some((merch) => merch.id === game.merchantId);
        });
      }
      // Фильтр по названию
      if (f.name.length > 0) {
        result = result.filter((game) => {
          return game.name.ru.toLowerCase().includes(f.name.toLowerCase())
            || game.name.en.toLowerCase().includes(f.name.toLowerCase());
        });
      }

    }
    this.gamesFiltered = result;

    this.pager.update(this.gamesFiltered.length);
    this.setCurrentGames();
  }

  private sortGames(): void {
    const sortGames = (a: Game, b: Game) => {
      switch (this.sorting.property) {
        case 'name':
          const desc: number = this.sorting.direction === 'desc' ? -1 : 1;
          return a.Name > b.Name ? desc : -desc;
      }
    };

    const upFavorites = (a: Game, b: Game) => {
      if (a.isFavorites === b.isFavorites) { return 0; }
      return a.isFavorites ? -1 : 1;
    };

    this.games.sort(sortGames);
    if (this.sorting.favorites) {
      this.games.sort(upFavorites);
    }
    this.filterGames();
  }

  // События пейджера

  public changePageNumber(): void {
    this.storageSettings.gamePageNumber.value = this.pager.PageNumber;
    this.setCurrentGames();

    this.saveInStorage();
  }

  public changeGamesOnPageCount(value: number): void {
    this.pager.ItemOnPage = value;
    this.storageSettings.gamesOnPage.value = this.pager.ItemOnPage;
    this.setCurrentGames();

    this.saveInStorage();
  }

  // События избранных

  private initFavorites(): void {
    const gameIds: number[] = this.storageSettings.gameInFavorites.value
      .split(',')
      .map((id: string) => parseInt(id, 10))
      .filter((id: number) => !isNaN(id));

    this.games.forEach((game) => game.isFavorites = (gameIds.indexOf(game.id) >= 0));
    this.changeFavorites();
  }

  public changeFavorites(): void {
    this.gamesInFavorites = this.games.filter((game) => game.isFavorites);
    this.storageSettings.gameInFavorites.value = this.gamesInFavorites.map((item) => item.id).join();
    this.saveInStorage();
  }

  public toggleFavorites(show: boolean): void {
    this.sorting.favorites = show;
    this.sortGames();
  }

  // События фильтров

  public initFilters(): void {
    const setting = this.storageSettings;

    // Категории
    const catIds: number[] = this.getNumbersFromString(setting.filterCategories.value);
    this.filters.categories = this.categories.filter((cat) => catIds.includes(cat.id));

    // Мерчанты
    const merchIds: number[] = this.getNumbersFromString(setting.filterMerchant.value);
    this.filters.merchants = this.merchants.filter((merch) => merchIds.includes(merch.id));

    // Названия
    this.filters.name = setting.filterName.value;

    this.filterGames();
  }

  public changeFilterCategories(selectedItems: Category[]): void {
    this.filters.categories = selectedItems;
    this.filterGames();

    this.storageSettings.filterCategories.value = selectedItems.map((item) => item.id).join();
    this.saveInStorage();
  }

  public changeFilterMerchant(selectedItems: Merchant[]): void {
    this.filters.merchants = selectedItems;
    this.filterGames();

    this.storageSettings.filterMerchant.value = selectedItems.map((item) => item.id).join();
    this.saveInStorage();
  }

  public changeFilterName(text: string): void {
    this.filters.name = text.trim();
    this.filterGames();

    this.storageSettings.filterName.value = text;
    this.saveInStorage();
  }

  // LocalStorage

  /**
   * Сохранение всех сохраняемых настроек в localStorage
   * @private
   */
  private saveInStorage(): void {
    for (const key in this.storageSettings) {
      if (this.storageSettings.hasOwnProperty(key)) {

        const setting = this.storageSettings[key];
        if (setting.hasOwnProperty('storable')
          && setting.hasOwnProperty('value')
          && setting.storable) {
          this.storageSettings.storageService.setItem(key, setting.value.toString());
        }
      }
    }
  }

  /**
   * Получение настроек сохраняемых настроек из localStorage
   * @private
   */
  private loadFromStorage(): void {
    for (const key in this.storageSettings) {
      if (this.storageSettings.hasOwnProperty(key)) {

        const setting = this.storageSettings[key];
        if (!setting.hasOwnProperty('storable')
          || !setting.hasOwnProperty('value')
          || !setting.storable) {
          continue;
        }

        const value: string = this.storageSettings.storageService.getItem(key);
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

  private getNumbersFromString(str: string): number[] {
    return str.split(',')
      .map((id: string) => parseInt(id, 10))
      .filter((id: number) => !isNaN(id));
  }

}
