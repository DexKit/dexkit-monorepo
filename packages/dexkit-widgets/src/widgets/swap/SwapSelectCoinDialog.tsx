import { useIsMobile } from "@dexkit/core/hooks";
import Search from "@mui/icons-material/Search";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  InputAdornment,
  ListSubheader,
  Stack,
} from "@mui/material";
import type { providers } from "ethers";
import { FormattedMessage, useIntl } from "react-intl";
import AppDialogTitle from "../../components/AppDialogTitle";
import SearchTextField from "../../components/SearchTextField";
import SelectCoinList from "../../components/SelectCoinList";
import { useMultiTokenBalance } from "../../hooks";

import { Token } from "@dexkit/core/types";
import SwapFeaturedTokens from "./SwapFeaturedTokens";

import { useSelectImport } from "./hooks";

export interface SwapSelectCoinDialogProps {
  DialogProps: DialogProps;
  onQueryChange: (value: string) => void;
  onSelect: (token: Token, isExtern?: boolean) => void;
  onClearRecentTokens: () => void;
  tokens: Token[];
  chainId?: number;
  isLoadingSearch: boolean;
  recentTokens?: Token[];
  account?: string;
  provider?: providers.BaseProvider;
  featuredTokens?: Token[];
  enableImportExterTokens?: boolean;
}

export default function SwapSelectCoinDialog({
  DialogProps,
  tokens,
  chainId,
  featuredTokens,
  recentTokens,
  account,
  provider,
  isLoadingSearch,
  onSelect,
  onQueryChange,
  onClearRecentTokens,
  enableImportExterTokens,
}: SwapSelectCoinDialogProps) {
  const { onClose } = DialogProps;

  const { formatMessage } = useIntl();

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const isMobile = useIsMobile();

  const {
    fetchTokenData,
    handleChangeQuery,
    handleSelect,
    importedTokens,
    isOnList,
  } = useSelectImport({
    chainId,
    onQueryChange,
    onSelect,
    tokens,
    enableImportExterTokens,
  });

  const tokenBalances = useMultiTokenBalance({
    tokens: [...importedTokens.tokens, ...tokens],
    account,
    provider,
  });

  return (
    <Dialog {...DialogProps} onClose={handleClose} fullScreen={isMobile}>
      <AppDialogTitle
        title={
          <FormattedMessage id="select.token" defaultMessage="Select token" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ px: 0 }}>
        <Stack>
          <Stack spacing={2} sx={{ pb: 2 }}>
            <Box sx={{ px: 2 }}>
              <SearchTextField
                onChange={handleChangeQuery}
                TextFieldProps={{
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="primary" />
                      </InputAdornment>
                    ),
                  },
                  placeholder: formatMessage({
                    id: "search.for.a.coin.by.name.symbol.and.address",
                    defaultMessage:
                      "Search for a coin by name, symbol and address",
                  }),
                }}
              />
            </Box>
            {featuredTokens && featuredTokens.length > 0 && (
              <SwapFeaturedTokens
                onSelect={onSelect}
                chainId={chainId}
                tokens={featuredTokens}
              />
            )}
          </Stack>
          {recentTokens && recentTokens?.length > 0 && (
            <>
              <Divider />
              <SelectCoinList
                subHeader={
                  <Box
                    sx={{
                      px: 2,
                    }}
                  >
                    <Stack
                      justifyContent="space-between"
                      alignItems="center"
                      direction="row"
                    >
                      <ListSubheader
                        sx={{ p: 0, m: 0 }}
                        component="div"
                        disableSticky
                      >
                        <FormattedMessage id="recent" defaultMessage="Recent" />
                      </ListSubheader>

                      <Button
                        onClick={onClearRecentTokens}
                        size="small"
                        color="primary"
                      >
                        <FormattedMessage id="clear" defaultMessage="Clear" />
                      </Button>
                    </Stack>
                  </Box>
                }
                tokens={recentTokens}
                tokenBalances={tokenBalances.data}
                onSelect={handleSelect}
                isLoading={tokenBalances.isLoading}
              />
            </>
          )}
          <Divider />
          <SelectCoinList
            tokens={[...importedTokens.tokens, ...tokens]}
            onSelect={handleSelect}
            externToken={
              !isOnList && fetchTokenData.data ? fetchTokenData.data : undefined
            }
            tokenBalances={tokenBalances.data}
            isLoading={
              tokenBalances.isLoading ||
              fetchTokenData.isLoading ||
              isLoadingSearch
            }
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
