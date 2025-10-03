import { useRouter } from "next/router";
import { useCallback, useState } from "react";

import { useIsMobile } from "@dexkit/core";
import { AppConfirmDialog } from "@dexkit/ui";
import MoreVert from "@mui/icons-material/MoreVert";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRowId,
  GridSortModel,
} from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";

import { useSendWidgetConfigMutation } from "../../../../whitelabel/hooks/useSendWidgetConfigMutation";
import { useDeleteWidgetMutation } from "../../../../wizard/hooks/widget";
import { AppConfig } from "../../../../wizard/types/config";
import { ADMIN_TABLE_LIST } from "../../../constants";
import ImportAppConfigDialog from "../../dialogs/ImportAppConfigDialog";
import Menu from "../MarketplacesTableV2/Menu";

interface Row {
  id: number;
  name: string;
  config: string;
}

interface Props {
  configs: Row[];
  onEditWidget?: (id: number) => void;
}

export default function WidgetsTable({ configs, onEditWidget }: Props) {
  const router = useRouter();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { formatMessage } = useIntl();

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<number>();
  const [currentAppConfig, setCurrentAppConfig] = useState<AppConfig | null>(
    null
  );

  const sendConfigMutation = useSendWidgetConfigMutation({
    id: selectedConfig,
  });

  const isMobile = useIsMobile();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [rowId, setRowId] = useState<GridRowId>();

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setRowId(undefined);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleExport = (id: GridRowId) => {
    const config = configs.find((c) => c.id === id);

    if (config) {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        config?.config
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "config.json";

      link.click();

      enqueueSnackbar(
        <FormattedMessage
          id="config.exported"
          defaultMessage="Config exported"
        />,
        { variant: "success" }
      );
    }
  };

  const handleCloseImportDialog = () => {
    setShowImportDialog(false);
  };

  const handleImport = (id: GridRowId) => {
    const config = configs.find((c) => c.id === Number(id));
    console.log("handleImport", config);

    if (config) {
      const currentAppConfig = JSON.parse(config.config) as AppConfig;
      setSelectedConfig(Number(id));
      setCurrentAppConfig(currentAppConfig);
      setShowImportDialog(true);
    }

    handleCloseMenu();
  };

  const handleImportConfig = (
    importedConfig: AppConfig,
    shouldRedirect = true
  ) => {
    if (selectedConfig) {
      try {
        const configString = JSON.stringify(importedConfig);

        enqueueSnackbar(
          formatMessage({
            defaultMessage: "Sending configuration...",
            id: "sending.configuration",
          }),
          { variant: "info" }
        );

        sendConfigMutation.mutate(
          {
            config: configString,
          },
          {
            onError: (error: any) => {
              enqueueSnackbar(
                `${formatMessage({
                  defaultMessage: "Error importing configuration",
                  id: "error.importing.configuration",
                })}: ${error?.message ? error?.message : "Unknown error"}. ${formatMessage(
                  {
                    defaultMessage: "Check if the server is running correctly.",
                    id: "check.server.running",
                  }
                )}`,
                {
                  variant: "error",
                  autoHideDuration: 8000,
                }
              );
            },
            onSuccess: () => {
              enqueueSnackbar(
                formatMessage({
                  defaultMessage: "Configuration imported successfully",
                  id: "config.imported.successfully",
                }),
                { variant: "success" }
              );

              if (shouldRedirect && selectedConfig) {
                setTimeout(() => {
                  router.push(`/admin/widget/edit/${selectedConfig}`);
                }, 1000);
              } else {
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }
            },
          }
        );
      } catch (error) {
        enqueueSnackbar(
          formatMessage({
            defaultMessage: "Error preparing configuration for import",
            id: "error.preparing.configuration",
          }),
          { variant: "error" }
        );
      }
    } else {
      enqueueSnackbar(
        formatMessage({
          defaultMessage: "No DApp selected for import",
          id: "no.dapp.selected",
        }),
        { variant: "error" }
      );
    }
  };

  const handlePreview = (id: GridRowId) => {
    const config = configs.find((c) => c.id === id);

    if (config) {
    }
    handleCloseMenu();
  };

  const handleEdit = (id: GridRowId) => {
    const config = configs.find((c) => c.id === id);
    handleCloseMenu();
    if (onEditWidget && config?.id) {
      onEditWidget(config?.id);
    } else {
      router.push(`/admin/widget/edit/${config?.id}`);
    }
  };

  const handleDeleteSuccess = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: "Widget removed",
        id: "widget.removed",
      }),
      {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      }
    );
  };

  const handleDeleteError = (error: any) => {
    enqueueSnackbar(
      `${formatMessage({
        defaultMessage: "Error",
        id: "error",
      })}: ${String(error)}`,
      {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      }
    );
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();

  const deleteMutation = useDeleteWidgetMutation({
    options: { onSuccess: handleDeleteSuccess, onError: handleDeleteError },
  });

  const handleConfirmRemove = () => {
    if (selectedId) {
      deleteMutation.mutate({
        id: selectedId,
      });
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
      case "import":
        handleImport(id);
        break;
      case "export":
        handleExport(id);
        break;
      case "preview":
        handlePreview(id);
        break;
      case "edit":
        handleEdit(id);
        break;
      case "delete":
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

  const columns: GridColDef<Row>[] = [
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
      field: "name",
      headerName: formatMessage({ id: "name", defaultMessage: "Name" }),
      minWidth: 200,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
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
          </Box>
        );
      },
      valueGetter: (value: any, row: any) => {
        return (row as Row).name;
      },
    },
    {
      field: "action",
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
      headerName: formatMessage({ id: "actions", defaultMessage: "Actions" }),
      headerAlign: "center",
      align: "center",
      renderCell: ({ row, id }) => {
        if (isMobile) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <IconButton
                onClick={(e: any) => {
                  setAnchorEl(e.currentTarget);
                  setRowId(id);
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>
          );
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Stack
              sx={{ width: "100%" }}
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
          </Box>
        );
      },
    },
  ];

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {}, []);

  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: "rating",
      sort: "desc",
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
          id="do.you.really.want.to.remove.this.widget"
          defaultMessage="Do you really want to remove this widget"
        />
      </AppConfirmDialog>
      <ImportAppConfigDialog
        DialogProps={{
          open: showImportDialog,
          onClose: handleCloseImportDialog,
          maxWidth: "sm",
          fullWidth: true,
        }}
        isWidget={true}
        onImport={handleImportConfig}
        currentConfig={currentAppConfig || undefined}
        redirectAfterImport={true}
      />
      <Menu
        anchorEl={anchorEl}
        onAction={handleMenuAction}
        onClose={handleCloseMenu}
        open={Boolean(anchorEl)}
      />
      <Box sx={{
        width: '100%',
        height: { xs: 400, sm: 500 },
        '& .MuiDataGrid-root': {
          border: 'none',
        }
      }}>
        <DataGrid
          getRowId={(row: any) => row.id as number}
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
          sx={{
            width: '100%',
            maxWidth: '100%',
            border: 'none',
          }}
        />
      </Box>
    </>
  );
}
