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
  useMediaQuery,
  useTheme,
  useColorScheme,
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
import { useExchangeContext } from "../../hooks";

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
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isMobile = useIsMobile();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { variant, glassSettings } = useExchangeContext();
  const isGlassVariant = variant === "glass";
  const isDarkMode = mode === 'dark';
  const textColor = glassSettings?.textColor || (isDarkMode ? '#ffffff' : theme.palette.text.primary);

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
    [baseToken]
  );

  const handleToggleBaseToken = useCallback(
    (token: Token) => {
      return () => {
        setQuoteToken(token);
      };
    },
    [baseToken]
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

  const [showMoreNetworks, setShowMoreNetworks] = useState(false);

  const toggleNetworks = () => {
    setShowMoreNetworks((value: any) => !value);
  };

  return (
    <Dialog
      {...DialogProps}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          ...(isMobile && {
            height: { xs: '95vh', sm: '90vh' },
            margin: theme.spacing(1),
            borderRadius: Number(theme.shape.borderRadius) * 2,
          }),
          ...(!isMobile && {
            maxHeight: { md: '80vh', lg: '75vh' },
            minWidth: { sm: theme.spacing(60), md: theme.spacing(70) },
          }),
        },
      }}
    >
      <AppDialogTitle
        title={
          <FormattedMessage id="select.a.pair" defaultMessage="Select a pair" />
        }
        onClose={handleClose}
        sx={{
          px: { xs: theme.spacing(1.5), sm: theme.spacing(2), md: theme.spacing(3) },
          py: { xs: theme.spacing(1), sm: theme.spacing(1.5) },
          ...(isGlassVariant && {
            color: textColor,
            '& .MuiTypography-root': {
              color: textColor,
            },
          }),
        }}
      />
      <Divider />

      <Box
        sx={{
          p: { xs: theme.spacing(1.5), sm: theme.spacing(2), md: theme.spacing(3) },
          ...(isMobile && {
            position: 'sticky',
            top: 0,
            zIndex: theme.zIndex.modal + 1,
            backgroundColor: isGlassVariant 
              ? 'rgba(255, 255, 255, 0.1)' 
              : (isDarkMode ? theme.palette.grey[900] : theme.palette.background.paper),
            ...(isGlassVariant && {
              backdropFilter: 'blur(25px) saturate(200%) brightness(1.08)',
              WebkitBackdropFilter: 'blur(25px) saturate(200%) brightness(1.08)',
            }),
            borderBottom: `${theme.spacing(0.125)} solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[1],
          }),
        }}
      >
        <Stack spacing={{ xs: theme.spacing(1.5), sm: theme.spacing(2) }}>
          <Box>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {networks
                .filter((n: any) => n.testnet !== true)
                .filter((n: any) => {
                  if (isMobile && !showMoreNetworks) {
                    return (
                      DEFAULT_ZRX_NETWORKS.includes(n.chainId) ||
                      chainId === n.chainId
                    );
                  }
                  return true;
                })
                .map((n: any) => (
                  <div key={n.chainId} style={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      color={chainId === n.chainId ? "primary" : undefined}
                      clickable
                      size={isSmallScreen ? "small" : "medium"}
                      icon={
                        <Avatar
                          sx={{
                            height: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                            width: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                          }}
                          src={n.imageUrl}
                        />
                      }
                      label={n.name}
                      onClick={() => onSwitchNetwork(n.chainId)}
                      sx={{
                        ...(isSmallScreen && {
                          fontSize: theme.typography.caption.fontSize,
                          height: theme.spacing(3.5),
                          '& .MuiChip-label': {
                            px: theme.spacing(0.75),
                          },
                        }),
                        ...(isGlassVariant && {
                          color: textColor,
                          '& .MuiChip-label': {
                            color: textColor,
                            ...(isSmallScreen && {
                              px: theme.spacing(0.75),
                            }),
                          },
                          '&.MuiChip-colorPrimary': {
                            '& .MuiChip-label': {
                              color: 'white',
                            },
                          },
                        }),
                      }}
                    />
                  </div>
                ))}
              {isMobile && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    startIcon={!showMoreNetworks ? <AddIcon /> : <RemoveIcon />}
                    onClick={toggleNetworks}
                    size="small"
                    sx={{
                      fontSize: theme.typography.caption.fontSize,
                      minWidth: 'auto',
                      px: theme.spacing(1),
                      color: theme.palette.text.secondary,
                      ...(isGlassVariant && {
                        color: `${textColor}CC`,
                      }),
                    }}
                  >
                    {showMoreNetworks ? (
                      <FormattedMessage id="Less" defaultMessage="Less" />
                    ) : (
                      <FormattedMessage id="more" defaultMessage="More" />
                    )}
                  </Button>
                </div>
              )}
            </div>
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
              size: isSmallScreen ? "small" : "medium",
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      color="primary"
                      fontSize={isSmallScreen ? "small" : "medium"}
                    />
                  </InputAdornment>
                ),
              },
              sx: {
                '& .MuiInputBase-root': {
                  fontSize: {
                    xs: theme.typography.body2.fontSize,
                    sm: theme.typography.body1.fontSize
                  },
                  ...(isGlassVariant && {
                    color: textColor,
                    '& input::placeholder': {
                      color: `${textColor}B3`,
                      opacity: 1,
                    },
                    '& .MuiInputBase-input': {
                      color: textColor,
                    },
                  }),
                },
              },
            }}
          />

          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.5, sm: 1 }}
            sx={{
              flexWrap: 'wrap',
              gap: { xs: theme.spacing(0.5), sm: theme.spacing(1) },
            }}
          >
            {quoteTokens.map((token, index) => (
              <Chip
                key={index}
                label={token.symbol.toUpperCase()}
                clickable
                size={isSmallScreen ? "small" : "medium"}
                icon={
                  <Avatar
                    sx={{
                      width: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                      height: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                    }}
                    src={
                      token.logoURI
                        ? token.logoURI
                        : TOKEN_ICON_URL(token.address, token.chainId)
                    }
                  >
                    <TokenIcon fontSize={isSmallScreen ? "small" : "medium"} />
                  </Avatar>
                }
                color={
                  quoteToken && isSameToken(token, quoteToken)
                    ? "primary"
                    : undefined
                }
                onClick={handleToggleBaseToken(token)}
                sx={{
                  ...(isSmallScreen && {
                    fontSize: theme.typography.caption.fontSize,
                    height: theme.spacing(3.5),
                    '& .MuiChip-label': {
                      px: theme.spacing(0.75),
                    },
                  }),
                  ...(isGlassVariant && {
                    color: textColor,
                    '& .MuiChip-label': {
                      color: textColor,
                      ...(isSmallScreen && {
                        px: theme.spacing(0.75),
                      }),
                    },
                    '&.MuiChip-colorPrimary': {
                      '& .MuiChip-label': {
                        color: 'white',
                      },
                    },
                  }),
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          '&.MuiDialogContent-root': {
            paddingTop: 0,
          },
        }}
        dividers
      >
        <SelectPairList
          onSelect={handleSelectToken}
          baseTokens={filteredTokens}
          quoteToken={quoteToken}
          baseToken={baseToken}
        />
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: theme.spacing(1.5), sm: theme.spacing(2), md: theme.spacing(3) },
          py: { xs: theme.spacing(1), sm: theme.spacing(1.5) },
          gap: { xs: theme.spacing(1), sm: theme.spacing(0.5) },
          backgroundColor: isDarkMode ? theme.palette.grey[900] : theme.palette.background.paper,
          borderTop: `${theme.spacing(0.125)} solid ${theme.palette.divider}`,
          ...(isGlassVariant && {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(25px) saturate(200%) brightness(1.08)',
            WebkitBackdropFilter: 'blur(25px) saturate(200%) brightness(1.08)',
            borderTop: `1px solid rgba(255, 255, 255, 0.25)`,
          }),
        }}
      >
        <Button
          onClick={handleConfirm}
          variant="contained"
          size={isSmallScreen ? "small" : "medium"}
          sx={{
            fontSize: {
              xs: theme.typography.body2.fontSize,
              sm: theme.typography.body1.fontSize
            },
            px: { xs: theme.spacing(2), sm: theme.spacing(3) },
            minWidth: { xs: theme.spacing(10), sm: theme.spacing(12) },
          }}
        >
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button
          onClick={handleClose}
          size={isSmallScreen ? "small" : "medium"}
          sx={{
            fontSize: {
              xs: theme.typography.body2.fontSize,
              sm: theme.typography.body1.fontSize
            },
            px: { xs: theme.spacing(2), sm: theme.spacing(3) },
            minWidth: { xs: theme.spacing(10), sm: theme.spacing(12) },
            color: theme.palette.text.secondary,
            ...(isGlassVariant && {
              color: `${textColor}CC`,
            }),
          }}
        >
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
