# E2E Testing for DexAppBuilder & DexGenerator

This directory contains end-to-end (E2E) tests for our Web3 platforms, DexAppBuilder and DexGenerator

## Testing Strategy

```text
tests/
├── e2e/            # E2E Tests
│   ├── stake.spec.ts        # Tests for verifying reward claims
│   ├── stake-nft.spec.ts    # Tests for verifying NFT staking/unstaking
│   └── contract-with-wallet.spec.js # Tests using real wallet with Brave Browser
└── README.md       # This file
```

Due to the nature of Web3 applications and the limitations of automation tools, our testing strategy is divided into two parts:

### 1. Automated Testing (Without Wallet)

These tests focus on verifying UI aspects and workflows that do not require actual wallet interaction:

- **Files**: `contract-ui.spec.ts`, `stake.spec.ts`, `stake-nft.spec.ts`
- **Focus**: Verification of UI elements, correct page loading, contract structure
- **Run**: `yarn test:e2e:ui` or `yarn test:e2e`

### 2. Automated Testing (With Real Wallet)

For interactions that require a real wallet connection:

- **Files**: `contract-with-wallet.spec.js`
- **How it works**: This test launches Brave Browser with the MetaMask extension installed
- **Run**: `yarn test:e2e:wallet`

## Setup Instructions

1. **Brave Browser & MetaMask Setup**:
   - Ensure Brave Browser is installed at `C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe`
   - Install MetaMask extension in Brave Browser
   - Run `yarn test:e2e:setup-metamask` to configure MetaMask paths
   - Edit the `METAMASK_PASSWORD` constant in `contract-with-wallet.spec.js` 
   - Set up Binance Smart Chain Testnet in MetaMask with these parameters:
     - Network Name: `BSC Testnet`
     - RPC URL: `https://data-seed-prebsc-1-s1.binance.org:8545/`
     - Chain ID: `97`
     - Currency Symbol: `BNB`
     - Block Explorer URL: `https://testnet.bscscan.com`
   - Obtain testnet BNB from a faucet for testing

2. **Start Development Server**:
   ```bash
   yarn dev:whitelabel
   ```

## Execution Commands

```bash
# Run UI tests (without wallet)
yarn test:e2e:ui

# Run tests with a real wallet
yarn test:e2e:wallet

# Update visual snapshots
yarn test:e2e:visual

# View test reports
yarn test:e2e:report
```

## How Real Wallet Tests Work

Our wallet-enabled tests:

1. Launch Brave Browser with MetaMask extension pre-installed
2. Initialize MetaMask and unlock it automatically using your password
3. Use the BSC Testnet network (which must be configured manually first)
4. Navigate to the contract page
5. Connect to the wallet using MetaMask
6. Verify contract data is displayed correctly
7. Capture screenshots as evidence

## Troubleshooting

If you encounter errors:

1. **MetaMask path not found**: Run `yarn test:e2e:setup-metamask` to set up the correct path
2. **Connection issues**: Make sure your development server is running
3. **Password errors**: Verify the `METAMASK_PASSWORD` in `contract-with-wallet.spec.js`
4. **Network errors**: Make sure BSC Testnet is configured in MetaMask before running tests
5. **Extension not working**: Install MetaMask in Brave Browser and run setup again

## Known Limitations

- **Manual Network Setup Required**: You must manually add BSC Testnet to MetaMask before running tests
- **ThirdWeb Connector**: Our project uses the ThirdWeb connector which may require adjustments as it evolves
- **UI Changes**: If the UI changes, test selectors may need to be updated

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [ThirdWeb Documentation](https://portal.thirdweb.com/)
- [Brave Browser](https://brave.com/) 