import { UserEvents } from "@dexkit/core/constants/userEvents";
import { useDexKitContext } from "@dexkit/ui/hooks";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WalletService, Web3Service } from "@unlock-protocol/unlock-js";
import { networks } from "../constants";
import { Lock } from "../constants/types";
import { convertDurationInDays } from "../utils/time";

export function usePurchaseLockKeysMutation() {
  const { provider, chainId, account } = useWeb3React();
  const trackUserEvent = useTrackUserEventsMutation();
  const queryClient = useQueryClient();
  const { watchTransactionDialog, createNotification } = useDexKitContext();
  return useMutation(
    async ({
      lockAddress,
      lockName,
      currency,
      keyPrice,
      currencySymbol,
    }: {
      lockAddress: string;
      lockName?: string;
      currency: string | null;
      keyPrice: string;
      currencySymbol?: string;
    }) => {
      if (!provider || !account || !chainId) {
        return;
      }

      const walletService = new WalletService(networks);
      const web3Service = new Web3Service(networks);
      await walletService.connect(provider);
      let params = {
        name: lockName || "",
        price: keyPrice,
        currency: currencySymbol ? currencySymbol.toUpperCase() : "",
      };
      watchTransactionDialog.setError(undefined);
      watchTransactionDialog.open("purchaseKey", params);
      try {
        let userBalance;

        if (currency) {
          userBalance = await web3Service.getTokenBalance(
            currency,
            account,
            chainId,
          );
        } else {
          userBalance = await web3Service.getAddressBalance(account, chainId);
        }
        if (parseFloat(userBalance) < parseFloat(keyPrice)) {
          throw new Error(
            `You don't have enough funds to complete this purchase.`,
          );
        }

        await walletService.purchaseKey(
          {
            lockAddress,
          },
          {}, // transaction options
          (error, hash) => {
            if (hash && chainId) {
              createNotification({
                type: "transaction",
                subtype: "purchaseKey",
                values: params,
                metadata: { hash: hash, chainId },
              });

              watchTransactionDialog.watch(hash);
              trackUserEvent.mutate({
                event: UserEvents.purchaseKey,
                hash: hash,
                chainId,
                metadata: JSON.stringify({
                  lockAddress,
                  lockName,
                  currency,
                  keyPrice,
                }),
              });
            }
            if (error) {
              watchTransactionDialog.setError(error);
            }
          },
        );
      } catch (e: any) {
        if ("code" in e) {
          if (e.code === "ACTION_REJECTED") {
            watchTransactionDialog.setError(
              new Error("User rejected transaction"),
            );
          } else {
            watchTransactionDialog.setError(e);
          }
        } else {
          watchTransactionDialog.setError(e);
        }
      }

      queryClient.refetchQueries([
        GET_LOCK_QUERY,
        GET_LOCK_BALANCE_QUERY,
        GET_LOCK_KEY_BY_OWNER_QUERY,
      ]);
    },
  );
}

export function useRenewLockKeysMutation() {
  const { provider, chainId, account } = useWeb3React();
  const trackUserEvent = useTrackUserEventsMutation();
  const queryClient = useQueryClient();
  const { watchTransactionDialog, createNotification } = useDexKitContext();
  return useMutation(
    async ({
      lockAddress,
      lockName,
      currency,
      keyPrice,
      lockDuration,
      tokenId,
      currencySymbol,
    }: {
      lockAddress: string;
      lockName?: string;
      currency: string | null;
      keyPrice: string;
      lockDuration?: number | null;
      tokenId?: string;
      currencySymbol?: string;
    }) => {
      if (!provider || !account || !chainId) {
        return;
      }

      const walletService = new WalletService(networks);
      const web3Service = new Web3Service(networks);
      await walletService.connect(provider);
      let params = {
        name: lockName || "",
        durationInDays: convertDurationInDays({ duration: lockDuration }),
        price: keyPrice,
        currency: currencySymbol ? currencySymbol.toUpperCase() : "",
      };
      watchTransactionDialog.setError(undefined);
      watchTransactionDialog.open("renewKey", params);
      try {
        let userBalance;

        if (currency) {
          userBalance = await web3Service.getTokenBalance(
            currency,
            account,
            chainId,
          );
        } else {
          userBalance = await web3Service.getAddressBalance(account, chainId);
        }
        if (parseFloat(userBalance) < parseFloat(keyPrice)) {
          throw new Error(
            `You don't have enough funds to complete this purchase.`,
          );
        }

        await walletService.extendKey(
          {
            lockAddress,
            tokenId,
          },
          {}, // transaction options
          (error, hash) => {
            if (hash && chainId) {
              createNotification({
                type: "transaction",
                subtype: "renewKey",
                values: params,
                metadata: { hash: hash, chainId },
              });

              watchTransactionDialog.watch(hash);
              trackUserEvent.mutate({
                event: UserEvents.renewKey,
                hash: hash,
                chainId,
                metadata: JSON.stringify({
                  lockAddress,
                  lockName,
                  lockDuration,
                  keyPrice, // price
                  currency, // token address
                }),
              });
            }
            if (error) {
              watchTransactionDialog.setError(error);
            }
          },
        );
      } catch (e: any) {
        if ("code" in e) {
          if (e.code === "ACTION_REJECTED") {
            watchTransactionDialog.setError(
              new Error("User rejected transaction"),
            );
          } else {
            watchTransactionDialog.setError(e);
          }
        } else {
          watchTransactionDialog.setError(e);
        }
      }

      queryClient.refetchQueries([
        GET_LOCK_QUERY,
        GET_LOCK_BALANCE_QUERY,
        GET_LOCK_KEY_BY_OWNER_QUERY,
      ]);
    },
  );
}

export const GET_LOCK_QUERY = "GET_LOCK_QUERY";

export function useLockQuery({
  lockAddress,
  lockChainId,
}: {
  lockAddress?: string;
  lockChainId?: number;
}) {
  return useQuery(
    [GET_LOCK_QUERY, lockAddress, lockChainId],
    async (): Promise<Lock | null> => {
      if (!lockAddress || !lockChainId) {
        return null;
      }
      const web3Service = new Web3Service(networks);
      return await web3Service.getLock(lockAddress, lockChainId);
    },
  );
}

export const GET_LOCK_BALANCE_QUERY = "GET_LOCK_BALANCE_QUERY";

export function useLockBalanceQuery({
  lockAddress,
  lockChainId,
  account,
}: {
  lockAddress?: string;
  lockChainId?: number;
  account?: string;
}) {
  return useQuery(
    [GET_LOCK_BALANCE_QUERY, lockAddress, account, lockChainId],
    async (): Promise<Lock | null> => {
      if (!lockAddress || !lockChainId || !account) {
        return null;
      }
      const web3Service = new Web3Service(networks);
      return await web3Service.balanceOf(lockAddress, account, lockChainId);
    },
  );
}

export const GET_LOCK_KEY_BY_OWNER_QUERY = "GET_LOCK_KEY_BY_OWNER_QUERY";

export function useLockKeybyOwnerQuery({
  lockAddress,
  lockChainId,
  account,
}: {
  lockAddress?: string;
  lockChainId?: number;
  account?: string;
}) {
  return useQuery(
    [GET_LOCK_KEY_BY_OWNER_QUERY, lockAddress, lockChainId, account],
    async (): Promise<{
      lock: string;
      owner: string;
      expiration: number;
      tokenId: number;
    } | null> => {
      if (!lockAddress || !lockChainId || !account) {
        return null;
      }
      const web3Service = new Web3Service(networks);
      return await web3Service.getKeyByLockForOwner(
        lockAddress,
        account,
        lockChainId,
      );
    },
  );
}
