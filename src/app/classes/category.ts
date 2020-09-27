import {ICategory, TCategory, TLanguage} from '../types';

export class Category implements ICategory {

  private static collection: Category[] = [];

  id = -1;
  name: TLanguage = {en: '', ru: ''};
  sort = 0;

  constructor({ID: id, Name: {en, ru}, CSort: sort}: TCategory) {
    this.id = parseInt(id, 10);
    this.name.en = en ?? '';
    this.name.ru = ru ?? '';
    this.sort = parseInt(sort, 10);

    Category.collection.push(this);
  }


  public static getAll(): Category[] {
    return Category.collection;
  }

  public static getObjectById(id: number): Category {
    return Category.collection.find( (obj) => obj.id === id );
  }

}
