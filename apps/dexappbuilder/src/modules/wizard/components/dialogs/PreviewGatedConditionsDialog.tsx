import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Stack,
} from '@mui/material';

import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCheckGatedConditions } from '../../hooks';

import { AppDialogTitle } from '@dexkit/ui';
import { GatedPageLayout } from '@dexkit/ui/modules/wizard/types';
import { GatedCondition } from '@dexkit/ui/modules/wizard/types/config';
import { GatedConditionView } from '../gated-content/GatedConditionView';

interface Props {
  dialogProps: DialogProps;
  conditions?: GatedCondition[];
  gatedPageLayout?: GatedPageLayout;
}

const options = [
  'Wallet connected',
  'No wallet',
  'Wallet connected but without login',
];

export default function PreviewGatedConditionsDialog({
  dialogProps,
  conditions,
  gatedPageLayout,
}: Props) {
  const { onClose } = dialogProps;
  const { account } = useWeb3React();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const conditionResult = useCheckGatedConditions({
    account: selectedIndex === 0 ? account : undefined,
    conditions,
  });

  const handleMenuItemClick = (event: any, index: any) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [previewPlatform, setPreviewPlatform] = useState<any>('desktop');

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const pagePreview = (
    <GatedConditionView
      layout={gatedPageLayout}
      conditions={conditions}
      {...conditionResult.data}
      account={selectedIndex === 1 ? undefined : account}
      isLoggedIn={selectedIndex === 1 || selectedIndex === 2 ? false : true}
      isEdit
    />
  );

  return (
    <Dialog {...dialogProps} sx={{ p: 0, m: 0 }}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="gated.conditions"
            defaultMessage="Gated Condition preview"
          />
        }
        onClose={handleClose}
      />
      <DialogContent dividers>
        <Stack
          alignItems="center"
          direction="column"
          justifyContent="center"
          alignContent="center"
          spacing={2}
        >
          {false && (
            <div>
              <Button
                id="lock-menu"
                variant="contained"
                aria-controls={open ? 'lock-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={
                  open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
                }
              >
                {options[selectedIndex]}
              </Button>
              <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                MenuListProps={{
                  'aria-labelledby': 'lock-button',
                  role: 'listbox',
                }}
              >
                {options.map((option: any, index: number) => (
                  <MenuItem
                    key={option}
                    selected={index === selectedIndex}
                    onClick={(event) => handleMenuItemClick(event, index)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )}
        </Stack>
        <Box sx={{ p: 2 }}>{previewPlatform === 'desktop' && pagePreview}</Box>
      </DialogContent>
    </Dialog>
  );
}
