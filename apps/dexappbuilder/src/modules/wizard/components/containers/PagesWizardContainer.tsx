import { AppConfig, AppPage } from '@dexkit/ui/modules/wizard/types/config';
import {
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
  createTheme,
  responsiveFontSizes,
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="column">
            <Typography fontWeight="bold" variant="h6">
              <FormattedMessage id="pages" defaultMessage="Pages" />
            </Typography>

            <Typography variant="body2">
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
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <Button
              onClick={handleCancel}
              disabled={!hasSectionChanges && !hasPageChanges}
            >
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!hasSectionChanges && !hasPageChanges}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
