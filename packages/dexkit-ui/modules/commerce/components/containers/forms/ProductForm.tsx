import FormikDecimalInput from "@dexkit/ui/components/FormikDecimalInput";
import MediaDialog from "@dexkit/ui/components/mediaDialog";
import { AccountFile } from "@dexkit/ui/modules/file/types";
import Image from "@mui/icons-material/Image";
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
} from "@mui/material";
import { Field, useFormikContext } from "formik";
import { TextField } from "formik-mui";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

const PreviewProductDialog = dynamic(
  () =>
    import(
      "@dexkit/ui/modules/commerce/components/dialogs/PreviewProductDialog"
    )
);

import ProductCategoryAutocomplete from "@dexkit/ui/modules/commerce/components/CommerceSection/ProductCategoryAutocomplete";
import {
  ProductCategoryType,
  ProductCollectionType,
  ProductFormType,
} from "@dexkit/ui/modules/commerce/types";
import dynamic from "next/dynamic";

import "@uiw/react-markdown-preview/markdown.css";
import { ExecuteState, TextAreaTextApi } from "@uiw/react-md-editor";

import * as commands from "@uiw/react-md-editor/commands";

import { AppConfirmDialog } from "@dexkit/ui";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import "@uiw/react-md-editor/markdown-editor.css";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

import ProductCollectionsAutocomplete from "@dexkit/ui/modules/commerce/components/ProductCollectionsAutocomplete";
import useProductCollectionList from "@dexkit/ui/modules/commerce/hooks/useProductCollectionList";
import Add from "@mui/icons-material/Add";
import Info from "@mui/icons-material/Info";

import Visibility from "@mui/icons-material/Visibility";
import useAddProductImages from "../../../hooks/useAddProductImages";
import useCategoryList from "../../../hooks/useCategoryList";
import useDeleteProduct from "../../../hooks/useDeleteProduct";
import useProductImages from "../../../hooks/useProductImages";
import ProductImageList from "../../ProductImageList";
import useParams from "../hooks/useParams";

const ProductImagesDialog = dynamic(
  () => import("../../dialogs/ProductImagesDialog")
);

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export interface ProductFormProps {
  onSubmit: () => void;
  isValid?: boolean;
}

export default function ProductForm({ onSubmit, isValid }: ProductFormProps) {
  const { setFieldValue, values, errors } = useFormikContext<ProductFormType>();

  const { enqueueSnackbar } = useSnackbar();

  const [selectFor, setSelectFor] = useState<string>("main");

  const { data: images, refetch: refetchImages } = useProductImages({
    productId: values.id,
  });

  const { mutateAsync: addProductImages } = useAddProductImages({
    productId: values.id,
  });

  const handleSelectFile = async (file: AccountFile) => {
    if (selectFor === "main") {
      setFieldValue("imageUrl", file.url);
    }

    if (selectFor === "images") {
      try {
        await addProductImages({ images: [file.url] });
        enqueueSnackbar(
          <FormattedMessage id="imaged.added" defaultMessage="Image added" />,
          { variant: "success" }
        );
      } catch (err) {
        enqueueSnackbar(String(err), { variant: "error" });
      }

      await refetchImages();
    }
  };

  const [showSelectFile, setShowSelectFile] = useState(false);

  const handleSelectOpen = () => {
    setShowSelectFile(true);
    setSelectFor("main");
  };

  const handleClose = () => {
    setShowSelectFile(false);
    setSelectFor("main");
  };

  const [showPublishedAt, setShowPublishedAt] = useState<boolean>(false);

  useEffect(() => {
    if (values.publishedAt) {
      setShowPublishedAt(true);
    }
  }, [values.publishedAt]);

  const { data: categories } = useCategoryList({ limit: 50, page: 0 });

  const { formatMessage } = useIntl();

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
          { variant: "success" }
        );
        setShowConfirm(false);
        router.push("/u/account/commerce/products");
      } catch (err) {
        enqueueSnackbar(String(err), { variant: "error" });
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

  const { goBack } = useParams();

  const [showImages, setShowImages] = useState(false);

  const handleCloseImages = () => {
    setShowImages(false);
  };

  const handleOpenImages = () => {
    setShowImages(true);
  };

  const handleAddMoresImages = () => {
    setSelectFor("images");
    setShowSelectFile(true);
  };

  return (
    <>
      {showImages && (
        <ProductImagesDialog
          images={images?.map((image) => image) ?? []}
          open={showImages}
          onClose={handleCloseImages}
          productId={values.id}
          onRefetch={async () => {
            await refetchImages();
          }}
        />
      )}
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
                id="delete.product.name"
                defaultMessage="Delete Product: {product}"
                values={{
                  product: (
                    <Typography
                      component="span"
                      fontWeight="400"
                      variant="inherit"
                    >
                      {values.name}
                    </Typography>
                  ),
                }}
              />
            </strong>
          }
          actionCaption={
            <FormattedMessage id="delete" defaultMessage="Delete" />
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
          maxWidth: "lg",
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
        <Box sx={{ 
          width: { xs: '100%', md: '300px' }, 
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <ButtonBase
            onClick={handleSelectOpen}
            sx={{
              position: "relative",
              p: 2,
              borderRadius: (theme) => typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "rgba(0,0,0, 0.2)"
                  : alpha(theme.palette.common.white, 0.1),
              backgroundImage: values.imageUrl
                ? `url("${values.imageUrl}")`
                : undefined,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
            }}
          >
            <Stack
              sx={{
                maxHeight: 300,
                minHeight: 150,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                color: (theme) =>
                  theme.palette.getContrastText(
                    theme.palette.mode === "light"
                      ? "rgba(0,0,0, 0.2)"
                      : alpha(theme.palette.common.white, 0.1)
                  ),
              }}
            >
              {!values.imageUrl && <Image fontSize="large" />}
            </Stack>
          </ButtonBase>

          <ProductImageList
            images={
              images?.map((image) => image.imageUrl).slice(0, 3) ?? []
            }
            onClick={handleOpenImages}
          />

          <Button
            onClick={handleAddMoresImages}
            startIcon={<Add />}
            variant="outlined"
            fullWidth
          >
            <FormattedMessage
              id="add.more.images"
              defaultMessage="Add more images"
            />
          </Button>

          <Box>
            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
            >
              <Stack spacing={0.5} direction="row" alignItems="center">
                <Info color="inherit" fontSize="inherit" />{" "}
                <span>
                  <FormattedMessage
                    id="you.can.add.up.to.8.product.images"
                    defaultMessage="You can add up to 8 product images."
                  />
                </span>
              </Stack>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3,
          minWidth: 0
        }}>
          <Box>
            <Button onClick={handleShowPreview} startIcon={<Visibility />}>
              <FormattedMessage
                id="preview.in.store"
                defaultMessage="Preview in store"
              />
            </Button>
          </Box>

          <Stack spacing={3}>
            <Field
              component={TextField}
              name="name"
              fullWidth
              label={
                <FormattedMessage id="product" defaultMessage="Product" />
              }
            />

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
              inputProps={{ style: { resize: "both" } }}
            />

            <ProductCollectionsAutocomplete
              value={values.collections ? values.collections : []}
              onChange={(value: ProductCollectionType[]) => {
                setFieldValue("collections", value);
              }}
              collections={collections?.items ?? []}
            />

            <ProductCategoryAutocomplete
              value={values.category ?? null}
              onChange={(value: ProductCategoryType | null) => {
                setFieldValue("category", value);
              }}
              categories={categories?.items ?? []}
            />

            <Box sx={{ maxWidth: '200px' }}>
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
            </Box>

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
                        setFieldValue("publishedAt", null);
                      } else {
                        setFieldValue("publishedAt", new Date());
                      }
                      setShowPublishedAt(e.target.checked);
                    }}
                  />
                }
              />
              <FormHelperText sx={{ m: 0 }}>
                <FormattedMessage
                  id="turn.on.to.set.the.item.msg"
                  defaultMessage='Turn on to set the product as "Active" and display it in the store.'
                />
              </FormHelperText>
            </FormControl>

            <Box>
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
                      setFieldValue("digital", e.target.checked);
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
            </Box>

            {values.digital && (
              <Box>
                <MDEditor
                  value={values.content ?? ""}
                  onChange={(value) => setFieldValue("content", value)}
                  commands={[
                    ...commands.getCommands(),
                    {
                      keyCommand: "ai",
                      name: formatMessage({
                        id: "artificial.inteligence",
                        defaultMessage: "Artificial Inteligence",
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
                        api: TextAreaTextApi
                      ) => {},
                    },
                  ]}
                />
              </Box>
            )}

            {values.id && (
              <Box>
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
              </Box>
            )}

            <Divider />

            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                spacing={2}
              >
                <Button LinkComponent={Link} onClick={goBack}>
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
          </Stack>
        </Box>
      </Box>
    </>
  );
}
