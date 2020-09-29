
export type TLanguage = {
  en: string,
  ru: string,
};
export type TGameData = {
  categories: TCategory[],
  games: TGame[],
  merchants: IMerchantData,
};

export type TCategory = {
  ID: string,
  Name: TLanguage,
  CSort: string,
  Slug: string,
  menuId: string,
};

export type TGame = {
  ID: string,
  Image: string,
  ImageFullPath: string,
  Name: TLanguage,
  Description: string[],
  CategoryID: string[],
  MerchantID: string,
  Sort: string,
};

export interface IMerchantData {
  [index: string]: TMerchant;
}

export type TMerchant = {
  ID: string,
  Name: string,
  IDParent: string,
  Alias: string,
  Image: string,
  menuID: string,
};


// export interface IPager {
//   PageNumber: number;
//   readonly StartIndex: number;
//   readonly EndIndex: number;
//
//   change(value: number): void;
// }

export interface IFiltered {
  Id: number;
  Name: string;
}

export type TFiltered = {
  categories: IFiltered[],
  merchants: IFiltered[],
  name: string,
};

export type TSorting = {
  favorites: boolean,
  list: IFiltered[],
  value: number,
};

export type TStorageSetting = {
  [index: string]: {
    storable: boolean,
    value: string | number,
    values?: string[] | number [],
  }
};
