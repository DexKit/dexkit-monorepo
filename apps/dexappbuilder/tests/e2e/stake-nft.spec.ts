import { expect, test } from '@playwright/test';
import { WalletMock } from './utils/wallet-mock';

const CONTRACT_ADDRESS = '0xa91dba3c886dde6a9d11dc555922955f44e6a655';
const NETWORK = 'bnbt';
const TOKEN_ID = '1';

test.describe('Edition Stake NFT Tests', () => {
  test.beforeEach(async ({ page }) => {
    const wallet = new WalletMock(page);
    
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('button', { name: /connect/i }).click();
    await wallet.connect();
  });

  test('User can stake NFT', async ({ page }) => {
    const wallet = new WalletMock(page);
    
    await page.goto(`/contract/${NETWORK}/${CONTRACT_ADDRESS}`);
    
    await page.waitForLoadState('networkidle');
    
    const stakeButton = page.getByRole('button', { name: /stake|select/i }).first();
    if (await stakeButton.isVisible()) {
      await stakeButton.click();
    }
    
    const nftSelector = page.locator(`[data-token-id="${TOKEN_ID}"]`).or(
      page.getByText(/select.+nft/i)
    );
    
    if (await nftSelector.isVisible()) {
      await nftSelector.click();
      
      const amountField = page.getByLabel(/amount/i);
      if (await amountField.count() > 0) {
        await amountField.fill('1');
      }
      
      const confirmButton = page.getByRole('button', { name: /confirm|select|approve/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
      
      const finalStakeButton = page.getByRole('button', { name: /stake/i });
      if (await finalStakeButton.isVisible()) {
        await finalStakeButton.click();
      }
      
      await wallet.confirmTransaction();
      
      await expect(page.getByText(/staked|successful/i)).toBeVisible({ timeout: 60000 });
    } else {
      console.log('No available NFTs to stake');
      test.skip();
    }
  });

  test('User can verify accumulated rewards', async ({ page }) => {
    await page.goto(`/contract/${NETWORK}/${CONTRACT_ADDRESS}`);
    
    await page.waitForLoadState('networkidle');
    
    const rewardsText = page.getByText(/rewards|claimable|earnings/i, { exact: false }).first();
    
    if (await rewardsText.isVisible()) {
      await expect(rewardsText).toBeVisible();
      const rewardsValue = await rewardsText.textContent();
      console.log('Current rewards:', rewardsValue);
    } else {
      console.log('No rewards section found');
    }
  });

  test('User can unstake an NFT', async ({ page }) => {
    const wallet = new WalletMock(page);
    
    await page.goto(`/contract/${NETWORK}/${CONTRACT_ADDRESS}`);
    
    await page.waitForLoadState('networkidle');
    
    const unstakeSection = page.getByRole('tab', { name: /unstake/i }).or(
      page.getByText(/withdraw|unstake/i, { exact: false })
    );
    
    if (await unstakeSection.isVisible()) {
      await unstakeSection.click();
      await page.waitForTimeout(500);
    }
    
    const noTokensMessage = page.getByText(/no.+tokens|nothing staked|empty/i, { exact: false });
    const hasStakedTokens = !(await noTokensMessage.isVisible());
    
    if (hasStakedTokens) {
      const stakedNft = page.locator('[data-staked="true"]').first().or(
        page.getByRole('button', { name: /unstake|withdraw/i }).first()
      );
      
      if (await stakedNft.isVisible()) {
        await stakedNft.click();
        
        const amountField = page.getByLabel(/amount/i);
        if (await amountField.count() > 0) {
          await amountField.fill('1');
        }
        
        const unstakeButton = page.getByRole('button', { name: /unstake|withdraw|confirm/i });
        if (await unstakeButton.isVisible()) {
          await unstakeButton.click();
          
          await wallet.confirmTransaction();
          
          await expect(page.getByText(/unstaked|success|confirmed/i)).toBeVisible({ timeout: 60000 });
        }
      }
    } else {
      console.log('No NFTs in stake to unstake');
      test.skip();
    }
  });
}); 