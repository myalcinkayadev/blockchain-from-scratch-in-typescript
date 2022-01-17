import { Either, left, right } from 'util/either';
import { ErrorMessage } from 'util/error';
import { Transaction } from './transaction';

export const transactionIsNotFoundError = () => ({
  message: 'transaction is not found',
});

export const invalidTransactionFromAddressError = (transactionAddress: string) => ({
  message: `Invalid transaction from ${transactionAddress}.`,
});

export const invalidSignatureFromAddressError = (transactionAddress: string) => ({
  message: `Invalid signature from ${transactionAddress}.`,
});

class TransactionPool {
  transactions: Transaction[];
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction: Transaction) {
    const transactionWithId = this.findTransaction(transaction.id);

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

  validTransactions() {
    return this.transactions.filter((transaction) => {
      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);

      if (transaction.input.amount !== outputTotal) return;
      if (!Transaction.verifyTransaction(transaction)) return;

      return transaction;
    });
  }
}

export { TransactionPool };
