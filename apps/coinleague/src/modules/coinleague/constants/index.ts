// Mumbai Price Feeds

import { ChainId } from '@/modules/common/constants/enums';
import { BigNumber } from '@ethersproject/bignumber';
import { Coin } from '../types';
import { GameOrderBy } from './enums';

import { BSCPriceFeeds } from './PriceFeeds/bsc';

export const DEXKIT_MULTIPLIER_HOLDING = BigNumber.from(50).mul(
  BigNumber.from(10).pow(18)
);

export const CREATOR_ADDRESSES = ['0xD00995A10dB2E58A1A90270485056629134B151B'];

export const CREATOR_PRIZES_ADDRESSES = [
  '0x5265Bde27F57E738bE6c1F6AB3544e82cdc92a8f',
  '0xA5bdC63A85f889076C17177290BD90Ebd2140966',
];

export const MumbaiPriceFeeds = [
  {
    address: '0x007A22900a3B98143368Bd5906f8E17e9867581b',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    base: 'BTC',
    baseName: 'Bitcoin',
    quote: 'USD',
  },
  {
    address: '0x0715A7794a1dc8e42615F059dD6e406A6594651A',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    base: 'ETH',
    baseName: 'Ethereum',
    quote: 'USD',
  },
  {
    address: '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada',
    base: 'MATIC',
    baseName: 'Polygon',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    quote: 'USD',
  },
];

export const TRADING_VIEW_TICKERS =
  'COINBASE:BTCUSD,COINBASE:ETHUSD,COINBASE:MATICUSD,BINANCE:1INCHUSD,FTX:AAVEUSD,COINBASE:ADAUSD,FTX:ALCXUSD,COINBASE:ALGOUSD,BINANCE:AUDUSDT,BINANCE:BALUSD,COINBASE:BATUSD,COINBASE:BCHUSD,BINANCE:BNBUSD,BITTREX:BNTUSD,GEMINI:BONDUSD,BITFINEX:BSVUSD,BINANCE:BTGUSD,FTX:CELUSD,COINBASE:COMPUSD,COINBASE:CRVUSD,KRAKEN:DASHUSD,BITFINEX:DOGEUSD,BITFINEX:DOTUSD,KUCOIN:DPIUSDT,BITFINEX:EOSUSD,COINBASE:ETCUSD,COINBASE:FARMUSD,BINANCE:FXSUSD,FTX:HTUSD,COINBASE:ICPUSD,COINBASE:KNCUSD,BITFINEX:LEOUSD,COINBASE:LINKUSD,COINBASE:LPTUSD,COINBASE:LTCUSD,COINBASE:MANAUSD,BITTREX:MFTUSD,BINANCEUS:IOTAUSD,BINANCEUS:MKRUSD,BITFINEX:NEOUSD,COINBASE:OMGUSD,BINANCE:PAXGUSD,COINBASE:QUICKUSD,COINBASE:REPUSD,BINANCE:SANDUSD,COINBASE:SNXUSD,BINANCE:SOLUSD,FTX:SUSHIUSD,BINANCE:THETAUSD,BINANCE:TRXUSD,COINBASE:UMAUSD,COINBASE:UNIUSD,BINANCE:VETUSD,COINBASE:WBTCUSD,COINBASE:XLMUSD,BINANCE:XMRUSD,SUSHISWAP:XSUSHIUSDT,BITFINEX:XTZUSD,COINBASE:YFIUSD,COINBASE:ZECUSD,COINBASE:ZRXUSD';

// Mumbai Price Feeds

export const MaticPriceFeeds = [
  {
    address: '0xc907E116054Ad103354f2D350FD2514433D57F6f',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    base: 'BTC',
    baseName: 'Bitcoin',
    quote: 'USD',
    tv: 'COINBASE:BTCUSD',
  },
  {
    address: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
    base: 'ETH',
    baseName: 'Ethereum',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:ETHUSD',
  },
  {
    address: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0',
    base: 'MATIC',
    baseName: 'Polygon',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:MATICUSD',
  },
  {
    address: '0x443C5116CdF663Eb387e72C688D276e702135C87',
    base: '1INCH',
    baseName: '1INCH',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x111111111117dC0aa78b770fA6A738034120C302/logo.png',
    quote: 'USD',
    tv: 'BINANCE:1INCHUSD',
  },
  {
    address: '0x72484B12719E23115761D5DA1646945632979bB6',
    base: 'AAVE',
    baseName: 'Aave',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
    quote: 'USD',
    tv: 'FTX:AAVEUSD',
  },
  {
    address: '0x882554df528115a743c4537828DA8D5B58e52544',
    base: 'ADA',
    baseName: 'Cardano',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cardano/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:ADAUSD',
  },
  {
    address: '0x5DB6e61B6159B20F068dc15A47dF2E5931b14f29',
    base: 'ALCX',
    baseName: 'Alchemix',
    logo: 'https://assets.coingecko.com/coins/images/14113/large/Alchemix.png',
    quote: 'USD',
    tv: 'FTX:ALCXUSD',
  },
  {
    address: '0x03Bc6D9EFed65708D35fDaEfb25E87631a0a3437',
    base: 'ALGO',
    baseName: 'Algorand',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/algorand/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:ALGOUSD',
  },
  /* {
    address: '0x062Df9C4efd2030e243ffCc398b652e8b8F95C6f',
    base: 'AUD',
    baseName: 'Audius',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x18aAA7115705e8be94bfFEBDE57Af9BFc265B998/logo.png',
    quote: 'USD',
    tv: 'BINANCE:AUDUSDT',
  },*/
  {
    address: '0xD106B538F2A868c28Ca1Ec7E298C3325E0251d66',
    base: 'BAL',
    baseName: 'Balancer',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png',
    quote: 'USD',
    tv: 'BINANCE:BALUSD',
  },
  {
    address: '0x2346Ce62bd732c62618944E51cbFa09D985d86D2',
    base: 'BAT',
    baseName: 'Basic Attention Token',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0D8775F648430679A709E98d2b0Cb6250d2887EF/logo.png',
    quote: 'USD',
    tv: 'COINBASE:BATUSD',
  },
  {
    address: '0x327d9822e9932996f55b39F557AEC838313da8b7',
    base: 'BCH',
    baseName: 'Bitcoin Cash',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoincash/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:BCHUSD',
  },
  {
    address: '0x82a6c4AF830caa6c97bb504425f6A66165C2c26e',
    base: 'BNB',
    baseName: 'Binance',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
    quote: 'USD',
    tv: 'BINANCE:BNBUSD',
  },
  {
    address: '0xF5724884b6E99257cC003375e6b844bC776183f9',
    base: 'BNT',
    baseName: 'Bancor',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C/logo.png',
    quote: 'USD',
    tv: 'BITTREX:BNTUSD',
  },
  {
    address: '0x58527C2dCC755297bB81f9334b80b2B6032d8524',
    base: 'BOND',
    baseName: 'BarnBridge',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0391D2021f89DC339F60Fff84546EA23E337750f/logo.png',
    quote: 'USD',
    tv: 'GEMINI:BONDUSD',
  },
  {
    address: '0x8803DD6705F0d38e79790B02A2C43594A0538D22',
    base: 'BSV',
    baseName: 'Bitcoin SV',
    logo: 'https://assets.coingecko.com/coins/images/6799/large/BSV.png',
    quote: 'USD',
    tv: 'BITFINEX:BSVUSD',
  },
  {
    address: '0x2f2C605F28DE314bc579a7c0FDf85536529E9825',
    base: 'BTG',
    baseName: 'Bitcoin Gold',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoingold/info/logo.png',
    quote: 'USD',
    tv: 'BINANCE:BTGUSD',
  },
  {
    address: '0xc9ECF45956f576681bDc01F79602A79bC2667B0c',
    base: 'CEL',
    baseName: 'Celsius Network',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d/logo.png',
    quote: 'USD',
    tv: 'FTX:CELUSD',
  },
  {
    address: '0x2A8758b7257102461BC958279054e372C2b1bDE6',
    base: 'COMP',
    baseName: 'Coumpound',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png',
    quote: 'USD',
    tv: 'COINBASE:COMPUSD',
  },
  {
    address: '0x336584C8E6Dc19637A5b36206B1c79923111b405',
    base: 'CRV',
    baseName: 'Curve Dao Token',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png',
    quote: 'USD',
    tv: 'COINBASE:CRVUSD',
  },
  {
    address: '0xD94427eDee70E4991b4b8DdCc848f2B58ED01C0b',
    base: 'DASH',
    baseName: 'Dash',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/dash/info/logo.png',
    quote: 'USD',
    tv: 'KRAKEN:DASHUSD',
  },
  {
    address: '0xbaf9327b6564454F4a3364C33eFeEf032b4b4444',
    base: 'DOGE',
    baseName: 'Doge',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/doge/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:DOGEUSD',
  },
  {
    address: '0xacb51F1a83922632ca02B25a8164c10748001BdE',
    base: 'DOT',
    baseName: 'Polkadot',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polkadot/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:DOTUSD',
  },
  {
    address: '0x2e48b7924FBe04d575BA229A59b64547d9da16e9',
    base: 'DPI',
    baseName: 'DeFiPulse Index',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b/logo.png',
    quote: 'USD',
    tv: 'KUCOIN:DPIUSDT',
  },
  {
    address: '0xd6285F06203D938ab713Fa6A315e7d23247DDE95',
    base: 'EOS',
    baseName: 'EOS',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/eos/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:EOSUSD',
  },
  {
    address: '0xDf3f72Be10d194b58B1BB56f2c4183e661cB2114',
    base: 'ETC',
    baseName: 'Ethereum Classic',
    logo: 'https://assets.coingecko.com/coins/images/453/large/ethereum-classic-logo.png',
    quote: 'USD',
    tv: 'COINBASE:ETCUSD',
  },
  {
    address: '0xDFb138ba3A6CCe675A6F5961323Be31eE42E40ff',
    base: 'FARM',
    baseName: 'Harvest Finance',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0246c9032bC3A600820415aE600c6388619A14D/logo.png',
    quote: 'USD',
    tv: 'COINBASE:FARMUSD',
  },
  // Confirmar isto
  {
    address: '0x6C0fe985D3cAcbCdE428b84fc9431792694d0f51',
    base: 'FXS',
    baseName: 'Frax Share',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0/logo.png',
    quote: 'USD',
    tv: 'BINANCE:FXSUSD',
  },
  {
    address: '0x6F8F9e75C0285AecE30ADFe1BCc1955f145d971A',
    base: 'HT',
    baseName: 'Huobi Token',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6f259637dcD74C767781E37Bc6133cd6A68aa161/logo.png',
    quote: 'USD',
    tv: 'FTX:HTUSD',
  },
  {
    address: '0x84227A76a04289473057BEF706646199D7C58c34',
    base: 'ICP',
    baseName: 'Internet Computer',
    logo: 'https://assets.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png',
    quote: 'USD',
    tv: 'COINBASE:ICPUSD',
  },
  {
    address: '0x10e5f3DFc81B3e5Ef4e648C4454D04e79E1E41E2',
    base: 'KNC',
    baseName: 'Kyber Network Crystal',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202/logo.png',
    quote: 'USD',
    tv: 'COINBASE:KNCUSD',
  },
  {
    address: '0x1C4A8C3A28b0B3c3a0a6E7650694d9Cd5dB12DE5',
    base: 'LEO',
    baseName: 'Leo Token',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2AF5D2aD76741191D15Dfe7bF6aC92d4Bd912Ca3/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:LEOUSD',
  },
  {
    address: '0xd9FFdb71EbE7496cC440152d43986Aae0AB76665',
    base: 'LINK',
    baseName: 'Chainlink',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
    quote: 'USD',
    tv: 'COINBASE:LINKUSD',
  },
  {
    address: '0xBAaF11CeDA1d1Ca9Cf01748F8196653c9656a400',
    base: 'LPT',
    baseName: 'Livepeer',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x58b6A8A3302369DAEc383334672404Ee733aB239/logo.png',
    quote: 'USD',
    tv: 'COINBASE:LPTUSD',
  },
  {
    address: '0xEB99F173cf7d9a6dC4D889C2Ad7103e8383b6Efa',
    base: 'LTC',
    baseName: 'Litecoin',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/litecoin/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:LTCUSD',
  },
  {
    address: '0xA1CbF3Fe43BC3501e3Fc4b573e822c70e76A7512',
    base: 'MANA',
    baseName: 'Decentraland',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0F5D2fB29fb7d3CFeE444a200298f468908cC942/logo.png',
    quote: 'USD',
    tv: 'COINBASE:MANAUSD',
  },
  {
    address: '0x6E53C1c22427258BE55aE985a65c0C87BB631F9C',
    base: 'MFT',
    baseName: 'Hifi Finance',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xDF2C7238198Ad8B389666574f2d8bc411A4b7428/logo.png',
    quote: 'USD',
    tv: 'BITTREX:MFTUSD',
  },
  {
    address: '0x7d620D05c317A426903596432A5ca83375dC8d2A',
    base: 'MIOTA',
    baseName: 'IOTA',
    logo: 'https://assets.coingecko.com/coins/images/692/large/IOTA_Swirl.png',
    quote: 'USD',
    tv: 'BINANCEUS:IOTAUSD',
  },
  {
    address: '0xa070427bF5bA5709f70e98b94Cb2F435a242C46C',
    base: 'MKR',
    baseName: 'Maker',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png',
    quote: 'USD',
    tv: 'BINANCEUS:MKRUSD',
  },
  {
    address: '0x74b3587A23eE786A43C8529c2e98D3C05a8fb1fB',
    base: 'NEO',
    baseName: 'NEO',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/neo/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:NEOUSD',
  },
  {
    address: '0xa8B05B6337040c0529919BDB51f6B40A684eb08C',
    base: 'OHM',
    baseName: 'Olympus',
    logo: 'https://assets.coingecko.com/coins/images/14483/large/token_OHM_%281%29.png',
    quote: 'USD',
    tv: 'SUSHISWAP:OHMDAI',
  },
  {
    address: '0x93FfEE768F74208a7b9f2a4426f0F6BCbb1D09de',
    base: 'OMG',
    baseName: 'OMG Network',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xd26114cd6EE289AccF82350c8d8487fedB8A0C07/logo.png',
    quote: 'USD',
    tv: 'COINBASE:OMGUSD',
  },
  {
    address: '0x0f6914d8e7e1214CDb3A4C6fbf729b75C69DF608',
    base: 'PAXG',
    baseName: 'PAX Gold',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x45804880De22913dAFE09f4980848ECE6EcbAf78/logo.png',
    quote: 'USD',
    tv: 'BINANCE:PAXGUSD',
  },
  {
    address: '0xa058689f4bCa95208bba3F265674AE95dED75B6D',
    base: 'QUICK',
    baseName: 'Quickswap',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0x831753DD7087CaC61aB5644b308642cc1c33Dc13/logo.png',
    quote: 'USD',
    tv: 'COINBASE:QUICKUSD',
  },
  {
    address: '0x634b084372f88848aC8F8006DC178aA810A58E89',
    base: 'REP',
    baseName: 'Augur',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x221657776846890989a759BA2973e427DfF5C9bB/logo.png',
    quote: 'USD',
    tv: 'COINBASE:REPUSD',
  },
  {
    address: '0x3D49406EDd4D52Fb7FFd25485f32E073b529C924',
    base: 'SAND',
    baseName: 'The Sandbox',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x3845badAde8e6dFF049820680d1F14bD3903a5d0/logo.png',
    quote: 'USD',
    tv: 'BINANCE:SANDUSD',
  },
  {
    address: '0xbF90A5D9B6EE9019028dbFc2a9E50056d5252894',
    base: 'SNX',
    baseName: 'Synthetix Network Token',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png',
    quote: 'USD',
    tv: 'COINBASE:SNXUSD',
  },
  {
    address: '0x10C8264C0935b3B9870013e057f330Ff3e9C56dC',
    base: 'SOL',
    baseName: 'Solana',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
    quote: 'USD',
    tv: 'BINANCE:SOLUSD',
  },
  {
    address: '0x87eF348CADd1Ed7cc7A5F4Fefb20325216AA2cEb',
    base: 'SETHET',
    baseName: 'Lido Staked Ether',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84/logo.png',
    quote: 'USD',
  },
  {
    address: '0x49B0c695039243BBfEb8EcD054EB70061fd54aa0',
    base: 'SUSHI',
    baseName: 'Sushi',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png',
    quote: 'USD',
    tv: 'FTX:SUSHIUSD',
  },
  {
    address: '0x38611b09F8f2D520c14eA973765C225Bf57B9Eac',
    base: 'THETA',
    baseName: 'Theta Network',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/theta/info/logo.png',
    quote: 'USD',
    tv: 'BINANCE:THETAUSD',
  },
  {
    address: '0x307cCF7cBD17b69A487b9C3dbe483931Cf3E1833',
    base: 'TRX',
    baseName: 'TRON',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/info/logo.png',
    quote: 'USD',
    tv: 'BINANCE:TRXUSD',
  },
  {
    address: '0x33D9B1BAaDcF4b26ab6F8E83e9cb8a611B2B3956',
    base: 'UMA',
    baseName: 'UMA',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828/logo.png',
    quote: 'USD',
    tv: 'COINBASE:UMAUSD',
  },
  {
    address: '0xdf0Fb4e4F928d2dCB76f438575fDD8682386e13C',
    base: 'UNI',
    baseName: 'Uniswap',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
    quote: 'USD',
    tv: 'COINBASE:UNIUSD',
  },
  {
    address: '0xD78bc11ef3256e3CE9dC0DF0fa7be9E9afc07f95',
    base: 'VET',
    baseName: 'VeChain',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/vechain/info/logo.png',
    quote: 'USD',
    tv: 'BINANCE:VETUSD',
  },
  {
    address: '0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6',
    base: 'WBTC',
    baseName: 'Wrapped Bitcoin',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
    quote: 'USD',
    tv: 'COINBASE:WBTCUSD',
  },
  {
    address: '0x692AE5510cA9070095A496dbcFBCDA99D4024Cd9',
    base: 'XLM',
    baseName: 'Stellar',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/stellar/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:XLMUSD',
  },
  {
    address: '0xBE6FB0AB6302B693368D0E9001fAF77ecc6571db',
    base: 'XMR',
    baseName: 'Monero',
    logo: 'https://assets.coingecko.com/coins/images/69/large/monero_logo.png',
    quote: 'USD',
    tv: 'BINANCE:XMRUSD',
  },
  {
    address: '0x785ba89291f676b5386652eB12b30cF361020694',
    base: 'XRP',
    baseName: 'XRP',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ripple/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:XRPUSD',
  },
  {
    address: '0xC16Cb62CddE46f43Fd73257b957Bf527f07b51C0',
    base: 'XSUSHI',
    baseName: 'xSUSHI',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272/logo.png',
    quote: 'USD',
    tv: 'SUSHISWAP:XSUSHIUSDT',
  },
  {
    address: '0x691e26AB58ff05800E028b0876A41B720b26FC65',
    base: 'XTZ',
    baseName: 'Tezos',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tezos/info/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:XTZUSD',
  },
  {
    address: '0x9d3A43c111E7b2C6601705D9fcF7a70c95b1dc55',
    base: 'YFI',
    baseName: 'yearn.finance',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/logo.png',
    quote: 'USD',
    tv: 'COINBASE:YFIUSD',
  },
  {
    address: '0xBC08c639e579a391C4228F20d0C29d0690092DF0',
    base: 'ZEC',
    baseName: 'Zcash',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/zcash/info/logo.png',
    quote: 'USD',
    tv: 'COINBASE:ZECUSD',
  },
  {
    address: '0x6EA4d89474d9410939d429B786208c74853A5B47',
    base: 'ZRX',
    baseName: '0x',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png',
    quote: 'USD',
    tv: 'COINBASE:ZRXUSD',
  },
  /* {
     address: '0x9b88d07B2354eF5f4579690356818e07371c7BeD',
     base: 'AGEUR',
     baseName: 'Angle Protocol',
     logo: '',
     quote: 'USD',
     tv: '',
   },*/
  /*{
    address: '0x289833F252eaB98582D62db94Bd75aB48AD9CF0D',
    base: 'ALPHA',
    baseName: 'Alpha Finance',
    logo: '',
    quote: 'USD',
    tv: '',
  },*/
  {
    address: '0x2Ac3F3Bfac8fC9094BC3f0F9041a51375235B992',
    base: 'APE',
    baseName: 'APE Coin',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4d224452801ACEd8B2F0aebE155379bb5D594381/logo.png',
    quote: 'USD',
    tv: 'COINBASE:APEUSD',
  },
  {
    address: '0xe01eA2fbd8D76ee323FbEd03eB9a8625EC981A10',
    base: 'AVAX',
    baseName: 'Avalanche',
    logo: 'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png?1604021818',
    quote: 'USD',
    tv: 'COINBASE:AVAXUSD',
  },
  {
    address: '0x9c371aE34509590E10aB98205d2dF5936A1aD875',
    base: 'AXIE',
    baseName: 'Axie Infinity',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b/logo.png',
    quote: 'USD',
    tv: 'FTX:AXSUSD',
  },
  {
    address: '0xF626964Ba5e81405f47e8004F0b276Bb974742B5',
    base: 'BADGER',
    baseName: 'Badger DAO',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x3472A5A71965499acd81997a54BBA8D852C6E53d/logo.png',
    quote: 'USD',
    tv: 'COINBASE:BADGERUSD',
  },
  {
    address: '0xE039D4aA72A0C0d6d0218E650c1eBD6B2675A575',
    base: 'CTX',
    baseName: 'Cryptex Finance',
    logo: 'https://assets.coingecko.com/coins/images/14932/large/glossy_icon_-_C200px.png?1619073171',
    quote: 'USD',
    tv: 'GEMINI:CTXUSD',
  },
  {
    address: '0x5ec151834040B4D453A1eA46aA634C1773b36084',
    base: 'CVX',
    baseName: 'Convex',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B/logo.png',
    quote: 'USD',
    tv: 'FTX:CVXUSD',
  },
  {
    address: '0x4205eC5fd179A843caa7B0860a8eC7D980013359',
    base: 'DGB',
    baseName: 'Digibyte',
    logo: 'https://assets.coingecko.com/coins/images/63/large/digibyte.png?1547033717',
    quote: 'USD',
    tv: 'KUCOIN:DGBUSDT',
  },
  {
    address: '0x59161117086a4C7A9beDA16C66e40Bdaa1C5a8B6',
    base: 'DODO',
    baseName: 'DODO',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x43Dfc4159D86F3A37A5A4B3D4580b888ad7d4DDd/logo.png',
    quote: 'USD',
    tv: 'FTX:DODOUSD',
  },
  {
    address: '0x392AcaA165a882dfC63D3aeB4c446b95Fa7013B0',
    base: 'EFI',
    baseName: 'Efinity Token',
    logo: 'https://assets.coingecko.com/coins/images/16558/large/efi-200px_%281%29.png?1624439132',
    quote: 'USD',
    tv: 'OKX:EFIUSDT',
  },
  {
    address: '0x440A341bbC9FA86aA60A195e2409a547e48d4C0C',
    base: 'ENJ',
    baseName: 'Enjin Coin',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c/logo.png',
    quote: 'USD',
    tv: 'BINANCE:ENJUSDT',
  },
  {
    address: '0x18617D05eE1692Ad7EAFee9839459da16097AFd8',
    base: 'FIS',
    baseName: 'Stafi',
    logo: 'https://assets.coingecko.com/coins/images/12423/large/stafi_logo.jpg?1599730991',
    quote: 'USD',
    tv: 'HUOBI:FISUSDT',
  },
  {
    address: '0x58326c0F831b2Dbf7234A4204F28Bba79AA06d5f',
    base: 'FTM',
    baseName: 'Fantom',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
    quote: 'USD',
    tv: 'FTX:FTMUSD',
  },
  {
    address: '0x817A7D43f0277Ca480AE03Ec76Fc63A2EC7114bA',
    base: 'FTT',
    baseName: 'FTX Token',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9/logo.png',
    quote: 'USD',
    tv: 'BINANCE:FTTUSDT',
  },
  {
    address: '0xDD229Ce42f11D8Ee7fFf29bDB71C7b81352e11be',
    base: 'GHST',
    baseName: 'Aavegotchi',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x3F382DbD960E3a9bbCeaE22651E88158d2791550/logo.png',
    quote: 'USD',
    tv: 'POLONIEX:GHSTUSDT',
  },
  {
    address: '0x432fa0899cF1BcDb98592D7eAA23C372b8b8ddf2',
    base: 'GNO',
    baseName: 'Gnosis',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6810e776880C02933D47DB1b9fc05908e5386b96/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:GNOUSD',
  },
  {
    address: '0x3FabBfb300B1e2D7c9B84512fe9D30aeDF24C410',
    base: 'GRT',
    baseName: 'The Graph',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc944E90C64B2c07662A292be6244BDf05Cda44a7/logo.png',
    quote: 'USD',
    tv: 'GEMINI:GRTUSD',
  },
  {
    address: '0xC5878bDf8a89FA3bF0DC8389ae8EE6DE601D01bC',
    base: 'HBAR',
    baseName: 'Hedera Hashgraph',
    logo: 'https://assets.coingecko.com/coins/images/3688/large/hbar.png?1637045634',
    quote: 'USD',
    tv: 'BINANCE:HBARUSDT',
  },
  {
    address: '0x5438E60A06C7447432512264Fa57e2FeD3224b33',
    base: 'KEEP',
    baseName: 'Keep Network',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC/logo.png',
    quote: 'USD',
    tv: 'KRAKEN:KEEPUSD',
  },
  {
    address: '0x86F87CB74238a6f24606534A2fCc05469Eb2bcF5',
    base: 'KLAY',
    baseName: 'Klaytn',
    logo: 'https://assets.coingecko.com/coins/images/9672/large/klaytn.jpeg?1642775250',
    quote: 'USD',
    tv: 'BITTREX:KLAYUSDT',
  },
  {
    address: '0x666bb13b3ED3816504E8c30D0F9B9C16b371774b',
    base: 'NEXO',
    baseName: 'Nexo',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206/logo.png',
    quote: 'USD',
    tv: 'BITFINEX:NEXOUSD',
  },
  {
    address: '0x1342a7a1D7264dAF8Ae790712266c7bE19f71211',
    base: 'NU',
    baseName: 'NuCypher',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4fE83213D56308330EC302a8BD641f1d0113A4Cc/logo.png',
    quote: 'USD',
    tv: 'POLONIEX:NUUSDT',
  },
  {
    address: '0xdcda79097C44353Dee65684328793695bd34A629',
    base: 'OCEAN',
    baseName: 'Ocean Protocol',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x967da4048cD07aB37855c090aAF366e4ce1b9F48/logo.png',
    quote: 'USD',
    tv: 'KUCOIN:OCEANUSDT',
  },
  {
    address: '0x4cE90F28C6357A7d3F47D680723d18AF3684cD00',
    base: 'OHMv2',
    baseName: 'Olympus v2',
    logo: 'https://assets.coingecko.com/coins/images/14483/large/token_OHM_%281%29.png',
    quote: 'USD',
    tv: '',
  },
  {
    address: '0xD3963855b73979B617455Fc38A7355563a289948',
    base: 'PICKLE',
    baseName: 'Pickle Finance',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5/logo.png',
    quote: 'USD',
    tv: 'OKX:PICKLEUSDT',
  },
  {
    address: '0x24C0e0FC8cCb21e2fb3e1A8A4eC4b29458664f79',
    base: 'PLA',
    baseName: 'Playdapp',
    logo: 'https://assets.coingecko.com/coins/images/14316/large/54023228.png?1615366911',
    quote: 'USD',
    tv: 'BITTREX:PLAUSD',
  },

  {
    address: '0xC741F7752BAe936fCE97933b755884AF66fB69C1',
    base: 'POLY',
    baseName: 'Polymath',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9992eC3cF6A55b00978cdDF2b27BC6882d88D1eC/logo.png',
    quote: 'USD',
    tv: 'BINANCE:POLYUSDT',
  },

  {
    address: '0xDCc714619E59a626fde5f082d42F314E9fB832Fb',
    base: 'QNT',
    baseName: 'Quant',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4a220E6096B25EADb88358cb44068A3248254675/logo.png',
    quote: 'USD',
    tv: 'KUCOIN:QNTUSDT',
  },
  {
    address: '0x3fCEf3eDF17f515d9c0fA72020FcFc6c0001F876',
    base: 'RGT',
    baseName: 'Rari Governance Token',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD291E7a03283640FDc51b121aC401383A46cC623/logo.png',
    quote: 'USD',
    tv: 'BITTREX:RGTUSDT',
  },
  {
    address: '0x2E5B04aDC0A3b7dB5Fd34AE817c7D0993315A8a6',
    base: 'RLY',
    baseName: 'Rally',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xf1f955016EcbCd7321c7266BccFB96c68ea5E49b/logo.png',
    quote: 'USD',
    tv: 'KUCOIN:RLYUSDT',
  },
  {
    address: '0x3710abeb1A0Fc7C2EC59C26c8DAA7a448ff6125A',
    base: 'SHIB',
    baseName: 'Shiba Inu',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png',
    quote: 'USD',
    tv: 'FTX:SHIBUSD',
  },
  {
    address: '0xBB3eF70953fC3766bec4Ab7A9BF05B6E4caf89c6',
    base: 'SLP',
    baseName: 'Smooth Love Potion',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xCC8Fa225D80b9c7D42F96e9570156c65D6cAAa25/logo.png',
    quote: 'USD',
    tv: 'FTX:SLPUSD',
  },
  {
    address: '0x9bce696Fb0DcE1ed4DDb94305757dEDc745f3786',
    base: 'TOKE',
    baseName: 'Tokemak',
    logo: 'https://assets.coingecko.com/coins/images/17495/large/tokemak-avatar-200px-black.png?1628131614',
    quote: 'USD',
    tv: '',
  },
  {
    address: '0x346C7D75e315B54129eac38CC4e2B9f9b0250e3e',
    base: 'TRIBE',
    baseName: 'Tribe',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B/logo.png',
    quote: 'USD',
    tv: 'POLONIEX:TOKEUSDT',
  },
  {
    address: '0x6a99EC84819FB7007dd5D032068742604E755c56',
    base: 'WOO',
    baseName: 'Woo Network',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4691937a7508860F876c9c0a2a617E7d9E945D4B/logo.png',
    quote: 'USD',
    tv: 'KUCOIN:WOOUSDT',
  },
];

export const PriceFeeds: { [key: number]: Coin[] } = {
  [ChainId.Mumbai]: MumbaiPriceFeeds,
  [ChainId.Polygon]: MaticPriceFeeds,
  [ChainId.BSC]: BSCPriceFeeds,
};

export const COIN_LEAGUES_FACTORY_ADDRESS_V3 = {
  [ChainId.Mumbai]: '0xb33f24f9ddc38725F2b791e63Fb26E6CEc5e842A',
  [ChainId.Polygon]: '0x32970224454512599C9057d24288AA3b11fFA952',
  [ChainId.BSC]: '',
};

export const DISABLE_CHAMPIONS_ID = '500000';

export const AFFILIATE_FIELD = 'league-affiliate';

// export const GAME_METADATA_API =
//   'https://coinleague-app-api-yxwk6.ondigitalocean.app';
//export const GAME_METADATA_API = 'http://localhost:4001';

export const GAME_METADATA_API =
  process.env.NODE_ENV === 'development'
    ? //'http://localhost:4001'
      'https://coinleague-app-api-yxwk6.ondigitalocean.app'
    : process.env.REACT_APP_PROFILE_API;

export const PROFILE_API = `${GAME_METADATA_API}/api/profile`;

export enum Months {
  February = 'February',
  March = 'March',
  April = 'April',
  May = 'May',
  June = 'June',
  // March = 3,
}

export const BLOCK_TIMESTAMP_COMPETION: {
  [key: string]: { [key: number]: number };
} = {
  [Months.March]: {
    [ChainId.Mumbai]: 0,
    [ChainId.Polygon]: 25464624,
    [ChainId.BSC]: 0,
  },
  [Months.April]: {
    [ChainId.Mumbai]: 0,
    [ChainId.Polygon]: 26596644,
    [ChainId.BSC]: 0,
  },
  [Months.May]: {
    [ChainId.Mumbai]: 0,
    [ChainId.Polygon]: 27796644,
    [ChainId.BSC]: 0,
  },
  [Months.June]: {
    [ChainId.Mumbai]: 0,
    [ChainId.Polygon]: 29015000,
    [ChainId.BSC]: 0,
  },
};

export const NativeCoinAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export interface CoinToPlayInterface {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export const CoinToPlay: { [key in ChainId]?: CoinToPlayInterface[] } = {
  [ChainId.Mumbai]: [
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Matic',
      symbol: 'Matic',
      decimals: 18,
    },
    {
      address: '0xd3FC7D494ce25303BF8BeC111310629429e6cDEA',
      name: 'Tether',
      symbol: 'USDT',
      decimals: 6,
    },
  ],
  [ChainId.BSC]: [
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
  ],
  [ChainId.Polygon]: [
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Matic',
      symbol: 'Matic',
      decimals: 18,
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      name: 'Tether',
      symbol: 'USDT',
      decimals: 6,
    },
  ],
};

export const StableCoinToPlay: { [key in ChainId]?: CoinToPlayInterface } = {
  [ChainId.Mumbai]: {
    address: '0xd3FC7D494ce25303BF8BeC111310629429e6cDEA',
    name: 'Tether',
    symbol: 'USDT',
    decimals: 6,
  },
  [ChainId.Polygon]: {
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    name: 'Tether',
    symbol: 'USDT',
    decimals: 6,
  },
};

export const GET_LEAGUES_CHAIN_ID = (chainId?: ChainId) => {
  if (chainId && chainId === ChainId.Mumbai) {
    return ChainId.Mumbai;
  }
  if (chainId && chainId === ChainId.BSC) {
    return ChainId.BSC;
  }
  // return ChainId.Matic;
  return ChainId.Polygon;
};

export const GET_GAME_ORDER_OPTIONS = [
  {
    value: GameOrderBy.HighLevel,
    defaultMessage: 'Higher Level',
    messageId: 'app.coinLeagues.higherLevel',
  },
  {
    value: GameOrderBy.LowLevel,
    defaultMessage: 'Lower Level',
    messageId: 'app.coinLeagues.lowerLevel',
  },
  {
    value: GameOrderBy.AboutStart,
    defaultMessage: 'About to Start',
    messageId: 'app.coinLeagues.aboutstart',
  },
  {
    value: GameOrderBy.MostFull,
    defaultMessage: 'Most Full',
    messageId: 'app.coinLeagues.mostFull',
  },
  {
    value: GameOrderBy.MostEmpty,
    defaultMessage: 'Most Empty',
    messageId: 'app.coinLeagues.mostEmpty',
  },
  {
    value: GameOrderBy.HighDuration,
    defaultMessage: 'Higher Duration',
    messageId: 'app.coinLeagues.higherDuration',
  },
  {
    value: GameOrderBy.LowerDuration,
    defaultMessage: 'Lower Duration',
    messageId: 'app.coinLeagues.lowerDuration',
  },
  {
    value: GameOrderBy.MoreCoins,
    defaultMessage: 'More Coins',
    messageId: 'app.coinLeagues.moreCoins',
  },
  {
    value: GameOrderBy.LessCoins,
    defaultMessage: 'Less Coins',
    messageId: 'app.coinLeagues.lessCoins',
  },
];

export const BITBOY_TEAM = [
  /*{
    address: '0x186035678f02f19d311ad24EA73a08EA4cD7f01e',
    label: 'Justin',
  },
  {
    address: '0xD1C86EA01EE183a48C86EDAD3be357B40E106F97',
    label: 'TJ',
  },
  {
    address: '0x77279C13336751281Bfc20F7381475f2db7dEaC0',
    label: 'Deezy',
  },
  {
    address: '0xaf5E3194e9E2D076D9dE7d73CaE3EA23d9278B14',
    label: 'Bitboy',
  },
  {
    address: '0xCB8b2c541E18AdBC8B4B8A42a3CA769f4EB72e6C',
    label: 'J Chains',
  },*/
  {
    address: '0x1b66A204a3e4be0E75B0dE7b91BC541bB7d99c8f',
    label: 'RayPulse',
  },
];

export const CREATOR_LABELS = [
  ...BITBOY_TEAM,
  /*{
    address: '0xA27e256CDD086eF88953b941582bB651582c1454',
    label: 'Albert Hoffman',
  },
  {
    address: '0x529be61AF4FD199456A5Bc67B72CD2F2a0A3FD70',
    label: 'Albert Hoffman',
  },*/
];

export const GAME_ENDED = 'GAME_ENDED';
export const GAME_ABORTED = 'GAME_ABORTED';
export const GAME_STARTED = 'GAME_STARTED';
export const GAME_WAITING = 'GAME_WAITING';

export const COINLEAGUE_DEFAULT_AFFILIATE =
  '0xD50E4D1E0b49eb64a6bF2f48731c035E8948D219';
