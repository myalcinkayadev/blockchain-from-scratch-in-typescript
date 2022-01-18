import { Wallet } from 'wallet';
import { Transaction } from 'wallet/transaction';
import { TransactionPool } from 'wallet/transaction-pool';
import { Blockchain } from 'blockchain';
import { INITIAL_BALANCE } from 'config';

describe('Wallet', () => {
  let wallet: Wallet, transactionPool: TransactionPool, blockchain: Blockchain;

  beforeEach(() => {
    wallet = new Wallet();
    transactionPool = new TransactionPool();
    blockchain = new Blockchain();
  });

  describe('creating a transaction', () => {
    let transaction: Transaction, sendAmount: number, recipientAddress: string;

    beforeEach(() => {
      sendAmount = 50;
      recipientAddress = 'random-address';
      const transactionResult = wallet.createTransaction(
        recipientAddress,
        sendAmount,
        blockchain,
        transactionPool,
      );

      if (transactionResult.isRight()) transaction = transactionResult.value;
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipientAddress, sendAmount, blockchain, transactionPool);
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

    describe('calculating a balance', () => {
      let addBalance: number, repeatAdd: number, senderWallet: Wallet;

      beforeEach(() => {
        senderWallet = new Wallet();
        addBalance = 100;
        repeatAdd = 1;

        function repeatTransaction(repeatTime: number, addBalance: number, startRepeatTime = 0) {
          senderWallet.createTransaction(wallet.publicKey, addBalance, blockchain, transactionPool);
          startRepeatTime++;
          if (startRepeatTime < repeatTime) repeatTransaction(repeatTime, addBalance, repeatTime);
        }

        repeatTransaction(repeatAdd, addBalance);
        blockchain.addBlock(transactionPool.transactions);
      });

      // it('calculates the balance from blockchain transactions matching the recipient', () => {
      //   expect(wallet.calculateBalance(blockchain)).toEqual(
      //     INITIAL_BALANCE + addBalance * repeatAdd,
      //   );
      // });

      it('calculates the balance for blockchain transactions matching the sender', () => {
        expect(senderWallet.calculateBalance(blockchain)).toEqual(
          INITIAL_BALANCE - addBalance * repeatAdd,
        );
      });

      describe('and the recipient conducts a transaction', () => {
        let subtractBalance: number, recipientBalance: number;

        beforeEach(() => {
          transactionPool.clear();
          subtractBalance = 60;
          recipientBalance = wallet.calculateBalance(blockchain);
          wallet.createTransaction(
            senderWallet.publicKey,
            subtractBalance,
            blockchain,
            transactionPool,
          );
          blockchain.addBlock(transactionPool.transactions);
        });

        describe('and the sender sends another transaction to the recipient', () => {
          beforeEach(() => {
            transactionPool.clear();
            senderWallet.createTransaction(
              wallet.publicKey,
              addBalance,
              blockchain,
              transactionPool,
            );
            blockchain.addBlock(transactionPool.transactions);
          });

          it('calculate the recipient balance only using transactions since its most recent one', () => {
            expect(wallet.calculateBalance(blockchain)).toEqual(
              recipientBalance - subtractBalance + addBalance,
            );
          });
        });
      });
    });
  });
});
