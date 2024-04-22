import { ComponentMeta, ComponentStory } from "@storybook/react";

import { getConnectorName } from "@dexkit/core/utils";
import { useOrderedConnectors } from "@dexkit/ui/hooks";
import { Web3ReactProvider, useWeb3React } from "@dexkit/ui/hooks/thirdweb";
import { Button } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { atom } from "jotai";
import { useEffect, useMemo } from "react";
import { IntlProvider } from "react-intl";
import ReviewOrderDialog from "../components/TradeWidget/ReviewOrderDialog";

export default {
  title: "Components/ReviewOrderDialog",
  component: ReviewOrderDialog,
  argTypes: {},
} as ComponentMeta<typeof ReviewOrderDialog>;

const theme = createTheme({
  typography: {
    fontFamily: '"Sora", sans-serif',
  },
  palette: {
    mode: "dark",
    background: {
      default: "#151B22",
      paper: "#0D1017",
    },
    primary: {
      main: "#F9AB74",
    },
  },
});

const selectedWalletAtom = atom<string>("");
const client = new QueryClient();

const ConnectorActivator = () => {
  const { connector } = useWeb3React();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      connector &&
      connector.connectEagerly
    ) {
      setTimeout(() => {
        connector.connectEagerly!();
      }, 1000);
    }
  }, [connector]);

  return <Button onClick={() => connector.connectEagerly!()}>Connect</Button>;
};

const Template: ComponentStory<typeof ReviewOrderDialog> = (args) => {
  const connectors = useOrderedConnectors({ selectedWalletAtom });

  const web3ReactKey = useMemo(
    () =>
      connectors.map((connector) => getConnectorName(connector[0])).join("-"),
    [connectors]
  );

  return (
    <IntlProvider defaultLocale="en-US" locale="en-US">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@100;200;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <ThemeProvider theme={theme}>
        <Web3ReactProvider key={web3ReactKey} connectors={connectors}>
          <QueryClientProvider client={client}>
            <ConnectorActivator />
            <ReviewOrderDialog
              DialogProps={{
                open: true,
                fullWidth: true,
                maxWidth: "sm",
                onClose: () => {},
              }}
              makerAmount={BigNumber.from("100000")}
            />
          </QueryClientProvider>
        </Web3ReactProvider>
      </ThemeProvider>
    </IntlProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
