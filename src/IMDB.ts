export class InMemoryDB {
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

  exists(key: string): boolean {
    const [storeKey, nestedKey] = key.split('.');
    return this.store[storeKey] && nestedKey in this.store[storeKey];
  }

  getAll(key: string) {
    const [storeKey, nestedKey] = key.split('.');
    if (this.store[storeKey]) {
      return this.store[storeKey] || [];
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

  findByUsername(username: string): any {
    if (this.store['user']) {
      for (const key in this.store['user']) {
        const user = this.store['user'][key];
        if (user.login === username) {
          return user;
        }
      }
      return null;
    }
  }
}
