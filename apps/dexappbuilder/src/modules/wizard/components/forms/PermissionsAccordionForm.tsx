import { SiteAction } from '@dexkit/core/constants/permissions';
import { beautifyCamelCase, truncateAddress } from '@dexkit/core/utils';
import { AppConfirmDialog } from '@dexkit/ui/components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled, useMediaQuery, useTheme } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel } from 'formik-mui';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { BooleanSchema, boolean, object } from 'yup';
import {
  useAddPermissionMemberMutation,
  useDeleteMemberMutation,
} from '../../hooks';
import SendAddMemberDialog from '../dialogs/SendAddMemberDialog';

interface Props {
  siteId?: number;
  memberPermissions?: {
    accountId: string;
    permissions?: {
      [key: string]: boolean;
    };
  }[];
}

const MobileButton = styled(Button)(({ theme }) => ({
  fontSize: '0.85rem',
  padding: theme.spacing(0.75, 1.5),
}));

function initPerms({ defaultValue }: { defaultValue: boolean }) {
  const perms: { [key: string]: boolean } = {};
  // we initially only add member
  for (const action of Object.values(SiteAction)) {
    perms[`${action}`] = defaultValue;
  }
  return perms;
}

function buildPermissionSchema() {
  let permissions: {
    [key: string]: BooleanSchema<boolean | undefined, any, boolean | undefined>;
  } = {};
  for (const action of Object.values(SiteAction)) {
    permissions[`${action}`] = boolean();
  }

  let permissionSchema = object(permissions);

  return permissionSchema;
}

const PermissionsSchema = buildPermissionSchema();

export function PermissionsAccordionForm({ memberPermissions, siteId }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState('');
  const [openConfirmRemove, setOpenConfirmRemove] = useState(false);
  const mutationAddMember = useAddPermissionMemberMutation();
  const deleteMember = useDeleteMemberMutation();
  const { formatMessage } = useIntl();

  const handleMemberRemoved = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Member removed',
        id: 'member.removed',
      }),
      {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  const handleMemberRemovedError = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Error on removing member',
        id: 'error.removing.member',
      }),
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  return (
    <div>
      {openConfirmRemove && (
        <AppConfirmDialog
          DialogProps={{
            open: openConfirmRemove,
            onClose: () => {
              setOpenConfirmRemove(false);
            },
          }}
          onConfirm={() => {
            setOpenConfirmRemove(false);
            deleteMember.mutate(
              { siteId, account: memberToRemove },
              {
                onSuccess: handleMemberRemoved,
                onError: handleMemberRemovedError,
              },
            );

            setMemberToRemove('');
          }}
        >
          <FormattedMessage
            id="do.you.really.want.to.remove.this.member"
            defaultMessage="Do you really want to remove this member {member}"
            values={{ member: truncateAddress(memberToRemove) }}
          />
        </AppConfirmDialog>
      )}
      {open && (
        <SendAddMemberDialog
          dialogProps={{
            open: open,
            onClose: () => {
              setOpen(false);
              mutationAddMember.reset();
            },
          }}
          isLoading={mutationAddMember.isLoading}
          isSuccess={mutationAddMember.isSuccess}
          error={mutationAddMember.error}
          isEdit={true}
        />
      )}

      {memberPermissions?.map((member, key) => (
        <Accordion key={key}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              sx={{
                fontSize: isMobile ? '0.85rem' : 'inherit',
                wordBreak: 'break-word'
              }}
            >
              <FormattedMessage id={'member'} defaultMessage={'Member'} />{' '}
              {truncateAddress(member.accountId)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Formik
              initialValues={
                member?.permissions
                  ? member.permissions
                  : initPerms({ defaultValue: false })
              }
              validationSchema={PermissionsSchema}
              onSubmit={(value, helper) => {
                setOpen(true);
                mutationAddMember.mutateAsync({
                  siteId,
                  account: member.accountId,
                  permissions: JSON.stringify({ ...value }),
                });
                helper.setSubmitting(false);
              }}
            >
              {({ submitForm, resetForm, setValues }) => (
                <Form>
                  <Box
                    display={'flex'}
                    flexDirection={isMobile ? 'column' : 'row'}
                    justifyContent={'space-between'}
                    sx={{ pb: 2, gap: isMobile ? theme.spacing(1) : 0 }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={(ev) => {
                            if (ev.target.checked) {
                              setValues(initPerms({ defaultValue: true }));
                            } else {
                              setValues(initPerms({ defaultValue: false }));
                            }
                          }}
                          defaultChecked={
                            member.permissions &&
                            Object.values(member.permissions).every(
                              (v) => v === true,
                            )
                          }
                          size={isMobile ? "small" : "medium"}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: isMobile ? '0.85rem' : 'inherit' }}>
                          Toggle all
                        </Typography>
                      }
                    />
                    {isMobile ? (
                      <MobileButton
                        variant="contained"
                        color={'error'}
                        size="small"
                        fullWidth
                        onClick={() => {
                          setOpenConfirmRemove(true);
                          setMemberToRemove(member.accountId);
                        }}
                      >
                        <FormattedMessage
                          id={'remove.member'}
                          defaultMessage={'Remove member'}
                        />
                      </MobileButton>
                    ) : (
                      <Button
                        variant="contained"
                        color={'error'}
                        onClick={() => {
                          setOpenConfirmRemove(true);
                          setMemberToRemove(member.accountId);
                        }}
                      >
                        <FormattedMessage
                          id={'remove.member'}
                          defaultMessage={'Remove member'}
                        />
                      </Button>
                    )}
                  </Box>

                  <Grid container spacing={isMobile ? 1 : 2}>
                    {Object.values(SiteAction).map((action, key) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Field
                          component={CheckboxWithLabel}
                          type="checkbox"
                          name={action}
                          Label={{
                            label: (
                              <Typography sx={{ fontSize: isMobile ? '0.85rem' : 'inherit' }}>
                                {beautifyCamelCase(action)}
                              </Typography>
                            )
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  <Grid item xs={12} sx={{ mt: isMobile ? theme.spacing(1) : theme.spacing(2) }}>
                    <Stack
                      spacing={1}
                      direction={isMobile ? "column" : "row"}
                      justifyContent={isMobile ? "stretch" : "flex-end"}
                    >
                      {isMobile ? (
                        <>
                          <MobileButton
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={submitForm}
                          >
                            <FormattedMessage id="save" defaultMessage="Save" />
                          </MobileButton>
                          <MobileButton
                            variant="outlined"
                            color="primary"
                            fullWidth
                            onClick={() => {
                              resetForm();
                            }}
                          >
                            <FormattedMessage id="cancel" defaultMessage="Cancel" />
                          </MobileButton>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={submitForm}
                          >
                            <FormattedMessage id="save" defaultMessage="Save" />
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              resetForm();
                            }}
                          >
                            <FormattedMessage id="cancel" defaultMessage="cancel" />
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Grid>
                </Form>
              )}
            </Formik>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
