import { Network, TokenWhitelabelApp } from '@dexkit/core/types';
import { getChainName } from '@dexkit/core/utils';
import { InfoOutlined } from '@mui/icons-material';
import MoreHoriz from '@mui/icons-material/MoreHorizOutlined';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TOKEN_KEY } from '../../utils';
import TokensTableMenu from './TokensTableMenu';

export interface TokensTableProps {
  tokens: TokenWhitelabelApp[];
  search: string;
  networks: Network[];
  appUrl?: string;
  onMakeTradable: (key: string) => void;
  onDisableFeatured: (key: string) => void;
  selection: string[];
  onChangeSelection: (selection: string[]) => void;
}

interface TokenWhitelabelAppWithIndex {
  index: number;
  token: TokenWhitelabelApp;
}

export default function TokensTable({
  tokens,
  search,
  networks,
  appUrl,
  onMakeTradable,
  onChangeSelection,
  onDisableFeatured,
  selection,
}: TokensTableProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'Token', sort: 'asc' },
  ]);

  const [selectedToken, setSelectedToken] = useState<TokenWhitelabelApp>();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = (token: TokenWhitelabelApp) => {
    return (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setSelectedToken(token);
      setAnchorEl(e.currentTarget);
    };
  };

  const networkIds = useMemo(() => {
    return networks.map((n) => n.chainId);
  }, [networks]);

  const filteredTokens: TokenWhitelabelAppWithIndex[] = useMemo(() => {
    let newTokens = [
      ...tokens.map((t, index) => ({
        index,
        token: t,
      })),
    ];

    if (!tokens) {
      return [];
    }

    if (networks.length > 0) {
      newTokens = newTokens.filter((t) => {
        return networkIds.includes(t.token.chainId);
      });
    }

    newTokens = newTokens.filter((t) => {
      return (
        t.token.name.toLowerCase().search(search.toLowerCase()) > -1 ||
        t.token.symbol.toLowerCase().search(search.toLowerCase()) > -1
      );
    });

    if (sortModel.length > 0 && sortModel[0]?.sort === 'asc') {
      newTokens = newTokens.sort((a, b) =>
        a.token.name.localeCompare(b.token.name, new Intl.Locale('pt-BR')),
      );
    } else {
      newTokens = newTokens
        .sort((a, b) =>
          a.token.name.localeCompare(b.token.name, new Intl.Locale('pt-BR')),
        )
        .reverse();
    }

    return newTokens;
  }, [JSON.stringify(tokens), search, networkIds, sortModel]);

  const [offset, limit] = useMemo(() => {
    return [
      paginationModel.page * paginationModel.pageSize,
      paginationModel.page * paginationModel.pageSize +
        paginationModel.pageSize,
    ];
  }, [paginationModel, JSON.stringify(filteredTokens)]);

  const pageList = useMemo(() => {
    return filteredTokens?.slice(offset, limit) || [];
  }, [JSON.stringify(filteredTokens), offset, limit]);

  const handleMakeTradable = useCallback(
    (token: TokenWhitelabelApp) => {
      return (e: MouseEvent) => {
        e.stopPropagation();

        return onMakeTradable(TOKEN_KEY(token));
      };
    },
    [onMakeTradable],
  );

  const handleDisableFeatured = useCallback(
    (token: TokenWhitelabelApp) => {
      return (e: MouseEvent) => {
        e.stopPropagation();

        return onDisableFeatured(TOKEN_KEY(token));
      };
    },
    [onDisableFeatured],
  );

  const columns: GridColDef<TokenWhitelabelAppWithIndex>[] = useMemo(() => {
    return [
      {
        field: 'Token',
        flex: 1,
        renderHeader: () => (
          <Typography>
            <FormattedMessage id="token" defaultMessage="Token" />
          </Typography>
        ),
        renderCell: ({ row, value }) => {
          return (
            <Stack
              sx={{ py: 1 }}
              direction="row"
              alignItems="center"
              spacing={2}
            >
              <Avatar
                sx={(theme) => ({
                  width: theme.spacing(4),
                  height: theme.spacing(4),
                })}
                src={row.token.logoURI}
              />
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight="400" variant="body1">
                    {row.token.name}{' '}
                    <Typography
                      color="text.secondary"
                      variant="caption"
                      component="span"
                      sx={{ ml: 1.5 }}
                    >
                      {row.token.symbol.toUpperCase()}
                    </Typography>
                  </Typography>
                  <IconButton size="small" onClick={handleOpenMenu(row.token)}>
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={getChainName(row.token.chainId)} size="small" />
                  {row.token.tradable && (
                    <Chip
                      label={
                        <FormattedMessage
                          id="tradable"
                          defaultMessage="Tradable"
                        />
                      }
                      size="small"
                    />
                  )}
                </Stack>
              </Box>
            </Stack>
          );
        },
        disableColumnMenu: true,
      },
      {
        flex: 0.5,
        field: 'Highlight',
        disableColumnMenu: true,
        disableReorder: true,
        sortable: false,
        renderHeader: () => (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="inherit">
              <FormattedMessage id="highlight" defaultMessage="Highlight" />
            </Typography>
            <Tooltip
              title={
                <FormattedMessage
                  id="select.the.tokens.that.will.be.highlighted.in.the.swap.section"
                  defaultMessage="Select the tokens that will be highlighted in the Swap section"
                />
              }
              placement="top"
            >
              <InfoOutlined fontSize="inherit" sx={{ color: 'grey.400' }} />
            </Tooltip>
          </Stack>
        ),
        renderCell: ({ row }) => {
          return (
            <Switch
              checked={!Boolean(row.token.disableFeatured)}
              onClick={handleDisableFeatured(row.token)}
            />
          );
        },
      },
      {
        flex: 0.2,
        field: 'assign',
        disableColumnMenu: true,
        disableReorder: true,
        sortable: false,
        renderHeader: () => (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="inherit">
              <FormattedMessage id="assign" defaultMessage="Assign" />
            </Typography>
            <Tooltip
              title={
                <FormattedMessage
                  id="assign.tokens.for.nft.transactions.in.your.app"
                  defaultMessage="Assign tokens for NFT transactions in your app."
                />
              }
              placement="top"
            >
              <InfoOutlined fontSize="inherit" sx={{ color: 'grey.400' }} />
            </Tooltip>
          </Stack>
        ),
        renderCell: ({ row }) => {
          return (
            <Switch
              checked={Boolean(row.token.tradable)}
              onClick={handleMakeTradable(row.token)}
            />
          );
        },
      },
      // {
      //   flex: 1,
      //   field: 'actions',
      //   disableColumnMenu: true,
      //   disableReorder: true,
      //   sortable: false,
      //   renderHeader: () => (
      //     <Typography>
      //       <FormattedMessage id="actions" defaultMessage="Actions" />
      //     </Typography>
      //   ),
      //   renderCell: ({ row }) => {
      //     return (
      //       <IconButton onClick={handleOpenMenu(row.token)}>
      //         <MoreVert />
      //       </IconButton>
      //     );
      //   },
      // },
    ] as GridColDef<TokenWhitelabelAppWithIndex>[];
  }, []);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [],
  );

  return (
    <>
      <TokensTableMenu
        appUrl={appUrl}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        token={selectedToken}
      />
      <DataGrid
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
          border: 'none',
        }}
        sortingOrder={['asc', 'desc']}
        columns={columns}
        rows={pageList}
        rowSelection
        rowCount={filteredTokens.length}
        checkboxSelection
        getRowId={(row) => TOKEN_KEY(row.token as any)}
        rowHeight={70}
        onSortModelChange={setSortModel}
        sortModel={sortModel}
        pageSizeOptions={[5, 10, 25, 50]}
        onPaginationModelChange={setPaginationModel}
        paginationModel={paginationModel}
        paginationMode="server"
        rowSelectionModel={selection}
        disableRowSelectionOnClick
        disableColumnSelector
        onRowSelectionModelChange={(rowSelection) =>
          onChangeSelection(rowSelection as string[])
        }
      />
    </>
  );
}
