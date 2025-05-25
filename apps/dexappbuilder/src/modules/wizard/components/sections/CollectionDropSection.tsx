import {
    useActiveClaimConditionForWallet,
    useClaimConditions,
    useClaimedNFTSupply,
    useClaimerProofs,
    useClaimIneligibilityReasons,
    useContract,
    useContractMetadata,
    useUnclaimedNFTSupply,
} from '@thirdweb-dev/react';

import { useDexKitContext } from '@dexkit/ui/hooks';
import {
    Alert,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { detectContractFeature, NATIVE_TOKEN_ADDRESS } from '@thirdweb-dev/sdk';

import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { SwappableAssetV4 } from '@traderxyz/nft-swap-sdk';
import { BigNumber } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { parseIneligibility } from '@dexkit/dexappbuilder-viewer/components/sections/EditionDropSection';
import {
    useErc20AllowanceMutation,
    useErc20ApproveMutationV2,
} from '@dexkit/ui/hooks/balances';
import { EditionDropPageSection } from '@dexkit/ui/modules/wizard/types/section';

interface Props {
  section: EditionDropPageSection;
}

export function CollectionDropSection({ section }: Props) {
  const { address } = section.config;
  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const { account, chainId, provider } = useWeb3React();
  const [quantity, setQuantity] = useState(1);
  const { contract: editionDrop } = useContract(address);

  const allowanceMutation = useErc20AllowanceMutation(provider);

  const { data: contractMetadata } = useContractMetadata(editionDrop);

  const claimConditions = useClaimConditions(editionDrop);

  const activeClaimCondition = useActiveClaimConditionForWallet(
    editionDrop,
    account,
  );
  const handleApproveAssetSuccess = useCallback(
    async (hash: string, swapAsset: SwappableAssetV4) => {
      if (swapAsset.type === 'ERC20') {
        createNotification({
          type: 'transaction',
          subtype: 'approve',
          values: {
            name: activeClaimCondition.data?.currencyMetadata.symbol || '',
            symbol: activeClaimCondition.data?.currencyMetadata.symbol || '',
          },
          metadata: {
            chainId,
            hash,
          },
        });

        watchTransactionDialog.watch(hash);
      }
    },
    [
      watchTransactionDialog,
      activeClaimCondition.data?.currencyMetadata.symbol,
      chainId,
    ],
  );

  const approveMutation = useErc20ApproveMutationV2(
    provider,
    handleApproveAssetSuccess,
  );

  const claimerProofs = useClaimerProofs(editionDrop, account || '');
  const claimIneligibilityReasons = useClaimIneligibilityReasons(editionDrop, {
    quantity,
    walletAddress: account || '',
  });
  const unclaimedSupply = useUnclaimedNFTSupply(editionDrop);
  const claimedSupply = useClaimedNFTSupply(editionDrop);

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0)
      .add(BigNumber.from(unclaimedSupply.data || 0))
      .toString();
  }, [claimedSupply.data, unclaimedSupply.data]);

  const totalAmount = useMemo(() => {
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0,
    );
    return bnPrice.mul(quantity);
  }, [quantity, activeClaimCondition.data?.currencyMetadata.value]);

  const priceToMint = useMemo(() => {
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0,
    );
    return `${formatUnits(
      bnPrice.mul(quantity).toString(),
      activeClaimCondition.data?.currencyMetadata.decimals || 18,
    )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,
    activeClaimCondition.data?.currencyMetadata.value,
    quantity,
  ]);

  const isOpenEdition = useMemo(() => {
    if (editionDrop) {
      const contractWrapper = (editionDrop as any).contractWrapper as any;

      const featureDetected = detectContractFeature(
        contractWrapper,
        'ERC721SharedMetadata',
      );

      return featureDetected;
    }
    return false;
  }, [editionDrop]);

  const maxClaimable = useMemo(() => {
    let bnMaxClaimable;
    try {
      bnMaxClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimableSupply || 0,
      );
    } catch (e) {
      bnMaxClaimable = BigNumber.from(1_000_000);
    }

    let perTransactionClaimable;
    try {
      perTransactionClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimablePerWallet || 0,
      );
    } catch (e) {
      perTransactionClaimable = BigNumber.from(1_000_000);
    }

    if (perTransactionClaimable.lte(bnMaxClaimable)) {
      bnMaxClaimable = perTransactionClaimable;
    }

    const snapshotClaimable = claimerProofs.data?.maxClaimable;

    if (snapshotClaimable) {
      if (snapshotClaimable === '0') {
        // allowed unlimited for the snapshot
        bnMaxClaimable = BigNumber.from(1_000_000);
      } else {
        try {
          bnMaxClaimable = BigNumber.from(snapshotClaimable);
        } catch (e) {
          // fall back to default case
        }
      }
    }

    const maxAvailable = BigNumber.from(unclaimedSupply.data || 0);

    let max;
    if (maxAvailable.lt(bnMaxClaimable) && !isOpenEdition) {
      max = maxAvailable;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000)) {
      return 1_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    unclaimedSupply.data,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const isSoldOut = useMemo(() => {
    try {
      return (
        (activeClaimCondition.isSuccess &&
          BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
            0,
          )) ||
        (numberClaimed === numberTotal && !isOpenEdition)
      );
    } catch (e) {
      return false;
    }
  }, [
    activeClaimCondition.data?.availableSupply,
    activeClaimCondition.isSuccess,
    numberClaimed,
    numberTotal,
    isOpenEdition,
  ]);

  const canClaim = useMemo(() => {
    return (
      activeClaimCondition.isSuccess &&
      claimIneligibilityReasons.isSuccess &&
      claimIneligibilityReasons.data?.length === 0 &&
      !isSoldOut
    );
  }, [
    activeClaimCondition.isSuccess,
    claimIneligibilityReasons.data?.length,
    claimIneligibilityReasons.isSuccess,
    isSoldOut,
  ]);

  const dropNotReady = useMemo(
    () =>
      claimConditions.data?.length === 0 ||
      claimConditions.data?.every((cc) => cc.maxClaimableSupply === '0'),
    [claimConditions.data],
  );

  const dropStartingSoon = useMemo(
    () =>
      (claimConditions.data &&
        claimConditions.data.length > 0 &&
        activeClaimCondition.isError) ||
      (activeClaimCondition.data &&
        activeClaimCondition.data.startTime > new Date()),
    [
      activeClaimCondition.data,
      activeClaimCondition.isError,
      claimConditions.data,
    ],
  );

  const isLoading = useMemo(() => {
    return (
      activeClaimCondition.isLoading ||
      unclaimedSupply.isLoading ||
      claimedSupply.isLoading ||
      !address
    );
  }, [
    activeClaimCondition.isLoading,
    address,
    claimedSupply.isLoading,
    unclaimedSupply.isLoading,
  ]);

  const buttonLoading = useMemo(
    () => isLoading || claimIneligibilityReasons.isLoading,
    [claimIneligibilityReasons.isLoading, isLoading],
  );

  const priceText = useMemo(() => {
    const pricePerToken = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0,
    );
    if (pricePerToken.eq(0)) {
      return <FormattedMessage id={'Free'} defaultMessage={'Free)'} />;
    }
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0,
    );
    return `${formatUnits(
      bnPrice.toString(),
      activeClaimCondition.data?.currencyMetadata.decimals || 18,
    )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,

    activeClaimCondition.data?.currencyMetadata.value,
  ]);

  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return <FormattedMessage id={'sold.out'} defaultMessage={'Sold out'} />;
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0,
      );
      if (pricePerToken.eq(0)) {
        return (
          <FormattedMessage id={'mint.free'} defaultMessage={'Mint (free)'} />
        );
      }
      return (
        <FormattedMessage
          id={'mint.price.value'}
          defaultMessage={`Mint ({priceToMint})`}
          values={{ priceToMint: priceToMint }}
        />
      );
    }
    if (claimIneligibilityReasons.data?.length) {
      return parseIneligibility(claimIneligibilityReasons.data, quantity);
    }
    if (buttonLoading) {
      return (
        <>
          <FormattedMessage
            id={'checking.eligibility'}
            defaultMessage={`Checking eligibility`}
          />
          {'...'}
        </>
      );
    }

    return (
      <FormattedMessage
        id={'claiming.not.available'}
        defaultMessage={'Claiming not available'}
      />
    );
  }, [
    isSoldOut,
    canClaim,
    claimIneligibilityReasons.data,
    buttonLoading,
    activeClaimCondition.data?.currencyMetadata.value,
    priceToMint,
    quantity,
  ]);

  return (
    <Box py={4}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant={'h6'}>
            <FormattedMessage
              id={'drop.details'}
              defaultMessage={'Drop details'}
            />{' '}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2} direction={'row'}>
            <Typography>
              <FormattedMessage
                id={'total.minted'}
                defaultMessage={'Total minted'}
              />{' '}
              :
            </Typography>
            <Typography>
              {' '}
              {claimedSupply ? (
                <>{numberClaimed}</>
              ) : (
                <>
                  <FormattedMessage id={'loading'} defaultMessage={'Loading'} />
                  {'...'}
                </>
              )}
            </Typography>
          </Stack>
          <Stack spacing={2} direction={'row'}>
            <Typography>
              <FormattedMessage
                id={'total.to.mint'}
                defaultMessage={'Total to mint'}
              />{' '}
              :
            </Typography>
            <Typography>
              {' '}
              {claimedSupply ? (
                <>
                  {numberTotal || (
                    <FormattedMessage
                      id={'unlimited'}
                      defaultMessage={'Unlimited'}
                    />
                  )}
                </>
              ) : (
                <>
                  <FormattedMessage id={'loading'} defaultMessage={'Loading'} />
                  {'...'}
                </>
              )}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {dropNotReady ? (
                <Alert severity="info">
                  <FormattedMessage
                    id={'drop.not.ready.to.mint.yet'}
                    defaultMessage={
                      'This drop is not ready to be minted yet. (No claim condition set)'
                    }
                  />
                </Alert>
              ) : dropStartingSoon ? (
                <Alert severity="info">
                  <FormattedMessage
                    id={'drop.is.starting.soon. Please check back later.'}
                    defaultMessage={
                      'Drop is starting soon. Please check back later.'
                    }
                  />
                </Alert>
              ) : (
                <Stack spacing={1}>
                  <Typography variant="h6">
                    {' '}
                    {activeClaimCondition.data?.metadata?.name || ''}
                  </Typography>

                  <Typography variant="body1">{priceText}</Typography>
                  <Typography variant="body2">
                    {activeClaimCondition.data?.maxClaimablePerWallet.toString() ||
                      'unlimited'}{' '}
                    <FormattedMessage
                      id={'per.wallet'}
                      defaultMessage={'per wallet'}
                    ></FormattedMessage>
                  </Typography>
                  <Stack direction={'row'} spacing={2}>
                    <Button
                      size={'large'}
                      onClick={() => setQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>

                    <Typography variant="h4">{quantity}</Typography>

                    <Button
                      size={'large'}
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= maxClaimable}
                    >
                      +
                    </Button>
                  </Stack>

                  {isSoldOut ? (
                    <Typography variant={'h2'}>
                      <FormattedMessage
                        id={'sold.out'}
                        defaultMessage={'Sold out'}
                      />
                    </Typography>
                  ) : (
                    <Button
                      disabled={!canClaim || buttonLoading}
                      sx={{ maxWidth: '300px' }}
                      variant="outlined"
                      onClick={async () => {
                        if (editionDrop) {
                          // it's an erc 20 we need to check allowance
                          if (
                            activeClaimCondition.data?.currencyAddress.toLowerCase() !==
                            NATIVE_TOKEN_ADDRESS
                          ) {
                            const allowance =
                              await allowanceMutation.mutateAsync({
                                spender: address,
                                account,
                                tokenAddress:
                                  activeClaimCondition.data?.currencyAddress,
                              });
                            // we need to approve token
                            if (
                              allowance &&
                              (allowance as BigNumber).lt(totalAmount)
                            ) {
                              const values = {
                                name: activeClaimCondition.data
                                  ?.currencyMetadata.symbol,
                                symbol:
                                  activeClaimCondition.data?.currencyMetadata
                                    .symbol,
                              };

                              watchTransactionDialog.open('approve', values);
                              await approveMutation.mutateAsync({
                                spender: address,
                                amount: totalAmount,
                                tokenAddress:
                                  activeClaimCondition.data?.currencyAddress,
                              });
                            }
                          }

                          const values = {
                            quantity: String(quantity),
                            name: String(contractMetadata?.name || ' '),
                          };

                          watchTransactionDialog.open('mintNFTDrop', values);
                          const result = await editionDrop.erc721.claim(
                            quantity,
                          );

                          createNotification({
                            type: 'transaction',
                            subtype: 'mintNFTDrop',
                            values,
                            metadata: {
                              chainId,
                              hash: result[0].receipt.transactionHash,
                            },
                          });

                          watchTransactionDialog.watch(
                            result[0].receipt.transactionHash,
                          );
                        }
                      }}
                    >
                      {buttonLoading ? (
                        <>
                          <FormattedMessage
                            id={'loading'}
                            defaultMessage={'Loading'}
                          />
                          {'...'}
                        </>
                      ) : (
                        buttonText
                      )}
                    </Button>
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CollectionDropSection;
