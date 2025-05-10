import { useIsMobile } from '@dexkit/core';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRowId,
  GridSortModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { getBlockExplorerUrl } from '@dexkit/core/utils';
import { getWindowUrl } from '@dexkit/core/utils/browser';
import { AppConfirmDialog } from '@dexkit/ui';
import ShareDialog from '@dexkit/ui/components/dialogs/ShareDialog';
import { ContractFormData } from '@dexkit/ui/modules/forms/hooks/index';
import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { ADMIN_FORMS_ACTION_LIST } from '../constants/actions';
import { useCloseFormMutation, useDeleteFormMutation } from '../hooks';

const NoResultsStack = () => {
  return (
    <Stack py={2} alignItems="center" justifyItems="center" spacing={1}>
      <Box>
        <Typography align="center" variant="h5">
          <FormattedMessage id="no.forms" defaultMessage="No Forms" />
        </Typography>
        <Typography align="center" variant="body1" color="text.secondary">
          <FormattedMessage
            id="table.no.records"
            defaultMessage="No forms records are currently available"
          />
        </Typography>
      </Box>
    </Stack>
  );
};

export interface AccountFormsTableProps {
  forms: ContractFormData[];
  refetch: () => Promise<void>;
  onSearch: (value: string) => void;
  count: number;
}

export default function AccountFormsTable({
  forms,
  refetch,
  onSearch,
  count,
}: AccountFormsTableProps) {
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

  const [showConfirmClone, setShowConfirmClone] = useState(false);

  const handleCloseRemove = () => {
    setShowRemove(false);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handlePreview = (id: GridRowId) => {
    const config = forms.find((c) => c.id === id);
  };

  const handleEdit = (id: GridRowId) => {
    const form = forms.find((c) => c.id === id);
    handleCloseMenu();

    router.push(`/admin/edit/${form?.id}`);
  };

  const [selectedId, setSelectedId] = useState<number>();

  const handleRemove = (id: GridRowId) => {
    setShowRemove(true);
    setSelectedId(id as number);
    handleCloseMenu();
  };

  const [showShare, setShowShare] = useState(false);

  const handleShare = (id: GridRowId) => {
    setShowShare(true);
    setSelectedId(id as number);
  };

  const handleCloseShare = () => {
    setShowShare(false);
    setSelectedId(undefined);
  };

  const handleClone = (id: GridRowId) => {
    setShowConfirmClone(true);
    setSelectedId(id as number);
  };

  const handleAction = (action: string, id: GridRowId) => {
    switch (action) {
      case 'preview':
        handlePreview(id);
        break;
      case 'edit':
        handleEdit(id);
        break;
      case 'delete':
        handleRemove(id);
        break;
      case 'clone':
        handleClone(id);
        break;
      case 'share':
        handleShare(id);
        break;
      default:
        break;
    }
  };

  const deleteFormMutation = useDeleteFormMutation();

  const handleDeleteForm = async () => {
    try {
      if (selectedId) {
        await deleteFormMutation.mutateAsync({ id: selectedId });

        enqueueSnackbar(
          formatMessage({
            id: 'form.deleted.successfully',
            defaultMessage: 'Form deleted successfully',
          }),
          {
            variant: 'success',
          }
        );

        await refetch();
      }
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  const cloneFormMutation = useCloseFormMutation();

  const handleCloseClone = () => {
    setShowConfirmClone(false);
  };

  const handleConfirmClone = async () => {
    if (selectedId) {
      try {
        await cloneFormMutation.mutateAsync({
          id: selectedId,
        });
        setShowConfirmClone(false);
        enqueueSnackbar(
          formatMessage({
            id: 'form.cloned.successfully',
            defaultMessage: 'Form cloned successfully',
          }),
          {
            variant: 'success',
          }
        );
        await refetch();
      } catch (err) {
        enqueueSnackbar(String(err), { variant: 'error' });
      }
    }
  };

  const renderIconButton = (row: ContractFormData, menuItem: any) => {
    if (menuItem.value === 'explorer') {
      return (
        <IconButton
          LinkComponent={Link}
          href={`${getBlockExplorerUrl(row.params.chainId)}/address/${
            row.params.contractAddress
          }`}
          target="_blank"
        >
          {menuItem.icon}
        </IconButton>
      );
    }

    if (menuItem.value === 'set') {
      return (
        <IconButton LinkComponent={Link} href={`/forms/${row.id}`}>
          {menuItem.icon}
        </IconButton>
      );
    }

    return (
      <IconButton onClick={() => handleAction(menuItem.value, row.id)}>
        {menuItem.icon}
      </IconButton>
    );
  };

  const columns: GridColDef<ContractFormData>[] = [
    {
      field: 'name',
      headerName: formatMessage({ id: 'name', defaultMessage: 'Name' }),

      flex: 1,
      valueGetter: ({ row }) => {
        return row.name;
      },
    },
    {
      field: 'description',
      flex: 1,
      headerName: formatMessage({
        id: 'description',
        defaultMessage: 'Description',
      }),
      minWidth: 200,
      renderCell: ({ row }) => {
        return row.description;
      },
    },
    {
      field: 'action',
      flex: 1,
      headerName: formatMessage({ id: 'actions', defaultMessage: 'Actions' }),
      minWidth: 200,
      renderCell: ({ row }) => {
        if (isMobile) {
          return (
            <IconButton
              onClick={(e) => {
                setRowId(row.id);
                setAnchorEl(e.currentTarget);
              }}
            >
              <MoreVert />
            </IconButton>
          );
        }

        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            {ADMIN_FORMS_ACTION_LIST.map((item, index) => (
              <Tooltip
                key={index}
                title={
                  <FormattedMessage
                    id={item.title.id}
                    defaultMessage={item.title.defaultMessage}
                  />
                }
              >
                {renderIconButton(row, item)}
              </Tooltip>
            ))}
          </Stack>
        );
      },
    },
  ];

  const [filter, setFilter] = useState<GridFilterModel>();

  const onFilterChange = useCallback(
    (filterModel: GridFilterModel) => {
      let query = '';

      if (filterModel?.quickFilterValues) {
        query = filterModel?.quickFilterValues[0] ?? '';
      }

      onSearch(query);

      setFilter(filterModel);
    },
    [onSearch]
  );

  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'rating',
      sort: 'desc',
    },
  ]);

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    setSortModel(sortModel);
  }, []);

  const handleClickAction = (action: string, id?: GridRowId) => {
    return () => {
      if (id !== undefined) {
        handleAction(action, id);
      }
    };
  };

  const handleConfirmRemove = () => {
    handleDeleteForm();

    setSelectedId(undefined);
    setShowRemove(false);
  };

  return (
    <>
      {showShare && (
        <ShareDialog
          dialogProps={{
            open: showShare,
            onClose: handleCloseShare,
            maxWidth: 'sm',
            fullWidth: true,
          }}
          url={`${getWindowUrl()}/forms/${selectedId}`}
        />
      )}

      <AppConfirmDialog
        onConfirm={handleConfirmClone}
        DialogProps={{
          maxWidth: 'sm',
          fullWidth: true,
          open: showConfirmClone,
          onClose: handleCloseClone,
        }}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.clone.this.form"
            defaultMessage="Do you really want to clone this form?"
          />
        </Typography>
      </AppConfirmDialog>
      {rowId && (
        <Menu open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          {ADMIN_FORMS_ACTION_LIST.map((item, index) => (
            <MenuItem
              onClick={handleClickAction(item.value, rowId)}
              key={index}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <FormattedMessage
                    id={item.title.id}
                    defaultMessage={item.title.defaultMessage}
                  />
                }
              />
            </MenuItem>
          ))}
        </Menu>
      )}
      {selectedId && (
        <AppConfirmDialog
          DialogProps={{
            open: showRemove,
            onClose: handleCloseRemove,
          }}
          onConfirm={handleConfirmRemove}
        >
          <FormattedMessage
            id="do.you.really.want.to.remove.this.app"
            defaultMessage="Do you really want to remove this app"
          />
        </AppConfirmDialog>
      )}

      <DataGrid
        getRowId={(row) => row.id}
        autoHeight
        rows={forms}
        columns={columns}
        rowCount={count}
        paginationModel={paginationModel}
        paginationMode="server"
        disableColumnFilter
        slots={{ toolbar: GridToolbar, noRowsOverlay: NoResultsStack }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        filterModel={filter}
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
