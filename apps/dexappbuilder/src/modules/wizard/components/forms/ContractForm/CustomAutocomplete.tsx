import Search from '@mui/icons-material/Search';
import {
  Box,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

export interface Props {
  options: { label: string; value: string }[];
  isLoading: boolean;
  onChange: (address: string) => void;
  onChangeQuery: (address: string) => void;
  children: (
    handleFocus: () => void,
    handleBlur: () => void,
  ) => React.ReactNode;
}

export default function CustomAutocomplete({
  options,
  onChange,
  onChangeQuery,
  children,
  isLoading,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleFocus = () => {
    setOpen(true);
  };

  const handleBlur = () => {};

  const { formatMessage } = useIntl();

  const handleClickAway = () => {
    setOpen(false);
  };

  const renderContent = () => {
    if (options.length === 0) {
      return (
        <Stack justifyContent="center" alignItems="center" sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            <FormattedMessage id="no.results" defaultMessage="No results" />
          </Typography>
        </Stack>
      );
    }

    return isLoading ? (
      <List>
        <ListItem>
          <ListItemText primary={<Skeleton />} />
        </ListItem>
        <ListItem>
          <ListItemText primary={<Skeleton />} />
        </ListItem>
        <ListItem>
          <ListItemText primary={<Skeleton />} />
        </ListItem>
        <ListItem>
          <ListItemText primary={<Skeleton />} />
        </ListItem>
      </List>
    ) : (
      <List disablePadding>
        {options.map((opt, key) => (
          <ListItemButton key={key} onClick={() => onChange(opt.value)}>
            <ListItemText primary={opt.label} />
          </ListItemButton>
        ))}
      </List>
    );
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        <Box>{children(handleFocus, handleBlur)}</Box>
        <Paper
          square
          sx={{
            display: open ? 'block' : 'none',
            position: 'absolute',
            zIndex: (theme) => theme.zIndex.tooltip,
            width: '100%',
          }}
        >
          <Stack>
            <Box sx={{ p: 1 }}>
              <LazyTextField
                TextFieldProps={{
                  fullWidth: true,
                  placeholder: formatMessage({
                    id: 'search.for.a.contract',
                    defaultMessage: 'Search for a contract',
                  }),
                  size: 'small',
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="primary" />
                      </InputAdornment>
                    ),
                  },
                }}
                onChange={onChangeQuery}
              />
            </Box>
            <Divider />
            {renderContent()}
          </Stack>
        </Paper>
      </Box>
    </ClickAwayListener>
  );
}
