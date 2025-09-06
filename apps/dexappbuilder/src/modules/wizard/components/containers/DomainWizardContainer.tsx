import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  QUERY_ADMIN_WHITELABEL_CONFIG_NAME,
  useSetupDomainConfigMutation,
  useVerifyDomainMutation,
} from '../../../../hooks/whitelabel';

import { CopyText } from '@dexkit/ui/components/CopyText';

import { beautifyUnderscoreCase } from '@dexkit/core/utils';
import InfoDialog from '@dexkit/ui/components/dialogs/InfoDialog';
import { CUSTOM_DOMAINS_AND_SIGNATURE_FEAT } from '@dexkit/ui/constants/featPayments';
import { useActiveFeatUsage } from '@dexkit/ui/hooks/payments';
import {
  AppConfig,
  SiteResponse,
} from '@dexkit/ui/modules/wizard/types/config';
import { useQueryClient } from '@tanstack/react-query';
import {
  default as CheckDomainDialog,
  default as DeployDomainDialog,
} from '../dialogs/CheckDomainDialog';
import { PremiumAppBuilder } from '../PremiumAppBuilder';
import DomainSection, { DomainSectionForm } from '../sections/DomainSection';
interface Props {
  config: AppConfig;
  site?: SiteResponse | null;
  onSave: (config: AppConfig) => void;
  onHasChanges: (changes: boolean) => void;
}

export default function DomainWizardContainer({
  config,
  onSave,
  site,
  onHasChanges,
}: Props) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [openInfo, setOpenInfo] = useState(false);
  const [titleInfo, setTitleInfo] = useState('');
  const [contentInfo, setContentInfo] = useState('');

  const { formatMessage } = useIntl();
  const [isDeployConfirmOpen, setIsDeployConfirmOpen] = useState(false);
  const [isDeploySignOpen, setIsDeploySignOpen] = useState(false);
  const [isCheckDeployOpen, setIsCheckDeployOpen] = useState(false);
  const [domainData, setDomainData] = useState<DomainSectionForm>();
  const verifyDomainMutation = useVerifyDomainMutation();
  const deployDomainMutation = useSetupDomainConfigMutation();

  const activeFeatUsageQuery = useActiveFeatUsage({
    slug: CUSTOM_DOMAINS_AND_SIGNATURE_FEAT,
  });

  const isPaid = activeFeatUsageQuery.data
    ? activeFeatUsageQuery?.data?.active
    : undefined;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmitGeneral = (form: DomainSectionForm) => {
    setDomainData(form);
    if (form) {
      const newConfig = {
        ...config,
        domain: form.domain,
      };
      onSave(newConfig);
    }
  };
  useEffect(() => {
    if (config.domain) {
      setDomainData({
        domain: config.domain,
      });
    }
  }, [config]);

  const verifyDomainData = useMemo(() => {
    if (site?.verifyDomainRawData) {
      try {
        return JSON.parse(site?.verifyDomainRawData);
      } catch {
        return undefined;
      }
    }
  }, [site?.verifyDomainRawData]);

  const handleConfirmDeploy = () => {
    if (site && site.domain) {
      deployDomainMutation.mutate(
        {
          domain: site.domain,
        },
        {
          onSuccess: () => {
            setIsDeploySignOpen(false);
            queryClient.invalidateQueries({ queryKey: [QUERY_ADMIN_WHITELABEL_CONFIG_NAME] });
          },
          onError: console.log,
        },
      );
    }
    setIsDeploySignOpen(true);
    setIsDeployConfirmOpen(false);
  };

  const handleDeploy = () => {
    setIsDeployConfirmOpen(true);
  };

  const handleDeployCheckSuccess = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Marketplace domain added',
        id: 'marketplace.domain.added',
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

  const handleDeployCheckError = (error: any) => {
    enqueueSnackbar(
      `${formatMessage({
        defaultMessage: 'Domain still not propagated',
        id: 'domain.error.propagated',
      })}: ${String(error)}`,
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  const handleCheckDeploy = () => {
    if (site) {
      setIsCheckDeployOpen(true);
      verifyDomainMutation.mutate(
        { domain: site.domain },
        {
          onError: handleDeployCheckError,
          onSuccess: handleDeployCheckSuccess,
        },
      );
    }
  };

  const handleCloseDeployDomain = () => {
    setIsDeploySignOpen(false);
  };
  const handleCloseCheckDeploy = () => {
    setIsCheckDeployOpen(false);
  };

  const handleClose = () => {
    setIsDeployConfirmOpen(false);
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
    setTitleInfo('');
    setContentInfo('');
  };

  const handleOpenCNAMEINfoDialog = useCallback(() => {
    setOpenInfo(true);
    setTitleInfo(
      formatMessage({
        id: 'info.wizard.title.domain.records.setup',
        defaultMessage: 'Domain records setup info',
      }),
    );
    setContentInfo(
      formatMessage({
        id: 'info.wizard.content.cname',
        defaultMessage: `Deploy your domain. First, ensure that your domain is not used with other records. After the domain has been successfully added to our system, you will receive a CNAME and A record to be added to your DNS provider. Once you have added the CNAME and A record, click the "Check Deploy Status" button. If the status shows as "VERIFIED" wait for the domain to propagate, and your app will be set on your custom domain. If you are on a subdomain, replace "@" with the subdomain value. If you encounter any issues, please contact our support channels.`,
      }),
    );
  }, []);

  const domainStatusText = useMemo(() => {
    if (site?.domainStatus === 'NOT_VERIFIED') {
      return (
        <FormattedMessage id="not.verified" defaultMessage="Not verified" />
      );
    }

    if (site?.domainStatus === 'VERIFIED') {
      return <FormattedMessage id="verified" defaultMessage="Verified" />;
    }
    return <FormattedMessage id="not.deployed" defaultMessage="Not deployed" />;
  }, [site?.domainStatus]);

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
      <AppConfirmDialog
        DialogProps={{
          open: isDeployConfirmOpen,
          onClose: handleClose,
        }}
        onConfirm={handleConfirmDeploy}
      >
        <FormattedMessage
          id="do.you.really.want.to.deploy.this.domain"
          defaultMessage="Do you really want to deploy this domain: {domain}"
          values={{ domain: config?.domain || '' }}
        />
      </AppConfirmDialog>
      <DeployDomainDialog
        dialogProps={{
          open: isDeploySignOpen,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseDeployDomain,
        }}
        isLoading={deployDomainMutation.isPending}
        isSuccess={deployDomainMutation.isSuccess}
        error={deployDomainMutation.error}
      />
      <CheckDomainDialog
        dialogProps={{
          open: isCheckDeployOpen,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseCheckDeploy,
        }}
        isLoading={verifyDomainMutation.isPending}
        isSuccess={verifyDomainMutation.isSuccess}
        error={verifyDomainMutation.error}
      />
      <Grid
        container
        spacing={isMobile ? 1.5 : 3}
        sx={{ px: isMobile ? 1 : 0, pt: isMobile ? 1 : 0 }}
      >
        <Grid item xs={12}>
          <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                fontWeight: 600,
                fontSize: isMobile ? '1.15rem' : '1.5rem',
                mb: 0.5,
              }}
            >
              <FormattedMessage id="domain" defaultMessage="Domain" />
            </Typography>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color="text.secondary"
              sx={{
                fontSize: isMobile ? '0.85rem' : 'inherit',
              }}
            >
              <FormattedMessage
                id="set.custom.domain.container.description"
                defaultMessage="Set a custom domain for your app. This is a premium feature"
              />
            </Typography>
          </Stack>
        </Grid>
        {config.domain && (
          <>
            {' '}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack
                direction={'row'}
                spacing={1}
                justifyContent={'space-between'}
              >
                <Stack direction={'row'} spacing={1}>
                  <Typography>
                    <FormattedMessage id="status" defaultMessage="Status" />:{' '}
                  </Typography>
                  <Typography>{domainStatusText} </Typography>
                </Stack>
                <Stack direction={'row'} spacing={1}>
                  {!site?.cname && site && (
                    <Button variant="contained" onClick={() => handleDeploy()}>
                      <FormattedMessage id="deploy" defaultMessage="Deploy" />
                    </Button>
                  )}
                  {site?.cname && site.domainStatus !== 'VERIFIED' && (
                    <Button variant="contained" onClick={handleCheckDeploy}>
                      <FormattedMessage
                        id="check.deploy.status"
                        defaultMessage="Check deploy Status"
                      />
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Grid>
          </>
        )}

        {site?.cname && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack
                spacing={1}
                direction={'row'}
                alignContent={'center'}
                alignItems={'center'}
              >
                <Typography>
                  <FormattedMessage
                    id="domain.records"
                    defaultMessage="Domain records"
                  />
                </Typography>
                <IconButton
                  aria-label="name info"
                  edge="end"
                  onClick={handleOpenCNAMEINfoDialog}
                >
                  <InfoIcon />
                </IconButton>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction={'column'} spacing={1}>
                <Typography>
                  <FormattedMessage id="cname" defaultMessage="CNAME" />
                  {': '}
                </Typography>
                <Stack direction={'row'} spacing={1}>
                  <Typography>
                    {' '}
                    <FormattedMessage id="name" defaultMessage="name" />:
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {site?.domain.split('.').length > 2
                      ? site?.domain.split('.')[0]
                      : '@'}
                  </Typography>
                  <Typography>
                    <FormattedMessage id="value" defaultMessage="Value" />:
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {'cname.vercel-dns.com'}{' '}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack direction={'column'} spacing={1}>
                <Typography>
                  <FormattedMessage id="a.record" defaultMessage="A Record" />
                  {': '}
                </Typography>
                <Stack direction={'row'} spacing={1}>
                  <Typography>
                    {' '}
                    <FormattedMessage id="name" defaultMessage="name" />:
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {site?.domain.split('.').length > 2
                      ? site?.domain.split('.')[0]
                      : '@'}
                  </Typography>
                  <Typography>
                    <FormattedMessage id="value" defaultMessage="Value" />:
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {'76.76.21.21'}{' '}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            {verifyDomainData &&
              verifyDomainData?.verified === false &&
              verifyDomainData?.verification && (
                <Grid item xs={12}>
                  {verifyDomainData?.verification.map(
                    (ver: any, key: number) => (
                      <Stack
                        direction={'column'}
                        spacing={1}
                        key={`verification-list-${key}`}
                      >
                        <Typography>
                          <FormattedMessage
                            id="record"
                            defaultMessage="Record"
                          />
                          : {ver.type}
                        </Typography>
                        <Stack direction={'row'} spacing={1}>
                          <Typography>
                            {' '}
                            <FormattedMessage id="name" defaultMessage="name" />
                            :
                          </Typography>
                          <Typography sx={{ fontWeight: 'bold' }}>
                            {ver?.domain}
                          </Typography>
                          <Box display={'flex'}>
                            <Typography sx={{ pr: 1 }}>
                              <FormattedMessage
                                id="value"
                                defaultMessage="Value"
                              />
                              :
                            </Typography>

                            <Typography sx={{ fontWeight: 'bold' }}>
                              {ver.value}{' '}
                            </Typography>
                            <CopyText text={ver.value} />
                          </Box>
                          <Typography>
                            <FormattedMessage
                              id="status"
                              defaultMessage="Status"
                            />
                            :
                          </Typography>
                          <Typography sx={{ fontWeight: 'bold' }}>
                            {beautifyUnderscoreCase(ver.reason)}{' '}
                          </Typography>
                        </Stack>
                      </Stack>
                    ),
                  )}
                </Grid>
              )}
          </>
        )}
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <PremiumAppBuilder />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <DomainSection
            onHasChanges={onHasChanges}
            initialValues={domainData}
            onSubmit={handleSubmitGeneral}
            disableForm={!isPaid}
          />
        </Grid>
      </Grid>
    </>
  );
}
