import { SearchTokenAutocomplete } from '@/modules/wizard/components/forms/SearchTokenAutocomplete';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { useTokenList } from '@dexkit/ui';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { ClaimCondition } from '@thirdweb-dev/sdk';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import AllowListInput from './AllowListInput';

interface Props {
  itemIndex: number;
  network: string;
}

export function ClaimConditionForm({ itemIndex, network }: Props) {
  const tokens = useTokenList({
    chainId: NETWORK_FROM_SLUG(network)?.chainId,
    includeNative: true,
  });

  const { setFieldValue, values, errors } = useFormikContext<{
    phases: ClaimCondition[];
  }>();

  const token = useMemo(() => {
    const currencyAddress = values.phases[itemIndex].currencyAddress;

    if (currencyAddress) {
      return tokens.find(
        (t) => t.address.toLowerCase() === currencyAddress.toLowerCase(),
      );
    }
  }, [values.phases[itemIndex].currencyAddress, tokens]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Field
            component={TextField}
            name={`phases[${itemIndex}].name`}
            label={<FormattedMessage id="name" defaultMessage="Name" />}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Field
            component={TextField}
            name={`phases[${itemIndex}].startTime`}
            type={'datetime-local'}
            InputLabelProps={{ shrink: true }}
            label={
              <FormattedMessage id="start.time" defaultMessage="Start Time" />
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Field
            component={TextField}
            name={`phases[${itemIndex}].waitInSeconds`}
            type={'number'}
            label={
              <FormattedMessage
                id="wait.in.seconds"
                defaultMessage="Wait in seconds"
              />
            }
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <Field
            component={TextField}
            name={`phases[${itemIndex}].maxClaimableSupply`}
            label={
              <FormattedMessage
                id="total.items.to.claim"
                defaultMessage="Total items to claim"
              />
            }
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={() =>
                      setFieldValue(
                        `phases[${itemIndex}].maxClaimableSupply`,
                        'unlimited',
                      )
                    }
                  >
                    <FormattedMessage
                      id={'unlimited'}
                      defaultMessage={'Unlimited'}
                    />
                  </Button>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Field
            component={TextField}
            name={`phases[${itemIndex}].maxClaimablePerWallet`}
            label={
              <FormattedMessage
                id="total.items.to.claim.per.wallet"
                defaultMessage="Total items to claim per wallet"
              />
            }
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={() =>
                      setFieldValue(
                        `phases[${itemIndex}].maxClaimablePerWallet`,
                        'unlimited',
                      )
                    }
                  >
                    <FormattedMessage
                      id={'unlimited'}
                      defaultMessage={'Unlimited'}
                    />
                  </Button>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Field
            component={TextField}
            name={`phases[${itemIndex}].price`}
            label={<FormattedMessage id="Price" defaultMessage="Price" />}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <SearchTokenAutocomplete
            data={token}
            tokens={tokens}
            onChange={(tk: any) =>
              setFieldValue(`phases[${itemIndex}].currencyAddress`, tk.address)
            }
          />
        </Grid>
        {false && (
          <Grid item xs={12}>
            <AllowListInput name={`phases[${itemIndex}].snapshot`} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
