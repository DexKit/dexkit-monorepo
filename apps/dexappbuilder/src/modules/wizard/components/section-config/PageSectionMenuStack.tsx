import { useIsMobile } from '@dexkit/core';
import { IconButton, Stack, Tooltip, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { SECTION_MENU_OPTIONS } from '../../constants/sections';

export interface PropsPageSectionMenuStack {
  hideMobile?: boolean;
  hideEmbedMenu?: boolean;
  isVisible?: boolean;
  hideDesktop?: boolean;
  onAction: (action: string) => void;
  onToggleVisibilty: () => void;
}
export default function PageSectionMenuStack({
  hideMobile,
  hideEmbedMenu,
  isVisible,
  hideDesktop,
  onAction,
  onToggleVisibilty,
}: PropsPageSectionMenuStack) {
  const menuArr = useMemo(() => {
    if (hideEmbedMenu) {
      return SECTION_MENU_OPTIONS({
        hideMobile,
        hideDesktop,
        isVisible,
      }).filter((m) => m.value !== 'embed');
    }

    return SECTION_MENU_OPTIONS({ hideMobile, hideDesktop, isVisible });
  }, [hideMobile, hideDesktop, isVisible]);

  const isMobile = useIsMobile();
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={isMobile ? 0 : theme.spacing(0.5)}
      alignItems="center"
    >
      {menuArr.map((item, index) =>
        item.value === 'show.section' || item.value === 'hide.section' ? (
          <IconButton
            key={index}
            size={isMobile ? 'small' : 'medium'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibilty();
            }}
            sx={isMobile ? { padding: theme.spacing(0.5) } : undefined}
          >
            <Tooltip
              title={
                <FormattedMessage
                  id={item.title.id}
                  defaultMessage={item.title.defaultMessage}
                />
              }
            >
              {React.cloneElement(item.icon, {
                fontSize: isMobile ? 'small' : 'medium',
              })}
            </Tooltip>
          </IconButton>
        ) : (
          <IconButton
            key={index}
            size={isMobile ? 'small' : 'medium'}
            onClick={(e) => {
              e.stopPropagation();
              onAction(item.value);
            }}
            sx={isMobile ? { padding: theme.spacing(0.5) } : undefined}
          >
            <Tooltip
              title={
                <FormattedMessage
                  id={item.title.id}
                  defaultMessage={item.title.defaultMessage}
                />
              }
            >
              {React.cloneElement(item.icon, {
                fontSize: isMobile ? 'small' : 'medium',
              })}
            </Tooltip>
          </IconButton>
        ),
      )}
    </Stack>
  );
}
