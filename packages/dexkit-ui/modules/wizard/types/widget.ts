import { ThemeMode } from "../../../constants/enum";
import { AppCollection, AppPage, AppToken } from "./config";

export interface WidgetResponse {
  config: string;
  id: number;
  metadata: string;
  owner: string;
  slug: string;

}

export interface WidgetConfig {
  id?: number;
  name: string;
  locale: string;
  currency: string;
  hide_powered_by?: boolean;
  activeChainIds?: number[];
  page: AppPage;
  defaultThemeMode?: ThemeMode;
  theme: string;
  customThemeLight?: string;
  customThemeDark?: string;
  collections?: AppCollection[];
  font?: {
    family: string;
    category?: string;
  };
  fees?: {
    amount_percentage: number;
    recipient: string;
  }[];
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
  tokens?: AppToken[];


}