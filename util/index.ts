import { ec as EC } from 'elliptic';
import { nanoid } from 'nanoid';

const ec = new EC('secp256k1');

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static id() {
    return nanoid();
  }
}

export { ChainUtil, EC };
