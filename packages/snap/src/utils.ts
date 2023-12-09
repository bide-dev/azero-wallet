import SHA3 from 'sha3';

export const sha256 = (message: string): Uint8Array => {
  const hash = new SHA3(256);
  hash.update(message);
  return hash.digest();
};
