import { SwapVariant } from '@dexkit/ui/modules/wizard/types';
import { ChainConfig } from '@dexkit/widgets/src/widgets/swap/types';

export interface SwapConfig {
  useGasless?: boolean;
  variant?: SwapVariant;
  myTokensOnlyOnSearch?: boolean;
  defaultChainId?: number;
  defaultEditChainId?: number;
  configByChain?: {
    [chain: number]: ChainConfig;
  };
}
