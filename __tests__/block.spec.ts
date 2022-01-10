import { Block } from '../src/block';

describe('block function', () => {
  test('it should create a block', () => {
    const block = new Block(0, '-', '-', []);
    expect(block).toStrictEqual(new Block(0, '-', '-', []));
  });
  test('it should create a genesis block', () => {
    const genesisBlock = Block.genesis();
    const expectedGenesisBlock = new Block(0, '-', '-', []);
    expect(genesisBlock).toStrictEqual(expectedGenesisBlock);
  });
  test('it should create a mine block', () => {
    const genesisBlock = Block.genesis();
    const mineBlock = Block.mineBlock(genesisBlock, []);
    expect(genesisBlock.hash).toStrictEqual(mineBlock.lastHash);
  });
});
