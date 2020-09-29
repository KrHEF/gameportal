import {IFiltered, TMerchant} from '../types';
import {Language} from './language';

export class Merchant implements IFiltered {

  // Коллекцию объектов этого класса.
  private static collection: Merchant[] = [];

  private id = -1;
  private name: Language;

  /**
   * Идентификатор поставщика
   */
  public get Id(): number { return this.id; }

  /**
   * Название поставщика
   * пока сделано так, что если нет русского названия выводится английское.
   */
  public get Name(): string {
    return this.name.toString();
  }

  public constructor({ID: id, Name: name}: TMerchant) {
    this.id = parseInt(id, 10);
    this.name = new Language({en: name, ru: name});

    Merchant.collection.push(this);
  }

  // Статические методы

  public static getAll(): Merchant[] {
    return Merchant.collection;
  }

  public static getObjectById(id: number): Merchant {
    return Merchant.collection.find( (merch) => merch.Id === id );
  }
}
