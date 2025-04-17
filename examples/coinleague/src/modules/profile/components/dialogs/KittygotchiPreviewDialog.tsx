import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';
import OpenSea from '@/modules/common/components/icons/OpenSea';
import Link from '@/modules/common/components/Link';
import { getBlockExplorerUrl, truncateAddress } from '@/modules/common/utils';
import { GET_KITTYGOTCHI_CONTRACT_ADDR } from '@/modules/kittygotchi/constants';
import { useNft, useNftMetadata } from '@/modules/wallet/hooks/nfts';

import { getNormalizedUrl } from '@/modules/common/utils';

import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { providers } from 'ethers';
import { FormattedMessage } from 'react-intl';

interface Props {
  DialogProps: DialogProps;
  chainId?: number;
  tokenId?: string;
  provider?: providers.Web3Provider;
}

export default function KittygotchiPreviewDialog({
  DialogProps,
  chainId,
  tokenId,
  provider,
}: Props) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const nftQuery = useNft({
    tokenId,
    contractAddress: GET_KITTYGOTCHI_CONTRACT_ADDR(chainId),
    chainId,
    provider,
  });

  const nftMetadataQuery = useNftMetadata({
    tokenURI: nftQuery.data?.tokenURI,
  });

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={<FormattedMessage id="preview" defaultMessage="Preview" />}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          {nftMetadataQuery.isLoading ? (
            <Skeleton
              variant="rectangular"
              sx={{ height: '100%', width: '100%' }}
            />
          ) : (
            nftMetadataQuery.data?.image && (
              <img src={getNormalizedUrl(nftMetadataQuery.data?.image)} />
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
                    {nftQuery.data?.collectionName} #{nftQuery.data?.tokenId}
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
                      href={`${getBlockExplorerUrl(chainId)}/address/${
                        nftQuery.data?.owner
                      }`}
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
      </DialogContent>
    </Dialog>
  );
}
