const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const getEnvVar = (name, defaultValue = '') => {
  return process.env[name] || defaultValue;
};

const BRAVE_PATH = 'C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

/**
 * Launches a Brave browser with pre-configured MetaMask extension
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Object with browser, context and page
 */
async function launchBrowserWithMetaMask(options = {}) {
  const metamaskPath = options.metamaskPath || 
                       path.join(getEnvVar('HOME') || getEnvVar('USERPROFILE') || '.', 
                       '.metamask-extension');
  
  if (!fs.existsSync(metamaskPath)) {
    throw new Error(`MetaMask extension not found at ${metamaskPath}. 
      Please set the correct path using the metamaskPath option.`);
  }
  
  if (!fs.existsSync(BRAVE_PATH)) {
    throw new Error(`Brave Browser not found at ${BRAVE_PATH}. 
      Please make sure Brave is installed in the correct location.`);
  }
  
  const args = [
    `--disable-extensions-except=${metamaskPath}`,
    `--load-extension=${metamaskPath}`,
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ];
  
  const userDataDir = options.userDataDir || '';
  
  const browser = await chromium.launchPersistentContext(
    userDataDir, 
    {
      headless: false,
      executablePath: BRAVE_PATH,
      args: args,
      viewport: { width: 1280, height: 720 },
      ignoreDefaultArgs: ['--enable-automation']
    }
  );
  
  const page = await browser.newPage();
  
  console.log('Brave Browser launched with MetaMask extension');
  
  return { browser, page };
}

module.exports = { launchBrowserWithMetaMask }; 