import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();

const { HTTP_PORT, P2P_PORT, BLOCK_HASH_PRIVATE_KEY } = process.env;

assert(HTTP_PORT, 'HTTP_PORT is required!');
assert(P2P_PORT, 'P2P_PORT is required!');
assert(BLOCK_HASH_PRIVATE_KEY, 'BLOCK_HASH_PRIVATE_KEY is required!');

export { HTTP_PORT, P2P_PORT, BLOCK_HASH_PRIVATE_KEY };
