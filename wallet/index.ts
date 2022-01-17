import { ChainUtil, EC } from '../util';
import { Either, left, right } from 'util/either';
import { ErrorMessage } from 'util/error';
import { INITIAL_BALANCE } from 'config';
import { Transaction } from './transaction';
import { TransactionPool } from './transaction-pool';

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
    transactionPool: TransactionPool,
  ): Either<ErrorMessage, Transaction> {
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

  static blockchainWallet() {
    const blockchainWallet = new this();
    return blockchainWallet;
  }
}

export { Wallet };
