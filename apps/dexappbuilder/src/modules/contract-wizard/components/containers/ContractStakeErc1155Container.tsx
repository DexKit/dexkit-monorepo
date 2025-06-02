import { formatBigNumber } from '@dexkit/core/utils';
import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { parseUnits } from '@dexkit/core/utils/ethers/parseUnits';
import { useDexKitContext } from '@dexkit/ui';
import FormikDecimalInput from '@dexkit/ui/components/FormikDecimalInput';
import {
  useDepositRewardTokensMutation,
  useSetDefaultTimeUnit,
  useSetRewardsPerUnitTime,
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
import { SyntheticEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';
import ContractAdminTab from '../ContractAdminTab';
import ContractMetadataTab from '../ContractMetadataTab';

export const RewardsPerUnitTimeSchema = Yup.object().shape({
  rewardsPerUnitTime: Yup.string()
    .required()
    .matches(/^[0-9]+$/, 'Must be only digits'),
});

export interface ContractStakeErc1155ContainerProps {
  address: string;
  network: string;
}

export default function ContractStakeErc1155Container({
  address,
  network,
}: ContractStakeErc1155ContainerProps) {
  const [tab, setTab] = useState<string>('deposit');

  const handleChangeTab = (e: SyntheticEvent, value: string) => {
    setTab(value);
  };

  const { data: contract } = useContract(address, 'custom');

  const { account } = useWeb3React();

  const { data: rewardTokenAddress } = useContractRead(contract, 'rewardToken');

  const { data: rewardsBalance, refetch: refetchRewardsBalance } =
    useContractRead(contract, 'getRewardTokenBalance');

  const { data: rewardToken } = useContract(rewardTokenAddress || '', 'token');

  const { data: rewardTokenBalance, refetch: refetchRewardTokenBalance } =
    useTokenBalance(rewardToken, account);

  const { data: rewardsPerUnitTime, refetch: refetchRewardsPerUnitTime } =
    useContractRead(contract, 'getDefaultRewardsPerUnitTime');
  const { data: rewardTimeUnit } = useContractRead(
    contract,
    'getDefaultTimeUnit',
  );

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
        refetchRewardTokenBalance();
        refetchRewardsBalance();
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
      refetchRewardTokenBalance();
      refetchRewardsBalance();
    } catch (err) {
      watchTransactionDialog.setError(err as any);
    }
  };

  const setDefaultTimeUnit = useSetDefaultTimeUnit({ contract });
  const setRewardsPerUnitTimeMutation = useSetRewardsPerUnitTime({
    contract,
    isEdition: true,
  });

  const handleSubmitTimeUnit = async ({ timeUnit }: { timeUnit: string }) => {
    await setDefaultTimeUnit.mutateAsync({ timeUnit });
  };

  const handleSubmitRewardRatio = async ({
    rewardsPerUnitTime,
  }: {
    rewardsPerUnitTime: string;
  }) => {
    await setRewardsPerUnitTimeMutation.mutateAsync({
      unitTime: rewardsPerUnitTime,
    });
    refetchRewardsPerUnitTime();
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
                id="reward.per.time.unit"
                defaultMessage="Reward per time Unit"
              />
            </Typography>
            <Typography variant="h5">
              {' '}
              {formatBigNumber(
                rewardsPerUnitTime || BigNumber.from('0'),
                rewardTokenBalance?.decimals || 18,
              )}{' '}
              {rewardTokenBalance?.symbol}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage id="rewards" defaultMessage="Rewards" />
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
                          id="reward.per.unit.time.in.wei"
                          defaultMessage="Reward per Unit Time (in wei)"
                        />
                      </strong>
                    </Typography>
                    <Box>
                      <Formik
                        initialValues={{
                          rewardsPerUnitTime: rewardsPerUnitTime.toString(),
                        }}
                        validationSchema={RewardsPerUnitTimeSchema}
                        onSubmit={handleSubmitRewardRatio}
                      >
                        {({ submitForm, isSubmitting, isValid }) => (
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Field
                                fullWidth
                                component={TextField}
                                name="rewardsPerUnitTime"
                                label={
                                  <FormattedMessage
                                    id="numerator"
                                    defaultMessage="Rewards per Unit Time"
                                  />
                                }
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
                                <Field
                                  fullWidth
                                  component={TextField}
                                  name="timeUnit"
                                  type="number"
                                  label={
                                    <FormattedMessage
                                      id="time.unit"
                                      defaultMessage="Time unit"
                                    />
                                  }
                                  inputProps={{ type: 'number' }}
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
