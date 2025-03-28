import {
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  List,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { memo, useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AppDialogTitle from '@/modules/common/components/AppDialogTitle';
import { TokenBalance } from '@/modules/common/types/transactions';
import { useERC20BalancesProxyAllowancesQuery } from '../../hooks/balances';
import { SearchTextField } from '../SearchTextField';
import SelectTokenDialogListItem from './SelectTokenDialogListItem';

interface Props {
  dialogProps: DialogProps;
  onSelect: (tokenBalance: TokenBalance) => void;
  excludeToken?: TokenBalance;
}

function SelectTokenBalanceDialog({
  dialogProps,
  onSelect,
  excludeToken,
}: Props) {
  const { onClose } = dialogProps;
  const { chainId } = useWeb3React();

  const { formatMessage } = useIntl();

  const tokenBalancesQuery = useERC20BalancesProxyAllowancesQuery();

  const [value, setValue] = useState('');

  const tokenBalances = tokenBalancesQuery.data;

  const handelClose = () => {
    onClose!({}, 'backdropClick');
    setValue('');
  };

  const withoutExcludeBalances = useMemo(() => {
    return tokenBalances?.filter((token: any) => {
      return excludeToken !== token;
    });
  }, [excludeToken]);

  const filteredTokenBalances = useMemo(() => {
    return withoutExcludeBalances?.filter((tokenBalance: any) => {
      return (
        tokenBalance.token.name.toLowerCase().search(value.toLowerCase()) >
          -1 ||
        tokenBalance.token.symbol.toLowerCase().search(value.toLowerCase()) > -1
      );
    });
  }, [withoutExcludeBalances, value]);

  const handleChangeSearch = useCallback((value: string) => {
    setValue(value);
  }, []);

  return (
    <Dialog {...dialogProps} onClose={handelClose}>
      <AppDialogTitle
        title={
          <FormattedMessage id="select.a.coin" defaultMessage="Select a coin" />
        }
        onClose={handelClose}
      />
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SearchTextField
              TextFieldProps={{
                fullWidth: true,
                size: 'medium',
                placeholder: formatMessage({
                  id: 'search.for.a.coin',
                  defaultMessage: 'Search for a coin',
                }),
              }}
              onChange={handleChangeSearch}
            />
          </Grid>
          <Grid item xs={12}>
            {chainId !== undefined && (
              <List disablePadding>
                {filteredTokenBalances?.map(
                  (tokenBalance: TokenBalance, index: number) => (
                    <SelectTokenDialogListItem
                      key={index}
                      tokenBalance={tokenBalance}
                      onSelect={onSelect}
                      chainId={chainId}
                    />
                  )
                )}
              </List>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default memo(SelectTokenBalanceDialog);
