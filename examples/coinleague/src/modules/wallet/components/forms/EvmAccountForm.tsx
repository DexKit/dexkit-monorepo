import PasteIconButton from '@/modules/common/components/PasteIconButton';
import { ChainId } from '@/modules/common/constants/enums';
import { useDebounce } from '@/modules/common/hooks/misc';
import { CircularProgress, InputAdornment, Stack } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { Field, Form, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAccountEns } from '../../hooks/blockchain';

interface Props {
  disableEditAddress?: boolean;
}

export default function EvmAccountForm({ disableEditAddress }: Props) {
  const { provider, chainId } = useWeb3React();

  const { values, setFieldValue } = useFormikContext<{ address: string }>();

  const lazyAddress = useDebounce<string>(values.address, 500);

  const ensQuery = useAccountEns({
    provider,
    account: lazyAddress,
    chainId: chainId as ChainId,
    disabled: disableEditAddress,
  });

  useEffect(() => {
    if (ensQuery.data && !disableEditAddress) {
      setFieldValue('name', ensQuery.data);
    }
  }, [ensQuery.data, disableEditAddress]);

  const handlePaste = (data: string) => {
    setFieldValue('address', data);
  };

  return (
    <Form>
      <Stack spacing={2}>
        <Field
          label={<FormattedMessage id="address" defaultMessage="Address" />}
          component={TextField}
          name="address"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <PasteIconButton onPaste={handlePaste} />
              </InputAdornment>
            ),
          }}
          disabled={disableEditAddress}
        />

        <Field
          label={<FormattedMessage id="name" defaultMessage="Name" />}
          component={TextField}
          name="name"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {ensQuery.isFetching &&
                ensQuery.isLoading &&
                ensQuery.isPaused ? (
                  <CircularProgress color="inherit" size="1rem" />
                ) : null}
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Form>
  );
}
