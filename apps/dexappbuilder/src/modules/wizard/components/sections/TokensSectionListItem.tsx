import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Checkbox,
  Chip,
  FormControlLabel,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Token } from '../../../../types/blockchain';

import { TOKEN_ICON_URL } from '@dexkit/core/constants';
import { NETWORK_SLUG } from '@dexkit/core/constants/networks';
import { getChainName } from '@dexkit/core/utils/blockchain';
import Link from '@dexkit/ui/components/AppLink';
import TokenIcon from '@mui/icons-material/Token';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
  token: Token;
  appUrl?: string;
  selectable?: boolean;
  selected?: boolean;
  onClick: () => void;
  onMakeTradable?: () => void;
  onDisableFeatured?: () => void;
  disableMakeTradable?: boolean;
  disableFeatured?: boolean;
  divider?: boolean;
}

export default function TokensSectionListItem({
  token,
  selectable,
  selected,
  onClick,
  onMakeTradable,
  onDisableFeatured,
  disableFeatured,
  divider,
  appUrl,
  disableMakeTradable,
}: Props) {
  const { formatMessage } = useIntl();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ListItem divider>
      <ListItemAvatar>
        <Avatar
          src={
            token.logoURI
              ? token.logoURI
              : TOKEN_ICON_URL(token.address, token.chainId)
          }
          alt={formatMessage({ id: 'token', defaultMessage: 'Token' })}
        >
          <TokenIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography component="div" sx={{ fontWeigth: 600 }}>
            {token.name}{' '}
            <Typography
              component="span"
              variant="caption"
              color="textSecondary"
            >
              {token.symbol}
            </Typography>
          </Typography>
        }
        secondary={
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            spacing={1}
          >
            <Chip size="small" label={getChainName(token.chainId)} />

            {token.tradable && (
              <Tooltip
                title={
                  <FormattedMessage
                    id="this.token.is.available.on.the.marketplace"
                    defaultMessage="This token is available on the marketplace"
                  />
                }
              >
                <Chip
                  size="small"
                  label={
                    <FormattedMessage id="tradable" defaultMessage="Tradable" />
                  }
                />
              </Tooltip>
            )}
          </Stack>
        }
      />

      {(!(disableMakeTradable === true) ||
        selectable ||
        !(disableFeatured === true)) && (
        <ListItemSecondaryAction>
          {selectable ? (
            <Checkbox
              checked={Boolean(selected)}
              onChange={(e, checked) => onClick()}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          ) : (
            <>
              {disableFeatured === false && (
                <FormControlLabel
                  control={
                    <Tooltip
                      title={
                        <FormattedMessage
                          id="disable.feature.token.on.swap.search"
                          defaultMessage="Disable feature token on swap search"
                        />
                      }
                    >
                      <Switch
                        checked={Boolean(token.disableFeatured)}
                        onClick={onDisableFeatured}
                      />
                    </Tooltip>
                  }
                  label={
                    <FormattedMessage
                      id={'disable.featured'}
                      defaultMessage={'Disable featured'}
                    />
                  }
                />
              )}
              {disableMakeTradable === false && (
                <FormControlLabel
                  control={
                    <Tooltip
                      title={
                        <FormattedMessage
                          id="make.token.available.on.the.marketplace"
                          defaultMessage="Make token available on the marketplace"
                        />
                      }
                    >
                      <Switch
                        checked={Boolean(token.tradable)}
                        onClick={onMakeTradable}
                      />
                    </Tooltip>
                  }
                  label={
                    <FormattedMessage
                      id={'Marketplace'}
                      defaultMessage={'Marketplace'}
                    />
                  }
                />
              )}
            </>
          )}
          {appUrl && (
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              key={1}
              onClick={handleClose}
              component={Link}
              href={`${appUrl}/token/buy/${NETWORK_SLUG(token.chainId)}/${
                token.symbol
              }`}
              target="_blank"
            >
              <FormattedMessage
                id={'buy.token.alt'}
                defaultMessage={'Buy token'}
              />
            </MenuItem>
            <MenuItem
              key={2}
              onClick={handleClose}
              component={Link}
              href={`${appUrl}/token/sell/${NETWORK_SLUG(token.chainId)}/${
                token.symbol
              }`}
              target="_blank"
            >
              <FormattedMessage
                id={'sell.token'}
                defaultMessage={'Sell token'}
              />
            </MenuItem>
            <MenuItem
              key={3}
              onClick={handleClose}
              component={Link}
              href={`${appUrl}/token/${NETWORK_SLUG(token.chainId)}/${
                token.symbol
              }`}
              target="_blank"
            >
              <FormattedMessage
                id={'trade.token.page'}
                defaultMessage={'Trade token page'}
              />
            </MenuItem>
          </Menu>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}
