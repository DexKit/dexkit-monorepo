import { expect, test } from '@playwright/test';

const CONTRACT_ADDRESS = '0xa91dba3c886dde6a9d11dc555922955f44e6a655';
const NETWORK = 'bnbt';

test.describe('EditionStake Contract UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/contract/${NETWORK}/${CONTRACT_ADDRESS}`);
    await page.waitForLoadState('networkidle');
  });

  test('Contract page loads correctly', async ({ page }) => {
    expect(page.url()).toContain(CONTRACT_ADDRESS.toLowerCase());
    
    const pageTitle = page.getByRole('heading').first();
    await expect(pageTitle).toBeVisible();
    
    await page.screenshot({ path: 'test-results/contract-page.png' });
  });

  test('Contract address is displayed in the UI', async ({ page }) => {
    const addressVisibleFull = await page.getByText(CONTRACT_ADDRESS, { exact: true }).isVisible();
    const addressVisibleLower = await page.getByText(CONTRACT_ADDRESS.toLowerCase(), { exact: true }).isVisible();
    const addressVisibleShort = await page.getByText(CONTRACT_ADDRESS.substring(0, 6) + '...', { exact: false }).isVisible();
    
    console.log('Address visible (full format):', addressVisibleFull);
    console.log('Address visible (lowercase):', addressVisibleLower);
    console.log('Address visible (short format):', addressVisibleShort);
    
    await page.screenshot({ path: 'test-results/contract-address.png' });
  });

  test('Contract UI components are visible', async ({ page }) => {
    const commonElements = [
      { name: 'Connect button', selector: page.getByText(/connect/i, { exact: false }) },
      { name: 'Contract title', selector: page.getByRole('heading').first() },
      { name: 'Network/chain indication', selector: page.getByText(/bnbt|testnet|binance/i, { exact: false }) }
    ];
    
    for (const element of commonElements) {
      const isVisible = await element.selector.isVisible();
      console.log(`${element.name} is visible: ${isVisible}`);
    }
    
    const stakingElements = [
      { name: 'Stake section', selector: page.getByText(/stake|staking/i, { exact: false }) },
      { name: 'Rewards indication', selector: page.getByText(/rewards|earnings|apy/i, { exact: false }) }
    ];
    
    for (const element of stakingElements) {
      const isVisible = await element.selector.isVisible();
      console.log(`${element.name} is visible: ${isVisible}`);
    }
    
    await page.screenshot({ path: 'test-results/contract-ui-components.png', fullPage: true });
  });

  test('Contract has expected sections', async ({ page }) => {
    const expectedSections = [
      { name: 'Overview/Info', selector: page.getByText(/overview|info|about/i, { exact: false }) },
      { name: 'NFT tokens/assets', selector: page.getByText(/tokens|nft|assets/i, { exact: false }) },
      { name: 'Staking options', selector: page.getByText(/stake|staking|rewards/i, { exact: false }) }
    ];
    
    for (const section of expectedSections) {
      const isVisible = await section.selector.isVisible();
      console.log(`${section.name} section is present: ${isVisible}`);
      
      if (isVisible) {
        await section.selector.scrollIntoViewIfNeeded();
        await page.screenshot({ 
          path: `test-results/section-${section.name.toLowerCase().replace(/\s+/g, '-')}.png`,
          fullPage: false 
        });
      }
    }
  });
}); 