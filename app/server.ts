import * as restify from 'restify';
import morgan from 'morgan';
import { HTTP_PORT } from '../config';
import { log } from '../logger';

import { Blockchain } from '../blockchain';

const server = restify.createServer();
const blockchain = new Blockchain();

server.use(morgan('common'));
server.use(restify.plugins.bodyParser());

server.get('/blocks', (_req, res) => {
  res.json(blockchain.chain);
});

server.post('/mine', (req, res, next) => {
  const { data } = req.body;
  blockchain.addBlock(data);
  // Todo Sync Chains
  res.redirect('/blocks', next);
});

server.listen(HTTP_PORT, () => log.info(`Blockchain API listening on ${HTTP_PORT}`));
