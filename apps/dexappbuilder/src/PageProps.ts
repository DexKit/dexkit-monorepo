import type { AssetAPI } from "@dexkit/ui/modules/nft/types";
import { DehydratedState } from "@tanstack/react-query";
import { AppConfig } from "@dexkit/ui/modules/wizard/types/config";

export interface PageProps {
  appConfig: AppConfig;
  appNFT: AssetAPI;
  siteId: number | undefined;
  dehydratedState: DehydratedState;
  site?: string;
  appPage?: string;
  appLocaleMessages?: Record<string, string> | null;
}
