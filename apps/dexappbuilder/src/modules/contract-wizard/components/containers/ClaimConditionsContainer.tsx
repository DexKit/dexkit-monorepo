import { Box, CircularProgress, Stack } from '@mui/material';
import {
  useClaimConditions,
  useContract,
  useSetClaimConditions,
} from '@thirdweb-dev/react';
import { Formik } from 'formik';
import { useMemo } from 'react';
import { ClaimConditionsSchema } from '../../constants/schemas';
import { ClaimConditionTypeForm } from '../../types';
import { ClaimConditionsForm } from '../form/ClaimConditionsForm';

interface Props {
  address: string;
  network: string;
  tokenId?: string;
}

export function ClaimConditionsContainer({ address, network, tokenId }: Props) {
  const { contract } = useContract(address);
  const { data, isLoading } = useClaimConditions(contract, tokenId, {
    withAllowList: true,
  });

  const { mutateAsync: setClaimConditions, isLoading: isLoadingSet } =
    useSetClaimConditions(contract, tokenId);

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
    <Formik
      initialValues={{ phases: phases }}
      onSubmit={async (values, actions) => {
        await setClaimConditions({
          phases: values.phases.map((p) => {
            return {
              metadata: {
                name: p.name,
              },
              currencyAddress: p.currencyAddress,
              price: p.price, // The price of the token in the currency specified above
              maxClaimablePerWallet: p.maxClaimablePerWallet, // The maximum number of tokens a wallet can claim
              maxClaimableSupply: p.maxClaimableSupply, // The total number of tokens that can be claimed in this phase
              startTime: new Date(p.startTime), // When the phase starts (i.e. when users can start claiming tokens)
              waitInSeconds: p.waitInSeconds, // The period of time users must wait between repeat claims
            };
          }),
        });
        actions.setSubmitting(false);
      }}
      validationSchema={ClaimConditionsSchema}
    >
      <ClaimConditionsForm isEdit={phases.length > 0} network={network} />
    </Formik>
  );
}
