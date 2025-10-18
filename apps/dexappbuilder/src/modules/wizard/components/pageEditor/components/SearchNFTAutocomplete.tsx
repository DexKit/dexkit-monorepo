import { useIsMobile } from '@dexkit/core';
import { getChainName } from '@dexkit/core/utils/blockchain';
import { useSearchAssets } from '@dexkit/ui/modules/nft/hooks';
import { CircularProgress, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { CellPluginComponentProps } from '@react-page/editor';
import React, { useState } from 'react';
import { NETWORKS } from '../../../../../constants/chain';

interface Props {
  data: CellPluginComponentProps<Partial<any>>;
}

export function SearchNFTAutocomplete(props: Props) {
  const { data } = props;
  const [search, setSearch] = useState<string>();
  const searchQuery = useSearchAssets(search);
  const formValue = data.data;
  const isMobile = useIsMobile();

  const assets =
    searchQuery?.data?.map((value) => {
      return {
        name: (value.name as string) || '',
        contractAddress: value.address,
        id: value.tokenId,
        network: Object.values(NETWORKS).find((n) => n.slug === value.networkId)
          ?.name,
        chainId: value.chainId as number,
        image: value.imageUrl,
      };
    }) || [];

  return (
    <Autocomplete
      id="search-nft"
      sx={{
        width: '100%',
        '& .MuiAutocomplete-inputRoot': {
          fontSize: isMobile ? '0.9rem' : undefined
        }
      }}
      options={assets}
      autoHighlight
      filterOptions={(x) => x}
      onChange={(_change, value) => {
        if (value) {
          data.onChange({
            name: value.name,
            contractAddress: value.contractAddress,
            network: value.network,
            chainId: value.chainId,
            image: value.image,
            id: value.id,
          });
        }
      }}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{
            '& > img': { mr: 2, flexShrink: 0 },
            fontSize: isMobile ? '0.85rem' : undefined,
            py: isMobile ? 1 : undefined
          }}
          {...props}
        >
          <img loading="lazy" width={isMobile ? "16" : "20"} src={`${option.image}`} alt="" />
          {getChainName(option.chainId)} - ({option.name}) - #{option.id || ''}
        </Box>
      )}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            label="Search a NFT"
            size={isMobile ? "small" : "medium"}
            onChange={(ev: any) => setSearch(ev.currentTarget.value)}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
              endAdornment: (
                <React.Fragment>
                  {searchQuery.isLoading ? (
                    <CircularProgress color="inherit" size={isMobile ? 16 : 20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
          <Box sx={{ p: isMobile ? 1 : 2 }}>
            {formValue && (
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                alignContent={'center'}
                flexDirection={'row'}
                spacing={1}
                sx={{
                  fontSize: isMobile ? '0.85rem' : undefined,
                }}
              >
                <img
                  loading="lazy"
                  width={isMobile ? "40" : "50"}
                  src={`${formValue.image}`}
                  alt=""
                />
                {formValue.chainId && (
                  <Box>
                    {getChainName(formValue.chainId)} - ({formValue.name}) - #
                    {formValue.id}
                  </Box>
                )}
              </Stack>
            )}
          </Box>
        </>
      )}
    />
  );
}
