import { useDexKitContext } from '@dexkit/ui';
import AppDataTableDialog from '@dexkit/ui/components/dialogs/AppDataTableDialog';
import { useApproveForAll } from '@dexkit/ui/modules/contract-wizard/hooks/thirdweb';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Skeleton,
    Stack,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import {
    CustomContractMetadata,
    useContract,
    useContractRead,
    useMetadata,
} from '@thirdweb-dev/react';
import { utils } from 'ethers';
import { SyntheticEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ContractAdminTab from '../ContractAdminTab';
import ContractMetadataTab from '../ContractMetadataTab';
import SelectCollectionDialog from '../dialogs/SelectCollectionDialog';
import ContractAirdrop1155BalanceDialog from './ContractAirdropErc1155BalanceDialog';

export interface ContractAirdropErc1155ContainerProps {
  address: string;
  network: string;
}

export default function ContractAirdropErc1155Container({
  address,
  network,
}: ContractAirdropErc1155ContainerProps) {
  const { data: contract } = useContract(address as string);
  const [recipients, setRecipients] = useState<
    { recipient: string; tokenId: number; amount: number }[]
  >([]);

  const [contractAddress, setContractAddress] = useState<string>();
  const { account } = useWeb3React();

  const { data: tokenContract } = useContract(contractAddress);

  const approve = useApproveForAll({ address, contract: tokenContract });

  const { chainId } = useWeb3React();

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const { data: metadata, isLoading: isMetadataLoading } =
    useMetadata(tokenContract);

  const { data: isApprovedForAll } = useContractRead(
    tokenContract,
    'isApprovedForAll',
    [account, address],
  );

  const airdropMutation = useMutation(
    async ({
      recipients,
    }: {
      recipients: { recipient: string; tokenId: number; amount: number }[];
    }) => {
      const metadata = await tokenContract?.metadata.get();

      if (!isApprovedForAll) {
        await approve.mutateAsync();
      }

      const values = {
        name: metadata?.name || '',
      };

      if (!account || !contractAddress) {
        return;
      }

      watchTransactionDialog.open('airdropErc1155', values);

      let call = await contract?.airdrop1155.drop.prepare(
        contractAddress,
        account,
        recipients.map((r) => ({
          recipient: r.recipient,
          tokenId: r.tokenId,
          amount: r.amount,
        })),
      );

      let tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: 'transaction',
          subtype: 'airdropErc1155',
          metadata: {
            hash: tx.hash,
            chainId,
          },
          values: values,
        });

        watchTransactionDialog.watch(tx?.hash);
      }

      return await tx?.wait();
    },
  );

  const handleConfirm = (data: { [key: string]: string }[]) => {
    setRecipients(
      data.map((r) => ({
        recipient: r.recipient,
        tokenId: parseInt(r.tokenId),
        amount: parseInt(r.amount),
      })),
    );
  };

  const [showAirdrop, setShowAirdrop] = useState(false);

  const handleSelectRecipients = () => {
    setShowAirdrop(true);
  };

  const handleClose = () => {
    setShowAirdrop(false);
  };

  const handleAirdrop = async () => {
    await airdropMutation.mutateAsync({ recipients });
  };

  const [showSelectCollection, setShowSelectCollection] = useState(false);

  const handleCloseSelectCollection = () => {
    setShowSelectCollection(false);
  };

  const handleSelect = (address: string) => {
    setContractAddress(address);
    handleCloseSelectCollection();
  };

  const handleShowSelectToken = () => {
    setShowSelectCollection(true);
  };

  const [currTab, setCurrTab] = useState('airdrop');

  const handleChange = (e: SyntheticEvent, value: string) => {
    setCurrTab(value);
  };

  const [showBalance, setShowBalance] = useState(false);

  const handleCloseBalance = () => {
    setShowBalance(false);
  };

  const handleShowBalance = () => {
    setShowBalance(true);
  };

  return (
    <>
      <AppDataTableDialog
        DialogProps={{
          open: showAirdrop,
          onClose: handleClose,
          fullWidth: true,
          maxWidth: 'lg',
        }}
        onConfirm={handleConfirm}
        value={recipients as any}
        dataColumns={[
          {
            width: 250,
            headerName: 'Recipient',
            name: 'recipient',
            isValid: (value: unknown) => {
              return utils.isAddress(value as string);
            },
            editable: true,
          },
          {
            headerName: 'TokenId',
            name: 'tokenId',
            isValid: (value: unknown) => {
              try {
                parseInt(value as any);
                return true;
              } catch (err) {
                return false;
              }
            },
            editable: true,
          },
          {
            headerName: 'Amount',
            name: 'amount',
            isValid: (value: unknown) => {
              try {
                parseInt(value as any);
                return true;
              } catch (err) {
                return false;
              }
            },
            editable: true,
          },
        ]}
        title={
          <FormattedMessage
            id="nft.edition.airdrop"
            defaultMessage="NFT Edition Airdrop"
          />
        }
      />
      <SelectCollectionDialog
        DialogProps={{
          open: showSelectCollection,
          onClose: handleCloseSelectCollection,
          maxWidth: 'sm',
          fullWidth: true,
        }}
        onSelect={handleSelect}
        chainId={chainId}
        isErc1155
      />
      <ContractAirdrop1155BalanceDialog
        DialogProps={{
          open: showBalance,
          onClose: handleCloseBalance,
          maxWidth: 'sm',
          fullWidth: true,
        }}
        contractAddres={contractAddress}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs value={currTab} onChange={handleChange}>
            <Tab
              value="airdrop"
              label={<FormattedMessage id="airdrop" defaultMessage="Airdrop" />}
            />
            <Tab
              value="metadata"
              label={
                <FormattedMessage id="metadata" defaultMessage="Metadata" />
              }
            />
            <Tab
              value="admin"
              label={<FormattedMessage id="admin" defaultMessage="Admin" />}
            />
          </Tabs>
        </Grid>
        {currTab === 'airdrop' && (
          <>
            <Grid item xs={12}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ mb: !contractAddress ? 0.5 : 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            <FormattedMessage
                              id="your.editions"
                              defaultMessage="Your Editions"
                            />
                          </Typography>
                        </Box>
                        {!contractAddress ? (
                          <Typography gutterBottom variant="body1">
                            <FormattedMessage
                              id="select.a.edition"
                              defaultMessage="Select a edition"
                            />
                          </Typography>
                        ) : (
                          <Stack
                            spacing={1}
                            direction="row"
                            alignItems="center"
                            sx={{ py: 2 }}
                          >
                            {isMetadataLoading ? (
                              <Skeleton
                                variant="circular"
                                sx={{ height: '2rem', width: '2rem' }}
                              />
                            ) : (
                              <Avatar
                                variant="rounded"
                                src={
                                  (metadata as CustomContractMetadata)?.image ||
                                  ''
                                }
                              />
                            )}
                            <Typography variant="body1">
                              {isMetadataLoading ? (
                                <Skeleton />
                              ) : (
                                (metadata as CustomContractMetadata)?.name
                              )}
                            </Typography>
                          </Stack>
                        )}
                        <Stack spacing={1} direction="row">
                          {contractAddress && (
                            <Button
                              onClick={handleShowBalance}
                              size="small"
                              variant="outlined"
                            >
                              <FormattedMessage
                                id="view"
                                defaultMessage="View"
                              />
                            </Button>
                          )}

                          <Button
                            onClick={handleShowSelectToken}
                            size="small"
                            variant="outlined"
                          >
                            <FormattedMessage
                              id="select"
                              defaultMessage="Select"
                            />
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Stack
                          spacing={2}
                          justifyContent="space-between"
                          direction="row"
                          alignItems="center"
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              <FormattedMessage
                                id="total.recipients"
                                defaultMessage="Total recipients"
                              />
                            </Typography>
                            <Typography variant="h5">
                              {recipients.length}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            disabled={airdropMutation.isLoading}
                            onClick={handleSelectRecipients}
                            variant="outlined"
                          >
                            <FormattedMessage
                              id="select.recipients"
                              defaultMessage="Select"
                            />
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <Divider />
                <Stack direction="row">
                  <Button
                    startIcon={
                      airdropMutation.isLoading ? (
                        <CircularProgress color="inherit" size="1rem" />
                      ) : undefined
                    }
                    disabled={
                      recipients.length === 0 ||
                      airdropMutation.isLoading ||
                      !contractAddress
                    }
                    onClick={handleAirdrop}
                    variant="contained"
                  >
                    <FormattedMessage id="airdrop" defaultMessage="Airdrop" />
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </>
        )}
        {currTab === 'metadata' && (
          <Grid item xs={12}>
            <ContractMetadataTab address={address} />
          </Grid>
        )}
        {currTab === 'admin' && (
          <Grid item xs={12}>
            <ContractAdminTab address={address} />
          </Grid>
        )}
      </Grid>
    </>
  );
}
