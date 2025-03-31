import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';
import Link from '@/modules/common/components/Link';
import EvmReceiveQRCode from '@/modules/wallet/components/EvmReceiveQRCode';
import Token from '@mui/icons-material/Token';

import {
  Autocomplete,
  AutocompleteChangeReason,
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CoinTypes } from '../../constants/enums';
import { useCoins } from '../../hooks';
import { EvmCoin } from '../../types';
import { buildEtherReceiveAddress } from '../../utils';

interface Props {
  dialogProps: DialogProps;
  receiver: string;
  chainId?: number;
  defaultCoin?: EvmCoin;
}

export default function EvmReceiveDialog({
  dialogProps,
  receiver,
  chainId,
  defaultCoin,
}: Props) {
  const { onClose } = dialogProps;
  const { evmCoins } = useCoins();
  const [coin, setCoin] = useState<EvmCoin | null>(null);

  useEffect(() => {
    if (defaultCoin) {
      setCoin(defaultCoin);
    }
  }, [defaultCoin]);

  const handleChangeCoin = (
    event: SyntheticEvent<Element, Event>,
    value: EvmCoin | null,
    reason: AutocompleteChangeReason
  ) => {
    setCoin(value);
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={<FormattedMessage id="receive" defaultMessage="Receive" />}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          <Stack justifyContent="center" alignItems="center">
            <EvmReceiveQRCode
              receiver={receiver}
              chainId={coin?.network.chainId ? coin?.network.chainId : chainId}
              contractAddress={
                coin?.coinType === CoinTypes.EVM_ERC20
                  ? coin.contractAddress
                  : undefined
              }
            />
          </Stack>
          <Autocomplete
            disablePortal
            id="select-token"
            options={evmCoins}
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
          <Button
            sx={{ display: { xs: 'block', sm: 'none' } }}
            LinkComponent={Link}
            href={buildEtherReceiveAddress({
              receiver,
              chainId: coin?.network.chainId ? coin?.network.chainId : chainId,
              contractAddress:
                coin?.coinType === CoinTypes.EVM_ERC20
                  ? coin.contractAddress
                  : undefined,
            })}
            variant="contained"
            color="primary"
          >
            <FormattedMessage id="transfer" defaultMessage="Transfer" />
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
