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
# Clone the repo
git clone https://github.com/DexKit/dexkit-monorepo.git
cd dexkit-monorepo

# Install dependencies and build packages automatically
yarn install
# Note: The postinstall script will automatically build all required packages

# Alternative: Manual setup (if needed)
yarn setup
```

> **📝 Note**: After cloning, the `yarn install` command automatically builds all internal packages to prevent module resolution errors. This ensures all `@dexkit/*` packages are properly compiled and available.

### Environment Setup

```bash
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

## 🔧 Troubleshooting

### Module Resolution Issues
If you encounter errors like `Module not found: Can't resolve '@dexkit/dexappbuilder-render'`, it means the internal packages haven't been built. This is automatically handled by the postinstall script, but you can manually resolve it:

```bash
# Build all required packages
yarn build:packages

# Or build individual packages in dependency order
yarn workspace @dexkit/ui build
yarn workspace @dexkit/core build
yarn workspace @dexkit/unlock-widget build
yarn workspace @dexkit/darkblock-evm-widget build
yarn workspace @dexkit/dexappbuilder-render build
yarn workspace @dexkit/dexappbuilder-viewer build
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

## Support the Project

If you'd like to support the ongoing development of DexAppBuilder, consider making a donation through Giveth. Click the link below to contribute:

[Donate with Giveth](https://giveth.io/project/dexappbuilder-the-no-codelow-code-toolkit-of-dexkit)

Your contribution helps keep the project alive and continuously improve our tools. Thank you for your support!

<div align="center">
  Made with ❤️ by <a href="https://dexkit.com">DexKit</a>
</div>

