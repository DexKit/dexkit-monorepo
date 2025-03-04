import GroupsIcon from '@mui/icons-material/Groups';
import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SiteResponse } from '../../../../types/whitelabel';
import AddMemberFormDialog from '../dialogs/AddMemberFormDialog';
import InfoDialog from '../dialogs/InfoDialog';
import { PermissionsAccordionForm } from '../forms/PermissionsAccordionForm';
interface Props {
  site?: SiteResponse | null;
}

export default function TeamWizardContainer({ site }: Props) {
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

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant={'h6'}>
              <FormattedMessage id="team" defaultMessage="Team" />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="add.accounts.and.manage.their.permissions"
                defaultMessage="Add accounts and manage their permissions"
              />
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => {
              setOpenAddMember(true);
            }}
          >
            <FormattedMessage id={'add.member'} defaultMessage={'Add member'} />
          </Button>
        </Grid>
        <Grid item xs={12}>
          {site?.permissions && site.permissions.length > 0 ? (
            <PermissionsAccordionForm
              memberPermissions={site?.permissions}
              siteId={site?.id}
            />
          ) : (
            <Stack
              spacing={1}
              justifyContent={'center'}
              alignContent={'center'}
              alignItems={'center'}
            >
              <GroupsIcon sx={{ fontSize: '50px' }} />
              <Typography variant="h6">
                <FormattedMessage
                  id={'no.team.members'}
                  defaultMessage={'No team members'}
                />
              </Typography>
              <Typography variant="subtitle1">
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
