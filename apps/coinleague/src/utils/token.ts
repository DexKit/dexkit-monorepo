import { formatUnits as formatUnitsEthers } from '@dexkit/core/utils/ethers/formatUnits';
import { BigNumber } from 'ethers';
import defaultConfig from '../../config/default.tokenlist.json';

export function GET_TOKEN(address: string, chainId: number) {
  let index = defaultConfig.tokens.findIndex((t) => {
    return (
      t.address.toLowerCase() === address.toLowerCase() && Number(t.chainId) === chainId
    );
  });
  if (index === -1) {
    return;
  }

  return defaultConfig.tokens[index];
}



export function formatUnits(balance: BigNumber, decimals: number) {
  return Number(formatUnitsEthers(balance, decimals)).toFixed(3);
}
