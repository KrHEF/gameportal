import {IFiltered, TLanguage, TMerchant} from '../types';

export class Merchant implements IFiltered {

  // Коллекцию объектов этого класса.
  private static collection: Merchant[] = [];

  private id = -1;
  private name: TLanguage = {en: '', ru: ''};

  /**
   * Идентификатор поставщика
   */
  public get Id(): number { return this.id; }

  /**
   * Название поставщика
   * пока сделано так, что если нет русского названия выводится английское.
   */
  public get Name(): string {
    return (this.name.ru !== '') ? this.name.ru : this.name.en;
  }

  public constructor({ID: id, Name: name}: TMerchant) {
    this.id = parseInt(id, 10);
    this.name.en = name;

    Merchant.collection.push(this);
  }

  public static getAll(): Merchant[] {
    return Merchant.collection;
  }

  public static getObjectById(id: number): Merchant {
    return Merchant.collection.find( (merch) => merch.Id === id );
  }
}
