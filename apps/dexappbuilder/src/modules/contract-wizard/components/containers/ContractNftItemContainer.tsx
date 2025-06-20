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

  const { chainId, signer, account } = useWeb3React();

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
          signer,
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
        <Grid item xs={12} md={6}>
          <Card>
            {nftQuery.isLoading && (
              <Skeleton
                variant="rectangular"
                sx={{ aspectRatio: '1/1', height: '400px' }}
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
                    minHeight: '400px',
                  }}
                >
                  <AssetImage src={nftQuery.data.metadata.image} />
                </Box>
              </CardMedia>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {contractMetadata.isLoading ? (
                    <Skeleton />
                  ) : (
                    contractMetadata.data?.name
                  )}
                </Typography>
                <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                  {nftQuery.isLoading ? (
                    <Skeleton />
                  ) : (
                    nftQuery.data?.metadata.name
                  )}
                </Typography>
                {nftQuery.data?.metadata.description && (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2, lineHeight: 1.6 }}>
                    {nftQuery.data.metadata.description}
                  </Typography>
                )}
              </Box>
              <Box>
                <Stack spacing={2} direction="row" flexWrap="wrap">
                  <Button variant="contained" onClick={handleShowTransfer} size="large">
                    <FormattedMessage id="transfer" defaultMessage="Transfer" />
                  </Button>
                  <Button variant="outlined" onClick={handleShowBurn} size="large">
                    <FormattedMessage id="burn" defaultMessage="Burn" />
                  </Button>
                  <Button
                    variant="outlined"
                    href={`/asset/${network}/${address}/${tokenId}`}
                    endIcon={<OpenInNewIcon />}
                    target="_blank"
                    size="large"
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
                  <Typography variant="h6" gutterBottom>
                    <FormattedMessage
                      id="nft.details"
                      defaultMessage="NFT Details"
                    />
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2" color="text.secondary">
                            <FormattedMessage
                              id="token.id"
                              defaultMessage="Token ID"
                            />
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            #{nftQuery.data?.metadata.id}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2" color="text.secondary">
                            <FormattedMessage
                              id="owner"
                              defaultMessage="Owner"
                            />
                          </Typography>
                          <Typography variant="body1">
                            <Link
                              href={`${getBlockExplorerUrl(
                                chainId,
                              )}/address/${nftQuery.data?.owner}`}
                              target="_blank"
                              sx={{ textDecoration: 'none', fontWeight: 'medium' }}
                            >
                              {truncateAddress(nftQuery.data?.owner)}
                            </Link>
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2" color="text.secondary">
                            <FormattedMessage
                              id="token.standard"
                              defaultMessage="Token Standard"
                            />
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            ERC721
                          </Typography>
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
