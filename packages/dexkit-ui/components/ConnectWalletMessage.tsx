import { ConnectWalletButton } from "@dexkit/ui/components/ConnectWalletButton";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  Box,
  Paper,
  Stack,
  SxProps,
  Theme,
  Typography,
  useTheme
} from "@mui/material";
import { FormattedMessage } from "react-intl";

export interface ConnectWalletMessageProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  showButton?: boolean;
  variant?: "default" | "compact" | "inline";
  sx?: SxProps<Theme>;
}

export default function ConnectWalletMessage({
  title,
  subtitle,
  showButton = true,
  variant = "default",
  sx,
}: ConnectWalletMessageProps) {
  const theme = useTheme();

  const defaultTitle = (
    <FormattedMessage
      id="connect.your.wallet"
      defaultMessage="Connect your wallet"
    />
  );

  const defaultSubtitle = (
    <FormattedMessage
      id="connect.wallet.to.view.content"
      defaultMessage="Please connect your wallet to view this content"
    />
  );

  if (variant === "inline") {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          textAlign: "center",
          ...sx
        }}
      >
        {title || defaultTitle}
      </Typography>
    );
  }

  if (variant === "compact") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: theme.spacing(1),
          py: theme.spacing(2),
          ...sx,
        }}
      >
        <AccountBalanceWalletIcon
          color="action"
          sx={{ fontSize: theme.typography.h6.fontSize }}
        />
        <Typography variant="body2" color="text.secondary">
          {title || defaultTitle}
        </Typography>
        {showButton && <ConnectWalletButton />}
      </Box>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: theme.spacing(4),
        textAlign: "center",
        backgroundColor: theme.palette.background.default,
        borderStyle: "dashed",
        borderColor: theme.palette.divider,
        ...sx,
      }}
    >
      <Stack spacing={theme.spacing(2)} alignItems="center">
        <AccountBalanceWalletIcon
          color="action"
          sx={{
            fontSize: theme.spacing(6),
            opacity: 0.7
          }}
        />

        <Box>
          <Typography
            variant="h6"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {title || defaultTitle}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: theme.spacing(50) }}
          >
            {subtitle || defaultSubtitle}
          </Typography>
        </Box>

        {showButton && <ConnectWalletButton />}
      </Stack>
    </Paper>
  );
} 