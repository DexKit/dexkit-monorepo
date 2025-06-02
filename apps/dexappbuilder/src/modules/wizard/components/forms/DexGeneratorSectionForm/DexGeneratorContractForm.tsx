import { DeployedContract } from '@/modules/forms/types';

import ArrowBack from '@mui/icons-material/ArrowBack';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import DexGeneratorEditionDropForm from './DexGeneratorEditionDropForm';
import DexGeneratorNFTDropForm from './DexGeneratorNFTDropForm';
import DexGeneratorTokenDropForm from './DexGeneratorTokenDropForm';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Link from '@dexkit/ui/components/AppLink';
import {
  DexGeneratorPageSection,
  DexGeneratorPageSectionType,
} from '@dexkit/ui/modules/wizard/types/section';
import DexGeneratorTokenErc20Form from './DexGeneratorTokenErc20Form';
import DexGeneratorTokenErc721Form from './DexGeneratorTokenErc721Form';

export interface DexGeneratorContractFormProps {
  onChange: (section: DexGeneratorPageSection) => void;
  onCancel: () => void;
  params: {
    network: string;
    address: string;
    contractType: string;
    name: string;
  };
  section?: DexGeneratorPageSectionType;
  contract: DeployedContract;
}

export default function DexGeneratorContractForm({
  onChange,
  onCancel,
  params,
  section,
  contract,
}: DexGeneratorContractFormProps) {
  const { network, address, contractType, name } = params;

  const handleChange = (section: DexGeneratorPageSectionType) => {
    onChange({ type: 'dex-generator-section', contract, section });
  };

  const renderForm = () => {
    if (contractType === 'DropERC20') {
      return (
        <DexGeneratorTokenDropForm
          key={`${network}-${address}-${contractType}-${name}`}
          onChange={handleChange}
          params={{ network, address }}
          section={section?.type === 'token-drop' ? section : undefined}
        />
      );
    } else if (contractType === 'DropERC721') {
      return (
        <DexGeneratorNFTDropForm
          key={`${network}-${address}-${contractType}-${name}`}
          onChange={handleChange}
          params={{ network, address }}
          section={section?.type === 'nft-drop' ? section : undefined}
        />
      );
    } else if (contractType === 'DropERC1155') {
      return (
        <DexGeneratorEditionDropForm
          key={`${network}-${address}-${contractType}-${name}`}
          onChange={handleChange}
          params={{ network, address }}
          section={
            section?.type === 'edition-drop-section' ? section : undefined
          }
        />
      );
    } else if (contractType === 'TokenERC20') {
      return (
        <DexGeneratorTokenErc20Form
          key={`${network}-${address}-${contractType}-${name}`}
          onChange={handleChange}
          params={{ network, address }}
          section={section?.type === 'token' ? section : undefined}
        />
      );
    } else if (
      contractType === 'TokenERC721' ||
      contractType === 'TokenERC1155'
    ) {
      return (
        <DexGeneratorTokenErc721Form
          key={`${network}-${address}-${contractType}-${name}`}
          onChange={handleChange}
          params={{ network, address }}
          section={section?.type === 'collection' ? section : undefined}
        />
      );
    } else if (
      contractType === 'TokenStake' ||
      contractType === 'NFTStake' ||
      contractType === 'EditionStake'
    ) {
      return (
        <Stack>
          <Typography align="center" variant="h5">
            <FormattedMessage
              id="stake.contract"
              defaultMessage="Stake Contract"
            />
          </Typography>
          <Typography align="center" variant="body1" color="text.secondary">
            <FormattedMessage
              id="you.are.using.a.stake.contract"
              defaultMessage="You are using a stake contract"
            />
          </Typography>
        </Stack>
      );
    } else if (contractType === 'AirdropERC20Claimable') {
      return (
        <Stack>
          <Typography align="center" variant="h5">
            <FormattedMessage
              id="airdrop.claimable.contract"
              defaultMessage="Airdrop Claimable Contract"
            />
          </Typography>
          <Typography align="center" variant="body1" color="text.secondary">
            <FormattedMessage
              id="you.are.using.a.airdrop.claimable.contract"
              defaultMessage="You are using a airdrop claimable contract"
            />
          </Typography>
        </Stack>
      );
    } else {
      return (
        <Stack>
          <Typography align="center" variant="h5">
            <FormattedMessage
              id="contract.not.supported"
              defaultMessage="Contract not supported"
            />
          </Typography>
          <Typography align="center" variant="body1" color="text.secondary">
            <FormattedMessage
              id="contract.is.not.supported.yet"
              defaultMessage="Contract not supported yet"
            />
          </Typography>
        </Stack>
      );
    }
  };

  return (
    <Box>
      <Stack sx={{ p: 2 }} spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack spacing={1} direction="row" alignItems="center">
            <IconButton size="small" onClick={onCancel}>
              <ArrowBack />
            </IconButton>
            <Typography variant="subtitle1" fontWeight="bold">
              <FormattedMessage
                id="edit.name"
                defaultMessage='Edit "{name}"'
                values={{ name }}
              />
            </Typography>
          </Stack>

          <Stack alignItems="center" direction="row">
            <Link target="_blank" href={`/contract/${network}/${address}`}>
              <FormattedMessage id="admin" defaultMessage="Admin" />{' '}
            </Link>
            <OpenInNewIcon fontSize="inherit" color="primary" />
          </Stack>
        </Stack>
        <Divider />
        <Box>{renderForm()}</Box>
      </Stack>
    </Box>
  );
}
