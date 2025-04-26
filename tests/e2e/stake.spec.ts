import { expect, test } from '@playwright/test';
import { WalletMock } from './utils/wallet-mock';

const CONTRACT_ADDRESS = '0xa91dba3c886dde6a9d11dc555922955f44e6a655';
const NETWORK = 'bnbt';

test.describe('Edition Stake Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('User can connect their wallet', async ({ page }) => {
    const wallet = new WalletMock(page);
    
    await page.getByRole('button', { name: /connect/i }).click();
    
    await wallet.connect();
    
    const addressElement = await page.getByText(/0x[a-fA-F0-9]{6}/).first();
    await expect(addressElement).toBeVisible();
  });

  test('User can verify connection to Binance Chain Testnet', async ({ page }) => {
    const wallet = new WalletMock(page);
    
    await page.getByRole('button', { name: /connect/i }).click();
    await wallet.connect('0x61'); // 0x61 = Binance Testnet
    
    await page.waitForTimeout(1000);
    
    const networkIndicator = page.getByText(/testnet|bsc testnet|binance/i, { exact: false }).first();
    await expect(networkIndicator).toBeVisible();
    
    const chainId = await page.evaluate(() => {
      return (window as any).ethereum?.chainId || null;
    });
    expect(chainId).toBe('0x61');
  });

  test('User can view the stake page', async ({ page }) => {
    const wallet = new WalletMock(page);

    await page.getByRole('button', { name: /connect/i }).click();
    await wallet.connect();

    await page.goto(`/contract/${NETWORK}/${CONTRACT_ADDRESS}`);
    
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByText(/stake/i)).toBeVisible();
  });

  test('User can claim rewards', async ({ page }) => {
    const wallet = new WalletMock(page);

    await page.getByRole('button', { name: /connect/i }).click();
    await wallet.connect();

    await page.goto(`/contract/${NETWORK}/${CONTRACT_ADDRESS}`);
    
    await page.waitForLoadState('networkidle');
    
    const claimButton = page.getByRole('button', { name: /claim/i });
    if (await claimButton.isVisible()) {
      await claimButton.click();
      
      await wallet.confirmTransaction();
      
      await expect(page.getByText(/claimed|success/i)).toBeVisible({ timeout: 30000 });
    } else {
      console.log('No rewards available to claim');
    }
  });
}); 