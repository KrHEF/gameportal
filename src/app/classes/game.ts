import {IGame, TGame, TLanguage} from '../types';
import {Category} from './category';
import {Merchant} from './merchant';

export class Game implements IGame {

  id = -1;
  name: TLanguage = {en: '', ru: ''};
  categoryID: number[] = [];
  description: string[] = [];
  image = '';
  imageFullPath = '';
  merchantId = -1;
  sort = 0;

  private category: Category[] = [];
  private merchant: Merchant;

  constructor(game: TGame) {
    this.id = parseInt(game.ID, 10);
    this.name.en = game.Name.en ?? '';
    this.name.ru = game.Name.ru ?? '';
    this.categoryID = game.CategoryID.map( (cat) => parseInt(cat, 10) );
    this.description = game.Description;
    this.image = game.Image;
    this.imageFullPath = game.ImageFullPath;
    this.merchantId = parseInt(game.MerchantID, 10);
    this.sort = parseInt(game.Sort, 10);
  }

  public get Category(): Category[] {
    if (!this.category.length) {
      this.category = this.categoryID.map( (cat) => Category.getObjectById(cat) );
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
