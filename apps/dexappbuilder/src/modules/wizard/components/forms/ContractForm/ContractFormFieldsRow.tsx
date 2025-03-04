import { AbiFragment } from '@dexkit/web3forms/types';
import { Grid } from '@mui/material';
import { memo } from 'react';
import ContractFormAccordion from './ContractFormAccordion';

export interface Props {
  abi?: AbiFragment[];
}

function ContractFormFieldsRow({ abi }: Props) {
  return (
    <Grid container spacing={2}>
      {abi?.map((f, key) => (
        <Grid item xs={12} key={key}>
          <ContractFormAccordion func={f} />
        </Grid>
      ))}
    </Grid>
  );
}

export default memo(ContractFormFieldsRow);
