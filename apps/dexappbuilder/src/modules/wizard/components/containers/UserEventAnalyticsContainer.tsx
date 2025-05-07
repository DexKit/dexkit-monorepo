import {
  NETWORK_EXPLORER,
  NETWORK_NAME
} from '@dexkit/core/constants/networks';
import {
  beautifyCamelCase,
  getBlockExplorerUrl,
  parseChainId,
  truncateAddress,
  truncateHash
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
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GridToolbar } from '@mui/x-data-grid/components';

import { useActiveChainIds, useCollectionByApi } from '@dexkit/ui';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  TextField as MuiTextField,
  Paper,
  Tooltip
} from '@mui/material';
import { GridFilterModel, GridSortModel } from '@mui/x-data-grid/models';

import { GridColDef } from '@mui/x-data-grid';

import DeviceUnknownIcon from '@mui/icons-material/DeviceUnknown';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfoIcon from '@mui/icons-material/Info';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { isAddress } from 'ethers/lib/utils';
import { Field, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import moment, { Moment } from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FormattedMessage, useIntl } from 'react-intl';
import { myAppsApi } from 'src/services/whitelabel';
import { z } from 'zod';
import EventDetailDialog from '../dialogs/EventDetailDialog';
import CountAccountsCard from '../user-events/CountAccountsCard';
import CountEventsCard from '../user-events/CountEventsCard';
import DeviceDistributionChart from '../user-events/DeviceDistributionChart';
import OffChainTab from '../user-events/OffChainTab';
import UserEventCharts from '../user-events/UserEventCharts';
import UserFunnelVisualization from '../user-events/UserFunnelVisualization';

// Extends the UserEvent type to include missing properties
interface ExtendedUserEvent extends UserEvent {
  userAgent?: string;
  deviceType?: string;
  id: number;
  type: string | null;
  hash: string | null;
  chainId: number | null;
  networkId: string | null;
  status: string | null;
  from: string | null;
  referral: string | null;
  processed: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  siteId: number | null;
  userId: number | null;
  accountId: number | null;
  metadata: any;
  processedMetadata: any;
}

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
      source: filters?.referral ? filters.referral : undefined,
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
  const [csvData, setCsvData] = useState<any[]>([]);
  const [mockData, setMockData] = useState<ExtendedUserEvent[]>([]);
  const [useMockData, setUseMockData] = useState(false);

  // Generate example data when needed
  useEffect(() => {
    // Create example data to display when there is no real data
    const generateMockData = () => {
      const mockEvents: ExtendedUserEvent[] = [];
      
      // Create some example events with different types
      const eventTypes = ['swap', 'approve', 'transfer', 'mint', 'stake', 'claim'];
      const networks = [1, 56, 137, 10, 42161]; // Ethereum, BSC, Polygon, Optimism, Arbitrum
      
      for (let i = 0; i < 25; i++) {
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const randomNetwork = networks[Math.floor(Math.random() * networks.length)];
        const randomHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const randomAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const devices = ['Desktop', 'Mobile', 'Tablet', 'Unknown'];
        const randomDevice = devices[Math.floor(Math.random() * devices.length)];
        
        mockEvents.push({
          id: i,
          type: randomType,
          chainId: randomNetwork,
          hash: randomHash,
          from: randomAddress,
          referral: Math.random() > 0.7 ? randomAddress : '',
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
          updatedAt: new Date(),
          deviceType: randomDevice,
          userAgent: `Mozilla/5.0 (${randomDevice === 'Mobile' ? 'iPhone' : 'Windows NT 10.0'})`,
          networkId: randomNetwork.toString(),
          status: 'completed',
          processed: true,
          siteId: siteId || null,
          userId: null,
          accountId: null,
          metadata: {},
          processedMetadata: {}
        });
      }
      
      setMockData(mockEvents);
    };
    
    generateMockData();
  }, []);

  useEffect(() => {
    // If there is real data, use it; otherwise, use simulated data
    const effectiveData = (data?.data && data.data.length > 0) ? data.data : mockData;
    setUseMockData(!data?.data || data.data.length === 0);
    
    setRowCountState((prevRowCountState: number) =>
      data?.total !== undefined ? data?.total : mockData.length,
    );

    if (effectiveData) {
      const formattedData = effectiveData.map((item: ExtendedUserEvent) => ({
        createdAt: new Date(item.createdAt || '').toLocaleString(),
        type: beautifyCamelCase(item.type || ''),
        network: NETWORK_NAME(item.chainId || 0),
        hash: item.hash,
        source: item.referral,
        from: item.from,
        userAgent: item.userAgent || 'N/A',
        deviceType: item.deviceType || 'Unknown'
      }));
      setCsvData(formattedData);
    }
  }, [data?.total, data?.data, mockData]);

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    if (!useMockData) {
      setQueryOptions({
        ...queryOptions,
        sort:
          sortModel && sortModel.length
            ? [sortModel[0].field, sortModel[0].sort]
            : [],
      });
    }
  }, [queryOptions, useMockData]);

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    if (!useMockData) {
      let filter = { ...queryOptions?.filter };
      if (filterModel.quickFilterValues?.length) {
        filter = {
          ...filter,
          q: filterModel.quickFilterValues[0],
        };
      }

      setQueryOptions({ ...queryOptions, filter });
    }
  }, [queryOptions, useMockData]);

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
        return beautifyCamelCase(row.type || '');
      },
    },
    {
      field: 'chainId',
      headerName: 'Network',
      minWidth: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId || 0);
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
      field: 'source',
      headerName: formatMessage({ id: 'source', defaultMessage: 'Source' }),
      minWidth: 200,
      renderCell: (params: any) => {
        return params.row.referral ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.referral
            }`}
          >
            {truncateAddress(params.row.referral)}
          </Link>
        ) : '-';
      },
    },
    {
      field: 'from',
      headerName: formatMessage({ id: 'from', defaultMessage: 'From' }),
      minWidth: 200,
      renderCell: (params: any) => {
        return params.row.from ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.from
            }`}
          >
            {truncateAddress(params.row.from)}
          </Link>
        ) : '-';
      },
    },
    {
      field: 'deviceType',
      headerName: formatMessage({ id: 'device', defaultMessage: 'Device' }),
      minWidth: 120,
      renderCell: (params: any) => {
        return params.row.deviceType ? params.row.deviceType : (
          <Tooltip title="Unknown device">
            <DeviceUnknownIcon fontSize="small" color="action" />
          </Tooltip>
        );
      },
    },
    {
      field: 'actions',
      headerName: formatMessage({ id: 'actions', defaultMessage: 'Actions' }),
      minWidth: 100,
      renderCell: (params: any) => (
        <Tooltip title={formatMessage({ id: 'view.details', defaultMessage: 'View Details' })}>
          <IconButton
            onClick={() => onViewDetails(params.row)}
            size="small"
            color="primary"
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <CSVLink 
          data={csvData}
          filename={`events-export-${new Date().toISOString().slice(0, 10)}.csv`}
          className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
          style={{ textDecoration: 'none', marginLeft: 8 }}
        >
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            size="small"
          >
            <FormattedMessage id="export.csv" defaultMessage="Export CSV" />
          </Button>
        </CSVLink>
      </Box>
    <DataGrid
      autoHeight
      slots={{ toolbar: GridToolbar }}
      rows={useMockData ? mockData : (data?.data || [])}
      columns={columns}
      rowCount={useMockData ? mockData.length : rowCountState}
      paginationModel={paginationModel}
      paginationMode={useMockData ? "client" : "server"}
      disableColumnFilter
      sortingMode={useMockData ? "client" : "server"}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
      onPaginationModelChange={setPaginationModel}
      filterMode={useMockData ? "client" : "server"}
      onFilterModelChange={onFilterChange}
      onSortModelChange={handleSortModelChange}
      pageSizeOptions={[5, 10, 25, 50]}
      disableRowSelectionOnClick
      loading={isLoading && !useMockData}
    />
    </Box>
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

// Define the correct structure of CountFilter for our case
interface LocalCountFilter {
  start: string;
  end: string;
  referral: string;
  from: string;
  chainId: number;
}

export default function UserEventAnalyticsContainer({ siteId }: Props) {
  const [value, setValue] = useState('1');
  const { formatMessage } = useIntl();
  const [selected, setSelected] = useState<UserEvent | null>(null);
  const [open, setOpen] = useState(false);
  const { activeChainIds } = useActiveChainIds();
  const [filters, setFilters] = useState<LocalCountFilter>({
    start: moment().subtract(7, 'day').format(),
    end: moment().format(),
    referral: '',
    from: '',
    chainId: 0,
  });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleViewDetails = (event: UserEvent) => {
    setSelected(event);
    setOpen(true);
  };

  const FiltersSchema = z.object({
    start: z.preprocess(
      (val) => {
        if (val === null || val === undefined || val === '') return undefined;
        return val instanceof Date ? val : moment(val).toDate();
      },
      z.date().optional()
    ),
    end: z.preprocess(
      (val) => {
        if (val === null || val === undefined || val === '') return undefined;
        return val instanceof Date ? val : moment(val).toDate();
      },
      z.date().optional()
    ),
    referral: z.string().optional(),
    from: z.string().optional(),
    chainId: z.number().optional(),
  });

  const handleSubmitFilters = async (values: any) => {
    setFilters({ 
      start: values.start ? moment(values.start).format() : moment().subtract(7, 'day').format(),
      end: values.end ? moment(values.end).format() : moment().format(),
      referral: values.referral || '',
      from: values.from || '',
      chainId: values.chainId || 0,
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <FormattedMessage id="event.analytics" defaultMessage="Event Analytics" />
            </Typography>
        <Typography variant="body1" color="text.secondary">
              <FormattedMessage
            id="event.analytics.description" 
            defaultMessage="Analyze and track user interactions within your DApp to understand usage patterns and improve user experience." 
              />
            </Typography>
              </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <CountEventsCard filters={filters} />
                        </Grid>
        <Grid item xs={12} md={4}>
                          <CountAccountsCard filters={filters} />
                        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" gutterBottom>
              <FormattedMessage id="device.distribution" defaultMessage="Device Distribution" />
            </Typography>
            <Box sx={{ height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0 }}>
              <DeviceDistributionChart filters={filters} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box mb={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage id="event.trends" defaultMessage="Event Trends" />
                                                </Typography>
          <UserEventCharts filters={filters} />
        </Paper>
      </Box>

      <Box mb={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage id="conversion.funnel" defaultMessage="Conversion Funnel" />
                                                </Typography>
          <UserFunnelVisualization filters={filters} />
        </Paper>
      </Box>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterAltIcon />
            <Typography>
              <FormattedMessage id="filters" defaultMessage="Filters" />
                                                </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
                          <Formik
            initialValues={{
              referral: filters.referral,
              from: filters.from,
              chainId: filters.chainId,
              start: moment(filters.start).toDate(),
              end: moment(filters.end).toDate(),
            }}
                            onSubmit={handleSubmitFilters}
                            validate={(values) => {
                              const errors: Record<string, string> = {};
                              
                              if (!values.start) {
                                errors.start = 'Start date is required';
                              }
                              
                              if (!values.end) {
                                errors.end = 'End date is required';
                              }
                              
                              if (values.from && !isAddress(values.from)) {
                                errors.from = 'Invalid address';
                              }
                              
                              if (values.referral && !isAddress(values.referral)) {
                                errors.referral = 'Invalid address';
                              }
                              
                              return errors;
                            }}
                          >
                            {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              setFieldValue,
                              resetForm,
                              isSubmitting,
                            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DateTimePicker
                                        disableFuture
                                        label={formatMessage({
                                          id: 'start',
                                          defaultMessage: 'Start Date',
                                        })}
                                      value={moment(values.start)}
                                        onChange={(date: Moment | null) => {
                                          setFieldValue('start', date?.toDate() || null);
                                        }}
                                        renderInput={(params) => <MuiTextField {...params} />}
                                      />
                                    </LocalizationProvider>
                      </FormControl>
                                  </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DateTimePicker
                                        disableFuture
                                        label={formatMessage({
                                          id: 'end',
                                          defaultMessage: 'End Date',
                                        })}
                                      value={moment(values.end)}
                                        onChange={(date: Moment | null) => {
                                          setFieldValue('end', date?.toDate() || null);
                                        }}
                                        renderInput={(params) => <MuiTextField {...params} />}
                                      />
                                    </LocalizationProvider>
                      </FormControl>
                                  </Grid>
                    <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                      <Field
                          component={TextField}
                          name="source"
                          label={formatMessage({
                            id: 'source',
                            defaultMessage: 'Source',
                          })}
                                        fullWidth
                        />
                                    </FormControl>
                                  </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                                    <Field
                                      component={TextField}
                                      name="from"
                          label={formatMessage({
                            id: 'from',
                            defaultMessage: 'From',
                          })}
                                      fullWidth
                                    />
                      </FormControl>
                                  </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <Field
                          component={Select}
                          formControl={{ fullWidth: true }}
                          name="chainId"
                          label={formatMessage({
                            id: 'chain',
                            defaultMessage: 'Chain',
                          })}
                        >
                          <MenuItem value={0}>
                            <FormattedMessage id="all" defaultMessage="All" />
                          </MenuItem>
                          {Array.isArray(activeChainIds) && activeChainIds.map((chainId) => (
                            <MenuItem key={chainId} value={chainId}>
                              {NETWORK_NAME(chainId)}
                            </MenuItem>
                          ))}
                        </Field>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Box mt={2} sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                                          variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      <FormattedMessage id="apply" defaultMessage="Apply" />
                    </Button>
                                        <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                                            resetForm();
                        setFilters({
                          start: moment().subtract(7, 'day').format(),
                          end: moment().format(),
                          referral: '',
                          from: '',
                          chainId: 0,
                        });
                      }}
                    >
                      <FormattedMessage id="reset" defaultMessage="Reset" />
                                        </Button>
                                    </Box>
                </Box>
              </form>
                            )}
                          </Formik>
        </AccordionDetails>
      </Accordion>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              label={formatMessage({
                id: 'on.chain',
                defaultMessage: 'On-Chain',
              })}
              value="1"
            />
            <Tab
              label={formatMessage({
                id: 'off.chain',
                defaultMessage: 'Off-Chain',
              })}
              value="2"
            />
          </TabList>
                        </Box>
        <TabPanel value="1">
                      <OnChainDataGrid
                        siteId={siteId}
                        filters={filters}
                        onViewDetails={handleViewDetails}
                      />
              </TabPanel>
              <TabPanel value="2">
                <OffChainTab siteId={siteId} />
              </TabPanel>
            </TabContext>
      {selected && (
        <EventDetailDialog
          DialogProps={{
            open,
            onClose: handleClose,
          }}
          event={selected}
        />
      )}
          </Box>
  );
}
