import { ChainId, useApproveToken, useTokenAllowanceQuery } from "@dexkit/core";
import { ERC20Abi } from "@dexkit/core/constants/abis";
import { Token } from "@dexkit/core/types";
import {
  formatBigNumber,
  getChainName,
  getNativeTokenSymbol,
  isAddressEqual,
} from "@dexkit/core/utils";
import { Interface } from "@dexkit/core/utils/ethers/abi/Interface";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import MomentFromSpan from "@dexkit/ui/components/MomentFromSpan";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import { ZrxOrder, ZrxOrderRecord } from "@dexkit/ui/modules/swap/types";
import MultiCall, { CallInput } from "@indexed-finance/multicall";
import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { BigNumber, providers } from "ethers";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useZrxFillOrderMutation } from "../hooks/zrx";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { BigNumberUtils, getZrxExchangeAddress } from "../utils";
import DecimalInput from "./TradeWidget/DecimalInput";

const PercentButton = styled(Button)({ flex: 1 });

export interface OrderWidgetProps {
  record: ZrxOrderRecord;
  account?: string;
  onCancel: (
    order: ZrxOrder,
    baseTokenSymbol?: string,
    quoteTokenSymbol?: string,
    baseTokenAmount?: string,
    quoteTokenAmount?: string
  ) => void;
  chainId?: ChainId;
  signer?: providers.JsonRpcSigner;
}

export default function OrderWidget({
  record,
  account,
  onCancel,
  chainId,
  signer,
}: OrderWidgetProps) {
  const [makerToken, setMakerToken] = useState<Token>();
  const [takerToken, setTakerToken] = useState<Token>();

  useEffect(() => {
    (async () => {
      if (chainId) {
        if (
          !isAddressEqual(record.order.takerToken, ZEROEX_NATIVE_TOKEN_ADDRESS)
        ) {
          const takerCalls: CallInput[] = [];

          const takerIface = new Interface(ERC20Abi);

          takerCalls.push({
            interface: takerIface,
            target: record.order.takerToken,
            function: "name",
          });

          takerCalls.push({
            interface: takerIface,
            target: record.order.takerToken,
            function: "symbol",
          });

          takerCalls.push({
            interface: takerIface,
            target: record.order.takerToken,
            function: "decimals",
          });

          const multical = new MultiCall(signer);
          const [, results] = await multical.multiCall(takerCalls);

          const takerToken: Token = {
            chainId,
            address: record.order.takerToken,
            name: results[0],
            symbol: results[1],
            decimals: results[2],
          };
          setTakerToken(takerToken);
        } else {
          setTakerToken({
            chainId,
            address: ZEROEX_NATIVE_TOKEN_ADDRESS,
            decimals: 18,
            name: getChainName(chainId) || "",
            symbol: getNativeTokenSymbol(chainId) || "",
          });
        }

        if (
          !isAddressEqual(record.order.makerToken, ZEROEX_NATIVE_TOKEN_ADDRESS)
        ) {
          const makerCalls: CallInput[] = [];

          const makerIIface = new Interface(ERC20Abi);

          makerCalls.push({
            interface: makerIIface,
            target: record.order.makerToken,
            function: "name",
          });

          makerCalls.push({
            interface: makerIIface,
            target: record.order.makerToken,
            function: "symbol",
          });

          makerCalls.push({
            interface: makerIIface,
            target: record.order.makerToken,
            function: "decimals",
          });

          const multicalMaker = new MultiCall(signer);
          const [, makerResults] = await multicalMaker.multiCall(makerCalls);

          const makerToken: Token = {
            chainId,
            address: record.order.makerToken,
            name: makerResults[0],
            symbol: makerResults[1],
            decimals: makerResults[2],
          };
          setMakerToken(makerToken);
        } else {
          setMakerToken({
            chainId,
            address: ZEROEX_NATIVE_TOKEN_ADDRESS,
            decimals: 18,
            name: getChainName(chainId) || "",
            symbol: getNativeTokenSymbol(chainId) || "",
          });
        }
      }
    })();
  }, [record, signer]);

  const side = useMemo(() => {
    return isAddressEqual(makerToken?.address, record.order.makerToken)
      ? "sell"
      : "buy";
  }, [makerToken, record]);

  const makerTokenAmount = useMemo(() => {
    return formatBigNumber(
      BigNumber.from(record.order.makerAmount),
      makerToken?.decimals
    );
  }, [record, makerToken]);

  const takerTokenAmount = useMemo(() => {
    return formatBigNumber(
      BigNumber.from(record.order.takerAmount),
      takerToken?.decimals
    );
  }, [record, takerToken]);

  const remainingFillableAmountFormatted = useMemo(() => {
    const amountToBeFilled = BigNumber.from(record.order.takerAmount);

    const remainingFillableAmount = BigNumber.from(
      record.metaData.remainingFillableTakerAmount
    );

    return formatBigNumber(
      amountToBeFilled.sub(remainingFillableAmount),
      takerToken?.decimals
    );
  }, [takerToken, record]);

  const remainingFillableAmount = useMemo(() => {
    const amountToBeFilled = BigNumber.from(record.order.takerAmount);

    const remainingFillableAmount = BigNumber.from(
      record.metaData.remainingFillableTakerAmount
    );

    return amountToBeFilled.sub(remainingFillableAmount);
  }, [takerToken, record]);

  const handleCancel = () => {};

  const [value, setValue] = useState<string | undefined>("0.0");

  const { data: allowance } = useTokenAllowanceQuery({
    account,
    signer,
    spender: getZrxExchangeAddress(chainId),
    tokenAddress: takerToken?.address,
  });

  const fillOrderMutation = useZrxFillOrderMutation();

  const approve = useApproveToken();

  const handleFillOrder = async () => {
    if (value) {
      const amount = parseUnits(value, takerToken?.decimals);

      if (allowance?.lt(amount)) {
        await approve.mutateAsync({
          amount,
          onSubmited: () => {},
          signer,
          spender: getZrxExchangeAddress(chainId),
          tokenContract: takerToken?.address,
        });
      }

      await fillOrderMutation.mutateAsync({
        order: record.order,
        chainId,
        signer,
        fillAmount: amount,
      });
    }
  };

  const price = useMemo(() => {
    return 0;
  }, []);

  const handleChangeFillAmount = (value?: string) => {
    setValue(value);
  };

  const handleFillAmountPercentage = (percentage: number) => {
    return () => {
      const result = new BigNumberUtils().multiply(
        remainingFillableAmount,
        percentage
      );

      setValue(formatUnits(result, takerToken?.decimals));
    };
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography
              component="div"
              align="center"
              variant="caption"
              color="text.secondary"
            >
              <FormattedMessage id="type" defaultMessage="Type" />
            </Typography>
            <Typography
              align="center"
              variant="h5"
              sx={{
                color: (theme) =>
                  side === "buy"
                    ? theme.palette.success.main
                    : theme.palette.error.main,
              }}
            >
              {side === "buy" ? (
                <FormattedMessage id="buy" defaultMessage="Buy" />
              ) : (
                <FormattedMessage id="sell" defaultMessage="Sell" />
              )}
            </Typography>
          </Box>
          <Stack
            justifyContent="center"
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <Typography>
              {makerTokenAmount} {makerToken?.symbol}
            </Typography>
            <SwapHorizIcon />
            <Typography>
              {takerTokenAmount} {takerToken?.symbol}
            </Typography>
          </Stack>
          <Box>
            <Stack>
              <Stack justifyContent="space-between" direction="row">
                <Typography>
                  <FormattedMessage
                    id="fillable.amount"
                    defaultMessage="Fillable amount"
                  />
                </Typography>
                <Typography color="text.secondary">
                  {remainingFillableAmountFormatted} {takerToken?.symbol}
                </Typography>
              </Stack>
              <Stack justifyContent="space-between" direction="row">
                <Typography>
                  <FormattedMessage id="expire" defaultMessage="Expire" />
                </Typography>
                <Typography color="text.secondary">
                  <MomentFromSpan
                    from={moment(parseInt(record.order.expiry) * 1000)}
                  />
                </Typography>
              </Stack>

              <Stack justifyContent="space-between" direction="row">
                <Typography>
                  <FormattedMessage id="price" defaultMessage="Price" />
                </Typography>
                <Typography color="text.secondary">{price}</Typography>
              </Stack>
            </Stack>
          </Box>
          <Stack direction="row" alignItems="center" spacing={2}>
            <PercentButton
              onClick={handleFillAmountPercentage(0.25)}
              variant="outlined"
              size="small"
              sx={{}}
            >
              25%
            </PercentButton>
            <PercentButton
              onClick={handleFillAmountPercentage(0.5)}
              variant="outlined"
              size="small"
            >
              50%
            </PercentButton>
            <PercentButton
              onClick={handleFillAmountPercentage(0.75)}
              variant="outlined"
              size="small"
            >
              75%
            </PercentButton>
            <PercentButton
              onClick={handleFillAmountPercentage(1)}
              variant="outlined"
              size="small"
            >
              100%
            </PercentButton>
          </Stack>
          <DecimalInput
            value={value}
            onChange={handleChangeFillAmount}
            TextFieldProps={{
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    {takerToken?.symbol.toUpperCase()}
                  </InputAdornment>
                ),
              },
            }}
            decimals={takerToken?.decimals}
          />
          <Button fullWidth variant="contained" onClick={handleFillOrder}>
            <FormattedMessage id="fill.order" defaultMessage="Fill Order" />
          </Button>
          {isAddressEqual(account, record.order.maker) &&
            isAddressEqual(account, record.order.taker) && (
              <Button
                fullWidth
                color="error"
                variant="outlined"
                onClick={handleCancel}
                size="small"
              >
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
            )}
        </Stack>

        {JSON.stringify(record, null, 2)}
      </CardContent>
    </Card>
  );
}
