import { NETWORKS } from '@dexkit/core/constants/networks';
import { isAddressEqual } from '@dexkit/core/utils';
import { getChainName } from '@dexkit/core/utils/blockchain';
import { useTokenList } from '@dexkit/ui';
import { Avatar, InputAdornment, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Token } from 'src/types/blockchain';

interface Props {
  label?: string | React.ReactNode;
  chainId?: number;
  data?: any;
  disabled?: boolean;
  onChange?: any;
  tokens?: Token[];
}

export function SearchTokenAutocomplete(props: Props) {
  const { data, label, onChange, chainId, disabled, tokens } = props;

  const [search, setSearch] = useState<string>();

  const assets = useMemo(() => {
    if (search) {
      return (
        tokens
          ?.filter((tk) => {
            if (chainId) {
              return tk.chainId === chainId;
            } else {
              return true;
            }
          })
          ?.filter(
            (v) =>
              v.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
              v.symbol.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
              v.address.toLowerCase().indexOf(search.toLowerCase()) !== -1,
          )
          ?.map((value) => {
            return {
              name: (value.name as string) || '',
              address: value.address.toLowerCase(),
              symbol: value.symbol,
              network: Object.values(NETWORKS).find(
                (n) => n.chainId === value?.chainId,
              )?.name,
              chainId: value.chainId as number,
              logoURI: value?.logoURI,
              decimals: value.decimals,
            };
          }) || []
      );
    }

    return (
      tokens
        ?.filter((tk) => {
          if (chainId) {
            return tk.chainId === chainId;
          } else {
            return true;
          }
        })
        .map((value) => {
          return {
            name: (value.name as string) || '',
            address: value.address.toLowerCase(),
            symbol: value.symbol,
            network: Object.values(NETWORKS).find(
              (n) => n.chainId === value?.chainId,
            )?.name,
            chainId: value.chainId as number,
            logoURI: value?.logoURI,
            decimals: value.decimals,
          };
        }) || []
    );
  }, [chainId, tokens, search]);

  return (
    <Autocomplete
      id="search-token"
      disabled={disabled}
      value={data}
      defaultValue={data}
      options={assets.sort((a, b) => {
        if (a.name && b.name) {
          return a.name.localeCompare(b.name);
        }

        return 0;
      })}
      fullWidth
      autoHighlight
      isOptionEqualToValue={(op, val) =>
        op?.chainId === val?.chainId &&
        isAddressEqual(op?.address, val?.address)
      }
      onChange={(_change, value) => {
        if (
          value &&
          onChange &&
          (chainId !== undefined ? value.chainId === chainId : true)
        ) {
          onChange(value);
        } else {
          onChange(undefined);
        }
      }}
      getOptionLabel={(option) => {
        return `${option.name} (${
          option?.symbol.toUpperCase() || ''
        }) ${getChainName(option.chainId)}`;
      }}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0, borderRadius: '50%' } }}
          {...props}
        >
          <img loading="lazy" width="20" src={`${option.logoURI}`} alt="" />
          {option.name} ({option?.symbol.toUpperCase() || ''}){' '}
          {getChainName(option.chainId)}
        </Box>
      )}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: data ? (
                <InputAdornment position="start">
                  <Avatar
                    sx={{ height: '1rem', width: '1rem' }}
                    src={data?.logoURI}
                  />
                </InputAdornment>
              ) : undefined,
            }}
            label={
              data ? (
                <FormattedMessage id="Token" defaultMessage="Token" />
              ) : (
                <FormattedMessage
                  id="Search token"
                  defaultMessage="Search token"
                />
              )
            }
            fullWidth
            onChange={(ev) => setSearch(ev.currentTarget.value)}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'off', // disable autocomplete and autofill
            }}
          />
          {false && (
            <Box sx={{ p: 2 }}>
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                alignContent={'center'}
                flexDirection={'row'}
              >
                <img loading="lazy" width="25" src={`${data.logoURI}`} alt="" />
                {data.chainId && (
                  <Box sx={{ pl: 1 }}>
                    {data.name} ({data?.symbol?.toUpperCase()}){' '}
                    {getChainName(data.chainId)}
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </>
      )}
    />
  );
}

export function SearchTokenAutocompleteWithTokens(props: Props) {
  const { data, chainId } = props;

  const tokens = useTokenList({ chainId, includeNative: true });

  const formValue = useMemo(() => {
    const token = tokens.find(
      (tk) =>
        tk?.address?.toLowerCase() === data?.address?.toLowerCase() &&
        tk?.chainId === data?.chainId,
    );

    if (token) {
      return {
        name: (token.name as string) || '',
        address: token.address.toLowerCase(),
        symbol: token.symbol,
        network: Object.values(NETWORKS).find(
          (n) => n.chainId === token?.chainId,
        )?.name,
        chainId: token.chainId as number,
        logoURI: token?.logoURI,
        decimals: token.decimals,
      };
    }
  }, [data, tokens]);

  const orderedTokens = useMemo(() => {
    return tokens.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }, [tokens]);

  return (
    <SearchTokenAutocomplete
      {...props}
      data={formValue}
      tokens={orderedTokens}
    />
  );
}
