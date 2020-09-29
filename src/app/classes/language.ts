import {TLanguage} from '../types';

export class Language {

  public static defaultLanguages: string[] = ['ru', 'en'];

  private dictionary = new Map<string, string>();

  constructor(dict: TLanguage) {
    for (const lang in dict) {
      if (dict.hasOwnProperty(lang)) {
        this.dictionary.set(lang, dict[lang]);
      }
    }
  }

  public toString(): string {
    for (const lang of Language.defaultLanguages) {
      if (this.dictionary.has(lang)) {
        return this.dictionary.get(lang);
      }
    }
    return '';
  }

  public includes(searchString: string, caseSensitive: boolean = false): boolean {
    return Array.from(this.dictionary.values())
      .some( (text) => {
        return caseSensitive ? text.includes(searchString)
          : text.toLowerCase().includes(searchString.toLowerCase());
      });
  }
}
