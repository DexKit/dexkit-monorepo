import { ChainId } from '@dexkit/core/constants/enums';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import theDefaultExchangeConfig from '../../../../../config/quick.exchange.default.app.json';
import theDefaultNFTStoreConfig from '../../../../../config/quick.store.default.app.json';
import theDefaultSwapConfig from '../../../../../config/quick.swap.default.app.json';
import theDefaultWalletConfig from '../../../../../config/quick.wallet.default.app.json';
import { AppCreationData } from './VibecoderAppCreationForm';
import { AppType } from './vibecoder-utils';

const defaultConfigs: Record<AppType, any> = {
  [AppType.SWAP]: theDefaultSwapConfig,
  [AppType.EXCHANGE]: theDefaultExchangeConfig,
  [AppType.WALLET]: theDefaultWalletConfig,
  [AppType.NFT_STORE]: theDefaultNFTStoreConfig,
  [AppType.NFT_COLLECTION]: theDefaultNFTStoreConfig,
  [AppType.COMMERCE]: theDefaultSwapConfig,
  [AppType.REFERRAL]: theDefaultSwapConfig,
  [AppType.LEADERBOARD]: theDefaultSwapConfig,
  [AppType.TOKEN_TRADE]: theDefaultSwapConfig,
  [AppType.GATED_CONTENT]: theDefaultSwapConfig,
  [AppType.GENERAL]: theDefaultSwapConfig,
};

export interface CreateAppResponse {
  slug: string;
  id: number;
  domain: string;
}

export function useCreateAppFromVibecoder() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation<CreateAppResponse, Error, AppCreationData>(
    async (data: AppCreationData) => {
      const defaultConfig = defaultConfigs[data.appType] as AppConfig;

      const appConfig: AppConfig = {
        ...defaultConfig,
        name: data.appName,
        domain: `https://${data.appName}.dexkit.app`,
      };

      if (data.network) {
        const chainId = data.network as ChainId;
        const currentChainIds = appConfig.activeChainIds || [];
        if (!currentChainIds.includes(chainId)) {
          appConfig.activeChainIds = [chainId, ...currentChainIds];
        }
      }

      const response = await instance?.post('/site/create-site', {
        config: appConfig,
        slug: data.appName,
        type: 'MARKETPLACE',
      });

      return {
        slug: response?.data?.slug || data.appName,
        id: response?.data?.id || 0,
        domain: response?.data?.domain || `${data.appName}.dexkit.app`,
      };
    }
  );
}

