/**
 * Script to download and install MetaMask
 * This script should be customized according to team needs
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Create an interface for input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Safe access to environment variables defined in turbo.json
const getEnvVar = (name, defaultValue = '') => {
  return process.env[name] || defaultValue;
};

// Brave Browser path
const BRAVE_PATH = 'C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

/**
 * Main function
 */
async function main() {
  console.log('=== MetaMask Setup for E2E Tests with Brave Browser ===');
  console.log('This script will help you configure MetaMask for automated tests.');
  console.log();
  
  // Check if Brave Browser is installed
  const braveExists = fs.existsSync(BRAVE_PATH);
  if (!braveExists) {
    console.log('\n❌ Brave Browser not found at the expected location:');
    console.log(BRAVE_PATH);
    console.log('Please install Brave Browser first or update the path in this script.');
    process.exit(1);
  } else {
    console.log('✅ Brave Browser found at:', BRAVE_PATH);
  }
  
  // 1. Ask if they already have MetaMask installed
  const hasMetaMask = await askQuestion('Do you have MetaMask installed in Brave Browser? (y/n): ');
  
  if (hasMetaMask.toLowerCase() === 'y') {
    console.log('\n✅ Excellent. We will use your existing installation.');
  } else {
    console.log('\nYou need to install MetaMask first:');
    console.log('1. Open Brave Browser');
    console.log('2. Visit https://metamask.io/download/');
    console.log('3. Click "Install MetaMask for Brave"');
    console.log('4. Complete the installation process');
    console.log('\nOnce installed, run this script again.');
    process.exit(0);
  }
  
  // 2. Detect extensions path based on OS
  let extensionsPath = '';
  
  if (process.platform === 'win32') {
    // Brave Browser extension path on Windows
    extensionsPath = path.join(getEnvVar('LOCALAPPDATA'), 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default', 'Extensions');
    
    // If not found, try the Chrome path as fallback
    if (!fs.existsSync(extensionsPath)) {
      extensionsPath = path.join(getEnvVar('LOCALAPPDATA'), 'Google', 'Chrome', 'User Data', 'Default', 'Extensions');
    }
  } else if (process.platform === 'darwin') {
    // Brave Browser extension path on macOS
    extensionsPath = path.join(getEnvVar('HOME'), 'Library', 'Application Support', 'BraveSoftware', 'Brave-Browser', 'Default', 'Extensions');
    
    // If not found, try the Chrome path as fallback
    if (!fs.existsSync(extensionsPath)) {
      extensionsPath = path.join(getEnvVar('HOME'), 'Library', 'Application Support', 'Google', 'Chrome', 'Default', 'Extensions');
    }
  } else {
    // Brave Browser extension path on Linux
    extensionsPath = path.join(getEnvVar('HOME'), '.config', 'BraveSoftware', 'Brave-Browser', 'Default', 'Extensions');
    
    // If not found, try the Chrome path as fallback
    if (!fs.existsSync(extensionsPath)) {
      extensionsPath = path.join(getEnvVar('HOME'), '.config', 'google-chrome', 'Default', 'Extensions');
    }
  }
  
  console.log(`\nLooking for MetaMask in: ${extensionsPath}`);
  
  // 3. Find the MetaMask extension ID
  let metamaskPath = '';
  
  if (fs.existsSync(extensionsPath)) {
    // MetaMask folder - starts with 'nkbihfbeogaeaoehlefnkodbefgpgknn'
    const extensions = fs.readdirSync(extensionsPath);
    const metamaskId = extensions.find(ext => ext.startsWith('nkbihfbeo'));
    
    if (metamaskId) {
      const versions = fs.readdirSync(path.join(extensionsPath, metamaskId));
      const latestVersion = versions.sort().pop();
      metamaskPath = path.join(extensionsPath, metamaskId, latestVersion);
      
      console.log(`\n✅ MetaMask found at: ${metamaskPath}`);
    }
  }
  
  if (!metamaskPath) {
    console.log('\n❌ Could not automatically find MetaMask path.');
    metamaskPath = await askQuestion('Please enter the full path to the MetaMask extension folder: ');
  }
  
  // 4. Update dotenv or environment variables
  console.log('\nAdding MetaMask path to your configuration...');
  
  // Create or update .env.local file
  let envContent = '';
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }
  
  // Replace or add METAMASK_PATH
  if (envContent.includes('METAMASK_PATH=')) {
    envContent = envContent.replace(/METAMASK_PATH=.*$/m, `METAMASK_PATH="${metamaskPath.replace(/\\/g, '\\\\')}"` );
  } else {
    envContent += `\nMETAMASK_PATH="${metamaskPath.replace(/\\/g, '\\\\')}"\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  
  // 5. Create user data directory
  const userDataDir = path.join(process.cwd(), 'brave-data');
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
    console.log(`\n✅ User data directory created: ${userDataDir}`);
  }
  
  // 6. Final instructions
  console.log('\n=== Setup Complete ===');
  console.log('You can now run tests with a real wallet:');
  console.log('yarn test:e2e:wallet');
  console.log('\nRemember:');
  console.log('1. You need to have some test crypto in Binance Testnet');
  console.log('2. The MetaMask password should be configured in the contract-with-wallet.spec.js file');
  console.log('3. The first time you run the tests, you will need to manually configure the wallet');
  
  rl.close();
}

/**
 * Helper function to ask questions to the user
 */
function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

// Run the script
main().catch(console.error); 