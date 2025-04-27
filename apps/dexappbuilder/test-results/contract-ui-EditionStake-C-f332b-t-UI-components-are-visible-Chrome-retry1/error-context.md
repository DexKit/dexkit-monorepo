# Test info

- Name: EditionStake Contract UI Tests >> Contract UI components are visible
- Location: C:\Users\eliec\Desktop\dev\DexKit\master\apps\dexappbuilder\tests\e2e\contract-ui.spec.ts:33:3

# Error details

```
TimeoutError: page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/contract/bnbt/0xa91dba3c886dde6a9d11dc555922955f44e6a655", waiting until "load"

    at C:\Users\eliec\Desktop\dev\DexKit\master\apps\dexappbuilder\tests\e2e\contract-ui.spec.ts:8:16
```

# Test source

```ts
   1 | import { expect, test } from '@playwright/test';
   2 |
   3 | const CONTRACT_ADDRESS = '0xa91dba3c886dde6a9d11dc555922955f44e6a655';
   4 | const NETWORK = 'bnbt';
   5 |
   6 | test.describe('EditionStake Contract UI Tests', () => {
   7 |   test.beforeEach(async ({ page }) => {
>  8 |     await page.goto(`/contract/${NETWORK}/${CONTRACT_ADDRESS}`);
     |                ^ TimeoutError: page.goto: Timeout 30000ms exceeded.
   9 |     await page.waitForLoadState('networkidle');
  10 |   });
  11 |
  12 |   test('Contract page loads correctly', async ({ page }) => {
  13 |     expect(page.url()).toContain(CONTRACT_ADDRESS.toLowerCase());
  14 |     
  15 |     const pageTitle = page.getByRole('heading').first();
  16 |     await expect(pageTitle).toBeVisible();
  17 |     
  18 |     await page.screenshot({ path: 'test-results/contract-page.png' });
  19 |   });
  20 |
  21 |   test('Contract address is displayed in the UI', async ({ page }) => {
  22 |     const addressVisibleFull = await page.getByText(CONTRACT_ADDRESS, { exact: true }).isVisible();
  23 |     const addressVisibleLower = await page.getByText(CONTRACT_ADDRESS.toLowerCase(), { exact: true }).isVisible();
  24 |     const addressVisibleShort = await page.getByText(CONTRACT_ADDRESS.substring(0, 6) + '...', { exact: false }).isVisible();
  25 |     
  26 |     console.log('Address visible (full format):', addressVisibleFull);
  27 |     console.log('Address visible (lowercase):', addressVisibleLower);
  28 |     console.log('Address visible (short format):', addressVisibleShort);
  29 |     
  30 |     await page.screenshot({ path: 'test-results/contract-address.png' });
  31 |   });
  32 |
  33 |   test('Contract UI components are visible', async ({ page }) => {
  34 |     const commonElements = [
  35 |       { name: 'Connect button', selector: page.getByText(/connect/i, { exact: false }) },
  36 |       { name: 'Contract title', selector: page.getByRole('heading').first() },
  37 |       { name: 'Network/chain indication', selector: page.getByText(/bnbt|testnet|binance/i, { exact: false }) }
  38 |     ];
  39 |     
  40 |     for (const element of commonElements) {
  41 |       const isVisible = await element.selector.isVisible();
  42 |       console.log(`${element.name} is visible: ${isVisible}`);
  43 |     }
  44 |     
  45 |     const stakingElements = [
  46 |       { name: 'Stake section', selector: page.getByText(/stake|staking/i, { exact: false }) },
  47 |       { name: 'Rewards indication', selector: page.getByText(/rewards|earnings|apy/i, { exact: false }) }
  48 |     ];
  49 |     
  50 |     for (const element of stakingElements) {
  51 |       const isVisible = await element.selector.isVisible();
  52 |       console.log(`${element.name} is visible: ${isVisible}`);
  53 |     }
  54 |     
  55 |     await page.screenshot({ path: 'test-results/contract-ui-components.png', fullPage: true });
  56 |   });
  57 |
  58 |   test('Contract has expected sections', async ({ page }) => {
  59 |     const expectedSections = [
  60 |       { name: 'Overview/Info', selector: page.getByText(/overview|info|about/i, { exact: false }) },
  61 |       { name: 'NFT tokens/assets', selector: page.getByText(/tokens|nft|assets/i, { exact: false }) },
  62 |       { name: 'Staking options', selector: page.getByText(/stake|staking|rewards/i, { exact: false }) }
  63 |     ];
  64 |     
  65 |     for (const section of expectedSections) {
  66 |       const isVisible = await section.selector.isVisible();
  67 |       console.log(`${section.name} section is present: ${isVisible}`);
  68 |       
  69 |       if (isVisible) {
  70 |         await section.selector.scrollIntoViewIfNeeded();
  71 |         await page.screenshot({ 
  72 |           path: `test-results/section-${section.name.toLowerCase().replace(/\s+/g, '-')}.png`,
  73 |           fullPage: false 
  74 |         });
  75 |       }
  76 |     }
  77 |   });
  78 | }); 
```