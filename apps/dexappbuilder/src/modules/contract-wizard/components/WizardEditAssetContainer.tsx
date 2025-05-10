import { CollectionItemSchema } from '@/modules/contract-wizard/constants/schemas';
import { useEditAssetMetadataMutation } from '@/modules/contract-wizard/hooks';
import {
    CollectionItemFormType,
    WizardItem,
} from '@/modules/contract-wizard/types';
import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Alert, Container, Grid, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { getChainIdFromSlug } from '@dexkit/core/utils/blockchain';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useAssetByApi } from '@dexkit/ui/modules/nft/hooks';
import CollectionItemCard from './CollectionItemCard';
import EditAssetDialog from './dialogs/EditAssetDialog';

interface Props {
  network: string;
  address: string;
  id: string;
}

function WizardEditAssetContainer(props: Props) {
  const { network, address, id } = props;

  const uploadItemsMetadataMutation = useEditAssetMetadataMutation();

  const { data: asset } = useAssetByApi({
    contractAddress: address.toLowerCase(),
    chainId: getChainIdFromSlug(network)?.chainId,
    tokenId: id,
  });

  const [collectionItemFormValue, setCollectionItemFormValue] =
    useState<CollectionItemFormType>();

  const { provider, account, chainId } = useWeb3React();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmitCollectionItemForm = async (
    values: CollectionItemFormType,
  ) => {
    setShowConfirm(true);
    setCollectionItemFormValue(values);
  };

  const handleCloseCreateCollection = () => {
    setShowCreateDialog(false);
    uploadItemsMetadataMutation.reset();
  };

  const handleEditNFT = async () => {
    try {
      if (address && account && provider && collectionItemFormValue && asset) {
        const nft: WizardItem = {
          id: id,
          tokenURI: asset.tokenURI,
          attributes: collectionItemFormValue.attributes || [],
          description: collectionItemFormValue.description || '',
          image: collectionItemFormValue.file || '',
          name: collectionItemFormValue.name || '',
          external_link: '',
        };

        await uploadItemsMetadataMutation.mutateAsync({
          nft,
          address,
          network,
        });
      }
    } catch {}
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const handleConfirm = async () => {
    if (collectionItemFormValue) {
      setShowConfirm(false);
      setShowCreateDialog(true);
      await handleEditNFT();
    }
  };

  return (
    <Container>
      <EditAssetDialog
        dialogProps={{
          open: showCreateDialog,
          onClose: handleCloseCreateCollection,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        isLoadingMeta={uploadItemsMetadataMutation.isLoading}
        isErrorMeta={uploadItemsMetadataMutation.isError}
        isDoneMeta={uploadItemsMetadataMutation.isSuccess}
        chainId={chainId}
        contractAddress={address}
      />
      <AppConfirmDialog
        DialogProps={{
          open: showConfirm,
          onClose: handleCloseConfirm,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        title={
          <FormattedMessage id="editing.nft" defaultMessage="Editing NFT" />
        }
        onConfirm={handleConfirm}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.edit.this.nfts"
            defaultMessage="Do you really want to edit this NFT?"
          />
        </Typography>
      </AppConfirmDialog>
      <Grid container spacing={2} justifyContent="center">
        <Grid container item xs={12} justifyContent="left">
          <PageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="home" defaultMessage="Home" />,
                uri: '/',
              },
              {
                caption: (
                  <FormattedMessage id="wizard" defaultMessage="Wizard" />
                ),
                uri: '/contract-wizard',
              },
              {
                caption: (
                  <FormattedMessage
                    id="collections"
                    defaultMessage="Collections"
                  />
                ),
                uri: '/contract-wizard/collections',
              },
              {
                caption: `${network}:${address}`,
                uri: `/contract-wizard/collection/${network}/${address}`,
              },
              {
                caption: (
                  <FormattedMessage
                    id="edit.nft.id"
                    defaultMessage="Edit NFT {id}"
                    values={{
                      id: id,
                    }}
                  />
                ),
                uri: `/contract-wizard/collection/${network}/${address}/${id}`,
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">
            <FormattedMessage
              id="edit.nft.id"
              defaultMessage="Edit NFT {id}"
              values={{
                id: id,
              }}
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              defaultMessage="To create NFTs, name and image are mandatory. When creating the nfts please wait till end, could take a while to finish!"
              id="info.create.nfts"
            />
          </Alert>
        </Grid>

        <Grid item xs={12}>
          {asset && (
            <Formik
              initialValues={{
                id: id,
                tokenURI: asset.tokenURI,
                attributes: asset.metadata?.attributes || ([] as any),
                description: asset.metadata?.description || '',
                file: asset.metadata?.image || '',
                name: asset.metadata?.name || '',
                quantity: 1,
                external_link: '',
              }}
              onSubmit={handleSubmitCollectionItemForm}
              validationSchema={CollectionItemSchema}
            >
              <CollectionItemCard tokenId={id} />
            </Formik>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default WizardEditAssetContainer;
