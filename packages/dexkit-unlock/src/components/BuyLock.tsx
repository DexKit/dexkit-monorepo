import { NETWORK_SLUG } from "@dexkit/core/constants/networks";
import { useConnectWalletDialog, useSwitchNetworkMutation } from "@dexkit/ui";
import { ConnectButton } from "@dexkit/ui/components/ConnectButton";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import KeyIcon from "@mui/icons-material/Key";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { FormattedMessage } from "react-intl";
import {
  usePurchaseLockKeysMutation,
  useRenewLockKeysMutation,
} from "../hooks";
interface Props {
  lockName?: string;
  lockAddress: string;
  lockChainId: number;
  price: string;
  tokenId?: number;
  currencyAddress: string | null;
  lockDuration?: number | null;
  unlimitedDuration?: boolean;
  expireAtCounter?: string;
  token: {
    name?: string;
    imageUrl?: string;
    symbol?: string;
  };
  remainingTickets: number;
}

export default function BuyLock({
  lockAddress,
  lockName,
  token,
  tokenId,
  lockChainId,
  price,
  remainingTickets,
  currencyAddress,
  unlimitedDuration,
  expireAtCounter,
  lockDuration,
}: Props) {
  const { account, chainId } = useWeb3React();
  const purchaseLockMutation = usePurchaseLockKeysMutation();
  const renewLockMutation = useRenewLockKeysMutation();

  const connectWalletDialog = useConnectWalletDialog();
  const switchNetwork = useSwitchNetworkMutation();

  const handleSwitchNetwork = async () => {
    if (chainId && lockChainId !== chainId) {
      await switchNetwork.mutateAsync({ chainId: lockChainId });
    }
  };

  const handleConnectWallet = () => {
    connectWalletDialog.setOpen(true);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          {false && (
            <Grid size={12}>
              <Typography variant="body1">{lockName || " "}</Typography>
            </Grid>
          )}
          {tokenId !== 0 && chainId && (
            <>
              <Grid size={12}>
                <Stack
                  spacing={2}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="body1" color="text.primary">
                    <FormattedMessage
                      id={"you.already.own.key"}
                      defaultMessage={"You already own a key"}
                    />
                  </Typography>
                  <Button
                    href={`/asset/${NETWORK_SLUG(
                      chainId
                    )}/${lockAddress}/${tokenId}`}
                    startIcon={<KeyIcon />}
                    variant="contained"
                  >
                    <FormattedMessage
                      id={"see.key"}
                      defaultMessage={"See key"}
                    />
                  </Button>
                </Stack>
              </Grid>
              {!unlimitedDuration && (
                <Grid size={12}>
                  <Box
                    pt={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="body1" color="text.primary">
                      <FormattedMessage
                        id={"expire.at"}
                        defaultMessage={"Expire at"}
                      />
                      :
                    </Typography>
                    <Typography variant="body2" pl={1} color="text.primary">
                      {expireAtCounter || " "}
                    </Typography>
                  </Box>
                  {account && lockChainId === chainId && (
                    <Box display="flex" justifyContent="center" pt={2}>
                      <Button
                        onClick={() =>
                          renewLockMutation.mutate({
                            lockAddress: lockAddress,
                            lockName: lockName,
                            currency: currencyAddress,
                            currencySymbol: token?.symbol,
                            keyPrice: price,
                            tokenId: tokenId ? String(tokenId) : undefined,
                            lockDuration: lockDuration,
                          })
                        }
                        disabled={renewLockMutation.isLoading}
                        startIcon={
                          renewLockMutation.isLoading && (
                            <CircularProgress color="inherit" size="1rem" />
                          )
                        }
                        variant="contained"
                      >
                        {expireAtCounter === "Expired" ? (
                          <FormattedMessage
                            id={"renew.key"}
                            defaultMessage={"Renew key duration"}
                          />
                        ) : (
                          <FormattedMessage
                            id={"extend.key.duraction"}
                            defaultMessage={"Extend key duration"}
                          />
                        )}
                      </Button>
                    </Box>
                  )}
                </Grid>
              )}
            </>
          )}

          {tokenId === 0 && (
            <>
              <Grid size={12}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-evenly"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                  >
                    <Avatar
                      src={token?.imageUrl || " "}
                      alt={token?.name || " "}
                    />
                    <Typography variant="body2" color="text.primary" fontWeight="medium">
                      {price || "0"}
                    </Typography>
                    <Typography variant="body2" color="text.primary" fontWeight="medium">
                      {token?.symbol}
                    </Typography>
                  </Box>
                  {remainingTickets !== -1 && (
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="center"
                      gap={1}
                    >
                      <ConfirmationNumberIcon />
                      <Typography color="text.primary" fontWeight="bold">
                        {remainingTickets || "0"}
                      </Typography>
                      <Typography color="text.primary">
                        <FormattedMessage
                          id={"left"}
                          defaultMessage={"Left"}
                        />
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid size={12}>
                <Box display="flex" justifyContent="center" pt={1}>
                  {!account && <ConnectButton variant="contained" />}

                  {account && lockChainId !== chainId && (
                    <Button
                      onClick={handleSwitchNetwork}
                      color="inherit"
                      variant="outlined"
                      size="small"
                      disabled={switchNetwork.isLoading}
                      startIcon={
                        switchNetwork.isLoading ? (
                          <CircularProgress color="inherit" size="1rem" />
                        ) : undefined
                      }
                    >
                      <FormattedMessage
                        id="switch.network"
                        defaultMessage="Switch network"
                      />
                    </Button>
                  )}

                  {account && lockChainId === chainId && (
                    <Button
                      onClick={() =>
                        purchaseLockMutation.mutate({
                          lockAddress: lockAddress,
                          lockName: lockName,
                          currencySymbol: token?.symbol,
                          currency: currencyAddress,
                          keyPrice: price,
                        })
                      }
                      disabled={purchaseLockMutation.isLoading}
                      startIcon={
                        purchaseLockMutation.isLoading ? (
                          <CircularProgress color="inherit" size="1rem" />
                        ) : (
                          <KeyIcon />
                        )
                      }
                      variant="contained"
                    >
                      <FormattedMessage
                        id={"buy.key"}
                        defaultMessage={"Buy key"}
                      />
                    </Button>
                  )}
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
