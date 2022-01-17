import { Blockchain } from 'blockchain';
import { Wallet } from 'wallet';
import { Transaction } from 'wallet/transaction';
import { TransactionPool } from 'wallet/transaction-pool';
import { P2PServer } from './p2p-server';

class Miner {
  constructor(
    private blockchain: Blockchain,
    private transactionPool: TransactionPool,
    private wallet: Wallet,
    private p2pServer: P2PServer,
  ) {}
  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
    const block = this.blockchain.addBlock(validTransactions);
    this.p2pServer.syncChains();
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

export { Miner };
