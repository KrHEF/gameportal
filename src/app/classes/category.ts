import {IFiltered, TCategory, TLanguage} from '../types';

export class Category implements IFiltered {

  // Коллекцию объектов этого класса.
  private static collection: Category[] = [];

  private id = -1;
  private name: TLanguage = {en: '', ru: ''};
  private sort = 0;

  /**
   * Идентификатор категории
   */
  public get Id(): number {
    return this.id;
  }

  /**
   * Название категории
   * пока сделано так, что если нет русского названия выводится английское.
   */
  public get Name(): string {
    return (this.name.ru !== '') ? this.name.ru : this.name.en;
  }

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
    return Category.collection.find((obj) => obj.Id === id);
  }

}
