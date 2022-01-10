import { Blockchain } from '../src/blockchain';
import { Block } from '../src/block';

describe('blockchain', () => {
  let blockchain: Blockchain, blockchain2: Blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain2 = new Blockchain();
  });

  test('it starts with genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  test('it adds a new block', () => {
    const data = 'foo';
    blockchain.addBlock(data);

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });

  test('it validates a valid chain', () => {
    blockchain2.addBlock('foo');

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
  });

  test('it invalidates a chain with a corrupt genesis block', () => {
    blockchain2.chain[0].data = 'bad data';

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });

  test('it invalidates a corrupt chain', () => {
    blockchain2.addBlock('foo');
    blockchain2.chain[1].data = 'not foo';

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });

  test('it replaces the chain with a valid chain', () => {
    blockchain2.addBlock('sisi');
    blockchain.replaceChain(blockchain2.chain);

    expect(blockchain.chain).toEqual(blockchain2.chain);
  });

  test('it does not replace the chain with one of less than or equal to length', () => {
    blockchain.addBlock('mimo');
    blockchain.replaceChain(blockchain2.chain);

    expect(blockchain.chain).not.toEqual(blockchain2.chain);
  });
});
