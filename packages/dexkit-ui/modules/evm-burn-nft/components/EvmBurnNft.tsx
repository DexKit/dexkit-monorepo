import { NETWORK_NAME } from "@dexkit/core/constants/networks";
import {
  getBlockExplorerUrl,
  getNormalizedUrl,
  isAddressEqual,
  truncateAddress,
} from "@dexkit/core/utils";
import { useDexKitContext } from "@dexkit/ui/hooks";
import WalletIcon from "@mui/icons-material/Wallet";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Link,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { BigNumber } from "ethers";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { ConnectButton } from "../../../components/ConnectButton";
import { getTransferNftSchema } from "../constants/schemas";
import { useNftBurn } from "../hooks";

export interface EvmTransferNftProps {
  tokenId?: string;
  chainId?: number;
  account?: string;
  contractAddress?: string;
  isLoadingNft?: boolean;
  isLoadingNftMetadata?: boolean;
  nft?: {
    collectionName?: string;
    chainId?: number;
    owner?: string;
    tokenId?: string;
    protocol?: "ERC721" | "ERC1155";
    balance?: BigNumber;
  };
  nftMetadata?: {
    image?: string;
    name?: string;
    description?: string;
  };
  onConnectWallet?: () => void;
  onSwitchNetwork?: () => void;
  onCancel?: () => void;
  onOwnershipChange?: (ownerAddress: string) => void;
}

export default function EvmBurnNft({
  tokenId,
  chainId,
  contractAddress,
  account,
  nft,
  nftMetadata,
  isLoadingNftMetadata,
  isLoadingNft,
  onConnectWallet,
  onSwitchNetwork,
  onCancel,
  onOwnershipChange,
}: EvmTransferNftProps) {
  const { formatMessage } = useIntl();
  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const nftBurn = useNftBurn({
    contractAddress,
    onSubmit: (hash: string, quantity: string | undefined) => {
      if (hash && chainId) {
        const values: {
          id: string;
          name: string;
          quantity?: string;
        } = {
          id: tokenId as string,
          name: nft?.collectionName as string,
        };
        if (quantity) {
          values.quantity = quantity;

          createNotification({
            type: "transaction",
            icon: "receipt",
            subtype: "nftBurnMultiple",
            values,
          });
          watchTransactionDialog.open("nftBurnMultiple", values);
        } else {
          createNotification({
            type: "transaction",
            icon: "receipt",
            subtype: "nftBurn",
            values,
          });
          watchTransactionDialog.open("nftBurn", values);
        }
        watchTransactionDialog.watch(hash);
      }
    },
  });

  const handleSubmit = async (
    { address, quantity }: { address: string; quantity: string },
    helpers: FormikHelpers<{ address: string; quantity: string }>
  ) => {
    if (tokenId && account) {
      await nftBurn.mutateAsync(
        { tokenId, protocol: nft?.protocol, quantity },
        {
          onError: (err) => {
            nftBurn.reset();
            enqueueSnackbar(
              formatMessage({
                id: "error.while.burning",
                defaultMessage: "Error while burning",
              }),
              { variant: "error" }
            );
          },
        }
      );

      if (onOwnershipChange) {
        onOwnershipChange(address);
      }

      helpers.resetForm();
    }
  };

  const disableNotOwner = ({ addressValue }: { addressValue: string }) => {
    if (nft?.protocol === "ERC1155" && nft?.balance) {
      return !nft?.balance.gt(0);
    } else {
      return (
        isAddressEqual(nft?.owner, addressValue) ||
        !isAddressEqual(nft?.owner, account)
      );
    }
  };

  if (!account) {
    return (
      <Card>
        <CardContent>
          <Box display={"flex"} justifyContent={"center"}>
            <ConnectButton variant="contained" color="primary" size="large" />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{ address: "", quantity: "1" }}
      validationSchema={getTransferNftSchema({
        protocol: nft?.protocol,
        balance: nft?.balance,
      })}
    >
      {({
        isSubmitting,
        isValid,
        values,
        submitForm,
        resetForm,
        isValidating,
      }) => (
        <Form>
          <Stack spacing={2}>
            <Box>
              <Stack spacing={2}>
                <Box display={"flex"} justifyContent={"center"}>
                  {isLoadingNftMetadata ? (
                    <Skeleton
                      variant="rectangular"
                      sx={{
                        height: theme.spacing(30),
                        width: theme.spacing(30),
                      }}
                    />
                  ) : (
                    nftMetadata?.image && (
                      <img
                        src={getNormalizedUrl(nftMetadata?.image)}
                        height={theme.spacing(30)}
                        width={theme.spacing(30)}
                      />
                    )
                  )}
                </Box>

                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Link href="/" target="_blank" variant="caption">
                      {isLoadingNft && !nft?.collectionName ? (
                        <Skeleton />
                      ) : (
                        nft?.collectionName
                      )}
                    </Link>

                    <Typography variant="body1">
                      {isLoadingNft && !nft?.collectionName && !nft?.tokenId ? (
                        <Skeleton />
                      ) : (
                        <>
                          {nft?.collectionName} #{nft?.tokenId}
                        </>
                      )}
                    </Typography>
                  </Box>
                  {/* <Box>
                    <IconButton>
                      <OpenSea />
                    </IconButton>
                      </Box>*/}
                </Stack>
                <Typography variant="caption">
                  {isLoadingNft ? (
                    <Skeleton />
                  ) : nft?.protocol === "ERC1155" ? (
                    nft?.balance && (
                      <FormattedMessage
                        id="you.own.nfts"
                        defaultMessage="You own {balance} NFTs"
                        values={{
                          balance: nft.balance.toString(),
                        }}
                      />
                    )
                  ) : (
                    <FormattedMessage
                      id="owned.by.owner"
                      defaultMessage="Owned by {owner}"
                      values={{
                        owner: (
                          <Link
                            href={`${getBlockExplorerUrl(
                              nft?.chainId
                            )}/address/${nft?.owner}`}
                            target="_blank"
                          >
                            {isAddressEqual(nft?.owner, account) ? (
                              <FormattedMessage id="you" defaultMessage="You" />
                            ) : (
                              truncateAddress(nft?.owner)
                            )}
                          </Link>
                        ),
                      }}
                    />
                  )}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isLoadingNftMetadata ? (
                    <Skeleton />
                  ) : (
                    nftMetadata?.description
                  )}
                </Typography>
              </Stack>
            </Box>
            {nft?.protocol !== "ERC1155" &&
              !isAddressEqual(nft?.owner, account) && (
                <Alert severity="error">
                  <FormattedMessage
                    id="you.are.not.the.owner.of.this.NFT"
                    defaultMessage="You are not the owner of this NFT"
                  />
                </Alert>
              )}
            {/*<AddressField />*/}
            {nft?.protocol === "ERC1155" && (
              <Field
                label={
                  <FormattedMessage id="quantity" defaultMessage="Quantity" />
                }
                name="quantity"
                component={TextField}
                max={nft.balance?.toNumber() || 1}
                type="number"
              />
            )}

            {isAddressEqual(nft?.owner, values.address) && (
              <Alert severity="error">
                <FormattedMessage
                  id="you.cant.use.the.connected.account.to.burn"
                  defaultMessage="You can't use the connected account to burn"
                />
              </Alert>
            )}

            <Box>
              {account ? (
                chainId !== nft?.chainId ? (
                  <Button
                    onClick={onSwitchNetwork ? onSwitchNetwork : undefined}
                    disabled={!onSwitchNetwork}
                    startIcon={<WalletIcon />}
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    <FormattedMessage
                      id="switch.to.network.value"
                      defaultMessage="Switch to {networkName} network"
                      values={{
                        networkName: NETWORK_NAME(nft?.chainId),
                      }}
                    />
                  </Button>
                ) : (
                  <Button
                    startIcon={
                      nftBurn.isLoading || isValidating ? (
                        <CircularProgress color="inherit" size="1rem" />
                      ) : undefined
                    }
                    disabled={
                      isSubmitting ||
                      !isValid ||
                      disableNotOwner({ addressValue: values.address }) ||
                      nftBurn.isLoading
                    }
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={submitForm}
                  >
                    {isValidating ? (
                      <FormattedMessage
                        id="validating"
                        defaultMessage="Validating"
                      />
                    ) : nftBurn.isLoading ? (
                      <FormattedMessage id="burning" defaultMessage="Burning" />
                    ) : (
                      <FormattedMessage id="burn" defaultMessage="Burn" />
                    )}
                  </Button>
                )
              ) : (
                <ConnectButton
                  variant="contained"
                  color="primary"
                  size="large"
                />
              )}

              {onCancel && (
                <Button
                  onClick={() => {
                    onCancel();
                    resetForm();
                  }}
                >
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
              )}
            </Box>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
