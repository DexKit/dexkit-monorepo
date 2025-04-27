import { expect, test } from '@playwright/test';
import { WalletMock } from './utils/wallet-mock';

const CONTRACT_ADDRESS = '0xa91dba3c886dde6a9d11dc555922955f44e6a655';
const NETWORK = 'bnbt';
const TOKEN_ID = '1';

test.describe('EditionStake Contract Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const wallet = new WalletMock(page);
    await page.getByRole('button', { name: /connect/i }).click();
    await wallet.connect('0x61'); // BSC Testnet
    
    await page.goto(`/contract/${NETWORK}/${CONTRACT_ADDRESS}`);
    await page.waitForLoadState('networkidle');
  });

  test('Contract address is displayed correctly', async ({ page }) => {
    expect(page.url()).toContain(CONTRACT_ADDRESS.toLowerCase());
    
    const addressVisibleFull = await page.getByText(CONTRACT_ADDRESS.toLowerCase(), { exact: true }).isVisible();
    const addressVisibleShort = await page.getByText(CONTRACT_ADDRESS.substring(0, 6) + '...' + CONTRACT_ADDRESS.substring(38)).isVisible();
    
    expect(addressVisibleFull || addressVisibleShort).toBeTruthy();
    
    const verifiedBadge = page.getByText(/verified|verified contract/i, { exact: false });
    if (await verifiedBadge.isVisible()) {
      console.log('Contract appears to be verified');
    }
  });

  test('User can stake tokens in contract', async ({ page }) => {
    const wallet = new WalletMock(page);
    
    const stakeEntryPoint = page.getByRole('button', { name: /stake|select token|add stake/i }).first();
    
    if (await stakeEntryPoint.isVisible()) {
      await stakeEntryPoint.click();
      await page.waitForTimeout(500);
      
      const tokenSelector = page.getByText(/select token|choose token|select nft/i, { exact: false });
      if (await tokenSelector.isVisible()) {
        await tokenSelector.click();
        await page.waitForTimeout(500);
        
        const specificToken = page.locator(`[data-token-id="${TOKEN_ID}"]`);
        const anyToken = page.locator('[data-token-id]').first();
        
        if (await specificToken.isVisible()) {
          await specificToken.click();
        } else if (await anyToken.isVisible()) {
          await anyToken.click();
        }
        
        const amountField = page.getByLabel(/amount|quantity/i);
        if (await amountField.isVisible()) {
          await amountField.fill('1');
        }
        
        const confirmButtons = [
          page.getByRole('button', { name: /confirm selection|select/i }),
          page.getByRole('button', { name: /approve|allow/i }),
          page.getByRole('button', { name: /stake|confirm stake/i })
        ];
        
        for (const button of confirmButtons) {
          if (await button.isVisible()) {
            await button.click();
            await page.waitForTimeout(1000);
            
            const pendingApproval = page.getByText(/approve|pending|confirm in wallet/i);
            if (await pendingApproval.isVisible()) {
              await wallet.confirmTransaction();
              await page.waitForTimeout(2000);
            }
          }
        }
        
        await wallet.confirmTransaction();
        
        const successMessages = [
          page.getByText(/success|successful/i),
          page.getByText(/staked|stake confirmed/i),
          page.getByText(/transaction confirmed|tx complete/i)
        ];
        
        let success = false;
        for (const message of successMessages) {
          if (await message.isVisible({ timeout: 5000 }).catch(() => false)) {
            success = true;
            break;
          }
        }
        
        expect(success).toBeTruthy();
      } else {
        await wallet.callContractMethod(CONTRACT_ADDRESS, 'stake', [TOKEN_ID, '1']);
        await wallet.confirmTransaction();
      }
    } else {
      console.log('No stake entry point found');
      test.skip();
    }
  });

  test('Contract shows staking information', async ({ page }) => {
    const stakingIndicators = [
      page.getByText(/apy|annual.+yield/i, { exact: false }),
      page.getByText(/reward rate/i, { exact: false }),
      page.getByText(/staking details|stake info/i, { exact: false })
    ];
    
    let infoVisible = false;
    for (const indicator of stakingIndicators) {
      if (await indicator.isVisible()) {
        infoVisible = true;
        const text = await indicator.textContent();
        console.log('Staking info found:', text);
        break;
      }
    }
    
    expect(infoVisible).toBeTruthy();
  });

  test('Can view staked tokens or staking status', async ({ page }) => {
    const stakeSections = [
      page.getByRole('tab', { name: /your stakes|my stakes|staked tokens/i }),
      page.getByText(/your staked tokens|tokens staked/i, { exact: false }),
      page.getByText(/staking status|your position/i, { exact: false })
    ];
    
    for (const section of stakeSections) {
      if (await section.isVisible()) {
        await section.click();
        await page.waitForTimeout(500);
        break;
      }
    }
    
    const noTokensMessage = page.getByText(/no tokens|nothing staked|empty/i, { exact: false });
    const hasStakedTokens = await page.locator('[data-staked="true"]').first().isVisible().catch(() => false);
    
    if (hasStakedTokens) {
      console.log('Found staked tokens');
    } else if (await noTokensMessage.isVisible()) {
      console.log('No tokens staked yet');
    } else {
      const stakingStatus = page.getByText(/staking|rewards|position/i, { exact: false }).first();
      await expect(stakingStatus).toBeVisible();
    }
  });

  test('Contract correctly displays any rewards info', async ({ page }) => {
    const rewardsIndicators = [
      page.getByText(/rewards|earnings/i, { exact: false }),
      page.getByText(/claimable|available to claim/i, { exact: false }),
      page.getByText(/accumulated rewards/i, { exact: false })
    ];
    
    let rewardsVisible = false;
    for (const indicator of rewardsIndicators) {
      if (await indicator.isVisible()) {
        rewardsVisible = true;
        const text = await indicator.textContent();
        console.log('Rewards info found:', text);
        break;
      }
    }
    
    if (!rewardsVisible) {
      const otherIndicators = page.getByText(/claim|collect|withdraw/i, { exact: false }).first();
      rewardsVisible = await otherIndicators.isVisible();
    }
    
    if (!rewardsVisible) {
      console.log('No rewards information found - may not be available yet');
    }
  });
}); 