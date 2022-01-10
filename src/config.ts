import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();

const { BLOCK_HASH_PRIVATE_KEY } = process.env;

assert(BLOCK_HASH_PRIVATE_KEY, 'BLOCK_HASH_PRIVATE_KEY is required!');

export { BLOCK_HASH_PRIVATE_KEY };
