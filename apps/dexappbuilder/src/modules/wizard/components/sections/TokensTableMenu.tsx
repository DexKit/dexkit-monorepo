import { NETWORK_SLUG } from '@dexkit/core/constants/networks';
import { TokenWhitelabelApp } from '@dexkit/core/types';
import {
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';

export interface TokensTableMenuProps {
  anchorEl: HTMLElement | null;
  token?: TokenWhitelabelApp;
  onClose: () => void;
  appUrl?: string;
  isMobile?: boolean;
}

export default function TokensTableMenu({
  anchorEl,
  onClose,
  token,
  appUrl,
  isMobile,
}: TokensTableMenuProps) {
  return (
    <Menu
      id="long-menu"
      MenuListProps={{
        'aria-labelledby': 'long-button',
        sx: { p: 0 },
      }}
      slotProps={{ paper: { variant: 'elevation' } }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <ListItem>
        <ListItemText
          primary={
            <FormattedMessage
              id="token.pages.alt"
              defaultMessage="Token pages"
            />
          }
          primaryTypographyProps={{
            variant: isMobile ? 'body2' : 'body1',
            fontWeight: 'bold',
            fontSize: isMobile ? '0.875rem' : undefined
          }}
        />
      </ListItem>
      <Divider />
      <MenuItem
        key={1}
        onClick={onClose}
        component={Link}
        href={`${appUrl}/token/buy/${NETWORK_SLUG(
          token?.chainId,
        )}/${token?.symbol}`}
        target="_blank"
        dense={isMobile}
      >
        <ListItemIcon>
          <FileOpenOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage id="buy.token" defaultMessage="Buy token" />
          }
          primaryTypographyProps={{
            fontSize: isMobile ? '0.875rem' : undefined
          }}
        />
      </MenuItem>
      <MenuItem
        key={2}
        onClick={onClose}
        component={Link}
        href={`${appUrl}/token/sell/${NETWORK_SLUG(
          token?.chainId,
        )}/${token?.symbol}`}
        target="_blank"
        dense={isMobile}
      >
        <ListItemIcon>
          <FileOpenOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage id="sell.token" defaultMessage="Sell token" />
          }
          primaryTypographyProps={{
            fontSize: isMobile ? '0.875rem' : undefined
          }}
        />
      </MenuItem>
      <MenuItem
        key={3}
        onClick={onClose}
        component={Link}
        href={`${appUrl}/token/${NETWORK_SLUG(
          token?.chainId,
        )}/${token?.symbol}`}
        target="_blank"
        dense={isMobile}
      >
        <ListItemIcon>
          <FileOpenOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage id="trade.token" defaultMessage="Trade token" />
          }
          primaryTypographyProps={{
            fontSize: isMobile ? '0.875rem' : undefined
          }}
        />
      </MenuItem>
    </Menu>
  );
}
