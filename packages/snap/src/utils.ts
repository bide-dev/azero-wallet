import SHA3 from 'sha3';

export const RNG_SEED_SIZE = 32;

export const getRandomBytes = (byteCount: number): Int32Array => {
  if (!window.crypto?.getRandomValues) {
    throw new Error('window.crypto.getRandomValues not available');
  }
  const randomBytes = new Int32Array(byteCount);
  window.crypto.getRandomValues(randomBytes);
  return randomBytes;
};

export const sha256 = (message: string): Uint8Array => {
  const hash = new SHA3(256);
  hash.update(message);
  return hash.digest();
};
