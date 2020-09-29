import {Component, OnInit} from '@angular/core';
import {DataService} from './data.service';
import {StorageService} from './storage.service';
import {Category} from './classes/category';
import {Game} from './classes/game';
import {Merchant} from './classes/merchant';
import {Pager} from './classes/pager';
import {IFiltered, TFiltered, TSorting, TStorageSetting} from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Game Portal';
  readonly author = 'EF';
  readonly version: number[] = [1, 0, 1, 1];

  public pager: Pager;
  public storageSettings: TStorageSetting = {
    gamesOnPage: {
      storable: true,
      values: [10, 20, 30, 40, 50],
      value: 10,
    },
    gamePageNumber: {
      storable: false,
      value: 1,
    },
    gamesInFavorites: {
      storable: true,
      value: '',
    },
    filterCategories: {
      storable: true,
      value: '',
    },
    filterMerchant: {
      storable: true,
      value: '',
    },
    filterName: {
      storable: true,
      value: '',
    },
    orderBy: {
      storable: true,
      value: 0,
    }
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
    list: [
      { Id: 0, Name: 'По названию (а-я)'},
      { Id: 1, Name: 'По названию (я-а)' },
      { Id: 2, Name: 'По кол-ву символов в названии (1-9)' },
      { Id: 3, Name: 'По кол-ву символов в названии (9-1)' },
      { Id: 4, Name: 'По идентификатору (1-9)' },
      { Id: 5, Name: 'По идентификатору (9-1)' },
    ],
    value: 0,
  };



  /**
   * Количество загруженных игр
   */
  public get GamesCount(): number {
    return this.games.length;
  }

  /**
   * Количество игр в избранном
   */
  public get FavoriteGamesCount(): number {
    return this.gamesInFavorites.length;
  }

  /**
   * Количество отфильтрованных игр
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

  public get SortingList(): IFiltered[] {
    return this.sorting.list;
  }

  constructor(
    private dataService: DataService,
  ) {
    StorageService.load(this.storageSettings);
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

        const notUseMerch: Merchant = new Merchant({
          ID: '-1',
          Name: '- Не выбрано -',
          IDParent: '0',
          Alias: 'NotUse',
          Image: '',
          menuID: 'notuse',
        });

        this.categories = this.dataService.categories.sort(sortByName);
        this.categories.unshift(favoritesCategory);
        this.merchants = this.dataService.merchants.sort(sortByName);
        this.merchants.unshift(notUseMerch);
        this.games = this.dataService.games;
        this.gamesFiltered = this.games;

        this.pager = new Pager(this.GamesCount,
          this.storageSettings.gamesOnPage.value,
          +this.storageSettings.gamePageNumber.value);

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
            return game.CategoriesIds.includes(cat.Id)
              || (cat.Id === 0 && game.isFavorites);
          });
        });
      }
      // Фильтр по производителям
      if (f.merchants.length > 0) {
        result = result.filter((game) => {
          return f.merchants.some((merch) => merch.Id === game.Merchant.Id);
        });
      }
      // Фильтр по названию
      if (f.name.length > 0) {
        result = result.filter((game) => {
          return game.includesName(f.name);
        });
      }

    }
    this.gamesFiltered = result;

    this.pager.update(this.gamesFiltered.length);
    this.setCurrentGames();
  }

  private sortGames(): void {
    const sortGames = (a: Game, b: Game) => {
      let desc: -1 | 1 = 1;

      switch (this.sorting.value) {
        // По названию
        case 1:
          desc = -1;
        // tslint:disable-next-line:no-switch-case-fall-through
        case 0:
          return a.Name > b.Name ? desc : -desc;

        // По длине названия )
        case 2:
          desc = -1;
        // tslint:disable-next-line:no-switch-case-fall-through
        case 3:
          return a.Name.length < b.Name.length ? desc : -desc;

        case 4:
          desc = -1;
        // tslint:disable-next-line:no-switch-case-fall-through
        case 5:
          return a.Id < b.Id ? desc : -desc;
      }

      return 0;
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

    StorageService.save(this.storageSettings);
  }

  public changeGamesOnPageCount(value: number): void {
    this.pager.ItemOnPage = value;
    this.storageSettings.gamesOnPage.value = this.pager.ItemOnPage;
    this.setCurrentGames();

    StorageService.save(this.storageSettings);
  }

  // События избранных

  private initFavorites(): void {
    const gameIds: number[] = this.storageSettings.gamesInFavorites.value
      .toString().split(',')
      .map((id: string) => parseInt(id, 10))
      .filter((id: number) => !isNaN(id));

    this.games.forEach((game) => game.isFavorites = (gameIds.indexOf(game.Id) >= 0));
    this.changeFavorites();
  }

  public changeFavorites(): void {
    this.gamesInFavorites = this.games.filter((game) => game.isFavorites);
    this.storageSettings.gamesInFavorites.value = this.gamesInFavorites.map((item) => item.Id).join();
    StorageService.save(this.storageSettings);
  }

  public toggleFavorites(show: boolean): void {
    this.sorting.favorites = show;
    this.sortGames();
  }

  // События фильтров

  public initFilters(): void {
    const setting = this.storageSettings;

    // Категории
    const catIds: number[] = this.getNumbersFromString(setting.filterCategories.value.toString());
    this.filters.categories = this.categories.filter((cat) => catIds.includes(cat.Id));

    // Мерчанты
    const merchIds: number[] = this.getNumbersFromString(setting.filterMerchant.value.toString());
    this.filters.merchants = this.merchants.filter((merch) => merchIds.includes(merch.Id));

    // Названия
    this.filters.name = setting.filterName.value.toString();

    this.filterGames();
  }

  public changeFilterCategories(selectedItems: Category[]): void {
    this.filters.categories = selectedItems;
    this.filterGames();

    this.storageSettings.filterCategories.value = selectedItems.map((item) => item.Id).join();
    StorageService.save(this.storageSettings);
  }

  public changeFilterMerchant(selectedItems: Merchant[]): void {
    this.filters.merchants = selectedItems;
    this.filterGames();

    this.storageSettings.filterMerchant.value = selectedItems.map((item) => item.Id).join();
    StorageService.save(this.storageSettings);
  }

  public changeFilterName(text: string): void {
    this.filters.name = text.trim();
    this.filterGames();

    this.storageSettings.filterName.value = text;
    StorageService.save(this.storageSettings);
  }

  public changeOrdering(selectedItems: IFiltered[]): void {
    this.sorting.value = selectedItems.length > 0 ? selectedItems[0].Id : this.sorting.value;
    this.storageSettings.orderBy.value = this.sorting.value;
    this.sortGames();

    StorageService.save(this.storageSettings);
  }


  // Вспомогательные методы

  private getNumbersFromString(str: string): number[] {
    return str.split(',')
      .map((id: string) => parseInt(id, 10))
      .filter((id: number) => !isNaN(id));
  }
}
