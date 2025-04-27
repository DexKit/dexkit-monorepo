# E2E Tests with Synpress for DexKit

This directory contains end-to-end (E2E) tests for DexKit products using Synpress, which integrates Playwright with Web3 interaction support.

## Structure

```text
tests/
├── e2e/            # E2E Tests
│   ├── stake.spec.ts        # Tests for verifying reward claims
│   ├── stake-nft.spec.ts    # Tests for verifying NFT staking/unstaking
│   └── contract-with-wallet.spec.js # Tests using real wallet in Brave Browser (Beta)
└── README.md       # This file
```

## Setup Before Running Tests

1. **Configure MetaMask with Brave Browser**:
   ```bash
   yarn test:e2e:setup-metamask
   ```
   This will find your MetaMask installation in Brave Browser and configure the necessary paths.

2. **Update MetaMask Password**:
   Edit `tests/e2e/contract-with-wallet.spec.js` and update the `METAMASK_PASSWORD` constant with your actual MetaMask password.

3. **Start Development Server**:
   ```bash
   yarn dev:whitelabel
   ```

## Running Tests

### Standard tests (with mock wallet)
These tests use a mock wallet and don't require MetaMask:

```bash
yarn test:e2e
```

### Test specific files
```bash
# Run a specific test by name
yarn test:e2e --grep="User can claim rewards"

# Run UI tests only
yarn test:e2e:ui
```

### Tests with real wallet (Beta)
These tests use Brave Browser with actual MetaMask extension:

```bash
yarn test:e2e:wallet
```

> **Note**: Real wallet tests are in beta. You may need to manually approve connection dialogs in MetaMask, and some automated interactions might not work due to UI changes. See the [E2E Testing Strategy](./e2e/README.md) for more details.

## Customizing Tests

Before running tests, make sure to update the following constants in the test files:

- `CONTRACT_ADDRESS`: The address of your staking contract
- `NETWORK`: The network where the contract is deployed (ethereum, polygon, etc.)
- `TOKEN_ID`: For NFT staking tests, set the token ID you want to test

## Writing New Tests

To create new tests, follow this pattern:

```typescript
import { test, expect } from '@playwright/test';
import { WalletMock } from './utils/wallet-mock';

test.describe('Test Group Name', () => {
  test('Test Name', async ({ page }) => {
    // Navigate to the relevant page
    await page.goto('/path-to-test');
    
    // Connect wallet if needed
    const wallet = new WalletMock(page);
    await wallet.connect();
    
    // Interact with UI
    await page.getByRole('button', { name: /button-text/i }).click();
    
    // For blockchain transactions
    await wallet.confirmTransaction();
    
    // Verify results
    await expect(page.getByText(/expected-message/i)).toBeVisible();
  });
});
```

## Debugging

To run tests in debug mode (with visible browser):

```bash
yarn test:e2e --debug
```

## Test Results

After running tests with real wallet, screenshots and test results are saved in the `test-results` directory. You can view full test reports with:

```bash
yarn test:e2e:report
```

## Known Limitations

- **Beta Status**: Real wallet tests are currently in beta and may require manual intervention
- **UI Sensitivity**: MetaMask changes its UI frequently, which may break the automation
- **Network Configuration**: You must manually add and select BSC Testnet in MetaMask
- **Connection Dialog**: You may need to manually approve connection requests

For more information, see the [official Synpress documentation](https://docs.synpress.io/) and the [detailed README in the e2e directory](./e2e/README.md). 