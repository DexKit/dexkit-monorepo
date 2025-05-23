import { DexkitApiProvider } from '@dexkit/core/providers';
import { useDexKitContext } from '@dexkit/ui/hooks';
import { useUserEventsList } from '@dexkit/ui/hooks/userEvents';
import { ReferralPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LinkIcon from '@mui/icons-material/Link';
import MoneyIcon from '@mui/icons-material/Money';
import PeopleIcon from '@mui/icons-material/People';
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
  useTheme
} from '@mui/material';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface ReferralSectionProps {
  section: ReferralPageSection;
}

// Define point values for different event types
const DEFAULT_EVENT_POINTS = {
  'connect': 1,
  'swap': 5,
  'default': 1
};

export default function ReferralSection({ section }: ReferralSectionProps) {
  const theme = useTheme();
  const { account, isActive } = useWeb3React();
  const { siteId, affiliateReferral } = useDexKitContext();
  const { instance } = useContext(DexkitApiProvider);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Store section data in ref to prevent re-renders
  const sectionRef = useRef(section);
  const isVisible = useRef(true);
  const isInitialized = useRef(false);

  // Set up visibility change listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initialize once
    if (!isInitialized.current) {
      sectionRef.current = section;
      isInitialized.current = true;
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Only update the ref if section actually changes and document is visible
  useEffect(() => {
    if (!isInitialized.current) return;

    // Avoid updates when not visible
    if (isVisible.current) {
      try {
        const oldJson = JSON.stringify(sectionRef.current);
        const newJson = JSON.stringify(section);

        if (oldJson !== newJson) {
          sectionRef.current = section;
        }
      } catch (e) {
        // In case of JSON.stringify error, fallback to direct assignment
        sectionRef.current = section;
      }
    }
  }, [section]);

  // Skip data fetching when not visible
  const shouldFetchData = useMemo(() => {
    return isVisible.current && !!account;
  }, [account]);

  const shouldFetchLeaderboard = useMemo(() => {
    return isVisible.current && tabValue === 1;
  }, [tabValue]);

  // Get the event points configuration, using defaults if not provided
  const EVENT_POINTS = useMemo(() => ({
    connect: sectionRef.current?.config?.pointsConfig?.connect || DEFAULT_EVENT_POINTS.connect,
    swap: sectionRef.current?.config?.pointsConfig?.swap || DEFAULT_EVENT_POINTS.swap,
    default: sectionRef.current?.config?.pointsConfig?.default || DEFAULT_EVENT_POINTS.default
  }), [sectionRef.current?.config?.pointsConfig]);

  const referralLink = useMemo(() => {
    if (!account || !isActive) return '';

    const url = new URL(window.location.href);
    const baseUrl = `${url.protocol}//${url.host}`;
    return `${baseUrl}?ref=${account}`;
  }, [account, isActive]);

  const referralFilter = useMemo(() => {
    if (!account) return null;
    return { referral: account.toLowerCase() };
  }, [account]);

  const { data: referralEventsData, isLoading: loadingReferralEvents } = useUserEventsList({
    instance,
    siteId,
    filter: referralFilter,
    pageSize: 1000, // Get more events for proper analysis
  });

  // Get all events for leaderboard
  const { data: allEventsData, isLoading: loadingAllEvents } = useUserEventsList({
    instance,
    siteId,
    pageSize: 1000,
  });

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setOpen(true);
    }
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Process referral events with the specified rules
  const referralStats = useMemo(() => {
    if (!referralEventsData || !referralEventsData.data) {
      return {
        totalReferrals: 0,
        uniqueUsers: 0,
        totalPoints: 0,
        dailyStats: []
      };
    }

    const uniqueUsers = new Set();
    let totalPoints = 0;

    // Track daily user events for point calculation
    const dailyUserEvents = new Map();

    referralEventsData.data.forEach(event => {
      if (event.from) {
        uniqueUsers.add(event.from.toLowerCase());

        // Create key in format "user-date-event"
        const date = new Date(event.createdAt).toISOString().split('T')[0];
        const userDateKey = `${event.from.toLowerCase()}-${date}-${event.type || 'default'}`;

        // Only count once per user per day per event type
        if (!dailyUserEvents.has(userDateKey)) {
          dailyUserEvents.set(userDateKey, true);

          // Calculate points based on event type
          const pointValue = event.type &&
            (EVENT_POINTS[event.type as keyof typeof EVENT_POINTS] || EVENT_POINTS.default) ||
            EVENT_POINTS.default;
          totalPoints += pointValue;
        }
      }
    });

    // Create daily stats data for visualization if needed
    const dailyData = Array.from(dailyUserEvents.keys()).map(key => {
      const [user, date, eventType] = key.split('-');
      return { user, date, eventType };
    });

    return {
      totalReferrals: referralEventsData.data.length,
      uniqueUsers: uniqueUsers.size,
      totalPoints,
      dailyStats: dailyData
    };
  }, [referralEventsData, EVENT_POINTS]);

  // Create leaderboard data
  const leaderboardData = useMemo(() => {
    if (!allEventsData || !allEventsData.data) {
      return [];
    }

    // Group events by referrer
    const referrerMap = new Map();

    allEventsData.data.forEach(event => {
      if (event.referral && event.from) {
        const referrer = event.referral.toLowerCase();
        const user = event.from.toLowerCase();
        const date = new Date(event.createdAt).toISOString().split('T')[0];
        const eventType = event.type || 'default';
        const userDateKey = `${user}-${date}-${eventType}`;

        if (!referrerMap.has(referrer)) {
          referrerMap.set(referrer, {
            address: referrer,
            points: 0,
            uniqueUsers: new Set(),
            processedEvents: new Set()
          });
        }

        const referrerData = referrerMap.get(referrer);

        // Only process if this user-date-event combination hasn't been counted yet
        if (!referrerData.processedEvents.has(userDateKey)) {
          referrerData.processedEvents.add(userDateKey);
          referrerData.uniqueUsers.add(user);

          // Add points based on event type
          const eventTypeKey = eventType as string;
          const pointValue = eventTypeKey === 'connect' ? EVENT_POINTS.connect :
            eventTypeKey === 'swap' ? EVENT_POINTS.swap :
              EVENT_POINTS.default;
          referrerData.points += pointValue;
        }
      }
    });

    // Convert to array and sort by points
    return Array.from(referrerMap.values())
      .map(data => ({
        address: data.address,
        points: data.points,
        referrals: data.uniqueUsers.size
      }))
      .sort((a, b) => b.points - a.points);
  }, [allEventsData, EVENT_POINTS]);

  // Format for airdrop export
  const formatForAirdrop = () => {
    // Format: address,amount
    const csvContent = leaderboardData
      .map(item => `${item.address},${item.points}`)
      .join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'referral_points_airdrop.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Use constant reference to settings
  const {
    showStats = true
  } = useMemo(() => sectionRef.current?.config || {}, [sectionRef.current?.config]);

  if (loading || loadingReferralEvents || loadingAllEvents) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Truncate address for display
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {sectionRef.current?.title || <FormattedMessage id="referral.program" defaultMessage="Referral Program" />}
        </Typography>
        {sectionRef.current?.subtitle && (
          <Typography variant="subtitle1" color="text.secondary">
            {sectionRef.current.subtitle}
          </Typography>
        )}
      </Box>

      <Card>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label={<FormattedMessage id="your.referral" defaultMessage="Your Referral" />}
            icon={<LinkIcon />}
            iconPosition="start"
          />
          <Tab
            label={<FormattedMessage id="leaderboard" defaultMessage="Leaderboard" />}
            icon={<EmojiEventsIcon />}
            iconPosition="start"
          />
        </Tabs>

        <CardContent>
          {tabValue === 0 && (
            <>
              {!isActive ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1" gutterBottom>
                    <FormattedMessage
                      id="connect.wallet.to.access.referral"
                      defaultMessage="Connect your wallet to access your referral link"
                    />
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      <FormattedMessage id="your.referral.link" defaultMessage="Your Referral Link" />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <FormattedMessage
                        id="share.referral.link.description"
                        defaultMessage="Share this link with others to earn rewards when they use it"
                      />
                    </Typography>
                    <TextField
                      fullWidth
                      value={referralLink}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="copy referral link"
                              onClick={handleCopy}
                              edge="end"
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mt: 1 }}
                    />
                  </Box>

                  {showStats && (
                    <>
                      <Divider sx={{ my: 3 }} />

                      <Box>
                        <Typography variant="h6" gutterBottom>
                          <FormattedMessage id="referral.stats" defaultMessage="Referral Statistics" />
                        </Typography>

                        <Grid container spacing={3} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={4}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: theme.palette.background.default }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <PeopleIcon color="primary" fontSize="large" />
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    <FormattedMessage id="unique.users" defaultMessage="Unique Users" />
                                  </Typography>
                                  <Typography variant="h5">
                                    {referralStats.uniqueUsers}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Paper>
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: theme.palette.background.default }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <MoneyIcon color="primary" fontSize="large" />
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    <FormattedMessage id="total.events" defaultMessage="Total Events" />
                                  </Typography>
                                  <Typography variant="h5">
                                    {referralStats.totalReferrals}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Paper>
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: theme.palette.background.default }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <EmojiEventsIcon color="primary" fontSize="large" />
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    <FormattedMessage id="total.points" defaultMessage="Total Points" />
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
              )}
            </>
          )}

          {tabValue === 1 && (
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  <FormattedMessage id="referral.leaderboard" defaultMessage="Referral Leaderboard" />
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={formatForAirdrop}
                >
                  <FormattedMessage id="export.for.airdrop" defaultMessage="Export for Airdrop" />
                </Button>
              </Stack>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><FormattedMessage id="rank" defaultMessage="Rank" /></TableCell>
                      <TableCell><FormattedMessage id="address" defaultMessage="Address" /></TableCell>
                      <TableCell align="right"><FormattedMessage id="referrals" defaultMessage="Referrals" /></TableCell>
                      <TableCell align="right"><FormattedMessage id="points" defaultMessage="Points" /></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboardData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <TableRow key={row.address}>
                          <TableCell component="th" scope="row">
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell>{truncateAddress(row.address)}</TableCell>
                          <TableCell align="right">{row.referrals}</TableCell>
                          <TableCell align="right">{row.points}</TableCell>
                        </TableRow>
                      ))}
                    {leaderboardData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <FormattedMessage id="no.data.available" defaultMessage="No data available" />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={leaderboardData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>

              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage
                    id="leaderboard.points.explanation"
                    defaultMessage="Points are earned when users connect their wallets (1 point) or make swaps (5 points). Each user can earn points once per day for each action."
                  />
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          <FormattedMessage id="referral.link.copied" defaultMessage="Referral link copied to clipboard!" />
        </Alert>
      </Snackbar>
    </Container>
  );
} 