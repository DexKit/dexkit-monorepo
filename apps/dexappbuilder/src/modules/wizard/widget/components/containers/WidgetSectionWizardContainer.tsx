import {
  AppPage,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
import {
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
  createTheme,
  responsiveFontSizes,
} from '@mui/material';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { useContext, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import EditPageSectionsLayoutDialog from '@/modules/wizard/components/dialogs/EditPageSectionsLayoutDialog';
import PageEditorDialog from '@/modules/wizard/components/dialogs/PageEditorDialog';
import PreviewPageDialog from '@/modules/wizard/components/dialogs/PreviewPageDialog';
import EditSectionDialog from '@/modules/wizard/components/section-config/dialogs/EditSectionDialog';
import PageSections from '@/modules/wizard/components/section-config/PageSections';
import { BuilderKit } from '@/modules/wizard/constants';
import { AppConfirmDialog } from '@dexkit/ui';
import {
  AppPageSection,
  CustomEditorSection,
} from '@dexkit/ui/modules/wizard/types/section';
import { WidgetConfig } from '@dexkit/ui/modules/wizard/types/widget';
import { getTheme } from 'src/theme';
import EmbedWidgetDialog from '../dialogs/EmbedWidgetDialog';
import { PagesContext } from './EditWidgetWizardContainer';

interface Props {
  config: WidgetConfig;
  onSave: (config: WidgetConfig) => void;
  onChange: (config: WidgetConfig) => void;
  hasChanges?: boolean;
  builderKit?: BuilderKit;
  onHasChanges: (hasChanges: boolean) => void;
  siteSlug?: string;
  id?: number;
  previewUrl?: string;
}

export default function WidgetSectionWizardContainer({
  id,
  config,
  siteSlug,
  onSave,
  builderKit,
  hasChanges,
  onHasChanges,
  onChange,
  previewUrl,
}: Props) {
  const [page, setPage] = useState<AppPage>(config.page);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEmbed, setIsOpenEmbed] = useState(false);
  const [isOpenEditor, setIsOpenEditor] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showLayoutEdit, setShowLayoutEdit] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [activeSection, setActiveSection] = useState<{
    index: number;
    page: string;
  }>();

  const [hasPageChanges, setHasPageChanges] = useState(false);
  const [hasSectionChanges, setHasSectionChanges] = useState(false);

  const [showAddPage, setShowAddPage] = useState(false);

  const selectedTheme = useMemo(() => {
    if (config.theme !== undefined) {
      if (config.theme === 'custom' && config.customThemeDark) {
        return responsiveFontSizes(
          createTheme(JSON.parse(config.customThemeDark)),
        );
      }

      if (config.theme === 'custom' && config.customThemeLight) {
        return responsiveFontSizes(
          createTheme(JSON.parse(config.customThemeLight)),
        );
      }

      return responsiveFontSizes(getTheme({ name: config.theme }).theme);
    }
  }, [config.theme, config.customThemeDark, config.customThemeLight]);

  const handleSave = () => {
    const newConfig = { ...config, page: page };

    onSave(newConfig);

    setHasPageChanges(false);
    setHasSectionChanges(false);
  };

  const handleSaveSection = (section: AppPageSection, index: number) => {
    if (index === -1) {
      page.sections.push(section);
    } else {
      page.sections[index] = section;
    }
    setPage({ ...page });
    setHasSectionChanges(true);
    setHasPageChanges(true);
  };

  const { handleCancelEdit, setSelectedKey, selectedKey, oldPage } =
    useContext(PagesContext);

  const handleCancel = () => {
    setOpenHasChangesConfirm(true);
  };

  const onAddSection = () => {
    setSelectedSectionIndex(-1);
    setIsOpen(true);
  };

  const onAddCustomSection = () => {
    setSelectedSectionIndex(-1);
    setIsOpenEditor(true);
  };

  const section = useMemo(() => {
    if (selectedSectionIndex === -1) {
      return;
    } else {
      return page.sections[selectedSectionIndex];
    }
  }, [page, selectedSectionIndex]);

  const onAction = (action: string, index: number) => {
    switch (action) {
      case 'edit':
        setSelectedSectionIndex(index);
        setIsEdit(true);
        const sec = page.sections[index];
        if (sec.type === 'custom') {
          setIsOpenEditor(true);
        } else {
          setIsOpen(true);
        }
        break;
      case 'remove':
        page.sections.splice(index, 1);
        setPage({ ...page });
        break;

      case 'hide.mobile':
        page.sections[index].hideMobile = !page.sections[index].hideMobile;
        setPage({ ...page });
        break;

      case 'hide.desktop':
        page.sections[index].hideDesktop = !page.sections[index].hideDesktop;
        setPage({ ...page });
        break;

      case 'clone':
        const sectionToClone = { ...page.sections[index] };
        if (sectionToClone.name) {
          sectionToClone.name = `Clone of ${sectionToClone.name}`;
        }
        page.sections.splice(index + 1, 0, sectionToClone);
        setPage({ ...page });

        break;

      default:
        break;
    }
    setHasSectionChanges(true);
    setHasPageChanges(true);
  };

  const onSwapSection = (index: number, otherIndex: number) => {
    const swapSection = { ...page.sections[index] };
    const otherSection = { ...page.sections[otherIndex] };
    page.sections[otherIndex] = swapSection;
    page.sections[index] = otherSection;
    setPage({ ...page });
    setHasSectionChanges(true);
    setHasPageChanges(true);
  };

  const [openHasChangesConfirm, setOpenHasChangesConfirm] = useState(false);

  const handleChangePages = () => {
    setHasPageChanges(true);
  };

  const handleChangeSection = () => {
    setHasSectionChanges(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsEdit(false);
  };

  const handleCloseEditor = () => {
    setIsOpenEditor(false);
    setIsEdit(false);
  };

  const handleSaveName = (name: string) => {
    if (selectedSectionIndex !== -1) {
      page.sections[selectedSectionIndex].name = name;
      setPage({ ...page });
      setHasSectionChanges(true);
    }
  };

  const handleCloseLayout = () => {
    setShowLayoutEdit(false);
  };

  const handleCloseEmbedWidget = () => {
    setIsOpenEmbed(false);
  };

  const handleEditLayout = () => {
    setShowLayoutEdit(true);
  };
  const onEmbed = () => {
    setIsOpenEmbed(true);
  };

  const handleConfirmEditLayout = (layout: PageSectionsLayout) => {
    page.layout = layout;
    setPage({ ...page });
    setHasSectionChanges(true);
  };

  const renderPageLayoutDialog = () => {
    if (showLayoutEdit) {
      return (
        <EditPageSectionsLayoutDialog
          DialogProps={{
            open: showLayoutEdit,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleCloseLayout,
          }}
          layout={selectedKey ? page?.layout : undefined}
          onConfirm={handleConfirmEditLayout}
        />
      );
    }
  };

  const renderEmbedWidgetDialog = () => {
    if (isOpenEmbed) {
      return (
        <EmbedWidgetDialog
          dialogProps={{
            open: isOpenEmbed,
            maxWidth: 'md',
            fullWidth: true,
            onClose: handleCloseEmbedWidget,
          }}
          widgetId={id}
          onCancel={handleCloseEmbedWidget}
        />
      );
    }
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const renderPreviewDialog = () => {
    if (showPreview && selectedKey) {
      return (
        <CssVarsProvider theme={selectedTheme}>
          <PreviewPageDialog
            dialogProps={{
              open: showPreview,
              maxWidth: 'xl',
              fullWidth: true,
              onClose: handleClosePreview,
            }}
            disabled={true}
            sections={page?.sections}
            name={page?.title}
            page={selectedKey}
            site={''}
            layout={page?.layout}
          />
        </CssVarsProvider>
      );
    }
  };

  return (
    <>
      {renderPreviewDialog()}
      {renderPageLayoutDialog()}
      {renderEmbedWidgetDialog()}
      {isOpen && (
        <EditSectionDialog
          dialogProps={{
            open: isOpen,
            fullScreen: true,
            fullWidth: true,
            onClose: handleClose,
          }}
          builderKit={builderKit}
          isEdit={isEdit}
          section={section}
          onSave={handleSaveSection}
          onSaveName={handleSaveName}
          index={selectedSectionIndex}
        />
      )}
      {isOpenEditor && (
        <PageEditorDialog
          dialogProps={{
            open: isOpenEditor,
            fullScreen: true,
            onClose: handleCloseEditor,
          }}
          section={section as CustomEditorSection}
          index={selectedSectionIndex}
          onSave={handleSaveSection}
        />
      )}
      <AppConfirmDialog
        DialogProps={{
          open: openHasChangesConfirm,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: () => setOpenHasChangesConfirm(false),
        }}
        onConfirm={() => {
          if (selectedKey && oldPage) {
            setHasSectionChanges(false);
          } else {
            // setPages(structuredClone(config.pages));
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
        <Grid size={12}>
          <Stack direction="column">
            <Typography fontWeight="bold" variant="h6">
              <FormattedMessage id="Components" defaultMessage="Components" />
            </Typography>

            <Typography variant="body2">
              <FormattedMessage
                id="components.wizard.description"
                defaultMessage="Create and manage your widget components"
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid size={12}>
          <PageSections
            onEmbed={onEmbed}
            onAddSection={onAddSection}
            onAddCustomSection={onAddCustomSection}
            onEditTitle={() => {}}
            pageKey={selectedKey}
            page={page}
            onSwap={onSwapSection}
            onAction={onAction}
            onClose={() => {}}
            onAdd={() => {}}
            hideEmbedMenu={true}
            onPreview={handleShowPreview}
            activeSection={activeSection}
            onClone={() => {}}
            onChangeName={() => {}}
            onEditLayout={handleEditLayout}
          />
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid size={12}>
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
