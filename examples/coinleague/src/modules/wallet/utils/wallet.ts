import { Wallet } from 'ethers';
import { HDNode } from 'ethers/lib/utils';

export class WalletManager {
  constructor(public mnemonic: string) {}

  generateEvmPrivateKey(index: number) {
    return HDNode.fromMnemonic(this.mnemonic).derivePath(
      `m/44'/60'/0'/0/${index}`
    ).privateKey;
  }

  saveToJson(password: string) {
    return Wallet.fromMnemonic(this.mnemonic).encrypt(password);
  }

  // this function is used only to store encrypted mnemonic.
  static async fromJson(jsonData: string, password: string) {
    const walletFromJson = await Wallet.fromEncryptedJson(jsonData, password);

    return new WalletManager(walletFromJson.mnemonic.phrase);
  }
}
