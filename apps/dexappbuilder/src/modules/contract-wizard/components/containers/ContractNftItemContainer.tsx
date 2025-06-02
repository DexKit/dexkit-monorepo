import { getBlockExplorerUrl, truncateAddress } from '@dexkit/core/utils';
import EvmBurnNftDialog from '@dexkit/ui/modules/evm-burn-nft/components/dialogs/EvmBurnNftDialog';
import EvmTransferNftDialog from '@dexkit/ui/modules/evm-transfer-nft/components/dialogs/EvmTransferNftDialog';
import { AssetImage } from '@dexkit/ui/modules/nft/components/AssetImage';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Link,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useContract, useContractMetadata, useNFT } from '@thirdweb-dev/react';
import { useState } from 'react';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { FormattedMessage } from 'react-intl';

export interface ContractNftItemContainerProps {
  address: string;
  network: string;
  tokenId: string;
}

export default function ContractNftItemContainer({
  address,
  network,
  tokenId,
}: ContractNftItemContainerProps) {
  const { data: contract } = useContract(address, 'nft-collection');
  const contractMetadata = useContractMetadata(contract);
  const nftQuery = useNFT(contract, tokenId);

  const [showTransfer, setShowTransfer] = useState(false);
  const [showBurn, setShowBurn] = useState(false);

  const handleShowTransfer = () => {
    setShowTransfer(true);
  };

  const handleClose = () => {
    setShowTransfer(false);
  };

  const handleShowBurn = () => {
    setShowBurn(true);
  };

  const handleCloseBurn = () => {
    setShowBurn(false);
  };

  const { chainId, provider, account } = useWeb3React();

  return (
    <>
      <EvmTransferNftDialog
        DialogProps={{
          open: showTransfer,
          onClose: handleClose,
          maxWidth: 'sm',
          fullWidth: true,
        }}
        params={{
          contractAddress: address,
          tokenId,
          provider,
          chainId,
          account,
          nft: {
            chainId,
            collectionName: (nftQuery.data?.metadata.name as string) || '',
            owner: nftQuery.data?.owner,
            protocol: contract?.erc721.featureName,
            tokenId,
          },
          nftMetadata: nftQuery.data?.metadata
            ? {
                description: nftQuery.data?.metadata.description || '',
                name: (nftQuery.data?.metadata.name as string) || '',
                image: nftQuery.data?.metadata.image || '',
              }
            : undefined,
        }}
      />
      <EvmBurnNftDialog
        DialogProps={{
          open: showBurn,
          onClose: handleCloseBurn,
          maxWidth: 'sm',
          fullWidth: true,
        }}
        params={{
          contractAddress: address,
          tokenId,
          chainId,
          account,
          nft: {
            chainId,
            collectionName: (nftQuery.data?.metadata.name as string) || '',
            owner: nftQuery.data?.owner,
            protocol: contract?.erc721.featureName,
            tokenId,
          },
          nftMetadata: nftQuery.data?.metadata
            ? {
                description: nftQuery.data?.metadata.description || '',
                name: (nftQuery.data?.metadata.name as string) || '',
                image: nftQuery.data?.metadata.image || '',
              }
            : undefined,
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="home" defaultMessage="Home" />,
                uri: '/',
              },
              {
                caption: contractMetadata.data?.name,
                uri: `/contract/${network}/${address}`,
              },
              {
                caption: `#${nftQuery.data?.metadata.id}`,
                uri: `/contract/${network}/${address}/${tokenId}`,
                active: true,
              },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            {nftQuery.isLoading && (
              <Skeleton
                variant="rectangular"
                sx={{ aspectRatio: '1/1', height: '100%' }}
              />
            )}
            {nftQuery.data && nftQuery.data.metadata.image && (
              <CardMedia
                component="div"
                sx={{ display: 'block', maxWidth: '100%', height: 'auto' }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                  }}
                >
                  <AssetImage src={nftQuery.data.metadata.image} />
                </Box>
              </CardMedia>
            )}
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Box>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body1">
                  {contractMetadata.isLoading ? (
                    <Skeleton />
                  ) : (
                    contractMetadata.data?.name
                  )}
                </Typography>
                <Typography variant="body1">
                  {nftQuery.isLoading ? (
                    <Skeleton />
                  ) : (
                    nftQuery.data?.metadata.name
                  )}
                </Typography>
              </Box>
              <Box>
                <Stack spacing={2} direction="row">
                  <Button variant="contained" onClick={handleShowTransfer}>
                    <FormattedMessage id="transfer" defaultMessage="Transfer" />
                  </Button>
                  <Button variant="contained" onClick={handleShowBurn}>
                    <FormattedMessage id="burn" defaultMessage="Burn" />
                  </Button>
                  <Button
                    size="small"
                    href={`/asset/${network}/${address}/${tokenId}`}
                    endIcon={<OpenInNewIcon />}
                    target="_blank"
                  >
                    <FormattedMessage
                      id="view.public.page"
                      defaultMessage="View public page"
                    />
                  </Button>
                </Stack>
              </Box>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Stack>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="space-between"
                        >
                          <Typography>
                            <FormattedMessage
                              id="token.id"
                              defaultMessage="Token ID"
                            />
                          </Typography>
                          <Typography>{nftQuery.data?.metadata.id}</Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="space-between"
                        >
                          <Typography>
                            <FormattedMessage
                              id="owner"
                              defaultMessage="Owner"
                            />
                          </Typography>
                          <Typography>
                            <Link
                              href={`${getBlockExplorerUrl(
                                chainId,
                              )}/address/${nftQuery.data?.owner}`}
                              target="_blank"
                            >
                              {truncateAddress(nftQuery.data?.owner)}
                            </Link>
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="space-between"
                        >
                          <Typography>
                            <FormattedMessage
                              id="token.standard"
                              defaultMessage="Token Standard"
                            />
                          </Typography>
                          <Typography>ERC721</Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
