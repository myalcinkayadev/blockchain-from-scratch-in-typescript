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

  test('it generates a hash that matches the difficulty', () => {
    expect(block.hash.substring(0, block.difficulty)).toBe('0'.repeat(block.difficulty));
  });

  test('it lowers the difficulty for slowly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(block.difficulty - 1);
  });

  test('it raises the difficulty for quickly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
  });
});
