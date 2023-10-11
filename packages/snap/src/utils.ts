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

// Reference: https://stackoverflow.com/a/71083193
export const uint8ArrayFromHex = (hexString: string) => {
  const strBytes = hexString.replace(/^0x/iu, '').match(/../gu) ?? [];
  return new Uint8Array(strBytes.map((byte: string) => parseInt(byte, 16)))
    .buffer;
};

export const sha256 = (message: string): Uint8Array => {
  const hash = new SHA3(256);
  hash.update(message);
  return hash.digest();
};
