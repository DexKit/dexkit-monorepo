import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import { Transak, TransakConfig } from "@transak/transak-sdk";
import { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { useAppConfig, useCurrency } from "../../hooks";

interface Props {
  //@ts-ignore
  transakOverride?: TransakConfig;
  buttonProps?: { color?: any; variant?: any; fullWidth?: boolean };
}

const TransakNetworks: { [key: number]: string } = {
  [1]: "ETHEREUM",
  [10]: "OPTIMISM",
  [56]: "BSC",
  [137]: "POLYGON",
  [250]: "FANTOM",
  [42161]: "ARBITRUM",
  [43114]: "AVAXCHAIN",
};

export default function TransakWidget({ transakOverride, buttonProps }: Props) {
  const appConfig = useAppConfig();
  const currency = useCurrency();
  const transak = useRef<any>(null);
  const { account, chainId } = useWeb3React();
  const theme = useTheme();

  useEffect(() => {
    if (appConfig.transak?.enabled) {
      if (account !== undefined) {
        transak.current = new Transak({
          apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY as string, // Your API Key
          environment:
            process.env.NODE_ENV === "production"
              ? Transak.ENVIRONMENTS.PRODUCTION
              : Transak.ENVIRONMENTS.PRODUCTION,

          widgetHeight:
            window.innerHeight > 840 ? "770px" : `${window.innerHeight - 70}px`,
          widgetWidth:
            window.innerWidth > 500 ? "500px" : `${window.innerWidth - 10}px`,
          walletAddress: account, // Your customer's wallet address
          defaultFiatCurrency: currency.currency.toUpperCase(),
          themeColor: theme.palette.primary.main,
          defaultNetwork: chainId ? TransakNetworks[chainId] : undefined,
          ...transakOverride,
        });
      }
    }
  }, [account, currency.currency]);

  const handleBuy = () => {
    transak.current?.init();
  };

  return (
    <>
      {appConfig.transak?.enabled && (
        <Button
          onClick={handleBuy}
          variant="contained"
          color="primary"
          startIcon={<CreditCardIcon />}
          {...buttonProps}
        >
          <FormattedMessage id="buy" defaultMessage="Buy" />
        </Button>
      )}
    </>
  );
}
