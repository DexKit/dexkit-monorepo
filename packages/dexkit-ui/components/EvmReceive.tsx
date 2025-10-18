import { useIsMobile } from "@dexkit/core";
import { CoinTypes } from "@dexkit/core/constants";
import { EvmCoin } from "@dexkit/core/types";
import {
  buildEtherReceiveAddress,
  copyToClipboard,
  truncateAddress,
} from "@dexkit/core/utils";
import FileCopy from "@mui/icons-material/FileCopy";
import Token from "@mui/icons-material/Token";

import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { isDexKitToken } from "@dexkit/widgets/src/constants/tokens";
import {
  Autocomplete,
  AutocompleteChangeReason,
  Avatar,
  Box,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useERC20BalancesQuery } from "../modules/wallet/hooks";
import { TokenBalance } from "../modules/wallet/types";
import CopyIconButton from "./CopyIconButton";
import EvmReceiveQRCode from "./EvmReceiveQRCode";
import { ShareButton } from "./ShareButton";

export interface EvmReceiveProps {
  receiver?: string;
  ENSName?: string;
  chainId?: number;
  defaultCoin?: EvmCoin;
  baseShareURL?: string;
  coins?: EvmCoin[];
}

export default function EvmReceive({
  receiver,
  chainId,
  ENSName,
  coins,
  baseShareURL,
  defaultCoin,
}: EvmReceiveProps) {
  const [coin, setCoin] = useState<EvmCoin | null>(null);
  const [amount, setAmount] = useState<string>("");
  const { formatMessage } = useIntl();
  const isMobile = useIsMobile();
  const theme = useTheme();
  const { account, chainId: walletChainId } = useWeb3React();

  const effectiveChainId = chainId || walletChainId;

  const chainIds = useMemo(() => {
    if (!coins) return [effectiveChainId].filter(Boolean);
    const uniqueChainIds = [...new Set(coins.map(coin => coin.network.chainId))];
    return uniqueChainIds.filter(Boolean);
  }, [coins, effectiveChainId]);

  const currentChainBalances = useERC20BalancesQuery(undefined, effectiveChainId, false);

  const allTokenBalances = useMemo(() => {
    return currentChainBalances.data || [];
  }, [currentChainBalances.data]);

  const balanceMap = useMemo(() => {
    if (!allTokenBalances) return {};

    const map: Record<string, TokenBalance> = {};
    allTokenBalances.forEach((tb: any) => {
      if (tb.token.address) {
        const key = `${tb.token.chainId}-${tb.token.address.toLowerCase()}`;
        map[key] = tb;
        map[tb.token.address] = tb;
        map[tb.token.address.toLowerCase()] = tb;
      }
    });
    return map;
  }, [allTokenBalances]);

  const getCoinBalance = (coin: EvmCoin): string => {
    if (!allTokenBalances) return "";

    if (coin.coinType === CoinTypes.EVM_NATIVE) {
      const nativeBalance = allTokenBalances.find(
        (tb: any) => {
          return (
            (tb.token.address.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ||
              tb.token.symbol === coin.symbol) &&
            tb.token.chainId === coin.network.chainId
          );
        }
      );
      if (nativeBalance && !nativeBalance.balance.isZero()) {
        return formatUnits(nativeBalance.balance, coin.decimals);
      }
    } else if (coin.coinType === CoinTypes.EVM_ERC20 && coin.contractAddress) {
      const chainKey = `${coin.network.chainId}-${coin.contractAddress.toLowerCase()}`;
      const balance = balanceMap[chainKey] ||
        balanceMap[coin.contractAddress] ||
        balanceMap[coin.contractAddress.toLowerCase()];
      if (balance && !balance.balance.isZero()) {
        return formatUnits(balance.balance, coin.decimals);
      }
    }
    return "";
  };

  const sortedCoins = useMemo(() => {
    if (!coins) return [];

    const coinsWithBalance: EvmCoin[] = [];
    const coinsWithoutBalance: EvmCoin[] = [];

    coins.forEach((coin) => {
      const hasBalance = getCoinBalance(coin) !== "";
      if (hasBalance) {
        coinsWithBalance.push(coin);
      } else {
        coinsWithoutBalance.push(coin);
      }
    });

    return [...coinsWithBalance, ...coinsWithoutBalance];
  }, [coins, balanceMap]);

  const isDexKitCoin = (coin: EvmCoin): boolean => {
    if (coin.coinType === CoinTypes.EVM_ERC20 && coin.contractAddress) {
      return isDexKitToken({ address: coin.contractAddress, symbol: coin.symbol });
    }
    return false;
  };

  useEffect(() => {
    if (defaultCoin) {
      setCoin(defaultCoin);
    }
  }, [defaultCoin]);

  const handleChangeCoin = (
    event: SyntheticEvent<Element, Event>,
    value: EvmCoin | null,
    reason: AutocompleteChangeReason
  ) => {
    setCoin(value);
  };

  const handleChangeAmount = (
    ev: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setAmount(ev.currentTarget.value);
  };

  const receiveURL = useMemo(() => {
    const url = buildEtherReceiveAddress({
      contractAddress:
        coin?.coinType === CoinTypes.EVM_ERC20
          ? coin.contractAddress
          : undefined,
      receiver,
      chainId: coin?.network.chainId ? coin?.network.chainId : effectiveChainId,
      amount: amount && !isNaN(Number(amount))
        ? parseUnits(amount, coin?.decimals || 18).toString()
        : undefined,
    });

    return url;
  }, [coin, receiver, effectiveChainId, amount]);

  const shareUrl = useMemo(() => {
    if (baseShareURL) {
      return `${baseShareURL}${receiveURL}`;
    }
    if (typeof window !== "undefined") {
      return `${window.location.origin}/wallet/send/${encodeURIComponent(
        receiveURL
      )}`;
    }

    return receiveURL;
  }, [receiveURL, baseShareURL]);

  const handleCopy = () => {
    if (receiver) {
      if (ENSName) {
        copyToClipboard(ENSName);
      } else {
        copyToClipboard(receiver);
      }
    }
  };

  return (
    <Stack spacing={isMobile ? 2.5 : 3}>
      {/* QR Code Section */}
      <Stack justifyContent="center" alignItems="center" spacing={isMobile ? 1.5 : 2}>
        <Box
          sx={{
            p: isMobile ? 2 : 3,
            backgroundColor: theme.palette.common.white,
            borderRadius: isMobile ? 2 : 3,
            boxShadow: theme.shadows[2],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              '& svg': {
                width: isMobile ? theme.spacing(25) : theme.spacing(30),
                height: isMobile ? theme.spacing(25) : theme.spacing(30),
                maxWidth: '100%',
                maxHeight: '100%',
              },
            }}
          >
            <EvmReceiveQRCode
              receiver={receiver}
              chainId={coin?.network.chainId ? coin?.network.chainId : effectiveChainId}
              contractAddress={
                coin?.coinType === CoinTypes.EVM_ERC20
                  ? coin.contractAddress
                  : undefined
              }
              amount={
                amount && !isNaN(Number(amount))
                  ? parseUnits(amount, coin?.decimals || 18).toString()
                  : undefined
              }
            />
          </Box>
        </Box>
        <Typography
          variant="caption"
          color="text.primary"
          textAlign="center"
          sx={{
            px: isMobile ? 1 : 0,
          }}
        >
          <FormattedMessage
            id="scan.using.crypto.mobile.app"
            defaultMessage="Scan QR code using crypto mobile app like Metamask or Trust"
          />
        </Typography>
      </Stack>

      <Box
        sx={{
          p: isMobile ? 2 : 2.5,
          backgroundColor: theme.palette.action.hover,
          borderRadius: isMobile ? 1.5 : 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Typography
            variant={isMobile ? "body2" : "body1"}
            color="text.primary"
            sx={{
              fontWeight: theme.typography.fontWeightMedium,
              flexShrink: 0,
            }}
          >
            <FormattedMessage id="receiver" defaultMessage="Receiver" />:
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
            <Typography
              variant={isMobile ? "body2" : "body1"}
              color="text.primary"
              sx={{
                fontFamily: theme.typography.fontFamily,
                fontFeatureSettings: '"tnum"',
                wordBreak: 'break-all',
                flex: 1,
              }}
            >
              {ENSName ? ENSName : truncateAddress(receiver)}
            </Typography>
            <CopyIconButton
              iconButtonProps={{
                onClick: handleCopy,
                size: "small",
                color: "inherit",
              }}
              tooltip={formatMessage({
                id: "copy",
                defaultMessage: "Copy",
                description: "Copy text",
              })}
              activeTooltip={formatMessage({
                id: "copied",
                defaultMessage: "Copied!",
                description: "Copied text",
              })}
            >
              <FileCopy fontSize="small" color="inherit" />
            </CopyIconButton>
          </Stack>
        </Stack>
      </Box>

      <Autocomplete
        disablePortal={false}
        id="select-token"
        options={sortedCoins.length > 0 ? sortedCoins : (coins || [])}
        value={coin}
        readOnly={coins && coins.length === 1}
        onChange={handleChangeCoin}
        getOptionLabel={(opt) => opt.name}
        slotProps={{
          popper: {
            placement: 'bottom-start',
            disablePortal: true,
            modifiers: [
              {
                name: 'flip',
                enabled: false,
              },
              {
                name: 'preventOverflow',
                enabled: false,
              },
            ],
          },
        }}
        renderOption={(props, opt) => {
          const balance = getCoinBalance(opt);
          const isKitToken = isDexKitCoin(opt);

          return (
            <ListItem {...props}>
              <ListItemAvatar>
                <Avatar
                  src={opt.imageUrl}
                  imgProps={{
                    sx: {
                      objectFit: "contain"
                    }
                  }}
                  sx={{
                    width: isMobile ? theme.spacing(5) : theme.spacing(6),
                    height: isMobile ? theme.spacing(5) : theme.spacing(6),
                    ...(isKitToken && theme.palette.mode === 'dark' && {
                      filter: 'invert(1)',
                    })
                  }}
                >
                  <Token />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant={isMobile ? "body2" : "body1"}
                      sx={{ fontWeight: theme.typography.fontWeightMedium }}
                    >
                      {opt.name}
                    </Typography>
                    {balance && (
                      <Chip
                        size="small"
                        label={`${parseFloat(balance).toFixed(4)} ${opt.symbol}`}
                        sx={{
                          fontSize: theme.typography.caption.fontSize,
                          height: isMobile ? theme.spacing(2.5) : theme.spacing(3),
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                        }}
                      />
                    )}
                  </Stack>
                }
                secondary={
                  <Typography
                    variant={isMobile ? "caption" : "body2"}
                    color="text.primary"
                  >
                    <FormattedMessage
                      id="coin.on.network"
                      defaultMessage="{name} on {network}"
                      values={{ name: opt.symbol, network: opt.network.name }}
                    />
                  </Typography>
                }
              />
            </ListItem>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={<FormattedMessage id="coin" defaultMessage="Coin" />}
            size={isMobile ? "medium" : "medium"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: isMobile ? 1.5 : 2,
              },
              '& .MuiInputLabel-root': {
                color: 'text.primary',
              },
              '& .MuiInputBase-input': {
                color: 'text.primary',
              },
            }}
          />
        )}
        ListboxProps={{
          sx: {
            maxHeight: isMobile ? theme.spacing(37.5) : theme.spacing(50),
          },
        }}
      />

      <TextField
        fullWidth
        type="number"
        name="amount"
        value={amount}
        onChange={handleChangeAmount}
        label={<FormattedMessage id="amount" defaultMessage="Amount" />}
        placeholder="0.00"
        size={isMobile ? "medium" : "medium"}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: isMobile ? 1.5 : 2,
          },
          '& .MuiInputLabel-root': {
            color: 'text.primary',
          },
          '& .MuiInputBase-input': {
            color: 'text.primary',
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'text.primary',
            opacity: 0.5,
          },
        }}
      />

      <ShareButton
        url={shareUrl}
        shareButtonProps={{
          color: "primary",
          variant: "contained",
          fullWidth: true,
          size: isMobile ? "large" : "medium",
          sx: {
            borderRadius: isMobile ? 1.5 : 2,
            py: isMobile ? 1.5 : 1,
          },
        }}
        shareButtonText={
          <FormattedMessage
            id="share.receive.request"
            defaultMessage="Share receive request"
          />
        }
      />
    </Stack>
  );
}
