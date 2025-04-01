import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants/zrx";
import { useTokenList } from "@dexkit/ui";
import { useInterval } from "@dexkit/ui/hooks/misc";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMemo, useState } from "react";
import {
  useLockBalanceQuery,
  useLockKeybyOwnerQuery,
  useLockQuery,
} from "../hooks";
import BuyLock from "./BuyLock";
import BuyLockSkeleton from "./BuyLockSkeleton";

interface Props {
  lockAddress?: string;
  lockChainId?: number;
}

export default function BuyLockContainer({ lockAddress, lockChainId }: Props) {
  const { account } = useWeb3React();
  const lockQuery = useLockQuery({ lockAddress, lockChainId });

  const [count, setCount] = useState<number>(0);

  const lockByOwner = useLockKeybyOwnerQuery({
    lockAddress,
    lockChainId,
    account,
  });

  const lockBalanceQuery = useLockBalanceQuery({
    lockAddress,
    lockChainId,
    account,
  });

  const unlimitedDuration = lockQuery.data?.expirationDuration === -1;

  const countDown = useMemo(() => {
    if (!unlimitedDuration && lockByOwner.data?.expiration) {
      const countDownDate = lockByOwner.data?.expiration;

      const now = new Date().getTime() / 1000;

      const distance = countDownDate - now;
      if (distance < 0) {
        return "Expired";
      }

      const days = Math.floor(distance / (60 * 60 * 24));
      const hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((distance % (60 * 60)) / 60);
      const seconds = Math.floor(distance % 60);

      if (days) {
        return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
      } else {
        return hours + "h " + minutes + "m " + seconds + "s ";
      }
    }
  }, [unlimitedDuration, lockByOwner.data?.expiration, count]);

  useInterval(
    () => {
      // Your custom logic here
      setCount(count + 1);
    },
    // Delay in milliseconds or null to stop it
    countDown === "Expired" || unlimitedDuration ? null : 1000,
  );

  const tokens = useTokenList({ includeNative: true, chainId: lockChainId });
  const data = lockQuery.data;
  const token = useMemo(() => {
    if (data && !data?.currencyContractAddress) {
      const tk = tokens.find(
        (t) => t.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS,
      );
      if (tk) {
        return {
          name: tk?.name,
          imageUrl: tk?.logoURI,
          symbol: tk?.symbol,
        };
      }
    }

    if (data && data?.currencyContractAddress) {
      const tk = tokens.find(
        (t) =>
          t.address.toLowerCase() ===
          data?.currencyContractAddress?.toLowerCase(),
      );
      if (tk) {
        return {
          name: tk?.name,
          imageUrl: tk?.logoURI,
          symbol: tk?.symbol,
        };
      }
    }
    return {};
  }, [tokens, data]);

  const isLoading =
    (lockQuery.isLoading && lockBalanceQuery.isLoading) ||
    lockByOwner.isLoading;

  return (
    <>
      {lockAddress && lockChainId && data && !isLoading && (
        <BuyLock
          lockName={data.name}
          tokenId={lockByOwner.data?.tokenId}
          lockAddress={lockAddress}
          lockChainId={lockChainId}
          price={data.keyPrice}
          remainingTickets={
            data.maxNumberOfKeys === -1
              ? -1
              : data.maxNumberOfKeys - data.outstandingKeys
          }
          token={token}
          lockDuration={lockQuery.data?.expirationDuration}
          currencyAddress={data.currencyContractAddress}
          unlimitedDuration={unlimitedDuration}
          expireAtCounter={countDown}
        />
      )}
      {isLoading && <BuyLockSkeleton />}
    </>
  );
}
