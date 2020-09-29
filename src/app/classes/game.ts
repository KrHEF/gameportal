import {IFiltered, TGame, TLanguage} from '../types';
import {Category} from './category';
import {Merchant} from './merchant';

export class Game implements IFiltered {


  private id = -1;
  private name: TLanguage = {en: '', ru: ''};
  private description: string[] = [];
  private image = '';
  private sort = 0;
  private category: Category[] = [];
  private merchant: Merchant;

  public  readonly imageFullPath;
  public readonly categoryIds: number[];
  public readonly merchantId: number;
  public isFavorites = false;

  /**
   * Идентификатор игры
   */
  public get Id(): number {
    return this.id;
  }

  /**
   * Название игры
   * пока сделано так, что если нет русского названия выводится английское.
   */
  public get Name(): string {
    // Пока так сделаем, по идее надо куда-то передавать глобальный идентификатор языка
    // и выводить название в зависимости от него.
    return (this.name.ru !== '') ? this.name.ru : this.name.en;
  }

  constructor(game: TGame) {
    this.id = parseInt(game.ID, 10);
    this.name.en = game.Name.en ?? '';
    this.name.ru = game.Name.ru ?? '';
    this.categoryIds = game.CategoryID.map((cat) => parseInt(cat, 10));
    this.description = game.Description;
    this.image = game.Image;
    this.imageFullPath = game.ImageFullPath ?? '';
    this.merchantId = parseInt(game.MerchantID, 10);
    this.sort = parseInt(game.Sort, 10);
  }

  public get Category(): Category[] {
    if (!this.category.length) {
      this.category = this.categoryIds.map((cat) => Category.getObjectById(cat));
    }
    return this.category;
  }

  public get Merchant(): Merchant {
    if (!this.merchant) {
      this.merchant = Merchant.getObjectById(this.merchantId);
    }
    return this.merchant;
  }

}
