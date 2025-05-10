import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import TokensSectionList from '../sections/TokensSectionList';

import Search from '@mui/icons-material/Search';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { Token } from '../../../../types/blockchain';
import {
  DEXKIT_TOKENLIST_URL,
  GEMINI_TOKENLIST_URL,
  UNISWAP_DEFAULT_TOKENLIST_URL,
} from '../../constants';
import { useTokenListUrl } from '../../hooks';
import { TOKEN_KEY } from '../../utils';

interface Props {
  dialogProps: DialogProps;
  tokens: Token[];
  onSave: (tokens: Token[]) => void;
}

export default function ImportTokenListDialog({
  dialogProps,
  tokens,
  onSave,
}: Props) {
  const { onClose } = dialogProps;

  const { formatMessage } = useIntl();

  const [search, setSearch] = useState('');

  const [tokenListUrl, setTokenListUrl] = useState<string>();

  const { data: tokenList, isLoading: isListLoading } =
    useTokenListUrl(tokenListUrl);

  const [selectedKeys, setSelectedKeys] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    setSelectedKeys((value) => {
      const newKeys: {
        [key: string]: boolean;
      } = {};

      return newKeys;
    });
  }, [String(tokenList), String(tokens)]);

  const handleSelectToken = useCallback((key: string) => {
    setSelectedKeys((value) => {
      if (!Boolean(value[key])) {
        return { ...value, [key]: true };
      }
      const newObj = { ...value };
      delete newObj[key];
      return newObj;
    });
  }, []);

  const handleUniswapList = () => {
    setTokenListUrl(UNISWAP_DEFAULT_TOKENLIST_URL);
  };

  const handleGeminiList = () => {
    setTokenListUrl(GEMINI_TOKENLIST_URL);
  };

  const handleDexKitList = () => {
    setTokenListUrl(DEXKIT_TOKENLIST_URL);
  };

  const handleClearList = () => {
    setTokenListUrl(undefined);
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }

    handleClearList();
    setSearch('');
  };

  const handleSelectAllTokens = () => {
    if (!tokenList) {
      return;
    }

    let indexes: {
      [key: string]: boolean;
    } = {};

    for (let t of tokenList) {
      const key = TOKEN_KEY(t);

      if (selectedKeys[key] !== undefined) {
        delete indexes[key];
      } else {
        indexes[key] = true;
      }
    }

    setSelectedKeys(indexes);
  };

  const handleSaveTokens = () => {
    if (tokenList) {
      onSave(
        tokenList.filter((token) => {
          return Boolean(selectedKeys[TOKEN_KEY(token)]);
        }),
      );

      handleClose();
    }
  };

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const hasSelectedTokens = useMemo(() => {
    return Object.keys(selectedKeys).length > 0;
  }, [selectedKeys]);

  const renderList = () => {
    if (isListLoading) {
      return (
        <List>
          <ListItem onClick={handleUniswapList}>
            <ListItemAvatar>
              <Skeleton
                variant="circular"
                sx={(theme) => ({
                  height: theme.spacing(5),
                  width: theme.spacing(5),
                })}
              />
            </ListItemAvatar>
            <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
          </ListItem>
          <ListItem onClick={handleUniswapList}>
            <ListItemAvatar>
              <Skeleton
                sx={(theme) => ({
                  height: theme.spacing(5),
                  width: theme.spacing(5),
                })}
                variant="circular"
              />
            </ListItemAvatar>
            <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
          </ListItem>
          <ListItem onClick={handleUniswapList}>
            <ListItemAvatar>
              <Skeleton
                sx={(theme) => ({
                  height: theme.spacing(5),
                  width: theme.spacing(5),
                })}
                variant="circular"
              />
            </ListItemAvatar>
            <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
          </ListItem>
        </List>
      );
    }

    return (
      <Box>
        <List disablePadding>
          <ListItemButton onClick={handleUniswapList}>
            <ListItemAvatar>
              <Avatar src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png" />
            </ListItemAvatar>
            <ListItemText primary="Uniswap Labs Default" />
          </ListItemButton>
          <Divider />
          <ListItemButton onClick={handleGeminiList}>
            <ListItemAvatar>
              <Avatar src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd/logo.png" />
            </ListItemAvatar>
            <ListItemText primary="Gemini Token List" />
          </ListItemButton>
          <Divider />
          <ListItemButton onClick={handleDexKitList}>
            <ListItemAvatar>
              <Avatar src="https://raw.githubusercontent.com/DexKit/assets/main/images/logo_256x256.png" />
            </ListItemAvatar>
            <ListItemText primary="DexKit Token List" />
          </ListItemButton>
        </List>
      </Box>
    );
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="import.token.lists"
            defaultMessage="Import Token lists"
          />
        }
        onClose={handleClose}
      />
      {tokenList && (
        <>
          <Stack>
            <Divider />
            <Box sx={{ py: 2, px: 2 }}>
              <TextField
                fullWidth
                value={search}
                type="search"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
                onChange={handleChangeSearch}
                placeholder={formatMessage({
                  id: 'search.for.token',
                  defaultMessage: 'Search for tokens...',
                })}
              />
            </Box>
            <Divider />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ py: 1, px: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <IconButton onClick={handleClearList}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="body1">
                  <FormattedMessage id="lists" defaultMessage="Lists" />
                </Typography>
              </Stack>
              <Button onClick={handleSelectAllTokens}>
                <FormattedMessage id="select.all" defaultMessage="Select all" />
              </Button>
            </Stack>
          </Stack>
        </>
      )}
      <DialogContent dividers sx={{ p: 0 }}>
        {tokenList ? (
          <TokensSectionList
            selectable
            tokens={tokenList}
            search={search}
            selectedKeys={selectedKeys}
            onSelect={handleSelectToken}
          />
        ) : (
          renderList()
        )}
      </DialogContent>
      {tokenList && (
        <DialogActions>
          <Button
            onClick={handleSaveTokens}
            disabled={!hasSelectedTokens}
            variant="contained"
          >
            <FormattedMessage id="import" defaultMessage="Import" />
          </Button>
          <Button onClick={handleClose}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
