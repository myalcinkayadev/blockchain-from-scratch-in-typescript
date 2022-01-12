import * as restify from 'restify';
import morgan from 'morgan';
import { HTTP_PORT } from '../config';
import { Blockchain } from '../blockchain';
import { log } from '../logger';

const server = restify.createServer();
const blockchain = new Blockchain();

server.use(morgan('common'));
server.use(restify.plugins.bodyParser());
server.listen(HTTP_PORT, () => log.info(`Blockchain API listening on ${HTTP_PORT}`));
