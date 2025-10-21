import { useIsMobile } from "@dexkit/core/hooks";
import Search from "@mui/icons-material/Search";

import {
  Avatar,
  Box,
  Button,
  ButtonBase,
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
import AppDialogTitle from "../../../components/AppDialogTitle";
import SearchTextField from "../../../components/SearchTextField";
import { useMultiTokenBalance } from "../../../hooks";

import { ChainId } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SwitchNetworkSelect from "../../../components/SwitchNetworkSelect";
import { useSelectImport } from "../hooks";
import SelectCoinUniswapList from "./SelectCoinUniswapList";
import SwapFeaturedUniswapTokens from "./SwapFeaturedUniswapTokens";

export interface SwapSelectCoinDialogProps {
  DialogProps: DialogProps;
  onQueryChange: (value: string) => void;
  onSelect: (token: Token) => void;
  onClearRecentTokens: () => void;
  tokens: Token[];
  chainId?: number;
  isLoadingSearch: boolean;
  recentTokens?: Token[];
  account?: string;
  provider?: providers.BaseProvider;
  featuredTokens?: Token[];
  isProviderReady?: boolean;
  onToggleChangeNetwork: () => void;
  onChangeNetwork: (chanId: ChainId) => void;
  filteredChainIds: number[];
  enableImportExterTokens?: boolean;
}

export default function SwapSelectCoinUniswapDialog({
  DialogProps,
  tokens,
  chainId,
  featuredTokens,
  recentTokens,
  account,
  provider,
  isLoadingSearch,
  filteredChainIds,
  onChangeNetwork,
  onSelect,
  onQueryChange,
  isProviderReady,
  onToggleChangeNetwork,
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

  const isMobile = useIsMobile();

  return (
    <Dialog {...DialogProps} onClose={handleClose} fullScreen={isMobile}>
      <AppDialogTitle
        title={
          <FormattedMessage id="select.token" defaultMessage="Select token" />
        }
        onClose={handleClose}
      />
      <Divider />
      <Stack spacing={2} sx={{ py: 2 }}>
        <Box sx={{ px: 2 }}>
          <Stack direction="row" spacing={2}>
            <SearchTextField
              onChange={handleChangeQuery}
              TextFieldProps={{
                fullWidth: true,
                size: "small",
                sx: { flex: 1 },
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
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
            {isProviderReady &&
              chainId &&
              (isMobile ? (
                <ButtonBase
                  sx={{
                    color: (theme) => theme.palette.text.primary,
                    borderRadius: (theme) => (theme.shape.borderRadius as any) / 2,
                    borderColor: (theme) => theme.palette.divider,
                    borderWidth: 1,
                    borderStyle: "solid",
                    px: 1,
                    py: 1,
                  }}
                  onClick={onToggleChangeNetwork}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    {NETWORKS[chainId] ? (
                      <Avatar
                        sx={{ width: "1rem", height: "1rem" }}
                        src={NETWORKS[chainId].imageUrl}
                      />
                    ) : undefined}
                    <ExpandMore />
                  </Stack>
                </ButtonBase>
              ) : (
                <SwitchNetworkSelect
                  iconOnly
                  chainId={chainId}
                  activeChainIds={filteredChainIds}
                  onChangeNetwork={onChangeNetwork}
                  SelectProps={{ size: "small" }}
                />
              ))}
          </Stack>
        </Box>
        {featuredTokens && featuredTokens.length > 0 && (
          <SwapFeaturedUniswapTokens
            onSelect={onSelect}
            chainId={chainId}
            tokens={featuredTokens}
          />
        )}
      </Stack>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        {recentTokens && recentTokens?.length > 0 && (
          <>
            <SelectCoinUniswapList
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
              onSelect={onSelect}
              isLoading={account ? tokenBalances.isLoading : false}
              showDash={!account}
            />
          </>
        )}

        <Divider />
        <SelectCoinUniswapList
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
              fetchTokenData.isPending ||
              isLoadingSearch
              : false
          }
        />
      </DialogContent>
    </Dialog>
  );
}
