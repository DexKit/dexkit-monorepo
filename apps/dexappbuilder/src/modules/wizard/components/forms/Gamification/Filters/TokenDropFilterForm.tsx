import { FormControl, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { NetworkSelectDropdown } from '@dexkit/ui/components/NetworkSelectDropdown';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { FormattedMessage } from 'react-intl';
import ChangeListener from '../../../ChangeListener';
import { SearchTokenAutocompleteWithTokens } from '../../SearchTokenAutocomplete';

interface Filter {
  chainId?: number;
  token?: string;
  dropToken?: string;
}

const FilterSchema: Yup.SchemaOf<Filter> = Yup.object().shape({
  chainId: Yup.number(),
  token: Yup.string(),
  dropToken: Yup.string(),
});

interface Props {
  onSubmit?: (item: Filter) => void;
  onChange?: (item: Filter, isValid: boolean) => void;
  item?: Filter;
}

export default function TokenDropFilterForm({
  item,
  onSubmit,
  onChange,
}: Props) {
  const { chainId } = useWeb3React();

  return (
    <Formik
      initialValues={{
        ...item,
        chainId: item?.chainId ? item?.chainId : chainId,
      }}
      onSubmit={(values) => {
        if (onSubmit) {
          onSubmit(values as Filter);
        }
      }}
      validationSchema={FilterSchema}
    >
      {({
        submitForm,
        isSubmitting,
        isValid,
        values,
        setFieldValue,
        errors,
        resetForm,
      }) => (
        <Form>
          <ChangeListener
            values={values}
            isValid={isValid}
            onChange={onChange}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <NetworkSelectDropdown
                  chainId={values.chainId}
                  onChange={(chainId) => {
                    setFieldValue('chainId', chainId);
                    setFieldValue('token', undefined);
                    setFieldValue('dropToken', undefined);
                  }}
                  labelId="Choose network"
                  label={
                    <FormattedMessage id="network" defaultMessage="Network" />
                  }
                  enableTestnet={true}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight="500" variant="body1">
                <FormattedMessage id="token" defaultMessage="Token" />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <SearchTokenAutocompleteWithTokens
                    label={
                      <FormattedMessage id="token" defaultMessage="Token" />
                    }
                    disabled={values.chainId === undefined}
                    data={{
                      address: values.token,
                      chainId: values.chainId,
                    }}
                    chainId={values.chainId}
                    onChange={(tk: any) => {
                      if (tk) {
                        setFieldValue('token', tk.address);
                      } else {
                        setFieldValue('token', undefined);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography fontWeight="500" variant="body1">
                <FormattedMessage id="drop.token" defaultMessage="Drop token" />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <SearchTokenAutocompleteWithTokens
                    label={
                      <FormattedMessage
                        id="drop.token"
                        defaultMessage="Drop token"
                      />
                    }
                    disabled={values.chainId === undefined}
                    data={{
                      address: values.dropToken,
                      chainId: values.chainId,
                    }}
                    chainId={values.chainId}
                    onChange={(tk: any) => {
                      if (tk) {
                        setFieldValue('dropToken', tk.address);
                      } else {
                        setFieldValue('dropToken', undefined);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
