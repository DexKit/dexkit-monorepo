import { Box, Stack } from '@mui/material';
import { SupportedColorScheme } from '@mui/material/styles';

import {
  GatedCondition,
  GatedPageLayout,
} from '@dexkit/ui/modules/wizard/types';
import {
  AppPage,
  AppPageOptions,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
import { useState } from 'react';
import { PageSectionKey } from '../../hooks/sections';
import AddPageDialog from '../dialogs/AddPageDialog';
import GatedConditionsFormDialog from '../dialogs/GatedConditionsFormDialog';
import Pages from './Pages';

interface Props {
  pages: { [key: string]: AppPage };
  onEditPage: (pageOptions: AppPageOptions) => void;
  onRemove: (page: string, index: number) => void;
  onClone: (page: string, index: number) => void;
  onEdit: (page: string, index: number) => void;
  onAdd: (page: string, custom?: boolean) => void;
  onClonePage: (page: string) => void;
  onHideDesktop: (page: string, index: number) => void;
  onHideMobile: (page: string, index: number) => void;
  onEditTitle: (page: string, title: string) => void;
  onSwap: (page: string, index: number, other: number) => void;
  onChangeName: (page: string, index: number, name: string) => void;
  onUpdateGatedConditions: (
    page: string,
    conditions?: GatedCondition[],
    layout?: GatedPageLayout,
    enableGatedConditions?: boolean,
  ) => void;
  onAddPage: (page: AppPage) => void;
  onRemovePage: (page: string) => void;
  theme?: {
    cssVarPrefix?: string | undefined;
    colorSchemes: Record<SupportedColorScheme, Record<string, any>>;
  };
  previewUrl?: string;
  activeSection?: PageSectionKey;
  site?: string;
  onUpdatePageLayout: (page: string, layout: PageSectionsLayout) => void;
}

export default function PagesSectionPage({
  onRemove,
  onEdit,
  onClone,
  onClonePage,
  onUpdateGatedConditions,
  onAddPage,
  onUpdatePageLayout,
  onSwap,
  onEditPage,
  onRemovePage,
  onAdd,
  onHideDesktop,
  onEditTitle,
  onHideMobile,
  onChangeName,
  pages,
  activeSection,
  site,
  previewUrl,
}: Props) {
  const [showAddPage, setShowAddPage] = useState(false);

  const handleAddPage = () => {
    setShowAddPage(true);
  };

  const handleCloseAddPage = () => {
    setShowAddPage(false);
  };

  const [showGatedModalForm, setShowGatedModalForm] = useState(false);

  const [page, setPage] = useState<string>();

  const handleCloseGatedModalForm = () => {
    setShowGatedModalForm(false);
    setPage(undefined);
  };

  const handleSubmitGatedConditions = (
    conditions: GatedCondition[],
    layout: GatedPageLayout,
    enableGatedConditions?: boolean,
  ) => {
    if (page) {
      onEditPage({
        clonedPageKey: pages[page].clonedPageKey,
        enableGatedConditions: enableGatedConditions,
        gatedConditions: conditions,
        gatedPageLayout: layout,
        isEditGatedConditions: true,
        key: page,
        title: pages[page].title,
        uri: pages[page].uri,
      });
    }

    setShowGatedModalForm(true);
    setPage(undefined);
  };

  const handleAction = (action: string, page: string, index: number) => {
    switch (action) {
      case 'remove':
        onRemove(page, index);
        break;
      case 'clone':
        onClone(page, index);
        break;
      case 'edit':
        onEdit(page, index);
        break;
      case 'hide.desktop':
        onHideDesktop(page, index);
        break;
      case 'hide.mobile':
        onHideMobile(page, index);
        break;
      case 'change.name':
        break;
      default:
        break;
    }
  };

  return (
    <>
      <AddPageDialog
        dialogProps={{
          open: showAddPage,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseAddPage,
        }}
        onCancel={handleCloseAddPage}
        onSubmit={(opt) => onAddPage(opt as AppPage)}
      />
      <GatedConditionsFormDialog
        dialogProps={{
          open: showGatedModalForm,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleCloseGatedModalForm,
        }}
        conditions={page ? pages[page]?.gatedConditions : undefined}
        gatedPageLayout={page ? pages[page]?.gatedPageLayout : undefined}
        onCancel={handleCloseGatedModalForm}
        onSubmit={handleSubmitGatedConditions}
      />

      <Stack spacing={2}>
        <Box px={8} pt={2}>
          <Pages
            pages={pages}
            onSwap={onSwap}
            onAction={handleAction}
            onChangeName={onChangeName}
            onAdd={onAdd}
            onClonePage={onClonePage}
            onAddPage={handleAddPage}
            activeSection={activeSection}
            onEditTitle={onEditTitle}
            onRemovePage={onRemovePage}
            onUpdateGatedConditions={onUpdateGatedConditions}
            site={site}
            previewUrl={previewUrl}
            onUpdatePageLayout={onUpdatePageLayout}
          />
        </Box>
      </Stack>
    </>
  );
}
