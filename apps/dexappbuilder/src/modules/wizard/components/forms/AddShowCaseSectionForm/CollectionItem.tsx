import { ipfsUriToUrl } from '@dexkit/core/utils';
import { AppExpandableTypography } from '@dexkit/ui/components/AppExpandableTypography';
import useContractMetadata from '@dexkit/ui/hooks/blockchain';
import { useAsset } from '@dexkit/ui/modules/nft/hooks';
import { useJsonRpcProvider } from '@dexkit/ui/modules/wizard/hooks';
import { ShowCaseItemCollection } from '@dexkit/ui/modules/wizard/types/section';
import { Avatar, Box, Skeleton, Typography } from '@mui/material';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

export interface CollectionItemProps {
  item: ShowCaseItemCollection;
}

export default function CollectionItem({ item }: CollectionItemProps) {
  const providerQuery = useJsonRpcProvider({
    chainId: item.chainId,
  });

  const assetArgs = useMemo(() => {
    return [item.contractAddress, '1', {}, true, item.chainId] as any;
  }, [item]);

  const nftQuery = useAsset(...assetArgs);

  const contractMetadata = useContractMetadata({
    chainId: item.chainId,
    contractAddress: item.contractAddress,
    provider: providerQuery.data,
  });

  return (
    <>
      {nftQuery.isLoading || contractMetadata.isLoading ? (
        <Skeleton
          variant="circular"
          sx={(theme) => ({
            width: theme.spacing(5),
            height: theme.spacing(5),
          })}
        />
      ) : item.imageUrl ? (
        <Avatar variant="rounded" src={item.imageUrl} />
      ) : (
        <Avatar
          variant="rounded"
          src={
            contractMetadata.data?.image
              ? contractMetadata.data?.image
              : nftQuery.data?.metadata?.image
              ? ipfsUriToUrl(nftQuery.data?.metadata?.image)
              : undefined
          }
        />
      )}

      <Box>
        <Typography
          sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
          variant="body1"
          fontWeight="bold"
        >
          {nftQuery.isLoading || contractMetadata.isLoading ? (
            <Skeleton sx={{ flex: 1 }} />
          ) : item.title ? (
            item.title
          ) : contractMetadata.data?.name ? (
            contractMetadata.data?.name
          ) : (
            <>
              {nftQuery.data?.metadata?.name
                ? nftQuery.data?.metadata?.name
                : `${nftQuery.data?.collectionName}`}
            </>
          )}
        </Typography>
        {nftQuery.data?.metadata?.description && (
          <Typography
            sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
            variant="body2"
            color="text.secondary"
          >
            {nftQuery.isLoading ? (
              <Skeleton />
            ) : item.subtitle ? (
              item.subtitle
            ) : contractMetadata.data?.description ? (
              <AppExpandableTypography
                TypographyProps={{
                  sx: { textOverflow: 'ellipsis', overflow: 'hidden' },
                  variant: 'body2',
                  color: 'text.secondary',
                }}
                value={contractMetadata.data?.description}
              />
            ) : (
              <>
                {nftQuery.data?.metadata?.description ? (
                  <AppExpandableTypography
                    TypographyProps={{
                      sx: { textOverflow: 'ellipsis', overflow: 'hidden' },
                      variant: 'body2',
                      color: 'text.secondary',
                    }}
                    value={nftQuery.data?.metadata?.description}
                  />
                ) : (
                  <FormattedMessage
                    id="no.description"
                    defaultMessage="no description"
                  />
                )}
              </>
            )}
          </Typography>
        )}
      </Box>
    </>
  );
}
