import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';

import { NetworkSelectDropdown } from '@dexkit/ui/components/NetworkSelectDropdown';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { FormattedMessage } from 'react-intl';
import ChangeListener from '../../../ChangeListener';
import { SearchTokenAutocompleteWithTokens } from '../../SearchTokenAutocomplete';
import { Conditions } from '../constants/conditions';

interface SwapFilter {
  chainId?: number;
  tokenInAddress?: string;
  conditionIn?: string;
  amountIn?: number;
  tokenOutAddress?: string;
  amountOut?: number;
  conditionOut?: string;
}

const SwapFilterSchema: Yup.SchemaOf<SwapFilter> = Yup.object().shape({
  chainId: Yup.number(),
  tokenInAddress: Yup.string(),
  conditionIn: Yup.string(),
  amountIn: Yup.number(),
  tokenOutAddress: Yup.string(),
  amountOut: Yup.number(),
  conditionOut: Yup.string(),
});

interface Props {
  onSubmit?: (item: SwapFilter) => void;
  onChange?: (item: SwapFilter, isValid: boolean) => void;
  item?: SwapFilter;
}

export default function SwapFilterForm({ item, onSubmit, onChange }: Props) {
  const { chainId } = useWeb3React();

  return (
    <Formik
      initialValues={{
        ...item,
        chainId: item?.chainId ? item?.chainId : chainId,
      }}
      onSubmit={(values) => {
        if (onSubmit) {
          onSubmit(values as SwapFilter);
        }
      }}
      validationSchema={SwapFilterSchema}
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
                    setFieldValue('tokenOutAddress', undefined);
                    setFieldValue('tokenInAddress', undefined);
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
                <FormattedMessage
                  id="input.token"
                  defaultMessage="Input token"
                />
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
                      address: values.tokenInAddress,
                      chainId: values.chainId,
                    }}
                    chainId={values.chainId}
                    onChange={(tk: any) => {
                      if (tk) {
                        setFieldValue('tokenInAddress', tk.address);
                      } else {
                        setFieldValue('tokenInAddress', undefined);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="condition-amount-in-select-label">
                      <FormattedMessage
                        id="amount.condition"
                        defaultMessage="Amount condition"
                      />
                    </InputLabel>
                    <Select
                      MenuProps={{
                        slotProps: {
                          paper: {
                            style: { width: 'fit-content' },
                          },
                        },
                      }}
                      labelId="condition-amount-in-select-label"
                      id="demo-simple-select"
                      value={values.conditionIn}
                      label={
                        <FormattedMessage
                          id="amount.condition"
                          defaultMessage="Amount condition"
                        />
                      }
                      onChange={(ev) =>
                        setFieldValue('conditionIn', ev.target.value)
                      }
                    >
                      {Conditions.map((v, i) => (
                        <MenuItem value={v.symbol} key={i}>
                          {v.symbol} {v.sign}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Field
                    component={TextField}
                    type="number"
                    fullWidth
                    label={
                      <FormattedMessage
                        id="token.amount"
                        defaultMessage="Token amount"
                      />
                    }
                    InputProps={{ min: 0 }}
                    placeholder="e.g., 100"
                    name="amountIn"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography fontWeight="500" variant="body1">
                <FormattedMessage
                  id="output.token"
                  defaultMessage="Output token"
                />
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
                      address: values.tokenOutAddress,
                      chainId: values.chainId,
                    }}
                    chainId={values.chainId}
                    onChange={(tk: any) => {
                      if (tk) {
                        setFieldValue('tokenOutAddress', tk.address);
                      } else {
                        setFieldValue('tokenOutAddress', undefined);
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="condition-amount-out-select-label">
                      <FormattedMessage
                        id="amount.condition"
                        defaultMessage="Amount condition"
                      />
                    </InputLabel>
                    <Select
                      labelId="condition-amount-out-select-label"
                      id="select-amount-out-id"
                      value={values.conditionOut}
                      label={
                        <FormattedMessage
                          id="amount.condition"
                          defaultMessage="Amount condition"
                        />
                      }
                      onChange={(ev) =>
                        setFieldValue('conditionOut', ev.target.value)
                      }
                    >
                      {Conditions.map((v, i) => (
                        <MenuItem value={v.symbol} key={i}>
                          {v.symbol} {v.sign}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Field
                    component={TextField}
                    type="number"
                    fullWidth
                    label={
                      <FormattedMessage
                        id="token.amount"
                        defaultMessage="Token amount"
                      />
                    }
                    InputProps={{ min: 0 }}
                    placeholder="e.g., 100"
                    name="amountOut"
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
