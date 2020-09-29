import {IFiltered, TGame} from '../types';
import {Category} from './category';
import {Merchant} from './merchant';
import {Language} from './language';

export class Game implements IFiltered {


  private id = -1;
  private name: Language;
  private description: string[] = [];
  private image = '';
  private sort = 0;
  private category: Category[] = [];
  private merchant: Merchant;

  public  readonly imageFullPath;
  private categoryIds: number[] = [];
  private merchantId = -1;
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
    return this.name.toString();
  }

  constructor(game: TGame) {
    this.id = parseInt(game.ID, 10);
    this.name = new Language(game.Name);
    this.categoryIds = game.CategoryID.map((cat) => parseInt(cat, 10));
    this.description = game.Description;
    this.image = game.Image;
    this.imageFullPath = game.ImageFullPath ?? '';
    this.merchantId = parseInt(game.MerchantID, 10);
    this.sort = parseInt(game.Sort, 10);
  }

  public get Categories(): Category[] {
    if (!this.category.length) {
      this.category = this.categoryIds.map((cat) => Category.getObjectById(cat));
    }
    return this.category;
  }
  public get CategoriesIds(): number[] {
    return this.categoryIds;
  }

  public get Merchant(): Merchant {
    if (!this.merchant) {
      this.merchant = Merchant.getObjectById(this.merchantId);
    }
    return this.merchant;
  }

  /**
   * Провереят, что имена включают искомую строку.
   * Т. к. языков может быть несколько, проверять надо все.
   * @param searchString Искомая строка
   * @param caseSensitive Чувствительность к РеГиСтРу (true), или нет (false)
   * @return Вернёт (true), если хотя бы одно значение языка содержит искомую строчку
   */
  public includesName(searchString: string, caseSensitive: boolean = false): boolean {
    return this.name.includes(searchString, caseSensitive);
  }

}
