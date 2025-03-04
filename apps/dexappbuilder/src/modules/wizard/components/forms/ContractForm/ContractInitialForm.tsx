import { getContractImplementation } from '@/modules/wizard/services';
import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { parseChainId } from '@dexkit/core/utils';
import { useActiveChainIds } from '@dexkit/ui';
import { useJsonRpcProvider } from '@dexkit/ui/modules/wizard/hooks';
import { AbiFragment, ContractFormParams } from '@dexkit/web3forms/types';
import { useAsyncMemo } from '@dexkit/widgets/src/hooks';
import {
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
} from '@mui/material';

import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { Field, useFormikContext } from 'formik';
import { Checkbox, Select } from 'formik-mui';
import { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import ContractFormAbiInput from './ContractFormAbiInput';
import ContractFormAddressInput from './ContractFormAddressInput';

export interface Props {
  abi?: AbiFragment[];
  chainId?: ChainId;
  fetchOnMount?: boolean;
}

function ContractInitialForm({ abi, chainId, fetchOnMount }: Props) {
  const { values } = useFormikContext<ContractFormParams>();
  const { activeChainIds } = useActiveChainIds();

  const rpcJsonQuery = useJsonRpcProvider({ chainId: values.chainId });

  const isProxyContract = useAsyncMemo(
    async () => {
      if (values.contractAddress && rpcJsonQuery.data) {
        try {
          const implAddr = await getContractImplementation({
            provider: rpcJsonQuery.data,
            contractAddress: values.contractAddress,
          });
          return isAddress(implAddr);
        } catch (err) {}
      }

      return false;
    },
    false,
    [values.contractAddress, rpcJsonQuery.data],
  );

  return (
    <Grid container spacing={2}>
      {isProxyContract && (
        <Grid item xs={12}>
          <FormControlLabel
            label={
              <FormattedMessage
                id="disable.proxy"
                defaultMessage="Disable proxy"
              />
            }
            control={
              <Field type="checkbox" component={Checkbox} name="disableProxy" />
            }
          />
        </Grid>
      )}

      <Grid item>
        <FormControl>
          <InputLabel shrink>
            <FormattedMessage id="network" defaultMessage="Network" />
          </InputLabel>
          <Field
            component={Select}
            type="number"
            name="chainId"
            InputLabelProps={{ shrink: true }}
            label={<FormattedMessage id="network" defaultMessage="Network" />}
            fullWidth
          >
            {Object.keys(NETWORKS)
              .filter((n) => activeChainIds.includes(Number(n)))
              .map((key) => (
                <MenuItem key={key} value={key}>
                  {NETWORKS[parseChainId(key)].name}
                </MenuItem>
              ))}
          </Field>
        </FormControl>
      </Grid>
      <Grid item xs>
        <ContractFormAddressInput
          chainId={chainId}
          fetchOnMount={fetchOnMount}
        />
      </Grid>
      <Grid item xs={12}>
        <ContractFormAbiInput abiStr={JSON.stringify(abi, null, 2) || ''} />
      </Grid>
    </Grid>
  );
}

export default memo(ContractInitialForm);
