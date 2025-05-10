import { ListItemText, Menu, MenuItem } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { PreviewType } from '../types';

export interface ThemePreviewMenuProps {
  open: boolean;
  onChange: (type: PreviewType) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export default function ThemePreviewMenu({
  open,
  onChange,
  onClose,
  anchorEl,
}: ThemePreviewMenuProps) {
  const handleClick = (type: PreviewType) => {
    return () => {
      onChange(type);
      onClose();
    };
  };

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={handleClick(PreviewType.NFTs)}>
        <ListItemText
          primary={<FormattedMessage id="nfts" defaultMessage="NFTs" />}
        />
      </MenuItem>
      <MenuItem onClick={handleClick(PreviewType.Swap)}>
        <ListItemText
          primary={<FormattedMessage id="swap" defaultMessage="Swap" />}
        />
      </MenuItem>
      {/* <MenuItem onClick={handleClick(PreviewType.Exchange)}>
        <ListItemText
          primary={<FormattedMessage id="exchange" defaultMessage="Exchange" />}
        />
      </MenuItem> */}
    </Menu>
  );
}
