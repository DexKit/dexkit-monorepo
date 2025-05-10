import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import {
    formatBigNumber,
    isAddressEqual,
    truncateAddress,
} from '@dexkit/core/utils';
import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { useDexKitContext } from '@dexkit/ui';
import { DEXKIT_STORAGE_MERKLE_TREE_URL } from '@dexkit/ui/constants/api';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useAsyncMemo } from '@dexkit/widgets/src/hooks';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Skeleton,
    Stack,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    NATIVE_TOKEN_ADDRESS,
    useBalance,
    useContract,
    useContractRead,
} from '@thirdweb-dev/react';
import { BigNumber, constants } from 'ethers';
import { SyntheticEvent, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Link from '@dexkit/ui/components/AppLink';
import { useThirdwebApprove } from '@dexkit/ui/modules/contract-wizard/hooks/thirdweb';
import AirdropDialog from '../dialogs/AirdropDialog';

export interface ContractAirdropErc20ContainerProps {
  address: string;
  network: string;
}

export default function ContractClaimableAirdropErc20Container({
  address,
  network,
}: ContractAirdropErc20ContainerProps) {
  const { data: contract } = useContract(address as string);
  const [recipients, setRecipients] = useState<
    { address: string; quantity: string }[]
  >([]);

  const { data: tokenAirdropAdress } = useContractRead(
    contract,
    'airdropTokenAddress',
  );

  const { data: owner } = useContractRead(contract, 'tokenOwner');

  const merkleRootQuery = useContractRead(contract, 'merkleRoot');

  const isOpenClaim =
    merkleRootQuery.data ===
    '0x0000000000000000000000000000000000000000000000000000000000000000';

  const { data: tokenContract, isFetched } = useContract(
    tokenAirdropAdress,
    'token',
  );

  const openClaimLimitPerWalletQuery = useContractRead(
    contract,
    'openClaimLimitPerWallet',
  );

  const tokenMetadataQuery = useQuery(
    ['token_metadata', isFetched],
    async () => {
      return tokenContract?.erc20?.get();
    },
  );

  const openClaimLimitFormatted = useMemo(() => {
    if (
      openClaimLimitPerWalletQuery?.data &&
      tokenMetadataQuery?.data?.decimals
    ) {
      return formatUnits(
        openClaimLimitPerWalletQuery?.data,
        tokenMetadataQuery?.data?.decimals,
      );
    }
  }, [openClaimLimitPerWalletQuery?.data, tokenMetadataQuery.data]);

  const { data: expirationTimestamp } = useContractRead(
    contract,
    'expirationTimestamp',
  );

  const { data: availableAmount } = useContractRead(
    contract,
    'availableAmount',
  );

  const { account } = useWeb3React();

  const tokenAddress = tokenAirdropAdress;
  const { data: allowance, refetch: refetchAllowance } = useQuery(
    ['AIRDROP_TOKEN_ALLOWANCE', tokenAirdropAdress],
    async () => {
      return await tokenContract?.erc20.allowance(address);
    },
  );

  const contractChain = NETWORK_FROM_SLUG(network)?.chainId;

  const approve = useThirdwebApprove({ contract: tokenContract, address });

  const { chainId } = useWeb3React();

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const { data: tokenBalance, isLoading } = useBalance(
    tokenAddress !== NATIVE_TOKEN_ADDRESS &&
      tokenAddress !== constants.AddressZero
      ? tokenAddress
      : undefined,
  );

  const [totalAmount, totalAmountFormatted] = useAsyncMemo(
    async () => {
      const metadata = await tokenContract?.erc20.get();
      if (availableAmount) {
        const amount = availableAmount;
        return [
          amount,
          `${formatUnits(amount, metadata?.decimals)} ${metadata?.symbol}`,
        ];
      }
      return [BigNumber.from(0), '0.0'];
    },
    [BigNumber.from(0), '0.0'],
    [availableAmount, tokenContract],
  );

  const airdropMutation = useMutation(async () => {
    const metadata = await tokenContract?.erc20.get();

    if (
      !isAddressEqual(tokenAddress, NATIVE_TOKEN_ADDRESS) &&
      !isAddressEqual(tokenAddress, constants.AddressZero)
    ) {
      if (!allowance?.value.gte(availableAmount)) {
        await approve.mutateAsync({
          amount: formatUnits(availableAmount, metadata?.decimals),
        });
        refetchAllowance();
      }
    }
  });

  const handleConfirm = (data: { address: string; quantity: string }[]) => {
    setRecipients(data);
  };

  const [showAirdrop, setShowAirdrop] = useState(false);

  const handleSelectRecipients = () => {
    setShowAirdrop(true);
  };

  const handleClose = () => {
    setShowAirdrop(false);
  };

  const handleAirdrop = async () => {
    await airdropMutation.mutateAsync();
  };

  const [currTab, setCurrTab] = useState('airdrop');

  const handleChange = (e: SyntheticEvent, value: string) => {
    setCurrTab(value);
  };

  return (
    <>
      <AirdropDialog
        DialogProps={{
          open: showAirdrop,
          onClose: handleClose,
          fullWidth: true,
          maxWidth: 'lg',
        }}
        onConfirm={handleConfirm}
        value={recipients}
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs value={currTab} onChange={handleChange}>
            <Tab
              value="airdrop"
              label={<FormattedMessage id="airdrop" defaultMessage="Airdrop" />}
            />
          </Tabs>
        </Grid>
        {currTab === 'airdrop' && (
          <>
            <Grid item xs={12}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Stack
                          direction="column"
                          justifyContent="space-between"
                          spacing={0.5}
                        >
                          <Typography variant="caption" color="text.secondary">
                            <FormattedMessage
                              id="Airdrop token"
                              defaultMessage="Airdrop token"
                            />
                          </Typography>
                          <Link
                            target="_blank"
                            href={`/contract/${network}/${tokenAddress}`}
                          >
                            {truncateAddress(tokenAddress)}
                          </Link>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Box>
                            <Box sx={{ mb: !tokenAddress ? 0.5 : 0 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                <FormattedMessage
                                  id="your.airdrop.balance"
                                  defaultMessage="Your airdrop balance"
                                />
                              </Typography>
                            </Box>
                            <Typography variant="h6">
                              {isLoading ? (
                                <Skeleton />
                              ) : (
                                `${formatBigNumber(
                                  tokenBalance?.value,
                                  tokenBalance?.decimals,
                                )} ${tokenBalance?.symbol.toUpperCase()}`
                              )}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          <FormattedMessage
                            id="total.for.airdrop"
                            defaultMessage="Total for Airdrop"
                          />
                        </Typography>
                        <Typography variant="h5">
                          {tokenAddress ? totalAmountFormatted : '0.00'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Stack
                          spacing={0.5}
                          justifyContent="space-between"
                          direction="column"
                        >
                          <Typography variant="caption" color="text.secondary">
                            {isOpenClaim ? (
                              <FormattedMessage
                                id="Open.claim"
                                defaultMessage="Open claim"
                              />
                            ) : (
                              <FormattedMessage
                                id="Allow.list.file"
                                defaultMessage="Allow list file"
                              />
                            )}
                          </Typography>

                          {isOpenClaim ? (
                            <Typography variant="h5">
                              {openClaimLimitFormatted}{' '}
                              {tokenBalance?.symbol.toUpperCase()}
                            </Typography>
                          ) : (
                            <Link
                              href={`${DEXKIT_STORAGE_MERKLE_TREE_URL}${merkleRootQuery.data}.json`}
                              target="_blank"
                            >
                              {' '}
                              <FormattedMessage
                                id="open.file"
                                defaultMessage="Open file"
                              />{' '}
                            </Link>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <Divider />
                {tokenBalance && totalAmount.gt(tokenBalance.value) && (
                  <Alert severity="error">
                    <FormattedMessage
                      id="you.do.not.have.enough.balance.for.your.airdrop"
                      defaultMessage="You do not have enough balance for your Airdrop"
                    />
                  </Alert>
                )}
                {availableAmount && allowance?.value.lt(availableAmount) && (
                  <Alert severity="error">
                    <FormattedMessage
                      id="you.need.to.approve.tokens.for.airdrop"
                      defaultMessage="You need to approve tokens for airdrop"
                    />
                  </Alert>
                )}

                {availableAmount && allowance?.value.lt(availableAmount) && (
                  <Stack direction="row">
                    <Button
                      startIcon={
                        airdropMutation.isLoading ? (
                          <CircularProgress color="inherit" size="1rem" />
                        ) : undefined
                      }
                      disabled={
                        contractChain !== chainId ||
                        airdropMutation.isLoading ||
                        (tokenBalance && totalAmount.gt(tokenBalance?.value)) ||
                        owner?.toLowerCase() !== account?.toLowerCase() ||
                        !tokenAddress
                      }
                      onClick={handleAirdrop}
                      variant="contained"
                    >
                      <FormattedMessage id="approve" defaultMessage="Approve" />
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}
