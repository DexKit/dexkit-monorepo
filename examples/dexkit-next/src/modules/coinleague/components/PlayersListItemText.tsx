import { isAddressEqual } from '@/modules/common/utils';
import { ListItemText } from '@mui/material';

import { memo } from 'react';
import { PriceFeeds } from '../constants';

interface Props {
  chainId: number;
  address: string;
}

function PlayersListItemText({ chainId, address }: Props) {
  const priceFeed = PriceFeeds[chainId].find((f) =>
    isAddressEqual(address, f.address)
  );

  return (
    <ListItemText primary={priceFeed?.baseName} secondary={priceFeed?.base} />
  );
}

export default memo(PlayersListItemText);
