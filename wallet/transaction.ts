import { ChainUtil } from '../util';
import { Either, left, right } from 'util/either';
import { ErrorMessage } from 'util/error';
import { Wallet } from 'wallet';
import { MINING_REWARD } from 'config';

type TransactionOutput = {
  amount: number;
  address: string;
};

type TransactionInput = {
  timestamp: number;
  amount: number;
  address: string;
  signature: string;
};

export const senderWalletAddressCouldNotFindError = () => ({
  message: 'Sender wallet address could not find',
});

export const amountExceedsBalanceError = (amount: number) => ({
  message: `${amount} exceeds balance`,
});

class Transaction {
  id: string;
  input!: TransactionInput;
  outputs: TransactionOutput[];

  constructor() {
    this.id = ChainUtil.id();
    this.outputs = [];
  }

  private isAmountExceedsBalance(amount: number, senderAmount: number) {
    return amount > senderAmount;
  }

  update(
    senderWallet: Wallet,
    recipientAddress: string,
    amount: number,
  ): Either<ErrorMessage, Transaction> {
    const senderOutput = this.outputs.find((output) => output.address === senderWallet.publicKey);

    if (!senderOutput) return left(senderWalletAddressCouldNotFindError());

    if (this.isAmountExceedsBalance(amount, senderOutput.amount))
      return left(amountExceedsBalanceError(amount));

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipientAddress });
    Transaction.signTransaction(this, senderWallet);

    return right(this);
  }

  static transactionWithOutputs(senderWallet: Wallet, outputs: TransactionOutput[]) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static newTransaction(
    senderWallet: Wallet,
    recipientAddress: string,
    amount: number,
  ): Either<ErrorMessage, Transaction> {
    const transaction = new this();

    if (transaction.isAmountExceedsBalance(amount, senderWallet.balance))
      return left(amountExceedsBalanceError(amount));

    return right(
      Transaction.transactionWithOutputs(senderWallet, [
        { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
        { amount, address: recipientAddress },
      ]),
    );
  }

  static rewardTransaction(minerWallet: Wallet, blockchainWallet: Wallet) {
    return Transaction.transactionWithOutputs(blockchainWallet, [
      {
        amount: MINING_REWARD,
        address: minerWallet.publicKey,
      },
    ]);
  }

  static signTransaction(transaction: Transaction, senderWallet: Wallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    };
  }

  static verifyTransaction(transaction: Transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs),
    );
  }
}

export { Transaction };
