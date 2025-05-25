import {
  AbiFragment,
  AbiFragmentInput,
  ContractFormParams,
} from '@dexkit/web3forms/types';
import AddIcon from '@mui/icons-material/Add';
import { Button, Grid, Paper } from '@mui/material';
import { FieldArray } from 'formik';
import { FormattedMessage } from 'react-intl';
import ContractFormDefaultValueInput from './ContractFormDefaultValueInput';

function requiredField(message: string) {
  return (value: string) => {
    return !value ? message : undefined;
  };
}

export default function ContractFormDefaultValue({
  values,
  func,
  input,
}: {
  values: ContractFormParams;
  func: AbiFragment;
  input: AbiFragmentInput;
}) {
  if (input.type.endsWith('[]')) {
    return (
      <FieldArray
        name={`fields.${func.name}.input.${input.name}.defaultValue`}
        render={(helpers) => (
          <Grid container spacing={2}>
            {(
              values.fields[func.name].input[input.name].defaultValue || []
            ).map((_: any, index: number) => (
              <Grid item xs={12} key={index}>
                {input.type.startsWith('tuple') ? (
                  <Paper sx={{ p: 2 }}>
                    <ContractFormDefaultValueInput
                      func={func}
                      input={input}
                      values={values}
                      index={index}
                      isTuple
                    />
                  </Paper>
                ) : (
                  <ContractFormDefaultValueInput
                    func={func}
                    input={input}
                    values={values}
                    index={index}
                  />
                )}
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                onClick={helpers.handlePush(
                  input.type.startsWith('tuple') ? {} : '',
                )}
                startIcon={<AddIcon />}
                variant="outlined"
                color="primary"
                size="small"
              >
                <FormattedMessage id="add" defaultMessage="Add" />
              </Button>
            </Grid>
          </Grid>
        )}
      />
    );
  }

  return (
    <ContractFormDefaultValueInput
      func={func}
      input={input}
      values={values}
      isTuple={input.type.startsWith('tuple')}
    />
  );
}
