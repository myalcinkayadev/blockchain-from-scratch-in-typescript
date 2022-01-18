import { log } from 'logger';
import { Transaction } from 'wallet/transaction';
import { Block } from './block';

class Blockchain {
  chain: Block[];
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data: unknown | Transaction[]) {
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

  replaceChain(newChain: Block[]) {
    // Received chain is not longer than the current chain or the received chain is not valid
    if (newChain.length <= this.chain.length || !this.isValidChain(newChain)) return;

    log.info('Replacing blockchain with the new chain');
    this.chain = newChain;
  }
}

export { Blockchain };
