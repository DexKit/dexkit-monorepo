import { NETWORK_IMAGE, NETWORK_SLUG } from "@dexkit/core/constants/networks";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, InputAdornment, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import { useAllTokenList, useAppConfig } from "../hooks";
interface Props {
  hideCollections?: boolean;
  hideTokens?: boolean;
  fullWidth?: boolean;
  isPreview?: boolean;
}

export function SearchBar(props: Props) {
  const { fullWidth, hideCollections, hideTokens, isPreview } = props;

  const { formatMessage } = useIntl();
  const { chainId } = useWeb3React();
  const router = useRouter();
  const tokens = useAllTokenList({
    includeNative: true,
    hideTestnetTokens: true,
    chainId,
    isWizardConfig: isPreview,
  });
  const appConfig = useAppConfig();
  const collections = hideCollections
    ? []
    : appConfig.collections
        ?.filter((c: any) =>
          chainId ? (c.chainId === chainId ? true : false) : true
        )
        .map((value: any) => {
          return {
            name: value.name,
            type: "Collections",
            address: value.contractAddress,
            networkImage: NETWORK_IMAGE(value.chainId),
            chainId: value.chainId,
            image: value.image,
          };
        }) || [];

  const tokenOptions = hideTokens
    ? []
    : tokens?.map((value: any) => {
        return {
          name: value.name,
          type: "Tokens",
          address: value.address,
          networkImage: NETWORK_IMAGE(value.chainId),
          chainId: value.chainId,
          image: value?.logoURI,
        };
      }) || [];

  const options = useMemo(() => {
    return collections.concat(tokenOptions);
  }, [tokenOptions, collections]);

  return (
    <Autocomplete
      id="search"
      sx={{ width: fullWidth ? "100%" : 300 }}
      options={options}
      autoHighlight
      freeSolo={true}
      getOptionLabel={(op: any) => (typeof op === "string" ? op : op.name)}
      onChange={(_change, value) => {
        if (!(typeof value === "string") && value) {
          if (value?.type === "Tokens") {
            router.push(
              `/token/${NETWORK_SLUG(value.chainId)}/${value.address}`
            );
          }

          if (value?.type === "Collections") {
            router.push(
              `/collection/${NETWORK_SLUG(value.chainId)}/${value.address}`
            );
          }
        }
      }}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar
                sx={{ width: 16, height: 16 }}
                src={option?.networkImage}
              ></Avatar>
            }
          >
            <Avatar
              alt={option?.name}
              src={`${option?.image}`}
              sx={{ width: 32, height: 32 }}
            />
          </Badge>
          <Typography sx={{ pl: 2 }}>{option.name}</Typography>
        </Box>
      )}
      groupBy={(option) => option.type}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={formatMessage({
            id: "search",
            defaultMessage: "Search",
          })}
          inputProps={{
            ...params.inputProps,
            autoComplete: "off", // disable autocomplete and autofill
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
