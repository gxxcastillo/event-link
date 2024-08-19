import { nanoid } from 'nanoid';

export function generateEventID() {
  return nanoid(9);
}

export function padByteArray(uint8Array: Uint8Array, size: number) {
  const paddedArray = new Uint8Array(size);
  paddedArray.set(uint8Array);
  return paddedArray;
}

export function stringToByteArray(id: string, size: number = id.length) {
  const uint8array = new TextEncoder().encode(id).slice(0, size);
  return uint8array.length < size ? padByteArray(uint8array, size) : uint8array;
}

export function stringToNumberArray(id: string, size: number = id.length) {
  return Array.from(stringToByteArray(id, size));
}
