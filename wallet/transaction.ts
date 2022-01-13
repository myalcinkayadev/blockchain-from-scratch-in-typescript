import { ChainUtil } from '../util';
import { Wallet } from 'wallet';

type TransactionOutput = {
  amount: number;
  address: string;
};

class Transaction {
  id: string;
  public outputs: TransactionOutput[];

  constructor() {
    this.id = ChainUtil.id();
    // this.input = null;
    this.outputs = [];
  }

  static newTransaction(senderWallet: Wallet, recipientAddress: string, amount: number) {
    const transaction = new this();

    if (amount > senderWallet.balance) {
      // eslint-disable-next-line no-console
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    transaction.outputs.push(
      ...[
        { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
        { amount, address: recipientAddress },
      ],
    );

    return transaction;
  }
}

export { Transaction };
