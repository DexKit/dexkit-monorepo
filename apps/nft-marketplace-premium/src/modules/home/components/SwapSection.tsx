import { SwapWidget } from '@dexkit/widgets';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useSwapState } from 'src/hooks/swap';

import { useCurrency } from '../../../hooks/currency';
import { SwapPageSection } from '../../../types/config';

interface Props {
  section: SwapPageSection;
}

export function SwapSection({ section }: Props) {
  const currency = useCurrency();

  const swapState = useSwapState();

  return (
    <Box py={8}>
      <Container maxWidth="sm">
        <SwapWidget
          renderOptions={{
            configsByChain: section.config?.configByChain
              ? section.config?.configByChain
              : {},
            currency,
            defaultChainId: section.config?.defaultChainId,
            zeroExApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY || '',
            transakApiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || '',
          }}
          {...swapState}
        />
      </Container>
    </Box>
  );
}

export default SwapSection;
