import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import { useCallback, useEffect, useState } from 'react';

import { useDebounce, useIsMobile } from '@dexkit/core';
import {
  GET_APP_RANKINGS_QUERY,
  useAppRankingListQuery,
} from '@dexkit/ui/modules/wizard/hooks/ranking';
import Add from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownloadOutlined';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridSortModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  useAddAppRankingMutation,
  useDeleteAppRankingMutation,
} from '../../hooks';
import { AppRanking } from '../../types/ranking';
import GamificationPointForm from '../forms/Gamification/GamificationPointForm';
import LeaderboardHeader from '../forms/Gamification/LeaderboardHeader';
import RankingMetadataForm from '../forms/Gamification/RankingMetadataForm';
const AddAppRankingFormDialog = dynamic(
  () => import('../dialogs/AddAppRankingFormDialog'),
);
const RankingDialog = dynamic(() => import('../dialogs/RankingDialog'));
const ExportRankingDialog = dynamic(
  () => import('../dialogs/ExportRankingDialog'),
);
export interface RankingWizardContainerProps {
  siteId?: number;
}

interface TableProps {
  siteId?: number | null;
  onClickDelete({ ranking }: { ranking: AppRanking }): void;
  onClickEdit({ ranking }: { ranking: AppRanking }): void;
  onClickPreview({ ranking }: { ranking: AppRanking }): void;
  onClickExport({ ranking }: { ranking: AppRanking }): void;
  rankings?: AppRanking[];
  query: string;
}

function ExpandableCell({ value }: GridRenderCellParams) {
  const [expanded, setExpanded] = useState(false);

  if (!value) {
    return <></>;
  }

  return (
    <Box
      sx={{
        overflowWrap: 'break-word',
        whiteSpace: 'initial',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minHeight: '100%',
        gap: 0.5,
      }}
    >
      <Box sx={{ width: '100%' }}>
        {expanded ? value : value.slice(0, 20)}
      </Box>
      {value.length > 20 && (
        <Link
          type="button"
          component="button"
          sx={{
            fontSize: '0.75rem',
            textDecoration: 'underline',
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.dark',
            }
          }}
          onClick={(e: any) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? 'view less' : 'view more'}
        </Link>
      )}
    </Box>
  );
}

function EmptyRankings() {
  const isMobile = useIsMobile();
  const theme = useTheme();

  return (
    <Stack
      py={isMobile ? 1 : 2}
      justifyContent="center"
      alignContent="center"
      alignItems="center"
    >
      <LeaderboardIcon
        fontSize="inherit"
        sx={{
          fontSize: isMobile
            ? theme.typography.h4.fontSize
            : theme.typography.h3.fontSize,
        }}
      />

      <Stack spacing={isMobile ? 0.5 : 1}>
        <Typography textAlign="center" variant={isMobile ? 'h6' : 'h5'}>
          <FormattedMessage
            id="no.leaderboard"
            defaultMessage="No leaderboard"
          />
        </Typography>
        <Typography
          textAlign="center"
          variant={isMobile ? 'caption' : 'body2'}
          color="text.secondary"
        >
          <FormattedMessage
            id="add.leaderboards.to.your.app"
            defaultMessage="Add leaderboards to your app"
          />
        </Typography>
      </Stack>
    </Stack>
  );
}

function AppRankingList({
  siteId,
  onClickDelete,
  onClickEdit,
  onClickPreview,
  onClickExport,
}: TableProps) {
  const [query, setQuery] = useState('');
  const isMobile = useIsMobile();
  const theme = useTheme();

  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {},
    sort: 'asc',
    sortField: 'title',
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: isMobile ? 5 : 10,
  });

  const lazyQuery = useDebounce(query, 500);

  const { data, isLoading, refetch } = useAppRankingListQuery({
    ...paginationModel,
    ...queryOptions,
    siteId: siteId,
    query: lazyQuery,
  });


  const [rowCountState, setRowCountState] = useState((data?.total as any) || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: number) =>
      data?.total !== undefined ? data?.total : prevRowCountState,
    );
  }, [data?.total, setRowCountState]);

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    // Here you save the data you need from the sort model

    if (sortModel.length > 0) {
      setQueryOptions((queryOptions: any) => ({
        ...queryOptions,
        sortField: sortModel[0].field,
        sort: sortModel[0].sort,
      }));
    } else {
      setQueryOptions((queryOptions: any) => {
        return {
          ...queryOptions,
        };
      });
    }
    refetch();
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

  const getColumns = (): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      {
        field: 'title',
        headerName: 'Title',
        flex: isMobile ? 0.5 : 1,
        minWidth: isMobile ? 80 : 150,
      },
      {
        field: 'createdAt',
        headerName: 'Created at',
        renderCell: ({ row }: any) => {
          if (!row || !row.createdAt) {
            return 'N/A';
          }
          try {
            return new Date(row.createdAt).toLocaleString();
          } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
          }
        },
        flex: isMobile ? 0.5 : 1,
        minWidth: isMobile ? 80 : 150,
      },
      {
        sortable: false,
        disableColumnMenu: true,
        disableReorder: true,
        field: 'description',
        headerName: 'Description',
        flex: isMobile ? 0.5 : 1,
        minWidth: isMobile ? 80 : 150,
        renderCell: (params: GridRenderCellParams) => (
          <ExpandableCell {...params} />
        ),
      },
      {
        sortable: false,
        disableColumnMenu: true,
        disableReorder: true,
        field: 'actions',
        headerName: 'Actions',
        width: isMobile ? 96 : 240,
        renderCell: ({ row }) => {
          return (
            <Stack direction="row" spacing={isMobile ? 0.5 : 1}>
              <IconButton
                size={isMobile ? 'small' : 'medium'}
                onClick={async (e: any) => {
                  e.stopPropagation();

                  onClickPreview({ ranking: row });
                  await refetch();
                }}
              >
                <Tooltip
                  title={
                    <FormattedMessage id="preview" defaultMessage="Preview" />
                  }
                >
                  <VisibilityIcon fontSize={isMobile ? 'small' : 'medium'} />
                </Tooltip>
              </IconButton>
              <IconButton
                size={isMobile ? 'small' : 'medium'}
                onClick={async (e: any) => {
                  e.stopPropagation();

                  onClickExport({ ranking: row });
                  await refetch();
                }}
              >
                <Tooltip
                  title={
                    <FormattedMessage id="export" defaultMessage="Export" />
                  }
                >
                  <FileDownloadIcon fontSize={isMobile ? 'small' : 'medium'} />
                </Tooltip>
              </IconButton>

              <IconButton
                size={isMobile ? 'small' : 'medium'}
                color={'error'}
                onClick={async (e: any) => {
                  e.stopPropagation();
                  onClickDelete({ ranking: row });
                  await refetch();
                }}
              >
                <Tooltip
                  title={
                    <FormattedMessage id={'delete'} defaultMessage={'Delete'} />
                  }
                >
                  <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                </Tooltip>
              </IconButton>
            </Stack>
          );
        },
      },
    ];

    return baseColumns;
  };

  const columns = getColumns();

  const rows = (data?.data as any) || [];


  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

  return (
    <>
      <DataGrid
        autoHeight
        rowHeight={isMobile ? 80 : 100}
        key={data?.total}
        sortingOrder={['asc', 'desc']}
        slots={{
          toolbar: GridToolbar,
          noRowsOverlay: EmptyRankings,
          noResultsOverlay: EmptyRankings,
        }}
        onRowClick={({ row }: any) => {
          onClickEdit({ ranking: row });
        }}
        rows={rows}
        columns={columns}
        rowCount={rowCountState}
        paginationModel={paginationModel}
        paginationMode="server"
        disableColumnFilter
        sortingMode="server"
        getRowHeight={() => 'auto'}
        disableColumnMenu
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
            showQuickFilter: true,
            quickFilterProps: {
              value: query,
              onChange: (e: any) => {
                setQuery(e.target.value);
              },
            },
          },
        }}
        hideFooterPagination={rowCountState === 0}
        onPaginationModelChange={setPaginationModel}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        sortModel={[{ field: queryOptions.sortField, sort: queryOptions.sort }]}
        onSortModelChange={handleSortModelChange}
        pageSizeOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
        loading={isLoading}
        rowSelectionModel={rowSelection}
        disableRowSelectionOnClick
        onRowSelectionModelChange={(rows: any) => setRowSelection(rows)}
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none !important',
          },
          '& .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none !important',
          },
          '& .MuiDataGrid-row': {
            maxHeight: 'none !important',
            minHeight: isMobile ? `${theme.spacing(7.5)} !important` : 'auto',
          },
          '& .MuiDataGrid-cell': {
            padding: isMobile ? theme.spacing(1, 0.5) : theme.spacing(2),
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            fontSize: isMobile ? theme.typography.caption.fontSize : 'inherit',
          },
          '& .MuiDataGrid-columnHeaders': {
            minHeight: isMobile
              ? `${theme.spacing(5)} !important`
              : `${theme.spacing(7)} !important`,
          },
          '& .MuiDataGrid-columnHeader': {
            padding: isMobile ? theme.spacing(0.5) : theme.spacing(2),
          },
          '& .MuiDataGrid-main': {
            width: isMobile ? `calc(100vw - ${theme.spacing(4)})` : '100%',
            overflowX: isMobile ? 'auto' : 'hidden',
          },
          '& .MuiDataGrid-virtualScroller': {
            width: isMobile ? 'max-content' : '100%',
            minWidth: isMobile ? '100%' : 'auto',
          },
          border: 'none',
          '--DataGrid-overlayHeight': '150px', // disable cell selection style
          '.MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          // pointer cursor on ALL rows
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
        }}
      />
    </>
  );
}

export default function RankingWizardContainer({
  siteId,
}: RankingWizardContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const [value, setValue] = useState('1');

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const [openConfirmRemove, setOpenConfirmRemove] = useState(false);
  const [openAddRanking, setOpenAddRanking] = useState(false);
  const [openExportRanking, setOpenExportRanking] = useState(false);
  const [openPreviewRanking, setOpenPreviewRanking] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState<
    AppRanking | undefined
  >(undefined);

  const [selectedEditRanking, setSelectedEditRanking] = useState<
    AppRanking | undefined
  >(undefined);

  const deleteAppRankingMutation = useDeleteAppRankingMutation();

  const handleClickDelete = ({ ranking }: { ranking: AppRanking }) => {
    setSelectedRanking(ranking);
    setOpenConfirmRemove(true);
  };

  const handleClickEdit = ({ ranking }: { ranking: AppRanking }) => {
    setSelectedEditRanking(ranking);
  };

  const handleClickExport = ({ ranking }: { ranking: AppRanking }) => {
    setSelectedRanking(ranking);
    setOpenExportRanking(true);
  };

  const handlePreviewRanking = ({ ranking }: { ranking: AppRanking }) => {
    setSelectedRanking(ranking);
    setOpenPreviewRanking(true);
  };

  const handleAppRankingRemoved = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Leaderboard removed',
        id: 'leaderboard.removed',
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

  const handleAppRankingRemovedError = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Error on removing leaderboard',
        id: 'error.on.removing.leaderboard',
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

  const [saved, setSaved] = useState(false);

  const [showDiscard, setShowDiscard] = useState(false);

  const handleCloseEditRanking = () => {
    if (hasChanges && !saved) {
      setShowDiscard(true);
      return;
    }

    setHasChanges(false);
    setSaved(false);
    setSelectedEditRanking(undefined);
  };

  const handleSave = () => {
    setSaved(true);
  };

  const queryClient = useQueryClient();

  const mutationAddRanking = useAddAppRankingMutation();

  const [query, setQuery] = useState('');

  const handleChangeQuery = (value: string) => {
    setQuery(value);
  };

  const [open, setOpen] = useState(true);

  const isMobile = useIsMobile();

  return (
    <>
      {showDiscard && (
        <AppConfirmDialog
          DialogProps={{
            open: showDiscard,
            maxWidth: 'xs',
            fullWidth: true,
            onClose: () => setShowDiscard(false),
          }}
          onConfirm={() => {
            setSelectedEditRanking(undefined);
            setShowDiscard(false);
          }}
          title={
            <FormattedMessage
              id="Leave.without.saving"
              defaultMessage="Leave Without Saving"
            />
          }
          actionCaption={<FormattedMessage id="leave" defaultMessage="Leave" />}
          cancelCaption={<FormattedMessage id="stay" defaultMessage="Stay" />}
        >
          <Stack spacing={1}>
            <Typography variant="body1">
              <FormattedMessage
                id="you.have.unsaved.changes."
                defaultMessage="You have unsaved changes."
              />
            </Typography>
            <Typography variant="body1">
              <FormattedMessage
                id="are.you.sure.you.want.to.leave.without.saving"
                defaultMessage="Are you sure you want to leave without saving?"
              />
            </Typography>
          </Stack>
        </AppConfirmDialog>
      )}
      {openAddRanking && (
        <AddAppRankingFormDialog
          dialogProps={{
            open: openAddRanking,
            fullWidth: true,
            maxWidth: 'sm',
            onClose: () => {
              setOpenAddRanking(false);
            },
          }}
          siteId={siteId}
        />
      )}
      {openPreviewRanking && (
        <RankingDialog
          dialogProps={{
            open: openPreviewRanking,
            fullWidth: true,
            maxWidth: 'md',
            onClose: () => {
              setOpenPreviewRanking(false);
            },
          }}
          rankingId={selectedRanking?.id}
        />
      )}
      {openExportRanking && (
        <ExportRankingDialog
          dialogProps={{
            open: openExportRanking,
            fullWidth: true,
            maxWidth: 'md',
            onClose: () => {
              setOpenExportRanking(false);
            },
          }}
          rankingId={selectedRanking?.id}
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
          onConfirm={async () => {
            setOpenConfirmRemove(false);

            await deleteAppRankingMutation.mutateAsync(
              { siteId: siteId, rankingId: selectedRanking?.id },
              {
                onSuccess: handleAppRankingRemoved,
                onError: handleAppRankingRemovedError,
              },
            );

            await queryClient.removeQueries({
              queryKey: [GET_APP_RANKINGS_QUERY],
            });
            setSelectedRanking(undefined);
          }}
          title={
            <Typography variant="inherit" fontWeight="bold">
              <FormattedMessage
                id="delete.leaderboard.name"
                defaultMessage="Delete Leaderboard: {name}"
                values={{
                  name: (
                    <Typography
                      component="span"
                      fontWeight="300"
                      variant="inherit"
                    >
                      {selectedRanking?.title}
                    </Typography>
                  ),
                }}
              />
            </Typography>
          }
          actionCaption={
            <FormattedMessage id="delete" defaultMessage="Delete" />
          }
        >
          <FormattedMessage
            id="are.you.sure.you want.to.delete.this.leaderboard"
            defaultMessage="Are you sure you want to delete this leaderboard?"
          />
        </AppConfirmDialog>
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
                  mb: 0.5,
                }}
              >
                <FormattedMessage
                  id="leaderboard"
                  defaultMessage="Leaderboard"
                />
              </Typography>
              <Typography
                variant={isMobile ? 'body2' : 'body1'}
                color="text.secondary"
                sx={{
                  fontSize: isMobile ? '0.85rem' : 'inherit',
                }}
              >
                <FormattedMessage
                  id="create.leaderboards.and.gamify.your.app"
                  defaultMessage="Create leaderboards from your events and gamify your app"
                />
              </Typography>
            </Stack>
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>

          {!selectedEditRanking && (
            <Grid size={12}>
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenAddRanking(true);
                    }}
                    startIcon={<Add />}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      fontSize: isMobile ? '0.875rem' : undefined,
                      py: isMobile ? 0.75 : undefined,
                      px: isMobile ? 2 : undefined,
                    }}
                  >
                    <FormattedMessage
                      id="new.leaderboard"
                      defaultMessage="New leaderboard"
                    />
                  </Button>
                </Stack>
              </Box>
            </Grid>
          )}
          {!selectedEditRanking && (
            <Grid size={12}>
              <AppRankingList
                siteId={siteId}
                onClickDelete={handleClickDelete}
                onClickEdit={handleClickEdit}
                onClickPreview={handlePreviewRanking}
                onClickExport={handleClickExport}
                query={query}
              />
            </Grid>
          )}
          {selectedEditRanking && (
            <Grid size={12}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <div>
                    <LeaderboardHeader
                      key={selectedEditRanking.title}
                      title={selectedEditRanking.title}
                      onClose={handleCloseEditRanking}
                      onEditTitle={async (title: string) => {
                        setSelectedEditRanking({
                          ...selectedEditRanking,
                          title,
                        });
                        setHasChanges(true);
                      }}
                      onPreview={() => {
                        if (selectedEditRanking) {
                          handlePreviewRanking({
                            ranking: selectedEditRanking,
                          });
                        }
                      }}
                    />
                  </div>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6
                  }}>
                  <Alert severity="info">
                    <AlertTitle sx={{ fontWeight: 'bold' }}>
                      <Typography fontWeight="inherit" variant="body2">
                        <FormattedMessage
                          id="build.a.ranking.alert.message"
                          defaultMessage="Define and assign points to each user event to build a ranking."
                        />
                      </Typography>
                    </AlertTitle>
                    <Typography variant="body2">
                      <FormattedMessage
                        id="points.are.awarded.based.on.user.message"
                        defaultMessage="Points are awarded based on user activity to determine their ranking."
                      />
                    </Typography>
                  </Alert>
                </Grid>
                <Grid size={12}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                      >
                        <Tab
                          label={
                            <FormattedMessage
                              id={'rules'}
                              defaultMessage={'Rules'}
                            />
                          }
                          value="1"
                        />
                        <Tab
                          label={
                            <FormattedMessage
                              id={'metadata'}
                              defaultMessage={'Metadata'}
                            />
                          }
                          value="2"
                        />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <GamificationPointForm
                        settings={selectedEditRanking.settings}
                        siteId={siteId}
                        from={selectedEditRanking.from}
                        groupByReferral={selectedEditRanking?.groupByReferral}
                        to={selectedEditRanking.to}
                        rankingId={selectedEditRanking.id}
                        ranking={selectedEditRanking}
                        title={selectedEditRanking.title}
                        onSave={handleSave}
                        onChange={() => {
                          setHasChanges(true);
                          setSaved(false);
                        }}
                      />
                    </TabPanel>
                    <TabPanel value="2">
                      <RankingMetadataForm
                        siteId={siteId}
                        rankingId={selectedEditRanking.id}
                        title={selectedEditRanking.title}
                        description={selectedEditRanking.description}
                        onSave={handleSave}
                      />
                    </TabPanel>
                  </TabContext>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
