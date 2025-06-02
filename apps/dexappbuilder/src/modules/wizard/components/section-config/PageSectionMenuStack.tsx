import { IconButton, Stack, Tooltip } from '@mui/material';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { SECTION_MENU_OPTIONS } from '../../constants/sections';

export interface PropsPageSectionMenuStack {
  hideMobile?: boolean;
  isVisible?: boolean;
  hideDesktop?: boolean;
  onAction: (action: string) => void;
  onToggleVisibilty: () => void;
}
export default function PageSectionMenuStack({
  hideMobile,
  isVisible,
  hideDesktop,
  onAction,
  onToggleVisibilty,
}: PropsPageSectionMenuStack) {
  const menuArr = useMemo(() => {
    return SECTION_MENU_OPTIONS({ hideMobile, hideDesktop, isVisible });
  }, [hideMobile, hideDesktop, isVisible]);

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {menuArr.map((item, index) =>
        item.value === 'show.section' || item.value === 'hide.section' ? (
          <IconButton
            key={index}
            onClick={(e) => {
              e.stopPropagation();

              onToggleVisibilty();
            }}
          >
            <Tooltip
              title={
                <FormattedMessage
                  id={item.title.id}
                  defaultMessage={item.title.defaultMessage}
                />
              }
            >
              {item.icon}
            </Tooltip>
          </IconButton>
        ) : (
          <IconButton
            key={index}
            onClick={(e) => {
              e.stopPropagation();

              onAction(item.value);
            }}
          >
            <Tooltip
              title={
                <FormattedMessage
                  id={item.title.id}
                  defaultMessage={item.title.defaultMessage}
                />
              }
            >
              {item.icon}
            </Tooltip>
          </IconButton>
        )
      )}
    </Stack>
  );
}
