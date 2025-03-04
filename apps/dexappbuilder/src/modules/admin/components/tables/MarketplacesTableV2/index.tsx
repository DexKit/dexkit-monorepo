import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { ConfigResponse } from '../../../../../types/whitelabel';

import { ADMIN_TABLE_LIST } from '@/modules/admin/constants';
import { useIsMobile } from '@dexkit/core';
import { AppConfirmDialog, AppLink } from '@dexkit/ui';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import MoreVert from '@mui/icons-material/MoreVert';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRowId,
  GridSortModel,
} from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import { IS_STAGING } from 'src/constants';
import { useDeleteMyAppMutation } from 'src/hooks/whitelabel';
import Menu from './Menu';

interface Props {
  configs: ConfigResponse[];
  onConfigureDomain: (config: ConfigResponse) => void;
}

export default function MarketplacesTableV2({ configs }: Props) {
  const router = useRouter();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { formatMessage } = useIntl();

  const isMobile = useIsMobile();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [rowId, setRowId] = useState<GridRowId>();

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setRowId(undefined);
  };

  const [showRemove, setShowRemove] = useState(false);

  const handleCloseRemove = () => {
    setShowRemove(false);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleExport = (id: GridRowId) => {
    const config = configs.find((c) => c.id === id);

    if (config) {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        config?.config,
      )}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = 'config.json';

      link.click();

      enqueueSnackbar(
        <FormattedMessage
          id="config.exported"
          defaultMessage="Config exported"
        />,
        { variant: 'success' },
      );
    }
  };

  const handlePreview = (id: GridRowId) => {
    const config = configs.find((c) => c.id === id);

    if (config) {
      window.open(
        IS_STAGING
          ? `https://test.dev.dexkit.app?mid=${config?.slug}`
          : `https://dexappbuilder.dexkit.com?mid=${config?.slug}`,
        '_blank',
      );
    }
    handleCloseMenu();
  };

  const handleEdit = (id: GridRowId) => {
    const config = configs.find((c) => c.id === id);
    handleCloseMenu();

    router.push(`/admin/edit/${config?.slug}`);
  };

  const handleDeleteSuccess = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'App removed',
        id: 'app.removed',
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

  const handleDeleteError = (error: any) => {
    enqueueSnackbar(
      `${formatMessage({
        defaultMessage: 'Error',
        id: 'error',
      })}: ${String(error)}`,
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();

  const deleteMutation = useDeleteMyAppMutation({
    options: { onSuccess: handleDeleteSuccess, onError: handleDeleteError },
  });

  const handleConfirmRemove = () => {
    if (selectedId) {
      const slug = configs.find((c) => c.id === selectedId)?.slug;

      if (slug) {
        deleteMutation.mutate({
          slug: slug,
        });
      }
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleRemove = (id: GridRowId) => {
    setIsOpen(true);
    setSelectedId(id as number);
    handleCloseMenu();
  };

  const handleAction = (action: string, id: GridRowId) => {
    switch (action) {
      case 'export':
        handleExport(id);
        break;
      case 'preview':
        handlePreview(id);
        break;
      case 'edit':
        handleEdit(id);
        break;
      case 'delete':
        handleRemove(id);
        break;
      default:
        break;
    }
  };

  const handleMenuAction = (action: string) => {
    if (rowId) {
      handleAction(action, rowId);
    }
  };

  const columns: GridColDef<ConfigResponse>[] = [
    {
      disableColumnMenu: true,
      renderHeader: (params) => {
        return (
          <Typography
            sx={(theme) => ({
              fontSize: isMobile
                ? theme.typography.fontSize * 1.25
                : theme.typography.fontSize,
            })}
            fontWeight="500"
          >
            {params.colDef.headerName}
          </Typography>
        );
      },
      field: 'name',
      headerName: formatMessage({ id: 'name', defaultMessage: 'Name' }),
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Typography
            sx={(theme) => ({
              fontSize: isMobile
                ? theme.typography.fontSize * 1.25
                : theme.typography.fontSize,
            })}
            fontWeight="400"
          >
            {params.value}
          </Typography>
        );
      },
      valueGetter: ({ row }) => {
        return row.slug;
      },
    },
    {
      disableColumnMenu: true,
      disableReorder: true,
      sortable: false,
      renderHeader: (params) => {
        return (
          <Typography
            sx={(theme) => ({
              fontSize: isMobile
                ? theme.typography.fontSize * 1.25
                : theme.typography.fontSize,
            })}
            fontWeight="500"
          >
            {params.colDef.headerName}
          </Typography>
        );
      },
      field: 'domain',
      flex: 1,
      headerName: formatMessage({ id: 'domain', defaultMessage: 'Domain' }),
      minWidth: 200,
      renderCell: ({ row }) => {
        const appConfig: AppConfig = JSON.parse(row.config);

        if (row.previewUrl) {
          return (
            <AppLink
              sx={(theme) => ({
                fontSize: isMobile
                  ? theme.typography.fontSize * 1.25
                  : theme.typography.fontSize,
              })}
              href={row.previewUrl}
            >
              {row.previewUrl}
            </AppLink>
          );
        }

        if (appConfig.domain && appConfig.domain !== '') {
          return (
            <AppLink
              sx={(theme) => ({
                fontSize: isMobile
                  ? theme.typography.fontSize * 1.25
                  : theme.typography.fontSize,
              })}
              href={appConfig.domain}
              target={'_blank'}
            >
              {appConfig.domain}
            </AppLink>
          );
        }
      },
    },
    {
      field: 'action',
      disableReorder: true,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: (params) => {
        return (
          <Typography
            sx={(theme) => ({
              fontSize: isMobile
                ? theme.typography.fontSize * 1.25
                : theme.typography.fontSize,
            })}
            fontWeight="500"
          >
            {params.colDef.headerName}
          </Typography>
        );
      },
      flex: 1,
      minWidth: isMobile ? 150 : undefined,
      headerName: formatMessage({ id: 'actions', defaultMessage: 'Actions' }),
      headerAlign: 'center',
      renderCell: ({ row, id }) => {
        if (isMobile) {
          return (
            <IconButton
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
                setRowId(id);
              }}
            >
              <MoreVert />
            </IconButton>
          );
        }

        return (
          <Stack
            sx={{ width: '100%' }}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            {ADMIN_TABLE_LIST.map((item, index) => (
              <Tooltip
                key={index}
                title={
                  <FormattedMessage
                    id={item.text.id}
                    defaultMessage={item.text.defaultMessage}
                  />
                }
              >
                <IconButton onClick={() => handleAction(item.value, id)}>
                  {item.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Stack>
        );
      },
    },
  ];

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {}, []);

  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'rating',
      sort: 'desc',
    },
  ]);

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    setSortModel(sortModel);
  }, []);

  return (
    <>
      <AppConfirmDialog
        DialogProps={{
          open: isOpen,
          onClose: handleClose,
        }}
        onConfirm={handleConfirmRemove}
      >
        <FormattedMessage
          id="do.you.really.want.to.remove.this.app"
          defaultMessage="Do you really want to remove this app"
        />
      </AppConfirmDialog>
      <Menu
        anchorEl={anchorEl}
        onAction={handleMenuAction}
        onClose={handleCloseMenu}
        open={Boolean(anchorEl)}
      />
      <DataGrid
        getRowId={(row) => row.id}
        autoHeight
        rows={configs || []}
        columns={columns}
        rowCount={configs.length}
        paginationModel={paginationModel}
        paginationMode="server"
        disableColumnFilter
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
          pagination: { sx: { mx: 0.75 } },
        }}
        sortModel={sortModel}
        onPaginationModelChange={setPaginationModel}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        onSortModelChange={handleSortModelChange}
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
        loading={false}
      />
    </>
  );
}
