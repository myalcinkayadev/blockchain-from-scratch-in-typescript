import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { P2PServer } from './p2p-server';
import { HTTP_PORT } from 'config';

import { Blockchain } from 'blockchain';
import { Wallet } from 'wallet';
import { TransactionPool } from 'wallet/transaction-pool';

const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
  logger: true,
});
const p2pServer = new P2PServer(blockchain);

server.get('/blocks', (_request, reply) => {
  reply.send(blockchain.chain);
});

type MineRequestBody = {
  data: string;
};

server.post<{ Body: MineRequestBody }>('/mine', (request, reply) => {
  const { data } = request.body;
  blockchain.addBlock(data);
  p2pServer.syncChains();
  reply.redirect('/blocks');
});

server.get('/transactions', (_request, reply) => {
  reply.send(transactionPool.transactions);
});

type TransactRequestBody = {
  recipientAddress: string;
  amount: number;
};

server.post<{ Body: TransactRequestBody }>('/transact', (request, reply) => {
  const { recipientAddress, amount } = request.body;
  wallet.createTransaction(recipientAddress, amount, transactionPool);
  reply.redirect('/transactions');
});

const fatal = (err: unknown) => {
  server.log.error(err);
  process.exit(1);
};

server.listen(HTTP_PORT ?? 3001, '0.0.0.0').catch(fatal);
p2pServer.listen();
