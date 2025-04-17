import Link from '@/modules/common/components/Link';
import { getBlockExplorerUrl, truncateAddress } from '@/modules/common/utils';
import { ListItemButton, ListItemText, Typography } from '@mui/material';
import { memo } from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
  strength: number;
  tokenId: string;
  owner: string;
  chainId?: number;
  onClick: (tokenId: string) => void;
}

export function KittygotchiRankingListItem({
  strength,
  tokenId,
  owner,
  chainId,
  onClick,
}: Props) {
  return (
    <ListItemButton onClick={() => onClick(tokenId)}>
      <ListItemText
        primary={`Kittygotchi #${tokenId}`}
        secondary={
          <>
            <FormattedMessage
              id="owned.by.owner"
              defaultMessage="Owned by {owner}"
              values={{
                owner: (
                  <Link
                    href={`${getBlockExplorerUrl(chainId)}/address/${owner}`}
                    target="_blank"
                  >
                    {truncateAddress(owner)}
                  </Link>
                ),
              }}
            />
          </>
        }
      />
      <Typography variant="body1">{strength}</Typography>
    </ListItemButton>
  );
}

export default memo(KittygotchiRankingListItem);
