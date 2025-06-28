import { useEnsNameQuery } from "@dexkit/core/hooks";
import { Coin } from "@dexkit/core/types";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import { ConnectButton } from "@dexkit/ui/components/ConnectButton";
import SendIcon from "@mui/icons-material/Send";
import Token from "@mui/icons-material/Token";
import {
  Autocomplete,
  AutocompleteChangeReason,
  Avatar,
  Button,
  CircularProgress,
  createFilterOptions,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";

import { ChangeEvent, SyntheticEvent, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

const filter = createFilterOptions<string>();

export interface EvmSendFormProps {
  coins?: Coin[];
  isSubmitting?: boolean;
  values: { address?: string; amount?: number; coin?: Coin | null };
  accounts?: { address: string }[];
  onChange: (params: {
    address?: string;
    amount?: number;
    coin?: Coin | null;
  }) => void;
  onSubmit: () => void;
  onConnectWallet?: () => void;
  onSwitchNetwork?: ({ chainId }: { chainId?: number }) => void;
  chainId?: number;
  balance?: string;
  account?: string;
  defaultCoin?: Coin;
}

export function EvmSendForm({
  coins,
  values,
  onChange,
  accounts,
  onSubmit,
  isSubmitting,
  chainId,
  onConnectWallet,
  onSwitchNetwork,
  account,
  balance,
  defaultCoin,
}: EvmSendFormProps) {
  const [addressTouched, setAddressTouched] = useState<boolean>(false);

  const ensNameQuery = useEnsNameQuery({ address: values.address });

  const handleChangeCoin = (
    event: SyntheticEvent<Element, Event>,
    value: Coin | null,
    reason: AutocompleteChangeReason
  ) => {
    onChange({ ...values, coin: value });
  };

  const handleChangeAddress = (
    event: SyntheticEvent<Element, Event>,
    newValue: string | null,
    reason: AutocompleteChangeReason
  ) => {
    if (typeof newValue === "string") {
      onChange({ ...values, address: newValue });
      setAddressTouched(true);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "number" && typeof e.target.value === "string") {
      onChange({ ...values, [e.target.name]: parseInt(e.target.value) });
    } else {
      onChange({ ...values, [e.target.name]: e.target.value });
    }
  };

  const isAddressValid = useMemo(() => {
    return values.address
      ? ensNameQuery.data
        ? isAddress(ensNameQuery.data)
        : isAddress(values.address)
      : false;
  }, [values]);

  const isValid = useMemo(() => {
    return isAddressValid && values.amount && values?.coin;
  }, [values, isAddressValid]);

  const isChainDiff = useMemo(() => {
    return chainId && values.coin && chainId !== values.coin?.network.chainId;
  }, [chainId, values.coin]);

  const notEnoughBalance = useMemo(() => {
    if (!balance) {
      return true;
    }
    if (balance && values?.amount && values?.amount > Number(balance)) {
      return true;
    }
    return false;
  }, [balance, values?.amount]);

  return (
    <Stack spacing={2}>
      <Autocomplete
        disablePortal
        disabled={isSubmitting}
        id="select-token"
        options={coins || []}
        value={values?.coin}
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
            disabled={isSubmitting}
            label={<FormattedMessage id="coin" defaultMessage="Coin" />}
          />
        )}
      />

      <Autocomplete
        disablePortal
        disabled={isSubmitting}
        options={accounts?.map((a) => a.address) || []}
        id="select-address"
        onChange={handleChangeAddress}
        value={values?.address}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          const isExisting = options.some((option) => inputValue === option);
          if (inputValue !== "" && !isExisting) {
            filtered.push();
          }

          return filtered;
        }}
        freeSolo
        autoSelect
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              <FormattedMessage
                id="address.or.ens"
                defaultMessage="Address or ENS"
              />
            }
            name="address"
            error={!isAddressValid && addressTouched && ensNameQuery.isLoading}
            helperText={
              !isAddressValid && addressTouched && ensNameQuery.isLoading ? (
                <FormattedMessage
                  id="invalid address"
                  defaultMessage="Invalid address"
                />
              ) : undefined
            }
          />
        )}
      />

      <TextField
        fullWidth
        disabled={isSubmitting}
        type="number"
        name="amount"
        value={values?.amount}
        onChange={handleChange}
        label={<FormattedMessage id="amount" defaultMessage="Amount" />}
      />
      {!account ? (
        <ConnectButton variant="contained" color="primary" size="large" />
      ) : isChainDiff ? (
        <Button
          onClick={() =>
            onSwitchNetwork
              ? onSwitchNetwork({ chainId: values.coin?.network?.chainId })
              : undefined
          }
          variant="contained"
          color="primary"
          size="large"
        >
          <FormattedMessage
            id="switch.network"
            defaultMessage="Switch network"
          />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting || notEnoughBalance}
          startIcon={
            isSubmitting ? (
              <CircularProgress color="inherit" size="1rem" />
            ) : (
              <SendIcon />
            )
          }
          variant="contained"
          color="primary"
          size="large"
        >
          {notEnoughBalance ? (
            <FormattedMessage
              id="not.enough.balance"
              defaultMessage="Not enough balance"
            />
          ) : (
            <FormattedMessage id="send" defaultMessage="Send" />
          )}
        </Button>
      )}
    </Stack>
  );
}
