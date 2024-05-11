import { NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import { isAddressEqual } from "@dexkit/core/utils";
import MarketTradeSection from "@dexkit/dexappbuilder-viewer/components/sections/MarketTradeSection";
import TokenErc20Section from "@dexkit/dexappbuilder-viewer/components/sections/TokenErc20Section";
import { OrderMarketType } from "@dexkit/exchange/constants";
import { useTokenList } from "@dexkit/ui/hooks";
import { hexToString } from "@dexkit/ui/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { isAddress } from "@ethersproject/address";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import {
  ThirdwebSDKProvider,
  useContract,
  useContractRead,
  useContractType,
} from "@thirdweb-dev/react";
import { NextSeo } from "next-seo";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ContractMetadataHeader } from "../../contract-wizard/components/ContractMetadataHeader";

import { getChainIdFromSlug } from "@dexkit/core/utils/blockchain";
import { PageHeader } from "../../../components/PageHeader";
import { THIRDWEB_CLIENT_ID } from "../../../constants/thirdweb";
import TokenInfo from "./TokenInfo";
interface Props {
  address?: string;
  network?: string;
  orderMarketType: OrderMarketType;
}

function TokenPageContainer({ address, network, orderMarketType }: Props) {
  const { formatMessage } = useIntl();
  const { data: contract } = useContract(address as string);
  const { data } = useContractType(address as string);
  const contractRead = useContractRead(contract, "contractType");
  const chainId = NETWORK_FROM_SLUG(network as string)?.chainId as number;
  const tokens = useTokenList({ chainId, includeNative: true });
  const tokenIsAddress = useMemo(() => {
    if (address && isAddress(address)) {
      return true;
    } else {
      return false;
    }
  }, [address]);

  const token = useMemo(() => {
    if (chainId && tokenIsAddress) {
      return tokens.find(
        (tk) => isAddressEqual(address, tk.address) && chainId === tk.chainId
      );
    }
    if (chainId && address) {
      return tokens.find(
        (tk) =>
          address.toLowerCase() === tk.symbol.toLowerCase() &&
          chainId === tk.chainId
      );
    }

    if (chainId && address) {
      return tokens.find(
        (tk) =>
          address.toLowerCase() === tk.name.toLowerCase() &&
          chainId === tk.chainId
      );
    }
  }, [chainId, address]);

  const tradeType = useMemo(() => {
    if (orderMarketType === OrderMarketType.buyAndSell) {
      return "trade";
    }
    if (orderMarketType === OrderMarketType.buy) {
      return "buy";
    }
    return "sell";
  }, [orderMarketType]);

  let contractType = hexToString(contractRead.data);
  const renderContent = () => {
    if (!contractType) {
      if (!token) {
        return (
          <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
            <BrowserNotSupportedIcon sx={{ fontSize: "100px" }} />
            <Typography>
              <FormattedMessage
                id={"token.not.supported"}
                defaultMessage={"Token not supported"}
              ></FormattedMessage>
            </Typography>
          </Stack>
        );
      }

      return (
        <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
          <TokenInfo
            address={token?.address as string}
            chainId={token?.chainId as number}
          />
          <MarketTradeSection
            section={{
              type: "market-trade",
              config: {
                show: orderMarketType,
                useGasless: true,
                baseTokenConfig: {
                  address: token?.address as string,
                  chainId: token?.chainId as number,
                },
              },
            }}
          />
        </Stack>
      );
    }

    if (contractType === "TokenERC20") {
      return (
        <Stack spacing={2}>
          <ContractMetadataHeader
            address={address as string}
            network={network as string}
            contractType={data}
            contractTypeV2={contractType}
            hidePublicPageUrl={true}
          />
          <MarketTradeSection
            section={{
              type: "market-trade",
              config: {
                show: orderMarketType,
                baseTokenConfig: {
                  address: address as string,
                  chainId: chainId,
                },
              },
            }}
          />
          <TokenErc20Section
            section={{
              type: "token",
              settings: {
                address: address as string,
                network: network as string,
              },
            }}
          />
        </Stack>
      );
    }
    return null;
  };

  return (
    <>
      <NextSeo
        title={formatMessage(
          {
            id: "trade.token.seo..title.message",
            defaultMessage:
              "The easiest way to {orderMarketType} {tokenSymbol} on {network}",
          },
          {
            orderMarketType: tradeType,
            network: (network as string)?.toUpperCase(),
            tokenSymbol: token?.symbol.toUpperCase() || address,
          }
        )}
        description={formatMessage(
          {
            id: "trade.token.seo.description.message",
            defaultMessage:
              "Discover the optimal way to {orderMarketType} {tokenSymbol} on the {network}. Our platform ensures swift and secure transactions, making {orderMarketType}ing {tokenSymbol} a breeze. Join now for the ultimate trading experience on the {network}!",
          },
          {
            orderMarketType: tradeType,
            network: (network as string)?.toUpperCase(),
            tokenSymbol: token?.symbol.toUpperCase() || address,
          }
        )}
      />
      <Container maxWidth={"md"}>
        <PageHeader
          breadcrumbs={[
            {
              caption: <FormattedMessage id="home" defaultMessage="Home" />,
              uri: "/",
            },
            {
              caption: (
                <FormattedMessage
                  id="token.symbol.message"
                  defaultMessage="Token {tokenSymbol}"
                  values={{
                    tokenSymbol: token?.symbol || address,
                  }}
                />
              ),
              uri: "/token",
              active: true,
            },
          ]}
        />

        {renderContent()}
      </Container>
    </>
  );
}

export default function Wrapper(props: Props) {
  const { provider } = useWeb3React();

  return (
    <>
      {/*  <NextSeo
        title={formatMessage({
          id: '{type} {tokenSymbol} ',
          defaultMessage:
            'The easiest way to {orderMarketType} {tokenSymbol} on {network}',
          values: {
            orderMarketType: props.orderMarketType,
            network: props.
            tokenSymbol: 
          }
        })}
      />*/}

      <ThirdwebSDKProvider
        clientId={THIRDWEB_CLIENT_ID}
        activeChain={getChainIdFromSlug(props.network as string)?.chainId}
        signer={provider?.getSigner()}
      >
        <TokenPageContainer {...props} />
      </ThirdwebSDKProvider>
    </>
  );
}
