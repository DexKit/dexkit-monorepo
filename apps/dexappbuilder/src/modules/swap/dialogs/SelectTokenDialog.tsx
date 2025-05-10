import { ChainId, TOKEN_ICON_URL } from '@dexkit/core/constants';
import Close from '@mui/icons-material/Close';
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { memo, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { TokenWhitelabelApp } from '@dexkit/core/types';
import { useTokenList } from '@dexkit/ui/hooks/blockchain';
import { useTokenData } from '@dexkit/ui/hooks/useTokenData';
import { Token } from '../../../types/blockchain';

interface Props {
  dialogProps: DialogProps;
  enableImport?: boolean;
  onSelect: (token: Token) => void;
  excludeToken?: Token;
  chainId?: ChainId;
  includeNative?: boolean;
}

function SelectTokenDialog({
  dialogProps,
  onSelect,
  enableImport,
  excludeToken,
  chainId,
  includeNative = true,
}: Props) {
  const { onClose } = dialogProps;
  const tokens = useTokenList({ chainId, includeNative });
  const [value, setValue] = useState('');

  const handleClose = () => {
    onClose!({}, 'backdropClick');
    setValue('');
  };

  const { data, isLoading } = useTokenData({
    address: enableImport ? value : undefined,
    chainId,
  });

  const allTokens = useMemo(() => {
    if (data) {
      const tokenExists = tokens.find(
        (t) => t.address.toLowerCase() === data?.address.toLowerCase(),
      );
      if (tokenExists) {
        return tokens;
      } else {
        return [...tokens, data as TokenWhitelabelApp];
      }
    }

    return tokens;
  }, [tokens, data]);

  const filteredTokens = useMemo(() => {
    return allTokens
      ?.filter((token) => {
        return excludeToken !== token;
      })
      ?.filter((token) => {
        return (
          token.name.toLowerCase().search(value.toLowerCase()) > -1 ||
          token.symbol.toLowerCase().search(value.toLowerCase()) > -1 ||
          token.address.toLowerCase().search(value.toLowerCase()) > -1
        );
      });
  }, [allTokens, value]);

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="select.a.token"
            defaultMessage={'Select a token'}
            description={'Select a token message'}
          />
        </Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ px: 2 }}>
              <TextField
                placeholder={
                  enableImport
                    ? 'Search for a token name or paste address'
                    : 'Search for a token name'
                }
                fullWidth
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <List disablePadding>
              {filteredTokens.map((token: Token, index: number) => (
                <ListItemButton key={index} onClick={() => onSelect(token)}>
                  <ListItemIcon>
                    <Avatar
                      sx={(theme) => ({
                        width: 'auto',
                        height: theme.spacing(4),
                      })}
                      src={
                        token?.logoURI
                          ? token?.logoURI
                          : TOKEN_ICON_URL(token?.address, chainId as ChainId)
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={token?.symbol}
                    secondary={token?.name}
                  />
                </ListItemButton>
              ))}
              {filteredTokens &&
                filteredTokens.length === 0 &&
                (enableImport && isLoading ? (
                  <ListItemButton>
                    <Skeleton>
                      <ListItemIcon>
                        <Avatar
                          sx={(theme) => ({
                            width: 'auto',
                            height: theme.spacing(4),
                          })}
                        />
                      </ListItemIcon>
                    </Skeleton>
                    <Skeleton>
                      <ListItemText
                        primary={
                          <FormattedMessage
                            defaultMessage={'Importing...'}
                            id={'importing.with.final.dots'}
                          />
                        }
                      />
                    </Skeleton>
                  </ListItemButton>
                ) : (
                  <ListItemButton>
                    <FormattedMessage
                      defaultMessage={'No tokens found'}
                      id={'not.tokens.found'}
                    />
                  </ListItemButton>
                ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default memo(SelectTokenDialog);
