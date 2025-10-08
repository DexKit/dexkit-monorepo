import { truncateAddress } from "@dexkit/core/utils/blockchain";
import { AccountBalance } from "@dexkit/ui/components/AccountBalance";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Avatar,
  Box,
  ButtonBase,
  Popover,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  WalletIcon,
  WalletProvider,
  useConnectedWallets,
} from "thirdweb/react";
import { useIsBalanceVisible } from "../modules/wallet/hooks";
const WalletContent = dynamic(() => import("./WalletContent"));

export interface WalletButtonProps {
  align?: "center" | "left";
  onSend?: () => void;
  onReceive?: () => void;
}

export function WalletButton({ align }: WalletButtonProps) {
  const { account, ENSName } = useWeb3React();
  const theme = useTheme();

  const isBalancesVisible = useIsBalanceVisible();

  const wallets = useConnectedWallets();

  const justifyContent = align === "left" ? "flex-start" : "center";

  const [showContent, setShowContent] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isSwitchingWallet, setIsSwitchingWallet] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
    setShowContent(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowContent(false);
    setIsSwitchingWallet(false);
  };

  const handleStartSwitching = () => {
    setIsSwitchingWallet(true);
  };

  const handleStopSwitching = () => {
    setIsSwitchingWallet(false);
  };

  return (
    <>
      <ButtonBase
        id="wallet-button"
        sx={(theme) => ({
          px: 1,
          py: 1,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.spacing(1),
          justifyContent,
        })}
        onClick={handleClick}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {wallets && wallets.length ? (
            <WalletProvider id={wallets[0].id}>
              <WalletIcon
                style={{
                  width: theme.spacing(2),
                  height: theme.spacing(2),
                }}
              />
            </WalletProvider>
          ) : (
            <Avatar
              sx={(theme) => ({
                width: theme.spacing(2),
                height: theme.spacing(2),
                background: theme.palette.action.hover,
              })}
              variant="rounded"
            />
          )}
          <Box>
            <Typography variant="caption" align="left" component="div" color="text.primary">
              {isBalancesVisible
                ? ENSName
                  ? ENSName
                  : truncateAddress(account)
                : "**********"}
            </Typography>
            <div>
              {false && (
                <AccountBalance isBalancesVisible={isBalancesVisible} />
              )}
            </div>
          </Box>
          {showContent ? <ExpandLessIcon sx={{ color: 'text.primary' }} /> : <ExpandMoreIcon sx={{ color: 'text.primary' }} />}
        </Stack>
      </ButtonBase>
      {showContent && (
        <Popover
          open={showContent}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          onClose={handleClose}
          disableEnforceFocus={isSwitchingWallet}
          disableAutoFocus={isSwitchingWallet}
          disableRestoreFocus={isSwitchingWallet}
        >
          <WalletContent
            onClosePopover={handleClose}
            onStartSwitching={handleStartSwitching}
            onStopSwitching={handleStopSwitching}
          />
        </Popover>
      )}
    </>
  );
}
