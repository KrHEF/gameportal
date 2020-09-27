import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements Storage {

  private storage: Storage;

  // [name: string]: any;

  get length(): number { return this.storage.length; }

  constructor() {
    this.storage = window.localStorage;
  }


  clear(): void {
    this.storage.clear();
  }

  getItem(key: string): string | null {
    return this.storage[key];
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

}
