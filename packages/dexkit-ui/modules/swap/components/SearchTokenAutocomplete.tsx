import {
  NETWORKS,
  NETWORK_NAME,
  NETWORK_SLUG,
} from "@dexkit/core/constants/networks";
import { TokenWhitelabelApp } from "@dexkit/core/types";
import { CircularProgress, Stack } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useMemo, useState } from "react";
import { useSearchSwapTokens } from "../hooks";

interface Props {
  label?: string | React.ReactNode;
  chainId?: number;
  data?: any;
  disabled?: boolean;
  onChange?: any;
  featuredTokens?: TokenWhitelabelApp[];
}

export function SearchTokenAutocomplete(props: Props) {
  const { data, label, onChange, chainId, disabled, featuredTokens } = props;
  const [search, setSearch] = useState<string>();
  const tokensQuery = useSearchSwapTokens({
    keyword: search,
    network: NETWORK_SLUG(chainId),
    featuredTokens,
  });
  const formValue = data;

  const assets = useMemo(() => {
    return (
      tokensQuery.tokens?.map((value) => {
        return {
          name: (value.name as string) || "",
          address: value.address.toLowerCase(),
          symbol: value.symbol,
          network: Object.values(NETWORKS).find(
            (n) => n.chainId === value?.chainId
          )?.name,
          chainId: value.chainId as number,
          logoURI: value?.logoURI,
          decimals: value.decimals,
        };
      }) || []
    );
  }, [formValue, tokensQuery.tokens, chainId]);

  return (
    <Autocomplete
      id="search-token"
      disabled={disabled}
      value={formValue || null}
      options={assets}
      autoHighlight
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
          sx={{
            "& > img": { mr: 2, flexShrink: 0 },
            color: "text.primary"
          }}
          {...props}
        >
          <img loading="lazy" width="20" src={`${option.logoURI}`} alt="" />
          {NETWORK_NAME(option.chainId)} - {option.name} -
          {option?.symbol.toUpperCase() || ""}
        </Box>
      )}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            label={label || "Search Token"}
            onChange={(ev) => setSearch(ev.currentTarget.value)}
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
              endAdornment: (
                <React.Fragment>
                  {tokensQuery.isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
          {false && (
            <Box sx={{ p: 2 }}>
              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                alignContent={"center"}
                flexDirection={"row"}
              >
                <img
                  loading="lazy"
                  width="25"
                  src={`${formValue.logoURI}`}
                  alt=""
                />
                {formValue.chainId && (
                  <Box sx={{ pl: 1 }}>
                    {NETWORK_NAME(formValue.chainId)} - {formValue.name} -
                    {formValue?.symbol?.toUpperCase()}
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
