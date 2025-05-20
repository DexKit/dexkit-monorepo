import { getContractImplementation } from '@/modules/wizard/services';
import { ChainId, useIsMobile } from '@dexkit/core';
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
  Typography,
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
  const isMobile = useIsMobile();

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
        } catch (err) { }
      }

      return false;
    },
    false,
    [values.contractAddress, rpcJsonQuery.data],
  );

  return (
    <Grid container spacing={isMobile ? 0.5 : 2}>
      {isProxyContract && (
        <Grid item xs={12}>
          <FormControlLabel
            label={
              <Typography variant={isMobile ? "caption" : "body2"}>
                <FormattedMessage
                  id="disable.proxy"
                  defaultMessage="Disable proxy"
                />
              </Typography>
            }
            control={
              <Field type="checkbox" component={Checkbox} name="disableProxy" size={isMobile ? "small" : "medium"} />
            }
            sx={isMobile ? { margin: '-8px 0 -8px -8px' } : {}}
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography
          variant={isMobile ? "caption" : "subtitle1"}
          fontWeight="500"
          sx={isMobile ? {
            margin: '0 0 2px 0',
            fontSize: '0.85rem',
            marginLeft: '-4px'
          } : {}}
        >
          <FormattedMessage id="contract" defaultMessage="Contract" />
        </Typography>
      </Grid>

      <Grid item xs={12} md={isMobile ? 12 : 3} sx={isMobile ? { pb: 0.5, pt: 0 } : {}}>
        <FormControl fullWidth size={isMobile ? "small" : "medium"} sx={isMobile ? {
          '& .MuiInputBase-root': {
            minHeight: '35px',
            fontSize: '0.85rem'
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.85rem'
          }
        } : {}}>
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
            size={isMobile ? "small" : "medium"}
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
      <Grid item xs={12} md={isMobile ? 12 : 9} sx={isMobile ? { py: 0.5 } : {}}>
        <ContractFormAddressInput
          chainId={chainId}
          fetchOnMount={fetchOnMount}
        />
      </Grid>
      <Grid item xs={12} sx={isMobile ? { pt: 0.5 } : {}}>
        <ContractFormAbiInput abiStr={JSON.stringify(abi, null, 2) || ''} />
      </Grid>
    </Grid>
  );
}

export default memo(ContractInitialForm);
