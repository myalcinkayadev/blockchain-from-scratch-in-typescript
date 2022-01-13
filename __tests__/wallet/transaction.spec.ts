import { Wallet } from '../../wallet';
import { Transaction } from '../../wallet/transaction';

describe('Transaction', () => {
  let transaction: Transaction | undefined,
    wallet: Wallet,
    recipientAddress: string,
    amount: number;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipientAddress = 'r3c1p13e7';
    transaction = Transaction.newTransaction(wallet, recipientAddress, amount);
  });

  test('it outputs the `amount` subtracted from the wallet balance', () => {
    expect(
      transaction?.outputs.find((output) => output.address === wallet.publicKey)?.amount,
    ).toEqual(wallet.balance - amount);
  });

  test('it outputs the `amount` added to the recipient', () => {
    expect(
      transaction?.outputs.find((output) => output.address === recipientAddress)?.amount,
    ).toEqual(amount);
  });

  describe('transacting with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = 50000;
      transaction = Transaction.newTransaction(wallet, recipientAddress, amount);
    });

    test('it does not create the transaction', () => {
      expect(transaction).toEqual(undefined);
    });
  });
});
