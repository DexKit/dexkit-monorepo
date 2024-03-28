import { ChainId } from "@dexkit/core/constants";
import { SwapWidget } from "@dexkit/widgets/src/widgets/swap";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import { useWeb3React } from "@web3-react/core";

import { useActiveChainIds, useCurrency } from "@dexkit/ui/hooks";
import { useSwapState } from "@dexkit/ui/modules/swap/hooks";
import { SwapPageSection } from "@dexkit/ui/modules/wizard/types/section";

interface Props {
  section: SwapPageSection;
}

interface Props {
  section: SwapPageSection;
}

export function SwapSection({ section }: Props) {
  const currency = useCurrency();
  const { chainId } = useWeb3React();
  const { activeChainIds } = useActiveChainIds();
  const swapState = useSwapState();

  return (
    <Box py={4}>
      <Container maxWidth={"xs"} disableGutters>
        <SwapWidget
          {...swapState}
          activeChainIds={activeChainIds}
          renderOptions={{
            ...swapState.renderOptions,
            configsByChain: section.config?.configByChain
              ? section.config?.configByChain
              : {},
            currency: currency.currency,
            defaultChainId:
              chainId || section.config?.defaultChainId || ChainId.Ethereum,
            zeroExApiKey: process?.env.NEXT_PUBLIC_ZRX_API_KEY || "",
            transakApiKey: process?.env.NEXT_PUBLIC_TRANSAK_API_KEY || "",
          }}
        />
      </Container>
    </Box>
  );
}

export default SwapSection;
