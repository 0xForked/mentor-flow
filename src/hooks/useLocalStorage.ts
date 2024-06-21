interface CacheItem {
  value: string;
  expiry: number;
}

type StateAction = () => void;

function setCacheItem(key: string, value: string, ttl: number): void {
  const now = new Date();
  const item: CacheItem = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getCacheItem(key: string): string | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item: CacheItem = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

function clearExpiredCacheItems(...stateActions: StateAction[]): void {
  const now = new Date().getTime();
  for (const key in localStorage) {
    if (!Object.prototype.hasOwnProperty.call(localStorage, key)) {
      continue;
    }
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      continue;
    }
    const item: CacheItem = JSON.parse(itemStr);
    if (item.expiry && now > item.expiry) {
      localStorage.removeItem(key);
      stateActions.forEach((action) => action());
    }
  }
}

interface CacheHook {
  setCache: (key: string, value: string, ttl: number) => void;
  getCache: (key: string) => string | null;
  clearExpiredCache: (...stateActions: StateAction[]) => void;
}

function useLocalStorage(): CacheHook {
  return {
    setCache: setCacheItem,
    getCache: getCacheItem,
    clearExpiredCache: clearExpiredCacheItems,
  };
}

export { useLocalStorage };
