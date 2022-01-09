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
    const hash = 'todo-hash';

    return new this(timestamp, lastHash, hash, data);
  }
}

export { Block };
