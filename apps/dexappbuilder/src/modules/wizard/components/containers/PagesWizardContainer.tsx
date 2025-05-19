import { AppConfig, AppPage } from '@dexkit/ui/modules/wizard/types/config';
import {
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
  createTheme,
  responsiveFontSizes,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useContext, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getTheme } from '../../../../theme';
import { BuilderKit } from '../../constants';
import { PagesContainer } from '../PagesContainer';

import { AppConfirmDialog } from '@dexkit/ui';
import dynamic from 'next/dynamic';
import { PagesContext } from './EditWizardContainer';

const ApiKeyIntegrationDialog = dynamic(
  () => import('../dialogs/ApiKeyIntegrationDialog'),
);

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  hasChanges?: boolean;
  builderKit?: BuilderKit;
  onHasChanges: (hasChanges: boolean) => void;
  siteSlug?: string;
  previewUrl?: string;
}

export default function PagesWizardContainer({
  config,
  siteSlug,
  onSave,
  builderKit,
  hasChanges,
  onHasChanges,
  onChange,
  previewUrl,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [pages, setPages] = useState<{ [key: string]: AppPage }>(
    structuredClone(config.pages),
  );

  const [hasPageChanges, setHasPageChanges] = useState(false);
  const [hasSectionChanges, setHasSectionChanges] = useState(false);

  const [showAddPage, setShowAddPage] = useState(false);

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

    setHasPageChanges(false);
    setHasSectionChanges(false);
  };

  const { handleCancelEdit, setSelectedKey, selectedKey, oldPage } =
    useContext(PagesContext);

  const handleCancel = () => {
    setOpenHasChangesConfirm(true);
  };

  const handleSetPages = useCallback(
    (cb: (prev: { [key: string]: AppPage }) => { [key: string]: AppPage }) => {
      setPages((value) => {
        let res = cb(value);

        onChange({
          ...config,
          pages: { ...(res as { [key: string]: AppPage }) },
        });

        onHasChanges(true);

        return res;
      });
    },
    [onHasChanges, onChange],
  );

  const [openHasChangesConfirm, setOpenHasChangesConfirm] = useState(false);

  const handleChangePages = () => {
    setHasPageChanges(true);
  };

  const handleChangeSection = () => {
    setHasSectionChanges(true);
  };

  return (
    <>
      <AppConfirmDialog
        DialogProps={{
          open: openHasChangesConfirm,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: () => setOpenHasChangesConfirm(false),
        }}
        onConfirm={() => {
          if (selectedKey && oldPage) {
            setPages((pages) => {
              const newPages = { ...pages };

              return {
                ...newPages,
                [selectedKey]: oldPage,
              };
            });
            setHasSectionChanges(false);
          } else {
            setPages(structuredClone(config.pages));
            setHasPageChanges(false);
          }

          setOpenHasChangesConfirm(false);
          setSelectedKey(undefined);

          handleCancelEdit(false);
        }}
        title={
          <FormattedMessage
            id="discard.changes"
            defaultMessage="Discard Changes"
          />
        }
        actionCaption={
          <FormattedMessage id="discard" defaultMessage="Discard" />
        }
      >
        <Stack>
          <Typography variant="body1">
            <FormattedMessage
              id="are.you.sure.you.want.to.discard.your.changes?"
              defaultMessage="Are you sure you want to discard your changes?"
            />
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <FormattedMessage
              id="if.you.discard.now.your.changes.will.be.lost."
              defaultMessage="If you discard now, your changes will be lost."
            />
          </Typography>
        </Stack>
      </AppConfirmDialog>
      <Grid container spacing={isMobile ? 1.5 : 3} sx={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
        <Grid item xs={12}>
          <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                fontSize: isMobile ? '1.15rem' : '1.5rem',
                fontWeight: 600,
                mb: 0.5
              }}
            >
              <FormattedMessage id="pages" defaultMessage="Pages" />
            </Typography>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color="text.secondary"
              sx={{
                fontSize: isMobile ? '0.85rem' : 'inherit',
              }}
            >
              <FormattedMessage
                id="pages.wizard.description"
                defaultMessage="Create and manage your app pages"
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <PagesContainer
            builderKit={builderKit}
            pages={pages}
            setPages={handleSetPages}
            onChangePages={handleChangePages}
            onChangeSections={handleChangeSection}
            theme={selectedTheme}
            showAddPage={showAddPage}
            setShowAddPage={setShowAddPage}
            previewUrl={previewUrl}
            site={siteSlug?.toString()}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1} direction="row" justifyContent="flex-end" sx={{ pr: theme.spacing(2) }}>
            <Button
              onClick={handleCancel}
              disabled={!hasSectionChanges && !hasPageChanges}
              size={isMobile ? "small" : "medium"}
              sx={{
                fontSize: isMobile ? "0.875rem" : undefined,
                py: isMobile ? 0.75 : undefined,
                px: isMobile ? 2 : undefined,
              }}
            >
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!hasSectionChanges && !hasPageChanges}
              size={isMobile ? "small" : "medium"}
              sx={{
                fontSize: isMobile ? "0.875rem" : undefined,
                py: isMobile ? 0.75 : undefined,
                px: isMobile ? 2 : undefined,
              }}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
