import { ChainId } from '@/modules/common/constants/enums';
import { useColorScheme } from '@mui/material/styles';
import { memo } from 'react';

import { TickerTape } from 'react-ts-tradingview-widgets';
import { PriceFeeds } from '../constants';

function TickerTapeTV() {
  const { mode } = useColorScheme();
  const isDark = mode === 'dark';

  const symbols = PriceFeeds[ChainId.Polygon]
    // .concat(PriceFeeds[ChainId.BSC])
    .filter((s) => s.tv)
    .map((s) => {
      return {
        proName: s.tv as string,
        title: (s.tv as string).split(':')[1],
      };
    });

  return (
    <TickerTape
      colorTheme="dark"
      symbols={symbols}
      isTransparent={true}
      displayMode="adaptive"
    />
  );
}
export default memo(TickerTapeTV);
