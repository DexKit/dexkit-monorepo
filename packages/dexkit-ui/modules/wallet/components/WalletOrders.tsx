import { ChainId } from "@dexkit/core/constants";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { IconButton, Stack } from "@mui/material";
import { useMemo } from "react";

import { useTokenList } from "../../../hooks/blockchain";

import WalletOrdersTable from "./WalletOrdersTable";

import { usePositionPaginator } from "@dexkit/core/hooks/misc";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { SellOrBuy, TraderOrderStatus } from "../../nft/constants/enum";
import { useAssetMetadataFromList, useOrderBook } from "../../nft/hooks";

interface Props {
  filter: {
    sellOrBuy?: SellOrBuy;
    orderStatus?: TraderOrderStatus;
    chainId?: ChainId;
  };
}

export function WalletOrders({ filter }: Props) {
  const { sellOrBuy, orderStatus } = filter;

  const { chainId: walletChainId, account, isActive } = useWeb3React();
  const chainId = filter.chainId || walletChainId;

  const paginator = usePositionPaginator();

  const tokens = useTokenList({ chainId, includeNative: true });

  const { data: orders } = useOrderBook({
    chainId,
    offset: paginator.position.offset,
    limit: paginator.position.limit,
    maker: account,
    sellOrBuyNft: sellOrBuy,
    status: orderStatus !== TraderOrderStatus.All ? orderStatus : undefined,
  });

  const assetsQuery = useAssetMetadataFromList({
    chainId,
    offset: paginator.position.offset,
    limit: paginator.position.limit,
    maker: account,
    sellOrBuyNft: sellOrBuy,
    status: orderStatus !== TraderOrderStatus.All ? orderStatus : undefined,
  });

  const assets = assetsQuery.data;

  const ordersWithMetadata = useMemo(() => {
    if (orders?.orders && assets && tokens) {
      return orders?.orders.map((or) => {
        return {
          ...or,
          token: tokens.find(
            (t) => or.erc20Token.toLowerCase() === t.address.toLowerCase(),
          ),
          asset: assets.find(
            (a) =>
              a.id === or.nftTokenId &&
              a.contractAddress.toLowerCase() === or.nftToken.toLowerCase(),
          ),
        };
      });
    }
    return [];
  }, [assets, tokens, orders]);

  return (
    <Stack>
      <WalletOrdersTable orders={ordersWithMetadata} />
      <Stack direction="row" justifyContent="flex-end">
        <IconButton
          disabled={paginator.position.offset === 0}
          onClick={paginator.handlePrevious}
        >
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton
          disabled={
            !isActive ||
            (orders !== undefined &&
              orders?.orders?.length < paginator.pageSize)
          }
          onClick={paginator.handleNext}
        >
          <NavigateNextIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default WalletOrders;
