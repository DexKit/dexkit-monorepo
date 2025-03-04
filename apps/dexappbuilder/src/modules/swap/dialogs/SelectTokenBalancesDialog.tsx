import { ChainId, TOKEN_ICON_URL } from '@dexkit/core/constants';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
    Avatar,
    Dialog,
    DialogContent,
    DialogProps,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Skeleton,
    TextField,
    Typography,
} from '@mui/material';
import { memo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useERC20BalancesProxyAllowancesQuery } from '@dexkit/ui/hooks/balances';

import { Token, TokenBalance } from '../../../types/blockchain';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { useTokenList } from '@dexkit/ui/hooks/blockchain';
import SelectTokenDialogListItem from './SelectTokenDialogListItem';

interface Props {
  dialogProps: DialogProps;
  onSelect: (token: Token) => void;
  excludeToken?: Token;
  selectedChainId?: ChainId;
}

function SelectTokenBalanceDialog({
  dialogProps,
  onSelect,
  excludeToken,
  selectedChainId,
}: Props) {
  const { onClose } = dialogProps;
  const { chainId, isActive } = useWeb3React();
  const tokens = useTokenList({
    chainId: selectedChainId,
    includeNative: true,
  });

  const tokenBalancesQuery = useERC20BalancesProxyAllowancesQuery(
    tokens,
    undefined,
    selectedChainId || chainId,
    false,
  );

  const [value, setValue] = useState('');

  const tokenBalances = tokenBalancesQuery.data;

  const handelClose = () => {
    onClose!({}, 'backdropClick');
    setValue('');
  };

  return (
    <Dialog {...dialogProps} onClose={handelClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="select.a.token"
            defaultMessage={'Select a token'}
            description={'Select a token message'}
          />
        }
        onClose={handelClose}
      />
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              placeholder="Search for a token name"
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            {tokenBalancesQuery.isLoading && (
              <List disablePadding>
                {Array(5)
                  .fill(1)
                  .map((_, index) => (
                    <ListItem button key={index}>
                      <ListItemIcon>
                        <Skeleton>
                          <Avatar
                            sx={(theme) => ({
                              width: theme.spacing(4),
                              height: theme.spacing(4),
                            })}
                          >
                            TK
                          </Avatar>
                        </Skeleton>
                      </ListItemIcon>

                      <Skeleton>
                        {' '}
                        <ListItemText primary={'tk'} secondary={'TOKEN'} />
                      </Skeleton>

                      <ListItemSecondaryAction>
                        <Skeleton>
                          {' '}
                          <Typography>0.00</Typography>
                        </Skeleton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
              </List>
            )}

            {isActive && chainId ? (
              <List disablePadding>
                {tokenBalances
                  ?.filter((token) => {
                    return excludeToken !== token.token;
                  })
                  ?.filter((tokenBalance) => {
                    return (
                      tokenBalance.token.name
                        .toLowerCase()
                        .search(value.toLowerCase()) > -1 ||
                      tokenBalance.token.symbol
                        .toLowerCase()
                        .search(value.toLowerCase()) > -1
                    );
                  })
                  .map((tokenBalance: TokenBalance, index: number) => (
                    <SelectTokenDialogListItem
                      key={index}
                      tokenBalance={tokenBalance}
                      onSelect={onSelect}
                      chainId={chainId}
                    />
                  ))}
              </List>
            ) : (
              <List disablePadding>
                {tokens
                  ?.filter((token) => {
                    return excludeToken !== token;
                  })
                  ?.filter((token) => {
                    return (
                      token.name.toLowerCase().search(value.toLowerCase()) >
                        -1 ||
                      token.symbol.toLowerCase().search(value.toLowerCase()) >
                        -1
                    );
                  })
                  .map((token: Token, index: number) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => onSelect(token)}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={(theme) => ({
                            width: 'auto',
                            height: theme.spacing(4),
                          })}
                          src={
                            token.logoURI
                              ? token.logoURI
                              : TOKEN_ICON_URL(
                                  token.address,
                                  selectedChainId as ChainId,
                                )
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={token.symbol}
                        secondary={token.name}
                      />
                    </ListItem>
                  ))}
              </List>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default memo(SelectTokenBalanceDialog);
