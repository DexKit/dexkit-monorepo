import Grid from '@mui/material/Grid';
import {
  useContract,
  useContractMetadata,
  useContractRead,
  useContractType,
} from '@thirdweb-dev/react';
const ContractEditionDropContainer = dynamic(
  () => import('./ContractEditionDropContainer'),
);
const ContractNftContainer = dynamic(() => import('./ContractNftContainer'));
const ContractStakeErc20Container = dynamic(
  () => import('./ContractStakeErc20Container'),
);
const ContractTokenDropContainer = dynamic(
  () => import('./ContractTokenDropContainer'),
);

const ContractTokenAllowanceDropContainer = dynamic(
  () => import('./ContractTokenAllowanceDropContainer'),
);

import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { useSwitchNetworkMutation } from '@dexkit/ui';
import { ContractMetadataHeader } from '@dexkit/ui/modules/contract-wizard/components/ContractMetadataHeader';
import { hexToString } from '@dexkit/ui/utils';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Alert, Button, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import { FormattedMessage } from 'react-intl';
const ContractAirdropErc1155Container = dynamic(
  () => import('./ContractAirdropErc1155Container'),
);
const ContractAirdropErc20Container = dynamic(
  () => import('./ContractAirdropErc20Container'),
);
const ContractAirdropErc721Container = dynamic(
  () => import('./ContractAirdropErc721Container'),
);
const ContractEditionContainer = dynamic(
  () => import('./ContractEditionContainer'),
);
const ContractNftDropContainer = dynamic(
  () => import('./ContractNftDropContainer'),
);
const ContractStakeErc1155Container = dynamic(
  () => import('./ContractStakeErc1155Container'),
);
const ContractStakeErc721Container = dynamic(
  () => import('./ContractStakeErc721Container'),
);
const ContractTokenContainer = dynamic(
  () => import('./ContractTokenContainer'),
);

const ContractClaimableAirdropErc20Container = dynamic(
  () => import('./ContractClaimableAirdropErc20Container'),
);

interface Props {
  address: string;
  network: string;
}

export function ContractContainer({ address, network }: Props) {
  const { data } = useContractType(address);

  const { data: contract } = useContract(address);

  const contractRead = useContractRead(contract, 'contractType');
  const { data: contractMetadata } = useContractMetadata(contract);

  let contractType = hexToString(contractRead.data);

  const renderContract = () => {
    if (contractType === 'DropERC1155') {
      return (
        <ContractEditionDropContainer address={address} network={network} />
      );
    } else if (contractType === 'DropERC20') {
      return <ContractTokenDropContainer address={address} network={network} />;
    } else if (contractType === 'DropAllowanceERC20') {
      return (
        <ContractTokenAllowanceDropContainer
          address={address}
          network={network}
        />
      );
    } else if (contractType === 'TokenERC1155') {
      return <ContractEditionContainer address={address} network={network} />;
    } else if (contractType === 'DropERC721') {
      return <ContractNftDropContainer address={address} network={network} />;
    } else if (contractType === 'TokenERC721') {
      return <ContractNftContainer address={address} network={network} />;
    } else if (contractType === 'TokenStake') {
      return (
        <ContractStakeErc20Container address={address} network={network} />
      );
    } else if (contractType === 'NFTStake') {
      return (
        <ContractStakeErc721Container address={address} network={network} />
      );
    } else if (contractType === 'EditionStake') {
      return (
        <ContractStakeErc1155Container address={address} network={network} />
      );
    } else if (contractType === 'AirdropERC20') {
      return (
        <ContractAirdropErc20Container address={address} network={network} />
      );
    } else if (contractType === 'AirdropERC721') {
      return (
        <ContractAirdropErc721Container address={address} network={network} />
      );
    } else if (contractType === 'AirdropERC1155') {
      return (
        <ContractAirdropErc1155Container address={address} network={network} />
      );
    } else if (contractType === 'TokenERC20') {
      return <ContractTokenContainer address={address} network={network} />;
    } else if (contractMetadata?.name === 'AirdropERC20Claimable') {
      return (
        <ContractClaimableAirdropErc20Container
          address={address}
          network={network}
        />
      );
    }
  };

  const { chainId: providerChainId } = useWeb3React();
  const switchNetwork = useSwitchNetworkMutation();

  const chainId = NETWORK_FROM_SLUG(network)?.chainId;

  const handleSwitchNetwork = async () => {
    if (chainId && providerChainId !== chainId) {
      await switchNetwork.mutateAsync({ chainId });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ContractMetadataHeader
          address={address}
          network={network}
          contractType={data}
          contractTypeV2={contractType}
        />
      </Grid>
      {chainId !== undefined && providerChainId !== chainId ? (
        <Grid item xs={12}>
          <Alert
            severity="warning"
            action={
              <Button
                onClick={handleSwitchNetwork}
                color="inherit"
                variant="outlined"
                size="small"
                disabled={switchNetwork.isLoading}
                startIcon={
                  switchNetwork.isLoading ? (
                    <CircularProgress color="inherit" size="1rem" />
                  ) : undefined
                }
              >
                <FormattedMessage
                  id="switch.network"
                  defaultMessage="Switch network"
                />
              </Button>
            }
          >
            <FormattedMessage
              id="you.are.on.a.network.different.of.the.contract"
              defaultMessage="You are on a network different of the contract"
            />
          </Alert>
        </Grid>
      ) : (
        <Grid item xs={12}>
          {renderContract()}
        </Grid>
      )}
    </Grid>
  );
}
