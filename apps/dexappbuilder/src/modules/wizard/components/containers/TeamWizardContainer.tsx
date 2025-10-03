import GroupsIcon from '@mui/icons-material/Groups';
import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import InfoDialog from '@dexkit/ui/components/dialogs/InfoDialog';
import { SiteResponse } from '@dexkit/ui/modules/wizard/types/config';
import AddMemberFormDialog from '../dialogs/AddMemberFormDialog';
import { PermissionsAccordionForm } from '../forms/PermissionsAccordionForm';

const MobileButton = styled(Button)(({ theme }) => ({
  width: '100%',
  borderRadius: '6px',
  minHeight: '42px',
  fontSize: '0.85rem',
}));

interface Props {
  site?: SiteResponse | null;
}

export default function TeamWizardContainer({ site }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openInfo, setOpenInfo] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);
  const [titleInfo, setTitleInfo] = useState('');
  const [contentInfo, setContentInfo] = useState('');

  const handleCloseInfo = () => {
    setOpenInfo(false);
    setTitleInfo('');
    setContentInfo('');
  };

  return (
    <>
      <InfoDialog
        dialogProps={{
          open: openInfo,
          onClose: handleCloseInfo,
        }}
        title={titleInfo}
        content={contentInfo}
      />
      <AddMemberFormDialog
        dialogProps={{
          open: openAddMember,
          fullWidth: true,
          maxWidth: 'sm',
          onClose: () => {
            setOpenAddMember(false);
          },
        }}
        siteId={site?.id}
      />
      <Grid container spacing={isMobile ? 1.5 : 3}>
        <Grid size={12}>
          <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                fontSize: isMobile ? '1.15rem' : '1.5rem',
                fontWeight: 600,
                mb: 0.5
              }}
            >
              <FormattedMessage id="team" defaultMessage="Team" />
            </Typography>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color="text.secondary"
              sx={{
                fontSize: isMobile ? '0.85rem' : 'inherit',
              }}
            >
              <FormattedMessage
                id="add.accounts.and.manage.their.permissions"
                defaultMessage="Add accounts and manage their permissions"
              />
            </Typography>
          </Stack>
        </Grid>

        <Grid size={12}>
          <Divider />
        </Grid>

        <Grid size={12}>
          {isMobile ? (
            <MobileButton
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                setOpenAddMember(true);
              }}
              sx={{ mt: theme.spacing(0.5) }}
            >
              <FormattedMessage id={'add.member'} defaultMessage={'ADD MEMBER'} />
            </MobileButton>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                setOpenAddMember(true);
              }}
            >
              <FormattedMessage id={'add.member'} defaultMessage={'Add member'} />
            </Button>
          )}
        </Grid>
        <Grid size={12}>
          {site?.permissions && site.permissions.length > 0 ? (
            <Box sx={{ overflowX: isMobile ? 'hidden' : 'visible', width: '100%' }}>
              <PermissionsAccordionForm
                memberPermissions={site?.permissions}
                siteId={site?.id}
              />
            </Box>
          ) : (
            <Stack
              spacing={isMobile ? 1 : 2}
              justifyContent={'center'}
              alignContent={'center'}
              alignItems={'center'}
              sx={{
                py: isMobile ? theme.spacing(3) : theme.spacing(4),
                textAlign: 'center'
              }}
            >
              <GroupsIcon
                sx={{
                  fontSize: isMobile ? '40px' : '50px',
                  color: theme.palette.text.secondary
                }}
              />
              <Typography
                variant={isMobile ? 'subtitle1' : 'h6'}
                sx={{
                  fontWeight: 600,
                  fontSize: isMobile ? '1.1rem' : '1.25rem'
                }}
              >
                <FormattedMessage
                  id={'no.team.members'}
                  defaultMessage={'No team members'}
                />
              </Typography>
              <Typography
                variant={isMobile ? 'body2' : 'subtitle1'}
                sx={{
                  fontSize: isMobile ? '0.85rem' : 'inherit',
                  maxWidth: isMobile ? '80%' : 'inherit',
                  color: theme.palette.text.secondary
                }}
              >
                <FormattedMessage
                  id={'add.team.members.to.read.and.do.updates'}
                  defaultMessage={'Add team members to update your app'}
                />
              </Typography>
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
}
