import { Web3ReactHooks } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import { magic, magicHooks } from '../connectors/magic';
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask';

export const CONNECTORS: { [key: string]: [Connector, Web3ReactHooks] } = {
  metamask: [metaMask, metaMaskHooks],
  magic: [magic, magicHooks],
};
