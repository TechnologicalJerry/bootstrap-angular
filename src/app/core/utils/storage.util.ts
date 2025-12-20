/**
 * Utility functions for safe localStorage access in SSR environments
 */

/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Safe localStorage.getItem
 */
export function getStorageItem(key: string): string | null {
  if (!isBrowser()) {
    return null;
  }
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safe localStorage.setItem
 */
export function setStorageItem(key: string, value: string): boolean {
  if (!isBrowser()) {
    return false;
  }
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safe localStorage.removeItem
 */
export function removeStorageItem(key: string): boolean {
  if (!isBrowser()) {
    return false;
  }
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

