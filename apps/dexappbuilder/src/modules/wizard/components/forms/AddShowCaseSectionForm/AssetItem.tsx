import { ipfsUriToUrl } from '@dexkit/core/utils';
import { AppExpandableTypography } from '@dexkit/ui/components/AppExpandableTypography';
import { useAsset } from '@dexkit/ui/modules/nft/hooks';
import { ShowCaseItemAsset } from '@dexkit/ui/modules/wizard/types/section';
import { Avatar, Box, Skeleton, Typography } from '@mui/material';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

export interface AssetItemProps {
  item: ShowCaseItemAsset;
}

export default function AssetItem({ item }: AssetItemProps) {
  const assetArgs = useMemo(() => {
    return [item.contractAddress, item.tokenId, {}, true, item.chainId] as any;

    return [];
  }, [item]);

  const nftQuery = useAsset(...assetArgs);

  return (
    <>
      {nftQuery.isLoading ? (
        <Skeleton
          variant="circular"
          sx={(theme) => ({
            width: theme.spacing(5),
            height: theme.spacing(5),
          })}
        />
      ) : (
        <Avatar
          variant="rounded"
          src={
            nftQuery.data?.metadata?.image
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
          {nftQuery.isLoading ? (
            <Skeleton sx={{ flex: 1 }} />
          ) : (
            <>
              {nftQuery.data?.metadata?.name
                ? nftQuery.data?.metadata?.name
                : `${nftQuery.data?.collectionName} #${nftQuery.data?.id}`}
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
