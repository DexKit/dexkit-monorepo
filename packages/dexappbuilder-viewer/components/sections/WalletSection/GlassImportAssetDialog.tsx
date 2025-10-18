import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import Link from "@dexkit/ui/components/AppLink";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import Launch from "@mui/icons-material/Launch";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Grid,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import Image from "next/image";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AppCollection } from "@dexkit/ui/modules/wizard/types/config";

import { NETWORK_EXPLORER } from "@dexkit/core/constants/networks";
import { useDebounce } from "@dexkit/core/hooks/misc";
import { Asset } from "@dexkit/core/types/nft";
import { isAddressEqual, truncateAddress } from "@dexkit/core/utils";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import { ipfsUriToUrl } from "@dexkit/core/utils/ipfs";
import {
  useAsset,
  useAssetMetadata,
  useFavoriteAssets,
} from "@dexkit/ui/modules/nft/hooks";
import { useCollections } from "@dexkit/ui/modules/nft/hooks/collection";
import { getAssetData, getAssetMetadata } from "@dexkit/ui/modules/nft/services";
import { useSnackbar } from "notistack";
import * as Yup from "yup";

interface Form {
  contractAddress: string;
  tokenId: string;
}

const FormSchema = Yup.object().shape({
  contractAddress: Yup.string()
    .required("Contract address is required")
    .test("is-address", "Invalid address", (value) => {
      return value ? isAddress(value) : false;
    }),
  tokenId: Yup.string().required("Token ID is required"),
});

interface Props {
  dialogProps: DialogProps;
  blurIntensity?: number;
  glassOpacity?: number;
  textColor?: string;
}

export default function GlassImportAssetDialog({
  dialogProps,
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff'
}: Props) {
  const favorites = useFavoriteAssets();
  const { onClose } = dialogProps;
  const { enqueueSnackbar } = useSnackbar();
  const { account, provider } = useWeb3React();
  const { formatMessage } = useIntl();

  const [assetParams, setAssetParams] = useState<{
    contractAddress: string;
    tokenId: string;
  }>();

  const collections = useCollections();
  const [selectedOption, setSelectedOption] = useState<AppCollection | null>(null);

  const handleSubmit = async (
    values: Form,
    formikHelpers: FormikHelpers<Form>
  ) => {
    try {
      if (!provider) {
        throw new Error(
          formatMessage({
            id: "provider.not.found",
            defaultMessage: "Provider not found",
          })
        );
      }

      const assetData = await getAssetData(
        provider,
        values.contractAddress,
        values.tokenId
      );

      if (!assetData?.tokenURI) {
        throw new Error(
          formatMessage({
            id: "the.nft.has.no.metadata",
            defaultMessage: "The NFT has no metadata",
          })
        );
      }

      const metadata = await getAssetMetadata(assetData?.tokenURI);

      const newObject = {
        ...assetData,
        id: String(assetData.id),
        metadata,
      } as Asset;

      if (favorites.isFavorite(newObject)) {
        enqueueSnackbar(
          formatMessage({
            defaultMessage: "NFT already imported",
            id: "nft.already.imported",
          }),
          {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          }
        );
      } else {
        favorites.add(newObject);

        enqueueSnackbar(
          formatMessage({
            defaultMessage: "NFT imported",
            id: "nft.imported",
          }),
          {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          }
        );
      }
    } catch (err: any) {
      enqueueSnackbar(
        formatMessage(
          {
            defaultMessage: "Error while importing NFT: {error}",
            id: "error.while.importing.nft",
          },
          { error: String(err) }
        ),
        {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        }
      );
    }

    if (onClose) {
      onClose({}, "backdropClick");
    }

    formikHelpers.resetForm();
    setSelectedOption(null);
    setAssetParams(undefined);
  };

  const handleClose = (event?: any, reason?: "backdropClick" | "escapeKeyDown") => {
    if (onClose) {
      onClose(event || {}, reason || "backdropClick");
    }
    formik.resetForm();
    setSelectedOption(null);
    setAssetParams(undefined);
  };

  const formik = useFormik<Form>({
    initialValues: { contractAddress: "", tokenId: "" },
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  });

  const options = useMemo(() => {
    if (collections) {
      return collections;
    }
    return [];
  }, [collections]);

  const handleChangeCollection = (
    event: SyntheticEvent,
    value: AppCollection | null
  ) => {
    setSelectedOption(value);
    if (value) {
      formik.setFieldValue("contractAddress", value.contractAddress);
    }
  };

  const handleSubmitForm = () => {
    formik.handleSubmit();
  };

  const debouncedContractAddress = useDebounce(
    formik.values.contractAddress,
    500
  );
  const debouncedTokenId = useDebounce(formik.values.tokenId, 500);

  useEffect(() => {
    if (
      debouncedContractAddress &&
      debouncedTokenId &&
      isAddress(debouncedContractAddress as string) &&
      !isNaN(Number(debouncedTokenId))
    ) {
      setAssetParams({
        contractAddress: debouncedContractAddress as string,
        tokenId: debouncedTokenId as string,
      });
    } else {
      setAssetParams(undefined);
    }
  }, [debouncedContractAddress, debouncedTokenId]);

  const { data: asset, isLoading: assetIsLoading } = useAsset(
    assetParams?.contractAddress || "",
    assetParams?.tokenId || "",
    undefined,
    true,
    selectedOption?.chainId
  );

  const { data: metadata, isLoading: metadataIsLoading } =
    useAssetMetadata(asset);

  return (
    <Dialog
      {...dialogProps}
      onClose={handleClose}
      PaperProps={{
        sx: {
          background: `rgba(255, 255, 255, ${glassOpacity})`,
          backdropFilter: `blur(${blurIntensity}px)`,
          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
          borderRadius: '16px',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)',
            borderRadius: 'inherit',
            pointerEvents: 'none',
          },
          '& .MuiTypography-root': {
            color: `${textColor} !important`,
          },
          '& .MuiTextField-root': {
            '& .MuiOutlinedInput-root': {
              backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.25)}) !important`,
              backdropFilter: `blur(${Math.min(blurIntensity - 10, 30)}px)`,
              '& fieldset': {
                borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.5)}) !important`,
              },
              '&:hover fieldset': {
                borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.4, 0.6)}) !important`,
              },
              '&.Mui-focused fieldset': {
                borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.5, 0.7)}) !important`,
              },
              '& input': {
                color: `${textColor} !important`,
              },
              '& input::placeholder': {
                color: `${textColor}CC !important`,
                opacity: 1,
              },
            },
            '& .MuiInputLabel-root': {
              color: `${textColor} !important`,
              '&.Mui-focused': {
                color: `${textColor} !important`,
              },
            },
            '& .MuiFormHelperText-root': {
              color: `${textColor}CC !important`,
            },
          },
          '& .MuiButton-root': {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.3)}) !important`,
            backdropFilter: `blur(${Math.min(blurIntensity - 10, 30)}px)`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.5)}) !important`,
            color: `${textColor} !important`,
            '&:hover': {
              backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.35)}) !important`,
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            '&.Mui-disabled': {
              backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.15)}) !important`,
              color: `${textColor}66 !important`,
              border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.25)}) !important`,
            },
          },
          '& .MuiAlert-root': {
            background: `rgba(33, 150, 243, ${Math.min(glassOpacity + 0.15, 0.3)}) !important`,
            backdropFilter: `blur(${Math.min(blurIntensity - 10, 30)}px)`,
            border: `1px solid rgba(33, 150, 243, ${Math.min(glassOpacity + 0.3, 0.5)}) !important`,
            color: `${textColor} !important`,
            '& .MuiAlert-icon': {
              color: `${textColor} !important`,
            },
          },
          '& .MuiAutocomplete-root': {
            '& .MuiOutlinedInput-root': {
              backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.25)}) !important`,
            },
            '& .MuiAutocomplete-popupIndicator': {
              color: `${textColor} !important`,
            },
            '& .MuiAutocomplete-clearIndicator': {
              color: `${textColor} !important`,
            },
          },
          '& .MuiSkeleton-root': {
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.25)}) !important`,
          },
        },
      }}
    >
      <AppDialogTitle
        title={<FormattedMessage id="import.nft" defaultMessage="Import NFT" />}
        onClose={handleClose}
        sx={{
          backgroundColor: 'transparent !important',
          '& .MuiTypography-root': {
            color: `${textColor} !important`,
          },
          '& .MuiIconButton-root': {
            color: `${textColor} !important`,
            backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.2)}) !important`,
            '&:hover': {
              backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.25)}) !important`,
            },
          },
        }}
      />
      <DialogContent dividers sx={{
        borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.2)})`,
      }}>
        <Stack spacing={2}>
          {assetParams && (
            <Paper sx={{
              p: 1,
              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.25)}) !important`,
              backdropFilter: `blur(${Math.min(blurIntensity - 10, 30)}px)`,
              border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)}) !important`,
              borderRadius: '8px',
            }}>
              <Grid container spacing={1}>
                <Grid>
                  {metadata?.image === undefined ? (
                    <Skeleton
                      variant="rectangular"
                      sx={{ height: "100%", width: "100%" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: "relative",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Image
                        fill
                        alt={metadata?.name}
                        src={ipfsUriToUrl(metadata?.image || "")}
                        style={{ objectFit: "contain" }}
                      />
                    </Box>
                  )}
                </Grid>
                <Grid size="grow">
                  <Typography variant="body2" sx={{ color: `${textColor} !important` }}>
                    {asset?.collectionName === undefined ? (
                      <Skeleton />
                    ) : (
                      asset?.collectionName
                    )}
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: `${textColor} !important` }} variant="body1">
                    {metadata?.name === undefined ? (
                      <Skeleton />
                    ) : (
                      metadata?.name
                    )}
                  </Typography>
                  <Typography variant="caption" sx={{ color: `${textColor} !important` }}>
                    <FormattedMessage id="owned.by" defaultMessage="Owned by" />
                  </Typography>
                  <Link
                    href={`${NETWORK_EXPLORER(
                      asset?.chainId || 1
                    )}/address/${asset?.owner || ""}`}
                    color="primary"
                    target="_blank"
                    sx={{ color: `${textColor} !important` }}
                  >
                    <Stack
                      component="span"
                      direction="row"
                      alignItems="center"
                      alignContent="center"
                      spacing={0.5}
                    >
                      <div>
                        {isAddressEqual(account || "", asset?.owner || "") ? (
                          <FormattedMessage id="you" defaultMessage="you" />
                        ) : (
                          truncateAddress(asset?.owner || "")
                        )}
                      </div>
                      <Launch fontSize="inherit" />
                    </Stack>
                  </Link>
                </Grid>
              </Grid>
            </Paper>
          )}
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Autocomplete
                  disablePortal
                  options={options}
                  value={selectedOption}
                  onChange={handleChangeCollection}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={formatMessage({
                        id: "collections",
                        defaultMessage: "Collections",
                      })}
                    />
                  )}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option: AppCollection) => (
                    <ListItemButton
                      component="li"
                      {...props}
                      key={option.contractAddress}
                      sx={{
                        backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.2)}) !important`,
                        '&:hover': {
                          backgroundColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.25)}) !important`,
                        },
                        '& .MuiTypography-root': {
                          color: `${textColor} !important`,
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={option.backgroundImage} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={option.name}
                        sx={{
                          '& .MuiTypography-root': {
                            color: textColor + ' !important',
                          },
                        }}
                      />
                    </ListItemButton>
                  )}
                  fullWidth
                  PaperComponent={({ children, ...props }: any) => (
                    <Paper
                      {...props}
                      sx={{
                        background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.15, 0.3)}) !important`,
                        backdropFilter: `blur(${blurIntensity}px)`,
                        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.4)}) !important`,
                        borderRadius: '8px',
                        '& .MuiTypography-root': {
                          color: `${textColor} !important`,
                        },
                      }}
                    >
                      {children}
                    </Paper>
                  )}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: formik.values.contractAddress !== "",
                  }}
                  value={formik.values.contractAddress}
                  onChange={formik.handleChange}
                  name="contractAddress"
                  label={
                    <FormattedMessage
                      id="contract.address"
                      defaultMessage="Contract Address"
                    />
                  }
                  error={Boolean(formik.errors.contractAddress)}
                  helperText={
                    Boolean(formik.errors.contractAddress)
                      ? formik.errors.contractAddress
                      : undefined
                  }
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  value={formik.values.tokenId}
                  onChange={formik.handleChange}
                  name="tokenId"
                  type="number"
                  error={Boolean(formik.errors.tokenId)}
                  helperText={
                    Boolean(formik.errors.tokenId)
                      ? formik.errors.tokenId
                      : undefined
                  }
                  label={
                    <FormattedMessage id="token.id" defaultMessage="Token ID" />
                  }
                />
              </Grid>
              <Grid size={12}>
                <Alert severity="info">
                  <FormattedMessage
                    id="asset.will.be.added.to.favorites"
                    defaultMessage="This asset will be added to your favorites"
                  />
                </Alert>
              </Grid>
            </Grid>
          </form>
        </Stack>
      </DialogContent>
      <DialogActions sx={{
        borderTop: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.2)})`,
      }}>
        <Button
          disabled={!formik.isValid || formik.isSubmitting || assetIsLoading}
          onClick={handleSubmitForm}
          variant="contained"
          color="primary"
        >
          <FormattedMessage id="import" defaultMessage="Import" />
        </Button>
        <Button
          onClick={handleClose}
          variant="outlined"
        >
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
} 