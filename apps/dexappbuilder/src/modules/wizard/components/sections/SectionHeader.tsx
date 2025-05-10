import { IconButton, Stack, Tooltip, Typography } from '@mui/material';

import ComputerIcon from '@mui/icons-material/Computer';
import DeleteIcon from '@mui/icons-material/Delete';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import Edit from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MobileOffIcon from '@mui/icons-material/MobileOff';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { FormattedMessage } from 'react-intl';

interface Props {
  index: number;
  title: React.ReactNode | React.ReactNode[];
  subtitle?: string;
  onSwap: (index: number, direction: 'up' | 'down') => void;
  onEdit: (index: number) => void;
  onClone: (index: number) => void;
  onRemove: (index: number) => void;
  onView: (index: number) => void;
  onHideMobile: (index: number) => void;
  onHideDesktop: (index: number) => void;
  isVisible: boolean;
  hideMobile?: boolean;
  hideDesktop?: boolean;
  icon: React.ReactNode | React.ReactNode[];
  length: number;
}

export function SectionHeader({
  index,
  icon,
  onSwap,
  title,
  subtitle,
  length,
  onRemove,
  onClone,
  onEdit,
  onView,
  onHideMobile,
  onHideDesktop,
  isVisible,
  hideMobile,
  hideDesktop,
}: Props) {
  const handleUp = () => onSwap(index, 'up');
  const handleDown = () => onSwap(index, 'down');

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" spacing={0.5} alignItems="center">
        {icon}
        <Stack direction="column" alignItems="left">
          <Typography variant="body1">{title}</Typography>
          {subtitle && <Typography variant="caption">{subtitle}</Typography>}
        </Stack>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Tooltip
          title={
            <FormattedMessage
              id={'hide.on.mobile'}
              defaultMessage={'Hide on mobile'}
            />
          }
        >
          <IconButton onClick={() => onHideMobile(index)}>
            {hideMobile ? <MobileOffIcon /> : <SmartphoneIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            <FormattedMessage
              id={'hide.on.desktop'}
              defaultMessage={'Hide on desktop'}
            />
          }
        >
          <IconButton onClick={() => onHideDesktop(index)}>
            {hideDesktop ? <DesktopAccessDisabledIcon /> : <ComputerIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            <FormattedMessage
              id={'clone.section'}
              defaultMessage={'Clone section'}
            />
          }
        >
          <IconButton onClick={() => onClone(index)}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            <FormattedMessage
              id={'view.section'}
              defaultMessage={'View section'}
            />
          }
        >
          <IconButton onClick={() => onView(index)}>
            {isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            <FormattedMessage
              id={'edit.section'}
              defaultMessage={'Edit section'}
            />
          }
        >
          <IconButton onClick={() => onEdit(index)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            <FormattedMessage
              id={'remove.section'}
              defaultMessage={'Remove section'}
            />
          }
        >
          <IconButton onClick={() => onRemove(index)} color={'error'}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            <FormattedMessage
              id={'move.section.up'}
              defaultMessage={'Move section up'}
            />
          }
        >
          <IconButton onClick={handleUp} disabled={index === 0}>
            <KeyboardArrowUpIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            <FormattedMessage
              id={'move.section.down'}
              defaultMessage={'Move section down'}
            />
          }
        >
          <IconButton onClick={handleDown} disabled={index === length - 1}>
            <KeyboardArrowDownIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
