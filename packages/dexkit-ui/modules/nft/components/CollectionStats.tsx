import { NoSsr, Typography, useMediaQuery, useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import { FormattedMessage } from "react-intl";

import { MAP_COIN_TO_RARIBLE } from "../constants/marketplaces";
import { useCollectionStats } from "../hooks/collection";

interface Props {
  network?: string;
  address?: string;
}

export function CollectionStats(props: Props) {
  const collectionStats = useCollectionStats(props);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  return collectionStats.data ? (
    <NoSsr>
      {isDesktop ? (
        <Stack direction={"row"} spacing={4}>
          <Stack>
            <Typography variant="h6">
              {parseFloat((collectionStats.data?.volume || 0).toFixed(3))}{" "}
              {props?.network && MAP_COIN_TO_RARIBLE[props.network]}
            </Typography>
            <Typography variant={"caption"}>
              <FormattedMessage
                id={"total.volume"}
                defaultMessage={"Total volume"}
              />
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h6">
              {parseFloat((collectionStats.data?.highestSale || 0).toFixed(3))}{" "}
              {props?.network && MAP_COIN_TO_RARIBLE[props?.network]}
            </Typography>
            <Typography variant={"caption"}>
              <FormattedMessage
                id={"highest.sale"}
                defaultMessage={"Highest sale"}
              />
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h6">
              {parseFloat((collectionStats.data?.marketCap || 0).toFixed(3))}{" "}
              {props?.network && MAP_COIN_TO_RARIBLE[props?.network]}
            </Typography>
            <Typography variant={"caption"}>
              <FormattedMessage id={"market.cap"} defaultMessage={"Market cap"} />
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h6">{collectionStats.data?.items}</Typography>
            <Typography variant={"caption"}>
              <FormattedMessage id={"items"} defaultMessage={"Items"} />
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h6">{collectionStats.data?.owners}</Typography>
            <Typography variant={"caption"}>
              <FormattedMessage id={"owners"} defaultMessage={"Owners"} />
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h6">
              {parseFloat((collectionStats.data?.floorPrice || 0).toFixed(3))}{" "}
              {props?.network && MAP_COIN_TO_RARIBLE[props?.network]}
            </Typography>
            <Typography variant={"caption"}>
              <FormattedMessage
                id={"floor.price"}
                defaultMessage={"Floor price"}
              />
            </Typography>
          </Stack>
        </Stack>
      ) : (
        <Stack direction={"row"} spacing={4}>
          <Stack>
            <Typography variant="h6">
              {parseFloat((collectionStats.data?.volume || 0).toFixed(3))}{" "}
              {props?.network && MAP_COIN_TO_RARIBLE[props?.network]}
            </Typography>
            <Typography variant={"caption"}>
              <FormattedMessage
                id={"total.volume"}
                defaultMessage={"Total volume"}
              />
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h6">
              {parseFloat((collectionStats.data?.marketCap || 0).toFixed(3))}{" "}
              {props?.network && MAP_COIN_TO_RARIBLE[props?.network]}
            </Typography>
            <Typography variant={"caption"}>
              <FormattedMessage id={"market.cap"} defaultMessage={"Market cap"} />
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h6">
              {parseFloat((collectionStats.data?.floorPrice || 0).toFixed(3))}{" "}
              {props?.network && MAP_COIN_TO_RARIBLE[props?.network]}
            </Typography>
            <Typography variant={"caption"}>
              <FormattedMessage
                id={"floor.price"}
                defaultMessage={"Floor price"}
              />
            </Typography>
          </Stack>
        </Stack>
      )}
    </NoSsr>
  ) : null;
}
