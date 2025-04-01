import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  MIN_KIT_HOLDING_AI_GENERATION,
  WHITELISTED_AI_ACCOUNTS,
} from "../constants";
import { getKitBalanceOfThreshold } from "../services/balances";

export function useAccountHoldDexkitMutation() {
  const { account } = useWeb3React();

  return useMutation(async () => {
    if (!account) {
      return;
    }
    if (
      WHITELISTED_AI_ACCOUNTS.map((a) => a.toLowerCase()).includes(
        account.toLowerCase(),
      )
    ) {
      return true;
    }
    const minHolding = MIN_KIT_HOLDING_AI_GENERATION;
    const hasKit = await getKitBalanceOfThreshold(account, minHolding);
    if (hasKit === 0) {
      throw new Error(
        `You need to hold more than ${minHolding} KIT in at least one of supported networks: ETH, BSC or Polygon`,
      );
    }
  });
}

export function useAccountHoldDexkitQuery() {
  const { account } = useWeb3React();

  return useQuery([account], async () => {
    if (!account) {
      return;
    }
    if (
      WHITELISTED_AI_ACCOUNTS.map((a) => a.toLowerCase()).includes(
        account.toLowerCase(),
      )
    ) {
      return true;
    }

    const minHolding = MIN_KIT_HOLDING_AI_GENERATION;
    const hasKit = await getKitBalanceOfThreshold(account, minHolding);
    return hasKit > 0;
  });
}
