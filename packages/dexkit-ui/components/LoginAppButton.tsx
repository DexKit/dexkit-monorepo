import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Alert, Button, Stack, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import {
  useAuth,
  useAuthUserQuery,
  useLoginAccountMutation,
} from "@dexkit/ui/hooks/auth";
import { useWalletConnect } from "../hooks/wallet";
import { ConnectButton } from "./ConnectButton";

export interface LoginAppButtonProps {
  onLogin?: () => void;
  connectWalletMsg?: React.ReactNode | string;
  signMessageMsg?: React.ReactNode | string;
}

export default function LoginAppButton({
  onLogin,
  connectWalletMsg,
  signMessageMsg,
}: LoginAppButtonProps) {
  const { account, isActive } = useWeb3React();
  const userQuery = useAuthUserQuery();
  const { user } = useAuth();
  const { connectWallet } = useWalletConnect();
  const loginMutation = useLoginAccountMutation();

  const handleLogin = async () => {
    await loginMutation.mutateAsync();
    userQuery.refetch();
    if (onLogin) {
      onLogin();
    }
  };

  const isSameUserAccount = useMemo(() => {
    if (!account?.toLowerCase()) {
      return false;
    }

    if (account?.toLowerCase() === user?.address?.toLowerCase()) {
      return true;
    }
    return false;
  }, [user, account]);

  const buttonMsg = () => {
    if (isSameUserAccount) {
      return <FormattedMessage id={"logged"} defaultMessage={"Logged"} />;
    }
    if (loginMutation.isLoading) {
      return (
        <FormattedMessage id={"sign.message"} defaultMessage={"sign message"} />
      );
    }
    return <FormattedMessage id={"login"} defaultMessage={"Login"} />;
  };

  if (!account || !isActive) {
    return (
      <Stack spacing={2}>
        <Alert severity={"info"}>
          <Typography variant={"body1"}>
            {connectWalletMsg ? (
              connectWalletMsg
            ) : (
              <FormattedMessage
                id="start.by.connect.wallet"
                defaultMessage="Start by connecting your wallet. If you don't have one, you can create one by clicking on connect wallet button and choosing our Discord, Google, Twitter or email wallet"
              />
            )}
          </Typography>
        </Alert>
        <Stack alignItems="center" justifyContent="center">
          <ConnectButton
            variant="outlined"
            color="inherit"
            endIcon={<ChevronRightIcon />}
          />
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Alert severity={"info"}>
        <Typography variant={"body1"}>
          {" "}
          {signMessageMsg ? (
            signMessageMsg
          ) : (
            <FormattedMessage
              id="login.by.connect.wallet"
              defaultMessage="Login with your wallet. You will need to sign a message"
            />
          )}
        </Typography>
      </Alert>
      <Stack alignItems="center" justifyContent="center">
        <Button
          variant={"contained"}
          disabled={loginMutation.isLoading || isSameUserAccount}
          startIcon={
            loginMutation.isLoading && (
              <CircularProgress size="1rem" color="inherit" />
            )
          }
          onClick={handleLogin}
        >
          {buttonMsg()}
        </Button>
      </Stack>
    </Stack>
  );
}
