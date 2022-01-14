import { createHmac } from 'crypto';
import { ec as EC } from 'elliptic';
import { nanoid } from 'nanoid';
import { BLOCK_HASH_PRIVATE_KEY } from '../config';

const ec = new EC('secp256k1');

function assertBlockHashPrivateKey(value: unknown): asserts value is string {
  if (typeof value !== 'string') throw new TypeError('block hash private key is must be a string');
}

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static id() {
    return nanoid();
  }

  static hash(data: unknown) {
    assertBlockHashPrivateKey(BLOCK_HASH_PRIVATE_KEY);
    const sha256Hasher = createHmac('sha256', BLOCK_HASH_PRIVATE_KEY);
    return sha256Hasher.update(JSON.stringify(data)).digest('hex');
  }

  static verifySignature(publicKey: string, signature: string, dataHash: string) {
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }
}

export { ChainUtil, EC };
