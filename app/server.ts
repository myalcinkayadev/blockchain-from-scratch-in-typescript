import * as restify from 'restify';
import { P2PServer } from './p2p-server';
import morgan from 'morgan';
import { HTTP_PORT } from '../config';
import { log } from '../logger';

import { Blockchain } from '../blockchain';

const blockchain = new Blockchain();
const server = restify.createServer();
const p2pServer = new P2PServer(blockchain);

server.use(morgan('common'));
server.use(restify.plugins.bodyParser());

server.get('/blocks', (_req, res) => {
  res.json(blockchain.chain);
});

server.post('/mine', (req, res, next) => {
  const { data } = req.body;
  blockchain.addBlock(data);
  p2pServer.syncChains();
  res.redirect('/blocks', next);
});

server.listen(HTTP_PORT, () => log.info(`Blockchain API listening on ${HTTP_PORT}`));
p2pServer.listen();
