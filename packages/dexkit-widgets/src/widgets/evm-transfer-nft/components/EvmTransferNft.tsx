import { NETWORK_NAME } from "@dexkit/core/constants/networks";
import {
  getBlockExplorerUrl,
  getNormalizedUrl,
  isAddressEqual,
  truncateAddress,
} from "@dexkit/core/utils";
import { ConnectButton } from "@dexkit/ui/components/ConnectButton";
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
import { BigNumber, providers } from "ethers";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { TransferNftSchema } from "../constants/schemas";
import { useNftTransfer } from "../hooks";

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
  provider?: providers.Web3Provider;
  onOwnershipChange?: (ownerAddress: string) => void;
}

export default function EvmTransferNft({
  tokenId,
  chainId,
  contractAddress,
  account,
  nft,
  nftMetadata,
  isLoadingNftMetadata,
  isLoadingNft,
  provider,
  onConnectWallet,
  onSwitchNetwork,
  onCancel,
  onOwnershipChange,
}: EvmTransferNftProps) {
  const { formatMessage } = useIntl();
  const { createNotification } = useDexKitContext();

  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const nftTransfer = useNftTransfer({
    contractAddress,
    onSubmit: (hash: string) => {
      if (hash && chainId) {
        createNotification({
          type: "transaction",
          icon: "receipt",
          subtype: "nftTransfer",
          values: {
            id: tokenId as string,
            name: nft?.collectionName as string,
          },
        });
      }
    },
  });

  const handleSubmit = async (
    { address }: { address: string },
    helpers: FormikHelpers<{ address: string }>
  ) => {
    if (tokenId && account) {
      await nftTransfer.mutateAsync(
        { tokenId, from: account, to: address },
        {
          onError: (err) => {
            nftTransfer.reset();
            enqueueSnackbar(
              formatMessage({
                id: "error.while.transferring",
                defaultMessage: "Error while transferring",
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

  const disableNotOwner = ({ addressValue }: { addressValue: string }) => {
    if (nft?.protocol === "ERC1155") {
      return !(nft?.balance && nft?.balance.gt(0));
    } else {
      return (
        isAddressEqual(nft?.owner, addressValue) ||
        !isAddressEqual(nft?.owner, account)
      );
    }
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{ address: "" }}
      validationSchema={TransferNftSchema}
    >
      {({
        isSubmitting,
        isValid,
        values,
        submitForm,
        resetForm,
        isValidating,
        errors,
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
                            {truncateAddress(nft?.owner)}
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
            {!isAddressEqual(nft?.owner, account) && (
              <Alert severity="error">
                <FormattedMessage
                  id="you.are.not.the.owner.of.this.NFT"
                  defaultMessage="You are not the owner of this NFT"
                />
              </Alert>
            )}
            <Field
              label={
                <FormattedMessage
                  id="address.or.ens"
                  defaultMessage="Address or ENS"
                />
              }
              name="address"
              component={TextField}
              InputProps={{ disabled: isValidating }}
              type="text"
            />

            {isAddressEqual(nft?.owner, values.address) && (
              <Alert severity="error">
                <FormattedMessage
                  id="you.cant.use.the.connected.account.to.transfer"
                  defaultMessage="You can't use the connected to transfer"
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
                      nftTransfer.isLoading ? (
                        <CircularProgress color="inherit" size="1rem" />
                      ) : undefined
                    }
                    disabled={
                      isSubmitting ||
                      !isValid ||
                      disableNotOwner({ addressValue: values.address }) ||
                      nftTransfer.isLoading
                    }
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={submitForm}
                  >
                    {nftTransfer.isLoading ? (
                      <FormattedMessage
                        id="transferring"
                        defaultMessage="Transferring"
                      />
                    ) : (
                      <FormattedMessage
                        id="transfer"
                        defaultMessage="Transfer"
                      />
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
