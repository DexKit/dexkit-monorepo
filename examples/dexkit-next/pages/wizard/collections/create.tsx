import AppPageHeader from '@/modules/common/components/AppPageHeader';
import AppConfirmDialog from '@/modules/common/components/dialogs/AppConfirmDialog';
import MainLayout from '@/modules/common/components/layouts/MainLayout';
import { useNotifications } from '@/modules/common/hooks/app';
import { AppNotificationType } from '@/modules/common/types/app';
import { TransactionStatus } from '@/modules/common/types/transactions';
import CollectionFormCard from '@/modules/wizard/components/CollectionFormCard';
import CollectionItemsCard from '@/modules/wizard/components/CollectionItemsCard';
import CreateCollectionDialog from '@/modules/wizard/components/dialogs/CreateCollectionDialog';
import WizardFileImage from '@/modules/wizard/components/WizardFileImage';
import {
  CollectionFormSchema,
  CollectionItemsSchema,
} from '@/modules/wizard/constants/schemas';
import {
  useCreateCollection,
  useCreateItems,
  useSendCollectionMetadataMutation,
  useSendItemsMetadataMutation,
  useUploadImageMutation,
  useUploadImagesMutation,
} from '@/modules/wizard/hooks';
import {
  CollectionForm,
  CollectionItemsForm,
  WizardItem,
} from '@/modules/wizard/types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { Formik } from 'formik';
import type { NextPage } from 'next';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const INITIAL_VALUES: CollectionForm = {
  name: '',
  symbol: '',
  description: '',
  url: '',
  file: null,
};

enum Steps {
  Collection,
  Items,
  Create,
}

const WizardCreateCollectionPage: NextPage = () => {
  const uploadImageMutation = useUploadImageMutation();
  const uploadImagesMutation = useUploadImagesMutation();

  const uploadMetadataMutation = useSendItemsMetadataMutation();
  const upCollectionMetadataMutation = useSendCollectionMetadataMutation();

  const [collectionFormValues, setCollectionFormValues] =
    useState<CollectionForm>();
  const [collectionItemsFormValues, setCollectionItemsFormValues] =
    useState<CollectionItemsForm>();

  const [deployHash, setDeployHash] = useState<string>();
  const [itemsTxHash, setItemsTxHash] = useState<string>();

  const { addNotification } = useNotifications();

  const { provider, account, chainId, isActive } = useWeb3React();

  const { formatMessage } = useIntl();

  const handleDeployHash = (hash: string) => {
    setDeployHash(hash);

    if (chainId !== undefined && collectionFormValues) {
      const now = Date.now();

      addNotification({
        notification: {
          type: AppNotificationType.Transaction,
          title: formatMessage(
            {
              defaultMessage: 'Creating collection {name}',
              id: 'creating.collection',
            },
            { name: collectionFormValues.name }
          ) as string,
          hash,
          checked: false,
          created: now,
          icon: 'receipt',
          body: '',
        },
        transaction: {
          status: TransactionStatus.Pending,
          created: now,
          chainId,
        },
      });
    }
  };

  const handleItemsHash = (hash: string) => {
    setItemsTxHash(hash);
    if (chainId !== undefined && collectionFormValues) {
      const now = Date.now();
      addNotification({
        notification: {
          type: AppNotificationType.Transaction,
          title: formatMessage(
            {
              defaultMessage: 'Creating items for the collection {name}',
              id: 'creating.items.for.the.collection.name',
            },
            { name: collectionFormValues.name }
          ) as string,
          hash,
          checked: false,
          created: now,
          icon: 'receipt',
          body: '',
        },
        transaction: {
          status: TransactionStatus.Pending,
          created: now,
          chainId,
        },
      });
    }
  };

  const createCollectionMutation = useCreateCollection(
    provider,
    handleDeployHash
  );
  const createItemsMutation = useCreateItems(provider, handleItemsHash);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [activeStep, setActiveStep] = useState(Steps.Collection);
  const [contractAddress, setContractAddress] = useState<string>();
  const [contractHash, setContractHash] = useState<string>();
  const [itemsHash, setItemsHash] = useState<string[]>();

  const handleSubmitCollectionForm = async (values: CollectionForm) => {
    setCollectionFormValues(values);
    setActiveStep(Steps.Items);
  };

  const handleSubmitCollectionItemsForm = async (
    values: CollectionItemsForm
  ) => {
    setCollectionItemsFormValues(values);
    setActiveStep(Steps.Create);
  };

  const handlePrevious = () => {
    setActiveStep((step) => step - 1);
  };

  const handleCloseCreateCollection = () => {
    setShowCreateDialog(false);
  };

  const handleCreateCollection = async () => {
    if (collectionFormValues && contractHash) {
      const contractAddress = await createCollectionMutation.mutateAsync({
        name: collectionFormValues.name,
        symbol: collectionFormValues.symbol,
        contractURI: contractHash,
      });

      setContractAddress(contractAddress);
    }
  };

  const handleCreateItems = async () => {
    if (contractAddress && account && itemsHash !== undefined) {
      await createItemsMutation.mutateAsync({
        contractAddress: contractAddress,
        items: itemsHash.map((hash: string) => ({
          to: account,
          tokenURI: hash,
        })),
      });
    }
  };

  const handleCreate = () => {
    setShowConfirm(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const handleConfirm = async () => {
    if (
      collectionFormValues &&
      collectionFormValues.file &&
      collectionItemsFormValues
    ) {
      setShowConfirm(false);
      setShowCreateDialog(true);

      let contractMetadataFile = await uploadImageMutation.mutateAsync(
        collectionFormValues.file
      );

      let uploadedContractMetadata =
        await upCollectionMetadataMutation.mutateAsync({
          external_link: collectionFormValues.url,
          description: collectionFormValues.description,
          name: collectionFormValues.name,
          image: `ipfs://${contractMetadataFile}`,
          fee_recipient: '',
          seller_fee_basis_points: 0,
        });

      setContractHash(uploadedContractMetadata);

      if (collectionItemsFormValues.items?.length > 0) {
        let files = await uploadImagesMutation.mutateAsync(
          collectionItemsFormValues.items?.map((i) => i.file)
        );

        const items: WizardItem[] = collectionItemsFormValues.items.map(
          (item, index: number) => ({
            attributes: item.attributes || [],
            description: item.description || '',
            image: `ipfs://${files[index]}` || '',
            name: item.name || '',
            external_link: '',
          })
        );

        let uploadedItems = await uploadMetadataMutation.mutateAsync(items);

        setItemsHash(uploadedItems);
      }
    }
  };

  const renderCollectionForm = () => {
    return (
      <Formik
        initialValues={
          collectionFormValues ? collectionFormValues : INITIAL_VALUES
        }
        onSubmit={handleSubmitCollectionForm}
        validationSchema={CollectionFormSchema}
      >
        <CollectionFormCard />
      </Formik>
    );
  };

  const renderItemsForm = () => {
    return (
      <Formik
        initialValues={
          collectionItemsFormValues ? collectionItemsFormValues : { items: [] }
        }
        onSubmit={handleSubmitCollectionItemsForm}
        validationSchema={CollectionItemsSchema}
      >
        <CollectionItemsCard onPrevious={handlePrevious} />
      </Formik>
    );
  };

  const renderConfirmCard = () => {
    return (
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <Card>
              <CardContent>
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    alignContent="center"
                    justifyContent="center"
                  >
                    {collectionFormValues && (
                      <WizardFileImage file={collectionFormValues?.file} />
                    )}
                  </Stack>
                  <Divider />
                  <Stack
                    direction="row"
                    alignItems="center"
                    alignContent="center"
                    justifyContent="space-between"
                  >
                    <Typography>
                      <FormattedMessage id="name" defaultMessage="Name" />
                    </Typography>
                    <Typography
                      sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                    >
                      {collectionFormValues?.name}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    alignContent="center"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Typography>
                      <FormattedMessage id="symbol" defaultMessage="Symbol" />
                    </Typography>
                    <Typography
                      sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                      color="textSecondary"
                    >
                      {collectionFormValues?.symbol}
                    </Typography>
                  </Stack>

                  {collectionFormValues?.description && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      alignContent="center"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Typography>
                        <FormattedMessage
                          id="description"
                          defaultMessage="Description"
                        />
                      </Typography>
                      <Typography
                        sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                        color="textSecondary"
                      >
                        {collectionFormValues?.description}
                      </Typography>
                    </Stack>
                  )}
                  {collectionFormValues?.url && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      alignContent="center"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Typography>
                        <FormattedMessage id="url" defaultMessage="URL" />
                      </Typography>
                      <Typography
                        sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                        color="textSecondary"
                      >
                        {collectionFormValues?.url}
                      </Typography>
                    </Stack>
                  )}
                  <Button
                    onClick={handleCreate}
                    variant="contained"
                    color="primary"
                  >
                    <FormattedMessage id="create" defaultMessage="Create" />
                  </Button>
                  <Button
                    onClick={handlePrevious}
                    variant="outlined"
                    color="primary"
                  >
                    <FormattedMessage id="review" defaultMessage="Review" />
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Box>
              <Stack spacing={2}>
                {collectionItemsFormValues?.items?.map(
                  (item, index: number) => (
                    <Card key={index}>
                      <Box p={2}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          alignContent="center"
                          spacing={2}
                        >
                          <WizardFileImage small file={item?.file} />
                          <Box>
                            <Typography variant="body1">{item.name}</Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Card>
                  )
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const handleReset = () => {
    setShowCreateDialog(false);
    uploadImageMutation.reset();
    uploadImagesMutation.reset();
    uploadMetadataMutation.reset();
    createCollectionMutation.reset();
    createItemsMutation.reset();

    setActiveStep(Steps.Collection);
    setCollectionFormValues(undefined);
    setCollectionItemsFormValues(undefined);
    setDeployHash(undefined);
    setContractAddress(undefined);
    setItemsHash(undefined);
    setItemsTxHash(undefined);
  };

  return (
    <>
      <CreateCollectionDialog
        dialogProps={{
          open: showCreateDialog,
          onClose: handleCloseCreateCollection,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        itemsHash={itemsTxHash}
        deployHash={deployHash}
        isCreatingCollection={createCollectionMutation.isLoading}
        isCreatingCollectionDone={createCollectionMutation.isSuccess}
        isUploadingMetadata={uploadMetadataMutation.isLoading}
        isUploadingMetadataDone={uploadMetadataMutation.isSuccess}
        isCreatingItemsDone={createItemsMutation.isSuccess}
        isCreatingItems={createItemsMutation.isLoading}
        isUploadingImagesDone={
          uploadImageMutation.isSuccess && uploadImagesMutation.isSuccess
        }
        isUploadingImages={
          uploadImageMutation.isLoading || uploadImagesMutation.isLoading
        }
        canMintItems={
          collectionItemsFormValues &&
          collectionItemsFormValues?.items?.length > 0
        }
        chainId={chainId}
        contractAddress={contractAddress}
        onCreateCollection={handleCreateCollection}
        onCreateItems={handleCreateItems}
        onReset={handleReset}
      />
      <AppConfirmDialog
        dialogProps={{
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
        onConfirm={handleConfirm}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.create.this.collection"
            defaultMessage="Do you really want to create this collection?"
          />
        </Typography>
      </AppConfirmDialog>
      <MainLayout>
        <Stack spacing={2}>
          <AppPageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="home" defaultMessage="Home" />,
                uri: '/',
              },
              {
                caption: (
                  <FormattedMessage id="wizard" defaultMessage="Wizard" />
                ),
                uri: '/wizard',
              },
              {
                caption: (
                  <FormattedMessage
                    id="collections"
                    defaultMessage="Collections"
                  />
                ),
                uri: '/wizard/collections',
              },
              {
                caption: (
                  <FormattedMessage id="create" defaultMessage="Create" />
                ),
                uri: '/wizard/collections/create',
              },
            ]}
          />
        </Stack>
        <Box>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={8}>
              <Box>
                <Stack spacing={2}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    <Step>
                      <StepLabel>
                        <FormattedMessage
                          defaultMessage="Collection Description"
                          id="collection.description"
                        />
                      </StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>
                        <FormattedMessage
                          defaultMessage="Add Items"
                          id="add.items"
                        />
                      </StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>
                        <FormattedMessage
                          defaultMessage="Create Collection"
                          id="create.collection"
                        />
                      </StepLabel>
                    </Step>
                  </Stepper>
                  <Box>
                    {activeStep === Steps.Collection
                      ? renderCollectionForm()
                      : activeStep === Steps.Items
                      ? renderItemsForm()
                      : activeStep === Steps.Create
                      ? renderConfirmCard()
                      : ''}
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </MainLayout>
    </>
  );
};

export default WizardCreateCollectionPage;
