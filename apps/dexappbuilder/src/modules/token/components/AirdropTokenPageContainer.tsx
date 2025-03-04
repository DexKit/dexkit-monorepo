import ClaimAirdropERC20Section from '@dexkit/dexappbuilder-viewer/components/sections/ClaimAirdropERC20Section';
import { ContractMetadataHeader } from '@dexkit/ui/modules/contract-wizard/components/ContractMetadataHeader';
import { hexToString } from '@dexkit/ui/utils';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useQuery } from '@tanstack/react-query';
import {
    ThirdwebSDKProvider,
    useContract,
    useContractRead,
    useContractType,
} from '@thirdweb-dev/react';

import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { NextSeo } from 'next-seo';

import { FormattedMessage, useIntl } from 'react-intl';

import { getChainIdFromSlug } from '@dexkit/core/utils/blockchain';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { THIRDWEB_CLIENT_ID } from 'src/constants';

interface Props {
  address?: string;
  network?: string;
}

function AirdropTokenPageContainer({ address, network }: Props) {
  const { formatMessage } = useIntl();

  const { data: contract } = useContract(address as string);

  const contractAddressAirdropQuery = useContractRead(
    contract,
    'airdropTokenAddress',
  );

  const { data: tokenContract } = useContract(
    contractAddressAirdropQuery.data as string,
    'token',
  );

  const { data } = useContractType(contractAddressAirdropQuery.data as string);

  const tokenMetadataQuery = useQuery(['token_metadata'], async () => {
    return tokenContract?.erc20?.get();
  });

  const contractRead = useContractRead(tokenContract, 'contractType');

  let contractType = hexToString(contractRead.data);
  const renderContent = () => {
    return (
      <Stack spacing={2}>
        {contractType === 'TokenERC20' && (
          <ContractMetadataHeader
            address={contractAddressAirdropQuery.data as string}
            network={network as string}
            contractType={data}
            contractTypeV2={contractType}
            hidePublicPageUrl={true}
          />
        )}
        {address && network && (
          <ClaimAirdropERC20Section
            section={{
              type: 'claim-airdrop-token-erc-20',
              settings: { address, network },
            }}
          />
        )}
      </Stack>
    );
  };

  return (
    <>
      <NextSeo
        title={formatMessage(
          {
            id: 'airdrop.claim.token.seo.title.message',
            defaultMessage: 'Airdrop of {tokenSymbol} on {network}',
          },
          {
            network: (network as string)?.toUpperCase(),
            tokenSymbol:
              tokenMetadataQuery?.data?.symbol?.toUpperCase() || address,
          },
        )}
        description={formatMessage(
          {
            id: 'airdrop.token.seo.description.message',
            defaultMessage: 'Claim aidrop of {tokenSymbol} on {network}',
          },
          {
            network: (network as string)?.toUpperCase(),
            tokenSymbol:
              tokenMetadataQuery?.data?.symbol?.toUpperCase() || address,
          },
        )}
      />
      <Container maxWidth={'md'}>
        <PageHeader
          breadcrumbs={[
            {
              caption: <FormattedMessage id="home" defaultMessage="Home" />,
              uri: '/',
            },
            {
              caption: (
                <FormattedMessage
                  id="token.symbol.message"
                  defaultMessage="Airdrop Token {tokenSymbol}"
                  values={{
                    tokenSymbol:
                      tokenMetadataQuery?.data?.symbol?.toUpperCase() ||
                      address,
                  }}
                />
              ),
              uri: '/token',
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
        <AirdropTokenPageContainer {...props} />
      </ThirdwebSDKProvider>
    </>
  );
}
