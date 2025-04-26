<div align="center">
  <img src="apps/dexappbuilder/public/assets/dexappbuilder/DexAppBuilder-readme.png" alt="DexKit Logo" width="200"/>
  <h3>Web3 Innovation Hub: DApps Builder & Blockchain Gaming</h3>
  <em>Building the future of Web3, one block at a time</em>
</div>

## 📦 Projects

### [🛠️ DexAppBuilder](apps/dexappbuilder)
Create powerful Web3 applications without code. If you can click and drag, you can make a DApp! 🪄

#### Featured DApps built with DexAppBuilder:
- 🐮 [CyberCows](https://cybercows.dexkit.app/) - NFT Collection with Daily Rewards
- 🪙 [The Midas Touch](https://themidastouch.dexkit.app/) - Gold-Backed Tokens Platform
- 💱 [ScaleSwap](https://scaleswap.dexkit.app/) - Streamlined DEX
- 👹 [The Bestiary](https://thebestiary.dexkit.app/) - Lovecraftian NFT Collection

### [🎮 Coin League](apps/coinleague)
The ultimate blockchain price racing game. Compete in real-time races based on cryptocurrency price movements!

## 🚀 Getting Started

This monorepo uses Yarn as the preferred package manager.

```bash
# Clone the repository
git clone https://github.com/DexKit/dexkit-monorepo.git
cd dexkit-monorepo

# Install dependencies
yarn install

# Set up environment variables for DexAppBuilder
cp apps/dexappbuilder/.env.example apps/dexappbuilder/.env

# Set up environment variables for Coin League
cp apps/coinleague/.env.example apps/coinleague/.env
```

### Running Projects

#### DexAppBuilder:
```bash
cd apps/dexappbuilder
yarn dev
# Visit http://localhost:3000
```

#### Coin League:
```bash
cd apps/coinleague
yarn dev
# Visit http://localhost:3001
```

### General Guidelines:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📚 Documentation

- [DexAppBuilder Documentation](https://docs.dexkit.com/defi-products/dexappbuilder)
- [Coin League Documentation](https://docs.dexkit.com/gaming/predictions-hub/coin-league)

## 🔗 Links

- [Official Website](https://dexkit.com)
- [Documentation](https://docs.dexkit.com)
- [Blog](https://dexkit.com/blog)
- [Discord Community](https://discord.com/invite/dexkit-official-943552525217435649)
- [X / Twitter](https://x.com/intent/follow?screen_name=dexkit)
- [YouTube tutorials](https://www.youtube.com/@DexKit)

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">
  Made with ❤️ by <a href="https://dexkit.com">DexKit</a>
</div>

# E2E Testing with Brave Browser and MetaMask

This directory contains end-to-end (E2E) tests for our DexKit products, using Playwright for UI testing and Brave Browser with MetaMask for wallet interactions.

## Test Types

1. **Basic UI Tests** - Using Playwright to test UI elements and navigation
2. **Mock Wallet Tests** - Using a simulated wallet for testing contract interactions
3. **Real Wallet Tests (Beta)** - Using Brave Browser with MetaMask for real blockchain interactions

## Setting Up for Tests

Please see the detailed instructions in the following files:
- [General E2E Testing](/tests/README.md)
- [Specific Testing Strategy](/tests/e2e/README.md)

## Current Status

The real wallet testing with Brave Browser and MetaMask is currently in **beta** status:

- ✅ Detection of Brave Browser works
- ✅ Detection of MetaMask extension works
- ✅ Browser launches correctly with the extension
- ✅ MetaMask unlocking works
- ❌ Automatic network switching needs updates
- ❌ Connection dialog detection needs updates

## Manual Testing Procedure

While we continue to improve the automated tests, you can follow this manual procedure:

1. Run `yarn test:e2e:setup-metamask` to configure paths
2. Edit your MetaMask password in the test file
3. Start the development server with `yarn dev:whitelabel`
4. Set up BSC Testnet in your MetaMask manually
5. Run `yarn test:e2e:wallet` to launch the browser
6. When the test stops at the connection screen:
   - Manually approve the connection in MetaMask
   - Take note of what happens for future test improvements

## Contribution

If you would like to help improve these tests, please focus on:

1. Updating the MetaMask helper functions to match the current UI
2. Improving the wallet connection detection
3. Adding more robust error handling

For more information on running or developing tests, see the documentation in the `tests` directory.
