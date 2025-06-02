import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import {
  Button,
  Divider,
  Grid,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridSortModel,
  GridToolbar,
} from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useThemeMode } from 'src/hooks/app';
import { SiteResponse } from '../../../../types/whitelabel';
import {
  useAppVersionListQuery,
  useAppVersionQuery,
  useDeleteAppVersionMutation,
  useSetAppVersionMutation,
} from '../../hooks';
import { generateCSSVarsTheme } from '../../utils';
import AddAppVersionFormDialog from '../dialogs/AddAppVersionFormDialog';
import InfoDialog from '../dialogs/InfoDialog';
const PreviewPageDialog = dynamic(() => import('../dialogs/PreviewPageDialog'));

interface AppVersion {
  id: number;
  version: string;
  createdAt: number;
  description: string;
}

interface TableProps {
  site?: SiteResponse | null;
  onClickDelete({ version }: { version: AppVersion }): void;
  onClickEdit({ version }: { version: AppVersion }): void;
  onClickSetVersion({ version }: { version: AppVersion }): void;
  onClickPreview({ version }: { version: AppVersion }): void;
  versions?: AppVersion[];
}

interface Props {
  site?: SiteResponse | null;
}

export function PreviewVersionDialog({
  versionId,
  siteId,
  showPreview,
  setShowPreview,
}: {
  versionId?: number;
  siteId?: number;
  showPreview: boolean;
  setShowPreview: any;
}) {
  const { mode } = useThemeMode();
  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const { data } = useAppVersionQuery({ appVersionId: versionId, siteId });
  const appConfig = data?.config ? JSON.parse(data?.config) : undefined;

  const customThemeDark = useMemo(() => {
    if (appConfig?.customThemeDark) {
      return JSON.parse(appConfig?.customThemeDark);
    }
    return {};
  }, [appConfig?.customThemeDark]);

  const customThemeLight = useMemo(() => {
    if (appConfig?.customThemeLight) {
      return JSON.parse(appConfig?.customThemeLight);
    }
    return {};
  }, [appConfig?.customThemeLight]);

  const selectedTheme = useMemo(() => {
    if (!appConfig) {
      return extendTheme({});
    }

    return generateCSSVarsTheme({
      cssVarPrefix: 'theme-preview-version',
      selectedFont: appConfig?.font,
      customTheme: {
        colorSchemes: {
          dark: {
            ...customThemeDark,
          },
          light: {
            ...customThemeLight,
          },
        },
      },
      selectedThemeId: appConfig?.theme || '',
      mode,
    });
  }, [appConfig?.theme, appConfig?.font, customThemeLight, customThemeDark]);

  return (
    <>
      <CssVarsProvider theme={selectedTheme}>
        <PreviewPageDialog
          dialogProps={{
            open: showPreview,
            maxWidth: 'xl',
            fullWidth: true,
            onClose: handleClosePreview,
          }}
          appConfig={appConfig}
          disabled={true}
          sections={appConfig?.pages['home']?.sections}
          name="Home"
          withLayout={true}
        />
      </CssVarsProvider>
    </>
  );
}

function ExpandableCell({ value }: GridRenderCellParams) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {expanded ? value : value.slice(0, 100)}&nbsp;
      {value.length > 100 && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link
          type="button"
          component="button"
          sx={{ fontSize: 'inherit' }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'view less' : 'view more'}
        </Link>
      )}
    </div>
  );
}

function EmptyVersions() {
  return (
    <Stack
      spacing={1}
      justifyContent={'center'}
      alignContent={'center'}
      alignItems={'center'}
    >
      <WorkHistoryIcon sx={{ fontSize: '50px' }} />
      <Typography variant="h6">
        <FormattedMessage
          id={'no.app.versions'}
          defaultMessage={'No app versions'}
        />
      </Typography>
      <Typography variant="subtitle1">
        <FormattedMessage
          id={'add.versions.to.your.app'}
          defaultMessage={'Add versions to your app'}
        />
      </Typography>
    </Stack>
  );
}

function AppVersions({
  site,
  onClickDelete,
  onClickEdit,
  onClickPreview,
  onClickSetVersion,
}: TableProps) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {},
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useAppVersionListQuery({
    ...paginationModel,
    ...queryOptions,
    siteId: site?.id,
  });

  const [rowCountState, setRowCountState] = useState((data?.total as any) || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: number) =>
      data?.total !== undefined ? data?.total : prevRowCountState,
    );
  }, [data?.total, setRowCountState]);

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    // Here you save the data you need from the sort model
    setQueryOptions({
      ...queryOptions,
      sort:
        sortModel && sortModel.length
          ? [sortModel[0].field, sortModel[0].sort]
          : [],
    });
  }, []);

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    // Here you save the data you need from the filter model
    let filter = { ...queryOptions?.filter };
    if (filterModel.quickFilterValues?.length) {
      filter = {
        ...filter,
        q: filterModel.quickFilterValues[0],
      };
    }

    setQueryOptions({ ...queryOptions, filter });
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },

    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    },
    {
      field: 'version',
      headerName: 'Version',
      width: 150,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 350,
      renderCell: (params: GridRenderCellParams) => (
        <ExpandableCell {...params} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 240,
      renderCell: ({ row }) => {
        return (
          <Stack direction={'row'} spacing={1}>
            <Tooltip
              title={
                <FormattedMessage
                  id={'preview.app.version'}
                  defaultMessage={'Preview app version'}
                />
              }
            >
              <IconButton onClick={() => onClickPreview({ version: row })}>
                <PreviewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <FormattedMessage
                  id={'edit.version'}
                  defaultMessage={'Edit version'}
                />
              }
            >
              <IconButton onClick={() => onClickEdit({ version: row })}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <FormattedMessage
                  id={'set.app.to.this.version'}
                  defaultMessage={'Set app to this version'}
                />
              }
            >
              <IconButton onClick={() => onClickSetVersion({ version: row })}>
                <SettingsBackupRestoreIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <FormattedMessage
                  id={'delete.app.version'}
                  defaultMessage={'Delete app version'}
                />
              }
            >
              <IconButton
                color={'error'}
                onClick={() => onClickDelete({ version: row })}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  const rows = (data?.data as any) || [];

  return (
    <>
      <DataGrid
        autoHeight
        slots={{ toolbar: GridToolbar, noRowsOverlay: EmptyVersions }}
        rows={rows}
        columns={columns}
        rowCount={rowCountState}
        paginationModel={paginationModel}
        paginationMode="server"
        disableColumnFilter
        sortingMode="server"
        getRowHeight={() => 'auto'}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
        onPaginationModelChange={setPaginationModel}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        onSortModelChange={handleSortModelChange}
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
        loading={isLoading}
        sx={{ '--DataGrid-overlayHeight': '150px' }}
      />
    </>
  );
}

export default function AppVersionWizardContainer({ site }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [openInfo, setOpenInfo] = useState(false);
  const [openAddVersion, setOpenAddVersion] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [titleInfo, setTitleInfo] = useState('');
  const [contentInfo, setContentInfo] = useState('');

  const [selectedVersion, setSelectedVersion] = useState<
    AppVersion | undefined
  >(undefined);

  const [openConfirmRemove, setOpenConfirmRemove] = useState(false);

  const [openConfirmSetVersion, setOpenConfirmSetVersion] = useState(false);
  const setAppVersionMutation = useSetAppVersionMutation();
  const deleteAppVersionMutation = useDeleteAppVersionMutation();
  const { formatMessage } = useIntl();
  const handleClickDelete = ({ version }: { version: AppVersion }) => {
    setSelectedVersion(version);
    setOpenConfirmRemove(true);
  };

  const handleClickPreview = ({ version }: { version: AppVersion }) => {
    setSelectedVersion(version);
  };

  const handleClickEdit = ({ version }: { version: AppVersion }) => {
    setSelectedVersion(version);
    setOpenAddVersion(true);
  };

  const handleSetVersion = ({ version }: { version: AppVersion }) => {
    setSelectedVersion(version);
    setOpenConfirmSetVersion(true);
  };

  const handlePreviewVersion = ({ version }: { version: AppVersion }) => {
    setSelectedVersion(version);
    setShowPreview(true);
  };

  const handleAppVersionRemoved = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'App version removed',
        id: 'app.version.removed',
      }),
      {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  const handleAppVersionRemovedError = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Error on removing app version',
        id: 'error.removing.app.version',
      }),
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  const handleAppVersionSet = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'App version set',
        id: 'app.version.set',
      }),
      {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  const handleAppVersionSetError = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Error on set app version',
        id: 'error.set.app.version',
      }),
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
    setTitleInfo('');
    setContentInfo('');
  };

  return (
    <>
      {showPreview && (
        <PreviewVersionDialog
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          siteId={site?.id}
          versionId={selectedVersion?.id}
        />
      )}

      {openConfirmRemove && (
        <AppConfirmDialog
          DialogProps={{
            open: openConfirmRemove,
            onClose: () => {
              setOpenConfirmRemove(false);
            },
          }}
          onConfirm={() => {
            setOpenConfirmRemove(false);
            deleteAppVersionMutation.mutate(
              { siteId: site?.id, siteVersionId: selectedVersion?.id },
              {
                onSuccess: handleAppVersionRemoved,
                onError: handleAppVersionRemovedError,
              },
            );

            setSelectedVersion(undefined);
          }}
        >
          <FormattedMessage
            id="do.you.really.want.to.remove.this.app.version"
            defaultMessage="Do you really want to remove this app version {version}"
            values={{
              version: selectedVersion?.version,
            }}
          />
        </AppConfirmDialog>
      )}

      {openConfirmSetVersion && (
        <AppConfirmDialog
          DialogProps={{
            open: openConfirmSetVersion,
            onClose: () => {
              setOpenConfirmSetVersion(false);
            },
          }}
          onConfirm={() => {
            setOpenConfirmSetVersion(false);
            setAppVersionMutation.mutate(
              { siteId: site?.id, siteVersionId: selectedVersion?.id },
              {
                onSuccess: handleAppVersionSet,
                onError: handleAppVersionSetError,
              },
            );

            setSelectedVersion(undefined);
          }}
        >
          <FormattedMessage
            id="do.you.really.want.to.set.to.this.app.version"
            defaultMessage="Do you really want to set this app to version {version}. Make sure you backup any changes in a new version."
            values={{
              version: selectedVersion?.version,
            }}
          />
        </AppConfirmDialog>
      )}
      <InfoDialog
        dialogProps={{
          open: openInfo,
          onClose: handleCloseInfo,
        }}
        title={titleInfo}
        content={contentInfo}
      />
      <AddAppVersionFormDialog
        dialogProps={{
          open: openAddVersion,
          fullWidth: true,
          maxWidth: 'sm',
          onClose: () => {
            setOpenAddVersion(false);
          },
        }}
        version={selectedVersion?.version}
        description={selectedVersion?.description}
        versionId={selectedVersion?.id}
        siteId={site?.id}
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant={'h6'}>
              <FormattedMessage id="version" defaultMessage="Version" />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="ddd.versions.to.your.app.to.back.up.and.revert.to.previous.versions"
                defaultMessage="Add versions to your app to back up and revert to previous versions"
              />
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {site?.lastVersionSet && (
          <Grid item xs={12}>
            <Stack>
              <Typography variant={'body2'}>
                <FormattedMessage
                  id="last.version.set"
                  defaultMessage="Last version set"
                />
                : <b>{site.lastVersionSet.version || ''}</b>
              </Typography>
            </Stack>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => {
              setOpenAddVersion(true);
            }}
          >
            <FormattedMessage
              id={'add.app.version'}
              defaultMessage={'Add app version'}
            />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <AppVersions
            site={site}
            onClickDelete={handleClickDelete}
            onClickEdit={handleClickEdit}
            onClickSetVersion={handleSetVersion}
            onClickPreview={handlePreviewVersion}
          />
        </Grid>
      </Grid>
    </>
  );
}
