// import {
//   Alert,
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   CircularProgress,
//   Divider,
//   Grid,
//   IconButton,
//   InputAdornment,
//   Stack,
//   TextField,
//   Typography,
// } from '@mui/material';

// import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// import { SwappableAssetV4 } from '@traderxyz/nft-swap-sdk';
// import { useWeb3React } from '@web3-react/core';
// import { BigNumber, ethers } from 'ethers';
// import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
// import { FormattedMessage, FormattedNumber } from 'react-intl';

// import { currencyAtom } from '@/modules/common/atoms';
// import {
//   NUMBER_REGEX,
//   ZEROEX_NATIVE_TOKEN_ADDRESS,
//   ZERO_ADDRESS,
// } from '@/modules/common/constants';
// import { useNotifications } from '@/modules/common/hooks/app';
// import { useErc20BalanceQuery } from '@/modules/common/hooks/blockchain';
// import {
//   useConnectWalletDialog,
//   useDebounce,
// } from '@/modules/common/hooks/misc';
// import {
//   getChainName,
//   getNativeTokenSymbol,
//   getProviderByChainId,
// } from '@/modules/common/utils';
// import { Wallet } from '@mui/icons-material';
// import SettingsIcon from '@mui/icons-material/Settings';
// import { useAtomValue } from 'jotai';
// import { isAutoSlippageAtom, maxSlippageAtom } from '../atoms';
// import { useErc20ApproveMutation } from '../hooks/balances';
// import { useExecSwap, useSwapQuote } from '../hooks/swap';
// import {
//   getERC20Decimals,
//   getERC20Symbol,
//   getERC20TokenAllowance,
// } from '../services/balances';
// import {
//   Quote,
//   SwapTransactionMetadata,
//   Token,
//   TokenBalance,
//   TransactionType,
// } from '../types/swap';
// import ConfirmSwapDialog from './dialogs/ConfirmSwapDialog';
// import SelectTokenBalancesDialog from './dialogs/SelectTokenBalancesDialog';
// import SwapSettingsDialog from './dialogs/SwapSettingsDialog';

interface Props {
  // defaultSlippage?: number;
  // defaultChainId?: number;
  // defaultBuyTokenBalance?: TokenBalance;
  // defaultSellTokenBalance?: TokenBalance;
}

export function Swap(props: Props) {
  // const { defaultBuyTokenBalance, defaultSellTokenBalance, defaultChainId } =
  //   props;
  // const {
  //   chainId: walletChainId,
  //   provider: walletProvider,
  //   account,
  //   isActive,
  //   isActivating,
  // } = useWeb3React();
  // const [chainId, setChainId] = useState(defaultChainId || walletChainId);
  // const { openDialog } = useSwitchNetwork();
  // const provider = useMemo(() => {
  //   if (defaultChainId === walletChainId && walletProvider) {
  //     return walletProvider;
  //   }
  //   if (chainId) {
  //     return getProviderByChainId(chainId);
  //   }
  // }, [chainId, defaultChainId, walletChainId]);
  // const [sellToken, setSellToken] = useState<TokenBalance | undefined>(
  //   defaultSellTokenBalance?.token?.chainId === chainId
  //     ? defaultSellTokenBalance
  //     : undefined
  // );
  // const [buyToken, setBuyToken] = useState<TokenBalance | undefined>(
  //   defaultBuyTokenBalance?.token?.chainId === chainId
  //     ? defaultBuyTokenBalance
  //     : undefined
  // );
  // useEffect(() => {
  //   // we are not allowing to change chainId when user sets defaultChainId
  //   if (walletChainId && !defaultChainId) {
  //     setChainId(walletChainId);
  //   }
  // }, [walletChainId]);
  // const [quote, setQuote] = useState<Quote>();
  // const nativeCurrencyPriceQuery = useNativeCoinPriceQuery(chainId);
  // const currency = useAtomValue(currencyAtom);
  // const [sellAmountValue, setSellAmountValue] = useState<string>('');
  // const [buyAmountValue, setBuyAmountValue] = useState<string>('');
  // const sellAmount = useDebounce<string>(sellAmountValue, 500);
  // const buyAmount = useDebounce<string>(buyAmountValue, 500);
  // const [inputFocus, setInputFocus] = useState<'buy' | 'sell'>();
  // const [skipValidation, setSkipValidation] = useState(true);
  // const [selectFor, setSelectFor] = useState<'buy' | 'sell'>();
  // const [showSelectToken, setShowSelectToken] = useState(false);
  // const [showConfirmSwap, setShowConfirmSwap] = useState(false);
  // const transactions = useNotifications();
  // const sellTokenBalance = useErc20BalanceQuery({
  //   account,
  //   provider,
  //   tokenAddress: sellToken?.token.address,
  // });
  // const approveToken = useErc20ApproveMutation(
  //   walletProvider,
  //   async (hash: string, asset: SwappableAssetV4) => {
  //     if (asset.type === 'ERC20') {
  //       const decimals = await getERC20Decimals(
  //         asset.tokenAddress,
  //         walletProvider
  //       );
  //       const symbol = await getERC20Symbol(asset.tokenAddress, walletProvider);
  //       transactions.addTransaction(hash, TransactionType.APPROVE, {
  //         amount: asset.amount,
  //         symbol,
  //         decimals,
  //       });
  //     }
  //   },
  //   {
  //     onError: (error: any) => transactions.setDialogError(error),
  //     onMutate: async ({
  //       spender,
  //       amount,
  //       tokenAddress,
  //     }: {
  //       spender: string;
  //       amount: ethers.BigNumber;
  //       tokenAddress?: string;
  //     }) => {
  //       if (tokenAddress && amount) {
  //         const decimals = await getERC20Decimals(tokenAddress, provider);
  //         const symbol = await getERC20Symbol(tokenAddress, provider);
  //         const metadata = {
  //           amount: amount.toString(),
  //           symbol,
  //           decimals,
  //         };
  //         transactions.showDialog(true, metadata, TransactionType.APPROVE);
  //       }
  //     },
  //   }
  // );
  // const handleSetValues = (quote?: Quote) => {
  //   if (quote) {
  //     setSellAmountValue(
  //       ethers.utils.formatUnits(quote.sellAmount, sellToken?.token.decimals)
  //     );
  //     setBuyAmountValue(
  //       ethers.utils.formatUnits(quote.buyAmount, buyToken?.token.decimals)
  //     );
  //     setQuote(quote);
  //   }
  // };
  // const maxSlippage = useAtomValue(maxSlippageAtom);
  // const isAutoSlippage = useAtomValue(isAutoSlippageAtom);
  // const swapQuery = useSwapQuote({
  //   chainId,
  //   sellToken: sellToken?.token,
  //   buyToken: buyToken?.token,
  //   takerAddress: account,
  //   skipValidation,
  //   onSuccess: handleSetValues,
  //   buyAmount: inputFocus === 'buy' ? buyAmount : '',
  //   sellAmount: inputFocus === 'sell' ? sellAmount : '',
  //   maxSlippage: !isAutoSlippage ? maxSlippage : undefined,
  // });
  // const handleSetMax = () => {
  //   if (sellToken) {
  //     setSellAmountValue(
  //       ethers.utils.formatUnits(sellToken.balance, sellToken?.token.decimals)
  //     );
  //     setInputFocus('sell');
  //     swapQuery.refetch();
  //   }
  // };
  // const handleSwapSuccess = useCallback(
  //   (hash: string) => {
  //     const metadata: SwapTransactionMetadata = {
  //       buyToken: buyToken?.token as Token,
  //       sellToken: sellToken?.token as Token,
  //       sellAmount: BigNumber.from(quote?.sellAmount as string),
  //       buyAmount: BigNumber.from(quote?.buyAmount as string),
  //     };
  //     transactions.addTransaction(hash, TransactionType.SWAP, metadata);
  //   },
  //   [transactions, quote, sellToken, buyToken]
  // );
  // const execSwap = useExecSwap(handleSwapSuccess, {
  //   onError: (error: any) => transactions.setDialogError(error),
  //   onMutate: () => {
  //     const metadata: SwapTransactionMetadata = {
  //       buyToken: buyToken?.token as Token,
  //       sellToken: sellToken?.token as Token,
  //       sellAmount: BigNumber.from(quote?.sellAmount as string),
  //       buyAmount: BigNumber.from(quote?.buyAmount as string),
  //     };
  //     transactions.showDialog(true, metadata, TransactionType.SWAP);
  //   },
  // });
  // const handleClose = () => {
  //   setShowSelectToken(false);
  //   setSelectFor(undefined);
  // };
  // const handleSelectSellToken = (tokenBalance: TokenBalance) => {
  //   setSellToken(tokenBalance);
  //   handleClose();
  // };
  // const handleSelectBuyToken = (tokenBalance: TokenBalance) => {
  //   setBuyToken(tokenBalance);
  //   handleClose();
  // };
  // const handleSelect = (input: 'buy' | 'sell') => {
  //   setSelectFor(input);
  //   setShowSelectToken(true);
  // };
  // const handleFocus = (input: 'buy' | 'sell') => {
  //   setInputFocus(input);
  // };
  // const handleBlur = () => {
  //   // setInputFocus(undefined);
  // };
  // const handleChangeBuyAmount = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (NUMBER_REGEX.test(e.target.value) || e.target.value === '') {
  //     if (buyToken && buyToken.token.decimals) {
  //       const value = e.target.value;
  //       const decimals = value.split('.')[1]?.length || 0;
  //       if (decimals > buyToken.token.decimals) {
  //         setBuyAmountValue(Number(value).toFixed(buyToken.token.decimals));
  //       } else {
  //         setBuyAmountValue(value);
  //       }
  //     }
  //   }
  // };
  // const handleChangeSellAmount = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (NUMBER_REGEX.test(e.target.value) || e.target.value === '') {
  //     if (sellToken && sellToken.token.decimals) {
  //       const value = e.target.value;
  //       const decimals = value.split('.')[1]?.length || 0;
  //       if (decimals > sellToken.token.decimals) {
  //         setSellAmountValue(Number(value).toFixed(sellToken.token.decimals));
  //       } else {
  //         setSellAmountValue(value);
  //       }
  //     }
  //   }
  // };
  // const handleSwapTokens = () => {
  //   const buyTokenTemp = buyToken;
  //   const sellTokenTemp = sellToken;
  //   setSellToken(buyTokenTemp);
  //   setBuyToken(sellTokenTemp);
  //   setInputFocus('sell');
  // };
  // const hasSufficientAllowance = async (
  //   spender: string,
  //   tokenAddress: string,
  //   amount: ethers.BigNumber
  // ) => {
  //   if (!provider || !account) {
  //     return false;
  //   }
  //   if (spender === ZERO_ADDRESS) {
  //     return true;
  //   }
  //   const allowance = await getERC20TokenAllowance(
  //     provider,
  //     tokenAddress,
  //     account,
  //     spender
  //   );
  //   return allowance.gte(amount);
  // };
  // const handleConfirmSwap = async () => {
  //   if (quote && sellToken && sellToken?.token) {
  //     const {
  //       token: { address, decimals },
  //     } = sellToken;
  //     if (address && decimals) {
  //       if (
  //         quote.sellTokenAddress.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS
  //       ) {
  //         setSkipValidation(false);
  //         setShowConfirmSwap(true);
  //       } else if (
  //         await hasSufficientAllowance(
  //           quote.allowanceTarget,
  //           address,
  //           BigNumber.from(quote.sellAmount)
  //         )
  //       ) {
  //         setSkipValidation(false);
  //         setShowConfirmSwap(true);
  //       } else {
  //         if (sellToken) {
  //           approveToken.mutateAsync({
  //             spender: quote.allowanceTarget,
  //             tokenAddress: sellToken.token.address,
  //             amount: ethers.constants.MaxUint256,
  //           });
  //         }
  //       }
  //     }
  //   }
  // };
  // const handleSwap = async () => {
  //   if (quote && sellToken && sellToken?.token) {
  //     const {
  //       token: { address, decimals },
  //     } = sellToken;
  //     if (address && decimals) {
  //       setShowConfirmSwap(false);
  //       await execSwap.mutateAsync(quote);
  //       execSwap.reset();
  //       setSkipValidation(true);
  //       sellTokenBalance.refetch();
  //       setQuote(undefined);
  //     }
  //   }
  // };
  // const closeConfirmSwap = () => {
  //   setShowConfirmSwap(false);
  //   setSkipValidation(true);
  // };
  // const connectWalletDialog = useConnectWalletDialog();
  // const handleConnectWallet = () => {
  //   connectWalletDialog.show();
  // };
  // const isOverSellAmount = useMemo(() => {
  //   if (NUMBER_REGEX.test(sellAmount)) {
  //     if (sellToken && sellToken.token.decimals) {
  //       const decimals = sellAmount.split('.')[1]?.length || 0;
  //       if (decimals > sellToken.token.decimals) {
  //         return sellToken?.balance.lt(
  //           ethers.utils.parseUnits(
  //             Number(sellAmount).toFixed(sellToken.token.decimals),
  //             sellToken.token.decimals
  //           )
  //         );
  //       } else {
  //         return sellToken?.balance.lt(
  //           ethers.utils.parseUnits(sellAmount, sellToken.token.decimals)
  //         );
  //       }
  //     }
  //   }
  //   return false;
  // }, [sellToken?.token, sellAmount]);
  // const [showSettings, setShowSettings] = useState(false);
  // const handleSettingsClose = () => {
  //   setShowSettings(false);
  // };
  // const handleShowSettings = () => {
  //   setShowSettings(true);
  // };
  // return (
  //   <>
  //     {showConfirmSwap && (
  //       <ConfirmSwapDialog
  //         dialogProps={{
  //           open: showConfirmSwap,
  //           fullWidth: true,
  //           maxWidth: 'sm',
  //           onClose: closeConfirmSwap,
  //         }}
  //         quote={quote}
  //         sellToken={sellToken?.token}
  //         buyToken={buyToken?.token}
  //         confirm={() => handleSwap()}
  //         errorMessage={swapQuery.error?.message}
  //       />
  //     )}
  //     {showSelectToken && (
  //       <SelectTokenBalancesDialog
  //         dialogProps={{
  //           open: showSelectToken,
  //           fullWidth: true,
  //           maxWidth: 'sm',
  //           onClose: handleClose,
  //         }}
  //         selectedChainId={chainId}
  //         onSelect={
  //           selectFor === 'sell' ? handleSelectSellToken : handleSelectBuyToken
  //         }
  //         excludeToken={selectFor === 'sell' ? buyToken : sellToken}
  //       />
  //     )}
  //     <SwapSettingsDialog
  //       dialogProps={{
  //         open: showSettings,
  //         fullWidth: true,
  //         maxWidth: 'xs',
  //         onClose: handleSettingsClose,
  //       }}
  //     />
  //     <Card>
  //       <CardHeader
  //         title={
  //           <Stack
  //             spacing={2}
  //             direction={'row'}
  //             alignContent={'center'}
  //             alignItems={'center'}
  //           >
  //             <Typography variant="h5">
  //               <FormattedMessage id="swap" defaultMessage="Swap" />
  //             </Typography>
  //           </Stack>
  //         }
  //         action={
  //           <Stack
  //             spacing={1}
  //             direction={'row'}
  //             alignContent={'center'}
  //             alignItems={'center'}
  //           >
  //             <NetworkSelectButton
  //               chainId={chainId}
  //               onChange={(newChain) => {
  //                 setChainId(newChain);
  //                 setSellToken(undefined);
  //                 setBuyToken(undefined);
  //                 setSellAmountValue('');
  //                 setBuyAmountValue('');
  //               }}
  //             />
  //             <IconButton onClick={handleShowSettings}>
  //               <SettingsIcon />
  //             </IconButton>
  //           </Stack>
  //         }
  //       />
  //       <Divider />
  //       <CardContent>
  //         <Grid container spacing={2}>
  //           {sellToken && sellTokenBalance.data && (
  //             <Grid item xs={12}>
  //               <Stack
  //                 direction="row"
  //                 justifyContent="flex-end"
  //                 alignItems="center"
  //                 spacing={2}
  //               >
  //                 <Typography>
  //                   {ethers.utils.formatUnits(
  //                     sellTokenBalance.data,
  //                     sellToken.token.decimals
  //                   )}{' '}
  //                   {sellToken.token.symbol}
  //                 </Typography>
  //               </Stack>
  //             </Grid>
  //           )}
  //           <Grid item xs={12}>
  //             <Grid container spacing={2}>
  //               <Grid item xs={4}>
  //                 <Button
  //                   size="large"
  //                   variant="outlined"
  //                   fullWidth
  //                   startIcon={
  //                     sellToken?.token.logoURI && (
  //                       <Avatar
  //                         sx={{ width: 'auto', height: '1rem' }}
  //                         src={sellToken?.token.logoURI}
  //                       />
  //                     )
  //                   }
  //                   endIcon={<KeyboardArrowDownIcon />}
  //                   onClick={() => handleSelect('sell')}
  //                 >
  //                   {sellToken != undefined ? (
  //                     sellToken?.token.symbol
  //                   ) : (
  //                     <FormattedMessage id="select" defaultMessage="Select" />
  //                   )}
  //                 </Button>
  //               </Grid>
  //               <Grid item xs>
  //                 <TextField
  //                   autoComplete="off"
  //                   fullWidth
  //                   size="small"
  //                   onBlur={handleBlur}
  //                   value={sellAmountValue}
  //                   onFocus={(e) => handleFocus('sell')}
  //                   onChange={handleChangeSellAmount}
  //                   InputProps={{
  //                     endAdornment: isActive && (
  //                       <InputAdornment position="end">
  //                         <Button
  //                           size="small"
  //                           variant="text"
  //                           onClick={handleSetMax}
  //                           disabled={sellToken === undefined}
  //                         >
  //                           <FormattedMessage id="max" defaultMessage="Max" />
  //                         </Button>
  //                       </InputAdornment>
  //                     ),
  //                   }}
  //                 />
  //               </Grid>
  //             </Grid>
  //           </Grid>
  //           <Grid item xs={12}>
  //             <Box display="flex" justifyContent="center">
  //               <IconButton
  //                 disabled={!isActive}
  //                 onClick={handleSwapTokens}
  //                 size="small"
  //               >
  //                 <ArrowDownwardRoundedIcon fontSize="small" />
  //               </IconButton>
  //             </Box>
  //           </Grid>
  //           <Grid item xs={12}>
  //             <Grid container spacing={2}>
  //               <Grid item xs={4}>
  //                 <Button
  //                   variant="outlined"
  //                   size="large"
  //                   fullWidth
  //                   startIcon={
  //                     buyToken?.token.logoURI && (
  //                       <Avatar
  //                         sx={{ width: 'auto', height: '1rem' }}
  //                         src={buyToken?.token.logoURI}
  //                       />
  //                     )
  //                   }
  //                   endIcon={<KeyboardArrowDownIcon />}
  //                   onClick={() => handleSelect('buy')}
  //                 >
  //                   {buyToken != undefined ? (
  //                     buyToken?.token.symbol
  //                   ) : (
  //                     <FormattedMessage id="select" defaultMessage="Select" />
  //                   )}
  //                 </Button>
  //               </Grid>
  //               <Grid item xs>
  //                 <TextField
  //                   size="small"
  //                   autoComplete="off"
  //                   onBlur={handleBlur}
  //                   fullWidth
  //                   value={buyAmountValue}
  //                   onFocus={(e) => handleFocus('buy')}
  //                   onChange={handleChangeBuyAmount}
  //                 />
  //               </Grid>
  //             </Grid>
  //           </Grid>
  //           {quote && (
  //             <Grid item xs={12}>
  //               <Stack>
  //                 <Stack
  //                   direction="row"
  //                   alignItems="center"
  //                   alignContent="center"
  //                   justifyContent="space-between"
  //                 >
  //                   <Typography sx={{ fontWeight: 600 }}>
  //                     <FormattedMessage
  //                       id="transaction.cost"
  //                       defaultMessage="Transaction cost"
  //                     />
  //                   </Typography>
  //                   <Stack direction={'row'} spacing={2}>
  //                     {nativeCurrencyPriceQuery.data && (
  //                       <Typography color="body2">
  //                         <FormattedNumber
  //                           value={
  //                             Number(
  //                               ethers.utils.formatEther(
  //                                 BigNumber.from(quote.gas).mul(quote.gasPrice)
  //                               )
  //                             ) * nativeCurrencyPriceQuery.data
  //                           }
  //                           style="currency"
  //                           currency={currency}
  //                         />
  //                       </Typography>
  //                     )}
  //                     <Typography color="textSecondary">
  //                       (
  //                       {ethers.utils.formatEther(
  //                         BigNumber.from(quote.gas).mul(quote.gasPrice)
  //                       )}{' '}
  //                       {getNativeTokenSymbol(chainId)})
  //                     </Typography>
  //                   </Stack>
  //                 </Stack>
  //                 <Stack
  //                   direction="row"
  //                   alignItems="center"
  //                   alignContent="center"
  //                   justifyContent="space-between"
  //                 >
  //                   <Typography sx={{ fontWeight: 600 }}>
  //                     <FormattedMessage id="you.pay" defaultMessage="You pay" />
  //                   </Typography>
  //                   <Typography color="textSecondary">
  //                     {ethers.utils.formatUnits(
  //                       BigNumber.from(quote.sellAmount),
  //                       sellToken?.token?.decimals || 18
  //                     )}{' '}
  //                     {sellToken?.token.symbol}
  //                   </Typography>
  //                 </Stack>
  //                 {/* {appConfig.swapFees?.amount_percentage !== undefined && (
  //                   <Stack
  //                     direction="row"
  //                     alignItems="center"
  //                     alignContent="center"
  //                     justifyContent="space-between"
  //                   >
  //                     <Typography sx={{ fontWeight: 600 }}>
  //                       <FormattedMessage
  //                         id="marketplace.fee"
  //                         defaultMessage="Marketplace fee"
  //                       />
  //                     </Typography>
  //                     <Typography color="textSecondary">
  //                       {ethers.utils.formatUnits(
  //                         BigNumber.from(quote.buyAmount)
  //                           .mul(appConfig.swapFees.amount_percentage * 100)
  //                           .div(10000),
  //                         buyToken?.token.decimals
  //                       )}{' '}
  //                       {buyToken?.token.symbol.toUpperCase()}
  //                     </Typography>
  //                   </Stack>
  //                 )} */}
  //                 <Stack
  //                   direction="row"
  //                   alignItems="center"
  //                   alignContent="center"
  //                   justifyContent="space-between"
  //                 >
  //                   <Typography sx={{ fontWeight: 600 }}>
  //                     <FormattedMessage
  //                       id="you.receive"
  //                       defaultMessage="You receive"
  //                     />
  //                   </Typography>
  //                   <Typography color="textSecondary">
  //                     {ethers.utils.formatUnits(
  //                       BigNumber.from(quote.buyAmount),
  //                       buyToken?.token?.decimals || 18
  //                     )}{' '}
  //                     {buyToken?.token.symbol}
  //                   </Typography>
  //                 </Stack>
  //               </Stack>
  //             </Grid>
  //           )}
  //           {swapQuery.isLoading && (
  //             <Grid item xs={12}>
  //               <Grid
  //                 container
  //                 spacing={1}
  //                 alignItems="center"
  //                 alignContent="center"
  //               >
  //                 <Grid item>
  //                   <CircularProgress
  //                     color="inherit"
  //                     size="1rem"
  //                     style={{ marginRight: 2 }}
  //                   />
  //                 </Grid>
  //                 <Grid item>
  //                   <Typography gutterBottom variant="body2">
  //                     <FormattedMessage
  //                       id="fetching.best.price"
  //                       defaultMessage="Fetching best price"
  //                     />
  //                   </Typography>
  //                 </Grid>
  //               </Grid>
  //             </Grid>
  //           )}
  //           {swapQuery.error && (
  //             <Grid item xs={12}>
  //               <Alert severity="error">
  //                 {String(swapQuery.error?.message)}
  //               </Alert>
  //             </Grid>
  //           )}
  //           {execSwap.isError && (
  //             <Grid item xs={12}>
  //               <Alert severity="error">
  //                 {(execSwap as any).error.message}
  //               </Alert>
  //             </Grid>
  //           )}
  //           {!isActive ? (
  //             <Grid item xs={12}>
  //               <Button
  //                 onClick={handleConnectWallet}
  //                 fullWidth
  //                 startIcon={
  //                   isActivating ? (
  //                     <CircularProgress color="inherit" size="1rem" />
  //                   ) : (
  //                     <Wallet />
  //                   )
  //                 }
  //                 size="large"
  //                 variant="contained"
  //                 color="primary"
  //               >
  //                 <FormattedMessage
  //                   id="connect.wallet"
  //                   defaultMessage="Connect Wallet"
  //                 />
  //               </Button>
  //             </Grid>
  //           ) : chainId !== walletChainId ? (
  //             <Grid item xs={12}>
  //               <Button
  //                 onClick={() => openDialog(chainId as number)}
  //                 fullWidth
  //                 startIcon={
  //                   isActivating ? (
  //                     <CircularProgress color="inherit" size="1rem" />
  //                   ) : (
  //                     <Wallet />
  //                   )
  //                 }
  //                 size="large"
  //                 variant="contained"
  //                 color="primary"
  //               >
  //                 <FormattedMessage
  //                   id="switch.to.network"
  //                   defaultMessage="Switch to {network} network"
  //                   values={{
  //                     network: getChainName(chainId),
  //                   }}
  //                 />
  //               </Button>
  //             </Grid>
  //           ) : (
  //             <Grid item xs={12}>
  //               <Button
  //                 size="large"
  //                 disabled={
  //                   swapQuery.error !== null ||
  //                   swapQuery.isLoading ||
  //                   execSwap.isLoading ||
  //                   approveToken.isLoading ||
  //                   sellToken === undefined ||
  //                   buyToken === undefined ||
  //                   quote === undefined ||
  //                   isOverSellAmount
  //                 }
  //                 startIcon={
  //                   execSwap.isLoading || approveToken.isLoading ? (
  //                     <CircularProgress color="inherit" size="1rem" />
  //                   ) : undefined
  //                 }
  //                 onClick={handleConfirmSwap}
  //                 fullWidth
  //                 variant="contained"
  //                 color="primary"
  //               >
  //                 {approveToken.isLoading ? 'Approving' : 'Swap'}
  //               </Button>
  //             </Grid>
  //           )}
  //         </Grid>
  //       </CardContent>
  //     </Card>
  //   </>
  // );
}

export default Swap;
