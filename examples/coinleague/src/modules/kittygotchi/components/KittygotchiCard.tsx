import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Skeleton,
  Stack,
} from '@mui/material';

import Link from '@/modules/common/components/Link';
import { ChainId } from '@/modules/common/constants/enums';
import { getBlockExplorerUrl, getNormalizedUrl } from '@/modules/common/utils';
import { useNftMetadata } from '@/modules/wallet/hooks/nfts';
import { FormattedMessage } from 'react-intl';
import { GET_KITTYGOTCHI_CONTRACT_ADDR } from '../constants';
import { getKittygotchiMetadataEndpoint } from '../utils';

interface Props {
  id: string;
  chainId?: ChainId;
}

export default function KittygotchiCard({ id, chainId }: Props) {
  const metadataQuery = useNftMetadata({
    tokenURI: `${getKittygotchiMetadataEndpoint(chainId)}${id}`,
  });

  return (
    <Card>
      <CardActionArea
        sx={{ height: 'auto', width: '100%' }}
        LinkComponent={Link}
        href={`/kittygotchi/${id}`}
      >
        {metadataQuery.isLoading ? (
          <Skeleton
            variant="rectangular"
            sx={{ paddingTop: '100%', width: '100%' }}
          />
        ) : (
          <img
            src={
              metadataQuery.data?.image &&
              getNormalizedUrl(metadataQuery.data?.image)
            }
            style={{
              height: '100%',
              width: '100%',
            }}
          />
        )}
      </CardActionArea>
      <Divider />
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack>
            <Link
              href={`${getBlockExplorerUrl(
                chainId
              )}/address/${GET_KITTYGOTCHI_CONTRACT_ADDR(chainId)}`}
              variant="caption"
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                wordWrap: 'normal',
              }}
            >
              <FormattedMessage id="kittygotchi" defaultMessage="Kittygotchi" />
            </Link>
            <Link
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
              variant="body1"
              color="inherit"
              href={`/kittygotchi/${id}`}
            >
              Kittygotchi #{id}
            </Link>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
