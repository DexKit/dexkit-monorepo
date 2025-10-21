import { DexkitApiProvider } from "@dexkit/core/providers";
import { useDexKitContext, useEditSiteId } from "@dexkit/ui/hooks";
import { useUserEventsList } from "@dexkit/ui/hooks/userEvents";
import { useAppRankingQuery } from "@dexkit/ui/modules/wizard/hooks/ranking";
import { ReferralPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import CodeIcon from "@mui/icons-material/Code";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LinkIcon from "@mui/icons-material/Link";
import MoneyIcon from "@mui/icons-material/Money";
import NumbersIcon from "@mui/icons-material/Numbers";
import PeopleIcon from "@mui/icons-material/People";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

export interface ReferralSectionProps {
  section: ReferralPageSection;
  isPreview?: boolean;
}

interface GeneratedRanking {
  account: string;
  points: number;
  totalEvents: number;
  eventsCount: { [key: string]: number };
  uniqueUsers: number;
}

export default function ReferralSection({
  section,
  isPreview = false,
}: ReferralSectionProps) {
  const theme = useTheme();
  const { account, isActive } = useWeb3React();
  const { siteId: siteIdGlobal, affiliateReferral } = useDexKitContext();
  const { editSiteId } = useEditSiteId();
  const siteId = siteIdGlobal || editSiteId;

  const { instance } = useContext(DexkitApiProvider);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const sectionRef = useRef(section);
  const isVisible = useRef(true);
  const isInitialized = useRef(false);
  const selectedRankingId = useMemo(
    () => section?.config?.rankingId,
    [section?.config?.rankingId]
  );

  const selectedLeaderboardQuery = useAppRankingQuery({
    rankingId: selectedRankingId,
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = document.visibilityState === "visible";
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (!isInitialized.current) {
      sectionRef.current = section;
      isInitialized.current = true;
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;

    if (isVisible.current) {
      try {
        const oldJson = JSON.stringify(sectionRef.current);
        const newJson = JSON.stringify(section);

        if (oldJson !== newJson) {
          sectionRef.current = section;
        }
      } catch (e) {
        sectionRef.current = section;
      }
    }
  }, [section]);

  const shouldFetchData = useMemo(() => {
    return !isPreview && isVisible.current && !!account;
  }, [account, isPreview]);

  const shouldFetchLeaderboard = useMemo(() => {
    return !isPreview && isVisible.current && tabValue === 1;
  }, [tabValue, isPreview]);

  const referralLink = useMemo(() => {
    if (!account) return "";

    const baseUrl = isPreview
      ? window.location.origin
      : new URL(window.location.href).origin;

    return `${baseUrl}?ref=${account}`;
  }, [account, isPreview]);

  const referralFilter = useMemo(() => {
    if (isPreview || !account) return null;
    const lowerAccount = account.toLowerCase();
    return { referral: lowerAccount };
  }, [account, isPreview]);

  const { data: referralEventsData, isLoading: loadingReferralEvents } =
    useUserEventsList({
      instance,
      siteId,
      filter: referralFilter,
      pageSize: 1000,
    });

  const { data: allEventsData, isLoading: loadingAllEvents } =
    useUserEventsList({
      instance,
      siteId,
      pageSize: 1000,
    });

  const emptyStats = useMemo(
    () => ({
      totalReferrals: 0,
      uniqueUsers: 0,
      totalPoints: 0,
      ranking: 0,
    }),
    []
  );

  const emptyLeaderboard = useMemo<GeneratedRanking[]>(() => [], []);

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setOpen(true);
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const generatedRanking = useMemo<GeneratedRanking[]>(() => {
    if (isPreview) return emptyLeaderboard;

    if (
      selectedLeaderboardQuery.data?.data &&
      selectedLeaderboardQuery.data.data.length > 0
    ) {
      const sortedLeaderboard = [...selectedLeaderboardQuery.data.data]
        .sort((a, b) => b.points - a.points)
        .map((item) => {
          const typedItem = item as any;
          return {
            account: item.account,
            points: item.points,
            totalEvents: typedItem.totalEvents || 0,
            eventsCount: typedItem.eventsCount || {},
          } as GeneratedRanking;
        });

      return sortedLeaderboard;
    }

    return [];
  }, [selectedLeaderboardQuery.data, isPreview, emptyLeaderboard]);

  const referralStats = useMemo(() => {
    if (isPreview || !account) return emptyStats;

    if (
      selectedLeaderboardQuery.data?.data &&
      selectedLeaderboardQuery.data.data.length > 0
    ) {
      const leaderboardEntry = selectedLeaderboardQuery.data.data.find(
        (entry) => entry.account.toLowerCase() === account.toLowerCase()
      );

      if (leaderboardEntry) {
        const sortedLeaderboard = [...selectedLeaderboardQuery.data.data].sort(
          (a, b) => b.points - a.points
        );
        const userRankingPos =
          sortedLeaderboard.findIndex(
            (entry) => entry.account.toLowerCase() === account.toLowerCase()
          ) + 1;

        const typedEntry = leaderboardEntry as any;

        const stats = {
          totalReferrals: typedEntry.totalEvents || 0,
          uniqueUsers: typedEntry?.uniqueUsers || 0,
          totalPoints: leaderboardEntry.points,
          ranking: userRankingPos,
        };

        return stats;
      }
    }

    return emptyStats;
  }, [
    selectedLeaderboardQuery.data,
    referralEventsData,
    account,
    isPreview,
    emptyStats,
  ]);

  const formatForAirdrop = () => {
    const csvContent = generatedRanking
      .map((item: any) => `${item.account},${item.points},${item.totalEvents}`)
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "referral_points_airdrop.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsJson = () => {
    const jsonData = {
      appId: siteId,
      exportDate: new Date().toISOString(),
      leaderboard: generatedRanking,
    };

    const jsonContent = JSON.stringify(jsonData, null, 2);

    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "referral_leaderboard.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { showStats = true, showLeaderboard = true } = useMemo(
    () => sectionRef.current?.config || {},
    [sectionRef.current?.config]
  );

  if (
    !isPreview &&
    (loading ||
      loadingReferralEvents ||
      loadingAllEvents ||
      selectedLeaderboardQuery.isLoading)
  ) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Container
      maxWidth={isPreview ? "sm" : "lg"}
      sx={{ py: isPreview ? 2 : 4 }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant={isPreview ? "h5" : "h4"}
          component="h1"
          gutterBottom
        >
          {sectionRef.current?.title || (
            <FormattedMessage
              id="referral.program"
              defaultMessage="Referral Program"
            />
          )}
        </Typography>
        {sectionRef.current?.subtitle && (
          <Typography variant="subtitle1" color="text.secondary">
            {sectionRef.current.subtitle}
          </Typography>
        )}
      </Box>

      {isPreview ? (
        <Card>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              label={
                <FormattedMessage
                  id="your.referral"
                  defaultMessage="Your Referral"
                />
              }
              icon={<LinkIcon />}
              iconPosition="start"
            />
            {showLeaderboard && (
              <Tab
                label={
                  <FormattedMessage
                    id="leaderboard"
                    defaultMessage="Leaderboard"
                  />
                }
                icon={<EmojiEventsIcon />}
                iconPosition="start"
              />
            )}
          </Tabs>

          <CardContent>
            {tabValue === 0 ? (
              <>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <FormattedMessage
                    id="referral.info"
                    defaultMessage="Share your referral link with friends. You'll earn points for every user that connects and uses the app through your link."
                  />
                </Alert>

                <TextField
                  fullWidth
                  label={
                    <FormattedMessage
                      id="your.referral.link"
                      defaultMessage="Your Referral Link"
                    />
                  }
                  value={referralLink}
                  placeholder={
                    account
                      ? ""
                      : ((
                        <FormattedMessage
                          id="connect.wallet.first"
                          defaultMessage="Connect wallet to get your referral link"
                        />
                      ) as any)
                  }
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleCopy}
                          disabled={!referralLink}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                {showStats && (
                  <>
                    <Divider sx={{ my: 3 }} />

                    <Box>
                      <Typography variant="h6" gutterBottom>
                        <FormattedMessage
                          id="referral.stats"
                          defaultMessage="Referral Statistics"
                        />
                      </Typography>

                      <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: theme.palette.background.default,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <PeopleIcon color="primary" fontSize="large" />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <FormattedMessage
                                    id="unique.users"
                                    defaultMessage="Unique Users"
                                  />
                                </Typography>
                                <Typography variant="h5">0</Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: theme.palette.background.default,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <NumbersIcon color="primary" fontSize="large" />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <FormattedMessage
                                    id="ranking"
                                    defaultMessage="Ranking"
                                  />
                                </Typography>
                                <Typography variant="h5">0</Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: theme.palette.background.default,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <MoneyIcon color="primary" fontSize="large" />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <FormattedMessage
                                    id="total.events"
                                    defaultMessage="Total Events"
                                  />
                                </Typography>
                                <Typography variant="h5">0</Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: theme.palette.background.default,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <EmojiEventsIcon
                                color="primary"
                                fontSize="large"
                              />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <FormattedMessage
                                    id="total.points"
                                    defaultMessage="Total Points"
                                  />
                                </Typography>
                                <Typography variant="h5">0</Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                )}
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    <FormattedMessage
                      id="app.leaderboard"
                      defaultMessage="App Leaderboard"
                    />
                  </Typography>
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={formatForAirdrop}
                    disabled={true}
                    size="small"
                  >
                    <FormattedMessage
                      id="export.csv"
                      defaultMessage="Export CSV"
                    />
                  </Button>
                </Box>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <FormattedMessage id="rank" defaultMessage="Rank" />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage
                            id="address"
                            defaultMessage="Address"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <FormattedMessage
                            id="events"
                            defaultMessage="Events"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <FormattedMessage
                            id="points"
                            defaultMessage="Points"
                          />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <div style={{ textAlign: 'center', padding: '16px' }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ py: 2 }}
                          >
                            <FormattedMessage
                              id="no.referrals.yet"
                              defaultMessage="No referrals recorded yet."
                            />
                          </Typography>
                        </div>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              label={
                <FormattedMessage
                  id="your.referral"
                  defaultMessage="Your Referral"
                />
              }
              icon={<LinkIcon />}
              iconPosition="start"
            />
            {showLeaderboard && (
              <Tab
                label={
                  <FormattedMessage
                    id="leaderboard"
                    defaultMessage="Leaderboard"
                  />
                }
                icon={<EmojiEventsIcon />}
                iconPosition="start"
              />
            )}
          </Tabs>

          <CardContent>
            {tabValue === 0 ? (
              <>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <FormattedMessage
                    id="referral.info"
                    defaultMessage="Share your referral link with friends. You'll earn points for every user that connects and uses the app through your link."
                  />
                </Alert>

                <TextField
                  fullWidth
                  label={
                    <FormattedMessage
                      id="your.referral.link"
                      defaultMessage="Your Referral Link"
                    />
                  }
                  value={referralLink}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleCopy}
                          disabled={!referralLink}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                {showStats && (
                  <>
                    <Divider sx={{ my: 3 }} />

                    <Box>
                      <Typography variant="h6" gutterBottom>
                        <FormattedMessage
                          id="referral.stats"
                          defaultMessage="Referral Statistics"
                        />
                      </Typography>

                      <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: theme.palette.background.default,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <PeopleIcon color="primary" fontSize="large" />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <FormattedMessage
                                    id="unique.users"
                                    defaultMessage="Unique Users"
                                  />
                                </Typography>
                                <Typography variant="h5">
                                  {referralStats.uniqueUsers}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: theme.palette.background.default,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <NumbersIcon color="primary" fontSize="large" />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <FormattedMessage
                                    id="ranking"
                                    defaultMessage="Ranking"
                                  />
                                </Typography>
                                <Typography variant="h5">
                                  {referralStats.ranking > 0
                                    ? referralStats.ranking
                                    : "-"}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: theme.palette.background.default,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <MoneyIcon color="primary" fontSize="large" />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <FormattedMessage
                                    id="total.events"
                                    defaultMessage="Total Events"
                                  />
                                </Typography>
                                <Typography variant="h5">
                                  {referralStats.totalReferrals}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: theme.palette.background.default,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <EmojiEventsIcon
                                color="primary"
                                fontSize="large"
                              />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <FormattedMessage
                                    id="total.points"
                                    defaultMessage="Total Points"
                                  />
                                </Typography>
                                <Typography variant="h5">
                                  {referralStats.totalPoints}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                )}
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    {selectedLeaderboardQuery.data?.ranking?.title ? (
                      selectedLeaderboardQuery.data.ranking.title
                    ) : (
                      <FormattedMessage
                        id="app.leaderboard"
                        defaultMessage="App Leaderboard"
                      />
                    )}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={<CodeIcon />}
                      onClick={exportAsJson}
                      disabled={generatedRanking.length === 0}
                      size="small"
                    >
                      <FormattedMessage
                        id="export.json"
                        defaultMessage="Export JSON"
                      />
                    </Button>
                    <Button
                      startIcon={<DownloadIcon />}
                      onClick={formatForAirdrop}
                      disabled={generatedRanking.length === 0}
                      size="small"
                    >
                      <FormattedMessage
                        id="export.csv"
                        defaultMessage="Export CSV"
                      />
                    </Button>
                  </Stack>
                </Box>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <FormattedMessage id="rank" defaultMessage="Rank" />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage
                            id="address"
                            defaultMessage="Address"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <FormattedMessage
                            id="events"
                            defaultMessage="Events"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <FormattedMessage
                            id="points"
                            defaultMessage="Points"
                          />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {generatedRanking.length === 0 ? (
                        <TableRow>
                          <div style={{ textAlign: 'center', padding: '16px' }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ py: 2 }}
                            >
                              {!selectedRankingId ? (
                                <FormattedMessage
                                  id="leaderboard.not.configured"
                                  defaultMessage="Leaderboard not configured."
                                />
                              ) : (
                                <FormattedMessage
                                  id="no.referrals.yet"
                                  defaultMessage="No referrals recorded yet."
                                />
                              )}
                            </Typography>
                          </div>
                        </TableRow>
                      ) : (
                        generatedRanking
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item: any, index: any) => (
                            <TableRow key={item.account}>
                              <TableCell>
                                {page * rowsPerPage + index + 1}
                              </TableCell>
                              <TableCell>
                                {truncateAddress(item.account)}
                              </TableCell>
                              <TableCell align="right">
                                {item.totalEvents}
                              </TableCell>
                              <TableCell align="right">{item.points}</TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {generatedRanking.length > 0 && (
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={generatedRanking.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={
          <FormattedMessage
            id="copied.to.clipboard"
            defaultMessage="Copied to clipboard!"
          />
        }
      />
    </Container>
  );
}
