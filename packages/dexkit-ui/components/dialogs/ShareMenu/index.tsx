import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
  Stack,
  Typography,
} from "@mui/material";

import XIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkIcon from "@mui/icons-material/Link";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import Close from "@mui/icons-material/Close";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

export interface ShareMenuProps {
  MenuProps: MenuProps;
  onClick: (value: string) => void;
}

const OPTIONS: {
  value: string;
  title: React.ReactNode;
  icon: React.ReactNode;
}[] = [
  {
    value: "telegram",
    title: <FormattedMessage id="telegram" defaultMessage="Telegram" />,
    icon: <TelegramIcon />,
  },
  {
    value: "email",
    title: <FormattedMessage id="email" defaultMessage="Email" />,
    icon: <EmailIcon />,
  },
  {
    value: "facebook",
    title: <FormattedMessage id="facebook" defaultMessage="Facebook" />,
    icon: <FacebookIcon />,
  },
  {
    value: "pinterest",
    title: <FormattedMessage id="pinterest" defaultMessage="Pinterest" />,
    icon: <PinterestIcon />,
  },
  {
    value: "whatsapp",
    title: <FormattedMessage id="whatsapp" defaultMessage="WhatsApp" />,
    icon: <WhatsAppIcon />,
  },
  {
    value: "x",
    title: <FormattedMessage id="x" defaultMessage="X" />,
    icon: <XIcon />,
  },
  {
    value: "copy",
    title: <FormattedMessage id="copy.link" defaultMessage="Copy link" />,
    icon: <LinkIcon />,
  },
];

export default function ShareMenu({ MenuProps, onClick }: ShareMenuProps) {
  const handleClick = useCallback(
    (value: string) => {
      return () => {
        onClick(value);
      };
    },
    [onClick]
  );

  const { onClose } = MenuProps;

  return (
    <Menu {...MenuProps} MenuListProps={{ disablePadding: true }}>
      <Box sx={{ px: 1.5, py: 0.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography fontWeight="bold">
            <FormattedMessage id="share" defaultMessage="Share" />
          </Typography>
          <IconButton
            onClick={() => onClose!({}, "backdropClick")}
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
      <Divider />
      {OPTIONS.map((opt, index, arr) => (
        <MenuItem
          divider={index < arr.length - 1}
          key={opt.value}
          onClick={handleClick(opt.value)}
        >
          <ListItemIcon>{opt.icon}</ListItemIcon>
          <ListItemText primary={opt.title} />
        </MenuItem>
      ))}
    </Menu>
  );
}
