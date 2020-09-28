export class StorageService implements Storage {

  get length(): number {
    return this.storage.length;
  }

  private constructor() {
    this.storage = window.localStorage;
  }

  private static storageService: StorageService;

  private storage: Storage;

  public static get(): StorageService {
    if (!this.storageService) {
      this.storageService = new StorageService();
    }
    return this.storageService;
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
