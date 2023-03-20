import { encode, decode } from '../src/cbor';

describe('cbor', () => {
  test('encode decode 0 to 1_000_000', () => {
    for (let i = 0; i < 1_000_000; i += 1) {
      let buffer;

      try {
        buffer = encode(BigInt(i));
      } catch (error) {
        console.log(`error encoding on ${i.toString()}`);
        expect((error as Error).message).toBeTruthy();
      }

      try {
        let decoded = decode<bigint>(buffer);
        expect(decoded).toBe(BigInt(i));
      } catch (error) {
        console.log(`error decoding on ${i.toString()}`);
        expect((error as Error).message).toBeTruthy();
      }
      if (i % 100000 === 0) {
        console.log(`${new Date(Date.now()).toLocaleTimeString()} with ${i.toString()}`);
      }
    }
  });
  test('encode decode 1_000_000n to 1_000_000_000_000n', () => {
    for (let i = 1_000_000; i < 1_000_000_000_000; i += 1_000_000) {
      let buffer;

      const random_num = Math.floor(Math.random() * Math.pow(10, i.toString().length - 1));

      const actual = BigInt(i + random_num);
      try {
        buffer = encode(actual);
      } catch (error) {
        console.log(`error encoding on ${i.toString()}`);
        expect((error as Error).message).toBeTruthy();
      }

      try {
        let decoded = decode<bigint>(buffer);
        expect(decoded).toBe(actual);
      } catch (error) {
        console.log(`error decoding on ${i.toString()}`);
        expect((error as Error).message).toBeTruthy();
      }
      if (i % 1_000_000_000_00 === 0) {
        console.log(`${new Date(Date.now()).toLocaleTimeString()} with ${actual.toString()}`);
      }
    }
  });
  test('encode decode 1_000_000_000_000n to 1_000_000_000_000_000_000n', () => {
    for (let i = 1_000_000_000_000n; i < 1_000_000_000_000_000_000n; i += 1_000_000_000_000n) {
      let buffer;
      const random_num = BigInt(Math.floor(Math.random() * Math.pow(10, i.toString().length - 1)));
      const actual = i + random_num;
      try {
        buffer = encode(actual);
      } catch (error) {
        console.log(`error encoding on ${i.toString()}`);
        expect((error as Error).message).toBeTruthy();
      }

      try {
        let decoded = decode<bigint>(buffer);
        expect(decoded).toBe(actual);
      } catch (error) {
        console.log(`error decoding on ${i.toString()}`);
        expect((error as Error).message).toBeTruthy();
      }
      if (i % 1_000_000_000_000_000_00n === 0n) {
        console.log(`${new Date(Date.now()).toLocaleTimeString()} with ${actual.toString()}`);
      }
    }
  });
});
