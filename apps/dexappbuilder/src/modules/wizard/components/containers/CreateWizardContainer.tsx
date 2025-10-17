import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';

import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Close from '@mui/icons-material/Close';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { NextSeo } from 'next-seo';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';
import theDefaultConfig from '../../../../../config/wizard.default.app.json';

import { IS_STAGING } from '../../../../constants';
import { useConnectWalletDialog } from '../../../../hooks/app';

import {
  useSendConfigMutation,
  useTemplateWhitelabelConfigQuery,
} from '../../../../hooks/whitelabel';
import { getTheme } from '../../../../theme';

import { ConnectButton } from '@dexkit/ui/components/ConnectButton';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import ThemePreview from '../ThemePreview';
/* import { WelcomeMessage } from '../WelcomeMessage'; */
import { PagePreviewPaper } from '../sections/PagePreviewPaper';
const SignConfigDialog = dynamic(() => import('../dialogs/SignConfigDialog'));

const defaultConfig = theDefaultConfig as AppConfig;

interface Props {
  slug?: string;
  isSwapWizard?: boolean;
}

interface CreateMarketplace {
  name: string;
  email: string;
}

const FormSchema: Yup.SchemaOf<CreateMarketplace> = Yup.object().shape({
  email: Yup.string().email().required(),
  name: Yup.string().required(),
});

export function CreateWizardContainer({ slug, isSwapWizard }: Props) {
  const { formatMessage } = useIntl();
  const { isActive } = useWeb3React();
  const connectWalletDialog = useConnectWalletDialog();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const clonedConfigQuery = useTemplateWhitelabelConfigQuery({ slug });

  const sendConfigMutation = useSendConfigMutation({});

  const [selectedThemeId, setSelectedThemeId] = useState<string>();

  const currentPage = useMemo(() => {
    if (!clonedConfigQuery.data?.isTemplate) {
      return defaultConfig.pages['home'];
    }
    if (
      clonedConfigQuery.data &&
      clonedConfigQuery.data.config &&
      clonedConfigQuery.data?.isTemplate
    ) {
      const clonedConfig = JSON.parse(
        clonedConfigQuery.data.config,
      ) as AppConfig;
      if (clonedConfig.pages['home']) {
        return clonedConfig.pages['home'];
      } else {
        return defaultConfig.pages['home'];
      }
    }

    if (
      clonedConfigQuery.data &&
      clonedConfigQuery.data.config &&
      clonedConfigQuery.data.nft
    ) {
      return defaultConfig.pages['home'];
    }

    if (clonedConfigQuery.data && clonedConfigQuery.data.config) {
      const clonedConfig = JSON.parse(
        clonedConfigQuery.data.config,
      ) as AppConfig;
      if (clonedConfig.pages['home']) {
        return clonedConfig.pages['home'];
      } else {
        return defaultConfig.pages['home'];
      }
    }
    return defaultConfig.pages['home'];
  }, [clonedConfigQuery.data]);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [showSendingConfig, setShowSendingConfig] = useState(false);

  const [showConfirmSendConfig, setShowConfirmSendConfig] = useState(false);

  // Pages forms
  const handleCloseConfirmSendConfig = () => {
    setShowConfirmSendConfig(false);
  };

  const handleConfirmSendConfig = async () => {
    setShowConfirmSendConfig(false);
    setShowSendingConfig(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleShowPreview = () => {
    setIsPreviewOpen(true);
  };

  const handleCloseSendingConfig = () => {
    setShowSendingConfig(false);
    sendConfigMutation.reset();
  };

  const selectedTheme = useMemo(() => {
    if (selectedThemeId !== undefined) {
      if (selectedThemeId === 'custom') {
        return getTheme({ name: 'custom' }).theme;
      }

      return getTheme({ name: selectedThemeId }).theme;
    }
  }, [selectedThemeId]);

  const renderThemePreview = () => {
    if (selectedTheme) {
      return <ThemePreview selectedTheme={selectedTheme} />;
    }
  };

  return (
    <>
      <Drawer open={isPreviewOpen} onClose={handleClosePreview}>
        <Box
          sx={(theme) => ({ minWidth: `${theme.breakpoints.values.sm / 2}px` })}
        >
          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontWeight: 600 }} variant="subtitle1">
                <FormattedMessage
                  id="theme.preview"
                  defaultMessage="Theme Preview"
                />
              </Typography>
              <IconButton onClick={handleClosePreview}>
                <Close />
              </IconButton>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>{renderThemePreview()}</Box>
        </Box>
      </Drawer>

      <NextSeo
        title={formatMessage({
          id: 'crypto.app.setup',
          defaultMessage: 'Crypto App Setup',
        })}
      />
      <AppConfirmDialog
        DialogProps={{
          open: showConfirmSendConfig,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseConfirmSendConfig,
        }}
        onConfirm={handleConfirmSendConfig}
      >
        <Stack>
          <Typography variant="h5" align="center">
            <FormattedMessage
              id="send.settings"
              defaultMessage="Send settings"
            />
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            <FormattedMessage
              id="do.you.really.want.to.send.this.app.settings"
              defaultMessage="Do you really want to send it?"
            />
          </Typography>
        </Stack>
      </AppConfirmDialog>
      <SignConfigDialog
        dialogProps={{
          open: showSendingConfig,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseSendingConfig,
        }}
        isLoading={sendConfigMutation.isLoading}
        isSuccess={sendConfigMutation.isSuccess}
        error={sendConfigMutation.error}
        data={sendConfigMutation.data}
      />
      <Container maxWidth={'xl'}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="admin" defaultMessage="Admin" />
                    ),
                    uri: '/admin',
                  },
                  {
                    caption: isSwapWizard ? (
                      <FormattedMessage
                        id="swap.apps"
                        defaultMessage="Swap apps"
                      />
                    ) : (
                      <FormattedMessage
                        id="manage.apps"
                        defaultMessage="Manage Apps"
                      />
                    ),
                    uri: '/admin',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="create.app.uppercased"
                        defaultMessage="Create App"
                      />
                    ),
                    uri: isSwapWizard ? '/admin/create-swap' : '/admin/create',
                    active: true,
                  },
                ]}
              />
              {isMobile && (
                <Button
                  onClick={handleShowPreview}
                  size="small"
                  variant="outlined"
                >
                  <FormattedMessage id="preview" defaultMessage="Preview" />
                </Button>
              )}
            </Stack>
          </Grid>
          {/* <Grid size={12}>
            <WelcomeMessage />
          </Grid> */}
          <Grid size={12}>
            {/* <Typography variant="body2">
              <FormattedMessage
                id="start.for.free"
                defaultMessage="Start for free"
              />
            </Typography>*/}
            <Typography variant="h5">
              <FormattedMessage
                id="create.your.app"
                defaultMessage="Create your App"
              />
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Stack spacing={2}>
              <Formik
                validationSchema={FormSchema}
                onSubmit={(values, { setSubmitting }) => {
                  let clonedConfig = {};
                  if (
                    clonedConfigQuery.data &&
                    !clonedConfigQuery.data.nft &&
                    clonedConfigQuery.data?.isTemplate
                  ) {
                    clonedConfig = JSON.parse(clonedConfigQuery.data.config);
                  }
                  const submitConfig = {
                    ...defaultConfig,
                    ...clonedConfig,
                    ...values,

                  };
                  setShowSendingConfig(true);
                  sendConfigMutation.mutateAsync({
                    config: submitConfig,
                    email: values.email,
                  });
                  setSubmitting(false);
                }}
                enableReinitialize={true}
                initialValues={{
                  name: '',
                  email: '',
                  domain: '',
                }}
              >
                {({ isValid }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <Field
                          component={TextField}
                          fullWidth
                          name="name"
                          label={
                            <FormattedMessage
                              id="name.of.your.app"
                              defaultMessage="Name of your app"
                            />
                          }
                          helperText={
                            <FormattedMessage
                              id="app.name.domain.hint.updated"
                              defaultMessage="Enter your app name (domain will be yourname.dexkit.app)"
                            />
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                .dexkit.app
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={12}>
                        <Field
                          component={TextField}
                          fullWidth
                          name="email"
                          label={
                            <FormattedMessage
                              id="email.to.receive.notifications"
                              defaultMessage="Email to receive notifications"
                            />
                          }
                        />
                      </Grid>

                      <Grid size={12}>
                        <Stack
                          spacing={1}
                          direction="row"
                          justifyContent="flex-start"
                        >
                          {isActive ? (
                            <Button
                              disabled={!isValid}
                              type="submit"
                              variant="contained"
                              color="primary"
                            >
                              <FormattedMessage
                                id="create.app"
                                defaultMessage="Create App"
                              />
                            </Button>
                          ) : (
                            <ConnectButton
                              variant="outlined"
                              color="inherit"
                              endIcon={<ChevronRightIcon />}
                            />
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Stack>
          </Grid>
          {!isMobile && (
            <Grid size={{ xs: 12, sm: 8 }}>
              <ThemeProvider theme={selectedTheme || createTheme({ cssVariables: true })}>
                <Container>
                  <Stack spacing={2}>
                    {clonedConfigQuery?.data?.nft && (
                      <Typography variant="subtitle1">
                        <FormattedMessage
                          id="this.app.is.not.clonable"
                          defaultMessage="This app is not clonable."
                        />
                      </Typography>
                    )}

                    {slug && !clonedConfigQuery?.data?.nft && (
                      <Typography variant="subtitle1">
                        <FormattedMessage
                          id="you.are.cloning"
                          defaultMessage="You are cloning site: <b>{site}</b>. Check it live <a>here</a> "
                          values={{
                            site: slug,
                            //@ts-ignore
                            b: (chunks) => <b>{chunks}</b>,
                            //@ts-ignore
                            a: (chunks: any): ReactNode => (
                              <a
                                className="external_link"
                                target="_blank"
                                href={
                                  IS_STAGING
                                    ? `https://${slug}.dev.dexkit.app`
                                    : `https://${slug}.dexkit.app`
                                }
                                rel="noreferrer"
                              >
                                {chunks}
                              </a>
                            ),
                          }}
                        />
                      </Typography>
                    )}
                    <PagePreviewPaper
                      sections={currentPage.sections}
                      name={currentPage.title || 'Home'}
                      hideButtons={currentPage?.key !== 'home'}
                    />
                  </Stack>
                </Container>
              </ThemeProvider>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
