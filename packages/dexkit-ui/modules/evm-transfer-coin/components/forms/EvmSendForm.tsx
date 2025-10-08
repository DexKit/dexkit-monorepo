import { CoinTypes } from "@dexkit/core/constants";
import { useEnsNameQuery, useIsMobile } from "@dexkit/core/hooks";
import { Coin } from "@dexkit/core/types";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import { QrCodeScanner } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import Token from "@mui/icons-material/Token";
import {
  Autocomplete,
  AutocompleteChangeReason,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  createFilterOptions,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";

import { parse } from "eth-url-parser";

import { isDexKitToken } from "@dexkit/widgets/src/constants/tokens";
import LockIcon from "@mui/icons-material/Lock";
import dynamic from "next/dynamic";
import { ChangeEvent, SyntheticEvent, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ConnectButton } from "../../../../components/ConnectButton";
import { useERC20BalancesQuery } from "../../../wallet/hooks";
import { TokenBalance } from "../../../wallet/types";

const ScanWalletQrCodeDialog = dynamic(
  async () => import("@dexkit/ui/components/dialogs/ScanWalletQrCodeDialog")
);

const filter = createFilterOptions<string>();

export interface EvmSendFormProps {
  coins?: Coin[];
  isSubmitting?: boolean;
  values: { address?: string | null; amount?: number; coin?: Coin | null };
  accounts?: { address: string }[];
  onChange: (params: {
    address?: string | null;
    amount?: number;
    coin?: Coin | null;
  }) => void;
  onSubmit: () => void;
  onConnectWallet?: () => void;
  onSwitchNetwork?: ({ chainId }: { chainId?: number }) => void;
  chainId?: number;
  balance?: string;
  account?: string;
  defaultCoin?: Coin;
}

export function EvmSendForm({
  coins,
  values,
  onChange,
  accounts,
  onSubmit,
  isSubmitting,
  chainId,
  onConnectWallet,
  onSwitchNetwork,
  account,
  balance,
  defaultCoin,
}: EvmSendFormProps) {
  const [addressTouched, setAddressTouched] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const theme = useTheme();

  const ensNameQuery = useEnsNameQuery({ address: values?.address });

  const chainIds = useMemo(() => {
    if (!coins) return [chainId].filter(Boolean);
    const uniqueChainIds = [...new Set(coins.map(coin => coin.network.chainId))];
    return uniqueChainIds.filter(Boolean);
  }, [coins, chainId]);

  const currentChainBalances = useERC20BalancesQuery(undefined, chainId, false);

  const allTokenBalances = useMemo(() => {
    return currentChainBalances.data || [];
  }, [currentChainBalances.data]);

  const balanceMap = useMemo(() => {
    if (!allTokenBalances) return {};

    const map: Record<string, TokenBalance> = {};
    allTokenBalances.forEach((tb) => {
      if (tb.token.address) {
        const key = `${tb.token.chainId}-${tb.token.address.toLowerCase()}`;
        map[key] = tb;
        map[tb.token.address] = tb;
        map[tb.token.address.toLowerCase()] = tb;
      }
    });
    return map;
  }, [allTokenBalances]);

  const getCoinBalance = (coin: Coin): string => {
    if (!allTokenBalances) return "";

    if (coin.coinType === CoinTypes.EVM_NATIVE) {
      const nativeBalance = allTokenBalances.find(
        (tb) => {
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

  const isDexKitCoin = (coin: Coin): boolean => {
    if (coin.coinType === CoinTypes.EVM_ERC20 && coin.contractAddress) {
      return isDexKitToken({ address: coin.contractAddress, symbol: coin.symbol });
    }
    return false;
  };

  const isTokenLocked = (coin: Coin): boolean => {
    if (!defaultCoin) return false;

    if (coin.coinType === CoinTypes.EVM_ERC20 && defaultCoin.coinType === CoinTypes.EVM_ERC20) {
      return coin.contractAddress?.toLowerCase() === defaultCoin.contractAddress?.toLowerCase() &&
        coin.network.chainId === defaultCoin.network.chainId;
    }

    if (coin.coinType === CoinTypes.EVM_NATIVE && defaultCoin.coinType === CoinTypes.EVM_NATIVE) {
      return coin.network.chainId === defaultCoin.network.chainId;
    }

    return false;
  };

  const sortedCoins = useMemo(() => {
    if (!coins) return [];

    const coinsWithBalance: Coin[] = [];

    coins.forEach((coin) => {
      const balance = getCoinBalance(coin);
      const hasBalance = balance !== "" && parseFloat(balance) > 0;
      if (hasBalance) {
        coinsWithBalance.push(coin);
      }
    });

    return coinsWithBalance;
  }, [coins, allTokenBalances]);

  const handleChangeCoin = (
    event: SyntheticEvent<Element, Event>,
    value: Coin | null,
    reason: AutocompleteChangeReason
  ) => {
    if (values.coin && isTokenLocked(values.coin)) {
      return;
    }
    onChange({ ...values, coin: value });
  };

  const handleChangeAddress = (
    event: SyntheticEvent<Element, Event>,
    newValue: string | null,
    reason: AutocompleteChangeReason
  ) => {
    if (typeof newValue === "string") {
      onChange({ ...values, address: newValue });
    }
    if (newValue === null) {
      onChange({ ...values, address: null });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "number" && typeof e.target.value === "string") {
      onChange({ ...values, [e.target.name]: e.target.value });
    } else {
      onChange({ ...values, [e.target.name]: e.target.value });
    }
  };

  const isAddressValid = useMemo(() => {
    return values.address
      ? ensNameQuery.data
        ? isAddress(ensNameQuery.data)
        : isAddress(values.address)
      : false;
  }, [values]);

  const isValid = useMemo(() => {
    return isAddressValid && values.amount && values?.coin;
  }, [values, isAddressValid]);

  const isChainDiff = useMemo(() => {
    return chainId && values.coin && chainId !== values.coin?.network.chainId;
  }, [chainId, values.coin]);

  const notEnoughBalance = useMemo(() => {
    if (!balance) {
      return true;
    }
    if (balance && values?.amount && values?.amount > Number(balance)) {
      return true;
    }
    return false;
  }, [balance, values?.amount]);

  const [showQrCode, setShowQrCode] = useState(false);

  const handleOpenQrCodeScanner = () => {
    setShowQrCode(true);
  };

  const handleOpenQrCodeScannerClose = () => {
    setShowQrCode(false);
  };

  const handleAddressResult = (result: string) => {
    try {
      let res = parse(result);

      let address = "";

      if (
        res.parameters &&
        res.parameters["address"] &&
        res?.function_name === "transfer"
      ) {
        address = res.parameters["address"];
      }

      if (!res?.function_name) {
        address = res.target_address;
      }

      onChange({ ...values, address });
      setAddressTouched(true);
      handleOpenQrCodeScannerClose();
    } catch (err) { }
  };

  return (
    <>
      {showQrCode && (
        <ScanWalletQrCodeDialog
          DialogProps={{
            open: showQrCode,
            maxWidth: "sm",
            fullWidth: true,
            fullScreen: isMobile,
            onClose: handleOpenQrCodeScannerClose,
          }}
          onResult={handleAddressResult}
        />
      )}

      <Stack spacing={isMobile ? 2.5 : 3}>
        <Autocomplete
          disablePortal={false}
          disabled={isSubmitting || !!defaultCoin}
          id="select-token"
          options={sortedCoins}
          value={values?.coin}
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
          renderInput={(params) => {
            const isLocked = !!defaultCoin;

            return (
              <Tooltip
                title={isLocked ? <FormattedMessage id="locked.token" defaultMessage="Locked token" /> : ""}
                arrow
                disableHoverListener={!isLocked}
                disableFocusListener={!isLocked}
              >
                <span>
                  <TextField
                    {...params}
                    disabled={isSubmitting || isLocked}
                    label={<FormattedMessage id="coin" defaultMessage="Coin" />}
                    size={isMobile ? "medium" : "medium"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: isMobile ? 1.5 : 2,
                        opacity: isLocked ? 0.5 : 1,
                        pointerEvents: isLocked ? 'none' : undefined,
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                        background: isLocked ? theme.palette.action.disabledBackground : undefined,
                      },
                      '& .MuiInputLabel-root': {
                        color: 'text.primary',
                      },
                      '& .MuiInputBase-input': {
                        color: 'text.primary',
                      },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          {params.InputProps.endAdornment}
                          {isLocked && (
                            <LockIcon
                              fontSize="small"
                              sx={{
                                color: 'text.disabled',
                                mr: 1
                              }}
                            />
                          )}
                        </Stack>
                      ),
                    }}
                  />
                </span>
              </Tooltip>
            );
          }}
          ListboxProps={{
            sx: {
              maxHeight: isMobile ? theme.spacing(37.5) : theme.spacing(50),
            },
          }}
        />

        <Autocomplete
          disablePortal
          disabled={isSubmitting}
          options={accounts?.map((a) => a.address) || []}
          id="select-address"
          onChange={handleChangeAddress}
          value={values?.address || ""}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            const isExisting = options.some((option) => inputValue === option);
            if (inputValue !== "" && !isExisting) {
              filtered.push();
            }

            return filtered;
          }}
          freeSolo
          autoSelect
          renderInput={(params) => (
            <TextField
              {...params}
              label={
                <FormattedMessage
                  id="address"
                  defaultMessage="Address"
                />
              }
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleOpenQrCodeScanner}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        color: 'text.primary',
                      }}
                    >
                      <QrCodeScanner />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={values.address || null}
              name="address"
              error={
                !isAddressValid && addressTouched && !ensNameQuery.isLoading
              }
              helperText={
                !isAddressValid && addressTouched && !ensNameQuery.isLoading ? (
                  <FormattedMessage
                    id="invalid address"
                    defaultMessage="Invalid address"
                  />
                ) : undefined
              }
              size={isMobile ? "medium" : "medium"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: isMobile ? theme.spacing(1.5) : theme.spacing(2),
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
        />

        <TextField
          fullWidth
          disabled={isSubmitting}
          type="number"
          name="amount"
          value={values?.amount}
          onChange={handleChange}
          label={<FormattedMessage id="amount" defaultMessage="Amount" />}
          placeholder="0.00"
          size={isMobile ? "medium" : "medium"}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: isMobile ? theme.spacing(1.5) : theme.spacing(2),
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

        {!account ? (
          <ConnectButton
            variant="contained"
            color="primary"
            size={isMobile ? "large" : "large"}
            sx={{
              borderRadius: isMobile ? theme.spacing(1.5) : theme.spacing(2),
              py: isMobile ? theme.spacing(1.5) : theme.spacing(1),
            }}
          />
        ) : isChainDiff ? (
          <Button
            onClick={() =>
              onSwitchNetwork
                ? onSwitchNetwork({ chainId: values.coin?.network?.chainId })
                : undefined
            }
            variant="contained"
            color="primary"
            size={isMobile ? "large" : "large"}
            sx={{
              borderRadius: isMobile ? theme.spacing(1.5) : theme.spacing(2),
              py: isMobile ? theme.spacing(1.5) : theme.spacing(1),
            }}
          >
            <FormattedMessage
              id="switch.network"
              defaultMessage="Switch network"
            />
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!isValid || isSubmitting || notEnoughBalance}
            startIcon={
              isSubmitting ? (
                <CircularProgress color="inherit" size="1rem" />
              ) : (
                <SendIcon />
              )
            }
            variant="contained"
            color="primary"
            size={isMobile ? "large" : "large"}
            sx={{
              borderRadius: isMobile ? theme.spacing(1.5) : theme.spacing(2),
              py: isMobile ? theme.spacing(1.5) : theme.spacing(1),
            }}
          >
            {notEnoughBalance ? (
              <FormattedMessage
                id="not.enough.balance"
                defaultMessage="Not enough balance"
              />
            ) : (
              <FormattedMessage id="send" defaultMessage="Send" />
            )}
          </Button>
        )}
      </Stack>
    </>
  );
}