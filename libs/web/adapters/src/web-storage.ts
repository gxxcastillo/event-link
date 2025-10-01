type JSONValue = string | number | boolean | null | JSONObject | JSONValue[];
interface JSONObject {
  [key: string]: JSONValue;
}

export interface WebStorage {
  get<T = unknown>(key: string): T | null;
  set<T = unknown>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
}

export const storage: WebStorage = {
  get<T = unknown>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.error('Storage.get parse error', { key, err });
      return null;
    }
  },

  set<T = unknown>(key: string, value: T): void {
    try {
      const raw = JSON.stringify(value);
      localStorage.setItem(key, raw);
    } catch (err) {
      console.error('Storage.set stringify error', { key, value, err });
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  },

  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  },
};
