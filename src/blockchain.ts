import { Block } from './block';

class Blockchain {
  chain: Block[];
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data: unknown) {
    const lastBlock = this.chain[this.chain.length - 1];
    const block = Block.mineBlock(lastBlock, data);
    this.chain.push(block);

    return block;
  }

  isValidChain(chain: Block[]) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

    return !chain.find(
      (currentBlock, index) =>
        index > 0 &&
        (currentBlock.lastHash !== chain[index - 1].hash ||
          currentBlock.hash !== Block.blockHash(currentBlock)),
    );
  }
}

export { Blockchain };
