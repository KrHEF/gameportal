import {IFiltered, TCategory} from '../types';
import {Language} from './language';

export class Category implements IFiltered {

  // Коллекцию объектов этого класса.
  private static collection: Category[] = [];

  private id = -1;
  private name: Language;
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
    return this.name.toString();
  }

  constructor({ID: id, Name: dict, CSort: sort}: TCategory) {
    this.id = parseInt(id, 10);
    this.name = new Language(dict);
    this.sort = parseInt(sort, 10);

    Category.collection.push(this);
  }

  // Статические методы

  public static getAll(): Category[] {
    return Category.collection;
  }

  public static getObjectById(id: number): Category {
    return Category.collection.find((obj) => obj.Id === id);
  }

}
