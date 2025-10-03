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
import { Box, Container, Stack, Typography } from "@mui/material";
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
  
  const isValidAddress = address && isAddress(address);
  const { data: contract } = useContract(isValidAddress ? address as string : undefined);
  const { data } = useContractType(isValidAddress ? address as string : undefined);
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

  const getBreadcrumbURI = useMemo(() => {
    if (network && token) {
      if (orderMarketType === OrderMarketType.buyAndSell) {
        return `/token/${network}/${token?.symbol}`;
      }
      if (orderMarketType === OrderMarketType.buy) {
        return `/token/buy/${network}/${token?.symbol}`;
      }
      return `/token/sell/${network}/${token?.symbol}`;
    }
  }, [orderMarketType, network, token]);

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
        <Stack spacing={4} justifyContent={"center"} alignItems={"center"}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: '100%'
          }}>
            <TokenInfo
              address={token?.address as string}
              chainId={token?.chainId as number}
            />
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: '100%'
          }}>
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
          </Box>
        </Stack>
      );
    }

    if (contractType === "TokenERC20") {
      return (
        <Stack spacing={4} justifyContent={"center"} alignItems={"center"}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: '100%'
          }}>
            <ContractMetadataHeader
              address={address as string}
              network={network as string}
              contractType={data}
              contractTypeV2={contractType}
              hidePublicPageUrl={true}
            />
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: '100%'
          }}>
            <MarketTradeSection
              section={{
                type: "market-trade",
                config: {
                  show: orderMarketType,
                  useGasless: true,
                  baseTokenConfig: {
                    address: address as string,
                    chainId: chainId,
                  },
                },
              }}
            />
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: '100%'
          }}>
            <TokenErc20Section
              section={{
                type: "token",
                settings: {
                  address: address as string,
                  network: network as string,
                },
              }}
            />
          </Box>
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
      <Container maxWidth={"lg"}>
        <PageHeader
          breadcrumbs={[
            {
              caption: <FormattedMessage id="home" defaultMessage="Home" />,
              uri: "/",
            },
            {
              caption: (
                <FormattedMessage
                  id="trade.typetoken.symbol.message.network"
                  defaultMessage="{tradeType} {tokenSymbol} on {network}"
                  values={{
                    tokenSymbol: token?.symbol || address,
                    network: `${network
                      ?.charAt(0)
                      .toUpperCase()}${network?.slice(1)}`,
                    tradeType:
                      tradeType.charAt(0).toUpperCase() + tradeType.slice(1),
                  }}
                />
              ),
              uri: getBreadcrumbURI || "/",
              active: true,
            },
          ]}
        />

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          minHeight: '80vh',
          padding: '60px 0',
          width: '100%'
        }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px'
          }}>
            {renderContent()}
          </div>
        </div>
      </Container>
    </>
  );
}

export default function Wrapper(props: Props) {
  const { signer } = useWeb3React();

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
        signer={signer}
      >
        <TokenPageContainer {...props} />
      </ThirdwebSDKProvider>
    </>
  );
}
