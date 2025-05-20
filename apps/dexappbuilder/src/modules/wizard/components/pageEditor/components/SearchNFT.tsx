import { useIsMobile } from '@dexkit/core';
import { getChainName } from '@dexkit/core/utils/blockchain';
import { CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { NETWORKS } from '../../../../../constants/chain';

import { useSearchAssets } from '@dexkit/ui/modules/nft/hooks';
import { CollectionUniformItem } from './CollectionAutocompleteUniform';

interface Props {
  disabled: boolean;
  textSearch?: string;
  collections?: CollectionUniformItem[];
}

export function SearchNFT(props: Props) {
  const { disabled, textSearch, collections } = props;
  const router = useRouter();
  const [search, setSearch] = useState<string>();
  const searchQuery = useSearchAssets(search, collections);
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
      id="search-nft-component"
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
        if (value && !disabled) {
          const slug = Object.values(NETWORKS).find(
            (n) => Number(n.chainId) === Number(value.chainId),
          )?.slug;

          router.push(`/asset/${slug}/${value.contractAddress}/${value.id}`);
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
            label={textSearch || 'Search a NFT'}
            size={isMobile ? "small" : "medium"}
            onChange={(ev) => setSearch(ev.currentTarget.value)}
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
        </>
      )}
    />
  );
}
