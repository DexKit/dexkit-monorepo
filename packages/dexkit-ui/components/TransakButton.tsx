import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import Button from "@mui/material/Button";
import { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { useAppConfig } from "../hooks";
import { useCurrency } from "../hooks/currency";
//import "./Transak";

interface Props {
  label?: string;
}

export function InitTransak({ currency, account }: { currency?: string, account?: string }) {
  let transak;

  import("@transak/transak-sdk").then((transakSDK) => {
    transak = new transakSDK.Transak({
      apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || " ", // Your API Key
      //@ts-ignore
      environment:
        process.env.NODE_ENV === "production"
          ? transakSDK.Transak.ENVIRONMENTS.PRODUCTION
          : transakSDK.Transak.ENVIRONMENTS.PRODUCTION, // STAGING/PRODUCTION
      widgetHeight:
        window.innerHeight > 840
          ? "770px"
          : `${window.innerHeight - 70}px`,
      widgetWidth:
        window.innerWidth > 500 ? "500px" : `${window.innerWidth - 10}px`,
      walletAddress: account, // Your customer's wallet address
      fiatCurrency: currency ? currency.toUpperCase() : undefined, // If you want to limit fiat selection eg 'USD'
    });
  });

  return transak;
}



export function TransakButton({ label }: Props) {
  const { account, isActive } = useWeb3React();
  const appConfig = useAppConfig();
  const currency = useCurrency();
  const transak = useRef<any>(null);

  useEffect(() => {
    if (appConfig.transak?.enabled) {
      if (account !== undefined) {
        transak.current = InitTransak({ currency: currency.currency, account })
      }
    }
  }, [account, currency]);

  const handleBuy = () => {
    transak.current?.init();
  };

  return (
    <Button
      onClick={handleBuy}
      disabled={!isActive}
      variant="contained"
      color="primary"
    >
      <FormattedMessage id="buy" defaultMessage={label || "Buy"} />
    </Button>
  );
}
