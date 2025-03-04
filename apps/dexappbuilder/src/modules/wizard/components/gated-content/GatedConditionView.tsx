import { getNetworkSlugFromChainId } from '@dexkit/core/utils/blockchain';
import {
  GatedCondition,
  GatedPageLayout,
} from '@dexkit/ui/modules/wizard/types';
import Check from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import Security from '@mui/icons-material/Security';
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  styled,
  useTheme,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { LoginAppButton } from 'src/components/LoginAppButton';

const CustomImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'block',
}));

export function GatedConditionView({
  conditions,
  partialResults,
  balances,
  account,
  isLoggedIn,
  layout,
  isEdit,
}: {
  layout?: GatedPageLayout;
  conditions?: GatedCondition[];
  account?: string;
  result?: boolean;
  isLoggedIn?: boolean;
  partialResults?: { [key: number]: boolean };
  balances?: { [key: number]: string };
  isEdit?: boolean;
}) {
  const renderStatus = (index: number) => {
    if (isEdit) {
      return (
        <Paper
          sx={{
            px: 0.5,
            py: 0.25,
            border: (theme) => `2px solid ${theme.palette.info.main}`,
          }}
          variant="outlined"
        >
          <Typography variant="body2" color="success.dark">
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <InfoIcon
                fontSize="inherit"
                sx={{ color: (theme) => theme.palette.info.dark }}
              />{' '}
              <Box
                component="span"
                sx={{ color: (theme) => theme.palette.info.main }}
              >
                <FormattedMessage id="status" defaultMessage="Status" />
              </Box>
            </Stack>
          </Typography>
        </Paper>
      );
    }

    return partialResults &&
      partialResults[index] &&
      partialResults[index] === true ? (
      <Paper
        sx={{
          px: 0.5,
          py: 0.25,
          border: (theme) => `2px solid ${theme.palette.success.main}`,
        }}
        variant="outlined"
      >
        <Typography variant="body2" color="success.dark">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Check fontSize="inherit" color="success" />{' '}
            <Box
              component="span"
              sx={{ color: (theme) => theme.palette.error.dark }}
            >
              <FormattedMessage id="pending" defaultMessage="Pending" />
            </Box>
          </Stack>
        </Typography>
      </Paper>
    ) : (
      <Paper
        sx={{
          px: 0.5,
          py: 0.25,
          border: (theme) => `2px solid ${theme.palette.error.main}`,
        }}
        variant="outlined"
      >
        <Typography variant="body2" color="error.main">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <InfoIcon fontSize="inherit" color="error" />{' '}
            <Box
              component="span"
              sx={{ color: (theme) => theme.palette.error.dark }}
            >
              <FormattedMessage id="pending" defaultMessage="Pending" />
            </Box>
          </Stack>
        </Typography>
      </Paper>
    );
  };

  const renderCondition = (condition: GatedCondition, index: number) => {
    if (condition.type === 'collection') {
      return (
        <Stack spacing={1}>
          <Typography color="text.secondary" fontWeight="bold" variant="body2">
            <FormattedMessage
              id="collection.collection"
              defaultMessage="Collection: {collection}"
              values={{
                collection: (
                  <Typography
                    fontWeight="400"
                    variant="inherit"
                    component="span"
                  >
                    {getNetworkSlugFromChainId(
                      condition.chainId,
                    )?.toUpperCase()}{' '}
                    - {condition.symbol}
                    {condition.protocol === 'ERC1155' && condition.tokenId
                      ? `- ID - ${condition.tokenId}`
                      : null}
                  </Typography>
                ),
              }}
            />
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography color="text.secondary" variant="body2">
              <b>
                <FormattedMessage
                  id="must.have.amount"
                  defaultMessage="Must Have: {amount}"
                  values={{
                    amount: (
                      <Typography
                        variant="inherit"
                        fontWeight="400"
                        component="span"
                      >
                        {condition.amount}
                      </Typography>
                    ),
                  }}
                />
              </b>
            </Typography>
            <Divider orientation="vertical" sx={{ height: '1rem' }} />
            {balances && balances[index] && (
              <Typography
                color="text.secondary"
                fontWeight="bold"
                variant="body2"
              >
                <FormattedMessage
                  id="your.balance.amount"
                  defaultMessage="Your Balance: {amount}"
                  values={{
                    amount: (
                      <Typography
                        variant="inherit"
                        fontWeight="400"
                        component="span"
                      >
                        {balances[index]}
                      </Typography>
                    ),
                  }}
                />
              </Typography>
            )}
            <Box pl={2}>{renderStatus(index)}</Box>
          </Stack>
        </Stack>
      );
    }

    if (condition.type === 'coin') {
      return (
        <Stack spacing={1}>
          <Typography color="text.secondary" variant="body2" fontWeight="bold">
            <FormattedMessage
              id="coin.coin"
              defaultMessage="Coin: {coin}"
              values={{
                coin: (
                  <Typography
                    fontWeight="400"
                    variant="inherit"
                    component="span"
                  >
                    {condition.name}
                  </Typography>
                ),
              }}
            />
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              color="text.secondary"
              variant="body2"
              fontWeight="bold"
            >
              <FormattedMessage
                id="must.have.amount"
                defaultMessage="Must Have: {amount}"
                values={{
                  amount: (
                    <Typography
                      fontWeight="400"
                      variant="inherit"
                      component="span"
                    >
                      {condition.amount} {condition.symbol}
                    </Typography>
                  ),
                }}
              />
            </Typography>

            <Divider orientation="vertical" sx={{ height: '1rem' }} />
            {balances && balances[index] && (
              <Typography
                color="text.secondary"
                variant="body2"
                fontWeight="bold"
              >
                <FormattedMessage
                  id="your.balance.amount"
                  defaultMessage="Your balance: {amount}"
                  values={{
                    amount: (
                      <Typography
                        fontWeight="400"
                        variant="inherit"
                        component="span"
                      >
                        {balances[index]}
                      </Typography>
                    ),
                  }}
                />
              </Typography>
            )}

            {renderStatus(index)}
          </Stack>
        </Stack>
      );
    }
  };

  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? 'rgba(0,0,0, 0.2)'
                : alpha(theme.palette.common.white, 0.1),
            borderRadius: (theme) => theme.shape.borderRadius / 4,
            backgroundImage: (theme) =>
              layout?.frontImageDark || layout?.frontImage
                ? `url('${
                    theme.palette.mode === 'light'
                      ? layout?.frontImage
                      : layout?.frontImageDark || layout?.frontImage
                  }')`
                : undefined,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <Stack
            justifyContent={'center'}
            alignContent={'center'}
            alignItems={'center'}
            sx={{
              height: layout?.frontImageHeight,
              maxHeight: 300,
              minHeight: 50,
            }}
          >
            {((theme.palette.mode === 'light' && !layout?.frontImage) ||
              (theme.palette.mode === 'dark' &&
                !(layout?.frontImage || layout?.frontImageDark))) && (
              <Security
                sx={{
                  fontSize: 80,
                  color: (theme) =>
                    theme.palette.getContrastText(
                      theme.palette.mode === 'light'
                        ? 'rgba(0,0,0, 0.2)'
                        : alpha(theme.palette.common.white, 0.1),
                    ),
                }}
              />
            )}
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="warning">
          <AlertTitle>
            <FormattedMessage
              id="access.requirements"
              defaultMessage="Access Requirements"
            />
          </AlertTitle>
          {layout?.accessRequirementsMessage ? (
            layout?.accessRequirementsMessage
          ) : (
            <FormattedMessage
              id="access.requirements.description.gated.view.conditions"
              defaultMessage="To access this private page, please ensure that you meet all the conditions below, as defined by the page owner:"
            />
          )}
        </Alert>
      </Grid>
      <Grid item xs={12}>
        {account && isLoggedIn ? (
          <Grid container spacing={2}>
            {(conditions || []).map((condition, index) => (
              <Grid item xs={12} key={index}>
                <Box>
                  <Stack spacing={2}>
                    {index !== 0 && (
                      <Paper
                        sx={{
                          py: 0.5,
                          backgroundColor:
                            theme.palette.action.disabledBackground,
                        }}
                      >
                        <Typography
                          variant="body1"
                          textAlign="center"
                          textTransform="uppercase"
                          fontWeight="bold"
                        >
                          {isEdit ? (
                            <FormattedMessage
                              id="role.connector.message"
                              defaultMessage="Rule Connector: {condition}"
                              values={{
                                condition: (
                                  <Typography
                                    variant="inherit"
                                    component="span"
                                    fontWeight="400"
                                  >
                                    {condition.condition === 'or' ? (
                                      <FormattedMessage
                                        id="or"
                                        defaultMessage="Or"
                                      />
                                    ) : (
                                      <FormattedMessage
                                        id="and"
                                        defaultMessage="And"
                                      />
                                    )}
                                  </Typography>
                                ),
                              }}
                            />
                          ) : condition.condition === 'or' ? (
                            <FormattedMessage id="or" defaultMessage="Or" />
                          ) : (
                            <FormattedMessage id="and" defaultMessage="And" />
                          )}
                        </Typography>
                      </Paper>
                    )}

                    <Card>
                      <CardContent>
                        <Stack spacing={2}>
                          <Typography variant="body1" fontWeight="bold">
                            <FormattedMessage
                              id="condition.index"
                              defaultMessage="Condition {index}"
                              values={{ index: index + 1 }}
                            />
                          </Typography>
                          {renderCondition(condition, index)}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack justifyContent={'center'} alignItems={'center'}>
            <Box sx={{ maxWidth: '500px' }}>
              <LoginAppButton />
            </Box>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
