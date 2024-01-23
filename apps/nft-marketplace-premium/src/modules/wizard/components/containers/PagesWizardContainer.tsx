import {
  Alert,
  Box,
  Button,
  createTheme,
  Divider,
  Grid,
  responsiveFontSizes,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getTheme } from '../../../../theme';
import { AppConfig, AppPage } from '../../../../types/config';
import { BuilderKit } from '../../constants';
import { PagesContainer } from '../PagesContainer';

import AddIcon from '@mui/icons-material/Add';
import dynamic from 'next/dynamic';
import { useGetApiKeyQuery } from '../../hooks/integrations';

const ApiKeyIntegrationDialog = dynamic(
  () => import('../dialogs/ApiKeyIntegrationDialog'),
);

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  builderKit?: BuilderKit;
  onHasChanges: (hasChanges: boolean) => void;
  siteId?: number;
}

export default function PagesWizardContainer({
  config,
  siteId,
  onSave,
  builderKit,
  onHasChanges,
}: Props) {
  const [currentPage, setCurrentPage] = useState<AppPage>(config.pages['home']);
  const [pages, setPages] = useState<{ [key: string]: AppPage }>(config.pages);
  const [showAddPage, setShowAddPage] = useState(false);
  useEffect(() => {
    if (config && !currentPage) {
      setCurrentPage(currentPage);
    }
    if (config && !pages) {
      setPages(config.pages);
    }
  }, [config]);

  const pagesChanged = useMemo(() => {
    if (config.pages !== pages) {
      return true;
    } else {
      return false;
    }
  }, [config.pages, pages]);

  useMemo(() => {
    if (onHasChanges) {
      onHasChanges(pagesChanged);
    }
  }, [onHasChanges, pagesChanged]);

  const selectedTheme = useMemo(() => {
    if (config.theme !== undefined) {
      if (config.theme === 'custom' && config.customTheme) {
        return responsiveFontSizes(createTheme(JSON.parse(config.customTheme)));
      }

      return responsiveFontSizes(getTheme({ name: config.theme }).theme);
    }
  }, [config.customTheme, config.theme]);

  const handleSave = () => {
    const newConfig = { ...config, pages };
    onSave(newConfig);
  };

  const handleShowAddPage = () => {
    setShowAddPage(true);
  };

  const hasSwap = useMemo(() => {
    return Object.keys(pages)
      .map((key) => pages[key])
      .some((page) => page.sections.some((section) => section.type === 'swap'));
  }, [JSON.stringify(pages)]);

  const { data } = useGetApiKeyQuery({ type: 'zrx', siteId });

  const [showSetApiKey, setShowSetApiKey] = useState(false);

  const handleCloseApiKey = () => {
    setShowSetApiKey(false);
  };

  const handleSetZrxApiKey = () => {
    setShowSetApiKey(true);
  };

  return (
    <>
      {showSetApiKey && (
        <ApiKeyIntegrationDialog
          DialogProps={{
            open: showSetApiKey,
            onClose: handleCloseApiKey,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          siteId={siteId}
        />
      )}
      <Grid container spacing={2}>
        {!data?.value && hasSwap && (
          <Grid item xs={12}>
            <Alert
              severity="info"
              action={
                <Button
                  onClick={handleSetZrxApiKey}
                  variant="outlined"
                  size="small"
                >
                  <FormattedMessage
                    id="set.api.key"
                    defaultMessage="Set api Key"
                  />
                </Button>
              }
            >
              <FormattedMessage
                id="configure.0x.text"
                defaultMessage="Ensure a smooth experience by configuring your 0x API key for access to our swap and exchange services."
              />
            </Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <Stack direction={'column'}>
            <Typography variant={'h6'}>
              <FormattedMessage id="pages" defaultMessage="Pages" />
            </Typography>

            <Typography variant={'body2'}>
              <FormattedMessage
                id="pages.wizard.description"
                defaultMessage="Create and manage your app's pages"
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ pt: 2, pb: 2 }}>
            <Button
              variant="contained"
              onClick={handleShowAddPage}
              size="small"
              startIcon={<AddIcon />}
            >
              <FormattedMessage id="New.page" defaultMessage="New page" />
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {currentPage && pages && (
            <PagesContainer
              builderKit={builderKit}
              pages={pages}
              currentPage={currentPage}
              setPages={setPages}
              setCurrentPage={setCurrentPage}
              theme={selectedTheme}
              showAddPage={showAddPage}
              setShowAddPage={setShowAddPage}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!pagesChanged}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </>
  );
}
