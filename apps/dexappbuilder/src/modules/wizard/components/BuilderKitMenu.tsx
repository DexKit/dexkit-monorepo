import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';
import { BuilderKit } from '../constants';

interface Props {
  menu: BuilderKit;
  onChangeMenu: (newMenu: BuilderKit) => void;
}

export default function BuilderKitMenu(props: Props) {
  const { menu, onChangeMenu } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={'kit-builder-menu'}>
      <Tooltip
        title={
          <FormattedMessage
            id={'builder.kits.description'}
            defaultMessage={
              'Select a kit to preview features for building your app.'
            }
          />
        }
        placement="right"
      >
        <Button
          id="builderkit-menu"
          variant={'contained'}
          aria-controls={open ? 'builderkit-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          endIcon={<ExpandMoreIcon />}
          size="small"
          onClick={handleClick}
        >
          <FormattedMessage id={menu.toLowerCase()} defaultMessage={menu} />
        </Button>
      </Tooltip>
      <Menu
        id="builderkit-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'builderkit-menu',
        }}
      >
        {Object.values(BuilderKit).map((m, k) => (
          <MenuItem
            onClick={() => {
              onChangeMenu(m);
              handleClose();
            }}
            key={k}
          >
            <FormattedMessage id={m.toLowerCase()} defaultMessage={m} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
