const { expect } = require('@playwright/test');

/**
 * Class for interacting with MetaMask during tests in Brave Browser
 */
class MetaMaskHelper {
  constructor(browser, page) {
    this.browser = browser;
    this.page = page;
    this.metamaskPage = null;
    this.extensionId = null;
  }

  /**
   * Initialize connection with MetaMask
   */
  async initialize() {
    try {
      // Get the MetaMask extension
      const extensionsPage = await this.browser.newPage();
      
      // Try to access the extensions page in Brave
      await extensionsPage.goto('brave://extensions/');
      
      // Find the MetaMask extension and get its ID
      const metamaskId = await extensionsPage.evaluate(() => {
        try {
          const extensions = document.querySelectorAll('extensions-item');
          for (const extension of extensions) {
            const name = extension.querySelector('#name');
            if (name && name.textContent.includes('MetaMask')) {
              return extension.querySelector('#extension-id').textContent;
            }
          }
        } catch (e) {
          console.error('Error finding MetaMask:', e);
        }
        return null;
      });
      
      // If not found in brave://extensions, try chrome://extensions
      if (!metamaskId) {
        await extensionsPage.goto('chrome://extensions/');
        
        const chromeMetamaskId = await extensionsPage.evaluate(() => {
          try {
            const extensions = document.querySelectorAll('extensions-item');
            for (const extension of extensions) {
              const name = extension.querySelector('#name');
              if (name && name.textContent.includes('MetaMask')) {
                return extension.querySelector('#extension-id').textContent;
              }
            }
          } catch (e) {
            console.error('Error finding MetaMask:', e);
          }
          return null;
        });
        
        if (chromeMetamaskId) {
          this.extensionId = chromeMetamaskId;
        }
      } else {
        this.extensionId = metamaskId;
      }
      
      await extensionsPage.close();
      
      if (!this.extensionId) {
        this.extensionId = 'nkbihfbeogaeaoehlefnkodbefgpgknn';
        console.log('Using default MetaMask extension ID:', this.extensionId);
      }
      
      this.metamaskPage = await this.browser.newPage();
      await this.metamaskPage.goto(`chrome-extension://${this.extensionId}/home.html`);
      
      console.log('MetaMask initialized in Brave Browser with extension ID:', this.extensionId);
      
      return this;
    } catch (error) {
      console.error('Failed to initialize MetaMask:', error);
      throw error;
    }
  }

  /**
   * Unlock MetaMask with a password
   * @param {string} password - MetaMask password
   */
  async unlock(password) {
    if (!this.metamaskPage) throw new Error('MetaMask not initialized');
    
    const isLocked = await this.metamaskPage.getByText('Welcome Back!').isVisible().catch(() => false);
    
    if (isLocked) {
      await this.metamaskPage.getByPlaceholder('Password').fill(password);
      await this.metamaskPage.getByRole('button', { name: 'Unlock' }).click();
      await this.metamaskPage.waitForTimeout(1000);
    }
    
    console.log('MetaMask unlocked in Brave Browser');
  }

  /**
   * Switch to BSC Testnet (Binance Smart Chain Testnet)
   */
  async switchToBSCTestnet() {
    if (!this.metamaskPage) throw new Error('MetaMask not initialized');
    
    // Click on the network selector
    const networkSwitcher = this.metamaskPage.locator('.network-display');
    await networkSwitcher.click();
    
    // Look for BSC Testnet in the list
    const bscOption = this.metamaskPage.getByText('Binance Smart Chain Testnet');
    const bscExists = await bscOption.isVisible().catch(() => false);
    
    if (bscExists) {
      await bscOption.click();
      console.log('Switched to BSC Testnet in Brave Browser');
    } else {
      // If it doesn't exist, add the network
      await this.metamaskPage.getByText('Add network').click();
      
      // Add BSC Testnet
      // These steps may vary depending on the MetaMask version
      await this.metamaskPage.getByText('Add a network manually').click();
      
      // Fill in the fields
      await this.metamaskPage.getByLabel('Network Name').fill('BSC Testnet');
      await this.metamaskPage.getByLabel('New RPC URL').fill('https://data-seed-prebsc-1-s1.binance.org:8545/');
      await this.metamaskPage.getByLabel('Chain ID').fill('97');
      await this.metamaskPage.getByLabel('Currency Symbol').fill('BNB');
      await this.metamaskPage.getByLabel('Block Explorer URL').fill('https://testnet.bscscan.com');
      
      // Save
      await this.metamaskPage.getByRole('button', { name: 'Save' }).click();
      
      console.log('Added and switched to BSC Testnet in Brave Browser');
    }
    
    await this.metamaskPage.waitForTimeout(1000);
  }

  /**
   * Connect MetaMask to a site
   */
  async connectToSite() {
    if (!this.metamaskPage) throw new Error('MetaMask not initialized');
    
    // Wait for the connection request to appear
    // (this will happen after the web page requests the connection)
    try {
      await this.metamaskPage.waitForSelector('[data-testid="page-container-footer-next"]', { timeout: 10000 });
      await this.metamaskPage.getByTestId('page-container-footer-next').click();
      
      // In some versions there might be a second button
      const connectButton = this.metamaskPage.getByRole('button', { name: 'Connect' });
      if (await connectButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await connectButton.click();
      }
      
      console.log('MetaMask connected to site from Brave Browser');
    } catch (error) {
      console.error('Failed to connect MetaMask from Brave Browser:', error.message);
      throw error;
    }
    
    // Return to the main page
    await this.page.bringToFront();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Confirm a transaction
   */
  async confirmTransaction() {
    if (!this.metamaskPage) throw new Error('MetaMask not initialized');
    
    try {
      // Bring the MetaMask window to the front
      await this.metamaskPage.bringToFront();
      
      // Wait for the transaction request to appear
      await this.metamaskPage.waitForSelector('[data-testid="page-container-footer-next"]', { timeout: 30000 });
      
      // Increase gas fee if necessary (optional)
      const editButton = this.metamaskPage.getByText('Edit');
      if (await editButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await editButton.click();
        await this.metamaskPage.getByText('Save').click();
      }
      
      // Confirm the transaction
      await this.metamaskPage.getByTestId('page-container-footer-next').click();
      
      console.log('Transaction confirmed in Brave Browser');
      
      // Return to the main page
      await this.page.bringToFront();
      await this.page.waitForTimeout(2000);
    } catch (error) {
      console.error('Failed to confirm transaction in Brave Browser:', error.message);
      throw error;
    }
  }
}

module.exports = { MetaMaskHelper }; 