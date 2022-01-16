import { TransactionPool } from 'wallet/transaction-pool';
import { Transaction } from 'wallet/transaction';
import { Wallet } from 'wallet';

describe('TransactionPool', () => {
  let transactionPool: TransactionPool, wallet: Wallet, transaction: Transaction;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    wallet = new Wallet();

    const TransactionResult = Transaction.newTransaction(wallet, 'random-address', 30);
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
});
