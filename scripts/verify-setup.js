// Node.js verification script

/**
 * Verification script to ensure the monorepo is set up correctly
 */

const fs = require('fs');
const path = require('path');

function verifyPackageExists(packagePath, packageName) {
  const fullPath = path.resolve(__dirname, '..', packagePath);
  const packageJsonPath = path.join(fullPath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error(`❌ ${packageName} package.json not found at ${packageJsonPath}`);
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`✅ ${packageName} (v${packageJson.version}) found`);
  return true;
}

function verifyReactVersions() {
  console.log('\n📦 Verifying React versions...');
  
  const rootPackageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8')
  );
  
  const appPackageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '..', 'apps', 'dexappbuilder', 'package.json'), 'utf8')
  );
  
  const rootReactVersion = rootPackageJson.dependencies?.react;
  const appReactVersion = appPackageJson.dependencies?.react;
  
  if (rootReactVersion && appReactVersion && rootReactVersion === appReactVersion) {
    console.log(`✅ React versions match: ${rootReactVersion}`);
    return true;
  } else {
    console.error(`❌ React version mismatch: root=${rootReactVersion}, app=${appReactVersion}`);
    return false;
  }
}

function main() {
  console.log('🔍 Verifying DexAppBuilder v2 monorepo setup...\n');
  
  let allGood = true;
  
  // Verify packages exist
  const packages = [
    ['packages/dexkit-core', '@dexkit/core'],
    ['packages/dexkit-ui', '@dexkit/ui'],
    ['packages/dexkit-widgets', '@dexkit/widgets'],
    ['packages/dexappbuilder-viewer', '@dexkit/dexappbuilder-viewer'],
    ['packages/dexappbuilder-render', '@dexkit/dexappbuilder-render'],
    ['packages/dexkit-wallet-connectors', '@dexkit/wallet-connectors'],
    ['packages/web3forms', '@dexkit/web3forms'],
    ['packages/dexkit-exchange', '@dexkit/exchange'],
    ['packages/dexkit-darkblock', '@dexkit/darkblock-evm-widget'],
  ];
  
  packages.forEach(([path, name]) => {
    if (!verifyPackageExists(path, name)) {
      allGood = false;
    }
  });
  
  // Verify main app
  if (!verifyPackageExists('apps/dexappbuilder', 'DexAppBuilder')) {
    allGood = false;
  }
  
  // Verify React versions
  if (!verifyReactVersions()) {
    allGood = false;
  }
  
  // Verify Next.js version
  console.log('\n⚡ Verifying Next.js versions...');
  const appPackageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '..', 'apps', 'dexappbuilder', 'package.json'), 'utf8')
  );
  
  const nextVersion = appPackageJson.dependencies?.next;
  if (nextVersion && nextVersion.startsWith('15.')) {
    console.log(`✅ Next.js 15 found: ${nextVersion}`);
  } else {
    console.error(`❌ Next.js 15 not found, got: ${nextVersion}`);
    allGood = false;
  }
  
  // Check if turbo.json exists
  console.log('\n🏗️ Verifying Turbo configuration...');
  if (fs.existsSync(path.resolve(__dirname, '..', 'turbo.json'))) {
    console.log('✅ turbo.json found');
  } else {
    console.error('❌ turbo.json not found');
    allGood = false;
  }
  
  if (allGood) {
    console.log('\n🎉 All checks passed! The monorepo is set up correctly.');
    console.log('\n📝 Next steps:');
    console.log('1. Run `yarn install` to install dependencies');
    console.log('2. Run `yarn build:packages` to build core packages');
    console.log('3. Run `yarn dev:whitelabel` to start DexAppBuilder in development mode');
  } else {
    console.log('\n❌ Some checks failed. Please fix the issues above.');
    process.exit(1);
  }
}

main();
