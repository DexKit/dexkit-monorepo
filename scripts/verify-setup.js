#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Only check packages that actually need to be built (have TypeScript compilation)
const packagesToCheck = [
  '@dexkit/unlock-widget',
  '@dexkit/darkblock-evm-widget',
  '@dexkit/dexappbuilder-render'
];

const packagePaths = {
  '@dexkit/unlock-widget': 'packages/dexkit-unlock',
  '@dexkit/darkblock-evm-widget': 'packages/dexkit-darkblock',
  '@dexkit/dexappbuilder-render': 'packages/dexappbuilder-render'
};

// Check if packages that don't need building exist
const sourcePackages = [
  { name: '@dexkit/ui', path: 'packages/dexkit-ui' },
  { name: '@dexkit/core', path: 'packages/dexkit-core' },
  { name: '@dexkit/dexappbuilder-viewer', path: 'packages/dexappbuilder-viewer' }
];

console.log('🔍 Verifying DexKit monorepo setup...\n');

let allGood = true;

// Check source packages (no build required)
console.log('📁 Source packages (no build required):');
for (const pkg of sourcePackages) {
  if (fs.existsSync(path.join(pkg.path, 'package.json'))) {
    console.log(`✅ ${pkg.name} - Available`);
  } else {
    console.log(`❌ ${pkg.name} - Missing`);
    allGood = false;
  }
}

console.log('\n🔨 Built packages (require compilation):');
// Check packages that need to be built
for (const pkg of packagesToCheck) {
  const pkgPath = packagePaths[pkg];
  const distPath = path.join(pkgPath, 'dist');

  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    if (files.length > 0) {
      console.log(`✅ ${pkg} - Built successfully`);
    } else {
      console.log(`❌ ${pkg} - Dist folder is empty`);
      allGood = false;
    }
  } else {
    console.log(`❌ ${pkg} - Not built (missing dist folder)`);
    allGood = false;
  }
}

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 All packages are properly set up! You\'re ready to develop.');
  console.log('\nNext steps:');
  console.log('1. Set up environment variables (check README.md)');
  console.log('2. Run your desired app:');
  console.log('   - yarn dev:whitelabel (DexAppBuilder)');
  console.log('   - yarn dev:coinleague (Coin League)');
  console.log('   - yarn dev:wallet-example (Wallet Example)');
} else {
  console.log('⚠️  Some packages need to be built. Run the following to fix:');
  console.log('   yarn build:packages');
  console.log('\nOr run individual builds for packages that need it:');
  console.log('   yarn workspace @dexkit/unlock-widget build');
  console.log('   yarn workspace @dexkit/darkblock-evm-widget build');
  console.log('   yarn workspace @dexkit/dexappbuilder-render build');
  process.exit(1);
}