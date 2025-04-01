import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  InputAdornment,
  Stack,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";

import { Token } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import SelectPairList from "../SelectPairList";

import {
  ChainId,
  DKAPI_INVALID_ADDRESSES,
  TOKEN_ICON_URL,
  useIsMobile,
} from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import LazyTextField from "@dexkit/ui/components/LazyTextField";
import { usePlatformCoinSearch } from "@dexkit/ui/hooks/coin";
import { apiCoinToTokens } from "@dexkit/ui/utils/coin";
import TokenIcon from "@mui/icons-material/Token";
import { DEFAULT_ZRX_NETWORKS } from "../../constants";

export interface SelectPairDialogProps {
  DialogProps: DialogProps;
  baseTokens: Token[];
  quoteTokens: Token[];
  baseToken?: Token;
  quoteToken?: Token;
  onSelectPair: (baseToken: Token, quoteToken: Token) => void;
  availNetworks: number[];
  onSwitchNetwork: (chainId: ChainId) => Promise<void>;
  chainId?: ChainId;
}

export default function SelectPairDialog({
  DialogProps,
  baseToken: baseTokenParam,
  quoteToken: quoteTokenParam,
  baseTokens,
  quoteTokens,
  onSelectPair,
  availNetworks,
  onSwitchNetwork,
  chainId,
}: SelectPairDialogProps) {
  const { onClose } = DialogProps;

  const { formatMessage } = useIntl();

  const [baseToken, setBaseToken] = useState<Token | undefined>();
  const [quoteToken, setQuoteToken] = useState<Token | undefined>();

  useEffect(() => {
    setQuoteToken(quoteTokenParam);
  }, [quoteTokenParam]);

  useEffect(() => {
    setBaseToken(baseTokenParam);
  }, [baseTokenParam]);

  const handleSelectToken = useCallback((token: Token) => {
    setBaseToken(token);
  }, []);

  const handleConfirm = () => {
    if (baseToken && quoteToken) {
      onSelectPair(baseToken, quoteToken);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const isSameToken = useCallback(
    (token: Token, other: Token) => {
      return (
        token.chainId === other?.chainId &&
        isAddressEqual(token.address, other.address)
      );
    },
    [baseToken],
  );

  const handleToggleBaseToken = useCallback(
    (token: Token) => {
      return () => {
        setQuoteToken(token);
      };
    },
    [baseToken],
  );

  const [query, setQuery] = useState("");

  const handleChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const searchQuery = usePlatformCoinSearch({
    keyword: query,
    network: chainId && NETWORKS[chainId] ? NETWORKS[chainId].slug : undefined,
  });

  const filteredTokens = useMemo(() => {
    if (searchQuery.data) {
      let tokens = [...baseTokens, ...apiCoinToTokens(searchQuery.data)];
      return tokens
        .filter((t) => {
          const searchByName = t.name.search(query) > -1;
          const searchByAddress = isAddressEqual(t.address, query);
          const searchBySymbol =
            t.symbol.toLowerCase().search(query.toLowerCase()) > -1;

          return searchByName || searchByAddress || searchBySymbol;
        })
        .filter((t) => {
          return !DKAPI_INVALID_ADDRESSES.includes(t?.address);
        });
    }

    return baseTokens.filter((t) => {
      const searchByName = t.name.search(query) > -1;
      const searchByAddress = isAddressEqual(t.address, query);
      const searchBySymbol =
        t.symbol.toLowerCase().search(query.toLowerCase()) > -1;

      return searchByName || searchByAddress || searchBySymbol;
    });
  }, [query, baseTokens, searchQuery.data]);

  const networks = useMemo(() => {
    return availNetworks.map((n) => NETWORKS[n]);
  }, []);

  const isMobile = useIsMobile();

  const [showMoreNetworks, setShowMoreNetworks] = useState(false);

  const toggleNetworks = () => {
    setShowMoreNetworks((value) => !value);
  };

  return (
    <Dialog {...DialogProps} fullScreen={isMobile}>
      <AppDialogTitle
        title={
          <FormattedMessage id="select.a.pair" defaultMessage="Select a pair" />
        }
        onClose={handleClose}
      />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Grid container spacing={1} alignItems="center">
              {networks
                .filter((n) => n.testnet === undefined)
                .filter((n) => {
                  if (isMobile && !showMoreNetworks) {
                    return (
                      DEFAULT_ZRX_NETWORKS.includes(n.chainId) ||
                      chainId === n.chainId
                    );
                  }

                  return true;
                })
                .map((n) => (
                  <Grid item key={n.chainId}>
                    <Chip
                      color={chainId === n.chainId ? "primary" : undefined}
                      clickable
                      icon={
                        <Avatar
                          sx={{ height: "1rem", width: "1rem" }}
                          src={n.imageUrl}
                        />
                      }
                      label={n.name}
                      onClick={() => onSwitchNetwork(n.chainId)}
                    />
                  </Grid>
                ))}
              {isMobile && (
                <Grid item>
                  <Button
                    startIcon={!showMoreNetworks ? <AddIcon /> : <RemoveIcon />}
                    onClick={toggleNetworks}
                    size="small"
                  >
                    {showMoreNetworks ? (
                      <FormattedMessage id="Less" defaultMessage="Less" />
                    ) : (
                      <FormattedMessage id="more" defaultMessage="More" />
                    )}
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>

          <LazyTextField
            value={query}
            onChange={handleChange}
            TextFieldProps={{
              placeholder: formatMessage({
                id: "search.for.a.token.by.name.symbol.and.address",
                defaultMessage:
                  "Search for a token by name, symbol and address",
              }),
              fullWidth: true,
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Stack direction="row" alignItems="center" spacing={1}>
            {quoteTokens.map((token, index) => (
              <Chip
                key={index}
                label={token.symbol.toUpperCase()}
                clickable
                icon={
                  <Avatar
                    sx={{ width: "1rem", height: "1rem" }}
                    src={
                      token.logoURI
                        ? token.logoURI
                        : TOKEN_ICON_URL(token.address, token.chainId)
                    }
                  >
                    <TokenIcon />
                  </Avatar>
                }
                color={
                  quoteToken && isSameToken(token, quoteToken)
                    ? "primary"
                    : undefined
                }
                onClick={handleToggleBaseToken(token)}
              />
            ))}
          </Stack>
        </Stack>
      </Box>
      <DialogContent sx={{ p: 0 }} dividers>
        <SelectPairList
          onSelect={handleSelectToken}
          baseTokens={filteredTokens}
          quoteToken={quoteToken}
          baseToken={baseToken}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} variant="contained">
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
