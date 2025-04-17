import { useCallback, useState } from 'react';

import { truncateAddress } from '@/modules/common/utils';
import { ipfsUriToUrl } from '@/modules/common/utils/ipfs';
import { strPad } from '@/modules/common/utils/strings';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Person from '@mui/icons-material/Person';
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  Grid,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { GameProfile } from '../types';

interface RankingButtonProps {
  address: string;
  position: number;
  profile?: GameProfile;
  src?: string;
  count?: number;
  joinsCount?: number;
  winsCount?: number;
  firstCount?: number;
  secondCount?: number;
  thirdCount?: number;
  totalEarned?: number;
  EarnedMinusSpent?: number;
  label: string;
  featured?: boolean;
  coinSymbol: string;
}

export default function RankingListItem({
  address,
  position,
  profile,
  src,
  count,
  joinsCount,
  winsCount,
  firstCount,
  secondCount,
  thirdCount,
  totalEarned,
  EarnedMinusSpent,
  label,
  featured,
  coinSymbol,
}: RankingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return (
    <>
      <ListItemButton onClick={handleToggle}>
        <Box sx={{ pr: 2 }}>{strPad(position)}°</Box>
        <ListItemAvatar>
          <Avatar
            src={
              profile?.profileImage
                ? ipfsUriToUrl(profile?.profileImage)
                : undefined
            }
          >
            <Person />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={profile ? profile.username : truncateAddress(address)}
        />
        <Box
          display="flex"
          alignItems="center"
          alignContent="center"
          justifyContent="center"
        >
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </ListItemButton>
      <Collapse in={isOpen}>
        <Divider />
        <Box p={2} display="flex">
          <Grid container spacing={4}>
            <Grid item>
              <Typography variant="caption" color="textSecondary" gutterBottom>
                <FormattedMessage id="wins" defaultMessage="Wins" />
              </Typography>
              <Typography variant="subtitle1">{winsCount}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="textSecondary" gutterBottom>
                <FormattedMessage
                  id="coinLeague.firstPlace"
                  defaultMessage="First Place"
                />
              </Typography>
              <Typography variant="subtitle1">{firstCount}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="textSecondary" gutterBottom>
                <FormattedMessage
                  id="coinLeague.secondPlace"
                  defaultMessage="Second Place"
                />
              </Typography>
              <Typography variant="subtitle1">{secondCount}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="textSecondary" gutterBottom>
                <FormattedMessage
                  id="coinLeague.thirdPlace"
                  defaultMessage="Third Place"
                />
              </Typography>
              <Typography variant="subtitle1">{thirdCount}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="textSecondary" gutterBottom>
                <FormattedMessage
                  id="coinLeague.joins"
                  defaultMessage="Joins"
                />
              </Typography>
              <Typography variant="subtitle1">{joinsCount}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="textSecondary" gutterBottom>
                <FormattedMessage
                  id="coinLeague.winsAndJoins"
                  defaultMessage="Wins/Joins"
                />
              </Typography>
              <Typography variant="subtitle1">
                {joinsCount
                  ? `${Number(((winsCount || 0) / joinsCount) * 100).toFixed(
                      2
                    )}%`
                  : '0%'}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="textSecondary" gutterBottom>
                <FormattedMessage
                  id="coinLeague.totalEarned"
                  defaultMessage="Total Earned"
                />
              </Typography>
              <Typography variant="subtitle1">
                {totalEarned} {coinSymbol}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" color="textSecondary">
                <FormattedMessage
                  id="coinLeague.profit"
                  defaultMessage="Profit"
                />
              </Typography>
              <Typography variant="subtitle1">
                {EarnedMinusSpent} {coinSymbol}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </>
  );
}
