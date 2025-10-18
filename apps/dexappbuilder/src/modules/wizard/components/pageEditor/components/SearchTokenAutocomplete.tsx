import { useSearchSwapTokens } from '@/modules/swap/hooks';
import { useIsMobile } from '@dexkit/core';
import { isAddressEqual } from '@dexkit/core/utils';
import { getChainName, getChainSlug } from '@dexkit/core/utils/blockchain';
import { CircularProgress, Stack, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import React, { useMemo, useState } from 'react';
import { Token } from 'src/types/blockchain';
import { NETWORKS } from '../../../../../constants/chain';

interface Props {
  label?: string | React.ReactNode;
  chainId?: number;
  data?: any;
  disabled?: boolean;
  onChange?: any;
  featuredTokens?: Token[];
  size?: TextFieldProps['size'];
}

export function SearchTokenAutocomplete(props: Props) {
  const { data, label, onChange, chainId, disabled, featuredTokens, size: propSize } = props;
  const [search, setSearch] = useState<string>();
  const isMobile = useIsMobile();
  const size = propSize || (isMobile ? "small" : "medium");

  const tokensQuery = useSearchSwapTokens({
    keyword: search,
    network: getChainSlug(chainId),
    featuredTokens:
      featuredTokens && chainId
        ? featuredTokens.filter((tk) => tk.chainId === chainId)
        : featuredTokens,
  });

  const assets = useMemo(() => {
    return (
      tokensQuery.tokens?.map((value: any) => {
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
  }, [tokensQuery.tokens, chainId]);

  const formValue = useMemo(() => {
    if (assets && data) {
      return assets.find(
        (a: any) =>
          isAddressEqual(a.address, data?.address) &&
          data?.chainId === a.chainId,
      );
    }
  }, [assets, data]);

  return (
    <Autocomplete
      id="search-token"
      disabled={disabled}
      value={formValue || null}
      options={assets}
      autoHighlight
      size={size}
      isOptionEqualToValue={(op, val) =>
        op?.chainId === val?.chainId &&
        op?.address?.toLowerCase() === val?.address?.toLowerCase()
      }
      filterOptions={(x) => x}
      onChange={(_change, value) => {
        if (
          value &&
          onChange &&
          (chainId !== undefined ? value.chainId === chainId : true)
        ) {
          onChange({
            name: value.name,
            address: value.address,
            network: value.network,
            chainId: value.chainId,
            symbol: value.symbol,
            decimals: value.decimals,
            logoURI: value?.logoURI,
          });
        } else {
          onChange(undefined);
        }
      }}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img loading="lazy" width={isMobile ? "16" : "20"} src={`${option.logoURI}`} alt="" />
          <Typography variant={isMobile ? "body2" : "body1"} component="span" sx={{ ml: 1 }}>
            {getChainName(option.chainId)} - {option.name} -
            {option?.symbol.toUpperCase() || ''}
          </Typography>
        </Box>
      )}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            label={label || 'Search Token'}
            onChange={(ev: any) => setSearch(ev.currentTarget.value)}
            size={size}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'off', // disable autocomplete and autofill
              endAdornment: (
                <React.Fragment>
                  {tokensQuery.isLoading ? (
                    <CircularProgress color="inherit" size={isMobile ? 16 : 20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
          {false && (
            <Box sx={{ p: isMobile ? 1 : 2 }}>
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                alignContent={'center'}
                flexDirection={'row'}
              >
                <img
                  loading="lazy"
                  width={isMobile ? "20" : "25"}
                  src={`${formValue?.logoURI}`}
                  alt=""
                />
                {formValue?.chainId && (
                  <Box sx={{ pl: 1 }}>
                    <Typography variant={isMobile ? "body2" : "body1"}>
                      {getChainName(formValue?.chainId)} - {formValue?.name} -
                      {formValue?.symbol?.toUpperCase()}
                    </Typography>
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
