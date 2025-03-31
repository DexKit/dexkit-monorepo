import { truncateAddress } from '@/modules/common/utils';
import { MoreVert } from '@mui/icons-material';
import {
  Box,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Tooltip,
} from '@mui/material';
import Image from 'next/image';
import { memo, MouseEvent } from 'react';
import { Account } from '../types';

import googleImg from 'public/icons/google-logo.svg';
import magicImg from 'public/icons/magic.svg';
import metaMaskFoxImg from 'public/icons/metamask-fox.svg';
import twitterImg from 'public/icons/twitter-logo.svg';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { FormattedMessage } from 'react-intl';
import { WalletConnectType } from '../constants/enums';

interface Props {
  account: Account;
  isActive?: boolean;
  onMenu?: (account: Account, anchorEl: HTMLElement) => void;
  divider?: boolean;
}

function WalletAccountsListItem({ account, onMenu, isActive, divider }: Props) {
  const handleMenu = (e: MouseEvent<HTMLButtonElement>) => {
    if (onMenu) {
      onMenu(account, e.currentTarget);
    }
  };

  const renderConnectorIcon = () => {
    if (account?.connector === WalletConnectType.MetaMask) {
      return (
        <Box sx={{ position: 'relative', height: 14, width: 14, mr: 1 }}>
          <Image
            alt="MetaMask"
            src={metaMaskFoxImg.src}
            style={{ width: '1rem', height: '1rem' }}
            width={14}
            height={14}
          />
        </Box>
      );
    } else if (account?.connector === WalletConnectType.Magic) {
      return (
        <Box sx={{ position: 'relative', height: 14, width: 14, mr: 1 }}>
          <Image
            alt="Magic"
            src={
              account.loginType === 'google'
                ? googleImg.src
                : account.loginType === 'twitter'
                ? twitterImg.src
                : magicImg.src
            }
            style={{ width: '1rem', height: '1rem' }}
            width={14}
            height={14}
          />
        </Box>
      );
    }
  };

  return (
    <ListItem divider>
      <Stack sx={{ alignItems: 'center', alignContent: 'center', mr: 2 }}>
        <Tooltip
          title={
            isActive ? (
              <FormattedMessage id="connected" defaultMessage="Connected" />
            ) : undefined
          }
        >
          <FiberManualRecordIcon
            fontSize="large"
            sx={
              isActive
                ? (theme) => ({
                    color: theme.palette.success.main,
                  })
                : (theme) => ({
                    color: theme.palette.action.hover,
                  })
            }
          />
        </Tooltip>
      </Stack>
      <ListItemText
        primary={account.name || truncateAddress(account.address)}
        secondaryTypographyProps={{ component: 'div' }}
        secondary={
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            spacing={1}
          >
            {renderConnectorIcon()} {truncateAddress(account.address)}
          </Stack>
        }
      />
      <ListItemSecondaryAction>
        <IconButton onClick={handleMenu}>
          <MoreVert />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default memo(WalletAccountsListItem);
