import AppDialogTitle from '@/modules/common/components/AppDialogTitle';
import OpenSea from '@/modules/common/components/icons/OpenSea';
import Link from '@/modules/common/components/Link';
import { useNotifications } from '@/modules/common/hooks/app';
import { AppNotificationType } from '@/modules/common/types/app';
import { TransactionStatus } from '@/modules/common/types/transactions';
import {
  getBlockExplorerUrl,
  getNormalizedUrl,
  isAddressEqual,
  truncateAddress,
} from '@/modules/common/utils';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { ethers } from 'ethers';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import { TransferNftSchema } from '../../constants/schemas';
import { useNft, useNftMetadata, useNftTransfer } from '../../hooks/nfts';

interface Props {
  DialogProps: DialogProps;
  tokenId?: string;
  chainId?: number;
  account?: string;
  contractAddress?: string;
  provider?: ethers.providers.Web3Provider;
  onOwnershipChange?: (ownerAddress: string) => void;
}

export default function EvmTransferNftDialog({
  DialogProps,
  tokenId,
  chainId,
  contractAddress,
  account,
  provider,
  onOwnershipChange,
}: Props) {
  const { onClose } = DialogProps;
  const { formatMessage } = useIntl();
  const { addNotification } = useNotifications();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = (cb?: () => void) => {
    return () => {
      if (cb) {
        cb();
      }
      if (onClose) {
        onClose({}, 'backdropClick');
      }
    };
  };

  const nftQuery = useNft({ chainId, contractAddress, provider, tokenId });
  const nftMetadataQuery = useNftMetadata({
    tokenURI: nftQuery.data?.tokenURI,
  });

  const nftTransfer = useNftTransfer({
    contractAddress,
    provider,
    onSubmit: (hash: string) => {
      handleClose()();
      if (hash && chainId) {
        const now = Date.now();
        addNotification({
          notification: {
            type: AppNotificationType.Transaction,
            title: formatMessage(
              {
                defaultMessage: 'Transfer {name} #{id}',
                id: 'transfer.name.id',
              },
              { id: tokenId as string, name: nftQuery.data?.collectionName }
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
    },
  });

  const handleSubmit = async (
    { address }: { address: string },
    helpers: FormikHelpers<{ address: string }>
  ) => {
    if (tokenId && account) {
      await nftTransfer.mutateAsync(
        { tokenId, from: account, to: address },
        {
          onError: (err) => {
            nftTransfer.reset();
            enqueueSnackbar(
              formatMessage({
                id: 'error.while.transferring',
                defaultMessage: 'Error while transferring',
              }),
              { variant: 'error' }
            );
          },
        }
      );

      if (onOwnershipChange) {
        onOwnershipChange(address);
      }

      helpers.resetForm();
    }
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{ address: '' }}
      validationSchema={TransferNftSchema}
    >
      {({ isSubmitting, isValid, values, submitForm, resetForm }) => (
        <Form>
          <Dialog {...DialogProps}>
            <AppDialogTitle
              title={
                <FormattedMessage id="transfer" defaultMessage="Transfer" />
              }
              onClose={handleClose(resetForm)}
            />
            <DialogContent dividers>
              <Stack spacing={2}>
                <Box>
                  <Stack spacing={2}>
                    {nftMetadataQuery.isLoading ? (
                      <Skeleton
                        variant="rectangular"
                        sx={{ height: '100%', width: '100%' }}
                      />
                    ) : (
                      nftMetadataQuery.data?.image && (
                        <img
                          src={getNormalizedUrl(nftMetadataQuery.data?.image)}
                        />
                      )
                    )}

                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Box>
                        <Link href="/" target="_blank" variant="caption">
                          {nftQuery.isLoading ? (
                            <Skeleton />
                          ) : (
                            nftQuery.data?.collectionName
                          )}
                        </Link>

                        <Typography variant="body1">
                          {nftQuery.isLoading ? (
                            <Skeleton />
                          ) : (
                            <>
                              {nftQuery.data?.collectionName} #
                              {nftQuery.data?.tokenId}
                            </>
                          )}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton>
                          <OpenSea />
                        </IconButton>
                      </Box>
                    </Stack>
                    <Typography variant="caption">
                      {nftQuery.isLoading ? (
                        <Skeleton />
                      ) : (
                        <FormattedMessage
                          id="owned.by.owner"
                          defaultMessage="Owned by {owner}"
                          values={{
                            owner: (
                              <Link
                                href={`${getBlockExplorerUrl(
                                  chainId
                                )}/address/${nftQuery.data?.owner}`}
                                target="_blank"
                              >
                                {truncateAddress(nftQuery.data?.owner)}
                              </Link>
                            ),
                          }}
                        />
                      )}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {nftMetadataQuery.isLoading ? (
                        <Skeleton />
                      ) : (
                        nftMetadataQuery.data?.description
                      )}
                    </Typography>
                  </Stack>
                </Box>
                {!isAddressEqual(nftQuery.data?.owner, account) && (
                  <Alert severity="error">
                    <FormattedMessage
                      id="you.are.not.the.owner.of.this.NFT"
                      defaultMessage="You are not the owner of this NFT"
                    />
                  </Alert>
                )}
                <Field
                  label={
                    <FormattedMessage id="address" defaultMessage="Address" />
                  }
                  name="address"
                  component={TextField}
                  type="text"
                />

                {isAddressEqual(nftQuery.data?.owner, values.address) && (
                  <Alert severity="error">
                    <FormattedMessage
                      id="you.cant.use.the.connected.account.to.transfer"
                      defaultMessage="You can't use the connected to transfer"
                    />
                  </Alert>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={
                  nftTransfer.isLoading ? (
                    <CircularProgress color="inherit" size="1rem" />
                  ) : undefined
                }
                disabled={
                  isSubmitting ||
                  !isValid ||
                  isAddressEqual(nftQuery.data?.owner, values.address) ||
                  nftTransfer.isLoading ||
                  !isAddressEqual(nftQuery.data?.owner, account)
                }
                variant="contained"
                color="primary"
                type="submit"
                onClick={submitForm}
              >
                {nftTransfer.isLoading ? (
                  <FormattedMessage
                    id="transferring"
                    defaultMessage="Transferring"
                  />
                ) : (
                  <FormattedMessage id="transfer" defaultMessage="Transfer" />
                )}
              </Button>
              <Button onClick={handleClose(resetForm)}>
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
            </DialogActions>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
}
