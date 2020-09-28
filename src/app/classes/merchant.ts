import {IFiltered, IMerchant, TLanguage, TMerchant} from '../types';

export class Merchant implements IMerchant, IFiltered {

  private static collection: Merchant[] = [];

  id = -1;
  name: TLanguage = {en: '', ru: ''};

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
    return Merchant.collection.find( (merch) => merch.id === id );
  }
}
