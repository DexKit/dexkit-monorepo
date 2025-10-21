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
  useTheme,
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
  const theme = useTheme();
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
    <Dialog
      {...DialogProps}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth={isMobile ? false : "sm"}
      fullWidth={!isMobile}
      slotProps={{
        paper: {
          sx: {
            ...(isMobile && {
              height: "85vh",
              margin: theme.spacing(2),
              borderRadius: theme.spacing(2),
            }),
            ...(!isMobile && {
              maxHeight: "80vh",
            }),
          },
        },
      }}
    >
      <AppDialogTitle
        title={
          <FormattedMessage id="select.token" defaultMessage="Select token" />
        }
        onClose={handleClose}
      />
      <Divider />

      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: theme.zIndex.modal + 1,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stack spacing={2} sx={{ p: 2 }}>
          <SearchTextField
            onChange={handleChangeQuery}
            TextFieldProps={{
              fullWidth: true,
              size: isMobile ? "small" : "medium",
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              },
              placeholder: formatMessage({
                id: "search.for.a.coin.by.name.symbol.and.address",
                defaultMessage: "Search for a coin by name, symbol and address",
              }),
            }}
          />

          {featuredTokens && featuredTokens.length > 0 && (
            <SwapFeaturedTokens
              onSelect={onSelect}
              chainId={chainId}
              tokens={featuredTokens}
            />
          )}
        </Stack>
      </Box>

      <DialogContent
        sx={{
          px: 0,
          flex: 1,
          overflow: "auto",
          paddingTop: 0,
        }}
      >
        <Stack>
          {recentTokens && recentTokens?.length > 0 && (
            <>
              <SelectCoinList
                subHeader={
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: 'background.paper',
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <Stack
                      justifyContent="space-between"
                      alignItems="center"
                      direction="row"
                    >
                      <ListSubheader
                        sx={{ p: 0, m: 0, color: 'text.primary' }}
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
                isLoading={account ? tokenBalances.isLoading : false}
                showDash={!account}
              />
              <Divider />
            </>
          )}
          <SelectCoinList
            tokens={[...importedTokens.tokens, ...tokens]}
            onSelect={handleSelect}
            externToken={
              !isOnList && fetchTokenData.data ? fetchTokenData.data : undefined
            }
            tokenBalances={tokenBalances.data}
            showDash={!account}
            isLoading={
              account
                ? tokenBalances.isLoading ||
                fetchTokenData.isLoading ||
                isLoadingSearch
                : false
            }
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
