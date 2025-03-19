import {
  getBlockExplorerUrl,
  getNetworkSlugFromChainId,
  isAddressEqual,
  truncateAddress,
} from "@dexkit/core/utils/blockchain";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { FormattedMessage, FormattedNumber } from "react-intl";

import { memo } from "react";

import { Asset } from "@dexkit/core/types/nft";
import Link from "../../../../components/AppLink";
import MomentFromNow from "../../../../components/MomentFromNow";
import {
  MAP_COIN_TO_RARIBLE,
  MARKETPLACES_INFO,
} from "../../constants/marketplaces";
import { useBestSellOrderAssetRari } from "../../hooks";
import { getMarketplaceForAssetURL } from "../../utils";

interface Props {
  asset?: Asset;
  account?: string;
}

export function ListingsTableRowRarible({ asset, account }: Props) {
  const network = getNetworkSlugFromChainId(asset?.chainId);
  const { data } = useBestSellOrderAssetRari(
    network,
    asset?.contractAddress,
    asset?.id,
  );
  if (!data) {
    return null;
  }
  if (!data.bestSellOrder) {
    return null;
  }

  const maker = data.bestSellOrder.maker.split(":")[1];

  return (
    <TableRow>
      <TableCell>
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          spacing={0.5}
        >
          <Typography variant="body1">
            {data.bestSellOrder.makePrice} {MAP_COIN_TO_RARIBLE[network || ""]}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        {data.bestSellOrder.makePriceUsd ? (
          <>
            <FormattedNumber
              value={Number(data.bestSellOrder.makePriceUsd)}
              currency={"usd"}
            />{" "}
            {"USD"}
          </>
        ) : (
          <Skeleton />
        )}
      </TableCell>
      <TableCell>
        <MomentFromNow from={moment(data.bestSellOrder.endedAt)} />
      </TableCell>
      <TableCell>
        <Link
          color="primary"
          href={
            asset?.chainId !== undefined
              ? `${getBlockExplorerUrl(
                  parseInt(String(asset?.chainId)),
                )}/address/${maker}`
              : "/"
          }
          target="_blank"
        >
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            spacing={0.5}
          >
            <Box>
              {isAddressEqual(account, maker) ? (
                <FormattedMessage
                  defaultMessage="you"
                  id="you"
                  description="You"
                />
              ) : (
                truncateAddress(maker)
              )}
            </Box>
            <LaunchIcon fontSize="inherit" />
          </Stack>
        </Link>
      </TableCell>
      <TableCell>
        <Button
          startIcon={
            <img
              src={MARKETPLACES_INFO[data.bestSellOrder.platform].logo}
              width="20"
            />
          }
          size="small"
          variant="outlined"
          color="primary"
          onClick={() => {
            window.open(
              getMarketplaceForAssetURL(data.bestSellOrder.platform, asset),
              "_blank",
            );
          }}
        >
          <FormattedMessage
            id="buy.on.platform"
            defaultMessage="Buy on {platform}"
            description="Buy asset button text"
            values={{
              platform: MARKETPLACES_INFO[data.bestSellOrder.platform].name,
            }}
          />
        </Button>
      </TableCell>
      <TableCell>
        <IconButton></IconButton>
      </TableCell>
    </TableRow>
  );
}

export default memo(ListingsTableRowRarible);
