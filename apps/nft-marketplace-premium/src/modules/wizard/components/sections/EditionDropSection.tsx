import { EditionDropPageSection } from '@/modules/wizard/types/section';
import {
  useActiveClaimConditionForWallet,
  useClaimConditions,
  useClaimerProofs,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
  useTotalCirculatingSupply,
} from '@thirdweb-dev/react';

import { useDexKitContext } from '@dexkit/ui/hooks';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { ClaimEligibility } from '@thirdweb-dev/sdk';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
  section: EditionDropPageSection;
}

export function parseIneligibility(
  reasons: ClaimEligibility[],
  quantity = 0
): string {
  if (!reasons.length) {
    return '';
  }

  const reason = reasons[0];

  if (
    reason === ClaimEligibility.Unknown ||
    reason === ClaimEligibility.NoActiveClaimPhase ||
    reason === ClaimEligibility.NoClaimConditionSet
  ) {
    return 'This drop is not ready to be minted.';
  } else if (reason === ClaimEligibility.NotEnoughTokens) {
    return "You don't have enough currency to mint.";
  } else if (reason === ClaimEligibility.AddressNotAllowed) {
    if (quantity > 1) {
      return `You are not eligible to mint ${quantity} tokens.`;
    }

    return 'You are not eligible to mint at this time.';
  }

  return reason;
}

export function EditionDropSection({ section }: Props) {
  const { tokenId, address } = section.config;
  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const { account, chainId } = useWeb3React();
  const [quantity, setQuantity] = useState(1);
  const { contract: editionDrop } = useContract(address);

  const { data: contractMetadata } = useContractMetadata(editionDrop);

  const claimConditions = useClaimConditions(editionDrop);

  const activeClaimCondition = useActiveClaimConditionForWallet(
    editionDrop,
    account,
    tokenId
  );

  console.log(activeClaimCondition.data);
  const claimerProofs = useClaimerProofs(editionDrop, account || '', tokenId);
  const claimIneligibilityReasons = useClaimIneligibilityReasons(
    editionDrop,
    {
      quantity,
      walletAddress: account || '',
    },
    tokenId
  );

  const claimedSupply = useTotalCirculatingSupply(editionDrop, tokenId);

  const totalAvailableSupply = useMemo(() => {
    try {
      return BigNumber.from(activeClaimCondition.data?.availableSupply || 0);
    } catch {
      return BigNumber.from(1_000_000);
    }
  }, [activeClaimCondition.data?.availableSupply]);

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    const n = totalAvailableSupply.add(BigNumber.from(claimedSupply.data || 0));
    if (n.gte(1_000_000)) {
      return '';
    }
    return n.toString();
  }, [totalAvailableSupply, claimedSupply]);

  const priceToMint = useMemo(() => {
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0
    );
    return `${utils.formatUnits(
      bnPrice.mul(quantity).toString(),
      activeClaimCondition.data?.currencyMetadata.decimals || 18
    )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,
    activeClaimCondition.data?.currencyMetadata.value,
    quantity,
  ]);

  const maxClaimable = useMemo(() => {
    let bnMaxClaimable;
    try {
      bnMaxClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimableSupply || 0
      );
    } catch (e) {
      bnMaxClaimable = BigNumber.from(1_000_000);
    }

    let perTransactionClaimable;
    try {
      perTransactionClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimablePerWallet || 0
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

    let max;
    if (totalAvailableSupply.lt(bnMaxClaimable)) {
      max = totalAvailableSupply;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000)) {
      return 1_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    totalAvailableSupply,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const isSoldOut = useMemo(() => {
    try {
      return (
        (activeClaimCondition.isSuccess &&
          BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
            0
          )) ||
        numberClaimed === numberTotal
      );
    } catch (e) {
      return false;
    }
  }, [
    activeClaimCondition.data?.availableSupply,
    activeClaimCondition.isSuccess,
    numberClaimed,
    numberTotal,
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

  const isLoading = useMemo(() => {
    return (
      activeClaimCondition.isLoading || claimedSupply.isLoading || !editionDrop
    );
  }, [activeClaimCondition.isLoading, editionDrop, claimedSupply.isLoading]);

  const buttonLoading = useMemo(
    () => isLoading || claimIneligibilityReasons.isLoading,
    [claimIneligibilityReasons.isLoading, isLoading]
  );
  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return 'Sold Out';
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0
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
      <Stack>
        <Typography>
          <FormattedMessage
            id={'total.minted'}
            defaultMessage={'Total minted'}
          />{' '}
        </Typography>
        <Typography>
          {' '}
          {claimedSupply ? (
            <>
              {numberClaimed}

              {numberTotal || '∞'}
            </>
          ) : (
            <>
              <FormattedMessage id={'loading'} defaultMessage={'Loading'} />
              {'...'}
            </>
          )}
        </Typography>
      </Stack>

      {claimConditions.data?.length === 0 ||
      !claimConditions.data ||
      claimConditions.data?.every((cc) => cc.maxClaimableSupply === '0') ? (
        <div>
          <Typography variant={'h5'}>
            <FormattedMessage
              id={'drop.not.ready.to.mint.yet'}
              defaultMessage={
                'This drop is not ready to be minted yet. (No claim condition set)'
              }
            />
          </Typography>
        </div>
      ) : (
        <>
          <Typography>
            {' '}
            <FormattedMessage id={'quantity'} defaultMessage={'Quantity'} />
          </Typography>
          <div>
            <Button
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </Button>

            <Typography variant="h4">{quantity}</Typography>

            <Button
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= maxClaimable}
            >
              +
            </Button>
          </div>

          <div>
            {isSoldOut ? (
              <div>
                <Typography variant={'h2'}>
                  <FormattedMessage
                    id={'sold.out'}
                    defaultMessage={'Sold out'}
                  />
                </Typography>
              </div>
            ) : (
              <Button
                disabled={!canClaim || buttonLoading}
                onClick={async () => {
                  if (editionDrop) {
                    const values = {
                      tokenId,
                      quantity: String(quantity),
                      name: String(contractMetadata?.name || ' '),
                    };

                    watchTransactionDialog.open('mintEditionDrop', values);
                    const result = await editionDrop.erc1155.claim(
                      tokenId,
                      quantity
                    );

                    createNotification({
                      type: 'transaction',
                      subtype: 'mintEditionDrop',
                      values,
                      metadata: {
                        chainId,
                        hash: result.receipt.transactionHash,
                      },
                    });

                    watchTransactionDialog.watch(
                      result.receipt.transactionHash
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
          </div>
        </>
      )}
    </Box>
  );
}

export default EditionDropSection;
