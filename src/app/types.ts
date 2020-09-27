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

export interface ICategory {
  id: number;
  name: TLanguage;
  sort: number;
  slug?: string;
  menuId?: string;
}

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

export interface IGame {
  id: number;
  image: string;
  imageFullPath: string;
  name: TLanguage;
  description: string[];
  categoryID: number[];
  merchantId: number;
  sort: number;
}

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

export interface IMerchant {
  id: number;
  name: TLanguage;
  alias?: string;
  image?: string;
  menuID?: string;
}

// export interface IPager {
//   PageNumber: number;
//   readonly StartIndex: number;
//   readonly EndIndex: number;
//
//   change(value: number): void;
// }
