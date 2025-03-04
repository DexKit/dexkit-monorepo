import Delete from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Container,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDeleteMyAppMutation } from '../../../../hooks/whitelabel';
import { ConfigResponse } from '../../../../types/whitelabel';
import MarketplacesTableRow from './MarketplacesTableRow';

import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IS_STAGING } from '../../../../constants';
import InfoDialog from '../../../wizard/components/dialogs/InfoDialog';

interface Props {
  configs: ConfigResponse[];
  onConfigureDomain: (config: ConfigResponse) => void;
}

export default function MarketplacesTable({ configs }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { formatMessage } = useIntl();

  const [isOpen, setIsOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [titleInfo, setTitleInfo] = useState('');
  const [contentInfo, setContentInfo] = useState('');
  const [isDeployConfirmOpen, setIsDeployConfirmOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const [selectedConfig, setSelectedConfig] = useState<ConfigResponse>();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>, config: ConfigResponse) => {
      setAnchorEl(e.currentTarget);
      setSelectedConfig(config);
    },
    [],
  );

  const handleEdit = () => {
    handleCloseMenu();
    router.push(`/admin/edit/${selectedConfig?.slug}`);
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

  const deleteMutation = useDeleteMyAppMutation({
    options: { onSuccess: handleDeleteSuccess, onError: handleDeleteError },
  });

  const handleRemove = () => {
    setIsOpen(true);
    handleCloseMenu();
  };

  const handlePreview = () => {
    if (selectedConfig) {
      window.open(
        IS_STAGING
          ? `https://test.dev.dexkit.app?mid=${selectedConfig?.slug}`
          : `https://dexappbuilder.dexkit.com?mid=${selectedConfig?.slug}`,
        '_blank',
      );
    }
    handleCloseMenu();
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsDeployConfirmOpen(false);
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
    setTitleInfo('');
    setContentInfo('');
  };

  const handleDeploy = (config: ConfigResponse) => {
    setSelectedConfig(config);
    setIsDeployConfirmOpen(true);
  };

  const handleConfirmRemove = () => {
    if (selectedConfig) {
      deleteMutation.mutate({
        slug: selectedConfig.slug,
      });
    }
    setIsOpen(false);
  };

  const handleExport = () => {
    if (selectedConfig) {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        selectedConfig.config,
      )}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = 'config.json';

      link.click();
    }
  };

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
      <InfoDialog
        dialogProps={{
          open: openInfo,
          onClose: handleCloseInfo,
        }}
        title={titleInfo}
        content={contentInfo}
      />

      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <MenuItem onClick={handlePreview}>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText
            primary={<FormattedMessage id="preview" defaultMessage="Preview" />}
          />
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText
            primary={<FormattedMessage id="edit" defaultMessage="Edit" />}
          />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <FileDownloadIcon />
          </ListItemIcon>
          <ListItemText
            primary={<FormattedMessage id="export" defaultMessage="Export" />}
          />
        </MenuItem>
        <MenuItem onClick={handleRemove}>
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography color="error">
                <FormattedMessage id="delete" defaultMessage="Delete" />
              </Typography>
            }
          />
        </MenuItem>
      </Menu>
      <Container maxWidth="md">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="name" defaultMessage="Name" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="domains" defaultMessage="Domains" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="actions" defaultMessage="Actions" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configs?.map((config, index) => (
              <MarketplacesTableRow
                config={config}
                key={index}
                onMenu={handleMenuOpen}
                handleDeploy={handleDeploy}
              />
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  );
}
