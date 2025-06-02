import { Network } from '@dexkit/core/types';
import { isAddressEqual } from '@dexkit/core/utils/blockchain';
import { AppConfirmDialog } from '@dexkit/ui';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import Delete from '@mui/icons-material/Delete';
import Search from '@mui/icons-material/Search';
import { Box, Container, IconButton, InputAdornment } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SiteResponse } from 'src/types/whitelabel';
import { Token } from '../../../../types/blockchain';
import { StepperButtonProps } from '../../types';
import { TOKEN_KEY } from '../../utils';
import TokensTable from '../sections/TokensTable';
import TokensTableNetworkAutocomplete from '../sections/TokensTableNetworkAutocomplete';
import { StepperButtons } from '../steppers/StepperButtons';

import Close from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useSnackbar } from 'notistack';

const AddTokenDialog = dynamic(() => import('../dialogs/AddTokenDialog'));

interface Props {
  config: AppConfig;
  site?: SiteResponse | null;
  onSave: (config: AppConfig) => void;
  onHasChanges?: (hasChanges: boolean) => void;
  isOnStepper?: boolean;
  isSwap?: boolean;
  stepperButtonProps?: StepperButtonProps;
}

export default function TokenWizardContainer({
  site,
  config,
  onSave,
  isOnStepper,
  onHasChanges,
  stepperButtonProps,
  isSwap,
}: Props) {
  const [hasChanged, setHasChanged] = useState(false);

  const [selectedNetwoks, setSelectedNetworks] = useState<Network[]>([]);

  const [search, setSearch] = useState('');
  const [showAddToken, setShowAddToken] = useState(false);
  const [showRemoveTokens, setShowRemoveTokens] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);

  const appUrl = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      return `http://localhost:3000`;
    } else if (site?.domain) {
      return `https://${site?.domain}`;
    }

    if (site?.previewUrl) {
      return site?.previewUrl;
    }
  }, [site]);

  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [hasChanged, onHasChanges]);

  const [selectedKeys, setSelectedKeys] = useState<{
    [key: string]: boolean;
  }>({});

  const [tokens, setTokens] = useState<Token[]>(
    config?.tokens?.length ? config?.tokens[0].tokens || [] : [],
  );

  const handleMakeTradable = useCallback((key: string) => {
    setTokens((tokens: Token[]) => {
      const newTokens = [...tokens];
      const index = newTokens.findIndex((t) => TOKEN_KEY(t) === key);

      if (index > -1) {
        const token = { ...newTokens[index] } as Token;

        if (token.tradable) {
          token.tradable = false;
        } else {
          token.tradable = true;
        }

        newTokens[index] = token;
        setHasChanged(true);
      }

      return newTokens;
    });
  }, []);

  const handleDisableFeatured = (key: string) => {
    setTokens((tokens) => {
      const newTokens = [...tokens];
      const index = newTokens.findIndex((t) => TOKEN_KEY(t) === key);

      if (index > -1) {
        const token = { ...newTokens[index] } as Token;

        if (token?.disableFeatured) {
          token.disableFeatured = false;
        } else {
          token.disableFeatured = true;
        }

        newTokens[index] = token;

        setHasChanged(true);
      }

      return newTokens;
    });
  };

  const handleRemoveTokens = () => {
    setShowRemoveTokens(true);
  };

  const handleSaveTokens = useCallback((tokens: Token[]) => {
    setTokens((value) => {
      let filteredTokens = tokens.filter((newToken) => {
        const token = value.find(
          (t) =>
            isAddressEqual(t.address, newToken.address) &&
            Number(t.chainId) === Number(newToken.chainId),
        );

        return !token;
      });
      setHasChanged(true);
      return [...value, ...filteredTokens];
    });
  }, []);

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

  const handleSelectAllTokens = () => {
    let indexes: {
      [key: string]: boolean;
    } = {};

    for (let t of tokens) {
      const key = TOKEN_KEY(t);

      if (selectedKeys[key] !== undefined) {
        delete indexes[key];
      } else {
        indexes[key] = true;
      }
    }

    setSelectedKeys(indexes);
  };
  const handleSave = () => {
    const newConfig = {
      ...config,
      tokens: [
        {
          name: 'Custom List',
          keywords: ['custom list'],
          tokens: tokens,
        },
      ],
    };
    onSave(newConfig);
  };

  const handleChangeSelectedNetworks = (networks: Network[]) => {
    setSelectedNetworks(networks);
  };

  const { formatMessage } = useIntl();

  const handleChangeSearch = (value: string) => {
    setSearch(value);
  };

  const handleSaveToken = (tokens: Token[]) => {
    setShowAddToken(false);

    setTokens((value) => {
      setHasChanged(true);

      const newArr = tokens.filter((t) => {
        const found = value.find(
          (o) =>
            o.chainId === t.chainId && isAddressEqual(o.address, t.address),
        );

        return !found;
      });

      return [...value, ...newArr];
    });
  };

  const handleCloseAddToken = () => {
    setShowAddToken(false);
  };

  const handleCloseConfirmRemove = () => {
    setShowRemoveTokens(false);
    setSelection([]);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleConfirmRemove = () => {
    setHasChanged(true);

    setTokens((value) => {
      let newTokens = value.filter((token) => {
        if (selection.includes(TOKEN_KEY(token))) {
          return false;
        }

        return true;
      });

      return newTokens;
    });

    enqueueSnackbar(
      selection.length > 1 ? (
        <FormattedMessage
          id="Remove.len.tokens"
          defaultMessage="Removed {len} tokens"
          values={{ len: selection.length }}
        />
      ) : (
        <FormattedMessage id="token.removed" defaultMessage="Token removed" />
      ),
      { variant: 'success' },
    );

    setShowRemoveTokens(false);
  };

  const selectedTokenCount = 0;

  const handleShowAddToken = () => {
    setShowAddToken(true);
  };

  const handleChangeSelection = (selection: string[]) => {
    setSelection(selection);
  };

  const [openHasChangesConfirm, setOpenHasChangesConfirm] = useState(false);

  const handleConfirmCancel = () => {
    setOpenHasChangesConfirm(false);
    setHasChanged(false);
    setTokens(config?.tokens?.length ? config?.tokens[0].tokens ?? [] : []);
  };
  return (
    <Container>
      <AppConfirmDialog
        DialogProps={{
          open: openHasChangesConfirm,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: () => setOpenHasChangesConfirm(false),
        }}
        onConfirm={handleConfirmCancel}
        title={
          <FormattedMessage
            id="discard.changes"
            defaultMessage="Discard Changes"
          />
        }
        actionCaption={
          <FormattedMessage id="discard" defaultMessage="Discard" />
        }
      >
        <Stack>
          <Typography variant="body1">
            <FormattedMessage
              id="are.you.sure.you.want.to.discard.your.changes?"
              defaultMessage="Are you sure you want to discard your changes?"
            />
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <FormattedMessage
              id="if.you.discard.now.your.changes.will.be.lost."
              defaultMessage="If you discard now, your changes will be lost."
            />
          </Typography>
        </Stack>
      </AppConfirmDialog>
      {showAddToken && (
        <AddTokenDialog
          tokens={tokens}
          onSave={handleSaveToken}
          dialogProps={{
            maxWidth: 'xs',
            fullWidth: true,
            open: showAddToken,
            onClose: handleCloseAddToken,
          }}
        />
      )}

      <AppConfirmDialog
        DialogProps={{
          maxWidth: 'xs',
          fullWidth: true,
          open: showRemoveTokens,
          onClose: handleCloseConfirmRemove,
        }}
        onConfirm={handleConfirmRemove}
        title={
          <FormattedMessage
            id="delete.token.alt"
            defaultMessage="Delete Token(s)"
          />
        }
        actionCaption={<FormattedMessage id="delete" defaultMessage="Delete" />}
      >
        <FormattedMessage
          id="Are.you.sure.you.want.to.delete.the.token.s"
          defaultMessage="Are you sure you want to delete the token(s)?"
        />
      </AppConfirmDialog>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant={'h6'}>
              <FormattedMessage id="tokens" defaultMessage="Tokens" />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="select.or.import.tokens.for.your.app"
                defaultMessage="Select or import tokens for your app"
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ py: 2 }}>
            <Button
              onClick={handleShowAddToken}
              startIcon={<SaveAltIcon />}
              variant="contained"
            >
              <FormattedMessage
                id="import.token"
                defaultMessage="Import Token"
              />
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid justifyContent="center" container spacing={2}>
            <Grid item xs={12} sm={9}>
              <Box pt={2}>
                <Grid
                  container
                  alignItems="flex-end"
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Grid item xs={12} sm={4}>
                    <TokensTableNetworkAutocomplete
                      selectedNetwoks={selectedNetwoks}
                      onChange={handleChangeSelectedNetworks}
                    />
                  </Grid>
                  <Grid item>
                    <Box>
                      <Stack direction="row" spacing={2}>
                        {selection.length > 0 && (
                          <Button
                            color="error"
                            variant="outlined"
                            startIcon={<Delete />}
                            onClick={handleRemoveTokens}
                          >
                            <FormattedMessage
                              id="delete"
                              defaultMessage="Delete"
                            />
                          </Button>
                        )}

                        <LazyTextField
                          TextFieldProps={{
                            variant: 'standard',
                            placeholder: formatMessage({
                              id: 'search.dots',
                              defaultMessage: 'Search...',
                            }),
                            InputProps: {
                              startAdornment: (
                                <InputAdornment sx={{ pr: 1 }} position="start">
                                  <Search />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    size="small"
                                    onClick={() => setSearch('')}
                                    sx={{ color: 'text.secondary' }}
                                  >
                                    <Close color="inherit" fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                          }}
                          value={search}
                          onChange={handleChangeSearch}
                        />
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Grid justifyContent="center" container spacing={2}>
                <Grid item xs={12} sm={9}>
                  <TokensTable
                    tokens={tokens}
                    search={search}
                    networks={selectedNetwoks}
                    appUrl={appUrl}
                    onDisableFeatured={handleDisableFeatured}
                    onMakeTradable={handleMakeTradable}
                    onChangeSelection={handleChangeSelection}
                    selection={selection}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12}>
          <TokensSection
            onSelect={handleSelectToken}
            onSave={handleSaveTokens}
            onSelectAll={handleSelectAllTokens}
            selectedKeys={selectedKeys}
            onRemove={handleRemoveTokens}
            tokens={tokens}
            appUrl={appUrl}
            onMakeTradable={isSwap ? undefined : handleMakeTradable}
            onDisableFeatured={isSwap ? handleDisableFeatured : undefined}
          />
        </Grid> */}
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          {isOnStepper ? (
            <StepperButtons
              {...stepperButtonProps}
              handleNext={() => {
                handleSave();
                if (stepperButtonProps?.handleNext) {
                  stepperButtonProps.handleNext();
                }
              }}
              disableContinue={false}
            />
          ) : (
            <Stack spacing={1} direction="row" justifyContent="flex-end">
              <Button
                onClick={() => setOpenHasChangesConfirm(true)}
                disabled={!hasChanged}
              >
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!hasChanged}
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
