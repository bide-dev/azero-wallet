/**
 * Get a local storage key.
 *
 * @param key - The local storage key to access.
 * @returns The value stored at the key provided if the key exists.
 */
export const getLocalStorage = (key: string) => {
  // eslint-disable-next-line no-restricted-globals
  const { localStorage: ls } = window;

  if (ls !== null) {
    return ls.getItem(key);
  }

  throw new Error('Local storage is not available.');
};

/**
 * Set a value to local storage at a certain key.
 *
 * @param key - The local storage key to set.
 * @param value - The value to set.
 */
export const setLocalStorage = (key: string, value: string) => {
  // eslint-disable-next-line no-restricted-globals
  const { localStorage: ls } = window;

  if (ls !== null) {
    ls.setItem(key, value);
    return;
  }

  throw new Error('Local storage is not available.');
};
