import { Block } from 'blockchain/block';

describe('block', () => {
  let data: string, lastBlock: Block, block: Block;

  beforeEach(() => {
    data = 'foo';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  test('it sets that `data` to match the input', () => {
    expect(block.data).toEqual(data);
  });

  test('it sets the `lastHash` to match the hash of the last block', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });
});
