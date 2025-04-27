import axios from 'axios';
import { Contract, providers } from 'ethers';

import { getERC20Balance } from '@dexkit/core/services/balances';
import {
  getNetworkSlugFromChainId,
  getProviderByChainId,
} from '@dexkit/core/utils/blockchain';
import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { parseUnits } from '@dexkit/core/utils/ethers/parseUnits';
import { getAssetProtocol } from '@dexkit/ui/modules/nft/services';
import {
  GamificationPoint,
  GatedCondition,
} from '@dexkit/ui/modules/wizard/types';
import {
  getBalanceOf,
  getBalanceOfERC1155,
} from '@dexkit/ui/services/balances';
import { myAppsApi } from 'src/services/whitelabel';
import { Token } from '../../../types/blockchain';
export interface GatedConditionsResult {
  result: boolean;
  balances: { [key: number]: string };
  partialResults: { [key: number]: boolean };
  error?: boolean;
  errorMessage?: string;
}

export async function getTokenList(url: string) {
  const response = await axios.get(url);
  return response.data.tokens as Token[];
}

export async function isContract(chainId: number, address: string) {
  return null;
}

export async function getContractImplementation({
  provider,
  contractAddress,
}: {
  contractAddress: string;
  provider: providers.JsonRpcProvider;
}): Promise<string> {
  const contract = new Contract(
    contractAddress,
    [
      {
        inputs: [],
        name: 'implementation',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    provider,
  );

  return await contract.implementation();
}

export async function checkGatedConditions({
  account,
  conditions,
}: {
  account?: string;
  conditions: GatedCondition[];
}): Promise<GatedConditionsResult> {
  const balances: { [key: number]: string } = {};
  const partialResults: { [key: number]: boolean } = {};

  if (!account) {
    return { result: false, balances, partialResults };
  }
  if (account && conditions.length === 0) {
    return { result: true, balances, partialResults };
  }

  if (account && conditions) {
    let result = false;
    let firstCondition = true;

    const conditionPromises = conditions.map(async (condition, index) => {
      try {
        let thisConditionResult = false;
        
        if (condition.type === 'coin') {
          try {
            const balance = await getERC20Balance(
              condition.address,
              account,
              getProviderByChainId(condition.chainId),
            );
            balances[index] = formatUnits(balance, condition.decimals);
            partialResults[index] = false;
            if (
              balance.gte(parseUnits(String(condition.amount), condition.decimals))
            ) {
              thisConditionResult = true;
              partialResults[index] = true;
            }
          } catch (error) {
            console.error(`Error checking coin balance: ${error}`);
            balances[index] = "Error";
            partialResults[index] = false;
          }
        }

        if (condition.type === 'collection') {
          let nftProtocol = condition?.protocol;
          
          if (nftProtocol === undefined) {
            try {
              nftProtocol = (await getAssetProtocol(
                getProviderByChainId(condition.chainId),
                condition?.address,
              )) as 'ERC721' | 'ERC1155';
            } catch (error) {
              console.error(`Error detecting NFT protocol: ${error}`);
              balances[index] = "Error";
              partialResults[index] = false;
              return { index, thisConditionResult, condition };
            }
          }

          if (nftProtocol !== 'ERC1155') {
            try {
              const balance = await getBalanceOf(
                getNetworkSlugFromChainId(condition.chainId) as string,
                condition.address as string,
                account,
              );

              balances[index] = formatUnits(balance, 0);
              partialResults[index] = false;
              if (balance.gte(parseUnits(String(condition.amount), 0))) {
                thisConditionResult = true;
                partialResults[index] = true;
              }
            } catch (error) {
              console.error(`Error checking NFT balance: ${error}`);
              balances[index] = "Error";
              partialResults[index] = false;
            }
          }
          
          if (nftProtocol === 'ERC1155') {
            try {
              if (condition.tokenId) {
                const balance = await getBalanceOfERC1155(
                  getNetworkSlugFromChainId(condition.chainId) as string,
                  condition.address as string,
                  account,
                  condition.tokenId as string,
                );

                balances[index] = formatUnits(balance, 0);
                partialResults[index] = false;
                if (balance.gte(parseUnits(String(condition.amount), 0))) {
                  thisConditionResult = true;
                  partialResults[index] = true;
                }
              } 
              else {
                const balance = await getBalanceOf(
                  getNetworkSlugFromChainId(condition.chainId) as string,
                  condition.address as string,
                  account,
                );

                balances[index] = formatUnits(balance, 0);
                partialResults[index] = false;
                if (balance.gte(parseUnits(String(condition.amount), 0))) {
                  thisConditionResult = true;
                  partialResults[index] = true;
                }
              }
            } catch (error) {
              console.error(`Error checking ERC1155 balance: ${error}`);
              balances[index] = "Error";
              partialResults[index] = false;
            }
          }
        }

        return { index, thisConditionResult, condition };
      } catch (error) {
        console.error(`General error in condition ${index}: ${error}`);
        balances[index] = "Error";
        partialResults[index] = false;
        return { index, thisConditionResult: false, condition };
      }
    });

    const results = await Promise.all(conditionPromises);
    
    results.forEach(({ thisConditionResult, condition }) => {
      if (firstCondition) {
        result = thisConditionResult;
        firstCondition = false;
      } else if (condition.condition === 'or') {
        result = result || thisConditionResult;
      } else if (condition.condition === 'and') {
        result = result && thisConditionResult;
      }
    });

    return { result, balances, partialResults };
  }
  
  return { result: false, balances, partialResults };
}

export function getGatedConditionsText({
  conditions,
}: {
  conditions: GatedCondition[];
}) {
  let text =
    'You  to unlock this content you need to meet the follow gated conditions: ';
  if (conditions) {
    for (const condition of conditions) {
      if (!condition.condition) {
      }
      if (condition.condition === 'or') {
        text = `${text} or`;
      }
      if (condition.condition === 'and') {
        text = `${text} and`;
      }

      if (condition.type === 'coin') {
        text = `${text} have ${
          condition.amount
        } of coin ${condition.symbol?.toUpperCase()} with address ${
          condition.address
        } on network ${getNetworkSlugFromChainId(
          condition.chainId,
        )?.toUpperCase()}`;
      }
      if (condition.type === 'collection' && condition.protocol !== 'ERC1155') {
        text = `${text} have ${
          condition.amount
        } of collection ${condition.symbol?.toUpperCase()} with address ${
          condition.address
        } on network ${getNetworkSlugFromChainId(
          condition.chainId,
        )?.toUpperCase()}`;
      }
      if (
        condition.type === 'collection' &&
        condition.protocol === 'ERC1155'
      ) {
        text = `${text} have ${
          condition.amount
        } of collection ${condition.symbol?.toUpperCase()}${
          condition.tokenId ? ` with id ${condition.tokenId}` : ' (any token id)'
        } with address ${
          condition.address
        } on network ${getNetworkSlugFromChainId(
          condition.chainId,
        )?.toUpperCase()} `;
      }
    }
    return text;
  }
  return '';
}
export async function isProxyContract({
  provider,
  contractAddress,
}: {
  contractAddress: string;
  provider: providers.JsonRpcProvider;
}): Promise<boolean> {
  try {
    const addr = await getContractImplementation({ contractAddress, provider });

    return isAddress(addr);
  } catch (err) {
    return false;
  }
}

export async function requestEmailConfirmatioForSite({
  siteId,
  accessToken,
}: {
  siteId: number;
  accessToken: string;
}) {
  return axios.get(`/api/email/site-verification-link?siteId=${siteId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function addPermissionsMemberSite({
  siteId,
  permissions,
  account,
}: {
  siteId: number;
  permissions: string;
  account: string;
}) {
  return myAppsApi.post(`/site/add-permissions/${siteId}`, {
    permissions,
    account,
  });
}

export async function deleteMemberSite({
  siteId,
  account,
}: {
  siteId: number;
  account: string;
}) {
  return myAppsApi.delete(`/site/remove-permissions/${siteId}/${account}`);
}

export async function upsertAppVersion({
  siteId,
  version,
  description,
  versionId,
}: {
  siteId: number;
  version: string;
  description?: string;
  versionId?: number;
}) {
  return myAppsApi.post(`/site/upsert-version/${siteId}`, {
    version,
    description,
    versionId,
  });
}

export async function deleteAppVersion({
  siteId,
  siteVersionId,
}: {
  siteId: number;
  siteVersionId: number;
}) {
  return myAppsApi.delete(`/site/version/${siteId}/${siteVersionId}`);
}

export async function setAppVersion({
  siteId,
  siteVersionId,
}: {
  siteId: number;
  siteVersionId: number;
}) {
  return myAppsApi.get(`/site/set-version/${siteId}/${siteVersionId}`);
}

// site rankings
export async function createSiteRankingVersion({
  siteId,
  title,
  description,
  settings,
}: {
  siteId: number;
  title?: string;
  description?: string;
  settings?: GamificationPoint[];
}) {
  return myAppsApi.post(`/site-ranking/create`, {
    title,
    description,
    siteId,
    settings,
  });
}

export async function updateSiteRankingVersion({
  siteId,
  title,
  description,
  rankingId,
  settings,
  from,
  to,
}: {
  siteId: number;
  title?: string;
  description?: string;
  rankingId?: number;
  settings?: GamificationPoint[];
  from?: string;
  to?: string;
}) {
  return myAppsApi.patch(`/site-ranking/${rankingId}`, {
    title,
    description,
    siteId,
    settings,
    from,
    to,
  });
}

export async function deleteAppRanking({
  siteId,
  rankingId,
}: {
  siteId: number;
  rankingId: number;
}) {
  return myAppsApi.delete(`/site-ranking/${siteId}/${rankingId}`);
}
