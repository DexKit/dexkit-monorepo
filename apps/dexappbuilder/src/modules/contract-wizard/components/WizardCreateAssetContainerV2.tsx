import CollectionItemsCard from '@/modules/contract-wizard/components/CollectionItemsCard';
import CreateAssetDialog from '@/modules/contract-wizard/components/dialogs/CreateAssetDialog';
import { CollectionItemsSchema } from '@/modules/contract-wizard/constants/schemas';
import {
    useCreateAssetsMetadataMutation,
    useCreateCollectionMetadataMutation,
    useCreateItems,
    useFetchAssetsMutation,
    useLazyMintMutation,
} from '@/modules/contract-wizard/hooks';
import { CollectionItemsForm } from '@/modules/contract-wizard/types';
import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Alert, Container, Grid, Typography } from '@mui/material';
import { Formik } from 'formik';
import { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
    DEXKIT_DISCORD_SUPPORT_CHANNEL,
    DEXKIT_NFT_METADATA_URI,
    MIN_KIT_HOLDING_AI_GENERATION,
} from 'src/constants';

import { useContractCollection } from '@dexkit/ui/modules/nft/hooks/collection';
import { useContractCreation } from '@dexkit/web3forms/hooks';
import {
    useContract,
    useContractMetadata,
    useMintNFT,
    useTotalCount,
} from '@thirdweb-dev/react';

interface Props {
  network: string;
  address: string;
  isERC1155?: boolean;
  isLazyMint?: boolean;
}
// Version for thirdweb drop contract
function WizardCreateAssetContainerV2(props: Props) {
  const { network, address, isERC1155, isLazyMint } = props;
  const { contract } = useContract(address);
  const { data: contractMetadata } = useContractMetadata(contract);

  const { data: totalCount } = useTotalCount(contract);
  const {
    mutateAsync: mintNft,
    isLoading: isLoadingMint,
    isError,
    isSuccess,
  } = useMintNFT(contract);

  const handleItemsHash = (hash: string) => {
    setItemsTxHash(hash);
    if (chainId !== undefined) {
      const now = Date.now();

      // TODO: add notification.
    }
  };

  const {
    mutateAsync: lazyMint,
    isLoading: IsLoadingLazy,
    isError: isErrorLazy,
    isSuccess: isSuccessLazy,
  } = useLazyMintMutation({
    address: address,
    isERC1155,
    onSubmitted: handleItemsHash,
  });

  const fetchAssetsMutation = useFetchAssetsMutation({ address, network });

  const uploadItemsMetadataMutation = useCreateAssetsMetadataMutation();

  const [collectionItemsFormValues, setCollectionItemsFormValues] =
    useState<CollectionItemsForm>();

  const [itemsTxHash, setItemsTxHash] = useState<string>();

  const { provider, account, chainId } = useWeb3React();

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

  const createMetadataMutation = useCreateCollectionMetadataMutation();
  const contractCollection = useContractCollection(network, address);
  const contractCreation = useContractCreation();

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

        let totalItems = 0;
        if (isLazyMint) {
          await lazyMint({
            metadatas: collectionItemsFormValues?.items.map((item) => {
              return {
                attributes: item.attributes || [],
                description: item.description || '',
                image: item.file || '',
                name: item.name || '',
                external_link: '',
              };
            }),
          });
          const tokenIds = [];
          for (let index = 0; index < itemsToMint; index++) {
            tokenIds.push(String(index + (totalCount?.toNumber() || 0)));
          }

          await fetchAssetsMutation.mutateAsync({
            tokenIds: tokenIds,
          });
        } else {
          if (!contractCollection?.data && chainId) {
            let result: any[] = await contractCreation.mutateAsync({
              contractAddress: address,
              chainId,
            });

            let value = result[0];

            await createMetadataMutation.mutateAsync({
              tx: value.txHash,
              address: address,
              description: contractMetadata?.description || '',
              external_link: contractMetadata?.external_link || '',
              image: contractMetadata?.image || '',
              networkId: network,
            });
          }

          for (let index = 0; index < itemsToMint; index++) {
            const item = collectionItemsFormValues?.items[index];

            await mintNft({
              metadata: `${DEXKIT_NFT_METADATA_URI}/${network}/${address.toLowerCase()}/${
                (totalCount?.toNumber() || 0) + totalItems
              }`,
              to: account,
              supply: collectionItemsFormValues?.items[index].quantity,
            });

            await uploadItemsMetadataMutation.mutateAsync({
              nfts: [
                {
                  id: String((totalCount?.toNumber() || 0) + totalItems),
                  tokenURI: `${DEXKIT_NFT_METADATA_URI}/${network}/${address.toLowerCase()}/${
                    (totalCount?.toNumber() || 0) + totalItems
                  }`,
                  attributes: item.attributes || [],
                  description: item.description || '',
                  image: item.file || '',
                  name: item.name || '',
                  external_link: '',
                },
              ],
              address,
              network,
            });

            totalItems++;
          }
        }
      }
      setItemsMinted([]);
    } catch (err) {
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
        isLazyMinting={isLazyMint}
        transactionHash={itemsTxHash}
        isLoading={isLoadingMint || IsLoadingLazy}
        isDone={isSuccess || isSuccessLazy}
        isError={isError || isErrorLazy}
        isLoadingMeta={uploadItemsMetadataMutation.isLoading}
        isErrorMeta={uploadItemsMetadataMutation.isError}
        isDoneMeta={uploadItemsMetadataMutation.isSuccess}
        chainId={chainId}
        contractAddress={address}
        useContractURL={true}
        modalOnSamePage={true}
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
            <CollectionItemsCard
              network={network}
              onlySingleMint={isLazyMint ? false : true}
              allowMultipleQuantity={isERC1155 === true && isLazyMint === false}
            />
          </Formik>
        </Grid>
      </Grid>
    </Container>
  );
}

export default WizardCreateAssetContainerV2;
