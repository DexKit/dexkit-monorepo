import { useInfiniteListDeployedContracts } from '@/modules/forms/hooks';
import { getContractImplementation } from '@/modules/wizard/services';
import { inputMapping } from '@/modules/wizard/utils';
import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useScanContractAbiMutation } from '@dexkit/web3forms/hooks';
import { AbiFragment, ContractFormParams } from '@dexkit/web3forms/types';
import { normalizeAbi } from '@dexkit/web3forms/utils';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { providers } from 'ethers';
import { useFormikContext } from 'formik';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import CustomAutocomplete from './CustomAutocomplete';

export interface ContractFormAddressInputProps {
  chainId?: ChainId;
  fetchOnMount?: boolean;
}

export default function ContractFormAddressInput({
  chainId,
  fetchOnMount,
}: ContractFormAddressInputProps) {
  const { setFieldValue, values } = useFormikContext<ContractFormParams>();

  const scanContractAbiMutation = useScanContractAbiMutation();

  const { enqueueSnackbar } = useSnackbar();

  const jsonProvider = useMemo(() => {
    if (chainId) {
      return new providers.JsonRpcProvider(NETWORKS[chainId].providerRpcUrl);
    }
  }, [chainId]);

  const fetchAbi = useCallback(
    async (value: string) => {
      if (isAddress(value)) {
        try {
          let address: string = value;

          if (!values.disableProxy && jsonProvider) {
            let implementationAddress: string = '';

            try {
              implementationAddress = await getContractImplementation({
                contractAddress: value,
                provider: jsonProvider,
              });
            } catch (err) {}

            if (isAddress(implementationAddress)) {
              address = implementationAddress;
            }
          }

          let abi = await scanContractAbiMutation.mutateAsync({
            chainId: values.chainId,
            contractAddress: address,
          });

          let newAbi: AbiFragment[] = normalizeAbi(abi);

          const fields = inputMapping(newAbi);
          setFieldValue('fields', fields);
          setFieldValue('abi', newAbi);
        } catch (err) {
          enqueueSnackbar(String(err), { variant: 'error' });
        }
      }
    },
    [values.chainId, values.disableProxy, jsonProvider],
  );

  const handleChange = useCallback(
    async (value: string) => {
      await fetchAbi(value);
      setFieldValue('contractAddress', value);
    },
    [fetchAbi],
  );

  const handleRefresh = async () => {
    await fetchAbi(values.contractAddress);
  };

  useEffect(() => {
    if (fetchOnMount) {
      (async () => {
        await fetchAbi(values.contractAddress);
      })();
    }
  }, [fetchOnMount]);

  const handleChangeAutoComplete = useCallback(
    (value: string) => {
      handleChange(value);
    },
    [handleChange],
  );

  const { account } = useWeb3React();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const listDeployedContractQuery = useInfiniteListDeployedContracts({
    owner: account as string,
    page,
    name: query,
    chainId: values.chainId,
  });

  const contractList = useMemo(() => {
    const currPage = listDeployedContractQuery.data?.pages[page - 1];

    if (currPage) {
      return currPage?.items;
    }

    return [];
  }, [listDeployedContractQuery.data, page]);

  const handleChangeQuery = (value: string) => {
    setQuery(value);
  };

  return (
    <CustomAutocomplete
      isLoading={listDeployedContractQuery.isLoading}
      onChange={handleChangeAutoComplete}
      options={contractList.map((item) => ({
        label: item.name,
        value: item.contractAddress,
      }))}
      onChangeQuery={handleChangeQuery}
    >
      {(handleFocus, handleBlur) => (
        <LazyTextField
          value={values.contractAddress}
          onChange={handleChange}
          TextFieldProps={{
            label: (
              <FormattedMessage
                id="contract.address"
                defaultMessage="Contract address"
              />
            ),
            fullWidth: true,
            inputProps: { onFocus: handleFocus, onBlur: handleBlur },
            InputProps: {
              autoComplete: 'off',
              endAdornment: scanContractAbiMutation.isLoading ? (
                <InputAdornment position="end">
                  <CircularProgress color="inherit" size="1rem" />
                </InputAdornment>
              ) : (
                <IconButton
                  disabled={values.contractAddress === ''}
                  size="small"
                  color="primary"
                  onClick={handleRefresh}
                >
                  <RefreshIcon />
                </IconButton>
              ),
            },
          }}
        />
      )}
    </CustomAutocomplete>
  );
}
