import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();

const { HTTP_PORT, P2P_PORT, BLOCK_HASH_PRIVATE_KEY, GENESIS_BLOCK_HEADERS_DIFFICULTY } =
  process.env;

assert(HTTP_PORT, 'HTTP_PORT is required!');
assert(P2P_PORT, 'P2P_PORT is required!');
assert(BLOCK_HASH_PRIVATE_KEY, 'BLOCK_HASH_PRIVATE_KEY is required!');

const GENESIS_DATA = {
  blockHeaders: {
    difficulty: Number.parseInt(GENESIS_BLOCK_HEADERS_DIFFICULTY ?? '1'),
  },
};

const MILLISECONDS = 1;
const SECONDS = 1000 * MILLISECONDS;
const MINE_RATE = 3 * SECONDS;
const INITIAL_BALANCE = 500;
const MINING_REWARD = 50;

export {
  GENESIS_DATA,
  MINE_RATE,
  INITIAL_BALANCE,
  MINING_REWARD,
  HTTP_PORT,
  P2P_PORT,
  BLOCK_HASH_PRIVATE_KEY,
};
