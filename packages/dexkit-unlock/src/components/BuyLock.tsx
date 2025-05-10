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
        <Grid container spacing={1}>
          {false && (
            <Grid item xs={12}>
              <Typography variant="body1">{lockName || " "}</Typography>
            </Grid>
          )}
          {tokenId !== 0 && chainId && (
            <>
              <Grid item xs={12}>
                <Stack
                  spacing={1}
                  flexDirection={"column"}
                  alignContent={"center"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Typography variant="body1">
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
                    variant={"contained"}
                  >
                    <FormattedMessage
                      id={"see.key"}
                      defaultMessage={"See key"}
                    />
                  </Button>
                </Stack>
              </Grid>
              {!unlimitedDuration && (
                <Grid item xs={12}>
                  <Box
                    pt={1}
                    display={"flex"}
                    alignContent={"center"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Typography variant="body1">
                      <FormattedMessage
                        id={"expire.at"}
                        defaultMessage={"Expire at"}
                      />
                      :
                    </Typography>
                    <Typography variant="body2" pl={1}>
                      {expireAtCounter || " "}
                    </Typography>
                  </Box>
                  {account && lockChainId === chainId && (
                    <Box display={"flex"} justifyContent={"center"} pt={1}>
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
                        variant={"contained"}
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
              <Grid item xs={12}>
                <Box
                  display={"flex"}
                  alignContent={"center"}
                  alignItems={"center"}
                  justifyContent={"space-evenly"}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    alignContent={"center"}
                    alignItems={"center"}
                    justifyContent={"space-around"}
                  >
                    <Avatar
                      src={token?.imageUrl || " "}
                      alt={token?.name || " "}
                    ></Avatar>
                    <Typography variant="body2" sx={{ pl: 1 }}>
                      {price || "0"}
                    </Typography>
                    <Typography sx={{ pl: 1 }} variant="body2">
                      {token?.symbol}
                    </Typography>
                  </Box>
                  {remainingTickets !== -1 && (
                    <Box
                      flexDirection={"row"}
                      display={"flex"}
                      alignContent={"center"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <ConfirmationNumberIcon />

                      <Typography sx={{ pl: 1 }}>
                        <b>{remainingTickets || "0"}</b>
                      </Typography>
                      <Typography sx={{ pl: 1 }}>
                        <FormattedMessage
                          id={"left"}
                          defaultMessage={"Left"}
                        ></FormattedMessage>
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box display={"flex"} justifyContent={"center"}>
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
                      variant={"contained"}
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
