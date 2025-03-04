import Delete from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
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
import { useDeletePageTemplateMutation } from '../../../../hooks/whitelabel';
import { PageTemplateResponse } from '../../../../types/whitelabel';

import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PageEditorDialog from '../../../wizard/components/pageEditor/dialogs/PageEditorDialog';
import PageTemplatesTableRow from './PageTemplatesTableRow';

interface Props {
  pageTemplates: PageTemplateResponse[];
}

export default function PageTemplatesTable({ pageTemplates }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { formatMessage } = useIntl();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [titleInfo, setTitleInfo] = useState('');
  const [contentInfo, setContentInfo] = useState('');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const [selectedPageTemplate, setSelectedPageTemplate] =
    useState<PageTemplateResponse>();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>, config: PageTemplateResponse) => {
      setAnchorEl(e.currentTarget);
      setSelectedPageTemplate(config);
    },
    [],
  );

  const handleEdit = () => {
    handleCloseMenu();
    router.push(`/admin/page-template/${selectedPageTemplate?.id}`);
  };

  const handleDeleteSuccess = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Page template removed',
        id: 'page.template.removed',
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

  const deleteMutation = useDeletePageTemplateMutation({
    options: { onSuccess: handleDeleteSuccess, onError: handleDeleteError },
  });

  const handleRemove = () => {
    setIsOpen(true);
    handleCloseMenu();
  };

  const handlePreview = () => {
    setIsOpenPreview(true);
    handleCloseMenu();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClosePreview = () => {
    setIsOpenPreview(false);
  };

  const handleConfirmRemove = () => {
    if (selectedPageTemplate) {
      deleteMutation.mutate({ id: selectedPageTemplate.id });
    }
    setIsOpen(false);
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
          id="do.you.really.want.to.remove.this.page.template"
          defaultMessage="Do you really want to remove this page template #{id}"
          values={{ id: selectedPageTemplate?.id || '' }}
        />
      </AppConfirmDialog>
      {isOpenPreview && (
        <PageEditorDialog
          dialogProps={{
            open: isOpenPreview,
            onClose: handleClosePreview,
            fullScreen: true,
          }}
          title={selectedPageTemplate?.title}
          value={selectedPageTemplate?.config}
          readonly={true}
        />
      )}

      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <MenuItem onClick={handlePreview}>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <FormattedMessage
                id="preview.page"
                defaultMessage="Preview page"
              />
            }
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
        <MenuItem onClick={handleRemove}>
          <ListItemIcon>
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography color="error">
                <FormattedMessage id="remove" defaultMessage="Remove" />
              </Typography>
            }
          />
        </MenuItem>
      </Menu>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="id" defaultMessage="Id" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="title" defaultMessage="Title" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="description" defaultMessage="Description" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="actions" defaultMessage="Actions" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageTemplates?.map((config, index) => (
            <PageTemplatesTableRow
              pageTemplate={config}
              key={index}
              onMenu={handleMenuOpen}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
