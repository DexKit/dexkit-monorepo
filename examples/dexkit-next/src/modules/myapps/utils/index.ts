import { ethers } from 'ethers';
import { AppWhitelabelType } from '../constants/enum';
import { WhitelabelFormData } from '../types';

export async function signWhitelabelData({
  provider,
  chainId,
  owner,
  config,
  type,
  message,
  slug,
}: {
  provider?: ethers.providers.Web3Provider;
  chainId?: number;
  owner?: string;
  config: any; // For now we leave it any, need we add configs for each type
  type: AppWhitelabelType;
  message: string;
  slug?: string;
}) {
  if (!provider || chainId === undefined || !owner) {
    return;
  }

  const domain = {
    name: 'DexKit',
    version: '1',
    chainId: chainId,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  };

  const configString = JSON.stringify(config);

  const value = {
    message,
    terms: 'Powered by DexKit',
    timestamp: new Date().getTime(),
    config: configString,
  };

  const types = {
    Message: [
      { name: 'message', type: 'string' },
      { name: 'terms', type: 'string' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'config', type: 'string' },
    ],
  };

  const signer = provider.getSigner(0);

  const messageString = ethers.utils._TypedDataEncoder.getPayload(
    domain,
    types,
    value
  );

  const signature = await signer._signTypedData(domain, types, value);

  const dataToSend: WhitelabelFormData = {
    signature,
    type: type,
    config: configString,
    message: JSON.stringify(messageString),
    owner,
    slug,
  };

  return dataToSend;
}

export function getSignMessage(
  context: 'edit' | 'delete' | 'addDomain',
  type: AppWhitelabelType
) {
  if (type === AppWhitelabelType.MARKETPLACE) {
    if (context === 'edit') {
      return {
        id: 'edit.marketplace',
        defaultMessage: `I want to create/edit this Marketplace`,
      };
    }
    if (context === 'delete') {
      return {
        id: 'delete.marketplace',
        defaultMessage: `I want to delete this Marketplace with domain {domain}`,
      };
    }
    if (context === 'addDomain') {
      return {
        id: 'add.domain.marketplace',
        defaultMessage: `I want to add domain {domain} to this Marketplace`,
      };
    }
  }
  return {
    id: 'edit.marketplace',
    defaultMessage: `I want to create/edit this Marketplace`,
  };
}
