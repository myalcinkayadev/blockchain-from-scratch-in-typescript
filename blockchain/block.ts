import { createHmac } from 'crypto';
import { BLOCK_HASH_PRIVATE_KEY, GENESIS_DATA, MINE_RATE } from '../config';

function assertBlockHashPrivateKey(value: unknown): asserts value is string {
  if (typeof value !== 'string') throw new TypeError('block hash private key is must be a string');
}

class Block {
  constructor(
    public timestamp: number,
    public lastHash: string,
    public hash: string,
    public data: unknown,
    public nonce: number,
    public difficulty: number,
  ) {}

  toString() {
    return `Block -
        timestamp  : ${this.timestamp}
        last hash  : ${this.lastHash.substring(0, 10)}
        hash       : ${this.hash.substring(0, 10)}
        nonce      : ${this.nonce}
        difficulty : ${this.difficulty}
        data       : ${this.data}`;
  }

  static genesis() {
    return new this(0, '-', '-', [], 0, GENESIS_DATA.blockHeaders.difficulty);
  }

  static mineBlock(lastBlock: Block, data: unknown) {
    let hash!: string,
      timestamp!: number,
      nonce = 0;

    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;

    // proof of work
    // eslint-disable-next-line no-loops/no-loops
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty < 0 ? 0 : difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(
    timestamp: number,
    lastHash: string,
    data: unknown,
    nonce: number,
    difficulty: number,
  ) {
    assertBlockHashPrivateKey(BLOCK_HASH_PRIVATE_KEY);
    const sha256Hasher = createHmac('sha256', BLOCK_HASH_PRIVATE_KEY);
    return sha256Hasher.update(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).digest('hex');
  }

  static blockHash(block: Block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock: Block, currentTime: number) {
    const { difficulty } = lastBlock;
    return lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
  }
}

export { Block };
