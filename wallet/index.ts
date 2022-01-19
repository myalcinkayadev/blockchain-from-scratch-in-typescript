import { ChainUtil, EC } from '../util';
import { Either, left, right } from 'util/either';
import { ErrorMessage } from 'util/error';
import { INITIAL_BALANCE } from 'config';
import { Transaction } from './transaction';
import { TransactionPool } from './transaction-pool';
import { Blockchain } from 'blockchain';

export const amountExcecedsCurrentBalanceError = (amount: number, balance: number) => ({
  message: `Amount: ${amount} exceeds current balance: ${balance}`,
});

class Wallet {
  balance: number;
  private keyPair: EC.KeyPair;
  publicKey: string;

  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex', false);
  }

  toString() {
    return `Wallet -
      publicKey : ${this.publicKey.toString()}
      balance   : ${this.balance}`;
  }

  sign(dataHash: string) {
    return this.keyPair.sign(dataHash).toDER('hex');
  }

  createTransaction(
    recipientAddress: string,
    amount: number,
    blockchain: Blockchain,
    transactionPool: TransactionPool,
  ): Either<ErrorMessage, Transaction> {
    this.balance = this.calculateBalance(blockchain);

    if (amount > this.balance) return left(amountExcecedsCurrentBalanceError(amount, this.balance));

    let transactionResult = transactionPool.existingTransaction(this.publicKey);

    if (transactionResult.isRight()) {
      transactionResult.value.update(this, recipientAddress, amount);
    }

    transactionResult = Transaction.newTransaction(this, recipientAddress, amount);

    if (transactionResult.isLeft()) return left(transactionResult.value);

    transactionPool.updateOrAddTransaction(transactionResult.value);
    return right(transactionResult.value);
  }

  private hasTransactions(data: unknown): data is Transaction[] {
    return Array.isArray(data) && data.length > 0 && 'id' in (data[0] as Transaction);
  }

  calculateBalance(blockchain: Blockchain) {
    let balance = this.balance;
    const transactions: Transaction[] = [];

    /*
    blockchain.chain.map(
      (block) => this.hasTransactions(block.data) && block.data,
    );
    */

    blockchain.chain.forEach((block) => {
      if (this.hasTransactions(block.data)) {
        block.data.forEach((transaction) => {
          transactions.push(transaction);
        });
      }
    });

    const walletInputTransaction = transactions.filter(
      (transaction) => transaction.input.address === this.publicKey,
    );

    let startTime = 0;

    if (walletInputTransaction.length > 0) {
      const recentInputTransaction = walletInputTransaction.reduce((prev, current) =>
        prev.input.timestamp > current.input.timestamp ? prev : current,
      );

      const recentInputTransactionAmount = recentInputTransaction.outputs.find(
        (output) => output.address === this.publicKey,
      )?.amount;

      if (recentInputTransactionAmount !== undefined) balance = recentInputTransactionAmount;
      startTime = recentInputTransaction.input.timestamp;
    }

    transactions.forEach((transaction) => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.find((output) => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    return blockchainWallet;
  }
}

export { Wallet };
