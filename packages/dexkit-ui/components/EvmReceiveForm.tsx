import { EvmCoin } from "@dexkit/core/types";
import Token from "@mui/icons-material/Token";

import { useEnsNameQuery } from "@dexkit/core/hooks/wallet";
import {
  Autocomplete,
  AutocompleteChangeReason,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { NetworkSelectDropdown } from "./NetworkSelectDropdown";

export interface EvmReceiveProps {
  defaultReceiver?: string;
  defaultENSName?: string;
  defaultChainId?: number;
  defaultAmount?: number | null;
  defaultCoin?: EvmCoin | null;
  coins?: EvmCoin[];
  onChange?: ({
    receiver,
    coin,
    amount,
    chainId,
    ENSName,
  }: {
    receiver?: string | null;
    coin?: EvmCoin | null;
    amount?: number | null;
    chainId?: number;
    ENSName?: string;
  }) => void;
}

export default function EvmReceiveForm({
  defaultReceiver,
  defaultENSName,
  coins,
  defaultAmount,
  defaultCoin,
  defaultChainId,
  onChange,
}: EvmReceiveProps) {
  const [coin, setCoin] = useState<EvmCoin | null | undefined>(defaultCoin);
  const [address, setAddress] = useState<string | null | undefined>(
    defaultENSName || defaultReceiver
  );

  const [receiver, setReceiver] = useState<string | null | undefined>(
    defaultReceiver
  );
  const [ENSName, setENSName] = useState<string | undefined>(defaultENSName);
  const [chainId, setChainId] = useState<number | null | undefined>(
    defaultChainId
  );
  const [amount, setAmount] = useState<number | null | undefined>(
    defaultAmount
  );
  const [addressTouched, setAddressTouched] = useState<boolean>(false);

  const ensNameQuery = useEnsNameQuery({ address: address as string });

  useEffect(() => {
    if (ensNameQuery.isFetched) {
      if (ensNameQuery.data && isAddress(ensNameQuery.data)) {
        setReceiver(ensNameQuery.data);
        setENSName(address as string);
      } else {
        if (address && address.split(".").length > 1) {
          setReceiver(undefined);
        }
      }
    }
  }, [ensNameQuery.isFetched]);

  useEffect(() => {
    if (address && isAddress(address)) {
      setReceiver(address);
    }
    if (!address) {
      setReceiver(null);
    }
  }, [address]);

  useEffect(() => {
    if (coin && chainId) {
      if (coin?.network?.chainId !== chainId) {
        //@ts-ignore
        setCoin(null);
      }
    }
  }, [chainId, coin]);

  useEffect(() => {
    if (onChange) {
      onChange({ receiver, coin, amount, ENSName, chainId: chainId as number });
    }
  }, [onChange, receiver, coin, amount, ENSName, chainId]);

  const handleChangeCoin = (
    event: SyntheticEvent<Element, Event>,
    value: EvmCoin | null,
    reason: AutocompleteChangeReason
  ) => {
    setCoin(value);
  };

  const handleChangeAmount = (
    ev: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setAmount(Number(ev.currentTarget.value));
  };

  const isAddressValid = useMemo(() => {
    return ensNameQuery.data
      ? isAddress(ensNameQuery.data)
      : address && isAddress(address);
  }, [address, receiver, ENSName]);

  return (
    <Stack spacing={2}>
      <Stack>
        <Typography>
          <FormattedMessage
            id="choose.network"
            defaultMessage="Choose Network"
          />
          :
        </Typography>
        <NetworkSelectDropdown
          chainId={chainId as any}
          onChange={(chainId) => {
            setChainId(chainId);
          }}
          labelId="default-network"
        />
      </Stack>
      <Stack justifyContent="space-between" direction={"row"}>
        <TextField
          label={
            <FormattedMessage
              id="address.or.ens"
              defaultMessage="Address or ENS"
            />
          }
          fullWidth
          value={address}
          name="address"
          onChange={(e: any) => {
            setAddress(e.currentTarget.value);
            setAddressTouched(true);
          }}
          error={!isAddressValid && addressTouched && !ensNameQuery.isLoading}
          helperText={
            !isAddressValid && addressTouched && !ensNameQuery.isLoading ? (
              <FormattedMessage
                id="invalid address"
                defaultMessage="Invalid address"
              />
            ) : undefined
          }
        />
      </Stack>

      <Autocomplete
        disablePortal
        id="select-token"
        options={coins || []}
        value={coin}
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
    </Stack>
  );
}
