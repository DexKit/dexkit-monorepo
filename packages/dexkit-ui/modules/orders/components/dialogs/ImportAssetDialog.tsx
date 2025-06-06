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
import { AppDialogTitle } from "../../../../components/AppDialogTitle";
import Link from "../../../../components/AppLink";

import { AppCollection } from "../../../wizard/types/config";

import { NETWORK_EXPLORER } from "@dexkit/core/constants/networks";
import { useDebounce } from "@dexkit/core/hooks/misc";
import { Asset } from "@dexkit/core/types/nft";
import { isAddressEqual, truncateAddress } from "@dexkit/core/utils";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import { ipfsUriToUrl } from "@dexkit/core/utils/ipfs";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import {
    useAsset,
    useAssetMetadata,
    useFavoriteAssets,
} from "../../../nft/hooks";
import { useCollections } from "../../../nft/hooks/collection";
import { getAssetData, getAssetMetadata } from "../../../nft/services";

interface Form {
  contractAddress: string;
  tokenId: string;
}

const FormSchema: Yup.SchemaOf<Form> = Yup.object().shape({
  contractAddress: Yup.string()
    .test("address", (value) => {
      return value !== undefined ? isAddress(value) : true;
    })
    .required(),

  tokenId: Yup.string().required(),
});

interface Props {
  dialogProps: DialogProps;
}

export default function ImportAssetDialog({ dialogProps }: Props) {
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

  const [selectedOption, setSelectedOption] = useState<AppCollection | null>(
    null
  );

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

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
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
    if (value?.contractAddress && isAddress(value?.contractAddress)) {
      formik.setValues(
        { contractAddress: value?.contractAddress, tokenId: "" },
        true
      );
    }
  };

  const handleSubmitForm = () => {
    formik.submitForm();
  };

  const lazyAddress = useDebounce<string>(formik.values.contractAddress, 500);

  const lazyTokenId = useDebounce<string>(formik.values.tokenId, 500);

  useEffect(() => {
    if (lazyAddress !== "" && lazyTokenId !== "") {
      setAssetParams({
        contractAddress: lazyAddress,
        tokenId: lazyTokenId.toString(),
      });
    }
  }, [lazyAddress, lazyTokenId]);

  const { data: asset, isLoading: assetIsLoading } = useAsset(
    assetParams?.contractAddress,
    assetParams?.tokenId,
    undefined,
    true,
    selectedOption?.chainId
  );

  const { data: metadata, isLoading: metadataIsLoading } =
    useAssetMetadata(asset);

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={<FormattedMessage id="import.nft" defaultMessage="Import NFT" />}
        onClose={handleClose}
      />
      <DialogContent dividers>
        <Stack spacing={2}>
          {assetParams && (
            <Paper sx={{ p: 1 }}>
              <Grid container spacing={1}>
                <Grid item>
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
                        objectFit="contain"
                      />
                    </Box>
                  )}
                </Grid>
                <Grid item xs>
                  <Typography variant="body2" color="textSecondary">
                    {asset?.collectionName === undefined ? (
                      <Skeleton />
                    ) : (
                      asset?.collectionName
                    )}
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }} variant="body1">
                    {metadata?.name === undefined ? (
                      <Skeleton />
                    ) : (
                      metadata?.name
                    )}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    <FormattedMessage id="owned.by" defaultMessage="Owned by" />
                  </Typography>
                  <Link
                    href={`${NETWORK_EXPLORER(
                      asset?.chainId
                    )}/address/${asset?.owner}`}
                    color="primary"
                    target="_blank"
                  >
                    <Stack
                      component="span"
                      direction="row"
                      alignItems="center"
                      alignContent="center"
                      spacing={0.5}
                    >
                      <div>
                        {isAddressEqual(account, asset?.owner) ? (
                          <FormattedMessage id="you" defaultMessage="you" />
                        ) : (
                          truncateAddress(asset?.owner)
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
              <Grid item xs={12}>
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
                    >
                      <ListItemAvatar>
                        <Avatar src={option.backgroundImage} />
                      </ListItemAvatar>
                      <ListItemText primary={option.name} />
                    </ListItemButton>
                  )}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
      <DialogActions>
        <Button
          disabled={!formik.isValid || formik.isSubmitting || assetIsLoading}
          onClick={handleSubmitForm}
          variant="contained"
          color="primary"
        >
          <FormattedMessage id="import" defaultMessage="Import" />
        </Button>
        <Button
          disabled={formik.isSubmitting || assetIsLoading || metadataIsLoading}
          onClick={handleClose}
        >
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
