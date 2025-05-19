import { CollectionOwnershipNFTFormType } from '@/modules/contract-wizard/types';
import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import { useAccountHoldDexkitQuery } from '@dexkit/ui/hooks/account';
import Check from '@mui/icons-material/Check';
import Visibility from '@mui/icons-material/Visibility';
import { Alert, Button, Grid, Stack, Typography, styled } from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useUpsertWhitelabelAssetMutation } from 'src/hooks/whitelabel';

import { AssetAPI } from '@dexkit/ui/modules/nft/types';
import * as Yup from 'yup';
import CreateWhitelabelDialog from '../dialogs/CreateWhitelabelNFTDialog';
import OwnershipNFTForm from '../forms/OwnershipNFTForm';

const MobileButton = styled(Button)(({ theme }) => ({
  width: '100%',
  borderRadius: '6px',
  minHeight: '42px',
  fontSize: '0.85rem',
}));

interface Props {
  id: number;
  nft?: AssetAPI;
  isMobile?: boolean;
}

export const CollectionItemSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().optional(),
  image: Yup.string().required(),
  attributes: Yup.array().of(
    Yup.object().shape({
      trait_type: Yup.string().required(),
      display_type: Yup.string(),
      value: Yup.string().required(),
    }),
  ),
});

export default function OwnershipSection({ id, nft, isMobile }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showConfirmSendConfig, setShowConfirmSendConfig] = useState(false);
  const isHoldingKitQuery = useAccountHoldDexkitQuery();
  const [values, setValues] = useState<CollectionOwnershipNFTFormType>();
  const upsertWhitelabelNFTmutation = useUpsertWhitelabelAssetMutation();
  const handleSubmitCollectionItemsForm = async (
    values: CollectionOwnershipNFTFormType,
  ) => {
    setShowConfirmSendConfig(true);
    setValues(values);
  };

  return (
    <>
      <AppConfirmDialog
        DialogProps={{
          open: showConfirmSendConfig,
          maxWidth: 'md',
          fullWidth: true,
          onClose: () => setShowConfirmSendConfig(false),
        }}
        onConfirm={async () => {
          if (values) {
            setShowConfirmSendConfig(false);
            setOpen(true);
            await upsertWhitelabelNFTmutation.mutateAsync({
              siteId: id,
              nft: values,
            });
            setValues(undefined);
          }
        }}
      >
        <Stack>
          <Typography variant={isMobile ? "subtitle1" : "h5"} align="center" sx={{ fontWeight: 600 }}>
            {nft ? (
              <FormattedMessage id="update.nft" defaultMessage="Update NFT" />
            ) : (
              <FormattedMessage id="create.nft" defaultMessage="Create NFT" />
            )}
          </Typography>
          <Typography
            variant={isMobile ? "body2" : "body1"}
            align="center"
            color="textSecondary"
            sx={{ fontSize: isMobile ? '0.85rem' : 'inherit' }}
          >
            {nft ? (
              <FormattedMessage
                id="do.you.really.want.to.update.a.nft.info"
                defaultMessage="Do you really want to update this NFT representing ownership of this app?"
              />
            ) : (
              <FormattedMessage
                id="do.you.really.want.to.create.a.nft.info"
                defaultMessage="Do you really want to create a NFT representing ownership of this app? After you create this NFT you are not able to delete anymore the app!
               You can sell or transfer this NFT, if you do so, you lose ownership of the app."
              />
            )}
          </Typography>
        </Stack>
      </AppConfirmDialog>
      <CreateWhitelabelDialog
        dialogProps={{
          open,
          onClose: () => {
            setOpen(false);
            upsertWhitelabelNFTmutation.reset();
          },
        }}
        isDone={upsertWhitelabelNFTmutation.isSuccess}
        isLoading={upsertWhitelabelNFTmutation.isLoading}
        isError={upsertWhitelabelNFTmutation.isError}
        asset={nft}
      />
      <Formik
        initialValues={
          nft
            ? {
              name: nft.name,
              image: nft.imageUrl,
              description: nft.description,
              attributes: nft.rawData
                ? JSON.parse(nft.rawData)?.attributes || []
                : [],
            }
            : {}
        }
        onSubmit={handleSubmitCollectionItemsForm}
        validationSchema={CollectionItemSchema}
      >
        {({ submitForm, isValid, dirty }) => (
          <Grid container spacing={isMobile ? 1.5 : 2}>
            <Grid item xs={12}>
              <OwnershipNFTForm
                isDisabled={isHoldingKitQuery.data === false}
              />
            </Grid>

            <Grid item xs={12}>
              {isMobile ? (
                <Stack spacing={1.5} direction="column" sx={{ width: '100%' }}>
                  {nft && (
                    <MobileButton
                      startIcon={<Visibility />}
                      onClick={() =>
                        router.push(
                          `/asset/polygon/${nft.address}/${nft.tokenId}`,
                        )
                      }
                      variant="outlined"
                      color="primary"
                      fullWidth
                    >
                      <FormattedMessage id="view.nft" defaultMessage="View NFT" />
                    </MobileButton>
                  )}
                  <MobileButton
                    startIcon={<Check />}
                    disabled={!isValid || !isHoldingKitQuery.data || !dirty}
                    onClick={submitForm}
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    {nft ? (
                      <FormattedMessage
                        id="update.nft"
                        defaultMessage="Update NFT"
                      />
                    ) : (
                      <FormattedMessage
                        id="create.nft"
                        defaultMessage="Create NFT"
                      />
                    )}
                  </MobileButton>
                </Stack>
              ) : (
                <Stack spacing={1} direction="row" justifyContent="flex-end">
                  {nft && (
                    <Button
                      startIcon={<Visibility />}
                      onClick={() =>
                        router.push(
                          `/asset/polygon/${nft.address}/${nft.tokenId}`,
                        )
                      }
                      variant="contained"
                      color="primary"
                    >
                      <FormattedMessage id="view.nft" defaultMessage="View NFT" />
                    </Button>
                  )}
                  <Button
                    startIcon={<Check />}
                    disabled={!isValid || !isHoldingKitQuery.data || !dirty}
                    onClick={submitForm}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {nft ? (
                      <FormattedMessage
                        id="update.nft"
                        defaultMessage="Update NFT"
                      />
                    ) : (
                      <FormattedMessage
                        id="create.nft"
                        defaultMessage="Create NFT"
                      />
                    )}
                  </Button>
                </Stack>
              )}
            </Grid>
            {isHoldingKitQuery.data !== true && false && (
              <Grid item xs={12} container justifyContent="flex-end">
                <Alert severity="info" sx={{ fontSize: isMobile ? '0.85rem' : 'inherit' }}>
                  <FormattedMessage
                    id="holding.kit.info"
                    defaultMessage="You need to hold 1000 KIT on one of supported networks (ETH, BSC and Polygon) to use this feature! "
                  />
                </Alert>
              </Grid>
            )}
          </Grid>
        )}
      </Formik>
    </>
  );
}
