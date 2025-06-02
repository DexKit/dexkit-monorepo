import {
  NETWORKS,
  NETWORK_EXPLORER,
  NETWORK_NAME,
} from '@dexkit/core/constants/networks';
import {
  beautifyCamelCase,
  formatBigNumber,
  getBlockExplorerUrl,
  ipfsUriToUrl,
  parseChainId,
  truncateAddress,
  truncateHash,
} from '@dexkit/core/utils';
import Link from '@dexkit/ui/components/AppLink';
import {
  CountFilter,
  UserEvent,
  useUserEventsList,
} from '@dexkit/ui/hooks/userEvents';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GridToolbar } from '@mui/x-data-grid/components';

import {
  UserEvents,
  UserOnChainEvents,
} from '@dexkit/core/constants/userEvents';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { useActiveChainIds, useCollectionByApi } from '@dexkit/ui';
import { USER_EVENT_NAMES } from '@dexkit/ui/constants/userEventNames';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  FormControl,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField as MuiTextField,
} from '@mui/material';
import { GridFilterModel, GridSortModel } from '@mui/x-data-grid/models';

import { GridColDef } from '@mui/x-data-grid';

import ExpandMore from '@mui/icons-material/ExpandMore';
import { DateTimePicker } from '@mui/x-date-pickers';
import { BigNumber } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { Field, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import moment, { Moment } from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { myAppsApi } from 'src/services/whitelabel';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import useColumns from '../../hooks/useColumns';
import ChangeListener from '../ChangeListener';
import EventDetailDialog from '../dialogs/EventDetailDialog';
import CountAccountsCard from '../user-events/CountAccountsCard';
import CountEditionDropsByGroupCard from '../user-events/CountEditionDropsByGroupCard';
import CountEditionDropsCard from '../user-events/CountEditionDropsCard';
import CountEventsCard from '../user-events/CountEventsCard';
import CountFeesCard from '../user-events/CountFeesCard';
import CountNftDropsByGroupCard from '../user-events/CountNftDropsByGroupCard';
import CountNftDropsCard from '../user-events/CountNftDropsCard';
import CountTokenDropsByGroupCard from '../user-events/CountTokenDropsByGroupCard';
import OffChainTab from '../user-events/OffChainTab';
import UserEventsTable from '../user-events/UserEventsTable';

interface RenderGroupProps {
  group: string;
}

export function RenderGroup({ group }: RenderGroupProps) {
  const [chainId, address] = group.split('-');

  const { data: collection } = useCollectionByApi({
    chainId: parseInt(chainId),
    contractAddress: address,
  });

  return (
    <Link
      target="_blank"
      href={`${getBlockExplorerUrl(parseChainId(chainId))}/address/${address}`}
    >
      {collection?.name}
    </Link>
  );
}

export function RenderTokenGroup({ group }: RenderGroupProps) {
  const [chainId, address, tokenId] = group.split('-');

  const { data: collection } = useCollectionByApi({
    chainId: parseInt(chainId),
    contractAddress: address,
  });

  return (
    <Link
      target="_blank"
      href={`${getBlockExplorerUrl(parseChainId(chainId))}/address/${address}`}
    >
      {collection?.name} #{tokenId}
    </Link>
  );
}

export interface OnChainDataGridProps {
  siteId?: number;
  filters?: CountFilter;
  onViewDetails: (event: UserEvent) => void;
}

function OnChainDataGrid({
  siteId,
  onViewDetails,
  filters,
}: OnChainDataGridProps) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {
      hash: {
        not: null,
      },
      createdAt: { gte: filters?.start, lte: filters?.end },
      referral: filters?.referral ? filters.referral : undefined,
      from: filters?.from ? filters.from : undefined,
      chainId:
        filters?.chainId && filters?.chainId > 0 ? filters?.chainId : undefined,
    },
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useUserEventsList({
    instance: myAppsApi,
    ...paginationModel,
    ...queryOptions,
    siteId,
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

  const { formatMessage } = useIntl();

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Created At',
      minWidth: 200,
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 150,
      valueGetter: ({ row }) => {
        return beautifyCamelCase(row.type);
      },
    },
    {
      field: 'chainId',
      headerName: 'Network',
      minWidth: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'hash',
      headerName: 'TX',
      minWidth: 160,
      renderCell: (params: any) =>
        params.row.hash ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row.hash
            }`}
          >
            {truncateHash(params.row.hash)}
          </Link>
        ) : null,
    },
    {
      field: 'referral',
      headerName: formatMessage({ id: 'referral', defaultMessage: 'Referral' }),
      minWidth: 200,
      renderCell: (params: any) => {
        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.referral
            }`}
          >
            {truncateAddress(params.row.referral)}
          </Link>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 200,
      renderCell: (params: any) => (
        <Button onClick={() => onViewDetails(params.row)}>
          <FormattedMessage id="details" defaultMessage="Details" />
        </Button>
      ),
    },
  ];

  return (
    <DataGrid
      autoHeight
      slots={{ toolbar: GridToolbar }}
      rows={(data?.data as any) || []}
      columns={columns}
      rowCount={rowCountState}
      paginationModel={paginationModel}
      paginationMode="server"
      disableColumnFilter
      sortingMode="server"
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
      onPaginationModelChange={setPaginationModel}
      filterMode="server"
      onFilterModelChange={onFilterChange}
      onSortModelChange={handleSortModelChange}
      pageSizeOptions={[5, 10, 25, 50]}
      disableRowSelectionOnClick
      loading={isLoading}
    />
  );
}

const addressSchema = z.string().refine((arg) => {
  return isAddress(arg);
}, 'invalid address');

const dateSchema = z.string().datetime({ offset: true });

const FilterSchema = z.object({
  siteId: z.number(),
  chainId: z.number().optional(),
  from: addressSchema.optional(),
  referral: addressSchema.optional(),
  start: dateSchema,
  end: dateSchema,
  type: z.string().optional(),
});

interface Props {
  siteId?: number;
}

export default function UserEventAnalyticsContainer({ siteId }: Props) {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [showDetails, setShowDetails] = useState(false);
  const [event, setEvent] = useState<UserEvent>();

  const handleClose = () => {
    setShowDetails(false);
    setEvent(undefined);
  };

  const handleViewDetails = (event: UserEvent) => {
    setShowDetails(true);
    setEvent(event);
  };

  const DEFAULT_VALUES = useMemo(
    () => ({
      siteId,
      start: moment().subtract(30, 'days').format(),
      end: moment().format(),
      type: '',
      chainId: 0,
      referral: undefined,
    }),
    [siteId],
  );

  const [filters, setFilters] = useState<CountFilter>(DEFAULT_VALUES);

  const columns = useColumns(filters.type);

  const handleSubmitFilters = async (values: CountFilter) => {
    setFilters(values);
  };

  const { activeChainIds } = useActiveChainIds();

  const [offchainType, setOffChainType] = useState(UserEvents.postLimitOrder);

  return (
    <>
      <EventDetailDialog
        DialogProps={{
          open: showDetails,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleClose,
        }}
        event={event}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant={'h6'}>
              <FormattedMessage id="events" defaultMessage="Events" />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="view.user.interaction.data.within.your.dApp.to.gain.insights"
                defaultMessage="View user interaction data within your DApp to gain insights"
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              id={'add.ref.to.track.referrals'}
              defaultMessage={
                'Append ref to your url to track referrals on your events. Ex: yourSite.com?ref=your-referral'
              }
            />
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="events types">
                  <Tab
                    label={
                      <FormattedMessage
                        id={'onchain.events'}
                        defaultMessage={'Onchain events'}
                      />
                    }
                    value="1"
                  />
                  <Tab
                    label={
                      <FormattedMessage
                        id={'offchain.events'}
                        defaultMessage={'Offchain events'}
                      />
                    }
                    value="2"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <DexkitApiProvider.Provider
                        value={{ instance: myAppsApi }}
                      >
                        <Grid item xs={12} sm={3}>
                          <CountEventsCard
                            filters={filters}
                            disableDetails={filters.type !== ''}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <CountAccountsCard filters={filters} />
                        </Grid>
                        {filters.type !== '' && (
                          <Grid item xs={12}>
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography>
                                  <FormattedMessage
                                    id="advanced"
                                    defaultMessage="Advanced"
                                  />
                                </Typography>
                              </AccordionSummary>
                              <Divider />
                              <AccordionDetails sx={{ py: 2 }}>
                                <Grid container spacing={2}>
                                  {filters.type === UserOnChainEvents.swap && (
                                    <Grid item xs={12} sm={4}>
                                      <CountFeesCard filters={filters} />
                                    </Grid>
                                  )}
                                  {filters.type ===
                                    UserOnChainEvents.buyDropCollection && (
                                    <>
                                      <Grid item xs={12} sm={4}>
                                        <CountNftDropsCard filters={filters} />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountNftDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.account"
                                              defaultMessage="Total by account"
                                            />
                                          }
                                          filters={filters}
                                          group="from"
                                          renderGroup={(group) =>
                                            truncateAddress(group)
                                          }
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>

                                      <Grid item xs={12} sm={4}>
                                        <CountNftDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.referral"
                                              defaultMessage="Total by referral"
                                            />
                                          }
                                          filters={filters}
                                          group="referral"
                                          renderGroup={(group) =>
                                            truncateAddress(group)
                                          }
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountNftDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.network"
                                              defaultMessage="Total by network"
                                            />
                                          }
                                          filters={filters}
                                          group="chainId"
                                          renderGroup={(group) =>
                                            NETWORKS[parseInt(group)].name
                                          }
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountNftDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.network"
                                              defaultMessage="Total by collection"
                                            />
                                          }
                                          filters={filters}
                                          group="collection"
                                          renderGroup={(group) => (
                                            <RenderGroup group={group} />
                                          )}
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </>
                                  )}
                                  {filters.type ===
                                    UserOnChainEvents.buyDropEdition && (
                                    <>
                                      <Grid item xs={12} sm={4}>
                                        <CountEditionDropsCard
                                          filters={filters}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountEditionDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.account"
                                              defaultMessage="Total by account"
                                            />
                                          }
                                          filters={filters}
                                          group="from"
                                          renderGroup={(group) =>
                                            truncateAddress(group)
                                          }
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountEditionDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.token"
                                              defaultMessage="Total by token"
                                            />
                                          }
                                          filters={filters}
                                          group="token"
                                          renderGroup={(group) => (
                                            <RenderTokenGroup group={group} />
                                          )}
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountEditionDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.referral"
                                              defaultMessage="Total by referral"
                                            />
                                          }
                                          filters={filters}
                                          group="referral"
                                          renderGroup={(group) =>
                                            truncateAddress(group)
                                          }
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountEditionDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.network"
                                              defaultMessage="Total by network"
                                            />
                                          }
                                          filters={filters}
                                          group="chainId"
                                          renderGroup={(group) =>
                                            NETWORKS[parseInt(group)].name
                                          }
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountEditionDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.network"
                                              defaultMessage="Total by collection"
                                            />
                                          }
                                          filters={filters}
                                          group="collection"
                                          renderGroup={(group) => (
                                            <RenderGroup group={group} />
                                          )}
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </>
                                  )}
                                  {filters.type ===
                                    UserOnChainEvents.buyDropToken && (
                                    <>
                                      <Grid item xs={12} sm={4}>
                                        <CountTokenDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.account"
                                              defaultMessage="Total by account"
                                            />
                                          }
                                          filters={filters}
                                          group="from"
                                          renderGroup={(group) =>
                                            truncateAddress(group)
                                          }
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.quantity})`}
                                                />
                                                <Typography color="text.secondary">
                                                  $
                                                  {formatBigNumber(
                                                    BigNumber.from(
                                                      item.amount,
                                                    ).mul(item.quantity),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountTokenDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.referral"
                                              defaultMessage="Total by referral"
                                            />
                                          }
                                          filters={filters}
                                          group="referral"
                                          renderGroup={(group) =>
                                            truncateAddress(group)
                                          }
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.quantity})`}
                                                />
                                                <Typography color="text.secondary">
                                                  $
                                                  {formatBigNumber(
                                                    BigNumber.from(
                                                      item.amount,
                                                    ).mul(item.quantity),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountTokenDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.network"
                                              defaultMessage="Total by network"
                                            />
                                          }
                                          filters={filters}
                                          group="chainId"
                                          renderGroup={(group) =>
                                            NETWORKS[parseInt(group)].name
                                          }
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.quantity})`}
                                                />
                                                <Typography color="text.secondary">
                                                  $
                                                  {formatBigNumber(
                                                    BigNumber.from(
                                                      item.amount,
                                                    ).mul(item.quantity),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountTokenDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.network"
                                              defaultMessage="Total by collection"
                                            />
                                          }
                                          filters={filters}
                                          group="collection"
                                          renderGroup={(group) => (
                                            <RenderGroup group={group} />
                                          )}
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.quantity})`}
                                                />
                                                <Typography color="text.secondary">
                                                  $
                                                  {formatBigNumber(
                                                    BigNumber.from(
                                                      item.amount,
                                                    ).mul(item.quantity),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </>
                                  )}
                                  {filters.type ===
                                    UserOnChainEvents.buyDropEdition && (
                                    <>
                                      <Grid item xs={12} sm={4}>
                                        <CountEditionDropsCard
                                          filters={filters}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountEditionDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.account"
                                              defaultMessage="Total by account"
                                            />
                                          }
                                          filters={filters}
                                          group="from"
                                          renderGroup={(group) =>
                                            truncateAddress(group)
                                          }
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountEditionDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.token"
                                              defaultMessage="Total by token"
                                            />
                                          }
                                          filters={filters}
                                          group="token"
                                          renderGroup={(group) => (
                                            <RenderTokenGroup group={group} />
                                          )}
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountEditionDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.referral"
                                              defaultMessage="Total by referral"
                                            />
                                          }
                                          filters={filters}
                                          group="referral"
                                          renderGroup={(group) =>
                                            truncateAddress(group)
                                          }
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountEditionDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.network"
                                              defaultMessage="Total by network"
                                            />
                                          }
                                          filters={filters}
                                          group="chainId"
                                          renderGroup={(group) =>
                                            NETWORKS[parseInt(group)].name
                                          }
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4}>
                                        <CountEditionDropsByGroupCard
                                          title={
                                            <FormattedMessage
                                              id="total.by.network"
                                              defaultMessage="Total by collection"
                                            />
                                          }
                                          filters={filters}
                                          group="collection"
                                          renderGroup={(group) => (
                                            <RenderGroup group={group} />
                                          )}
                                          renderItem={(item, index) => {
                                            return (
                                              <ListItem key={index}>
                                                <ListItemText
                                                  primary={`${item.tokenName} (${item.nftAmount})`}
                                                />
                                                <Typography color="text.secondary">
                                                  {formatBigNumber(
                                                    BigNumber.from(item.amount),
                                                    item.decimals,
                                                  )}{' '}
                                                  {item.symbol.toUpperCase()}
                                                </Typography>
                                              </ListItem>
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </>
                                  )}
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          </Grid>
                        )}
                      </DexkitApiProvider.Provider>
                      <Grid item xs={12}>
                        <Box>
                          <Formik
                            initialValues={DEFAULT_VALUES}
                            onSubmit={handleSubmitFilters}
                            validationSchema={toFormikValidationSchema(
                              FilterSchema,
                            )}
                          >
                            {({
                              values,
                              submitForm,
                              isValid,
                              isSubmitting,
                              setFieldValue,
                              setValues,
                              errors,
                              touched,
                              resetForm,
                            }) => (
                              <>
                                <ChangeListener
                                  isValid={isValid}
                                  onChange={(vals: any) => {
                                    setFilters(vals);
                                  }}
                                  values={values}
                                />
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                      <Field
                                        fullWidth
                                        component={Select}
                                        name="type"
                                        displayEmpty
                                        notched
                                        inputLabel={{ shrink: true }}
                                        label={
                                          <FormattedMessage
                                            id="event.type"
                                            defaultMessage="Event Type"
                                          />
                                        }
                                      >
                                        <MenuItem value="">
                                          <FormattedMessage
                                            id="all"
                                            defaultMessage="All"
                                          />
                                        </MenuItem>
                                        {Object.keys(USER_EVENT_NAMES).map(
                                          (key) => (
                                            <MenuItem key={key} value={key}>
                                              <FormattedMessage
                                                id={USER_EVENT_NAMES[key].id}
                                                defaultMessage={
                                                  USER_EVENT_NAMES[key]
                                                    .defaultMessage
                                                }
                                              />
                                            </MenuItem>
                                          ),
                                        )}
                                      </Field>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <DateTimePicker
                                      label={
                                        <FormattedMessage
                                          id="start"
                                          defaultMessage="Start"
                                        />
                                      }
                                      value={moment(values.start)}
                                      onChange={(value: Moment | null) => {
                                        if (value) {
                                          setFieldValue(
                                            'start',
                                            value?.format(),
                                          );
                                        }
                                      }}
                                      renderInput={(props) => (
                                        <MuiTextField {...props} fullWidth />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <DateTimePicker
                                      label={
                                        <FormattedMessage
                                          id="end"
                                          defaultMessage="End"
                                        />
                                      }
                                      value={moment(values.end)}
                                      onChange={(value: Moment | null) => {
                                        if (value) {
                                          setFieldValue('end', value?.format());
                                        }
                                      }}
                                      renderInput={(props) => (
                                        <MuiTextField {...props} fullWidth />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                      <Field
                                        component={Select}
                                        type="number"
                                        name="chainId"
                                        label={
                                          <FormattedMessage
                                            id="network"
                                            defaultMessage="Network"
                                          />
                                        }
                                        renderValue={(value: number) => {
                                          const key = parseChainId(value);

                                          if (key === 0) {
                                            return (
                                              <Typography>
                                                <FormattedMessage
                                                  id="all"
                                                  defaultMessage="All"
                                                />
                                              </Typography>
                                            );
                                          }

                                          return (
                                            <Stack
                                              direction="row"
                                              alignItems="center"
                                              alignContent="center"
                                              spacing={1}
                                            >
                                              <Avatar
                                                src={ipfsUriToUrl(
                                                  NETWORKS[key]?.imageUrl || '',
                                                )}
                                                style={{
                                                  width: '1rem',
                                                  height: '1rem',
                                                }}
                                              />
                                              <Typography variant="body1">
                                                {NETWORKS[key].name}
                                              </Typography>
                                            </Stack>
                                          );
                                        }}
                                        fullWidth
                                      >
                                        <MenuItem value={0}>
                                          <ListItemText
                                            primary={
                                              <FormattedMessage
                                                id="all"
                                                defaultMessage="All"
                                              />
                                            }
                                          />
                                        </MenuItem>
                                        {Object.keys(NETWORKS)
                                          .filter((n) =>
                                            activeChainIds.includes(Number(n)),
                                          )
                                          .map((key) => (
                                            <MenuItem
                                              key={key}
                                              value={parseChainId(key)}
                                            >
                                              <ListItemIcon>
                                                <Avatar
                                                  sx={{
                                                    height: '1rem',
                                                    width: '1rem',
                                                  }}
                                                  src={
                                                    NETWORKS[parseChainId(key)]
                                                      .imageUrl
                                                  }
                                                />
                                              </ListItemIcon>
                                              <ListItemText
                                                primary={
                                                  NETWORKS[parseChainId(key)]
                                                    .name
                                                }
                                              />
                                            </MenuItem>
                                          ))}
                                      </Field>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Field
                                      component={TextField}
                                      name="referral"
                                      onChange={(e: any) => {
                                        setFieldValue(
                                          'referral',
                                          e.target.value,
                                        );
                                      }}
                                      label={
                                        <FormattedMessage
                                          id="referral"
                                          defaultMessage="Referral"
                                        />
                                      }
                                      fullWidth
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Field
                                      component={TextField}
                                      name="from"
                                      label={
                                        <FormattedMessage
                                          id="from"
                                          defaultMessage="From"
                                        />
                                      }
                                      fullWidth
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Box>
                                      <Stack
                                        spacing={2}
                                        alignItems="center"
                                        direction="row"
                                      >
                                        {/* <Button
                                          onClick={submitForm}
                                          disabled={!isValid || isSubmitting}
                                          variant="contained"
                                        >
                                          <FormattedMessage
                                            id="filter"
                                            defaultMessage="Filter"
                                          />
                                        </Button> */}
                                        <Button
                                          onClick={async () => {
                                            resetForm();
                                            await submitForm();
                                          }}
                                          disabled={
                                            !isValid || isSubmitting || !touched
                                          }
                                          variant="outlined"
                                        >
                                          <FormattedMessage
                                            id="reset.filters"
                                            defaultMessage="Reset filters"
                                          />
                                        </Button>
                                      </Stack>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </>
                            )}
                          </Formik>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    {filters.type === '' ? (
                      <OnChainDataGrid
                        siteId={siteId}
                        filters={filters}
                        key={JSON.stringify(filters)}
                        onViewDetails={handleViewDetails}
                      />
                    ) : (
                      <UserEventsTable
                        key={JSON.stringify(filters)}
                        filters={filters}
                        type={filters.type as UserOnChainEvents}
                        columns={columns}
                        siteId={siteId}
                      />
                    )}
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="2">
                <OffChainTab siteId={siteId} />
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
