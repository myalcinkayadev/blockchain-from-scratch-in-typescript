import WebSocket from 'ws';
import { P2P_PORT } from '../config';
import { Blockchain } from 'blockchain';
import { log } from 'logger';

// in-memory peers
const peers: string[] = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PServer {
  private sockets: WebSocket[];

  constructor(private blockChain: Blockchain) {
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
      // if (!isBinary) {
      const data = JSON.parse(message.toString());
      // }
      this.blockChain.replaceChain(data);
    });
  }

  private sendChain(socket: WebSocket) {
    socket.send(JSON.stringify(this.blockChain.chain));
  }

  public syncChains() {
    this.sockets.forEach((socket) => this.sendChain(socket));
  }
}

export { P2PServer };
