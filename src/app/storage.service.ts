import {TStorageSetting} from './types';

export class StorageService implements Storage {

  private static storageService: StorageService;

  private readonly storage: Storage;

  private constructor() {
    this.storage = window.localStorage;
  }

  // Статические методы

  /**
   * Получение экземпляра класса
   */
  public static get(): StorageService {
    if (!this.storageService) {
      this.storageService = new StorageService();
    }
    return this.storageService;
  }

  /**
   * Сохранение всех сохраняемых настроек в localStorage
   * @private
   */
  public static save(storageSettings: TStorageSetting): void {
    const ss = this.get();

    for (const key in storageSettings) {
      if (storageSettings.hasOwnProperty(key)) {

        const setting = storageSettings[key];
        if (setting.storable) {
          ss.setItem(key, setting.value.toString());
        }
      }
    }
  }

  /**
   * Получение настроек сохраняемых настроек из localStorage
   * @private
   */
  public static load(storageSettings: TStorageSetting): void {
    const ss = this.get();

    for (const key in storageSettings) {
      if (storageSettings.hasOwnProperty(key)) {

        const setting = storageSettings[key];
        if (!setting.storable) {
          continue;
        }

        const value: string = ss.getItem(key);
        if (!value) {
          continue;
        } else if ((typeof setting.value === 'string')) {
          setting.value = value;
        } else if ((typeof setting.value === 'number') && parseInt(value, 10)) {
          setting.value = parseInt(value, 10);
        }
      }
    }
  }


  // Методы интерфейса Storage

  get length(): number {
    return this.storage.length;
  }

  clear(): void {
    this.storage.clear();
  }

  getItem(key: string): string | null {
    if (key) {
      return this.storage[key];
    }
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  setItem(key: string, value: string): void {
    if (key) {
      this.storage.setItem(key, value);
    }
  }


}
