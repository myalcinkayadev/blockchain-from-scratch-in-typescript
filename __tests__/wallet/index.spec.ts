import { Wallet } from 'wallet';
import { Transaction } from 'wallet/transaction';
import { TransactionPool } from 'wallet/transaction-pool';

describe('Wallet', () => {
  let wallet: Wallet, transactionPool: TransactionPool;

  beforeEach(() => {
    wallet = new Wallet();
    transactionPool = new TransactionPool();
  });

  describe('creating a transaction', () => {
    let transaction: Transaction, sendAmount: number, recipientAddress: string;

    beforeEach(() => {
      sendAmount = 50;
      recipientAddress = 'random-address';
      const transactionResult = wallet.createTransaction(
        recipientAddress,
        sendAmount,
        transactionPool,
      );

      if (transactionResult.isRight()) transaction = transactionResult.value;
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipientAddress, sendAmount, transactionPool);
      });

      it('doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(
          transaction.outputs.find((output) => output.address === wallet.publicKey)?.amount,
        ).toEqual(wallet.balance - sendAmount * 2);
      });

      it('clones the `sendAmout` output for the recipient', () => {
        expect(
          transaction.outputs
            .filter((output) => output.address === recipientAddress)
            .map((output) => output.amount),
        ).toEqual([sendAmount, sendAmount]);
      });
    });
  });
});
