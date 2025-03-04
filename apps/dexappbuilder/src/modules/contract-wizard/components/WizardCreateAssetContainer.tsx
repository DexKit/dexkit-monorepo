import CollectionItemsCard from '@/modules/contract-wizard/components/CollectionItemsCard';
import CreateAssetDialog from '@/modules/contract-wizard/components/dialogs/CreateAssetDialog';
import { CollectionItemsSchema } from '@/modules/contract-wizard/constants/schemas';
import {
    useCreateAssetsMetadataMutation,
    useCreateItems,
} from '@/modules/contract-wizard/hooks';
import {
    CollectionItemsForm,
    WizardItem,
} from '@/modules/contract-wizard/types';
import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Alert, Container, Grid, Typography } from '@mui/material';
import { Formik } from 'formik';
import { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { getERC721TotalSupply } from '@dexkit/ui/modules/nft/services';
import {
    DEXKIT_DISCORD_SUPPORT_CHANNEL,
    DEXKIT_NFT_METADATA_URI,
    MIN_KIT_HOLDING_AI_GENERATION,
} from 'src/constants';

interface Props {
  network: string;
  address: string;
}

function WizardCreateAssetContainer(props: Props) {
  const { network, address } = props;

  const uploadItemsMetadataMutation = useCreateAssetsMetadataMutation();

  const [collectionItemsFormValues, setCollectionItemsFormValues] =
    useState<CollectionItemsForm>();

  const [itemsTxHash, setItemsTxHash] = useState<string>();

  const { provider, account, chainId } = useWeb3React();

  const handleItemsHash = (hash: string) => {
    setItemsTxHash(hash);
    if (chainId !== undefined) {
      const now = Date.now();

      // TODO: add notification.
    }
  };

  const createItemsMutation = useCreateItems(provider, handleItemsHash);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [itemsMinted, setItemsMinted] = useState<
    { to: string; tokenURI: string }[]
  >([]);

  const handleSubmitCollectionItemsForm = async (
    values: CollectionItemsForm,
  ) => {
    setCollectionItemsFormValues(values);
    setShowConfirm(true);
  };

  const handleCloseCreateCollection = () => {
    setShowCreateDialog(false);
    createItemsMutation.reset();
    uploadItemsMetadataMutation.reset();
  };

  const handleCreateNFTs = async () => {
    try {
      if (
        address &&
        account &&
        collectionItemsFormValues &&
        collectionItemsFormValues?.items?.length > 0 &&
        provider
      ) {
        const itemsToMint = collectionItemsFormValues?.items?.length;
        const totalSupply = await getERC721TotalSupply({
          provider,
          contractAddress: address,
        });
        let totalItems = 0;
        for (let index = 0; index < itemsToMint; index++) {
          for (
            let ind = 0;
            ind < collectionItemsFormValues?.items[index].quantity;
            ind++
          ) {
            itemsMinted.push({
              to: account,
              tokenURI: `${DEXKIT_NFT_METADATA_URI}/${network}/${address.toLowerCase()}/${
                (totalSupply?.toNumber() || 0) + totalItems
              }`,
            });
            totalItems++;
          }
        }
        if (totalSupply) {
          await createItemsMutation.mutateAsync({
            contractAddress: address,
            items: itemsMinted,
          });
        }
        const nfts: WizardItem[] = [];
        totalItems = 0;
        for (let index = 0; index < itemsToMint; index++) {
          for (
            let ind = 0;
            ind < collectionItemsFormValues?.items[index].quantity;
            ind++
          ) {
            const item = collectionItemsFormValues?.items[index];
            nfts.push({
              id: String((totalSupply?.toNumber() || 0) + totalItems),
              tokenURI: `${DEXKIT_NFT_METADATA_URI}/${network}/${address.toLowerCase()}/${
                (totalSupply?.toNumber() || 0) + totalItems
              }`,
              attributes: item.attributes || [],
              description: item.description || '',
              image: item.file || '',
              name: item.name || '',
              external_link: '',
            });
            totalItems++;
          }
        }
        await uploadItemsMetadataMutation.mutateAsync({
          nfts,
          address,
          network,
        });
      }
      setItemsMinted([]);
    } catch {
      setItemsMinted([]);
    }
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const handleConfirm = async () => {
    if (collectionItemsFormValues) {
      setShowConfirm(false);
      setShowCreateDialog(true);
      await handleCreateNFTs();
    }
  };

  const handleHrefDiscord = (chunks: any): ReactNode => (
    <a
      className="external_link"
      target="_blank"
      href={DEXKIT_DISCORD_SUPPORT_CHANNEL}
      rel="noreferrer"
    >
      {chunks}
    </a>
  );

  return (
    <Container>
      <CreateAssetDialog
        dialogProps={{
          open: showCreateDialog,
          onClose: handleCloseCreateCollection,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        transactionHash={itemsTxHash}
        isLoading={createItemsMutation.isLoading}
        isDone={createItemsMutation.isSuccess}
        isError={createItemsMutation.isError}
        isLoadingMeta={uploadItemsMetadataMutation.isLoading}
        isErrorMeta={uploadItemsMetadataMutation.isError}
        isDoneMeta={uploadItemsMetadataMutation.isSuccess}
        chainId={chainId}
        contractAddress={address}
        useContractURL={false}
      />
      <AppConfirmDialog
        DialogProps={{
          open: showConfirm,
          onClose: handleCloseConfirm,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        title={
          <FormattedMessage id="creating.nfts" defaultMessage="Creating NFTs" />
        }
        onConfirm={handleConfirm}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.create.these.nfts"
            defaultMessage="Do you really want to create these NFTs?"
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
                uri: '/contract-wizard',
              },
              {
                caption: `${network}:${address}`,
                uri: `/contract-wizard/collection/${network}/${address}`,
              },
              {
                caption: (
                  <FormattedMessage
                    id="create.nfts"
                    defaultMessage="Create NFTs"
                  />
                ),
                uri: `/contract-wizard/collection/${network}/${address}/create-nfts`,
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">
            <FormattedMessage defaultMessage="Create NFTs" id="create.nfts" />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              defaultMessage="To create NFTs, name and image are mandatory. When creating the nfts please wait till end, could take a while to finish! Mint max 30 each time! You now can use our generate AI feature to generate an image for your collection. Please note that you need to hold {holdAmount} KIT in one of our supported networks: BSC, Polygon or Ethereum (Max. 50 images per month). Fill description first and generate image. If you need support or a bigger plan for AI generation please reach us on our <a>dedicated Discord channel</a> or email info@dexkit.com!"
              id="info.create.nfts"
              values={{
                //@ts-ignore
                a: handleHrefDiscord,
                holdAmount: MIN_KIT_HOLDING_AI_GENERATION,
              }}
            />
          </Alert>
        </Grid>

        <Grid item xs={12}>
          <Formik
            initialValues={
              collectionItemsFormValues
                ? collectionItemsFormValues
                : { items: [{ quantity: 1 }] }
            }
            onSubmit={handleSubmitCollectionItemsForm}
            validationSchema={CollectionItemsSchema}
          >
            <CollectionItemsCard network={network} />
          </Formik>
        </Grid>
      </Grid>
    </Container>
  );
}

export default WizardCreateAssetContainer;
