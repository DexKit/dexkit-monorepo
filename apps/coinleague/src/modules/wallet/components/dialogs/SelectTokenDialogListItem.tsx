import { ChainId } from '@/modules/common/constants/enums';
import { TokenBalance } from '@/modules/common/types/transactions';
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@mui/material';
import { ethers } from 'ethers';
import { TOKEN_ICON_URL } from '../../utils/token';

interface Props {
  chainId: ChainId;
  tokenBalance: TokenBalance;
  onSelect: (tokenBalance: TokenBalance) => void;
}

function SelectTokenDialogListItem({ tokenBalance, onSelect, chainId }: Props) {
  return (
    <ListItemButton onClick={() => onSelect(tokenBalance)}>
      <ListItemAvatar>
        {tokenBalance.token.logoURI ? (
          <Avatar src={tokenBalance.token.logoURI} />
        ) : (
          <Avatar
            src={
              tokenBalance.token.logoURI
                ? tokenBalance.token.logoURI
                : TOKEN_ICON_URL(tokenBalance.token.address, chainId as ChainId)
            }
          />
        )}
      </ListItemAvatar>
      <ListItemText
        primary={tokenBalance.token.symbol.toUpperCase()}
        secondary={tokenBalance.token.name}
      />
      <ListItemSecondaryAction>
        <Typography>
          {ethers.utils.formatUnits(
            tokenBalance.balance,
            tokenBalance.token.decimals
          )}{' '}
          {tokenBalance.token.symbol.toUpperCase()}
        </Typography>
      </ListItemSecondaryAction>
    </ListItemButton>
  );
}

export default SelectTokenDialogListItem;
