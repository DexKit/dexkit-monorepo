import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { Box, CircularProgress, Stack } from '@mui/material';
import {
  useClaimConditions,
  useContract,
  useSetClaimConditions,
} from '@thirdweb-dev/react';

import ThirdwebV4Provider from '@dexkit/ui/providers/ThirdwebV4Provider';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { ClaimConditionsSchema } from '../../constants/schemas';
import { ClaimConditionTypeForm } from '../../types';
import { ClaimConditionsForm } from '../form/ClaimConditionsForm';

interface Props {
  address: string;
  network: string;
  tokenId?: string;
}

function ClaimConditionsContent({ address, network, tokenId }: Props) {
  const { contract } = useContract(address);
  const { data, isLoading } = useClaimConditions(contract, tokenId, {
    withAllowList: true,
  });

  const { mutateAsync: setClaimConditions, isLoading: isLoadingSet } =
    useSetClaimConditions(contract, tokenId);

  const { enqueueSnackbar } = useSnackbar();

  const phases: ClaimConditionTypeForm[] = useMemo(() => {
    if (data) {
      return data.map((p) => {
        return {
          startTime: p.startTime.toISOString().slice(0, -1),
          name: p?.metadata?.name || '',
          waitInSeconds: p.waitInSeconds.toNumber(),
          price: Number(p.currencyMetadata.displayValue),
          maxClaimableSupply: p.maxClaimableSupply,
          maxClaimablePerWallet: p.maxClaimablePerWallet,
          currencyAddress: p.currencyAddress,
        };
      });
    }
    return [];
  }, [data]);

  return isLoading ? (
    <Box sx={{ py: 4 }}>
      <Stack
        direction="row"
        alignItems="center"
        alignContent="center"
        justifyContent="center"
      >
        <CircularProgress color="primary" size="2rem" />
      </Stack>
    </Box>
  ) : (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Formik
        initialValues={{ phases: phases }}
        onSubmit={async (values, actions) => {
          try {
            await setClaimConditions({
              phases: values.phases.map((p) => {
                return {
                  metadata: {
                    name: p.name,
                  },
                  currencyAddress: p.currencyAddress,
                  price: p.price,
                  maxClaimablePerWallet: p.maxClaimablePerWallet,
                  maxClaimableSupply: p.maxClaimableSupply,
                  startTime: new Date(p.startTime),
                  waitInSeconds: p.waitInSeconds,
                };
              }),
            });

            enqueueSnackbar(
              <FormattedMessage
                id="claim.conditions.updated.successfully"
                defaultMessage="Claim conditions updated successfully"
              />,
              {
                variant: 'success',
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right',
                },
              },
            );
          } catch (error) {
            enqueueSnackbar(
              <FormattedMessage
                id="error.updating.claim.conditions"
                defaultMessage="Error updating claim conditions"
              />,
              {
                variant: 'error',
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right',
                },
              },
            );
          } finally {
            actions.setSubmitting(false);
          }
        }}
        validationSchema={ClaimConditionsSchema}
      >
        <ClaimConditionsForm isEdit={phases.length > 0} network={network} />
      </Formik>
    </Box>
  );
}

export function ClaimConditionsContainer({ address, network, tokenId }: Props) {
  return (
    <ThirdwebV4Provider chainId={NETWORK_FROM_SLUG(network)?.chainId}>
      <ClaimConditionsContent
        address={address}
        network={network}
        tokenId={tokenId}
      />
    </ThirdwebV4Provider>
  );
}
