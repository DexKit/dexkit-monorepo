import {
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';

import { ChainId, TOKEN_ICON_URL } from '@dexkit/core/constants';

import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { Token, TokenBalance } from '../../../types/blockchain';

interface Props {
  chainId: ChainId;
  tokenBalance: TokenBalance;
  onSelect: (token: Token) => void;
}

function SelectTokenDialogListItem({ tokenBalance, onSelect, chainId }: Props) {
  return (
    <ListItem button onClick={() => onSelect(tokenBalance.token)}>
      <ListItemIcon>
        {tokenBalance.token.logoURI ? (
          <Avatar
            sx={(theme) => ({
              width: 'auto',
              height: theme.spacing(4),
            })}
            src={tokenBalance.token.logoURI}
          />
        ) : (
          <Avatar
            sx={(theme) => ({
              width: theme.spacing(4),
              height: theme.spacing(4),
            })}
            src={
              tokenBalance.token.logoURI
                ? tokenBalance.token.logoURI
                : TOKEN_ICON_URL(tokenBalance.token.address, chainId as ChainId)
            }
          />
        )}
      </ListItemIcon>
      <ListItemText
        primary={tokenBalance.token.symbol}
        secondary={tokenBalance.token.name}
      />
      <ListItemSecondaryAction>
        <Typography>
          {formatUnits(tokenBalance.balance, tokenBalance.token.decimals)}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default SelectTokenDialogListItem;
