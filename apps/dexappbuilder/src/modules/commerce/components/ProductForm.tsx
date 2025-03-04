import FormikDecimalInput from '@dexkit/ui/components/FormikDecimalInput';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import { AccountFile } from '@dexkit/ui/modules/file/types';
import Image from '@mui/icons-material/Image';
import {
  alpha,
  Box,
  Button,
  ButtonBase,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ProductFormType } from '../types';

const PreviewProductDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/commerce/components/dialogs/PreviewProductDialog'
    ),
);

import ProductCategoryAutocomplete from '@dexkit/ui/modules/commerce/components/CommerceSection/ProductCategoryAutocomplete';
import {
  ProductCategoryType,
  ProductCollectionType,
} from '@dexkit/ui/modules/commerce/types';
import dynamic from 'next/dynamic';
import useCategoryList from '../hooks/useCategoryList';

import '@uiw/react-markdown-preview/markdown.css';
import { ExecuteState, TextAreaTextApi } from '@uiw/react-md-editor';

import * as commands from '@uiw/react-md-editor/commands';

import { AppConfirmDialog } from '@dexkit/ui';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import '@uiw/react-md-editor/markdown-editor.css';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import useDeleteProduct from '../hooks/useDeleteProduct';

import ProductCollectionsAutocomplete from '@dexkit/ui/modules/commerce/components/ProductCollectionsAutocomplete';
import useProductCollectionList from '@dexkit/ui/modules/commerce/hooks/useProductCollectionList';
import Visibility from '@mui/icons-material/Visibility';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
);

export interface ProductFormProps {
  onSubmit: () => void;
  isValid?: boolean;
}

export default function ProductForm({ onSubmit, isValid }: ProductFormProps) {
  const { setFieldValue, values, errors } = useFormikContext<ProductFormType>();

  const handleSelectFile = (file: AccountFile) => {
    setFieldValue('imageUrl', file.url);
  };

  const [showSelectFile, setShowSelectFile] = useState(false);

  const handleSelectOpen = () => {
    setShowSelectFile(true);
  };

  const handleClose = () => {
    setShowSelectFile(false);
  };

  const [showPublishedAt, setShowPublishedAt] = useState<boolean>(false);

  useEffect(() => {
    if (values.publishedAt) {
      setShowPublishedAt(true);
    }
  }, [values.publishedAt]);

  const { data: categories } = useCategoryList({ limit: 50, page: 0 });

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: deleteProduct, isLoading } = useDeleteProduct();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const router = useRouter();

  const handleConfirm = async () => {
    if (values.id) {
      try {
        await deleteProduct({ id: values.id });

        enqueueSnackbar(
          <FormattedMessage
            id="product.deleted"
            defaultMessage="Product deleted"
          />,
          { variant: 'success' },
        );
        setShowConfirm(false);
        router.push('/u/account/commerce/products');
      } catch (err) {
        enqueueSnackbar(String(err), { variant: 'error' });
      }
    }
  };

  const { data: collections } = useProductCollectionList({
    limit: 10,
    page: 0,
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  return (
    <>
      {showPreview && (
        <PreviewProductDialog
          DialogProps={{ open: showPreview, onClose: handleClosePreview }}
          id={values.id}
        />
      )}
      {showConfirm && (
        <AppConfirmDialog
          DialogProps={{ open: showConfirm, onClose: handleCloseConfirm }}
          onConfirm={handleConfirm}
          isConfirming={isLoading}
          title={
            <strong>
              <FormattedMessage
                id="delete.product.product"
                defaultMessage="Delete Product: {product}"
                values={{
                  product: (
                    <Typography
                      component="span"
                      fontWeight="400"
                      variant="inherit"
                    ></Typography>
                  ),
                }}
              />
            </strong>
          }
        >
          <FormattedMessage
            id="do.you.really.want.to.delete.this.product"
            defaultMessage="Do you really want to delete this product?"
          />
        </AppConfirmDialog>
      )}

      <MediaDialog
        onConfirmSelectFile={handleSelectFile}
        dialogProps={{
          open: showSelectFile,
          onClose: handleClose,
          maxWidth: 'lg',
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <ButtonBase
            onClick={handleSelectOpen}
            sx={{
              position: 'relative',
              p: 2,
              borderRadius: (theme) => theme.shape.borderRadius / 2,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? 'rgba(0,0,0, 0.2)'
                  : alpha(theme.palette.common.white, 0.1),

              backgroundImage: values.imageUrl
                ? `url("${values.imageUrl}")`
                : undefined,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'contain',
            }}
          >
            <Stack
              sx={{
                height: 150,
                maxHeight: 300,
                minHeight: 50,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                color: (theme) =>
                  theme.palette.getContrastText(
                    theme.palette.mode === 'light'
                      ? 'rgba(0,0,0, 0.2)'
                      : alpha(theme.palette.common.white, 0.1),
                  ),
              }}
            >
              {!values.imageUrl && <Image fontSize="large" />}
            </Stack>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button onClick={handleShowPreview} startIcon={<Visibility />}>
                <FormattedMessage
                  id="preview.in.store"
                  defaultMessage="Preview in store"
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="name"
                fullWidth
                label={<FormattedMessage id="item" defaultMessage="Item" />}
              />
            </Grid>

            <Grid item xs={12}>
              <Field
                component={TextField}
                name="description"
                fullWidth
                label={
                  <FormattedMessage
                    id="description"
                    defaultMessage="Description"
                  />
                }
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <ProductCollectionsAutocomplete
                value={values.collections ? values.collections : []}
                onChange={(value: ProductCollectionType[]) => {
                  setFieldValue('collections', value);
                }}
                collections={collections?.items ?? []}
              />
            </Grid>
            <Grid item xs={12}>
              <ProductCategoryAutocomplete
                value={values.category ?? null}
                onChange={(value: ProductCategoryType | null) => {
                  setFieldValue('category', value);
                }}
                categories={categories?.items ?? []}
              />
            </Grid>
            <Grid item>
              <FormikDecimalInput
                name="price"
                TextFieldProps={{
                  label: <FormattedMessage id="price" defaultMessage="Price" />,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">USD</InputAdornment>
                    ),
                  },
                }}
                decimals={6}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormControlLabel
                  label={
                    <FormattedMessage
                      id="visibility.in.the.store"
                      defaultMessage="Visibility in the store"
                    />
                  }
                  control={
                    <Switch
                      checked={showPublishedAt}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          setFieldValue('publishedAt', null);
                        } else {
                          setFieldValue('publishedAt', new Date());
                        }
                        setShowPublishedAt(e.target.checked);
                      }}
                    />
                  }
                />
                <FormHelperText sx={{ m: 0 }}>
                  <FormattedMessage
                    id="turn.off.to.set.the.item.msg"
                    defaultMessage="Turn off to set the item as “Inactive” and hide it from the store."
                  />
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                label={
                  <FormattedMessage
                    id="protected.item"
                    defaultMessage="Protected item"
                  />
                }
                control={
                  <Switch
                    checked={values.digital}
                    onChange={(e) => {
                      setFieldValue('digital', e.target.checked);
                    }}
                  />
                }
              />
              <FormHelperText sx={{ m: 0 }}>
                <FormattedMessage
                  id="turn.on.to.set.the.item.protected.msg"
                  defaultMessage="Turn on to open an editor for adding protected information that only the buyer can view."
                />
              </FormHelperText>
            </Grid>
            {values.digital && (
              <Grid item xs={12}>
                <MDEditor
                  value={values.content ?? ''}
                  onChange={(value) => setFieldValue('content', value)}
                  commands={[
                    ...commands.getCommands(),
                    {
                      keyCommand: 'ai',
                      name: formatMessage({
                        id: 'artificial.inteligence',
                        defaultMessage: 'Artificial Inteligence',
                      }),

                      render: (command, disabled, executeCommand) => {
                        return (
                          <button
                            disabled={disabled}
                            onClick={(evn) => {
                              // evn.stopPropagation();
                              executeCommand(command, command.groupName);
                            }}
                          >
                            <AutoAwesome fontSize="inherit" />
                          </button>
                        );
                      },
                      icon: <AutoAwesome fontSize="inherit" />,
                      execute: async (
                        state: ExecuteState,
                        api: TextAreaTextApi,
                      ) => {},
                    },
                  ]}
                />
              </Grid>
            )}

            {values.id && (
              <Grid item xs={12}>
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  color="error"
                >
                  <FormattedMessage
                    id="delete.product"
                    defaultMessage="Delete Product"
                  />
                </Button>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  spacing={2}
                >
                  <Button
                    LinkComponent={Link}
                    href="/u/account/commerce/products"
                  >
                    <FormattedMessage id="cancel" defaultMessage="cancel" />
                  </Button>
                  <Button
                    onClick={onSubmit}
                    disabled={!isValid}
                    variant="contained"
                  >
                    <FormattedMessage id="save" defaultMessage="Save" />
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
