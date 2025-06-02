import { formatBigNumber } from '@dexkit/core/utils';
import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { parseUnits } from '@dexkit/core/utils/ethers/parseUnits';
import { useDexKitContext } from '@dexkit/ui';
import FormikDecimalInput from '@dexkit/ui/components/FormikDecimalInput';
import {
  useDepositRewardTokensMutation,
  useSetDefaultTimeUnit,
  useSetRewardRatio,
  useThirdwebApprove,
  useWithdrawRewardsMutation,
} from '@dexkit/ui/modules/contract-wizard/hooks/thirdweb';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  useContract,
  useContractRead,
  useTokenBalance,
} from '@thirdweb-dev/react';
import { BigNumber } from 'ethers';
import { Field, Formik } from 'formik';
import { Switch, TextField } from 'formik-mui';
import moment from 'moment';
import { SyntheticEvent, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ContractAdminTab from '../ContractAdminTab';
import ContractMetadataTab from '../ContractMetadataTab';

const THIRD_WEB_STAKE_TIMEUNITS: {
  value: string;
  id: string;
  defaultMessage: string;
}[] = [
  { value: (3600).toString(), id: 'one.hour', defaultMessage: '1 hour' },
  { value: (24 * 3600).toString(), id: 'one.day', defaultMessage: '1 day' },
];

export interface ContractStakeErc20ContainerProps {
  address: string;
  network: string;
}

export default function ContractStakeErc20Container({
  address,
  network,
}: ContractStakeErc20ContainerProps) {
  const [tab, setTab] = useState<string>('deposit');

  const handleChangeTab = (e: SyntheticEvent, value: string) => {
    setTab(value);
  };

  const { data: contract } = useContract(address, 'custom');

  const { account } = useWeb3React();

  const { data: rewardTokenAddress } = useContractRead(contract, 'rewardToken');

  const { data: rewardsBalance } = useContractRead(
    contract,
    'getRewardTokenBalance',
  );

  const { data: totalStakedBalance } = useContractRead(
    contract,
    'stakingTokenBalance',
  );

  const { data: stakingTokenAddress } = useContractRead(
    contract,
    'stakingToken',
  );
  const { data: rewardToken } = useContract(rewardTokenAddress || '', 'token');

  const { data: stakingToken } = useContract(
    stakingTokenAddress || '',
    'token',
  );

  const { data: rewardTokenBalance } = useTokenBalance(rewardToken, account);

  const { data: stakingTokenBalance } = useTokenBalance(stakingToken, account);

  const { data: rewardRatio } = useContractRead(contract, 'getRewardRatio');
  const { data: rewardTimeUnit } = useContractRead(contract, 'getTimeUnit');

  const [numerator, denominator] = useMemo(() => {
    if (rewardRatio) {
      const [n, d] = rewardRatio;
      return [n as BigNumber, d as BigNumber];
    }

    return [BigNumber.from(0), BigNumber.from(0)];
  }, [rewardRatio]);

  const { data: allowance } = useQuery(
    ['REWARD_TOKEN_ALLOWANCE', rewardTokenAddress],
    async () => {
      return await rewardToken?.erc20.allowance(address);
    },
  );

  const { mutateAsync: approve } = useThirdwebApprove({
    contract: rewardToken,
    address,
  });

  const { watchTransactionDialog } = useDexKitContext();

  const withdrawRewardTokensMutation = useWithdrawRewardsMutation({
    contract,
    rewardDecimals: rewardTokenBalance?.decimals,
  });

  const depositRewardTokensMutation = useDepositRewardTokensMutation({
    contract,
    rewardDecimals: rewardTokenBalance?.decimals,
  });

  const handleSubmitRewards = async ({
    amount,
    withdraw,
  }: {
    amount: string;
    withdraw: boolean;
  }) => {
    const amountParsed = parseUnits(amount, rewardTokenBalance?.decimals);

    if (withdraw) {
      try {
        await withdrawRewardTokensMutation.mutateAsync({
          amount: amountParsed,
        });
      } catch (err) {
        watchTransactionDialog.setError(err as any);
      }

      return;
    }

    if (!allowance?.value.gte(amountParsed)) {
      await approve({ amount });
    }

    try {
      await depositRewardTokensMutation.mutateAsync({
        amount: amountParsed,
      });
    } catch (err) {
      watchTransactionDialog.setError(err as any);
    }
  };

  const setDefaultTimeUnit = useSetDefaultTimeUnit({
    contract,
    isAltVersion: true,
  });

  const handleSubmitTimeUnit = async ({ timeUnit }: { timeUnit: string }) => {
    await setDefaultTimeUnit.mutateAsync({ timeUnit });
  };

  const setRewardRatioMutation = useSetRewardRatio({ contract });

  const handleSubmitRewardRatio = async ({
    numerator,
    denominator,
  }: {
    numerator: string;
    denominator: string;
  }) => {
    await setRewardRatioMutation.mutateAsync({ numerator, denominator });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage
                id="your.balance"
                defaultMessage="Your balance"
              />
            </Typography>
            <Typography variant="h5">
              {formatBigNumber(
                rewardTokenBalance?.value || BigNumber.from('0'),
                rewardTokenBalance?.decimals || 18,
              )}{' '}
              {rewardTokenBalance?.symbol}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage
                id="reward.ratio.each.reward.time"
                defaultMessage="Reward ratio each reward time"
              />
            </Typography>
            <Typography variant="h5">
              {denominator.gt(0) ? (
                <>
                  {numerator.mul(10000).div(denominator).toNumber() / 10000}{' '}
                  {rewardTokenBalance?.symbol}{' '}
                  {moment
                    .duration(rewardTimeUnit?.toNumber(), 'seconds')
                    .humanize()}{' '}
                </>
              ) : (
                0
              )}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage
                id="available.rewards"
                defaultMessage="Available rewards"
              />
            </Typography>
            <Typography variant="h5">
              {rewardsBalance && rewardTokenBalance ? (
                `${formatBigNumber(
                  rewardsBalance,
                  rewardTokenBalance?.decimals || 18,
                )} ${rewardTokenBalance?.symbol}`
              ) : (
                <Skeleton />
              )}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage
                id="total.staked"
                defaultMessage="Total staked"
              />
            </Typography>
            <Typography variant="h5">
              {totalStakedBalance && stakingTokenBalance ? (
                `${formatBigNumber(
                  totalStakedBalance,
                  stakingTokenBalance?.decimals || 18,
                )} ${stakingTokenBalance.symbol}`
              ) : (
                <Skeleton />
              )}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage id="reward.time" defaultMessage="Reward Time" />
            </Typography>
            <Typography variant="h5">
              <FormattedMessage
                id="every.reward"
                defaultMessage="Every {timeUnit}"
                values={{
                  timeUnit:
                    rewardTimeUnit?.toNumber() <= 60
                      ? `${rewardTimeUnit?.toNumber()}s`
                      : moment
                          .duration(rewardTimeUnit?.toNumber(), 'seconds')
                          .humanize(),
                }}
              />
            </Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Tabs value={tab} onChange={handleChangeTab}>
          <Tab
            label={<FormattedMessage id="deposit" defaultMessage="Deposit" />}
            value="deposit"
          />
          <Tab
            label={<FormattedMessage id="settings" defaultMessage="Settings" />}
            value="settings"
          />
          <Tab
            label={<FormattedMessage id="admin" defaultMessage="Admin" />}
            value="admin"
          />
          <Tab
            label={<FormattedMessage id="metadata" defaultMessage="Metadata" />}
            value="metadata"
          />
        </Tabs>
      </Grid>

      <Grid item xs={12}>
        {tab === 'deposit' && (
          <Formik
            initialValues={{ amount: '', withdraw: false }}
            onSubmit={handleSubmitRewards}
          >
            {({ submitForm, isSubmitting, isValid, values, setFieldValue }) => (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Field component={Switch} name="withdraw" />}
                    label={
                      <FormattedMessage
                        id="withdraw.rewards"
                        defaultMessage="Withdraw rewards"
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikDecimalInput
                    name="amount"
                    decimals={rewardTokenBalance?.decimals}
                    TextFieldProps={{
                      fullWidth: true,
                      disabled: isSubmitting,
                      label: (
                        <FormattedMessage id="amount" defaultMessage="Amount" />
                      ),
                      InputProps: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              onClick={() => {
                                if (values.withdraw) {
                                  return setFieldValue(
                                    'amount',
                                    formatUnits(
                                      rewardsBalance,
                                      rewardTokenBalance?.decimals,
                                    ),
                                  );
                                }

                                setFieldValue(
                                  'amount',
                                  rewardTokenBalance?.displayValue,
                                );
                              }}
                              size="small"
                            >
                              <FormattedMessage id="max" defaultMessage="Max" />
                            </Button>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Stack direction="row" spacing={2}>
                      <Button
                        disabled={isSubmitting || !isValid}
                        startIcon={
                          isSubmitting ? (
                            <CircularProgress color="inherit" size="1rem" />
                          ) : undefined
                        }
                        onClick={submitForm}
                        variant="contained"
                        color="primary"
                      >
                        {!values.withdraw ? (
                          <FormattedMessage
                            id="deposit.reward"
                            defaultMessage="Deposit Reward"
                          />
                        ) : (
                          <FormattedMessage
                            id="withdraw.rewards"
                            defaultMessage="Withdraw Reward"
                          />
                        )}
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Formik>
        )}
        {tab === 'settings' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage
                          id="reward.ratio"
                          defaultMessage="Reward Ratio"
                        />
                      </strong>
                    </Typography>
                    <Box>
                      <Formik
                        initialValues={{
                          denominator: denominator.toString(),
                          numerator: numerator.toString(),
                        }}
                        onSubmit={handleSubmitRewardRatio}
                      >
                        {({ submitForm, isSubmitting, isValid }) => (
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Field
                                fullWidth
                                component={TextField}
                                name="numerator"
                                type="number"
                                label={
                                  <FormattedMessage
                                    id="numerator"
                                    defaultMessage="Numerator"
                                  />
                                }
                                inputProps={{ type: 'number' }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Field
                                fullWidth
                                component={TextField}
                                name="denominator"
                                type="number"
                                label={
                                  <FormattedMessage
                                    id="denominator"
                                    defaultMessage="Denominator"
                                  />
                                }
                                inputProps={{ type: 'number' }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                disabled={isSubmitting || !isValid}
                                startIcon={
                                  isSubmitting ? (
                                    <CircularProgress
                                      color="inherit"
                                      size="1rem"
                                    />
                                  ) : undefined
                                }
                                onClick={submitForm}
                                variant="contained"
                                color="primary"
                              >
                                <FormattedMessage
                                  id="deposit"
                                  defaultMessage="Update"
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                      </Formik>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="body1">
                      <strong>
                        <FormattedMessage
                          id="reward.time"
                          defaultMessage="Reward time"
                        />
                      </strong>
                    </Typography>
                    <Box>
                      <Formik
                        initialValues={{
                          timeUnit: rewardTimeUnit?.toNumber().toString(),
                        }}
                        onSubmit={handleSubmitTimeUnit}
                      >
                        {({ submitForm, isSubmitting, isValid }) => (
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <FormikDecimalInput
                                  name="timeUnit"
                                  decimals={0}
                                  TextFieldProps={{
                                    label: (
                                      <FormattedMessage
                                        id="time.unit"
                                        defaultMessage="Time unit"
                                      />
                                    ),
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                disabled={isSubmitting || !isValid}
                                startIcon={
                                  isSubmitting ? (
                                    <CircularProgress
                                      color="inherit"
                                      size="1rem"
                                    />
                                  ) : undefined
                                }
                                onClick={submitForm}
                                variant="contained"
                                color="primary"
                              >
                                <FormattedMessage
                                  id="deposit"
                                  defaultMessage="Update"
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                      </Formik>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        {tab === 'admin' && <ContractAdminTab address={address} />}
        {tab === 'metadata' && <ContractMetadataTab address={address} />}
      </Grid>
    </Grid>
  );
}
