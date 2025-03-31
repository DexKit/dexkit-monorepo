import { ChainId } from '@/modules/common/constants/enums';
import {
  getNetworkSlugFromChainId,
  truncateAddress,
} from '@/modules/common/utils';
import { Link, TableCell, TableRow, Typography } from '@mui/material';
import { memo } from 'react';
import { CoinLeagueAffiliateEntry } from '../types';

interface Props {
  chainId?: ChainId;
  affiliate: CoinLeagueAffiliateEntry;
}

function AffiliateHistoryTableRow({ affiliate, chainId }: Props) {
  const createdFn = affiliate.createdAt
    ? new Date(Number(affiliate.createdAt) * 1000)
    : new Date();

  return (
    <TableRow>
      <TableCell>
        <Typography>{createdFn.toLocaleDateString()}</Typography>
      </TableCell>
      <TableCell>
        <Typography>
          <Link
            color="inherit"
            href={`/coinleague/${getNetworkSlugFromChainId(chainId)}/${
              affiliate.game.intId
            }`}
          >
            {affiliate.game.intId}
          </Link>
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>{affiliate.type}</Typography>
      </TableCell>
      <TableCell>
        <Typography>
          <Link
            color="inherit"
            target="_blank"
            href={`https://polygonscan.com/address/${affiliate.player.id}`}
          >
            {truncateAddress(affiliate.player.id)}
          </Link>
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export default memo(AffiliateHistoryTableRow);
