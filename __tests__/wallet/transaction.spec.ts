import { Wallet } from 'wallet';
import { Transaction } from 'wallet/transaction';

describe('Transaction', () => {
  let transaction: Transaction, wallet: Wallet, recipientAddress: string, amount: number;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipientAddress = 'r3c1p13n7';
    const transactionResult = Transaction.newTransaction(wallet, recipientAddress, amount);
    if (transactionResult.isRight()) transaction = transactionResult.value;
  });

  test('it outputs the `amount` subtracted from the wallet balance', () => {
    expect(
      transaction.outputs.find((output) => output.address === wallet.publicKey)?.amount,
    ).toEqual(wallet.balance - amount);
  });

  test('it outputs the `amount` added to the recipient', () => {
    expect(
      transaction.outputs.find((output) => output.address === recipientAddress)?.amount,
    ).toEqual(amount);
  });

  test('it inputs the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  test('it validates a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  test('it invalidates a corrupt transaction', () => {
    transaction.outputs[0].amount = 500000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  describe('transacting with an amount that exceeds the balance', () => {
    test('it does not create the transaction', () => {
      amount = 50000;
      const transactionResult = Transaction.newTransaction(wallet, recipientAddress, amount);
      expect(transactionResult.isLeft()).toBe(true);
    });
  });

  describe('and updating a transaction', () => {
    let nextAmount: number, nextRecipient: string;

    beforeEach(() => {
      nextAmount = 20;
      nextRecipient = 'next-address';
      const transactionResult = transaction.update(wallet, nextRecipient, nextAmount);
      if (transactionResult.isRight()) transaction = transactionResult.value;
    });

    test(`it subtracts the next amount from the sender's output`, () => {
      expect(
        transaction.outputs.find((output) => output.address === wallet.publicKey)?.amount,
      ).toEqual(wallet.balance - amount - nextAmount);
    });

    test('it outputs an amount for the next recipient', () => {
      expect(
        transaction.outputs.find((output) => output.address === nextRecipient)?.amount,
      ).toEqual(nextAmount);
    });
  });
});
