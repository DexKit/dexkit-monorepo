import CollectionFormCard from '@/modules/contract-wizard/components/CollectionFormCard';
import CreateCollectionDialog from '@/modules/contract-wizard/components/dialogs/CreateCollectionDialog';

import { CollectionFormSchema } from '@/modules/contract-wizard/constants/schemas';
import {
    useCreateCollection,
    useCreateCollectionMetadataMutation,
} from '@/modules/contract-wizard/hooks';
import { CollectionForm } from '@/modules/contract-wizard/types';
import { getNetworkSlugFromChainId } from '@dexkit/core/utils/blockchain';
import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useAuth, useLoginAccountMutation } from '@dexkit/ui/hooks/auth';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Alert, Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Formik } from 'formik';
import { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
    DEXKIT_DISCORD_SUPPORT_CHANNEL,
    MIN_KIT_HOLDING_AI_GENERATION,
} from 'src/constants';

const INITIAL_VALUES: CollectionForm = {
  name: '',
  symbol: '',
  description: '',
  url: '',
  file: null,
  royalty: 0,
};

function WizardCreateCollectionContainer() {
  const upCollectionMetadataMutation = useCreateCollectionMetadataMutation();
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  const [collectionFormValues, setCollectionFormValues] =
    useState<CollectionForm>();

  const [deployHash, setDeployHash] = useState<string>();

  const { provider, chainId } = useWeb3React();

  const handleDeployHash = (hash: string) => {
    setDeployHash(hash);

    if (chainId !== undefined && collectionFormValues) {
      const now = Date.now();
    }
  };

  const createCollectionMutation = useCreateCollection(
    provider,
    handleDeployHash,
  );

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [contractAddress, setContractAddress] = useState<string>();

  const handleSubmitCollectionForm = async (values: CollectionForm) => {
    setCollectionFormValues(values);
    setShowCreateDialog(true);
    handleCreateCollectionOnChain(values);
  };

  const handleCloseCreateCollection = () => {
    setShowCreateDialog(false);
    createCollectionMutation.reset();
    upCollectionMetadataMutation.reset();
  };

  const handleCreateCollectionOnChain = async (values: CollectionForm) => {
    if (!isLoggedIn) {
      await loginMutation.mutateAsync();
    }

    if (values) {
      const hashes = await createCollectionMutation.mutateAsync({
        name: values.name,
        symbol: values.symbol,
        royalty: Math.trunc(values.royalty * 100),
      });
      const networkId = getNetworkSlugFromChainId(chainId) as string;
      if (hashes?.tx) {
        await upCollectionMetadataMutation.mutateAsync({
          tx: hashes?.tx,
          networkId,
          description: values?.description || '',
          image: values?.file || '',
          external_link: values?.url || '',
        });
      }

      setContractAddress(hashes?.contractAddress);
    }
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
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
      <CreateCollectionDialog
        dialogProps={{
          open: showCreateDialog,
          onClose: handleCloseCreateCollection,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        transactionHash={deployHash}
        isLoading={createCollectionMutation.isLoading}
        isDone={createCollectionMutation.isSuccess}
        isError={createCollectionMutation.isError}
        isLoadingMeta={upCollectionMetadataMutation.isLoading}
        isErrorMeta={upCollectionMetadataMutation.isError}
        isDoneMeta={upCollectionMetadataMutation.isSuccess}
        chainId={chainId}
        contractAddress={contractAddress}
        // onCreateCollection={handleCreateCollection}
        //onReset={handleReset}
      />
      <AppConfirmDialog
        DialogProps={{
          open: showConfirm,
          onClose: handleCloseConfirm,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        title={
          <FormattedMessage
            id="creating.collection"
            defaultMessage="Creating collection"
          />
        }
        onConfirm={() => {}}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.create.this.collection"
            defaultMessage="Do you really want to create this collection?"
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
                  <FormattedMessage
                    id="contract.generator"
                    defaultMessage="Contract generator"
                  />
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
                caption: (
                  <FormattedMessage id="create" defaultMessage="Create" />
                ),
                uri: '/contract-wizard/collection/create',
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">
            <FormattedMessage
              defaultMessage="Create Collection"
              id="create.collection"
            />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              defaultMessage="Create a collection of NFT's easily using our contract wizard. You now can use our generate AI feature to generate an image for your collection. Please note that you need to hold {holdAmount} KIT in one of our supported networks: BSC, Polygon or Ethereum (Max. 50 images per month). Fill description first and generate image. If you need support or a bigger plan for AI generation please reach us on our <a>dedicated Discord channel</a> or email info@dexkit.com!"
              id="info.create.collection.page"
              values={{
                //@ts-ignore
                a: handleHrefDiscord,
                holdAmount: MIN_KIT_HOLDING_AI_GENERATION,
              }}
            />
          </Alert>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Box>
            <Stack spacing={2}>
              <Box>
                <Formik
                  initialValues={
                    collectionFormValues ? collectionFormValues : INITIAL_VALUES
                  }
                  onSubmit={handleSubmitCollectionForm}
                  validationSchema={CollectionFormSchema}
                >
                  <CollectionFormCard />
                </Formik>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default WizardCreateCollectionContainer;
