const { expect } = require('@playwright/test');
const { launchBrowserWithMetaMask } = require('./setup/browser-with-metamask');
const { MetaMaskHelper } = require('./setup/metamask-helper');

// Configuration
const CONTRACT_ADDRESS = '0xa91dba3c886dde6a9d11dc555922955f44e6a655';
const NETWORK = 'bnbt';
const METAMASK_PASSWORD = 'Hola1234!';

// Safe access to environment variables defined in turbo.json
const getEnvVar = (name, defaultValue = '') => {
  return process.env[name] || defaultValue;
};

/**
 * Main test function
 * This should be run as an independent script, not with the standard test:e2e command
 */
async function runTest() {
  console.log('Starting test with real wallet using Brave Browser...');
  
  // Read .env.local file to get METAMASK_PATH
  const fs = require('fs');
  const path = require('path');
  const dotenvPath = path.join(process.cwd(), '.env.local');
  let metamaskPath = '';
  
  if (fs.existsSync(dotenvPath)) {
    const envContent = fs.readFileSync(dotenvPath, 'utf-8');
    const match = envContent.match(/METAMASK_PATH="([^"]*)"/);
    if (match && match[1]) {
      metamaskPath = match[1].replace(/\\\\/g, '\\');
      console.log(`Using MetaMask from path in .env.local: ${metamaskPath}`);
    }
  }
  
  if (!metamaskPath) {
    metamaskPath = getEnvVar('METAMASK_PATH');
    console.log(`Using MetaMask from environment variable: ${metamaskPath}`);
  }
  
  if (!metamaskPath) {
    console.error('❌ METAMASK_PATH not found. Run "yarn test:e2e:setup-metamask" first');
    process.exit(1);
  }
  
  const { browser, page } = await launchBrowserWithMetaMask({
    metamaskPath: metamaskPath,
    userDataDir: './brave-data'
  });
  
  try {
    const metamask = new MetaMaskHelper(browser, page);
    await metamask.initialize();
    await metamask.unlock(METAMASK_PASSWORD);
    
    // Note: We skip automatic network switching as it requires manual configuration
    console.log('✅ MetaMask unlocked. Make sure BSC Testnet is already configured and selected.');
    
    await page.goto(`http://localhost:3000/contract/${NETWORK}/${CONTRACT_ADDRESS}`);
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Contract page loaded');
    
    await page.getByRole('button', { name: /connect/i }).click();
    
    const metamaskOption = page.getByText(/metamask/i);
    if (await metamaskOption.isVisible({ timeout: 5000 }).catch(() => false)) {
      await metamaskOption.click();
    }
    
    await page.waitForTimeout(2000);
    
    await metamask.connectToSite();
    
    console.log('✅ Wallet connected to site');
    
    const addressElement = await page.getByText(/0x[a-fA-F0-9]{6,}/i).first();
    
    await page.screenshot({ path: 'test-results/connected-wallet.png', fullPage: true });
    
    console.log('Verifying contract data with connected wallet...');
    
    const elements = [
      { name: 'Wallet address', selector: page.getByText(/0x[a-fA-F0-9]{6,}/i).first() },
      { name: 'Contract name', selector: page.getByRole('heading').first() },
      { name: 'Stake section', selector: page.getByText(/stake|staking/i, { exact: false }) }
    ];
    
    for (const element of elements) {
      const isVisible = await element.selector.isVisible({ timeout: 5000 }).catch(() => false);
      console.log(`${element.name} is visible: ${isVisible ? '✅' : '❌'}`);
      
      if (isVisible) {
        await element.selector.scrollIntoViewIfNeeded();
        await page.screenshot({ 
          path: `test-results/${element.name.toLowerCase().replace(/\s+/g, '-')}.png` 
        });
      }
    }
    
    // Try to interact with contract for staking (optional)
    const stakeButton = page.getByRole('button', { name: /stake|select/i }).first();
    
    if (await stakeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Attempting to stake...');
      
      await stakeButton.click();
      await page.waitForTimeout(2000);
      
      // Perform additional stake-specific actions
      
      // Confirm transaction if it appears
      const confirmButton = page.getByRole('button', { name: /confirm|proceed/i });
      if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await confirmButton.click();
        await metamask.confirmTransaction();
        console.log('✅ Stake transaction confirmed');
      }
    }
    
    console.log('Test completed successfully');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
    // Capture screenshot in case of error
    await page.screenshot({ path: 'test-results/error-state.png' });
    throw error;
  } finally {
    // Close browser when finished
    console.log('Finishing test...');
    await browser.close();
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  runTest().catch(console.error);
}

module.exports = { runTest }; 