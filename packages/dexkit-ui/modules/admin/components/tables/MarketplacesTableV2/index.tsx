import { useRouter } from "next/router";
import { useCallback, useState } from "react";

import { useIsMobile } from "@dexkit/core";
import { AppConfirmDialog, AppLink } from "@dexkit/ui";
import { useDeleteMyAppMutation } from "@dexkit/ui/modules/whitelabel/hooks/useDeleteMyAppMutation";
import {
  AppConfig,
  AppPage,
  ConfigResponse,
} from "@dexkit/ui/modules/wizard/types/config";
import {
  AppPageSection,
} from "@dexkit/ui/modules/wizard/types/section";
import MoreVert from "@mui/icons-material/MoreVert";
import { Box, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRowId,
  GridSortModel,
} from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { ADMIN_TABLE_LIST } from "../../../constants";
import ImportAppConfigDialog from "../../dialogs/ImportAppConfigDialog";
import Menu from "./Menu";

import { useSendConfigMutation } from "@dexkit/ui/modules/whitelabel/hooks/useSendConfigMutation";

interface Props {
  configs: ConfigResponse[];
  onConfigureDomain: (config: ConfigResponse) => void;
}

export default function MarketplacesTableV2({ configs }: Props) {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useIsMobile();
  const theme = useTheme();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: isMobile ? 5 : 10,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rowId, setRowId] = useState<GridRowId | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ConfigResponse | null>(null);
  const [currentAppConfig, setCurrentAppConfig] = useState<AppConfig | null>(null);

  const sendConfigMutation = useSendConfigMutation({
    options: {
    },
  });

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setRowId(null);
  };

  const handleImport = (id: GridRowId) => {
    const config = configs.find((c) => c.id === Number(id));

    if (config) {
      const currentAppConfig = JSON.parse(config.config) as AppConfig;
      setSelectedConfig(config);
      setCurrentAppConfig(currentAppConfig);
      setShowImportDialog(true);
    }

    handleCloseMenu();
  };

  const handleCloseImportDialog = () => {
    setShowImportDialog(false);
  };

  const handleImportConfig = (importedConfig: AppConfig, shouldRedirect = true) => {
    if (selectedConfig) {
      try {
        if (importedConfig.pages) {
          (Object.values(importedConfig.pages) as AppPage[]).forEach((page) => {
            if (page.sections) {
              page.sections.forEach((section: AppPageSection) => {
                if (section.type !== 'call-to-action') return;

                if (!section.items) {
                  section.items = [];
                }

                if (!section.button) {
                  section.button = {
                    title: 'Click here',
                    url: '#',
                    openInNewPage: false
                  };
                }

                if (!section.variant) {
                  section.variant = 'light';
                }
              });
            }
          });
        }

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
            slug: selectedConfig.slug,
          },
          {
            onError: (error) => {
              enqueueSnackbar(
                `${formatMessage({
                  defaultMessage: "Error importing configuration",
                  id: "error.importing.configuration",
                })}: ${error.message || "Unknown error"}. ${formatMessage({
                  defaultMessage: "Check if the server is running correctly.",
                  id: "check.server.running",
                })}`,
                {
                  variant: "error",
                  autoHideDuration: 8000
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

              if (shouldRedirect && selectedConfig?.slug) {
                setTimeout(() => {
                  router.push(`/admin/edit/${selectedConfig.slug}`);
                }, 1000);
              } else {
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }
            }
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

  const handleExport = (id: GridRowId) => {
    const config = configs.find((c) => c.id === Number(id));

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

  const handlePreview = (id: GridRowId) => {
    const config = configs.find((c) => c.id === Number(id));

    if (config) {
      window.open(
        `https://dexappbuilder.dexkit.com?mid=${config?.slug}`,
        "_blank"
      );
    }
    handleCloseMenu();
  };

  const handleEdit = (id: GridRowId) => {
    const config = configs.find((c) => c.id === Number(id));
    handleCloseMenu();

    if (config) {
      router.push(`/admin/edit/${config?.slug}`);
    }
  };

  const handleDeleteSuccess = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: "App removed",
        id: "app.removed",
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
    setSelectedId(Number(id));
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

  const columns: GridColDef<ConfigResponse>[] = [
    {
      disableColumnMenu: true,
      renderHeader: (params) => {
        return (
          <Typography
            sx={(theme: any) => ({
              fontSize: isMobile
                ? theme.typography.fontSize * 1.1
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
      flex: isMobile ? 0 : 1,
      width: isMobile ? 120 : undefined,
      minWidth: isMobile ? 120 : 200,
      renderCell: (params) => {
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            height: '100%',
            width: '100%'
          }}>
            <Typography
              sx={(theme: any) => ({
                fontSize: isMobile
                  ? theme.typography.fontSize * 1.1
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
        return (row as ConfigResponse).slug;
      },
    },
    {
      disableColumnMenu: true,
      disableReorder: true,
      sortable: false,
      renderHeader: (params) => {
        return (
          <Typography
            sx={(theme: any) => ({
              fontSize: isMobile
                ? theme.typography.fontSize * 1.1
                : theme.typography.fontSize,
            })}
            fontWeight="500"
          >
            {params.colDef.headerName}
          </Typography>
        );
      },
      field: "domain",
      flex: isMobile ? 1 : 2,
      headerName: formatMessage({ id: "domain", defaultMessage: "Domain" }),
      minWidth: isMobile ? 70 : 200,
      renderCell: ({ row }) => {
        const appConfig: AppConfig = JSON.parse(row.config);

        if (row.previewUrl) {
          return (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              height: '100%',
              width: '100%'
            }}>
              <AppLink
                sx={(theme: any) => ({
                  fontSize: isMobile
                    ? '0.75rem'
                    : theme.typography.fontSize,
                  wordBreak: 'break-all',
                  overflow: 'visible',
                  textOverflow: 'unset',
                  display: 'block',
                  maxWidth: '100%',
                  whiteSpace: 'normal',
                  lineHeight: 1.2,
                })}
                href={row.previewUrl}
                title={row.previewUrl}
              >
                {isMobile ? row.previewUrl.replace('https://', '') : row.previewUrl}
              </AppLink>
            </Box>
          );
        }

        if (appConfig.domain && appConfig.domain !== "") {
          return (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              height: '100%',
              width: '100%'
            }}>
              <AppLink
                sx={(theme: any) => ({
                  fontSize: isMobile
                    ? '0.75rem'
                    : theme.typography.fontSize,
                  wordBreak: 'break-all',
                  overflow: 'visible',
                  textOverflow: 'unset',
                  display: 'block',
                  maxWidth: '100%',
                  whiteSpace: 'normal',
                  lineHeight: 1.2,
                })}
                href={appConfig.domain}
                target={"_blank"}
                title={appConfig.domain}
              >
                {isMobile ? appConfig.domain.replace('https://', '') : appConfig.domain}
              </AppLink>
            </Box>
          );
        }
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
            sx={(theme: any) => ({
              fontSize: isMobile
                ? theme.typography.fontSize * 1.1
                : theme.typography.fontSize,
            })}
            fontWeight="500"
          >
            {params.colDef.headerName}
          </Typography>
        );
      },
      width: isMobile ? 80 : 200,
      minWidth: isMobile ? 80 : 150,
      maxWidth: isMobile ? 80 : 200,
      headerName: formatMessage({ id: "actions", defaultMessage: "Actions" }),
      headerAlign: "center",
      renderCell: ({ row, id }) => {
        if (isMobile) {
          return (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              width: '100%'
            }}>
              <IconButton
                onClick={(e: any) => {
                  setAnchorEl(e.currentTarget);
                  setRowId(id);
                }}
                size={isMobile ? "small" : "large"}
                sx={{
                  p: isMobile ? 0.25 : 1,
                  minWidth: isMobile ? 32 : 'auto'
                }}
              >
                <MoreVert fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Box>
          );
        }

        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            width: '100%'
          }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={0.5}
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

  const onFilterChange = useCallback((filterModel: GridFilterModel) => { }, []);

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
          id="do.you.really.want.to.remove.this.app"
          defaultMessage="Do you really want to remove this app"
        />
      </AppConfirmDialog>

      <ImportAppConfigDialog
        DialogProps={{
          open: showImportDialog,
          onClose: handleCloseImportDialog,
          maxWidth: "sm",
          fullWidth: true,
        }}
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
      <DataGrid
        getRowId={(row: any) => row.id}
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
          pagination: { style: { margin: isMobile ? 0 : theme.spacing(0.75) } }
        }}
        sortModel={sortModel}
        onPaginationModelChange={setPaginationModel}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        onSortModelChange={handleSortModelChange}
        pageSizeOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
        disableRowSelectionOnClick
        loading={false}
        sx={{
          '& .MuiDataGrid-main': {
            width: '100%',
            overflowX: 'hidden',
          },
          '& .MuiDataGrid-virtualScroller': {
            width: '100%',
            minWidth: '100%'
          },
          '& .MuiDataGrid-root': {
            width: '100%',
            border: 'none !important',
            '& .MuiDataGrid-main': {
              border: 'none !important',
            },
            '& .MuiDataGrid-virtualScroller': {
              border: 'none !important',
            },
            '& .MuiDataGrid-virtualScrollerContent': {
              border: 'none !important',
            },
            '& .MuiDataGrid-row': {
              '&:last-child .MuiDataGrid-cell': {
                borderBottom: 'none'
              }
            }
          },
          '& .MuiDataGrid-cell:last-of-type': {
            borderRight: `1px solid rgba(0, 0, 0, 0.08) !important`
          },
          '& .MuiDataGrid-columnHeader:last-of-type': {
            borderRight: `1px solid rgba(0, 0, 0, 0.08) !important`
          },
          '& .MuiDataGrid-cell': {
            padding: isMobile ? theme.spacing(0.75, 0.5) : theme.spacing(1.5),
            whiteSpace: isMobile ? 'normal' : 'nowrap',
            wordBreak: 'break-word',
            fontSize: isMobile ? '0.75rem' : 'inherit',
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
            borderRight: `1px solid rgba(0, 0, 0, 0.08) !important`,
            borderBottom: `1px solid rgba(0, 0, 0, 0.08) !important`,
            borderLeft: `1px solid rgba(0, 0, 0, 0.08) !important`,
            borderTop: `1px solid rgba(0, 0, 0, 0.08) !important`,
            '&:last-of-type': {
              borderRight: `1px solid rgba(0, 0, 0, 0.08) !important`
            },
            '&[data-field="domain"]': {
              whiteSpace: 'normal',
              overflow: 'visible',
              textOverflow: 'unset',
              verticalAlign: 'top',
            }
          },
          '& .MuiDataGrid-row': {
            maxHeight: 'none !important',
            minHeight: isMobile ? `${theme.spacing(5)} !important` : `${theme.spacing(6.5)} !important`,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          },
          '& .MuiDataGrid-columnHeaders': {
            minHeight: isMobile ? `${theme.spacing(5.625)} !important` : theme.spacing(7),
            backgroundColor: theme.palette.grey[50],
            borderBottom: `1px solid rgba(0, 0, 0, 0.08) !important`,
            borderLeft: `1px solid rgba(0, 0, 0, 0.08) !important`,
            borderRight: `1px solid rgba(0, 0, 0, 0.08) !important`,
            borderTop: `1px solid rgba(0, 0, 0, 0.08) !important`,
          },
          '& .MuiDataGrid-columnHeader': {
            padding: isMobile ? theme.spacing(0.75) : theme.spacing(1.5),
            borderRight: `1px solid rgba(0, 0, 0, 0.08) !important`,
            borderBottom: `1px solid rgba(0, 0, 0, 0.08) !important`,
            borderLeft: `1px solid rgba(0, 0, 0, 0.08) !important`,
            borderTop: `1px solid rgba(0, 0, 0, 0.08) !important`,
            '&:last-of-type': {
              borderRight: `1px solid rgba(0, 0, 0, 0.08) !important`
            }
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: `1px solid rgba(0, 0, 0, 0.08) !important`,
            borderLeft: `1px solid rgba(0, 0, 0, 0.08) !important`,
            borderRight: `1px solid rgba(0, 0, 0, 0.08) !important`,
            borderBottom: `1px solid rgba(0, 0, 0, 0.08) !important`,
            padding: theme.spacing(1, 2),
            '& .MuiTablePagination-root': {
              overflow: 'visible'
            },
            '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontSize: isMobile ? theme.typography.caption.fontSize : theme.typography.body2.fontSize
            }
          }
        }}
      />
    </>
  );
}
