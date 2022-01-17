import WebSocket from 'ws';
import { P2P_PORT } from 'config';
import { Blockchain } from 'blockchain';
import { log } from 'logger';
import { Transaction } from 'wallet/transaction';
import { TransactionPool } from 'wallet/transaction-pool';

const peers: string[] = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS',
};

class P2PServer {
  // in-memory peers
  private sockets: WebSocket[];

  constructor(private blockChain: Blockchain, private transactionPool: TransactionPool) {
    this.sockets = [];
  }

  listen() {
    const server = new WebSocket.Server({ port: Number.parseInt(P2P_PORT ?? '5001') });
    server.on('connection', (socket) => this.connectSocket(socket));

    this.connectToPeers();

    log.info(`Listening for peer to peer connection on: ${P2P_PORT}`);
  }

  private connectToPeers() {
    peers.forEach((peer) => {
      const socket = new WebSocket(peer);

      socket.on('open', () => this.connectSocket(socket));
    });
  }

  private connectSocket(socket: WebSocket) {
    this.sockets.push(socket);
    log.info('Socket connected');

    this.messageHandler(socket);

    this.sendChain(socket);
  }

  private messageHandler(socket: WebSocket) {
    socket.on('message', (message) => {
      // TODO: In near future we will accept binary data to blockchain
      const data = JSON.parse(message.toString());
      switch (data.type) {
        case MESSAGE_TYPES.chain:
          this.blockChain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPool.clear();
          break;
      }
    });
  }

  private sendTransaction(socket: WebSocket, transaction: Transaction) {
    socket.send(JSON.stringify({ type: MESSAGE_TYPES.transaction, transaction }));
  }

  private sendChain(socket: WebSocket) {
    socket.send(JSON.stringify({ type: MESSAGE_TYPES.chain, chain: this.blockChain.chain }));
  }

  syncChains() {
    this.sockets.forEach((socket) => this.sendChain(socket));
  }

  broadcastTransaction(transaction: Transaction) {
    this.sockets.forEach((socket) => this.sendTransaction(socket, transaction));
  }

  broadcastClearTransactions() {
    this.sockets.forEach((socket) =>
      socket.send(
        JSON.stringify({
          type: MESSAGE_TYPES.clear_transactions,
        }),
      ),
    );
  }
}

export { P2PServer };
