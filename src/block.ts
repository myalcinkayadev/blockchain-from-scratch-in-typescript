import { createHmac } from 'crypto';
import { BLOCK_HASH_PRIVATE_KEY } from '../config';

function assertBlockHashPrivateKey(value: unknown): asserts value is string {
  if (typeof value !== 'string') throw new TypeError('block hash private key is must be a string');
}

class Block {
  constructor(
    public timestamp: number,
    public lastHash: string,
    public hash: string,
    public data: unknown,
  ) {}

  toString() {
    return `Block -
        timestamp : ${this.timestamp}
        last hash : ${this.lastHash.substring(0, 10)}
        hash      : ${this.hash.substring(0, 10)}
        data      : ${this.data}`;
  }

  static genesis() {
    return new this(0, '-', '-', []);
  }

  static mineBlock(lastBlock: Block, data: unknown) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = Block.hash(timestamp, lastHash, data);

    return new this(timestamp, lastHash, hash, data);
  }

  static hash(timestamp: number, lastHash: string, data: unknown) {
    assertBlockHashPrivateKey(BLOCK_HASH_PRIVATE_KEY);
    const sha256Hasher = createHmac('sha256', BLOCK_HASH_PRIVATE_KEY);
    return sha256Hasher.update(`${timestamp}${lastHash}${data}`).digest('hex');
  }

  static blockHash(block: Block) {
    const { timestamp, lastHash, data } = block;
    return Block.hash(timestamp, lastHash, data);
  }
}

export { Block };
