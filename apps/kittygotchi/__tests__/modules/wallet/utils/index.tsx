import { WalletManager } from '@/modules/wallet/utils/wallet';
import { Wallet } from 'ethers';

const PASSWORD = '1234';

const walletManager = new WalletManager(
  'warm robot pony industry immune breeze page wish erode vendor either trick'
);

jest.setTimeout(20000);

describe('Wallet utils', () => {
  it('should generate wallet', async () => {
    const wallet = new Wallet(walletManager.generateEvmPrivateKey(0));
    const wallet2 = new Wallet(walletManager.generateEvmPrivateKey(1));

    expect(wallet.address).not.toBe(wallet2.address);
  });

  it('should save wallet to json', async () => {
    const data = await walletManager.saveToJson(PASSWORD);

    if (data) {
      expect(data).toBeTruthy();

      const walletManagerFromJson = await WalletManager.fromJson(
        data,
        PASSWORD
      );

      expect(walletManagerFromJson.mnemonic).toBeDefined();
    }
  });
});
