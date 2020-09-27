export type TLanguage = {
  en: string,
  ru: string,
};

export type TGameCategory = {
  ID: string,
  Name: TLanguage,
  CSort: string,
  Slug: string,
  menuId: string,
};

export type TGameData = {
  categories: TGameCategory[],
  games: TGame[],
  merchants: IMerchant,
};

export type TGame = {
  ID: string,
  Image: string,
  ImageFullPath: string,
  Name: TLanguage,
  Description: string[],
  CategoryID: string[],
  MerchantId: string,
  Sort: string,
};

export interface IMerchant {
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
