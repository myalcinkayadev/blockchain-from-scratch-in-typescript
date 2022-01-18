import { TransactionPool } from 'wallet/transaction-pool';
import { Transaction } from 'wallet/transaction';
import { Wallet } from 'wallet';
import { Blockchain } from 'blockchain';

describe('TransactionPool', () => {
  let transactionPool: TransactionPool,
    wallet: Wallet,
    transaction: Transaction,
    blockchain: Blockchain;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    wallet = new Wallet();
    blockchain = new Blockchain();

    const TransactionResult = wallet.createTransaction(
      'random-address',
      30,
      blockchain,
      transactionPool,
    );

    if (TransactionResult.isRight()) {
      transaction = TransactionResult.value;
      transactionPool.updateOrAddTransaction(transaction);
    }
  });

  test('it adds a transaction to the pool', () => {
    expect(transactionPool.findTransaction(transaction.id)).toEqual(transaction);
  });

  test('it updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-address', 40);

    if (newTransaction.isRight()) {
      transactionPool.updateOrAddTransaction(newTransaction.value);
      expect(JSON.stringify(transactionPool.findTransaction(newTransaction.value.id))).not.toEqual(
        oldTransaction,
      );
    }
  });

  it('clears transactions', () => {
    transactionPool.clear();
    expect(transactionPool.transactions).toEqual([]);
  });

  describe('mixing valid and corrupt transactions', () => {
    let validTransactions: Transaction[];

    beforeEach(() => {
      validTransactions = [...transactionPool.transactions];

      function createMixTransactions(limit: number, i = 0) {
        wallet = new Wallet();
        const transactionResult = wallet.createTransaction(
          'random-address',
          30,
          blockchain,
          transactionPool,
        );
        if (transactionResult.isRight()) {
          transaction = transactionResult.value;
          if (i % 2 === 0) {
            transaction.input.amount = 99999;
          } else {
            validTransactions.push(transaction);
          }
        }
        i++;
        if (i < limit) createMixTransactions(i, limit);
      }

      createMixTransactions(6);
    });

    it('shows a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(transactionPool.transactions)).not.toEqual(
        JSON.stringify(validTransactions),
      );
    });

    it('grabs valid transactions', () => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions);
    });
  });
});
