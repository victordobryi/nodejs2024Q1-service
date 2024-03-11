import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  private store: { [key: string]: any };

  constructor() {
    this.store = {};
  }

  get(key: string): any {
    const [storeKey, nestedKey] = key.split('.');
    if (this.store[storeKey]) {
      return this.store[storeKey][nestedKey] || null;
    }
    return null;
  }

  save(key: string, value: any) {
    const [storeKey, nestedKey] = key.split('.');
    if (!this.store[storeKey]) {
      this.store[storeKey] = {};
    }
    this.store[storeKey][nestedKey] = value;
    return this.store[storeKey][nestedKey];
  }

  delete(key: string): any {
    const [storeKey, nestedKey] = key.split('.');
    const store = this.store[storeKey];

    if (store && store[nestedKey]) {
      const deletedData = store[nestedKey];
      delete store[nestedKey];
      return deletedData;
    } else {
      return null;
    }
  }

  getAll(key: string) {
    const [storeKey, nestedKey] = key.split('.');
    if (this.store[storeKey]) {
      const keys = Object.keys(this.store[storeKey]);
      const dataArray = keys.map((key) => this.store[storeKey][key]);
      return dataArray;
    }
    return [];
  }

  clear(): void {
    this.store = {};
  }

  update(key: string, updatedValue: any): any {
    const [storeKey, nestedKey] = key.split('.');
    if (this.store[storeKey] && this.store[storeKey][nestedKey]) {
      this.store[storeKey][nestedKey] = {
        ...this.store[storeKey][nestedKey],
        ...updatedValue,
      };
      return this.store[storeKey][nestedKey];
    }
    return null;
  }

  findByProperty(entity: string, propertyName: string, value: string): any {
    if (this.store[entity]) {
      for (const key in this.store[entity]) {
        const item = this.store[entity][key];
        if (item[propertyName] === value) {
          return item;
        }
      }
    }
    return null;
  }
}
