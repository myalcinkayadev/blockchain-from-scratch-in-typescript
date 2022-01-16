import { Either, left, right } from 'util/either';
import { ErrorMessage } from 'util/error';
import { Transaction } from './transaction';

export const transactionIsNotFoundError = () => ({
  message: 'transaction is not found',
});

class TransactionPool {
  transactions: Transaction[];
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction: Transaction) {
    const transactionWithId = this.transactions.find((t) => t.id == transaction.id);

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
      return;
    }
    this.transactions.push(transaction);
  }

  existingTransaction(address: string): Either<ErrorMessage, Transaction> {
    const transaction = this.transactions.find((t) => t.input.address === address);
    if (!transaction) return left(transactionIsNotFoundError());
    return right(transaction);
  }

  findTransaction(transactionId: string) {
    return this.transactions.find((t) => t.id === transactionId);
  }
}

export { TransactionPool };
