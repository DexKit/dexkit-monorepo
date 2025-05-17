import type { GatedCondition } from "../modules/wizard/types/config";

import { getERC20Balance } from "@dexkit/core/services/balances";
import {
  getNetworkSlugFromChainId,
  getProviderByChainId,
} from "@dexkit/core/utils/blockchain";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { getAssetProtocol } from "@dexkit/ui/modules/nft/services";
import { GatedConditionsResult } from "../hooks/gatedConditions";

import {
  getBalanceOf,
  getBalanceOfERC1155,
} from "@dexkit/ui/services/balances";

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

        if (condition.type === "coin") {
          try {
            const balance = await getERC20Balance(
              condition.address,
              account,
              getProviderByChainId(condition.chainId)
            );
            balances[index] = formatUnits(balance, condition.decimals);
            partialResults[index] = false;
            if (
              balance.gte(
                parseUnits(String(condition.amount), condition.decimals)
              )
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

        if (condition.type === "collection") {
          let nftProtocol = condition?.protocol;

          if (nftProtocol === undefined) {
            try {
              nftProtocol = (await getAssetProtocol(
                getProviderByChainId(condition.chainId),
                condition?.address
              )) as "ERC721" | "ERC1155";
            } catch (error) {
              console.error(`Error detecting NFT protocol: ${error}`);
              balances[index] = "Error";
              partialResults[index] = false;
              return { index, thisConditionResult, condition };
            }
          }

          if (nftProtocol !== "ERC1155") {
            try {
              const balance = await getBalanceOf(
                getNetworkSlugFromChainId(condition.chainId) as string,
                condition.address as string,
                account
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

          if (nftProtocol === "ERC1155") {
            try {
              if (condition.tokenId) {
                try {
                  const balance = await getBalanceOfERC1155(
                    getNetworkSlugFromChainId(condition.chainId) as string,
                    condition.address as string,
                    account,
                    condition.tokenId as string
                  );

                  balances[index] = formatUnits(balance, 0);
                  partialResults[index] = false;
                  if (balance.gte(parseUnits(String(condition.amount), 0))) {
                    thisConditionResult = true;
                    partialResults[index] = true;
                  }
                } catch (err) {
                  console.error(
                    `Error checking specific ERC1155 token: ${err}`
                  );
                  balances[index] = "Error";
                  partialResults[index] = false;
                }
              } else {
                try {
                  let hasAnyToken = false;

                  const sampleRanges = [
                    ["0", "1", "2", "3", "4", "5"],
                    ["10", "20", "50", "100"],
                    ["1000", "10000"],
                  ];

                  for (const range of sampleRanges) {
                    if (hasAnyToken) break;

                    for (const tokenId of range) {
                      const balance = await getBalanceOfERC1155(
                        getNetworkSlugFromChainId(condition.chainId) as string,
                        condition.address as string,
                        account,
                        tokenId
                      );

                      if (balance.gt(0)) {
                        hasAnyToken = true;
                        balances[index] = "Has token ID " + tokenId;
                        break;
                      }
                    }
                  }

                  if (hasAnyToken) {
                    thisConditionResult = true;
                    partialResults[index] = true;
                  } else {
                    balances[index] = "No tokens found";
                    thisConditionResult = false;
                    partialResults[index] = false;
                  }
                } catch (error) {
                  console.error(`Error checking any ERC1155 token: ${error}`);
                  balances[index] = "Error";
                  partialResults[index] = false;
                }
              }
            } catch (error) {
              console.error(`General error checking ERC1155 balance: ${error}`);
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
      } else if (condition.condition === "or") {
        result = result || thisConditionResult;
      } else if (condition.condition === "and") {
        result = result && thisConditionResult;
      }
    });

    return { result, balances, partialResults };
  }

  return { result: false, balances, partialResults };
}
