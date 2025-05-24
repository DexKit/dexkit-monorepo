import { IconButton, IconButtonProps, Tooltip, useTheme } from '@mui/material';
import { MouseEvent, useState } from 'react';

interface Props {
  iconButtonProps: IconButtonProps;
  tooltip?: string;
  activeTooltip?: string;
  children?: React.ReactNode | React.ReactNode[];
  tooltipDuration?: number;
}

export function CopyIconButton(props: Props) {
  const { tooltip, activeTooltip, iconButtonProps, children, tooltipDuration } = props;
  const { onClick } = iconButtonProps;
  const theme = useTheme();
  const defaultDuration = theme.transitions.duration.standard * 2; // 500ms aprox

  const [currentTooltip, setCurrentTooltip] = useState<string>(tooltip || '');

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick!(e);
    setCurrentTooltip(activeTooltip || '');
    setTimeout(() => {
      setCurrentTooltip(tooltip || '');
    }, tooltipDuration || defaultDuration);
  };

  return (
    <Tooltip title={currentTooltip}>
      <IconButton
        {...(iconButtonProps as IconButtonProps)}
        onClick={handleClick}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}
