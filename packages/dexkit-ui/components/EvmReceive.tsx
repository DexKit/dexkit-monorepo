import { CoinTypes } from "@dexkit/core/constants";
import { EvmCoin } from "@dexkit/core/types";
import {
  buildEtherReceiveAddress,
  copyToClipboard,
  truncateAddress,
} from "@dexkit/core/utils";
import FileCopy from "@mui/icons-material/FileCopy";
import Token from "@mui/icons-material/Token";

import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import {
  Autocomplete,
  AutocompleteChangeReason,
  Avatar,
  Button,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FormattedMessage, useIntl } from "react-intl";
import CopyIconButton from "./CopyIconButton";
import EvmReceiveQRCode from "./EvmReceiveQRCode";
import { ShareButton } from "./ShareButton";

export interface EvmReceiveProps {
  receiver?: string;
  ENSName?: string;
  chainId?: number;
  defaultCoin?: EvmCoin;
  baseShareURL?: string;
  coins?: EvmCoin[];
}
/**
 * TODO: Migrate to here EvmReceiveForm
 **/
export default function EvmReceive({
  receiver,
  chainId,
  ENSName,
  coins,
  baseShareURL,
  defaultCoin,
}: EvmReceiveProps) {
  const [coin, setCoin] = useState<EvmCoin | null>(null);
  const [amount, setAmount] = useState<Number | null>(null);
  const { formatMessage } = useIntl();
  useEffect(() => {
    if (defaultCoin) {
      setCoin(defaultCoin);
    }
  }, [defaultCoin]);

  const handleChangeCoin = (
    event: SyntheticEvent<Element, Event>,
    value: EvmCoin | null,
    reason: AutocompleteChangeReason,
  ) => {
    setCoin(value);
  };

  const handleChangeAmount = (
    ev: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setAmount(Number(ev.currentTarget.value));
  };

  const receiveURL = useMemo(() => {
    return buildEtherReceiveAddress({
      contractAddress:
        coin?.coinType === CoinTypes.EVM_ERC20
          ? coin.contractAddress
          : undefined,
      receiver,
      chainId: coin?.network.chainId ? coin?.network.chainId : chainId,
      amount: amount
        ? parseUnits(String(amount), coin?.decimals).toString()
        : undefined,
    });
  }, [coin, receiver, chainId, amount]);

  const shareUrl = useMemo(() => {
    if (baseShareURL) {
      return `${baseShareURL}${receiveURL}`;
    }
    if (typeof window !== "undefined") {
      return `${window.location.origin}/wallet/send/${encodeURIComponent(
        receiveURL,
      )}`;
    }

    return receiveURL;
  }, [receiveURL, baseShareURL]);

  const handleCopy = () => {
    if (receiver) {
      if (ENSName) {
        copyToClipboard(ENSName);
      } else {
        copyToClipboard(receiver);
      }
    }
  };

  return (
    <Stack spacing={3}>
      <Stack justifyContent="center" alignItems="center" spacing={1}>
        <EvmReceiveQRCode
          receiver={receiver}
          chainId={coin?.network.chainId ? coin?.network.chainId : chainId}
          contractAddress={
            coin?.coinType === CoinTypes.EVM_ERC20
              ? coin.contractAddress
              : undefined
          }
          amount={
            amount
              ? parseUnits(String(amount), coin?.decimals).toString()
              : undefined
          }
        />
        <Typography variant="caption">
          <FormattedMessage
            id="scan.using.crypto.mobile.app"
            defaultMessage="Scan QR code using crypto mobile app like Metamask or Trust"
          />
        </Typography>
      </Stack>
      <Stack justifyContent="space-between" direction={"row"}>
        <Typography>
          <FormattedMessage id="receiver" defaultMessage="Receiver" />:
        </Typography>
        <Typography>
          {" "}
          {ENSName ? ENSName : truncateAddress(receiver)}{" "}
          <CopyIconButton
            iconButtonProps={{
              onClick: handleCopy,
              size: "small",
              color: "inherit",
            }}
            tooltip={formatMessage({
              id: "copy",
              defaultMessage: "Copy",
              description: "Copy text",
            })}
            activeTooltip={formatMessage({
              id: "copied",
              defaultMessage: "Copied!",
              description: "Copied text",
            })}
          >
            <FileCopy fontSize="inherit" color="inherit" />
          </CopyIconButton>
        </Typography>
      </Stack>

      <Autocomplete
        disablePortal
        id="select-token"
        options={coins || []}
        value={coin}
        readOnly={coins && coins.length === 1}
        onChange={handleChangeCoin}
        getOptionLabel={(opt) => opt.name}
        renderOption={(props, opt) => (
          <ListItem {...props}>
            <ListItemAvatar>
              <Avatar src={opt.imageUrl}>
                <Token />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={opt.name}
              secondary={
                <FormattedMessage
                  id="coin.on.network"
                  defaultMessage="{name} on {network}"
                  values={{ name: opt.name, network: opt.network.name }}
                />
              }
            />
          </ListItem>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={<FormattedMessage id="coin" defaultMessage="Coin" />}
          />
        )}
      />
      <TextField
        fullWidth
        type="number"
        name="amount"
        value={amount}
        onChange={handleChangeAmount}
        label={<FormattedMessage id="amount" defaultMessage="Amount" />}
      />
      <ShareButton
        url={shareUrl}
        shareButtonProps={{ color: "primary" }}
        shareButtonText={
          <FormattedMessage
            id="share.receive.request"
            defaultMessage="Share receive request"
          />
        }
      />

      <Button
        sx={{ display: { xs: "block", sm: "none" } }}
        LinkComponent={Link}
        href={buildEtherReceiveAddress({
          receiver,
          chainId: coin?.network.chainId ? coin?.network.chainId : chainId,
          contractAddress:
            coin?.coinType === CoinTypes.EVM_ERC20
              ? coin.contractAddress
              : undefined,
          amount: amount
            ? parseUnits(String(amount), coin?.decimals).toString()
            : undefined,
        })}
        variant="contained"
        color="primary"
      >
        <FormattedMessage id="transfer" defaultMessage="Transfer" />
      </Button>
    </Stack>
  );
}
