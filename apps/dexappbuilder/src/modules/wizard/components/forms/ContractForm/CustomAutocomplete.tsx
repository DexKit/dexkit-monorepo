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

import { useIsMobile } from '@dexkit/core';
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
  const isMobile = useIsMobile();

  const handleFocus = () => {
    setOpen(true);
  };

  const handleBlur = () => { };

  const { formatMessage } = useIntl();

  const handleClickAway = () => {
    setOpen(false);
  };

  const renderContent = () => {
    if (options.length === 0) {
      return (
        <Stack justifyContent="center" alignItems="center" sx={{ py: isMobile ? 1 : 2 }}>
          <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontWeight: 600 }}>
            <FormattedMessage id="no.results" defaultMessage="No results" />
          </Typography>
        </Stack>
      );
    }

    return isLoading ? (
      <List dense={isMobile}>
        <ListItem>
          <ListItemText primary={<Skeleton />} />
        </ListItem>
        <ListItem>
          <ListItemText primary={<Skeleton />} />
        </ListItem>
        {!isMobile && (
          <>
            <ListItem>
              <ListItemText primary={<Skeleton />} />
            </ListItem>
            <ListItem>
              <ListItemText primary={<Skeleton />} />
            </ListItem>
          </>
        )}
      </List>
    ) : (
      <List disablePadding dense={isMobile}>
        {options.map((opt, key) => (
          <ListItemButton key={key} onClick={() => onChange(opt.value)}>
            <ListItemText
              primary={opt.label}
              primaryTypographyProps={{
                variant: isMobile ? "body2" : "body1"
              }}
            />
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
            <Box sx={{ p: isMobile ? 0.5 : 1 }}>
              <LazyTextField
                TextFieldProps={{
                  fullWidth: true,
                  placeholder: formatMessage({
                    id: 'search.for.a.contract',
                    defaultMessage: 'Search for a contract',
                  }),
                  size: 'small',
                  margin: isMobile ? "dense" : "normal",
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="primary" fontSize={isMobile ? "small" : "medium"} />
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
