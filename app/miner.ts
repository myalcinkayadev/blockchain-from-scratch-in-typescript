// import { Blockchain } from 'blockchain';
// import { Wallet } from 'wallet';
// import { TransactionPool } from 'wallet/transaction-pool';
// import { P2PServer } from './p2p-server';

// Since the miner class ties blockchain and transaction pool together
class Miner {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {} // private p2pServer: P2PServer, // private wallet: Wallet, // private transactionPool: TransactionPool, // private blockChain: Blockchain,

  mine() {
    // get valid transaction from transaction pool
    // include a reward for the miner
    // create a block consisting of the valid transactions
    // syncronize the chains in the peer to peer server
    // clear the transaction pool
    // broadcast to every miner to clear their transaction pools
  }
}

export { Miner };
