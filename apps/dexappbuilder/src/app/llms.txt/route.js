export async function GET(request) {
  const url = new URL(request.url);
  const langParam = url.searchParams.get('lang');
  
  const acceptLanguage = request.headers.get('accept-language') || 'en';
  
  let language = 'en';
  
  if (langParam && ['en', 'es', 'pt'].includes(langParam)) {
    language = langParam;
  } else {
    const useBrowserLang = url.searchParams.get('use-browser-lang') === 'true';
    
    if (useBrowserLang) {
      const languages = acceptLanguage.split(',').map(lang => {
        const [code, qValue] = lang.trim().split(';q=');
        return {
          code: code.split('-')[0],
          quality: qValue ? parseFloat(qValue) : 1.0
        };
      }).sort((a, b) => b.quality - a.quality);
      
      for (const lang of languages) {
        if (lang.code === 'es') {
          language = 'es';
          break;
        } else if (lang.code === 'pt') {
          language = 'pt';
          break;
        }
      }
    }
  }

  const content = getContentByLanguage(language);

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function getContentByLanguage(language) {
  const contents = {
    en: `# DexAppBuilder

> DexAppBuilder is a comprehensive crypto CMS (Content Management System) that enables you to effortlessly create and launch your own branded DApps in a matter of minutes. It's not your average app builder - it's a complete Web3 business platform with guaranteed ownership and powerful monetization opportunities.

DexAppBuilder empowers your DApp creation and launches your Web3 business with guaranteed ownership. What sets DexAppBuilder apart is its unique ability to integrate various features used in other DexKit products and make them available for you to place in your DApp, creating a comprehensive crypto ecosystem.

## Core Features

- **Crypto CMS Platform**: Complete Content Management System for Web3 applications (onchain apps)
- **No-Code/Low-Code Interface**: Intuitive drag-and-drop builder with visual components
- **Multi-Chain Support**: Deploy on 8+ major blockchain networks including Ethereum, Polygon, Binance Chain, Avalanche, Base, Arbitrum, Optimism, and more
- **White-Label Solutions**: Create fully branded applications with custom logos, themes, and domain names
- **Revenue Generation**: Earn passive income through transaction fees, swap fees, and e-commerce sales
- **Modular Architecture**: Mix and match different DeFi components as needed
- **Real-Time Preview**: See changes instantly with live preview functionality
- **Mobile Responsive**: All applications are automatically optimized for mobile devices
- **Open Source**: Publicly available repository for external collaboration and contributions

## Integrated DexKit Products

- **DexNFTMarket**: Marketplace for selling NFTs with full customization
- **DexContracts**: Token and NFT collection generator with generative images
- **DexNFTStore**: Online store for NFTs with complete e-commerce functionality
- **DexSwap**: Cryptocurrency swap tool with advanced routing
- **DexExchangePro**: Decentralized cryptocurrency exchange platform
- **DexWallet**: Crypto wallet for managing tokens and NFTs (fully customizable)

## Web3 Widgets

- **Universal Embedding**: Works with any platform or website, coded in any language
- **Wide Range of Components**: Supports swap widgets, DEX integrations, NFT minting, token drops, and more
- **Zero Friction**: No need to migrate or rebuild your existing platform
- **Revenue Generation**: Earn fees from swaps or use widgets for token sales
- **Customizable Look & Feel**: Change colors, themes, and layouts to match your branding
- **Multi-Network Support**: Choose from Ethereum, Polygon, Binance Chain, Avalanche, Base, Arbitrum, Optimism, and more

## E-Commerce

- **Crypto Marketplace**: Create your own crypto marketplace and receive payments in stablecoins
- **Real-World Applications**: Connect digital with tangible goods and services
- **Stablecoin Payments**: Receive payments in USDC, USDT, and other stable currencies
- **Product Management**: Complete inventory control with categories and collections
- **Checkout System**: Create and share product payments with customers
- **Multi-Network Support**: Accept payments on Ethereum, Polygon, Binance Chain, Arbitrum, Avalanche, Optimism, and Base

## Smart Contract Integration

- **Thirdweb Contracts**: Seamless integration with Thirdweb's open-source smart contracts including Edition Drop, Token Drop, NFT Drop, Marketplace, StakeERC721, Pack, SignatureDrop, Split, Edition, Token, NFT Collection, Vote, StakeERC20, Multiwrap, and Airdrop contracts
- **DexKit Contracts**: Integration with DexKit's enhanced contracts including DropAllowanceERC20 for flexible token distributions
- **Reusable Components**: Abstracted components make interacting with complex smart contracts straightforward

## Supported Networks

- Ethereum (Mainnet & Testnets)
- BNB Smart Chain
- Polygon
- Avalanche
- Fantom
- Optimism
- Arbitrum
- Base
- And more...

## Documentation

- [Getting Started Guide](https://docs.dexkit.com/defi-products/): Complete setup and configuration guide
- [Tutorials](https://www.youtube.com/@DexKit): Step-by-step tutorials and examples

## Community & Support

- [Discord Community](https://discord.com/invite/dexkit-official-943552525217435649): Real-time support and discussions
- [Developer GitHub](https://github.com/dexkit/): Open source contributions
- [YouTube Channel](https://www.youtube.com/@DexKit): Video tutorials and demos
- [Blog](https://dexkit.com/blog): Latest updates, case studies, and industry insights`,

    es: `# DexAppBuilder

> DexAppBuilder es un CMS crypto integral (Sistema de Gestión de Contenidos) que te permite crear y lanzar tus propias DApps con marca propia en cuestión de minutos. No es un constructor de aplicaciones promedio - es una plataforma de negocios Web3 completa con propiedad garantizada y poderosas oportunidades de monetización.

DexAppBuilder empodera tu creación de DApps y lanza tu negocio Web3 con propiedad garantizada. Lo que distingue a DexAppBuilder es su capacidad única de integrar varias características utilizadas en otros productos DexKit y ponerlas a tu disposición para colocar en tu DApp, creando un ecosistema crypto integral.

## Características Principales

- **Plataforma CMS Crypto**: Sistema de Gestión de Contenidos completo para aplicaciones Web3
- **Interfaz No-Code/Low-Code**: Constructor intuitivo de arrastrar y soltar con componentes visuales
- **Soporte Multi-Cadena**: Despliega en 8+ redes blockchain principales incluyendo Ethereum, Polygon, Binance Chain, Avalanche, Base, Arbitrum, Optimism, y más
- **Soluciones White-Label**: Crea aplicaciones completamente personalizadas con logos, temas y nombres de dominio propios
- **Generación de Ingresos**: Gana ingresos pasivos a través de comisiones de transacciones, comisiones de swap y ventas de e-commerce
- **Arquitectura Modular**: Combina diferentes componentes DeFi según sea necesario
- **Vista Previa en Tiempo Real**: Ve los cambios instantáneamente con funcionalidad de vista previa en vivo
- **Responsive Móvil**: Todas las aplicaciones se optimizan automáticamente para dispositivos móviles
- **Open Source**: Repositorio públicamente disponible para colaboración externa y contribuciones

## Productos DexKit Integrados

- **DexNFTMarket**: Marketplace para vender NFTs con personalización completa
- **DexContracts**: Generador de tokens y colecciones NFT con imágenes generativas
- **DexNFTStore**: Tienda online para NFTs con funcionalidad completa de e-commerce
- **DexSwap**: Herramienta de intercambio de criptomonedas con enrutamiento avanzado
- **DexExchangePro**: Plataforma de intercambio descentralizado de criptomonedas
- **DexWallet**: Wallet crypto para gestionar tokens y NFTs (totalmente personalizable)

## Widgets Web3

- **Incrustación Universal**: Funciona con cualquier plataforma o sitio web, codificado en cualquier lenguaje
- **Amplia Gama de Componentes**: Soporta widgets de swap, integraciones DEX, acuñación NFT, drops de tokens y más
- **Cero Fricción**: No necesitas migrar o reconstruir tu plataforma existente
- **Generación de Ingresos**: Gana comisiones de swaps o usa widgets para ventas de tokens
- **Apariencia Personalizable**: Cambia colores, temas y diseños para que coincidan con tu marca
- **Soporte Multi-Red**: Elige entre Ethereum, Polygon, Binance Chain, Avalanche, Base, Arbitrum, Optimism, y más

## E-Commerce

- **Marketplace Crypto**: Crea tu propio marketplace crypto y recibe pagos en stablecoins
- **Aplicaciones del Mundo Real**: Conecta lo digital con bienes y servicios tangibles
- **Pagos en Stablecoins**: Recibe pagos en USDC, USDT y otras monedas estables
- **Gestión de Productos**: Control completo de inventario con categorías y colecciones
- **Sistema de Checkout**: Crea y comparte pagos de productos con clientes
- **Soporte Multi-Red**: Acepta pagos en Ethereum, Polygon, Binance Chain, Arbitrum, Avalanche, Optimism y Base

## Integración de Contratos Inteligentes

- **Contratos Thirdweb**: Integración perfecta con contratos inteligentes open source de Thirdweb incluyendo Edition Drop, Token Drop, NFT Drop, Marketplace, StakeERC721, Pack, SignatureDrop, Split, Edition, Token, NFT Collection, Vote, StakeERC20, Multiwrap y contratos Airdrop
- **Contratos DexKit**: Integración con contratos mejorados de DexKit incluyendo DropAllowanceERC20 para distribuciones flexibles de tokens
- **Componentes Reutilizables**: Los componentes abstractos hacen que la interacción con contratos inteligentes complejos sea sencilla

## Redes Soportadas

- Ethereum (Mainnet y Testnets)
- BNB Smart Chain
- Polygon
- Avalanche
- Fantom
- Optimism
- Arbitrum
- Base
- Y más...

## Documentación

- [Guía de Inicio](https://docs.dexkit.com/defi-products/): Guía completa de configuración e instalación
- [Tutoriales](https://www.youtube.com/@DexKit): Tutoriales paso a paso y ejemplos

## Comunidad y Soporte

- [Comunidad Discord](https://discord.com/invite/dexkit-official-943552525217435649): Soporte en tiempo real y discusiones
- [GitHub de Desarrolladores](https://github.com/dexkit/): Contribuciones open source
- [Canal YouTube](https://www.youtube.com/@DexKit): Tutoriales en video y demos
- [Blog](https://dexkit.com/blog): Últimas actualizaciones, casos de estudio e insights de la industria`,

    pt: `# DexAppBuilder

> DexAppBuilder é um CMS crypto abrangente (Sistema de Gerenciamento de Conteúdo) que permite criar e lançar suas próprias DApps com marca própria em questão de minutos. Não é um construtor de aplicações comum - é uma plataforma de negócios Web3 completa com propriedade garantida e poderosas oportunidades de monetização.

DexAppBuilder capacita sua criação de DApps e lança seu negócio Web3 com propriedade garantida. O que distingue o DexAppBuilder é sua capacidade única de integrar várias características utilizadas em outros produtos DexKit e disponibilizá-las para você colocar em sua DApp, criando um ecossistema crypto abrangente.

## Características Principais

- **Plataforma CMS Crypto**: Sistema de Gerenciamento de Conteúdo completo para aplicações Web3
- **Interface No-Code/Low-Code**: Construtor intuitivo de arrastar e soltar com componentes visuais
- **Suporte Multi-Rede**: Implante em 8+ redes blockchain principais incluindo Ethereum, Polygon, Binance Chain, Avalanche, Base, Arbitrum, Optimism, e mais
- **Soluções White-Label**: Crie aplicações completamente personalizadas com logos, temas e nomes de domínio próprios
- **Geração de Receita**: Ganhe receita passiva através de taxas de transação, taxas de swap e vendas de e-commerce
- **Arquitetura Modular**: Combine diferentes componentes DeFi conforme necessário
- **Preview em Tempo Real**: Veja mudanças instantaneamente com funcionalidade de preview ao vivo
- **Responsivo Móvel**: Todas as aplicações são automaticamente otimizadas para dispositivos móveis
- **Open Source**: Repositório publicamente disponível para colaboração externa e contribuições

## Produtos DexKit Integrados

- **DexNFTMarket**: Marketplace para vender NFTs com personalização completa
- **DexContracts**: Gerador de tokens e coleções NFT com imagens generativas
- **DexNFTStore**: Loja online para NFTs com funcionalidade completa de e-commerce
- **DexSwap**: Ferramenta de intercâmbio de criptomoedas com roteamento avançado
- **DexExchangePro**: Plataforma de intercâmbio descentralizado de criptomoedas
- **DexWallet**: Wallet crypto para gerenciar tokens e NFTs (totalmente personalizável)

## Widgets Web3

- **Incorporaçao Universal**: Funciona com qualquer plataforma ou site, codificado em qualquer linguagem
- **Ampla Gama de Componentes**: Suporta widgets de swap, integrações DEX, cunhagem NFT, drops de tokens e mais
- **Zero Fricção**: Não precisa migrar ou reconstruir sua plataforma existente
- **Geração de Receita**: Ganhe taxas de swaps ou use widgets para vendas de tokens
- **Aparência Personalizável**: Mude cores, temas e layouts para combinar com sua marca
- **Suporte Multi-Rede**: Escolha entre Ethereum, Polygon, Binance Chain, Avalanche, Base, Arbitrum, Optimism, e mais

## E-Commerce

- **Marketplace Crypto**: Crie seu próprio marketplace crypto e receba pagamentos em stablecoins
- **Aplicações do Mundo Real**: Conecte o digital com bens e serviços tangíveis
- **Pagamentos em Stablecoins**: Receba pagamentos em USDC, USDT e outras moedas estáveis
- **Gerenciamento de Produtos**: Controle completo de inventário com categorias e coleções
- **Sistema de Checkout**: Crie e compartilhe pagamentos de produtos com clientes
- **Suporte Multi-Rede**: Aceite pagamentos em Ethereum, Polygon, Binance Chain, Arbitrum, Avalanche, Optimism e Base

## Integração de Contratos Inteligentes

- **Contratos Thirdweb**: Integração perfeita com contratos inteligentes open source do Thirdweb incluindo Edition Drop, Token Drop, NFT Drop, Marketplace, StakeERC721, Pack, SignatureDrop, Split, Edition, Token, NFT Collection, Vote, StakeERC20, Multiwrap e contratos Airdrop
- **Contratos DexKit**: Integração com contratos aprimorados do DexKit incluindo DropAllowanceERC20 para distribuições flexíveis de tokens
- **Componentes Reutilizáveis**: Componentes abstratos tornam a interação com contratos inteligentes complexos simples

## Redes Suportadas

- Ethereum (Mainnet e Testnets)
- BNB Smart Chain
- Polygon
- Avalanche
- Fantom
- Optimism
- Arbitrum
- Base
- E mais...

## Documentação

- [Guia de Início](https://docs.dexkit.com/defi-products/): Guia completo de configuração e instalação
- [Tutoriais](https://www.youtube.com/@DexKit): Tutoriais passo a passo e exemplos

## Comunidade e Suporte

- [Comunidade Discord](https://discord.com/invite/dexkit-official-943552525217435649): Suporte em tempo real e discussões
- [GitHub de Desenvolvedores](https://github.com/dexkit/): Contribuições open source
- [Canal YouTube](https://www.youtube.com/@DexKit): Tutoriais em vídeo e demos
- [Blog](https://dexkit.com/blog): Últimas atualizações, casos de estudo e insights da indústria`,
  };

  return contents[language] || contents.en;
}
