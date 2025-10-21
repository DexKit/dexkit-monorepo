import { ChainId } from '@/modules/common/constants/enums';
import { useColorScheme } from '@mui/material/styles';
import { memo, useEffect, useState } from 'react';

import { TickerTape } from 'react-ts-tradingview-widgets';
import { PriceFeeds } from '../constants';

function TickerTapeTV() {
  const { mode } = useColorScheme();
  const [isDark, setIsDark] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsDark(true);
  }, []);

  useEffect(() => {
    if (isMounted && mode) {
      setIsDark(mode === 'dark');
    }
  }, [mode, isMounted]);

  const symbols = PriceFeeds[ChainId.Polygon]
    // .concat(PriceFeeds[ChainId.BSC])
    .filter((s) => s.tv)
    .map((s) => {
      return {
        proName: s.tv as string,
        title: (s.tv as string).split(':')[1],
      };
    });

  if (!isMounted) {
    return null;
  }

  return (
    <TickerTape
      colorTheme={isDark ? "dark" : "light"}
      symbols={symbols}
      isTransparent={false}
      displayMode="adaptive"
    />
  );
}
export default memo(TickerTapeTV);
