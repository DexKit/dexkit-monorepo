import { Box, Button, Divider, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import { EVM_CHAINS } from '@dexkit/evm-chains/constants';
import { useActiveChainIds } from '@dexkit/ui';
import Add from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';

import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import NetworksContainerList from '../NetworksContainerList';
import SearchNetworksDialog from '../dialogs/SearchNetworksDialog';
import ViewNetworkInfoDialog from '../dialogs/ViewNetworkInfoDialog';

export interface NetworksWizardContainerProps {
  siteId?: number;
  config: Partial<AppConfig>;
  initialConfig?: Partial<AppConfig>;
  onSave: (config: Partial<AppConfig>) => void;
  onChange: (config: Partial<AppConfig>) => void;
  onHasChanges?: (changes: boolean) => void;
}

export default function NetworksWizardContainer({
  siteId,
  onSave,
  config,
  initialConfig,
  onChange,
  onHasChanges,
}: NetworksWizardContainerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { formatMessage } = useIntl();
  const [hasChanged, setHasChanged] = useState(false);

  const { activeChainIds } = useActiveChainIds();

  const { enqueueSnackbar } = useSnackbar();

  const [exclude, setExclude] = useState<number[]>([]);
  const [currentActive, setCurrentActive] = useState<number[]>(
    config?.activeChainIds || activeChainIds
  );
  const [isEditing, setIsEditing] = useState(false);
  const initialConfigRef = useRef<number[]>((initialConfig?.activeChainIds || config?.activeChainIds || []));

  useEffect(() => {
    if (initialConfig?.activeChainIds && !isEditing) {
      const serverConfigIds = initialConfig.activeChainIds;
      const configChanged =
        initialConfigRef.current.length !== serverConfigIds.length ||
        !initialConfigRef.current.every((id) => serverConfigIds.includes(id)) ||
        !serverConfigIds.every((id) => initialConfigRef.current.includes(id));

      if (configChanged) {
        initialConfigRef.current = [...serverConfigIds];
      }
    }

    if (config?.activeChainIds && !isEditing) {
      const configIds = config.activeChainIds;

      setCurrentActive((prevCurrentActive) => {
        const arraysEqual =
          configIds.length === prevCurrentActive.length &&
          configIds.every((id, index) => id === prevCurrentActive[index]);

        if (!arraysEqual) {
          return configIds;
        }
        return prevCurrentActive;
      });
    }
  }, [config?.activeChainIds, initialConfig?.activeChainIds, isEditing]);

  useEffect(() => {
    const initialChainIds = initialConfig?.activeChainIds || initialConfigRef.current;
    const arraysEqual =
      initialChainIds.length === currentActive.length &&
      initialChainIds.every((id) => currentActive.includes(id)) &&
      currentActive.every((id) => initialChainIds.includes(id));

    if (arraysEqual) {
      if (onHasChanges) {
        onHasChanges(false);
      }
      setHasChanged(false);
    } else {
      if (onHasChanges) {
        onHasChanges(true);
      }
      setHasChanged(true);
    }
  }, [currentActive, initialConfig?.activeChainIds, onHasChanges]);

  const handleChange = (active: number[]) => {
    setExclude(active);
  };

  const handleSave = () => {
    if (currentActive.length > 0) {
      onSave({
        ...config,
        activeChainIds: currentActive,
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (exclude.length > 0) {
        const newActiveChainIds = currentActive.filter((c: any) => !exclude.includes(c));

        if (newActiveChainIds.length > 0) {
          setCurrentActive(newActiveChainIds);

          if (onChange) {
            onChange({
              ...config,
              activeChainIds: newActiveChainIds,
            });
          }

          onSave({
            ...config,
            activeChainIds: newActiveChainIds,
          });

          setExclude([]);
          setIsEditing(false);
        } else {
          enqueueSnackbar(
            formatMessage({
              id: 'you.need.at.least.one.network.selected',
              defaultMessage: 'You need at least one network selected'
            }),
            { variant: 'warning' }
          );
        }
      }
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  const [showNetworks, setShowNetworks] = useState(false);

  const handleSelect = async (ids: number[]) => {
    setShowNetworks(false);

    try {
      const newIds = ids.filter((id) => !currentActive.includes(id));
      const newActiveChainIds = [...currentActive, ...newIds];

      setCurrentActive(newActiveChainIds);

      setHasChanged(true);
      if (onHasChanges) {
        onHasChanges(true);
      }

      if (onChange) {
        onChange({
          ...config,
          activeChainIds: newActiveChainIds,
        });
      }
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  const handleClose = () => {
    setShowNetworks(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAddNetwork = () => {
    setShowNetworks(true);
  };

  const [networkInfo, setNetworkInfo] = useState<{
    name: string;
    symbol: string;
    chainId: number;
    decimals: number;
  }>();

  const handleCloseNetworkInfo = () => {
    setNetworkInfo(undefined);
  };

  return (
    <>
      {showNetworks && (
        <SearchNetworksDialog
          DialogProps={{
            open: showNetworks,
            onClose: handleClose,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          excludeChainIds={EVM_CHAINS.map((c) => c.chainId).filter((c) =>
            currentActive.includes(c),
          )}
          onSelect={handleSelect}
        />
      )}
      {networkInfo && (
        <ViewNetworkInfoDialog
          DialogProps={{
            open: Boolean(networkInfo),
            onClose: handleCloseNetworkInfo,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          network={networkInfo}
        />
      )}
      <Box>
        <Grid container spacing={isMobile ? 1.5 : 3}>
          <Grid size={12}>
            <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{
                  fontSize: isMobile ? '1.15rem' : '1.5rem',
                  fontWeight: 600,
                  mb: 0.5
                }}
              >
                <FormattedMessage id="networks" defaultMessage="Networks" />
              </Typography>
              <Typography
                variant={isMobile ? 'body2' : 'body1'}
                color="text.secondary"
                sx={{
                  fontSize: isMobile ? '0.85rem' : 'inherit',
                }}
              >
                <FormattedMessage
                  id="manage.networks.for.your.app"
                  defaultMessage="Manage networks for your app"
                />
              </Typography>
            </Stack>
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <Grid
              container
              spacing={isMobile ? 1 : 2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid>
                <Button
                  onClick={handleAddNetwork}
                  variant="contained"
                  startIcon={<Add />}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    fontSize: isMobile ? "0.875rem" : undefined,
                    py: isMobile ? 0.75 : undefined,
                    px: isMobile ? 2 : undefined,
                  }}
                >
                  <FormattedMessage
                    id="add.network"
                    defaultMessage="Add Network"
                  />
                </Button>
              </Grid>
              <Grid>
                {isEditing ? (
                  <Box>
                    <Stack spacing={1} direction="row">
                      <Button
                        size={isMobile ? "small" : "medium"}
                        onClick={handleDelete}
                        variant="outlined"
                        startIcon={<Delete />}
                        color="error"
                        sx={{
                          fontSize: isMobile ? "0.875rem" : undefined,
                          py: isMobile ? 0.75 : undefined,
                          px: isMobile ? 2 : undefined,
                        }}
                      >
                        <FormattedMessage id="remove" defaultMessage="Remove" />
                      </Button>
                      <Button
                        size={isMobile ? "small" : "medium"}
                        onClick={handleCancel}
                        startIcon={<Close />}
                        sx={{
                          fontSize: isMobile ? "0.875rem" : undefined,
                          py: isMobile ? 0.75 : undefined,
                          px: isMobile ? 2 : undefined,
                        }}
                      >
                        <FormattedMessage id="cancel" defaultMessage="Cancel" />
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <Button
                    size={isMobile ? "small" : "medium"}
                    onClick={handleEdit}
                    variant="outlined"
                    startIcon={<Edit />}
                    sx={{
                      fontSize: isMobile ? "0.875rem" : undefined,
                      py: isMobile ? 0.75 : undefined,
                      px: isMobile ? 2 : undefined,
                    }}
                  >
                    <FormattedMessage id="edit" defaultMessage="Edit" />
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid size={12}>
            {currentActive.length === 0 && (
              <Stack
                sx={{ p: isMobile ? 1 : 2 }}
                justifyContent={'center'}
                alignContent={'center'}
                alignItems={'center'}
              >
                <Box>
                  <Typography
                    textAlign="center"
                    variant={isMobile ? 'subtitle1' : 'h5'}
                    sx={{
                      fontWeight: 600,
                      fontSize: isMobile ? '1.1rem' : '1.5rem'
                    }}
                  >
                    <FormattedMessage
                      id="no.selected.networks"
                      defaultMessage="No selected networks"
                    />
                  </Typography>
                  <Typography
                    textAlign="center"
                    variant={isMobile ? 'body2' : 'body1'}
                    color="text.secondary"
                    sx={{
                      fontSize: isMobile ? '0.85rem' : 'inherit',
                    }}
                  >
                    <FormattedMessage
                      id="you.need.at.least.one.network.selected"
                      defaultMessage="You need at least one network selected"
                    />
                  </Typography>
                </Box>
              </Stack>
            )}
          </Grid>
          {/*activeNetworksQuery.isLoading &&
                new Array(4).fill(null).map((_, key) => (
                  <ListItem key={key}>
                    <ListItemText primary={<Skeleton />} />
                  </ListItem>
                ))*/}
          <Grid size={12}>
            <Divider />
            <NetworksContainerList
              networks={EVM_CHAINS}
              onChange={handleChange}
              isEditing={isEditing}
              activeChainIds={currentActive}
              excludeEdit={exclude}
              onShowInfo={(network: any) => setNetworkInfo(network)}
            />
          </Grid>

          <Grid size={12}>
            <Stack spacing={1} direction="row" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!hasChanged || currentActive.length === 0}
                size={isMobile ? "small" : "medium"}
                sx={{
                  fontSize: isMobile ? "0.875rem" : undefined,
                  py: isMobile ? 0.75 : undefined,
                  px: isMobile ? 2 : undefined,
                }}
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
