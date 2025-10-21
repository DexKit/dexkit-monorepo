import { getNetworkSlugFromChainId } from "@dexkit/core/utils/blockchain";
import {
  GatedCondition,
  GatedPageLayout,
} from "@dexkit/ui/modules/wizard/types";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import RefreshIcon from "@mui/icons-material/Refresh";
import Security from "@mui/icons-material/Security";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import LoginAppButton from "../LoginAppButton";

const CustomImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  display: "block",
}));

export function GatedConditionView({
  conditions,
  partialResults,
  balances,
  account,
  isLoggedIn,
  layout,
  isEdit,
  isLoading,
  onRetry,
}: {
  layout?: GatedPageLayout;
  conditions?: GatedCondition[];
  account?: string;
  result?: boolean;
  isLoggedIn?: boolean;
  partialResults?: { [key: number]: boolean };
  balances?: { [key: number]: string };
  isEdit?: boolean;
  isLoading?: boolean;
  onRetry?: () => void;
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
              />{" "}
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

    if (isLoading) {
      return (
        <Paper
          sx={{
            px: 0.5,
            py: 0.25,
            border: (theme) => `2px solid ${theme.palette.info.main}`,
          }}
          variant="outlined"
        >
          <Typography variant="body2" color="info.dark">
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <CircularProgress size={16} color="info" />{" "}
              <Box
                component="span"
                sx={{ color: (theme) => theme.palette.info.main }}
              >
                <FormattedMessage
                  id="verifying"
                  defaultMessage="Verifying..."
                />
              </Box>
            </Stack>
          </Typography>
        </Paper>
      );
    }

    if (balances && balances[index] === "Error") {
      return (
        <Paper
          sx={{
            px: 0.5,
            py: 0.25,
            border: (theme) => `2px solid ${theme.palette.warning.main}`,
          }}
          variant="outlined"
        >
          <Typography variant="body2" color="warning.dark">
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <InfoIcon fontSize="inherit" color="warning" />{" "}
              <Box
                component="span"
                sx={{ color: (theme) => theme.palette.warning.dark }}
              >
                <FormattedMessage
                  id="error.checking"
                  defaultMessage="Error checking"
                />
              </Box>
            </Stack>
          </Typography>
        </Paper>
      );
    }

    if (balances && balances[index] === "Any token") {
      return (
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
              <Check fontSize="inherit" color="success" />{" "}
              <Box
                component="span"
                sx={{ color: (theme) => theme.palette.success.dark }}
              >
                <FormattedMessage id="any.token" defaultMessage="Any token" />
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
            <Check fontSize="inherit" color="success" />{" "}
            <Box
              component="span"
              sx={{ color: (theme) => theme.palette.success.dark }}
            >
              <FormattedMessage id="verified" defaultMessage="Verified" />
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
            <Close fontSize="inherit" color="error" />{" "}
            <Box
              component="span"
              sx={{ color: (theme) => theme.palette.error.dark }}
            >
              <FormattedMessage
                id="not.verified"
                defaultMessage="Not verified"
              />
            </Box>
          </Stack>
        </Typography>
      </Paper>
    );
  };

  const renderCondition = (condition: GatedCondition, index: number) => {
    if (condition.type === "collection") {
      return (
        <Stack spacing={1}>
          <Typography color="text.primary" fontWeight="bold" variant="body2">
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
                      condition.chainId
                    )?.toUpperCase()}{" "}
                    - {condition.symbol}
                    {condition.protocol === "ERC1155" && condition.tokenId
                      ? `- ID - ${condition.tokenId}`
                      : null}
                  </Typography>
                ),
              }}
            />
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography color="text.primary" variant="body2">
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
            <Divider orientation="vertical" sx={{ height: "1rem" }} />
            {balances && balances[index] && (
              <Typography
                color="text.primary"
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
                        {balances[index] === "Any token" ? (
                          <FormattedMessage
                            id="any.token.collection"
                            defaultMessage="Any token of this collection"
                          />
                        ) : (
                          balances[index]
                        )}
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

    if (condition.type === "coin") {
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

            <Divider orientation="vertical" sx={{ height: "1rem" }} />
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
                        {balances[index] === "Any token" ? (
                          <FormattedMessage
                            id="any.token.collection"
                            defaultMessage="Any token of this collection"
                          />
                        ) : (
                          balances[index]
                        )}
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

  const renderLoading = () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      my={4}
      width="100%"
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.primary">
          <FormattedMessage
            id="verifying.assets"
            defaultMessage="Verifying your assets..."
          />
        </Typography>
        <Typography variant="body2" color="text.primary">
          <FormattedMessage
            id="please.wait"
            defaultMessage="Please wait while we verify your assets on the blockchain."
          />
        </Typography>
      </Stack>
    </Box>
  );

  const renderRetryButton = () => {
    if (!onRetry) return null;

    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
        >
          <FormattedMessage
            id="retry.verification"
            defaultMessage="Retry verification"
          />
        </Button>
      </Box>
    );
  };

  const hasErrors =
    balances && Object.values(balances).some((balance) => balance === "Error");

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "rgba(0,0,0, 0.2)"
                : alpha(theme.palette.common.white, 0.1),
            borderRadius: (theme) => typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 4 : theme.shape.borderRadius,
            backgroundImage: (theme) =>
              layout?.frontImageDark || layout?.frontImage
                ? `url('${theme.palette.mode === "light"
                  ? layout?.frontImage
                  : layout?.frontImageDark || layout?.frontImage
                }')`
                : undefined,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <Stack
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            sx={{
              height: layout?.frontImageHeight,
              maxHeight: 300,
              minHeight: 50,
            }}
          >
            {((theme.palette.mode === "light" && !layout?.frontImage) ||
              (theme.palette.mode === "dark" &&
                !(layout?.frontImage || layout?.frontImageDark))) && (
                <Security
                  sx={{
                    fontSize: 80,
                    color: (theme) =>
                      theme.palette.getContrastText(
                        theme.palette.mode === "light"
                          ? "rgba(0,0,0, 0.2)"
                          : alpha(theme.palette.common.white, 0.1)
                      ),
                  }}
                />
              )}
          </Stack>
        </Box>
      </Grid>
      <Grid size={12}>
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
              defaultMessage="To access this private page, ensure you meet all the conditions below defined by the page owner:"
            />
          )}
        </Alert>
      </Grid>
      <Grid size={12}>
        {account && isLoggedIn ? (
          isLoading && (!conditions || conditions.length === 0) ? (
            renderLoading()
          ) : (
            <>
              {isLoading && (
                <Box display="flex" justifyContent="center" mb={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress size={24} />
                    <Typography variant="body1" color="text.primary">
                      <FormattedMessage
                        id="verifying.assets"
                        defaultMessage="Verifying your assets..."
                      />
                    </Typography>
                  </Stack>
                </Box>
              )}
              <Grid container spacing={2}>
                {(conditions || []).map((condition, index) => (
                  <Grid size={12} key={index}>
                    <Box>
                      <Stack spacing={2}>
                        {index !== 0 && (
                          <Paper
                            sx={{
                              py: 0.5,
                              backgroundColor: (theme) =>
                                condition.condition === "or"
                                  ? alpha(theme.palette.warning.light, 0.2)
                                  : alpha(theme.palette.info.light, 0.2),
                              border: (theme) =>
                                `1px solid ${condition.condition === "or"
                                  ? theme.palette.warning.main
                                  : theme.palette.info.main
                                }`,
                            }}
                          >
                            <Typography
                              variant="body1"
                              textAlign="center"
                              textTransform="uppercase"
                              fontWeight="bold"
                              sx={(theme) => ({
                                color: condition.condition === "or"
                                  ? theme.palette.warning.dark
                                  : theme.palette.info.dark
                              })}
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
                                        {condition.condition === "or" ? (
                                          <FormattedMessage
                                            id="or"
                                            defaultMessage="O"
                                          />
                                        ) : (
                                          <FormattedMessage
                                            id="and"
                                            defaultMessage="Y"
                                          />
                                        )}
                                      </Typography>
                                    ),
                                  }}
                                />
                              ) : condition.condition === "or" ? (
                                <FormattedMessage id="or" defaultMessage="O" />
                              ) : (
                                <FormattedMessage id="and" defaultMessage="Y" />
                              )}
                            </Typography>
                          </Paper>
                        )}

                        <Card
                          sx={{
                            border: (theme) =>
                              partialResults && partialResults[index]
                                ? `1px solid ${theme.palette.success.main}`
                                : undefined,
                            boxShadow: (theme) =>
                              partialResults && partialResults[index]
                                ? `0 0 8px ${alpha(theme.palette.success.main, 0.4)}`
                                : undefined,
                          }}
                        >
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
              {hasErrors && renderRetryButton()}
            </>
          )
        ) : (
          <Stack justifyContent={"center"} alignItems={"center"}>
            <Box sx={{ maxWidth: "500px" }}>
              <LoginAppButton />
            </Box>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
