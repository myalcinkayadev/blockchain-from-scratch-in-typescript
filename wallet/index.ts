import { ChainUtil, EC } from '../util';
import { INITIAL_BALANCE } from '../config';

class Wallet {
  public balance: number;
  private keyPair: EC.KeyPair;
  public publicKey: string;

  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex', false);
  }

  toString() {
    return `Wallet -
      publicKey : ${this.publicKey.toString()}
      balance   : ${this.balance}`;
  }
}

export { Wallet };
